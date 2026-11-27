import { QuizQuestion, SavedReportSummary } from '../types';
import { resolveTopicKeyFromString, getCanonicalTopicLabels } from '../data/worksheetBank';

export interface ReportTopicStat {
  key: string;
  nameHindi: string;
  nameEnglish: string;
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  percentage: number;
  status: 'strong' | 'developing' | 'needs_focus';
}

export interface ReportSkillStat {
  key: string;
  nameHindi: string;
  nameEnglish: string;
  correct: number;
  attempted: number;
  unanswered: number;
  total: number;
  percentage: number;
}

export interface ReportMistakeItem {
  questionNumber: number;
  questionId: string;
  topicKey: string;
  topicHindi: string;
  topicEnglish: string;
  skillHindi: string;
  questionHindi: string;
  questionEnglish: string;
  selectedIndex: number | undefined;
  selectedTextHindi: string;
  correctIndex: number;
  correctTextHindi: string;
  explanationHindi: string;
  explanationEnglish: string;
  ruleTipHindi?: string;
  isUnanswered: boolean;
}

export interface ReportImprovementItem {
  id: string;
  topicKey: string;
  titleHindi: string;
  titleEnglish: string;
  scoreLabel: string;
  diagnosisHindi: string;
  diagnosisEnglish: string;
  actionStepsHindi: string[];
  actionStepsEnglish: string[];
  priority: 'high' | 'medium' | 'maintain';
}

export interface WorksheetDiagnosticReport {
  titleHindi: string;
  titleEnglish: string;
  totalQuestions: number;
  attemptedCount: number;
  unansweredCount: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  wordCoinsEarned: number;
  tierLabelHindi: string;
  tierLabelEnglish: string;
  tierTone: 'emerald' | 'indigo' | 'amber' | 'rose';
  summaryHindi: string;
  summaryEnglish: string;
  topicBreakdown: ReportTopicStat[];
  skillBreakdown: ReportSkillStat[];
  mistakes: ReportMistakeItem[];
  improvementPlan: ReportImprovementItem[];
}

interface TopicAdviceTemplate {
  ruleFocusHindi: string;
  ruleFocusEnglish: string;
  stepsHindi: string[];
  stepsEnglish: string[];
}

const TOPIC_IMPROVEMENT_BANK: Record<string, TopicAdviceTemplate> = {
  karak: {
    ruleFocusHindi: "कारक के 8 भेद और उनके परसर्ग (ने, को, से, के लिए, में/पर, का/के/की) — विशेषकर 'करण से' (साधन) बनाम 'अपादान से' (अलगाव/भय/उद्गम) में अंतर पहचानना आवश्यक है।",
    ruleFocusEnglish: "Distinguish the 8 case markers, especially instrumental 'से' (Karan) vs. separative/fear/origin 'से' (Apadan).",
    stepsHindi: [
      "वाक्य में 'से' आने पर पूछें: क्या यह किसी साधन/औज़ार से काम कर रहा है (करण) या किसी स्थान से अलग हो रहा है (अपादान)?",
      "व्याकरण सिमुलेशन के 'Karak Cables' मॉड्यूल में जाकर सभी 6 तार-संबंध अभ्यास हल करें।"
    ],
    stepsEnglish: [
      "Whenever you see 'से', test whether it indicates a tool/medium (Karan) or detachment/fear/origin (Apadan).",
      "Practice all 6 cable scenarios in the Grammar Simulations Karak module."
    ]
  },
  vakya: {
    ruleFocusHindi: "रचना के आधार पर वाक्य भेद (सरल, संयुक्त, मिश्र) — योजक शब्दों ('और, परंतु, इसलिए' बनाम 'कि, जो-वह, क्योंकि, यदि-तो') तथा आश्रित उपवाक्य पहचानने पर ध्यान दें।",
    ruleFocusEnglish: "Identify Simple, Compound (coordinating conjunctions), and Complex (subordinating/correlative pairs) sentences.",
    stepsHindi: [
      "दो स्वतंत्र वाक्यों को जोड़ने वाले 'और, या, किंतु, इसलिए' शब्द संयुक्त वाक्य बनाते हैं, जबकि 'जो-सो, यदि-तो, क्योंकि, कि' मिश्र वाक्य बनाते हैं।",
      "सरल वाक्य में केवल एक ही मुख्य समापिका क्रिया होती है — 'वाक्य कपलर' सिमुलेशन में बोगियाँ जोड़कर अभ्यास करें।"
    ],
    stepsEnglish: [
      "Look for coordinating conjunctions ('और, इसलिए') for Compound vs. dependent pairs ('जो-वह, यदि-तो') for Complex sentences.",
      "Review clause coupling in the Vakya Train Simulation module."
    ]
  },
  vachya: {
    ruleFocusHindi: "वाच्य (कर्तृवाच्य, कर्मवाच्य, भाववाच्य) — क्रिया का लिंग-वचन कर्ता के अनुसार है या कर्म के, और 'के द्वारा / से' के साथ असमर्थता का भाव है या नहीं, इसकी जाँच करें।",
    ruleFocusEnglish: "Check whether the verb agrees with the subject (Active), object (Passive with 'के द्वारा'), or impersonal state (Bhavvachya).",
    stepsHindi: [
      "वाच्य बदलते समय वाक्य का मूल काल (Tense) कभी न बदलें — केवल कर्ता/कर्म और क्रिया का रूप बदलें।",
      "'मुझसे चला नहीं जाता' जैसे अकर्मक व असमर्थता वाले वाक्य हमेशा भाववाच्य (अन्य पुरुष, एकवचन, पुल्लिंग) होते हैं।"
    ],
    stepsEnglish: [
      "Never alter the original tense during voice conversion; adjust only agent marking and verb agreement.",
      "Intransitive inability sentences (e.g., 'मुझसे... नहीं जाता') are always Bhavvachya (3rd-person singular masculine)."
    ]
  },
  kaal: {
    ruleFocusHindi: "काल और उसके उपभेद (सामान्य, अपूर्ण, पूर्ण, संदिग्ध, आसन्न व हेतुहेतुमद्) — क्रिया के अंत ('ता है', 'रहा था', 'चुका है', 'शायद...एगा') पर ध्यान केंद्रित करें।",
    ruleFocusEnglish: "Focus on auxiliary verb endings to separate Simple, Continuous, Perfect, Doubtful, and Conditional tenses.",
    stepsHindi: [
      "जब एक क्रिया का होना दूसरी शर्त पर निर्भर हो ('यदि पढ़ते तो पास होते'), तो वह हेतुहेतुमद् काल होता है।",
      "काल चक्र (Kaal Dial) सिमुलेशन में एक ही धातु के तीनों कालों और उपभेदों के रूप दोहराएँ।"
    ],
    stepsEnglish: [
      "Watch for 'if-then' dependency clauses which mark Conditional (Hetuhetumad) tense.",
      "Spin the Kaal Dial simulation across all verb roots to lock in ending patterns."
    ]
  },
  sandhi: {
    ruleFocusHindi: "संधि-विच्छेद और संधि के प्रकार (स्वर, व्यंजन, विसर्ग) — प्रथम शब्द के अंतिम वर्ण और दूसरे शब्द के प्रथम वर्ण के मेल से होने वाला ध्वनि परिवर्तन पहचानें।",
    ruleFocusEnglish: "Analyze the junction between the final vowel/consonant of word 1 and initial sound of word 2.",
    stepsHindi: [
      "विच्छेद करते समय सुनिश्चित करें कि '+' के दोनों ओर सार्थक शब्द या मानक उपसर्ग बन रहे हों।",
      "दीर्घ, गुण, वृद्धि, यण (इ/उ के बाद य/व) और अयादि संधि के एक-एक उदाहरण सूत्र लिखकर दोहराएँ।"
    ],
    stepsEnglish: [
      "Ensure both parts on either side of '+' are valid meaningful roots or standard morphemes.",
      "Review vowel-glide triggers (e.g., इ + भिन्न स्वर = य in Yan Sandhi)."
    ]
  },
  samas: {
    ruleFocusHindi: "समास-विग्रह और भेद — समस्तपद का सही विग्रह करके देखें कि पूर्वपद प्रधान है (अव्ययीभाव), उत्तरपद (तत्पुरुष/कर्मधारय/द्विगु), दोनों पद (द्वंद्व) या कोई तीसरा अर्थ (बहुव्रीहि)।",
    ruleFocusEnglish: "Expand the compound first to see which component holds dominance before naming the Samas type.",
    stepsHindi: [
      "पहले शब्द का सटीक विग्रह लिखें: 'और/या' आए तो द्वंद्व, संख्या हो तो द्विगु, 'है जो/के समान' आए तो कर्मधारय, कारक विभक्ति हो तो तत्पुरुष।",
      "यदि समस्तपद किसी विशेष व्यक्ति/देवता की ओर संकेत करे (जैसे दशानन, पीतांबर), तो बहुव्रीहि चुनें।"
    ],
    stepsEnglish: [
      "Write the expansion first: 'और' -> Dvandva, leading number -> Dvigu, comparison -> Karmadharaya, dropped case marker -> Tatpurush.",
      "If the compound refers to a third specific entity (e.g., पीतांबर -> कृष्ण), choose Bahuvrihi."
    ]
  },
  upsarg: {
    ruleFocusHindi: "उपसर्ग पहचान — उपसर्ग हमेशा मूल शब्द के आरंभ (आगे) जुड़ता है; अलग करने के बाद बचा हुआ मूल शब्द सार्थक होना चाहिए।",
    ruleFocusEnglish: "Prefixes attach at the start of a meaningful root word; verify the remaining root stands on its own.",
    stepsHindi: [
      "शब्द से आगे का शब्दांश हटाकर देखें कि शेष भाग एक स्वतंत्र और सार्थक मूल शब्द है या नहीं।",
      "उपसर्ग-प्रत्यय स्टूडियो में 10 शब्दों की तालिका बनाकर उनके विग्रह सूत्र ध्यान से पढ़ें।"
    ],
    stepsEnglish: [
      "Strip the front affix and verify the remaining base word is meaningful.",
      "Use the Upsarg-Pratyay Studio with 10+ words to reinforce prefix breakup patterns."
    ]
  },
  pratyay: {
    ruleFocusHindi: "प्रत्यय पहचान — प्रत्यय मूल शब्द के अंत (पीछे) जुड़कर संज्ञा/विशेषण बनाते हैं; 'इक' जैसे प्रत्यय लगने पर पहले स्वर में वृद्धि (जैसे धर्म -> धार्मिक) भी हो सकती है।",
    ruleFocusEnglish: "Suffixes attach at the tail; note initial-vowel strengthening with suffixes like '-इक' (धर्म -> धार्मिक).",
    stepsHindi: [
      "अंत से प्रत्यय ('ता, इक, आवट, ईय, दार, वान') अलग करके मूल शब्द की शुद्ध वर्तनी जांचें।",
      "'इक' प्रत्यय वाले शब्दों (इतिहास -> ऐतिहासिक, समाज -> सामाजिक) के प्रथम स्वर परिवर्तन का अभ्यास करें।"
    ],
    stepsEnglish: [
      "Detach the trailing suffix and check the exact spelling of the base root.",
      "Practice initial vowel changes triggered by '-इक' (e.g., समाज -> सामाजिक)."
    ]
  },
  upsarg_pratyay: {
    ruleFocusHindi: "उपसर्ग (आगे) व प्रत्यय (पीछे) तथा मूल शब्द का सटीक विच्छेद — उपसर्ग और प्रत्यय दोनों के अलग होने पर भी मूल शब्द सार्थक रहना चाहिए।",
    ruleFocusEnglish: "Separate front prefixes and trailing suffixes cleanly while keeping the core root word meaningful.",
    stepsHindi: [
      "प्रत्येक शब्द में पहले उपसर्ग (यदि हो), फिर मूल शब्द और अंत में प्रत्यय को क्रम से अलग करें।",
      "उपसर्ग-प्रत्यय स्टूडियो में कस्टम शब्दांश डालकर तालिका और प्रश्नावली दोबारा हल करें।"
    ],
    stepsEnglish: [
      "Break each derived word into [Prefix] + Root + [Suffix] and verify the root meaning.",
      "Generate a fresh table in the Affix Studio and retake its quiz."
    ]
  },
  muhavara: {
    ruleFocusHindi: "मुहावरे एवं लोकोक्तियाँ — मुहावरे का शाब्दिक (सीधा) अर्थ न लेकर उसका लाक्षणिक व प्रतीकात्मक अर्थ चुनें।",
    ruleFocusEnglish: "Always choose the figurative, idiomatic sense rather than the literal word-for-word translation.",
    stepsHindi: [
      "जब विकल्प में शब्दों का सीधा अनुवाद दिखे (जैसे 'दाँत खट्टे होना = नींबू खाना'), तो उसे तुरंत हटा दें।",
      "मुहावरे का वाक्य में प्रयोग सोचकर देखें कि प्रसंग में कौन-सा भाव सटीक बैठता है।"
    ],
    stepsEnglish: [
      "Eliminate literal traps immediately and test the idiom inside an everyday sentence.",
      "Review the Idiom Flip Cards in Grammar Simulations to connect imagery with metaphor."
    ]
  },
  sangya: {
    ruleFocusHindi: "संज्ञा भेद (व्यक्तिवाचक, जातिवाचक, भाववाचक, द्रव्यवाचक, समूहवाचक) — विशेष नाम, संपूर्ण वर्ग, या गुण/दशा/भाव में अंतर पहचानें।",
    ruleFocusEnglish: "Differentiate Proper (specific), Common (category), Abstract (quality/state), Material, and Collective nouns.",
    stepsHindi: [
      "जिसे केवल महसूस किया जा सके (मिठास, बचपन, वीरता) वह भाववाचक संज्ञा है, जबकि समूह बताने वाले (सेना, झुंड) समूहवाचक हैं।",
      "प्रत्यय जोड़कर जातिवाचक/विशेषण से भाववाचक संज्ञा बनाने का अभ्यास करें।"
    ],
    stepsEnglish: [
      "Feelings/qualities that cannot be touched (e.g., बचपन, मित्रता) are Abstract nouns (भाववाचक).",
      "Practice converting adjectives and common nouns into abstract nouns."
    ]
  },
  sarvanam: {
    ruleFocusHindi: "सर्वनाम के 6 भेद (पुरुषवाचक, निश्चयवाचक, अनिश्चयवाचक, संबंधवाचक, प्रश्नवाचक, निजवाचक) — 'आप' के निजवाचक बनाम आदरसूचक प्रयोग पर विशेष ध्यान दें।",
    ruleFocusEnglish: "Distinguish the 6 pronoun classes, especially reflexive 'आप/स्वयं' vs. honorific 'आप' and definite vs. indefinite.",
    stepsHindi: [
      "'कोई/कुछ' अनिश्चय दिखाते हैं, 'जो-सो' संबंध जोड़ते हैं और 'स्वयं/अपने-आप' निजवाचक सर्वनाम हैं।",
      "यदि 'यह/वह' संज्ञा से ठीक पहले आकर उसकी ओर संकेत करे, तो वह सार्वनामिक विशेषण बन जाता है — यह अंतर जांचें।"
    ],
    stepsEnglish: [
      "Check whether 'यह/वह' replaces a noun (Pronoun) or sits right before a noun to qualify it (Demonstrative Adjective).",
      "Watch for 'स्वयं/खुद' for Reflexive (निजवाचक) vs. polite address."
    ]
  },
  visheshan: {
    ruleFocusHindi: "विशेषण के 4 भेद (गुणवाचक, संख्यावाचक, परिमाणवाचक, सार्वनामिक) तथा अवस्थाएँ (मूलावस्था, उत्तरावस्था, उत्तमावस्था)।",
    ruleFocusEnglish: "Separate countable Number (संख्यावाचक) from measurable Quantity (परिमाणवाचक), and practice comparative degrees.",
    stepsHindi: [
      "गिने जाने वाली वस्तुओं ('चार किताबें') के लिए संख्यावाचक और नापी-तौली जाने वाली वस्तुओं ('दो लीटर दूध') के लिए परिमाणवाचक चुनें।",
      "विशेषण की अवस्थाओं में '-तर' (उत्तरावस्था) और '-तम' (उत्तमावस्था) प्रत्यय पहचानें।"
    ],
    stepsEnglish: [
      "Countable nouns take संख्यावाचक; measurable/uncountable substances take परिमाणवाचक.",
      "Note '-तर' (comparative) and '-तम' (superlative) endings for degrees of comparison."
    ]
  },
  kriya: {
    ruleFocusHindi: "क्रिया भेद (सकर्मक बनाम अकर्मक, तथा पूर्वकालिक/प्रेरणार्थक/संयुक्त क्रिया) — क्रिया से पहले 'क्या' या 'किसे' प्रश्न पूछकर कर्म की जाँच करें।",
    ruleFocusEnglish: "Ask 'what' (क्या) or 'whom' (किसे) before the verb to separate Transitive (सकर्मक) from Intransitive (अकर्मक).",
    stepsHindi: [
      "यदि 'क्या/किसे' पूछने पर सार्थक उत्तर (कर्म) मिले तो सकर्मक क्रिया, अन्यथा अकर्मक क्रिया होती है।",
      "'खाकर, पढ़कर' जैसे '-कर' लगे रूप मुख्य क्रिया से पहले होने वाली पूर्वकालिक क्रिया दर्शाते हैं।"
    ],
    stepsEnglish: [
      "If asking 'what/whom' yields a direct object, the verb is Transitive (सकर्मक); otherwise Intransitive.",
      "Forms ending in '-कर' before the main verb mark Purvakalik Kriya."
    ]
  },
  ling: {
    ruleFocusHindi: "लिंग निर्णय व परिवर्तन (पुल्लिंग/स्त्रीलिंग) — वाक्य में 'अच्छा/अच्छी' या 'मेरा/मेरी' जोड़कर शब्द के व्यावहारिक लिंग की जाँच करें।",
    ruleFocusEnglish: "Test noun gender naturally by pairing the word with 'मेरा/मेरी' or 'अच्छा/अच्छी' in a short phrase.",
    stepsHindi: [
      "अपवाद शब्दों (जैसे दही, पानी, मोती पुल्लिंग; नदी, हवा, पुस्तक स्त्रीलिंग) का वाक्य बनाकर अभ्यास करें।",
      "प्रत्यय परिवर्तन नियमों ('-ई, -आनी, -इन, -इका') को दोहराएँ।"
    ],
    stepsEnglish: [
      "Test tricky exceptions (e.g., दही/पानी are masculine, वायु/पुस्तक are feminine) in full sentences.",
      "Review standard feminine suffix patterns (-ई, -आनी, -इन, -इका)."
    ]
  },
  vachan: {
    ruleFocusHindi: "वचन परिवर्तन (एकवचन/बहुवचन) — आकारांत, इकारांत और उकारांत शब्दों में 'ए, एँ, याँ' लगाने तथा विभक्ति के साथ 'ओं' जोड़ने के नियम दोहराएँ।",
    ruleFocusEnglish: "Review plural endings ('-ए', '-एँ', '-याँ') and oblique plural '-ओं' when followed by postpositions.",
    stepsHindi: [
      "ईकारांत स्त्रीलिंग शब्दों ('नदी -> नदियाँ') में बहुवचन बनाते समय अंतिम बड़ी 'ई' छोटी 'इ' में बदल जाती है — वर्तनी जांचें।",
      "सदैव बहुवचन (हस्ताक्षर, आँसू, प्राण) व सदैव एकवचन शब्दों की सूची याद रखें।"
    ],
    stepsEnglish: [
      "Long final '-ई' shortens to '-इयाँ' in feminine plurals (e.g., नदी -> नदियाँ).",
      "Remember always-plural words like हस्ताक्षर, प्राण, आँसू."
    ]
  },
  viram: {
    ruleFocusHindi: "विराम-चिह्न प्रयोग — अल्पविराम (,), अर्धविराम (;), योजक (-), निर्देशक (—), उद्धरण (\" \") और विस्मयादिबोधक (!) का सटीक स्थान पहचानें।",
    ruleFocusEnglish: "Distinguish commas, semicolons, hyphens (योजक), dashes, quotation marks, and exclamation marks.",
    stepsHindi: [
      "द्वंद्व समास व युग्म शब्दों ('माता-पिता, धीरे-धीरे') में छोटा योजक (-) और संवाद/उदाहरण से पहले निर्देशक (—) लगता है।",
      "प्रश्नों में केवल प्रश्नसूचक वाक्यों के अंत में '?' लगाएँ, अप्रत्यक्ष कथन में पूर्णविराम ('।') रखें।"
    ],
    stepsEnglish: [
      "Use a hyphen (-) for paired words/compounds and quotation marks for direct speech.",
      "Use '।' (Purna Viram) for indirect statements and '?' only for direct questions."
    ]
  },
  paryayvachi: {
    ruleFocusHindi: "पर्यायवाची शब्द — समानार्थी शब्दों के सटीक अर्थ-संदर्भ और वर्तनी को ध्यान से परखें, मिलते-जुलते दिखने वाले भिन्न अर्थ वाले शब्दों से बचें।",
    ruleFocusEnglish: "Check exact contextual synonyms and spelling; watch out for near-homophone distractors.",
    stepsHindi: [
      "प्रमुख प्राकृतिक, पौराणिक व परीक्षा-उपयोगी शब्दों (सूर्य, चंद्रमा, कमल, जल, बादल, समुद्र, पवन) के कम-से-कम 4-4 पर्यायवाची दोहराएँ।",
      "कमल (जलज), बादल (जलद) और समुद्र (जलधि) जैसे अंतिम अक्षर के अंतर ('ज/द/धि') को पक्का करें।"
    ],
    stepsEnglish: [
      "Master suffix clues like जल+ज (Lotus), जल+द (Cloud), and जल+धि (Ocean).",
      "Revise 4 synonyms each for high-frequency ICSE exam nouns."
    ]
  },
  vilom: {
    ruleFocusHindi: "विलोम शब्द — तत्सम शब्द का विलोम तत्सम में तथा तद्भव का विलोम तद्भव में चुनें; उपसर्ग ('अ, अन, नि, वि, अप') से बनने वाले विलोम जांचें।",
    ruleFocusEnglish: "Match register when choosing antonyms (Sanskritic/Tatsam pairs with Tatsam) and check negative prefixes.",
    stepsHindi: [
      "समान भाषा-स्तर (जैसे अनुराग-विराग, उत्थान-पतन, साक्षर-निरक्षर) वाले जोड़े पर ध्यान दें।",
      "गलत हुए विलोम युग्मों को एक छोटी सूची में लिखकर दो बार पढ़ें।"
    ],
    stepsEnglish: [
      "Match formal/Tatsam words with Tatsam antonyms (e.g., अनुराग <-> विराग).",
      "Note down the missed antonym pairs and review them once before retaking."
    ]
  },
  ashuddhi: {
    ruleFocusHindi: "वर्तनी एवं वाक्य शुद्धि — लिंग-वचन-कारक अन्विति, पदक्रम, पुनरुक्ति ('वापस लौट आया' जैसी दोहरी क्रिया) और मात्राओं की अशुद्धियाँ पकड़ें।",
    ruleFocusEnglish: "Check subject-verb agreement, case markers, word order, redundant phrasing, and vowel matra spelling.",
    stepsHindi: [
      "वाक्य को धीरे-धीरे पढ़कर देखें कि कर्ता के लिंग/वचन के अनुसार क्रिया सही है या नहीं और कोई शब्द दोहराया तो नहीं गया।",
      "मानक वर्तनी (जैसे उज्ज्वल, कवयित्री, आशीर्वाद, पूजनीय) का लिखित अभ्यास करें।"
    ],
    stepsEnglish: [
      "Read slowly to catch gender/number mismatches and redundant double expressions.",
      "Practice high-frequency ICSE spelling traps (उज्ज्वल, कवयित्री, आशीर्वाद)."
    ]
  },
  pad_parichay: {
    ruleFocusHindi: "पद-परिचय — रेखांकित शब्द का भेद, उपभेद, लिंग, वचन, कारक और वाक्य में क्रिया से संबंध क्रमबद्ध रूप से जांचें।",
    ruleFocusEnglish: "Verify part of speech, sub-type, gender, number, case, and syntactic link to the verb step by step.",
    stepsHindi: [
      "पहले तय करें कि रेखांकित पद संज्ञा, सर्वनाम, विशेषण, क्रिया या अव्यय है; फिर उसके लिंग-वचन और कारक की जाँच करें।",
      "हर विकल्प के सभी 4-5 बिंदुओं को पूरा पढ़ें — एक भी गलत गुण पूरे विकल्प को गलत बना देता है।"
    ],
    stepsEnglish: [
      "Eliminate options immediately if even one attribute (gender, number, case, or word class) mismatches the sentence.",
      "Identify word class first, then sub-type, then inflectional features."
    ]
  },
  comprehension: {
    ruleFocusHindi: "अपठित गद्यांश व अर्थग्रहण — प्रश्नों के उत्तर अपनी पूर्व धारणा के बजाय केवल गद्यांश में दिए गए तथ्यों, संदर्भ और केंद्रीय भाव के आधार पर चुनें।",
    ruleFocusEnglish: "Base every answer strictly on textual evidence, contextual vocabulary, and the central theme of the passage.",
    stepsHindi: [
      "प्रत्येक प्रश्न को हल करने से पहले गद्यांश की संबंधित पंक्ति को दोबारा पढ़कर प्रमाण की पुष्टि करें।",
      "शीर्षक या केंद्रीय भाव वाले प्रश्न में ऐसा विकल्प चुनें जो पूरे अनुच्छेद का सार समेटता हो, केवल एक वाक्य का नहीं।"
    ],
    stepsEnglish: [
      "Re-verify the exact sentence in the passage before locking in factual or inference answers.",
      "For title/central-idea questions, pick the option covering the whole passage rather than a single detail."
    ]
  },
  mixed_board: {
    ruleFocusHindi: "मिश्रित बोर्ड परीक्षा अभ्यास — अलग-अलग व्याकरण अध्यायों (कारक, काल, वाच्य, संधि, समास, वाक्य शुद्धि) के बीच नियम तुरंत बदलने का अभ्यास आवश्यक है।",
    ruleFocusEnglish: "Mixed board-style questions test switching rapidly across grammar rules without mixing up definitions.",
    stepsHindi: [
      "प्रत्येक प्रश्न को पढ़ते ही पहले उसका अध्याय पहचानें, फिर उस अध्याय का मुख्य नियम लागू करें।",
      "नीचे दी गई त्रुटि सूची के जिन विषयों में कम अंक आए हैं, उनकी कस्टम वर्कशीट अलग से हल करें।"
    ],
    stepsEnglish: [
      "Identify the grammar chapter of each question before evaluating its options.",
      "Take a focused Custom Worksheet on any topic below 75% accuracy in the breakdown above."
    ]
  }
};

const DEFAULT_ADVICE: TopicAdviceTemplate = {
  ruleFocusHindi: "नियमों की स्पष्ट समझ और उदाहरणों के क्रमबद्ध विश्लेषण से सटीकता तुरंत बढ़ती है।",
  ruleFocusEnglish: "Focus on core grammar rules and step-by-step elimination of close distractors.",
  stepsHindi: [
    "गलत हुए प्रश्नों की व्याख्या ध्यान से पढ़ें और देखें कि आपका चुना गया विकल्प किस नियम से भिन्न था।",
    "इसी विषय पर 10 प्रश्नों की एक और अभ्यास वर्कशीट हल करके अपनी पकड़ मजबूत करें।"
  ],
  stepsEnglish: [
    "Review the explanation for each missed question to see why the distractor was incorrect.",
    "Practice another 10-question set on this topic to solidify accuracy."
  ]
};

export function classifyQuestionSkill(
  q: Partial<QuizQuestion>,
  canonicalTopicKey: string
): { key: string; nameHindi: string; nameEnglish: string } {
  const text = `${q.questionHindi || ''} ${q.questionEnglish || ''}`.toLowerCase();

  if (canonicalTopicKey === 'comprehension') {
    if (/अर्थ|पर्याय|विलोम|शब्द|meaning|synonym|antonym|vocab|उपसर्ग|प्रत्यय/.test(text)) {
      return {
        key: 'skill_vocab',
        nameHindi: 'शब्दावली एवं शब्दार्थ',
        nameEnglish: 'Vocabulary & Word Meaning',
      };
    }
    if (/शीर्षक|केंद्रीय|संदेश|सीख|सारांश|title|central|moral|theme/.test(text)) {
      return {
        key: 'skill_central',
        nameHindi: 'केंद्रीय भाव व शीर्षक',
        nameEnglish: 'Central Idea & Title',
      };
    }
    if (/निष्कर्ष|आशय|क्यों|अनुमान|तात्पर्य|infer|why|reason|imply/.test(text)) {
      return {
        key: 'skill_inference',
        nameHindi: 'अनुमान व निष्कर्ष',
        nameEnglish: 'Inference & Reasoning',
      };
    }
    return {
      key: 'skill_factual',
      nameHindi: 'तथ्यात्मक समझ',
      nameEnglish: 'Direct Factual Comprehension',
    };
  }

  if (/विग्रह|विच्छेद|मूल शब्द|बनेगा|निर्मित|बनाइए|संधि रूप|formula|dissect|root|breakup|derive/.test(text)) {
    return {
      key: 'skill_formation',
      nameHindi: 'विग्रह, विच्छेद व शब्द-निर्माण',
      nameEnglish: 'Dissection & Word Formation',
    };
  }
  if (/रूपांतर|बदल|परिवर्तन|प्रयोग|वाक्य बना|शुद्ध वाक्य|अशुद्ध|correct|transform|convert|voice|active|passive/.test(text)) {
    return {
      key: 'skill_transform',
      nameHindi: 'वाक्य रूपांतरण व शुद्धि',
      nameEnglish: 'Transformation & Correction',
    };
  }
  if (/अर्थ|लाक्षणिक|पर्याय|विलोम|मुहावर|meaning|idiom|antonym|synonym/.test(text)) {
    return {
      key: 'skill_meaning',
      nameHindi: 'अर्थ, पर्याय एवं मुहावरे',
      nameEnglish: 'Meaning & Figurative Usage',
    };
  }
  return {
    key: 'skill_identify',
    nameHindi: 'भेद व नियम पहचान',
    nameEnglish: 'Identification & Rule Recognition',
  };
}

function getAdviceTemplate(topicKey: string): TopicAdviceTemplate {
  if (TOPIC_IMPROVEMENT_BANK[topicKey]) return TOPIC_IMPROVEMENT_BANK[topicKey];
  if (topicKey.includes('upsarg') && !topicKey.includes('pratyay')) return TOPIC_IMPROVEMENT_BANK.upsarg;
  if (topicKey.includes('pratyay') && !topicKey.includes('upsarg')) return TOPIC_IMPROVEMENT_BANK.pratyay;
  if (topicKey.includes('ashuddhi') || topicKey.includes('vartani') || topicKey.includes('shuddhi')) {
    return TOPIC_IMPROVEMENT_BANK.ashuddhi;
  }
  if (topicKey.includes('gadyansh') || topicKey.includes('comprehension')) {
    return TOPIC_IMPROVEMENT_BANK.comprehension;
  }
  if (topicKey.includes('anek') || topicKey.includes('shabd') || topicKey.includes('shruti')) {
    return TOPIC_IMPROVEMENT_BANK.paryayvachi;
  }
  return DEFAULT_ADVICE;
}

export interface BuildWorksheetReportParams {
  titleHindi: string;
  titleEnglish?: string;
  questions: Array<
    Partial<QuizQuestion> & {
      questionHindi: string;
      options: Array<{ textHindi: string; textEnglish?: string } | string>;
      correctIndex: number;
    }
  >;
  userAnswers: Record<string, number> | Record<number, number>;
  answerLookupMode?: 'byId' | 'byIndex';
  fallbackTopicId?: string;
  fallbackTopicHindi?: string;
  fallbackTopicEnglish?: string;
  wordCoinsEarned?: number;
  shortQuestions?: Array<{
    id: string;
    questionHindi: string;
    questionEnglish?: string;
    sampleAnswerHindi: string;
    sampleAnswerEnglish?: string;
    topicId?: string;
    topicNameHindi?: string;
    topicNameEnglish?: string;
  }>;
  shortReviews?: Record<
    string,
    {
      hindiTranslation?: string;
      status: 'correct' | 'partial' | 'incorrect';
      isCorrect: boolean;
      whatWasWrongHindi?: string;
      whatWasWrongEnglish?: string;
      correctAnswerHindi?: string;
      correctAnswerEnglish?: string;
    }
  >;
}

export function buildWorksheetReport(params: BuildWorksheetReportParams): WorksheetDiagnosticReport {
  const {
    titleHindi,
    titleEnglish = 'Worksheet Performance Report',
    questions,
    userAnswers,
    answerLookupMode = 'byId',
    fallbackTopicId = 'mixed_board',
    fallbackTopicHindi = 'हिंदी व्याकरण',
    fallbackTopicEnglish = 'Hindi Grammar',
    wordCoinsEarned,
    shortQuestions = [],
    shortReviews = {},
  } = params;

  const safeQuestions = Array.isArray(questions) ? questions : [];
  const safeShortQuestions = Array.isArray(shortQuestions) ? shortQuestions : [];
  const answersObj = (userAnswers || {}) as Record<string | number, unknown>;
  const topicBuckets = new Map<string, ReportTopicStat>();
  const skillBuckets = new Map<string, ReportSkillStat>();
  const mistakes: ReportMistakeItem[] = [];

  let correctCount = 0;
  let attemptedCount = 0;
  let unansweredCount = 0;

  safeQuestions.forEach((q, idx) => {
    const qId = q.id || `q_${idx + 1}`;
    let rawChoice: unknown;
    if (answerLookupMode === 'byIndex') {
      rawChoice = answersObj[idx];
    } else if (q.id && Object.prototype.hasOwnProperty.call(answersObj, q.id)) {
      rawChoice = answersObj[q.id];
    } else if (!q.id && Object.prototype.hasOwnProperty.call(answersObj, idx)) {
      rawChoice = answersObj[idx];
    }

    const optionCount = Array.isArray(q.options) ? q.options.length : 0;
    const hasAnswered =
      typeof rawChoice === 'number' &&
      Number.isInteger(rawChoice) &&
      rawChoice >= 0 &&
      (optionCount === 0 || rawChoice < optionCount);
    const chosenIdx = hasAnswered ? (rawChoice as number) : undefined;
    const isCorrect = hasAnswered && chosenIdx === q.correctIndex;

    if (hasAnswered) {
      attemptedCount++;
    } else {
      unansweredCount++;
    }
    if (isCorrect) {
      correctCount++;
    }

    const rawTopicStr = q.topicId || q.topicNameHindi || fallbackTopicId || fallbackTopicHindi;
    const canonicalKey = resolveTopicKeyFromString(rawTopicStr);
    const resolvedLabels = getCanonicalTopicLabels(
      canonicalKey,
      q.topicNameHindi || fallbackTopicHindi,
      q.topicNameEnglish || fallbackTopicEnglish
    );

    const existingTopic = topicBuckets.get(canonicalKey) || {
      key: canonicalKey,
      nameHindi: resolvedLabels.hi,
      nameEnglish: resolvedLabels.en,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      total: 0,
      percentage: 0,
      status: 'strong' as const,
    };

    existingTopic.total += 1;
    if (isCorrect) {
      existingTopic.correct += 1;
    } else if (!hasAnswered) {
      existingTopic.unanswered += 1;
    } else {
      existingTopic.wrong += 1;
    }
    topicBuckets.set(canonicalKey, existingTopic);

    const skill = classifyQuestionSkill(q, canonicalKey);
    const existingSkill = skillBuckets.get(skill.key) || {
      key: skill.key,
      nameHindi: skill.nameHindi,
      nameEnglish: skill.nameEnglish,
      correct: 0,
      attempted: 0,
      unanswered: 0,
      total: 0,
      percentage: 0,
    };
    existingSkill.total += 1;
    if (hasAnswered) {
      existingSkill.attempted += 1;
    } else {
      existingSkill.unanswered += 1;
    }
    if (isCorrect) existingSkill.correct += 1;
    skillBuckets.set(skill.key, existingSkill);

    if (!isCorrect) {
      const getOptHindi = (optIdx: number | undefined): string => {
        if (typeof optIdx !== 'number' || optIdx < 0) return 'कोई उत्तर नहीं चुना गया (Skipped)';
        const opt = q.options?.[optIdx];
        if (!opt) return 'कोई उत्तर नहीं चुना गया (Skipped)';
        return typeof opt === 'string' ? opt : opt.textHindi || String(opt);
      };

      mistakes.push({
        questionNumber: idx + 1,
        questionId: qId,
        topicKey: canonicalKey,
        topicHindi: resolvedLabels.hi,
        topicEnglish: resolvedLabels.en,
        skillHindi: skill.nameHindi,
        questionHindi: q.questionHindi,
        questionEnglish: q.questionEnglish || '',
        selectedIndex: chosenIdx,
        selectedTextHindi:
          hasAnswered && chosenIdx !== undefined
            ? `(${String.fromCharCode(65 + chosenIdx)}) ${getOptHindi(chosenIdx)}`
            : 'कोई उत्तर नहीं दिया (Skipped)',
        correctIndex: q.correctIndex,
        correctTextHindi: `(${String.fromCharCode(65 + q.correctIndex)}) ${getOptHindi(q.correctIndex)}`,
        explanationHindi:
          q.explanationHindi ||
          'सही उत्तर के नियम का ध्यानपूर्वक अवलोकन करें और पुनः अभ्यास करें।',
        explanationEnglish: q.explanationEnglish || '',
        ruleTipHindi: q.ruleTipHindi,
        isUnanswered: !hasAnswered,
      });
    }
  });

  // Process any 1-2 line Short Questions (only completed & AI-reviewed items count as answered)
  safeShortQuestions.forEach((sq, sIdx) => {
    const qNumber = safeQuestions.length + sIdx + 1;
    const review = sq.id ? shortReviews[sq.id] : undefined;
    const hasCompletedShort = Boolean(review && review.status);
    const isCorrect = Boolean(hasCompletedShort && review?.status === 'correct' && review?.isCorrect === true);

    if (hasCompletedShort) {
      attemptedCount++;
    } else {
      unansweredCount++;
    }
    if (isCorrect) {
      correctCount++;
    }

    const rawTopicStr = sq.topicId || sq.topicNameHindi || fallbackTopicId || fallbackTopicHindi;
    const canonicalKey = resolveTopicKeyFromString(rawTopicStr);
    const resolvedLabels = getCanonicalTopicLabels(
      canonicalKey,
      sq.topicNameHindi || fallbackTopicHindi,
      sq.topicNameEnglish || fallbackTopicEnglish
    );

    const existingTopic = topicBuckets.get(canonicalKey) || {
      key: canonicalKey,
      nameHindi: resolvedLabels.hi,
      nameEnglish: resolvedLabels.en,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      total: 0,
      percentage: 0,
      status: 'strong' as const,
    };
    existingTopic.total += 1;
    if (isCorrect) {
      existingTopic.correct += 1;
    } else if (!hasCompletedShort) {
      existingTopic.unanswered += 1;
    } else {
      existingTopic.wrong += 1;
    }
    topicBuckets.set(canonicalKey, existingTopic);

    const shortSkillKey = 'skill_short_answer';
    const existingSkill = skillBuckets.get(shortSkillKey) || {
      key: shortSkillKey,
      nameHindi: 'लघु उत्तरीय अभिव्यक्ति (1–2 पंक्तियाँ)',
      nameEnglish: 'Short-Answer Expression',
      correct: 0,
      attempted: 0,
      unanswered: 0,
      total: 0,
      percentage: 0,
    };
    existingSkill.total += 1;
    if (hasCompletedShort) {
      existingSkill.attempted += 1;
    } else {
      existingSkill.unanswered += 1;
    }
    if (isCorrect) existingSkill.correct += 1;
    skillBuckets.set(shortSkillKey, existingSkill);

    if (!isCorrect) {
      mistakes.push({
        questionNumber: qNumber,
        questionId: sq.id || `sq_${sIdx + 1}`,
        topicKey: canonicalKey,
        topicHindi: resolvedLabels.hi,
        topicEnglish: resolvedLabels.en,
        skillHindi: 'लघु उत्तरीय अभिव्यक्ति',
        questionHindi: sq.questionHindi,
        questionEnglish: sq.questionEnglish || '',
        selectedIndex: undefined,
        selectedTextHindi: hasCompletedShort
          ? review?.hindiTranslation || 'लघु उत्तर प्रस्तुत किया गया'
          : 'कोई उत्तर नहीं दिया (Skipped)',
        correctIndex: 0,
        correctTextHindi: review?.correctAnswerHindi || sq.sampleAnswerHindi,
        explanationHindi: hasCompletedShort
          ? review?.whatWasWrongHindi || 'गद्यांश के आधार पर सही उत्तर से मिलान करें।'
          : 'यह लघु प्रश्न पूरा नहीं किया गया था (Skipped)। गद्यांश पढ़कर 1–2 पंक्तियों में उत्तर दें।',
        explanationEnglish: hasCompletedShort
          ? review?.whatWasWrongEnglish || ''
          : 'This short-answer question was left unfinished (Skipped).',
        isUnanswered: !hasCompletedShort,
      });
    }
  });

  const totalQuestions = safeQuestions.length + safeShortQuestions.length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const coins = typeof wordCoinsEarned === 'number' ? wordCoinsEarned : Math.floor(correctCount / 2);

  const topicBreakdown: ReportTopicStat[] = Array.from(topicBuckets.values())
    .map((t) => {
      const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
      const status: ReportTopicStat['status'] =
        pct >= 80 ? 'strong' : pct >= 50 ? 'developing' : 'needs_focus';
      return { ...t, percentage: pct, status };
    })
    .sort((a, b) => a.percentage - b.percentage || b.total - a.total);

  const skillBreakdown: ReportSkillStat[] = Array.from(skillBuckets.values())
    .map((s) => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage || b.total - a.total);

  let tierLabelHindi = 'उत्कृष्ट दक्षता (Excellent)';
  let tierLabelEnglish = 'Excellent Mastery';
  let tierTone: WorksheetDiagnosticReport['tierTone'] = 'emerald';
  if (percentage < 50) {
    tierLabelHindi = 'आधारभूत सुधार आवश्यक (Needs Focus)';
    tierLabelEnglish = 'Needs Foundational Review';
    tierTone = 'rose';
  } else if (percentage < 75) {
    tierLabelHindi = 'विकासशील स्तर (Developing)';
    tierLabelEnglish = 'Developing — Practice Recommended';
    tierTone = 'amber';
  } else if (percentage < 90) {
    tierLabelHindi = 'अच्छा प्रदर्शन (Strong)';
    tierLabelEnglish = 'Strong Performance';
    tierTone = 'indigo';
  }

  const weakTopicsList = topicBreakdown.filter((t) => t.percentage < 100);
  const strongTopicsList = topicBreakdown.filter((t) => t.percentage >= 80);

  const summaryHindi =
    mistakes.length === 0
      ? `शानदार प्रदर्शन! आपने सभी ${totalQuestions} प्रश्नों का सही उत्तर दिया (100%)। आपकी व्याकरण व अर्थग्रहण पर पकड़ बहुत मजबूत है।`
      : `आपने ${totalQuestions} में से ${attemptedCount} प्रश्न हल किए (${unansweredCount > 0 ? `${unansweredCount} अनुत्तरित/छूटे, ` : ''}${correctCount} सही — ${percentage}%)। ${
          weakTopicsList.length > 0
            ? `मुख्य सुधार आवश्यक क्षेत्र: ${weakTopicsList
                .slice(0, 3)
                .map((w) => `${w.nameHindi} (${w.correct}/${w.total})`)
                .join(', ')}।`
            : ''
        }${
          strongTopicsList.length > 0
            ? ` मजबूत पक्ष: ${strongTopicsList.map((s) => s.nameHindi).join(', ')}।`
            : ''
        }`;

  const summaryEnglish =
    mistakes.length === 0
      ? `Outstanding work! You answered all ${totalQuestions} questions correctly (100%).`
      : `You answered ${attemptedCount} of ${totalQuestions} questions (${unansweredCount > 0 ? `${unansweredCount} skipped, ` : ''}${correctCount} correct — ${percentage}%). Focus areas: ${weakTopicsList
          .slice(0, 3)
          .map((w) => `${w.nameEnglish} (${w.correct}/${w.total})`)
          .join(', ')}.`;

  // Build personalized improvement plan
  const improvementPlan: ReportImprovementItem[] = [];

  if (weakTopicsList.length > 0) {
    weakTopicsList.forEach((topicStat) => {
      const tpl = getAdviceTemplate(topicStat.key);
      const missedInTopic = topicStat.total - topicStat.correct;
      improvementPlan.push({
        id: `imp_${topicStat.key}`,
        topicKey: topicStat.key,
        titleHindi: `${topicStat.nameHindi} में सुधार योजना`,
        titleEnglish: `How to Improve in ${topicStat.nameEnglish}`,
        scoreLabel: `${topicStat.correct}/${topicStat.total} (${topicStat.percentage}%)`,
        diagnosisHindi: `इस भाग में ${topicStat.total} में से ${missedInTopic} प्रश्न गलत/अनुत्तरित रहे। ${tpl.ruleFocusHindi}`,
        diagnosisEnglish: `${missedInTopic} of ${topicStat.total} questions missed in this area. ${tpl.ruleFocusEnglish}`,
        actionStepsHindi: tpl.stepsHindi,
        actionStepsEnglish: tpl.stepsEnglish,
        priority: topicStat.percentage < 50 ? 'high' : 'medium',
      });
    });
  } else {
    const primaryTopic = topicBreakdown[0];
    improvementPlan.push({
      id: 'imp_maintain',
      topicKey: primaryTopic?.key || 'mixed_board',
      titleHindi: 'शत-प्रतिशत दक्षता को बनाए रखने के अगले कदम',
      titleEnglish: 'Next Steps to Maintain 100% Mastery',
      scoreLabel: `${correctCount}/${totalQuestions} (100%)`,
      diagnosisHindi:
        'इस वर्कशीट में कोई भी त्रुटि नहीं हुई है। अब अपनी गति और कठिन/बोर्ड-स्तरीय प्रश्नों पर सटीकता बढ़ाने का समय है।',
      diagnosisEnglish:
        'Zero errors in this set! Challenge yourself with harder or board-level mixed questions to keep your edge sharp.',
      actionStepsHindi: [
        "कस्टम वर्कशीट स्टूडियो में 'कठिन' या 'बोर्ड परीक्षा स्तर' चुनकर 15-20 प्रश्नों का समयबद्ध अभ्यास करें।",
        'गलती-सुधार वर्कशीट व अपठित गद्यांश के उच्च स्तर के अनुच्छेद हल करके WordCoins बढ़ाएँ।'
      ],
      actionStepsEnglish: [
        "Select 'Hard' or 'Board Exam' difficulty in Custom Worksheet Studio for a 15-20 question challenge.",
        'Attempt advanced passages in Reading Comprehension to push analytical speed.'
      ],
      priority: 'maintain',
    });
  }

  // Add targeted skill advice if a specific skill type had < 70% accuracy across >= 2 questions
  const weakestSkill = skillBreakdown.find((s) => s.total >= 2 && s.percentage < 70);
  if (weakestSkill && improvementPlan.length < 4) {
    improvementPlan.push({
      id: `imp_${weakestSkill.key}`,
      topicKey: 'skill',
      titleHindi: `कौशल सुधार: ${weakestSkill.nameHindi}`,
      titleEnglish: `Skill Focus: ${weakestSkill.nameEnglish}`,
      scoreLabel: `${weakestSkill.correct}/${weakestSkill.total} (${weakestSkill.percentage}%)`,
      diagnosisHindi: `'${weakestSkill.nameHindi}' प्रकार के प्रश्नों में आपकी सटीकता ${weakestSkill.percentage}% रही — यहाँ विकल्प चुनने से पहले नियम की जाँच करने से अंक तुरंत बढ़ेंगे।`,
      diagnosisEnglish: `Your accuracy on '${weakestSkill.nameEnglish}' questions was ${weakestSkill.percentage}%. Double-checking the core rule before selecting an option will boost your score.`,
      actionStepsHindi: [
        'चारों विकल्पों में से पहले दो स्पष्ट रूप से गलत विकल्प हटाएँ (Elimination Method), फिर सही उत्तर की पुष्टि करें।',
        'नीचे दिए गए गलत प्रश्नों की व्याख्या पढ़कर वही प्रश्न दोबारा मन में हल करें।'
      ],
      actionStepsEnglish: [
        'Use elimination to cross out two clearly incorrect distractors before picking your final answer.',
        'Re-read the explanation for each missed item below and solve it mentally once more.'
      ],
      priority: weakestSkill.percentage < 50 ? 'high' : 'medium',
    });
  }

  if (unansweredCount > 0) {
    improvementPlan.push({
      id: 'imp_unanswered',
      topicKey: 'attempt',
      titleHindi: `अनुत्तरित प्रश्नों का प्रबंधन (${unansweredCount} प्रश्न छूटे)`,
      titleEnglish: `Complete All Questions (${unansweredCount} Skipped)`,
      scoreLabel: `${attemptedCount}/${totalQuestions} हल`,
      diagnosisHindi: `आपने ${unansweredCount} प्रश्न बिना उत्तर दिए छोड़ दिए, जिससे सीधे अंक कम हुए (इस परीक्षा में नकारात्मक अंकन नहीं है)।`,
      diagnosisEnglish: `${unansweredCount} questions were left unanswered, directly reducing your score (there is no negative marking).`,
      actionStepsHindi: [
        'जमा करने से पहले हमेशा जाँच लें कि सभी प्रश्नों के उत्तर चुने गए हैं।',
        'कठिन प्रश्न पर अटकने पर तार्किक अनुमान लगाकर निकटतम सही विकल्प अवश्य चुनें।'
      ],
      actionStepsEnglish: [
        'Always verify every question has a selected option before submitting.',
        'When unsure, apply grammatical elimination rather than leaving a question blank.'
      ],
      priority: 'medium',
    });
  }

  return {
    titleHindi,
    titleEnglish,
    totalQuestions,
    attemptedCount,
    unansweredCount,
    correctCount,
    wrongCount,
    percentage,
    wordCoinsEarned: coins,
    tierLabelHindi,
    tierLabelEnglish,
    tierTone,
    summaryHindi,
    summaryEnglish,
    topicBreakdown,
    skillBreakdown,
    mistakes,
    improvementPlan,
  };
}

export function toSavedReportSummary(
  report: WorksheetDiagnosticReport,
  meta: {
    id: string;
    sourceType: SavedReportSummary['sourceType'];
    grade?: string;
  }
): SavedReportSummary {
  const weakAreasHindi = report.topicBreakdown
    .filter((t) => t.status !== 'strong')
    .map((t) => `${t.nameHindi} (${t.percentage}%)`)
    .slice(0, 5);
  const strongAreasHindi = report.topicBreakdown
    .filter((t) => t.status === 'strong')
    .map((t) => t.nameHindi)
    .slice(0, 5);
  const firstAdvice = report.improvementPlan[0];
  const adviceSummaryHindi =
    firstAdvice?.actionStepsHindi?.[0] || firstAdvice?.diagnosisHindi || report.summaryHindi;

  return {
    id: meta.id,
    sourceType: meta.sourceType,
    titleHindi: report.titleHindi,
    titleEnglish: report.titleEnglish,
    grade: meta.grade,
    score: report.correctCount,
    maxScore: report.totalQuestions,
    attemptedCount: report.attemptedCount,
    unansweredCount: report.unansweredCount,
    percentage: report.percentage,
    wordCoinsEarned: report.wordCoinsEarned,
    weakAreasHindi,
    strongAreasHindi,
    adviceSummaryHindi,
    date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }),
    timestamp: new Date().toISOString(),
  };
}
