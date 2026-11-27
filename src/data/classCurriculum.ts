import { GradeLevel } from '../types';

export interface WorksheetTopicConfig {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  icon: string;
  bankKeys: string[];
}

export interface FeaturedSimCard {
  moduleId: string;
  tag: string;
  title: string;
  description: string;
  footerTag: string;
  pillText: string;
  gradientClass: string;
  textDark?: boolean;
}

export interface ClassCurriculumConfig {
  grade: GradeLevel;
  simulationModuleIds: string[];
  worksheetTopics: WorksheetTopicConfig[];
  weaknessTopics: string[];
  mixedBankKeys: string[];
  featuredCards: [FeaturedSimCard, FeaturedSimCard];
  defaultFocusTopics: string[];
}

const CLASS_5_WORKSHEET_TOPICS: WorksheetTopicConfig[] = [
  { id: 'upsarg_pratyay', nameHindi: 'उपसर्ग और प्रत्यय', nameEnglish: 'Prefixes & Suffixes', icon: '🧩', bankKeys: ['upsarg_pratyay'] },
  { id: 'sangya', nameHindi: 'संज्ञा', nameEnglish: 'Noun (Sangya)', icon: '🏷️', bankKeys: ['sangya'] },
  { id: 'ling', nameHindi: 'लिंग', nameEnglish: 'Gender (Ling)', icon: '⚖️', bankKeys: ['ling'] },
  { id: 'vachan', nameHindi: 'वचन', nameEnglish: 'Number (Vachan)', icon: '🔢', bankKeys: ['vachan'] },
  { id: 'karak', nameHindi: 'कारक', nameEnglish: 'Case Markers (Karak)', icon: '⚓', bankKeys: ['karak'] },
  { id: 'sarvanam', nameHindi: 'सर्वनाम', nameEnglish: 'Pronoun (Sarvanam)', icon: '👉', bankKeys: ['sarvanam'] },
  { id: 'visheshan', nameHindi: 'विशेषण', nameEnglish: 'Adjective (Visheshan)', icon: '✨', bankKeys: ['visheshan'] },
  { id: 'kriya_kaal', nameHindi: 'क्रिया और काल', nameEnglish: 'Verbs & Tenses', icon: '⏱️', bankKeys: ['kriya_kaal', 'kriya', 'kaal'] },
  { id: 'vakya_vichar', nameHindi: 'वाक्य-विचार', nameEnglish: 'Sentence Structure', icon: '🚂', bankKeys: ['vakya_vichar'] },
  { id: 'viram_chinh', nameHindi: 'विराम-चिह्न', nameEnglish: 'Punctuation Marks', icon: '❗', bankKeys: ['viram_chinh'] },
  { id: 'paryayvachi', nameHindi: 'पर्यायवाची शब्द', nameEnglish: 'Synonyms', icon: '📖', bankKeys: ['paryayvachi'] },
  { id: 'vilom', nameHindi: 'विलोम शब्द', nameEnglish: 'Antonyms', icon: '🔄', bankKeys: ['vilom'] },
  { id: 'anek_shabd', nameHindi: 'अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', icon: '🎯', bankKeys: ['anek_shabd'] },
  { id: 'muhavara', nameHindi: 'मुहावरे', nameEnglish: 'Idioms (Muhavare)', icon: '💡', bankKeys: ['muhavara'] },
  {
    id: 'mixed_board',
    nameHindi: 'कक्षा 5 संपूर्ण व्याकरण मॉक',
    nameEnglish: 'Class 5 Full Syllabus Mock',
    icon: '📋',
    bankKeys: [
      'upsarg_pratyay',
      'sangya',
      'ling',
      'vachan',
      'karak',
      'sarvanam',
      'visheshan',
      'kriya_kaal',
      'vakya_vichar',
      'viram_chinh',
      'paryayvachi',
      'vilom',
      'anek_shabd',
      'muhavara',
    ],
  },
];

const CLASS_6_WORKSHEET_TOPICS: WorksheetTopicConfig[] = [
  { id: 'shabd_vichar', nameHindi: 'शब्द-विचार', nameEnglish: 'Word Classification', icon: '🔤', bankKeys: ['shabd_vichar'] },
  { id: 'upsarg_pratyay', nameHindi: 'उपसर्ग और प्रत्यय', nameEnglish: 'Prefixes & Suffixes', icon: '🧩', bankKeys: ['upsarg_pratyay'] },
  { id: 'sangya', nameHindi: 'संज्ञा', nameEnglish: 'Noun (Sangya)', icon: '🏷️', bankKeys: ['sangya'] },
  { id: 'ling', nameHindi: 'लिंग', nameEnglish: 'Gender (Ling)', icon: '⚖️', bankKeys: ['ling'] },
  { id: 'vachan', nameHindi: 'वचन', nameEnglish: 'Number (Vachan)', icon: '🔢', bankKeys: ['vachan'] },
  { id: 'karak', nameHindi: 'कारक', nameEnglish: 'Case Markers (Karak)', icon: '⚓', bankKeys: ['karak'] },
  { id: 'sarvanam', nameHindi: 'सर्वनाम', nameEnglish: 'Pronoun (Sarvanam)', icon: '👉', bankKeys: ['sarvanam'] },
  { id: 'visheshan', nameHindi: 'विशेषण', nameEnglish: 'Adjective (Visheshan)', icon: '✨', bankKeys: ['visheshan'] },
  { id: 'kriya', nameHindi: 'क्रिया', nameEnglish: 'Verbs (Kriya)', icon: '🏃', bankKeys: ['kriya'] },
  { id: 'kaal', nameHindi: 'काल', nameEnglish: 'Tenses (Kaal)', icon: '⏱️', bankKeys: ['kaal'] },
  { id: 'avikari', nameHindi: 'अविकारी शब्द', nameEnglish: 'Indeclinables (Avikari)', icon: '🔗', bankKeys: ['avikari'] },
  { id: 'vakya_ashuddhi', nameHindi: 'वाक्य-विचार और अशुद्धि शोधन', nameEnglish: 'Syntax & Error Correction', icon: '✍️', bankKeys: ['vakya_vichar', 'ashuddhi_shodhan'] },
  { id: 'viram_chinh', nameHindi: 'विराम-चिह्न', nameEnglish: 'Punctuation Marks', icon: '❗', bankKeys: ['viram_chinh'] },
  { id: 'paryayvachi', nameHindi: 'पर्यायवाची शब्द', nameEnglish: 'Synonyms', icon: '📖', bankKeys: ['paryayvachi'] },
  { id: 'vilom', nameHindi: 'विलोम शब्द', nameEnglish: 'Antonyms', icon: '🔄', bankKeys: ['vilom'] },
  { id: 'anekarthi', nameHindi: 'अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', icon: '🌟', bankKeys: ['anekarthi'] },
  { id: 'shrutisam', nameHindi: 'श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones / Paronyms', icon: '🎧', bankKeys: ['shrutisam'] },
  { id: 'anek_shabd', nameHindi: 'अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', icon: '🎯', bankKeys: ['anek_shabd'] },
  { id: 'muhavara', nameHindi: 'मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', icon: '💡', bankKeys: ['muhavara'] },
  {
    id: 'mixed_board',
    nameHindi: 'कक्षा 6 संपूर्ण व्याकरण मॉक',
    nameEnglish: 'Class 6 Full Syllabus Mock',
    icon: '📋',
    bankKeys: [
      'shabd_vichar',
      'upsarg_pratyay',
      'sangya',
      'ling',
      'vachan',
      'karak',
      'sarvanam',
      'visheshan',
      'kriya',
      'kaal',
      'avikari',
      'vakya_vichar',
      'ashuddhi_shodhan',
      'viram_chinh',
      'paryayvachi',
      'vilom',
      'anekarthi',
      'shrutisam',
      'anek_shabd',
      'muhavara',
    ],
  },
];

// Exact Class 7 Syllabus (21 Topics + Full Mock)
const CLASS_7_WORKSHEET_TOPICS: WorksheetTopicConfig[] = [
  { id: 'upsarg_pratyay', nameHindi: 'उपसर्ग और प्रत्यय', nameEnglish: 'Prefixes & Suffixes', icon: '🧩', bankKeys: ['upsarg_pratyay'] },
  { id: 'samas', nameHindi: 'समास', nameEnglish: 'Compounds (Samas)', icon: '🔗', bankKeys: ['samas'] },
  { id: 'sangya', nameHindi: 'संज्ञा', nameEnglish: 'Noun (Sangya)', icon: '🏷️', bankKeys: ['sangya'] },
  { id: 'ling', nameHindi: 'लिंग', nameEnglish: 'Gender (Ling)', icon: '⚖️', bankKeys: ['ling'] },
  { id: 'vachan', nameHindi: 'वचन', nameEnglish: 'Number (Vachan)', icon: '🔢', bankKeys: ['vachan'] },
  { id: 'karak', nameHindi: 'कारक', nameEnglish: 'Case Markers (Karak)', icon: '⚓', bankKeys: ['karak'] },
  { id: 'sarvanam', nameHindi: 'सर्वनाम', nameEnglish: 'Pronoun (Sarvanam)', icon: '👉', bankKeys: ['sarvanam'] },
  { id: 'visheshan', nameHindi: 'विशेषण', nameEnglish: 'Adjective (Visheshan)', icon: '✨', bankKeys: ['visheshan'] },
  { id: 'kriya', nameHindi: 'क्रिया', nameEnglish: 'Verbs (Kriya)', icon: '🏃', bankKeys: ['kriya'] },
  { id: 'kaal', nameHindi: 'काल', nameEnglish: 'Tenses (Kaal)', icon: '⏱️', bankKeys: ['kaal'] },
  { id: 'vachya', nameHindi: 'वाच्य', nameEnglish: 'Voice (Vachya)', icon: '🎭', bankKeys: ['vachya'] },
  { id: 'avikari', nameHindi: 'अविकारी शब्द व निपात', nameEnglish: 'Indeclinables & Nipat', icon: '📌', bankKeys: ['avikari', 'nipat_extra'] },
  { id: 'pad_parichay', nameHindi: 'पद-परिचय', nameEnglish: 'Pad-Parichay', icon: '🔍', bankKeys: ['pad_parichay'] },
  { id: 'vakya_ashuddhi', nameHindi: 'वाक्य-विचार और अशुद्धि शोधन', nameEnglish: 'Syntax & Error Correction', icon: '✍️', bankKeys: ['vakya_vichar', 'ashuddhi_shodhan', 'vakya_shuddhi'] },
  { id: 'viram_chinh', nameHindi: 'विराम-चिह्न', nameEnglish: 'Punctuation Marks', icon: '❗', bankKeys: ['viram_chinh'] },
  { id: 'paryayvachi', nameHindi: 'पर्यायवाची शब्द', nameEnglish: 'Synonyms', icon: '📖', bankKeys: ['paryayvachi'] },
  { id: 'vilom', nameHindi: 'विलोम शब्द', nameEnglish: 'Antonyms', icon: '🔄', bankKeys: ['vilom'] },
  { id: 'anekarthi', nameHindi: 'अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', icon: '🌟', bankKeys: ['anekarthi'] },
  { id: 'shrutisam', nameHindi: 'श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', icon: '🎧', bankKeys: ['shrutisam'] },
  { id: 'anek_shabd', nameHindi: 'अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', icon: '🎯', bankKeys: ['anek_shabd'] },
  { id: 'muhavara', nameHindi: 'मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', icon: '💡', bankKeys: ['muhavara'] },
  {
    id: 'mixed_board',
    nameHindi: 'कक्षा 7 संपूर्ण व्याकरण मॉक',
    nameEnglish: 'Class 7 Full Syllabus Mock',
    icon: '📋',
    bankKeys: [
      'upsarg_pratyay',
      'samas',
      'sangya',
      'ling',
      'vachan',
      'karak',
      'sarvanam',
      'visheshan',
      'kriya',
      'kaal',
      'vachya',
      'avikari',
      'nipat_extra',
      'pad_parichay',
      'vakya_vichar',
      'ashuddhi_shodhan',
      'viram_chinh',
      'paryayvachi',
      'vilom',
      'anekarthi',
      'shrutisam',
      'anek_shabd',
      'muhavara',
    ],
  },
];

// Exact Class 8 Syllabus (23 Topics + Full Mock)
const CLASS_8_WORKSHEET_TOPICS: WorksheetTopicConfig[] = [
  { id: 'shabd_vichar', nameHindi: 'शब्द-विचार', nameEnglish: 'Word Classification', icon: '🔤', bankKeys: ['shabd_vichar'] },
  { id: 'upsarg_pratyay', nameHindi: 'उपसर्ग और प्रत्यय', nameEnglish: 'Prefixes & Suffixes', icon: '🧩', bankKeys: ['upsarg_pratyay'] },
  { id: 'samas', nameHindi: 'समास', nameEnglish: 'Compounds (Samas)', icon: '🔗', bankKeys: ['samas'] },
  { id: 'sangya', nameHindi: 'संज्ञा', nameEnglish: 'Noun (Sangya)', icon: '🏷️', bankKeys: ['sangya'] },
  { id: 'ling', nameHindi: 'लिंग', nameEnglish: 'Gender (Ling)', icon: '⚖️', bankKeys: ['ling'] },
  { id: 'vachan', nameHindi: 'वचन', nameEnglish: 'Number (Vachan)', icon: '🔢', bankKeys: ['vachan'] },
  { id: 'karak', nameHindi: 'कारक', nameEnglish: 'Case Markers (Karak)', icon: '⚓', bankKeys: ['karak'] },
  { id: 'sarvanam', nameHindi: 'सर्वनाम', nameEnglish: 'Pronoun (Sarvanam)', icon: '👉', bankKeys: ['sarvanam'] },
  { id: 'visheshan', nameHindi: 'विशेषण', nameEnglish: 'Adjective (Visheshan)', icon: '✨', bankKeys: ['visheshan'] },
  { id: 'kriya', nameHindi: 'क्रिया', nameEnglish: 'Verbs (Kriya)', icon: '🏃', bankKeys: ['kriya'] },
  { id: 'kaal', nameHindi: 'काल', nameEnglish: 'Tenses (Kaal)', icon: '⏱️', bankKeys: ['kaal'] },
  { id: 'vachya', nameHindi: 'वाच्य', nameEnglish: 'Voice (Vachya)', icon: '🎭', bankKeys: ['vachya'] },
  { id: 'avikari', nameHindi: 'अविकारी शब्द व निपात', nameEnglish: 'Indeclinables & Nipat', icon: '📌', bankKeys: ['avikari', 'nipat_extra'] },
  { id: 'pad_parichay', nameHindi: 'पद-परिचय', nameEnglish: 'Pad-Parichay', icon: '🔍', bankKeys: ['pad_parichay'] },
  { id: 'vakya_vichar', nameHindi: 'वाक्य-विचार (अर्थ और रचना)', nameEnglish: 'Sentence Structure (Meaning & Form)', icon: '🚂', bankKeys: ['vakya_vichar', 'vakya_parivartan'] },
  { id: 'viram_chinh', nameHindi: 'विराम-चिह्न', nameEnglish: 'Punctuation Marks', icon: '❗', bankKeys: ['viram_chinh'] },
  { id: 'paryayvachi', nameHindi: 'पर्यायवाची शब्द', nameEnglish: 'Synonyms', icon: '📖', bankKeys: ['paryayvachi'] },
  { id: 'vilom', nameHindi: 'विलोम शब्द', nameEnglish: 'Antonyms', icon: '🔄', bankKeys: ['vilom'] },
  { id: 'anekarthi', nameHindi: 'अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', icon: '🌟', bankKeys: ['anekarthi'] },
  { id: 'shrutisam', nameHindi: 'श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', icon: '🎧', bankKeys: ['shrutisam'] },
  { id: 'anek_shabd', nameHindi: 'अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', icon: '🎯', bankKeys: ['anek_shabd'] },
  { id: 'muhavara', nameHindi: 'मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', icon: '💡', bankKeys: ['muhavara'] },
  { id: 'vakya', nameHindi: 'वाक्य और उसके भेद', nameEnglish: 'Sentence & Its Types', icon: '🛤️', bankKeys: ['vakya'] },
  {
    id: 'mixed_board',
    nameHindi: 'कक्षा 8 संपूर्ण व्याकरण मॉक',
    nameEnglish: 'Class 8 Full Syllabus Mock',
    icon: '📋',
    bankKeys: [
      'shabd_vichar',
      'upsarg_pratyay',
      'samas',
      'sangya',
      'ling',
      'vachan',
      'karak',
      'sarvanam',
      'visheshan',
      'kriya',
      'kaal',
      'vachya',
      'avikari',
      'nipat_extra',
      'pad_parichay',
      'vakya_vichar',
      'viram_chinh',
      'paryayvachi',
      'vilom',
      'anekarthi',
      'shrutisam',
      'anek_shabd',
      'muhavara',
      'vakya',
    ],
  },
];

// Exact Class 9 & Class 10 ICSE Syllabus (15 Topics + Full Mock)
const CLASS_9_10_WORKSHEET_TOPICS: WorksheetTopicConfig[] = [
  { id: 'visheshan_nirman', nameHindi: 'विशेषण निर्माण', nameEnglish: 'Adjective Derivation', icon: '✨', bankKeys: ['visheshan_nirman'] },
  { id: 'paryayvachi', nameHindi: 'पर्यायवाची शब्द', nameEnglish: 'Synonyms', icon: '📖', bankKeys: ['paryayvachi'] },
  { id: 'vilom', nameHindi: 'विलोम शब्द', nameEnglish: 'Antonyms', icon: '🔄', bankKeys: ['vilom'] },
  { id: 'anek_shabd', nameHindi: 'अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', icon: '🎯', bankKeys: ['anek_shabd'] },
  { id: 'anekarthi', nameHindi: 'अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', icon: '🌟', bankKeys: ['anekarthi'] },
  { id: 'shrutisam', nameHindi: 'श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', icon: '🎧', bankKeys: ['shrutisam'] },
  { id: 'vartani_shuddhi', nameHindi: 'वर्तनी शुद्धि', nameEnglish: 'Spelling Correction', icon: '🔡', bankKeys: ['vartani_shuddhi'] },
  { id: 'vakya_shuddhi', nameHindi: 'वाक्य शुद्धि', nameEnglish: 'Sentence Correction', icon: '✍️', bankKeys: ['vakya_shuddhi', 'ashuddhi_shodhan'] },
  { id: 'ling', nameHindi: 'लिंग', nameEnglish: 'Gender (Ling)', icon: '⚖️', bankKeys: ['ling'] },
  { id: 'vachan', nameHindi: 'वचन', nameEnglish: 'Number (Vachan)', icon: '🔢', bankKeys: ['vachan'] },
  { id: 'karak', nameHindi: 'कारक', nameEnglish: 'Case Markers (Karak)', icon: '⚓', bankKeys: ['karak'] },
  { id: 'kaal', nameHindi: 'काल', nameEnglish: 'Tenses (Kaal)', icon: '⏱️', bankKeys: ['kaal'] },
  { id: 'vachya', nameHindi: 'वाच्य', nameEnglish: 'Voice (Vachya)', icon: '🎭', bankKeys: ['vachya'] },
  { id: 'vakya_parivartan', nameHindi: 'वाक्य-परिवर्तन (अर्थ और रचना)', nameEnglish: 'Sentence Transformation', icon: '🚂', bankKeys: ['vakya_parivartan', 'vakya'] },
  { id: 'muhavara', nameHindi: 'मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', icon: '💡', bankKeys: ['muhavara'] },
  {
    id: 'mixed_board',
    nameHindi: 'ICSE संपूर्ण बोर्ड व्याकरण मॉक',
    nameEnglish: 'ICSE Board Full Syllabus Mock',
    icon: '📋',
    bankKeys: [
      'visheshan_nirman',
      'paryayvachi',
      'vilom',
      'anek_shabd',
      'anekarthi',
      'shrutisam',
      'vartani_shuddhi',
      'vakya_shuddhi',
      'ling',
      'vachan',
      'karak',
      'kaal',
      'vachya',
      'vakya_parivartan',
      'muhavara',
    ],
  },
];

const CLASS_5_SIM_IDS = [
  'upsarg-pratyay',
  'sangya',
  'ling',
  'vachan',
  'karak',
  'sarvanam',
  'visheshan',
  'kriya-kaal',
  'vakya-vichar',
  'viram-chinh',
  'paryayvachi',
  'vilom',
  'anek-shabd',
  'muhavare',
];

const CLASS_6_SIM_IDS = [
  'shabd-vichar',
  'upsarg-pratyay',
  'sangya',
  'ling',
  'vachan',
  'karak',
  'sarvanam',
  'visheshan',
  'kriya',
  'kaal',
  'avikari',
  'vakya-ashuddhi',
  'viram-chinh',
  'paryayvachi',
  'vilom',
  'anekarthi',
  'shrutisam',
  'anek-shabd',
  'muhavare',
];

const CLASS_7_SIM_IDS = [
  'upsarg-pratyay',
  'samas',
  'sangya',
  'ling',
  'vachan',
  'karak',
  'sarvanam',
  'visheshan',
  'kriya',
  'kaal',
  'vachya',
  'avikari',
  'pad-parichay',
  'vakya-ashuddhi',
  'viram-chinh',
  'paryayvachi',
  'vilom',
  'anekarthi',
  'shrutisam',
  'anek-shabd',
  'muhavare',
];

const CLASS_8_SIM_IDS = [
  'shabd-vichar',
  'upsarg-pratyay',
  'samas',
  'sangya',
  'ling',
  'vachan',
  'karak',
  'sarvanam',
  'visheshan',
  'kriya',
  'kaal',
  'vachya',
  'avikari',
  'pad-parichay',
  'vakya-vichar',
  'viram-chinh',
  'paryayvachi',
  'vilom',
  'anekarthi',
  'shrutisam',
  'anek-shabd',
  'muhavare',
  'vakya',
];

const CLASS_9_10_SIM_IDS = [
  'visheshan-nirman',
  'paryayvachi',
  'vilom',
  'anek-shabd',
  'anekarthi',
  'shrutisam',
  'vartani-shuddhi',
  'vakya-shuddhi',
  'ling',
  'vachan',
  'karak',
  'kaal',
  'vachya',
  'vakya-parivartan',
  'muhavare',
];

export function getCurriculumForGrade(grade: GradeLevel): ClassCurriculumConfig {
  if (grade === 'कक्षा 5') {
    return {
      grade,
      simulationModuleIds: CLASS_5_SIM_IDS,
      worksheetTopics: CLASS_5_WORKSHEET_TOPICS,
      weaknessTopics: [
        'उपसर्ग और प्रत्यय (Prefixes & Suffixes)',
        'संज्ञा, लिंग और वचन (Noun, Gender, Number)',
        'कारक और सर्वनाम (Karak & Pronoun)',
        'विशेषण, क्रिया और काल (Adjective, Verb & Tense)',
        'वाक्य-विचार और विराम-चिह्न (Sentences & Punctuation)',
        'पर्यायवाची व विलोम शब्द (Synonyms & Antonyms)',
        'अनेक शब्दों के लिए एक शब्द (One Word)',
        'मुहावरे (Idioms)',
      ],
      mixedBankKeys: CLASS_5_WORKSHEET_TOPICS[CLASS_5_WORKSHEET_TOPICS.length - 1].bankKeys,
      featuredCards: [
        {
          moduleId: 'ling',
          tag: 'CLASS 5 FOUNDATION • लिंग एवं वचन प्रयोगशाला',
          title: 'Ling & Vachan Lab',
          description:
            'पुल्लिंग-स्त्रीलिंग परिवर्तन और एकवचन-बहुवचन नियमों को 6 दृश्य उदाहरणों व अभ्यास प्रश्नों से समझें।',
          footerTag: 'SPOT GENDER & NUMBER PATTERNS.',
          pillText: 'पुल्लिंग · स्त्रीलिंग · वचन',
          gradientClass: 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950',
          textDark: true,
        },
        {
          moduleId: 'kriya-kaal',
          tag: 'VERBS & TIME • क्रिया और काल स्टूडियो',
          title: 'Kriya & Kaal Lab',
          description:
            'सकर्मक-अकर्मक क्रिया तथा वर्तमान, भूत व भविष्यत् काल के रूपांतरण का अभ्यास कक्षा 5 स्तर पर करें।',
          footerTag: 'MASTER ACTION & TIME.',
          pillText: 'क्रिया · वर्तमान · भूत · भविष्य',
          gradientClass: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white',
          textDark: false,
        },
      ],
      defaultFocusTopics: ['कारक और सर्वनाम', 'क्रिया और काल'],
    };
  }

  if (grade === 'कक्षा 6') {
    return {
      grade,
      simulationModuleIds: CLASS_6_SIM_IDS,
      worksheetTopics: CLASS_6_WORKSHEET_TOPICS,
      weaknessTopics: [
        'शब्द-विचार, उपसर्ग और प्रत्यय (Words & Affixes)',
        'संज्ञा, लिंग, वचन और कारक (Noun, Gender, Number, Case)',
        'सर्वनाम और विशेषण (Pronoun & Adjective)',
        'क्रिया, काल और अविकारी शब्द (Verb, Tense & Avikari)',
        'वाक्य-विचार और अशुद्धि शोधन (Syntax & Correction)',
        'विराम-चिह्न और शब्द-भंडार (Punctuation & Vocab)',
        'अनेकार्थी व श्रुतिसमभिन्नार्थक शब्द (Polysemous & Homophones)',
        'मुहावरे और लोकोक्तियाँ (Idioms & Proverbs)',
      ],
      mixedBankKeys: CLASS_6_WORKSHEET_TOPICS[CLASS_6_WORKSHEET_TOPICS.length - 1].bankKeys,
      featuredCards: [
        {
          moduleId: 'avikari',
          tag: 'CLASS 6 CORE • अविकारी शब्द (अव्यय) लैब',
          title: 'Avikari Shabd Lab',
          description:
            'क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक और विस्मयादिबोधक अव्ययों का वाक्य में सटीक पहचान व उपयोग सीखें।',
          footerTag: 'TRACE INVARIABLE WORDS.',
          pillText: 'क्रियाविशेषण · संबंध · समुच्चय',
          gradientClass: 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950',
          textDark: true,
        },
        {
          moduleId: 'vakya-ashuddhi',
          tag: 'SYNTAX & PURITY • वाक्य-विचार व अशुद्धि शोधन',
          title: 'Vakya & Ashuddhi Lab',
          description:
            'लिंग, वचन, कारक व वर्तनी की अशुद्धियाँ पहचानकर वाक्यों को शुद्ध रूप में लिखने की दक्षता विकसित करें।',
          footerTag: 'REFINE SENTENCE ACCURACY.',
          pillText: 'अशुद्धि शोधन · वाक्य-विचार',
          gradientClass: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white',
          textDark: false,
        },
      ],
      defaultFocusTopics: ['अविकारी शब्द (अव्यय)', 'वाक्य-विचार और अशुद्धि शोधन'],
    };
  }

  if (grade === 'कक्षा 7') {
    return {
      grade,
      simulationModuleIds: CLASS_7_SIM_IDS,
      worksheetTopics: CLASS_7_WORKSHEET_TOPICS,
      weaknessTopics: [
        'उपसर्ग और प्रत्यय व समास (Affixes & Samas)',
        'संज्ञा, लिंग, वचन और कारक (Noun, Gender, Number, Case)',
        'सर्वनाम, विशेषण, क्रिया, काल और वाच्य',
        'अविकारी शब्द व निपात (Indeclinables & Nipat)',
        'पद-परिचय (Pad-Parichay Parsing)',
        'वाक्य-विचार, अशुद्धि शोधन व विराम-चिह्न',
        'पर्यायवाची, विलोम, अनेकार्थी, श्रुतिसम व एक शब्द',
        'मुहावरे और लोकोक्तियाँ (Idioms & Proverbs)',
      ],
      mixedBankKeys: CLASS_7_WORKSHEET_TOPICS[CLASS_7_WORKSHEET_TOPICS.length - 1].bankKeys,
      featuredCards: [
        {
          moduleId: 'pad-parichay',
          tag: 'CLASS 7 CORE • पद-परिचय विश्लेषक लैब',
          title: 'Pad-Parichay Lab',
          description:
            'वाक्य में प्रयुक्त संज्ञा, सर्वनाम, विशेषण, क्रिया, अव्यय तथा निपात पदों का पूर्ण व्याकरणिक परिचय जानें।',
          footerTag: 'PARSE EVERY WORD IN CONTEXT.',
          pillText: 'संज्ञा · विशेषण · अव्यय · निपात',
          gradientClass: 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950',
          textDark: true,
        },
        {
          moduleId: 'samas',
          tag: 'COMPOUND DECODER • समास व वाच्य लैब',
          title: 'Samas Vigraha Lab',
          description:
            'तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व, बहुव्रीहि व अव्ययीभाव समास विग्रह और वाच्य परिवर्तन का अभ्यास करें।',
          footerTag: 'DECODE COMPOUND STRUCTURES.',
          pillText: 'समास विग्रह · वाच्य · अशुद्धि शोधन',
          gradientClass: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white',
          textDark: false,
        },
      ],
      defaultFocusTopics: ['पद-परिचय', 'समास व वाच्य'],
    };
  }

  if (grade === 'कक्षा 8') {
    return {
      grade,
      simulationModuleIds: CLASS_8_SIM_IDS,
      worksheetTopics: CLASS_8_WORKSHEET_TOPICS,
      weaknessTopics: [
        'शब्द-विचार, उपसर्ग-प्रत्यय और समास',
        'संज्ञा, लिंग, वचन, कारक, सर्वनाम व विशेषण',
        'क्रिया, काल और वाच्य परिवर्तन',
        'अविकारी शब्द (अव्यय) व निपात',
        'पद-परिचय (Pad-Parichay)',
        'वाक्य-विचार (अर्थ व रचना), वाक्य और उसके भेद',
        'विराम-चिह्न एवं शब्द भंडार (पर्याय, विलोम, अनेकार्थी, श्रुतिसम)',
        'मुहावरे और लोकोक्तियाँ',
      ],
      mixedBankKeys: CLASS_8_WORKSHEET_TOPICS[CLASS_8_WORKSHEET_TOPICS.length - 1].bankKeys,
      featuredCards: [
        {
          moduleId: 'karak',
          tag: 'THE “से” DETECTIVE • करण vs अपादान',
          title: 'Karak Cables',
          description:
            'Trace who does what, with what tool, and from where. Visually distinguish between instrument (करण) and detachment (अपादान).',
          footerTag: 'FOLLOW THE RELATIONSHIP.',
          pillText: 'ने · को · से · के लिए',
          gradientClass: 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950',
          textDark: true,
        },
        {
          moduleId: 'vakya',
          tag: 'SENTENCE JUNCTION • वाक्य और उसके भेद',
          title: 'Vakya Junction',
          description:
            'अर्थ और रचना के आधार पर सरल, संयुक्त व मिश्र वाक्य के भेद तथा उपवाक्य विश्लेषण का दृश्य अभ्यास।',
          footerTag: 'COUPLE CLAUSES VISUALLY.',
          pillText: 'सरल · संयुक्त · मिश्र · अर्थ भेद',
          gradientClass: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white',
          textDark: false,
        },
      ],
      defaultFocusTopics: ['वाक्य और उसके भेद', 'पद-परिचय व समास'],
    };
  }

  // Class 9 and Class 10 (Exact ICSE 15-Topic Grammar Syllabus)
  return {
    grade,
    simulationModuleIds: CLASS_9_10_SIM_IDS,
    worksheetTopics: CLASS_9_10_WORKSHEET_TOPICS,
    weaknessTopics: [
      'विशेषण निर्माण (Adjective Derivation)',
      'वर्तनी शुद्धि एवं वाक्य शुद्धि (Spelling & Sentence Purity)',
      'वाक्य-परिवर्तन — अर्थ और रचना के आधार पर (Do as Directed)',
      'वाच्य परिवर्तन एवं काल भेद (Voice & Tenses)',
      'लिंग, वचन और कारक (Gender, Number & Case Markers)',
      'पर्यायवाची, विलोम व अनेक शब्दों के लिए एक शब्द',
      'अनेकार्थी व श्रुतिसमभिन्नार्थक शब्द (Polysemy & Homophones)',
      'मुहावरे और लोकोक्तियाँ (Idioms & Proverbs)',
    ],
    mixedBankKeys: CLASS_9_10_WORKSHEET_TOPICS[CLASS_9_10_WORKSHEET_TOPICS.length - 1].bankKeys,
    featuredCards: [
      {
        moduleId: 'vakya-parivartan',
        tag: `ICSE ${grade} BOARD • वाक्य-परिवर्तन (Do as Directed)`,
        title: 'Vakya Parivartan Lab',
        description:
          'बिना मूल अर्थ बदले अर्थ और रचना के आधार पर सरल, संयुक्त, मिश्र, निषेध व प्रश्नवाचक वाक्य रूपांतरण का अभ्यास।',
        footerTag: 'MASTER DO AS DIRECTED.',
        pillText: 'सरल · संयुक्त · मिश्र · अर्थ-परिवर्तन',
        gradientClass: 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950',
        textDark: true,
      },
      {
        moduleId: 'visheshan-nirman',
        tag: `ICSE ${grade} CORE • विशेषण निर्माण व शुद्धि लैब`,
        title: 'Visheshan & Shuddhi Lab',
        description:
          'संज्ञा शब्दों से -इक, -ईय, -आलु प्रत्ययों द्वारा विशेषण निर्माण तथा बोर्ड-स्तरीय वर्तनी व वाक्य शुद्धि अभ्यास।',
        footerTag: 'PRECISION DERIVATION & PURITY.',
        pillText: 'विशेषण निर्माण · वर्तनी · वाक्य शुद्धि',
        gradientClass: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white',
        textDark: false,
      },
    ],
    defaultFocusTopics: ['वाक्य-परिवर्तन (Do as Directed)', 'विशेषण निर्माण व वर्तनी शुद्धि'],
  };
}
