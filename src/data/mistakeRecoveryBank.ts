import { MistakeTopicStat, QuizQuestion } from '../types';
import { randomizeQuizSet } from '../utils/quizShuffle';
import {
  isQuestionBlockedSiteWide,
  normalizeSiteQuestionKey,
  normalizeStrictQuestionFingerprint,
} from './siteQuestionKeys';
import {
  RawBankQuestion,
  getCanonicalTopicLabels,
  resolveTopicKeyFromString,
} from './worksheetBank';

export interface ExclusiveRecoveryQuestion {
  qH: string;
  qE: string;
  correct: string;
  wrongs: [string, string, string];
  expH: string;
  expE: string;
}

/**
 * 100% Exclusive Mistake Recovery Bank
 * Every topic key has >= 5 completely original ICSE-aligned Hindi grammar / composition
 * questions written exclusively for Mistake Recovery Practice — zero overlap with
 * Store Worksheets, Custom Worksheet Studio, Pre/Post Checkpoints, Simulations, or Apathit Gadyansh.
 */
export const MISTAKE_RECOVERY_BANK: Record<string, ExclusiveRecoveryQuestion[]> = {
  karak: [
    {
      qH: "'पर्वतारोही रस्सी के सहारे चोटी पर चढ़ा।' इस वाक्य में 'रस्सी के सहारे' कौन-सा कारक दर्शाता है?",
      qE: "In 'The mountaineer climbed the peak with the support of a rope', which case is shown by 'रस्सी के सहारे'?",
      correct: 'करण कारक (साधन या माध्यम)',
      wrongs: ['अपादान कारक (अलगाव)', 'सम्प्रदान कारक (देने का भाव)', 'अधिकरण कारक (स्थान)'],
      expH: 'यहाँ चढ़ने की क्रिया का साधन या माध्यम रस्सी है, अतः करण कारक है।',
      expE: 'The rope acts as the instrument/means for climbing, indicating Karan Karak.',
    },
    {
      qH: "'सैनिक देश की रक्षा के लिए सीमा पर डटे रहते हैं।' यहाँ 'देश की रक्षा के लिए' में किस कारक की विभक्ति है?",
      qE: "In 'Soldiers stay on the border for the protection of the nation', identify the case of 'रक्षा के लिए'.",
      correct: 'सम्प्रदान कारक (के लिए)',
      wrongs: ['कर्म कारक (को)', 'अपादान कारक (से अलग)', 'संबोधन कारक (हे/अरे)'],
      expH: "जिस उद्देश्य या हित के लिए क्रिया की जाए, वहाँ 'के लिए' विभक्ति के साथ सम्प्रदान कारक होता है।",
      expE: "Purpose or beneficiary marked by 'के लिए' denotes Sampradan Karak.",
    },
    {
      qH: "'आकाश से ओले बरसने लगे।' वाक्य में 'आकाश से' में प्रयुक्त कारक पहचानिए:",
      qE: "Identify the case in 'आकाश से' in the sentence 'Hailstones began falling from the sky'.",
      correct: 'अपादान कारक (अलगाव/प्रस्थान)',
      wrongs: ['करण कारक (साधन)', 'कर्ता कारक (ने)', 'संबंध कारक (का/के/की)'],
      expH: 'ओलों के आकाश से अलग होकर धरती पर आने का भाव है, इसलिए अपादान कारक है।',
      expE: 'Detachment or falling away from a source expresses Apadan Karak.',
    },
    {
      qH: "'पुस्तकालय की मेज़ पर विश्वकोश रखा है।' इस वाक्य में अधिकरण कारक का युग्म कौन-सा है?",
      qE: "In 'The encyclopedia is kept on the library table', which phrase marks Adhikaran Karak?",
      correct: 'मेज़ पर',
      wrongs: ['पुस्तकालय की', 'विश्वकोश रखा', 'रखा है'],
      expH: "क्रिया के आधार या स्थान ('में/पर') को अधिकरण कारक कहते हैं — यहाँ 'मेज़ पर' आधार है।",
      expE: "Location or surface indicated by 'पर' is Adhikaran Karak ('मेज़ पर').",
    },
    {
      qH: "'बच्चो! सड़क पार करते समय दाएँ-बाएँ अवश्य देखो।' इस वाक्य के आरंभ में कौन-सा कारक प्रयुक्त हुआ है?",
      qE: "Which case is used at the beginning of 'बच्चो! सड़क पार करते समय दाएँ-बाएँ अवश्य देखो।'?",
      correct: 'संबोधन कारक (पुकारने/चेताने का भाव)',
      wrongs: ['कर्ता कारक', 'संबंध कारक', 'कर्म कारक'],
      expH: "'बच्चो!' कहकर बच्चों को सीधे संबोधित किया गया है, अतः संबोधन कारक है।",
      expE: "Directly calling or addressing listeners marks Sambodhan Karak.",
    },
  ],

  vakya: [
    {
      qH: "'बादल गरजते ही मोर झूमकर नाचने लगे।' इस सरल वाक्य का सटीक संयुक्त वाक्य रूप कौन-सा होगा?",
      qE: "Choose the accurate compound sentence transformation of 'बादल गरजते ही मोर झूमकर नाचने लगे।'",
      correct: 'बादल गरजे और मोर झूमकर नाचने लगे।',
      wrongs: [
        'जैसे ही बादल गरजे, वैसे ही मोर झूमकर नाचने लगे।',
        'जब बादल गरजे तब मोर नाचे।',
        'गरजते बादलों में मोर नाचे।',
      ],
      expH: "दो स्वतंत्र उपवाक्यों को 'और' समानाधिकरण समुच्चयबोधक से जोड़कर संयुक्त वाक्य बनता है।",
      expE: "Joining two independent clauses with 'और' forms a compound sentence.",
    },
    {
      qH: "'मैंने एक ऐसी घड़ी खरीदी है जो सौर ऊर्जा से चलती है।' यह रचना के आधार पर किस भेद का वाक्य है?",
      qE: "Based on structure, classify: 'मैंने एक ऐसी घड़ी खरीदी है जो सौर ऊर्जा से चलती है।'",
      correct: 'मिश्र वाक्य (प्रधान + आश्रित उपवाक्य)',
      wrongs: ['सरल वाक्य', 'संयुक्त वाक्य', 'संदेहवाचक वाक्य'],
      expH: "'ऐसी...जो' योजक के कारण दूसरा उपवाक्य मुख्य उपवाक्य पर आश्रित है, अतः मिश्र वाक्य है।",
      expE: "Subordinating relative 'जो' links a dependent clause to the main clause (Complex Sentence).",
    },
    {
      qH: "'कदाचित इस वर्ष शीतलहर देर तक रहेगी।' अर्थ के आधार पर यह किस प्रकार का वाक्य है?",
      qE: "Classify by meaning: 'कदाचित इस वर्ष शीतलहर देर तक रहेगी।' (Perhaps the cold wave will last late this year.)",
      correct: 'संदेहवाचक वाक्य',
      wrongs: ['इच्छावाचक वाक्य', 'निषेधवाचक वाक्य', 'आज्ञावाचक वाक्य'],
      expH: "'कदाचित' (शायद) से कार्य के होने में अनिश्चितता या संदेह झलकता है, अतः संदेहवाचक वाक्य है।",
      expE: "'कदाचित' expresses uncertainty/probability, marking Sandehvachak Vakya.",
    },
    {
      qH: "'ईश्वर करे तुम्हारी वैज्ञानिक खोज सफल हो!' अर्थ की दृष्टि से यह कौन-सा वाक्य भेद है?",
      qE: "Identify the semantic sentence type: 'ईश्वर करे तुम्हारी वैज्ञानिक खोज सफल हो!'",
      correct: 'इच्छावाचक वाक्य',
      wrongs: ['विस्मयादिबोधक वाक्य', 'संकेतवाचक वाक्य', 'विधानवाचक वाक्य'],
      expH: 'शुभकामना, आशीर्वाद या मंगल कामना प्रकट करने वाले वाक्य इच्छावाचक कहलाते हैं।',
      expE: 'Sentences expressing blessings or good wishes are Icchavachak (Desiderative).',
    },
    {
      qH: "'वह तेज़ चला परंतु समय से पहले स्टेशन न पहुँच सका।' इसमें प्रयुक्त योजक 'परंतु' किस वाक्य श्रेणी का सूचक है?",
      qE: "In 'वह तेज़ चला परंतु समय से पहले स्टेशन न पहुँच सका।', the conjunction 'परंतु' indicates which sentence category?",
      correct: 'संयुक्त वाक्य',
      wrongs: ['सरल वाक्य', 'मिश्र वाक्य', 'विस्मयवाचक वाक्य'],
      expH: "'परंतु, किंतु, लेकिन' जैसे विरोधदर्शक समानाधिकरण योजक संयुक्त वाक्य का निर्माण करते हैं।",
      expE: "Adversative coordinating conjunctions like 'परंतु' form Compound sentences.",
    },
  ],

  vakya_vichar: [
    {
      qH: "'वीर शिवाजी के सेनापति तानाजी ने सिंहगढ़ किला जीता।' इस वाक्य में 'वीर शिवाजी के सेनापति तानाजी ने' क्या कहलाता है?",
      qE: "In 'वीर शिवाजी के सेनापति तानाजी ने सिंहगढ़ किला जीता।', what grammatical part is the phrase 'वीर शिवाजी के सेनापति तानाजी ने'?",
      correct: 'उद्देश्य तथा उद्देश्य का विस्तार',
      wrongs: ['केवल विधेय', 'क्रियाविशेषण पदबंध', 'आश्रित उपवाक्य'],
      expH: 'वाक्य में कर्ता (' + 'तानाजी ने) और उसकी विशेषता बताने वाले पद (' + 'वीर शिवाजी के सेनापति) मिलकर उद्देश्य व उसका विस्तार बनाते हैं।',
      expE: 'The subject noun together with its qualifying modifiers forms the complete Subject (Uddeshya).',
    },
    {
      qH: "जिस वाक्य में एक ही उद्देश्य और एक ही मुख्य विधेय (समापिका क्रिया) हो, उसे व्याकरण में क्या कहते हैं?",
      qE: "What is a sentence containing only one subject and one main finite predicate called?",
      correct: 'सरल वाक्य',
      wrongs: ['संयुक्त वाक्य', 'मिश्र वाक्य', 'आश्रित वाक्य'],
      expH: 'एक कर्ता (या संयुक्त कर्ता) और एक ही मुख्य क्रिया वाला वाक्य सरल या साधारण वाक्य कहलाता है।',
      expE: 'A single clause with one finite verb defines a Simple Sentence (Saral Vakya).',
    },
    {
      qH: "'यद्यपि वह धनी है, तथापि वह अत्यंत विनम्र रहता है।' यहाँ 'तथापि वह अत्यंत विनम्र रहता है' किस वर्ग में आएगा?",
      qE: "In 'यद्यपि वह धनी है, तथापि वह अत्यंत विनम्र रहता है।', which role does 'तथापि वह अत्यंत विनम्र रहता है' play?",
      correct: 'प्रधान (मुख्य) उपवाक्य',
      wrongs: ['विशेषण आश्रित उपवाक्य', 'सरल वाक्य का उद्देश्य', 'विस्मयादिबोधक पद'],
      expH: "'यद्यपि...तथापि' वाले मिश्र वाक्य में 'तथापि' से जुड़ा मुख्य कथन प्रधान उपवाक्य होता है।",
      expE: "In 'यद्यपि...तथापि' pairs, the 'तथापि' clause expresses the main statement (Principal Clause).",
    },
    {
      qH: "'मीरा ने कहा कि आज संगीत प्रतियोगिता है।' इस वाक्य में 'कि आज संगीत प्रतियोगिता है' कौन-सा आश्रित उपवाक्य है?",
      qE: "In 'मीरा ने कहा कि आज संगीत प्रतियोगिता है।', classify the subordinate clause 'कि आज संगीत प्रतियोगिता है'.",
      correct: 'संज्ञा आश्रित उपवाक्य',
      wrongs: ['विशेषण आश्रित उपवाक्य', 'क्रियाविशेषण आश्रित उपवाक्य', 'प्रधान उपवाक्य'],
      expH: "'कहा' क्रिया के कर्म के रूप में 'कि' से जुड़ने वाला उपवाक्य संज्ञा आश्रित उपवाक्य होता है।",
      expE: "Clauses introduced by 'कि' functioning as the verb's object are Noun Subordinate Clauses.",
    },
    {
      qH: "'जब-जब समाज में अन्याय बढ़ा, तब-तब कोई नायक उभरा।' यहाँ 'जब-जब...तब-तब' किस प्रकार का आश्रित उपवाक्य बनाता है?",
      qE: "In 'जब-जब समाज में अन्याय बढ़ा, तब-तब कोई नायक उभरा।', what type of dependent clause is formed?",
      correct: 'क्रियाविशेषण आश्रित उपवाक्य (कालवाचक)',
      wrongs: ['संज्ञा आश्रित उपवाक्य', 'विशेषण आश्रित उपवाक्य', 'सरल वाक्य'],
      expH: "'जब-जब...तब-तब' क्रिया के घटित होने के समय का बोध कराते हैं, अतः कालवाचक क्रियाविशेषण उपवाक्य है।",
      expE: "Temporal correlatives denote an Adverbial Clause of time.",
    },
  ],

  vakya_ashuddhi: [
    {
      qH: "निम्नलिखित में से अशुद्ध वाक्य की पहचान कर शुद्ध विकल्प चुनिए — अशुद्ध: 'मेरे को कल दिल्ली जाना है।'",
      qE: "Select the grammatically pure correction for: 'मेरे को कल दिल्ली जाना है।'",
      correct: 'मुझे कल दिल्ली जाना है।',
      wrongs: ['मेरे को ही कल दिल्ली जाना।', 'मैं को कल दिल्ली जाना है।', 'मेरे ने कल दिल्ली जाना है।'],
      expH: "मानक हिंदी में 'मेरे को' सर्वनाम का अशुद्ध प्रयोग है; इसके स्थान पर 'मुझे' का प्रयोग शुद्ध होता है।",
      expE: "'मुझे' is the standard dative pronoun form in Hindi instead of 'मेरे को'.",
    },
    {
      qH: "'कृपया मेरी बात ध्यानपूर्वक सुनने की कृपा करें।' इस वाक्य में किस प्रकार की अशुद्धि है?",
      qE: "Identify the error category in 'कृपया मेरी बात ध्यानपूर्वक सुनने की कृपा करें।'",
      correct: 'पुनरुक्ति दोष (' + 'कृपया और कृपा दोनों का प्रयोग)',
      wrongs: ['लिंग संबंधी अशुद्धि', 'वचन संबंधी अशुद्धि', 'विराम-चिह्न अशुद्धि'],
      expH: "'कृपया' और 'कृपा करें' एक ही भाव को दो बार दोहराते हैं; शुद्ध रूप होगा: 'कृपया मेरी बात ध्यानपूर्वक सुनें।'",
      expE: "Using both 'कृपया' and 'कृपा करें' creates redundancy (punarukti dosh).",
    },
    {
      qH: "व्याकरणिक दृष्टि से पूर्णतः शुद्ध वाक्य का चयन कीजिए:",
      qE: "Choose the sentence that is completely free from grammatical errors:",
      correct: 'तालाब में अनेक रंग-बिरंगे कमल खिले हैं।',
      wrongs: [
        'तालाब में अनेकों रंग-बिरंगे कमल खिले हैं।',
        'तालाब में अनेकों कमल खिले है।',
        'तालाब पर अनेकों कमल खिले हुए थे।',
      ],
      expH: "'अनेक' स्वयं बहुवचन शब्द है, इसलिए 'अनेकों' लिखना अशुद्ध है। शुद्ध प्रयोग 'अनेक' है।",
      expE: "'अनेक' is already plural; adding '-ओं' to make 'अनेकों' is ungrammatical.",
    },
    {
      qH: "'मैं आपके उज्वल भविष्य की कामना करता हूँ।' इस वाक्य में अशुद्ध शब्द को शुद्ध रूप में चुनिए:",
      qE: "Pick the correctly spelled replacement for the error in 'मैं आपके उज्वल भविष्य की कामना करता हूँ।'",
      correct: 'उज्ज्वल',
      wrongs: ['उज्वल्ल', 'उजज्वल', 'उज्वाल'],
      expH: "'उत् + ज्वल' व्यंजन संधि से दोनों 'ज' आधे बनते हैं — शुद्ध वर्तनी 'उज्ज्वल' है।",
      expE: "By consonant assimilation (उत् + ज्वल), both 'ज' are half-letters: 'उज्ज्वल'.",
    },
    {
      qH: "'मरीज को गरम गाय का दूध पिलाओ।' इस वाक्य का अर्थ की दृष्टि से शुद्ध रूप क्या होगा?",
      qE: "Select the logically accurate correction of 'मरीज को गरम गाय का दूध पिलाओ।'",
      correct: 'मरीज को गाय का गरम दूध पिलाओ।',
      wrongs: [
        'गाय को मरीज का गरम दूध पिलाओ।',
        'मरीज को गरम दूध गाय की पिलाओ।',
        'गरम मरीज को गाय का दूध पिलाओ।',
      ],
      expH: "यहाँ 'गरम' विशेषण गाय के लिए नहीं बल्कि 'दूध' के लिए है, अतः पदक्रम सुधारकर 'गाय का गरम दूध' लिखना शुद्ध है।",
      expE: "'गरम' modifies 'दूध' (hot milk), not 'गाय' (cow); proper word order resolves the ambiguity.",
    },
  ],

  vachya: [
    {
      qH: "'चित्रकार सुंदर पेंटिंग बनाता है।' इस वाक्य का सटीक कर्मवाच्य परिवर्तन क्या होगा?",
      qE: "Convert 'चित्रकार सुंदर पेंटिंग बनाता है।' accurately into Passive Voice (Karmvachya):",
      correct: 'चित्रकार के द्वारा सुंदर पेंटिंग बनाई जाती है।',
      wrongs: [
        'चित्रकार से सुंदर पेंटिंग नहीं बनाई जाती।',
        'चित्रकार ने सुंदर पेंटिंग बनाई थी।',
        'चित्रकार के द्वारा सुंदर पेंटिंग बनाया जाता है।',
      ],
      expH: "कर्म 'पेंटिंग' स्त्रीलिंग है, अतः कर्मवाच्य में 'के द्वारा' के साथ क्रिया 'बनाई जाती है' स्त्रीलिंग में होगी।",
      expE: "In Karmvachya, the verb agrees with the feminine object 'पेंटिंग' using 'के द्वारा'.",
    },
    {
      qH: "'आइए, अब थोड़ा टहला जाए।' यह वाच्य के किस भेद का उदाहरण है?",
      qE: "Identify the voice used in 'आइए, अब थोड़ा टहला जाए।' (Come, let us walk a bit now).",
      correct: 'भाववाच्य',
      wrongs: ['कर्तृवाच्य', 'कर्मवाच्य', 'मिश्रवाच्य'],
      expH: "अकर्मक क्रिया ('टहलना') का 'आ जाए' रूप में भाव-प्रधान प्रयोग भाववाच्य कहलाता है।",
      expE: "Impersonal suggestion with an intransitive verb exemplifies Bhavvachya.",
    },
    {
      qH: "'पुलिस द्वारा यातायात नियमों का पालन कराया जाता है।' इसका शुद्ध कर्तृवाच्य रूप चुनिए:",
      qE: "Transform 'पुलिस द्वारा यातायात नियमों का पालन कराया जाता है।' into Active Voice (Kartrivachya):",
      correct: 'पुलिस यातायात नियमों का पालन कराती है।',
      wrongs: [
        'पुलिस से यातायात नियम नहीं कराए जाते।',
        'यातायात नियमों से पुलिस पालन कराती है।',
        'पुलिस द्वारा नियमों को पालन कराना जाता है।',
      ],
      expH: "'द्वारा' हटाकर क्रिया को कर्ता ('पुलिस') के अनुसार वर्तमान काल में रखने पर कर्तृवाच्य बनता है।",
      expE: "Removing 'द्वारा' and aligning verb with agent 'पुलिस' restores Active Voice.",
    },
    {
      qH: "'घायल हिरण तेज़ भाग नहीं सकता।' इस वाक्य को भाववाच्य में परिवर्तित कीजिए:",
      qE: "Convert 'घायल हिरण तेज़ भाग नहीं सकता।' into Impersonal Voice (Bhavvachya):",
      correct: 'घायल हिरण से तेज़ भागा नहीं जाता।',
      wrongs: [
        'घायल हिरण के द्वारा तेज़ भागा गया।',
        'घायल हिरण ने तेज़ नहीं भागा।',
        'तेज़ भागना घायल हिरण ने छोड़ा।',
      ],
      expH: "असमर्थता और अकर्मक क्रिया को 'से + नहीं + क्रिया का सामान्य पुल्लिंग एकवचन रूप (जाता)' में बदलने से भाववाच्य बनता है।",
      expE: "Bhavvachya uses agent + 'से' and an impersonal 3rd-person singular masculine verb.",
    },
    {
      qH: "किस वाच्य में सकर्मक और अकर्मक दोनों प्रकार की क्रियाओं का प्रयोग संभव होता है?",
      qE: "Which grammatical voice permits both transitive and intransitive verbs?",
      correct: 'कर्तृवाच्य',
      wrongs: ['केवल कर्मवाच्य', 'केवल भाववाच्य', 'अव्ययवाच्य'],
      expH: 'कर्तृवाच्य में सकर्मक और अकर्मक दोनों क्रियाएँ प्रयुक्त होती हैं, जबकि कर्मवाच्य केवल सकर्मक और भाववाच्य प्रायः अकर्मक क्रिया से बनता है।',
      expE: 'Kartrivachya supports both transitive and intransitive verbs, unlike Karmvachya (transitive only).',
    },
  ],

  kaal: [
    {
      qH: "'रविवार को विद्यालय में विज्ञान प्रदर्शनी लगेगी।' यह वाक्य किस काल को सूचित करता है?",
      qE: "Which tense is shown in 'रविवार को विद्यालय में विज्ञान प्रदर्शनी लगेगी।'?",
      correct: 'सामान्य भविष्यत् काल',
      wrongs: ['अपूर्ण भूतकाल', 'संदिग्ध वर्तमान काल', 'आसन्न भूतकाल'],
      expH: 'आने वाले समय में सामान्य रूप से होने वाले कार्य (' + 'लगेगी) से सामान्य भविष्यत् काल स्पष्ट होता है।',
      expE: "Normal future completion ('लगेगी') marks Simple Future Tense.",
    },
    {
      qH: "'दादी जी अभी-अभी मंदिर से लौटी हैं।' यह भूतकाल का कौन-सा उपभेद है?",
      qE: "Classify the past tense sub-type in 'दादी जी अभी-अभी मंदिर से लौटी हैं।'",
      correct: 'आसन्न भूतकाल (निकट अतीत में पूर्ण)',
      wrongs: ['पूर्ण भूतकाल', 'अपूर्ण भूतकाल', 'हेतुहेतुमद् भूतकाल'],
      expH: 'जब क्रिया के तुरंत या अभी-अभी समाप्त होने का बोध हो, तब आसन्न भूतकाल होता है।',
      expE: "Action completed just now invokes Recent Past (Asanna Bhootkal).",
    },
    {
      qH: "'जब हम पहुँचे, तब किसान खेत जोत रहा था।' इसमें 'जोत रहा था' किस काल का द्योतक है?",
      qE: "In 'जब हम पहुँचे, तब किसान खेत जोत रहा था।', identify the tense of 'जोत रहा था'.",
      correct: 'अपूर्ण भूतकाल',
      wrongs: ['पूर्ण भूतकाल', 'सामान्य भूतकाल', 'संदिग्ध भूतकाल'],
      expH: 'भूतकाल में क्रिया जारी थी और समाप्त नहीं हुई थी (' + 'रहा था), अतः अपूर्ण भूतकाल है।',
      expE: "Ongoing past action without completion ('रहा था') denotes Past Continuous.",
    },
    {
      qH: "'मंच पर गायिका गीत गा रही होगी।' यह किस काल का सटीक उदाहरण है?",
      qE: "Identify the tense in 'मंच पर गायिका गीत गा रही होगी।' (The singer must be singing on stage).",
      correct: 'संदिग्ध वर्तमान काल',
      wrongs: ['सामान्य भविष्यत् काल', 'हेतुहेतुमद् भविष्यत् काल', 'पूर्ण भूतकाल'],
      expH: "वर्तमान में क्रिया के जारी होने का अनुमान या संदेह ('रही होगी') संदिग्ध वर्तमान काल कहलाता है।",
      expE: "'रही होगी' expressing present conjecture indicates Doubtful Present Tense.",
    },
    {
      qH: "'यदि तुम समय पर अभ्यास करोगे, तो पुरस्कार अवश्य प्राप्त करोगे।' यह वाक्य किस काल-भेद में आता है?",
      qE: "Classify: 'यदि तुम समय पर अभ्यास करोगे, तो पुरस्कार अवश्य प्राप्त करोगे।'",
      correct: 'हेतुहेतुमद् भविष्यत् काल',
      wrongs: ['संभाव्य भविष्यत् काल', 'सामान्य भूतकाल', 'आसन्न भूतकाल'],
      expH: 'भविष्य की एक क्रिया (' + 'पुरस्कार प्राप्त करना) दूसरी शर्त (' + 'अभ्यास करना) पर निर्भर है, अतः हेतुहेतुमद् भविष्यत् काल है।',
      expE: "A future outcome conditioned upon another future action defines Conditional Future.",
    },
  ],

  muhavara: [
    {
      qH: "'ईंट का जवाब पत्थर से देना' मुहावरे का सर्वोत्तम अर्थ क्या है?",
      qE: "What is the accurate meaning of the idiom 'ईंट का जवाब पत्थर से देना'?",
      correct: 'दुष्ट या विरोधी को उससे भी अधिक कठोर व करारा उत्तर देना',
      wrongs: ['मकान की मरम्मत कराना', 'शांति से मान जाना', 'बिना सोचे पत्थर फेंकना'],
      expH: "किसी के प्रहार या अपमान का दोगुनी शक्ति से करारा जवाब देना 'ईंट का जवाब पत्थर से देना' कहलाता है।",
      expE: "Responding to an opponent's attack with an even stronger counter-response.",
    },
    {
      qH: "'लोहे के चने चबाना' मुहावरा किस स्थिति या अनुभव को दर्शाता है?",
      qE: "What situation does the idiom 'लोहे के चने चबाना' express?",
      correct: 'अत्यंत कठिन या असाधारण चुनौतीपूर्ण कार्य करना',
      wrongs: ['स्वादिष्ट भोजन खाना', 'दाँतों की जाँच कराना', 'आसानी से जीत जाना'],
      expH: "बहुत कड़े परिश्रम और कठिनाई का सामना करना 'लोहे के चने चबाना' कहलाता है।",
      expE: "Signifies accomplishing a tremendously tough or grueling task.",
    },
    {
      qH: "'हाथ-पाँव फूल जाना' मुहावरा किस मनोदशा के लिए प्रयुक्त होता है?",
      qE: "When is the idiom 'हाथ-पाँव फूल जाना' used?",
      correct: 'अचानक डर या घबराहट के कारण सुध-बुध खो बैठना',
      wrongs: ['अत्यधिक हँसी आना', 'शारीरिक व्यायाम करना', 'खुशी से उछल पड़ना'],
      expH: 'अप्रत्याशित संकट देखकर भय से घबरा जाना ' + "'हाथ-पाँव फूल जाना' कहलाता है।",
      expE: "Becoming panicked or losing composure due to sudden fear.",
    },
    {
      qH: "'कलई खुलना' मुहावरे का उपयुक्त अर्थ चुनिए:",
      qE: "Select the appropriate meaning of 'कलई खुलना':",
      correct: 'असली भेद या छिपा हुआ रहस्य सबके सामने आ जाना',
      wrongs: ['नया रंग चढ़ाना', 'ताला बंद हो जाना', 'पुरानी दोस्ती निभाना'],
      expH: "दिखावे या झूठ का पर्दाफाश हो जाना 'कलई खुलना' कहलाता है।",
      expE: "Exposing one's hidden truth or real character.",
    },
    {
      qH: "'घी के दीये जलाना' मुहावरे का लाक्षणिक अर्थ क्या है?",
      qE: "Choose the figurative meaning of 'घी के दीये जलाना':",
      correct: 'असीम प्रसन्नता के कारण धूमधाम से खुशियाँ मनाना',
      wrongs: ['बिजली की बचत करना', 'क्रोध में आग-बबूला होना', 'गहरे शोक में डूब जाना'],
      expH: "किसी बड़ी उपलब्धि या शुभ अवसर पर अत्यंत आनंद मनाना 'घी के दीये जलाना' कहलाता है।",
      expE: "Celebrating a joyful occasion or grand victory enthusiastically.",
    },
  ],

  upsarg_pratyay: [
    {
      qH: "'निर्विकार' शब्द में प्रयुक्त उपसर्ग और मूल शब्द का सही विच्छेद कौन-सा है?",
      qE: "Select the accurate breakup of prefix and root word in 'निर्विकार':",
      correct: 'निः / निर् + विकार',
      wrongs: ['नि + रविकार', 'निर + अकार', 'नी + विकार'],
      expH: "'निर्' (बिना/रहित) उपसर्ग जब 'विकार' से जुड़ता है, तो 'निर्विकार' (दोष-रहित) शब्द बनता है।",
      expE: "Prefix 'निर्' attached to root 'विकार' yields 'निर्विकार'.",
    },
    {
      qH: "'दैनिक' शब्द में मूल शब्द और किस प्रत्यय का प्रयोग हुआ है?",
      qE: "Identify the root word and suffix in 'दैनिक':",
      correct: 'दिन + इक',
      wrongs: ['दै + निक', 'देन + इक', 'दिन + क'],
      expH: "'दिन' में 'इक' प्रत्यय जुड़ने पर आदि स्वर का 'इ' से 'ऐ' में परिवर्तन होकर 'दैनिक' बनता है।",
      expE: "Adding '-इक' to 'दिन' transforms the first vowel (वृद्धि) to yield 'दैनिक'.",
    },
    {
      qH: "'अभिमान' शब्द में किस उपसर्ग का उपयोग किया गया है?",
      qE: "Which prefix is attached in 'अभिमान'?",
      correct: 'अभि',
      wrongs: ['अ', 'मान', 'अभ'],
      expH: "'अभि' उपसर्ग ('ओर/अधिक' के अर्थ में) 'मान' मूल शब्द के आगे लगकर 'अभिमान' बनाता है।",
      expE: "Prefix 'अभि' combines with root 'मान'.",
    },
    {
      qH: "'सजावट' शब्द का निर्माण किस मूल क्रिया/शब्द में कौन-सा प्रत्यय जोड़कर हुआ है?",
      qE: "Which root word and suffix form 'सजावट'?",
      correct: 'सज (सजना) + आवट',
      wrongs: ['सजा + वट', 'स + जावट', 'सज + हट'],
      expH: "'सजना' क्रिया की धातु 'सज' में 'आवट' कृत् प्रत्यय लगने से भाववाचक संज्ञा 'सजावट' बनती है।",
      expE: "Verbal root 'सज' + suffix '-आवट' produces abstract noun 'सजावट'.",
    },
    {
      qH: "ऐसा कौन-सा शब्द है जिसमें उपसर्ग और प्रत्यय दोनों का एक साथ प्रयोग हुआ है?",
      qE: "Which of these words contains BOTH a prefix and a suffix together?",
      correct: 'असफलता (अ + सफल + ता)',
      wrongs: ['पढ़ाई (पढ़ + आई)', 'परिवार (परि + वार)', 'महान (मूल शब्द)'],
      expH: "'असफलता' में 'अ' उपसर्ग, 'सफल' मूल शब्द तथा 'ता' प्रत्यय — तीनों का संयोग है।",
      expE: "'अ' (prefix) + 'सफल' (root) + 'ता' (suffix) demonstrates dual affixation.",
    },
  ],

  sandhi: [
    {
      qH: "'महोत्सव' शब्द का शुद्ध संधि-विच्छेद एवं संधि का नाम क्या है?",
      qE: "Choose the exact Sandhi split and type for 'महोत्सव':",
      correct: 'महा + उत्सव (गुण स्वर संधि)',
      wrongs: [
        'महो + त्सव (दीर्घ संधि)',
        'महा + ओत्सव (वृद्धि संधि)',
        'महि + उत्सव (यण संधि)',
      ],
      expH: "'आ + उ = ओ' होने के कारण यहाँ गुण स्वर संधि है (महा + उत्सव = महोत्सव)।",
      expE: "ā + u = o transformation represents Guna Swar Sandhi.",
    },
    {
      qH: "'जगदीश' शब्द किस संधि का उदाहरण है और इसका विच्छेद क्या होगा?",
      qE: "Identify the Sandhi type and split of 'जगदीश':",
      correct: 'जगत् + ईश (व्यंजन संधि)',
      wrongs: [
        'जग + दीश (स्वर संधि)',
        'जगद + ईश (विसर्ग संधि)',
        'जगती + श (दीर्घ संधि)',
      ],
      expH: "वर्ग के प्रथम वर्ण 'त्' के बाद स्वर आने पर अपने ही वर्ग के तीसरे वर्ण 'द्' में बदल जाता है (जगत् + ईश = जगदीश)।",
      expE: "Voiceless 'त्' becomes voiced 'द्' before vowel 'ई' (Vyanjan Sandhi).",
    },
    {
      qH: "'मनः + रथ' के मेल से बनने वाला सही संधि-युक्त शब्द कौन-सा है?",
      qE: "Which word results from combining 'मनः + रथ'?",
      correct: 'मनोरथ',
      wrongs: ['मनरथ', 'मनहरथ', 'मनोरथः'],
      expH: "विसर्ग से पहले 'अ' और बाद में 'र' आने पर विसर्ग 'ओ' में परिवर्तित होकर 'मनोरथ' (विसर्ग संधि) बनता है।",
      expE: "Visarga transforms into 'ओ' before 'र', forming 'मनोरथ'.",
    },
    {
      qH: "'सदैव' (सदा + एव) में कौन-सी स्वर संधि कार्य करती है?",
      qE: "Which vowel Sandhi rule applies in 'सदैव' (सदा + एव)?",
      correct: 'वृद्धि स्वर संधि',
      wrongs: ['गुण स्वर संधि', 'अयादि स्वर संधि', 'दीर्घ स्वर संधि'],
      expH: "आ + ए मिलकर 'ऐ' की वृद्धि करते हैं, अतः यह वृद्धि स्वर संधि है।",
      expE: "ā + e → ai defines Vriddhi Swar Sandhi.",
    },
    {
      qH: "'नयन' शब्द का अयादि संधि के अनुसार सही विच्छेद चुनिए:",
      qE: "Select the accurate Ayadi Sandhi split for 'नयन':",
      correct: 'ने + अन',
      wrongs: ['न + यन', 'नै + अन', 'नो + अन'],
      expH: "'ए' के बाद भिन्न स्वर आने पर 'अय्' बनता है — ने + अन = नयन (अयादि स्वर संधि)।",
      expE: "e + a → aya under Ayadi Sandhi produces 'नयन' from 'ने + अन'.",
    },
  ],

  samas: [
    {
      qH: "'चक्रपाणि' (चक्र है पाणि/हाथ में जिसके — श्रीविष्णु) में कौन-सा समास मान्य है?",
      qE: "Identify the Samas in 'चक्रपाणि' (One holding the discus in hand — Lord Vishnu):",
      correct: 'बहुव्रीहि समास',
      wrongs: ['द्विगु समास', 'द्वंद्व समास', 'अव्ययीभाव समास'],
      expH: "दोनों पद ('चक्र' और 'पाणि') मिलकर किसी विशेष तीसरे आराध्य (श्रीविष्णु) की ओर संकेत करते हैं, अतः यह बहुव्रीहि समास है।",
      expE: 'Since the compound denotes a specific external referent (Lord Vishnu), it is Bahuvrihi Samas.',
    },
    {
      qH: "'चौराहा' (चार राहों का समूह) समास के किस भेद के अंतर्गत आता है?",
      qE: "Under which Samas category does 'चौराहा' (gathering of four roads) fall?",
      correct: 'द्विगु समास',
      wrongs: ['तत्पुरुष समास', 'अव्ययीभाव समास', 'कर्मधारय समास'],
      expH: 'पहला पद संख्यावाचक (' + 'चार) हो और समस्तपद समूह का बोध कराए, वहाँ द्विगु समास होता है।',
      expE: 'Numerical first component expressing a collection defines Dvigu Samas.',
    },
    {
      qH: "'यथासमय' (समय के अनुसार) किस समास का उदाहरण है?",
      qE: "Classify the compound 'यथासमय' (according to time):",
      correct: 'अव्ययीभाव समास',
      wrongs: ['तत्पुरुष समास', 'द्वंद्व समास', 'बहुव्रीहि समास'],
      expH: "पूर्वपद 'यथा' एक अव्यय (उपसर्ग-सदृश) है जो समस्तपद को अव्यय बना देता है, अतः अव्ययीभाव समास है।",
      expE: "Indeclinable prefix 'यथा' as the first constituent marks Avyayibhav Samas.",
    },
    {
      qH: "'नीलकमल' का सही समास-विग्रह और भेद बताइए:",
      qE: "Identify the correct split and type for 'नीलकमल':",
      correct: 'नीला है जो कमल (कर्मधारय समास)',
      wrongs: [
        'नील और कमल (द्वंद्व समास)',
        'नीले से कमल (करण तत्पुरुष)',
        'नीला का कमल (अव्ययीभाव)',
      ],
      expH: "'नीला' विशेषण और 'कमल' विशेष्य का संबंध होने के कारण यह कर्मधारय समास है।",
      expE: "Adjective-noun modifier relationship ('नीला है जो कमल') forms Karmadharaya Samas.",
    },
    {
      qH: "'सुख-दुख' समस्तपद में कौन-सा समास प्रयुक्त हुआ है?",
      qE: "Which Samas is used in 'सुख-दुख'?",
      correct: 'द्वंद्व समास',
      wrongs: ['द्विगु समास', 'अव्ययीभाव समास', 'तत्पुरुष समास'],
      expH: "दोनों पद प्रधान हैं और विग्रह करने पर 'सुख और दुख' ('और/या') का लोप मिलता है — यह द्वंद्व समास है।",
      expE: "Two equally prominent words joined with implicit 'और/या' represent Dvandva Samas.",
    },
  ],

  sangya: [
    {
      qH: "'सैनिकों की टुकड़ी आगे बढ़ रही है।' वाक्य में 'टुकड़ी' संज्ञा का कौन-सा भेद है?",
      qE: "In 'सैनिकों की टुकड़ी आगे बढ़ रही है।', which noun type is 'टुकड़ी'?",
      correct: 'समुदायवाचक (समूहवाचक) संज्ञा',
      wrongs: ['व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा', 'भाववाचक संज्ञा'],
      expH: "'टुकड़ी' किसी एक व्यक्ति का नहीं बल्कि सैनिकों के पूरे समूह का बोध कराती है, अतः समूहवाचक संज्ञा है।",
      expE: "'टुकड़ी' denotes a troop or group of soldiers (Collective Noun).",
    },
    {
      qH: "'बचपन के दिन अत्यंत सुहावने होते हैं।' इसमें 'बचपन' किस संज्ञा भेद के अंतर्गत आएगा?",
      qE: "Classify the word 'बचपन' in 'बचपन के दिन अत्यंत सुहावने होते हैं।':",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: "'बचपन' एक अवस्था या भाव को दर्शाता है जिसे छुआ नहीं जा सकता, अतः यह भाववाचक संज्ञा है।",
      expE: "'बचपन' denotes an abstract life stage/state, hence Abstract Noun.",
    },
    {
      qH: "'कुम्हार चाँदी के बजाय पीतल से बर्तन बना रहा है।' यहाँ 'पीतल' किस संज्ञा की श्रेणी में है?",
      qE: "In 'कुम्हार पीतल से बर्तन बना रहा है', which noun category does 'पीतल' belong to?",
      correct: 'द्रव्यवाचक संज्ञा',
      wrongs: ['भाववाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'समूहवाचक संज्ञा'],
      expH: 'धातुओं, तरल और नापने-तौलने योग्य पदार्थों के नाम द्रव्यवाचक संज्ञा कहलाते हैं।',
      expE: 'Metals and raw materials belong to Material Noun (Dravyavachak Sangya).',
    },
    {
      qH: "'एवरेस्ट विश्व की सबसे ऊँची पर्वत चोटी है।' इसमें 'एवरेस्ट' कौन-सी संज्ञा है?",
      qE: "Identify the noun type of 'एवरेस्ट' in 'एवरेस्ट विश्व की सबसे ऊँची पर्वत चोटी है।':",
      correct: 'व्यक्तिवाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'भाववाचक संज्ञा', 'समूहवाचक संज्ञा'],
      expH: 'किसी एक विशेष पर्वत शिखर का नाम होने के कारण ' + "'एवरेस्ट' व्यक्तिवाचक संज्ञा है।",
      expE: 'Specific proper name of an individual mountain peak is Proper Noun (Vyaktivachak).',
    },
    {
      qH: "जातिवाचक संज्ञा शब्द 'मानव' से निर्मित सही भाववाचक संज्ञा कौन-सी होगी?",
      qE: "Choose the correct Abstract Noun derived from the common noun 'मानव':",
      correct: 'मानवता',
      wrongs: ['मानविक', 'मनोव', 'मानवी'],
      expH: "'मानव' में 'ता' प्रत्यय जोड़कर भाववाचक संज्ञा 'मानवता' बनती है।",
      expE: "Suffix '-ता' derives abstract noun 'मानवता' from 'मानव'.",
    },
  ],

  sarvanam: [
    {
      qH: "'यह साइकिल मैंने स्वयं ठीक की है।' इस वाक्य में 'स्वयं' किस प्रकार का सर्वनाम है?",
      qE: "In 'यह साइकिल मैंने स्वयं ठीक की है।', what type of pronoun is 'स्वयं'?",
      correct: 'निजवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'प्रश्नवाचक सर्वनाम', 'संबंधवाचक सर्वनाम'],
      expH: 'कर्ता अपने खुद के लिए जिन सर्वनामों (' + 'स्वयं, खुद, अपने-आप) का प्रयोग करे, वे निजवाचक सर्वनाम होते हैं।',
      expE: "Reflexive pronouns used by the subject for itself ('स्वयं') are Nijvachak.",
    },
    {
      qH: "'बगीचे में कोई टहल रहा है।' यहाँ 'कोई' किस सर्वनाम भेद का उदाहरण है?",
      qE: "Identify the pronoun type of 'कोई' in 'बगीचे में कोई टहल रहा है।':",
      correct: 'अनिश्चयवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'पुरुषवाचक सर्वनाम', 'निजवाचक सर्वनाम'],
      expH: "'कोई' से किसी निश्चित व्यक्ति का बोध नहीं होता, अतः यह अनिश्चयवाचक सर्वनाम है।",
      expE: "'कोई' refers to an unspecified person, marking Indefinite Pronoun.",
    },
    {
      qH: "'जितना गुड़ डालोगे, उतना मीठा होगा।' इसमें 'जितना...उतना' कौन-सा सर्वनाम दर्शाता है?",
      qE: "In 'जितना गुड़ डालोगे, उतना मीठा होगा।', what pronoun category is 'जितना...उतना'?",
      correct: 'संबंधवाचक सर्वनाम',
      wrongs: ['निजवाचक सर्वनाम', 'प्रश्नवाचक सर्वनाम', 'उत्तम पुरुषवाचक'],
      expH: 'दो वाक्यांशों या पदों के बीच पारस्परिक संबंध जोड़ने वाले सर्वनाम संबंधवाचक कहलाते हैं।',
      expE: 'Correlative pairs linking two clauses represent Relative Pronouns.',
    },
    {
      qH: "'वक्ता ने कहा — हम कल विज्ञान संग्रहालय जाएंगे।' यहाँ 'हम' किस पुरुषवाचक सर्वनाम के अंतर्गत है?",
      qE: "In 'हम कल विज्ञान संग्रहालय जाएंगे', which sub-type of personal pronoun is 'हम'?",
      correct: 'उत्तम पुरुषवाचक सर्वनाम',
      wrongs: ['मध्यम पुरुषवाचक सर्वनाम', 'अन्य पुरुषवाचक सर्वनाम', 'संबंधवाचक सर्वनाम'],
      expH: 'बोलने वाला अपने लिए ' + "'मैं' या 'हम' का प्रयोग करता है, जो उत्तम पुरुषवाचक सर्वनाम है।",
      expE: 'First-person pronouns used by the speaker are Uttam Purushvachak.',
    },
    {
      qH: "'पुस्तकालय से कौन-सी पत्रिका खो गई है?' वाक्य में प्रयुक्त 'कौन-सी' किस श्रेणी का सर्वनाम है?",
      qE: "In 'पुस्तकालय से कौन-सी पत्रिका खो गई है?', what pronoun type is 'कौन-सी'?",
      correct: 'प्रश्नवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'अनिश्चयवाचक सर्वनाम', 'निजवाचक सर्वनाम'],
      expH: 'प्रश्न पूछने के लिए प्रयुक्त होने के कारण यह प्रश्नवाचक सर्वनाम (विशेषण-रूप) है।',
      expE: 'Used to ask an interrogative question, identifying Prashnavachak.',
    },
  ],

  visheshan: [
    {
      qH: "'माँ ने हलवे के लिए दो किलो खोया मँगवाया।' वाक्य में 'दो किलो' कौन-सा विशेषण है?",
      qE: "In 'माँ ने हलवे के लिए दो किलो खोया मँगवाया।', identify the adjective type of 'दो किलो'.",
      correct: 'निश्चित परिमाणवाचक विशेषण',
      wrongs: ['निश्चित संख्यावाचक विशेषण', 'गुणवाचक विशेषण', 'सार्वनामिक विशेषण'],
      expH: "'दो किलो' किसी तौलने वाली वस्तु ('खोया') की निश्चित मात्रा बताता है, अतः निश्चित परिमाणवाचक विशेषण है।",
      expE: 'Exact weight measurement (' + 'दो किलो) defines Definite Adjective of Quantity.',
    },
    {
      qH: "'वह छात्रावास मेरे विद्यालय के सामने स्थित है।' इस वाक्य में 'वह' (छात्रावास से ठीक पहले) कौन-सा विशेषण है?",
      qE: "In 'वह छात्रावास मेरे विद्यालय के सामने स्थित है।', classify 'वह' placed directly before the noun 'छात्रावास'.",
      correct: 'सार्वनामिक (संकेतवाचक) विशेषण',
      wrongs: ['गुणवाचक विशेषण', 'परिमाणवाचक विशेषण', 'अनिश्चित संख्यावाचक'],
      expH: "जब कोई सर्वनाम ('वह') संज्ञा ('छात्रावास') के ठीक पहले आकर उसकी ओर संकेत करे, तब वह सार्वनामिक विशेषण कहलाता है।",
      expE: 'A pronoun immediately preceding and pointing to a noun acts as a Demonstrative Adjective.',
    },
    {
      qH: "'प्राचीन महल की नक्काशी अद्भुत है।' इस वाक्य में गुणवाचक विशेषण कौन-सा पद है?",
      qE: "Identify the adjective of quality in 'प्राचीन महल की नक्काशी अद्भुत है।':",
      correct: 'प्राचीन तथा अद्भुत',
      wrongs: ['महल तथा की', 'की तथा है', 'केवल महल'],
      expH: "'प्राचीन' काल संबंधी और 'अद्भुत' गुण संबंधी विशेषता प्रकट करते हैं, दोनों गुणवाचक विशेषण हैं।",
      expE: "Both 'प्राचीन' (era) and 'अद्भुत' (quality) describe attributes (Gunvachak Visheshan).",
    },
    {
      qH: "'दौड़ में पंद्रह धावकों ने भाग लिया।' इसमें 'पंद्रह' किस प्रकार का विशेषण है?",
      qE: "In 'दौड़ में पंद्रह धावकों ने भाग लिया।', what adjective type is 'पंद्रह'?",
      correct: 'निश्चित संख्यावाचक विशेषण',
      wrongs: ['अनिश्चित परिमाणवाचक विशेषण', 'सार्वनामिक विशेषण', 'गुणवाचक विशेषण'],
      expH: 'गिने जा सकने वाले धावकों की सटीक संख्या बताने के कारण यह निश्चित संख्यावाचक विशेषण है।',
      expE: 'Exact countable number marks Definite Numeral Adjective.',
    },
    {
      qH: "'हिमालय पर्वत अत्यंत ऊँचा है।' इस वाक्य में प्रविशेषण (विशेषण की विशेषता बताने वाला शब्द) कौन-सा है?",
      qE: "In 'हिमालय पर्वत अत्यंत ऊँचा है।', which word is the intensifier (Pravisheshan)?",
      correct: 'अत्यंत',
      wrongs: ['हिमालय', 'पर्वत', 'ऊँचा'],
      expH: "'ऊँचा' विशेषण की भी तीव्रता बढ़ाने वाला शब्द 'अत्यंत' प्रविशेषण कहलाता है।",
      expE: "'अत्यंत' intensifies the adjective 'ऊँचा', making it a Pravisheshan.",
    },
  ],

  kriya: [
    {
      qH: "'चमकीली धूप में बच्चे खुलकर हँस रहे हैं।' यहाँ 'हँस रहे हैं' किस प्रकार की क्रिया है?",
      qE: "In 'चमकीली धूप में बच्चे खुलकर हँस रहे हैं।', classify the verb 'हँस रहे हैं'.",
      correct: 'अकर्मक क्रिया',
      wrongs: ['सकर्मक क्रिया', 'द्विकर्मक क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: "'हँसना' क्रिया का फल सीधे कर्ता ('बच्चे') पर पड़ता है और इसमें किसी कर्म की आवश्यकता नहीं होती।",
      expE: "'हँसना' (laughing) takes no object and affects the subject directly (Intransitive).",
    },
    {
      qH: "'मालकिन ने नौकरानी से कपड़े धुलवाए।' इस वाक्य में कौन-सी क्रिया प्रयुक्त हुई है?",
      qE: "Identify the verb type in 'मालकिन ने नौकरानी से कपड़े धुलवाए।':",
      correct: 'प्रेरणार्थक क्रिया',
      wrongs: ['पूर्वकालिक क्रिया', 'अकर्मक क्रिया', 'नामधातु क्रिया'],
      expH: 'जहाँ कर्ता स्वयं कार्य न करके किसी दूसरे को कार्य करने की प्रेरणा दे (' + 'धुलवाए), वहाँ प्रेरणार्थक क्रिया होती है।',
      expE: 'When the subject causes another agent to act, it is a Causative Verb (Preranarthak).',
    },
    {
      qH: "'यात्री भोजन करके तुरंत बस में बैठ गया।' इसमें 'भोजन करके' क्रिया का कौन-सा रूप है?",
      qE: "In 'यात्री भोजन करके तुरंत बस में बैठ गया।', classify 'करके'.",
      correct: 'पूर्वकालिक क्रिया',
      wrongs: ['संयुक्त क्रिया', 'सहायक क्रिया', 'नामधातु क्रिया'],
      expH: 'मुख्य क्रिया (' + 'बैठ गया) से पहले समाप्त हुई क्रिया (' + 'करके) पूर्वकालिक क्रिया कहलाती है।',
      expE: "An action completed immediately prior to the main verb ('करके') is Purvakalik Kriya.",
    },
    {
      qH: "'संज्ञा, सर्वनाम या विशेषण शब्दों से बनने वाली क्रिया' (जैसे 'हाथ' से 'हथियाना', 'बात' से 'बतियाना') क्या कहलाती है?",
      qE: "Verbs derived from nouns, pronouns, or adjectives (like 'हथियाना' from 'हाथ') are called:",
      correct: 'नामधातु क्रिया',
      wrongs: ['सकर्मक क्रिया', 'प्रेरणार्थक क्रिया', 'पूर्वकालिक क्रिया'],
      expH: 'धातु के बजाय संज्ञा-विशेषण शब्दों के अंत में प्रत्यय लगाकर बनी क्रिया नामधातु क्रिया कहलाती है।',
      expE: 'Denominative verbs formed from non-verbal roots are Namdhatu Kriya.',
    },
    {
      qH: "'अध्यापक ने छात्रों को गणित पढ़ाया।' इसमें क्रिया का कौन-सा भेद है?",
      qE: "Classify the verb in 'अध्यापक ने छात्रों को गणित पढ़ाया।':",
      correct: 'द्विकर्मक (सकर्मक) क्रिया',
      wrongs: ['अकर्मक क्रिया', 'नामधातु क्रिया', 'पूर्वकालिक क्रिया'],
      expH: "यहाँ दो कर्म हैं — 'छात्रों को' (गौण कर्म) तथा 'गणित' (मुख्य कर्म), अतः द्विकर्मक क्रिया है।",
      expE: "Two objects ('छात्रों को' and 'गणित') characterize a Dvikarmak (ditransitive) verb.",
    },
  ],

  kriya_kaal: [
    {
      qH: "'चिड़िया चहचहाकर उड़ गई।' इसमें प्रयुक्त 'चहचहाकर' किस क्रिया-श्रेणी का उदाहरण है?",
      qE: "In 'चिड़िया चहचहाकर उड़ गई।', classify 'चहचहाकर'.",
      correct: 'पूर्वकालिक क्रिया',
      wrongs: ['प्रेरणार्थक क्रिया', 'संदिग्ध वर्तमान', 'द्विकर्मक क्रिया'],
      expH: 'उड़ने से ठीक पहले घटित क्रिया ' + "'चहचहाकर' पूर्वकालिक क्रिया है।",
      expE: 'Completed prior to the main action of flying away, hence Purvakalik.',
    },
    {
      qH: "'नौकर ने कमरा साफ़ कर दिया।' यहाँ 'कर दिया' (दो धातुओं का मेल) किस क्रिया भेद में आता है?",
      qE: "In 'नौकर ने कमरा साफ़ कर दिया।', what type is the compound verb 'कर दिया'?",
      correct: 'संयुक्त क्रिया',
      wrongs: ['अकर्मक क्रिया', 'नामधातु क्रिया', 'अपूर्ण भूतकाल'],
      expH: "दो भिन्न क्रियाओं ('कर' + 'दिया') के संयोग से पूर्ण अर्थ प्रकट होने पर संयुक्त क्रिया होती है।",
      expE: 'Two verbs combining to complete a single predicate form a Compound Verb (Sanyukt Kriya).',
    },
    {
      qH: "'शायद कल हमारे प्रधानाचार्य दिल्ली से लौटें।' यह किस काल के अंतर्गत आता है?",
      qE: "Identify the tense in 'शायद कल हमारे प्रधानाचार्य दिल्ली से लौटें।':",
      correct: 'संभाव्य भविष्यत् काल',
      wrongs: ['सामान्य वर्तमान काल', 'आसन्न भूतकाल', 'अपूर्ण भूतकाल'],
      expH: 'भविष्य में क्रिया के घटित होने की संभावना प्रकट करने वाला रूप संभाव्य भविष्यत् काल होता है।',
      expE: 'Expressing future possibility uses Sambhavya Bhavishyat Kaal.',
    },
    {
      qH: "'कवि कविता सुना रहा होगा।' वाक्य में क्रिया किस काल का बोध कराती है?",
      qE: "Identify the tense expressed in 'कवि कविता सुना रहा होगा।':",
      correct: 'संदिग्ध वर्तमान काल',
      wrongs: ['पूर्ण भूतकाल', 'हेतुहेतुमद् भूतकाल', 'पूर्वकालिक क्रिया'],
      expH: "वर्तमान में कार्य जारी रहने की संदेहपूर्ण कल्पना ('रहा होगा') संदिग्ध वर्तमान काल है।",
      expE: "Uncertainty about an ongoing present action signifies Sandigdh Vartaman.",
    },
    {
      qH: "'यदि तुमने पत्र भेजा होता, तो उत्तर अवश्य आता।' यहाँ क्रिया किस काल से संबंधित है?",
      qE: "Classify the tense in 'यदि तुमने पत्र भेजा होता, तो उत्तर अवश्य आता।':",
      correct: 'हेतुहेतुमद् भूतकाल',
      wrongs: ['सामान्य भूतकाल', 'आसन्न भूतकाल', 'सामान्य भविष्यत् काल'],
      expH: 'भूतकाल की एक क्रिया दूसरी शर्त पर निर्भर रहकर अपूर्ण रह गई, अतः हेतुहेतुमद् भूतकाल है।',
      expE: 'Unfulfilled past contingency indicates Hetuhetumad Bhootkal.',
    },
  ],

  ling: [
    {
      qH: "'विद्वान्' पुल्लिंग शब्द का शुद्ध स्त्रीलिंग रूप कौन-सा होता है?",
      qE: "What is the accurate feminine form of the masculine word 'विद्वान्'?",
      correct: 'विदुषी',
      wrongs: ['विद्वानी', 'विद्वानिन', 'विद्योति'],
      expH: "संस्कृतनिष्ठ शब्द 'विद्वान्' का मानक स्त्रीलिंग रूप 'विदुषी' होता है।",
      expE: "'विदुषी' is the standard feminine counterpart of 'विद्वान्'.",
    },
    {
      qH: "निम्नलिखित में से किस शब्द का प्रयोग व्याकरण में सदैव स्त्रीलिंग में होता है?",
      qE: "Which of the following nouns is always treated as feminine in Hindi grammar?",
      correct: 'तितली / छिपकली (नित्य स्त्रीलिंग)',
      wrongs: ['कौआ', 'खटमल', 'चीता'],
      expH: "हिंदी में 'तितली, मक्खी, छिपकली, कोयल' नित्य स्त्रीलिंग शब्द हैं ('नर तितली' कहकर पुल्लिंग बनाते हैं)।",
      expE: "'तितली' is inherently feminine (Nitya Striling) in Hindi.",
    },
    {
      qH: "'सम्राट' शब्द का सही स्त्रीलिंग शब्द चुनिए:",
      qE: "Choose the correct feminine form of 'सम्राट':",
      correct: 'सम्राज्ञी',
      wrongs: ['सम्राटिन', 'सम्राटी', 'सम्राटीनी'],
      expH: "'सम्राट' का तत्सम एवं शुद्ध स्त्रीलिंग रूप 'सम्राज्ञी' होता है।",
      expE: "'सम्राज्ञी' is the authentic feminine equivalent of 'सम्राट'.",
    },
    {
      qH: "'कवि' पुल्लिंग शब्द का शुद्ध स्त्रीलिंग रूप क्या है?",
      qE: "Select the correctly spelled feminine form of 'कवि':",
      correct: 'कवयित्री',
      wrongs: ['कवियित्री', 'कवित्री', 'काव्यित्री'],
      expH: "ICSE परीक्षा में सर्वाधिक पूछा जाने वाला शब्द — 'कवि' का शुद्ध स्त्रीलिंग 'कवयित्री' है।",
      expE: "'कवयित्री' is the exact spelling of the feminine counterpart of 'कवि'.",
    },
    {
      qH: "'आयुष्मान' का सही स्त्रीलिंग रूप कौन-सा है?",
      qE: "Select the accurate feminine form of 'आयुष्मान':",
      correct: 'आयुष्मती',
      wrongs: ['आयुष्मानी', 'आयुष्माती', 'आयुषी'],
      expH: "'मान' प्रत्ययांत शब्दों का स्त्रीलिंग 'मती' लगाकर बनता है — आयुष्मान → आयुष्मती।",
      expE: "Adjectives ending in '-मान' take '-मती' in the feminine: 'आयुष्मती'.",
    },
  ],

  vachan: [
    {
      qH: "'प्राण, आँसू, दर्शन, हस्ताक्षर' जैसे शब्द हिंदी व्याकरण में किस वचन में प्रयुक्त होते हैं?",
      qE: "Words such as 'प्राण, आँसू, दर्शन, हस्ताक्षर' are grammatically used in which number?",
      correct: 'सदैव बहुवचन (नित्य बहुवचन)',
      wrongs: ['सदैव एकवचन', 'केवल द्विवचन', 'उभयवचन'],
      expH: "कुछ संज्ञा शब्द ('आँसू निकल आए', 'प्राण पखेरू उड़ गए', 'हस्ताक्षर कर दिए') सदैव बहुवचन में प्रयुक्त होते हैं।",
      expE: 'These nouns take plural verb agreement perpetually (Nitya Bahuvachan).',
    },
    {
      qH: "'वधू' एकवचन शब्द का शुद्ध बहुवचन रूप क्या होगा?",
      qE: "What is the accurate plural form of 'वधू'?",
      correct: 'वधुएँ',
      wrongs: ['वधूएँ', 'वधूओं', 'वधुओं'],
      expH: "दीर्घ 'ऊ' से अंत होने वाले स्त्रीलिंग शब्दों का बहुवचन बनाते समय 'ऊ' ह्रस्व ('उ') होकर 'एँ' जुड़ता है — वधू → वधुएँ।",
      expE: "Long 'ऊ' shortens to 'उ' before appending 'एँ', yielding 'वधुएँ'.",
    },
    {
      qH: "'दवाई' शब्द का मानक शुद्ध बहुवचन रूप कौन-सा है?",
      qE: "Select the standard plural spelling of 'दवाई':",
      correct: 'दवाइयाँ',
      wrongs: ['दवाईयाँ', 'दवाएँ', 'दवाईएँ'],
      expH: "दीर्घ 'ई' से अंत होने वाले शब्दों का बहुवचन बनाते समय 'ई' ह्रस्व 'इ' होकर 'याँ' जुड़ता है — दवाई → दवाइयाँ।",
      expE: "Long 'ई' shortens to 'इ' before appending 'याँ': 'दवाइयाँ'.",
    },
    {
      qH: "'जनता, वर्षा, पानी, सत्य' किस वचन श्रेणी के शब्द हैं?",
      qE: "Words like 'जनता, वर्षा, पानी, सत्य' belong to which grammatical number category?",
      correct: 'सदैव एकवचन (नित्य एकवचन)',
      wrongs: ['नित्य बहुवचन', 'द्विवचन', 'केवल तिर्यक् बहुवचन'],
      expH: "समूह ('जनता') और द्रव्यवाचक ('पानी, वर्षा') संज्ञाएँ सदैव एकवचन क्रिया के साथ आती हैं।",
      expE: 'Collective mass and liquid nouns remain grammatically singular (Nitya Ekvachan).',
    },
    {
      qH: "'गुरु' शब्द के साथ किस बहुवचन सूचक पद को जोड़कर आदरार्थक बहुवचन बनाया जाता है?",
      qE: "Which collective marker turns 'गुरु' into its standard respectful plural?",
      correct: 'गुरुजन',
      wrongs: ['गुरुएँ', 'गुरुलोग', 'गुरुया'],
      expH: "विशिष्ट वर्गों के बहुवचन के लिए 'जन, गण, वृंद' जुड़ते हैं — जैसे गुरुजन, शिक्षकगण, पक्षीवृंद।",
      expE: "Respectful pluralization uses '-जन' to yield 'गुरुजन'.",
    },
  ],

  viram_chinh: [
    {
      qH: "'माता-पिता, सुबह-शाम, सुख-दुख' जैसे शब्द-युग्मों के बीच प्रयुक्त चिह्न (-) क्या कहलाता है?",
      qE: "What is the punctuation mark (-) connecting pairs like 'माता-पिता' called?",
      correct: 'योजक चिह्न',
      wrongs: ['निर्देशक चिह्न', 'लाघव चिह्न', 'उद्धरण चिह्न'],
      expH: "दो शब्दों को जोड़ने या तुलना दिखाने के लिए छोटे रेखा-चिह्न (-) को योजक चिह्न कहते हैं।",
      expE: 'The short hyphen connecting word pairs is Yojak Chinh.',
    },
    {
      qH: "डॉ॰ (डॉक्टर), प्र॰ (प्रश्न), ई॰ (ईसवी) में प्रयुक्त छोटा शून्य/बिंदु चिह्न क्या कहलाता है?",
      qE: "What is the abbreviation mark used in 'डॉ॰, प्र॰' called in Hindi punctuation?",
      correct: 'लाघव चिह्न',
      wrongs: ['विवरण चिह्न', 'अर्द्धविराम', 'हंसपद (त्रुटिपूरक)'],
      expH: 'बड़े शब्दों को संक्षिप्त रूप में लिखने के लिए लाघव चिह्न (॰) का प्रयोग होता है।',
      expE: 'Laghav Chinh abbreviates longer titles or words.',
    },
    {
      qH: "वाक्य लिखते समय यदि कोई शब्द छूट जाए, तो उसे ऊपर जोड़ने के लिए किस चिह्न (^) का प्रयोग करते हैं?",
      qE: "Which punctuation mark (^) is used to insert an accidentally omitted word above the line?",
      correct: 'त्रुटिपूरक / हंसपद चिह्न',
      wrongs: ['अल्पविराम', 'कोष्ठक', 'निर्देशक चिह्न'],
      expH: "छूटे हुए अंश को दर्शाने वाला '^' जैसा चिह्न हंसपद या त्रुटिपूरक चिह्न कहलाता है।",
      expE: 'The caret symbol (^) used for inserting omitted text is Hanspad / Trutipoorak Chinh.',
    },
    {
      qH: "दो उपवाक्यों के बीच जब अल्पविराम से अधिक और पूर्णविराम से कम रुकना हो, तब कौन-सा चिह्न (;) लगता है?",
      qE: "Which mark (;) indicates a pause longer than a comma but shorter than a full stop?",
      correct: 'अर्द्धविराम (;)',
      wrongs: ['अल्पविराम (,)', 'उपविराम (:)', 'पूर्णविराम (।)'],
      expH: 'वाक्य के मध्य आधे ठहराव को दर्शाने वाला (;) चिह्न अर्द्धविराम कहलाता है।',
      expE: 'Semicolon (;) marks an intermediate pause called Arddhviram.',
    },
    {
      qH: "किसी महापुरुष के कथन को ज्यों-का-त्यों उद्धृत करने के लिए किस विराम-चिह्न का प्रयोग आवश्यक है?",
      qE: "Which punctuation marks enclose a direct verbatim quote?",
      correct: 'दोहरा उद्धरण चिह्न (“...”)',
      wrongs: ['लाघव चिह्न (॰)', 'विस्मयादिबोधक चिह्न (!)', 'हंसपद चिह्न (^)'],
      expH: 'किसी वक्ता के मूल शब्दों को बिना बदलाव के प्रस्तुत करने के लिए दोहरा उद्धरण चिह्न (“...”) लगता है।',
      expE: 'Double quotation marks preserve exact verbatim speech.',
    },
  ],

  paryayvachi: [
    {
      qH: "'सरिता, तटिनी, तरंगिणी' किस शब्द के प्रसिद्ध पर्यायवाची हैं?",
      qE: "'सरिता, तटिनी, तरंगिणी' are synonyms of which Hindi noun?",
      correct: 'नदी',
      wrongs: ['समुद्र', 'पर्वत', 'नौका'],
      expH: "'सरिता, तटिनी, तरंगिणी, प्रवाहिनी' सभी नदी के पर्यायवाची शब्द हैं।",
      expE: 'All three mean river (नदी).',
    },
    {
      qH: "'दिनकर, दिवाकर, भास्कर' निम्नलिखित में से किसके समानार्थी हैं?",
      qE: "'दिनकर, दिवाकर, भास्कर' are synonyms for which word?",
      correct: 'सूर्य',
      wrongs: ['चंद्रमा', 'तारा', 'अग्नि'],
      expH: 'प्रकाश व दिन करने के कारण ये सभी सूर्य के पर्यायवाची हैं।',
      expE: 'All denote the Sun (सूर्य).',
    },
    {
      qH: "निम्नलिखित में से कौन-सा शब्द 'कमल' का पर्यायवाची नहीं है?",
      qE: "Which of the following is NOT a synonym of 'कमल' (lotus)?",
      correct: 'जलद (यह बादल का पर्याय है)',
      wrongs: ['पंकज', 'जलज', 'राजीव'],
      expH: "'ज' (जन्म लेने वाला) लगने से जलज = कमल बनता है, जबकि 'द' (देने वाला) लगने से जलद = बादल बनता है।",
      expE: "'जलद' means water-giver (cloud), whereas 'पंकज, जलज, राजीव' mean lotus.",
    },
    {
      qH: "'वायु' शब्द का सटीक पर्यायवाची समूह चुनिए:",
      qE: "Select the accurate synonym set for 'वायु' (wind):",
      correct: 'पवन, समीर, अनिल',
      wrongs: ['अनल, पावक, दहन', 'नीर, तोय, वारि', 'व्योम, गगन, अंबर'],
      expH: "'अनिल' का अर्थ हवा है (जबकि 'अनल' आग है)। पवन और समीर भी वायु के पर्याय हैं।",
      expE: "'पवन, समीर, अनिल' all denote wind/air.",
    },
    {
      qH: "'रात्रि' के पर्यायवाची शब्दों का शुद्ध समूह कौन-सा है?",
      qE: "Choose the valid synonym group for 'रात्रि' (night):",
      correct: 'निशा, रजनी, यामिनी',
      wrongs: ['ऊषा, प्रभात, भोर', 'सलिल, अम्बु, उदक', 'गिरि, शैल, नग'],
      expH: "'निशा, रजनी, यामिनी, विभावरी' रात्रि के पर्यायवाची हैं।",
      expE: "'निशा, रजनी, यामिनी' mean night.",
    },
  ],

  vilom: [
    {
      qH: "'आकर्षण' शब्द का सही विलोम शब्द कौन-सा होगा?",
      qE: "What is the exact antonym of 'आकर्षण'?",
      correct: 'विकर्षण',
      wrongs: ['संकर्षण', 'प्रकर्षण', 'उत्कर्षण'],
      expH: "खिंचाव ('आकर्षण') का सटीक विपरीतार्थक शब्द 'विकर्षण' (दूरी या अलगाव) है।",
      expE: "'विकर्षण' (repulsion) is the exact opposite of 'आकर्षण' (attraction).",
    },
    {
      qH: "'अल्पज्ञ' (कम जानने वाला) का उपयुक्त विलोम शब्द चुनिए:",
      qE: "Select the opposite of 'अल्पज्ञ' (one knowing very little):",
      correct: 'सर्वज्ञ (सब कुछ जानने वाला)',
      wrongs: ['अज्ञ', 'मूर्ख', 'सुज्ञ'],
      expH: "'अल्प' (थोड़ा) के स्थान पर 'सर्व' (सब) जुड़कर 'सर्वज्ञ' विलोम बनता है।",
      expE: "'सर्वज्ञ' (omniscient) opposes 'अल्पज्ञ' (having limited knowledge).",
    },
    {
      qH: "'स्थावर' शब्द का मानक विलोम शब्द क्या है?",
      qE: "What is the standard antonym of 'स्थावर' (stationary/immovable)?",
      correct: 'जंगम',
      wrongs: ['चंचल', 'स्थिर', 'जड़'],
      expH: "एक स्थान पर स्थिर रहने वाला ('स्थावर') का तत्सम विलोम 'जंगम' (चलने-फिरने योग्य) होता है।",
      expE: "'जंगम' (movable/mobile) is the classical antonym of 'स्थावर'.",
    },
    {
      qH: "'उत्कर्ष' शब्द का सटीक विपरीतार्थक कौन-सा है?",
      qE: "Choose the accurate antonym of 'उत्कर्ष' (rise/prosperity):",
      correct: 'अपकर्ष',
      wrongs: ['सत्कर्ष', 'विकर्ष', 'निष्कर्ष'],
      expH: "ऊपर उठने ('उत्कर्ष') का विलोम नीचे गिरना या अवनति ('अपकर्ष') होता है।",
      expE: "'अपकर्ष' (decline) is the exact antonym of 'उत्कर्ष'.",
    },
    {
      qH: "'अनुराग' का सही विलोम शब्द चुनिए:",
      qE: "Select the accurate antonym of 'अनुराग' (affection/attachment):",
      correct: 'विराग',
      wrongs: ['सराग', 'पराग', 'चराग'],
      expH: "प्रेम व लगाव ('अनुराग') का विपरीतार्थक शब्द उदासीनता या वैराग्य ('विराग') है।",
      expE: "'विराग' (detachment) opposes 'अनुराग' (attachment).",
    },
  ],

  anek_shabd: [
    {
      qH: "'जो सबके हृदयों की बात जानता हो' — इसके लिए एक शब्द क्या होगा?",
      qE: "Select the one-word substitution for 'One who knows the thoughts within every heart':",
      correct: 'अंतर्यामी',
      wrongs: ['अल्पज्ञानी', 'परजीवी', 'मितभाषी'],
      expH: "सभी के मन की बात जानने वाले को 'अंतर्यामी' कहते हैं।",
      expE: "'अंतर्यामी' means omniscient knower of inner feelings.",
    },
    {
      qH: "'किए गए उपकार को न मानने वाला' वाक्यांश के लिए सटीक एक शब्द चुनिए:",
      qE: "Choose the one-word substitution for 'One who does not acknowledge favours received':",
      correct: 'कृतघ्न',
      wrongs: ['कृतज्ञ', 'कर्मठ', 'परोपकारी'],
      expH: "उपकार मानने वाला 'कृतज्ञ' तथा उपकार भुला देने वाला 'कृतघ्न' कहलाता है।",
      expE: "'कृतघ्न' means ungrateful; 'कृतज्ञ' means grateful.",
    },
    {
      qH: "'जो दूर तक की बात सोचता हो' — इसके लिए उपयुक्त शब्द कौन-सा है?",
      qE: "What single word describes 'One who foresees far into the future'?",
      correct: 'दूरदर्शी',
      wrongs: ['अदूरदर्शी', 'समीपदर्शी', 'समदर्शी'],
      expH: "भविष्य के परिणाम पहले ही देख लेने वाला 'दूरदर्शी' कहलाता है।",
      expE: "'दूरदर्शी' means far-sighted or visionary.",
    },
    {
      qH: "'जिसे कोई पराजित न कर सके (अर्थात् जीता न जा सके)' — इस वाक्यांश के लिए एक शब्द है:",
      qE: "Give one word for 'One who cannot be conquered or defeated':",
      correct: 'अजेय',
      wrongs: ['अल्पज्ञ', 'अनंत', 'परजीवी'],
      expH: "जिसे जीतना असंभव हो, उसे 'अजेय' कहते हैं।",
      expE: "'अजेय' means invincible / unconquerable.",
    },
    {
      qH: "'कम बोलने वाला' व्यक्ति के लिए मानक एक शब्द क्या होगा?",
      qE: "Select the standard one-word term for 'One who speaks sparingly':",
      correct: 'मितभाषी',
      wrongs: ['वाचाल', 'मूक', 'मृदुभाषी'],
      expH: "'मित' का अर्थ है नपा-तुला या कम; अतः कम बोलने वाला 'मितभाषी' और अधिक बोलने वाला 'वाचाल' कहलाता है।",
      expE: "'मितभाषी' means reticent/measured in speech.",
    },
  ],

  shabd_vichar: [
    {
      qH: "'चतुर्भुज, जलज, हिमालय' रचना (बनावट) की दृष्टि से किस शब्द-भेद के अंतर्गत आते हैं?",
      qE: "By word structure, words like 'चतुर्भुज, जलज, हिमालय' (having a specialized single meaning) belong to which class?",
      correct: 'योगरूढ़ शब्द',
      wrongs: ['रूढ़ शब्द', 'केवल देशज शब्द', 'विदेशी शब्द'],
      expH: "जो शब्द दो सार्थक खंडों से बनें पर किसी विशेष तीसरे अर्थ में रूढ़ हो जाएँ ('जलज' = कमल), वे योगरूढ़ शब्द कहलाते हैं।",
      expE: 'Compound words fixed to one specialized meaning are Yogroodh words.',
    },
    {
      qH: "संस्कृत के वे शब्द जो बिना किसी रूप-परिवर्तन के हिंदी में ज्यों-के-त्यों प्रयुक्त होते हैं, क्या कहलाते हैं?",
      qE: "Sanskrit words used verbatim in Hindi without phonetic modification are termed:",
      correct: 'तत्सम शब्द',
      wrongs: ['तद्भव शब्द', 'देशज शब्द', 'संकर शब्द'],
      expH: "'तत् + सम' (अर्थात् उसके समान) — जैसे अग्नि, दुग्ध, चंद्र, सूर्य तत्सम शब्द हैं।",
      expE: "'Tatsam' words retain their original Sanskrit spelling and form.",
    },
    {
      qH: "'टिकटघर' ('टिकट' अंग्रेजी + 'घर' हिंदी) उत्पत्ति के आधार पर किस श्रेणी का शब्द है?",
      qE: "By origin, 'टिकटघर' (English 'ticket' + Hindi 'घर') belongs to which word category?",
      correct: 'संकर शब्द',
      wrongs: ['तत्सम शब्द', 'तद्भव शब्द', 'रूढ़ शब्द'],
      expH: 'दो भिन्न भाषाओं के शब्दों के मेल से बने नए शब्द संकर शब्द कहलाते हैं।',
      expE: 'Hybrid words blended from two different languages are Sankar Shabd.',
    },
    {
      qH: "'दुग्ध' (तत्सम) का प्रचलित हिंदी तद्भव रूप निम्नलिखित में से कौन-सा है?",
      qE: "Identify the evolved Hindi Tadbhav form of the Sanskrit Tatsam word 'दुग्ध':",
      correct: 'दूध',
      wrongs: ['दही', 'दुगना', 'दूधारू'],
      expH: "संस्कृत के 'दुग्ध' से समय के साथ रूपांतरित होकर हिंदी में 'दूध' तद्भव शब्द बना।",
      expE: "'दूध' evolved phonetically into Hindi from Sanskrit 'दुग्ध'.",
    },
    {
      qH: "'थैला, लोटा, पगड़ी, खटखटाना' स्रोत की दृष्टि से किस वर्ग के शब्द हैं?",
      qE: "By etymology, 'थैला, लोटा, पगड़ी' belong to which origin class?",
      correct: 'देशज शब्द',
      wrongs: ['तत्सम शब्द', 'विदेशी शब्द', 'यौगिक तत्सम'],
      expH: 'क्षेत्रीय बोलियों और आम जनजीवन से हिंदी में आए स्थानीय शब्द देशज शब्द कहलाते हैं।',
      expE: 'Indigenous regional terms originating locally are Deshaj words.',
    },
  ],

  avikari: [
    {
      qH: "'चट्टान से पानी का झरना अचानक फूट पड़ा।' वाक्य में 'अचानक' कौन-सा अविकारी शब्द है?",
      qE: "In 'चट्टान से पानी का झरना अचानक फूट पड़ा।', identify the category of indeclinable 'अचानक'.",
      correct: 'रीतिवाचक क्रियाविशेषण',
      wrongs: ['कालवाचक क्रियाविशेषण', 'परिमाणवाचक क्रियाविशेषण', 'विस्मयादिबोधक'],
      expH: "क्रिया के घटित होने की विधि या ढंग ('अचानक') का बोध होने से यह रीतिवाचक क्रियाविशेषण है।",
      expE: "'अचानक' explains the manner in which the spring burst forth (Adverb of Manner).",
    },
    {
      qH: "'मैं भी आपके साथ वाद-विवाद प्रतियोगिता में चलूँगा।' यहाँ 'भी' कौन-सा अव्यय या निपात है?",
      qE: "In 'मैं भी आपके साथ वाद-विवाद प्रतियोगिता में चलूँगा।', identify the grammatical role of 'भी'.",
      correct: 'निपात (बलदायक अव्यय)',
      wrongs: ['समुच्चयबोधक', 'संबंधबोधक', 'कालवाचक क्रियाविशेषण'],
      expH: "'ही, भी, तो, तक, मात्र' जैसे शब्द किसी पद पर विशेष बल देने के लिए प्रयुक्त होने पर निपात कहलाते हैं।",
      expE: "Emphatic particles like 'भी' are classified as Nipat.",
    },
    {
      qH: "'पुस्तकालय के भीतर शांत वातावरण रहता है।' में 'के भीतर' किस अविकारी भेद को दर्शाता है?",
      qE: "In 'पुस्तकालय के भीतर शांत वातावरण रहता है।', what type of indeclinable is 'के भीतर'?",
      correct: 'संबंधबोधक अव्यय',
      wrongs: ['समुच्चयबोधक अव्यय', 'विस्मयादिबोधक अव्यय', 'निपात'],
      expH: "संज्ञा ('पुस्तकालय') के बाद जुड़कर उसका वाक्य के अन्य पदों से संबंध बताने वाला पदबंध 'के भीतर' संबंधबोधक है।",
      expE: "Postpositional phrases following a noun ('के भीतर') are Sambandhbodhak Avyay.",
    },
    {
      qH: "'शाबाश! तुमने कठिन गणित प्रश्न हल कर दिया।' इसमें 'शाबाश!' क्या है?",
      qE: "Identify 'शाबाश!' in 'शाबाश! तुमने कठिन गणित प्रश्न हल कर दिया।':",
      correct: 'हर्ष/प्रशंसाबोधक विस्मयादिबोधक अव्यय',
      wrongs: ['संबंधबोधक अव्यय', 'समुच्चयबोधक अव्यय', 'परिमाणवाचक क्रियाविशेषण'],
      expH: 'प्रशंसा और उत्साह के तीव्र भाव प्रकट करने वाला अव्यय विस्मयादिबोधक कहलाता है।',
      expE: 'Interjection expressing praise/applause is Vismayadibodhak.',
    },
    {
      qH: "'कम बोलो पर सार्थक बोलो।' वाक्य में 'पर' शब्द किस अव्यय श्रेणी का उदाहरण है?",
      qE: "In 'कम बोलो पर सार्थक बोलो।', what type of Avyay is 'पर'?",
      correct: 'समुच्चयबोधक अव्यय',
      wrongs: ['निपात', 'संबंधबोधक अव्यय', 'स्थानवाचक क्रियाविशेषण'],
      expH: "दो कथनों या उपवाक्यों ('कम बोलो' और 'सार्थक बोलो') को जोड़ने वाला 'पर' समुच्चयबोधक अव्यय है।",
      expE: "'पर' joins two clauses as a conjunction (Samuchchayabodhak).",
    },
  ],

  anekarthi: [
    {
      qH: "'अंबर' अनेकार्थी शब्द के दो प्रचलित और सटीक अर्थ कौन-से हैं?",
      qE: "Identify two valid meanings of the polysemous Hindi word 'अंबर':",
      correct: 'आकाश और वस्त्र (कपड़ा)',
      wrongs: ['पर्वत और नदी', 'सोना और गेहूँ', 'तीर और बाण'],
      expH: "'अंबर' का प्रयोग 'पीतांबर' में वस्त्र के लिए और 'नीलांबर/अंबर' में आकाश के लिए होता है।",
      expE: "'अंबर' means both sky and cloth/garment.",
    },
    {
      qH: "'कर' अनेकार्थी शब्द के अंतर्गत निम्नलिखित में से कौन-से अर्थ आते हैं?",
      qE: "Which meanings correspond to the polysemous word 'कर'?",
      correct: 'हाथ, टैक्स (लगान), और सूर्य की किरण',
      wrongs: ['वृक्ष, फल, और जड़', 'नौका, समुद्र, और किनारा', 'राजा, मंत्री, और सेना'],
      expH: "'कर' के प्रमुख अर्थ हैं — हाथ (जैसे कर-कमल), राज्य कर (Tax), हाथी की सूँड़ तथा किरण।",
      expE: "'कर' denotes hand, tax/duty, and ray of light.",
    },
    {
      qH: "'सोना और धतूरा' किस एक प्रसिद्ध अनेकार्थी शब्द के दो अलग अर्थ हैं?",
      qE: "Which single Hindi word means both 'gold' and 'datura (thorn-apple)'?",
      correct: 'कनक',
      wrongs: ['वर', 'अर्थ', 'पत्र'],
      expH: "'कनक कनक ते सौ गुनी...' प्रसिद्ध दोहे में 'कनक' के दो अर्थ सोना और धतूरा प्रयुक्त हुए हैं।",
      expE: "'कनक' notoriously carries both meanings in Yamak Alankar.",
    },
    {
      qH: "'पत्र' शब्द का उपयोग चिट्ठी के अतिरिक्त और किस सटीक अर्थ में किया जाता है?",
      qE: "Besides a letter, what else does the polysemous word 'पत्र' mean?",
      correct: 'वृक्ष का पत्ता',
      wrongs: ['गहरा कुआँ', 'कठोर पत्थर', 'ऊँचा शिखर'],
      expH: "'पत्र' के मुख्य अनेकार्थी अर्थ चिट्ठी, पत्ता (पर्ण) और समाचार-पत्र का पृष्ठ हैं।",
      expE: "'पत्र' means both letter/document and leaf.",
    },
    {
      qH: "'कल' शब्द के प्रचलित दो भिन्न अर्थों की सही जोड़ी कौन-सी है?",
      qE: "Choose the valid pair of meanings for the polysemous word 'कल':",
      correct: 'बीता/आने वाला दिन और मशीन (यंत्र) या चैन',
      wrongs: ['तालाब और झरना', 'बादल और बिजली', 'सवेरा और दोपहर'],
      expH: "'कल' का अर्थ समय (कल-परसों), यंत्र ('कल-पुर्ज़े') और सुख-चैन ('कल पड़ना') होता है।",
      expE: "'कल' signifies yesterday/tomorrow, machine, and peace/relief.",
    },
  ],

  shrutisam: [
    {
      qH: "श्रुतिसमभिन्नार्थक शब्द-युग्म 'अनल – अनिल' के क्रमशः सही अर्थ कौन-से हैं?",
      qE: "Identify the respective meanings of the homophone pair 'अनल – अनिल':",
      correct: 'आग – हवा (वायु)',
      wrongs: ['पानी – पृथ्वी', 'हवा – आग', 'आकाश – धरती'],
      expH: "'अनल' का अर्थ अग्नि (आग) है और 'अनिल' का अर्थ हवा (पवन) है।",
      expE: "'अनल' = Fire; 'अनिल' = Wind.",
    },
    {
      qH: "'कुल – कूल' शब्द-युग्म में क्रमशः अंतर स्पष्ट कीजिए:",
      qE: "Distinguish accurately between 'कुल' and 'कूल':",
      correct: 'वंश या सारा (जोड़) – नदी का किनारा (तट)',
      wrongs: ['ठंडा – गरम', 'किला – बंदरगाह', 'किनारा – वंश'],
      expH: "ह्रस्व उ ('कुल') = वंश/समस्त, जबकि दीर्घ ऊ ('कूल') = तट या किनारा।",
      expE: "'कुल' means lineage/total, while 'कूल' means bank/shore.",
    },
    {
      qH: "'नीर' और 'नीड़' श्रुतिसमभिन्नार्थक शब्दों के क्रमशः सटीक अर्थ चुनिए:",
      qE: "Choose the accurate respective meanings of 'नीर' and 'नीड़':",
      correct: 'जल (पानी) – पक्षी का घोंसला',
      wrongs: ['घोंसला – जल', 'कमल – बादल', 'तालाब – आकाश'],
      expH: "'नीर' पानी का पर्याय है और 'नीड़' चिड़ियों के घोंसले को कहते हैं।",
      expE: "'नीर' = Water; 'नीड़' = Bird's nest.",
    },
    {
      qH: "'अपेक्षा – उपेक्षा' शब्द-युग्म का सही अर्थ-क्रम क्या है?",
      qE: "Identify the correct meaning order for 'अपेक्षा – उपेक्षा':",
      correct: 'आशा या तुलना – तिरस्कार या अनदेखी',
      wrongs: ['अनदेखी – आशा', 'प्रशंसा – सम्मान', 'दुःख – सुख'],
      expH: "'अपेक्षा' का अर्थ उम्मीद या किसी की तुलना में होता है, जबकि 'उपेक्षा' का अर्थ तिरस्कार या ध्यान न देना है।",
      expE: "'अपेक्षा' = expectation/comparison; 'उपेक्षा' = neglect/disregard.",
    },
    {
      qH: "'दिन – दीन' युग्म के क्रमशः शुद्ध अर्थ चुनिए:",
      qE: "Pick the accurate respective meanings of 'दिन – दीन':",
      correct: 'दिवस – गरीब (दरिद्र)',
      wrongs: ['गरीब – दिवस', 'रात – अमीर', 'सूर्य – चंद्र'],
      expH: "ह्रस्व इ ('दिन') = दिवस, और दीर्घ ई ('दीन') = निर्धन या असहाय व्यक्ति।",
      expE: "'दिन' means day; 'दीन' means poor/humble.",
    },
  ],

  pad_parichay: [
    {
      qH: "'सच्चे मित्र सदैव संकट में साथ देते हैं।' इस वाक्य में 'सच्चे' पद का सटीक पद-परिचय क्या है?",
      qE: "Give the accurate Pad-Parichay of 'सच्चे' in 'सच्चे मित्र सदैव संकट में साथ देते हैं।':",
      correct: 'गुणवाचक विशेषण, पुल्लिंग, बहुवचन, विशेष्य — मित्र',
      wrongs: [
        'व्यक्तिवाचक संज्ञा, एकवचन, कर्ता कारक',
        'क्रियाविशेषण, अविकारी, स्त्रीलिंग',
        'निजवाचक सर्वनाम, एकवचन',
      ],
      expH: "'सच्चे' यहाँ बहुवचन पुल्लिंग संज्ञा 'मित्र' के गुण की विशेषता बता रहा है।",
      expE: "'सच्चे' is a masculine plural adjective of quality modifying 'मित्र'.",
    },
    {
      qH: "'रोहित प्रतिदिन प्रातः टहलता है।' वाक्य में 'प्रातः' शब्द का पद-परिचय चुनिए:",
      qE: "Select the accurate Pad-Parichay of 'प्रातः' in 'रोहित प्रतिदिन प्रातः टहलता है।':",
      correct: 'कालवाचक क्रियाविशेषण (अव्यय), क्रिया — टहलता है की समय-सूचक विशेषता',
      wrongs: [
        'जातिवाचक संज्ञा, पुल्लिंग, एकवचन',
        'संबंधवाचक सर्वनाम, बहुवचन',
        'गुणवाचक विशेषण, स्त्रीलिंग',
      ],
      expH: "'प्रातः' टहलने की क्रिया का समय दर्शाने वाला अविकारी कालवाचक क्रियाविशेषण है।",
      expE: "'प्रातः' is an indeclinable temporal adverb modifying 'टहलता है'.",
    },
    {
      qH: "'वह कल स्वयं विद्यालय जाएगा।' इसमें 'वह' पद का पद-परिचय कौन-सा होगा?",
      qE: "Give the Pad-Parichay of 'वह' in 'वह कल स्वयं विद्यालय जाएगा।':",
      correct: 'अन्य पुरुषवाचक सर्वनाम, पुल्लिंग, एकवचन, कर्ता कारक',
      wrongs: [
        'सार्वनामिक विशेषण, स्त्रीलिंग, कर्म कारक',
        'गुणवाचक विशेषण, बहुवचन',
        'अनिश्चयवाचक सर्वनाम, बहुवचन',
      ],
      expH: "'वह' किसी तीसरे व्यक्ति के लिए स्वतंत्र रूप से कर्ता के पद पर आया है और क्रिया 'जाएगा' पुल्लिंग एकवचन है।",
      expE: "'वह' stands independently as 3rd-person singular masculine subject.",
    },
    {
      qH: "'माँ ने बालिका को मिठाई खिलाई।' वाक्य में 'खिलाई' पद का शुद्ध पद-परिचय बताइए:",
      qE: "Select the accurate Pad-Parichay for 'खिलाई' in 'माँ ने बालिका को मिठाई खिलाई।':",
      correct: 'सकर्मक क्रिया, सामान्य भूतकाल, स्त्रीलिंग, एकवचन, कर्तृवाच्य',
      wrongs: [
        'अकर्मक क्रिया, भविष्यत् काल, पुल्लिंग',
        'भाववाचक संज्ञा, बहुवचन',
        'गुणवाचक विशेषण, पुल्लिंग',
      ],
      expH: "'खिलाई' में दो कर्म मौजूद हैं (या कर्म मिठाई स्त्रीलिंग एकवचन है), सामान्य भूतकाल और कर्तृवाच्य है।",
      expE: "'खिलाई' is a transitive verb in simple past, feminine singular.",
    },
    {
      qH: "'आहा! कितना सुहावना मौसम है।' इसमें 'आहा!' का पद-परिचय क्या होगा?",
      qE: "Identify the Pad-Parichay of 'आहा!' in 'आहा! कितना सुहावना मौसम है।':",
      correct: 'विस्मयादिबोधक अव्यय, हर्षसूचक भाव',
      wrongs: [
        'समुच्चयबोधक अव्यय, कारणवाचक',
        'व्यक्तिवाचक संज्ञा, एकवचन',
        'संख्यावाचक विशेषण, बहुवचन',
      ],
      expH: "'आहा!' अविकारी शब्द है जो मन की प्रसन्नता (हर्ष) व्यक्त करता है।",
      expE: "'आहा!' is an interjection indicating joy/delight.",
    },
  ],

  visheshan_nirman: [
    {
      qH: "'इतिहास' संज्ञा शब्द से निर्मित शुद्ध विशेषण शब्द कौन-सा है?",
      qE: "Choose the accurately spelled adjective derived from the noun 'इतिहास':",
      correct: 'ऐतिहासिक',
      wrongs: ['इतिहासित', 'इतिहासिक', 'ऐतिहासीक'],
      expH: "'इतिहास + इक' जुड़ने से प्रथम 'इ' का 'ऐ' में रूपांतरण होकर 'ऐतिहासिक' बनता है।",
      expE: "'इतिहास' + '-इक' causes initial vowel strengthening to 'ऐतिहासिक'.",
    },
    {
      qH: "'भूगोल' शब्द का मानक विशेषण रूप निम्नलिखित में से क्या होगा?",
      qE: "Select the standard adjective form derived from 'भूगोल':",
      correct: 'भौगोलिक',
      wrongs: ['भूगोलिक', 'भूगोलीय', 'भौगोलित'],
      expH: "'भूगोल + इक' में 'ऊ' का 'औ' में परिवर्तन होकर शुद्ध विशेषण 'भौगोलिक' बनता है।",
      expE: "'भूगोल' + '-इक' produces 'भौगोलिक'.",
    },
    {
      qH: "'दया' भाववाचक संज्ञा से बनने वाला उपयुक्त विशेषण कौन-सा है?",
      qE: "Which adjective is formed from 'दया' (compassion)?",
      correct: 'दयालु',
      wrongs: ['दयापन', 'दयित', 'दयाता'],
      expH: "'दया' शब्द में 'आलु' प्रत्यय जोड़कर 'दयालु' विशेषण बनाया जाता है।",
      expE: "Suffix '-आलु' derives the adjective 'दयालु'.",
    },
    {
      qH: "'राष्ट्र' शब्द से बनने वाला शुद्ध विशेषण पहचानिए:",
      qE: "Select the accurate adjective derived from 'राष्ट्र':",
      correct: 'राष्ट्रीय',
      wrongs: ['राष्ट्रिय', 'राष्ट्रीक', 'राष्ट्रीयता'],
      expH: "'राष्ट्र + ईय' से 'राष्ट्रीय' विशेषण बनता है (जबकि 'राष्ट्रीयता' भाववाचक संज्ञा है)।",
      expE: "'राष्ट्र' + '-ईय' forms adjective 'राष्ट्रीय'; '-ता' turns it into an abstract noun.",
    },
    {
      qH: "'समाज' संज्ञा से सही विशेषण निर्माण चुनिए:",
      qE: "Which is the properly derived adjective from 'समाज'?",
      correct: 'सामाजिक',
      wrongs: ['समाजिक', 'समाजीय', 'सामजिक'],
      expH: "'समाज + इक' से प्रथम 'अ' दीर्घ 'आ' में बदलकर 'सामाजिक' बनता है।",
      expE: "'समाज' + '-इक' strengthens initial 'अ' to 'आ', giving 'सामाजिक'.",
    },
  ],

  vartani_shuddhi: [
    {
      qH: "ICSE परीक्षा की दृष्टि से निम्न में से कौन-सी वर्तनी पूर्णतः शुद्ध है?",
      qE: "Choose the completely accurate spelling of the word meaning 'blessing':",
      correct: 'आशीर्वाद',
      wrongs: ['आर्शीवाद', 'आशिर्वाद', 'आशीरवाद'],
      expH: "'आशीः + वाद' (विसर्ग संधि) में 'व' के ऊपर रेफ (र्) लगता है — 'आशीर्वाद' शुद्ध है।",
      expE: "The r-hook (रेफ) goes over 'व', making 'आशीर्वाद' accurate.",
    },
    {
      qH: "'अंत्याक्षरी' / 'अंताक्षरी' में से मानक शुद्ध वर्तनी वाले विकल्प का चयन कीजिए:",
      qE: "Select the standard pure Hindi spelling:",
      correct: 'अंत्याक्षरी',
      wrongs: ['अंताक्षरी', 'अंतेक्षरी', 'अंत्याक्षरि'],
      expH: "'अन्त्य + अक्षरी' (अंतिम अक्षर से आरंभ होने वाली) मिलकर दीर्घ संधि से 'अंत्याक्षरी' बनता है।",
      expE: "'अन्त्य + अक्षरी' forms 'अंत्याक्षरी'.",
    },
    {
      qH: "निम्नलिखित में से शुद्ध वर्तनी वाला शब्द चुनिए:",
      qE: "Identify the correctly spelled word meaning 'eminent/celebrated' (or 'practically/poetess'):",
      correct: 'पूजनीय',
      wrongs: ['पुजनीय', 'पूज्यनीय', 'पूजनिय'],
      expH: "शुद्ध रूप या तो 'पूज्य' होता है अथवा 'पूजनीय'; 'पूज्यनीय' सदैव अशुद्ध माना जाता है।",
      expE: "Either 'पूज्य' or 'पूजनीय' is valid; 'पूज्यनीय' is an invalid hybrid.",
    },
    {
      qH: "सही वर्तनी की पहचान कीजिए (सन् + न्यासी):",
      qE: "Choose the strictly accurate spelling of 'renunciant' (सम् + न्यासी):",
      correct: 'संन्यासी',
      wrongs: ['सन्यासी', 'संयासी', 'सन्न्यासी'],
      expH: "अनुस्वार (ं) और आधा 'न्' दोनों साथ रहते हैं ('सम् + न्यासी = संन्यासी')।",
      expE: "Both anusvara and half 'न्' appear together in 'संन्यासी'.",
    },
    {
      qH: "निम्न में से किस विकल्प की वर्तनी शत-प्रतिशत शुद्ध है?",
      qE: "Which of these spellings for 'renaissance/awakening' is completely accurate?",
      correct: 'जागृति',
      wrongs: ['जाग्रति', 'जग्रिती', 'जागृतता'],
      expH: "संज्ञा रूप में 'ऋ' की मात्रा लगकर 'जागृति' शुद्ध होता है (जबकि विशेषण 'जाग्रत' है)।",
      expE: "'जागृति' uses the vowel sign ृ properly as the abstract noun form.",
    },
  ],

  vakya_shuddhi: [
    {
      qH: "अशुद्ध वाक्य 'दही खट्टी है।' का व्याकरणिक रूप से शुद्ध संशोधन चुनिए:",
      qE: "Correct the grammatical error in 'दही खट्टी है।':",
      correct: 'दही खट्टा है।',
      wrongs: ['दही खट्टी होती है।', 'दही खट्टे हैं।', 'दहियाँ खट्टी हैं।'],
      expH: "हिंदी व्याकरण में 'दही' पुल्लिंग शब्द माना जाता है, अतः विशेषण 'खट्टा' प्रयुक्त होगा।",
      expE: "'दही' is treated as masculine in standard Hindi, requiring 'खट्टा'.",
    },
    {
      qH: "'सारे देश भर में यह समाचार फैल गया।' इस वाक्य का शुद्ध परिष्कृत रूप क्या होगा?",
      qE: "Identify the error-free revision of 'सारे देश भर में यह समाचार फैल गया।':",
      correct: 'देश भर में यह समाचार फैल गया।',
      wrongs: [
        'सारे देशभरों में समाचार फैल गया।',
        'सारे देश भर के अंदर समाचार फैल गई।',
        'पूरे देश भर में यह समाचारें फैल गईं।',
      ],
      expH: "'सारे' और 'भर' दोनों एक साथ अनावश्यक पुनरुक्ति दोष उत्पन्न करते हैं; एक का लोप करके लिखना शुद्ध है।",
      expE: "Using both 'सारे' and 'भर' is redundant; dropping 'सारे' fixes the duplication.",
    },
    {
      qH: "अशुद्ध वाक्य 'वह सोमवार के दिन वापस लौटेगा।' को शुद्ध कीजिए:",
      qE: "Select the accurate correction of 'वह सोमवार के दिन वापस लौटेगा।':",
      correct: 'वह सोमवार को लौटेगा।',
      wrongs: [
        'वह सोमवार के दिन वापिस लौट आएगा।',
        'वह सोमवार में लौटेगा।',
        'वह सोमवार दिन पर वापस लौटेगा।',
      ],
      expH: "'सोमवार' में पहले ही 'वार' (दिन) जुड़ा है और 'वापस' व 'लौटना' एक ही अर्थ देते हैं; अतः 'वह सोमवार को लौटेगा' शुद्ध है।",
      expE: "'सोमवार' already implies day and 'लौटना' implies returning; removing redundancies purifies the sentence.",
    },
    {
      qH: "'नेताजी ने जनता को संबोधित करी।' इस अशुद्ध वाक्य का सही रूप होगा:",
      qE: "Rectify the gender/agreement error in 'नेताजी ने जनता को संबोधित करी।':",
      correct: 'नेताजी ने जनता को संबोधित किया।',
      wrongs: [
        'नेताजी ने जनता को संबोधित करे।',
        'नेताजी को जनता ने संबोधित किया।',
        'नेताजी ने जनता से संबोधित की।',
      ],
      expH: "यहाँ संयुक्त क्रिया 'संबोधित किया' पुल्लिंग एकवचन रूप में प्रयुक्त होती है।",
      expE: "The compound verb takes the masculine singular 'संबोधित किया' here.",
    },
    {
      qH: "निम्न में से सर्वथा शुद्ध वाक्य का चयन कीजिए:",
      qE: "Select the grammatically flawless sentence:",
      correct: 'देश सदा महात्मा गांधी का आभारी रहेगा।',
      wrongs: [
        'महात्मा गांधी की देश सदा आभारी रहेगा।',
        'गांधी जी के ऊपर देश हमेशा आभारी रहेगा।',
        'महात्मा गांधी पर देश सदा आभारी रहेंगे।',
      ],
      expH: "यहाँ कर्ता ('देश'), संबंध ('महात्मा गांधी का') और क्रिया ('रहेगा') का पदक्रम एवं लिंग-वचन पूर्णतः शुद्ध है।",
      expE: 'Proper subject-verb agreement and postposition usage make this sentence error-free.',
    },
  ],

  vakya_parivartan: [
    {
      qH: "'सूर्योदय हुआ और चिड़ियाँ चहचहाने लगीं।' इस संयुक्त वाक्य को सरल वाक्य में परिवर्तित कीजिए:",
      qE: "Transform the compound sentence 'सूर्योदय हुआ और चिड़ियाँ चहचहाने लगीं।' into a Simple Sentence:",
      correct: 'सूर्योदय होने पर चिड़ियाँ चहचहाने लगीं।',
      wrongs: [
        'जैसे ही सूर्योदय हुआ, चिड़ियाँ चहचहाने लगीं।',
        'जब सूर्योदय हुआ तब चिड़ियाँ चहचहाईं।',
        'सूर्योदय हुआ इसलिए चिड़ियाँ चहचहाती हैं।',
      ],
      expH: "संयोजक 'और' हटाकर एक ही मुख्य समापिका क्रिया रखने पर सरल वाक्य ('सूर्योदय होने पर...') बनता है।",
      expE: "Converting the first clause into a participle phrase creates one unified simple sentence.",
    },
    {
      qH: "'वह बाज़ार जाकर फल लाया।' इस सरल वाक्य का मिश्र वाक्य रूपांतरण चुनिए:",
      qE: "Transform 'वह बाज़ार जाकर फल लाया।' into a Complex Sentence:",
      correct: 'जब वह बाज़ार गया, तब फल लाया।',
      wrongs: [
        'वह बाज़ार गया और फल लाया।',
        'बाज़ार से उसके द्वारा फल लाए गए।',
        'वह बाज़ार गया किंतु फल नहीं लाया।',
      ],
      expH: "'जब...तब' व्यधिकरण योजक युग्म से एक आश्रित और एक प्रधान उपवाक्य जोड़ने पर मिश्र वाक्य बनता है।",
      expE: "Using 'जब...तब' creates a dependent clause linked to the main clause.",
    },
    {
      qH: "'प्रत्येक नागरिक को कर्तव्य निभाना चाहिए।' इसे निषेधवाचक (Negative) वाक्य में इस प्रकार बदलें कि मूल अर्थ न बदले:",
      qE: "Convert 'प्रत्येक नागरिक को कर्तव्य निभाना चाहिए।' into a negative form preserving meaning:",
      correct: 'किसी भी नागरिक को अपने कर्तव्य से विमुख नहीं होना चाहिए।',
      wrongs: [
        'नागरिक को कर्तव्य नहीं निभाना चाहिए।',
        'कोई भी नागरिक कर्तव्य नहीं निभाता है।',
        'नागरिक कर्तव्य क्यों नहीं निभाते?',
      ],
      expH: "अर्थ अपरिवर्तित रखते हुए निषेधवाचक में बदलने हेतु 'कर्तव्य से विमुख न होना' सटीक रूपांतरण है।",
      expE: "Double inversion ('कर्तव्य से विमुख नहीं होना') converts to negative while keeping the original intent intact.",
    },
    {
      qH: "'कश्मीर की सुंदरता अद्वितीय है।' इसका शुद्ध विस्मयादिबोधक रूपांतरण चुनिए:",
      qE: "Transform 'कश्मीर की सुंदरता अद्वितीय है।' into an Exclamatory Sentence:",
      correct: 'वाह! कश्मीर कितना सुंदर है!',
      wrongs: [
        'क्या कश्मीर सुंदर नहीं है?',
        'कश्मीर की सुंदरता कम हो सकती है।',
        'कश्मीर जाओ और सुंदरता देखो।',
      ],
      expH: "'वाह!' विस्मय सूचक अव्यय और विस्मयादिबोधक चिह्न (!) द्वारा आश्चर्य व प्रशंसा भाव प्रकट होता है।",
      expE: "Exclamatory particle 'वाह!' with exclamation punctuation expresses awe.",
    },
    {
      qH: "'मेहनत न करने के कारण उसे सफलता नहीं मिली।' इसे संयुक्त वाक्य में बदलिए:",
      qE: "Convert 'मेहनत न करने के कारण उसे सफलता नहीं मिली।' into a Compound Sentence:",
      correct: 'उसने मेहनत नहीं की, इसलिए उसे सफलता नहीं मिली।',
      wrongs: [
        'क्योंकि उसने मेहनत नहीं की, अतः असफल रहा।',
        'यदि वह मेहनत करता तो सफल होता।',
        'मेहनतहीन व्यक्ति को सफलता नहीं मिलती।',
      ],
      expH: "'इसलिए' समानाधिकरण योजक दो स्वतंत्र उपवाक्यों को जोड़कर संयुक्त वाक्य बनाता है।",
      expE: "Coordinating 'इसलिए' links two independent clauses into a compound sentence.",
    },
  ],

  shabd_bhandar: [
    {
      qH: "'जिसका कोई शत्रु न जन्मा हो' — इस वाक्यांश के लिए एक उपयुक्त शब्द चुनिए:",
      qE: "Choose the one-word substitution for 'One who has no enemies born':",
      correct: 'अजातशत्रु',
      wrongs: ['अजेय', 'निराकार', 'शत्रुघ्न'],
      expH: "शत्रु के जन्म से रहित अर्थात् जिसका कोई शत्रु न हो — 'अजातशत्रु' कहलाता है।",
      expE: "'अजातशत्रु' literally means one without any enemies.",
    },
    {
      qH: "'उदार' शब्द का सटीक विलोम निम्नलिखित में से क्या होगा?",
      qE: "Select the exact antonym of 'उदार' (generous):",
      correct: 'अनुदार (या कृपण)',
      wrongs: ['दयालु', 'विनम्र', 'सज्जन'],
      expH: "'उदार' का उपसर्ग-निर्मित सीधा विलोम 'अनुदार' (संकीर्ण मन वाला) है।",
      expE: "'अनुदार' directly negates 'उदार' with prefix 'अन्'.",
    },
    {
      qH: "'अतिथि' शब्द का सही पर्यायवाची चुनिए:",
      qE: "Identify the synonym for 'अतिथि' (guest):",
      correct: 'आगंतुक / अभ्यागत',
      wrongs: ['परिजन', 'सेवक', 'निवासी'],
      expH: 'बिना तिथि बताए आने वाला मेहमान (' + "'अतिथि') के पर्याय 'पाहुन, आगंतुक, अभ्यागत' हैं।",
      expE: "'आगंतुक' and 'अभ्यागत' denote a visitor/guest.",
    },
    {
      qH: "'पवन – पावन' श्रुतिसमभिन्नार्थक जोड़ी के सही अर्थ क्रमशः क्या हैं?",
      qE: "Identify the respective meanings of 'पवन – पावन':",
      correct: 'हवा (वायु) – पवित्र',
      wrongs: ['पवित्र – हवा', 'आग – पानी', 'वर्षा – बाढ़'],
      expH: "'पवन' वायु को कहते हैं जबकि 'पावन' का अर्थ शुद्ध या पवित्र होता है।",
      expE: "'पवन' = Wind; 'पावन' = Sacred/Pure.",
    },
    {
      qH: "'करुणा और दीनता के भावों को छूने वाला' वाक्यांश के लिए एक शब्द क्या होगा?",
      qE: "One-word term for 'Something that deeply touches the heart / evokes compassion':",
      correct: 'हृदयस्पर्शी / मर्मस्पर्शी',
      wrongs: ['सर्वव्यापी', 'अमर', 'निर्जीव'],
      expH: 'मन के मर्म को छू लेने वाला प्रसंग ' + "'मर्मस्पर्शी' या 'हृदयस्पर्शी' कहलाता है।",
      expE: "'मर्मस्पर्शी' means heart-touching/poignant.",
    },
  ],

  shabd_bhed: [
    {
      qH: "प्रयोग (विकार) के आधार पर शब्द के दो मुख्य भेद कौन-कौन से होते हैं?",
      qE: "Based on grammatical inflection (usage), what are the two main classes of words?",
      correct: 'विकारी और अविकारी शब्द',
      wrongs: ['तत्सम और तद्भव शब्द', 'रूढ़ और यौगिक शब्द', 'सार्थक और निरर्थक शब्द'],
      expH: 'लिंग, वचन व कारक के कारण रूप बदलने वाले विकारी (संज्ञा, सर्वनाम, विशेषण, क्रिया) तथा न बदलने वाले अविकारी (अव्यय) कहलाते हैं।',
      expE: 'Inflected (Vikari) and uninflected (Avikari) words are the two usage categories.',
    },
    {
      qH: "'तेज़ हवा ने पुराने वृक्ष को झकझोर दिया।' इसमें प्रयुक्त 'ने' और 'को' व्याकरण के किस वर्ग में आते हैं?",
      qE: "In 'तेज़ हवा ने पुराने वृक्ष को झकझोर दिया।', what word class do 'ने' and 'को' belong to?",
      correct: 'परसर्ग / कारक विभक्ति-चिह्न',
      wrongs: ['सहायक क्रिया', 'समुच्चयबोधक', 'गुणवाचक विशेषण'],
      expH: 'संज्ञा या सर्वनाम के साथ लगकर क्रिया से संबंध दर्शाने वाले चिह्न परसर्ग या कारक विभक्ति कहलाते हैं।',
      expE: "Case postpositions attached to nouns ('ने', 'को') are Parsarg / Karak markers.",
    },
    {
      qH: "'वापस आकर उसने चाय-वाय पी।' इसमें 'चाय-वाय' का 'वाय' अर्थ के आधार पर किस वर्ग में आता है?",
      qE: "In 'चाय-वाय', to which meaning-based class does the echo syllable 'वाय' belong?",
      correct: 'निरर्थक शब्द',
      wrongs: ['योगरूढ़ शब्द', 'तत्सम शब्द', 'भाववाचक संज्ञा'],
      expH: "अकेले प्रयोग करने पर 'वाय' का कोई स्वतंत्र अर्थ नहीं है, अतः यह निरर्थक शब्द है।",
      expE: "Echo-word particles without independent dictionary meaning are Nirarthak Shabd.",
    },
    {
      qH: "'जल्दी चलो वरना गाड़ी छूट जाएगी।' यहाँ 'वरना' किस शब्द-भेद को दर्शाता है?",
      qE: "In 'जल्दी चलो वरना गाड़ी छूट जाएगी।', identify the part of speech of 'वरना':",
      correct: 'समुच्चयबोधक अव्यय (विकारी नहीं)',
      wrongs: ['भाववाचक संज्ञा', 'निश्चयवाचक सर्वनाम', 'सकर्मक क्रिया'],
      expH: "'वरना, अन्यथा, या' दो उपवाक्यों के बीच विकल्प या परिणाम जोड़ने वाले समुच्चयबोधक अव्यय हैं।",
      expE: "'वरना' connects two clauses as an indeclinable conjunction.",
    },
    {
      qH: "चार प्रमुख विकारी शब्द-भेद कौन-से हैं?",
      qE: "Which set lists all four inflectional (Vikari) parts of speech in Hindi?",
      correct: 'संज्ञा, सर्वनाम, विशेषण, क्रिया',
      wrongs: [
        'संज्ञा, निपात, विस्मयादिबोधक, अव्यय',
        'क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक',
        'तत्सम, तद्भव, देशज, विदेशी',
      ],
      expH: 'संज्ञा, सर्वनाम, विशेषण और क्रिया रूप-परिवर्तनशील होने से विकारी शब्द-भेद हैं।',
      expE: 'Noun, Pronoun, Adjective, and Verb undergo inflection (Vikari).',
    },
  ],

  ashuddhi_shodhan: [
    {
      qH: "'कृपया अवकाश प्रदान करने की कृपा करें।' का पूर्णतः त्रुटिरहित शुद्ध रूप चुनिए:",
      qE: "Select the error-free version of 'कृपया अवकाश प्रदान करने की कृपा करें।':",
      correct: 'कृपया अवकाश प्रदान करें।',
      wrongs: [
        'कृपा अवकाश प्रदान करने की कृपया करें।',
        'अवकाश प्रदान करने के लिए कृपा ही करें।',
        'कृपया अवकाश देने की कृपा अवश्य करें।',
      ],
      expH: "एक ही वाक्य में 'कृपया' और 'कृपा करें' दोनों का प्रयोग अनावश्यक पुनरुक्ति दोष है।",
      expE: "Removing the duplicate courtesy phrase fixes the redundancy.",
    },
    {
      qH: "'पुस्तकों में यह पुस्तक सबसे श्रेष्ठतम है।' वाक्य की अशुद्धि पहचानिए:",
      qE: "Identify the grammatical defect in 'पुस्तकों में यह पुस्तक सबसे श्रेष्ठतम है।':",
      correct: "'सबसे' और 'श्रेष्ठतम' दोनों का एक साथ प्रयोग अशुद्ध है",
      wrongs: [
        "'पुस्तक' शब्द स्त्रीलिंग नहीं है",
        "'पुस्तकों में' के स्थान पर 'पुस्तकों से' होना चाहिए",
        "वाक्य में कोई अशुद्धि नहीं है",
      ],
      expH: "'श्रेष्ठतम' स्वयं उत्तमावस्था (सर्वश्रेष्ठ) है, अतः इसके आगे 'सबसे' लगाना दोषपूर्ण है; शुद्ध रूप 'यह पुस्तक श्रेष्ठतम है' होगा।",
      expE: "'श्रेष्ठतम' is already superlative; pairing it with 'सबसे' is redundant.",
    },
    {
      qH: "नीचे लिखे वाक्यों में से अशुद्धि-मुक्त (शुद्ध) वाक्य का चुनाव कीजिए:",
      qE: "Select the grammatically pure sentence without errors:",
      correct: 'तुम्हें इस विषय पर गहराई से विचार करना चाहिए।',
      wrongs: [
        'तुमने इस विषय के ऊपर गहराई विचार करना चाहिए।',
        'तुम्हारे को इस विषय पर विचार करनी चाहिए।',
        'तेरे को इस विषय में गहराई सोचनी चाहिए।',
      ],
      expH: "'तुम्हें' सर्वनाम, 'पर' कारक और 'विचार करना चाहिए' क्रिया का संयोग पूर्णतः मानक है।",
      expE: "Proper pronoun case and verb agreement make this option error-free.",
    },
    {
      qH: "'एक पानी का गिलास लाओ।' इस वाक्य का अर्थ की दृष्टि से शुद्ध रूप क्या होगा?",
      qE: "Fix the modifier placement error in 'एक पानी का गिलास लाओ।':",
      correct: 'पानी का एक गिलास लाओ।',
      wrongs: [
        'पानी की एक गिलासें लाओ।',
        'एक पानी वाली गिलास लाओ।',
        'गिलास पानी एक लाओ।',
      ],
      expH: "संख्यावाचक 'एक' पानी के लिए नहीं बल्कि 'गिलास' के लिए है, अतः 'पानी का एक गिलास लाओ' शुद्ध है।",
      expE: "'एक' modifies 'गिलास' (one glass of water), not 'पानी'.",
    },
    {
      qH: "'मेरे पूज्यनीय पिताजी कल जयपुर जाएँगे।' में किस शब्द का शुद्ध रूप लिखा जाना चाहिए?",
      qE: "Spot the incorrectly spelled honorific word in 'मेरे पूज्यनीय पिताजी कल जयपुर जाएँगे।' and pick its correct form:",
      correct: 'पूजनीय (या पूज्य)',
      wrongs: ['पूजनिय', 'पुज्यनीय', 'पुजनीय'],
      expH: "मानक हिंदी वर्तनी में केवल 'पूजनीय' अथवा 'पूज्य' शुद्ध होता है; 'पूज्यनीय' अशुद्ध है।",
      expE: "Standard Hindi spelling allows 'पूजनीय' or 'पूज्य', never 'पूज्यनीय'.",
    },
  ],

  gadyansh: [
    {
      qH: "अपठित गद्यांश का उपयुक्त शीर्षक चुनते समय सबसे महत्वपूर्ण नियम क्या होना चाहिए?",
      qE: "What is the golden rule when choosing a suitable title for an unseen comprehension passage (Apathit Gadyansh)?",
      correct: 'शीर्षक संक्षिप्त, आकर्षक और संपूर्ण गद्यांश के मूल भाव से जुड़ा हो',
      wrongs: [
        'शीर्षक कम से कम तीन वाक्यों का लंबा विवरण हो',
        'शीर्षक गद्यांश की किसी एक अप्रासंगिक पंक्ति से बिना सोचे उठाया जाए',
        'शीर्षक का पाठ के विषय से कोई संबंध न हो',
      ],
      expH: "ICSE व सभी बोर्ड परीक्षाओं में शीर्षक 2 से 5 शब्दों का संक्षिप्त और केंद्रीय विचार पर आधारित होना चाहिए।",
      expE: 'An ideal title is brief, catchy, and captures the central theme.',
    },
    {
      qH: "किसी गद्यांश में 'प्रगतिशील समाज की नींव नैतिक शिक्षा होती है।' का भावार्थ क्या होगा?",
      qE: "What does the comprehension statement 'प्रगतिशील समाज की नींव नैतिक शिक्षा होती है।' imply?",
      correct: 'समाज के सच्चे विकास के लिए चरित्र व नैतिक मूल्यों का ज्ञान अनिवार्य आधार है',
      wrongs: [
        'भवन निर्माण में केवल ईंट और पत्थर महत्वपूर्ण हैं',
        'आधुनिक तकनीक के बिना नैतिकता व्यर्थ है',
        'विद्यालयों में केवल खेलकूद ही सिखाया जाना चाहिए',
      ],
      expH: "वाक्य का स्पष्ट आशय यह है कि उन्नत समाज तभी टिकता है जब नागरिकों में नैतिक मूल्य सुदृढ़ हों।",
      expE: 'Ethical education forms the bedrock of any progressive society.',
    },
    {
      qH: "'असफलता हमें अपनी कमज़ोरियाँ सुधारकर नए सिरे से प्रयास करने की प्रेरणा देती है।' — इस कथन से कौन-सा निष्कर्ष निकलता है?",
      qE: "Based on 'असफलता हमें अपनी कमज़ोरियाँ सुधारकर नए सिरे से प्रयास करने की प्रेरणा देती है।', what is the intended takeaway?",
      correct: 'असफलता से निराश न होकर उससे सीख लेते हुए पुनः प्रयास करना चाहिए',
      wrongs: [
        'असफल होने पर सदा के लिए कार्य छोड़ देना चाहिए',
        'प्रयास करने की कोई आवश्यकता नहीं है',
        'गलतियों को छिपाना ही सबसे बड़ी समझदारी है',
      ],
      expH: 'गद्यांश-बोध प्रश्नों में लेखक के सकारात्मक संदेश को सटीक शब्दों में पहचानना आवश्यक होता है।',
      expE: 'Failure serves as diagnostic feedback motivating renewed, wiser effort.',
    },
    {
      qH: "गद्यांश में प्रयुक्त शब्द 'निस्वार्थ' का संदर्भानुसार सही अर्थ क्या होता है?",
      qE: "In a passage, what is the contextual meaning of 'निस्वार्थ'?",
      correct: 'अपने निजी लाभ या स्वार्थ की भावना से रहित',
      wrongs: ['अत्यधिक लोभी', 'केवल धन कमाने वाला', 'स्वयं के बारे में सोचने वाला'],
      expH: "'निः + स्वार्थ' का अर्थ बिना किसी व्यक्तिगत लालच के दूसरों की भलाई करना है।",
      expE: "'निस्वार्थ' means selfless / devoid of personal greed.",
    },
    {
      qH: "अपठित गद्यांश के प्रश्नों का उत्तर लिखते समय कौन-सी सावधानी सबसे अधिक अंक दिलाती है?",
      qE: "Which answering strategy earns top marks in ICSE Apathit Gadyansh?",
      correct: 'प्रश्न के अनुसार गद्यांश के तथ्यों को अपनी सरल और सटीक भाषा में लिखना',
      wrongs: [
        'पूरा का पूरा गद्यांश हर उत्तर में शब्दशः उतार देना',
        'गद्यांश से बाहर की काल्पनिक कहानियाँ जोड़ देना',
        'केवल एक-एक अक्षर लिखकर उत्तर अधूरा छोड़ देना',
      ],
      expH: 'ICSE परीक्षक प्रश्न की मांग के अनुरूप स्पष्ट, व्याकरण-शुद्ध और अपने शब्दों में लिखे संक्षिप्त उत्तरों को पूर्ण अंक देते हैं।',
      expE: 'Rephrasing facts from the passage concisely in one’s own grammatically sound words scores best.',
    },
  ],

  nibandh: [
    {
      qH: "ICSE परीक्षा में एक आदर्श निबंध की संरचना किन तीन मुख्य भागों में क्रमबद्ध होनी चाहिए?",
      qE: "Into which three sequential parts must an ICSE essay (Nibandh) be structured?",
      correct: 'प्रस्तावना (भूमिका), विषय-विस्तार (मध्य भाग) और उपसंहार (निष्कर्ष)',
      wrongs: [
        'सेवा में, मुख्य विषय, और भवदीय',
        'केवल दो पंक्तियों का संवाद व हस्ताक्षर',
        'बॉक्स के भीतर दिनांक, स्थान और सूचक नाम',
      ],
      expH: 'निबंध में रोचक प्रस्तावना, तार्किक विषय-विस्तार (पक्ष-विपक्ष/उदाहरण) और प्रभावशाली उपसंहार आवश्यक होते हैं।',
      expE: 'An essay progresses cleanly through Introduction, Analytical Body, and Conclusion.',
    },
    {
      qH: "निबंध की प्रस्तावना (आरंभ) को परीक्षक के लिए सबसे आकर्षक बनाने का श्रेष्ठ तरीका क्या है?",
      qE: "What is the strongest technique to make an essay introduction captivating for the ICSE examiner?",
      correct: 'विषय से जुड़ी किसी सटीक सूक्ति, संक्षिप्त दोहे या प्रभावी प्रश्न से आरंभ करना',
      wrongs: [
        'सीधे लिखना कि "आज मुझे यह निबंध लिखने को मिला है"',
        'बिना विषय समझे अनावश्यक आंकड़े भर देना',
        'पत्र की तरह "सप्रेम नमस्ते" लिखकर शुरू करना',
      ],
      expH: 'प्रासंगिक सूक्ति या संवेदनशील दृश्य-चित्रण से आरंभ किया गया निबंध पहले ही वाक्य में उत्तम प्रभाव छोड़ता है।',
      expE: 'Opening with an apt maxim, couplet, or thought-provoking scenario elevates readability immediately.',
    },
    {
      qH: "कक्षा 9–10 ICSE बोर्ड में निबंध (Composition) की मानक शब्द-सीमा लगभग कितनी निर्धारित होती है?",
      qE: "What is the standard word limit for ICSE Classes 9–10 Essay / Composition?",
      correct: 'लगभग 250 शब्द',
      wrongs: ['केवल 30–40 शब्द', 'लगभग 1500 शब्द', 'केवल 10 शब्द'],
      expH: 'ICSE बोर्ड परीक्षा के प्रश्न १ में निबंध/कहानी लेखन के लिए लगभग 250 शब्दों की मानक सीमा निर्धारित होती है।',
      expE: 'ICSE Board specifies approximately 250 words for Composition.',
    },
    {
      qH: "विचारात्मक निबंध (जैसे 'विज्ञान वरदान या अभिशाप') लिखते समय संतुलित दृष्टिकोण कैसे दिखाएँ?",
      qE: "How do you maintain balanced evaluation in a reflective essay like 'Science: Boon or Bane'?",
      correct: 'लाभ और हानियों दोनों का निष्पक्ष विश्लेषण कर संवेदनशील समाधान पर समाप्त करना',
      wrongs: [
        'केवल एक ही पक्ष लिखकर दूसरे पक्ष को पूरी तरह नज़रअंदाज़ करना',
        'व्यक्तिगत पारिवारिक गपशप शामिल कर देना',
        'विषय बदलकर किसी त्यौहार का वर्णन करने लगना',
      ],
      expH: 'पक्ष और विपक्ष दोनों के ठोस उदाहरण देकर संतुलित उपसंहार प्रस्तुत करना उच्च-स्तरीय लेखन की पहचान है।',
      expE: 'Examining both merits and demerits before synthesizing a wise conclusion earns distinction marks.',
    },
    {
      qH: "निबंध में शीर्षकों या बिंदुओं (Bullet Points) के प्रयोग को लेकर ICSE बोर्ड का सही नियम क्या है?",
      qE: "What is the correct ICSE rule regarding bullet points/subheadings inside a Hindi essay?",
      correct: 'बुलेट बिंदुओं के बजाय सुसंबद्ध अनुच्छेदों (Paragraphs) में प्रवाहमय लेखन करना चाहिए',
      wrongs: [
        'पूरा निबंध नंबर 1, 2, 3 डालकर एक-एक शब्द की सूची में लिखना चाहिए',
        'प्रत्येक वाक्य के बाद बॉक्स बनाना अनिवार्य है',
        'केवल संवाद शैली में प्रश्न-उत्तर लिखने चाहिए',
      ],
      expH: 'निबंध साहित्यिक गद्य विधा है; इसे बुलेट लिस्ट की तरह नहीं, बल्कि अनुच्छेदों में बांधकर लिखा जाता है।',
      expE: 'Essays require cohesive flowing paragraphs rather than disjointed bulleted notes.',
    },
  ],

  kahani: [
    {
      qH: "ICSE परीक्षा में यदि कहानी के अंत में एक निश्चित वाक्य देने का निर्देश हो, तो क्या करना अनिवार्य है?",
      qE: "If an ICSE story prompt specifies an exact closing sentence, what must the student do?",
      correct: 'कहानी का अंत शब्दशः उसी दिए गए वाक्य पर स्वाभाविक रूप से समाप्त करना चाहिए',
      wrongs: [
        'उस वाक्य को सबसे पहले शीर्षक बनाकर छोड़ देना चाहिए',
        'वाक्य को बदलकर अपनी मर्ज़ी से कोई अन्य अंत लिखना चाहिए',
        'अंतिम वाक्य लिखने के बाद एक नया अध्याय और जोड़ देना चाहिए',
      ],
      expH: 'नियमानुसार निर्धारित आरंभिक या अंतिम पंक्ति को ठीक उसी रूप और स्थान पर प्रयुक्त करने से ही अंक सुरक्षित रहते हैं।',
      expE: 'Prescribed opening or closing lines must be placed verbatim at their exact required position.',
    },
    {
      qH: "कहानी लेखन में कथानक को रोचक और विश्वसनीय बनाने हेतु किस तत्व पर ध्यान देना आवश्यक है?",
      qE: "Which craft principle makes a story engaging and credible?",
      correct: 'स्पष्ट पात्र, स्वाभाविक संवाद, घटनाक्रम में उतार-चढ़ाव (चरम बिंदु) और तार्किक अंत',
      wrongs: [
        'बिना किसी प्रसंग के अवास्तविक जादुई चमत्कार जोड़ देना',
        'सारी घटनाएँ केवल निबंध की तरह एक भाषण में समेट देना',
        'एक ही वाक्य को दस बार दोहराना',
      ],
      expH: 'सजीव संवाद और कार्य-कारण संबंध से जुड़ा चरम मोड़ (Climax) कहानी को पाठक से जोड़ देता है।',
      expE: 'Lifelike dialogue, clear character motivation, and logical climax sustain narrative credibility.',
    },
    {
      qH: "लोकोक्ति पर आधारित कहानी (जैसे 'अंत भला तो सब भला') लिखते समय विषय से भटकाव से कैसे बचें?",
      qE: "How do you avoid straying off-topic when writing a proverb-based story?",
      correct: 'पूरी घटना और अंतिम मोड़ द्वारा उस कहावत के मूल संदेश को स्वाभाविक रूप से सिद्ध करना',
      wrongs: [
        'कहावत का केवल शब्दशः व्याकरण विश्लेषण लिखना',
        'पाँच अलग-अलग अधूरी कहानियाँ मिला देना',
        'कहावत का उल्लेख किए बिना केवल प्रकृति का वर्णन करना',
      ],
      expH: 'कथानक का केंद्र-बिंदु उसी लोकोक्ति के सत्य को चरितार्थ करने की ओर उन्मुख होना चाहिए।',
      expE: 'The plot resolution must naturally prove the proverb without turning into a dry lecture.',
    },
    {
      qH: "कहानी का शीर्षक और सीख (Moral) लिखते समय क्या बात ध्यान रखनी चाहिए?",
      qE: "What should be kept in mind regarding title and moral in a Hindi story?",
      correct: 'सार्थक संक्षिप्त शीर्षक और कहानी की घटनाओं से स्वतः निकलने वाली सटीक सीख',
      wrongs: [
        'पूरी कहानी जितना लंबा शीर्षक लिखना',
        'कहानी के विपरीत अर्थ वाली सीख लिख देना',
        'शीर्षक की जगह अपना घर का पता लिखना',
      ],
      expH: 'शीर्षक कहानी के केंद्रीय पात्र या घटना से जुड़ा होना चाहिए तथा सीख कथानक की स्वाभाविक परिणति होनी चाहिए।',
      expE: 'The title and moral must align directly with the core plot events.',
    },
    {
      qH: "कहानी लेखन में काल (Tense) के प्रयोग का सबसे सुरक्षित व प्रभावशाली नियम क्या है?",
      qE: "What is the cleanest grammatical rule for tense usage in Hindi storytelling?",
      correct: 'घटना-वर्णन प्रायः भूतकाल की सुसंगत धारा में रखना (संवाद पात्रानुसार वर्तमान में हो सकते हैं)',
      wrongs: [
        'प्रत्येक वाक्य में भूतकाल से भविष्यत् काल में कूदते रहना',
        'बिना किसी क्रिया के केवल संज्ञा शब्द लिखते रहना',
        'केवल भविष्यत् काल में पूरी पिछली घटना सुनाना',
      ],
      expH: 'कथावाचन में भूतकाल की एकरूपता कहानी के प्रवाह को टूटने नहीं देती।',
      expE: 'Maintaining consistent past narration while allowing direct speech in present keeps flow seamless.',
    },
  ],

  anuched: [
    {
      qH: "निबंध और अनुच्छेद लेखन (Anuched) के बीच सबसे बड़ा संरचनात्मक अंतर क्या है?",
      qE: "What is the primary structural distinction between a Nibandh (Essay) and an Anuched (Paragraph)?",
      correct: 'अनुच्छेद केवल एक ही सुगठित अनुच्छेद (Single Paragraph) में गागर में सागर भरने जैसा लिखा जाता है',
      wrongs: [
        'अनुच्छेद को दस अलग-अलग भागों और उपशीर्षकों में तोड़कर लिखा जाता है',
        'अनुच्छेद में हमेशा "सेवा में, प्रधानाचार्य" लिखना अनिवार्य है',
        'अनुच्छेद में कम से कम 500 शब्द लिखने होते हैं',
      ],
      expH: 'अनुच्छेद एक ही बंधे हुए पैराग्राफ (प्रायः 80–120 शब्द) में विषय के मुख्य बिंदुओं को सूत्रबद्ध करता है।',
      expE: 'An Anuched must remain one unified paragraph rather than split into multiple sections.',
    },
    {
      qH: "यदि प्रश्न-पत्र में अनुच्छेद के साथ 'संकेत-बिंदु' (Hints) दिए हों, तो उनका उपयोग कैसे करना चाहिए?",
      qE: "If hint points are supplied with an Anuched topic, how should they be woven in?",
      correct: 'सभी संकेत-बिंदुओं को बिना अलग हेडिंग डाले अनुच्छेद के वाक्यों में स्वाभाविक क्रम से पिरोना चाहिए',
      wrongs: [
        'संकेत-बिंदुओं को छोड़कर बिल्कुल अलग विषय चुन लेना चाहिए',
        'संकेत-बिंदुओं को मोटे अक्षरों में उपशीर्षक बनाकर टुकड़े कर देने चाहिए',
        'केवल संकेत-बिंदुओं की नकल करके छोड़ देना चाहिए',
      ],
      expH: 'संकेत-बिंदु विचारों की दिशा तय करते हैं; उन्हें एक ही अनुच्छेद की वाक्य-शृंखला में पिरोया जाता है।',
      expE: 'Hints guide flow sequentially within the single paragraph without being printed as subheadings.',
    },
    {
      qH: "एक उच्च-कोटि के अनुच्छेद के प्रथम और अंतिम वाक्य कैसे होने चाहिए?",
      qE: "How should the opening and closing sentences of a well-crafted Anuched read?",
      correct: 'प्रथम वाक्य सीधे मुख्य विषय को स्पष्ट करे तथा अंतिम वाक्य सारगर्भित निष्कर्ष प्रस्तुत करे',
      wrongs: [
        'प्रथम वाक्य अप्रासंगिक कहानी से शुरू हो और अंतिम वाक्य अधूरा छूट जाए',
        'अंतिम वाक्य में अपना रोल नंबर व पता लिखा जाए',
        'दोनों वाक्यों में एक ही बात शब्दशः दोहराई जाए',
      ],
      expH: 'कम शब्दों की सीमा के कारण अनुच्छेद में अनावश्यक भूमिका के बजाय सीधा, सटीक आरंभ व सधा हुआ समापन अंक दिलाता है।',
      expE: 'Tight topic focus from sentence one to a crisp conclusive takeaway maximizes clarity.',
    },
    {
      qH: "अनुच्छेद लेखन में शब्दों की सीमा का पालन करना क्यों आवश्यक माना जाता है?",
      qE: "Why is adhering strictly to the word limit critical in Anuched Lekhan?",
      correct: 'सीमित शब्दों में अनावश्यक विस्तार से बचते हुए सटीक अभिव्यक्ति की दक्षता परखी जाती है',
      wrongs: [
        'क्योंकि अधिक लिखने पर हर शब्द के अलग बोनस अंक मिलते हैं',
        'क्योंकि केवल पाँच शब्द ही लिखना पर्याप्त होता है',
        'ताकि पाठक मुख्य विषय को भूल जाए',
      ],
      expH: 'अनुच्छेद लेखन का उद्देश्य संक्षिप्त किंतु अर्थपूर्ण अभिव्यक्ति (80–120 शब्दों के भीतर) का विकास करना है।',
      expE: 'Anuched assesses concise, clutter-free expression within the allotted word limit.',
    },
    {
      qH: "अनुच्छेद लेखन की भाषा-शैली कैसी होनी चाहिए?",
      qE: "What language style suits ICSE Anuched Lekhan best?",
      correct: 'सरल, स्पष्ट, व्याकरण-शुद्ध और पुनरावृत्ति से मुक्त प्रवाहमयी भाषा',
      wrongs: [
        'अत्यंत बोझिल, अस्पष्ट और बार-बार दोहराई गई पंक्तियाँ',
        'अधूरे एसएमएस जैसे सांकेतिक शब्द',
        'पत्र शैली के औपचारिक अभिवादन वाक्यांश',
      ],
      expH: 'सटीक शब्द-चयन और सरल किंतु प्रभावशाली वाक्य अनुच्छेद को स्पष्ट और पठनीय बनाते हैं।',
      expE: 'Clear, idiomatic, repetition-free prose keeps the single paragraph crisp.',
    },
  ],

  patra: [
    {
      qH: "ICSE के नवीनतम मानक प्रारूप के अनुसार औपचारिक व अनौपचारिक दोनों पत्रों में सभी घटक किस ओर संरेखित (Align) किए जाते हैं?",
      qE: "According to the latest ICSE letter format, how should every component (address, date, salutation, closing) be aligned?",
      correct: 'संपूर्ण पत्र बाईं ओर (Left Alignment) हाशिए से सटाकर लिखा जाता है',
      wrongs: [
        'दिनांक सबसे दाएँ कोने में और पता बिल्कुल बीच में लिखा जाता है',
        'अभिवादन बीच में तथा समापन दाईं ओर लिखा जाता है',
        'संरेखण का कोई नियम नहीं होता',
      ],
      expH: 'आधुनिक ICSE प्रारूप में बाईं ओर एकसीध (Strict Left Alignment) में पूरा पत्र लिखना ही मानक और अंकदायी नियम है।',
      expE: 'Modern ICSE standard enforces strict left-margin alignment across the entire letter.',
    },
    {
      qH: "औपचारिक पत्र (जैसे प्रधानाचार्य या संपादक को पत्र) में 'विषय' (Subject) कहाँ लिखा जाता है?",
      qE: "Where does the 'विषय' (Subject line) appear in a formal Hindi letter?",
      correct: 'प्राप्तकर्ता के पते के ठीक बाद और संबोधन (' + 'महोदय) से ठीक पहले',
      wrongs: [
        'पत्र के सबसे अंत में ' + 'भवदीय के नीचे',
        'अनौपचारिक मित्र के पत्र के बिल्कुल बीच में',
        'केवल लिफाफे के बाहर',
      ],
      expH: 'औपचारिक पत्र में प्रेषक व प्राप्तकर्ता के पते के उपरांत स्पष्ट संक्षिप्त विषय लिखा जाता है; अनौपचारिक पत्र में विषय नहीं लिखा जाता।',
      expE: 'In formal letters, the concise subject sits right after the recipient address and before ' + 'महोदय.',
    },
    {
      qH: "अपने छोटे भाई को अनुशासन या समय-पालन की प्रेरणा देने हेतु अनौपचारिक पत्र में कौन-सा समापन उपयुक्त होगा?",
      qE: "Which sign-off is appropriate when writing an informal letter to a younger brother?",
      correct: 'तुम्हारा बड़ा भाई / शुभचिंतक',
      wrongs: [
        'भवदीय / निवेदक',
        'आपका आज्ञाकारी शिष्य',
        'प्रबंधक महोदय',
      ],
      expH: "बड़ों से छोटों को पत्र में 'तुम्हारा शुभचिंतक / तुम्हारा अग्रज' और शुभाशीष/स्नेह लिखा जाता है, जबकि 'भवदीय' केवल औपचारिक पत्र में आता है।",
      expE: "'तुम्हारा भाई / शुभचिंतक' fits informal family letters, whereas 'भवदीय' is strictly formal.",
    },
    {
      qH: "परीक्षा-भवन में बैठकर पत्र लिखते समय प्रेषक (अपना) नाम व पता के स्थान पर क्या लिखने का निर्देश रहता है?",
      qE: "While writing a letter in the ICSE exam hall, what should replace your real personal name and home address?",
      correct: 'परीक्षा भवन, क. ख. ग. नगर (तथा नाम की जगह क. ख. ग. या प्रश्न में दिया नाम)',
      wrongs: [
        'अपना वास्तविक मोबाइल नंबर और बैंक विवरण',
        'किसी मित्र के विद्यालय का गलत पता',
        'यह भाग लिखना बिल्कुल छोड़ दिया जाता है',
      ],
      expH: 'बोर्ड परीक्षा की गोपनीयता बनाए रखने हेतु वास्तविक पहचान के स्थान पर परीक्षा भवन व क. ख. ग. का उपयोग मानक नियम है।',
      expE: 'Exam rules mandate anonymous placeholders (' + 'परीक्षा भवन, क.ख.ग.) unless specified in the prompt.',
    },
    {
      qH: "प्रधानाचार्य को लिखे जाने वाले प्रार्थना-पत्र में शुद्ध समापन व स्वनिर्देश क्या होता है?",
      qE: "Choose the appropriate closing expression in an application addressed to the School Principal:",
      correct: 'आपका आज्ञाकारी शिष्य / आपकी आज्ञाकारिणी शिष्या',
      wrongs: [
        'तुम्हारा प्रिय मित्र',
        'सस्नेह नमस्ते',
        'चिरंजीवी रहो',
      ],
      expH: "गुरुजनों या प्रधानाचार्य को पत्र में सदैव विनम्र व आदरयुक्त 'आपका आज्ञाकारी शिष्य' (या छात्रा हेतु आज्ञाकारिणी शिष्या) लिखा जाता है।",
      expE: "'आपका आज्ञाकारी शिष्य / शिष्या' is standard for Principal applications.",
    },
  ],

  soochna: [
    {
      qH: "ICSE सूचना लेखन (Notice Writing) में प्रस्तुति एवं शब्द-सीमा से जुड़ा अनिवार्य नियम क्या है?",
      qE: "What are the mandatory presentation & length rules for ICSE Soochna Lekhan (Notice)?",
      correct: 'संपूर्ण सूचना एक आयताकार बॉक्स (Box) के भीतर लगभग 40–50 शब्दों में संक्षिप्त व स्पष्ट होनी चाहिए',
      wrongs: [
        'सूचना बिना किसी बॉक्स के 300 शब्दों की कहानी की तरह लिखनी चाहिए',
        'सूचना के ऊपर "प्रिय मित्र" लिखकर अभिवादन करना आवश्यक है',
        'सूचना में दिनांक और कार्यक्रम का समय कभी नहीं लिखना चाहिए',
      ],
      expH: 'सूचना सदैव बंद आयताकार चौखटे (बॉक्स) में लिखी जाती है और इसमें संगठन का नाम, सूचना शीर्षक, दिनांक, विषय, समय-स्थान व जारीकर्ता का पद होना अनिवार्य है।',
      expE: 'Notices must always be enclosed in a rectangular box within ~40–50 words containing institution, date, subject, event details, and issuer designation.',
    },
    {
      qH: "सूचना की मुख्य विषय-वस्तु (Body) लिखते समय किन चार प्रमुख प्रश्नों का उत्तर स्पष्ट मिलना आवश्यक है?",
      qE: "Which key details must the body of a Hindi Notice clearly provide?",
      correct: 'क्या (आयोजन), कब (दिनांक व समय), कहाँ (स्थान) और कौन (पात्र विद्यार्थी/संपर्क सूत्र)',
      wrongs: [
        'लेखक के बचपन की यादें और पारिवारिक परिचय',
        'किसी फिल्म की समीक्षा व गीत के बोल',
        'केवल चार कठिन मुहावरे बिना किसी तारीख के',
      ],
      expH: 'सूचना का उद्देश्य सभी आवश्यक विवरण (तिथि, समय, स्थल, शुल्क या पंजीकरण अंतिम तिथि) स्पष्ट और भ्रम-रहित ढंग से देना होता है।',
      expE: 'A notice must unambiguously answer What, When (date/time), Where (venue), and Who to contact.',
    },
    {
      qH: "सूचना में सबसे ऊपर मध्य (Center) में किन तीन तत्वों का क्रम सही माना जाता है?",
      qE: "What is the accurate centered header sequence at the top of a Hindi Notice?",
      correct: 'संस्था/विद्यालय का नाम -> “सूचना” (बड़े व स्पष्ट अक्षरों में) -> संक्षिप्त शीर्षक/विषय',
      wrongs: [
        'जारीकर्ता के हस्ताक्षर -> अपना पता -> मुहावरा',
        'प्राप्तांक -> रोल नंबर -> उपसंहार',
        'विषय के बिना केवल “समाप्त” शब्द',
      ],
      expH: 'सबसे ऊपर केंद्र में संस्था का नाम, उसके नीचे मोटे अक्षरों में “सूचना”, बाईं ओर दिनांक तथा मध्य में कार्यक्रम का शीर्षक आता है।',
      expE: 'Centered organization name, bold heading “सूचना”, left-aligned date, and topic title form the standard header.',
    },
    {
      qH: "सूचना लेखन में सर्वनाम व पुरुष का कौन-सा प्रयोग अधिक औपचारिक और शुद्ध माना जाता है?",
      qE: "Which grammatical person is considered cleanest and most formal in Notice Writing?",
      correct: 'अन्य पुरुष (जैसे "सभी विद्यार्थियों को सूचित किया जाता है कि...")',
      wrongs: [
        'अत्यधिक आत्मीय “मेरे प्यारे दोस्तों, सुनो!”',
        'केवल “मैं तुम्हें बता रहा हूँ” का अनौपचारिक प्रयोग',
        'विस्मयादिबोधक गीत की पंक्तियाँ',
      ],
      expH: "औपचारिक सूचना सदा तीसरे पुरुष ('सभी छात्रों को सूचित किया जाता है...') में निष्पक्ष व आधिकारिक लहजे में लिखी जाती है।",
      expE: 'Formal third-person phrasing maintains an official institutional tone.',
    },
    {
      qH: "सूचना के सबसे नीचे बाईं ओर क्या लिखा जाना अनिवार्य होता है?",
      qE: "What goes at the bottom-left corner inside a Hindi Notice box?",
      correct: 'सूचना जारी करने वाले का नाम (क. ख. ग.) एवं उसका आधिकारिक पद (जैसे सचिव / प्रधानाचार्य)',
      wrongs: [
        'केवल “समाप्त” लिखकर बॉक्स बंद करना',
        'पूरी सूचना का अंग्रेजी अनुवाद',
        'मित्र के लिए धन्यवाद-नोट',
      ],
      expH: 'अंत में जारीकर्ता का नाम व पदनाम लिखने से ही सूचना को आधिकारिक मान्यता प्राप्त होती है।',
      expE: 'The issuing authority’s name and designation validate the notice.',
    },
  ],

  diary: [
    {
      qH: "डायरी लेखन की शुरुआत में किन प्रमुख शीर्ष-विवरणों का होना मानक प्रारूप के अनुसार आवश्यक है?",
      qE: "Which opening header entries are required at the top of a standard Hindi Diary entry?",
      correct: 'दिनांक, दिन (वार) और लिखने का समय (तथा वैकल्पिक स्थान/प्रिय डायरी संबोधन)',
      wrongs: [
        'सेवा में, प्रधानाचार्य महोदय, और विषय',
        'बॉक्स के ऊपर "आवश्यकता है" विज्ञापन शीर्षक',
        'केवल दो अंक बिना किसी दिन या तारीख के',
      ],
      expH: 'डायरी जीवन के दैनिक अनुभवों का निजी दस्तावेज़ है, अतः बाईं ओर दिनांक, दिन तथा रात्रि का समय लिखना अनिवार्य होता है।',
      expE: 'Date, day of the week, and writing time anchor a diary entry chronologically.',
    },
    {
      qH: "डायरी लेखन किस पुरुष-शैली (Narrative POV) और भाव-भूमि में लिखा जाता है?",
      qE: "Which grammatical perspective and tone characterize authentic Diary Writing?",
      correct: 'उत्तम पुरुष (' + 'मैं/मैंने) शैली में सच्ची, निजी व आत्मचिंतनपूर्ण अनुभूतियों के साथ',
      wrongs: [
        'सरकारी कार्यालय के आदेश जैसी रूखी भाषा में',
        'केवल तृतीय पुरुष समाचार-पत्र की रिपोर्ट के रूप में',
        'चार विकल्प वाले वस्तुनिष्ठ प्रश्न के रूप में',
      ],
      expH: 'डायरी में लेखक स्वयं से या डायरी से संवाद करता है, इसलिए ‘मैं’ शैली में ईमानदार भावनात्मक अभिव्यक्ति अपेक्षित होती है।',
      expE: 'First-person (' + 'मैं) honest introspection captures the essence of a diary.',
    },
    {
      qH: "डायरी के अंत में विदाई या समापन किस प्रकार किया जाना चाहिए?",
      qE: "How should a Hindi Diary entry conclude?",
      correct: 'आगामी संकल्प या संक्षिप्त विचार के साथ “शुभ रात्रि” तथा लेखक का नाम/हस्ताक्षर',
      wrongs: [
        '“संपर्क सूत्र: 98xxxxxxx, जल्दी खरीदें” लिखकर',
        '“आपका आज्ञाकारी शिष्य” लिखकर',
        'दो अलग-अलग उपसंहार और श्लोक जोड़कर',
      ],
      expH: 'दिन भर की मुख्य घटना पर मनन करने के बाद शुभ रात्रि व नाम लिखकर डायरी का समापन स्वाभाविक और सुंदर लगता है।',
      expE: 'Closing with a brief reflection, “शुभ रात्रि”, and signature feels natural and complete.',
    },
    {
      qH: "डायरी लिखते समय मुख्य रूप से किस काल (Tense) का प्रयोग स्वाभाविक होता है?",
      qE: "Which tense naturally dominates the narration of day’s events in a Diary entry?",
      correct: 'प्रायः आसन्न या सामान्य भूतकाल (' + 'आज मैंने देखा / हुआ) तथा संकल्प के लिए भविष्यत्',
      wrongs: [
        'केवल आज्ञावाचक वाक्यों का प्रयोग',
        'बिना किसी क्रिया वाले अधूरे शीर्षकों का संग्रह',
        'प्राचीन काल की अनदेखी कथाओं का वर्णन',
      ],
      expH: 'चूँकि दिन में घटित घटनाओं को रात को दर्ज किया जाता है, इसलिए भूतकाल व वर्तमान अनुभूतियों का सहज मिश्रण होता है।',
      expE: 'Past narration of completed events paired with present feelings or future resolve.',
    },
    {
      qH: "यदि परीक्षा में 'किसी जरूरतमंद की सहायता करने का अनुभव' विषय पर डायरी लिखनी हो, तो क्या मुख्य बिंदु होगा?",
      qE: "When writing a diary entry on 'helping someone in need', what should form the emotional core?",
      correct: 'घटना का संक्षिप्त वर्णन और उसके बाद मन में उत्पन्न संतोष व मानवता की सीख',
      wrongs: [
        'अन्य लोगों को धमकाने वाला सूचना-पत्र लिखना',
        'व्यापारिक वस्तु की कीमतों की तालिका बनाना',
        'केवल विद्यालय की समय-सारणी उतार देना',
      ],
      expH: 'डायरी केवल घटनाओं की सूची नहीं, बल्कि घटना से मन पर पड़े आंतरिक प्रभाव का आईना होती है।',
      expE: 'A diary captures inner emotional reflection alongside the real-life incident.',
    },
  ],

  vigyapan: [
    {
      qH: "ICSE विज्ञापन लेखन (Vigyapan) में प्रभावशाली प्रस्तुति के लिए क्या सर्वप्रथम अनिवार्य नियम है?",
      qE: "What is the foundational format requirement for ICSE Vigyapan (Advertisement) Writing?",
      correct: 'पूरे विज्ञापन को एक आकर्षक बॉक्स (सीमा-रेखा) में बनाना और संक्षिप्त, लुभावनी भाषा का प्रयोग',
      wrongs: [
        'बिना बॉक्स के 250 शब्दों का लंबा निबंध लिखना',
        'सबसे पहले “सेवा में, प्रधानाचार्य” लिखना',
        'विज्ञापन में उत्पाद या संपर्क का कोई विवरण न देना',
      ],
      expH: 'विज्ञापन सदैव चौकोर बॉक्स के भीतर केंद्रित शीर्षक, तुकबंदीयुक्त नारा (Slogan), मुख्य विशेषताएँ व संपर्क-सूत्र के साथ रचा जाता है।',
      expE: 'Advertisements must sit inside a framed box with catchy slogan, key features, and contact info.',
    },
    {
      qH: "एक अच्छे व्यावसायिक विज्ञापन (जैसे हर्बल टूथपेस्ट या नए स्कूल बैग) में पाठक का ध्यान खींचने का सबसे सशक्त साधन क्या है?",
      qE: "Which element best hooks readers quickly in a Hindi advertisement?",
      correct: 'छोटा तुकबंदीयुक्त नारा/स्लोगन, आकर्षक ऑफ़र (जैसे 20% छूट) और उत्पाद का सरल चित्र-रेखाचित्र',
      wrongs: [
        'पाँच पैराग्राफ का कठिन दार्शनिक भाषण',
        'बिना नाम लिखे केवल पते के पिनकोड की सूची',
        'रोने-धोने वाले नकारात्मक शब्दों का प्रयोग',
      ],
      expH: 'कम शब्दों में लयबद्ध नारा (' + '“सुनहरा मौका!”, “मज़बूती और ताज़गी एक साथ”) विज्ञापन को तुरंत यादगार बनाता है।',
      expE: 'Rhyming taglines, special offers, and clean feature bullets grab instant attention.',
    },
    {
      qH: "विज्ञापन के निचले हिस्से में क्या लिखना बिल्कुल न भूलें?",
      qE: "Which practical detail should never be omitted at the bottom of a Hindi advertisement?",
      correct: 'संपर्क सूत्र (फ़ोन नंबर — जैसे 98XXXXXXXX, ईमेल या पता)',
      wrongs: [
        'लेखक का परीक्षा अनुक्रमांक और अंक-तालिका',
        '“शुभ रात्रि, प्रिय डायरी” का समापन',
        '“आपका आज्ञाकारी” स्वनिर्देश',
      ],
      expH: 'बिना संपर्क स्थान या दूरभाष नंबर के ग्राहक को पता ही नहीं चलेगा कि उत्पाद कहाँ से प्राप्त करें, इसलिए काल्पनिक संपर्क लिखना आवश्यक है।',
      expE: 'Placeholder phone/address contact lets interested readers act on the advertisement.',
    },
    {
      qH: "विज्ञापन लेखन की मानक शब्द-सीमा लगभग कितनी होनी चाहिए?",
      qE: "What is the recommended length for an ICSE Hindi Advertisement?",
      correct: 'लगभग 25 से 50 शब्द (बिंदुवार व कम से कम शब्दों में सटीक जानकारी)',
      wrongs: ['लगभग 400 से 500 शब्द', 'केवल 2 शब्द', 'कम से कम तीन पृष्ठ'],
      expH: 'विज्ञापन कम स्थान में अधिक प्रभाव छोड़ने की कला है; 25–50 शब्दों में स्पष्ट विशेषताएँ पर्याप्त होती हैं।',
      expE: 'Concise bullets totaling 25–50 words ensure spacious, readable visual layout inside the box.',
    },
    {
      qH: "जन-जागरूकता विज्ञापन (जैसे ‘जल बचाओ’ या ‘प्लास्टिक हटाओ’) का मुख्य उद्देश्य क्या होता है?",
      qE: "What is the core goal of a public-awareness social advertisement (e.g., Save Water)?",
      correct: 'जनसाधारण को किसी सामाजिक कर्तव्य के प्रति जागरूक एवं प्रेरित करना',
      wrongs: [
        'किसी महँगे मोबाइल फ़ोन की बिक्री बढ़ाना',
        'किसी मित्र को जन्मदिन की बधाई भेजना',
        'प्रधानाचार्य से दो दिन का अवकाश माँगना',
      ],
      expH: 'सामाजिक विज्ञापन व्यापारिक लाभ के बजाय जनहित और सकारात्मक व्यवहार-परिवर्तन का संदेश फैलाते हैं।',
      expE: 'Social awareness ads inspire civic responsibility rather than commercial sales.',
    },
  ],

  rachna_lekhan: [
    {
      qH: "रचना एवं लेखन की किस विधा में ‘आयताकार बॉक्स’ (Rectangular Border) बनाना अनिवार्य नहीं होता?",
      qE: "Which ICSE composition format does NOT require enclosing the text inside a rectangular box?",
      correct: 'निबंध व अनौपचारिक पत्र',
      wrongs: ['सूचना लेखन (Notice)', 'विज्ञापन लेखन (Ad)', 'संदेश व सूचना दोनों'],
      expH: 'सूचना और विज्ञापन अनिवार्य रूप से बॉक्स में बनते हैं, जबकि निबंध, कहानी, अनुच्छेद और पत्र खुले पृष्ठ पर उचित हाशिए के साथ लिखे जाते हैं।',
      expE: 'Notice and Advertisement require boxes; essays, stories, paragraphs, and letters do not.',
    },
    {
      qH: "औपचारिक पत्र और सूचना लेखन की भाषा में मुख्य समानता क्या होती है?",
      qE: "What shared stylistic rule applies to both Formal Letters and Notices?",
      correct: 'दोनों की भाषा संक्षिप्त, शिष्ट, स्पष्ट और सीधे मुद्दे पर केंद्रित होनी चाहिए',
      wrongs: [
        'दोनों में व्यक्तिगत पारिवारिक हाल-चाल पूछना अनिवार्य है',
        'दोनों में तुकबंदी वाले गीत लिखे जाते हैं',
        'दोनों को बिना तारीख के लिखा जाता है',
      ],
      expH: 'अतिरिक्त भूमिका या आत्मीय बातचीत के बिना कम शब्दों में स्पष्ट संदेश देना औपचारिक लेखन का गुण है।',
      expE: 'Both demand courteous, concise, objective, and direct communication.',
    },
    {
      qH: "यदि किसी विषय पर ‘अनुच्छेद’ लिखना हो और भूल से छात्र तीन अलग-अलग उपशीर्षकों में अनुच्छेद तोड़ दे, तो क्या होगा?",
      qE: "What happens if a student accidentally breaks an Anuched (Paragraph) into three separate sections with subheadings?",
      correct: 'अनुच्छेद के प्रारूप नियम का उल्लंघन होने से अंक कट जाएँगे',
      wrongs: [
        'अधिक अनुच्छेद बनाने के अतिरिक्त बोनस अंक मिलेंगे',
        'वह सूचना लेखन बन जाएगा',
        'इससे शब्द-सीमा स्वतः दोगुनी मानी जाएगी',
      ],
      expH: 'अनुच्छेद लेखन एक ही अविभाजित पैराग्राफ की विधा है; इसे भागों में बाँटने पर यह निबंध जैसा दिखने लगता है।',
      expE: 'Splitting an Anuched violates its core single-paragraph constraint and costs format marks.',
    },
    {
      qH: "रचना लेखन (कथा शिल्पी) में 'क. ख. ग.' या 'अ. ब. स.' का प्रयोग क्यों सिखाया जाता है?",
      qE: "Why do ICSE Hindi guidelines recommend 'क. ख. ग.' or 'अ. ब. स.' in compositions?",
      correct: 'बोर्ड परीक्षा की उत्तर-पुस्तिका में छात्र की वास्तविक पहचान व पता गोपनीय रखने हेतु',
      wrongs: [
        'क्योंकि वर्णमाला के पहले तीन अक्षर सुंदर दिखते हैं',
        'केवल व्याकरण की संधि दिखाने के लिए',
        'ताकि पाठक कहानी के पात्र भूल जाए',
      ],
      expH: 'परीक्षा नियमों के तहत वास्तविक नाम, विद्यालय या फोन नंबर लिखने की मनाही होने से सांकेतिक अक्षर प्रयुक्त होते हैं।',
      expE: 'Board evaluation rules mandate concealing personal student identities using placeholders.',
    },
    {
      qH: "रचनात्मक लेखन में विराम-चिह्नों और शुद्ध वर्तनी का क्या योगदान होता है?",
      qE: "How do accurate punctuation and spelling contribute to Hindi creative writing scores?",
      correct: 'भाव स्पष्ट होते हैं और ' + 'भाषा व अभिव्यक्ति' + ' खंड के पूरे अंक सुरक्षित रहते हैं',
      wrongs: [
        'लेखन में विराम-चिह्न बिल्कुल नहीं लगाने चाहिए',
        'केवल सुंदर लिखावट बिना मात्राओं के काफी होती है',
        'हर वाक्य के अंत में प्रश्नवाचक चिह्न लगाना बेहतर है',
      ],
      expH: 'ICSE अंक-योजना में प्रारूप व विषय-वस्तु के साथ भाषाई शुद्धता (वर्तनी, लिंग, वचन व विराम-चिह्न) के पृथक अंक निर्धारित होते हैं।',
      expE: 'ICSE rubrics allocate dedicated marks to spelling, grammar accuracy, and punctuation.',
    },
  ],

  mixed_board: [
    {
      qH: "'आकाश में काले बादल घिर आए और ठंडी हवा चलने लगी।' रचना की दृष्टि से यह कौन-सा वाक्य है?",
      qE: "Classify the sentence by structure: 'आकाश में काले बादल घिर आए और ठंडी हवा चलने लगी।'",
      correct: 'संयुक्त वाक्य',
      wrongs: ['सरल वाक्य', 'मिश्र वाक्य', 'विस्मयवाचक वाक्य'],
      expH: "'और' समानाधिकरण योजक दो स्वतंत्र उपवाक्यों को जोड़ रहा है, अतः यह संयुक्त वाक्य है।",
      expE: "Two independent clauses linked by 'और' form a Compound Sentence.",
    },
    {
      qH: "'पीतांबर' (पीला है अंबर जिसका — श्रीकृष्ण) में कौन-सा समास मान्य है?",
      qE: "Identify the Samas in 'पीतांबर' when interpreted as 'One wearing yellow garments — Lord Krishna':",
      correct: 'बहुव्रीहि समास',
      wrongs: ['द्विगु समास', 'द्वंद्व समास', 'अव्ययीभाव समास'],
      expH: "तीसरे विशेष अर्थ (श्रीकृष्ण/विष्णु) की प्रधानता होने से 'पीतांबर' बहुव्रीहि समास है।",
      expE: 'External third-person referent (Lord Krishna) establishes Bahuvrihi Samas.',
    },
    {
      qH: "'घायल कबूतर से ऊँची उड़ान भरी नहीं जाती।' वाक्य में वाच्य का कौन-सा रूप विद्यमान है?",
      qE: "Identify the grammatical voice in 'घायल कबूतर से ऊँची उड़ान भरी नहीं जाती।':",
      correct: 'भाववाच्य',
      wrongs: ['कर्तृवाच्य', 'कर्मवाच्य', 'मिश्रवाच्य'],
      expH: 'असमर्थता व क्रिया के भाव की प्रधानता (' + 'भरी नहीं जाती) होने से भाववाच्य स्पष्ट है।',
      expE: 'Impersonal verb showing inability indicates Bhavvachya.',
    },
    {
      qH: "'स्वागत' शब्द का यण संधि के अनुसार शुद्ध संधि-विच्छेद चुनिए:",
      qE: "Choose the accurate Yan Sandhi split of 'स्वागत':",
      correct: 'सु + आगत',
      wrongs: ['स्व + आगत', 'सा + गत', 'सुव + आगत'],
      expH: "'उ + आ = वा' बनकर 'सु + आगत = स्वागत' (यण स्वर संधि) निर्मित होता है।",
      expE: "u + ā → vā yields 'स्वागत' from 'सु + आगत'.",
    },
    {
      qH: "'दाँत खट्टे करना' मुहावरे का सही अर्थ क्या है?",
      qE: "Select the accurate meaning of the idiom 'दाँत खट्टे करना':",
      correct: 'शत्रु को बुरी तरह परास्त (पराजित) कर देना',
      wrongs: ['खट्टे फल खाना', 'दाँतों की सफाई करना', 'मिठाई बाँटना'],
      expH: "युद्ध या प्रतियोगिता में प्रतिद्वंद्वी को करारी हार देना 'दाँत खट्टे करना' कहलाता है।",
      expE: 'To soundly defeat or outclass an opponent.',
    },
  ],
};

function shuffleExclusiveItems<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const RECOVERY_TOPIC_ALIASES: Record<string, string[]> = {
  sandhi_samas: ['sandhi', 'samas'],
  nipat: ['avikari'],
  comprehension: ['gadyansh'],
  shabd_bhandar: ['shabd_bhandar', 'paryayvachi', 'vilom', 'anekarthi', 'shrutisam', 'anek_shabd'],
  patra_formal: ['patra'],
  patra_informal: ['patra'],
};

/**
 * Builds a mistake-recovery question set containing `questionsPerTopic` (default 4)
 * unique questions for EVERY question type the user answered wrong across the website.
 * Strictly pulls from the 100%-exclusive MISTAKE_RECOVERY_BANK and blocks any question
 * that exists anywhere else on the website (Store Worksheets, Custom Studio,
 * Pre/Post Checkpoints, Grammar Simulations, Apathit Gadyansh, Katha Shilpi, etc.).
 */
export function buildMistakeRecoveryQuestions(
  mistakes: MistakeTopicStat[],
  questionsPerTopic: number = 4,
  options?: { excludeQuestionTexts?: string[] }
): QuizQuestion[] {
  const perTopic = Math.max(3, questionsPerTopic);
  const seen = new Set<string>();
  const allQuestions: QuizQuestion[] = [];
  const nonce = Date.now();

  const runtimeBlocked = new Set<string>();
  const addRuntimeBlock = (txt?: string | null) => {
    if (!txt) return;
    const n = normalizeSiteQuestionKey(txt);
    const s = normalizeStrictQuestionFingerprint(txt);
    if (n) runtimeBlocked.add(n);
    if (s) runtimeBlocked.add(s);
  };

  for (const txt of options?.excludeQuestionTexts || []) {
    addRuntimeBlock(txt);
  }

  const sourceStats: MistakeTopicStat[] =
    Array.isArray(mistakes) && mistakes.length > 0
      ? mistakes
      : [
          {
            topicKey: 'karak',
            topicNameHindi: 'कारक एवं परसर्ग',
            topicNameEnglish: 'Case Markers',
            wrongCount: 0,
            lastWrongAt: '',
          },
          {
            topicKey: 'kaal',
            topicNameHindi: 'काल (Tenses)',
            topicNameEnglish: 'Tenses',
            wrongCount: 0,
            lastWrongAt: '',
          },
          {
            topicKey: 'vakya',
            topicNameHindi: 'वाक्य रचना और रूपांतरण',
            topicNameEnglish: 'Sentence Transformation',
            wrongCount: 0,
            lastWrongAt: '',
          },
        ];

  for (const stat of sourceStats) {
    for (const sample of stat.sampleQuestions || []) {
      addRuntimeBlock(sample);
    }
  }

  const allExclusiveFallback = Object.values(MISTAKE_RECOVERY_BANK).flat();

  for (const stat of sourceStats) {
    const resolvedKey = resolveTopicKeyFromString(stat.topicKey || stat.topicNameHindi || 'karak');
    const labels = getCanonicalTopicLabels(resolvedKey, stat.topicNameHindi, stat.topicNameEnglish);

    const bucketKeys = RECOVERY_TOPIC_ALIASES[resolvedKey] || [resolvedKey];
    let pool: RawBankQuestion[] = [];
    for (const bk of bucketKeys) {
      if (MISTAKE_RECOVERY_BANK[bk]) {
        pool.push(...(MISTAKE_RECOVERY_BANK[bk] as RawBankQuestion[]));
      }
    }
    if (pool.length === 0) {
      pool = [...(MISTAKE_RECOVERY_BANK.mixed_board as RawBankQuestion[])];
    }
    pool = shuffleExclusiveItems(pool);

    const topicQuestions: QuizQuestion[] = [];
    const pushItem = (item: RawBankQuestion, checkRuntimeBlock: boolean) => {
      const qKey = normalizeSiteQuestionKey(item.qH);
      const strictKey = normalizeStrictQuestionFingerprint(item.qH);
      if (!qKey || seen.has(qKey) || (strictKey && seen.has(strictKey))) return false;
      if (isQuestionBlockedSiteWide(item.qH, checkRuntimeBlock ? runtimeBlocked : undefined)) {
        return false;
      }
      seen.add(qKey);
      if (strictKey) seen.add(strictKey);
      topicQuestions.push({
        id: `mistake_${resolvedKey}_${topicQuestions.length + 1}_${nonce}`,
        topicId: resolvedKey,
        topicNameHindi: labels.hi,
        topicNameEnglish: labels.en,
        questionHindi: item.qH,
        questionEnglish: item.qE,
        options: [
          { textHindi: item.correct, textEnglish: '' },
          ...item.wrongs.map((w) => ({ textHindi: w, textEnglish: '' })),
        ],
        correctIndex: 0,
        explanationHindi: item.expH,
        explanationEnglish: item.expE,
      });
      return true;
    };

    // Pass 1: Same-topic exclusive recovery questions excluding both site-wide & session-seen questions
    for (const item of pool) {
      if (topicQuestions.length >= perTopic) break;
      pushItem(item, true);
    }

    // Pass 2: If session retakes exhausted unseen questions for this topic, cycle same-topic exclusive items
    // while STILL enforcing 100% site-wide website exclusion (never touches RAW_BANK).
    if (topicQuestions.length < perTopic) {
      for (const item of shuffleExclusiveItems(pool)) {
        if (topicQuestions.length >= perTopic) break;
        pushItem(item, false);
      }
    }

    // Pass 3: Ultimate safety supplement only from other exclusive Mistake Recovery buckets
    if (topicQuestions.length < perTopic) {
      for (const item of shuffleExclusiveItems(allExclusiveFallback as RawBankQuestion[])) {
        if (topicQuestions.length >= perTopic) break;
        pushItem(item, false);
      }
    }

    // Shuffle options per question while keeping each topic block grouped together
    allQuestions.push(...randomizeQuizSet(topicQuestions));
  }

  return allQuestions;
}
