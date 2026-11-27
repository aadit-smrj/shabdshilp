import React, { useEffect, useState } from 'react';
import {
  Coins,
  Compass,
  BookOpen,
  Layers,
  History,
  Languages,
  FileCheck,
  GraduationCap,
  Award,
  Palette,
  Check,
  X,
  Sparkle,
  PenTool,
  Menu,
  LogOut,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { BoardType, GradeLevel } from '../types';
import { AppTheme, THEMES_LIST, getThemeConfig } from '../utils/theme';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  wordCoins: number;
  correctAnswersTotal: number;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  selectedBoard?: BoardType;
  onSelectBoard?: (board: BoardType) => void;
  bilingualMode: boolean;
  onToggleBilingual: () => void;
  isTeacherUser?: boolean;
  currentUser?: { email: string; userName: string; grade: GradeLevel } | null;
  onLogout?: () => void;
  theme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  focusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  wordCoins,
  selectedGrade,
  onSelectGrade,
  bilingualMode,
  onToggleBilingual,
  isTeacherUser = false,
  currentUser = null,
  onLogout,
  theme = 'indigo',
  onSelectTheme,
  focusMode = false,
  onToggleFocusMode,
}) => {
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);
  const themeConfig = getThemeConfig(theme);
  const grades: GradeLevel[] = [
    'कक्षा 5',
    'कक्षा 6',
    'कक्षा 7',
    'कक्षा 8',
    'कक्षा 9',
    'कक्षा 10',
  ];

  const navItems = isTeacherUser
    ? [{ id: 'dashboard', labelHindi: 'शिक्षक नियंत्रण कक्ष', labelEnglish: 'Teacher Center', icon: History }]
    : [
        { id: 'dashboard', labelHindi: 'डैशबोर्ड व कालचक्र', labelEnglish: 'Dashboard', icon: History },
        { id: 'syllabus', labelHindi: 'पाठ्यक्रम', labelEnglish: 'Syllabus', icon: GraduationCap },
        { id: 'custom_worksheet', labelHindi: 'कस्टम वर्कशीट', labelEnglish: 'Custom Worksheet', icon: FileCheck },
        { id: 'modules', labelHindi: 'व्याकरण सिमुलेशन', labelEnglish: 'Simulations', icon: Layers },
        { id: 'upsarg-pratyay', labelHindi: 'उपसर्ग-प्रत्यय', labelEnglish: 'Affixes', icon: Compass },
        { id: 'gadyansh', labelHindi: 'अपठित गद्यांश', labelEnglish: 'Comprehension', icon: BookOpen },
        { id: 'story-builder', labelHindi: 'कथा शिल्पी AI', labelEnglish: 'ICSE Writing Studio', icon: PenTool },
        { id: 'worksheets', labelHindi: 'वर्कशीट्स स्टोर', labelEnglish: 'Worksheets', icon: Award },
      ];

  const activeNavItem = navItems.find((item) => item.id === currentTab) || navItems[0];

  useEffect(() => {
    if (focusMode) {
      setIsNavDrawerOpen(false);
      setShowThemeModal(false);
    }
  }, [focusMode]);

  useEffect(() => {
    if (!isNavDrawerOpen && !showThemeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNavDrawerOpen(false);
        setShowThemeModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavDrawerOpen, showThemeModal]);

  const handleSelectNavOption = (tabId: string) => {
    onSelectTab(tabId);
    setIsNavDrawerOpen(false);
  };

  if (focusMode) {
    return (
      <header className="sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
        <div
          className={`${themeConfig.topBannerGradient} ${
            themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'
          } px-4 sm:px-8 py-2 text-xs transition-colors duration-500`}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/assets/aistudio/mail.google_a65ce30f.png"
                alt="शब्दशिल्प (ShabdShilp) Logo"
                className="w-8 h-8 rounded-lg object-cover object-center shadow-xs border border-white/25 bg-[#091124] shrink-0"
              />
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-black text-sm font-serif-display truncate">
                  {activeNavItem.labelHindi}
                </span>
                {bilingualMode && activeNavItem.labelEnglish && (
                  <span
                    className={`hidden sm:inline text-[11px] font-semibold truncate ${
                      themeConfig.isLightBanner ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    ({activeNavItem.labelEnglish})
                  </span>
                )}
                <span
                  className={`hidden md:inline ${
                    themeConfig.isLightBanner ? 'text-slate-950/35' : 'text-white/35'
                  }`}
                  aria-hidden="true"
                >
                  ·
                </span>
                <span
                  className={`hidden md:inline font-bold whitespace-nowrap ${
                    themeConfig.isLightBanner ? 'text-slate-900' : 'text-amber-200'
                  }`}
                >
                  ICSE · {selectedGrade} · एकाग्र मोड
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onToggleBilingual}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer font-bold text-[11px] whitespace-nowrap shrink-0 ${
                  bilingualMode
                    ? themeConfig.isLightBanner
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-white/20 text-white border-white/30'
                    : themeConfig.isLightBanner
                    ? 'bg-white/75 text-slate-950 border-slate-950/20'
                    : 'bg-white/10 text-white/90 border-white/20'
                }`}
                title="द्विभाषी अनुवाद चालू या बंद करें"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {bilingualMode ? 'द्विभाषी' : 'केवल हिन्दी'}
                </span>
              </button>

              {onToggleFocusMode && (
                <button
                  type="button"
                  onClick={onToggleFocusMode}
                  aria-pressed={true}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-black text-[11px] shadow-xs whitespace-nowrap shrink-0 ${
                    themeConfig.isLightBanner
                      ? 'bg-slate-950 hover:bg-slate-800 text-white border-slate-950'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300'
                  }`}
                  title="एकाग्र मोड बंद करें और सभी मेनू वापस लाएँ (Esc)"
                >
                  <Minimize2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {bilingualMode ? 'एकाग्र मोड बंद करें (Exit · Esc)' : 'एकाग्र मोड बंद करें'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        {/* Top Utility Bar with Top-Left 3-Line Menu Button */}
        <div className={`${themeConfig.topBannerGradient} ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'} px-3 sm:px-4 py-1.5 text-xs transition-colors duration-500 shadow-xs relative z-40`}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              {/* Top-Left 3-Line Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsNavDrawerOpen((prev) => !prev)}
                aria-label="डैशबोर्ड विकल्प खोलें (Open Dashboard Options)"
                aria-expanded={isNavDrawerOpen}
                aria-controls="shabdshilp-nav-drawer"
                title="डैशबोर्ड विकल्प खोलें (Dashboard Options)"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                  themeConfig.isLightBanner
                    ? 'bg-slate-950/10 hover:bg-slate-950/20 border-slate-950/20 text-slate-950'
                    : 'bg-white/15 hover:bg-white/25 border-white/25 text-white'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>

              <img
                src="/assets/aistudio/mail.google_a65ce30f.png"
                alt="शब्दशिल्प (ShabdShilp) Logo"
                className="w-9 h-9 rounded-lg object-cover object-center shadow-xs border border-white/25 bg-[#091124] shrink-0"
              />
              <img
                src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                alt="TechPreneur Logo"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-lg bg-white p-0.5 object-contain shadow-xs shrink-0"
              />

              <div className="flex items-center gap-2 text-xs">
                <span className={`font-bold whitespace-nowrap ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}`}>
                  {isTeacherUser ? selectedGrade : `ICSE · ${selectedGrade}`}
                </span>
                <span className={`${themeConfig.isLightBanner ? 'text-slate-950/35' : 'text-white/40'} hidden md:inline`} aria-hidden="true">·</span>
                <span className={`font-semibold hidden md:inline whitespace-nowrap ${themeConfig.isLightBanner ? 'text-slate-900' : 'text-slate-200'}`}>
                  {activeNavItem.labelHindi}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Theme Selection */}
              <div
                className={`flex items-center backdrop-blur-md p-0.5 sm:px-1.5 sm:py-0.5 rounded-xl border gap-1 shadow-2xs ${
                  themeConfig.isLightBanner
                    ? 'bg-slate-950/85 border-slate-950/25'
                    : 'bg-black/35 border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setShowThemeModal(true)}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-black text-amber-300 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
                  title="थीम स्टूडियो खोलें (Open Theme Studio)"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-300" />
                  <span>थीम (Theme):</span>
                </button>

                {/* 4 Plain Colors Tabs */}
                <div className="flex items-center gap-0.5 bg-black/20 p-0.5 rounded-lg border border-white/10">
                  {THEMES_LIST.filter((t) => t.type === 'plain').map((t) => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onSelectTheme?.(t.id)}
                        className={`group relative flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-white text-slate-950 shadow-sm'
                            : 'text-white/80 hover:text-white hover:bg-white/15'
                        }`}
                        title={`${t.nameHindi} (सादा रंग / Plain Color)`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/40 shadow-xs"
                          style={{ backgroundColor: t.previewColor }}
                        />
                        <span className="hidden sm:inline font-hindi">{t.shortNameHindi}</span>
                        {isSelected && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* 1 Multicolor Theme Tab */}
                {THEMES_LIST.filter((t) => t.type === 'multicolor').map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onSelectTheme?.(t.id)}
                      className={`group relative flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300 text-slate-950 shadow-sm ring-1 ring-white'
                          : 'bg-white/15 hover:bg-white/25 text-amber-200'
                      }`}
                      title={`${t.nameHindi} (बहुरंगी थीम / 1 Multicolor Option)`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ background: t.previewColor }}
                      />
                      <span>🌈 बहुरंगी</span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Bilingual Mode Toggle */}
              <button
                type="button"
                onClick={onToggleBilingual}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all cursor-pointer font-bold text-[11px] shadow-2xs whitespace-nowrap shrink-0 ${
                  bilingualMode
                    ? themeConfig.isLightBanner
                      ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                      : 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300/40 shadow-sm'
                    : themeConfig.isLightBanner
                    ? 'bg-white/75 hover:bg-white/95 text-slate-950 border-slate-950/20'
                    : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/20'
                }`}
                title="द्विभाषी अनुवाद चालू या बंद करें (Toggle English Translation Support)"
              >
                <Languages
                  className={`w-3.5 h-3.5 ${
                    bilingualMode
                      ? themeConfig.isLightBanner
                        ? 'text-amber-300'
                        : 'text-slate-950'
                      : themeConfig.isLightBanner
                      ? 'text-slate-900'
                      : 'text-amber-300'
                  }`}
                />
                <span>{bilingualMode ? 'द्विभाषी: चालू (Hindi + Eng)' : 'केवल हिन्दी (Only Hindi)'}</span>
              </button>

              {/* Focus Mode Toggle */}
              {onToggleFocusMode && !isTeacherUser && (
                <button
                  type="button"
                  onClick={onToggleFocusMode}
                  aria-pressed={focusMode}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all cursor-pointer font-bold text-[11px] shadow-2xs whitespace-nowrap shrink-0 ${
                    currentTab === 'gadyansh' || currentTab === 'story-builder'
                      ? themeConfig.isLightBanner
                        ? 'bg-white/95 hover:bg-white text-slate-950 border-slate-950/35 ring-1 ring-slate-950/15'
                        : 'bg-white/20 hover:bg-white/30 text-white border-amber-300/60'
                      : themeConfig.isLightBanner
                      ? 'bg-white/75 hover:bg-white/95 text-slate-950 border-slate-950/20'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/20'
                  }`}
                  title="पूर्ण स्क्रीन एकाग्रता हेतु साइडबार व नेविगेशन छिपाएँ (Hide Sidebar & Navigation for Focus Mode)"
                >
                  <Maximize2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      themeConfig.isLightBanner ? 'text-slate-900' : 'text-amber-300'
                    }`}
                  />
                  <span>{bilingualMode ? 'एकाग्र मोड (Focus Mode)' : 'एकाग्र मोड'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Compact Brand, Grade & Account Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-11 h-11 rounded-xl object-cover object-center shadow-sm border border-slate-200/80 bg-[#091124] group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-serif-display leading-tight whitespace-nowrap">
                शब्द शिल्प
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-none whitespace-nowrap">
                {isTeacherUser ? 'शिक्षक पोर्टल · Teacher Portal' : 'ShabdShilp · ICSE हिंदी व्याकरण'}
              </p>
            </div>
          </div>

          {/* Grade Selector, WordCoins & Account */}
          <div className="flex items-center gap-2 shrink-0">
            {!isTeacherUser && (
              <>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                  <span className="px-2 font-bold text-slate-600 hidden md:inline text-[11px]">कक्षा:</span>
                  <select
                    value={selectedGrade}
                    onChange={(e) => onSelectGrade(e.target.value as GradeLevel)}
                    className="bg-white font-bold text-slate-800 rounded-lg px-2.5 py-1 border border-slate-200/90 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 cursor-pointer text-xs"
                  >
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab('worksheets')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/90 rounded-xl shadow-2xs cursor-pointer hover:bg-amber-100/80 transition-all group whitespace-nowrap"
                  title="हर सही उत्तर = WordCoins"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 shadow-2xs group-hover:rotate-12 transition-transform">
                    <Coins className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                  <div className="text-xs font-black text-amber-900 leading-none tabular-nums">
                    {wordCoins} <span className="text-[10px] text-amber-700 font-semibold hidden sm:inline">Coins</span>
                  </div>
                </button>
              </>
            )}

            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-2xs ${
                    isTeacherUser
                      ? 'bg-violet-50 text-violet-900 border-violet-200'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  }`}
                  title={`सक्रिय खाता: ${currentUser.email}`}
                >
                  <span className="max-w-[110px] truncate sm:max-w-none">
                    {currentUser.userName}
                  </span>
                  <span className="text-[10px] opacity-70 hidden md:inline font-mono">({currentUser.email})</span>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
                    title="इस टैब से खाता बदलें या लॉगआउट करें"
                  >
                    खाता बदलें
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Left Navigation Drawer opened from Top-Left 3-Line Menu */}
      {isNavDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="डैशबोर्ड विकल्प (Dashboard Options)"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          {/* Left Drawer Panel */}
          <aside
            id="shabdshilp-nav-drawer"
            className="relative z-10 w-80 max-w-[85vw] h-full bg-white shadow-2xl border-r border-slate-200 flex flex-col animate-in slide-in-from-left duration-200"
          >
            {/* Drawer Header */}
            <div className={`${themeConfig.topBannerGradient} ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'} px-5 py-4 flex items-center justify-between gap-3 shrink-0`}>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/assets/aistudio/mail.google_a65ce30f.png"
                  alt="शब्दशिल्प (ShabdShilp) Logo"
                  className="w-11 h-11 rounded-xl object-cover object-center shadow-xs border border-white/25 bg-[#091124] shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-black text-base font-serif-display truncate">
                    शब्द शिल्प (ShabdShilp)
                  </div>
                  <div className={`text-[11px] truncate ${themeConfig.isLightBanner ? 'text-slate-900 font-semibold' : 'text-slate-200'}`}>
                    {isTeacherUser ? `शिक्षक पोर्टल · ${selectedGrade}` : `ICSE · ${selectedGrade}`}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNavDrawerOpen(false)}
                aria-label="मेनू बंद करें (Close Menu)"
                className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                  themeConfig.isLightBanner
                    ? 'bg-slate-950/10 hover:bg-slate-950/20 text-slate-950'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Options */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5" aria-label="मुख्य विकल्प">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500">
                {bilingualMode ? 'डैशबोर्ड विकल्प · Dashboard Options' : 'डैशबोर्ड विकल्प'}
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectNavOption(item.id)}
                    className={`w-full min-h-[44px] flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left font-bold transition-all cursor-pointer ${
                      isActive
                        ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-sm`
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? themeConfig.isLightBanner
                              ? 'text-slate-950'
                              : 'text-amber-300'
                            : 'text-slate-400'
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="block text-sm font-bold leading-snug truncate">
                          {item.labelHindi}
                        </span>
                        {bilingualMode && item.labelEnglish && (
                          <span
                            className={`block text-[11px] font-medium leading-tight truncate ${
                              isActive
                                ? themeConfig.isLightBanner
                                  ? 'text-slate-900'
                                  : 'text-amber-100'
                                : 'text-slate-500'
                            }`}
                          >
                            {item.labelEnglish}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? themeConfig.isLightBanner
                            ? 'text-slate-950'
                            : 'text-amber-300'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            {currentUser && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5 shrink-0">
                <div className="text-xs">
                  <div className="font-bold text-slate-900 truncate">{currentUser.userName}</div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                </div>
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsNavDrawerOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>खाता बदलें / लॉगआउट</span>
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Interactive Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <Palette className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-serif-display">
                    ऐप थीम स्टूडियो (Theme Studio)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ४ सादे रंग (4 Plain Colors) + १ बहुरंगी विकल्प (1 Multicolor Theme)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Plain Colors Category */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>सादे रंग (4 Plain Colors)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES_LIST.filter((t) => t.type === 'plain').map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectTheme?.(t.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-xl shadow-xs shrink-0 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: t.previewColor }}
                      >
                        {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{t.nameHindi}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{t.descriptionHindi}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1 Multicolor Option Category */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-amber-500" />
                <span>विशेष बहुरंगी थीम (1 Multicolor Option)</span>
              </div>
              {THEMES_LIST.filter((t) => t.type === 'multicolor').map((t) => {
                const isSelected = theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTheme?.(t.id);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-500 bg-gradient-to-r from-amber-50 via-rose-50 to-cyan-50 shadow-md ring-2 ring-amber-400/25'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-2xl shadow-sm shrink-0 flex items-center justify-center text-slate-950 font-bold text-lg"
                        style={{ background: t.previewColor }}
                      >
                        {isSelected ? <Check className="w-5 h-5 stroke-[3]" /> : '🌈'}
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                          <span>{t.nameHindi}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300 text-slate-950 font-bold border border-amber-400/40">
                            प्रिज़्म ग्रेडिएंट
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">{t.descriptionHindi}</div>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all ${
                        isSelected
                          ? 'bg-slate-950 text-white'
                          : 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300 text-slate-950'
                      }`}
                    >
                      {isSelected ? 'सक्रिय है' : 'लागू करें'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs"
              >
                पूर्ण (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

