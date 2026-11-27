import {
  ComprehensionShortQuestion,
  GradeLevel,
  InteractiveParagraphQuestion,
  InteractiveWorkbookCreativePrompt,
  InteractiveWorkbookDefinition,
  QuizQuestion,
  SavedReportSummary,
  UserProgressState,
  WorksheetItem,
} from '../types';
import { getCurriculumForGrade } from './classCurriculum';
import { getSimulationMetadata } from './simulationMetadata';
import {
  getCanonicalTopicLabels,
  getUniqueWorksheetQuestions,
  normalizeQuestionKey,
  resolveTopicKeyFromString,
} from './worksheetBank';
import { randomizeQuizSet } from '../utils/quizShuffle';

export interface WorkbookPrerequisiteItem {
  moduleId: string;
  titleHindi: string;
  completedCount: number;
  requiredCount: number;
  passed: boolean;
}

export interface WorkbookGateStatus {
  isUnlockedBySim: boolean;
  requirements: WorkbookPrerequisiteItem[];
}

const MODULE_TITLE_FALLBACK: Record<string, string> = {
  sangya: 'संज्ञा (Noun)',
  sarvanam: 'सर्वनाम (Pronoun)',
  visheshan: 'विशेषण (Adjective)',
  'visheshan-nirman': 'विशेषण निर्माण (Adjective Derivation)',
  kriya: 'क्रिया (Verbs)',
  'kriya-kaal': 'क्रिया और काल (Verbs & Tense)',
  kaal: 'काल (Tenses)',
  karak: 'कारक एवं परसर्ग (Case Markers)',
  ling: 'लिंग (Gender)',
  vachan: 'वचन (Number)',
  vachya: 'वाच्य (Voice)',
  vakya: 'वाक्य और उसके भेद (Sentence Types)',
  'vakya-vichar': 'वाक्य-विचार (Sentence Structure)',
  'vakya-parivartan': 'वाक्य-परिवर्तन (Sentence Transformation)',
  'vakya-ashuddhi': 'वाक्य व अशुद्धि शोधन',
  'upsarg-pratyay': 'उपसर्ग और प्रत्यय',
  samas: 'समास (Compounds)',
  avikari: 'अविकारी शब्द / अव्यय',
  'pad-parichay': 'पद-परिचय',
  muhavare: 'मुहावरे और लोकोक्तियाँ',
  'shabd-vichar': 'शब्द-विचार',
  'shabd-bhandar': 'शब्द-भंडार',
  'viram-chinh': 'विराम-चिह्न',
  'vartani-shuddhi': 'वर्तनी शुद्धि',
  'vakya-shuddhi': 'वाक्य शुद्धि',
};

export function normalizeHindiToken(token: string): string {
  return (token || '')
    .replace(/[।,!?;:'"“”‘’()[\]{}\-–—]/g, '')
    .trim();
}

export function getSimCompletionCount(
  progress: Pick<UserProgressState, 'simulationCompletions' | 'completedSimulationModules'>,
  moduleId: string
): number {
  const mapCount = Number(progress.simulationCompletions?.[moduleId] || 0);
  if (mapCount > 0) return mapCount;
  return (progress.completedSimulationModules || []).includes(moduleId) ? 1 : 0;
}

export function checkInteractiveWorkbookGate(
  workbook: InteractiveWorkbookDefinition,
  grade: GradeLevel,
  progress: Pick<UserProgressState, 'simulationCompletions' | 'completedSimulationModules'>
): WorkbookGateStatus {
  const curriculum = getCurriculumForGrade(grade);
  const resolvedIds = workbook.requiredLessonModuleIds.map((reqId, idx) => {
    if (curriculum.simulationModuleIds.includes(reqId)) return reqId;
    if (reqId === 'kriya' && curriculum.simulationModuleIds.includes('kriya-kaal')) return 'kriya-kaal';
    if (reqId === 'vakya' && curriculum.simulationModuleIds.includes('vakya-parivartan')) return 'vakya-parivartan';
    if (reqId === 'vakya' && curriculum.simulationModuleIds.includes('vakya-vichar')) return 'vakya-vichar';
    if (reqId === 'visheshan' && curriculum.simulationModuleIds.includes('visheshan-nirman')) return 'visheshan-nirman';
    return curriculum.simulationModuleIds[idx % curriculum.simulationModuleIds.length] || reqId;
  });

  const uniqueReqIds = Array.from(new Set(resolvedIds));
  const requirements: WorkbookPrerequisiteItem[] = uniqueReqIds.map((modId) => {
    const count = getSimCompletionCount(progress, modId);
    const meta = getSimulationMetadata(modId);
    const titleHindi = MODULE_TITLE_FALLBACK[modId] || meta.uniqueSimNameHindi || modId;
    const reqCount = workbook.minCompletionsPerRequiredLesson || 1;
    return {
      moduleId: modId,
      titleHindi,
      completedCount: count,
      requiredCount: reqCount,
      passed: count >= reqCount,
    };
  });

  return {
    isUnlockedBySim: requirements.every((r) => r.passed),
    requirements,
  };
}

export function checkStoreWorksheetGate(
  ws: WorksheetItem,
  grade: GradeLevel,
  progress: Pick<UserProgressState, 'simulationCompletions' | 'completedSimulationModules'>
): WorkbookGateStatus {
  const curriculum = getCurriculumForGrade(grade);
  const titleAndTopics = `${ws.titleHindi} ${(ws.topicsCovered || []).join(' ')}`.toLowerCase();

  const candidateIds: string[] = [];
  if (/कारक|चिह्न/.test(titleAndTopics)) candidateIds.push('karak');
  if (/लिंग|वचन/.test(titleAndTopics)) candidateIds.push('ling', 'vachan');
  if (/संज्ञा|सर्वनाम/.test(titleAndTopics)) candidateIds.push('sangya', 'sarvanam');
  if (/विशेषण/.test(titleAndTopics)) candidateIds.push('visheshan');
  if (/क्रिया|काल|वाच्य/.test(titleAndTopics)) candidateIds.push('kaal', 'vachya');
  if (/वाक्य/.test(titleAndTopics)) candidateIds.push('vakya', 'vakya-vichar');
  if (/मुहावर|लोकोक्ति/.test(titleAndTopics)) candidateIds.push('muhavare');
  if (/समास|उपसर्ग|प्रत्यय/.test(titleAndTopics)) candidateIds.push('upsarg-pratyay', 'samas');

  const filtered = candidateIds
    .map((id) => {
      if (curriculum.simulationModuleIds.includes(id)) return id;
      if (id === 'vakya' && curriculum.simulationModuleIds.includes('vakya-parivartan')) return 'vakya-parivartan';
      if (id === 'visheshan' && curriculum.simulationModuleIds.includes('visheshan-nirman')) return 'visheshan-nirman';
      if (id === 'kriya' && curriculum.simulationModuleIds.includes('kriya-kaal')) return 'kriya-kaal';
      return null;
    })
    .filter((id): id is string => Boolean(id));

  const lessonIds = Array.from(
    new Set(
      filtered.length >= 2
        ? filtered.slice(0, 2)
        : [
            filtered[0] || curriculum.simulationModuleIds[0],
            curriculum.simulationModuleIds.find((id) => id !== (filtered[0] || curriculum.simulationModuleIds[0])) ||
              curriculum.simulationModuleIds[1] ||
              curriculum.simulationModuleIds[0],
          ].filter(Boolean)
    )
  );

  const requirements: WorkbookPrerequisiteItem[] = lessonIds.map((modId) => {
    const count = getSimCompletionCount(progress, modId);
    const meta = getSimulationMetadata(modId);
    return {
      moduleId: modId,
      titleHindi: MODULE_TITLE_FALLBACK[modId] || meta.uniqueSimNameHindi || modId,
      completedCount: count,
      requiredCount: 1,
      passed: count >= 1,
    };
  });

  return {
    isUnlockedBySim: requirements.every((r) => r.passed),
    requirements,
  };
}

const MCQ_SHABD_1: QuizQuestion[] = [
  {
    id: 'iwb_mcq_sb_1',
    topicId: 'sangya',
    topicNameHindi: 'संज्ञा',
    topicNameEnglish: 'Noun (Sangya)',
    questionHindi: '“मिठास” और “ईमानदारी” शब्द संज्ञा के किस भेद के अंतर्गत आते हैं?',
    questionEnglish: 'Under which type of Sangya do "Mithaas" and "Imaandaari" fall?',
    options: [
      { textHindi: 'व्यक्तिवाचक संज्ञा', textEnglish: 'Proper Noun' },
      { textHindi: 'जातिवाचक संज्ञा', textEnglish: 'Common Noun' },
      { textHindi: 'भाववाचक संज्ञा', textEnglish: 'Abstract Noun' },
      { textHindi: 'द्रव्यवाचक संज्ञा', textEnglish: 'Material Noun' },
    ],
    correctIndex: 2,
    explanationHindi: 'गुण, दशा या भाव का बोध कराने वाले शब्द भाववाचक संज्ञा कहलाते हैं।',
    explanationEnglish: 'Words denoting qualities, states, or emotions are Abstract Nouns.',
  },
  {
    id: 'iwb_mcq_sb_2',
    topicId: 'sarvanam',
    topicNameHindi: 'सर्वनाम',
    topicNameEnglish: 'Pronoun (Sarvanam)',
    questionHindi: '“जैसा करोगे, वैसा भरोगे।” — इस वाक्य में प्रयुक्त सर्वनाम का सटीक भेद क्या है?',
    questionEnglish: 'Identify the Pronoun type in "Jaisa karoge, vaisa bharoge."',
    options: [
      { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive Pronoun' },
      { textHindi: 'संबंधवाचक सर्वनाम', textEnglish: 'Relative Pronoun' },
      { textHindi: 'अनिश्चयवाचक सर्वनाम', textEnglish: 'Indefinite Pronoun' },
      { textHindi: 'प्रश्नवाचक सर्वनाम', textEnglish: 'Interrogative Pronoun' },
    ],
    correctIndex: 1,
    explanationHindi: '“जैसा–वैसा” दो उपवाक्यों में संबंध जोड़ते हैं, अतः यह संबंधवाचक सर्वनाम है।',
    explanationEnglish: 'Correlative pairs like "जैसा–वैसा" form Relative Pronouns.',
  },
  {
    id: 'iwb_mcq_sb_3',
    topicId: 'visheshan',
    topicNameHindi: 'विशेषण',
    topicNameEnglish: 'Adjective (Visheshan)',
    questionHindi: '“वह घर बहुत बड़ा है।” — इसमें रेखांकित शब्द “वह” किस विशेषण का उदाहरण है?',
    questionEnglish: 'In "Vah ghar bahut bada hai", what kind of adjective is "Vah"?',
    options: [
      { textHindi: 'सार्वनामिक (संकेतवाचक) विशेषण', textEnglish: 'Demonstrative Adjective' },
      { textHindi: 'निश्चित संख्यावाचक विशेषण', textEnglish: 'Definite Numeral Adjective' },
      { textHindi: 'परिमाणवाचक विशेषण', textEnglish: 'Adjective of Quantity' },
      { textHindi: 'व्यक्तिवाचक विशेषण', textEnglish: 'Proper Adjective' },
    ],
    correctIndex: 0,
    explanationHindi: 'जब सर्वनाम किसी संज्ञा (“घर”) से ठीक पहले आकर उसकी ओर संकेत करे, तब वह सार्वनामिक विशेषण बनता है।',
    explanationEnglish: 'When a pronoun precedes a noun to point it out, it acts as a Demonstrative Adjective.',
  },
  {
    id: 'iwb_mcq_sb_4',
    topicId: 'kriya',
    topicNameHindi: 'क्रिया',
    topicNameEnglish: 'Verbs (Kriya)',
    questionHindi: '“माँ ने बच्चे को दूध पिलाया।” — रचना की दृष्टि से “पिलाया” किस प्रकार की क्रिया है?',
    questionEnglish: 'Which verb form is "pilaya" in "Maa ne bachche ko doodh pilaya"?',
    options: [
      { textHindi: 'अकर्मक क्रिया', textEnglish: 'Intransitive Verb' },
      { textHindi: 'प्रेरणार्थक क्रिया', textEnglish: 'Causative Verb' },
      { textHindi: 'पूर्वकालिक क्रिया', textEnglish: 'Past Participle Verb' },
      { textHindi: 'नामधातु क्रिया', textEnglish: 'Nominal Verb' },
    ],
    correctIndex: 1,
    explanationHindi: 'जब कर्ता स्वयं कार्य न करके किसी दूसरे को कार्य करने की प्रेरणा दे (पीना → पिलाना), तो प्रेरणार्थक क्रिया होती है।',
    explanationEnglish: 'Causative verbs denote actions caused by the subject for someone else.',
  },
];

const MCQ_VAKYA_1: QuizQuestion[] = [
  {
    id: 'iwb_mcq_vk_1',
    topicId: 'vakya',
    topicNameHindi: 'वाक्य-भेद',
    topicNameEnglish: 'Sentence Types',
    questionHindi: '“बादल घिरे और मूसलाधार वर्षा होने लगी।” — रचना के आधार पर यह कौन-सा वाक्य है?',
    questionEnglish: 'Classify "Baadal ghire aur moosladhaar varsha hone lagi" by structure.',
    options: [
      { textHindi: 'सरल वाक्य', textEnglish: 'Simple Sentence' },
      { textHindi: 'संयुक्त वाक्य', textEnglish: 'Compound Sentence' },
      { textHindi: 'मिश्र वाक्य', textEnglish: 'Complex Sentence' },
      { textHindi: 'आज्ञावाचक वाक्य', textEnglish: 'Imperative Sentence' },
    ],
    correctIndex: 1,
    explanationHindi: 'दो स्वतंत्र उपवाक्य समानाधिकरण योजक “और” से जुड़े हैं, इसलिए यह संयुक्त वाक्य है।',
    explanationEnglish: 'Two independent clauses joined by "और" form a Compound Sentence.',
  },
  {
    id: 'iwb_mcq_vk_2',
    topicId: 'vakya',
    topicNameHindi: 'वाक्य-भेद',
    topicNameEnglish: 'Sentence Types',
    questionHindi: '“जो विद्यार्थी परिश्रम करते हैं, वे अवश्य सफल होते हैं।” — यह किस प्रकार का वाक्य है?',
    questionEnglish: 'Identify the sentence structure: "Jo vidyarthi parishram karte hain, ve avashya safal hote hain."',
    options: [
      { textHindi: 'सरल वाक्य', textEnglish: 'Simple Sentence' },
      { textHindi: 'संयुक्त वाक्य', textEnglish: 'Compound Sentence' },
      { textHindi: 'मिश्र वाक्य', textEnglish: 'Complex Sentence' },
      { textHindi: 'विस्मयादिबोधक वाक्य', textEnglish: 'Exclamatory Sentence' },
    ],
    correctIndex: 2,
    explanationHindi: '“जो...वे” आश्रित और प्रधान उपवाक्य का संबंध दर्शाते हैं, अतः यह मिश्र वाक्य है।',
    explanationEnglish: 'A main clause paired with a dependent clause ("जो...वे") creates a Complex Sentence.',
  },
  {
    id: 'iwb_mcq_vk_3',
    topicId: 'vakya',
    topicNameHindi: 'वाक्य-भेद (अर्थ)',
    topicNameEnglish: 'Sentence by Meaning',
    questionHindi: '“काश! आज हल्की फुहारें पड़तीं।” — अर्थ के आधार पर यह कौन-सा वाक्य है?',
    questionEnglish: 'Identify the meaning-based type of "Kaash! Aaj halki fuhaarein padteen."',
    options: [
      { textHindi: 'इच्छावाचक वाक्य', textEnglish: 'Optative Sentence' },
      { textHindi: 'संदेहवाचक वाक्य', textEnglish: 'Doubtful Sentence' },
      { textHindi: 'निषेधवाचक वाक्य', textEnglish: 'Negative Sentence' },
      { textHindi: 'संकेतवाचक वाक्य', textEnglish: 'Conditional Sentence' },
    ],
    correctIndex: 0,
    explanationHindi: 'जहाँ इच्छा, कामना या शुभकामना प्रकट हो, वहाँ इच्छावाचक वाक्य होता है।',
    explanationEnglish: 'Sentences expressing wishes or desires are Optative Sentences.',
  },
  {
    id: 'iwb_mcq_vk_4',
    topicId: 'kaal',
    topicNameHindi: 'काल',
    topicNameEnglish: 'Tenses',
    questionHindi: '“शायद कल पिताजी दिल्ली से लौटेंगे।” — इसमें काल और अर्थ भेद क्या है?',
    questionEnglish: 'What is the tense and mood in "Shayad kal pitaji Dilli se lautenge"?',
    options: [
      { textHindi: 'सामान्य भूतकाल', textEnglish: 'Simple Past' },
      { textHindi: 'संभाव्य भविष्यत् काल', textEnglish: 'Probable Future' },
      { textHindi: 'अपूर्ण वर्तमान काल', textEnglish: 'Present Continuous' },
      { textHindi: 'हेतुहेतुमद् भूतकाल', textEnglish: 'Conditional Past' },
    ],
    correctIndex: 1,
    explanationHindi: '“शायद” तथा भविष्य सूचक क्रिया “लौटेंगे” से संभाव्य भविष्यत् काल प्रकट होता है।',
    explanationEnglish: '"Shayad" combined with a future verb indicates Probable Future Tense.',
  },
];

export const INTERACTIVE_WORKBOOKS: InteractiveWorkbookDefinition[] = [
  {
    id: 'wb_shabd_bhed_interactive',
    titleHindi: 'अभ्यास पुस्तिका १: शब्द-भेद व गद्यांश चयन परीक्षण',
    titleEnglish: 'Workbook 1: Shabd-Bhed & Zero-Hint Paragraph Analysis',
    descriptionHindi:
      'मानक बहुविकल्पीय प्रश्नों (MCQ) के साथ-साथ गद्यांश में से संज्ञा, विशेषण, सर्वनाम व क्रिया चुनकर उनका सटीक भेद पहचानने की अनूठी कार्य-पुस्तिका।',
    descriptionEnglish:
      'Mixes standard MCQs with interactive zero-hint paragraph word selection and Bhed classification.',
    topicsCovered: ['संज्ञा', 'सर्वनाम', 'विशेषण', 'क्रिया'],
    costWordCoins: 0,
    requiredLessonModuleIds: ['sangya', 'sarvanam'],
    minCompletionsPerRequiredLesson: 1,
    mcqQuestions: MCQ_SHABD_1,
    paragraphQuestions: [
      {
        id: 'para_w_visheshan_1',
        mode: 'word',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण (Adjective)',
        promptHindi: 'नीचे दिए गए अनुच्छेद पर क्लिक करके कोई एक विशेषण (Visheshan) शब्द चुनें:',
        promptEnglish: 'Click and select any Adjective (Visheshan) word from the paragraph below:',
        paragraphTitleHindi: 'प्रातःकालीन उपवन का दृश्य',
        paragraphSentences: [
          'सुंदर उद्यान में रंगीन तितलियाँ धीरे-धीरे उड़ रही थीं।',
          'चार बच्चे ताज़ी हवा में प्रसन्नता से खेल रहे थे।',
          'उन्होंने मीठे फल खाए और अपने मित्रों को भी दिए।',
        ],
        targetWordCategory: 'visheshan',
        targetCategoryLabelHindi: 'विशेषण',
        wordAnnotations: {
          सुंदर: {
            word: 'सुंदर',
            categoryId: 'visheshan',
            bhedHindi: 'गुणवाचक विशेषण',
            roleHindi: 'संज्ञा “उद्यान” के गुण/सौंदर्य की विशेषता बता रहा है',
          },
          रंगीन: {
            word: 'रंगीन',
            categoryId: 'visheshan',
            bhedHindi: 'गुणवाचक विशेषण',
            roleHindi: 'संज्ञा “तितलियाँ” के रंग-रूप की विशेषता बता रहा है',
          },
          चार: {
            word: 'चार',
            categoryId: 'visheshan',
            bhedHindi: 'निश्चित संख्यावाचक विशेषण',
            roleHindi: 'संज्ञा “बच्चे” की सटीक संख्या का बोध करा रहा है',
          },
          ताज़ी: {
            word: 'ताज़ी',
            categoryId: 'visheshan',
            bhedHindi: 'गुणवाचक विशेषण',
            roleHindi: 'संज्ञा “हवा” की ताज़गी व गुणवत्ता बता रहा है',
          },
          मीठे: {
            word: 'मीठे',
            categoryId: 'visheshan',
            bhedHindi: 'गुणवाचक विशेषण',
            roleHindi: 'संज्ञा “फल” के स्वाद की विशेषता बता रहा है',
          },
        },
        bhedOptions: [
          { value: 'गुणवाचक विशेषण', labelHindi: 'गुणवाचक विशेषण (Qualitative)' },
          { value: 'निश्चित संख्यावाचक विशेषण', labelHindi: 'निश्चित संख्यावाचक विशेषण (Definite Numeral)' },
          { value: 'परिमाणवाचक विशेषण', labelHindi: 'परिमाणवाचक विशेषण (Quantitative)' },
          { value: 'सार्वनामिक विशेषण', labelHindi: 'सार्वनामिक विशेषण (Demonstrative)' },
        ],
        roleOptions: [
          { value: 'संज्ञा “उद्यान” के गुण/सौंदर्य की विशेषता बता रहा है', labelHindi: 'संज्ञा “उद्यान” के गुण/सौंदर्य की विशेषता बता रहा है' },
          { value: 'संज्ञा “तितलियाँ” के रंग-रूप की विशेषता बता रहा है', labelHindi: 'संज्ञा “तितलियाँ” के रंग-रूप की विशेषता बता रहा है' },
          { value: 'संज्ञा “बच्चे” की सटीक संख्या का बोध करा रहा है', labelHindi: 'संज्ञा “बच्चे” की सटीक संख्या का बोध करा रहा है' },
          { value: 'संज्ञा “हवा” की ताज़गी व गुणवत्ता बता रहा है', labelHindi: 'संज्ञा “हवा” की ताज़गी व गुणवत्ता बता रहा है' },
          { value: 'संज्ञा “फल” के स्वाद की विशेषता बता रहा है', labelHindi: 'संज्ञा “फल” के स्वाद की विशेषता बता रहा है' },
          { value: 'वाक्य में मुख्य कर्ता या क्रिया का कार्य कर रहा है', labelHindi: 'वाक्य में मुख्य कर्ता या क्रिया का कार्य कर रहा है' },
        ],
        explanationHindi:
          'इस अनुच्छेद में “सुंदर”, “रंगीन”, “चार”, “ताज़ी” और “मीठे” संज्ञा की विशेषता बताने वाले विशेषण शब्द हैं। “धीरे-धीरे” क्रियाविशेषण (अव्यय) है तथा “उन्होंने” सर्वनाम है।',
        explanationEnglish:
          '"सुंदर", "रंगीन", "चार", "ताज़ी", and "मीठे" are Adjectives modifying nouns in this passage.',
      },
      {
        id: 'para_w_sangya_1',
        mode: 'word',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा (Noun)',
        promptHindi: 'अनुच्छेद में से कोई एक संज्ञा (Sangya) शब्द चुनें और फिर उसका भेद पहचानें:',
        promptEnglish: 'Select any Noun (Sangya) word from the paragraph and classify its type:',
        paragraphTitleHindi: 'प्रातःकालीन उपवन का दृश्य',
        paragraphSentences: [
          'सुंदर उद्यान में रंगीन तितलियाँ धीरे-धीरे उड़ रही थीं।',
          'चार बच्चे ताज़ी हवा में प्रसन्नता से खेल रहे थे।',
          'उन्होंने मीठे फल खाए और अपने मित्रों को भी दिए।',
        ],
        targetWordCategory: 'sangya',
        targetCategoryLabelHindi: 'संज्ञा',
        wordAnnotations: {
          उद्यान: {
            word: 'उद्यान',
            categoryId: 'sangya',
            bhedHindi: 'जातिवाचक संज्ञा',
            roleHindi: 'अधिकरण कारक में स्थान (“उद्यान में”) का बोध करा रहा है',
          },
          तितलियाँ: {
            word: 'तितलियाँ',
            categoryId: 'sangya',
            bhedHindi: 'जातिवाचक संज्ञा',
            roleHindi: 'संपूर्ण तितली जाति व वाक्य में कर्ता पद है',
          },
          बच्चे: {
            word: 'बच्चे',
            categoryId: 'sangya',
            bhedHindi: 'जातिवाचक संज्ञा',
            roleHindi: 'खेलने की क्रिया का कर्ता पद है',
          },
          हवा: {
            word: 'हवा',
            categoryId: 'sangya',
            bhedHindi: 'जातिवाचक संज्ञा',
            roleHindi: 'प्राकृतिक तत्व के रूप में संज्ञा पद है',
          },
          प्रसन्नता: {
            word: 'प्रसन्नता',
            categoryId: 'sangya',
            bhedHindi: 'भाववाचक संज्ञा',
            roleHindi: 'आंतरिक भाव/मनोदशा का बोध करा रहा है',
          },
          फल: {
            word: 'फल',
            categoryId: 'sangya',
            bhedHindi: 'जातिवाचक संज्ञा',
            roleHindi: 'खाने की क्रिया के कर्म पद के रूप में प्रयुक्त है',
          },
          मित्रों: {
            word: 'मित्रों',
            categoryId: 'sangya',
            bhedHindi: 'जातिवाचक संज्ञा',
            roleHindi: 'संपूर्ण मित्र वर्ग का बोध व संप्रदान पद है',
          },
        },
        bhedOptions: [
          { value: 'व्यक्तिवाचक संज्ञा', labelHindi: 'व्यक्तिवाचक संज्ञा (Proper Noun)' },
          { value: 'जातिवाचक संज्ञा', labelHindi: 'जातिवाचक संज्ञा (Common Noun)' },
          { value: 'भाववाचक संज्ञा', labelHindi: 'भाववाचक संज्ञा (Abstract Noun)' },
          { value: 'द्रव्यवाचक संज्ञा', labelHindi: 'द्रव्यवाचक संज्ञा (Material Noun)' },
        ],
        roleOptions: [
          { value: 'अधिकरण कारक में स्थान (“उद्यान में”) का बोध करा रहा है', labelHindi: 'अधिकरण कारक में स्थान का बोध करा रहा है' },
          { value: 'संपूर्ण तितली जाति व वाक्य में कर्ता पद है', labelHindi: 'जाति वर्ग व वाक्य में कर्ता पद है' },
          { value: 'खेलने की क्रिया का कर्ता पद है', labelHindi: 'खेलने की क्रिया का कर्ता पद है' },
          { value: 'आंतरिक भाव/मनोदशा का बोध करा रहा है', labelHindi: 'आंतरिक भाव/मनोदशा का बोध करा रहा है' },
          { value: 'खाने की क्रिया के कर्म पद के रूप में प्रयुक्त है', labelHindi: 'क्रिया के कर्म पद के रूप में प्रयुक्त है' },
          { value: 'संपूर्ण मित्र वर्ग का बोध व संप्रदान पद है', labelHindi: 'संपूर्ण मित्र वर्ग का बोध व संप्रदान पद है' },
          { value: 'संज्ञा की विशेषता या काल दर्शा रहा है', labelHindi: 'संज्ञा की विशेषता या काल दर्शा रहा है' },
        ],
        explanationHindi:
          '“प्रसन्नता” भाववाचक संज्ञा है, जबकि “उद्यान”, “तितलियाँ”, “बच्चे”, “हवा”, “फल” और “मित्रों” जातिवाचक संज्ञा हैं।',
        explanationEnglish:
          '"प्रसन्नता" is an Abstract Noun (भाववाचक) while "उद्यान", "तितलियाँ", "बच्चे", "हवा", "फल", and "मित्रों" are Common Nouns.',
      },
    ],
  },
  {
    id: 'wb_vakya_bhed_interactive',
    titleHindi: 'अभ्यास पुस्तिका २: वाक्य-भेद एवं रचना विश्लेषण परीक्षण',
    titleEnglish: 'Workbook 2: Sentence-Level Vakya-Bhed & Grammar Workbook',
    descriptionHindi:
      'गद्यांश के पूरे वाक्यों को चुनकर सरल, संयुक्त व मिश्र वाक्य तथा अर्थ के आधार पर भेद परखने वाला पूर्ण भाषा परीक्षण।',
    descriptionEnglish:
      'Interactive sentence selection inside a full Hindi passage paired with Vakya Bhed classification and MCQs.',
    topicsCovered: ['सरल वाक्य', 'संयुक्त वाक्य', 'मिश्र वाक्य', 'काल'],
    costWordCoins: 0,
    requiredLessonModuleIds: ['karak', 'vakya'],
    minCompletionsPerRequiredLesson: 1,
    mcqQuestions: MCQ_VAKYA_1,
    paragraphQuestions: [
      {
        id: 'para_s_mishrit_1',
        mode: 'sentence',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य-भेद (रचना के आधार पर)',
        promptHindi: 'नीचे दिए गए अनुच्छेद पर क्लिक करके कोई एक “मिश्र वाक्य (Complex Sentence)” चुनें:',
        promptEnglish: 'Click and select a "Complex Sentence (मिश्र वाक्य)" from the paragraph below:',
        paragraphTitleHindi: 'नियमित अभ्यास का महत्व',
        paragraphSentences: [
          'सवेरे सूर्य की किरणें धरती को आलोकित करती हैं।',
          'रोहन ने अपना पाठ याद किया और वह विद्यालय चला गया।',
          'जब अध्यापक कक्षा में आए, तब सभी विद्यार्थियों ने उनका स्वागत किया।',
          'अरे वाह, तुमने तो कमाल कर दिया!',
        ],
        targetSentenceBhed: 'mishrit',
        targetSentenceBhedLabelHindi: 'मिश्र वाक्य',
        sentenceAnnotations: [
          {
            sentenceIndex: 0,
            bhedType: 'saral',
            bhedHindi: 'सरल वाक्य',
            roleHindi: 'एक ही उद्देश्य और एक ही मुख्य विधेय (“आलोकित करती हैं”) है',
          },
          {
            sentenceIndex: 1,
            bhedType: 'sanyukt',
            bhedHindi: 'संयुक्त वाक्य',
            roleHindi: 'दो स्वतंत्र उपवाक्य समानाधिकरण योजक “और” से जुड़े हैं',
          },
          {
            sentenceIndex: 2,
            bhedType: 'mishrit',
            bhedHindi: 'मिश्र वाक्य',
            roleHindi: '“जब...तब” द्वारा आश्रित उपवाक्य प्रधान उपवाक्य से जुड़ा है',
          },
          {
            sentenceIndex: 3,
            bhedType: 'vismayadi',
            bhedHindi: 'विस्मयादिबोधक वाक्य',
            roleHindi: '“अरे वाह” से हर्ष और आश्चर्य का भाव प्रकट हो रहा है',
          },
        ],
        bhedOptions: [
          { value: 'सरल वाक्य', labelHindi: 'सरल वाक्य (Simple Sentence)' },
          { value: 'संयुक्त वाक्य', labelHindi: 'संयुक्त वाक्य (Compound Sentence)' },
          { value: 'मिश्र वाक्य', labelHindi: 'मिश्र वाक्य (Complex Sentence)' },
          { value: 'विस्मयादिबोधक वाक्य', labelHindi: 'विस्मयादिबोधक वाक्य (Exclamatory)' },
        ],
        roleOptions: [
          { value: 'एक ही उद्देश्य और एक ही मुख्य विधेय (“आलोकित करती हैं”) है', labelHindi: 'एक ही उद्देश्य और एक ही मुख्य विधेय है' },
          { value: 'दो स्वतंत्र उपवाक्य समानाधिकरण योजक “और” से जुड़े हैं', labelHindi: 'दो स्वतंत्र उपवाक्य योजक “और” से जुड़े हैं' },
          { value: '“जब...तब” द्वारा आश्रित उपवाक्य प्रधान उपवाक्य से जुड़ा है', labelHindi: '“जब...तब” से आश्रित व प्रधान उपवाक्य जुड़े हैं' },
          { value: '“अरे वाह” से हर्ष और आश्चर्य का भाव प्रकट हो रहा है', labelHindi: 'हर्ष और आश्चर्य का भाव प्रकट हो रहा है' },
        ],
        explanationHindi:
          'तीसरा वाक्य (“जब अध्यापक कक्षा में आए, तब सभी विद्यार्थियों ने उनका स्वागत किया।”) मिश्र वाक्य है क्योंकि इसमें “जब...तब” से आश्रित उपवाक्य जुड़ा है।',
        explanationEnglish:
          'Sentence 3 is a Complex Sentence (मिश्र वाक्य) linked by the subordinating pair "जब...तब".',
      },
      {
        id: 'para_s_sanyukt_1',
        mode: 'sentence',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य-भेद (रचना के आधार पर)',
        promptHindi: 'उसी अनुच्छेद पर क्लिक करके कोई एक “संयुक्त वाक्य (Compound Sentence)” चुनें:',
        promptEnglish: 'Click and select a "Compound Sentence (संयुक्त वाक्य)" from the paragraph below:',
        paragraphTitleHindi: 'नियमित अभ्यास का महत्व',
        paragraphSentences: [
          'सवेरे सूर्य की किरणें धरती को आलोकित करती हैं।',
          'रोहन ने अपना पाठ याद किया और वह विद्यालय चला गया।',
          'जब अध्यापक कक्षा में आए, तब सभी विद्यार्थियों ने उनका स्वागत किया।',
          'अरे वाह, तुमने तो कमाल कर दिया!',
        ],
        targetSentenceBhed: 'sanyukt',
        targetSentenceBhedLabelHindi: 'संयुक्त वाक्य',
        sentenceAnnotations: [
          {
            sentenceIndex: 0,
            bhedType: 'saral',
            bhedHindi: 'सरल वाक्य',
            roleHindi: 'एक ही उद्देश्य और एक ही मुख्य विधेय (“आलोकित करती हैं”) है',
          },
          {
            sentenceIndex: 1,
            bhedType: 'sanyukt',
            bhedHindi: 'संयुक्त वाक्य',
            roleHindi: 'दो स्वतंत्र उपवाक्य समानाधिकरण योजक “और” से जुड़े हैं',
          },
          {
            sentenceIndex: 2,
            bhedType: 'mishrit',
            bhedHindi: 'मिश्र वाक्य',
            roleHindi: '“जब...तब” द्वारा आश्रित उपवाक्य प्रधान उपवाक्य से जुड़ा है',
          },
          {
            sentenceIndex: 3,
            bhedType: 'vismayadi',
            bhedHindi: 'विस्मयादिबोधक वाक्य',
            roleHindi: '“अरे वाह” से हर्ष और आश्चर्य का भाव प्रकट हो रहा है',
          },
        ],
        bhedOptions: [
          { value: 'सरल वाक्य', labelHindi: 'सरल वाक्य (Simple Sentence)' },
          { value: 'संयुक्त वाक्य', labelHindi: 'संयुक्त वाक्य (Compound Sentence)' },
          { value: 'मिश्र वाक्य', labelHindi: 'मिश्र वाक्य (Complex Sentence)' },
          { value: 'विस्मयादिबोधक वाक्य', labelHindi: 'विस्मयादिबोधक वाक्य (Exclamatory)' },
        ],
        roleOptions: [
          { value: 'एक ही उद्देश्य और एक ही मुख्य विधेय (“आलोकित करती हैं”) है', labelHindi: 'एक ही उद्देश्य और एक ही मुख्य विधेय है' },
          { value: 'दो स्वतंत्र उपवाक्य समानाधिकरण योजक “और” से जुड़े हैं', labelHindi: 'दो स्वतंत्र उपवाक्य योजक “और” से जुड़े हैं' },
          { value: '“जब...तब” द्वारा आश्रित उपवाक्य प्रधान उपवाक्य से जुड़ा है', labelHindi: '“जब...तब” से आश्रित व प्रधान उपवाक्य जुड़े हैं' },
          { value: '“अरे वाह” से हर्ष और आश्चर्य का भाव प्रकट हो रहा है', labelHindi: 'हर्ष और आश्चर्य का भाव प्रकट हो रहा है' },
        ],
        explanationHindi:
          'दूसरा वाक्य (“रोहन ने अपना पाठ याद किया और वह विद्यालय चला गया।”) संयुक्त वाक्य है क्योंकि दो स्वतंत्र वाक्य “और” से जुड़े हैं।',
        explanationEnglish:
          'Sentence 2 is a Compound Sentence (संयुक्त वाक्य) combining two independent clauses with "और".',
      },
    ],
  },
  {
    id: 'wb_mixed_master_interactive',
    titleHindi: 'अभ्यास पुस्तिका ३: मिश्रित शब्द-वाक्य मास्टर परीक्षण (Word + Sentence)',
    titleEnglish: 'Workbook 3: Mixed Word & Sentence Comprehensive Language Workbook',
    descriptionHindi:
      'MCQ प्रश्नों, शब्द-स्तर चयन (क्रिया व अव्यय) और वाक्य-स्तर पहचान (अर्थ व रचना भेद) का संपूर्ण बोर्ड-स्तरीय संवादात्मक परीक्षण।',
    descriptionEnglish:
      'Combined MCQ, word-level (Verb/Avyay), and sentence-level interactive evaluation without pre-submit hints.',
    topicsCovered: ['क्रिया', 'अविकारी/अव्यय', 'वाक्य-भेद', 'सर्वनाम'],
    costWordCoins: 0,
    requiredLessonModuleIds: ['karak', 'muhavare'],
    minCompletionsPerRequiredLesson: 1,
    mcqQuestions: [MCQ_SHABD_1[2], MCQ_SHABD_1[3], MCQ_VAKYA_1[0], MCQ_VAKYA_1[2]],
    paragraphQuestions: [
      {
        id: 'para_w_kriya_master',
        mode: 'word',
        topicId: 'kriya',
        topicNameHindi: 'क्रिया व अव्यय',
        promptHindi: 'अनुच्छेद में से कोई एक अव्यय / क्रियाविशेषण शब्द चुनें और उसका सटीक भेद बताएँ:',
        promptEnglish: 'Click and select any Avyay (Indeclinable) word from the paragraph below:',
        paragraphTitleHindi: 'परिश्रम का मार्ग',
        paragraphSentences: [
          'छात्र प्रतिदिन पुस्तकालय जाकर ध्यानपूर्वक पढ़ते हैं।',
          'यद्यपि परीक्षा कठिन थी, तथापि उन्होंने आत्मविश्वास से सभी प्रश्न हल किए।',
          'लगातार मेहनत करने से सफलता अवश्य मिलती है।',
        ],
        targetWordCategory: 'avyay',
        targetCategoryLabelHindi: 'अव्यय (अविकारी शब्द)',
        wordAnnotations: {
          प्रतिदिन: {
            word: 'प्रतिदिन',
            categoryId: 'avyay',
            bhedHindi: 'कालवाचक क्रियाविशेषण अव्यय',
            roleHindi: '“पढ़ते हैं” क्रिया के समय/नियमितता को दर्शा रहा है',
          },
          ध्यानपूर्वक: {
            word: 'ध्यानपूर्वक',
            categoryId: 'avyay',
            bhedHindi: 'रीतिवाचक क्रियाविशेषण अव्यय',
            roleHindi: 'पढ़ने की विधि/रीति बता रहा है',
          },
          यद्यपि: {
            word: 'यद्यपि',
            categoryId: 'avyay',
            bhedHindi: 'समुच्चयबोधक अव्यय',
            roleHindi: '“तथापि” के साथ मिलकर दो उपवाक्यों को जोड़ रहा है',
          },
          तथापि: {
            word: 'तथापि',
            categoryId: 'avyay',
            bhedHindi: 'समुच्चयबोधक अव्यय',
            roleHindi: 'दो उपवाक्यों के बीच विरोध/परिणाम संबंध जोड़ रहा है',
          },
          अवश्य: {
            word: 'अवश्य',
            categoryId: 'avyay',
            bhedHindi: 'रीतिवाचक क्रियाविशेषण अव्यय',
            roleHindi: 'क्रिया के निश्चय/अवश्यंभावी होने को दर्शा रहा है',
          },
        },
        bhedOptions: [
          { value: 'कालवाचक क्रियाविशेषण अव्यय', labelHindi: 'कालवाचक क्रियाविशेषण अव्यय' },
          { value: 'रीतिवाचक क्रियाविशेषण अव्यय', labelHindi: 'रीतिवाचक क्रियाविशेषण अव्यय' },
          { value: 'समुच्चयबोधक अव्यय', labelHindi: 'समुच्चयबोधक अव्यय' },
          { value: 'संबंधबोधक अव्यय', labelHindi: 'संबंधबोधक अव्यय' },
        ],
        roleOptions: [
          { value: '“पढ़ते हैं” क्रिया के समय/नियमितता को दर्शा रहा है', labelHindi: 'क्रिया के समय/नियमितता को दर्शा रहा है' },
          { value: 'पढ़ने की विधि/रीति बता रहा है', labelHindi: 'क्रिया की विधि/रीति बता रहा है' },
          { value: '“तथापि” के साथ मिलकर दो उपवाक्यों को जोड़ रहा है', labelHindi: 'दो उपवाक्यों को जोड़ने का कार्य कर रहा है' },
          { value: 'क्रिया के निश्चय/अवश्यंभावी होने को दर्शा रहा है', labelHindi: 'क्रिया के निश्चय का बोध करा रहा है' },
          { value: 'संज्ञा या सर्वनाम के लिंग-वचन बदल रहा है', labelHindi: 'संज्ञा या सर्वनाम के रूप बदल रहा है' },
        ],
        explanationHindi:
          '“प्रतिदिन” (कालवाचक), “ध्यानपूर्वक” व “अवश्य” (रीतिवाचक) तथा “यद्यपि–तथापि” (समुच्चयबोधक) लिंग-वचन से अपरिवर्तित रहने वाले अविकारी अव्यय शब्द हैं।',
        explanationEnglish:
          '"प्रतिदिन", "ध्यानपूर्वक", "अवश्य", "यद्यपि", and "तथापि" are invariable Avyay words.',
      },
      {
        id: 'para_s_mishrit_master',
        mode: 'sentence',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य-भेद',
        promptHindi: 'अनुच्छेद पर क्लिक करके “मिश्र वाक्य (Complex Sentence)” चुनें और उसका भेद स्पष्ट करें:',
        promptEnglish: 'Select the "Complex Sentence (मिश्र वाक्य)" from the paragraph below:',
        paragraphTitleHindi: 'परिश्रम का मार्ग',
        paragraphSentences: [
          'छात्र प्रतिदिन पुस्तकालय जाकर ध्यानपूर्वक पढ़ते हैं।',
          'यद्यपि परीक्षा कठिन थी, तथापि उन्होंने आत्मविश्वास से सभी प्रश्न हल किए।',
          'लगातार मेहनत करने से सफलता अवश्य मिलती है।',
        ],
        targetSentenceBhed: 'mishrit',
        targetSentenceBhedLabelHindi: 'मिश्र वाक्य',
        sentenceAnnotations: [
          {
            sentenceIndex: 0,
            bhedType: 'saral',
            bhedHindi: 'सरल वाक्य',
            roleHindi: 'एक ही कर्ता “छात्र” तथा एक मुख्य समापिका क्रिया “पढ़ते हैं” है',
          },
          {
            sentenceIndex: 1,
            bhedType: 'mishrit',
            bhedHindi: 'मिश्र वाक्य',
            roleHindi: '“यद्यपि...तथापि” व्यधिकरण योजक द्वारा आश्रित व मुख्य उपवाक्य जुड़े हैं',
          },
          {
            sentenceIndex: 2,
            bhedType: 'saral',
            bhedHindi: 'सरल वाक्य',
            roleHindi: 'केवल एक मुख्य उद्देश्य और एक समापिका क्रिया “मिलती है” है',
          },
        ],
        bhedOptions: [
          { value: 'सरल वाक्य', labelHindi: 'सरल वाक्य (Simple Sentence)' },
          { value: 'संयुक्त वाक्य', labelHindi: 'संयुक्त वाक्य (Compound Sentence)' },
          { value: 'मिश्र वाक्य', labelHindi: 'मिश्र वाक्य (Complex Sentence)' },
          { value: 'निषेधवाचक वाक्य', labelHindi: 'निषेधवाचक वाक्य (Negative)' },
        ],
        roleOptions: [
          { value: 'एक ही कर्ता “छात्र” तथा एक मुख्य समापिका क्रिया “पढ़ते हैं” है', labelHindi: 'एक कर्ता और एक मुख्य समापिका क्रिया है' },
          { value: '“यद्यपि...तथापि” व्यधिकरण योजक द्वारा आश्रित व मुख्य उपवाक्य जुड़े हैं', labelHindi: '“यद्यपि...तथापि” से आश्रित व मुख्य उपवाक्य जुड़े हैं' },
          { value: 'केवल एक मुख्य उद्देश्य और एक समापिका क्रिया “मिलती है” है', labelHindi: 'केवल एक मुख्य उद्देश्य और एक क्रिया है' },
        ],
        explanationHindi:
          'दूसरा वाक्य (“यद्यपि परीक्षा कठिन थी, तथापि उन्होंने आत्मविश्वास से सभी प्रश्न हल किए।”) मिश्र वाक्य है।',
        explanationEnglish:
          'Sentence 2 is a Complex Sentence (मिश्र वाक्य) linked by "यद्यपि...तथापि".',
      },
    ],
  },
];

export const COMBINED_WORKBOOK_ID = 'combined_compiled_workbook_25';
export const COMBINED_WORKBOOK_COST = 25;

const TOPIC_SHORT_QA_BANK: Record<string, ComprehensionShortQuestion[]> = {
  sangya: [
    {
      id: 'cwb_sq_sangya_1',
      topicId: 'sangya',
      topicNameHindi: 'संज्ञा',
      topicNameEnglish: 'Noun (Sangya)',
      questionHindi: '“बचपन में सभी को मिठास और मित्रता प्यारी लगती है।” इस वाक्य से दो भाववाचक संज्ञाएँ चुनकर कारण लिखें।',
      questionEnglish: 'Pick two abstract nouns from the sentence and state why they are Bhavvachak Sangya (2 lines).',
      sampleAnswerHindi: 'इस वाक्य में “बचपन”, “मिठास” और “मित्रता” भाववाचक संज्ञाएँ हैं क्योंकि ये अवस्था, गुण और भाव को प्रकट करती हैं जिन्हें छुआ नहीं जा सकता।',
      sampleAnswerEnglish: 'Bachpan, Mithaas, and Mitrata are abstract nouns as they express state, quality, and feeling.',
    },
  ],
  sarvanam: [
    {
      id: 'cwb_sq_sarvanam_1',
      topicId: 'sarvanam',
      topicNameHindi: 'सर्वनाम',
      topicNameEnglish: 'Pronoun (Sarvanam)',
      questionHindi: 'निजवाचक सर्वनाम और पुरुषवाचक सर्वनाम में क्या अंतर है? प्रत्येक का एक छोटा उदाहरण लिखें।',
      questionEnglish: 'Differentiate between Nijvachak and Purushvachak Sarvanam with one brief example each.',
      sampleAnswerHindi: 'पुरुषवाचक सर्वनाम वक्ता, श्रोता या अन्य के लिए आता है (जैसे: वह पढ़ता है), जबकि निजवाचक सर्वनाम कर्ता द्वारा स्वयं के लिए प्रयुक्त होता है (जैसे: मैं अपना कार्य स्वयं करूँगा)।',
      sampleAnswerEnglish: 'Purushvachak refers to persons (मैं/तुम/वह), whereas Nijvachak indicates self by the subject (स्वयं/अपने आप).',
    },
  ],
  visheshan: [
    {
      id: 'cwb_sq_visheshan_1',
      topicId: 'visheshan',
      topicNameHindi: 'विशेषण',
      topicNameEnglish: 'Adjective (Visheshan)',
      questionHindi: '“ईमानदार छात्र ने चार सुंदर पुस्तकें खरीदीं।” इसमें से गुणवाचक व संख्यावाचक विशेषण अलग-अलग लिखें।',
      questionEnglish: 'Separate the qualitative and numeral adjectives from: “ईमानदार छात्र ने चार सुंदर पुस्तकें खरीदीं।”',
      sampleAnswerHindi: '“ईमानदार” और “सुंदर” गुणवाचक विशेषण हैं क्योंकि ये संज्ञा के गुण बताते हैं, जबकि “चार” निश्चित संख्यावाचक विशेषण है।',
      sampleAnswerEnglish: 'Imaandaar and Sundar are qualitative adjectives; Chaar is a definite numeral adjective.',
    },
  ],
  karak: [
    {
      id: 'cwb_sq_karak_1',
      topicId: 'karak',
      topicNameHindi: 'कारक एवं परसर्ग',
      topicNameEnglish: 'Case Markers (Karak)',
      questionHindi: 'करण कारक और अपादान कारक दोनों में “से” विभक्ति आती है — उदाहरण सहित दोनों का अंतर स्पष्ट करें।',
      questionEnglish: 'Both Karan and Apadan Karak use “से” — explain the difference with one example each.',
      sampleAnswerHindi: 'करण कारक में “से” साधन का बोध कराता है (कलम से लिखा), जबकि अपादान कारक में “से” अलग होने या तुलना का भाव दर्शाता है (पेड़ से पत्ता गिरा)।',
      sampleAnswerEnglish: 'Karan marks the instrument (कलम से), whereas Apadan marks separation or detachment (पेड़ से).',
    },
  ],
  kriya: [
    {
      id: 'cwb_sq_kriya_1',
      topicId: 'kriya',
      topicNameHindi: 'क्रिया एवं काल',
      topicNameEnglish: 'Verbs & Tenses',
      questionHindi: 'सकर्मक और अकर्मक क्रिया की पहचान कैसे की जाती है? एक-एक वाक्य लिखकर बताएँ।',
      questionEnglish: 'How do we distinguish Sakarmak and Akarmak Kriya? Explain with one sentence each.',
      sampleAnswerHindi: 'क्रिया से “क्या” या “किसको” प्रश्न करने पर उत्तर मिले तो सकर्मक क्रिया होती है (रमा फल खाती है), अन्यथा अकर्मक क्रिया होती है (बच्चा हँसता है)।',
      sampleAnswerEnglish: 'If asking "what/whom" yields an object, it is Sakarmak (रमा फल खाती है); otherwise Akarmak (बच्चा हँसता है).',
    },
  ],
  kaal: [
    {
      id: 'cwb_sq_kaal_1',
      topicId: 'kaal',
      topicNameHindi: 'काल (Tenses)',
      topicNameEnglish: 'Tenses',
      questionHindi: '“रोहन कविता लिखता है।” इस वाक्य को अपूर्ण भूतकाल तथा सामान्य भविष्यत् काल में परिवर्तित करें।',
      questionEnglish: 'Convert “रोहन कविता लिखता है।” into Past Continuous and Simple Future tense.',
      sampleAnswerHindi: 'अपूर्ण भूतकाल: रोहन कविता लिख रहा था। सामान्य भविष्यत् काल: रोहन कविता लिखेगा।',
      sampleAnswerEnglish: 'Past Continuous: रोहन कविता लिख रहा था। Simple Future: रोहन कविता लिखेगा।',
    },
  ],
  vakya: [
    {
      id: 'cwb_sq_vakya_1',
      topicId: 'vakya',
      topicNameHindi: 'वाक्य-भेद व रूपांतरण',
      topicNameEnglish: 'Sentence Structure & Transformation',
      questionHindi: '“परिश्रमी छात्र सफल होते हैं।” इस सरल वाक्य को मिश्र वाक्य में बदलकर लिखें और योजक शब्द रेखांकित करें।',
      questionEnglish: 'Transform “परिश्रमी छात्र सफल होते हैं।” into a Complex Sentence (मिश्र वाक्य).',
      sampleAnswerHindi: 'मिश्र वाक्य: “जो छात्र परिश्रम करते हैं, वे सफल होते हैं।” इसमें “जो...वे” संबंधवाचक योजक एक प्रधान और एक आश्रित उपवाक्य को जोड़ते हैं।',
      sampleAnswerEnglish: 'जो छात्र परिश्रम करते हैं, वे सफल होते हैं।',
    },
  ],
  samas: [
    {
      id: 'cwb_sq_samas_1',
      topicId: 'samas',
      topicNameHindi: 'समास एवं उपसर्ग-प्रत्यय',
      topicNameEnglish: 'Compounds & Affixes',
      questionHindi: '“नीलकंठ” का समास-विग्रह कीजिए तथा बताइए कि इसमें कर्मधारय व बहुव्रीहि समास किस आधार पर भिन्न होते हैं?',
      questionEnglish: 'Do Samas Vigrah of “नीलकंठ” and explain how Karmadharay differs from Bahuvrihi.',
      sampleAnswerHindi: '“नीला है जो कंठ” — कर्मधारय समास (विशेषण-विशेष्य संबंध), किंतु “नीला है कंठ जिसका अर्थात् शिव” — बहुव्रीहि समास (तीसरे विशेष अर्थ की प्रधानता)।',
      sampleAnswerEnglish: 'नीला है जो कंठ (Karmadharay) vs नीला है कंठ जिसका अर्थात् शिव (Bahuvrihi).',
    },
  ],
  muhavare: [
    {
      id: 'cwb_sq_muhavare_1',
      topicId: 'muhavare',
      topicNameHindi: 'मुहावरे और लोकोक्तियाँ',
      topicNameEnglish: 'Idioms & Proverbs',
      questionHindi: '“कमर कसना” और “लोहे के चने चबाना” मुहावरों का अर्थ लिखकर दोनों से एक-एक सार्थक वाक्य बनाइए।',
      questionEnglish: 'Write the meaning and one sentence each for “कमर कसना” and “लोहे के चने चबाना”.',
      sampleAnswerHindi: 'कमर कसना (दृढ़ निश्चय करना): बोर्ड परीक्षा के लिए छात्रों ने कमर कस ली है। लोहे के चने चबाना (कठिन कार्य करना): पर्वत शिखर पर चढ़ना लोहे के चने चबाने जैसा है।',
      sampleAnswerEnglish: 'कमर कसना = prepare firmly; लोहे के चने चबाना = face a tough task.',
    },
  ],
  ashuddhi: [
    {
      id: 'cwb_sq_ashuddhi_1',
      topicId: 'ashuddhi',
      topicNameHindi: 'अशुद्धि शोधन व विराम-चिह्न',
      topicNameEnglish: 'Error Correction & Punctuation',
      questionHindi: '“अनेकों छात्रों ने मेरे को पुस्तक दिया।” इस वाक्य की सभी व्याकरणिक अशुद्धियाँ पहचानकर शुद्ध वाक्य लिखें।',
      questionEnglish: 'Correct the grammatical errors in: “अनेकों छात्रों ने मेरे को पुस्तक दिया।”',
      sampleAnswerHindi: 'शुद्ध वाक्य: “अनेक छात्रों ने मुझे पुस्तक दी।” (“अनेकों” के स्थान पर “अनेक”, “मेरे को” के स्थान पर “मुझे” तथा “पुस्तक” स्त्रीलिंग होने से “दी” प्रयुक्त होगा।)',
      sampleAnswerEnglish: 'अनेक छात्रों ने मुझे पुस्तक दी।',
    },
  ],
};

function getCreativePromptForCompiledWorkbook(
  grade: GradeLevel,
  trackedLabels: string[]
): InteractiveWorkbookCreativePrompt {
  const focusHint = trackedLabels.slice(0, 3).join(', ') || 'संज्ञा, विशेषण, कारक व वाक्य-रचना';
  if (grade === 'कक्षा 9' || grade === 'कक्षा 10') {
    return {
      genreId: 'patra',
      genreLabelHindi: 'औपचारिक / अनौपचारिक पत्र व सृजनात्मक लेखन',
      titleHindi: 'अपने मित्र या विद्यालय प्रधानाचार्य को समय-प्रबंधन एवं मातृभाषा हिंदी के महत्व पर पत्र लिखिए',
      instructionsHindi: `अपने पूर्ण किए गए पाठों (${focusHint}) की व्याकरणिक शुद्धता — विशेषकर सटीक कारक, मिश्र-संयुक्त वाक्य व विराम-चिह्नों का प्रयोग करते हुए लगभग 100-120 शब्दों में प्रभावशाली पत्र लिखें।`,
      instructionsEnglish: `Write a structured ICSE-style Hindi letter (~100-120 words) applying your tracked grammar topics (${focusHint}) accurately.`,
      wordLimit: 110,
      hintsHindi: [
        'बाएँ हाशिये से दिनांक व सटीक संबोधन प्रारंभ करें',
        'कम से कम एक मिश्र/संयुक्त वाक्य व एक सटीक मुहावरा प्रयोग करें',
        'वर्तनी, कारक-चिह्नों और विराम-चिह्नों की शुद्धता बनाए रखें',
      ],
    };
  }
  if (grade === 'कक्षा 7' || grade === 'कक्षा 8') {
    return {
      genreId: 'anuched',
      genreLabelHindi: 'अनुच्छेद लेखन (ICSE Paragraph Writing)',
      titleHindi: '“परिश्रम और अनुशासन ही सफलता की कुंजी है” — सृजनात्मक अनुच्छेद',
      instructionsHindi: `अपने ट्रैक किए गए व्याकरण अध्यायों (${focusHint}) के नियमों — उपयुक्त विशेषण, सटीक काल तथा एक मुहावरे का प्रयोग करते हुए एक सुसंगठित अनुच्छेद (80-100 शब्द) लिखें।`,
      instructionsEnglish: `Compose one cohesive Hindi paragraph (~80-100 words) demonstrating accurate usage of ${focusHint}.`,
      wordLimit: 90,
      hintsHindi: [
        'केवल एक ही सतत अनुच्छेद में विचार पिरोएँ',
        'दो गुणवाचक विशेषण व एक मुहावरे का स्वाभाविक प्रयोग करें',
        'काल और लिंग-वचन की एकरूपता बनाए रखें',
      ],
    };
  }
  return {
    genreId: 'katha',
    genreLabelHindi: 'लघु कथा / अनुच्छेद लेखन (Creative Writing)',
    titleHindi: '“मेरा यादगार विद्यालय दिवस” अथवा “एक सच्चा मित्र” पर सृजनात्मक लेखन',
    instructionsHindi: `अपने पूर्ण किए गए अध्यायों (${focusHint}) से सीखी संज्ञा, सर्वनाम व विशेषण शब्दों का सुंदर प्रयोग करते हुए लगभग 60-80 शब्दों में सरल व शुद्ध रचना लिखें।`,
    instructionsEnglish: `Write a short creative story or paragraph (~60-80 words) using nouns, pronouns, and adjectives accurately.`,
    wordLimit: 75,
    hintsHindi: [
      'आकर्षक शीर्षक के साथ 5-7 स्पष्ट वाक्य लिखें',
      'भूतकाल या वर्तमान काल की सही क्रियाएँ प्रयोग करें',
      'अंत में 1 पंक्ति की सुंदर सीख लिखें',
    ],
  };
}

/**
 * Builds the SINGLE Combined Compiled Sample Workbook (25 WordCoins) dynamically
 * from the student's tracked completed topics across simulations and reports,
 * combining 15 MCQs + Zero-Hint Paragraph selection + 4 2-line Short Questions + Rachanatmak Lekhan.
 */
export function buildCombinedCompiledWorkbook(params: {
  grade: GradeLevel;
  completedSimulationModules?: string[];
  simulationCompletions?: Record<string, number>;
  savedReports?: SavedReportSummary[];
}): InteractiveWorkbookDefinition {
  const {
    grade,
    completedSimulationModules = [],
    simulationCompletions = {},
    savedReports = [],
  } = params;

  const curriculum = getCurriculumForGrade(grade);

  // 1. Gather tracked completed module IDs from simulations + completion map + saved chapter reports
  const trackedSet = new Set<string>();
  for (const modId of completedSimulationModules) {
    if (modId) trackedSet.add(modId);
  }
  for (const [modId, count] of Object.entries(simulationCompletions)) {
    if (Number(count) > 0) trackedSet.add(modId);
  }
  for (const rep of savedReports) {
    if (rep?.moduleId) trackedSet.add(rep.moduleId);
  }

  const hasTrackedModules = trackedSet.size > 0;
  const activeTopicIds = hasTrackedModules
    ? Array.from(trackedSet)
    : curriculum.simulationModuleIds.slice(0, 4);

  const trackedTopicNames = activeTopicIds.map((modId) => {
    const meta = getSimulationMetadata(modId);
    return MODULE_TITLE_FALLBACK[modId] || meta.uniqueSimNameHindi || getCanonicalTopicLabels(resolveTopicKeyFromString(modId)).hi;
  });

  // 2. Compile 15 mixed MCQs across tracked completed topics (with grade syllabus fallback)
  const mcqSeen = new Set<string>();
  const compiledMcqs: QuizQuestion[] = [];
  const topicKeysOrder = Array.from(
    new Set([
      ...activeTopicIds.map((id) => resolveTopicKeyFromString(id)),
      ...curriculum.mixedBankKeys,
    ])
  );

  for (const topicKey of topicKeysOrder) {
    if (compiledMcqs.length >= 15) break;
    const labels = getCanonicalTopicLabels(topicKey);
    const batch = getUniqueWorksheetQuestions(topicKey, 4, labels.hi, labels.en, [], grade);
    for (const q of batch) {
      if (compiledMcqs.length >= 15) break;
      const key = normalizeQuestionKey(q.questionHindi);
      if (!key || mcqSeen.has(key)) continue;
      mcqSeen.add(key);
      compiledMcqs.push({
        ...q,
        id: `cwb_mcq_${compiledMcqs.length + 1}_${topicKey}`,
      });
    }
  }

  if (compiledMcqs.length < 15) {
    const fillBatch = getUniqueWorksheetQuestions(
      'mixed_board',
      15 - compiledMcqs.length + 4,
      'मिश्रित व्याकरण',
      'Mixed Grammar',
      compiledMcqs,
      grade
    );
    for (const q of fillBatch) {
      if (compiledMcqs.length >= 15) break;
      const key = normalizeQuestionKey(q.questionHindi);
      if (!key || mcqSeen.has(key)) continue;
      mcqSeen.add(key);
      compiledMcqs.push(q);
    }
  }

  // 3. Compile Zero-Hint Interactive Paragraph Questions (prioritizing tracked topics, mixing word + sentence)
  const allParaPool: InteractiveParagraphQuestion[] = INTERACTIVE_WORKBOOKS.flatMap(
    (wb) => wb.paragraphQuestions
  );
  const resolvedTrackedSet = new Set(activeTopicIds.map((id) => resolveTopicKeyFromString(id)));
  const prioritizedPara = [...allParaPool].sort((a, b) => {
    const aMatch = resolvedTrackedSet.has(resolveTopicKeyFromString(a.topicId)) ? 1 : 0;
    const bMatch = resolvedTrackedSet.has(resolveTopicKeyFromString(b.topicId)) ? 1 : 0;
    return bMatch - aMatch;
  });

  // Always include at least one word-mode and one sentence-mode, up to 3 total
  const wordParas = prioritizedPara.filter((p) => p.mode === 'word');
  const sentParas = prioritizedPara.filter((p) => p.mode === 'sentence');
  const selectedParagraphQuestions: InteractiveParagraphQuestion[] = [];
  if (wordParas[0]) selectedParagraphQuestions.push(wordParas[0]);
  if (sentParas[0]) selectedParagraphQuestions.push(sentParas[0]);
  for (const pq of prioritizedPara) {
    if (selectedParagraphQuestions.length >= 3) break;
    if (!selectedParagraphQuestions.some((s) => s.id === pq.id)) {
      selectedParagraphQuestions.push(pq);
    }
  }

  // 4. Compile 4 two-line Short Questions prioritized by tracked completed topics
  const shortSeen = new Set<string>();
  const compiledShorts: ComprehensionShortQuestion[] = [];
  const shortKeysOrder = Array.from(
    new Set([
      ...activeTopicIds.map((id) => resolveTopicKeyFromString(id)),
      ...Object.keys(TOPIC_SHORT_QA_BANK),
    ])
  );
  for (const key of shortKeysOrder) {
    if (compiledShorts.length >= 4) break;
    const list = TOPIC_SHORT_QA_BANK[key] || [];
    for (const sq of list) {
      if (compiledShorts.length >= 4) break;
      if (shortSeen.has(sq.id)) continue;
      shortSeen.add(sq.id);
      compiledShorts.push(sq);
    }
  }

  // 5. Creative Writing (Rachanatmak Lekhan) aligned to grade & tracked topics
  const creativeWritingPrompt = getCreativePromptForCompiledWorkbook(grade, trackedTopicNames);

  return {
    id: COMBINED_WORKBOOK_ID,
    titleHindi: `संकलित समग्र अभ्यास पुस्तिका (${grade})`,
    titleEnglish: `Combined Compiled Sample Workbook (${grade})`,
    descriptionHindi: hasTrackedModules
      ? `आपके द्वारा पूर्ण किए गए ${activeTopicIds.length} ट्रैक किए गए पाठों पर आधारित एकमात्र समग्र अभ्यास पुस्तिका — इसमें 15 मिश्रित MCQ, अनुच्छेद शब्द/वाक्य पहचान, 4 दो-पंक्ति प्रश्न व रचनात्मक लेखन शामिल हैं।`
      : `आपके ${grade} पाठ्यक्रम के प्रमुख विषयों पर आधारित समग्र सैंपल अभ्यास पुस्तिका — जैसे-जैसे आप पाठ पूर्ण करेंगे, इसमें वे विषय स्वतः संकलित होते जाएँगे। (15 MCQ + अनुच्छेद परीक्षण + लघु प्रश्न + रचनात्मक लेखन)`,
    descriptionEnglish:
      'One unified compiled sample workbook combining your tracked completed topics with MCQs, paragraph grammar selection, 2-line short Q&A, and Rachanatmak Lekhan.',
    topicsCovered: trackedTopicNames,
    trackedTopicNames,
    costWordCoins: COMBINED_WORKBOOK_COST,
    requiredLessonModuleIds: [],
    minCompletionsPerRequiredLesson: 0,
    mcqQuestions: randomizeQuizSet(compiledMcqs).slice(0, 15),
    paragraphQuestions: selectedParagraphQuestions,
    shortQuestions: compiledShorts,
    creativeWritingPrompt,
  };
}

