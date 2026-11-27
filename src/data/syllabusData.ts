import { BoardType, GradeLevel } from '../types';

export interface SyllabusCategory {
  title: string;
  titleHindi: string;
  items: {
    nameHindi: string;
    nameEnglish: string;
    descriptionHindi: string;
    descriptionEnglish: string;
    linkedModuleId?: string;
  }[];
}

export interface BoardSyllabusDetail {
  board: BoardType;
  grade: GradeLevel;
  boardFullName: string;
  overviewHindi: string;
  overviewEnglish: string;
  assessmentPatternHindi: string;
  assessmentPatternEnglish: string;
  weightage: { topic: string; marks: number }[];
  categories: SyllabusCategory[];
  sampleQuestions: {
    questionTextHindi: string;
    questionTextEnglish: string;
    instructionEnglish: string;
    modelAnswerHindi: string;
    explanationHindi: string;
  }[];
}

export const BOARD_SYLLABI: Record<string, BoardSyllabusDetail> = {
  // ICSE - Class 5
  'ICSE_कक्षा 5': {
    board: 'ICSE',
    grade: 'कक्षा 5',
    boardFullName: 'ICSE (CISCE) - कक्षा 5 हिंदी व्याकरण पाठ्यक्रम',
    overviewHindi:
      'कक्षा 5 का ICSE पाठ्यक्रम भाषिक नींव को मज़बूत करता है—शब्द निर्माण (उपसर्ग-प्रत्यय), विकारी शब्द (संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण, क्रिया और काल), वाक्य-विचार, विराम-चिह्न तथा शब्द-संपदा व मुहावरों के व्यावहारिक प्रयोग पर केंद्रित है।',
    overviewEnglish:
      'ICSE Class 5 builds strong grammatical foundations across word-building (Upsarg-Pratyay), parts of speech (Noun, Gender, Number, Karak, Pronoun, Adjective, Verb & Tenses), Sentence Basics, Punctuation, Vocabulary, and Idioms.',
    assessmentPatternHindi:
      '40% व्याकरण पहचान व रूपांतरण (लिंग, वचन, कारक, काल), 30% शब्द भंडार व मुहावरे, 30% अपठित गद्यांश व रचनात्मक लेखन।',
    assessmentPatternEnglish:
      '40% Grammar Identification & Conversion, 30% Vocabulary & Idioms, 30% Comprehension & Creative Writing.',
    weightage: [
      { topic: 'उपसर्ग और प्रत्यय', marks: 6 },
      { topic: 'संज्ञा, लिंग, वचन और कारक', marks: 12 },
      { topic: 'सर्वनाम, विशेषण, क्रिया और काल', marks: 12 },
      { topic: 'वाक्य-विचार व विराम-चिह्न', marks: 8 },
      { topic: 'पर्यायवाची, विलोम व एक शब्द', marks: 10 },
      { topic: 'मुहावरे एवं वाक्य प्रयोग', marks: 6 },
      { topic: 'अपठित गद्यांश व पत्र/अनुच्छेद लेखन', marks: 26 },
    ],
    categories: [
      {
        title: 'Part 1: Word Formation & Noun System (शब्द निर्माण व संज्ञा-विकार)',
        titleHindi: 'शब्द रचना एवं संज्ञा प्रणाली (1 से 5)',
        items: [
          {
            nameHindi: '1. उपसर्ग और प्रत्यय',
            nameEnglish: 'Prefixes & Suffixes',
            descriptionHindi: 'मूल शब्द के आगे उपसर्ग (अ-, सु-, प्र-, वि-) और पीछे प्रत्यय (-ता, -आई, -वाला, -इक) जोड़कर नए शब्द बनाना।',
            descriptionEnglish: 'Deriving new words cleanly by adding foundational prefixes and suffixes.',
            linkedModuleId: 'upsarg-pratyay',
          },
          {
            nameHindi: '2. संज्ञा',
            nameEnglish: 'Noun (Sangya)',
            descriptionHindi: 'व्यक्तिवाचक, जातिवाचक और भाववाचक संज्ञा की पहचान तथा सरल भाववाचक संज्ञा निर्माण।',
            descriptionEnglish: 'Identify Proper, Common, and Abstract nouns and form simple abstract nouns.',
            linkedModuleId: 'sangya',
          },
          {
            nameHindi: '3. लिंग',
            nameEnglish: 'Gender (Ling)',
            descriptionHindi: 'पुल्लिंग और स्त्रीलिंग की पहचान, प्रत्ययों द्वारा लिंग परिवर्तन व नित्य पुल्लिंग/स्त्रीलिंग शब्द।',
            descriptionEnglish: 'Masculine and feminine identification and standard conversion rules.',
            linkedModuleId: 'ling',
          },
          {
            nameHindi: '4. वचन',
            nameEnglish: 'Number (Vachan)',
            descriptionHindi: 'एकवचन से बहुवचन परिवर्तन नियम (कमरा-कमरे, नदी-नदियाँ, पुस्तक-पुस्तकें) व आदरार्थक बहुवचन।',
            descriptionEnglish: 'Singular to plural transformations and vowel-shortening spelling rules.',
            linkedModuleId: 'vachan',
          },
          {
            nameHindi: '5. कारक',
            nameEnglish: 'Case Markers (Karak)',
            descriptionHindi: 'कर्ता (ने), कर्म (को), करण (से/द्वारा), सम्प्रदान (के लिए), अपादान (से अलग), संबंध, अधिकरण व संबोधन।',
            descriptionEnglish: 'All 8 case markers with clear distinction between करण (tool) and अपादान (separation).',
            linkedModuleId: 'karak',
          },
        ],
      },
      {
        title: 'Part 2: Pronouns, Modifiers, Verbs & Sentences (सर्वनाम से विराम-चिह्न)',
        titleHindi: 'सर्वनाम, विशेषण, क्रिया-काल व वाक्य (6 से 10)',
        items: [
          {
            nameHindi: '6. सर्वनाम',
            nameEnglish: 'Pronoun (Sarvanam)',
            descriptionHindi: 'संज्ञा के स्थान पर प्रयुक्त होने वाले शब्द और पुरुषवाचक, निश्चय, अनिश्चय, प्रश्न व संबंधवाचक भेद।',
            descriptionEnglish: 'Replace repetitive nouns with accurate personal, demonstrative, and interrogative pronouns.',
            linkedModuleId: 'sarvanam',
          },
          {
            nameHindi: '7. विशेषण',
            nameEnglish: 'Adjective (Visheshan)',
            descriptionHindi: 'गुणवाचक, संख्यावाचक, परिमाणवाचक व सार्वनामिक विशेषण तथा विशेष्य की पहचान।',
            descriptionEnglish: 'Qualify nouns by quality, count, quantity, and demonstrative modifiers.',
            linkedModuleId: 'visheshan',
          },
          {
            nameHindi: '8. क्रिया और काल',
            nameEnglish: 'Verbs & Tenses (Kriya & Kaal)',
            descriptionHindi: 'सकर्मक व अकर्मक क्रिया की पहचान तथा वर्तमान, भूत व भविष्यत् काल के वाक्य प्रयोग।',
            descriptionEnglish: 'Distinguish transitive vs intransitive actions and Present, Past, Future tenses.',
            linkedModuleId: 'kriya-kaal',
          },
          {
            nameHindi: '9. वाक्य-विचार',
            nameEnglish: 'Sentence Structure (Vakya-Vichar)',
            descriptionHindi: 'वाक्य के दो अंग (उद्देश्य और विधेय) तथा अर्थानुसार विधानवाचक, निषेधवाचक, प्रश्नवाचक, आज्ञावाचक व विस्मयादिवाचक वाक्य।',
            descriptionEnglish: 'Subject-Predicate separation and sentence classification by intent.',
            linkedModuleId: 'vakya-vichar',
          },
          {
            nameHindi: '10. विराम-चिह्न',
            nameEnglish: 'Punctuation (Viram-Chinh)',
            descriptionHindi: 'पूर्ण विराम (।), अल्प विराम (,), प्रश्नवाचक (?), विस्मयादिबोधक (!), योजक (-) व उद्धरण चिह्न का प्रयोग।',
            descriptionEnglish: 'Accurate placement of Purna Viram, commas, question marks, and quotes.',
            linkedModuleId: 'viram-chinh',
          },
        ],
      },
      {
        title: 'Part 3: Vocabulary Treasure & Idioms (शब्द भंडार एवं मुहावरे)',
        titleHindi: 'शब्द भंडार एवं मुहावरे (11 से 14)',
        items: [
          {
            nameHindi: '11. पर्यायवाची शब्द',
            nameEnglish: 'Synonyms (Paryayvachi)',
            descriptionHindi: 'सूर्य, जल, कमल, बादल, पृथ्वी, मित्र, आँख, अग्नि, पक्षी आदि प्रमुख शब्दों के समानार्थी रूप।',
            descriptionEnglish: 'Core ICSE Class 5 synonyms and memory patterns.',
            linkedModuleId: 'paryayvachi',
          },
          {
            nameHindi: '12. विलोम शब्द',
            nameEnglish: 'Antonyms (Vilom)',
            descriptionHindi: 'उदय-अस्त, सजीव-निर्जीव, अनुकूल-प्रतिकूल, न्याय-अन्याय आदि विपरीतार्थक शब्द।',
            descriptionEnglish: 'Standard opposite word pairs matched to context.',
            linkedModuleId: 'vilom',
          },
          {
            nameHindi: '13. अनेक शब्दों के लिए एक शब्द',
            nameEnglish: 'One-Word Substitution',
            descriptionHindi: 'जो प्रतिदिन होता हो (दैनिक), साथ पढ़ने वाला (सहपाठी), जो कभी न मरे (अमर) आदि वाक्यांश।',
            descriptionEnglish: 'Compact descriptive phrases into precise single words.',
            linkedModuleId: 'anek-shabd',
          },
          {
            nameHindi: '14. मुहावरे',
            nameEnglish: 'Idioms (Muhavare)',
            descriptionHindi: 'नौ दो ग्यारह होना, आँखों का तारा, ईद का चाँद होना, दाँत खट्टे करना जैसे प्रचलित मुहावरों का वाक्य प्रयोग।',
            descriptionEnglish: 'Understand figurative meaning and use common idioms naturally in sentences.',
            linkedModuleId: 'muhavare',
          },
        ],
      },
    ],
    sampleQuestions: [
      {
        questionTextHindi: "'पेड़ से पके आम नीचे गिरे।' वाक्य में 'से' किस कारक का चिह्न है और वाक्य किस काल में है?",
        questionTextEnglish: "Identify the Karak of 'से' and the tense of 'Ripe mangoes fell from the tree'.",
        instructionEnglish: 'Class 5 integrated grammar check (Karak + Kaal).',
        modelAnswerHindi: 'अपादान कारक (अलगाव) एवं भूतकाल (Past Tense)',
        explanationHindi: 'आम पेड़ से अलग हो रहे हैं (अपादान कारक) और गिरने की क्रिया बीत चुकी है (भूतकाल)।',
      },
      {
        questionTextHindi: "'ईमानदार' शब्द से भाववाचक संज्ञा और 'मिठाई' शब्द का बहुवचन लिखिए।",
        questionTextEnglish: "Form an abstract noun from 'ईमानदार' and plural of 'मिठाई'.",
        instructionEnglish: 'Word derivation and number conversion.',
        modelAnswerHindi: 'ईमानदारी (भाववाचक संज्ञा), मिठाइयाँ (बहुवचन)',
        explanationHindi: "ईमानदार + ई = ईमानदारी; 'मिठाई' की अंतिम दीर्घ 'ई' बहुवचन में ह्रस्व 'इ' + याँ बनती है।",
      },
    ],
  },

  // ICSE - Class 6
  'ICSE_कक्षा 6': {
    board: 'ICSE',
    grade: 'कक्षा 6',
    boardFullName: 'ICSE (CISCE) - कक्षा 6 हिंदी व्याकरण पाठ्यक्रम',
    overviewHindi:
      'कक्षा 6 का ICSE पाठ्यक्रम शब्द-विचार (तत्सम-तद्भव, रूढ़-यौगिक-योगरूढ़), सभी विकारी शब्द, क्रिया व काल के उपभेद, अविकारी शब्द (अव्यय के चारों भेद), वाक्य-विचार व अशुद्धि शोधन, अनेकार्थी व श्रुतिसमभिन्नार्थक शब्दों तथा मुहावरे और लोकोक्तियों पर आधारित है।',
    overviewEnglish:
      'ICSE Class 6 spans Shabd-Vichar, Affixes, all inflected word classes, Verb & Tense sub-types, Indeclinables (Avikari Shabd), Syntax & Error Correction, Punctuation, Polysemous & Homophone vocabulary, and Idioms & Proverbs.',
    assessmentPatternHindi:
      '35% व्याकरण विश्लेषण (शब्द-विचार, क्रिया, काल, अविकारी), 30% वाक्य-अशुद्धि शोधन व विराम-चिह्न, 35% समृद्ध शब्द भंडार, मुहावरे-लोकोक्तियाँ व गद्यांश।',
    assessmentPatternEnglish:
      '35% Grammar Analysis (Shabd-Vichar, Kriya, Kaal, Avikari), 30% Syntax Correction & Punctuation, 35% Vocabulary, Proverbs & Comprehension.',
    weightage: [
      { topic: 'शब्द-विचार, उपसर्ग और प्रत्यय', marks: 8 },
      { topic: 'संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण', marks: 14 },
      { topic: 'क्रिया, काल एवं अविकारी शब्द (अव्यय)', marks: 14 },
      { topic: 'वाक्य-विचार, अशुद्धि शोधन व विराम-चिह्न', marks: 10 },
      { topic: 'पर्यायवाची, विलोम, अनेकार्थी, श्रुतिसम व एक शब्द', marks: 12 },
      { topic: 'मुहावरे और लोकोक्तियाँ', marks: 6 },
      { topic: 'अपठित गद्यांश एवं लेखन कौशल', marks: 16 },
    ],
    categories: [
      {
        title: 'Part 1: Word Science & Noun/Pronoun/Adjective Systems (1 से 8)',
        titleHindi: 'शब्द-विचार, प्रत्यय व विकारी शब्द (1 से 8)',
        items: [
          {
            nameHindi: '1. शब्द-विचार',
            nameEnglish: 'Shabd-Vichar (Word Classification)',
            descriptionHindi: 'उत्पत्ति (तत्सम, तद्भव, देशज, विदेशी) तथा रचना (रूढ़, यौगिक, योगरूढ़) के आधार पर शब्दों के भेद।',
            descriptionEnglish: 'Classify words by origin (Tatsam/Tadbhav/Deshaj/Foreign) and composition.',
            linkedModuleId: 'shabd-vichar',
          },
          {
            nameHindi: '2. उपसर्ग और प्रत्यय',
            nameEnglish: 'Prefixes & Suffixes',
            descriptionHindi: 'तत्सम, तद्भव व आगत उपसर्ग तथा कृत व तद्धित प्रत्ययों से शब्द रचना व मूल शब्द विच्छेद।',
            descriptionEnglish: 'Analyze prefixes, suffixes, and extract root words accurately.',
            linkedModuleId: 'upsarg-pratyay',
          },
          {
            nameHindi: '3. संज्ञा',
            nameEnglish: 'Noun (Sangya)',
            descriptionHindi: 'संज्ञा के पाँच भेद (व्यक्ति, जाति, भाव, समूह, द्रव्यवाचक) व भाववाचक संज्ञा निर्माण।',
            descriptionEnglish: 'All 5 noun classes plus abstract noun derivations.',
            linkedModuleId: 'sangya',
          },
          {
            nameHindi: '4. लिंग',
            nameEnglish: 'Gender (Ling)',
            descriptionHindi: 'पुल्लिंग-स्त्रीलिंग परिवर्तन नियम, अपवाद तथा नित्य लिंग शब्दों के वाक्य प्रयोग।',
            descriptionEnglish: 'Gender transformations, exceptions, and invariable-gender nouns.',
            linkedModuleId: 'ling',
          },
          {
            nameHindi: '5. वचन',
            nameEnglish: 'Number (Vachan)',
            descriptionHindi: 'एकवचन-बहुवचन नियम, सविभक्ति बहुवचन तथा नित्य एकवचन / नित्य बहुवचन शब्द।',
            descriptionEnglish: 'Singular/plural rules, case-inflected plurals, and invariant nouns.',
            linkedModuleId: 'vachan',
          },
          {
            nameHindi: '6. कारक',
            nameEnglish: 'Case Markers (Karak)',
            descriptionHindi: 'आठों कारकों के परसर्ग, करण vs अपादान तथा कर्म vs सम्प्रदान कारक में स्पष्ट अंतर।',
            descriptionEnglish: 'Master all 8 cases including Karm vs Sampradan and Karan vs Apadan.',
            linkedModuleId: 'karak',
          },
          {
            nameHindi: '7. सर्वनाम',
            nameEnglish: 'Pronoun (Sarvanam)',
            descriptionHindi: 'सर्वनाम के 6 भेद (पुरुषवाचक के 3 उपभेद, निश्चय, अनिश्चय, संबंध, प्रश्न, निजवाचक) का विश्लेषण।',
            descriptionEnglish: '6 pronoun categories including First/Second/Third person and Reflexive.',
            linkedModuleId: 'sarvanam',
          },
          {
            nameHindi: '8. विशेषण',
            nameEnglish: 'Adjective (Visheshan)',
            descriptionHindi: 'गुण, संख्या, परिमाण, सार्वनामिक विशेषण, प्रविशेषण तथा विशेषण की तुलनात्मक अवस्थाएँ।',
            descriptionEnglish: 'Adjective types, intensifiers (Pravisheshan), and degrees of comparison.',
            linkedModuleId: 'visheshan',
          },
        ],
      },
      {
        title: 'Part 2: Verbs, Tenses, Indeclinables & Syntax Purification (9 से 13)',
        titleHindi: 'क्रिया, काल, अविकारी, वाक्य-अशुद्धि शोधन व विराम-चिह्न (9 से 13)',
        items: [
          {
            nameHindi: '9. क्रिया',
            nameEnglish: 'Verbs (Kriya)',
            descriptionHindi: 'सकर्मक-अकर्मक, द्विकर्मक तथा संरचनानुसार संयुक्त, पूर्वकालिक, प्रेरणार्थक व नामधातु क्रिया।',
            descriptionEnglish: 'Transitive, Intransitive, Ditransitive, Causative, and Absolutive verbs.',
            linkedModuleId: 'kriya',
          },
          {
            nameHindi: '10. काल',
            nameEnglish: 'Tenses (Kaal)',
            descriptionHindi: 'वर्तमान, भूत व भविष्यत् काल तथा उनके प्रमुख उपभेद (सामान्य, अपूर्ण, पूर्ण, संदिग्ध व हेतुहेतुमद्)।',
            descriptionEnglish: 'Present, Past, and Future tenses along with ICSE sub-types.',
            linkedModuleId: 'kaal',
          },
          {
            nameHindi: '11. अविकारी शब्द (क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक)',
            nameEnglish: 'Indeclinables (Avikari Shabd)',
            descriptionHindi: 'अव्यय के चारों प्रमुख भेद व क्रियाविशेषण बनाम संबंधबोधक प्रयोग का सूक्ष्म अंतर।',
            descriptionEnglish: 'All 4 indeclinable classes: Adverb, Postposition, Conjunction, Interjection.',
            linkedModuleId: 'avikari',
          },
          {
            nameHindi: '12. वाक्य-विचार और अशुद्धि शोधन',
            nameEnglish: 'Syntax & Error Correction',
            descriptionHindi: 'सरल, संयुक्त व मिश्र वाक्य की पहचान, अर्थ के आधार पर 8 भेद तथा लिंग-वचन-पुनरुक्ति अशुद्धियों का सुधार।',
            descriptionEnglish: 'Sentence structure types plus rectification of concord and redundancy errors.',
            linkedModuleId: 'vakya-ashuddhi',
          },
          {
            nameHindi: '13. विराम-चिह्न',
            nameEnglish: 'Punctuation (Viram-Chinh)',
            descriptionHindi: 'पूर्ण, अर्ध व अल्प विराम, प्रश्न, विस्मय, योजक, उद्धरण, कोष्ठक, विवरण व लाघव चिह्न।',
            descriptionEnglish: 'Full range of Hindi punctuation symbols in compositions.',
            linkedModuleId: 'viram-chinh',
          },
        ],
      },
      {
        title: 'Part 3: Vocabulary Distinctions, Idioms & Proverbs (14 से 19)',
        titleHindi: 'शब्द भंडार, अनेकार्थी, श्रुतिसम व मुहावरे-लोकोक्तियाँ (14 से 19)',
        items: [
          {
            nameHindi: '14. पर्यायवाची शब्द',
            nameEnglish: 'Synonyms (Paryayvachi)',
            descriptionHindi: 'प्रमुख प्राकृतिक, मानवीय व साहित्यिक शब्दों के समानार्थी रूप।',
            descriptionEnglish: 'Expanded synonym mastery for Class 6.',
            linkedModuleId: 'paryayvachi',
          },
          {
            nameHindi: '15. विलोम शब्द',
            nameEnglish: 'Antonyms (Vilom)',
            descriptionHindi: 'उपसर्ग परिवर्तन और तत्सम स्तर पर आधारित सटीक विपरीतार्थक शब्द।',
            descriptionEnglish: 'Register-matched and prefix-derived antonyms.',
            linkedModuleId: 'vilom',
          },
          {
            nameHindi: '16. अनेकार्थी शब्द',
            nameEnglish: 'Polysemous Words (Anekarthi)',
            descriptionHindi: 'कर, अम्बर, कनक, पत्र, फल, उत्तर, लाल, तीर, सोना, वर जैसे शब्दों के प्रसंगानुसार भिन्न अर्थ।',
            descriptionEnglish: 'Words carrying multiple distinct meanings across sentences.',
            linkedModuleId: 'anekarthi',
          },
          {
            nameHindi: '17. श्रुतिसमभिन्नार्थक शब्द',
            nameEnglish: 'Homophones (Shrutisam-Bhinnarthak)',
            descriptionHindi: 'अनल-अनिल, दिन-दीन, कुल-कूल, गृह-ग्रह, ओर-और, नीर-नीड़, अवधि-अवधी जैसे सूक्ष्म युग्म।',
            descriptionEnglish: 'Similar-sounding word pairs with contrasting spellings and meanings.',
            linkedModuleId: 'shrutisam',
          },
          {
            nameHindi: '18. अनेक शब्दों के लिए एक शब्द',
            nameEnglish: 'One-Word Substitution',
            descriptionHindi: 'कृतज्ञ-कृतघ्न, सर्वज्ञ-अल्पज्ञ, मितभाषी, अद्वितीय आदि वाक्यांशों के लिए एक सटीक शब्द।',
            descriptionEnglish: 'Precise single-word expressions replacing descriptive clauses.',
            linkedModuleId: 'anek-shabd',
          },
          {
            nameHindi: '19. मुहावरे और लोकोक्तियाँ',
            nameEnglish: 'Idioms & Proverbs',
            descriptionHindi: 'मुहावरों और लोकोक्तियों (अधजल गगरी छलकत जाए, नाच न जाने आँगन टेढ़ा) का अंतर व प्रयोग।',
            descriptionEnglish: 'Distinguish idioms from proverbs and apply both naturally.',
            linkedModuleId: 'muhavare',
          },
        ],
      },
    ],
    sampleQuestions: [
      {
        questionTextHindi: "अशुद्ध वाक्य को शुद्ध कीजिए: 'मेरे पास केवल मात्र सौ रुपये हैं।' तथा 'घर के बाहर' कौन-सा अविकारी शब्द है?",
        questionTextEnglish: "Correct 'मेरे पास केवल मात्र सौ रुपये हैं' and identify 'के बाहर'.",
        instructionEnglish: 'Class 6 Error Correction + Avikari identification.',
        modelAnswerHindi: 'शुद्ध वाक्य: मेरे पास केवल सौ रुपये हैं। | के बाहर: संबंधबोधक अव्यय',
        explanationHindi: "'केवल' व 'मात्र' एक साथ आना पुनरुक्ति दोष है। 'घर के बाहर' संज्ञा के साथ संबंध जोड़ने से संबंधबोधक अव्यय है।",
      },
      {
        questionTextHindi: "'अनल' और 'अनिल' श्रुतिसमभिन्नार्थक शब्दों का अंतर वाक्य द्वारा स्पष्ट कीजिए।",
        questionTextEnglish: "Differentiate 'अनल' and 'अनिल' in Hindi.",
        instructionEnglish: 'Class 6 Shrutisam-Bhinnarthak spelling & meaning precision.',
        modelAnswerHindi: 'अनल = आग (जंगल में अनल फैल गई) | अनिल = हवा (प्रातःकाल शीतल अनिल बहती है)',
        explanationHindi: "ह्रस्व 'इ' की मात्रा न होने पर 'अनल' अग्नि का और 'नि' होने पर 'अनिल' वायु का अर्थ देता है।",
      },
    ],
  },

  // ICSE - Class 7 (Exact 21 Topics)
  'ICSE_कक्षा 7': {
    board: 'ICSE',
    grade: 'कक्षा 7',
    boardFullName: 'ICSE (CISCE) - कक्षा 7 हिंदी व्याकरण पाठ्यक्रम',
    overviewHindi:
      'कक्षा 7 का ICSE पाठ्यक्रम उपसर्ग-प्रत्यय, समास, सभी विकारी शब्द (संज्ञा से काल तक), वाच्य, निपात सहित अविकारी शब्द, पद-परिचय, वाक्य-विचार व अशुद्धि शोधन, विराम-चिह्न तथा समृद्ध शब्द भंडार व मुहावरे-लोकोक्तियों पर आधारित है।',
    overviewEnglish:
      'ICSE Class 7 covers Prefixes & Suffixes, Samas, all inflected categories, Voice (Vachya), Indeclinables including Nipat, Pad-Parichay, Syntax & Error Correction, Punctuation, and full Vocabulary + Idioms & Proverbs.',
    assessmentPatternHindi:
      '35% व्याकरण विश्लेषण (समास, वाच्य, अविकारी व निपात, पद-परिचय), 30% वाक्य-अशुद्धि शोधन व विराम-चिह्न, 35% शब्द-भंडार, मुहावरे-लोकोक्तियाँ व गद्यांश।',
    assessmentPatternEnglish:
      '35% Grammar Analysis (Samas, Vachya, Avikari, Pad-Parichay), 30% Error Correction & Punctuation, 35% Vocabulary & Comprehension.',
    weightage: [
      { topic: 'उपसर्ग-प्रत्यय और समास', marks: 10 },
      { topic: 'संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण', marks: 14 },
      { topic: 'क्रिया, काल, वाच्य, अविकारी (निपात सहित) व पद-परिचय', marks: 16 },
      { topic: 'वाक्य-विचार, अशुद्धि शोधन व विराम-चिह्न', marks: 10 },
      { topic: 'पर्यायवाची, विलोम, अनेकार्थी, श्रुतिसम, एक शब्द व मुहावरे-लोकोक्तियाँ', marks: 14 },
      { topic: 'अपठित गद्यांश एवं लेखन कौशल', marks: 16 },
    ],
    categories: [
      {
        title: 'Part 1: Word Formation, Compounds & Inflected Words (1 से 8)',
        titleHindi: 'उपसर्ग-प्रत्यय, समास एवं विकारी शब्द (1 से 8)',
        items: [
          { nameHindi: '1. उपसर्ग और प्रत्यय', nameEnglish: 'Prefixes & Suffixes', descriptionHindi: 'तत्सम, तद्भव व आगत उपसर्ग तथा कृत व तद्धित प्रत्ययों से शब्द रचना और विच्छेद।', descriptionEnglish: 'Derive and split words using prefixes and suffixes.', linkedModuleId: 'upsarg-pratyay' },
          { nameHindi: '2. समास', nameEnglish: 'Compounds (Samas)', descriptionHindi: 'अव्ययीभाव, तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व व बहुव्रीहि समास का विग्रह और भेद।', descriptionEnglish: 'Compound formation, dissolution, and all 6 types.', linkedModuleId: 'samas' },
          { nameHindi: '3. संज्ञा', nameEnglish: 'Noun (Sangya)', descriptionHindi: 'व्यक्तिवाचक, जातिवाचक, भाववाचक, समूह व द्रव्यवाचक संज्ञा एवं भाववाचक निर्माण।', descriptionEnglish: 'All noun classifications and abstract derivations.', linkedModuleId: 'sangya' },
          { nameHindi: '4. लिंग', nameEnglish: 'Gender (Ling)', descriptionHindi: 'पुल्लिंग-स्त्रीलिंग परिवर्तन नियम, अपवाद व नित्य लिंग प्रयोग।', descriptionEnglish: 'Gender transformations and invariant gender rules.', linkedModuleId: 'ling' },
          { nameHindi: '5. वचन', nameEnglish: 'Number (Vachan)', descriptionHindi: 'एकवचन-बहुवचन परिवर्तन, सविभक्ति रूप व नित्य एकवचन/बहुवचन शब्द।', descriptionEnglish: 'Singular-plural rules and invariable number nouns.', linkedModuleId: 'vachan' },
          { nameHindi: '6. कारक', nameEnglish: 'Case Markers (Karak)', descriptionHindi: 'आठों कारकों के परसर्ग, करण बनाम अपादान तथा कर्म बनाम सम्प्रदान अंतर।', descriptionEnglish: 'All 8 case markers with subtle ICSE distinctions.', linkedModuleId: 'karak' },
          { nameHindi: '7. सर्वनाम', nameEnglish: 'Pronoun (Sarvanam)', descriptionHindi: 'सर्वनाम के 6 भेद और मध्यम/अन्य/निजवाचक सर्वनामों का सटीक प्रयोग।', descriptionEnglish: '6 pronoun categories and contextual usage.', linkedModuleId: 'sarvanam' },
          { nameHindi: '8. विशेषण', nameEnglish: 'Adjective (Visheshan)', descriptionHindi: 'गुण, संख्या, परिमाण व सार्वनामिक विशेषण, प्रविशेषण व तुलनात्मक अवस्थाएँ।', descriptionEnglish: 'Adjectives, intensifiers, and degrees of comparison.', linkedModuleId: 'visheshan' },
        ],
      },
      {
        title: 'Part 2: Verbs, Voice, Indeclinables, Pad-Parichay & Syntax (9 से 15)',
        titleHindi: 'क्रिया, काल, वाच्य, अविकारी, पद-परिचय व वाक्य (9 से 15)',
        items: [
          { nameHindi: '9. क्रिया', nameEnglish: 'Verbs (Kriya)', descriptionHindi: 'सकर्मक-अकर्मक, द्विकर्मक तथा संयुक्त, पूर्वकालिक, प्रेरणार्थक व नामधातु क्रिया।', descriptionEnglish: 'Verb classification by object and structure.', linkedModuleId: 'kriya' },
          { nameHindi: '10. काल', nameEnglish: 'Tenses (Kaal)', descriptionHindi: 'वर्तमान, भूत व भविष्यत् काल तथा उनके उपभेदों की पहचान व रूपांतरण।', descriptionEnglish: 'Tenses and ICSE sub-type transformations.', linkedModuleId: 'kaal' },
          { nameHindi: '11. वाच्य', nameEnglish: 'Voice (Vachya)', descriptionHindi: 'कर्तृवाच्य, कर्मवाच्य और भाववाच्य की पहचान व रूपांतरण।', descriptionEnglish: 'Active, Passive, and Impersonal Voice.', linkedModuleId: 'vachya' },
          { nameHindi: '12. अविकारी शब्द (क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक, निपात)', nameEnglish: 'Indeclinables & Nipat', descriptionHindi: 'अव्यय के चारों मुख्य भेदों के साथ बलदायक निपात (ही, भी, तो, तक, मात्र) का प्रयोग।', descriptionEnglish: 'All 4 indeclinables plus emphatic Nipat particles.', linkedModuleId: 'avikari' },
          { nameHindi: '13. पद-परिचय', nameEnglish: 'Pad-Parichay (Syntactic Parsing)', descriptionHindi: 'वाक्य में प्रयुक्त संज्ञा, सर्वनाम, विशेषण, क्रिया व अव्यय पदों का पूर्ण व्याकरणिक परिचय।', descriptionEnglish: 'Complete grammatical breakdown of words in sentences.', linkedModuleId: 'pad-parichay' },
          { nameHindi: '14. वाक्य-विचार और अशुद्धि शोधन', nameEnglish: 'Syntax & Error Correction', descriptionHindi: 'रचना/अर्थानुसार वाक्य भेद और लिंग, वचन, कारक, पदक्रम व पुनरुक्ति अशुद्धियों का सुधार।', descriptionEnglish: 'Sentence structure analysis and error rectification.', linkedModuleId: 'vakya-ashuddhi' },
          { nameHindi: '15. विराम-चिह्न', nameEnglish: 'Punctuation (Viram-Chinh)', descriptionHindi: 'पूर्ण, अर्ध व अल्प विराम, प्रश्न, विस्मय, योजक, उद्धरण, कोष्ठक व लाघव चिह्न।', descriptionEnglish: 'Complete Hindi punctuation usage.', linkedModuleId: 'viram-chinh' },
        ],
      },
      {
        title: 'Part 3: Vocabulary, Idioms & Proverbs (16 से 21)',
        titleHindi: 'शब्द भंडार एवं मुहावरे-लोकोक्तियाँ (16 से 21)',
        items: [
          { nameHindi: '16. पर्यायवाची शब्द', nameEnglish: 'Synonyms', descriptionHindi: 'प्रमुख साहित्यिक व व्यावहारिक शब्दों के सटीक समानार्थी रूप।', descriptionEnglish: 'Standard synonyms for Class 7.', linkedModuleId: 'paryayvachi' },
          { nameHindi: '17. विलोम शब्द', nameEnglish: 'Antonyms', descriptionHindi: 'तत्सम व उपसर्ग आधारित सटीक विपरीतार्थक शब्द।', descriptionEnglish: 'Register-matched antonyms.', linkedModuleId: 'vilom' },
          { nameHindi: '18. अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', descriptionHindi: 'कर, अंबर, कनक, पत्र, हल, वर आदि शब्दों के प्रसंगानुसार भिन्न अर्थ।', descriptionEnglish: 'Words with multiple contextual meanings.', linkedModuleId: 'anekarthi' },
          { nameHindi: '19. श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', descriptionHindi: 'अनल-अनिल, कुल-कूल, अंश-अंस, अवधि-अवधी जैसे सूक्ष्म युग्मों का अंतर।', descriptionEnglish: 'Similar-sounding pairs with distinct meanings.', linkedModuleId: 'shrutisam' },
          { nameHindi: '20. अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', descriptionHindi: 'विस्तृत वाक्यांशों के लिए सटीक एक शब्द।', descriptionEnglish: 'Single-word substitutions.', linkedModuleId: 'anek-shabd' },
          { nameHindi: '21. मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', descriptionHindi: 'प्रचलित मुहावरों और लोकोक्तियों का अर्थ व सार्थक वाक्य प्रयोग।', descriptionEnglish: 'Idioms and proverbs in context.', linkedModuleId: 'muhavare' },
        ],
      },
    ],
    sampleQuestions: [
      {
        questionTextHindi: "'आगरा यमुना के किनारे है।' वाक्य में रेखांकित पद 'आगरा' का पद-परिचय और 'अवश्य ही' में 'ही' का भेद बताइए।",
        questionTextEnglish: "Parse 'आगरा' (Pad-Parichay) and identify 'ही' in 'अवश्य ही'.",
        instructionEnglish: 'Class 7 Pad-Parichay & Nipat check.',
        modelAnswerHindi: 'आगरा: व्यक्तिवाचक संज्ञा, पुल्लिंग, एकवचन, कर्ता कारक | ही: निपात (अवधारक अव्यय)',
        explanationHindi: "आगरा विशेष शहर का नाम है तथा 'ही' शब्द पर विशेष बल देने से निपात है।",
      },
      {
        questionTextHindi: "'नीलकमल' का समास-विग्रह तथा 'रोगी से चला नहीं जाता।' का वाच्य बताइए।",
        questionTextEnglish: "Dissolve 'नीलकमल' (Samas) and identify the voice of 'रोगी से चला नहीं जाता।'.",
        instructionEnglish: 'Class 7 Samas & Vachya application.',
        modelAnswerHindi: 'नीला है जो कमल (कर्मधारय समास) | भाववाच्य (असमर्थता सूचक)',
        explanationHindi: 'विशेषण-विशेष्य संबंध से कर्मधारय समास तथा अकर्मक क्रिया में भाव की प्रधानता से भाववाच्य है।',
      },
    ],
  },

  // ICSE - Class 8 (Exact 23 Topics)
  'ICSE_कक्षा 8': {
    board: 'ICSE',
    grade: 'कक्षा 8',
    boardFullName: 'ICSE (CISCE) - कक्षा 8 हिंदी व्याकरण पाठ्यक्रम',
    overviewHindi:
      'कक्षा 8 का ICSE पाठ्यक्रम शब्द-विचार, उपसर्ग-प्रत्यय, समास, सभी विकारी शब्द, वाच्य, निपात सहित अविकारी शब्द, पद-परिचय, वाक्य-विचार (अर्थ और रचना के आधार पर), विराम-चिह्न, शब्द भंडार, मुहावरे-लोकोक्तियाँ तथा वाक्य और उसके भेदों के संपूर्ण अभ्यास पर केंद्रित है।',
    overviewEnglish:
      'ICSE Class 8 spans Shabd-Vichar, Prefixes-Suffixes, Samas, all Noun/Pronoun/Adjective/Verb/Tense/Voice forms, Indeclinables with Nipat, Pad-Parichay, Sentence Structure (meaning & form), Punctuation, complete Vocabulary, Idioms & Proverbs, and Sentence Types.',
    assessmentPatternHindi:
      '35% वाक्य और उसके भेद एवं वाक्य-विचार (अर्थ/रचना), 35% व्याकरणिक विश्लेषण (शब्द-विचार, समास, वाच्य, पद-परिचय, अविकारी व निपात), 30% शब्द भंडार, मुहावरे-लोकोक्तियाँ व गद्यांश।',
    assessmentPatternEnglish:
      '35% Sentence Structure & Types, 35% Applied Grammar (Shabd-Vichar, Samas, Vachya, Pad-Parichay, Avikari), 30% Vocabulary & Comprehension.',
    weightage: [
      { topic: 'शब्द-विचार, उपसर्ग-प्रत्यय और समास', marks: 10 },
      { topic: 'संज्ञा, लिंग, वचन, कारक, सर्वनाम, विशेषण', marks: 14 },
      { topic: 'क्रिया, काल, वाच्य, अविकारी (निपात) व पद-परिचय', marks: 16 },
      { topic: 'वाक्य-विचार (अर्थ/रचना), वाक्य और उसके भेद व विराम-चिह्न', marks: 12 },
      { topic: 'पर्यायवाची, विलोम, अनेकार्थी, श्रुतिसम, एक शब्द व मुहावरे-लोकोक्तियाँ', marks: 14 },
      { topic: 'अपठित गद्यांश एवं रचनात्मक लेखन', marks: 14 },
    ],
    categories: [
      {
        title: 'Part 1: Word Origin, Affixes, Compounds & Inflected Classes (1 से 8)',
        titleHindi: 'शब्द-विचार, उपसर्ग-प्रत्यय, समास व विकारी शब्द (1 से 8)',
        items: [
          { nameHindi: '1. शब्द-विचार', nameEnglish: 'Word Classification (Shabd-Vichar)', descriptionHindi: 'उत्पत्ति (तत्सम, तद्भव, देशज, विदेशी), रचना (रूढ़, यौगिक, योगरूढ़), प्रयोग व अर्थ के आधार पर शब्द भेद।', descriptionEnglish: 'Word classification by origin, formation, usage, and meaning.', linkedModuleId: 'shabd-vichar' },
          { nameHindi: '2. उपसर्ग और प्रत्यय', nameEnglish: 'Prefixes & Suffixes', descriptionHindi: 'दोहरे उपसर्ग-प्रत्यय, तत्सम-तद्भव व आगत उपसर्ग तथा कृत-तद्धित प्रत्यय।', descriptionEnglish: 'Complex affixes and root word separation.', linkedModuleId: 'upsarg-pratyay' },
          { nameHindi: '3. समास', nameEnglish: 'Compounds (Samas)', descriptionHindi: 'सभी 6 समासों का सटीक विग्रह, पहचान व कर्मधारय बनाम बहुव्रीहि समास में अंतर।', descriptionEnglish: 'All 6 compounds with Karmadharaya vs Bahuvrihi distinction.', linkedModuleId: 'samas' },
          { nameHindi: '4. संज्ञा', nameEnglish: 'Noun (Sangya)', descriptionHindi: 'संज्ञा के पाँचों भेद और जातिवाचक, विशेषण व क्रिया से भाववाचक संज्ञा निर्माण।', descriptionEnglish: '5 noun types and advanced abstract noun formation.', linkedModuleId: 'sangya' },
          { nameHindi: '5. लिंग', nameEnglish: 'Gender (Ling)', descriptionHindi: 'विशिष्ट लिंग परिवर्तन नियम व नित्य पुल्लिंग/स्त्रीलिंग शब्दों का प्रयोग।', descriptionEnglish: 'Advanced gender conversion rules and exceptions.', linkedModuleId: 'ling' },
          { nameHindi: '6. वचन', nameEnglish: 'Number (Vachan)', descriptionHindi: 'सविभक्ति बहुवचन, आदरार्थक बहुवचन व नित्य एकवचन/बहुवचन प्रयोग।', descriptionEnglish: 'Inflected plurals and invariant nouns.', linkedModuleId: 'vachan' },
          { nameHindi: '7. कारक', nameEnglish: 'Case Markers (Karak)', descriptionHindi: 'आठों कारकों का गहन विश्लेषण एवं करण/अपादान तथा कर्म/सम्प्रदान का अंतर।', descriptionEnglish: 'Complete case system analysis.', linkedModuleId: 'karak' },
          { nameHindi: '8. सर्वनाम', nameEnglish: 'Pronoun (Sarvanam)', descriptionHindi: 'छहों भेदों का वाक्यों में सूक्ष्म प्रयोग और निजवाचक बनाम पुरुषवाचक अंतर।', descriptionEnglish: 'All 6 pronoun types and reflexive distinction.', linkedModuleId: 'sarvanam' },
        ],
      },
      {
        title: 'Part 2: Modifiers, Verbs, Voice, Indeclinables, Pad-Parichay & Syntax (9 से 16)',
        titleHindi: 'विशेषण, क्रिया, काल, वाच्य, अविकारी, पद-परिचय व वाक्य (9 से 16)',
        items: [
          { nameHindi: '9. विशेषण', nameEnglish: 'Adjective (Visheshan)', descriptionHindi: 'प्रविशेषण, सार्वनामिक बनाम सर्वनाम भेद, अवस्थाएँ व विशेषण रचना।', descriptionEnglish: 'Adjectives, degrees, and pronominal modifiers.', linkedModuleId: 'visheshan' },
          { nameHindi: '10. क्रिया', nameEnglish: 'Verbs (Kriya)', descriptionHindi: 'कर्म व रचना के आधार पर क्रिया के समस्त भेद (प्रेरणार्थक, पूर्वकालिक, नामधातु)।', descriptionEnglish: 'Complete verb taxonomy.', linkedModuleId: 'kriya' },
          { nameHindi: '11. काल', nameEnglish: 'Tenses (Kaal)', descriptionHindi: 'तीनों कालों के सभी उपभेद (हेतुहेतुमद् भूत/भविष्य, संदिग्ध, तात्कालिक आदि)।', descriptionEnglish: 'All tense sub-types and conversions.', linkedModuleId: 'kaal' },
          { nameHindi: '12. वाच्य', nameEnglish: 'Voice (Vachya)', descriptionHindi: 'कर्तृवाच्य, कर्मवाच्य व भाववाच्य पहचान और वाच्य रूपांतरण।', descriptionEnglish: 'Voice identification and transformation.', linkedModuleId: 'vachya' },
          { nameHindi: '13. अविकारी शब्द (क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक, निपात)', nameEnglish: 'Indeclinables & Nipat', descriptionHindi: 'अविकारी के चारों भेदों एवं निपात का वाक्य में व्याकरणिक विश्लेषण।', descriptionEnglish: 'All 4 indeclinable classes plus Nipat.', linkedModuleId: 'avikari' },
          { nameHindi: '14. पद-परिचय', nameEnglish: 'Pad-Parichay', descriptionHindi: 'संज्ञा, सर्वनाम, विशेषण, क्रिया और अविकारी पदों का सटीक पद-परिचय।', descriptionEnglish: 'Full syntactic parsing of sentence words.', linkedModuleId: 'pad-parichay' },
          { nameHindi: '15. वाक्य-विचार (अर्थ और रचना के आधार पर)', nameEnglish: 'Sentence Structure (Meaning & Form)', descriptionHindi: 'अर्थ के आधार पर 8 भेद व रचना के आधार पर सरल, संयुक्त, मिश्र वाक्य रूपांतरण।', descriptionEnglish: '8 semantic types and 3 structural forms.', linkedModuleId: 'vakya-vichar' },
          { nameHindi: '16. विराम-चिह्न', nameEnglish: 'Punctuation', descriptionHindi: 'सभी मानक विराम-चिह्नों का सटीक लेखन प्रयोग।', descriptionEnglish: 'Complete punctuation precision.', linkedModuleId: 'viram-chinh' },
        ],
      },
      {
        title: 'Part 3: Vocabulary, Idioms & Sentence Classification (17 से 23)',
        titleHindi: 'शब्द भंडार, मुहावरे-लोकोक्तियाँ व वाक्य और उसके भेद (17 से 23)',
        items: [
          { nameHindi: '17. पर्यायवाची शब्द', nameEnglish: 'Synonyms', descriptionHindi: 'उच्च स्तरीय समानार्थी शब्दों का संग्रह व प्रयोग।', descriptionEnglish: 'Upper-middle synonym bank.', linkedModuleId: 'paryayvachi' },
          { nameHindi: '18. विलोम शब्द', nameEnglish: 'Antonyms', descriptionHindi: 'तत्सम-तद्भव स्तर के अनुरूप विपरीतार्थक शब्द।', descriptionEnglish: 'Context-matched antonyms.', linkedModuleId: 'vilom' },
          { nameHindi: '19. अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', descriptionHindi: 'प्रसंग के अनुसार एक शब्द के अनेक अर्थों की पहचान।', descriptionEnglish: 'Contextual multi-meaning words.', linkedModuleId: 'anekarthi' },
          { nameHindi: '20. श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', descriptionHindi: 'समान ध्वनि वाले भिन्नार्थक युग्मों का शुद्ध प्रयोग।', descriptionEnglish: 'Sound-alike word distinctions.', linkedModuleId: 'shrutisam' },
          { nameHindi: '21. अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', descriptionHindi: 'सटीक वाक्यांश संक्षेपण अभ्यास।', descriptionEnglish: 'Precise one-word substitutions.', linkedModuleId: 'anek-shabd' },
          { nameHindi: '22. मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', descriptionHindi: 'अलंकारिक प्रयोग हेतु प्रमुख मुहावरे और लोकोक्तियाँ।', descriptionEnglish: 'Idioms and proverbs in composition.', linkedModuleId: 'muhavare' },
          { nameHindi: '23. वाक्य और उसके भेद', nameEnglish: 'Sentence & Its Types', descriptionHindi: 'उद्देश्य-विधेय विस्तार, उपवाक्य पहचान (संज्ञा/विशेषण/क्रियाविशेषण आश्रित उपवाक्य) व वाक्य संश्लेषण।', descriptionEnglish: 'Clause analysis, synthesis, and sentence types.', linkedModuleId: 'vakya' },
        ],
      },
    ],
    sampleQuestions: [
      {
        questionTextHindi: "'जो परिश्रम करेगा, वह सफल होगा।' रचना के आधार पर वाक्य का भेद व आश्रित उपवाक्य पहचानिए।",
        questionTextEnglish: "Identify the sentence type and dependent clause in 'जो परिश्रम करेगा, वह सफल होगा।'." ,
        instructionEnglish: 'Class 8 Sentence & Clauses check.',
        modelAnswerHindi: 'मिश्र वाक्य | "जो परिश्रम करेगा" — विशेषण / संज्ञा आश्रित उपवाक्य',
        explanationHindi: "'जो...वह' योजक युग्म होने से यह मिश्र वाक्य है।",
      },
      {
        questionTextHindi: "'पीतांबर' शब्द का दो प्रकार से समास-विग्रह कर भेद स्पष्ट कीजिए।",
        questionTextEnglish: "Show two Samas dissolutions of 'पीतांबर'.",
        instructionEnglish: 'Class 8 Karmadharaya vs Bahuvrihi distinction.',
        modelAnswerHindi: 'पीला है जो अंबर (कर्मधारय) | पीला है अंबर जिसका अर्थात श्रीकृष्ण (बहुव्रीहि)',
        explanationHindi: 'विग्रह के आधार पर तीसरा विशेष अर्थ निकलने पर बहुव्रीहि समास होता है।',
      },
    ],
  },

  // ICSE - Class 9 (Exact 15 Topics)
  'ICSE_कक्षा 9': {
    board: 'ICSE',
    grade: 'कक्षा 9',
    boardFullName: 'ICSE (CISCE) - कक्षा 9 हिंदी व्याकरण पाठ्यक्रम',
    overviewHindi:
      'ICSE कक्षा 9 का पाठ्यक्रम पूर्णतः बोर्ड परीक्षा पैटर्न पर केंद्रित है—विशेषण निर्माण, समृद्ध शब्द भंडार (पर्यायवाची, विलोम, एक शब्द, अनेकार्थी, श्रुतिसम), वर्तनी व वाक्य शुद्धि, लिंग-वचन-कारक-काल-वाच्य, अर्थ व रचना आधारित वाक्य-परिवर्तन (Do as Directed) तथा मुहावरे और लोकोक्तियाँ।',
    overviewEnglish:
      'ICSE Class 9 aligns strictly with the CISCE Board grammar syllabus: Adjective Derivation, 5 branches of Vocabulary, Spelling & Sentence Purity, Gender/Number/Case/Tense/Voice, Do as Directed Sentence Transformation, and Idioms & Proverbs.',
    assessmentPatternHindi:
      '40% निर्देशानुसार वाक्य-परिवर्तन (वाच्य, काल, अर्थ व रचना रूपांतरण), 35% विशेषण निर्माण, वर्तनी-वाक्य शुद्धि व शब्द भंडार, 25% मुहावरे-लोकोक्तियाँ एवं अपठित गद्यांश।',
    assessmentPatternEnglish:
      '40% Do as Directed Transformations, 35% Adjective Derivation, Spelling/Syntax Purity & Vocabulary, 25% Idioms & Comprehension.',
    weightage: [
      { topic: 'विशेषण निर्माण, लिंग, वचन, कारक व काल', marks: 12 },
      { topic: 'वर्तनी शुद्धि एवं वाक्य शुद्धि', marks: 10 },
      { topic: 'वाच्य व वाक्य-परिवर्तन (अर्थ और रचना)', marks: 14 },
      { topic: 'पर्यायवाची, विलोम, एक शब्द, अनेकार्थी, श्रुतिसम', marks: 14 },
      { topic: 'मुहावरे और लोकोक्तियाँ', marks: 6 },
      { topic: 'अपठित गद्यांश एवं प्रस्ताव/पत्र लेखन', marks: 24 },
    ],
    categories: [
      {
        title: 'Part 1: Word Derivation & Grammar Purity (1 से 8)',
        titleHindi: 'विशेषण निर्माण, शब्द भंडार व वर्तनी-वाक्य शुद्धि (1 से 8)',
        items: [
          { nameHindi: '1. विशेषण निर्माण', nameEnglish: 'Adjective Derivation', descriptionHindi: 'संज्ञा व मूल शब्दों से -इक (इतिहास→ऐतिहासिक), -ईय, -आलु, -ईन, -वान प्रत्ययों से विशेषण बनाना।', descriptionEnglish: 'Board-standard suffixation rules for deriving adjectives.', linkedModuleId: 'visheshan-nirman' },
          { nameHindi: '2. पर्यायवाची शब्द', nameEnglish: 'Synonyms', descriptionHindi: 'ICSE परीक्षा में पूछे जाने वाले उच्च स्तरीय समानार्थी शब्द।', descriptionEnglish: 'High-yield ICSE synonyms.', linkedModuleId: 'paryayvachi' },
          { nameHindi: '3. विलोम शब्द', nameEnglish: 'Antonyms', descriptionHindi: 'सटीक तत्सम-तद्भव विपरीतार्थक युग्म (सापेक्ष-निरपेक्ष, आकर्षण-विकर्षण)।', descriptionEnglish: 'Board-level register-matched antonyms.', linkedModuleId: 'vilom' },
          { nameHindi: '4. अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', descriptionHindi: 'जटिल वाक्यांशों के लिए सटीक एक शब्द।', descriptionEnglish: 'Concise one-word expressions.', linkedModuleId: 'anek-shabd' },
          { nameHindi: '5. अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', descriptionHindi: 'विभिन्न संदर्भों में एक शब्द के एकाधिक अर्थ।', descriptionEnglish: 'Contextual multi-meaning words.', linkedModuleId: 'anekarthi' },
          { nameHindi: '6. श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', descriptionHindi: 'समानोच्चारित किंतु भिन्न अर्थ व वर्तनी वाले शब्द युग्म।', descriptionEnglish: 'Similar-sounding distinct word pairs.', linkedModuleId: 'shrutisam' },
          { nameHindi: '7. वर्तनी शुद्धि', nameEnglish: 'Spelling Purity', descriptionHindi: 'उज्ज्वल, कवयित्री, आशीर्वाद, संन्यासी, पूजनीय जैसे मानक शब्दों की वर्तनी शुद्धि।', descriptionEnglish: 'Orthographic accuracy across common ICSE traps.', linkedModuleId: 'vartani-shuddhi' },
          { nameHindi: '8. वाक्य शुद्धि', nameEnglish: 'Sentence Purity', descriptionHindi: 'लिंग, वचन, कारक, पदक्रम व पुनरुक्ति अशुद्धियों का सटीक परिमार्जन।', descriptionEnglish: 'Eliminating grammatical & redundancy errors.', linkedModuleId: 'vakya-shuddhi' },
        ],
      },
      {
        title: 'Part 2: Functional Grammar, Transformations & Idioms (9 से 15)',
        titleHindi: 'लिंग, वचन, कारक, काल, वाच्य, वाक्य-परिवर्तन व मुहावरे (9 से 15)',
        items: [
          { nameHindi: '9. लिंग', nameEnglish: 'Gender (Ling)', descriptionHindi: 'तत्सम व विशिष्ट शब्दों का लिंग परिवर्तन एवं वाक्य समन्वय।', descriptionEnglish: 'Gender rules & concord.', linkedModuleId: 'ling' },
          { nameHindi: '10. वचन', nameEnglish: 'Number (Vachan)', descriptionHindi: 'नित्य बहुवचन/एकवचन व सविभक्ति वचन परिवर्तन।', descriptionEnglish: 'Number conversion & invariables.', linkedModuleId: 'vachan' },
          { nameHindi: '11. कारक', nameEnglish: 'Case Markers (Karak)', descriptionHindi: 'परसर्ग प्रयोग एवं सूक्ष्म कारकीय त्रुटियों का निवारण।', descriptionEnglish: 'Case precision in formal sentences.', linkedModuleId: 'karak' },
          { nameHindi: '12. काल', nameEnglish: 'Tenses (Kaal)', descriptionHindi: 'तीनों कालों के उपभेदों में निर्देशानुसार काल परिवर्तन।', descriptionEnglish: 'Applied tense shifts.', linkedModuleId: 'kaal' },
          { nameHindi: '13. वाच्य', nameEnglish: 'Voice (Vachya)', descriptionHindi: 'कर्तृ, कर्म व भाव वाच्य में निर्देशानुसार रूपांतरण।', descriptionEnglish: 'ICSE Voice transformation drills.', linkedModuleId: 'vachya' },
          { nameHindi: '14. वाक्य-परिवर्तन (अर्थ और रचना के आधार पर)', nameEnglish: 'Sentence Transformation', descriptionHindi: 'सरल-संयुक्त-मिश्र रूपांतरण तथा बिना अर्थ बदले नकारात्मक/प्रश्नवाचक/सकारात्मक परिवर्तन।', descriptionEnglish: 'Do as Directed transformations preserving meaning.', linkedModuleId: 'vakya-parivartan' },
          { nameHindi: '15. मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', descriptionHindi: 'बोर्ड परीक्षा स्तरीय मुहावरों और लोकोक्तियों का सार्थक वाक्य प्रयोग।', descriptionEnglish: 'Board-level idioms and proverbs.', linkedModuleId: 'muhavare' },
        ],
      },
    ],
    sampleQuestions: [
      {
        questionTextHindi: "'भूगोल' और 'समाज' शब्दों से शुद्ध विशेषण रूप बनाइए तथा 'कवियित्री' की वर्तनी शुद्ध कीजिए।",
        questionTextEnglish: "Form adjectives from 'भूगोल' & 'समाज', and correct spelling 'कवियित्री'.",
        instructionEnglish: 'ICSE Class 9 Adjective Derivation + Spelling.',
        modelAnswerHindi: 'भौगोलिक, सामाजिक | शुद्ध वर्तनी: कवयित्री',
        explanationHindi: "'इक' प्रत्यय से ऊ→औ, अ→आ वृद्धि होती है; कवि का स्त्रीलिंग मानक रूप 'कवयित्री' है।",
      },
      {
        questionTextHindi: "'वह निर्दोष है।' वाक्य को बिना अर्थ बदले नकारात्मक वाक्य में बदलिए।",
        questionTextEnglish: "Convert 'वह निर्दोष है।' to negative without changing meaning.",
        instructionEnglish: 'ICSE Do as Directed transformation.',
        modelAnswerHindi: 'वह दोषी नहीं है।',
        explanationHindi: "'निर्दोष' का विलोम 'दोषी' और 'नहीं' लगाने से मूल भाव सुरक्षित रहता है।",
      },
    ],
  },

  // ICSE - Class 10 (Exact 15 Board Exam Topics)
  'ICSE_कक्षा 10': {
    board: 'ICSE',
    grade: 'कक्षा 10',
    boardFullName: 'ICSE (CISCE) - कक्षा 10 बोर्ड परीक्षा हिंदी व्याकरण पाठ्यक्रम',
    overviewHindi:
      'ICSE कक्षा 10 बोर्ड परीक्षा के पूर्ण मानकों पर आधारित व्याकरण पाठ्यक्रम—विशेषण निर्माण, शब्द भंडार (पर्यायवाची, विलोम, एक शब्द, अनेकार्थी, श्रुतिसम), वर्तनी शुद्धि, वाक्य शुद्धि, लिंग-वचन-कारक-काल-वाच्य, वाक्य-परिवर्तन (Do as Directed) तथा मुहावरे और लोकोक्तियाँ।',
    overviewEnglish:
      'Complete CISCE Class 10 Board Exam Hindi Grammar framework: Adjective Derivation, all 5 Vocabulary categories, Spelling & Sentence Purity, Gender/Number/Case/Tense/Voice, Do as Directed Sentence Transformation, and Idioms & Proverbs.',
    assessmentPatternHindi:
      'बोर्ड प्रश्नपत्र खंड अ (व्यावहारिक व्याकरण): निर्देशानुसार वाक्य-परिवर्तन, विशेषण निर्माण, वर्तनी-वाक्य शुद्धि, पर्यायवाची-विलोम-एक शब्द, वाच्य-काल व मुहावरे-लोकोक्तियाँ (8 अंक व्यावहारिक व्याकरण + 40 अंक लेखन व गद्यांश)।',
    assessmentPatternEnglish:
      'Board Section A: Do as Directed transformations, Adjective Derivation, Spelling/Syntax Purity, Vocabulary, Voice/Tense & Idioms.',
    weightage: [
      { topic: 'विशेषण निर्माण व शब्द भंडार (पर्यायवाची, विलोम, एक शब्द, अनेकार्थी, श्रुतिसम)', marks: 16 },
      { topic: 'वर्तनी शुद्धि एवं वाक्य शुद्धि', marks: 10 },
      { topic: 'लिंग, वचन, कारक, काल और वाच्य रूपांतरण', marks: 14 },
      { topic: 'वाक्य-परिवर्तन (Do as Directed - अर्थ और रचना)', marks: 12 },
      { topic: 'मुहावरे और लोकोक्तियाँ', marks: 8 },
      { topic: 'अपठित गद्यांश एवं बोर्ड निबंध/पत्र', marks: 20 },
    ],
    categories: [
      {
        title: 'Part 1: Word Derivation, Vocabulary & Purity (1 से 8)',
        titleHindi: 'विशेषण निर्माण, शब्द भंडार व वर्तनी-वाक्य शुद्धि (1 से 8)',
        items: [
          { nameHindi: '1. विशेषण निर्माण', nameEnglish: 'Adjective Derivation', descriptionHindi: 'संस्कृति→सांस्कृतिक, अध्यात्म→आध्यात्मिक, उद्योग→औद्योगिक जैसे बोर्ड स्तरीय प्रत्यय नियम।', descriptionEnglish: 'Master vowel-strengthening ICSE adjective derivations.', linkedModuleId: 'visheshan-nirman' },
          { nameHindi: '2. पर्यायवाची शब्द', nameEnglish: 'Synonyms', descriptionHindi: 'ICSE बोर्ड प्रश्नपत्रों में संभावित प्रमुख समानार्थी शब्द।', descriptionEnglish: 'Board-exam synonym bank.', linkedModuleId: 'paryayvachi' },
          { nameHindi: '3. विलोम शब्द', nameEnglish: 'Antonyms', descriptionHindi: 'उत्कर्ष-अपकर्ष, सगुण-निर्गुण, आविर्भाव-तिरोभाव जैसे बोर्ड स्तरीय विलोम शब्द।', descriptionEnglish: 'ICSE Board-level antonyms.', linkedModuleId: 'vilom' },
          { nameHindi: '4. अनेक शब्दों के लिए एक शब्द', nameEnglish: 'One-Word Substitution', descriptionHindi: 'बोर्ड परीक्षा में पूछे जाने वाले सटीक वाक्यांश संक्षेपण।', descriptionEnglish: 'Board-level one-word substitutions.', linkedModuleId: 'anek-shabd' },
          { nameHindi: '5. अनेकार्थी शब्द', nameEnglish: 'Polysemous Words', descriptionHindi: 'सारंग, कनक, द्विज, मधु, कर आदि शब्दों के प्रसंगानुसार अर्थ।', descriptionEnglish: 'Board polysemous vocabulary.', linkedModuleId: 'anekarthi' },
          { nameHindi: '6. श्रुतिसमभिन्नार्थक शब्द', nameEnglish: 'Homophones', descriptionHindi: 'प्रकार-प्राकार, तरणि-तरणी, कुल-कूल जैसे सूक्ष्म युग्मों का अंतर।', descriptionEnglish: 'Subtle homophone distinctions.', linkedModuleId: 'shrutisam' },
          { nameHindi: '7. वर्तनी शुद्धि', nameEnglish: 'Spelling Purity', descriptionHindi: 'अंतर्निहित, प्रज्वलित, संन्यासी, कवयित्री, आशीर्वाद जैसे मानक रूप।', descriptionEnglish: 'Board-level orthographic mastery.', linkedModuleId: 'vartani-shuddhi' },
          { nameHindi: '8. वाक्य शुद्धि', nameEnglish: 'Sentence Purity', descriptionHindi: 'अनन्वय, पुनरुक्ति, पदक्रम व कारक संबंधी सूक्ष्म दोषों का शोधन।', descriptionEnglish: 'Board-level sentence rectification.', linkedModuleId: 'vakya-shuddhi' },
        ],
      },
      {
        title: 'Part 2: Board Applied Grammar, Transformations & Idioms (9 से 15)',
        titleHindi: 'लिंग, वचन, कारक, काल, वाच्य, वाक्य-परिवर्तन व मुहावरे (9 से 15)',
        items: [
          { nameHindi: '9. लिंग', nameEnglish: 'Gender (Ling)', descriptionHindi: 'विद्वान-विदुषी, सम्राट-सम्राज्ञी व वाक्य में लिंग समन्वय।', descriptionEnglish: 'Irregular gender & concord.', linkedModuleId: 'ling' },
          { nameHindi: '10. वचन', nameEnglish: 'Number (Vachan)', descriptionHindi: 'हस्ताक्षर, प्राण, दर्शन जैसे नित्य बहुवचन एवं सविभक्ति रूप।', descriptionEnglish: 'Number precision in board sentences.', linkedModuleId: 'vachan' },
          { nameHindi: '11. कारक', nameEnglish: 'Case Markers (Karak)', descriptionHindi: 'करण, अपादान, संप्रदान व अधिकरण कारकों का सटीक बोर्ड प्रयोग।', descriptionEnglish: 'Case markers in board questions.', linkedModuleId: 'karak' },
          { nameHindi: '12. काल', nameEnglish: 'Tenses (Kaal)', descriptionHindi: 'हेतुहेतुमद्, संदिग्ध व अपूर्ण कालों में निर्देशानुसार काल परिवर्तन।', descriptionEnglish: 'Advanced tense transformation.', linkedModuleId: 'kaal' },
          { nameHindi: '13. वाच्य', nameEnglish: 'Voice (Vachya)', descriptionHindi: 'कर्तृवाच्य, कर्मवाच्य व भाववाच्य में त्रुटिहीन रूपांतरण।', descriptionEnglish: 'Active/Passive/Impersonal conversions.', linkedModuleId: 'vachya' },
          { nameHindi: '14. वाक्य-परिवर्तन (अर्थ और रचना के आधार पर)', nameEnglish: 'Sentence Transformation', descriptionHindi: 'ICSE "निर्देशानुसार वाक्य बदलिए" (Do as Directed) के सभी संरचनात्मक व अर्थगत रूप।', descriptionEnglish: 'Full ICSE Do as Directed sentence transformations.', linkedModuleId: 'vakya-parivartan' },
          { nameHindi: '15. मुहावरे और लोकोक्तियाँ', nameEnglish: 'Idioms & Proverbs', descriptionHindi: 'बोर्ड परीक्षा में बार-बार पूछे जाने वाले मुहावरे व लोकोक्तियों का वाक्य प्रयोग।', descriptionEnglish: 'Essential ICSE idioms and proverbs.', linkedModuleId: 'muhavare' },
        ],
      },
    ],
    sampleQuestions: [
      {
        questionTextHindi: '"इतिहास" और "उद्योग" से विशेषण बनाइए तथा "मुझसे यह भारी बोझ उठाया नहीं जाता" का वाच्य बताइए।',
        questionTextEnglish: "Derive adjectives from 'इतिहास' & 'उद्योग', and identify voice of 'मुझसे यह भारी बोझ उठाया नहीं जाता'।",
        instructionEnglish: 'ICSE Class 10 Board sample drill.',
        modelAnswerHindi: 'ऐतिहासिक, औद्योगिक | कर्मवाच्य ("बोझ" कर्म की प्रधानता व "मुझसे" करण/कर्ता से)',
        explanationHindi: "सकर्मक क्रिया 'उठाना' के साथ 'बोझ' कर्म उपस्थित होने से यह कर्मवाच्य है।",
      },
      {
        questionTextHindi: '"जो व्यक्ति परिश्रम करता है, वह अवश्य सफल होता है।" (सरल वाक्य में बदलिए)',
        questionTextEnglish: "Convert complex sentence into simple sentence.",
        instructionEnglish: 'ICSE Do as Directed Board transformation.',
        modelAnswerHindi: 'परिश्रम करने वाला व्यक्ति अवश्य सफल होता है।',
        explanationHindi: "मिश्र वाक्य के दोनों उपवाक्यों को एक उद्देश्य-विधेय में संक्षिप्त करने पर सरल वाक्य बनता है।",
      },
    ],
  },
};

/**
 * Helper to retrieve ICSE syllabus detail for any grade
 */
export function getBoardSyllabus(_board: BoardType, grade: GradeLevel): BoardSyllabusDetail {
  return BOARD_SYLLABI[`ICSE_${grade}`] || BOARD_SYLLABI['ICSE_कक्षा 8'];
}
