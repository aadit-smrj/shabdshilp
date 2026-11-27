import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { GradeLevel } from '../types';
import {
  loginWithGoogle,
  logoutFirebase,
  getUserDataFirestore,
  saveUserDataFirestore,
  isQuotaExceededError,
  setServerSessionToken,
} from '../utils/firebase';

export interface AuthUserSession {
  uid?: string;
  email: string;
  userName: string;
  grade: GradeLevel;
  section?: string;
  role?: string;
  isTeacher?: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: AuthUserSession) => void;
  defaultEmail?: string;
}

export const isAllowedShabdshilpEmail = (emailStr?: string | null): boolean => {
  const lower = (emailStr || '').trim().toLowerCase();
  return /^[^\s@]+@shabdshilp\.com$/.test(lower);
};

export const checkIsTeacherEmail = (emailStr: string): boolean => {
  const lower = (emailStr || '').trim().toLowerCase();
  return (
    lower.includes('.1') ||
    lower.includes('_1') ||
    lower.startsWith('kiran') ||
    lower.includes('teacher') ||
    lower.includes('shikshak')
  );
};

export type TeacherHonorific = 'sir' | 'madam';

export const formatTeacherNameWithHonorific = (
  baseName: string,
  honorific: TeacherHonorific
): string => {
  const cleaned = (baseName || '')
    .replace(/\s+(मैम|सर|Madam|Sir)$/gi, '')
    .trim();
  const suffix = honorific === 'sir' ? 'सर' : 'मैम';
  if (!cleaned) {
    return honorific === 'sir' ? 'शिक्षक सर' : 'किरण मैम';
  }
  return `${cleaned} ${suffix}`;
};

export const detectHonorificFromName = (name?: string | null): TeacherHonorific | null => {
  const trimmed = (name || '').trim();
  if (/(?:\s+|^)(सर|Sir)$/i.test(trimmed)) return 'sir';
  if (/(?:\s+|^)(मैम|Madam)$/i.test(trimmed)) return 'madam';
  return null;
};

export const extractNameFromEmail = (emailStr: string, isTeacherAccount: boolean): string => {
  const localPart = (emailStr || '').trim().split('@')[0] || '';
  if (!localPart) return '';

  const rawTokens = localPart
    .split(/[._-]+/)
    .map((t) => t.replace(/\d+$/g, '').trim())
    .filter((t) => t.length > 0);

  if (isTeacherAccount) {
    const teacherTokens = rawTokens.filter(
      (t) => !['teacher', 'shikshak'].includes(t.toLowerCase())
    );
    if (teacherTokens.length > 0) {
      return teacherTokens
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(' ');
    }
    return 'किरण';
  }

  if (rawTokens.length > 0) {
    return rawTokens
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(' ');
  }

  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState<string>(defaultEmail);
  const [password, setPassword] = useState<string>('');
  const [customName, setCustomName] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState<boolean>(false);
  const [teacherHonorific, setTeacherHonorific] = useState<TeacherHonorific>('madam');
  const [honorificTouched, setHonorificTouched] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('कक्षा 8');
  const [gradeTouched, setGradeTouched] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('सेक्शन A');
  const [sectionTouched, setSectionTouched] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const isTeacher = checkIsTeacherEmail(email);
  const derivedName = extractNameFromEmail(email, isTeacher);
  const displayedName = customName !== null ? customName : derivedName;
  const typedHonorific = detectHonorificFromName(displayedName);
  const activeHonorific: TeacherHonorific = typedHonorific && !honorificTouched
    ? typedHonorific
    : teacherHonorific;

  const handleSelectHonorific = (h: TeacherHonorific) => {
    setTeacherHonorific(h);
    setHonorificTouched(true);
    if (customName !== null) {
      const stripped = customName.replace(/\s+(मैम|सर|Madam|Sir)$/gi, '').trim();
      setCustomName(stripped);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('कृपया अपनी @shabdshilp.com ईमेल आईडी दर्ज करें (Please enter a valid @shabdshilp.com ID).');
      return;
    }

    if (!isAllowedShabdshilpEmail(cleanEmail)) {
      setErrorMessage(
        'केवल @shabdshilp.com ईमेल आईडी से ही लॉगिन की अनुमति है! @gmail.com या किसी अन्य डोमेन से लॉगिन नहीं हो सकता।'
      );
      return;
    }

    if (!password) {
      setErrorMessage('कृपया पासवर्ड दर्ज करें (Please enter password).');
      return;
    }

    const manualName = customName !== null ? customName.trim() : '';
    const autoName = extractNameFromEmail(cleanEmail, isTeacher);
    const baseUserName = manualName || autoName || (isTeacher ? 'किरण' : cleanEmail.split('@')[0]);
    const requestedUserName = isTeacher
      ? formatTeacherNameWithHonorific(baseUserName, activeHonorific)
      : baseUserName;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/shabdshilp-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          userName: requestedUserName,
          grade: selectedGrade,
          section: selectedSection,
          nameTouched,
          gradeTouched,
          sectionTouched,
          honorific: activeHonorific,
          honorificTouched,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.token || !data?.user) {
        setErrorMessage(
          data?.error || 'गलत पासवर्ड अथवा लॉगिन सत्यापन विफल रहा (Invalid credentials).'
        );
        return;
      }

      setServerSessionToken(cleanEmail, data.token);

      if (isTeacher) {
        const resolvedHonorific = detectHonorificFromName(data.user.userName) || activeHonorific;
        try {
          localStorage.setItem(`shabdshilp_teacher_honorific_${cleanEmail}`, resolvedHonorific);
        } catch (_err) {}
      }

      onLoginSuccess({
        email: cleanEmail,
        userName: data.user.userName || requestedUserName,
        grade: (data.user.grade as GradeLevel) || selectedGrade,
        section: data.user.section || selectedSection,
        role: data.user.role || (isTeacher ? 'teacher' : 'student'),
        isTeacher: Boolean(data.user.isTeacher ?? isTeacher),
      });
    } catch (_err) {
      setErrorMessage('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setIsLoading(true);
      const user = await loginWithGoogle();
      if (user && user.email) {
        const cleanEmail = user.email.trim().toLowerCase();
        if (!isAllowedShabdshilpEmail(cleanEmail)) {
          await logoutFirebase();
          setErrorMessage(
            `अमान्य ईमेल डोमेन (${cleanEmail})! केवल @shabdshilp.com आईडी से ही लॉगिन हो सकता है — @gmail.com या अन्य डोमेन अमान्य हैं।`
          );
          return;
        }
        const isT = checkIsTeacherEmail(cleanEmail);

        let existingProfile: any = null;
        try {
          existingProfile = await getUserDataFirestore(user.uid);
        } catch (err) {
          if (isQuotaExceededError(err)) {
            setErrorMessage('दैनिक डेटाबेस सीमा पूर्ण हो गई है (Quota exceeded)। कृपया कल पुनः प्रयास करें।');
            return;
          }
        }

        const googleDisplayName = (user.displayName || '').trim();
        const manualName = customName !== null ? customName.trim() : '';
        const autoName = googleDisplayName || extractNameFromEmail(cleanEmail, isT) || cleanEmail.split('@')[0];
        const existingName = existingProfile?.userName ? String(existingProfile.userName).trim() : '';
        let finalName = manualName || existingName || autoName;

        if (isT) {
          const existingHonorific = detectHonorificFromName(finalName);
          if (honorificTouched) {
            finalName = formatTeacherNameWithHonorific(finalName, activeHonorific);
          } else if (!existingHonorific) {
            let savedHonorific: TeacherHonorific = activeHonorific;
            try {
              const stored = localStorage.getItem(`shabdshilp_teacher_honorific_${cleanEmail}`);
              if (stored === 'sir' || stored === 'madam') savedHonorific = stored;
            } catch (err) {}
            finalName = formatTeacherNameWithHonorific(finalName, savedHonorific);
          }
          const resolvedHonorific = detectHonorificFromName(finalName) || activeHonorific;
          try {
            localStorage.setItem(`shabdshilp_teacher_honorific_${cleanEmail}`, resolvedHonorific);
          } catch (err) {}
        }

        const finalGrade: GradeLevel = (existingProfile?.grade as GradeLevel) || selectedGrade;
        const finalSection: string = existingProfile?.section ? String(existingProfile.section) : selectedSection;

        await saveUserDataFirestore(user.uid, {
          email: cleanEmail,
          userName: finalName,
          grade: finalGrade,
          section: finalSection,
          role: isT ? 'teacher' : 'student',
          isTeacher: isT
        });

        onLoginSuccess({
          uid: user.uid,
          email: cleanEmail,
          userName: finalName,
          grade: finalGrade,
          section: finalSection,
          role: isT ? 'teacher' : 'student',
          isTeacher: isT
        });
      }
    } catch (error: any) {
      const code = error?.code || '';
      if (isQuotaExceededError(error)) {
        setErrorMessage('दैनिक डेटाबेस सीमा पूर्ण हो गई है (Quota exceeded)। यह सीमा कल रीसेट होगी।');
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMessage('Google साइन-इन विंडो बंद कर दी गई। कृपया पुनः प्रयास करें।');
      } else if (code === 'auth/popup-blocked') {
        setErrorMessage('ब्राउज़र ने पॉप-अप अवरुद्ध कर दिया है। कृपया पॉप-अप की अनुमति दें।');
      } else {
        setErrorMessage('Firebase Google साइन-इन विफल रहा। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200/90 shadow-2xl shadow-indigo-950/20 overflow-hidden">
        {/* Modern Indigo-Violet Gradient Header Banner */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 text-white p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5">
            <img
              src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
              alt="TechPreneur Logo"
              className="w-20 h-20 rounded-2xl bg-white p-0.5 object-contain shadow-md shrink-0"
            />
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-16 h-16 rounded-2xl object-cover object-center shadow-md border border-white/25 bg-[#091124] shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                <span>सुरक्षित प्रवेश • Secure Authentication</span>
              </div>
              <h2 className="text-2xl font-black font-serif-display tracking-tight text-white mt-1">
                शब्दशिल्प (ShabdShilp)
              </h2>
            </div>
          </div>
          <p className="text-xs text-indigo-100/90 mt-2.5 leading-relaxed">
            Google Sign-in अथवा ईमेल और पासवर्ड से अपने व्याकरण पोर्टल में प्रवेश करें।
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-medium flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl shadow-xs border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google से साइन-इन करें (One-Click Google Sign-in)</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              या ईमेल से प्रवेश करें
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>ईमेल आईडी (Email ID):</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="उदाहरण: student@shabdshilp.com"
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium transition-all outline-hidden"
            />
            <p className="text-[10px] text-slate-500 font-medium pl-1">
              केवल <span className="font-bold text-indigo-700">@shabdshilp.com</span> आईडी मान्य है (@gmail.com या अन्य आईडी स्वीकार नहीं की जाएंगी)।
            </p>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>पासवर्ड (Password):</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें (Enter password)"
                className="w-full text-xs p-3 pr-10 rounded-2xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium transition-all outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Student/Teacher Name & Grade or Sir/Madam Selector */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isTeacher ? 'शिक्षक का नाम (Name):' : 'नाम (Name):'}</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={displayedName}
                    onChange={(e) => {
                      setCustomName(e.target.value);
                      setNameTouched(true);
                    }}
                    placeholder={derivedName || 'अपना नाम लिखें'}
                    className="w-full text-xs p-2.5 pr-14 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-bold transition-all outline-hidden"
                  />
                  {customName !== null ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomName(null);
                        setNameTouched(false);
                      }}
                      title="ईमेल ID से नाम स्वतः प्राप्त करें (Reset to Auto)"
                      className="absolute right-1.5 text-[10px] px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors"
                    >
                      ↻ Auto
                    </button>
                  ) : (
                    derivedName && (
                      <span
                        title="ईमेल ID से स्वतः प्राप्त नाम (Auto-derived from email)"
                        className="absolute right-1.5 text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold pointer-events-none"
                      >
                        Auto
                      </span>
                    )
                  )}
                </div>
              </div>

              {isTeacher ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>उपाधि (Sir / Madam):</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectHonorific('sir')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        activeHonorific === 'sir'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                      }`}
                    >
                      <span>👨‍🏫</span>
                      <span>सर (Sir)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectHonorific('madam')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        activeHonorific === 'madam'
                          ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-600/20'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-violet-50 hover:border-violet-300'
                      }`}
                    >
                      <span>👩‍🏫</span>
                      <span>मैम (Madam)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">कक्षा (Grade):</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => {
                        setSelectedGrade(e.target.value as GradeLevel);
                        setGradeTouched(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 text-slate-900 font-bold cursor-pointer transition-all outline-hidden"
                    >
                      <option value="कक्षा 5">कक्षा 5</option>
                      <option value="कक्षा 6">कक्षा 6</option>
                      <option value="कक्षा 7">कक्षा 7</option>
                      <option value="कक्षा 8">कक्षा 8</option>
                      <option value="कक्षा 9">कक्षा 9</option>
                      <option value="कक्षा 10">कक्षा 10</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">सेक्शन:</label>
                    <select
                      value={selectedSection}
                      onChange={(e) => {
                        setSelectedSection(e.target.value);
                        setSectionTouched(true);
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 text-slate-900 font-bold cursor-pointer transition-all outline-hidden"
                    >
                      <option value="सेक्शन A">सेक्शन A</option>
                      <option value="सेक्शन B">सेक्शन B</option>
                      <option value="सेक्शन C">सेक्शन C</option>
                      <option value="सेक्शन D">सेक्शन D</option>
                      <option value="सेक्शन E">सेक्शन E</option>
                      <option value="सेक्शन F">सेक्शन F</option>
                      <option value="सेक्शन G">सेक्शन G</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {isTeacher && (
              <div className="px-3 py-2 rounded-xl bg-indigo-50/90 border border-indigo-200/80 flex items-center justify-between text-[11px] text-indigo-900">
                <span className="font-semibold text-indigo-700">
                  {activeHonorific === 'sir' ? '👨‍🏫 शिक्षक लॉगिन सक्रिय' : '👩‍🏫 शिक्षिका लॉगिन सक्रिय'}
                </span>
                <span className="font-extrabold">
                  प्रदर्शित नाम: {formatTeacherNameWithHonorific(displayedName || 'किरण', activeHonorific)}
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                सत्यापित हो रहा है...
              </span>
            ) : (
              <>
                <span>प्रवेश करें (Grant Access & Continue)</span>
                <ArrowRight className="w-4 h-4 text-indigo-200" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 pt-1 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Firebase Auth & Firestore द्वारा सुरक्षित एवं सिंकित।</span>
          </p>
        </form>
      </div>
    </div>
  );
};
