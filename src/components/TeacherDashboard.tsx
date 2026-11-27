import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Printer,
  Upload,
  CheckCircle2,
  Users,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  Layers,
  HelpCircle,
  AlertCircle,
  X,
  BarChart3,
  TrendingUp,
  Search,
  Download,
  FileSpreadsheet,
  Filter,
  BookOpen,
  UserCheck,
  Mail,
  PenTool,
  Trash2,
  Calendar
} from 'lucide-react';
import {
  GradeLevel,
  TeacherWorksheet,
  StudentWorksheetSubmission,
  QuizQuestion,
  CreativeHomeworkAssignment,
  CreativeSubmissionRecord,
} from '../types';
import { AppTheme, getThemeConfig } from '../utils/theme';
import { getUniqueWorksheetQuestions } from '../data/worksheetBank';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { KATHA_SHILPI_FORMATS, WritingFormatId } from '../data/kathaShilpiData';
import { ComprehensiveReportPanel } from './ComprehensiveReportPanel';
import { 
  saveWorksheetsForTeacher, 
  loadWorksheetsForTeacher, 
  saveTeacherWorksheetsToFirestore, 
  loadTeacherWorksheetsFromFirestore, 
  saveStudentSubmissionsToFirestore, 
  loadStudentSubmissionsFromFirestore,
  subscribeToTeacherWorksheets,
  subscribeToStudentSubmissions,
  subscribeToCrossTabUpdates,
  saveCreativeHomework,
  loadCreativeHomeworks,
  deleteCreativeHomework,
  loadCreativeSubmissions,
  reviewCreativeSubmission,
} from '../utils/firebase';
import {
  printTeacherWorksheetItem,
  printTeacherClassReport,
  buildTeacherSubmissionWorksheetMeta,
} from '../utils/printWorksheet';

interface TeacherDashboardProps {
  teacherEmail: string;
  teacherName: string;
  bilingualMode: boolean;
  theme?: AppTheme;
  onUpdateTeacherHonorific?: (honorific: 'sir' | 'madam') => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacherEmail,
  teacherName,
  bilingualMode,
  theme = 'indigo',
  onUpdateTeacherHonorific,
}) => {
  const isSir = /(?:\s+|^)(सर|Sir)$/i.test((teacherName || '').trim());
  const themeConfig = getThemeConfig(theme);
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'creative_hw' | 'report'>('generator');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e) {}
    const rafId = window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {}
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);
  
  // Generator State
  const [grade, setGrade] = useState<GradeLevel>('कक्षा 8');
  const gradeTopicsList = [
    ...getCurriculumForGrade(grade).worksheetTopics,
    { id: 'gadyansh', nameHindi: 'अपठित गद्यांश (Comprehension)', nameEnglish: 'Reading Comprehension', icon: '📖', bankKeys: ['gadyansh'] }
  ];
  const [section, setSection] = useState<string>('सेक्शन A');
  const [selectedTopic, setSelectedTopic] = useState<string>(gradeTopicsList[0]?.nameHindi || 'कारक एवं परसर्ग');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    const exists = gradeTopicsList.some(t => t.nameHindi === selectedTopic || t.id === selectedTopic);
    if (!exists && gradeTopicsList.length > 0) {
      setSelectedTopic(gradeTopicsList[0].nameHindi);
    }
  }, [grade, selectedTopic]);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<TeacherWorksheet | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [copiedScoresId, setCopiedScoresId] = useState<string | null>(null);
  const [reportViewMode, setReportViewMode] = useState<'byWorksheet' | 'combined'>('byWorksheet');
  const [reportTopicFilter, setReportTopicFilter] = useState<string>('ALL');

  // Creative Writing Homework & Submissions State
  const [creativeHomeworks, setCreativeHomeworks] = useState<CreativeHomeworkAssignment[]>([]);
  const [creativeSubmissions, setCreativeSubmissions] = useState<CreativeSubmissionRecord[]>([]);
  const [cwGenreId, setCwGenreId] = useState<WritingFormatId>('anuched');
  const [cwTitleHindi, setCwTitleHindi] = useState<string>('');
  const [cwInstructionsHindi, setCwInstructionsHindi] = useState<string>('');
  const [cwWordLimit, setCwWordLimit] = useState<number>(120);
  const [cwDueDate, setCwDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().slice(0, 10);
  });
  const [cwGrade, setCwGrade] = useState<GradeLevel>('कक्षा 8');
  const [cwSection, setCwSection] = useState<string>('सभी सेक्शन (All Sections)');
  const [cwSaving, setCwSaving] = useState<boolean>(false);

  const normTeacherEmail = (teacherEmail || '').trim().toLowerCase();

  // Teacher Worksheets & Student Submissions Store in LocalStorage keyed by normalized teacherEmail
  const [teacherWorksheets, setTeacherWorksheets] = useState<TeacherWorksheet[]>(() => {
    try {
      const saved = localStorage.getItem(`shabdshilp_teacher_worksheets_${normTeacherEmail}`);
      if (saved) return JSON.parse(saved);
      // Fallback filter from legacy global
      const legacy = localStorage.getItem('shabdshilp_teacher_worksheets');
      if (legacy) {
        const parsed: TeacherWorksheet[] = JSON.parse(legacy);
        const mine = parsed.filter(w => (w.teacherEmail || '').trim().toLowerCase() === normTeacherEmail);
        if (mine.length > 0) return mine;
      }
    } catch (e) {}
    return [];
  });

  const [studentSubmissions, setStudentSubmissions] = useState<StudentWorksheetSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('shabdshilp_student_submissions') || localStorage.getItem('shabd_student_submissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [hasLoadedWorksheets, setHasLoadedWorksheets] = useState<boolean>(false);

  const mergeSubmissionLists = (
    primary: StudentWorksheetSubmission[],
    secondary: StudentWorksheetSubmission[]
  ): StudentWorksheetSubmission[] => {
    const map = new Map<string, StudentWorksheetSubmission>();
    [...secondary, ...primary].forEach((s) => {
      if (!s || !s.worksheetId) return;
      const key = `${s.worksheetId}::${(s.studentEmail || '').trim().toLowerCase()}`;
      map.set(key, s);
    });
    return Array.from(map.values());
  };

  // Load from Firestore on mount & subscribe to live student submissions & cross-tab events
  useEffect(() => {
    let isMounted = true;

    // 1. Initial Load for this teacher's personal ID from Firestore (merged safely with local)
    loadWorksheetsForTeacher(normTeacherEmail)
      .then((cloudWs) => {
        if (isMounted && Array.isArray(cloudWs) && cloudWs.length > 0) {
          setTeacherWorksheets((prev) => {
            const seen = new Set(cloudWs.map((w: any) => w.id));
            return [...cloudWs, ...prev.filter((w) => !seen.has(w.id))];
          });
        }
      })
      .catch((err) => {
        console.warn('Teacher worksheets cloud load fallback:', err);
      })
      .finally(() => {
        if (isMounted) setHasLoadedWorksheets(true);
      });

    loadStudentSubmissionsFromFirestore()
      .then((cloudSubs) => {
        if (isMounted && Array.isArray(cloudSubs) && cloudSubs.length > 0) {
          setStudentSubmissions((prev) => mergeSubmissionLists(cloudSubs, prev));
        }
      })
      .catch((err) => {
        console.warn('Student submissions cloud load fallback:', err);
      });

    // 2. Real-time Firestore snapshot listener for student submissions
    const unsubSubs = subscribeToStudentSubmissions((latestSubs) => {
      if (isMounted && Array.isArray(latestSubs)) {
        setStudentSubmissions((prev) => mergeSubmissionLists(latestSubs, prev));
      }
    });

    const refreshCreativePortalData = () => {
      loadCreativeHomeworks()
        .then((hws) => {
          if (isMounted && Array.isArray(hws)) setCreativeHomeworks(hws);
        })
        .catch(() => {});
      loadCreativeSubmissions()
        .then((subs) => {
          if (isMounted && Array.isArray(subs)) setCreativeSubmissions(subs);
        })
        .catch(() => {});
    };
    refreshCreativePortalData();

    // 3. Real-time cross-tab broadcast channel listener
    const unsubCrossTab = subscribeToCrossTabUpdates((data) => {
      if (!isMounted) return;
      if (data.action === 'CREATIVE_HW_UPDATED' || data.action === 'CREATIVE_SUB_UPDATED') {
        refreshCreativePortalData();
      }
      if (data.action === 'NEW_SUBMISSION' || data.action === 'STUDENT_SUBMITTED') {
        try {
          const localSubs = localStorage.getItem('shabdshilp_student_submissions') || localStorage.getItem('shabd_student_submissions');
          if (localSubs) {
            const parsed = JSON.parse(localSubs);
            if (Array.isArray(parsed)) {
              setStudentSubmissions((prev) => mergeSubmissionLists(parsed, prev));
            }
          }
        } catch (e) {}
        loadStudentSubmissionsFromFirestore()
          .then((cloud) => {
            if (isMounted && Array.isArray(cloud)) {
              setStudentSubmissions((prev) => mergeSubmissionLists(cloud, prev));
            }
          })
          .catch((err) => {
            console.warn('Cross-tab submission refresh fallback:', err);
          });
      }
    });

    // 4. Polling fallback check (every 2.5s) for instant tab-to-tab sync
    const intervalId = setInterval(() => {
      try {
        const localSubs = localStorage.getItem('shabdshilp_student_submissions') || localStorage.getItem('shabd_student_submissions');
        if (localSubs) {
          const parsed = JSON.parse(localSubs);
          if (Array.isArray(parsed)) {
            setStudentSubmissions((prev) => {
              const merged = mergeSubmissionLists(parsed, prev);
              return merged.length !== prev.length ? merged : prev;
            });
          }
        }
      } catch (e) {}
    }, 2500);

    return () => {
      isMounted = false;
      unsubSubs();
      unsubCrossTab();
      clearInterval(intervalId);
    };
  }, [normTeacherEmail]);

  const handleSaveCreativeHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cwTitleHindi.trim() || !cwInstructionsHindi.trim()) return;
    setCwSaving(true);
    const hwId = `chw_${Date.now()}`;
    const newHw: CreativeHomeworkAssignment = {
      id: hwId,
      teacherEmail: normTeacherEmail,
      teacherName,
      genreId: cwGenreId,
      titleHindi: cwTitleHindi.trim(),
      instructionsHindi: cwInstructionsHindi.trim(),
      wordLimit: cwWordLimit,
      dueDate: cwDueDate,
      grade: cwGrade,
      section: cwSection,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    try {
      await saveCreativeHomework(newHw);
      setCreativeHomeworks((prev) => [newHw, ...prev.filter((h) => h.id !== newHw.id)]);
      setCwTitleHindi('');
      setCwInstructionsHindi('');
      setSuccessNotice(`रचनात्मक गृहकार्य "${newHw.titleHindi}" सफलतापूर्वक छात्रों के डैशबोर्ड पर असाइन किया गया!`);
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err) {
      console.error('Failed to assign creative homework:', err);
    } finally {
      setCwSaving(false);
    }
  };

  const handleDeleteCreativeHomework = async (hwId: string) => {
    try {
      await deleteCreativeHomework(hwId);
      setCreativeHomeworks((prev) => prev.filter((h) => h.id !== hwId));
    } catch (err) {
      console.error('Failed to delete creative homework:', err);
    }
  };

  const handleReviewCreativeSubmission = async (
    submissionId: string,
    status: 'Submitted' | 'Reviewed',
    remarks: string
  ) => {
    await reviewCreativeSubmission(submissionId, status, remarks);
    setCreativeSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status, teacherRemarks: remarks } : s))
    );
    setSuccessNotice('छात्र की रचनात्मक प्रस्तुति सफलतापूर्वक जाँची (Reviewed) गई!');
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Sync teacher worksheets state to teacher-specific Firestore doc & localStorage after initial load
  useEffect(() => {
    if (!hasLoadedWorksheets) return;
    try {
      const normalizedList = teacherWorksheets.map((w) => ({
        ...w,
        teacherEmail: (w.teacherEmail || normTeacherEmail).trim().toLowerCase(),
      }));
      localStorage.setItem(`shabdshilp_teacher_worksheets_${normTeacherEmail}`, JSON.stringify(normalizedList));
      
      const globalSaved = localStorage.getItem('shabdshilp_teacher_worksheets');
      let globalList: TeacherWorksheet[] = globalSaved ? JSON.parse(globalSaved) : [];
      globalList = globalList.filter(w => (w.teacherEmail || '').trim().toLowerCase() !== normTeacherEmail);
      globalList = [...normalizedList, ...globalList];
      localStorage.setItem('shabdshilp_teacher_worksheets', JSON.stringify(globalList));
      
      // Save specifically under this teacher's personal ID document in Firestore (never deleted)
      saveWorksheetsForTeacher(normTeacherEmail, normalizedList).catch((err) => {
        console.warn('Teacher worksheets cloud save fallback:', err);
      });
    } catch (e) {}
  }, [teacherWorksheets, normTeacherEmail, hasLoadedWorksheets]);

  // Sync student submissions state to localStorage cache
  useEffect(() => {
    try {
      localStorage.setItem('shabdshilp_student_submissions', JSON.stringify(studentSubmissions));
      localStorage.setItem('shabd_student_submissions', JSON.stringify(studentSubmissions));
    } catch (e) {}
  }, [studentSubmissions]);

  // AI Worksheet Generator logic (100% unique questions via Gemini + curated ICSE bank)
  const handleGenerateWorksheet = async () => {
    setIsGenerating(true);
    setSuccessNotice(null);

    const topicObj = gradeTopicsList.find(t => t.nameHindi === selectedTopic || t.id === selectedTopic);
    const topicId = topicObj?.id || gradeTopicsList[0]?.id || 'karak';
    const topicEnglish = topicObj?.nameEnglish || selectedTopic;

    let aiQuestions: QuizQuestion[] = [];
    try {
      const response = await fetch('/api/ai/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          topicId,
          grade,
          difficulty,
          questionCount,
          board: 'ICSE',
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data?.questions)) {
          aiQuestions = data.questions;
        }
      }
    } catch (err) {
      console.warn('Teacher worksheet AI fallback to curated unique bank:', err);
    }

    const sanitizeQuestionsUniformly = (qs: QuizQuestion[]): QuizQuestion[] => {
      const placeholderRx = /^(correct\s*(option|answer)|wrong\s*(option|answer)|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i;
      return qs.map((q) => {
        const cleanedEng = q.options.map((o) => {
          const s = (o?.textEnglish || '').trim();
          return !s || placeholderRx.test(s) ? '' : s;
        });
        const allValid = cleanedEng.length > 0 && cleanedEng.every((e) => e.length > 0);
        return {
          ...q,
          options: q.options.map((o, i) => ({
            ...o,
            textEnglish: allValid ? cleanedEng[i] : '',
          })),
        };
      });
    };

    const rawQuestions = getUniqueWorksheetQuestions(
      topicId,
      questionCount,
      selectedTopic,
      topicEnglish,
      aiQuestions,
      grade
    );
    const questions = sanitizeQuestionsUniformly(rawQuestions);

    const title = customTitle.trim() || `${selectedTopic} विशेष अभ्यास (${grade} - ${section})`;
    const newWs: TeacherWorksheet = {
      id: `ws_teach_${Date.now()}`,
      teacherEmail,
      teacherName,
      grade,
      section,
      topic: selectedTopic,
      questionCount: questions.length,
      difficulty,
      titleHindi: title,
      titleEnglish: `${topicEnglish} Practice Assignment`,
      createdAt: new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      isActive: false,
      questions
    };

    setGeneratedWorksheet(newWs);
    setIsGenerating(false);
  };

  // Upload and Activate Worksheet
  const handleUploadAndActivate = () => {
    if (!generatedWorksheet) return;

    const activatedWs = { ...generatedWorksheet, isActive: true };
    setTeacherWorksheets((prev) => [activatedWs, ...prev.filter(w => w.id !== activatedWs.id)]);
    setSuccessNotice(`वर्कशीट "${activatedWs.titleHindi}" सफलतापूर्वक अपलोड और सक्रिय (Active) कर दी गई है! अब यह छात्रों की स्क्रीन पर सर्वोच्च प्राथमिकता पर उपलब्ध है।`);
    setGeneratedWorksheet(activatedWs);
  };

  // Toggle Worksheet Active Status in History
  const handleToggleActive = (wsId: string) => {
    setTeacherWorksheets((prev) =>
      prev.map((w) => (w.id === wsId ? { ...w, isActive: !w.isActive } : w))
    );
  };

  // Print Worksheet via unified Print Studio (supports native print, Answer Key toggle, & HTML download)
  const handlePrintWorksheet = (ws: TeacherWorksheet) => {
    printTeacherWorksheetItem(ws, bilingualMode);
  };

  // Copy Student Scores to Clipboard
  const handleCopyScores = (wsId: string, wsTitle: string) => {
    const submissionsForWs = studentSubmissions.filter((s) => s.worksheetId === wsId);
    let textToCopy = `शिक्षक वर्कशीट परिणाम: ${wsTitle}\n----------------------------------\n`;
    submissionsForWs.forEach((s, idx) => {
      textToCopy += `${idx + 1}. ${s.studentName} (${s.studentEmail}) - प्राप्तांक: ${s.score} / ${s.maxScore} (${s.percentage}%)\n`;
    });
    if (submissionsForWs.length === 0) {
      textToCopy += `अभी तक किसी छात्र ने यह वर्कशीट हल नहीं की है。\n`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedScoresId(wsId);
    setTimeout(() => setCopiedScoresId(null), 2000);
  };

  // Reusable helper to get all worksheets grouped with their respective student submissions
  const getAllWorksheetGroups = () => {
    const teacherWsIds = new Set(teacherWorksheets.map((w) => w.id));

    // 1. Direct worksheets uploaded by this teacher
    const groups: Array<{
      id: string;
      titleHindi: string;
      topic: string;
      grade: string;
      section: string;
      difficulty?: string;
      questionCount: number;
      isActive?: boolean;
      createdAt?: string;
      questions?: any[];
      submissions: StudentWorksheetSubmission[];
    }> = teacherWorksheets.map((ws) => ({
      id: ws.id,
      titleHindi: ws.titleHindi,
      topic: ws.topic,
      grade: ws.grade,
      section: ws.section || '',
      difficulty: ws.difficulty,
      questionCount: ws.questionCount,
      isActive: ws.isActive,
      createdAt: ws.createdAt,
      questions: ws.questions,
      submissions: studentSubmissions.filter((s) => s.worksheetId === ws.id)
    }));

    // 2. Any student submissions for other worksheets (e.g. Sangya, Karak, or standard modules)
    const otherSubs = studentSubmissions.filter((s) => !teacherWsIds.has(s.worksheetId));
    if (otherSubs.length > 0) {
      const otherMap = new Map<string, StudentWorksheetSubmission[]>();
      otherSubs.forEach((s) => {
        const list = otherMap.get(s.worksheetId) || [];
        list.push(s);
        otherMap.set(s.worksheetId, list);
      });

      otherMap.forEach((subs, wsId) => {
        let topic = 'सामान्य व्याकरण (Grammar)';
        let title = `व्याकरण अभ्यास (${wsId})`;
        const lower = wsId.toLowerCase();
        if (lower.includes('sangya')) {
          topic = 'संज्ञा (Noun)';
          title = 'संज्ञा (Noun) विशेष व्याकरण वर्कशीट';
        } else if (lower.includes('sarvanam')) {
          topic = 'सर्वनाम (Pronoun)';
          title = 'सर्वनाम (Pronoun) व्याकरण वर्कशीट';
        } else if (lower.includes('visheshan')) {
          topic = 'विशेषण (Adjective)';
          title = 'विशेषण (Adjective) व्याकरण वर्कशीट';
        } else if (lower.includes('kriya')) {
          topic = 'क्रिया (Verb)';
          title = 'क्रिया (Verb) व्याकरण वर्कशीट';
        } else if (lower.includes('karak')) {
          topic = 'कारक (Case Markers)';
          title = 'कारक (Case Markers) व्याकरण वर्कशीट';
        } else if (lower.includes('vakya')) {
          topic = 'वाक्य भेद (Sentence Types)';
          title = 'वाक्य भेद व्याकरण वर्कशीट';
        } else if (lower.includes('sandhi')) {
          topic = 'संधि (Sandhi)';
          title = 'संधि व्याकरण वर्कशीट';
        } else if (lower.includes('samas')) {
          topic = 'समास (Samas)';
          title = 'समास व्याकरण वर्कशीट';
        } else if (lower.includes('muhavare')) {
          topic = 'मुहावरे (Idioms)';
          title = 'मुहावरे एवं लोकोक्तियाँ अभ्यास';
        }

        groups.push({
          id: wsId,
          titleHindi: title,
          topic,
          grade: subs[0]?.grade || 'कक्षा 8',
          section: 'सभी सेक्शन',
          difficulty: 'medium',
          questionCount: subs[0]?.maxScore || 10,
          isActive: true,
          createdAt: subs[0]?.attemptedAt?.split(' ')[0] || 'हाल ही में',
          questions: [],
          submissions: subs
        });
      });
    }

    return groups;
  };

  // Export CSV for a single specific worksheet (UTF-8 BOM prefixed for Devanagari Hindi in Excel)
  const handleExportWorksheetCSV = (
    ws: { id: string; titleHindi: string; topic: string; grade: string; section?: string; questionCount?: number },
    submissions: StudentWorksheetSubmission[]
  ) => {
    let csv = '\uFEFF'; // Byte Order Mark for proper Excel Devanagari encoding
    csv += `शब्दशिल्प - विशिष्ट वर्कशीट अंकतालिका (Worksheet Marksheet)\n`;
    csv += `वर्कशीट शीर्षक,"${ws.titleHindi.replace(/"/g, '""')}"\n`;
    csv += `विषय,"${ws.topic}"\n`;
    csv += `कक्षा / सेक्शन,"${ws.grade} ${ws.section || ''}"\n`;
    csv += `शिक्षक आईडी,"${teacherEmail}"\n`;
    csv += `कुल प्रश्न,${ws.questionCount || (submissions[0]?.maxScore || 10)}\n`;
    csv += `कुल छात्र प्रयास,${submissions.length}\n`;
    const avgPct = submissions.length > 0 ? Math.round(submissions.reduce((a, b) => a + b.percentage, 0) / submissions.length) : 0;
    csv += `औसत प्राप्तांक प्रतिशत,${avgPct}%\n`;
    csv += `निर्यात दिनांक,"${new Date().toLocaleDateString('hi-IN')}"\n\n`;

    csv += `क्र.सं.,छात्र का नाम,ईमेल आईडी,कक्षा,प्राप्तांक,अधिकतम अंक,प्रतिशत (%),श्रेणी / ग्रेड,जमा करने का समय\n`;
    if (submissions.length === 0) {
      csv += `-,कोई छात्र सबमिशन नहीं दर्ज,-,-,-,-,-,-,-\n`;
    } else {
      submissions.forEach((s, idx) => {
        const gradeLabel = s.percentage >= 80 ? 'उत्कृष्ट (A+)' : s.percentage >= 60 ? 'प्रथम (A)' : s.percentage >= 50 ? 'द्वितीय (B)' : 'सुधार अपेक्षित (C)';
        csv += `${idx + 1},"${s.studentName.replace(/"/g, '""')}","${s.studentEmail}","${s.grade || ws.grade}",${s.score},${s.maxScore},${s.percentage}%,${gradeLabel},"${s.attemptedAt}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTopic = (ws.topic || 'Worksheet').replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_');
    link.setAttribute('download', `${safeTopic}_अंकतालिका_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setSuccessNotice(`वर्कशीट "${ws.titleHindi}" की CSV अंकतालिका सफलतापूर्वक डाउनलोड हो गई!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Export Comprehensive Master Progress Report CSV (Worksheet-wise Grouped)
  const handleExportMasterCSV = () => {
    let csv = '\uFEFF';
    csv += `शब्दशिल्प - समग्र कक्षा प्रगति एवं वर्कशीटवार मास्टर रिपोर्ट (Master Class Progress Report)\n`;
    csv += `शिक्षक का नाम,"${teacherName}"\n`;
    csv += `शिक्षक आईडी,"${teacherEmail}"\n`;
    csv += `निर्यात दिनांक,"${new Date().toLocaleDateString('hi-IN')}"\n`;
    csv += `कुल सक्रिय / अपलोड वर्कशीट्स,${teacherWorksheets.length}\n`;
    csv += `कुल छात्र प्रयास,${studentSubmissions.length}\n`;
    const avg = studentSubmissions.length > 0 ? Math.round(studentSubmissions.reduce((a, b) => a + b.percentage, 0) / studentSubmissions.length) : 0;
    csv += `समग्र कक्षा औसत,${avg}%\n\n`;

    const allGroups = getAllWorksheetGroups();
    allGroups.forEach((group) => {
      csv += `========================================================================================\n`;
      csv += `वर्कशीट: "${group.titleHindi.replace(/"/g, '""')}" | विषय: "${group.topic}" | कक्षा: "${group.grade} ${group.section || ''}" | कुल प्रयास: ${group.submissions.length}\n`;
      csv += `क्र.सं.,छात्र का नाम,ईमेल आईडी,कक्षा,प्राप्तांक,अधिकतम अंक,प्रतिशत (%),श्रेणी / ग्रेड,जमा करने का समय\n`;
      if (group.submissions.length === 0) {
        csv += `-,अभी तक कोई सबमिशन नहीं,-,-,-,-,-,-,-\n`;
      } else {
        group.submissions.forEach((s, idx) => {
          const gradeLabel = s.percentage >= 80 ? 'उत्कृष्ट (A+)' : s.percentage >= 60 ? 'प्रथम (A)' : s.percentage >= 50 ? 'द्वितीय (B)' : 'सुधार अपेक्षित (C)';
          csv += `${idx + 1},"${s.studentName.replace(/"/g, '""')}","${s.studentEmail}","${s.grade || group.grade}",${s.score},${s.maxScore},${s.percentage}%,${gradeLabel},"${s.attemptedAt}"\n`;
        });
      }
      csv += `\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shabdshilp_class_progress_master_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setSuccessNotice('समग्र कक्षा प्रगति मास्टर CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई!');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto px-4 py-6">
      {/* Teacher Header Banner - Dynamic Theme Gradient */}
      <div
        className={`${themeConfig.teacherBannerGradient} rounded-3xl p-6 sm:p-8 ${
          themeConfig.isLightBanner ? 'text-slate-950 border-amber-500/35' : 'text-white border-white/20'
        } relative overflow-hidden shadow-xl shadow-indigo-950/15 border transition-all duration-500`}
      >
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover object-center shadow-lg border border-white/25 bg-[#091124] shrink-0"
            />
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 backdrop-blur-md rounded-full text-xs font-bold border mb-3 ${
                  themeConfig.isLightBanner
                    ? 'bg-white/65 text-slate-950 border-slate-950/15'
                    : 'bg-white/10 text-white border-white/15'
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-300'}`} />
                <span>शिक्षक नियंत्रण कक्ष (Teacher Command Center)</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-black font-serif-display ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}`}>
                नमस्ते, {teacherName}!
              </h2>
              <p className={`text-sm mt-2 leading-relaxed max-w-2xl font-normal ${themeConfig.isLightBanner ? 'text-slate-900 font-medium' : 'text-white/90'}`}>
                यह आपका विशिष्ट शिक्षक इंटरफ़ेस है। यहाँ से आप किसी भी कक्षा व विषय पर मनचाही संख्या में AI-जनरेटेड वर्कशीट तैयार कर {isSir ? 'सकते' : 'सकती'} हैं, उन्हें प्रिंट कर {isSir ? 'सकते' : 'सकती'} हैं, और एक क्लिक में छात्रों के लिए लाइव एक्टिवेट कर {isSir ? 'सकते' : 'सकती'} हैं।
              </p>
            </div>
          </div>

          <div
            className={`backdrop-blur-md p-4 rounded-2xl border text-xs space-y-2 shrink-0 shadow-sm ${
              themeConfig.isLightBanner
                ? 'bg-white/70 border-slate-950/15 text-slate-950'
                : 'bg-white/10 border-white/15'
            }`}
          >
            <div className={`font-bold ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-200'}`}>
              शिक्षक आईडी: {teacherEmail}
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                सक्रिय वर्कशीट:{' '}
                <strong className={themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}>
                  {teacherWorksheets.filter(w => w.isActive).length}
                </strong>
              </div>
              <div>
                कुल सबमिशन:{' '}
                <strong className={themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}>
                  {studentSubmissions.length}
                </strong>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportMasterCSV}
              className={`w-full mt-1 px-3 py-1.5 font-bold text-[11px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-2xs ${
                themeConfig.isLightBanner
                  ? 'bg-slate-950 hover:bg-slate-800 text-white border-slate-950'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
              title="पूरी कक्षा की प्रगति रिपोर्ट CSV में डाउनलोड करें"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>📊 प्रगति रिपोर्ट CSV डाउनलोड</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Profile Section */}
      <section
        aria-label="Teacher Profile"
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} flex items-center justify-center text-xl font-black shadow-sm shrink-0`}>
            {isSir ? '👨‍🏫' : '👩‍🏫'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                शिक्षक प्रोफ़ाइल (Teacher Profile)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {isSir ? 'Sir (सर)' : 'Madam (मैम)'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-semibold text-slate-500">नाम (Name):</span>
                <span className="font-extrabold text-slate-900">{teacherName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-semibold text-slate-500">ईमेल (Email):</span>
                <span className="font-bold text-slate-800 font-mono text-[11px]">{teacherEmail}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80">
          <label
            htmlFor="teacher-honorific-select"
            className="text-xs font-bold text-slate-700 whitespace-nowrap"
          >
            पसंदीदा उपाधि (Preferred Honorific):
          </label>
          <select
            id="teacher-honorific-select"
            value={isSir ? 'sir' : 'madam'}
            onChange={(e) => {
              const nextHonorific = e.target.value as 'sir' | 'madam';
              if (onUpdateTeacherHonorific) {
                onUpdateTeacherHonorific(nextHonorific);
              }
              setSuccessNotice(
                nextHonorific === 'sir'
                  ? 'उपाधि सफलतापूर्वक "सर (Sir)" पर अपडेट की गई!'
                  : 'उपाधि सफलतापूर्वक "मैम (Madam)" पर अपडेट की गई!'
              );
              setTimeout(() => setSuccessNotice(null), 3500);
            }}
            className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden cursor-pointer transition-all"
          >
            <option value="sir">👨‍🏫 सर (Sir)</option>
            <option value="madam">👩‍🏫 मैम (Madam)</option>
          </select>
        </div>
      </section>

      {/* Tabs Switcher - Clean Slate & Dynamic Theme Pills */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('generator')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            activeTab === 'generator'
              ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-sm ${themeConfig.primaryShadow}`
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles
            className={`w-4 h-4 ${
              activeTab === 'generator'
                ? themeConfig.isLightBanner
                  ? 'text-slate-950'
                  : 'text-amber-200'
                : 'text-slate-600'
            }`}
          />
          <span>📝 AI वर्कशीट जनरेटर व संपादक</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            activeTab === 'history'
              ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-sm ${themeConfig.primaryShadow}`
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users
            className={`w-4 h-4 ${
              activeTab === 'history'
                ? themeConfig.isLightBanner
                  ? 'text-slate-950'
                  : 'text-amber-200'
                : 'text-slate-600'
            }`}
          />
          <span>📂 अपलोड वर्कशीट्स व लाइव ट्रैकर ({teacherWorksheets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('creative_hw')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            activeTab === 'creative_hw'
              ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-sm ${themeConfig.primaryShadow}`
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PenTool
            className={`w-4 h-4 ${
              activeTab === 'creative_hw'
                ? themeConfig.isLightBanner
                  ? 'text-slate-950'
                  : 'text-amber-200'
                : 'text-slate-600'
            }`}
          />
          <span>✍️ रचनात्मक गृहकार्य ({creativeHomeworks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
            activeTab === 'report'
              ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-sm ${themeConfig.primaryShadow}`
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3
            className={`w-4 h-4 ${
              activeTab === 'report'
                ? themeConfig.isLightBanner
                  ? 'text-slate-950'
                  : 'text-amber-200'
                : 'text-slate-600'
            }`}
          />
          <span>📊 कक्षा प्रगति रिपोर्ट (Class Progress Report)</span>
        </button>
      </div>

      {/* ================= TAB 1: GENERATOR ================= */}
      {activeTab === 'generator' && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Config Panel */}
          <div className="lg:col-span-5 space-y-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 font-serif-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>वर्कशीट के पैरामीटर चुनें</span>
            </h3>

            {/* Grade & Section Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">कक्षा (Grade):</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/80 font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden cursor-pointer"
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
                <label className="text-xs font-bold text-slate-700">सेक्शन (Section):</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/80 font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden cursor-pointer"
                >
                  <option value="सेक्शन A">सेक्शन A</option>
                  <option value="सेक्शन B">सेक्शन B</option>
                  <option value="सेक्शन C">सेक्शन C</option>
                  <option value="सेक्शन D">सेक्शन D</option>
                  <option value="सेक्शन E">सेक्शन E</option>
                  <option value="सेक्शन F">सेक्शन F</option>
                  <option value="सेक्शन G">सेक्शन G</option>
                  <option value="सभी सेक्शन (All Sections)">सभी सेक्शन (All Sections)</option>
                </select>
              </div>
            </div>

            {/* Topic Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                व्याकरण विषय ({grade} पाठ्यक्रम अनुसार):
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/80 font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden cursor-pointer"
              >
                {gradeTopicsList.map((t) => (
                  <option key={t.id} value={t.nameHindi}>
                    {t.nameHindi} {bilingualMode ? `(${t.nameEnglish})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-amber-700 font-semibold">
                🪙 प्रत्येक 2 सही उत्तर पर विद्यार्थी को 1 WordCoin मिलेगा।
              </p>
            </div>

            {/* Number of Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">प्रश्नों की संख्या (Number of Questions):</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      questionCount === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} प्रश्न
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">कठिनाई स्तर (Difficulty Level):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'सरल (Easy)' },
                  { id: 'medium', label: 'मध्यम (Medium)' },
                  { id: 'hard', label: 'कठिन (Hard)' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id as any)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      difficulty === d.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Worksheet Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">वर्कशीट शीर्षक (शीर्षक खाली छोड़ने पर स्वतः बनेगा):</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="उदा. मासिक व्याकरण परीक्षा - कारक व वाक्य भेद"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium transition-all outline-hidden"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateWorksheet}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>AI वर्कशीट तैयार कर रहा है...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>AI द्वारा वर्कशीट तैयार करें (Generate)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Preview & Action Panel */}
          <div className="lg:col-span-7 space-y-5">
            {successNotice && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-3 animate-in fade-in shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {!generatedWorksheet ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200/90 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold border border-indigo-100 shadow-xs">
                  📝
                </div>
                <h4 className="text-xl font-black text-slate-900 font-serif-display">
                  अभी कोई नई वर्कशीट तैयार नहीं की गई है
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  बाईं ओर से कक्षा, विषय, प्रश्नों की संख्या और कठिनाई स्तर चुनकर "AI द्वारा वर्कशीट तैयार करें" बटन पर क्लिक करें। तैयार होते ही आप इसे छात्रों के लिए सक्रिय कर सकते हैं।
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <img
                        src="/assets/aistudio/mail.google_a65ce30f.png"
                        alt="शब्दशिल्प (ShabdShilp) Logo"
                        className="w-14 h-14 rounded-xl object-cover object-center border border-slate-200 bg-[#091124] shadow-xs shrink-0"
                      />
                      <img
                        src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                        alt="TechPreneur Logo"
                        className="w-14 h-14 rounded-xl bg-white p-0.5 border border-slate-200 object-contain shadow-xs shrink-0"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                        {generatedWorksheet.grade} • {generatedWorksheet.topic} • {generatedWorksheet.section}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 font-serif-display mt-2">
                        {generatedWorksheet.titleHindi}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Print Button */}
                    <button
                      type="button"
                      onClick={() => handlePrintWorksheet(generatedWorksheet)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 shadow-2xs"
                    >
                      <Printer className="w-4 h-4 text-indigo-600" />
                      <span>प्रिंट करें (Print)</span>
                    </button>

                    {/* Upload / Activate Button */}
                    <button
                      type="button"
                      onClick={handleUploadAndActivate}
                      className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                        generatedWorksheet.isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white shadow-indigo-600/25'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{generatedWorksheet.isActive ? 'सक्रिय है (Active)' : 'अपलोड व सक्रिय करें'}</span>
                    </button>
                  </div>
                </div>

                {/* Questions Preview */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {generatedWorksheet.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 leading-snug">
                        {idx + 1}. {q.questionHindi}
                        {bilingualMode && q.questionEnglish && (
                          <div className="text-[11px] font-normal text-indigo-700/80 mt-0.5">
                            {q.questionEnglish}
                          </div>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 pl-2">
                        {(() => {
                          const placeholderRx = /^(correct\s*(option|answer)|wrong\s*(option|answer)|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i;
                          const allHaveSafeEng = Array.isArray(q.options) && q.options.every((o: any) => {
                            const s = typeof o?.textEnglish === 'string' ? o.textEnglish.trim() : '';
                            return s.length > 0 && !placeholderRx.test(s);
                          });
                          return q.options.map((opt: any, oIdx: number) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl border text-[11px] flex items-center justify-between ${
                                oIdx === q.correctIndex
                                  ? 'bg-emerald-100 border-emerald-500 font-bold text-emerald-950'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <div>
                                <span>{opt.textHindi}</span>
                                {bilingualMode && allHaveSafeEng && opt.textEnglish && (
                                  <span className="text-[10px] text-slate-500 block font-normal">
                                    ({opt.textEnglish})
                                  </span>
                                )}
                              </div>
                              <span className="font-bold opacity-60">({String.fromCharCode(65 + oIdx)})</span>
                            </div>
                          ));
                        })()}
                      </div>
                      <div className="mt-1 pt-2 border-t border-slate-200 text-[11px] font-bold text-indigo-900">
                        व्याख्या: {q.explanationHindi}
                        {bilingualMode && q.explanationEnglish && (
                          <div className="text-[10px] font-normal text-slate-600 mt-0.5">
                            English: {q.explanationEnglish}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Worksheet Preview Bottom Branding */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/aistudio/mail.google_a65ce30f.png"
                      alt="शब्दशिल्प (ShabdShilp) Logo"
                      className="w-9 h-9 rounded-lg object-cover object-center border border-slate-200 bg-[#091124] shrink-0"
                    />
                    <img
                      src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                      alt="TechPreneur Logo"
                      className="w-9 h-9 rounded-lg bg-white p-0.5 border border-slate-200 object-contain shrink-0"
                    />
                    <span className="font-bold text-slate-700">शब्दशिल्प (ShabdShilp) • शिक्षक प्रमाणित वर्कशीट</span>
                  </div>
                  <span>{generatedWorksheet.grade}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: HISTORY & LIVE TRACKER ================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900 font-serif-display">
                शिक्षक द्वारा अपलोड की गई सभी लाइव वर्कशीट्स ({teacherWorksheets.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                सक्रिय वर्कशीट्स छात्रों के डैशबोर्ड पर प्राथमिकता से दिखाई देती हैं और आपके खाते में सुरक्षित रहती हैं।
              </p>
            </div>
          </div>

          {teacherWorksheets.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200/90 text-center space-y-3 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold border border-indigo-100">
                📂
              </div>
              <h4 className="text-lg font-black text-slate-900 font-serif-display">कोई अपलोड इतिहास उपलब्ध नहीं है</h4>
              <p className="text-xs text-slate-500">आपने अभी तक कोई वर्कशीट अपलोड नहीं की है। 'AI वर्कशीट जनरेटर' से नई वर्कशीट बनाएं।</p>
            </div>
          ) : (
            <div className="space-y-6">
              {teacherWorksheets.map((ws) => {
                const submissionsForWs = studentSubmissions.filter((s) => s.worksheetId === ws.id);

                return (
                  <div key={ws.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                    <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <img
                            src="/assets/aistudio/mail.google_a65ce30f.png"
                            alt="शब्दशिल्प (ShabdShilp) Logo"
                            className="w-12 h-12 rounded-xl object-cover object-center border border-slate-200 bg-[#091124] shadow-xs shrink-0"
                          />
                          <img
                            src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                            alt="TechPreneur Logo"
                            className="w-12 h-12 rounded-xl bg-white p-0.5 border border-slate-200 object-contain shadow-xs shrink-0"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              ws.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {ws.isActive ? '🟢 लाइव / सक्रिय (Active)' : '🔴 निष्क्रिय (Deactivated)'}
                            </span>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                              {ws.grade} • {ws.topic} • {ws.section || 'सभी सेक्शन'}
                            </span>
                            <span className="text-xs text-slate-500">दिनांक: {ws.createdAt}</span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 font-serif-display">
                            {ws.titleHindi}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            कुल प्रश्न: <strong>{ws.questionCount}</strong> | कठिनाई: {ws.difficulty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Print */}
                        <button
                          type="button"
                          onClick={() => handlePrintWorksheet(ws)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200"
                        >
                          <Printer className="w-3.5 h-3.5 text-indigo-600" />
                          <span>प्रिंट</span>
                        </button>

                        {/* Toggle Active / Deactivate Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(ws.id)}
                          className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                            ws.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {ws.isActive ? (
                            <>
                              <ToggleRight className="w-4 h-4 text-rose-600" />
                              <span>निष्क्रिय करें</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 text-white" />
                              <span>सक्रिय करें</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Student Submissions & Scores Table */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span>छात्रों के प्रयास व प्राप्तांक ({submissionsForWs.length} छात्र):</span>
                        </div>

                        {submissionsForWs.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleExportWorksheetCSV(ws, submissionsForWs)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-emerald-300 shadow-2xs"
                              title="इस वर्कशीट का स्कोर CSV डाउनलोड करें"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-700" />
                              <span>CSV डाउनलोड</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyScores(ws.id, ws.titleHindi)}
                              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-indigo-200"
                            >
                              {copiedScoresId === ws.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>स्कोर कॉपी हो गए!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>सभी स्कोर कॉपी करें</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {submissionsForWs.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 italic text-center">
                          अभी तक किसी भी छात्र ने इस वर्कशीट का प्रयास नहीं किया है। जैसे ही छात्र हल करेंगे, उनके अंक यहाँ तुरंत प्रदर्शित होंगे।
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <th className="p-2.5 font-bold">क्र.सं.</th>
                                <th className="p-2.5 font-bold">छात्र का नाम</th>
                                <th className="p-2.5 font-bold">ईमेल आईडी</th>
                                <th className="p-2.5 font-bold">प्राप्तांक</th>
                                <th className="p-2.5 font-bold">प्रतिशत (%)</th>
                                <th className="p-2.5 font-bold">प्रयास का समय</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissionsForWs.map((sub, sIdx) => (
                                <tr key={sIdx} className="border-b border-slate-100 hover:bg-slate-50/80">
                                  <td className="p-2.5 font-semibold text-slate-500">{sIdx + 1}</td>
                                  <td className="p-2.5 font-bold text-slate-900">{sub.studentName}</td>
                                  <td className="p-2.5 text-slate-600 font-mono text-[11px]">{sub.studentEmail}</td>
                                  <td className="p-2.5 font-black text-indigo-950 text-sm">
                                    {sub.score} / {sub.maxScore}
                                  </td>
                                  <td className="p-2.5">
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                      sub.percentage >= 80
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : sub.percentage >= 50
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {sub.percentage}%
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-slate-500 text-[11px]">{sub.attemptedAt}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2.5: CREATIVE WRITING HOMEWORK & SUBMISSIONS ================= */}
      {activeTab === 'creative_hw' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Assign Creative Writing Homework Form */}
            <form
              onSubmit={handleSaveCreativeHomework}
              className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-serif-display">
                    रचनात्मक लेखन गृहकार्य असाइन करें
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Assign Rachanatmak Lekhan Homework (Typed or Handwritten Upload)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">लेखन विधा (Genre):</label>
                  <select
                    value={cwGenreId}
                    onChange={(e) => setCwGenreId(e.target.value as WritingFormatId)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  >
                    {(Object.keys(KATHA_SHILPI_FORMATS) as WritingFormatId[]).map((key) => (
                      <option key={key} value={key}>
                        {KATHA_SHILPI_FORMATS[key].titleHindi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">कक्षा (Grade):</label>
                  <select
                    value={cwGrade}
                    onChange={(e) => setCwGrade(e.target.value as GradeLevel)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  >
                    <option value="कक्षा 5">कक्षा 5</option>
                    <option value="कक्षा 6">कक्षा 6</option>
                    <option value="कक्षा 7">कक्षा 7</option>
                    <option value="कक्षा 8">कक्षा 8</option>
                    <option value="कक्षा 9">कक्षा 9</option>
                    <option value="कक्षा 10">कक्षा 10</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">सेक्शन:</label>
                  <select
                    value={cwSection}
                    onChange={(e) => setCwSection(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  >
                    <option value="सभी सेक्शन (All Sections)">सभी सेक्शन</option>
                    <option value="सेक्शन A">सेक्शन A</option>
                    <option value="सेक्शन B">सेक्शन B</option>
                    <option value="सेक्शन C">सेक्शन C</option>
                    <option value="सेक्शन D">सेक्शन D</option>
                    <option value="सेक्शन E">सेक्शन E</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">शब्द सीमा:</label>
                  <input
                    type="number"
                    min={30}
                    max={600}
                    value={cwWordLimit}
                    onChange={(e) => setCwWordLimit(Number(e.target.value) || 120)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">अंतिम तिथि:</label>
                  <input
                    type="date"
                    value={cwDueDate}
                    onChange={(e) => setCwDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">शीर्षक / विषय (Title):</label>
                <input
                  type="text"
                  required
                  value={cwTitleHindi}
                  onChange={(e) => setCwTitleHindi(e.target.value)}
                  placeholder="उदा. डिजिटल युग में पुस्तकालय का महत्व"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-hindi text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">निर्देश व संकेत बिंदु (Instructions):</label>
                <textarea
                  required
                  rows={4}
                  value={cwInstructionsHindi}
                  onChange={(e) => setCwInstructionsHindi(e.target.value)}
                  placeholder="छात्रों के लिए निर्देश, आवश्यक प्रारूप व मुख्य बिंदु लिखें..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-hindi text-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={cwSaving}
                className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{cwSaving ? 'असाइन हो रहा है...' : 'छात्र डैशबोर्ड पर गृहकार्य असाइन करें'}</span>
              </button>
            </form>

            {/* Assigned Creative Homeworks List */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900 font-serif-display">
                  सक्रिय रचनात्मक गृहकार्य ({creativeHomeworks.length})
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  छात्रों को लाइव दिखाई देते हैं
                </span>
              </div>

              {creativeHomeworks.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  अभी तक कोई रचनात्मक गृहकार्य असाइन नहीं किया गया है। बाईं ओर के फ़ॉर्म से नया गृहकार्य जोड़ें।
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {creativeHomeworks.map((hw) => {
                    const spec = KATHA_SHILPI_FORMATS[hw.genreId as WritingFormatId];
                    const subCount = creativeSubmissions.filter((s) => s.homeworkId === hw.id).length;
                    return (
                      <div
                        key={hw.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                                {spec?.titleHindi || hw.genreId}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {hw.grade} {hw.section ? `• ${hw.section}` : ''}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {subCount} सबमिशन
                              </span>
                            </div>
                            <h4 className="font-black text-slate-900 text-sm font-hindi">{hw.titleHindi}</h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteCreativeHomework(hw.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="हटाएँ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 font-hindi leading-relaxed">
                          {hw.instructionsHindi}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500">
                          <span>शब्द सीमा: {hw.wordLimit}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> अंतिम तिथि: {hw.dueDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Teacher Review Panel for Student Typed & Handwritten OCR Submissions */}
          <ComprehensiveReportPanel
            isTeacherView={true}
            grade={grade}
            allCreativeSubmissions={creativeSubmissions}
            onReviewSubmission={handleReviewCreativeSubmission}
          />
        </div>
      )}

      {/* ================= TAB 3: CLASS PROGRESS REPORT ================= */}
      {activeTab === 'report' && (() => {
        // Compute overall statistics for this teacher's worksheets
        const allGroups = getAllWorksheetGroups();
        const mySubmissions = studentSubmissions;

        const totalAttempts = mySubmissions.length;
        const totalMarksSum = mySubmissions.reduce((acc, s) => acc + s.score, 0);
        const totalMaxSum = mySubmissions.reduce((acc, s) => acc + s.maxScore, 0);
        const averagePercentage = totalMaxSum > 0 ? Math.round((totalMarksSum / totalMaxSum) * 100) : 0;
        const passCount = mySubmissions.filter(s => s.percentage >= 50).length;
        const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;
        const distinctionCount = mySubmissions.filter(s => s.percentage >= 80).length;
        const distinctionRate = totalAttempts > 0 ? Math.round((distinctionCount / totalAttempts) * 100) : 0;

        // Topic performance breakdown
        const topicStats: Record<string, { totalScore: number; maxScore: number; attempts: number }> = {};
        allGroups.forEach(g => {
          if (!topicStats[g.topic]) {
            topicStats[g.topic] = { totalScore: 0, maxScore: 0, attempts: 0 };
          }
          g.submissions.forEach(s => {
            topicStats[g.topic].totalScore += s.score;
            topicStats[g.topic].maxScore += s.maxScore;
            topicStats[g.topic].attempts += 1;
          });
        });

        // Unique topics for filter dropdown
        const availableTopics = Array.from(new Set(allGroups.map(g => g.topic))).filter(Boolean);

        // Filter groups according to topic filter and search query
        const filteredGroups = allGroups.filter(g => {
          if (reportTopicFilter !== 'ALL' && g.topic !== reportTopicFilter) {
            return false;
          }
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase().trim();
          const matchWs = g.titleHindi.toLowerCase().includes(q) || g.topic.toLowerCase().includes(q) || (g.grade && g.grade.toLowerCase().includes(q));
          const matchStudent = g.submissions.some(s => s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q));
          return matchWs || matchStudent;
        });

        // Combined filtered submissions for combined flat view
        const combinedFilteredSubs = mySubmissions.filter(s => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase().trim();
          return (
            s.studentName.toLowerCase().includes(q) ||
            s.studentEmail.toLowerCase().includes(q) ||
            (s.grade && s.grade.toLowerCase().includes(q))
          );
        });

        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Report Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-start gap-3.5">
                <img
                  src="/assets/aistudio/mail.google_a65ce30f.png"
                  alt="शब्दशिल्प (ShabdShilp) Logo"
                  className="w-12 h-12 rounded-xl object-cover object-center bg-[#091124] border border-slate-200 shadow-xs shrink-0"
                />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 mb-2">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>समग्र कक्षा प्रगति एवं वर्कशीटवार विश्लेषण</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-serif-display">
                    कक्षा रिपोर्ट कार्ड: {teacherName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    शिक्षक आईडी: <strong className="text-slate-800 font-mono">{teacherEmail}</strong> • कुल वर्कशीट्स: <strong>{teacherWorksheets.length}</strong> • कुल सबमिशन: <strong>{studentSubmissions.length}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    printTeacherClassReport({
                      titleHindi: 'समग्र कक्षा प्रगति एवं वर्कशीट विश्लेषण रिपोर्ट',
                      subtitle: `कुल वर्कशीट्स: ${teacherWorksheets.length} • कुल सबमिशन: ${mySubmissions.length}`,
                      teacherName,
                      teacherEmail,
                      totalAttempts,
                      averagePercentage,
                      passRate,
                      passCount,
                      distinctionRate,
                      distinctionCount,
                      topicStats: Object.entries(topicStats).map(([topicName, stat]) => ({
                        topicName,
                        attempts: stat.attempts,
                        percentage:
                          stat.maxScore > 0 ? Math.round((stat.totalScore / stat.maxScore) * 100) : 0,
                      })),
                      worksheets: allGroups.map((g) => {
                        const cnt = g.submissions.length;
                        const avgP =
                          cnt > 0
                            ? Math.round(g.submissions.reduce((a, s) => a + s.percentage, 0) / cnt)
                            : 0;
                        const avgS =
                          cnt > 0
                            ? (g.submissions.reduce((a, s) => a + s.score, 0) / cnt).toFixed(1)
                            : '0';
                        const pr =
                          cnt > 0
                            ? Math.round(
                                (g.submissions.filter((s) => s.percentage >= 50).length / cnt) * 100
                              )
                            : 0;
                        return {
                          titleHindi: g.titleHindi,
                          grade: g.grade,
                          topic: g.topic,
                          section: g.section,
                          questionCount: g.questionCount,
                          attempts: cnt,
                          avgScoreLabel: cnt > 0 ? `${avgS}/${g.questionCount} (${avgP}%)` : '—',
                          passRate: pr,
                        };
                      }),
                      submissions: mySubmissions.map((s) => {
                        const matchedWs = teacherWorksheets.find((w) => w.id === s.worksheetId);
                        return {
                          studentName: s.studentName,
                          studentEmail: s.studentEmail,
                          worksheetTitle: matchedWs ? matchedWs.titleHindi : s.worksheetId,
                          grade: s.grade,
                          score: s.score,
                          maxScore: s.maxScore,
                          percentage: s.percentage,
                          attemptedAt: s.attemptedAt,
                        };
                      }),
                    });
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  title="समग्र कक्षा प्रगति रिपोर्ट प्रिंट करें या PDF में सहेजें"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>🖨️ कक्षा रिपोर्ट प्रिंट करें</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportMasterCSV}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  title="संपूर्ण कक्षा की प्रगति रिपोर्ट वर्कशीटवार CSV में डाउनलोड करें"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                  <span>📊 संपूर्ण कक्षा CSV डाउनलोड</span>
                </button>
              </div>
            </div>

            {/* 4 Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500">कुल छात्र प्रयास</span>
                <div className="text-2xl font-black text-slate-900 font-serif-display">{totalAttempts}</div>
                <div className="text-[11px] text-slate-400">सभी सबमिशन का योग</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500">औसत कक्षा प्राप्तांक</span>
                <div className="text-2xl font-black text-indigo-600 font-serif-display">{averagePercentage}%</div>
                <div className="text-[11px] text-emerald-600 font-medium">समग्र कक्षा का प्रदर्शन</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500">उत्तीर्ण दर (≥50%)</span>
                <div className="text-2xl font-black text-emerald-600 font-serif-display">{passRate}%</div>
                <div className="text-[11px] text-slate-400">{passCount} छात्र उत्तीर्ण</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500">उत्कृष्ट मेधावी (≥80%)</span>
                <div className="text-2xl font-black text-amber-600 font-serif-display">{distinctionRate}%</div>
                <div className="text-[11px] text-slate-400">{distinctionCount} छात्र अव्वल</div>
              </div>
            </div>

            {/* Topic Mastery Distribution */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-base font-black text-slate-900 font-serif-display">
                    विषयवार दक्षता विश्लेषण (Topic Mastery Analysis)
                  </h4>
                </div>
                <span className="text-xs text-slate-400">दक्षता %</span>
              </div>

              {Object.keys(topicStats).length === 0 ? (
                <p className="text-xs text-slate-500 italic py-6 text-center">वर्कशीट तैयार करने पर विषयवार डेटा यहाँ दिखेगा।</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(topicStats).map(([topicName, stat], idx) => {
                    const pct = stat.maxScore > 0 ? Math.round((stat.totalScore / stat.maxScore) * 100) : 0;
                    return (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 truncate">{topicName}</span>
                          <span className="text-slate-600 font-mono font-bold">{pct}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500">{stat.attempts} छात्र प्रयास दर्ज</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Creative Writing & Handwritten OCR Portfolio Review Section */}
            <ComprehensiveReportPanel
              isTeacherView={true}
              grade={grade}
              allCreativeSubmissions={creativeSubmissions}
              onReviewSubmission={handleReviewCreativeSubmission}
            />

            {/* ================= WORKSHEET-WISE STUDENT PERFORMANCE REPORT SECTION ================= */}
            <div className="space-y-5">
              {/* Section Header & Toolbar Controls */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 font-serif-display flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <span>वर्कशीटवार छात्र प्रगति रिपोर्ट (Worksheet-wise Student Progress)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      छात्रों द्वारा हल की गई प्रत्येक वर्कशीट के अनुसार अलग-अलग रिकॉर्ड समूहबद्ध है (उदा. संज्ञा की वर्कशीट का परिणाम संज्ञा के अंतर्गत दिखेगा)।
                    </p>
                  </div>

                  {/* View Mode Switcher */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => setReportViewMode('byWorksheet')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        reportViewMode === 'byWorksheet'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>📑 वर्कशीटवार समूह दृश्य</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportViewMode('combined')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        reportViewMode === 'combined'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>👥 समग्र छात्र सूची</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                  {/* Topic Filter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                      <Filter className="w-3.5 h-3.5 text-indigo-600" />
                      <span>विषय फ़िल्टर:</span>
                    </div>
                    <select
                      value={reportTopicFilter}
                      onChange={(e) => setReportTopicFilter(e.target.value)}
                      className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden cursor-pointer"
                    >
                      <option value="ALL">सभी विषय (All Topics - {allGroups.length})</option>
                      {availableTopics.map((top, idx) => (
                        <option key={idx} value={top}>{top}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="छात्र का नाम, ईमेल या वर्कशीट खोजें..."
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 transition-all outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* ================= VIEW 1: GROUPED BY WORKSHEET ================= */}
              {reportViewMode === 'byWorksheet' && (
                <div className="space-y-6">
                  {filteredGroups.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-2">
                      <p className="text-sm font-bold text-slate-700">कोई वर्कशीट परिणाम नहीं मिला</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery ? `"${searchQuery}" से मेल खाता कोई रिकॉर्ड उपलब्ध नहीं है।` : 'अभी तक कोई वर्कशीट अपलोड नहीं हुई है।'}
                      </p>
                    </div>
                  ) : (
                    filteredGroups.map((group) => {
                      // Filter submissions inside this group by search query if applicable
                      const wsSubs = group.submissions.filter(s => {
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase().trim();
                        return (
                          s.studentName.toLowerCase().includes(q) ||
                          s.studentEmail.toLowerCase().includes(q) ||
                          (s.grade && s.grade.toLowerCase().includes(q))
                        );
                      });

                      const totalGroupAttempts = group.submissions.length;
                      const avgPct = totalGroupAttempts > 0
                        ? Math.round(group.submissions.reduce((acc, s) => acc + s.percentage, 0) / totalGroupAttempts)
                        : 0;
                      const avgScore = totalGroupAttempts > 0
                        ? (group.submissions.reduce((acc, s) => acc + s.score, 0) / totalGroupAttempts).toFixed(1)
                        : 0;
                      const passRate = totalGroupAttempts > 0
                        ? Math.round((group.submissions.filter(s => s.percentage >= 50).length / totalGroupAttempts) * 100)
                        : 0;

                      return (
                        <div
                          key={group.id}
                          className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5 transition-all hover:border-slate-300"
                        >
                          {/* Worksheet Group Header */}
                          <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                                  {group.topic}
                                </span>
                                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                  {group.grade} {group.section ? `• ${group.section}` : ''}
                                </span>
                                {group.difficulty && (
                                  <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                    कठिनाई: {group.difficulty}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xl font-black text-slate-900 font-serif-display">
                                {group.titleHindi}
                              </h4>

                              {/* Performance KPI Badges for this Worksheet */}
                              <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-1">
                                <span>कुल प्रश्न: <strong className="text-slate-900">{group.questionCount}</strong></span>
                                <span className="text-slate-300">•</span>
                                <span>कुल छात्र प्रयास: <strong className="text-indigo-600 font-bold">{totalGroupAttempts}</strong></span>
                                {totalGroupAttempts > 0 && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span>औसत प्राप्तांक: <strong className="text-emerald-700 font-bold">{avgScore} / {group.questionCount} ({avgPct}%)</strong></span>
                                    <span className="text-slate-300">•</span>
                                    <span>उत्तीर्ण प्रतिशत: <strong className="text-emerald-700 font-bold">{passRate}%</strong></span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Actions for this specific worksheet */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Single Worksheet CSV Download Button */}
                              <button
                                type="button"
                                onClick={() => handleExportWorksheetCSV(group, group.submissions)}
                                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                title="इस विशिष्ट वर्कशीट के सभी छात्रों के प्राप्तांक CSV में डाउनलोड करें"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-700" />
                                <span>इसकी CSV डाउनलोड</span>
                              </button>

                              {totalGroupAttempts > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyScores(group.id, group.titleHindi)}
                                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                >
                                  {copiedScoresId === group.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>कॉपी हुआ!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                                      <span>स्कोर कॉपी</span>
                                    </>
                                  )}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  printTeacherClassReport(
                                    buildTeacherSubmissionWorksheetMeta(
                                      group,
                                      group.submissions,
                                      teacherName,
                                      teacherEmail
                                    )
                                  )
                                }
                                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                title="इस वर्कशीट की छात्र प्रगति रिपोर्ट प्रिंट करें"
                              >
                                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                                <span>रिपोर्ट प्रिंट</span>
                              </button>

                              {group.questions && group.questions.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handlePrintWorksheet(group as any)}
                                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                  title="इस वर्कशीट के प्रश्न प्रिंट करें"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                                  <span>वर्कशीट प्रिंट</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Student Submissions Table for this specific worksheet */}
                          {wsSubs.length === 0 ? (
                            <div className="p-5 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 text-center space-y-1">
                              {totalGroupAttempts > 0 && searchQuery ? (
                                <p className="font-medium text-slate-600">इस वर्कशीट में "{searchQuery}" से मेल खाता कोई छात्र नहीं मिला।</p>
                              ) : (
                                <>
                                  <p className="font-medium text-slate-700">अभी तक किसी भी छात्र ने इस वर्कशीट का प्रयास नहीं किया है।</p>
                                  <p className="text-[11px] text-slate-400">जैसे ही छात्र अपनी आईडी से यह वर्कशीट हल करेंगे, उनके प्राप्तांक व समय यहाँ लाइव जुड़ जाएंगे।</p>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                    <th className="p-3 font-bold">क्र.सं.</th>
                                    <th className="p-3 font-bold">छात्र का नाम</th>
                                    <th className="p-3 font-bold">ईमेल आईडी</th>
                                    <th className="p-3 font-bold">कक्षा/सेक्शन</th>
                                    <th className="p-3 font-bold">प्राप्तांक (Score)</th>
                                    <th className="p-3 font-bold">प्रतिशत (%)</th>
                                    <th className="p-3 font-bold">प्रदर्शन श्रेणी</th>
                                    <th className="p-3 font-bold">जमा करने का समय</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {wsSubs.map((sub, sIdx) => (
                                    <tr key={sIdx} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                      <td className="p-3 font-semibold text-slate-500">{sIdx + 1}</td>
                                      <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                                      <td className="p-3 text-slate-600 font-mono text-[11px]">{sub.studentEmail}</td>
                                      <td className="p-3 text-slate-700">{sub.grade || group.grade}</td>
                                      <td className="p-3 font-black text-indigo-950 text-sm">
                                        {sub.score} / {sub.maxScore}
                                      </td>
                                      <td className="p-3">
                                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                          sub.percentage >= 80
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : sub.percentage >= 50
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-rose-100 text-rose-800'
                                        }`}>
                                          {sub.percentage}%
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <span className={`text-[10px] font-bold ${
                                          sub.percentage >= 80 ? 'text-emerald-700' :
                                          sub.percentage >= 60 ? 'text-indigo-700' :
                                          sub.percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                                        }`}>
                                          {sub.percentage >= 80 ? '🌟 उत्कृष्ट (A+)' :
                                           sub.percentage >= 60 ? '✨ प्रथम (A)' :
                                           sub.percentage >= 50 ? '👍 द्वितीय (B)' : '⚠️ सुधार अपेक्षित (C)'}
                                        </span>
                                      </td>
                                      <td className="p-3 text-slate-500 text-[11px]">{sub.attemptedAt}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ================= VIEW 2: COMBINED ALL STUDENTS TABLE ================= */}
              {reportViewMode === 'combined' && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-slate-100">
                    <h5 className="font-bold text-slate-900 text-sm">
                      समग्र छात्र रिकॉर्ड सूची ({combinedFilteredSubs.length} छात्र प्रयास)
                    </h5>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          printTeacherClassReport({
                            titleHindi: 'समग्र छात्र रिकॉर्ड रिपोर्ट (Student Submissions Report)',
                            subtitle: `फ़िल्टर किए गए प्रयास: ${combinedFilteredSubs.length}`,
                            teacherName,
                            teacherEmail,
                            totalAttempts: combinedFilteredSubs.length,
                            averagePercentage:
                              combinedFilteredSubs.length > 0
                                ? Math.round(
                                    combinedFilteredSubs.reduce((a, s) => a + s.percentage, 0) /
                                      combinedFilteredSubs.length
                                  )
                                : 0,
                            passCount: combinedFilteredSubs.filter((s) => s.percentage >= 50).length,
                            passRate:
                              combinedFilteredSubs.length > 0
                                ? Math.round(
                                    (combinedFilteredSubs.filter((s) => s.percentage >= 50).length /
                                      combinedFilteredSubs.length) *
                                      100
                                  )
                                : 0,
                            distinctionCount: combinedFilteredSubs.filter((s) => s.percentage >= 80)
                              .length,
                            distinctionRate:
                              combinedFilteredSubs.length > 0
                                ? Math.round(
                                    (combinedFilteredSubs.filter((s) => s.percentage >= 80).length /
                                      combinedFilteredSubs.length) *
                                      100
                                  )
                                : 0,
                            submissions: combinedFilteredSubs.map((s) => {
                              const matchedWs = teacherWorksheets.find((w) => w.id === s.worksheetId);
                              return {
                                studentName: s.studentName,
                                studentEmail: s.studentEmail,
                                worksheetTitle: matchedWs ? matchedWs.titleHindi : s.worksheetId,
                                grade: s.grade,
                                score: s.score,
                                maxScore: s.maxScore,
                                percentage: s.percentage,
                                attemptedAt: s.attemptedAt,
                              };
                            }),
                          })
                        }
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-300" />
                        <span>प्रिंट रिपोर्ट</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportMasterCSV}
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-700" />
                        <span>CSV एक्सपोर्ट करें</span>
                      </button>
                    </div>
                  </div>

                  {combinedFilteredSubs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-50 rounded-2xl border border-slate-200">
                      {searchQuery ? `"${searchQuery}" से मेल खाता कोई रिकॉर्ड नहीं मिला।` : 'अभी तक कोई छात्र रिकॉर्ड दर्ज नहीं है।'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                            <th className="p-3 font-bold">क्र.सं.</th>
                            <th className="p-3 font-bold">छात्र का नाम</th>
                            <th className="p-3 font-bold">ईमेल आईडी</th>
                            <th className="p-3 font-bold">वर्कशीट / विषय</th>
                            <th className="p-3 font-bold">प्राप्तांक</th>
                            <th className="p-3 font-bold">प्रतिशत</th>
                            <th className="p-3 font-bold">श्रेणी</th>
                            <th className="p-3 font-bold">जमा करने का समय</th>
                          </tr>
                        </thead>
                        <tbody>
                          {combinedFilteredSubs.map((sub, sIdx) => {
                            const matchedWs = teacherWorksheets.find(w => w.id === sub.worksheetId);
                            const wsLabel = matchedWs ? matchedWs.titleHindi : sub.worksheetId;
                            return (
                              <tr key={sIdx} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                <td className="p-3 font-semibold text-slate-500">{sIdx + 1}</td>
                                <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                                <td className="p-3 text-slate-600 font-mono text-[11px]">{sub.studentEmail}</td>
                                <td className="p-3 text-indigo-900 font-medium max-w-[200px] truncate" title={wsLabel}>
                                  {wsLabel}
                                </td>
                                <td className="p-3 font-black text-indigo-950 text-sm">
                                  {sub.score} / {sub.maxScore}
                                </td>
                                <td className="p-3">
                                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                    sub.percentage >= 80
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : sub.percentage >= 50
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {sub.percentage}%
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`text-[10px] font-bold ${
                                    sub.percentage >= 80 ? 'text-emerald-700' :
                                    sub.percentage >= 60 ? 'text-indigo-700' :
                                    sub.percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                                  }`}>
                                    {sub.percentage >= 80 ? '🌟 A+' : sub.percentage >= 60 ? '✨ A' : sub.percentage >= 50 ? '👍 B' : '⚠️ C'}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-500 text-[11px]">{sub.attemptedAt}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
