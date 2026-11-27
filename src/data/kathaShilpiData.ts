import { GradeLevel } from '../types';

export type WritingFormatId =
  | 'nibandh'
  | 'kahani'
  | 'anuched'
  | 'patra_formal'
  | 'patra_informal'
  | 'soochna'
  | 'diary'
  | 'vigyapan';

export type PrimaryGenreTabId =
  | 'nibandh'
  | 'kahani'
  | 'anuched'
  | 'patra'
  | 'soochna'
  | 'diary'
  | 'vigyapan';

export interface GradeSyllabusSpec {
  status: 'core' | 'supporting' | 'optional';
  statusLabelHindi: string;
  statusLabelEnglish: string;
  wordLimitHindi: string;
  marksHindi: string;
  noteHindi: string;
  noteEnglish: string;
}

export interface BlueprintLine {
  id: string;
  labelHindi: string;
  labelEnglish: string;
  samplePlaceholder: string;
  alignment: 'left' | 'center' | 'split';
  isBold?: boolean;
  requiredNoteHindi: string;
  requiredNoteEnglish: string;
}

export interface ModelExampleBlock {
  tagHindi: string;
  tagEnglish: string;
  textHindi: string;
  alignment?: 'left' | 'center';
  isHeading?: boolean;
}

export interface ModelExample {
  id: string;
  gradeBand: 'कक्षा 5–7' | 'कक्षा 8–10';
  titleHindi: string;
  titleEnglish: string;
  promptHindi: string;
  promptEnglish: string;
  wordCountApprox: number;
  hintPoints?: string[];
  blocks: ModelExampleBlock[];
  examinerNoteHindi: string;
  examinerNoteEnglish: string;
}

export interface FillBlankExercise {
  id: string;
  gradeBand: 'कक्षा 5–7' | 'कक्षा 8–10' | 'सभी कक्षाएँ';
  contextLabelHindi: string;
  contextLabelEnglish?: string;
  beforeBlankHindi: string;
  afterBlankHindi: string;
  options: { textHindi: string; textEnglish: string }[];
  correctIndex: number;
  hintHindi: string;
  explanationHindi: string;
  explanationEnglish: string;
}

export interface ErrorIdentificationExercise {
  id: string;
  gradeBand: 'कक्षा 5–7' | 'कक्षा 8–10' | 'सभी कक्षाएँ';
  titleHindi: string;
  titleEnglish: string;
  instructionHindi: string;
  instructionEnglish: string;
  isBoxedDraft?: boolean;
  lines: {
    id: string;
    tagHindi?: string;
    textHindi: string;
  }[];
  errorLineIndex: number;
  correctionOptions: { textHindi: string; textEnglish: string }[];
  correctCorrectionIndex: number;
  explanationHindi: string;
  explanationEnglish: string;
  topicTagHindi: string;
}

export interface WriterPromptTemplate {
  id: string;
  gradeBand: 'कक्षा 5–7' | 'कक्षा 8–10';
  titleHindi: string;
  titleEnglish: string;
  promptHindi: string;
  promptEnglish: string;
  englishStarter: string;
  hindiStarter: string;
}

export interface WritingFormatSpec {
  id: WritingFormatId;
  primaryTabId: PrimaryGenreTabId;
  topicKey: string;
  titleHindi: string;
  titleEnglish: string;
  shortTitleHindi: string;
  badgeHindi: string;
  summaryHindi: string;
  summaryEnglish: string;
  isBoxed: boolean;
  alignmentRuleHindi: string;
  alignmentRuleEnglish: string;
  gradeSpecs: Record<GradeLevel, GradeSyllabusSpec>;
  markingScheme: {
    partHindi: string;
    partEnglish: string;
    weightHindi: string;
  }[];
  blueprintLines: BlueprintLine[];
  dosHindi: string[];
  dontsHindi: string[];
  formatChecklistItems: {
    id: string;
    labelHindi: string;
    labelEnglish: string;
  }[];
  examples: ModelExample[];
  fillBlanks: FillBlankExercise[];
  errorIdentification: ErrorIdentificationExercise[];
  writerPrompts: WriterPromptTemplate[];
}

export const PRIMARY_GENRE_TABS: {
  id: PrimaryGenreTabId;
  labelHindi: string;
  labelEnglish: string;
  defaultFormatId: WritingFormatId;
}[] = [
  { id: 'nibandh', labelHindi: 'निबंध लेखन', labelEnglish: 'Nibandh (Essay)', defaultFormatId: 'nibandh' },
  { id: 'kahani', labelHindi: 'कहानी लेखन', labelEnglish: 'Kahani (Story)', defaultFormatId: 'kahani' },
  { id: 'anuched', labelHindi: 'अनुच्छेद लेखन', labelEnglish: 'Anuched (Paragraph)', defaultFormatId: 'anuched' },
  { id: 'patra', labelHindi: 'पत्र (औपचारिक / अनौपचारिक)', labelEnglish: 'Patra (Formal / Informal)', defaultFormatId: 'patra_formal' },
  { id: 'soochna', labelHindi: 'सूचना लेखन', labelEnglish: 'Soochna (Notice)', defaultFormatId: 'soochna' },
  { id: 'diary', labelHindi: 'डायरी लेखन', labelEnglish: 'Diary Writing', defaultFormatId: 'diary' },
  { id: 'vigyapan', labelHindi: 'विज्ञापन लेखन', labelEnglish: 'Vigyapan (Ad)', defaultFormatId: 'vigyapan' },
];

export const KATHA_SHILPI_FORMATS: Record<WritingFormatId, WritingFormatSpec> = {
  nibandh: {
    id: 'nibandh',
    primaryTabId: 'nibandh',
    topicKey: 'nibandh',
    titleHindi: 'निबंध लेखन (Nibandh)',
    titleEnglish: 'Essay Writing (ICSE Composition)',
    shortTitleHindi: 'निबंध',
    badgeHindi: 'ICSE कक्षा 5–10 मुख्य रचना',
    summaryHindi:
      'किसी विषय पर विचारों, तथ्यों और उदाहरणों का सुव्यवस्थित, क्रमबद्ध एवं प्रभावशाली अनुच्छेद-वार प्रस्तुतीकरण निबंध कहलाता है।',
    summaryEnglish:
      'Structured multi-paragraph composition presenting ideas, arguments, and examples logically within the ICSE word limit.',
    isBoxed: false,
    alignmentRuleHindi: 'शीर्षक मध्य में व प्रत्येक अनुच्छेद स्पष्ट पंक्ति-अंतराल के साथ',
    alignmentRuleEnglish: 'Centered title with clear paragraph breaks (Introduction -> Body -> Conclusion)',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '100–120 शब्द',
        marksHindi: '7–10 अंक',
        noteHindi: 'वर्णनात्मक व परिचयात्मक निबंध (मेरा विद्यालय, प्रिय त्योहार)',
        noteEnglish: 'Descriptive essays on familiar topics',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '120–150 शब्द',
        marksHindi: '8–10 अंक',
        noteHindi: 'वर्णनात्मक एवं पर्यावरण/प्रकृति संबंधी निबंध',
        noteEnglish: 'Descriptive & nature-based essays',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '150–180 शब्द',
        marksHindi: '10 अंक',
        noteHindi: 'वर्णनात्मक व सरल विचारात्मक निबंध (3–4 अनुच्छेद)',
        noteEnglish: 'Descriptive & introductory reflective essays',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '180–220 शब्द',
        marksHindi: '12–15 अंक',
        noteHindi: 'विचारात्मक, भावात्मक और सामाजिक विषयों पर तार्किक निबंध',
        noteEnglish: 'Reflective, social & analytical essays bridging to Class 9–10',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 1',
        statusLabelEnglish: 'ICSE Board Q1 Core',
        wordLimitHindi: 'लगभग 250 शब्द',
        marksHindi: '15 अंक',
        noteHindi: 'ICSE प्रश्न-पत्र खंड-क (प्रश्न 1): वर्णनात्मक, विचारात्मक, भावात्मक व आत्मकथात्मक',
        noteEnglish: 'ICSE Paper Section A (Q1): 250-word formal composition',
      },
      'कक्षा 10': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 1',
        statusLabelEnglish: 'ICSE Board Q1 Core',
        wordLimitHindi: 'लगभग 250 शब्द',
        marksHindi: '15 अंक',
        noteHindi: 'ICSE बोर्ड परीक्षा प्रश्न 1 (15 अंक) — संतुलित विचार, उद्धरण व शुद्ध भाषा अनिवार्य',
        noteEnglish: 'ICSE Board Exam Q1 (15 marks) — balanced perspective & crisp grammar',
      },
    },
    markingScheme: [
      { partHindi: 'विषयवस्तु व विचारों की मौलिकता', partEnglish: 'Content & Originality', weightHindi: '5–6 अंक' },
      { partHindi: 'प्रारूप, क्रमबद्धता व अनुच्छेद संगठन', partEnglish: 'Structure & Paragraphing', weightHindi: '4–5 अंक' },
      { partHindi: 'भाषा, वर्तनी, मुहावरे व विराम-चिह्न', partEnglish: 'Language, Idioms & Accuracy', weightHindi: '4–5 अंक' },
    ],
    blueprintLines: [
      {
        id: 'nb_title',
        labelHindi: '१. आकर्षक शीर्षक (Title)',
        labelEnglish: 'Centered Essay Title',
        samplePlaceholder: 'प्रकृति संरक्षण एवं हमारा उत्तरदायित्व',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'शीर्षक संक्षिप्त व विषय के अनुरूप हो।',
        requiredNoteEnglish: 'Concise and directly aligned with the prompt.',
      },
      {
        id: 'nb_intro',
        labelHindi: '२. प्रस्तावना / भूमिका (Introduction — 15–20%)',
        labelEnglish: 'Opening Hook & Definition (Paragraph 1)',
        samplePlaceholder: 'एक प्रासंगिक सूक्ति/दोहे या विचार से विषय का परिचय व उसका वर्तमान महत्व लिखें।',
        alignment: 'left',
        requiredNoteHindi: 'पहला अनुच्छेद पाठक की रुचि जगाए व मुख्य विषय स्पष्ट करे।',
        requiredNoteEnglish: 'Set context clearly without giving away every detail.',
      },
      {
        id: 'nb_body',
        labelHindi: '३. विषय-विस्तार (Body — 2 से 3 अनुच्छेद, 60–65%)',
        labelEnglish: 'Core Analysis, Causes, Effects & Examples',
        samplePlaceholder: 'प्रथम मध्य अनुच्छेद: कारण/सकारात्मक पक्ष। द्वितीय मध्य अनुच्छेद: चुनौतियाँ/समाज पर प्रभाव व उदाहरण।',
        alignment: 'left',
        requiredNoteHindi: 'ICSE में भारी उपशीर्षक (हेडिंग) के बिना सहज अनुच्छेद बदलना श्रेष्ठ माना जाता है।',
        requiredNoteEnglish: 'Use clean paragraph transitions instead of rigid bullet lists.',
      },
      {
        id: 'nb_conc',
        labelHindi: '४. उपसंहार / निष्कर्ष (Conclusion — 15–20%)',
        labelEnglish: 'Balanced Synthesis & Actionable Message',
        samplePlaceholder: 'पूरे निबंध का सकारात्मक सार, सुझाव और एक प्रभावी अंतिम वाक्य लिखें।',
        alignment: 'left',
        requiredNoteHindi: 'निष्कर्ष में नया विषय न शुरू करें; समाधान पर समाप्त करें।',
        requiredNoteEnglish: 'End on a constructive, memorable takeaway.',
      },
    ],
    dosHindi: [
      'निबंध को 4 से 5 स्पष्ट अनुच्छेदों में विभाजित करें।',
      'कक्षा 9–10 में 250 शब्दों की शब्द-सीमा (±25 शब्द) का सख्ती से पालन करें।',
      'विचारों को प्रभावशाली बनाने के लिए 1–2 उचित मुहावरे या सूक्ति शामिल करें।',
      'लिखने से पहले 2 मिनट की रूपरेखा (प्रस्तावना, पक्ष-विपक्ष, उदाहरण, निष्कर्ष) मन में तय करें।',
    ],
    dontsHindi: [
      'पूरा निबंध एक ही लंबे अनुच्छेद में न लिखें (वह अनुच्छेद लेखन बन जाता है)।',
      'बिना मतलब के भारी-भरकम हेडिंग व बुलेट पॉइंट्स से निबंध को नोट्स जैसा न बनाएँ।',
      'एक ही बात को अलग-अलग शब्दों में बार-बार दोहराकर शब्द न बढ़ाएँ।',
      'विचारात्मक निबंध में केवल एक पक्ष लिखकर संतुलन न खोएँ।',
    ],
    formatChecklistItems: [
      { id: 'title', labelHindi: 'सटीक शीर्षक', labelEnglish: 'Relevant Title' },
      { id: 'intro', labelHindi: 'प्रभावशाली भूमिका (प्रस्तावना)', labelEnglish: 'Clear Introduction' },
      { id: 'paragraphs', labelHindi: 'कम से कम 3–4 सुव्यवस्थित अनुच्छेद', labelEnglish: 'Multi-Paragraph Body' },
      { id: 'conclusion', labelHindi: 'संतुलित उपसंहार (निष्कर्ष)', labelEnglish: 'Cohesive Conclusion' },
    ],
    examples: [
      {
        id: 'nb_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'समय का सदुपयोग',
        titleEnglish: 'Proper Use of Time',
        promptHindi: '‘समय अमूल्य धन है’ — इस विषय पर लगभग 140 शब्दों में एक निबंध लिखिए।',
        promptEnglish: 'Write an essay of ~140 words on "Proper Use of Time".',
        wordCountApprox: 145,
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'समय का सदुपयोग', alignment: 'center', isHeading: true },
          {
            tagHindi: 'प्रस्तावना',
            tagEnglish: 'Introduction',
            textHindi:
              'मनुष्य के जीवन में समय सबसे अनमोल धन है। खोया हुआ धन परिश्रम से पुनः कमाया जा सकता है, किंतु बीता हुआ एक क्षण भी करोड़ों रुपये खर्च करके वापस नहीं लाया जा सकता। कबीरदास जी ने भी कहा है— “काल करै सो आज कर, आज करै सो अब।”',
          },
          {
            tagHindi: 'विषय-विस्तार',
            tagEnglish: 'Body Paragraph',
            textHindi:
              'प्रकृति के सभी कार्य समय के नियम से बंधे हैं। सूर्य समय पर उगता और डूबता है तथा ऋतुएँ भी समय पर बदलती हैं। जो विद्यार्थी अपनी दिनचर्या समय-सारिणी के अनुसार बनाते हैं, वे पढ़ाई, खेल और विश्राम में सुंदर संतुलन रखते हैं। इसके विपरीत, आलसी व्यक्ति हर कार्य कल पर टालते रहते हैं और बाद में पछताते हैं।',
          },
          {
            tagHindi: 'उपसंहार',
            tagEnglish: 'Conclusion',
            textHindi:
              'अतः सफलता की कुंजी समय की कद्र करने में छिपी है। यदि हम बचपन से ही प्रत्येक मिनट का सही उपयोग करना सीख लें, तो कठिन से कठिन लक्ष्य भी सरलता से प्राप्त किया जा सकता है।',
          },
        ],
        examinerNoteHindi: 'स्पष्ट 3 अनुच्छेद, उपयुक्त दोहा व सरल-शुद्ध भाषा इसे कक्षा 5–7 के लिए आदर्श बनाती है।',
        examinerNoteEnglish: 'Clean 3-part flow with a classical couplet makes this ideal for Classes 5–7.',
      },
      {
        id: 'nb_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'आधुनिक तकनीक: वरदान या अभिशाप',
        titleEnglish: 'Modern Technology: Boon or Bane',
        promptHindi: '‘इंटरनेट और मोबाइल ने जीवन सरल बनाया है या जटिल?’ लगभग 250 शब्दों में विचार प्रस्तुत कीजिए।',
        promptEnglish: 'Write a 250-word reflective ICSE essay on whether modern technology is a boon or bane.',
        wordCountApprox: 242,
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'आधुनिक तकनीक: वरदान या अभिशाप', alignment: 'center', isHeading: true },
          {
            tagHindi: 'प्रस्तावना',
            tagEnglish: 'Introduction',
            textHindi:
              'इक्यासीवीं नहीं, अपितु यह इक्कीसवीं सदी विज्ञान और डिजिटल क्रांति का युग है। आज प्रातः उठने से लेकर रात्रि विश्राम तक मानव का प्रत्येक कार्य इंटरनेट, स्मार्टफोन और कृत्रिम बुद्धिमत्ता से जुड़ा है। ऐसे में यह प्रश्न स्वाभाविक है कि आधुनिक तकनीक हमारे लिए वरदान सिद्ध हो रही है अथवा अभिशाप।',
          },
          {
            tagHindi: 'सकारात्मक पक्ष (वरदान)',
            tagEnglish: 'Body 1: Benefits',
            textHindi:
              'सकारात्मक दृष्टि से देखें तो तकनीक ने विश्व को एक छोटे से गाँव में बदल दिया है। शिक्षा के क्षेत्र में दूरस्थ विद्यार्थी भी ऑनलाइन पुस्तकालयों व डिजिटल कक्षाओं से ज्ञान अर्जित कर रहे हैं। चिकित्सा, बैंकिंग, मौसम-पूर्वानुमान और त्वरित संचार ने समय व श्रम दोनों की अपार बचत की है। कठिन शोध कार्य अब कुछ ही क्षणों में संभव हो जाते हैं।',
          },
          {
            tagHindi: 'चुनौतियाँ (अभिशाप का भय)',
            tagEnglish: 'Body 2: Risks',
            textHindi:
              'परंतु सिक्के का दूसरा पहलू चिंताजनक है। मोबाइल और सोशल मीडिया की लत ने बच्चों से मैदानी खेल और पारिवारिक संवाद छीन लिए हैं। आँखों की समस्या, एकाग्रता में कमी, साइबर अपराध तथा भ्रामक सूचनाओं का प्रसार इसके गंभीर दुष्परिणाम हैं। मशीनों पर अत्यधिक निर्भरता मनुष्य की मौलिक सोच और शारीरिक सक्रियता को कुंद कर रही है।',
          },
          {
            tagHindi: 'उपसंहार (संतुलित निष्कर्ष)',
            tagEnglish: 'Conclusion',
            textHindi:
              'निष्कर्षतः कोई भी तकनीक स्वयं में अच्छी या बुरी नहीं होती; उसका उपयोगकर्ता ही उसे वरदान या अभिशाप बनाता है। यदि हम डिजिटल अनुशासन का पालन करें और तकनीक को स्वामी न बनाकर अपना सहायक रखें, तो यह निश्चय ही मानव कल्याण का सबसे बड़ा वरदान बनी रहेगी।',
          },
        ],
        examinerNoteHindi: 'ICSE कक्षा 9–10 मानक के अनुरूप पक्ष-विपक्ष दोनों का संतुलित विश्लेषण व ~240 शब्द की सीमा।',
        examinerNoteEnglish: 'Meets ICSE Class 9–10 rubric: balanced dual perspective, formal vocabulary, and ~240 words.',
      },
    ],
    fillBlanks: [
      {
        id: 'nb_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'निबंध संरचना (Essay Structure)',
        beforeBlankHindi: 'किसी निबंध का आरंभिक अनुच्छेद जो विषय का परिचय और पृष्ठभूमि स्पष्ट करता है, उसे ',
        afterBlankHindi: ' कहते हैं।',
        options: [
          { textHindi: 'प्रस्तावना (भूमिका)', textEnglish: 'Introduction' },
          { textHindi: 'उपसंहार', textEnglish: 'Conclusion' },
          { textHindi: 'संबोधन', textEnglish: 'Salutation' },
          { textHindi: 'अभिनिवेदन', textEnglish: 'Complimentary Close' },
        ],
        correctIndex: 0,
        hintHindi: 'निबंध के पहले अनुच्छेद का पारंपरिक नाम याद करें।',
        explanationHindi: 'निबंध के आरंभिक अनुच्छेद को प्रस्तावना (या भूमिका) और अंतिम अनुच्छेद को उपसंहार कहते हैं।',
        explanationEnglish: 'The opening paragraph of an essay is called प्रस्तावना (Introduction).',
      },
      {
        id: 'nb_fb_2',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'ICSE बोर्ड शब्द-सीमा',
        beforeBlankHindi: 'ICSE कक्षा 9–10 की बोर्ड परीक्षा में 15 अंकों के निबंध (प्रश्न 1) की निर्धारित शब्द-सीमा लगभग ',
        afterBlankHindi: ' होती है।',
        options: [
          { textHindi: '250 शब्द', textEnglish: '250 words' },
          { textHindi: '50 शब्द', textEnglish: '50 words' },
          { textHindi: '500 शब्द', textEnglish: '500 words' },
          { textHindi: '80 शब्द', textEnglish: '80 words' },
        ],
        correctIndex: 0,
        hintHindi: 'CISCE बोर्ड पेपर के Section A Question 1 के निर्देश देखें।',
        explanationHindi: 'ICSE हिंदी परीक्षा में प्रश्न 1 (निबंध/कहानी) के लिए लगभग 250 शब्दों की शब्द-सीमा निर्धारित है।',
        explanationEnglish: 'ICSE Board Q1 specifies approximately 250 words for essays.',
      },
      {
        id: 'nb_fb_3',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'विचारात्मक संयोजक (Cohesive Connector)',
        beforeBlankHindi: 'पर्यावरण संरक्षण केवल सरकार का काम नहीं है, ',
        afterBlankHindi: ' प्रत्येक नागरिक का नैतिक कर्तव्य भी है।',
        options: [
          { textHindi: 'अपितु / बल्कि', textEnglish: 'Rather / But also' },
          { textHindi: 'इसलिए कि', textEnglish: 'Because' },
          { textHindi: 'अर्थात्', textEnglish: 'That is' },
          { textHindi: 'यद्यपि', textEnglish: 'Although' },
        ],
        correctIndex: 0,
        hintHindi: '"न केवल ... बल्कि/अपितु ..." की जोड़ी ध्यान में रखें।',
        explanationHindi: 'दो विचारों को जोड़कर बल देने के लिए "अपितु" या "बल्कि" सर्वाधिक उपयुक्त संयोजक है।',
        explanationEnglish: '"अपितु / बल्कि" accurately pairs with negation to expand an argument.',
      },
      {
        id: 'nb_fb_4',
        gradeBand: 'कक्षा 5–7',
        contextLabelHindi: 'उपसंहार की शैली',
        beforeBlankHindi: 'निबंध के अंतिम अनुच्छेद (उपसंहार) में पूरे विषय का ',
        afterBlankHindi: ' प्रस्तुत किया जाता है।',
        options: [
          { textHindi: 'संतुलित सार व सकारात्मक संदेश', textEnglish: 'Balanced summary & positive message' },
          { textHindi: 'एक बिल्कुल नया असंबंधित विषय', textEnglish: 'A completely unrelated new topic' },
          { textHindi: 'प्रेषक का पता और दिनांक', textEnglish: 'Sender address and date' },
          { textHindi: 'अपूर्ण प्रश्नवाचक वाक्य', textEnglish: 'Incomplete interrogative lines' },
        ],
        correctIndex: 0,
        hintHindi: 'उपसंहार निबंध को किस प्रकार पूरा करता है?',
        explanationHindi: 'उपसंहार निबंध का समापन होता है, जिसमें संपूर्ण चर्चा का निचोड़ व सकारात्मक समाधान लिखा जाता है।',
        explanationEnglish: 'A strong conclusion synthesizes arguments and ends with a constructive takeaway.',
      },
    ],
    errorIdentification: [
      {
        id: 'nb_err_1',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'निबंध प्रारूप व भाषा त्रुटि पहचान',
        titleEnglish: 'Identify the structural or language flaw in this essay excerpt',
        instructionHindi: 'नीचे दिए गए निबंध के अंश को पढ़ें और उस पंक्ति पर क्लिक करें जिसमें प्रारूप या भाषा की गंभीर त्रुटि है।',
        instructionEnglish: 'Read the essay draft below and click the line that violates ICSE essay writing standards.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'वृक्षारोपण का महत्व' },
          { id: 'l2', tagHindi: 'प्रस्तावना', textHindi: 'पेड़-पौधे धरती का हरा शृंगार हैं जो हमें प्राणवायु और जीवन देते हैं।' },
          {
            id: 'l3',
            tagHindi: 'मध्य भाग',
            textHindi:
              'प्रस्तावना के बाद अब हम बुलेट पॉइंट्स में लिखेंगे: • पेड़ छाया देते हैं • मुझे आम खाना पसंद है • कल स्कूल में छुट्टी थी।',
          },
          { id: 'l4', tagHindi: 'उपसंहार', textHindi: 'अतः हम सभी को हर वर्ष कम से कम एक पौधा लगाकर उसकी देखभाल करनी चाहिए।' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi:
              'वनों की अंधाधुंध कटाई से प्रदूषण बढ़ रहा है; अतः वृक्ष लगाकर हम न केवल पर्यावरण बचाते हैं, अपितु जल-संरक्षण में भी योगदान देते हैं।',
            textEnglish: 'Cohesive prose paragraph connecting deforestation, pollution, and water conservation.',
          },
          {
            textHindi: 'प्रिय वृक्ष जी, सादर प्रणाम! कृपया मुझे आम देते रहें।',
            textEnglish: 'Letter salutation style.',
          },
          {
            textHindi: '• पॉइंट 1: पेड़ अच्छे हैं • पॉइंट 2: पेड़ लंबे हैं।',
            textEnglish: 'Bullet-list style notes.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'ICSE निबंध में बुलेट पॉइंट्स और विषय से भटकने वाली व्यक्तिगत बातें ("कल स्कूल में छुट्टी थी") अमान्य हैं। मध्य भाग प्रवाहमयी गद्य (prose) में विषय पर केंद्रित होना चाहिए।',
        explanationEnglish: 'ICSE essays require cohesive formal paragraphs, never bulleted notes or off-topic remarks.',
        topicTagHindi: 'निबंध लेखन',
      },
      {
        id: 'nb_err_2',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'अनुच्छेद व काल-संगति की त्रुटि',
        titleEnglish: 'Spot the grammatical & coherence error',
        instructionHindi: 'गलत पंक्ति चुनें और सही सुधार का चयन करें।',
        instructionEnglish: 'Click the erroneous line and choose the correct revision.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'मेरा प्रिय त्योहार: दीपावली' },
          { id: 'l2', tagHindi: 'पंक्ति १', textHindi: 'दीपावली भारत का सबसे प्रमुख और प्रकाशमय त्योहार है।' },
          { id: 'l3', tagHindi: 'पंक्ति २', textHindi: 'प्रत्येक वर्ष कार्तिक मास की अमावस्या को हम सभी दीप जलाती था और मिठाइयाँ बाँटेगा।' },
          { id: 'l4', tagHindi: 'पंक्ति ३', textHindi: 'हमें यह पर्व स्वच्छता, प्रेम और सुरक्षित पर्यावरण के साथ मनाना चाहिए।' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi: 'प्रत्येक वर्ष कार्तिक मास की अमावस्या को हम सभी दीप जलाते हैं और मिठाइयाँ बाँटते हैं।',
            textEnglish: 'Consistent plural present tense matching habitual festival description.',
          },
          {
            textHindi: 'दीपावली में हम दीप जलाया गया था और मिठाई खाई जाती थी।',
            textEnglish: 'Broken passive past tense.',
          },
          {
            textHindi: 'प्रत्येक वर्ष कार्तिक को मैं दीप जलाती हूँगी।',
            textEnglish: 'Ungrammatical verb form.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'नियमित वार्षिक त्योहार के वर्णन में सामान्य वर्तमान काल ("जलाते हैं... बाँटते हैं") प्रयुक्त होता है; "जलाती था" व "बाँटेगा" में लिंग, वचन व काल तीनों की अशुद्धि है।',
        explanationEnglish: 'Habitual descriptions require consistent present plural agreement (जलाते हैं / बाँटते हैं).',
        topicTagHindi: 'निबंध लेखन',
      },
      {
        id: 'nb_err_3',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'उपसंहार में विषय से भटकाव की त्रुटि',
        titleEnglish: 'Spot the flawed essay conclusion',
        instructionHindi: 'नीचे दिए गए निबंध अंश में अनुचित निष्कर्ष वाली पंक्ति पहचानें।',
        instructionEnglish: 'Identify the inappropriate concluding line.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'विद्यार्थी जीवन और अनुशासन' },
          { id: 'l2', tagHindi: 'प्रस्तावना', textHindi: 'अनुशासन वह सेतु है जो विद्यार्थी के सपनों को वास्तविक सफलता से जोड़ता है।' },
          { id: 'l3', tagHindi: 'मध्य भाग', textHindi: 'नियमित अध्ययन, समय-पालन और गुरुजनों का सम्मान विद्यार्थी के चरित्र का निर्माण करते हैं।' },
          {
            id: 'l4',
            tagHindi: 'उपसंहार',
            textHindi: 'इसलिए आजकल बाज़ार में नए स्मार्टफोन बहुत महँगे आ रहे हैं और सरकार को इनकी कीमत कम करनी चाहिए। भवदीय, क.ख.ग.।',
          },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'अतः अनुशासित जीवन अपनाकर ही आज के विद्यार्थी कल के जिम्मेदार और श्रेष्ठ नागरिक बन सकते हैं।',
            textEnglish: 'Focused synthesis tied directly to discipline.',
          },
          {
            textHindi: 'संलग्नक: विद्यार्थी की अंकतालिका। धन्यवाद।',
            textEnglish: 'Formal letter attachment sign-off.',
          },
          {
            textHindi: 'शुभरात्रि प्रिय डायरी, अब सोने का समय हो गया।',
            textEnglish: 'Diary closing line.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'निबंध के उपसंहार में कोई नया असंबद्ध विषय (स्मार्टफोन की कीमत) नहीं जोड़ा जाता और न ही पत्र की तरह "भवदीय" लिखा जाता है।',
        explanationEnglish: 'Never introduce an unrelated topic or a letter sign-off ("भवदीय") in an essay conclusion.',
        topicTagHindi: 'निबंध लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'nb_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'मेरा प्रिय विद्यालय / पुस्तकालय का महत्व',
        titleEnglish: 'My School Library & Reading Habits',
        promptHindi: 'पुस्तकें हमारी सच्ची मित्र हैं — लगभग 140 शब्दों में निबंध लिखें।',
        promptEnglish: 'Write an essay on why books are our best friends.',
        englishStarter: 'Books are our truest friends because they give us knowledge without asking for anything in return...',
        hindiStarter: 'पुस्तकें मानव की सबसे सच्ची और विश्वसनीय मित्र होती हैं। एक अच्छी पुस्तक...',
      },
      {
        id: 'nb_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'पर्यावरण संरक्षण एवं युवा पीढ़ी (ICSE 250 शब्द)',
        titleEnglish: 'Environmental Conservation & Youth',
        promptHindi: 'बढ़ते प्रदूषण की समस्या और समाधान पर लगभग 250 शब्दों का ICSE मानक निबंध लिखें।',
        promptEnglish: 'Write an ICSE 250-word essay on youth role in environmental protection.',
        englishStarter: 'Today our planet stands at a critical crossroads where rapid development threatens clean air and water...',
        hindiStarter: 'आज संपूर्ण विश्व विकास की अंधी दौड़ में पर्यावरण संतुलन के गंभीर संकट से जूझ रहा है...',
      },
    ],
  },

  kahani: {
    id: 'kahani',
    primaryTabId: 'kahani',
    topicKey: 'kahani',
    titleHindi: 'कहानी लेखन (Kahani)',
    titleEnglish: 'Story Writing (ICSE Narrative)',
    shortTitleHindi: 'कहानी',
    badgeHindi: 'ICSE कक्षा 5–10 कथा रचना',
    summaryHindi:
      'पात्रों, घटनाक्रम, संवादों और एक सार्थक सीख (शिक्षा) के साथ रोचक व मौलिक कथा की रचना करना कहानी लेखन है।',
    summaryEnglish:
      'Original narrative writing featuring relatable characters, plot conflict, natural dialogue, and a clear moral.',
    isBoxed: false,
    alignmentRuleHindi: 'शीर्षक ऊपर केंद्र में, भूतकाल में प्रवाहमयी कथा तथा अंत में एक पंक्ति की "शिक्षा / सीख"',
    alignmentRuleEnglish: 'Centered title, consistent past-tense narration, and concluding moral line',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '90–120 शब्द',
        marksHindi: '6–8 अंक',
        noteHindi: 'चित्र या रूपरेखा (संकेत-बिंदु) पर आधारित शिक्षाप्रद कहानी',
        noteEnglish: 'Outline/picture-based moral stories',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '120–150 शब्द',
        marksHindi: '8–10 अंक',
        noteHindi: 'संकेत-बिंदुओं को जोड़कर संवादयुक्त कहानी व शीर्षक लेखन',
        noteEnglish: 'Guided outline stories with dialogue and title',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '150–180 शब्द',
        marksHindi: '10 अंक',
        noteHindi: 'लोकोक्ति या अधूरी कहानी को पूर्ण करना',
        noteEnglish: 'Proverb-based & story completion prompts',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '180–220 शब्द',
        marksHindi: '12–15 अंक',
        noteHindi: 'मौलिक कथानक, चरित्र-चित्रण व नाटकीय मोड़ वाली कहानी',
        noteEnglish: 'Original creative fiction with climax and moral',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 1 विकल्प',
        statusLabelEnglish: 'ICSE Board Q1 Option',
        wordLimitHindi: 'लगभग 250 शब्द',
        marksHindi: '15 अंक',
        noteHindi: 'दी गई पंक्ति/मुहावरे/शीर्षक पर आधारित मौलिक कहानी (अंतिम पंक्ति से मेल अनिवार्य)',
        noteEnglish: 'Original 250-word story matching given prompt/closing line',
      },
      'कक्षा 10': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 1 विकल्प',
        statusLabelEnglish: 'ICSE Board Q1 Option',
        wordLimitHindi: 'लगभग 250 शब्द',
        marksHindi: '15 अंक',
        noteHindi: 'ICSE प्रश्न 1 में मौलिक कथा विकल्प — संवाद, पात्र-विकास व सटीक सीख के साथ 15 अंक',
        noteEnglish: 'ICSE Board Exam Q1 (15 marks) — original story matching rubric & prompt',
      },
    },
    markingScheme: [
      { partHindi: 'कथानक की मौलिकता व दिए गए संकेत से जुड़ाव', partEnglish: 'Original Plot & Prompt Alignment', weightHindi: '6 अंक' },
      { partHindi: 'पात्र, संवाद, रोचकता व चरम मोड़', partEnglish: 'Characterization, Dialogue & Climax', weightHindi: '5 अंक' },
      { partHindi: 'शीर्षक, सीख तथा भाषा-वर्तनी शुद्धता', partEnglish: 'Title, Moral & Language Purity', weightHindi: '4 अंक' },
    ],
    blueprintLines: [
      {
        id: 'kh_title',
        labelHindi: '१. आकर्षक शीर्षक (Catchy Title)',
        labelEnglish: 'Short Story Title',
        samplePlaceholder: 'ईमानदारी का सच्चा पुरस्कार',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'शीर्षक कहानी के मूल भाव से जुड़ा हो।',
        requiredNoteEnglish: 'Reflects the central theme without spoiling the twist.',
      },
      {
        id: 'kh_begin',
        labelHindi: '२. आरंभ व पात्र-परिचय (Beginning & Setting)',
        labelEnglish: 'Time, Place & Protagonist',
        samplePlaceholder: 'रामपुर गाँव में एक परिश्रमी किसान/बालक रहता था...',
        alignment: 'left',
        requiredNoteHindi: 'समय, स्थान और मुख्य पात्र का संक्षिप्त परिचय दें।',
        requiredNoteEnglish: 'Establish character and setting cleanly in past tense.',
      },
      {
        id: 'kh_mid',
        labelHindi: '३. समस्या व संवादयुक्त विकास (Conflict & Climax)',
        labelEnglish: 'Turning Point & Natural Dialogue',
        samplePlaceholder: 'अचानक आई संकट की घड़ी में पात्र ने क्या निर्णय लिया? छोटे संवाद जोड़ें।',
        alignment: 'left',
        requiredNoteHindi: 'जीवंत संवाद ("...") कहानी को रोचक बनाते हैं।',
        requiredNoteEnglish: 'Keep plot logical; avoid magic or implausible miracles unless prompt asks.',
      },
      {
        id: 'kh_end',
        labelHindi: '४. समाधान व अंत + सीख (Resolution & Moral)',
        labelEnglish: 'Ending & 1-Line Moral',
        samplePlaceholder: 'सीख: सच्ची मेहनत और ईमानदारी का फल सदैव मीठा होता है।',
        alignment: 'left',
        requiredNoteHindi: 'यदि प्रश्न में कोई अंतिम पंक्ति दी है, तो ठीक उसी से अंत करें।',
        requiredNoteEnglish: 'Must match prompt’s closing line or idiom if specified.',
      },
    ],
    dosHindi: [
      'कहानी को सामान्यतः भूतकाल (था, थी, हुए, गया) में ही आगे बढ़ाएँ।',
      '1–2 छोटे और स्वाभाविक संवाद उद्धरण चिह्न (“...”) में लिखें।',
      'यदि प्रश्न किसी लोकोक्ति (जैसे “अंत भला तो सब भला”) पर हो, तो घटना ठीक उसी को सिद्ध करे।',
      'अंत में स्पष्ट एक पंक्ति की “शिक्षा / सीख” अवश्य लिखें।',
    ],
    dontsHindi: [
      'चलते-चलते कहानी का काल अचानक भूतकाल से वर्तमान/भविष्य में न बदलें।',
      'बिना वजह बहुत अधिक पात्र (5–6 नाम) न भरें; 2–3 प्रमुख पात्र पर्याप्त हैं।',
      'दिए गए आरंभ या अंतिम वाक्य को मनमर्जी से बदलकर न लिखें।',
      'सिनेमा या परी-कथा जैसी अवास्तविक घटनाओं से बचें (जब तक विषय कल्पनात्मक न हो)।',
    ],
    formatChecklistItems: [
      { id: 'title', labelHindi: 'रोचक शीर्षक', labelEnglish: 'Catchy Title' },
      { id: 'characters', labelHindi: 'स्पष्ट पात्र व घटनाक्रम', labelEnglish: 'Clear Characters & Plot' },
      { id: 'tense', labelHindi: 'सुसंगत काल (भूतकाल)', labelEnglish: 'Consistent Tense' },
      { id: 'moral', labelHindi: 'सार्थक अंत व सीख', labelEnglish: 'Clear Resolution & Moral' },
    ],
    examples: [
      {
        id: 'kh_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'समझदार कबूतर (एकता में बल)',
        titleEnglish: 'The Wise Pigeons (Unity is Strength)',
        promptHindi: 'संकेत-बिंदु: जंगल में कबूतरों का झुंड — बहेलिये का जाल — लालच में फँसना — बूढ़े कबूतर की सलाह — एक साथ उड़ना — सीख।',
        promptEnglish: 'Write a guided outline story based on the hunter’s net and unity.',
        wordCountApprox: 135,
        hintPoints: ['कबूतरों का झुंड', 'बहेलिये का जाल', 'एक साथ उड़ने की योजना', 'सीख'],
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'एकता में बल है', alignment: 'center', isHeading: true },
          {
            tagHindi: 'आरंभ',
            tagEnglish: 'Beginning',
            textHindi:
              'एक हरे-भरे जंगल में कबूतरों का एक झुंड रहता था। एक दिन आकाश में उड़ते समय उन्होंने नीचे धरती पर चावल के दाने बिखरे देखे। सभी कबूतर दाना चुगने नीचे उतर आए, किंतु उन्हें ज्ञात न था कि वह एक बहेलिये द्वारा बिछाया गया जाल था।',
          },
          {
            tagHindi: 'समस्या व संवाद',
            tagEnglish: 'Climax & Dialogue',
            textHindi:
              'दाना चुगते ही सभी कबूतर जाल में फँस गए। बहेलिये को पास आते देख वे घबरा गए। तभी एक बुद्धिमान बूढ़े कबूतर ने कहा, “घबराओ मत मित्रो! यदि हम सब एक साथ जोर लगाकर उड़ें, तो इस जाल को भी उड़ा ले जा सकते हैं।”',
          },
          {
            tagHindi: 'समाधान व सीख',
            tagEnglish: 'Ending & Moral',
            textHindi:
              'सभी कबूतरों ने एक साथ पंख फड़फड़ाए और पूरा जाल लेकर आकाश में उड़ चले। बहेलिया हाथ मलता रह गया। दूर जाकर उनके मित्र चूहे ने जाल काटकर उन्हें मुक्त कर दिया।\nशिक्षा: एकता और सूझ-बूझ से बड़ी से बड़ी विपत्ति को भी टाला जा सकता है।',
          },
        ],
        examinerNoteHindi: 'सभी संकेत-बिंदुओं का क्रमशः समावेश, उद्धरण चिह्न में संवाद व स्पष्ट शिक्षा।',
        examinerNoteEnglish: 'Covers every outline cue seamlessly with dialogue punctuation and a crisp moral.',
      },
      {
        id: 'kh_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'सच्ची विजय (ICSE 250 शब्द मानक)',
        titleEnglish: 'True Victory (ICSE Board Standard)',
        promptHindi: 'एक ऐसी मौलिक कहानी लिखिए जिसका अंत इस वाक्य से हो— “उस दिन मुझे समझ आया कि दूसरों के चेहरे पर मुस्कान लाना ही सबसे बड़ी जीत है।”',
        promptEnglish: 'Write an original story ending with: "...bringing a smile to others’ faces is the greatest victory."',
        wordCountApprox: 238,
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'सच्ची विजय', alignment: 'center', isHeading: true },
          {
            tagHindi: 'आरंभ',
            tagEnglish: 'Introduction',
            textHindi:
              'वार्षिक जिला मैराथन दौड़ के लिए आरव ने पूरे छह माह तक कड़ा अभ्यास किया था। स्वर्ण पदक जीतना उसका एकमात्र सपना था। प्रातः छह बजे सीटी बजते ही लगभग सौ धावक एक साथ दौड़ पड़े। आरव सबसे आगे की पंक्ति में बिजली की गति से बढ़ रहा था।',
          },
          {
            tagHindi: 'संघर्ष व चरम मोड़',
            tagEnglish: 'Climax',
            textHindi:
              'अंतिम दो सौ मीटर शेष थे कि अचानक आरव के ठीक बगल में दौड़ रहा एक छोटा धावक रोहन लड़खड़ाकर गिर पड़ा। उसके घुटने से रक्त बहने लगा। पीछे मुड़कर आरव ने देखा—अन्य प्रतिभागी आगे निकलते जा रहे थे। पदक बस कुछ कदम दूर था, पर रोहन की दर्द भरी पुकार ने आरव के कदम रोक दिए।',
          },
          {
            tagHindi: 'संवाद व समाधान',
            tagEnglish: 'Resolution',
            textHindi:
              'आरव वापस लौटा और रोहन को सहारा देते हुए बोला, “हिम्मत रखो भाई, हम दोनों साथ-साथ यह रेखा पार करेंगे।” दोनों लँगड़ाते हुए साथ दौड़े और जब वे अंतिम रेखा पर पहुँचे, तब तक प्रथम तीन विजेता घोषित हो चुके थे। फिर भी पूरे मैदान ने खड़े होकर तालियों से उनका स्वागत किया। मुख्य अतिथि ने आरव को विशेष ‘मानवता सम्मान’ प्रदान किया। रोहन की आँखों में कृतज्ञता के आँसू चमक रहे थे।',
          },
          {
            tagHindi: 'प्रश्नानुसार अंतिम पंक्ति व सीख',
            tagEnglish: 'Closing Line & Moral',
            textHindi:
              'उस दिन मुझे समझ आया कि दूसरों के चेहरे पर मुस्कान लाना ही सबसे बड़ी जीत है।\nसीख: खेल हो या जीवन, स्वार्थ से ऊपर उठकर की गई सहायता पदक से भी अधिक मूल्यवान होती है।',
          },
        ],
        examinerNoteHindi: 'प्रश्नानुसार सटीक अंतिम पंक्ति, भावनात्मक चरम मोड़ व ICSE शब्द-सीमा के अनुरूप भाषा।',
        examinerNoteEnglish: 'Closes word-for-word on the prompt sentence with strong emotional tension.',
      },
    ],
    fillBlanks: [
      {
        id: 'kh_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'कहानी की काल-संगति',
        beforeBlankHindi: 'कहानी लेखन में घटनाओं का वर्णन सामान्यतः ',
        afterBlankHindi: ' में किया जाता है ताकि घटना पहले घटित हुई प्रतीत हो।',
        options: [
          { textHindi: 'भूतकाल (था, थी, गया)', textEnglish: 'Past Tense' },
          { textHindi: 'आज्ञार्थक भविष्यत् काल', textEnglish: 'Imperative Future' },
          { textHindi: 'केवल प्रश्नवाचक शैली', textEnglish: 'Interrogative Only' },
          { textHindi: 'सूचना-पत्र शैली', textEnglish: 'Notice Style' },
        ],
        correctIndex: 0,
        hintHindi: '“एक समय की बात है, एक गाँव में...” किस काल में होता है?',
        explanationHindi: 'परंपरागत रूप से कहानी भूतकाल में लिखी जाती है और संवाद आवश्यकतानुसार वर्तमान/भविष्य में हो सकते हैं।',
        explanationEnglish: 'Narrative storytelling follows past tense while dialogues naturally use spoken tense.',
      },
      {
        id: 'kh_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'संवाद विराम-चिह्न',
        beforeBlankHindi: 'कहानी में पात्र के मुख से निकले प्रत्यक्ष कथन को ',
        afterBlankHindi: ' के भीतर लिखा जाता है।',
        options: [
          { textHindi: 'उद्धरण चिह्न (“...”)', textEnglish: 'Quotation Marks' },
          { textHindi: 'कोष्ठक चिह्न ([...])', textEnglish: 'Square Brackets' },
          { textHindi: 'लाघव चिह्न (।)', textEnglish: 'Abbreviation Sign' },
          { textHindi: 'विस्मयादिबोधक चिह्न (!)', textEnglish: 'Exclamation Mark Only' },
        ],
        correctIndex: 0,
        hintHindi: 'अध्यापक ने कहा, ___ परिश्रम ही सफलता की कुंजी है। ___',
        explanationHindi: 'किसी पात्र की कही हुई ज्यों-की-त्यों बात को दोहरे उद्धरण चिह्न (“...”) में रखते हैं।',
        explanationEnglish: 'Direct spoken dialogue in Hindi stories is enclosed in double quotation marks (“...”).',
      },
      {
        id: 'kh_fb_3',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'ICSE निर्देश पालन',
        beforeBlankHindi: 'यदि प्रश्न में कहानी की अंतिम पंक्ति दी गई हो, तो विद्यार्थी को अपनी कहानी ',
        afterBlankHindi: ' समाप्त करनी चाहिए।',
        options: [
          { textHindi: 'ठीक उसी दी गई पंक्ति पर', textEnglish: 'On that exact given sentence' },
          { textHindi: 'उस पंक्ति को कहानी के बीच में बदलकर', textEnglish: 'By altering it mid-story' },
          { textHindi: 'शीर्षक में उस पंक्ति को लिखकर', textEnglish: 'By putting it only as the title' },
          { textHindi: 'बिना उस पंक्ति के प्रयोग किए', textEnglish: 'Ignoring the sentence' },
        ],
        correctIndex: 0,
        hintHindi: 'ICSE परीक्षक कहानी का अंत कैसे जाँचता है?',
        explanationHindi: 'ICSE नियम के अनुसार प्रारंभिक या अंतिम निर्धारित वाक्य का स्थान व शब्दावली ज्यों-की-त्यों रखनी अनिवार्य है।',
        explanationEnglish: 'ICSE mandates using a prescribed opening/closing sentence verbatim in its designated position.',
      },
      {
        id: 'kh_fb_4',
        gradeBand: 'कक्षा 5–7',
        contextLabelHindi: 'कहानी का निष्कर्ष',
        beforeBlankHindi: '“जैसी करनी वैसी भरनी” लोकोक्ति पर बनी कहानी का अंत ',
        afterBlankHindi: ' दर्शाते हुए होना चाहिए।',
        options: [
          { textHindi: 'अपने कर्मों के अनुरूप परिणाम मिलना', textEnglish: 'Reaping the consequences of one’s deeds' },
          { textHindi: 'बिना मेहनत के लॉटरी लग जाना', textEnglish: 'Winning unearned luck' },
          { textHindi: 'अपरिचित व्यक्ति को पत्र लिखना', textEnglish: 'Writing a letter to a stranger' },
          { textHindi: 'समय की बर्बादी का प्रचार', textEnglish: 'Promoting laziness' },
        ],
        correctIndex: 0,
        hintHindi: 'लोकोक्ति के वास्तविक अर्थ से कहानी के परिणाम को जोड़ें।',
        explanationHindi: 'कहानी की पूरी घटनाएँ और उसका अंतिम परिणाम लोकोक्ति के अर्थ को सिद्ध करने चाहिए।',
        explanationEnglish: 'The climax and outcome must illustrate the exact truth of the idiom/proverb.',
      },
    ],
    errorIdentification: [
      {
        id: 'kh_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'काल-परिवर्तन व विराम-चिह्न त्रुटि',
        titleEnglish: 'Identify the tense shift error in this story',
        instructionHindi: 'नीचे दी गई कहानी की पंक्तियों में से काल-असंगति वाली अशुद्ध पंक्ति पहचानें।',
        instructionEnglish: 'Click the line that abruptly breaks story tense consistency.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'सच्चा मित्र' },
          { id: 'l2', tagHindi: 'पंक्ति १', textHindi: 'सोनपुर गाँव में राहुल और मोहन नाम के दो घनिष्ठ मित्र रहते थे।' },
          { id: 'l3', tagHindi: 'पंक्ति २', textHindi: 'एक दिन दोनों जंगल में सैर करने जाते हैं और अचानक सामने एक बड़ा भालू देख रहा हूँ।' },
          { id: 'l4', tagHindi: 'पंक्ति ३', textHindi: 'सीख: संकट में साथ छोड़ने वाला सच्चा मित्र नहीं होता।' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi: 'एक दिन दोनों जंगल की ओर गए, तभी अचानक सामने से एक बड़ा भालू आता दिखाई दिया।',
            textEnglish: 'Consistent third-person past tense narrative.',
          },
          {
            textHindi: 'एक दिन दोनों जंगल जाएगा और भालू देखेंगे।',
            textEnglish: 'Future tense mismatch.',
          },
          {
            textHindi: 'प्रिय मित्र मोहन, जंगल में भालू आया था।',
            textEnglish: 'Letter salutation format.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'पूरी कहानी अन्य पुरुष भूतकाल ("रहते थे") में चल रही थी, अतः "जाते हैं / देख रहा हूँ" लिखकर काल और पुरुष दोनों बदल देना गंभीर त्रुटि है।',
        explanationEnglish: 'Do not shift abruptly from 3rd-person past tense to present/1st-person mid-story.',
        topicTagHindi: 'कहानी लेखन',
      },
      {
        id: 'kh_err_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'सीख व कथानक में विरोधाभास',
        titleEnglish: 'Spot the mismatched moral / ending line',
        instructionHindi: 'इस कहानी में कौन-सी पंक्ति कथानक की सीख से बिल्कुल मेल नहीं खाती?',
        instructionEnglish: 'Identify the line whose moral contradicts the actual plot.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'परिश्रम का मीठा फल' },
          { id: 'l2', tagHindi: 'पंक्ति १', textHindi: 'कबीर ने रात-दिन एक करके अभ्यास किया और गणित की कठिन प्रतियोगिता में प्रथम स्थान पाया।' },
          { id: 'l3', tagHindi: 'पंक्ति २', textHindi: 'अध्यापक ने उसकी लगन की सराहना करते हुए कहा, “मेहनती विद्यार्थी कभी असफल नहीं होते।”' },
          { id: 'l4', tagHindi: 'पंक्ति ३', textHindi: 'सीख: हमें पढ़ाई छोड़कर केवल भाग्य के भरोसे बैठे रहना चाहिए।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'सीख: निरंतर परिश्रम और दृढ़ संकल्प से असंभव लक्ष्य भी संभव हो जाता है।',
            textEnglish: 'Directly reinforces hard work and determination.',
          },
          {
            textHindi: 'सीख: कभी भी किसी मित्र की मदद नहीं करनी चाहिए।',
            textEnglish: 'Unrelated negative moral.',
          },
          {
            textHindi: 'दिनांक: 15 नवंबर, 2026 — कबीर।',
            textEnglish: 'Date sign-off instead of moral.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'कहानी मेहनत की जीत दिखा रही है, जबकि सीख "भाग्य के भरोसे बैठे रहना" इसके ठीक विपरीत अर्थ दे रही है।',
        explanationEnglish: 'The closing moral must accurately summarize the value proven by the story events.',
        topicTagHindi: 'कहानी लेखन',
      },
      {
        id: 'kh_err_3',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'शीर्षक व संवाद-विराम अशुद्धि',
        titleEnglish: 'Identify missing title/dialogue punctuation error',
        instructionHindi: 'अशुद्ध पंक्ति को चुनकर सही सुधार बताएँ।',
        instructionEnglish: 'Click the line with flawed dialogue & title formatting.',
        lines: [
          { id: 'l1', tagHindi: 'पंक्ति १', textHindi: 'चालाक लोमड़ी (शीर्षक)' },
          { id: 'l2', tagHindi: 'पंक्ति २', textHindi: 'भूखी लोमड़ी ने पेड़ पर कौए की चोंच में रोटी का टुकड़ा देखा।' },
          { id: 'l3', tagHindi: 'पंक्ति ३', textHindi: 'लोमड़ी ने कहा कौए भैया तुम गाते बहुत अच्छा हो मुझे एक गीत सुनाओ' },
          { id: 'l4', tagHindi: 'पंक्ति ४', textHindi: 'कौए ने जैसे ही गाने के लिए मुँह खोला, रोटी नीचे गिर गई। सीख: झूठी प्रशंसा से सावधान रहें।' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi: 'लोमड़ी ने कहा, “कौए भैया, तुम बहुत अच्छा गाते हो; कृपया मुझे भी एक गीत सुनाओ।”',
            textEnglish: 'Adds comma, quotation marks, and full stop properly.',
          },
          {
            textHindi: 'लोमड़ी ने कौए से पत्र में लिखा कि सेवा में गाना गाओ।',
            textEnglish: 'Formal letter phrase.',
          },
          {
            textHindi: 'लोमड़ी बोला कि रोटी मुझे दे दो।',
            textEnglish: 'Gender mismatch (लोमड़ी is feminine) and missing quotes.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'प्रत्यक्ष संवाद में अल्पविराम (,), दोहरे उद्धरण चिह्न (“...”) और पूर्ण विराम (।) लगाना आवश्यक है।',
        explanationEnglish: 'Dialogue lines must include comma + quotation marks + terminal punctuation.',
        topicTagHindi: 'कहानी लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'kh_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'मेहनत की कमाई (संकेत-बिंदु आधारित)',
        titleEnglish: 'The Fruit of Honest Hard Work',
        promptHindi: 'संकेत: आलसी बेटा — पिता की शर्त — स्वयं कमाए एक सिक्के की कीमत समझना — सीख।',
        promptEnglish: 'Write a story about a lazy boy who learns the value of hard-earned money.',
        englishStarter: 'Once there was a wealthy merchant whose son was very lazy and spent money carelessly...',
        hindiStarter: 'एक नगर में एक परिश्रमी व्यापारी रहता था, किंतु उसका पुत्र बहुत आलसी था...',
      },
      {
        id: 'kh_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: '“अंत भला तो सब भला” (ICSE मुहावरा कथा)',
        titleEnglish: 'All’s Well That Ends Well',
        promptHindi: 'इस कहावत को सिद्ध करती हुई लगभग 250 शब्दों की एक मौलिक कहानी लिखिए।',
        promptEnglish: 'Write a 250-word ICSE original story proving "All’s well that ends well."',
        englishStarter: 'Everything seemed to go wrong on the morning of the state science exhibition when Rohan missed his bus...',
        hindiStarter: 'राज्य स्तरीय विज्ञान प्रदर्शनी की सुबह मानो सब कुछ विपरीत हो रहा था...',
      },
    ],
  },

  anuched: {
    id: 'anuched',
    primaryTabId: 'anuched',
    topicKey: 'anuched',
    titleHindi: 'अनुच्छेद लेखन (Anuched)',
    titleEnglish: 'Paragraph Writing (Single Cohesive Block)',
    shortTitleHindi: 'अनुच्छेद',
    badgeHindi: 'ICSE कक्षा 5–8 मुख्य | 9–10 आधार',
    summaryHindi:
      'किसी एक सीमित विषय या विचार को बिना उपशीर्षक व बिना अनुच्छेद तोड़े, केवल एक ही सुगठित अनुच्छेद (80–120 शब्द) में प्रस्तुत करना अनुच्छेद लेखन है।',
    summaryEnglish:
      'Concise single-paragraph writing (~80–120 words) weaving given hint points seamlessly without subheadings or paragraph breaks.',
    isBoxed: false,
    alignmentRuleHindi: 'केवल एक ही अनुच्छेद (Strictly ONE Paragraph) — बीच में नई लाइन या हेडिंग नहीं',
    alignmentRuleEnglish: 'Strictly ONE unified paragraph (no multiple paragraphs, no bullet lists)',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '60–80 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'दैनिक जीवन के परिचित विषयों पर संकेत-बिंदु सहित एकल अनुच्छेद',
        noteEnglish: 'Short 60–80 word single paragraph with hint points',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '80–100 शब्द',
        marksHindi: '5–6 अंक',
        noteHindi: '3–4 संकेत-बिंदुओं को बिना हेडिंग के एक अनुच्छेद में पिरोना',
        noteEnglish: '80–100 word cohesive single paragraph integrating hint cues',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '90–110 शब्द',
        marksHindi: '6–7 अंक',
        noteHindi: 'तथ्य, कारण व निष्कर्ष का एक ही सघन अनुच्छेद में संतुलन',
        noteEnglish: 'Balanced single-paragraph synthesis within 110 words',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '100–120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'सामाजिक व समसामयिक विषयों पर संक्षिप्त, प्रभावशाली अनुच्छेद',
        noteEnglish: 'Crisp 100–120 word thematic paragraph writing',
      },
      'कक्षा 9': {
        status: 'supporting',
        statusLabelHindi: 'सहायक / निबंध आधार',
        statusLabelEnglish: 'Supporting Skill',
        wordLimitHindi: '100–120 शब्द',
        marksHindi: 'आंतरिक मूल्यांकन',
        noteHindi: 'ICSE निबंध के मुख्य अनुच्छेद सशक्त करने व संक्षिप्त लेखन अभ्यास हेतु उपयोगी',
        noteEnglish: 'Used for internal assessment & building strong essay body paragraphs',
      },
      'कक्षा 10': {
        status: 'optional',
        statusLabelHindi: 'आधारभूत अभ्यास',
        statusLabelEnglish: 'Foundational Practice',
        wordLimitHindi: '100–120 शब्द',
        marksHindi: 'वैकल्पिक अभ्यास',
        noteHindi: 'बोर्ड प्रश्न 1 में पूर्ण निबंध (250 शब्द) आता है; यह सटीक गद्य-गठन का अभ्यास है',
        noteEnglish: 'Great drill for tight prose; ICSE Board Q1 tests full 250-word essays',
      },
    },
    markingScheme: [
      { partHindi: 'एकल अनुच्छेद नियम व विषय-केंद्रितता', partEnglish: 'Single-Paragraph Unity & Focus', weightHindi: '2 अंक' },
      { partHindi: 'सभी संकेत-बिंदुओं का क्रमबद्ध समावेश', partEnglish: 'Coverage of All Hint Points', weightHindi: '3 अंक' },
      { partHindi: 'शब्द-सीमा व व्याकरणिक शुद्धता', partEnglish: 'Word Limit & Grammar Purity', weightHindi: '2 अंक' },
    ],
    blueprintLines: [
      {
        id: 'an_title',
        labelHindi: '१. शीर्षक (Centered Title)',
        labelEnglish: 'Topic Title',
        samplePlaceholder: 'प्रातःकालीन भ्रमण',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'केवल विषय का नाम शीर्ष पर लिखें।',
        requiredNoteEnglish: 'Simple centered heading.',
      },
      {
        id: 'an_hints',
        labelHindi: '२. संकेत-बिंदुओं का ध्यान (Mental Roadmap Only)',
        labelEnglish: 'Given Hints (Do NOT print as headings inside paragraph)',
        samplePlaceholder: '(संकेत: शुद्ध वायु — स्वास्थ्य लाभ — मन की प्रसन्नता — निष्कर्ष)',
        alignment: 'left',
        requiredNoteHindi: 'संकेत-बिंदुओं को वाक्यों के प्रवाह में पिरोएँ, हेडिंग बनाकर न लिखें।',
        requiredNoteEnglish: 'Weave every hint naturally into sentences.',
      },
      {
        id: 'an_body',
        labelHindi: '३. एकल सुगठित अनुच्छेद (ONE Continuous Paragraph — 80–120 शब्द)',
        labelEnglish: 'Single Unified Block',
        samplePlaceholder: 'पहले वाक्य में विषय का परिचय, मध्य 4–5 वाक्यों में मुख्य बिंदु व उदाहरण, तथा अंतिम 1–2 वाक्यों में सार।',
        alignment: 'left',
        requiredNoteHindi: 'कहीं भी लाइन न बदलें! पूरा लेखन एक ही पैराग्राफ में पूरा करें।',
        requiredNoteEnglish: 'No paragraph breaks anywhere inside the body.',
      },
    ],
    dosHindi: [
      'संपूर्ण अनुच्छेद एक ही पैराग्राफ में लिखें—एक भी पंक्ति बीच में न तोड़ें।',
      'यदि प्रश्न में 3–4 संकेत-बिंदु दिए गए हैं, तो प्रत्येक को उसी क्रम में शामिल करें।',
      'पहला वाक्य आकर्षक और विषय को सीधे स्पष्ट करने वाला रखें।',
      'वाक्य छोटे, स्पष्ट और शब्द-सीमा (80–120 शब्द) के भीतर रखें।',
    ],
    dontsHindi: [
      'निबंध की तरह “प्रस्तावना”, “लाभ”, “उपसंहार” जैसी हेडिंग न डालें।',
      'दो या तीन अलग-अलग पैराग्राफ न बनाएँ।',
      'विस्तारपूर्वक लंबी कहानियाँ या अनावश्यक उदाहरण न जोड़ें।',
    ],
    formatChecklistItems: [
      { id: 'title', labelHindi: 'सटीक शीर्षक', labelEnglish: 'Clear Title' },
      { id: 'single_para', labelHindi: 'केवल एक ही अनुच्छेद (बिना पैरा तोड़े)', labelEnglish: 'Strictly One Paragraph' },
      { id: 'no_headings', labelHindi: 'कोई उपशीर्षक/हेडिंग नहीं', labelEnglish: 'No Subheadings' },
      { id: 'concise', labelHindi: 'सटीक शब्द-सीमा व समापन वाक्य', labelEnglish: 'Concise Concluding Sentence' },
    ],
    examples: [
      {
        id: 'an_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'प्रातःकालीन भ्रमण',
        titleEnglish: 'Morning Walk',
        promptHindi: 'संकेत-बिंदु: सूर्योदय का सुंदर दृश्य • शुद्ध वायु और स्वास्थ्य • पूरे दिन की स्फूर्ति • निष्कर्ष। (लगभग 85 शब्द)',
        promptEnglish: 'Write an 85-word single paragraph using the given hints.',
        wordCountApprox: 88,
        hintPoints: ['सूर्योदय का दृश्य', 'शुद्ध वायु व स्वास्थ्य', 'दिन भर स्फूर्ति', 'निष्कर्ष'],
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'प्रातःकालीन भ्रमण', alignment: 'center', isHeading: true },
          {
            tagHindi: 'एकल अनुच्छेद (सभी संकेत-बिंदु सहित)',
            tagEnglish: 'Single Cohesive Paragraph',
            textHindi:
              'प्रातःकालीन भ्रमण उत्तम स्वास्थ्य की सबसे सरल और निःशुल्क औषधि है। भोर के समय उगते सूर्य की सुनहरी किरणें, पक्षियों का मधुर कलरव और फूलों पर चमकती ओस की बूँदें मन को असीम शांति प्रदान करती हैं। इस समय वातावरण में प्रदूषण नहीं होता, जिससे फेफड़ों को शुद्ध प्राणवायु मिलती है और रक्त-संचार बेहतर होता है। नियमित सैर करने से आलस्य दूर भागता है तथा विद्यार्थी पूरे दिन स्फूर्ति और एकाग्रता से अध्ययन कर पाते हैं। सच ही कहा गया है कि स्वस्थ शरीर में ही स्वस्थ मस्तिष्क का निवास होता है; अतः हमें प्रतिदिन प्रातः टहलने का नियम अवश्य बनाना चाहिए।',
          },
        ],
        examinerNoteHindi: 'बिना किसी पैराग्राफ ब्रेक के चारों संकेत-बिंदु सहजता से 88 शब्दों में समाहित।',
        examinerNoteEnglish: 'All 4 hints smoothly woven into one continuous 88-word paragraph.',
      },
      {
        id: 'an_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'मोबाइल फ़ोन: सुविधा या दुविधा',
        titleEnglish: 'Mobile Phone: Convenience or Dilemma',
        promptHindi: 'संकेत-बिंदु: आज की आवश्यकता • शिक्षा व संचार में लाभ • अत्यधिक उपयोग के खतरे • संतुलित प्रयोग। (लगभग 110 शब्द)',
        promptEnglish: 'Write a 110-word single paragraph weighing benefits and risks.',
        wordCountApprox: 112,
        hintPoints: ['आधुनिक आवश्यकता', 'शिक्षा व संचार', 'लत और खतरे', 'संतुलित प्रयोग'],
        blocks: [
          { tagHindi: 'शीर्षक', tagEnglish: 'Title', textHindi: 'मोबाइल फ़ोन: सुविधा या दुविधा', alignment: 'center', isHeading: true },
          {
            tagHindi: 'एकल अनुच्छेद',
            tagEnglish: 'Single Cohesive Paragraph',
            textHindi:
              'आधुनिक जीवन में मोबाइल फ़ोन केवल बात करने का यंत्र नहीं, बल्कि चलते-फिरते कार्यालय और पुस्तकालय का रूप ले चुका है। आपातकाल में तुरंत संपर्क, ऑनलाइन शिक्षा, मानचित्र और डिजिटल भुगतान ने हमारे अनेक कार्य पलक झपकते ही सरल बना दिए हैं। किंतु इस सुविधा का अतिरेक आज गंभीर दुविधा बन गया है। घंटों स्क्रीन पर आँखें गड़ाए रहने से बच्चों का स्वास्थ्य, नींद, नेत्र-ज्योति और आपसी पारिवारिक संवाद बुरी तरह प्रभावित हो रहा है। वास्तव में मोबाइल विज्ञान का श्रेष्ठ उपहार है, पर इसकी बागडोर हमारे विवेक के हाथ में होनी चाहिए। सीमित और रचनात्मक उपयोग करके ही हम इसे अपने लिए वरदान बनाए रख सकते हैं।',
          },
        ],
        examinerNoteHindi: 'एक ही अनुच्छेद में संतुलित तर्क और प्रभावी समापन।',
        examinerNoteEnglish: 'Tight single-block structure balancing pros, cons, and a crisp conclusion.',
      },
    ],
    fillBlanks: [
      {
        id: 'an_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'अनुच्छेद लेखन का मूल नियम',
        beforeBlankHindi: 'अनुच्छेद लेखन और निबंध लेखन में मुख्य अंतर यह है कि अनुच्छेद सदैव ',
        afterBlankHindi: ' में लिखा जाता है।',
        options: [
          { textHindi: 'केवल एक ही पैराग्राफ (एकल अनुच्छेद)', textEnglish: 'Strictly one paragraph' },
          { textHindi: 'कम से कम 5 अलग-अलग भागों', textEnglish: 'At least 5 sections' },
          { textHindi: 'एक आयताकार बॉक्स व दिनांक', textEnglish: 'Rectangular box & date' },
          { textHindi: 'संवाद-शैली', textEnglish: 'Dialogue format' },
        ],
        correctIndex: 0,
        hintHindi: 'नाम “अनुच्छेद” (singular paragraph) पर ध्यान दें।',
        explanationHindi: 'अनुच्छेद लेखन में पूरा विषय एक ही अनुच्छेद में बिना उपशीर्षक और पैरा बदले लिखा जाता है।',
        explanationEnglish: 'Anuched literally means a single unified paragraph with zero breaks.',
      },
      {
        id: 'an_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'संकेत-बिंदु नियम',
        beforeBlankHindi: 'परीक्षा में दिए गए संकेत-बिंदुओं को अनुच्छेद के अंदर ',
        afterBlankHindi: ' लिखना चाहिए।',
        options: [
          { textHindi: 'हेडिंग बनाए बिना वाक्यों में पिरोकर', textEnglish: 'Woven smoothly without printing headings' },
          { textHindi: 'लाल पेन से अलग-अलग बुलेट बनाकर', textEnglish: 'As separate bullets' },
          { textHindi: 'बिल्कुल छोड़कर', textEnglish: 'Completely skipped' },
          { textHindi: 'अंत में परिशिष्ट के रूप में', textEnglish: 'At the end as an appendix' },
        ],
        correctIndex: 0,
        hintHindi: 'ICSE अनुच्छेद में हेडिंग क्यों मना है?',
        explanationHindi: 'संकेत-बिंदु मार्गदर्शन के लिए होते हैं; उन्हें हेडिंग के रूप में अलग से नहीं लिखा जाता।',
        explanationEnglish: 'Hint points guide the flow of sentences; never display them as subheadings.',
      },
      {
        id: 'an_fb_3',
        gradeBand: 'कक्षा 5–7',
        contextLabelHindi: 'अनुच्छेद शब्द-सीमा',
        beforeBlankHindi: 'कक्षा 6 से 8 के ICSE पाठ्यक्रम में अनुच्छेद लेखन की मानक शब्द-सीमा लगभग ',
        afterBlankHindi: ' शब्द होती है।',
        options: [
          { textHindi: '80 से 120', textEnglish: '80 to 120' },
          { textHindi: '20 से 30', textEnglish: '20 to 30' },
          { textHindi: '350 से 400', textEnglish: '350 to 400' },
          { textHindi: '500', textEnglish: '500' },
        ],
        correctIndex: 0,
        hintHindi: 'यह निबंध के आधे से थोड़ा कम होता है।',
        explanationHindi: 'मध्य कक्षाओं में अनुच्छेद संक्षिप्त व सारगर्भित (लगभग 80–120 शब्द) होना चाहिए।',
        explanationEnglish: 'Middle-school ICSE paragraphs aim for 80–120 crisp words.',
      },
      {
        id: 'an_fb_4',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'प्रभावी वाक्य-संयोजन',
        beforeBlankHindi: 'जहाँ एक ओर खेल हमारे शरीर को चुस्त रखते हैं, ',
        afterBlankHindi: ' वे हमें टीम-भावना और अनुशासन भी सिखाते हैं।',
        options: [
          { textHindi: 'वहीं दूसरी ओर', textEnglish: 'On the other hand / at the same time' },
          { textHindi: 'तथापि किंतु', textEnglish: 'Nevertheless but' },
          { textHindi: 'भवदीय', textEnglish: 'Yours faithfully' },
          { textHindi: 'सूचित किया जाता है', textEnglish: 'It is notified' },
        ],
        correctIndex: 0,
        hintHindi: '“जहाँ एक ओर...” का सही जोड़ा चुनें।',
        explanationHindi: '“जहाँ एक ओर ... वहीं दूसरी ओर ...” मिश्र व सुगठित अनुच्छेद बनाने का सटीक युग्म है।',
        explanationEnglish: '“जहाँ एक ओर ... वहीं दूसरी ओर ...” connects complementary points smoothly.',
      },
    ],
    errorIdentification: [
      {
        id: 'an_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'अनुच्छेद में बहु-पैराग्राफ व हेडिंग त्रुटि',
        titleEnglish: 'Identify the structural violation in this Anuched',
        instructionHindi: 'नीचे दिए गए अनुच्छेद प्रारूप में सबसे बड़ी नियम-विरोधी पंक्ति पहचानें।',
        instructionEnglish: 'Click the line that breaks the single-paragraph Anuched rule.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'स्वच्छ भारत, स्वस्थ भारत' },
          {
            id: 'l2',
            tagHindi: 'भाग १',
            textHindi: 'स्वच्छता केवल सुंदरता नहीं, बल्कि स्वस्थ जीवन की पहली शर्त है। गंदगी अनेक रोगों को जन्म देती है।',
          },
          {
            id: 'l3',
            tagHindi: 'भाग २',
            textHindi: 'उपसंहार (नया पैराग्राफ व हेडिंग): अतः हमें कूड़ा केवल कूड़ेदान में ही डालना चाहिए।',
          },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi: 'गंदगी अनेक रोगों को जन्म देती है; अतः हमें कूड़ा सदैव कूड़ेदान में डालकर अपने आसपास स्वच्छता रखनी चाहिए।',
            textEnglish: 'Merges smoothly into the single paragraph without "उपसंहार" heading.',
          },
          {
            textHindi: 'प्रस्तावना: स्वच्छता अच्छी आदत है। धन्यवाद, क.ख.ग.।',
            textEnglish: 'Adds another heading and sign-off.',
          },
          {
            textHindi: 'बॉक्स के अंदर दिनांक लिखकर जारी करें।',
            textEnglish: 'Notice format.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'अनुच्छेद में कभी “प्रस्तावना” या “उपसंहार” लिखकर नया पैराग्राफ नहीं बनाते; निष्कर्ष वाक्य उसी एकमात्र अनुच्छेद के भीतर जोड़ा जाता है।',
        explanationEnglish: 'Anuched must stay ONE paragraph with zero subheadings like "उपसंहार".',
        topicTagHindi: 'अनुच्छेद लेखन',
      },
      {
        id: 'an_err_2',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'शब्द-दोहराव व अशुद्ध वचन त्रुटि',
        titleEnglish: 'Spot repetition and grammatical error',
        instructionHindi: 'अशुद्ध वाक्य वाली पंक्ति चुनें।',
        instructionEnglish: 'Click the grammatically flawed line.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'जल ही जीवन है' },
          { id: 'l2', tagHindi: 'वाक्य १', textHindi: 'जल प्रकृति का अनमोल उपहार है जिसके बिना जीवन की कल्पना असंभव है।' },
          { id: 'l3', tagHindi: 'वाक्य २', textHindi: 'हमें पानी को बर्बाद नहीं करना चाहिए पानी बहुत कीमती पानी होता है और नल खुली नहीं छोड़नी चाहिए।' },
          { id: 'l4', tagHindi: 'वाक्य ३', textHindi: 'वर्षा-जल संचयन अपनाकर हम आने वाली पीढ़ियों के लिए जल सुरक्षित रख सकते हैं।' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi: 'यह अत्यंत मूल्यवान संसाधन है, इसलिए हमें नल खुला छोड़कर पानी की एक भी बूँद व्यर्थ नहीं करनी चाहिए।',
            textEnglish: 'Removes repetition and fixes gender ("नल खुला").',
          },
          {
            textHindi: 'पानी बहुत अच्छा पानी होता है और नल खुली रहेगा।',
            textEnglish: 'Keeps repetition and gender error.',
          },
          {
            textHindi: 'प्रिय जल, कृपया हमारे घर आओ।',
            textEnglish: 'Inappropriate tone.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          '“पानी” शब्द का अनावश्यक दोहराव और “नल खुली” (नल पुल्लिंग है — “नल खुला”) में लिंग अशुद्धि है।',
        explanationEnglish: 'Avoids word repetition and fixes masculine noun agreement ("नल खुला", not "खुली").',
        topicTagHindi: 'अनुच्छेद लेखन',
      },
      {
        id: 'an_err_3',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'अनुच्छेद में पत्र-शैली की घुसपैठ',
        titleEnglish: 'Spot the misplaced format line',
        instructionHindi: 'गलत प्रारूप वाली पंक्ति पहचानें।',
        instructionEnglish: 'Click the line that does not belong in a paragraph.',
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: 'व्यायाम के लाभ' },
          { id: 'l2', tagHindi: 'वाक्य १', textHindi: 'नियमित व्यायाम शरीर को रोगमुक्त और मन को प्रसन्न रखने का सर्वोत्तम उपाय है।' },
          { id: 'l3', tagHindi: 'वाक्य २', textHindi: 'योगासन, दौड़ और खेलकूद से मांसपेशियाँ सशक्त होती हैं तथा रोग-प्रतिरोधक क्षमता बढ़ती है।' },
          { id: 'l4', tagHindi: 'वाक्य ३', textHindi: 'अतः स्वस्थ जीवन के लिए प्रतिदिन तीस मिनट व्यायाम अवश्य करें। आपका आज्ञाकारी छात्र, क.ख.ग.।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'अतः स्वस्थ एवं ऊर्जावान जीवन के लिए हमें प्रतिदिन कम से कम तीस मिनट व्यायाम अवश्य करना चाहिए।',
            textEnglish: 'Clean concluding line without letter sign-off.',
          },
          {
            textHindi: 'शुभरात्रि, क.ख.ग.।',
            textEnglish: 'Diary closing.',
          },
          {
            textHindi: 'संपर्क करें: 98XXXXXXXX',
            textEnglish: 'Advertisement closing.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'अनुच्छेद के अंत में पत्र की तरह “आपका आज्ञाकारी छात्र, क.ख.ग.” नहीं लिखा जाता।',
        explanationEnglish: 'Never attach a letter sign-off at the end of an Anuched.',
        topicTagHindi: 'अनुच्छेद लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'an_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'परिश्रम का महत्व (संकेत-बिंदु सहित)',
        titleEnglish: 'Importance of Hard Work',
        promptHindi: 'संकेत: सफलता का आधार • प्रकृति के उदाहरण • आलस्य से हानि • निष्कर्ष। (एकल अनुच्छेद, 80–100 शब्द)',
        promptEnglish: 'Write one cohesive paragraph (80–100 words) on hard work.',
        englishStarter: 'Hard work is the true foundation of all success in life. Even in nature, an ant builds its home bit by bit...',
        hindiStarter: 'परिश्रम ही जीवन में प्रत्येक सफलता की सच्ची कुंजी है। प्रकृति में छोटी-सी चींटी भी...',
      },
      {
        id: 'an_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'बढ़ता शहरीकरण और वृक्षों की कमी',
        titleEnglish: 'Urbanization & Vanishing Trees',
        promptHindi: 'संकेत: कंक्रीट के जंगल • तापमान वृद्धि • हरित पट्टी की आवश्यकता। (एकल अनुच्छेद, 110 शब्द)',
        promptEnglish: 'Write a 110-word single cohesive paragraph on urbanization and tree loss.',
        englishStarter: 'Rapid urbanization has transformed green fields into concrete jungles, causing rising summer temperatures...',
        hindiStarter: 'तेजी से बढ़ते शहरीकरण ने हरित मैदानों को कंक्रीट के जंगलों में बदल दिया है...',
      },
    ],
  },

  patra_formal: {
    id: 'patra_formal',
    primaryTabId: 'patra',
    topicKey: 'patra',
    titleHindi: 'औपचारिक पत्र लेखन (Formal Letter)',
    titleEnglish: 'Formal Letter (Latest ICSE Left-Aligned Format)',
    shortTitleHindi: 'औपचारिक पत्र',
    badgeHindi: 'ICSE कक्षा 5–10 (नया बायाँ प्रारूप)',
    summaryHindi:
      'प्रधानाचार्य, संपादक, नगर निगम अधिकारी, बैंक या पुस्तक विक्रेता को लिखा जाने वाला पत्र औपचारिक पत्र कहलाता है। नवीनतम ICSE प्रारूप में समस्त अंग बाएँ हाथ (Left-aligned) होते हैं।',
    summaryEnglish:
      'Official letters to Principals, Editors, Civic Authorities, or Institutions following the strict ICSE left-aligned block format with a clear Subject line.',
    isBoxed: false,
    alignmentRuleHindi: 'संपूर्ण पत्र बाईं ओर (Left Margin से सटा हुआ) — ऊपर प्रेषक पता -> दिनांक -> प्रापक -> विषय -> संबोधन -> मुख्य भाग -> भवदीय/क.ख.ग.',
    alignmentRuleEnglish: '100% Left-Aligned Block Format: Sender Address -> Date -> Recipient -> Subject -> Salutation -> Body -> Sign-off',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम (प्रारंभिक)',
        statusLabelEnglish: 'Core (Introductory)',
        wordLimitHindi: '70–90 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'प्रधानाचार्य को अवकाश या आवश्यक कार्य हेतु सरल प्रार्थना-पत्र',
        noteEnglish: 'Leave / permission application to Principal',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '90–110 शब्द',
        marksHindi: '5–6 अंक',
        noteHindi: 'प्रधानाचार्य को शुल्क-मुक्ति, खेल-सामग्री या पुस्तकालय सुविधा हेतु पत्र',
        noteEnglish: 'School-related official applications to Principal',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '100–120 शब्द',
        marksHindi: '6–7 अंक',
        noteHindi: 'प्रधानाचार्य व पुस्तक विक्रेता / डाकपाल को औपचारिक पत्र',
        noteEnglish: 'Applications & business/civic formal letters',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '110–120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'संपादक, नगर निगम, बिजली/जल विभाग व प्रधानाचार्य को सटीक ICSE प्रारूप में पत्र',
        noteEnglish: 'Editor, Municipal Corporation & Principal letters',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 2',
        statusLabelEnglish: 'ICSE Board Q2 Core',
        wordLimitHindi: 'लगभग 120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'ICSE बोर्ड प्रश्न 2 (7 अंक): 2 अंक सटीक बाएँ प्रारूप + 5 अंक विषयवस्तु व शिष्ट भाषा',
        noteEnglish: 'ICSE Board Q2 (7 marks): 2 marks format + 5 marks content/language',
      },
      'कक्षा 10': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 2',
        statusLabelEnglish: 'ICSE Board Q2 Core',
        wordLimitHindi: 'लगभग 120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'ICSE बोर्ड परीक्षा प्रश्न 2 (7 अंक) — विषय स्पष्ट, अभिवादन रहित, प्रेषक पता शीर्ष पर बाएँ',
        noteEnglish: 'ICSE Board Exam Q2 (7 marks): Subject mandatory, NO greeting (अभिवादन)',
      },
    },
    markingScheme: [
      { partHindi: 'प्रेषक पता, दिनांक, प्रापक पता व विषय (प्रारूप भाग-१)', partEnglish: 'Sender, Date, Recipient & Subject', weightHindi: '1 अंक' },
      { partHindi: 'संबोधन व सटीक समापन / भवदीय (प्रारूप भाग-२)', partEnglish: 'Salutation & Subscription', weightHindi: '1 अंक' },
      { partHindi: 'विषयवस्तु की स्पष्टता, शिष्टता व भाषा शुद्धता', partEnglish: 'Body Clarity, Tone & Grammar', weightHindi: '5 अंक' },
    ],
    blueprintLines: [
      {
        id: 'pf_sender',
        labelHindi: '१. प्रेषक का पता (Sender’s Address — बाएँ हाथ सबसे ऊपर)',
        labelEnglish: 'Sender Address (Exam Hall Placeholder)',
        samplePlaceholder: 'परीक्षा भवन,\nअ.ब.स. नगर।',
        alignment: 'left',
        requiredNoteHindi: 'नवीनतम ICSE प्रारूप में पत्र लिखने वाले का पता सबसे ऊपर बाईं ओर आता है (अपना असली पता न लिखें)।',
        requiredNoteEnglish: 'Use "परीक्षा भवन, अ.ब.स. नगर" unless prompt gives a specific address.',
      },
      {
        id: 'pf_date',
        labelHindi: '२. दिनांक (Date — हिंदी महीने के नाम सहित)',
        labelEnglish: 'Date (One line below sender address)',
        samplePlaceholder: '18 नवंबर, 2026',
        alignment: 'left',
        requiredNoteHindi: '18/11/26 की जगह “18 नवंबर, 2026” लिखना ICSE में श्रेष्ठ माना जाता है।',
        requiredNoteEnglish: 'Write full Hindi month name instead of slash numeric shorthand.',
      },
      {
        id: 'pf_rec',
        labelHindi: '३. प्रापक का पद व पता (Recipient’s Title & Address)',
        labelEnglish: 'To whom the letter is addressed',
        samplePlaceholder: 'सेवा में,\nप्रधानाचार्य महोदय / संपादक महोदय,\nक.ख.ग. विद्यालय / दैनिक जागरण, नगर।',
        alignment: 'left',
        requiredNoteHindi: 'अल्पविराम (,) का सही प्रयोग करें।',
        requiredNoteEnglish: 'Formal title + organization + city.',
      },
      {
        id: 'pf_sub',
        labelHindi: '४. विषय (Subject — केवल औपचारिक पत्र में अनिवार्य!)',
        labelEnglish: 'Concise 1-Line Subject',
        samplePlaceholder: 'विषय: दो दिन के अवकाश हेतु प्रार्थना-पत्र / मोहल्ले में स्वच्छता व्यवस्था हेतु।',
        alignment: 'left',
        isBold: true,
        requiredNoteHindi: 'विषय अधिकतम 6–8 शब्दों में और स्पष्ट होना चाहिए।',
        requiredNoteEnglish: 'Mandatory in Formal Letters; strictly forbidden in Informal Letters.',
      },
      {
        id: 'pf_sal',
        labelHindi: '५. संबोधन (Salutation — अभिवादन नहीं लिखना है)',
        labelEnglish: 'Formal Salutation (NO Greeting)',
        samplePlaceholder: 'महोदय / महोदया,',
        alignment: 'left',
        requiredNoteHindi: 'औपचारिक पत्र में “सादर प्रणाम” या “नमस्ते” जैसा अभिवादन नहीं लिखा जाता।',
        requiredNoteEnglish: 'Go straight from "महोदय," to body paragraph.',
      },
      {
        id: 'pf_body',
        labelHindi: '६. मुख्य विषय-वस्तु (2–3 छोटे अनुच्छेद, ~120 शब्द)',
        labelEnglish: 'Body: Purpose -> Details -> Polite Action Request',
        samplePlaceholder: 'सविनय निवेदन यह है कि... (अनुच्छेद १: समस्या/कारण)\nअतः आपसे विनम्र अनुरोध है कि... (अनुच्छेद २: अपेक्षित कार्रवाई)',
        alignment: 'left',
        requiredNoteHindi: 'भाषा सदैव विनम्र, औपचारिक और सीधे मुद्दे पर केंद्रित हो।',
        requiredNoteEnglish: 'Avoid casual chatter or personal gossip.',
      },
      {
        id: 'pf_end',
        labelHindi: '७. अभिनिवेदन व हस्ताक्षर (Subscription & Name)',
        labelEnglish: 'Complimentary Close (Left-Aligned)',
        samplePlaceholder: 'सधन्यवाद।\nभवदीय / आपका आज्ञाकारी शिष्य (प्रधानाचार्य हेतु),\nक.ख.ग.',
        alignment: 'left',
        requiredNoteHindi: 'प्रधानाचार्य को “आपका आज्ञाकारी शिष्य/शिष्या” तथा अन्य अधिकारियों/संपादक को “भवदीय / प्रार्थी” लिखें।',
        requiredNoteEnglish: 'Use "आपका आज्ञाकारी शिष्य" only for Principal/Teachers; use "भवदीय" for Editors/Officers.',
      },
    ],
    dosHindi: [
      'सभी 7 अंगों को पूरी तरह बाएँ हाथ (Left Margin) से सटाकर क्रम से लिखें।',
      '“विषय:” लिखकर उसे स्पष्ट और संक्षिप्त (4–8 शब्द) रखें।',
      'प्रधानाचार्य को अंत में “आपका आज्ञाकारी शिष्य/शिष्या”, और अधिकारी/संपादक को “भवदीय / भवदीया” लिखें।',
      'परीक्षा में असली नाम/पता की जगह “परीक्षा भवन, अ.ब.स. नगर” और “क.ख.ग.” लिखें।',
    ],
    dontsHindi: [
      'औपचारिक पत्र में “सादर प्रणाम / सप्रेम नमस्ते” जैसा अभिवादन कभी न लिखें।',
      'संपादक या नगर निगम अधिकारी को “आपका आज्ञाकारी” न लिखें (यह केवल छात्र-प्रधानाचार्य पत्र के लिए है)।',
      'पत्र के दाएँ कोने में प्रेषक का पता या दिनांक न लिखें (पुराना प्रारूप अमान्य है)।',
      '“श्रीमान प्रधानाचार्य महोदय” में ‘श्रीमान’ और ‘महोदय’ एक साथ न लगाएँ (दोनों समानार्थी हैं—केवल “प्रधानाचार्य महोदय” लिखें)।',
    ],
    formatChecklistItems: [
      { id: 'sender_date', labelHindi: 'बाएँ हाथ शीर्ष पर प्रेषक पता व दिनांक', labelEnglish: 'Top-Left Sender Address & Date' },
      { id: 'recipient', labelHindi: 'प्रापक का पद व पता (सेवा में...)', labelEnglish: 'Recipient Designation & Address' },
      { id: 'subject', labelHindi: 'संक्षिप्त व स्पष्ट "विषय:"', labelEnglish: 'Clear Subject Line' },
      { id: 'salutation_close', labelHindi: 'सटीक संबोधन (महोदय) व समापन (भवदीय/आज्ञाकारी)', labelEnglish: 'Accurate Salutation & Subscription' },
    ],
    examples: [
      {
        id: 'pf_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'प्रधानाचार्य को दो दिन के अवकाश हेतु प्रार्थना-पत्र',
        titleEnglish: 'Application to Principal for Two Days’ Leave',
        promptHindi: 'बहन के विवाह में सम्मिलित होने के लिए अपने विद्यालय के प्रधानाचार्य को दो दिन के अवकाश हेतु पत्र लिखिए।',
        promptEnglish: 'Write a formal application to your Principal requesting 2 days’ leave for your sister’s wedding.',
        wordCountApprox: 108,
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'प्रापक', tagEnglish: 'Recipient', textHindi: 'सेवा में,\nप्रधानाचार्य महोदय,\nक.ख.ग. विद्यालय,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'विषय', tagEnglish: 'Subject', textHindi: 'विषय: दो दिन के अवकाश हेतु प्रार्थना-पत्र।', alignment: 'left', isHeading: true },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'महोदय,', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'सविनय निवेदन यह है कि मैं आपके विद्यालय की कक्षा सात का छात्र हूँ। आगामी 20 नवंबर को मेरी बड़ी बहन का शुभ विवाह संपन्न होने जा रहा है। इस पारिवारिक समारोह की तैयारियों में माता-पिता की सहायता करने और समारोह में सम्मिलित होने के कारण मैं विद्यालय में उपस्थित नहीं हो सकूँगा।\n\nअतः आपसे विनम्र अनुरोध है कि मुझे दिनांक 19 तथा 20 नवंबर, 2026 का दो दिन का अवकाश प्रदान करने की कृपा करें। इस अवधि का संपूर्ण कक्षा-कार्य मैं लौटते ही सहपाठियों की सहायता से पूरा कर लूँगा।',
            alignment: 'left',
          },
          { tagHindi: 'अभिनिवेदन', tagEnglish: 'Subscription', textHindi: 'सधन्यवाद।\nआपका आज्ञाकारी शिष्य,\nक.ख.ग.\nकक्षा — सात', alignment: 'left' },
        ],
        examinerNoteHindi: 'सभी 7 चरण पूर्णतः बाएँ हाथ की ओर हैं; "प्रधानाचार्य महोदय" और "आपका आज्ञाकारी शिष्य" का सटीक मेल।',
        examinerNoteEnglish: '100% left-aligned ICSE block format with exact Principal salutation & closing.',
      },
      {
        id: 'pf_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'समाचार-पत्र के संपादक को स्वच्छता व जलभराव की शिकायत हेतु पत्र',
        titleEnglish: 'Letter to the Editor on Waterlogging & Sanitation (ICSE Q2)',
        promptHindi: 'आपके क्षेत्र में नालियों की सफ़ाई न होने और जलभराव की समस्या की ओर प्रशासन का ध्यान आकृष्ट करने हेतु किसी दैनिक समाचार-पत्र के संपादक को लगभग 120 शब्दों में पत्र लिखिए।',
        promptEnglish: 'Write a ~120-word ICSE formal letter to a Newspaper Editor about poor drainage and waterlogging.',
        wordCountApprox: 124,
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'प्रापक', tagEnglish: 'Recipient', textHindi: 'सेवा में,\nसंपादक महोदय,\nनवभारत टाइम्स,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'विषय', tagEnglish: 'Subject', textHindi: 'विषय: क्षेत्र में नालियों की अस्वच्छता एवं जलभराव की समस्या के संबंध में।', alignment: 'left', isHeading: true },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'महोदय,', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'आपके लोकप्रिय एवं प्रतिष्ठित समाचार-पत्र के माध्यम से मैं नगर निगम के अधिकारियों का ध्यान अ.ब.स. नगर के विवेक विहार क्षेत्र में व्याप्त गंदगी और जलभराव की गंभीर समस्या की ओर आकर्षित करना चाहता हूँ। पिछले दो सप्ताह से नालियों की नियमित सफ़ाई नहीं हुई है, जिसके कारण थोड़ी सी वर्षा में ही सड़कों पर गंदा पानी भर जाता है। इससे मच्छरों का प्रकोप बढ़ रहा है और विद्यालय जाने वाले बच्चों तथा बुजुर्गों को भारी कठिनाई का सामना करना पड़ रहा है।\n\nकई बार स्थानीय कार्यालय में शिकायत करने पर भी कोई ठोस कार्रवाई नहीं हुई है। अतः आपसे अनुरोध है कि इस जन-समस्या को अपने समाचार-पत्र के जनवाणी स्तंभ में प्रमुखता से प्रकाशित करें ताकि संबंधित अधिकारी शीघ्र उचित कदम उठाएँ।',
            alignment: 'left',
          },
          { tagHindi: 'अभिनिवेदन', tagEnglish: 'Subscription', textHindi: 'सधन्यवाद।\nभवदीय,\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'संपादक को पत्र में "आपका आज्ञाकारी" नहीं बल्कि "भवदीय" का सटीक प्रयोग, तथा संपादक स्वयं सफ़ाई नहीं करते—वे समाचार प्रकाशित कर प्रशासन का ध्यान खींचते हैं, यह बोध स्पष्ट है।',
        examinerNoteEnglish: 'Note that the editor is requested to publish the issue (not clean drains personally!), and closed with "भवदीय".',
      },
    ],
    fillBlanks: [
      {
        id: 'pf_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'संपादक/अधिकारी हेतु समापन',
        beforeBlankHindi: 'किसी समाचार-पत्र के संपादक या नगर निगम अधिकारी को पत्र लिखते समय अंत में ',
        afterBlankHindi: ' लिखना सर्वाधिक उपयुक्त होता है।',
        options: [
          { textHindi: 'भवदीय / भवदीया', textEnglish: 'Yours faithfully (Bhavadiya)' },
          { textHindi: 'आपका आज्ञाकारी शिष्य', textEnglish: 'Your obedient student' },
          { textHindi: 'तुम्हारा प्रिय मित्र', textEnglish: 'Your dear friend' },
          { textHindi: 'सादर चरण-स्पर्श', textEnglish: 'Respectful regards' },
        ],
        correctIndex: 0,
        hintHindi: 'आप अधिकारी के विद्यार्थी नहीं हैं—अतः कौन-सा आधिकारिक शब्द लगेगा?',
        explanationHindi: 'प्रधानाचार्य/शिक्षक को “आपका आज्ञाकारी शिष्य” लिखते हैं, जबकि संपादक, अधिकारी या विक्रेता को “भवदीय / प्रार्थी” लिखते हैं।',
        explanationEnglish: 'Use "भवदीय / भवदीया" for Editors, Municipal Officers, and Businesses.',
      },
      {
        id: 'pf_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'नया ICSE बायाँ प्रारूप',
        beforeBlankHindi: 'नवीनतम ICSE हिंदी प्रारूप के अनुसार औपचारिक पत्र के सबसे ऊपर बाएँ हाथ पर ',
        afterBlankHindi: ' लिखा जाता है।',
        options: [
          { textHindi: 'प्रेषक का पता व दिनांक', textEnglish: 'Sender Address & Date' },
          { textHindi: 'सीधे विषय व धन्यवाद', textEnglish: 'Directly Subject & Thanks' },
          { textHindi: 'कहानी की सीख', textEnglish: 'Moral of story' },
          { textHindi: 'सादर प्रणाम माताजी', textEnglish: 'Greeting' },
        ],
        correctIndex: 0,
        hintHindi: 'नए ICSE प्रारूप में सबसे पहले किसका पता आता है?',
        explanationHindi: 'नए ICSE क्रम में: १. प्रेषक का पता -> २. दिनांक -> ३. प्रापक का पद/पता -> ४. विषय -> ५. संबोधन।',
        explanationEnglish: 'Latest ICSE sequence begins top-left with Sender Address, then Date, then Recipient.',
      },
      {
        id: 'pf_fb_3',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'संबोधन व शिष्टता नियम',
        beforeBlankHindi: 'औपचारिक पत्र में “सेवा में, ',
        afterBlankHindi: '” लिखना शुद्ध माना जाता है क्योंकि दो समान सम्मानसूचक शब्दों की आवृत्ति नहीं होती।',
        options: [
          { textHindi: 'प्रधानाचार्य महोदय', textEnglish: 'Respected Principal (Single Honorific)' },
          { textHindi: 'श्रीमान प्रधानाचार्य महोदय जी', textEnglish: 'Double/Triple Honorific' },
          { textHindi: 'प्रिय प्रधानाचार्य भाई', textEnglish: 'Casual Salutation' },
          { textHindi: 'पूज्य प्रधानाचार्य', textEnglish: 'Family Honorific' },
        ],
        correctIndex: 0,
        hintHindi: '‘श्रीमान’ और ‘महोदय’ एक साथ क्यों नहीं लगाते?',
        explanationHindi: '‘श्रीमान’ और ‘महोदय’ दोनों का अर्थ आदरसूचक है; एक साथ प्रयोग पुनरुक्ति दोष माना जाता है।',
        explanationEnglish: 'Avoid redundant double honorifics like "श्रीमान ... महोदय"; use "प्रधानाचार्य महोदय".',
      },
      {
        id: 'pf_fb_4',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'औपचारिक पत्र की विशेषता',
        beforeBlankHindi: 'औपचारिक पत्र में संबोधन के बाद अभिवादन (नमस्ते/प्रणाम) नहीं लिखा जाता, बल्कि सीधे ',
        afterBlankHindi: ' से मुख्य बात आरंभ की जाती है।',
        options: [
          { textHindi: '“सविनय निवेदन यह है कि...”', textEnglish: '“I respectfully submit that...”' },
          { textHindi: '“आशा है तुम मजे में होगे”', textEnglish: '“Hope you are having fun”' },
          { textHindi: '“शुभरात्रि प्रिय डायरी”', textEnglish: '“Goodnight Dear Diary”' },
          { textHindi: '“बड़े भाई को चरण-स्पर्श”', textEnglish: '“Regards to elder brother”' },
        ],
        correctIndex: 0,
        hintHindi: 'औपचारिक प्रार्थना या निवेदन किस मानक वाक्य से शुरू होता है?',
        explanationHindi: 'औपचारिक पत्र में कुशल-क्षेम या अभिवादन नहीं होता; सीधे सविनय विषय प्रस्तुत किया जाता है।',
        explanationEnglish: 'Formal letters omit personal greetings and begin directly with the formal purpose.',
      },
    ],
    errorIdentification: [
      {
        id: 'pf_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'औपचारिक पत्र में अभिवादन और विषय लोप की त्रुटि',
        titleEnglish: 'Identify the formatting error in this Formal Letter',
        instructionHindi: 'इस औपचारिक पत्र में किस पंक्ति में ICSE नियम का उल्लंघन हुआ है?',
        instructionEnglish: 'Click the line that violates Formal Letter rules.',
        lines: [
          { id: 'l1', tagHindi: 'प्रेषक व दिनांक', textHindi: 'परीक्षा भवन, अ.ब.स. नगर।  |  18 नवंबर, 2026' },
          { id: 'l2', tagHindi: 'प्रापक', textHindi: 'सेवा में, स्वास्थ्य अधिकारी महोदय, नगर निगम, अ.ब.स. नगर।' },
          { id: 'l3', tagHindi: 'संबोधन व अभिवादन', textHindi: 'प्रिय अधिकारी महोदय, सादर सप्रेम नमस्ते! आशा है आप सपरिवार कुशल होंगे।' },
          { id: 'l4', tagHindi: 'मुख्य भाग व अंत', textHindi: 'हमारे मोहल्ले में पेयजल की किल्लत है, कृपया टैंकर भेजें। भवदीय, क.ख.ग.।' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi: 'विषय: क्षेत्र में पेयजल संकट के समाधान हेतु।\nमहोदय,',
            textEnglish: 'Adds mandatory Subject + formal "महोदय," without casual greeting.',
          },
          {
            textHindi: 'पूज्य अधिकारी चाचाजी, सादर चरण-स्पर्श।',
            textEnglish: 'Informal family greeting.',
          },
          {
            textHindi: 'अधिकारी महोदय, प्रिय डायरी की तरह लिखें।',
            textEnglish: 'Invalid diary phrase.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'औपचारिक पत्र में “विषय:” अनिवार्य है और अधिकारी को “प्रिय / सप्रेम नमस्ते / कुशल-क्षेम” नहीं लिखा जाता—केवल “महोदय,” लिखते हैं।',
        explanationEnglish: 'Formal letters must include "विषय:" and must NEVER use "प्रिय", "सप्रेम नमस्ते", or personal well-being inquiries.',
        topicTagHindi: 'पत्र लेखन',
      },
      {
        id: 'pf_err_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'संपादक को पत्र में गलत समापन (अभिनिवेदन) की त्रुटि',
        titleEnglish: 'Spot the wrong subscription & tone in Editor Letter',
        instructionHindi: 'संपादक को लिखे पत्र में अनुचित पंक्ति पहचानें।',
        instructionEnglish: 'Click the line with the incorrect sign-off/request.',
        lines: [
          { id: 'l1', tagHindi: 'प्रेषक व दिनांक', textHindi: 'परीक्षा भवन, अ.ब.स. नगर।  |  20 नवंबर, 2026' },
          { id: 'l2', tagHindi: 'प्रापक', textHindi: 'सेवा में, संपादक महोदय, हिंदुस्तान दैनिक, नगर।' },
          { id: 'l3', tagHindi: 'विषय व संबोधन', textHindi: 'विषय: सड़कों पर आवारा पशुओं की समस्या हेतु।  |  महोदय,' },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'कृपया आप स्वयं आकर सड़क के पशु हटवा दें। आपका आज्ञाकारी शिष्य, क.ख.ग.।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'कृपया इस समस्या को अपने समाचार-पत्र में प्रकाशित कर नगर निगम का ध्यान आकर्षित करें।\nभवदीय, क.ख.ग.',
            textEnglish: 'Correctly asks Editor to publish, and closes with "भवदीय".',
          },
          {
            textHindi: 'तुम्हारा प्रिय मित्र, क.ख.ग.।',
            textEnglish: 'Informal friend sign-off.',
          },
          {
            textHindi: 'संपादक जी, तुरंत झाड़ू लेकर आएँ। भवदीया, क.ख.ग.।',
            textEnglish: 'Impolite/illogical request to editor.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'दो बड़ी भूलें: (1) संपादक का कार्य समस्या को प्रकाशित करना है, स्वयं सड़क साफ़ करना नहीं; (2) संपादक को “आपका आज्ञाकारी शिष्य” नहीं, “भवदीय/भवदीया” लिखते हैं।',
        explanationEnglish: 'Request publication (not manual civic work) and close with "भवदीय", never "आज्ञाकारी शिष्य".',
        topicTagHindi: 'पत्र लेखन',
      },
      {
        id: 'pf_err_3',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'प्रधानाचार्य को पत्र में पुनरुक्ति व अधूरे दिनांक की त्रुटि',
        titleEnglish: 'Spot double honorific & missing subject/date error',
        instructionHindi: 'नीचे किस पंक्ति में प्रापक व विषय संबंधी अशुद्धि है?',
        instructionEnglish: 'Identify the flawed header line.',
        lines: [
          { id: 'l1', tagHindi: 'प्रेषक पता', textHindi: 'परीक्षा भवन, अ.ब.स. नगर।' },
          { id: 'l2', tagHindi: 'प्रापक', textHindi: 'सेवा में, श्रीमान प्रधानाचार्य महोदय जी, विद्यालय, नगर। (दिनांक व विषय गायब!)' },
          { id: 'l3', tagHindi: 'संबोधन व मुख्य भाग', textHindi: 'महोदय, तेज बुखार होने के कारण मैं दो दिन विद्यालय आने में असमर्थ हूँ।' },
          { id: 'l4', tagHindi: 'अंत', textHindi: 'कृपया दो दिन का अवकाश प्रदान करें। आपका आज्ञाकारी शिष्य, क.ख.ग.।' },
        ],
        errorLineIndex: 1,
        correctionOptions: [
          {
            textHindi: '18 नवंबर, 2026\nसेवा में, प्रधानाचार्य महोदय, क.ख.ग. विद्यालय।\nविषय: अस्वस्थता के कारण अवकाश हेतु प्रार्थना-पत्र।',
            textEnglish: 'Adds Hindi Date, removes redundant श्रीमान/जी, and adds clear Subject.',
          },
          {
            textHindi: 'मित्र प्रधानाचार्य, आज छुट्टी है।',
            textEnglish: 'Inappropriate tone.',
          },
          {
            textHindi: 'दिनांक नहीं लिखना चाहिए।',
            textEnglish: 'Wrong rule.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'ICSE औपचारिक पत्र में प्रेषक पते के बाद दिनांक, एक सम्मानसूचक शब्द (“प्रधानाचार्य महोदय”, न कि श्रीमान+महोदय+जी) और स्पष्ट “विषय:” लिखना अनिवार्य है।',
        explanationEnglish: 'Include the Date after sender address, avoid triple honorifics, and always add Subject.',
        topicTagHindi: 'पत्र लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'pf_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'पुस्तकालय में हिंदी कहानी की नई पुस्तकें मँगवाने हेतु प्रधानाचार्य को पत्र',
        titleEnglish: 'Request Principal for New Library Books',
        promptHindi: 'प्रधानाचार्य को विद्यालय पुस्तकालय में बाल-साहित्य व हिंदी व्याकरण की नई पुस्तकें मँगवाने हेतु औपचारिक पत्र लिखें।',
        promptEnglish: 'Write a formal application to your Principal requesting new Hindi books for the school library.',
        englishStarter: 'Examination Hall, ABC City. November 18, 2026. To the Principal, XYZ School. Subject: Request for new Hindi books in library. Sir, I respectfully submit...',
        hindiStarter: 'परीक्षा भवन,\nअ.ब.स. नगर।\n\n18 नवंबर, 2026\n\nसेवा में,\nप्रधानाचार्य महोदय...',
      },
      {
        id: 'pf_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'पार्क के सौंदर्यीकरण व रखरखाव हेतु नगर निगम आयुक्त को पत्र',
        titleEnglish: 'Letter to Municipal Commissioner on Park Maintenance',
        promptHindi: 'आपके मोहल्ले के एकमात्र सार्वजनिक पार्क की दुर्दशा सुधारने हेतु नगर निगम अधिकारी को ~120 शब्दों का औपचारिक पत्र लिखें।',
        promptEnglish: 'Write a 120-word ICSE formal letter to Municipal authorities regarding poor park maintenance.',
        englishStarter: 'Examination Hall, ABC City. November 18, 2026. To the Municipal Commissioner, ABC City. Subject: Regarding urgent maintenance of local park...',
        hindiStarter: 'परीक्षा भवन,\nअ.ब.स. नगर।\n\n18 नवंबर, 2026\n\nसेवा में,\nनगर निगम आयुक्त महोदय...',
      },
    ],
  },

  patra_informal: {
    id: 'patra_informal',
    primaryTabId: 'patra',
    topicKey: 'patra',
    titleHindi: 'अनौपचारिक पत्र लेखन (Informal Letter)',
    titleEnglish: 'Informal / Personal Letter (Latest ICSE Left-Aligned Format)',
    shortTitleHindi: 'अनौपचारिक पत्र',
    badgeHindi: 'ICSE कक्षा 5–10 (नया बायाँ प्रारूप)',
    summaryHindi:
      'माता-पिता, भाई-बहन, दादा-दादी, मित्रों या सगे-संबंधियों को लिखे जाने वाले व्यक्तिगत पत्र अनौपचारिक पत्र कहलाते हैं। इनमें ‘विषय’ नहीं लिखा जाता, बल्कि आत्मीय संबोधन व अभिवादन होता है।',
    summaryEnglish:
      'Personal letters to family and friends in ICSE left-aligned format: NO Subject line, warm Salutation + Greeting (अभिवादन) required.',
    isBoxed: false,
    alignmentRuleHindi: 'संपूर्ण पत्र बाएँ हाथ — प्रेषक पता -> दिनांक -> संबोधन -> अभिवादन -> कुशल-क्षेम व मुख्य भाग -> अभिनिवेदन व नाम',
    alignmentRuleEnglish: '100% Left-Aligned Block Format: Sender Address -> Date -> Salutation -> Greeting -> Body -> Warm Sign-off',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '70–90 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'मित्र को जन्मदिन निमंत्रण या पिताजी को कुशलता पत्र',
        noteEnglish: 'Birthday invitation to friend or letter to parents',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '90–110 शब्द',
        marksHindi: '5–6 अंक',
        noteHindi: 'मित्र को पर्व/भ्रमण अनुभव या छोटे भाई को सलाह पत्र',
        noteEnglish: 'Festival/trip letter to friend or advice to sibling',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '100–120 शब्द',
        marksHindi: '6–7 अंक',
        noteHindi: 'माता-पिता से पुस्तकें/यात्रा की अनुमति या मित्र को बधाई पत्र',
        noteEnglish: 'Congratulatory or permission letters to family',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '110–120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'छोटे भाई को मोबाइल/समय के सदुपयोग की सीख या दादाजी को पत्र',
        noteEnglish: 'Advisory and warm personal correspondence',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 2 विकल्प',
        statusLabelEnglish: 'ICSE Board Q2 Option',
        wordLimitHindi: 'लगभग 120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'ICSE प्रश्न 2 (7 अंक): प्रेषक पता, दिनांक, सटीक संबोधन-अभिवादन व आत्मीय समापन',
        noteEnglish: 'ICSE Board Q2 (7 marks): Warm personal tone & accurate ICSE format',
      },
      'कक्षा 10': {
        status: 'core',
        statusLabelHindi: 'ICSE बोर्ड प्रश्न 2 विकल्प',
        statusLabelEnglish: 'ICSE Board Q2 Option',
        wordLimitHindi: 'लगभग 120 शब्द',
        marksHindi: '7 अंक',
        noteHindi: 'ICSE बोर्ड परीक्षा प्रश्न 2 (7 अंक) — "विषय" बिल्कुल न लिखें; आयु-सम्मान के अनुसार अभिवादन चुनें',
        noteEnglish: 'ICSE Board Exam Q2 (7 marks): Never add Subject; match greeting to age/relation',
      },
    },
    markingScheme: [
      { partHindi: 'प्रेषक पता, दिनांक, संबोधन व अभिवादन (प्रारूप भाग-१)', partEnglish: 'Address, Date, Salutation & Greeting', weightHindi: '1 अंक' },
      { partHindi: 'अंत में उचित अभिनिवेदन व नाम (प्रारूप भाग-२)', partEnglish: 'Subscription & Sign-off', weightHindi: '0.5–1 अंक' },
      { partHindi: 'आत्मीयता, विषय-विस्तार व शुद्ध भाषा', partEnglish: 'Warmth, Content & Grammar', weightHindi: '5–5.5 अंक' },
    ],
    blueprintLines: [
      {
        id: 'pi_sender',
        labelHindi: '१. प्रेषक का पता (Sender’s Address — बाएँ हाथ सबसे ऊपर)',
        labelEnglish: 'Sender Address (Exam Placeholder)',
        samplePlaceholder: 'परीक्षा भवन / छात्रावास,\nअ.ब.स. नगर।',
        alignment: 'left',
        requiredNoteHindi: 'अनौपचारिक पत्र में केवल प्रेषक का पता ऊपर बाईं ओर आता है (प्रापक का पता नहीं लिखते)।',
        requiredNoteEnglish: 'Only Sender Address is written; NEVER write Recipient Address.',
      },
      {
        id: 'pi_date',
        labelHindi: '२. दिनांक (Date)',
        labelEnglish: 'Date in Hindi Month Format',
        samplePlaceholder: '18 नवंबर, 2026',
        alignment: 'left',
        requiredNoteHindi: 'प्रेषक पते के ठीक नीचे एक पंक्ति छोड़कर लिखें।',
        requiredNoteEnglish: 'Write full month name cleanly.',
      },
      {
        id: 'pi_sal',
        labelHindi: '३. संबोधन (Relation-Based Salutation — "विषय" नहीं लिखते!)',
        labelEnglish: 'Warm Salutation (NO Subject Line)',
        samplePlaceholder: 'बड़ों के लिए: पूज्य पिताजी / आदरणीय माताजी,\nमित्र के लिए: प्रिय मित्र रोहन,\nछोटों के लिए: स्नेही अनुज,',
        alignment: 'left',
        isBold: true,
        requiredNoteHindi: 'बड़ों को “आदरणीय/पूज्य”, मित्र को “प्रिय”, छोटों को “प्रिय/स्नेही” से संबोधित करें।',
        requiredNoteEnglish: 'Match salutation strictly to the recipient’s age/relationship.',
      },
      {
        id: 'pi_greet',
        labelHindi: '४. अभिवादन (Greeting — अनिवार्य अंग!)',
        labelEnglish: 'Warm Greeting (Required in Informal)',
        samplePlaceholder: 'बड़ों को: सादर चरण-स्पर्श / सादर प्रणाम।\nमित्र को: सप्रेम नमस्ते।\nछोटों को: मधुर स्नेह / शुभाशीष।',
        alignment: 'left',
        requiredNoteHindi: 'ध्यान रहे: छोटे भाई या मित्र को “सादर चरण-स्पर्श” न लिखें!',
        requiredNoteEnglish: 'Elders = सादर प्रणाम; Peers = सप्रेम नमस्ते; Younger = स्नेह/शुभाशीष.',
      },
      {
        id: 'pi_body',
        labelHindi: '५. मुख्य विषय-वस्तु (कुशल-क्षेम -> संदेश -> पारिवारिक प्रणाम)',
        labelEnglish: 'Body: Well-being -> Main Message -> Closing Regards',
        samplePlaceholder: 'मैं यहाँ कुशलपूर्वक हूँ और आशा करता हूँ कि आप भी सकुशल होंगे... (मुख्य संदेश)\nघर में माताजी-पिताजी को मेरा प्रणाम कहिएगा।',
        alignment: 'left',
        requiredNoteHindi: 'भाषा सहज, भावनात्मक और आत्मीय होनी चाहिए।',
        requiredNoteEnglish: 'Keep tone warm, natural, and personal (~120 words).',
      },
      {
        id: 'pi_end',
        labelHindi: '६. अभिनिवेदन व हस्ताक्षर (Subscription & First Name)',
        labelEnglish: 'Personal Sign-off',
        samplePlaceholder: 'आपका आज्ञाकारी पुत्र / तुम्हारा प्रिय मित्र / तुम्हारा अग्रज,\nक.ख.ग.',
        alignment: 'left',
        requiredNoteHindi: 'परीक्षा में पूरा नाम/उपनाम नहीं, केवल पहला नाम या “क.ख.ग.” लिखें।',
        requiredNoteEnglish: 'Never write "भवदीय" in an informal letter!',
      },
    ],
    dosHindi: [
      'संबोधन व अभिवादन रिश्ते की आयु के अनुसार चुनें (बड़े = पूज्य + सादर प्रणाम; मित्र = प्रिय + सप्रेम नमस्ते)।',
      'पत्र की शुरुआत कुशल-क्षेम पूछने से करें और अंत में घर के अन्य सदस्यों को यथायोग्य प्रणाम/स्नेह लिखें।',
      'पूरा पत्र बाएँ हाशिये (Left Margin) से मिलाकर लिखें।',
      'अंत में संबद्ध रिश्ता लिखें (जैसे: तुम्हारा प्रिय मित्र / आपका स्नेही पुत्र / तुम्हारी बड़ी बहन)।',
    ],
    dontsHindi: [
      'अनौपचारिक पत्र में कभी “सेवा में” या प्रापक का पता न लिखें।',
      'अनौपचारिक पत्र में “विषय:” (Subject) बिल्कुल न लिखें—इस पर सीधे अंक कटते हैं।',
      'मित्र या पिताजी को अंत में “भवदीय” या “आपका आज्ञाकारी शिष्य” न लिखें।',
      'छोटे भाई-बहन को “सादर चरण-स्पर्श” या पिताजी को “मधुर स्नेह” न लिखें।',
    ],
    formatChecklistItems: [
      { id: 'sender_no_rec', labelHindi: 'केवल प्रेषक पता व दिनांक (प्रापक पता नहीं)', labelEnglish: 'Sender Address & Date Only' },
      { id: 'no_subject', labelHindi: '"विषय:" का अभाव (अनौपचारिक नियम)', labelEnglish: 'No Subject Line' },
      { id: 'sal_greet', labelHindi: 'रिश्ते के अनुसार सटीक संबोधन व अभिवादन', labelEnglish: 'Age-Appropriate Salutation & Greeting' },
      { id: 'warm_close', labelHindi: 'कुशल-क्षेम व आत्मीय समापन (क.ख.ग.)', labelEnglish: 'Personal Body & Warm Sign-off' },
    ],
    examples: [
      {
        id: 'pi_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'मित्र को वाद-विवाद प्रतियोगिता में प्रथम आने पर बधाई पत्र',
        titleEnglish: 'Congratulating a Friend on Winning First Prize',
        promptHindi: 'आपके मित्र ने अंतर्विद्यालयी हिंदी वाद-विवाद प्रतियोगिता में प्रथम पुरस्कार जीता है। उसे बधाई देते हुए पत्र लिखिए।',
        promptEnglish: 'Write an informal letter congratulating your friend on winning first prize in a debate competition.',
        wordCountApprox: 110,
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'प्रिय मित्र रोहन,', alignment: 'left', isHeading: true },
          { tagHindi: 'अभिवादन', tagEnglish: 'Greeting', textHindi: 'सप्रेम नमस्ते।', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'मैं यहाँ सपरिवार सकुशल हूँ और ईश्वर से तुम्हारी कुशलता की कामना करता हूँ। आज प्रातः समाचार-पत्र और विद्यालय की सूचना से यह जानकर मेरा मन खुशी से झूम उठा कि तुमने अंतर्विद्यालयी हिंदी वाद-विवाद प्रतियोगिता में प्रथम स्थान प्राप्त किया है। तुम्हारी इस शानदार सफलता के लिए मेरी ओर से हार्दिक बधाई!\n\nरोहन, यह तुम्हारी नियमित मेहनत, आत्मविश्वास और प्रभावी वाचन शैली का ही सुफल है। मुझे पूरा विश्वास है कि तुम आगे चलकर राज्य स्तर पर भी इसी प्रकार विद्यालय का नाम रोशन करोगे। अंकल और आंटी को मेरा सादर प्रणाम कहना तथा छोटी बहन को मधुर स्नेह देना।',
            alignment: 'left',
          },
          { tagHindi: 'अभिनिवेदन', tagEnglish: 'Sign-off', textHindi: 'तुम्हारा प्रिय मित्र,\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'कोई "विषय:" नहीं, सटीक मित्र-संबोधन ("प्रिय मित्र"), उचित अभिवादन ("सप्रेम नमस्ते") व आत्मीय समापन।',
        examinerNoteEnglish: 'Omits Subject line cleanly and uses peer-appropriate "प्रिय मित्र" + "सप्रेम नमस्ते".',
      },
      {
        id: 'pi_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'छोटे भाई को समय के सदुपयोग व संतुलित दिनचर्या की सलाह',
        titleEnglish: 'Advising Younger Brother on Time Management (ICSE Q2)',
        promptHindi: 'छात्रावास में रह रहे छोटे भाई को मोबाइल में समय नष्ट न कर पढ़ाई व खेल में संतुलन रखने की सलाह देते हुए लगभग 120 शब्दों में पत्र लिखिए।',
        promptEnglish: 'Write a ~120-word ICSE informal letter advising your younger brother in hostel against wasting time.',
        wordCountApprox: 122,
        blocks: [
          { tagHindi: 'प्रेषक पता', tagEnglish: 'Sender Address', textHindi: 'परीक्षा भवन,\nअ.ब.स. नगर।', alignment: 'left' },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: '18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'स्नेही अनुज अमन,', alignment: 'left', isHeading: true },
          { tagHindi: 'अभिवादन', tagEnglish: 'Greeting', textHindi: 'मधुर स्नेह एवं शुभाशीष।', alignment: 'left' },
          {
            tagHindi: 'मुख्य विषय-वस्तु',
            tagEnglish: 'Body',
            textHindi:
              'आशा है तुम छात्रावास में स्वस्थ और प्रसन्न होगे। कल माताजी से ज्ञात हुआ कि इन दिनों तुम पढ़ाई की अपेक्षा मोबाइल और वीडियो गेम में अधिक समय बिता रहे हो, जिससे तुम्हारी मासिक परीक्षा के अंक कम आए हैं। यह सुनकर मुझे थोड़ी चिंता हुई।\n\nप्रिय अमन, विद्यार्थी जीवन ही भविष्य की नींव है। बीता हुआ समय कभी लौटकर नहीं आता। मैं यह नहीं कहता कि तुम मनोरंजन न करो, किंतु मोबाइल के स्थान पर शाम को मैदान में खेलना तुम्हारे स्वास्थ्य व एकाग्रता दोनों के लिए लाभकारी होगा। प्रतिदिन की एक संतुलित समय-सारिणी बनाओ और मन लगाकर पढ़ो। माताजी व पिताजी की ओर से तुम्हें ढेर सारा आशीर्वाद। पत्र का उत्तर शीघ्र देना।',
            alignment: 'left',
          },
          { tagHindi: 'अभिनिवेदन', tagEnglish: 'Sign-off', textHindi: 'तुम्हारा शुभचिंतक अग्रज,\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'छोटे भाई के लिए "स्नेही अनुज" और "मधुर स्नेह/शुभाशीष" का सटीक चयन व बड़े भाई की आत्मीय सलाह शैली।',
        examinerNoteEnglish: 'Perfectly models elder-to-younger greeting ("शुभाशीष") and supportive tone.',
      },
    ],
    fillBlanks: [
      {
        id: 'pi_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'पिताजी को अभिवादन',
        beforeBlankHindi: 'पूज्य पिताजी या आदरणीय माताजी को पत्र लिखते समय संबोधन के ठीक नीचे ',
        afterBlankHindi: ' लिखना सर्वाधिक उपयुक्त होता है।',
        options: [
          { textHindi: 'सादर चरण-स्पर्श / सादर प्रणाम', textEnglish: 'Respectful regards / Pranam' },
          { textHindi: 'सप्रेम नमस्ते', textEnglish: 'Loving hello (for friends)' },
          { textHindi: 'मधुर शुभाशीष', textEnglish: 'Blessings (for younger ones)' },
          { textHindi: 'महोदय', textEnglish: 'Sir (Formal)' },
        ],
        correctIndex: 0,
        hintHindi: 'माता-पिता हमसे बड़े व आदरणीय हैं—उन्हें आशीर्वाद नहीं, प्रणाम दिया जाता है।',
        explanationHindi: 'माता-पिता व गुरुजनों को “सादर चरण-स्पर्श” या “सादर प्रणाम” लिखते हैं; मित्रों को “सप्रेम नमस्ते” और छोटों को “शुभाशीष”।',
        explanationEnglish: 'Elders receive "सादर प्रणाम/चरण-स्पर्श"; peers receive "सप्रेम नमस्ते".',
      },
      {
        id: 'pi_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'अनौपचारिक पत्र का निषेध नियम',
        beforeBlankHindi: 'औपचारिक पत्र के विपरीत, अनौपचारिक पत्र में ',
        afterBlankHindi: ' कभी नहीं लिखा जाता।',
        options: [
          { textHindi: '“विषय:” (Subject) और “सेवा में”', textEnglish: 'Subject line & "सेवा में"' },
          { textHindi: 'दिनांक (Date)', textEnglish: 'Date' },
          { textHindi: 'प्रेषक का पता', textEnglish: 'Sender Address' },
          { textHindi: 'अभिवादन', textEnglish: 'Greeting' },
        ],
        correctIndex: 0,
        hintHindi: 'परिवार या मित्र के पत्र में ऑफ़िस की तरह क्या नहीं होता?',
        explanationHindi: 'अनौपचारिक पत्रों में “सेवा में” और “विषय:” का प्रयोग पूरी तरह वर्जित है।',
        explanationEnglish: 'Never write "सेवा में" or "विषय:" in an informal/personal letter.',
      },
      {
        id: 'pi_fb_3',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'छोटे भाई-बहन हेतु समापन',
        beforeBlankHindi: 'छोटी बहन को पत्र समाप्त करते समय बड़ा भाई या बड़ी बहन अंत में ',
        afterBlankHindi: ' लिख सकते हैं।',
        options: [
          { textHindi: 'तुम्हारा शुभचिंतक अग्रज / तुम्हारी बड़ी दीदी', textEnglish: 'Your caring elder brother/sister' },
          { textHindi: 'भवदीय', textEnglish: 'Yours faithfully (Formal)' },
          { textHindi: 'आपका आज्ञाकारी छोटा भाई', textEnglish: 'Obedient younger brother (wrong role)' },
          { textHindi: 'सचिव, सांस्कृतिक समिति', textEnglish: 'Notice designation' },
        ],
        correctIndex: 0,
        hintHindi: 'लिखने वाले के स्वयं के रिश्ते (अग्रज = बड़ा भाई) का ध्यान रखें।',
        explanationHindi: 'पत्र के अंत में लिखने वाला व्यक्ति अपना रिश्ता लिखता है—बड़ा भाई = तुम्हारा अग्रज / तुम्हारा बड़ा भाई।',
        explanationEnglish: 'Subscription identifies the writer’s relation to the recipient.',
      },
      {
        id: 'pi_fb_4',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'पत्र में परीक्षा नाम नियम',
        beforeBlankHindi: 'ICSE बोर्ड परीक्षा में पत्र के अंत में अपने वास्तविक नाम और पते के स्थान पर ',
        afterBlankHindi: ' लिखना अनिवार्य निर्देश होता है।',
        options: [
          { textHindi: 'परीक्षा भवन / अ.ब.स. नगर व क.ख.ग.', textEnglish: 'Exam Hall / ABC City & XYZ' },
          { textHindi: 'अपना रोल नंबर और फ़ोन नंबर', textEnglish: 'Roll number & phone' },
          { textHindi: 'पूरा नाम और घर का नंबर', textEnglish: 'Full name & house number' },
          { textHindi: 'हस्ताक्षर खाली छोड़ना', textEnglish: 'Leave blank' },
        ],
        correctIndex: 0,
        hintHindi: 'बोर्ड परीक्षा में गोपनीयता नियम क्या कहता है?',
        explanationHindi: 'गोपनीयता बनाए रखने के लिए बोर्ड परीक्षा में असली नाम, विद्यालय या पता नहीं लिखते; क.ख.ग. और परीक्षा भवन लिखते हैं।',
        explanationEnglish: 'Exam rules forbid real names/addresses; use "परीक्षा भवन" and "क.ख.ग.".',
      },
    ],
    errorIdentification: [
      {
        id: 'pi_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'मित्र को पत्र में औपचारिक प्रारूप की मिलावट',
        titleEnglish: 'Identify the misplaced formal rules in this informal letter',
        instructionHindi: 'मित्र को लिखे इस पत्र में किस पंक्ति में बड़ी प्रारूप-त्रुटि है?',
        instructionEnglish: 'Click the line that incorrectly uses formal letter elements in a personal letter.',
        lines: [
          { id: 'l1', tagHindi: 'प्रेषक व दिनांक', textHindi: 'परीक्षा भवन, अ.ब.स. नगर।  |  18 नवंबर, 2026' },
          {
            id: 'l2',
            tagHindi: 'गलत अंश',
            textHindi: 'सेवा में, प्रिय मित्र अमित, दिल्ली।  |  विषय: जन्मदिन पर आमंत्रण हेतु पत्र।',
          },
          {
            id: 'l3',
            tagHindi: 'मुख्य भाग',
            textHindi: 'मैं यहाँ सकुशल हूँ। अगले रविवार मेरा जन्मदिन है, कृपया अवश्य आना।',
          },
          { id: 'l4', tagHindi: 'अंत', textHindi: 'तुम्हारा प्रिय मित्र, क.ख.ग.।' },
        ],
        errorLineIndex: 1,
        correctionOptions: [
          {
            textHindi: 'प्रिय मित्र अमित,\nसप्रेम नमस्ते।',
            textEnglish: 'Removes "सेवा में", recipient address, and "विषय:", adding warm greeting.',
          },
          {
            textHindi: 'महोदय अमित, सादर चरण-स्पर्श।',
            textEnglish: 'Wrong honorific & elder greeting for friend.',
          },
          {
            textHindi: 'विषय: जन्मदिन सूचना, बॉक्स में लिखें।',
            textEnglish: 'Notice style.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'अनौपचारिक पत्र में “सेवा में”, प्रापक का पता और “विषय:” कभी नहीं लिखे जाते। सीधे “प्रिय मित्र अमित,” और “सप्रेम नमस्ते।” लिखा जाता है।',
        explanationEnglish: 'Remove "सेवा में", recipient address, and "विषय:" from personal letters.',
        topicTagHindi: 'पत्र लेखन',
      },
      {
        id: 'pi_err_2',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'रिश्ते और अभिवादन का बेमेल प्रयोग',
        titleEnglish: 'Spot the mismatched age/greeting & sign-off',
        instructionHindi: 'पिताजी को लिखे इस पत्र में अनुचित समापन वाली पंक्ति पहचानें।',
        instructionEnglish: 'Click the line with the incorrect relationship closing.',
        lines: [
          { id: 'l1', tagHindi: 'प्रेषक व दिनांक', textHindi: 'छात्रावास, अ.ब.स. नगर।  |  19 नवंबर, 2026' },
          { id: 'l2', tagHindi: 'संबोधन व अभिवादन', textHindi: 'पूज्य पिताजी, सादर चरण-स्पर्श।' },
          { id: 'l3', tagHindi: 'मुख्य भाग', textHindi: 'मेरी अर्धवार्षिक परीक्षा समाप्त हो गई है और शैक्षिक भ्रमण हेतु अनुमति चाहता हूँ।' },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'आपका शुभचिंतक मित्र एवं भवदीय शिष्य, क.ख.ग.।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'आपका आज्ञाकारी पुत्र / स्नेही पुत्र,\nक.ख.ग.',
            textEnglish: 'Accurate filial subscription to father.',
          },
          {
            textHindi: 'तुम्हारा बड़ा पिताजी, क.ख.ग.।',
            textEnglish: 'Nonsensical relation.',
          },
          {
            textHindi: 'भवदीय सचिव, क.ख.ग.।',
            textEnglish: 'Official designation.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'पिताजी को पत्र लिखते समय न तो “मित्र” लिखा जाता है और न ही “भवदीय शिष्य”; सही समापन “आपका आज्ञाकारी पुत्र / आपकी स्नेही पुत्री” होगा।',
        explanationEnglish: 'Letters to parents close with "आपका आज्ञाकारी पुत्र / आपकी पुत्री", never "भवदीय" or "मित्र".',
        topicTagHindi: 'पत्र लेखन',
      },
      {
        id: 'pi_err_3',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'छोटे भाई को अनुपयुक्त अभिवादन',
        titleEnglish: 'Spot the wrong greeting for a younger sibling',
        instructionHindi: 'छोटे भाई को लिखे पत्र की गलत पंक्ति चुनें।',
        instructionEnglish: 'Identify the line that misuses an elder-only greeting.',
        lines: [
          { id: 'l1', tagHindi: 'प्रेषक व दिनांक', textHindi: 'परीक्षा भवन, अ.ब.स. नगर।  |  22 नवंबर, 2026' },
          { id: 'l2', tagHindi: 'संबोधन व अभिवादन', textHindi: 'पूज्य व आदरणीय छोटे भाई रोहन, सादर चरण-स्पर्श।' },
          { id: 'l3', tagHindi: 'मुख्य भाग', textHindi: 'आशा है तुम अपनी पढ़ाई व स्वास्थ्य का पूरा ध्यान रख रहे होगे।' },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'तुम्हारा बड़ा भाई, क.ख.ग.।' },
        ],
        errorLineIndex: 1,
        correctionOptions: [
          {
            textHindi: 'प्रिय / स्नेही अनुज रोहन,\nमधुर स्नेह / शुभाशीष।',
            textEnglish: 'Correct warm elder-to-younger salutation and blessings.',
          },
          {
            textHindi: 'माननीय भाई महोदय, सविनय निवेदन।',
            textEnglish: 'Formal official phrase.',
          },
          {
            textHindi: 'प्रिय डायरी, आज रोहन ने पत्र लिखा।',
            textEnglish: 'Diary line.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'छोटे भाई के लिए “पूज्य / आदरणीय” और “सादर चरण-स्पर्श” का प्रयोग नहीं होता; सही शब्द “प्रिय / स्नेही अनुज” और “मधुर स्नेह / शुभाशीष” हैं।',
        explanationEnglish: 'Use "स्नेही/प्रिय अनुज" and "स्नेह/शुभाशीष" for younger siblings, never "सादर चरण-स्पर्श".',
        topicTagHindi: 'पत्र लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'pi_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'मित्र को ग्रीष्मावकाश साथ बिताने का निमंत्रण',
        titleEnglish: 'Inviting a Friend for Summer Vacation',
        promptHindi: 'अपने मित्र को गर्मी की छुट्टियों में अपने गाँव/शहर घूमने आने का निमंत्रण देते हुए अनौपचारिक पत्र लिखें।',
        promptEnglish: 'Write an informal letter inviting your friend to spend summer holidays with you.',
        englishStarter: 'Examination Hall, ABC City. May 15, 2026. Dear Friend Kabir, Loving greetings. I am well here and hope you are doing great after your exams...',
        hindiStarter: 'परीक्षा भवन,\nअ.ब.स. नगर।\n\n15 मई, 2026\n\nप्रिय मित्र कबीर,\nसप्रेम नमस्ते।',
      },
      {
        id: 'pi_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'माताजी को विद्यालय में आयोजित विज्ञान प्रदर्शनी के अनुभव का वर्णन',
        titleEnglish: 'Sharing Science Exhibition Experience with Mother',
        promptHindi: 'छात्रावास में रहकर अपनी माताजी को विद्यालय में आयोजित विज्ञान प्रदर्शनी व अपने मॉडल के बारे में लगभग 120 शब्दों में पत्र लिखें।',
        promptEnglish: 'Write a ~120-word ICSE informal letter to your mother describing your school science exhibition.',
        englishStarter: 'Hostel, ABC City. November 18, 2026. Respected Mother, Respectful Pranam. I received your letter yesterday and am happy to share news of our Science Exhibition...',
        hindiStarter: 'छात्रावास,\nअ.ब.स. नगर।\n\n18 नवंबर, 2026\n\nआदरणीय माताजी,\nसादर चरण-स्पर्श।',
      },
    ],
  },

  soochna: {
    id: 'soochna',
    primaryTabId: 'soochna',
    topicKey: 'soochna',
    titleHindi: 'सूचना लेखन (Soochna)',
    titleEnglish: 'Notice Writing (ICSE Boxed Format)',
    shortTitleHindi: 'सूचना लेखन',
    badgeHindi: 'ICSE कक्षा 6–9 मुख्य | बॉक्स अनिवार्य',
    summaryHindi:
      'विद्यालय, संस्था या सोसाइटी द्वारा किसी कार्यक्रम, प्रतियोगिता, अवकाश या खोई-पाई वस्तु की जानकारी सर्वसाधारण तक संक्षिप्त व स्पष्ट रूप में पहुँचाना सूचना लेखन है।',
    summaryEnglish:
      'Formal 40–60 word announcement enclosed strictly inside a rectangular box covering What, When, Time, Where, and Who.',
    isBoxed: true,
    alignmentRuleHindi: 'चारों ओर आयताकार बॉक्स अनिवार्य + संस्था का नाम व "सूचना" केंद्र में + दिनांक बाएँ + जारीकर्ता नीचे बाएँ',
    alignmentRuleEnglish: 'Mandatory Rectangular Box · Centered Institution & "सूचना" · Left Date · Centered Heading · 3rd-Person Body · Bottom-Left Issuer',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'supporting',
        statusLabelHindi: 'परिचयात्मक अभ्यास',
        statusLabelEnglish: 'Introductory',
        wordLimitHindi: '35–50 शब्द',
        marksHindi: '4–5 अंक',
        noteHindi: 'खोई वस्तु या विद्यालय पिकनिक संबंधी सरल सूचना बॉक्स में लिखना',
        noteEnglish: 'Simple boxed notice on lost item or school picnic',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '40–50 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'विद्यालय प्रतियोगिता, छुट्टी या खोया-पाया सूचना का सटीक बॉक्स प्रारूप',
        noteEnglish: 'Exact boxed notice for school events & lost-and-found',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '40–60 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'सांस्कृतिक/खेल क्लब सचिव के रूप में तिथि, समय व स्थान सहित सूचना',
        noteEnglish: 'Cultural/sports notice with complete 5W details',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '50–60 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'रक्तदान/स्वच्छता अभियान, शैक्षिक भ्रमण व अंतर्विद्यालयी प्रतियोगिता सूचना',
        noteEnglish: 'Formal institutional & society notices inside strict box',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'मुख्य / आंतरिक मूल्यांकन',
        statusLabelEnglish: 'Syllabus & Assessment',
        wordLimitHindi: '50–60 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'ICSE कक्षा 9 व्यावहारिक लेखन व रचनात्मक मूल्यांकन का प्रमुख भाग',
        noteEnglish: 'Core Class 9 practical writing skill',
      },
      'कक्षा 10': {
        status: 'optional',
        statusLabelHindi: 'रचनात्मक / अतिरिक्त अभ्यास',
        statusLabelEnglish: 'Enrichment Practice',
        wordLimitHindi: '50–60 शब्द',
        marksHindi: 'वैकल्पिक अभ्यास',
        noteHindi: 'ICSE कक्षा 10 आंतरिक परियोजना व संक्षिप्त लेखन कौशल निखारने हेतु',
        noteEnglish: 'Useful for ICSE Class 10 internal assessment & crisp phrasing',
      },
    },
    markingScheme: [
      { partHindi: 'बॉक्स, संस्था का नाम, "सूचना", दिनांक, शीर्षक व पद', partEnglish: 'Box, Institution, Title, Date & Issuer', weightHindi: '2 अंक' },
      { partHindi: 'क्या, कब, समय, कहाँ व संपर्क (5W पूर्णता)', partEnglish: 'Event, Date, Time, Venue & Contact', weightHindi: '2 अंक' },
      { partHindi: 'अन्य पुरुष भाषा, संक्षिप्तता व वर्तनी', partEnglish: 'Formal 3rd-Person Tone & Clarity', weightHindi: '1 अंक' },
    ],
    blueprintLines: [
      {
        id: 'sc_inst',
        labelHindi: '१. जारी करने वाली संस्था / विद्यालय का नाम (केंद्र में)',
        labelEnglish: 'Institution / School Name (Centered)',
        samplePlaceholder: 'क.ख.ग. पब्लिक विद्यालय, अ.ब.स. नगर',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'बॉक्स के अंदर सबसे ऊपर केंद्र में लिखें।',
        requiredNoteEnglish: 'Top line inside the rectangular border.',
      },
      {
        id: 'sc_tag',
        labelHindi: '२. मोटे अक्षरों में "सूचना" शब्द (केंद्र में)',
        labelEnglish: 'Word "सूचना" (Centered)',
        samplePlaceholder: 'सूचना',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'संस्था के नाम के ठीक नीचे स्पष्ट रूप से लिखें।',
        requiredNoteEnglish: 'Makes the document immediately recognizable.',
      },
      {
        id: 'sc_date',
        labelHindi: '३. दिनांक (बाएँ हाथ की ओर)',
        labelEnglish: 'Date of Issue (Left-Aligned)',
        samplePlaceholder: 'दिनांक: 18 नवंबर, 2026',
        alignment: 'left',
        requiredNoteHindi: 'हमेशा घटना की तारीख से पहले की तारीख लिखें!',
        requiredNoteEnglish: 'Issue date must precede the actual event date.',
      },
      {
        id: 'sc_head',
        labelHindi: '४. सूचना का आकर्षक शीर्षक / विषय (केंद्र में)',
        labelEnglish: 'Notice Heading (Centered)',
        samplePlaceholder: 'अंतर्सदनीय हिंदी वाद-विवाद प्रतियोगिता',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'केवल 3–6 शब्दों में मुख्य विषय लिखें।',
        requiredNoteEnglish: 'Short 3–6 word title.',
      },
      {
        id: 'sc_body',
        labelHindi: '५. मुख्य विषय-वस्तु (40–60 शब्द, अन्य पुरुष में)',
        labelEnglish: 'Body (All 5 Ws: What, When, Time, Venue, Contact)',
        samplePlaceholder: 'सभी विद्यार्थियों को सूचित किया जाता है कि... दिनांक: ... समय: ... स्थान: ... इच्छुक छात्र दिनांक ... तक नाम लिखवाएँ।',
        alignment: 'left',
        requiredNoteHindi: '“मैं” की जगह “सभी को सूचित किया जाता है कि...” का प्रयोग करें।',
        requiredNoteEnglish: 'Include event date, exact time, venue, and deadline.',
      },
      {
        id: 'sc_issuer',
        labelHindi: '६. जारीकर्ता का नाम व पद (नीचे बाईं ओर)',
        labelEnglish: 'Issuer Name & Designation (Bottom-Left)',
        samplePlaceholder: 'क.ख.ग.\nसचिव, साहित्यिक परिषद',
        alignment: 'left',
        requiredNoteHindi: 'नाम के नीचे पद का उल्लेख अवश्य करें।',
        requiredNoteEnglish: 'Always state designation below the name.',
      },
    ],
    dosHindi: [
      'सूचना हमेशा एक साफ़-सुथरे आयताकार बॉक्स (पेंसिल/पेन से बनी सीमा-रेखा) के भीतर लिखें।',
      'जारी करने की दिनांक घटना की तिथि से कम से कम 5–7 दिन पहले की रखें।',
      'तिथि, समय, स्थान और नाम दर्ज कराने की अंतिम तिथि स्पष्ट लिखें।',
      'भाषा औपचारिक एवं अन्य पुरुष (“सभी विद्यार्थियों/निवासियों को सूचित किया जाता है”) में रखें।',
    ],
    dontsHindi: [
      'बॉक्स बनाना न भूलें—बॉक्स न बनाने पर सीधे 1 अंक कट सकता है।',
      'पत्र की तरह “सेवा में”, “महोदय” या “भवदीय” बिल्कुल न लिखें।',
      'सूचना में अनावश्यक कहानी या लंबी भूमिका न जोड़ें (40–60 शब्द पर्याप्त हैं)।',
      '“मैं सभी को बताना चाहता हूँ...” जैसी अनौपचारिक शैली से बचें (जब तक खोई वस्तु का निजी निवेदन न हो)।',
    ],
    formatChecklistItems: [
      { id: 'box', labelHindi: 'आयताकार बॉक्स (सीमा-रेखा)', labelEnglish: 'Enclosed in Box' },
      { id: 'header_date', labelHindi: 'संस्था नाम, "सूचना", दिनांक व शीर्षक', labelEnglish: 'Institution, Notice Tag, Date & Heading' },
      { id: 'five_ws', labelHindi: 'क्या, कब, समय, कहाँ व संपर्क सूत्र', labelEnglish: 'What, Date, Time, Venue & Contact' },
      { id: 'issuer', labelHindi: 'जारीकर्ता का नाम व पद', labelEnglish: 'Issuer Name & Designation' },
    ],
    examples: [
      {
        id: 'sc_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'खोई हुई कलाई घड़ी की सूचना',
        titleEnglish: 'Notice for a Lost Wristwatch',
        promptHindi: 'विद्यालय के खेल मैदान में आपकी कलाई घड़ी खो गई है। विद्यालय के सूचना-पट्ट हेतु लगभग 45 शब्दों में एक सूचना लिखिए।',
        promptEnglish: 'Write a 45-word school notice-board announcement for a lost wristwatch.',
        wordCountApprox: 48,
        blocks: [
          { tagHindi: 'संस्था का नाम', tagEnglish: 'Institution', textHindi: 'क.ख.ग. पब्लिक विद्यालय, अ.ब.स. नगर', alignment: 'center', isHeading: true },
          { tagHindi: 'शीर्ष टैग', tagEnglish: 'Tag', textHindi: 'सूचना', alignment: 'center', isHeading: true },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: 'दिनांक: 18 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'सूचना विषय', tagEnglish: 'Heading', textHindi: 'घड़ी खो जाने के संबंध में', alignment: 'center', isHeading: true },
          {
            tagHindi: 'मुख्य सूचना',
            tagEnglish: 'Body',
            textHindi:
              'सभी विद्यार्थियों को सूचित किया जाता है कि कल दिनांक 17 नवंबर को मध्याह्न अवकाश के समय विद्यालय के बास्केटबॉल मैदान में मेरी नीले रंग के पट्टे वाली ‘टाइटन’ कलाई घड़ी कहीं गिर गई है। जिस किसी को भी यह घड़ी मिले, कृपया कक्षा सात ‘अ’ के कक्षाध्यापक अथवा अधोहस्ताक्षरी को लौटाने की कृपा करें। घड़ी लौटाने वाले को उचित उपहार दिया जाएगा।',
            alignment: 'left',
          },
          { tagHindi: 'जारीकर्ता', tagEnglish: 'Issuer', textHindi: 'क.ख.ग.\nकक्षा — सात ‘अ’', alignment: 'left' },
        ],
        examinerNoteHindi: 'पहचान (नीला पट्टा/ब्रांड), खोने का स्थान व समय तथा लौटाने का संपर्क स्पष्ट रूप से बॉक्स में दिया गया है।',
        examinerNoteEnglish: 'Clear identifying details, venue, time, and return contact inside a neat box.',
      },
      {
        id: 'sc_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'अंतर्विद्यालयी हिंदी काव्य-पाठ प्रतियोगिता सूचना',
        titleEnglish: 'Notice for Inter-School Hindi Poetry Recitation',
        promptHindi: 'आप अपने विद्यालय की साहित्यिक समिति के सचिव हैं। अंतर्विद्यालयी हिंदी काव्य-पाठ प्रतियोगिता की सूचना ~55 शब्दों में तैयार कीजिए।',
        promptEnglish: 'As Literary Club Secretary, draft a 55-word boxed notice for an Inter-School Poetry Recitation.',
        wordCountApprox: 56,
        blocks: [
          { tagHindi: 'संस्था का नाम', tagEnglish: 'Institution', textHindi: 'क.ख.ग. आदर्श विद्यालय, अ.ब.स. नगर', alignment: 'center', isHeading: true },
          { tagHindi: 'शीर्ष टैग', tagEnglish: 'Tag', textHindi: 'सूचना', alignment: 'center', isHeading: true },
          { tagHindi: 'दिनांक', tagEnglish: 'Date', textHindi: 'दिनांक: 12 नवंबर, 2026', alignment: 'left' },
          { tagHindi: 'सूचना विषय', tagEnglish: 'Heading', textHindi: 'अंतर्विद्यालयी हिंदी काव्य-पाठ प्रतियोगिता', alignment: 'center', isHeading: true },
          {
            tagHindi: 'मुख्य सूचना',
            tagEnglish: 'Body',
            textHindi:
              'सभी विद्यार्थियों को सूचित किया जाता है कि विद्यालय की साहित्यिक परिषद द्वारा दिनांक 25 नवंबर, 2026 को प्रातः 9:30 बजे विद्यालय सभागार में ‘अंतर्विद्यालयी हिंदी काव्य-पाठ प्रतियोगिता’ का आयोजन किया जा रहा है। कक्षा 6 से 10 तक के इच्छुक प्रतिभागी अपने नाम 20 नवंबर तक हिंदी विभाग प्रमुख अथवा अधोहस्ताक्षरी के पास अवश्य दर्ज करा दें।',
            alignment: 'left',
          },
          { tagHindi: 'जारीकर्ता', tagEnglish: 'Issuer', textHindi: 'क.ख.ग.\nसचिव, साहित्यिक परिषद', alignment: 'left' },
        ],
        examinerNoteHindi: 'जारी करने की तिथि (12 नवंबर) < अंतिम तिथि (20 नवंबर) < आयोजन तिथि (25 नवंबर)—यह कालक्रम ICSE परीक्षक विशेष रूप से जाँचते हैं!',
        examinerNoteEnglish: 'Chronology check: Issue date (12th) < Registration deadline (20th) < Event date (25th).',
      },
    ],
    fillBlanks: [
      {
        id: 'sc_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'सूचना की बाहरी संरचना',
        beforeBlankHindi: 'परीक्षा में सूचना लेखन को सदैव एक स्पष्ट ',
        afterBlankHindi: ' के भीतर बंद करके प्रस्तुत करना अनिवार्य है।',
        options: [
          { textHindi: 'आयताकार बॉक्स (सीमा-रेखा)', textEnglish: 'Rectangular Box' },
          { textHindi: 'औपचारिक पत्र लिफ़ाफ़े', textEnglish: 'Letter Envelope' },
          { textHindi: 'अनेक अनुच्छेदों के समूह', textEnglish: 'Multiple Essays' },
          { textHindi: 'तिरछे गोले', textEnglish: 'Slanted Circle' },
        ],
        correctIndex: 0,
        hintHindi: 'सूचना-पट्ट (Notice Board) की आकृति कैसी होती है?',
        explanationHindi: 'सूचना व विज्ञापन लेखन में चारों ओर एक सुव्यवस्थित आयताकार बॉक्स बनाना अनिवार्य नियम है।',
        explanationEnglish: 'Both Soochna and Vigyapan must be enclosed inside a crisp rectangular box.',
      },
      {
        id: 'sc_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'सूचना दिनांक तर्क',
        beforeBlankHindi: 'यदि कोई प्रतियोगिता 28 नवंबर को होनी है, तो सूचना जारी करने का दिनांक ',
        afterBlankHindi: ' होना चाहिए।',
        options: [
          { textHindi: '28 नवंबर से कई दिन पहले (जैसे 18 नवंबर)', textEnglish: 'Several days prior (e.g., 18 Nov)' },
          { textHindi: '28 नवंबर के बाद (जैसे 5 दिसंबर)', textEnglish: 'After the event (5 Dec)' },
          { textHindi: 'दिनांक लिखना आवश्यक नहीं है', textEnglish: 'Omit date completely' },
          { textHindi: 'प्रतियोगिता समाप्त होने के एक माह बाद', textEnglish: 'One month later' },
        ],
        correctIndex: 0,
        hintHindi: 'बच्चों को तैयारी व नाम लिखवाने के लिए समय पहले मिलेगा या बाद में?',
        explanationHindi: 'जारी करने की तिथि सदैव कार्यक्रम व पंजीकरण की अंतिम तिथि से पहले की होती है।',
        explanationEnglish: 'The notice issue date must logically precede both registration deadline and event date.',
      },
      {
        id: 'sc_fb_3',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'सूचना की मानक शैली',
        beforeBlankHindi: 'औपचारिक सूचना में जारीकर्ता के स्थान पर प्रायः ',
        afterBlankHindi: ' शब्द का प्रयोग किया जाता है, जिसका अर्थ है—नीचे हस्ताक्षर करने वाला।',
        options: [
          { textHindi: 'अधोहस्ताक्षरी', textEnglish: 'The Undersigned' },
          { textHindi: 'आज्ञाकारी मित्र', textEnglish: 'Obedient friend' },
          { textHindi: 'शुभरात्रि', textEnglish: 'Goodnight' },
          { textHindi: 'प्रस्तावना', textEnglish: 'Introduction' },
        ],
        correctIndex: 0,
        hintHindi: 'अधः (नीचे) + हस्ताक्षर करने वाला = ?',
        explanationHindi: '“अधोहस्ताक्षरी” का अर्थ नीचे हस्ताक्षर करने वाला (The undersigned) होता है, जो सूचना लेखन को औपचारिक बनाता है।',
        explanationEnglish: '"अधोहस्ताक्षरी" (the undersigned) gives notices an authentic formal register.',
      },
      {
        id: 'sc_fb_4',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'सूचना के अनिवार्य बिंदु',
        beforeBlankHindi: 'एक पूर्ण सूचना के मुख्य भाग में घटना का नाम, तिथि, ',
        afterBlankHindi: ' और संपर्क व्यक्ति का स्पष्ट उल्लेख होना चाहिए।',
        options: [
          { textHindi: 'समय तथा स्थान', textEnglish: 'Time and Venue' },
          { textHindi: 'प्रधानाचार्य का घरेलू पता', textEnglish: 'Principal’s home address' },
          { textHindi: 'परिवार की कुशल-क्षेम', textEnglish: 'Family well-being' },
          { textHindi: 'कहानी की सीख', textEnglish: 'Moral of story' },
        ],
        correctIndex: 0,
        hintHindi: 'क्या, कब, _____ और कहाँ?',
        explanationHindi: 'कार्यक्रम की तिथि के साथ ठीक समय (जैसे प्रातः 10 बजे) व स्थान (जैसे सभागार) न लिखने पर सूचना अधूरी रहती है।',
        explanationEnglish: 'Every event notice must specify Time and Venue alongside Date.',
      },
    ],
    errorIdentification: [
      {
        id: 'sc_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'सूचना में गलत तिथि-क्रम व अधूरे विवरण की त्रुटि',
        titleEnglish: 'Spot the missing venue/time & illogical date sequence',
        instructionHindi: 'नीचे दी गई सूचना (बॉक्स) में किस भाग में गंभीर प्रारूप व तर्क त्रुटि है?',
        instructionEnglish: 'Click the line with the broken date sequence / missing venue-time.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्ष', textHindi: 'अ.ब.स. पब्लिक विद्यालय  |  सूचना' },
          { id: 'l2', tagHindi: 'दिनांक व विषय', textHindi: 'दिनांक: 28 नवंबर, 2026  |  विषय: विज्ञान प्रदर्शनी' },
          {
            id: 'l3',
            tagHindi: 'मुख्य भाग',
            textHindi: 'सभी छात्रों को सूचित किया जाता है कि दिनांक 15 नवंबर, 2026 को विज्ञान प्रदर्शनी होगी। (स्थान व समय नहीं लिखा!)',
          },
          { id: 'l4', tagHindi: 'जारीकर्ता', textHindi: 'क.ख.ग., सचिव (विज्ञान क्लब)' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi:
              'सभी विद्यार्थियों को सूचित किया जाता है कि आगामी 5 दिसंबर, 2026 को प्रातः 10:00 बजे से विद्यालय सभागार में विज्ञान प्रदर्शनी आयोजित होगी। इच्छुक छात्र 30 नवंबर तक नाम दें।',
            textEnglish: 'Event date after 28 Nov issue date + clear Time & Venue.',
          },
          {
            textHindi: 'प्रिय विज्ञान प्रदर्शनी, सादर नमस्ते।',
            textEnglish: 'Letter salutation.',
          },
          {
            textHindi: 'कल विज्ञान प्रदर्शनी हुई थी, बहुत मजा आया। शुभरात्रि।',
            textEnglish: 'Past-tense diary reflection.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          '28 नवंबर को सूचना जारी करके 15 नवंबर (बीती तारीख!) को कार्यक्रम घोषित करना असंभव है; साथ ही समय व स्थान (कहाँ) भी गायब थे।',
        explanationEnglish: 'Event date cannot precede the notice issue date, and Time + Venue are mandatory.',
        topicTagHindi: 'सूचना लेखन',
      },
      {
        id: 'sc_err_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'सूचना में पत्र-शैली व अनौपचारिक भाषा की त्रुटि',
        titleEnglish: 'Identify misplaced letter salutations in a Notice',
        instructionHindi: 'सूचना के इस प्रारूप में असंगत पंक्ति पहचानें।',
        instructionEnglish: 'Click the line that mixes formal letter phrasing into a notice.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'संस्था व टैग', textHindi: 'गुलमोहर रेजिडेंट वेलफेयर सोसाइटी  |  सूचना' },
          { id: 'l2', tagHindi: 'दिनांक व शीर्षक', textHindi: 'दिनांक: 18 नवंबर, 2026  |  निःशुल्क नेत्र-जाँच शिविर' },
          { id: 'l3', tagHindi: 'मुख्य भाग', textHindi: 'सभी निवासियों को सूचित किया जाता है कि 24 नवंबर को प्रातः 9 बजे सामुदायिक भवन में नेत्र-जाँच शिविर लगेगा।' },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'सेवा में, आपका आज्ञाकारी शिष्य व प्रिय मित्र, क.ख.ग. (बिना पद)।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'क.ख.ग.\nअध्यक्ष / सचिव, गुलमोहर वेलफेयर सोसाइटी',
            textEnglish: 'Clean bottom-left issuer name & designation.',
          },
          {
            textHindi: 'भवदीय प्रधानाचार्य महोदय।',
            textEnglish: 'Letter opening/closing mix.',
          },
          {
            textHindi: 'सीख: नेत्रों की रक्षा करनी चाहिए।',
            textEnglish: 'Story moral.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'सूचना के अंत में “सेवा में” या “आज्ञाकारी शिष्य/मित्र” नहीं लिखा जाता, बल्कि जारीकर्ता का नाम व आधिकारिक पद लिखा जाता है।',
        explanationEnglish: 'End a Notice with the issuer’s name and designation, never letter phrases.',
        topicTagHindi: 'सूचना लेखन',
      },
      {
        id: 'sc_err_3',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'संस्था नाम व "सूचना" शीर्षक लोप की त्रुटि',
        titleEnglish: 'Spot the missing institution header',
        instructionHindi: 'किस पंक्ति में सूचना के शीर्ष का आवश्यक प्रारूप छूट गया है?',
        instructionEnglish: 'Click the flawed header line.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्ष भाग', textHindi: 'प्रिय दोस्तों सुनो! कल स्कूल में ड्राइंग प्रतियोगिता है (संस्था का नाम व "सूचना" शब्द गायब)' },
          { id: 'l2', tagHindi: 'दिनांक', textHindi: 'दिनांक: 16 नवंबर, 2026' },
          { id: 'l3', tagHindi: 'मुख्य भाग', textHindi: 'दिनांक 22 नवंबर को प्रातः 10 बजे कला कक्ष में चित्रकला प्रतियोगिता होगी। इच्छुक छात्र नाम लिखवाएँ।' },
          { id: 'l4', tagHindi: 'जारीकर्ता', textHindi: 'क.ख.ग., सांस्कृतिक सचिव' },
        ],
        errorLineIndex: 0,
        correctionOptions: [
          {
            textHindi: 'क.ख.ग. पब्लिक विद्यालय\nसूचना\nचित्रकला प्रतियोगिता',
            textEnglish: 'Centered Institution Name + "सूचना" + Clear Heading.',
          },
          {
            textHindi: 'हैलो मित्रों! सप्रेम नमस्ते।',
            textEnglish: 'Casual greeting.',
          },
          {
            textHindi: 'चित्रकला एक अच्छी कला है।',
            textEnglish: 'Essay opening line.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'सूचना के शीर्ष पर संस्था/विद्यालय का नाम, फिर स्पष्ट “सूचना” शब्द और शीर्षक होना आवश्यक है; “प्रिय दोस्तों सुनो” लिखना गलत है।',
        explanationEnglish: 'Always start inside the box with Institution Name, "सूचना", Date, and Heading.',
        topicTagHindi: 'सूचना लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'sc_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'खोया हुआ विद्यालय पहचान-पत्र / पानी की बोतल',
        titleEnglish: 'Notice for Lost ID Card / Water Bottle',
        promptHindi: 'विद्यालय में आपकी हिंदी पुस्तक/पहचान-पत्र खो गया है। सूचना-पट्ट के लिए 45 शब्दों की बॉक्सयुक्त सूचना लिखें।',
        promptEnglish: 'Write a 45-word notice for a lost school ID card or book.',
        englishStarter: 'ABC Public School, NOTICE. Date: November 18, 2026. Lost School ID Card. All students are informed that I lost my ID card near the library...',
        hindiStarter: 'क.ख.ग. पब्लिक विद्यालय\nसूचना\nदिनांक: 18 नवंबर, 2026\nपहचान-पत्र खोने के संबंध में...',
      },
      {
        id: 'sc_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'शैक्षिक भ्रमण (आगरा/जयपुर) हेतु विद्यालय सूचना',
        titleEnglish: 'Notice for Educational Excursion',
        promptHindi: 'विद्यालय के शैक्षिक भ्रमण पर जाने के इच्छुक छात्रों के लिए तिथि, शुल्क, समय व अभिभावक-सहमति सहित 55 शब्दों की सूचना लिखें।',
        promptEnglish: 'Draft a 55-word notice inviting students for a school educational trip with fee and consent details.',
        englishStarter: 'ABC Academy, NOTICE. Date: November 18, 2026. Educational Tour to Jaipur. Students of Classes 8 to 10 are informed that...',
        hindiStarter: 'क.ख.ग. विद्यालय\nसूचना\nदिनांक: 18 नवंबर, 2026\nशैक्षिक भ्रमण (जयपुर)...',
      },
    ],
  },

  diary: {
    id: 'diary',
    primaryTabId: 'diary',
    topicKey: 'diary',
    titleHindi: 'डायरी लेखन (Diary Writing)',
    titleEnglish: 'Personal Diary Entry (ICSE Boxed Format)',
    shortTitleHindi: 'डायरी लेखन',
    badgeHindi: 'ICSE कक्षा 6–9 मुख्य | प्रथम पुरुष शैली',
    summaryHindi:
      'दिन भर की किसी विशेष घटना, मन के सच्चे भावों, सुखद-दुखद अनुभवों व आत्मचिंतन को आत्मीय शैली में दिनांक, दिन व समय के साथ अंकित करना डायरी लेखन है।',
    summaryEnglish:
      'First-person reflective journal entry recording personal feelings and key day events with Date, Day, Time, "प्रिय डायरी,", and "शुभरात्रि".',
    isBoxed: true,
    alignmentRuleHindi: 'बॉक्स के भीतर बाएँ हाथ: दिनांक व दिन -> समय (रात्रि/सायं) -> प्रिय डायरी, -> प्रथम पुरुष ("मैं") में अनुभव -> शुभरात्रि + नाम',
    alignmentRuleEnglish: 'Inside Box (Left-Aligned): Date & Day -> Time -> "प्रिय डायरी," -> 1st-Person Reflection -> "शुभरात्रि" + Name',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'supporting',
        statusLabelHindi: 'परिचयात्मक अभ्यास',
        statusLabelEnglish: 'Introductory',
        wordLimitHindi: '60–75 शब्द',
        marksHindi: '4–5 अंक',
        noteHindi: 'जन्मदिन या विद्यालय के पहले दिन का सरल डायरी अनुभव',
        noteEnglish: 'Simple journal entry on birthday or school day',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '70–90 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'दिनांक, दिन, समय व आत्मीय भावों के साथ बॉक्स में डायरी प्रविष्टि',
        noteEnglish: 'Dated & timed personal diary entry in box',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '80–100 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'पर्व, यात्रा, प्रतियोगिता या किसी विशेष सहायता का भावपूर्ण वर्णन',
        noteEnglish: 'Reflective entries on trips, competitions & kindness',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '90–100 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'परीक्षा परिणाम, मंच-प्रदर्शन या आत्ममंथन पर आधारित गहन डायरी लेखन',
        noteEnglish: 'Expressive self-reflection with strong emotional tone',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'मुख्य / आंतरिक मूल्यांकन',
        statusLabelEnglish: 'Syllabus & Assessment',
        wordLimitHindi: '90–110 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'ICSE कक्षा 9 रचनात्मक लेखन व आंतरिक मूल्यांकन पोर्टफोलियो का भाग',
        noteEnglish: 'Class 9 practical & portfolio writing format',
      },
      'कक्षा 10': {
        status: 'optional',
        statusLabelHindi: 'रचनात्मक / अतिरिक्त अभ्यास',
        statusLabelEnglish: 'Enrichment Practice',
        wordLimitHindi: '90–110 शब्द',
        marksHindi: 'वैकल्पिक अभ्यास',
        noteHindi: 'ICSE आत्मकथात्मक निबंध व प्रथम-पुरुष लेखन कौशल निखारने हेतु सहायक',
        noteEnglish: 'Sharpens 1st-person narrative voice for ICSE essays',
      },
    },
    markingScheme: [
      { partHindi: 'बॉक्स, दिनांक, दिन, समय व "प्रिय डायरी"', partEnglish: 'Box, Date, Day, Time & Salutation', weightHindi: '1.5–2 अंक' },
      { partHindi: 'प्रथम पुरुष ("मैं") में सच्चे भाव व घटनाक्रम', partEnglish: 'Authentic 1st-Person Reflection', weightHindi: '2.5 अंक' },
      { partHindi: 'शुभरात्रि व नाम तथा भाषा शुद्धता', partEnglish: 'Sign-off & Grammar Purity', weightHindi: '0.5–1 अंक' },
    ],
    blueprintLines: [
      {
        id: 'dr_date_day',
        labelHindi: '१. दिनांक व दिन (Date & Day — ऊपर बाएँ)',
        labelEnglish: 'Date & Day',
        samplePlaceholder: '18 नवंबर, 2026  |  बुधवार',
        alignment: 'left',
        isBold: true,
        requiredNoteHindi: 'प्रत्येक प्रविष्टि में तिथि और सप्ताह का दिन अवश्य लिखें।',
        requiredNoteEnglish: 'Write exact Hindi date and weekday.',
      },
      {
        id: 'dr_time',
        labelHindi: '२. समय (Time — सामान्यतः रात्रि का समय)',
        labelEnglish: 'Time (Usually Evening/Night)',
        samplePlaceholder: 'रात्रि 9:30 बजे',
        alignment: 'left',
        requiredNoteHindi: 'पूरे दिन के अनुभव रात में लिखे जाते हैं; सुबह 8 बजे रात के अनुभव लिखना अतार्किक है।',
        requiredNoteEnglish: 'Use night/late-evening time when summarizing the whole day.',
      },
      {
        id: 'dr_sal',
        labelHindi: '३. आत्मीय संबोधन (Salutation)',
        labelEnglish: 'Personal Salutation',
        samplePlaceholder: 'प्रिय डायरी,',
        alignment: 'left',
        isBold: true,
        requiredNoteHindi: 'डायरी को अपना मित्र मानकर “प्रिय डायरी,” से आरंभ करें।',
        requiredNoteEnglish: 'Begin intimately with "प्रिय डायरी,".',
      },
      {
        id: 'dr_body',
        labelHindi: '४. मुख्य विवरण (प्रथम पुरुष "मैं" में सच्ची भावनाएँ — 70–100 शब्द)',
        labelEnglish: '1st-Person Feelings & Key Event',
        samplePlaceholder: 'आज का दिन मेरे जीवन के सबसे अविस्मरणीय दिनों में से एक था... मैं बहुत प्रसन्न/भावुक हूँ क्योंकि...',
        alignment: 'left',
        requiredNoteHindi: 'केवल समाचार न लिखें—उस घटना से आपके मन पर क्या बीती, यह भाव अवश्य लिखें।',
        requiredNoteEnglish: 'Focus on genuine thoughts, lessons learned, and feelings.',
      },
      {
        id: 'dr_end',
        labelHindi: '५. शुभरात्रि व लिखने वाले का नाम (Closing)',
        labelEnglish: 'Sign-off',
        samplePlaceholder: 'शुभरात्रि।\nक.ख.ग.',
        alignment: 'left',
        requiredNoteHindi: 'रात्रि लेखन के अंत में “शुभरात्रि” व अपना संक्षिप्त नाम/क.ख.ग. लिखें।',
        requiredNoteEnglish: 'Simple "शुभरात्रि" followed by writer’s name.',
      },
    ],
    dosHindi: [
      'पूरी डायरी प्रथम पुरुष (‘मैं’, ‘मुझे’, ‘मेरा’) में और सरल आत्मीय शैली में लिखें।',
      'दिनांक, दिन और समय (जैसे: रात्रि 9:30 बजे) स्पष्ट लिखकर बॉक्स में बंद करें।',
      'घटना के साथ अपनी भावनाएँ (खुशी, उत्साह, सीख, संकल्प) अवश्य व्यक्त करें।',
      'अंत में “शुभरात्रि” लिखकर अपना नाम (क.ख.ग.) लिखें।',
    ],
    dontsHindi: [
      'निबंध या अख़बार की रिपोर्ट की तरह अन्य पुरुष (“विद्यार्थी ने ऐसा किया”) में न लिखें।',
      'सुबह 7:00 बजे के समय में पूरे दिन और शाम की घटनाएँ न लिखें।',
      '“सेवा में”, “विषय:” या “भवदीय” जैसे औपचारिक शब्द न जोड़ें।',
      'अनावश्यक लंबी कहानी न बनाएँ; 70–100 शब्दों में संक्षिप्त व सजीव रखें।',
    ],
    formatChecklistItems: [
      { id: 'box', labelHindi: 'बॉक्स (सीमा-रेखा)', labelEnglish: 'Enclosed in Box' },
      { id: 'date_day_time', labelHindi: 'दिनांक, दिन व समय (रात्रि)', labelEnglish: 'Date, Day & Time' },
      { id: 'salutation', labelHindi: '“प्रिय डायरी,” संबोधन व प्रथम पुरुष भाव', labelEnglish: '“प्रिय डायरी,” & 1st-Person Voice' },
      { id: 'goodnight', labelHindi: '“शुभरात्रि” व नाम (क.ख.ग.)', labelEnglish: '“शुभरात्रि” & Name' },
    ],
    examples: [
      {
        id: 'dr_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'वार्षिक खेल दिवस में पदक जीतने का अनुभव',
        titleEnglish: 'Winning a Medal on Annual Sports Day',
        promptHindi: 'आज आपके विद्यालय के खेल दिवस पर आपने दौड़ में स्वर्ण पदक जीता। अपनी भावनाएँ 80 शब्दों की डायरी में लिखिए।',
        promptEnglish: 'Write an 80-word diary entry about winning a gold medal on School Sports Day.',
        wordCountApprox: 84,
        blocks: [
          { tagHindi: 'दिनांक व दिन', tagEnglish: 'Date & Day', textHindi: '18 नवंबर, 2026 (बुधवार)', alignment: 'left', isHeading: true },
          { tagHindi: 'समय', tagEnglish: 'Time', textHindi: 'रात्रि 9:15 बजे', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'प्रिय डायरी,', alignment: 'left', isHeading: true },
          {
            tagHindi: 'प्रथम-पुरुष विवरण',
            tagEnglish: '1st-Person Body',
            textHindi:
              'आज का दिन मेरे लिए अत्यंत गौरव और प्रसन्नता से भरा रहा! हमारे विद्यालय में वार्षिक खेल दिवस का भव्य आयोजन हुआ। मैंने चार सौ मीटर की दौड़ में भाग लिया था। जब दौड़ आरंभ हुई तो मेरा दिल तेजी से धड़क रहा था, पर मैंने हिम्मत नहीं हारी और पूरे आत्मविश्वास से दौड़ पूरी कर प्रथम स्थान प्राप्त किया। जब मुख्य अतिथि ने मेरे गले में स्वर्ण पदक पहनाया और माता-पिता ने तालियाँ बजाईं, तो मेरी आँखों में खुशी के आँसू छलक आए। मैंने सीखा कि नियमित अभ्यास से हर लक्ष्य जीता जा सकता है। अब बहुत थकान हो रही है।',
            alignment: 'left',
          },
          { tagHindi: 'समापन', tagEnglish: 'Closing', textHindi: 'शुभरात्रि।\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'स्पष्ट दिन/दिनांक/रात्रि समय, सच्चे प्रथम-पुरुष भाव व संक्षिप्तता इसे आदर्श बनाते हैं।',
        examinerNoteEnglish: 'Balances event action with heartfelt emotions inside an authentic boxed layout.',
      },
      {
        id: 'dr_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'सड़क पर एक ज़रूरतमंद बुजुर्ग की सहायता का आत्मसंतोष',
        titleEnglish: 'Helping an Elderly Pedestrian Safely Cross a Busy Road',
        promptHindi: 'आज आपने एक असहाय बुजुर्ग की मदद की। उस घटना से मिले आत्मसंतोष पर 95 शब्दों में डायरी प्रविष्टि लिखिए।',
        promptEnglish: 'Write a 95-word diary entry reflecting on helping a needy elderly person.',
        wordCountApprox: 96,
        blocks: [
          { tagHindi: 'दिनांक व दिन', tagEnglish: 'Date & Day', textHindi: '21 नवंबर, 2026 (शनिवार)', alignment: 'left', isHeading: true },
          { tagHindi: 'समय', tagEnglish: 'Time', textHindi: 'रात्रि 10:00 बजे', alignment: 'left' },
          { tagHindi: 'संबोधन', tagEnglish: 'Salutation', textHindi: 'प्रिय डायरी,', alignment: 'left', isHeading: true },
          {
            tagHindi: 'प्रथम-पुरुष विवरण',
            tagEnglish: '1st-Person Body',
            textHindi:
              'आज शाम विद्यालय से लौटते समय एक ऐसी छोटी-सी घटना घटी, जिसने मेरे मन को अद्भुत शांति से भर दिया। व्यस्त चौराहे पर तेज़ ट्रैफ़िक के बीच एक नेत्रहीन बुजुर्ग दादाजी सड़क पार करने का प्रयास कर रहे थे। लोग अपनी जल्दबाज़ी में उन्हें अनदेखा कर रहे थे। मैं तुरंत उनके पास गया और उनका हाथ थामकर सुरक्षित दूसरी ओर पहुँचाया। बदले में उन्होंने मेरे सिर पर हाथ रखकर जो दुआएँ दीं, वह मेरे लिए दुनिया के किसी भी पुरस्कार से बढ़कर थीं। आज मैंने अनुभव किया कि सच्चा सुख पाने में नहीं, दूसरों के काम आने में है। कल नई ऊर्जा के साथ उठूँगा।',
            alignment: 'left',
          },
          { tagHindi: 'समापन', tagEnglish: 'Closing', textHindi: 'शुभरात्रि।\nक.ख.ग.', alignment: 'left' },
        ],
        examinerNoteHindi: 'मानवीय संवेदना, प्रथम पुरुष की सजीवता और स्पष्ट नैतिक आत्मचिंतन।',
        examinerNoteEnglish: 'Deep empathy and natural 1st-person reflection within 96 words.',
      },
    ],
    fillBlanks: [
      {
        id: 'dr_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'डायरी की पुरुष-शैली',
        beforeBlankHindi: 'डायरी लेखन हमेशा ',
        afterBlankHindi: ' (‘मैं’, ‘मुझे’, ‘मेरा’) में लिखा जाता है क्योंकि यह लेखक के निजी अनुभव होते हैं।',
        options: [
          { textHindi: 'प्रथम पुरुष (उत्तम पुरुष)', textEnglish: 'First Person (I/Me)' },
          { textHindi: 'केवल अन्य पुरुष (वे सब)', textEnglish: 'Third Person Only' },
          { textHindi: 'औपचारिक विज्ञप्ति शैली', textEnglish: 'Official Circular Style' },
          { textHindi: 'आदेशात्मक शैली', textEnglish: 'Command Style' },
        ],
        correctIndex: 0,
        hintHindi: '‘मैं’ सर्वनाम हिंदी व्याकरण के किस पुरुष में आता है?',
        explanationHindi: 'डायरी आत्मकथात्मक होती है, अतः इसमें उत्तम/प्रथम पुरुष (“मैं, मुझे”) का प्रयोग अनिवार्य है।',
        explanationEnglish: 'Personal diaries strictly use 1st-person (मैं/मेरा) narration.',
      },
      {
        id: 'dr_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'डायरी लिखने का तार्किक समय',
        beforeBlankHindi: 'पूरे दिन की घटनाओं को अंकित करने के लिए डायरी में सामान्यतः ',
        afterBlankHindi: ' का समय लिखना तार्किक माना जाता है।',
        options: [
          { textHindi: 'रात्रि / देर शाम (जैसे: रात्रि 9:30 बजे)', textEnglish: 'Night / Late Evening (e.g., 9:30 PM)' },
          { textHindi: 'प्रातः 6:00 बजे', textEnglish: '6:00 AM Morning' },
          { textHindi: 'समय नहीं लिखना चाहिए', textEnglish: 'No time needed' },
          { textHindi: 'अगले महीने की तारीख', textEnglish: 'Next month' },
        ],
        correctIndex: 0,
        hintHindi: 'दिन भर क्या-क्या हुआ, यह आप कब लिख पाएँगे?',
        explanationHindi: 'दिन भर की घटनाओं के बाद रात में सोने से पहले डायरी लिखी जाती है, तभी “शुभरात्रि” लिखना सार्थक होता है।',
        explanationEnglish: 'Night-time aligns both with summarizing the full day and closing with "शुभरात्रि".',
      },
      {
        id: 'dr_fb_3',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'डायरी का संबोधन',
        beforeBlankHindi: 'तिथि, दिन और समय के बाद डायरी की मुख्य बात ',
        afterBlankHindi: ' लिखकर आरंभ की जाती है।',
        options: [
          { textHindi: '“प्रिय डायरी,”', textEnglish: '“Dear Diary,”' },
          { textHindi: '“सेवा में, डायरी महोदया,”', textEnglish: '“To the Diary Madam”' },
          { textHindi: '“विषय: आज का दिन”', textEnglish: '“Subject: Today”' },
          { textHindi: '“सभी को सूचित किया जाता है”', textEnglish: '“All are informed”' },
        ],
        correctIndex: 0,
        hintHindi: 'डायरी को अपना घनिष्ठ मित्र मानकर कैसे पुकारते हैं?',
        explanationHindi: 'हिंदी डायरी लेखन में मानक व आत्मीय संबोधन “प्रिय डायरी,” है।',
        explanationEnglish: 'Standard affectionate opening is "प्रिय डायरी,".',
      },
      {
        id: 'dr_fb_4',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'डायरी के अनिवार्य तत्व',
        beforeBlankHindi: 'एक अच्छी डायरी प्रविष्टि में केवल घटनाओं की सूची नहीं होती, बल्कि लेखक के ',
        afterBlankHindi: ' भी स्पष्ट रूप से झलकते हैं।',
        options: [
          { textHindi: 'मन की सच्ची भावनाएँ व आत्मचिंतन', textEnglish: 'Sincere emotions & self-reflection' },
          { textHindi: 'उत्पाद की कीमत व छूट ऑफर', textEnglish: 'Product price & discount' },
          { textHindi: 'अख़बार के संपादक का पता', textEnglish: 'Editor address' },
          { textHindi: 'अनेक उपशीर्षक व बिंदु', textEnglish: 'Bullet points & headings' },
        ],
        correctIndex: 0,
        hintHindi: 'डायरी को समाचार-पत्र से अलग क्या बनाता है?',
        explanationHindi: 'घटना ने मन पर क्या प्रभाव डाला (हर्ष, दुख, सीख), वही डायरी की आत्मा है।',
        explanationEnglish: 'Personal reflection and emotional honesty separate a diary entry from a report.',
      },
    ],
    errorIdentification: [
      {
        id: 'dr_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'समय व संबोधन में अतार्किक त्रुटि',
        titleEnglish: 'Spot the illogical time and formal letter intrusion',
        instructionHindi: 'नीचे दी गई डायरी प्रविष्टि में से अशुद्ध पंक्ति पहचानें।',
        instructionEnglish: 'Click the line with the illogical time & formal header error.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'दिनांक व समय', textHindi: '18 नवंबर, 2026 (बुधवार)  |  प्रातः 6:00 बजे' },
          { id: 'l2', tagHindi: 'संबोधन', textHindi: 'विषय: आज शाम की घटना।  |  सेवा में, आदरणीय डायरी महोदय,' },
          { id: 'l3', tagHindi: 'विवरण', textHindi: 'आज शाम को मेरे जन्मदिन की पार्टी में सभी मित्र आए और हमने खूब गीत गाए।' },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'शुभरात्रि।  |  क.ख.ग.' },
        ],
        errorLineIndex: 1,
        correctionOptions: [
          {
            textHindi: 'रात्रि 9:30 बजे\nप्रिय डायरी,',
            textEnglish: 'Logical night time + intimate "प्रिय डायरी," with no Subject or "सेवा में".',
          },
          {
            textHindi: 'प्रातः 5:00 बजे, सादर चरण-स्पर्श डायरी।',
            textEnglish: 'Illogical morning time + elder greeting.',
          },
          {
            textHindi: 'सूचना: आज मेरा जन्मदिन है।',
            textEnglish: 'Notice tag.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'डायरी में “विषय:”, “सेवा में” और “महोदय” नहीं लिखे जाते; साथ ही शाम की पार्टी का वर्णन सुबह 6 बजे की बजाय रात्रि में होना चाहिए।',
        explanationEnglish: 'Remove formal letter headers ("विषय", "सेवा में", "महोदय") and match night-time to full-day events.',
        topicTagHindi: 'डायरी लेखन',
      },
      {
        id: 'dr_err_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'पुरुष (Voice) और समापन अशुद्धि',
        titleEnglish: 'Spot the 3rd-person report tone in Diary',
        instructionHindi: 'इस डायरी में कौन-सी पंक्ति डायरी की शैली के विरुद्ध है?',
        instructionEnglish: 'Click the line written in detached 3rd-person style.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्ष', textHindi: '22 नवंबर, 2026 (रविवार)  |  रात्रि 9:45 बजे' },
          { id: 'l2', tagHindi: 'संबोधन', textHindi: 'प्रिय डायरी,' },
          {
            id: 'l3',
            tagHindi: 'विवरण',
            textHindi: 'छात्र क.ख.ग. ने आज पुस्तक मेले का भ्रमण किया और सभी विद्यार्थियों ने नई किताबें खरीदीं।',
          },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'शुभरात्रि।  |  क.ख.ग.' },
        ],
        errorLineIndex: 2,
        correctionOptions: [
          {
            textHindi:
              'आज मैंने अपने मित्रों के साथ पुस्तक मेले की सैर की। वहाँ ज्ञानवर्धक पुस्तकें देखकर मेरा मन बहुत प्रसन्न हुआ और मैंने भी दो सुंदर कहानियों की किताबें खरीदीं।',
            textEnglish: 'Uses 1st-person ("मैंने", "मेरा") with personal feelings.',
          },
          {
            textHindi: 'आपका आज्ञाकारी छात्र क.ख.ग. मेले में गया।',
            textEnglish: 'Third person + formal phrase.',
          },
          {
            textHindi: 'मेले में सभी पुस्तकों पर 20% भारी छूट पाएं! संपर्क करें।',
            textEnglish: 'Advertisement copy.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'डायरी में स्वयं को तीसरे व्यक्ति (“छात्र क.ख.ग. ने”) की तरह नहीं बल्कि प्रथम पुरुष (“मैंने”, “मुझे”) में लिखना होता है।',
        explanationEnglish: 'Always write in 1st-person ("मैं/मैंने"), never in detached 3rd-person reporting.',
        topicTagHindi: 'डायरी लेखन',
      },
      {
        id: 'dr_err_3',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'समापन में पत्र की नकल',
        titleEnglish: 'Identify incorrect ending in Diary',
        instructionHindi: 'गलत समापन वाली पंक्ति को पहचानें।',
        instructionEnglish: 'Click the misplaced closing line.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्ष', textHindi: '24 नवंबर, 2026 (मंगलवार)  |  रात्रि 9:00 बजे' },
          { id: 'l2', tagHindi: 'संबोधन', textHindi: 'प्रिय डायरी,' },
          { id: 'l3', tagHindi: 'विवरण', textHindi: 'आज बारिश में भीगते हुए घर लौटकर मुझे बहुत आनंद आया और गरमा-गरम चाय-पकौड़ी का स्वाद लिया।' },
          { id: 'l4', tagHindi: 'समापन', textHindi: 'सधन्यवाद! आपका आज्ञाकारी शिष्य एवं भवदीय, क.ख.ग.। स्थान: नगर निगम।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'शुभरात्रि।\nक.ख.ग.',
            textEnglish: 'Authentic diary sign-off.',
          },
          {
            textHindi: 'तुम्हारा प्रिय मित्र, अ.ब.स.।',
            textEnglish: 'Letter sign-off.',
          },
          {
            textHindi: 'सूचना समाप्त।',
            textEnglish: 'Notice phrase.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'डायरी का समापन केवल “शुभरात्रि” और लिखने वाले के नाम से होता है—“सधन्यवाद / भवदीय / आज्ञाकारी शिष्य” पत्र की बातें हैं।',
        explanationEnglish: 'Close a diary simply with "शुभरात्रि" and your name.',
        topicTagHindi: 'डायरी लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'dr_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'कक्षा में प्रथम स्थान पाने की खुशी पर डायरी',
        titleEnglish: 'Joy of Standing First in Class',
        promptHindi: 'आज वार्षिक परीक्षा फल में आप कक्षा में प्रथम आए हैं। अपनी प्रसन्नता 75 शब्दों में डायरी में लिखें।',
        promptEnglish: 'Write a 75-word diary entry about securing first position in annual exams.',
        englishStarter: 'November 18, 2026, Wednesday. 9:30 PM. Dear Diary, Today was the happiest day of my school life as our annual results were declared...',
        hindiStarter: '18 नवंबर, 2026 (बुधवार)\nरात्रि 9:30 बजे\n\nप्रिय डायरी,\nआज का दिन मेरे जीवन का सबसे सुखद दिन है...',
      },
      {
        id: 'dr_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'प्रथम बार मंच पर भाषण देने का अनुभव (डर से आत्मविश्वास तक)',
        titleEnglish: 'First Stage Speech Experience',
        promptHindi: 'पहली बार मंच पर बोलने के संकोच और तालियों से मिले आत्मविश्वास पर लगभग 95 शब्दों की डायरी लिखें।',
        promptEnglish: 'Write a 95-word diary entry about overcoming stage fright during your first speech.',
        englishStarter: 'November 18, 2026, Wednesday. 9:45 PM. Dear Diary, Earlier today my hands were trembling before stepping onto the auditorium stage...',
        hindiStarter: '18 नवंबर, 2026 (बुधवार)\nरात्रि 9:45 बजे\n\nप्रिय डायरी,\nआज प्रातः जब मंच पर मेरा नाम पुकारा गया तो...',
      },
    ],
  },

  vigyapan: {
    id: 'vigyapan',
    primaryTabId: 'vigyapan',
    topicKey: 'vigyapan',
    titleHindi: 'विज्ञापन लेखन (Vigyapan)',
    titleEnglish: 'Advertisement Writing (ICSE Display Box Format)',
    shortTitleHindi: 'विज्ञापन लेखन',
    badgeHindi: 'ICSE कक्षा 6–9 मुख्य | आकर्षक बॉक्स अनिवार्य',
    summaryHindi:
      'किसी उत्पाद, पुस्तक मेले, शिक्षण संस्थान, पर्यावरण अभियान या सेवा के प्रति जनसामान्य को आकर्षित करने हेतु संक्षिप्त, रोचक व चित्र-संदेशयुक्त बॉक्स में विज्ञापन तैयार किया जाता है।',
    summaryEnglish:
      'Persuasive 25–50 word boxed display copy featuring a catchy headline/slogan, bullet features, special offer/discount, and fictional contact info.',
    isBoxed: true,
    alignmentRuleHindi: 'सुंदर आयताकार बॉक्स अनिवार्य + ऊपर बड़ा नारा/शीर्षक + मध्य में 3–4 बुलेट विशेषताएँ + छूट/ऑफर + नीचे संपर्क व पता',
    alignmentRuleEnglish: 'Mandatory Decorative Box · Catchy Slogan Top · Crisp Bullet Features · Discount/Offer Badge · Bottom Contact Info',
    gradeSpecs: {
      'कक्षा 5': {
        status: 'supporting',
        statusLabelHindi: 'परिचयात्मक अभ्यास',
        statusLabelEnglish: 'Introductory',
        wordLimitHindi: '25–40 शब्द',
        marksHindi: '4–5 अंक',
        noteHindi: 'पेंसिल, छाता या पुस्तक मेले का सरल आकर्षक विज्ञापन',
        noteEnglish: 'Simple boxed ad for stationery or book fair',
      },
      'कक्षा 6': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '25–45 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'दैनिक उपयोग की वस्तुओं का नारा व विशेषताओं सहित बॉक्स में विज्ञापन',
        noteEnglish: 'Everyday product ads with slogan and bullet specs',
      },
      'कक्षा 7': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '30–50 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'योग शिविर, हर्बल उत्पाद व पर्यावरण जागरूकता विज्ञापन',
        noteEnglish: 'Product & social awareness advertisements',
      },
      'कक्षा 8': {
        status: 'core',
        statusLabelHindi: 'मुख्य पाठ्यक्रम',
        statusLabelEnglish: 'Core Syllabus',
        wordLimitHindi: '35–50 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'व्यावसायिक, शैक्षिक व जनहित विज्ञापनों का प्रभावी प्रस्तुतीकरण',
        noteEnglish: 'Commercial, educational & public-interest ads',
      },
      'कक्षा 9': {
        status: 'core',
        statusLabelHindi: 'मुख्य / आंतरिक मूल्यांकन',
        statusLabelEnglish: 'Syllabus & Assessment',
        wordLimitHindi: '40–50 शब्द',
        marksHindi: '5 अंक',
        noteHindi: 'ICSE कक्षा 9 रचनात्मक व व्यावहारिक हिंदी लेखन मूल्यांकन',
        noteEnglish: 'Class 9 practical creative writing evaluation',
      },
      'कक्षा 10': {
        status: 'optional',
        statusLabelHindi: 'रचनात्मक / अतिरिक्त अभ्यास',
        statusLabelEnglish: 'Enrichment Practice',
        wordLimitHindi: '40–50 शब्द',
        marksHindi: 'वैकल्पिक अभ्यास',
        noteHindi: 'संक्षिप्त प्रभावशाली अभिव्यक्ति व स्कूल परियोजना कार्यों हेतु उपयोगी',
        noteEnglish: 'Refines persuasive brevity for projects & competitions',
      },
    },
    markingScheme: [
      { partHindi: 'बॉक्स, आकर्षक शीर्षक व तुकबंदी नारा', partEnglish: 'Box, Headline & Slogan', weightHindi: '2 अंक' },
      { partHindi: 'संक्षिप्त विशेषताएँ (बुलेट बिंदु) व विशेष छूट/ऑफर', partEnglish: 'Key Features & Offer Highlight', weightHindi: '2 अंक' },
      { partHindi: 'पता, संपर्क विवरण व शुद्ध वर्तनी', partEnglish: 'Contact Details & Accuracy', weightHindi: '1 अंक' },
    ],
    blueprintLines: [
      {
        id: 'vg_tag',
        labelHindi: '१. ध्यानाकर्षण टैग व शीर्षक (Top Banner / Product Name)',
        labelEnglish: 'Hook Tag + Bold Brand/Campaign Title',
        samplePlaceholder: '✨ खुशखबरी! सुनहरा अवसर ✨  —  ‘नवरत्न’ शुद्ध हर्बल केश तेल',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'सबसे ऊपर मोटे अक्षरों में उत्पाद/अभियान का नाम लिखें।',
        requiredNoteEnglish: 'Bold centered name + eye-catching hook.',
      },
      {
        id: 'vg_slogan',
        labelHindi: '२. तुकबंदी नारा (Catchy Slogan — 1 छोटी पंक्ति)',
        labelEnglish: 'Memorable Slogan',
        samplePlaceholder: '“बालों को बनाए घना और मज़बूत, प्रकृति का अनमोल वरदान!”',
        alignment: 'center',
        requiredNoteHindi: 'छोटा और याद रहने वाला नारा विज्ञापन में जान डालता है।',
        requiredNoteEnglish: '1 crisp rhyming or punchy tagline.',
      },
      {
        id: 'vg_features',
        labelHindi: '३. मुख्य विशेषताएँ (3–4 संक्षिप्त बुलेट बिंदु)',
        labelEnglish: 'Concise Bullet Features (NO long paragraphs!)',
        samplePlaceholder: '• शत-प्रतिशत शुद्ध व रसायन-मुक्त\n• सभी आयु वर्ग के लिए उपयुक्त\n• मनमोहक प्राकृतिक सुगंध व किफ़ायती मूल्य',
        alignment: 'left',
        requiredNoteHindi: 'पूरे वाक्य या लंबा गद्य लिखने के बजाय छोटे वाक्यांश/बुलेट लिखें।',
        requiredNoteEnglish: 'Use crisp bullets, never prose paragraphs.',
      },
      {
        id: 'vg_offer',
        labelHindi: '४. विशेष आकर्षण / छूट / समय (Offer Badge)',
        labelEnglish: 'Special Offer / Price / Limited Period',
        samplePlaceholder: '💥 विशेष ऑफर: प्रथम 100 ग्राहकों को 20% भारी छूट व एक पैक मुफ़्त! 💥',
        alignment: 'center',
        isBold: true,
        requiredNoteHindi: 'जल्दी ख़रीदने या भाग लेने की प्रेरणा दें (जैसे “सीमित समय ऑफर”)।',
        requiredNoteEnglish: 'Highlight discount, entry free, or bonus.',
      },
      {
        id: 'vg_contact',
        labelHindi: '५. संपर्क सूत्र व पता (Fictional Contact Details — सबसे नीचे)',
        labelEnglish: 'Fictional Phone / Website / Address',
        samplePlaceholder: 'संपर्क करें: 98XXXXXXXX | पता: क.ख.ग. मार्केट, अ.ब.स. नगर',
        alignment: 'center',
        requiredNoteHindi: 'परीक्षा में कभी अपना असली फ़ोन नंबर न लिखें—हमेशा 98XXXXXXXX लिखें।',
        requiredNoteEnglish: 'Always use masked digits like 98XXXXXXXX.',
      },
    ],
    dosHindi: [
      'विज्ञापन हमेशा एक सुंदर, सजे हुए आयताकार बॉक्स के भीतर बनाएँ।',
      'कम शब्दों (25–50 शब्द) में अधिक जानकारी—बुलेट बिंदुओं का प्रयोग करें।',
      'एक छोटा-सा साफ़ चित्र/प्रतीक (जैसे पुस्तक, पेड़, घड़ी) व तुकबंदी नारा बनाएँ।',
      '“विशेष छूट / सीमित अवसर / मुफ़्त” जैसा आकर्षण केंद्र और काल्पनिक संपर्क (98XXXXXXXX) अवश्य दें।',
    ],
    dontsHindi: [
      'निबंध या सूचना की तरह लंबे-लंबे पैराग्राफ न लिखें।',
      'परीक्षा कॉपी में अपना असली फ़ोन नंबर, ईमेल या पता न लिखें।',
      'केवल चित्र बनाकर शब्दों की जानकारी अधूरी न छोड़ें—विशेषताएँ व संपर्क अनिवार्य हैं।',
      '“सेवा में”, “दिनांक जारीकर्ता” या “भवदीय” जैसे पत्र/सूचना शब्द न लिखें।',
    ],
    formatChecklistItems: [
      { id: 'box', labelHindi: 'आकर्षक आयताकार बॉक्स', labelEnglish: 'Enclosed in Display Box' },
      { id: 'headline_slogan', labelHindi: 'बड़ा शीर्षक व प्रभावशाली नारा', labelEnglish: 'Bold Title & Catchy Slogan' },
      { id: 'bullets', labelHindi: 'संक्षिप्त बुलेट विशेषताएँ (लंबे गद्य नहीं)', labelEnglish: 'Crisp Bullet Features' },
      { id: 'offer_contact', labelHindi: 'विशेष ऑफर/छूट व काल्पनिक संपर्क (98XXXXXXXX)', labelEnglish: 'Offer Highlight & Masked Contact' },
    ],
    examples: [
      {
        id: 'vg_ex_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: '‘रक्षक’ स्वदेशी हर्बल दंतमंजन (उत्पाद विज्ञापन)',
        titleEnglish: 'Herbal Toothpaste Product Advertisement',
        promptHindi: 'बाज़ार में आए एक नए हर्बल दंतमंजन/टूथपेस्ट के लिए लगभग 40 शब्दों का आकर्षक विज्ञापन तैयार कीजिए।',
        promptEnglish: 'Design a 40-word boxed advertisement for a new herbal toothpaste.',
        wordCountApprox: 42,
        blocks: [
          { tagHindi: 'ध्यानाकर्षण व शीर्षक', tagEnglish: 'Headline', textHindi: '✨ खुशखबरी! मुस्कान का नया साथी — ‘दंत-रक्षक’ हर्बल पेस्ट ✨', alignment: 'center', isHeading: true },
          { tagHindi: 'नारा', tagEnglish: 'Slogan', textHindi: '“लौंग, नीम और बबूल के गुणों से भरपूर — दाँतों की हर समस्या रहे दूर!”', alignment: 'center' },
          {
            tagHindi: 'विशेषताएँ (बुलेट)',
            tagEnglish: 'Key Features',
            textHindi: '• १००% प्राकृतिक व रसायन-मुक्त जड़ी-बूटियाँ\n• मसूड़ों को बनाए मज़बूत और साँसों को ताज़ा\n• बच्चों व बड़ों दोनों के लिए सुरक्षित',
            alignment: 'left',
          },
          { tagHindi: 'छूट / ऑफर', tagEnglish: 'Offer', textHindi: '🎁 विशेष ऑफर: बड़े पैक के साथ 1 टूथब्रश बिल्कुल मुफ़्त! मूल्य मात्र ₹45/-', alignment: 'center', isHeading: true },
          { tagHindi: 'संपर्क', tagEnglish: 'Contact', textHindi: 'सभी मेडिकल व जनरल स्टोर पर उपलब्ध | संपर्क: 98XXXXXXXX', alignment: 'center' },
        ],
        examinerNoteHindi: 'कम शब्दों में नारा, 3 सटीक बुलेट, मूल्य व ऑफर तथा सुरक्षित संपर्क नंबर।',
        examinerNoteEnglish: 'Crisp slogan, 3 clean bullets, bonus offer, and masked contact inside 42 words.',
      },
      {
        id: 'vg_ex_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'बाल-साहित्य पुस्तक मेला / पर्यावरण जागरूकता विज्ञापन',
        titleEnglish: 'Book Fair Display Advertisement',
        promptHindi: 'आपके नगर में आयोजित होने वाले ‘ज्ञान-दीप पुस्तक मेले’ के प्रचार हेतु लगभग 45 शब्दों में एक बॉक्सयुक्त विज्ञापन लिखिए।',
        promptEnglish: 'Create a 45-word display ad promoting a city Book Fair.',
        wordCountApprox: 46,
        blocks: [
          { tagHindi: 'ध्यानाकर्षण व शीर्षक', tagEnglish: 'Headline', textHindi: '📚 सुनहरा अवसर! — ‘ज्ञान-दीप’ विशाल पुस्तक मेला 📚', alignment: 'center', isHeading: true },
          { tagHindi: 'नारा', tagEnglish: 'Slogan', textHindi: '“पुस्तकें हैं सच्ची मित्र — आइए, संवारें अपना भविष्य व चरित्र!”', alignment: 'center' },
          {
            tagHindi: 'विशेषताएँ',
            tagEnglish: 'Highlights',
            textHindi: '• हिंदी, अंग्रेज़ी व विज्ञान की ५०,००० से अधिक रोचक पुस्तकें\n• प्रसिद्ध बाल-साहित्यकारों से मिलने व प्रश्न पूछने का अवसर\n• सभी वर्ग के पाठकों हेतु निःशुल्क प्रवेश',
            alignment: 'left',
          },
          { tagHindi: 'छूट व समय', tagEnglish: 'Offer & Venue', textHindi: '🔥 विद्यार्थियों के लिए सभी पुस्तकों पर विशेष 25% छूट!\nतिथि: 20 से 26 नवंबर | समय: प्रातः 10 से सायं 7 बजे', alignment: 'center', isHeading: true },
          { tagHindi: 'पता व संपर्क', tagEnglish: 'Contact', textHindi: 'स्थान: प्रगति मैदान, अ.ब.स. नगर | संपर्क: 98XXXXXXXX', alignment: 'center' },
        ],
        examinerNoteHindi: 'आकर्षक नारा, स्पष्ट बुलेट, 25% विद्यार्थी छूट, समय-स्थान व काल्पनिक संपर्क का संपूर्ण संतुलन।',
        examinerNoteEnglish: 'Persuasive layout covering event highlights, student discount, timings, and venue.',
      },
    ],
    fillBlanks: [
      {
        id: 'vg_fb_1',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'विज्ञापन की लेखन शैली',
        beforeBlankHindi: 'विज्ञापन की विशेषताएँ लिखते समय लंबे पैराग्राफ की जगह ',
        afterBlankHindi: ' का प्रयोग करना चाहिए ताकि पाठक की नज़र तुरंत टिक जाए।',
        options: [
          { textHindi: 'संक्षिप्त बुलेट बिंदुओं व नारे', textEnglish: 'Crisp bullet points & slogan' },
          { textHindi: '250 शब्दों की भूमिका व उपसंहार', textEnglish: '250-word intro & conclusion' },
          { textHindi: 'सादर चरण-स्पर्श अभिवादन', textEnglish: 'Letter greeting' },
          { textHindi: 'भविष्यत् काल की कहानी', textEnglish: 'Long future story' },
        ],
        correctIndex: 0,
        hintHindi: 'पोस्टर या अख़बार के विज्ञापन कैसे पढ़े जाते हैं?',
        explanationHindi: 'विज्ञापन कम शब्दों में अधिक प्रभाव डालने के लिए नारे और संक्षिप्त बुलेट बिंदुओं में लिखा जाता है।',
        explanationEnglish: 'Ads succeed through punchy slogans and concise bulleted highlights rather than heavy prose.',
      },
      {
        id: 'vg_fb_2',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'गोपनीयता व संपर्क नियम',
        beforeBlankHindi: 'परीक्षा के विज्ञापन में संपर्क सूत्र लिखते समय असली फ़ोन नंबर के स्थान पर ',
        afterBlankHindi: ' लिखना चाहिए।',
        options: [
          { textHindi: '98XXXXXXXX या 011-XXXXXXX', textEnglish: 'Masked digits (e.g., 98XXXXXXXX)' },
          { textHindi: 'अपना वास्तविक मोबाइल नंबर', textEnglish: 'Your real personal phone number' },
          { textHindi: 'बिना किसी संपर्क विवरण के छोड़ देना', textEnglish: 'Omit contact info completely' },
          { textHindi: 'अपना रोल नंबर', textEnglish: 'Your exam roll number' },
        ],
        correctIndex: 0,
        hintHindi: 'संपर्क देना ज़रूरी है, पर गोपनीयता भी रखनी है!',
        explanationHindi: 'संपर्क सूत्र विज्ञापन का अनिवार्य अंग है, किंतु परीक्षा में काल्पनिक अंक (98XXXXXXXX) ही लिखे जाते हैं।',
        explanationEnglish: 'Include contact information using masked digits to protect exam anonymity.',
      },
      {
        id: 'vg_fb_3',
        gradeBand: 'सभी कक्षाएँ',
        contextLabelHindi: 'ग्राहक आकर्षण तत्व',
        beforeBlankHindi: 'ख़रीदारों को तुरंत आकर्षित करने के लिए विज्ञापन में “20% विशेष छूट” या “एक पर एक मुफ़्त” जैसे ',
        afterBlankHindi: ' अवश्य दिए जाते हैं।',
        options: [
          { textHindi: 'विशेष ऑफर / आकर्षण केंद्र', textEnglish: 'Special Offer / Hook' },
          { textHindi: 'कठोर चेतावनी व दंड', textEnglish: 'Harsh warning' },
          { textHindi: 'अधोहस्ताक्षरी का पद', textEnglish: 'Notice designation' },
          { textHindi: 'प्रस्तावना', textEnglish: 'Essay introduction' },
        ],
        correctIndex: 0,
        hintHindi: 'सेल या नए उत्पाद के विज्ञापन में सबसे बड़ा आकर्षण क्या होता है?',
        explanationHindi: 'विशेष छूट, निशुल्क उपहार या सीमित समय ऑफर विज्ञापन को प्रभावशाली बनाते हैं।',
        explanationEnglish: 'Promotional offers or discounts create urgency and customer interest.',
      },
      {
        id: 'vg_fb_4',
        gradeBand: 'कक्षा 8–10',
        contextLabelHindi: 'जनहित विज्ञापन का उद्देश्य',
        beforeBlankHindi: '‘जल बचाओ’ या ‘प्लास्टिक हटाओ’ जैसे सामाजिक विज्ञापनों का मुख्य उद्देश्य ',
        afterBlankHindi: ' होता है।',
        options: [
          { textHindi: 'जन-जागरूकता फैलाना व सही संदेश देना', textEnglish: 'Spreading public awareness' },
          { textHindi: 'मँहगे सामान की बिक्री बढ़ाना', textEnglish: 'Selling expensive luxury goods' },
          { textHindi: 'प्रधानाचार्य से अवकाश माँगना', textEnglish: 'Asking Principal for leave' },
          { textHindi: 'मित्र को बधाई देना', textEnglish: 'Congratulating a friend' },
        ],
        correctIndex: 0,
        hintHindi: 'सामाजिक या जनहित अभियान किसके लाभ के लिए होते हैं?',
        explanationHindi: 'जनहित (Social) विज्ञापनों में छूट की जगह जन-जागरूकता नारा व जारीकर्ता विभाग (जैसे: पर्यावरण मंत्रालय) लिखा जाता है।',
        explanationEnglish: 'Social awareness ads focus on motivating positive civic behavior and cite the issuing body.',
      },
    ],
    errorIdentification: [
      {
        id: 'vg_err_1',
        gradeBand: 'सभी कक्षाएँ',
        titleHindi: 'विज्ञापन में निबंध जैसा लंबा गद्य व संपर्क लोप',
        titleEnglish: 'Identify the flawed prose body & missing contact info',
        instructionHindi: 'नीचे दिए गए विज्ञापन प्रारूप में किस हिस्से में सबसे बड़ी कमी है?',
        instructionEnglish: 'Click the line that ruins the advertisement layout.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: '✨ सुनहरा अवसर — ‘सवेरा’ स्कूल बैग ✨' },
          {
            id: 'l2',
            tagHindi: 'गलत गद्य शैली',
            textHindi:
              'प्रस्तावना: प्राचीन काल से ही विद्यार्थी किताबें ढोते आए हैं और हमारे समाज में बस्ते का इतिहास बहुत बड़ा रहा है इसलिए मैं सभी छात्रों को लंबा निबंध पढ़कर बताना चाहता हूँ कि बैग खरीदना क्यों ज़रूरी है। (संपर्क सूत्र व छूट भी नहीं लिखी!)',
          },
          { id: 'l3', tagHindi: 'निचला भाग', textHindi: 'नज़दीकी दुकान पर देखें।' },
        ],
        errorLineIndex: 1,
        correctionOptions: [
          {
            textHindi:
              '• मज़बूत व जल-रोधी कपड़ा  • हल्का वज़न व आकर्षक रंग  • 20% छात्र छूट!\nसंपर्क: 98XXXXXXXX | पता: क.ख.ग. मार्केट',
            textEnglish: 'Crisp bullet specs + discount + masked contact.',
          },
          {
            textHindi: 'उपसंहार: अतः बस्ता अच्छा होता है। आपका आज्ञाकारी छात्र।',
            textEnglish: 'Essay + letter ending.',
          },
          {
            textHindi: 'प्रिय बस्ते, शुभरात्रि।',
            textEnglish: 'Diary sign-off.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'विज्ञापन में “प्रस्तावना” और लंबा निबंध नहीं लिखा जाता; इसकी जगह 3–4 बुलेट बिंदु, छूट ऑफर व संपर्क विवरण (98XXXXXXXX) देना अनिवार्य है।',
        explanationEnglish: 'Replace essay-like prose with snappy bullet features, a discount hook, and contact info.',
        topicTagHindi: 'विज्ञापन लेखन',
      },
      {
        id: 'vg_err_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: 'विज्ञापन में सूचना व पत्र शब्दों की त्रुटि',
        titleEnglish: 'Spot misplaced formal/diary lines inside an Ad',
        instructionHindi: 'इस विज्ञापन में से असंगत पंक्ति पहचानें।',
        instructionEnglish: 'Click the line that uses formal application/letter phrases.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: '🌿 ‘हरित-जीवन’ योग एवं ध्यान केंद्र 🌿' },
          { id: 'l2', tagHindi: 'नारा', textHindi: '“योग अपनाएँ — रोग भगाएँ, जीवन को स्वस्थ बनाएँ!”' },
          { id: 'l3', tagHindi: 'विशेषताएँ', textHindi: '• अनुभवी योगाचार्य  • शांत वातानुकूलित कक्ष  • प्रातः एवं सायं बैच उपलब्ध' },
          { id: 'l4', tagHindi: 'गलत अंत', textHindi: 'सेवा में, सविनय निवेदन है कि मुझे योग करने का अवकाश दें। भवदीय, क.ख.ग.।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'विशेष ऑफर: प्रथम सप्ताह निःशुल्क डेमो कक्षा!\nसंपर्क: 98XXXXXXXX | पता: 12, शांति पथ, अ.ब.स. नगर',
            textEnglish: 'Adds free demo offer + address & phone contact.',
          },
          {
            textHindi: 'शुभरात्रि प्रिय डायरी, कल योग करेंगे।',
            textEnglish: 'Diary line.',
          },
          {
            textHindi: 'सीख: योग से शरीर स्वस्थ रहता है।',
            textEnglish: 'Story moral.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'विज्ञापन के अंत में “सेवा में / सविनय निवेदन / भवदीय” नहीं बल्कि विशेष ऑफर और पता-संपर्क नंबर लिखा जाता है।',
        explanationEnglish: 'End ads with an engaging offer + contact details, never formal application phrases.',
        topicTagHindi: 'विज्ञापन लेखन',
      },
      {
        id: 'vg_err_3',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'गोपनीयता व वर्तनी की अशुद्धि',
        titleEnglish: 'Spot personal info leak & awkward wording',
        instructionHindi: 'परीक्षा नियमों के विरुद्ध पंक्ति पहचानें।',
        instructionEnglish: 'Click the line that breaks exam privacy rules.',
        isBoxedDraft: true,
        lines: [
          { id: 'l1', tagHindi: 'शीर्षक', textHindi: '✍️ ‘सुलेख’ जैल पेन — लिखावट में लाए निखार ✍️' },
          { id: 'l2', tagHindi: 'विशेषताएँ', textHindi: '• बिना रुके प्रवाहमयी स्याही  • आरामदायक ग्रिप  • पाँच आकर्षक रंगों में उपलब्ध' },
          { id: 'l3', tagHindi: 'छूट', textHindi: 'विशेष: ५ पेन के पैक पर १ पेन बिल्कुल मुफ़्त! मूल्य मात्र ₹50/-' },
          { id: 'l4', tagHindi: 'संपर्क', textHindi: 'मेरा असली नाम आरव शर्मा है, मेरी जन्मतिथि व असली मोबाइल 9811223344 पर कॉल करें।' },
        ],
        errorLineIndex: 3,
        correctionOptions: [
          {
            textHindi: 'सभी स्टेशनरी दुकानों पर उपलब्ध | संपर्क: 98XXXXXXXX',
            textEnglish: 'Uses masked phone digits and keeps anonymity.',
          },
          {
            textHindi: 'अपना आधार कार्ड नंबर लिखें।',
            textEnglish: 'Unsafe personal data.',
          },
          {
            textHindi: 'पेन से हम पत्र लिखते हैं, धन्यवाद।',
            textEnglish: 'Weak closing.',
          },
        ],
        correctCorrectionIndex: 0,
        explanationHindi:
          'बोर्ड परीक्षा कॉपी में कभी अपना वास्तविक नाम, जन्मतिथि या असली फ़ोन नंबर नहीं लिखते; संपर्क के लिए 98XXXXXXXX का प्रयोग करें।',
        explanationEnglish: 'Never print real personal names or phone numbers in exam ads; mask with 98XXXXXXXX.',
        topicTagHindi: 'विज्ञापन लेखन',
      },
    ],
    writerPrompts: [
      {
        id: 'vg_wp_1',
        gradeBand: 'कक्षा 5–7',
        titleHindi: 'नए रंग-बिरंगे छाते (वर्षा-रक्षक) का विज्ञापन',
        titleEnglish: 'Colorful Umbrella Advertisement',
        promptHindi: 'मानसून के लिए टिकाऊ व रंग-बिरंगे ‘मेघदूत’ छाते के लिए 40 शब्दों का आकर्षक बॉक्स विज्ञापन बनाएँ।',
        promptEnglish: 'Create a 40-word display ad for strong colorful umbrellas.',
        englishStarter: 'Monsoon Special! Meghdoot Strong Umbrellas. Catchy slogan: Stay dry in every storm! Features: Windproof ribs, UV protection, folding design. 20% discount. Contact: 98XXXXXXXX',
        hindiStarter: '✨ मानसून धमाका! ‘मेघदूत’ मजबूत छाते ✨\n“तेज़ आँधी हो या भारी बरसात, मेघदूत दे हर पल साथ!”\n• विशेष गुण: ...',
      },
      {
        id: 'vg_wp_2',
        gradeBand: 'कक्षा 8–10',
        titleHindi: '‘प्लास्टिक का प्रयोग बंद करें’ — जन-जागरूकता विज्ञापन',
        titleEnglish: 'Say No to Single-Use Plastic (Public Awareness Ad)',
        promptHindi: 'पर्यावरण संरक्षण विभाग की ओर से प्लास्टिक थैली के स्थान पर कपड़े के थैले अपनाने हेतु 45 शब्दों का जनहित विज्ञापन लिखें।',
        promptEnglish: 'Design a 45-word public awareness ad encouraging cloth bags over single-use plastic.',
        englishStarter: 'Save Earth! Say No to Plastic Bags. Slogan: Choose cloth bags today for a greener tomorrow. Features: Reusable, eco-friendly, safe for animals. Issued in public interest by ABC Nagar.',
        hindiStarter: '🌍 धरती बचाओ अभियान — प्लास्टिक को कहें ‘ना’! 🌍\n“कपड़े का थैला अपनाएँ, धरती को सुंदर बनाएँ!”\n• ...',
      },
    ],
  },
};

export const ALL_WRITING_FORMAT_IDS: WritingFormatId[] = [
  'nibandh',
  'kahani',
  'anuched',
  'patra_formal',
  'patra_informal',
  'soochna',
  'diary',
  'vigyapan',
];
