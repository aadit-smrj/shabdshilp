export type AppTheme = 'indigo' | 'emerald' | 'violet' | 'rose' | 'multicolor';

export interface ThemeConfig {
  id: AppTheme;
  nameHindi: string;
  shortNameHindi: string;
  nameEnglish: string;
  type: 'plain' | 'multicolor';
  isLightBanner: boolean;
  primaryTextOnBg: string;
  previewColor: string;
  dotClass: string;
  topBannerGradient: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryBorder: string;
  primaryShadow: string;
  logoGradient: string;
  teacherBannerGradient: string;
  studentHeroGradient: string;
  featureBannerGradient: string;
  featureBannerBorder: string;
  footerGradient: string;
  footerBorder: string;
  badgeBg: string;
  badgeText: string;
  bodyBg: string;
  descriptionHindi: string;
}

export const THEMES_LIST: ThemeConfig[] = [
  {
    id: 'indigo',
    nameHindi: 'नीला (Indigo Blue)',
    shortNameHindi: 'नीला',
    nameEnglish: 'Indigo Blue',
    type: 'plain',
    isLightBanner: false,
    primaryTextOnBg: 'text-white',
    previewColor: '#4f46e5',
    dotClass: 'bg-indigo-600',
    topBannerGradient: 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    primaryText: 'text-indigo-600',
    primaryBorder: 'border-indigo-600',
    primaryShadow: 'shadow-indigo-600/30',
    logoGradient: 'bg-gradient-to-br from-indigo-600 to-violet-700',
    teacherBannerGradient: 'bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900',
    studentHeroGradient: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900',
    featureBannerGradient: 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900',
    featureBannerBorder: 'border-indigo-700/60',
    footerGradient: 'bg-slate-900',
    footerBorder: 'border-slate-800',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    bodyBg: '#F8FAFC',
    descriptionHindi: 'क्लासिक गहरा नीला व इंडिगो रंग'
  },
  {
    id: 'emerald',
    nameHindi: 'हरा (Emerald Green)',
    shortNameHindi: 'हरा',
    nameEnglish: 'Emerald Green',
    type: 'plain',
    isLightBanner: false,
    primaryTextOnBg: 'text-white',
    previewColor: '#059669',
    dotClass: 'bg-emerald-600',
    topBannerGradient: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    primaryBorder: 'border-emerald-600',
    primaryShadow: 'shadow-emerald-600/30',
    logoGradient: 'bg-gradient-to-br from-emerald-600 to-teal-700',
    teacherBannerGradient: 'bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-900',
    studentHeroGradient: 'bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900',
    featureBannerGradient: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900',
    featureBannerBorder: 'border-emerald-700/60',
    footerGradient: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950',
    footerBorder: 'border-emerald-900/70',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    bodyBg: '#F4FBF7',
    descriptionHindi: 'प्राकृतिक पन्ना व शांत हरा रंग'
  },
  {
    id: 'violet',
    nameHindi: 'बैंगनी (Purple Violet)',
    shortNameHindi: 'बैंगनी',
    nameEnglish: 'Purple Violet',
    type: 'plain',
    isLightBanner: false,
    primaryTextOnBg: 'text-white',
    previewColor: '#7c3aed',
    dotClass: 'bg-violet-600',
    topBannerGradient: 'bg-gradient-to-r from-purple-950 via-violet-900 to-slate-900',
    primaryBg: 'bg-violet-600',
    primaryHover: 'hover:bg-violet-700',
    primaryText: 'text-violet-600',
    primaryBorder: 'border-violet-600',
    primaryShadow: 'shadow-violet-600/30',
    logoGradient: 'bg-gradient-to-br from-purple-600 to-violet-700',
    teacherBannerGradient: 'bg-gradient-to-br from-violet-700 via-purple-800 to-violet-900',
    studentHeroGradient: 'bg-gradient-to-r from-slate-900 via-purple-950 to-violet-900',
    featureBannerGradient: 'bg-gradient-to-r from-purple-950 via-violet-900 to-slate-900',
    featureBannerBorder: 'border-violet-700/60',
    footerGradient: 'bg-gradient-to-r from-purple-950 via-slate-900 to-violet-950',
    footerBorder: 'border-violet-900/70',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    bodyBg: '#FAF7FD',
    descriptionHindi: 'भव्य गहरा पर्पल व बैंगनी रंग'
  },
  {
    id: 'rose',
    nameHindi: 'लाल (Ruby Crimson)',
    shortNameHindi: 'लाल',
    nameEnglish: 'Ruby Crimson',
    type: 'plain',
    isLightBanner: false,
    primaryTextOnBg: 'text-white',
    previewColor: '#e11d48',
    dotClass: 'bg-rose-600',
    topBannerGradient: 'bg-gradient-to-r from-rose-950 via-red-900 to-slate-900',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-600',
    primaryShadow: 'shadow-rose-600/30',
    logoGradient: 'bg-gradient-to-br from-rose-600 to-red-700',
    teacherBannerGradient: 'bg-gradient-to-br from-rose-700 via-red-800 to-rose-900',
    studentHeroGradient: 'bg-gradient-to-r from-slate-900 via-rose-950 to-red-900',
    featureBannerGradient: 'bg-gradient-to-r from-rose-950 via-red-900 to-slate-900',
    featureBannerBorder: 'border-rose-700/60',
    footerGradient: 'bg-gradient-to-r from-rose-950 via-slate-900 to-red-950',
    footerBorder: 'border-rose-900/70',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    bodyBg: '#FFF8F8',
    descriptionHindi: 'ऊर्जावान रूबी लाल व गहरा गुलाबी रंग'
  },
  {
    id: 'multicolor',
    nameHindi: 'इंद्रधनुष (Prism Rainbow)',
    shortNameHindi: 'बहुरंगी',
    nameEnglish: 'Multicolor Rainbow',
    type: 'multicolor',
    isLightBanner: true,
    primaryTextOnBg: 'text-slate-950',
    previewColor: 'linear-gradient(135deg, #fbbf24 0%, #fda4af 50%, #67e8f9 100%)',
    dotClass: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    topBannerGradient: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    primaryBg: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    primaryHover: 'hover:opacity-90',
    primaryText: 'text-cyan-700',
    primaryBorder: 'border-amber-400',
    primaryShadow: 'shadow-amber-400/30',
    logoGradient: 'bg-gradient-to-br from-amber-400 via-rose-300 to-cyan-300',
    teacherBannerGradient: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    studentHeroGradient: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    featureBannerGradient: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    featureBannerBorder: 'border-amber-500/40',
    footerGradient: 'bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-300',
    footerBorder: 'border-amber-500/35',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-slate-900',
    bodyBg: 'linear-gradient(135deg, #fffbeb 0%, #fff1f2 50%, #ecfeff 100%)',
    descriptionHindi: 'सुनहरा पीला, गुलाबी और आसमानी सियान की चमकदार बहुरंगी छटा'
  }
];

export function getThemeConfig(themeId: AppTheme): ThemeConfig {
  return THEMES_LIST.find((t) => t.id === themeId) || THEMES_LIST[0];
}

export function loadSavedTheme(): AppTheme {
  let theme: AppTheme = 'indigo';
  try {
    const saved = localStorage.getItem('shabdshilp_app_theme');
    if (saved && (saved === 'indigo' || saved === 'emerald' || saved === 'violet' || saved === 'rose' || saved === 'multicolor')) {
      theme = saved as AppTheme;
    }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
  return theme;
}

export function saveAppTheme(theme: AppTheme) {
  try {
    localStorage.setItem('shabdshilp_app_theme', theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      const config = getThemeConfig(theme);
      document.body.style.background = config.bodyBg;
    }
  } catch (e) {}
}
