export interface StudyPlanTopicGuide {
  key: string;
  matchPatterns: RegExp[];
  topicHindi: string;
  topicEnglish: string;
  whyConfusingHindi: string;
  whyConfusingEnglish: string;
  remedyHindi: string;
  dayTitleHindi: string;
  dayTitleEnglish: string;
  ruleHindi: string;
  ruleEnglish: string;
  quickTip: string;
  tasksHindi: string[];
  practiceCount: number;
  simModuleId?: string;
}

export interface StudyPlanDayModule {
  day: number;
  dayLabelHindi: string;
  topicHindi: string;
  title: string;
  titleEnglish: string;
  ruleHindi: string;
  ruleEnglish: string;
  quickTip: string;
  dailyTasksHindi: string[];
  practiceCount: number;
  simModuleId?: string;
}

export interface DiagnosticWeaknessNote {
  topic: string;
  whyConfusingHindi: string;
  whyConfusingEnglish: string;
  remedy: string;
}

export interface SevenDayStudyPlan {
  courseTitle: string;
  summaryHindi: string;
  summaryEnglish: string;
  estimatedDays: number;
  diagnosticWeaknessNotes: DiagnosticWeaknessNote[];
  modules: StudyPlanDayModule[];
  motivationalQuoteHindi: string;
  motivationalQuoteEnglish: string;
}

const TOPIC_GUIDES: StudyPlanTopicGuide[] = [
  {
    key: 'shabd_vichar',
    matchPatterns: [/शब्द-विचार|शब्द विचार|shabd.?vichar|तत्सम|तद्भव|देशज|रूढ़|यौगिक/i],
    topicHindi: 'शब्द-विचार (तत्सम-तद्भव, रूढ़-यौगिक-योगरूढ़)',
    topicEnglish: 'Word Classification (Shabd-Vichar)',
    whyConfusingHindi: 'तत्सम-तद्भव शब्दों तथा यौगिक और योगरूढ़ (विशेष अर्थ वाले) शब्दों के भेद में भ्रम हो जाता है।',
    whyConfusingEnglish: 'Students often confuse Sanskrit-derived Tatsam words with Tadbhav forms, or Yaugik vs Yogrudh compounds.',
    remedyHindi: 'प्रत्येक शब्द के टुकड़े करके देखें: यदि तीसरा विशेष अर्थ निकले (जैसे पंकज = कमल) तो योगरूढ़, अन्यथा सामान्य जोड़ यौगिक है।',
    dayTitleHindi: 'शब्द-विचार: स्रोत व रचना के आधार पर भेद',
    dayTitleEnglish: 'Word Origin & Structural Classification',
    ruleHindi: 'उत्पत्ति के आधार पर शब्द तत्सम, तद्भव, देशज व विदेशी होते हैं; रचना के आधार पर रूढ़ (टुकड़े निरर्थक), यौगिक (टुकड़े सार्थक) और योगरूढ़ (तीसरा विशेष अर्थ) होते हैं।',
    ruleEnglish: 'Classify words by origin (Tatsam, Tadbhav, Deshaj, Videshi) and structure (Rudh, Yaugik, Yogrudh).',
    quickTip: 'क्ष, त्र, ज्ञ, श्र तथा ऋ की मात्रा वाले शब्द प्रायः तत्सम होते हैं; चंद्रबिंदु (ँ) वाले शब्द प्रायः तद्भव होते हैं।',
    tasksHindi: [
      'तत्सम-तद्भव के 15 प्रमुख युग्म (जैसे अग्नि-आग, दुग्ध-दूध, सूर्य-सूरज) लिखकर दोहराएँ।',
      'रूढ़, यौगिक और योगरूढ़ के 5-5 उदाहरणों का विच्छेद करें।',
      'कस्टम वर्कशीट स्टूडियो में "शब्द-विचार" के 10 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'shabd-vichar',
  },
  {
    key: 'upsarg_pratyay',
    matchPatterns: [/उपसर्ग|प्रत्यय|upsarg|pratyay|affix/i],
    topicHindi: 'उपसर्ग एवं प्रत्यय (मूल शब्द विच्छेद)',
    topicEnglish: 'Prefixes & Suffixes (Root Extraction)',
    whyConfusingHindi: 'मूल शब्द से उपसर्ग या प्रत्यय अलग करते समय संधि या स्वर-वृद्धि (' + "'इक'" + ' प्रत्यय जैसे धर्म -> धार्मिक) की अनदेखी हो जाती है।',
    whyConfusingEnglish: 'Learners struggle to isolate the meaningful root word when prefixes blend or suffixes alter the initial vowel.',
    remedyHindi: 'शब्दांश हटाने के बाद जाँचें कि बचा हुआ मूल शब्द स्वयं स्वतंत्र और सार्थक है या नहीं।',
    dayTitleHindi: 'उपसर्ग व प्रत्यय: मूल शब्द और शब्दांश का सटीक अलगाव',
    dayTitleEnglish: 'Prefixes, Suffixes & Root Word Dissection',
    ruleHindi: 'उपसर्ग मूल शब्द के आरंभ (आगे) जुड़कर अर्थ बदलते हैं, जबकि प्रत्यय शब्द के अंत (पीछे) जुड़कर नए संज्ञा या विशेषण बनाते हैं।',
    ruleEnglish: 'Prefixes attach before the root word; suffixes attach after the root to derive new forms.',
    quickTip: "हमेशा बीच का सार्थक 'मूल शब्द' पहले पहचानें — आगे बचा भाग उपसर्ग और पीछे बचा भाग प्रत्यय होगा।",
    tasksHindi: [
      'उपसर्ग-प्रत्यय स्टूडियो में 10 शब्दों की तालिका बनाकर विग्रह सूत्र पढ़ें।',
      "'इक' प्रत्यय वाले 6 शब्द (समाज->सामाजिक, इतिहास->ऐतिहासिक) अभ्यास करें।",
      'अभ्यास प्रश्नावली में कम से कम 7 प्रश्न बिना हिंट के हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'upsarg-pratyay',
  },
  {
    key: 'samas',
    matchPatterns: [/समास|samas|compound/i],
    topicHindi: 'समास-विग्रह एवं 6 भेद',
    topicEnglish: 'Compounds & Expansion (Samas)',
    whyConfusingHindi: 'कर्मधारय और बहुव्रीहि समास तथा तत्पुरुष के कारक भेदों की पहचान विग्रह के बिना करने से उत्तर गलत हो जाते हैं।',
    whyConfusingEnglish: 'Without expanding the compound first, Karmadharaya and Bahuvrihi look nearly identical.',
    remedyHindi: 'पहले समस्तपद का सटीक समास-विग्रह लिखें: विग्रह में कारक-चिह्न आए तो तत्पुरुष, विशेषण-विशेष्य आए तो कर्मधारय, और तीसरा अर्थ आए तो बहुव्रीहि।',
    dayTitleHindi: 'समास-विग्रह तकनीक और छः भेदों की पहचान',
    dayTitleEnglish: 'Samas Vigraha & Compound Type Decoding',
    ruleHindi: 'दो या अधिक शब्दों के संक्षिप्तीकरण को समास कहते हैं। पूर्वपद अव्यय हो तो अव्ययीभाव, संख्या हो तो द्विगु, दोनों प्रधान हों तो द्वंद्व और अन्य पद प्रधान हो तो बहुव्रीहि समास होता है।',
    ruleEnglish: 'Expand the compound to inspect whether the first, second, both, or an external third meaning dominates.',
    quickTip: 'संख्यावाची पहला पद = द्विगु; योजक/और = द्वंद्व; तीसरा विशेष अर्थ (दशानन = रावण) = बहुव्रीहि।',
    tasksHindi: [
      'समास के सभी 6 भेदों के 2-2 उदाहरण विग्रह सहित लिखें।',
      'पीतांबर व नीलकंठ जैसे शब्दों के कर्मधारय बनाम बहुव्रीहि विग्रह में अंतर समझें।',
      'समास सिमुलेशन व 8 प्रश्नों का अभ्यास सेट हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'samas',
  },
  {
    key: 'sangya',
    matchPatterns: [/संज्ञा|sangya|noun/i],
    topicHindi: 'संज्ञा के भेद (व्यक्ति, जाति, भाव, द्रव्य, समूहवाचक)',
    topicEnglish: 'Noun Classification (Sangya)',
    whyConfusingHindi: 'व्यक्तिवाचक और जातिवाचक संज्ञा के प्रयोग तथा विशेषण/क्रिया से भाववाचक संज्ञा बनाने में अशुद्धियाँ होती हैं।',
    whyConfusingEnglish: 'Mixing proper vs common nouns in context and forming abstract nouns accurately causes mistakes.',
    remedyHindi: 'जिसे छुआ न जा सके केवल अनुभव किया जा सके (मिठास, मित्रता, बचपन), वह भाववाचक संज्ञा है।',
    dayTitleHindi: 'संज्ञा पहचान एवं भाववाचक संज्ञा निर्माण',
    dayTitleEnglish: 'Noun Types & Abstract Noun Formation',
    ruleHindi: 'किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को संज्ञा कहते हैं। विशेष नाम व्यक्तिवाचक, संपूर्ण वर्ग जातिवाचक और गुण-दशा-भाव भाववाचक संज्ञा कहलाते हैं।',
    ruleEnglish: 'Proper nouns name specific entities; common nouns name a whole class; abstract nouns express qualities/states.',
    quickTip: 'जातिवाचक या विशेषण में -ता, -पन, -त्व, -आई जोड़कर भाववाचक संज्ञा बनती है (मित्र -> मित्रता)।',
    tasksHindi: [
      '5 जातिवाचक शब्दों से भाववाचक संज्ञा बनाएँ (जैसे बच्चा->बचपन, वीर->वीरता)।',
      'द्रव्यवाचक (सोना, दूध) और समूहवाचक (सेना, गुच्छा) के अंतर दोहराएँ।',
      'संज्ञा सिमुलेशन लैब में सभी 6 परिदृश्य हल करें।',
    ],
    practiceCount: 6,
    simModuleId: 'sangya',
  },
  {
    key: 'ling',
    matchPatterns: [/लिंग|ling|gender/i],
    topicHindi: 'लिंग निर्णय व पुल्लिंग-स्त्रीलिंग परिवर्तन',
    topicEnglish: 'Grammatical Gender (Ling)',
    whyConfusingHindi: 'अपवाद शब्दों (जैसे दही, पानी, मोती पुल्लिंग; नदी, हवा, पुस्तक स्त्रीलिंग) का लिंग अनुमान से गलत चुन लिया जाता है।',
    whyConfusingEnglish: 'Exception nouns like दही/पानी (masculine) and पुस्तक/वायु (feminine) do not match simple ending guesses.',
    remedyHindi: 'किसी भी शब्द का लिंग जानने के लिए उसके पहले "मेरा/मेरी" या "अच्छा/अच्छी" लगाकर छोटा वाक्य बनाएँ।',
    dayTitleHindi: 'लिंग निर्णय, अपवाद और परिवर्तन के नियम',
    dayTitleEnglish: 'Gender Recognition & Transformation Rules',
    ruleHindi: 'शब्द के जिस रूप से उसके पुरुष या स्त्री जाति के होने का बोध हो, उसे लिंग कहते हैं। निर्जीव वस्तुओं का लिंग क्रिया व विशेषण के प्रयोग से तय होता है।',
    ruleEnglish: 'Determine noun gender by checking verb/adjective agreement in natural Hindi phrases.',
    quickTip: 'पर्वत, दिन, महीने, धातु व रत्न प्रायः पुल्लिंग होते हैं; भाषाएँ, नदियाँ व तिथियाँ प्रायः स्त्रीलिंग होती हैं।',
    tasksHindi: [
      '"मेरा/मेरी" परीक्षण से 10 अपवाद शब्दों (दही, मोती, आँख, नाक, हवा) का लिंग जाँचें।',
      'प्रत्यय परिवर्तन नियमों (-इन, -आनी, -इका, -मती) के 8 जोड़े अभ्यास करें।',
      'लिंग संबंधित 8 बहुविकल्पीय प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'ling',
  },
  {
    key: 'vachan',
    matchPatterns: [/वचन|vachan|number/i],
    topicHindi: 'वचन परिवर्तन (एकवचन व बहुवचन वर्तनी)',
    topicEnglish: 'Singular & Plural Forms (Vachan)',
    whyConfusingHindi: 'ईकारांत स्त्रीलिंग शब्दों (' + "'नदी -> नदियाँ'" + ') में अंतिम बड़ी "ई" को छोटी "इ" करने और नित्य बहुवचन शब्दों की पहचान में गलती होती है।',
    whyConfusingEnglish: 'Students forget to shorten final long -ई to -इयाँ or miss always-plural nouns like हस्ताक्षर/प्राण।',
    remedyHindi: 'बहुवचन बनाते समय अंत में "-याँ" जोड़ने से पहले बड़ी "ई" को छोटी "इ" में बदलें और नित्य बहुवचन शब्द अलग से याद रखें।',
    dayTitleHindi: 'वचन परिवर्तन के नियम एवं वर्तनी सावधानी',
    dayTitleEnglish: 'Pluralization Patterns & Spelling Rules',
    ruleHindi: 'संज्ञा के जिस रूप से संख्या के एक या अनेक होने का बोध हो, उसे वचन कहते हैं। प्राण, दर्शन, आँसू व हस्ताक्षर सदैव बहुवचन में प्रयुक्त होते हैं।',
    ruleEnglish: 'Track -ए/-एँ/-याँ plural suffixes and remember invariable plural nouns.',
    quickTip: 'अंत में "ई" हो तो बहुवचन में "इयाँ" हो जाता है (मिठाई -> मिठाइयाँ, दवाई -> दवाइयाँ)।',
    tasksHindi: [
      'ईकारांत स्त्रीलिंग शब्दों के 10 शुद्ध बहुवचन रूप लिखकर वर्तनी मिलाएँ।',
      'नित्य एकवचन (भीड़, जनता, पानी) व नित्य बहुवचन (प्राण, हस्ताक्षर, आँसू) सूची पढ़ें।',
      'वचन वर्कशीट के 8 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'vachan',
  },
  {
    key: 'karak',
    matchPatterns: [/कारक|karak|परसर्ग|case/i],
    topicHindi: 'कारक एवं परसर्ग (करण बनाम अपादान भेद)',
    topicEnglish: 'Case Markers: Karan vs Apadan',
    whyConfusingHindi: "करण कारक और अपादान कारक दोनों में 'से' विभक्ति आती है, जिससे साधन और अलगाव में भ्रम हो जाता है।",
    whyConfusingEnglish: "Both Karan (instrument) and Apadan (separation) share the postposition 'से'.",
    remedyHindi: "पूछें: क्या 'से' किसी औज़ार/माध्यम को दर्शाता है (करण) या अलग होने, डरने, तुलना व निकलने को (अपादान)?",
    dayTitleHindi: 'कारक के 8 भेद और "से" विभक्ति की पक्की पहचान',
    dayTitleEnglish: 'Case Markers & Karan vs. Apadan Detective',
    ruleHindi: 'क्रिया के साथ संज्ञा या सर्वनाम का संबंध बताने वाले चिह्न कारक कहलाते हैं। साधन में करण कारक और अलगाव, भय या तुलना में अपादान कारक होता है।',
    ruleEnglish: "Use 'with/by' sense for Karan Karak and 'from/away/fear/comparison' for Apadan Karak.",
    quickTip: 'जुड़ाव/साधन = करण (कलम से लिखा); जुदाई/डर/तुलना = अपादान (पेड़ से पत्ता गिरा, शेर से डरा)।',
    tasksHindi: [
      'सभी 8 कारकों और उनके परसर्ग (ने, को, से, के लिए, में/पर, का/के/की) तालिका से दोहराएँ।',
      'Karak Cables सिमुलेशन में करण बनाम अपादान के 6 उदाहरण हल करें।',
      'कारक कस्टम वर्कशीट में कम से कम 8 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'karak',
  },
  {
    key: 'sarvanam',
    matchPatterns: [/सर्वनाम|sarvanam|pronoun/i],
    topicHindi: 'सर्वनाम के 6 भेद एवं सार्वनामिक विशेषण अंतर',
    topicEnglish: 'Pronouns & Demonstrative Distinction',
    whyConfusingHindi: "'आप' (निजवाचक बनाम आदरसूचक मध्यम पुरुष) तथा संज्ञा से पहले आने वाले 'यह/वह' (सार्वनामिक विशेषण) में भ्रम होता है।",
    whyConfusingEnglish: "Confusion between reflexive vs polite 'आप' and pronoun vs demonstrative adjective.",
    remedyHindi: 'यदि "यह/वह" संज्ञा के ठीक पहले उसकी ओर संकेत करे तो वह सार्वनामिक विशेषण है; अकेले संज्ञा की जगह आए तो निश्चयवाचक सर्वनाम।',
    dayTitleHindi: 'सर्वनाम के छः भेद और प्रयोग-संदर्भ की पहचान',
    dayTitleEnglish: 'All 6 Pronoun Classes & Contextual Usage',
    ruleHindi: 'संज्ञा के स्थान पर प्रयुक्त होने वाले शब्द सर्वनाम हैं। इसके 6 भेद हैं: पुरुषवाचक, निश्चयवाचक, अनिश्चयवाचक, संबंधवाचक, प्रश्नवाचक और निजवाचक।',
    ruleEnglish: 'Identify personal, definite, indefinite, relative, interrogative, and reflexive pronouns by context.',
    quickTip: 'कोई/कुछ = अनिश्चयवाचक; जो-सो = संबंधवाचक; स्वयं/अपने-आप = निजवाचक।',
    tasksHindi: [
      'सर्वनाम के 6 भेदों के एक-एक वाक्य स्वयं लिखें।',
      '"यह मेरी किताब है" बनाम "यह किताब मेरी है" में अंतर जाँचें।',
      'सर्वनाम अभ्यास के 8 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'sarvanam',
  },
  {
    key: 'visheshan',
    matchPatterns: [/विशेषण निर्माण|विशेषण|visheshan|adjective/i],
    topicHindi: 'विशेषण के भेद, अवस्थाएँ व विशेषण निर्माण',
    topicEnglish: 'Adjectives, Degrees & Derivation',
    whyConfusingHindi: 'संख्यावाचक बनाम परिमाणवाचक भेद तथा संज्ञा शब्दों से "-इक/-ईय/-आलु" प्रत्यय द्वारा शुद्ध विशेषण बनाने में त्रुटि होती है।',
    whyConfusingEnglish: 'Mixing countable vs measurable modifiers or mis-deriving adjectives from root nouns.',
    remedyHindi: 'गिने जा सकने वाले शब्द संख्यावाचक और नापे-तौले जाने वाले शब्द परिमाणवाचक विशेषण होते हैं; विशेषण निर्माण में मूल शब्द के आगे प्रत्यय जोड़कर वाक्य में परखें।',
    dayTitleHindi: 'विशेषण भेद, तुलनात्मक अवस्थाएँ व विशेषण निर्माण',
    dayTitleEnglish: 'Adjective Types, Degrees & Word Derivation',
    ruleHindi: 'संज्ञा या सर्वनाम की विशेषता बताने वाले शब्द विशेषण कहलाते हैं (गुणवाचक, संख्यावाचक, परिमाणवाचक, सार्वनामिक)। उत्तरावस्था में "-तर" और उत्तमावस्था में "-तम" जुड़ता है।',
    ruleEnglish: 'Use संख्यावाचक for countable items, परिमाणवाचक for measured quantities, and -तर/-तम for degrees.',
    quickTip: 'दिन -> दैनिक, भूगोल -> भौगोलिक, दया -> दयालु, भारत -> भारतीय (संज्ञा से विशेषण निर्माण)।',
    tasksHindi: [
      '10 प्रमुख संज्ञा शब्दों (इतिहास, नगर, सुख, राष्ट्र, नमक) से शुद्ध विशेषण बनाएँ।',
      'निश्चित बनाम अनिश्चित संख्यावाचक व परिमाणवाचक के 4-4 उदाहरण देखें।',
      'विशेषण / विशेषण निर्माण के 8 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'visheshan',
  },
  {
    key: 'kriya',
    matchPatterns: [/क्रिया|kriya|verb/i],
    topicHindi: 'क्रिया के भेद (सकर्मक, अकर्मक, पूर्वकालिक, प्रेरणार्थक)',
    topicEnglish: 'Verbs: Transitive, Intransitive & Derived Forms',
    whyConfusingHindi: 'सकर्मक और अकर्मक क्रिया पहचानने में तथा "लिखवाना/पढ़वाना" जैसी प्रेरणार्थक क्रियाओं के प्रथम-द्वितीय रूप में भ्रम होता है।',
    whyConfusingEnglish: 'Checking for an implied object (transitive vs intransitive) and separating first vs second causative verbs.',
    remedyHindi: 'क्रिया से ठीक पहले "क्या?" या "किसे?" प्रश्न पूछें — यदि कोई सार्थक उत्तर मिले तो सकर्मक क्रिया, अन्यथा अकर्मक क्रिया।',
    dayTitleHindi: 'सकर्मक-अकर्मक परीक्षण एवं रचना के अनुसार क्रिया भेद',
    dayTitleEnglish: 'Verb Classification & Object Testing',
    ruleHindi: 'जिस वाक्य में क्रिया का फल कर्म पर पड़े वह सकर्मक और कर्ता पर रहे वह अकर्मक क्रिया होती है। "-कर" लगने से पूर्वकालिक क्रिया बनती है।',
    ruleEnglish: 'Ask "what/whom?" before the verb to identify Sakarmak (transitive) vs Akarmak (intransitive).',
    quickTip: '"खाकर सो गया" में "खाकर" मुख्य क्रिया से पहले होने के कारण पूर्वकालिक क्रिया है।',
    tasksHindi: [
      '6 वाक्यों पर "क्या/किसे?" परीक्षण लगाकर सकर्मक-अकर्मक अलग करें।',
      'संयुक्त, नामधातु (बात->बतियाना) और प्रेरणार्थक क्रिया के 4 उदाहरण दोहराएँ।',
      'क्रिया के 6 अभ्यास प्रश्न हल करें।',
    ],
    practiceCount: 6,
    simModuleId: 'kriya',
  },
  {
    key: 'kaal',
    matchPatterns: [/काल|kaal|tense/i],
    topicHindi: 'काल एवं उपभेद (वर्तमान, भूत, भविष्यत्)',
    topicEnglish: 'Tenses & Conditional Aspect (Kaal)',
    whyConfusingHindi: 'आसन्न भूतकाल, पूर्ण भूतकाल, संदिग्ध काल और हेतुहेतुमद् काल के सूक्ष्म अंतर पहचानने में कठिनाई होती है।',
    whyConfusingEnglish: 'Separating recent past, perfect past, doubtful, and conditional tenses.',
    remedyHindi: 'वाक्य की अंतिम सहायक क्रिया पर ध्यान दें: "अभी गया है" = आसन्न भूत; "गया था" = पूर्ण भूत; "यदि... तो" = हेतुहेतुमद् काल।',
    dayTitleHindi: 'काल चक्र: तीनों कालों के उपभेद और रूपांतरण',
    dayTitleEnglish: 'Tenses, Sub-Types & Auxiliary Endings',
    ruleHindi: 'क्रिया के घटित होने के समय को काल कहते हैं। जब एक क्रिया का होना दूसरी शर्त पर निर्भर हो ("यदि पढ़ता तो पास होता"), वहाँ हेतुहेतुमद् काल होता है।',
    ruleEnglish: 'Match verb endings carefully: ता है (Simple Present), रहा था (Past Continuous), यदि-तो (Conditional).',
    quickTip: 'जहाँ शर्त ("यदि/अगर... तो") दिखे, वह हमेशा हेतुहेतुमद् भूत या भविष्यत् काल होता है!',
    tasksHindi: [
      'Kaal Dial सिमुलेशन में एक ही धातु के वर्तमान, भूत व भविष्यत् रूप बदलकर देखें।',
      'आसन्न भूत, संदिग्ध भूत और हेतुहेतुमद् भूत के 2-2 उदाहरण लिखें।',
      'काल के 8 अभ्यास प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'kaal',
  },
  {
    key: 'vachya',
    matchPatterns: [/वाच्य|vachya|voice/i],
    topicHindi: 'वाच्य पहचान एवं रूपांतरण (कर्तृ, कर्म, भाववाच्य)',
    topicEnglish: 'Voice: Kartri, Karm & Bhavvachya',
    whyConfusingHindi: 'वाच्य बदलते समय छात्र गलती से वाक्य का काल (Tense) बदल देते हैं, या असमर्थता वाले भाववाच्य को कर्मवाच्य समझ लेते हैं।',
    whyConfusingEnglish: 'Shifting tense accidentally during voice transformation or mixing Bhavvachya with Karmvachya.',
    remedyHindi: 'वाच्य परिवर्तन में मूल काल वही रखें; कर्म न हो (अकर्मक क्रिया) और "से... नहीं जाता" का भाव हो तो भाववाच्य होगा।',
    dayTitleHindi: 'वाच्य स्पॉटलाइट: कर्ता, कर्म और भाव की प्रधानता',
    dayTitleEnglish: 'Voice Conversion Rules Without Tense Shift',
    ruleHindi: 'कर्तृवाच्य में कर्ता प्रधान, कर्मवाच्य में कर्म प्रधान (सकर्मक + के द्वारा) और भाववाच्य में अकर्मक क्रिया व भाव प्रधान (अन्य पुरुष एकवचन पुल्लिंग) होता है।',
    ruleEnglish: 'Preserve original tense while adding "के द्वारा" or "से" and adjusting verb agreement.',
    quickTip: 'सकर्मक + के द्वारा = कर्मवाच्य ("पत्र लिखा गया"); अकर्मक + से/नहीं जाता = भाववाच्य ("मुझसे चला नहीं जाता")।',
    tasksHindi: [
      'Vachya Spotlight सिमुलेशन में कर्तृ से कर्म/भाववाच्य रूपांतरण के 6 उदाहरण देखें।',
      '5 वाक्यों का वाच्य बदलते समय ध्यान दें कि भूत/वर्तमान काल न बदले।',
      'वाच्य वर्कशीट के 8 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'vachya',
  },
  {
    key: 'avikari',
    matchPatterns: [/अविकारी|अव्यय|निपात|avikari|nipat|indeclinable/i],
    topicHindi: 'अविकारी शब्द (अव्यय के 4 भेद) एवं निपात',
    topicEnglish: 'Indeclinables (Avyay) & Emphatic Particles (Nipat)',
    whyConfusingHindi: 'संबंधबोधक अव्यय ("के ऊपर, के बिना") और क्रियाविशेषण ("ऊपर, धीरे-धीरे") तथा निपात ("ही, भी, तो, तक") के भेद में भ्रम होता है।',
    whyConfusingEnglish: 'Distinguishing adverbs from postpositional prepositions and emphatic particles (Nipat).',
    remedyHindi: 'यदि "के/से" लगाकर किसी संज्ञा से संबंध जुड़े (घर के बाहर) तो संबंधबोधक; सीधे क्रिया की विशेषता बताए (बाहर आओ) तो क्रियाविशेषण।',
    dayTitleHindi: 'अविकारी शब्द (क्रियाविशेषण, संबंध, समुच्चय, विस्मयादि) व निपात',
    dayTitleEnglish: 'Avikari Shabd & Emphatic Nipat Mastery',
    ruleHindi: 'जिन शब्दों के रूप में लिंग, वचन या कारक के कारण कोई परिवर्तन नहीं होता, वे अविकारी (अव्यय) कहलाते हैं। निपात ("ही, भी, तो, मात्र, भर") बात पर विशेष बल देते हैं।',
    ruleEnglish: 'Avyay words never inflect; watch whether they modify a verb (Kriyavisheshan) or link a noun (Sambandhbodhak).',
    quickTip: '"के साथ / के बिना / के सामने" = संबंधबोधक; "ही / भी / तो / तक" = निपात (बलदायक)।',
    tasksHindi: [
      'क्रियाविशेषण के 4 उपभेदों (काल, स्थान, रीति, परिमाणवाचक) के 2-2 शब्द लिखें।',
      'ही, भी, तो, तक, मात्र निपातों का एक-एक वाक्य में प्रयोग करें।',
      'अविकारी शब्द व निपात सिमुलेशन में 6 प्रश्न हल करें।',
    ],
    practiceCount: 6,
    simModuleId: 'avikari',
  },
  {
    key: 'pad_parichay',
    matchPatterns: [/पद-परिचय|पद परिचय|pad.?parichay|parsing/i],
    topicHindi: 'पद-परिचय (वाक्य में शब्द का पूर्ण व्याकरणिक विश्लेषण)',
    topicEnglish: 'Syntactic Word Parsing (Pad-Parichay)',
    whyConfusingHindi: 'छात्र शब्द का भेद पहचान लेते हैं पर उसके लिंग, वचन, कारक या क्रिया से संबंध वाले एक बिंदु पर चूक जाते हैं।',
    whyConfusingEnglish: 'Missing a single inflectional attribute (gender, number, case, or verb link) invalidates the whole option.',
    remedyHindi: 'प्रत्येक रेखांकित पद के 4 बिंदु क्रम से जाँचें: 1) शब्द-भेद व उपभेद, 2) लिंग, 3) वचन, 4) कारक/काल/संबंध।',
    dayTitleHindi: 'पद-परिचय: 4-चरणीय शब्द-विश्लेषण पद्धति',
    dayTitleEnglish: 'Step-by-Step Pad-Parichay Parsing Lab',
    ruleHindi: 'वाक्य में प्रयुक्त शब्द "पद" कहलाता है। पद-परिचय में उस पद का व्याकरणिक भेद, उपभेद, लिंग, वचन, कारक व अन्य पदों से संबंध बताया जाता है।',
    ruleEnglish: 'Verify word class, sub-type, gender, number, case/tense, and relation to the predicate.',
    quickTip: 'विकल्पों को काटने (Elimination) की विधि अपनाएँ — जो एक भी गुण गलत बताए, उसे तुरंत हटा दें।',
    tasksHindi: [
      'संज्ञा, सर्वनाम, विशेषण व क्रिया प्रत्येक का 1-1 पद-परिचय 4 बिंदुओं में लिखें।',
      'Pad-Parichay Parser लैब के सभी उदाहरण हल करें।',
      'पद-परिचय के 8 बहुविकल्पीय प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'pad-parichay',
  },
  {
    key: 'vakya',
    matchPatterns: [/वाक्य|vakya|sentence|अर्थ और रचना|अर्थ व रचना|do as directed|परिवर्तन/i],
    topicHindi: 'वाक्य-विचार, वाक्य भेद (अर्थ व रचना) और वाक्य-परिवर्तन',
    topicEnglish: 'Sentence Classification & Transformation (Do as Directed)',
    whyConfusingHindi: 'संयुक्त बनाम मिश्र वाक्य के योजक शब्दों तथा वाक्य बदलते समय मूल अर्थ बनाए रखने में कठिनाई होती है।',
    whyConfusingEnglish: 'Confusing compound vs complex conjunctions and altering intended meaning during transformation.',
    remedyHindi: 'योजक देखें: और/किंतु/इसलिए = संयुक्त; जो-वह/यदि-तो/क्योंकि/कि = मिश्र; एक ही मुख्य क्रिया = सरल वाक्य।',
    dayTitleHindi: 'वाक्य भेद (अर्थ व रचना) एवं सटीक वाक्य रूपांतरण',
    dayTitleEnglish: 'Sentence Structure, Meaning Types & Transformation',
    ruleHindi: 'रचना के आधार पर 3 भेद (सरल, संयुक्त, मिश्र) तथा अर्थ के आधार पर 8 भेद (विधान, निषेध, प्रश्न, आज्ञा, इच्छा, संदेह, विस्मय, संकेतवाचक) होते हैं।',
    ruleEnglish: 'Separate coordinating links (Compound) from subordinating/correlative links (Complex) without losing meaning.',
    quickTip: 'मिश्र वाक्य में एक प्रधान और कम से कम एक आश्रित उपवाक्य (कि, क्योंकि, जब...तब) होता है।',
    tasksHindi: [
      'एक ही सरल वाक्य को संयुक्त और मिश्र दोनों में बदलकर देखें।',
      'अर्थ के 8 भेदों (निषेध, संदेह, संकेत आदि) की पहचान का अभ्यास करें।',
      'Vakya Junction सिमुलेशन व 8 अभ्यास प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'vakya',
  },
  {
    key: 'ashuddhi_shuddhi',
    matchPatterns: [/अशुद्धि|वर्तनी|वाक्य शुद्धि|vartani|shuddhi|spelling|error correction/i],
    topicHindi: 'वर्तनी शुद्धि एवं वाक्य अशुद्धि शोधन',
    topicEnglish: 'Spelling & Sentence Error Correction',
    whyConfusingHindi: 'पुनरुक्ति दोष ("वापस लौट आया"), कर्ता-क्रिया लिंग-वचन दोष, और इ-ई/उ-ऊ की मानक वर्तनी (उज्ज्वल, कवयित्री, आशीर्वाद) पकड़ में नहीं आती।',
    whyConfusingEnglish: 'Missing double redundancies, verb agreement mismatches, and tricky vowel-length spellings.',
    remedyHindi: 'वाक्य को धीरे से पढ़कर लिंग-वचन अन्विति, कारक चिह्न और अनावश्यक दोहरे शब्दों ("सारे देश भर" -> "देश भर") की जाँच करें।',
    dayTitleHindi: 'वर्तनी व वाक्य शुद्धि: सामान्य अशुद्धियाँ और सुधार',
    dayTitleEnglish: 'Spelling Purity & Grammatical Error Detection',
    ruleHindi: 'शुद्ध वाक्य में कर्ता के लिंग-वचन के अनुसार क्रिया, सही परसर्ग, उचित पदक्रम तथा मानक हिंदी वर्तनी होनी चाहिए।',
    ruleEnglish: 'Check spelling matras, subject-verb gender/number agreement, and remove redundant words.',
    quickTip: 'कठिन वर्तनी (उज्ज्वल, कवयित्री, पूजनीय, ऐतिहासिक, आशीर्वाद) को 3-3 बार लिखकर पक्का करें।',
    tasksHindi: [
      'परीक्षा में बार-बार आने वाले 12 अशुद्ध-शुद्ध शब्दों की सूची दोहराएँ।',
      'वाक्य शुद्धि के 6 प्रमुख दोषों (पुनरुक्ति, कारक, लिंग, वचन) के उदाहरण देखें।',
      'वर्तनी व वाक्य शुद्धि के 8 अभ्यास प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'vartani-shuddhi',
  },
  {
    key: 'viram_chinh',
    matchPatterns: [/विराम|viram|punctuation/i],
    topicHindi: 'विराम-चिह्न प्रयोग (अल्पविराम, योजक, उद्धरण, निर्देशक)',
    topicEnglish: 'Punctuation Marks Usage (Viram Chinh)',
    whyConfusingHindi: 'योजक (-) व निर्देशक (—), तथा अल्पविराम (,) व अर्धविराम (;) एवं इकहरे-दोहरे उद्धरण चिह्न के स्थान में भ्रम होता है।',
    whyConfusingEnglish: 'Mixing up hyphen vs dash, comma vs semicolon, and direct quotation marks.',
    remedyHindi: 'युग्म शब्दों ("सुख-दुःख, धीरे-धीरे") में छोटा योजक (-) और किसी के कहे हुए ज्यों के त्यों कथन पर दोहरा उद्धरण ("...") लगाएँ।',
    dayTitleHindi: 'विराम-चिह्नों की सटीक पहचान व वाक्य प्रयोग',
    dayTitleEnglish: 'Precision Punctuation Marks Mastery',
    ruleHindi: 'लिखते समय रुकने, प्रश्न पूछने, आश्चर्य प्रकट करने या किसी कथन को स्पष्ट करने के लिए मानक विराम-चिह्नों (। , ; ? ! - " ") का प्रयोग होता है।',
    ruleEnglish: 'Apply standard Hindi punctuation marks accurately to clarify pause, tone, and quoted speech.',
    quickTip: 'प्रत्यक्ष कथन से पहले अल्पविराम (,) फिर दोहरा उद्धरण ("...") और केवल सीधे प्रश्न के अंत में (?) आता है।',
    tasksHindi: [
      'सभी 10 प्रमुख विराम-चिह्नों के नाम, चिह्न व 1-1 उदाहरण तालिका देखें।',
      'बिना विराम-चिह्न वाले 4 वाक्यों में सही विराम चिह्न लगाकर जाँचें।',
      'विराम-चिह्न के 6 प्रश्न हल करें।',
    ],
    practiceCount: 6,
    simModuleId: 'viram-chinh',
  },
  {
    key: 'shabd_bhandar',
    matchPatterns: [/पर्याय|विलोम|अनेकार्थी|श्रुतिसम|एक शब्द|शब्द.?भंडार|शब्द भंडार|paryay|vilom|anekarthi|shrutisam|homophone|synonym|antonym/i],
    topicHindi: 'शब्द-भंडार (पर्यायवाची, विलोम, अनेकार्थी, श्रुतिसम, एक शब्द)',
    topicEnglish: 'Vocabulary Treasure (Synonyms, Antonyms, Homophones & One-Word)',
    whyConfusingHindi: 'सुनने में समान दिखने वाले शब्दों (अनल-अनिल, अंश-अंस) व कमल/बादल/समुद्र के पर्यायवाची के अंतिम अक्षरों में भ्रम हो जाता है।',
    whyConfusingEnglish: 'Near-homophone pairs (अनल/अनिल) and suffix-differentiated synonyms get easily swapped.',
    remedyHindi: 'अंतिम अक्षर सूत्र याद रखें: जल+ज = कमल, जल+द = बादल, जल+धि = समुद्र; तथा विलोम में तत्सम शब्द का उत्तर तत्सम में ही चुनें।',
    dayTitleHindi: 'शब्द-भंडार: पर्यायवाची, विलोम, अनेकार्थी व श्रुतिसम युग्म',
    dayTitleEnglish: 'Structured Vocabulary Building & Pair Distinction',
    ruleHindi: 'समान अर्थ पर्यायवाची, विपरीत अर्थ विलोम, एक से अधिक अर्थ अनेकार्थी, और समान उच्चारण-भिन्न अर्थ वाले शब्द श्रुतिसमभिन्नार्थक कहलाते हैं।',
    ruleEnglish: 'Master register-matched antonyms, contextual synonyms, and exact meaning distinctions for homophones.',
    quickTip: 'अनल = आग, अनिल = हवा; जलज = कमल, जलद = बादल, जलधि = समुद्र।',
    tasksHindi: [
      '10 प्रमुख श्रुतिसमभिन्नार्थक जोड़ों (जैसे दिन-दीन, कुल-कूल, अनल-अनिल) का अर्थ अंतर लिखें।',
      'तत्सम विलोम जोड़ों (अनुराग-विराग, उत्थान-पतन) व 5-5 पर्यायवाची दोहराएँ।',
      'शब्द-भंडार पर 10 प्रश्न हल करें।',
    ],
    practiceCount: 10,
    simModuleId: 'paryayvachi',
  },
  {
    key: 'muhavare',
    matchPatterns: [/मुहावर|लोकोक्ति|muhavar|idiom|proverb/i],
    topicHindi: 'मुहावरे और लोकोक्तियाँ (लाक्षणिक अर्थ)',
    topicEnglish: 'Idioms & Proverbs (Figurative Usage)',
    whyConfusingHindi: 'परीक्षा में शब्दों के सीधे (शाब्दिक) अर्थ वाले विकल्प छात्रों को भ्रमित कर देते हैं।',
    whyConfusingEnglish: 'Literal distractors lure students away from the true figurative meaning.',
    remedyHindi: 'शाब्दिक विकल्प को तुरंत हटाएँ और मुहावरे को किसी व्यावहारिक वाक्य में रखकर उसका असली भाव समझें।',
    dayTitleHindi: 'मुहावरे व लोकोक्तियाँ: लाक्षणिक अर्थ और वाक्य प्रयोग',
    dayTitleEnglish: 'Figurative Meanings & Contextual Sentence Framing',
    ruleHindi: 'मुहावरा अपने सामान्य शाब्दिक अर्थ को छोड़कर विशेष लाक्षणिक अर्थ देता है और वाक्य के अंग के रूप में लिंग-वचन के अनुसार ढलता है; लोकोक्ति पूर्ण स्वतंत्र कथन होती है।',
    ruleEnglish: 'Idioms carry non-literal figurative meanings and integrate grammatically into sentences; proverbs stand alone.',
    quickTip: 'विकल्प में मुहावरे के शब्दों का सीधा अनुवाद दिखे तो वह लगभग हमेशा गलत जाल (Trap) होता है।',
    tasksHindi: [
      'Muhavara Flip Cards सिमुलेशन में 8 प्रमुख मुहावरों के लाक्षणिक अर्थ देखें।',
      '5 कठिन मुहावरों व 3 लोकोक्तियों से अर्थपूर्ण छोटे वाक्य बनाएँ।',
      'मुहावरे वर्कशीट के 8 प्रश्न हल करें।',
    ],
    practiceCount: 8,
    simModuleId: 'muhavare',
  },
  {
    key: 'gadyansh',
    matchPatterns: [/गद्यांश|gadyansh|comprehension/i],
    topicHindi: 'अपठित गद्यांश एवं अर्थग्रहण',
    topicEnglish: 'Unseen Reading Comprehension',
    whyConfusingHindi: 'छात्र गद्यांश के प्रमाण के बजाय अपनी पूर्व जानकारी से उत्तर चुन लेते हैं या शीर्षक चुनने में चूक करते हैं।',
    whyConfusingEnglish: 'Relying on outside assumptions instead of passage evidence or missing the central theme for titles.',
    remedyHindi: 'हर उत्तर की पुष्टि गद्यांश की संबंधित पंक्ति से करें और शीर्षक हमेशा पूरे अनुच्छेद के केंद्रीय भाव पर आधारित चुनें।',
    dayTitleHindi: 'अपठित गद्यांश: त्वरित पठन और सटीक उत्तर-चयन',
    dayTitleEnglish: 'Evidence-Based Reading & Title Inference',
    ruleHindi: 'गद्यांश को दो बार ध्यान से पढ़ें, मुख्य विचार रेखांकित करें और केवल पाठ में दिए तथ्यों व संदर्भ के आधार पर उत्तर दें।',
    ruleEnglish: 'Scan twice, underline key ideas, and answer strictly from textual evidence.',
    quickTip: 'शीर्षक वाला विकल्प संक्षिप्त, सटीक और पूरे गद्यांश के सार को समेटने वाला होना चाहिए।',
    tasksHindi: [
      'अपठित गद्यांश सेक्शन में मध्यम व कठिन स्तर के 2 अनुच्छेद हल करें।',
      'प्रत्येक उत्तर के बाद रिपोर्ट कार्ड में शब्दार्थ व अनुमान कौशल देखें।',
    ],
    practiceCount: 6,
  },
];

function findMatchingGuides(weakTopicsInput: string | string[] | undefined): StudyPlanTopicGuide[] {
  const topicsArray = Array.isArray(weakTopicsInput)
    ? weakTopicsInput
    : typeof weakTopicsInput === 'string'
    ? weakTopicsInput.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const matched: StudyPlanTopicGuide[] = [];
  const seenKeys = new Set<string>();

  for (const rawTopic of topicsArray) {
    const clean = rawTopic.trim();
    if (!clean) continue;
    let foundAnyForItem = false;

    for (const guide of TOPIC_GUIDES) {
      if (guide.matchPatterns.some((rx) => rx.test(clean))) {
        foundAnyForItem = true;
        if (!seenKeys.has(guide.key)) {
          seenKeys.add(guide.key);
          matched.push(guide);
        }
      }
    }

    // Custom free-text topic typed by the student that wasn't in preset guides
    if (!foundAnyForItem && !seenKeys.has(`custom_${clean}`)) {
      seenKeys.add(`custom_${clean}`);
      matched.push({
        key: `custom_${clean}`,
        matchPatterns: [],
        topicHindi: clean,
        topicEnglish: clean,
        whyConfusingHindi: `'${clean}' अध्याय के मूल नियम और अपवादों में अंतर स्पष्ट न होने से भ्रम हो सकता है।`,
        whyConfusingEnglish: `Confusion arises when core rules and edge cases of '${clean}' are not practiced systematically.`,
        remedyHindi: `'${clean}' की परिभाषा, प्रमुख भेद और 5-5 उदाहरण लिखकर तुरंत अभ्यास प्रश्न हल करें।`,
        dayTitleHindi: `${clean}: मूल नियम, भेद व उदाहरण`,
        dayTitleEnglish: `${clean}: Core Rules & Examples`,
        ruleHindi: `'${clean}' से जुड़े प्रत्येक प्रश्न को हल करते समय पहले परिभाषा और मुख्य पहचान नियम की जाँच करें।`,
        ruleEnglish: `Check core definitions and distinguishing markers before selecting answers in '${clean}'.`,
        quickTip: `'${clean}' के 3 प्रमुख उदाहरण अपनी नोटबुक में लिखकर नियम से मिलाएँ।`,
        tasksHindi: [
          `'${clean}' के मुख्य नियम व सभी उपभेद ध्यान से पढ़ें।`,
          `कस्टम वर्कशीट स्टूडियो से संबंधित अध्याय के 8 अभ्यास प्रश्न हल करें।`,
          `गलत हुए प्रश्नों की व्याख्या रिपोर्ट कार्ड से दोहराएँ।`,
        ],
        practiceCount: 8,
      });
    }
  }

  return matched;
}

export function buildDeterministicSevenDayPlan(
  weakTopicsInput: string | string[] | undefined,
  grade = 'कक्षा 8',
  board = 'ICSE'
): SevenDayStudyPlan {
  const topicsArr = Array.isArray(weakTopicsInput)
    ? weakTopicsInput.filter(Boolean)
    : typeof weakTopicsInput === 'string'
    ? weakTopicsInput.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const guides = findMatchingGuides(topicsArr);
  const effectiveGuides: StudyPlanTopicGuide[] =
    guides.length > 0
      ? guides
      : TOPIC_GUIDES.filter((g) => ['sangya', 'karak', 'vakya'].includes(g.key));

  const topicsSummaryLabel =
    topicsArr.length > 0
      ? topicsArr.slice(0, 3).join(', ') + (topicsArr.length > 3 ? ` (+${topicsArr.length - 3} अन्य अध्याय)` : '')
      : effectiveGuides.map((g) => g.topicHindi).join(', ');

  const diagnosticWeaknessNotes: DiagnosticWeaknessNote[] = effectiveGuides.slice(0, 8).map((g) => ({
    topic: g.topicHindi,
    whyConfusingHindi: g.whyConfusingHindi,
    whyConfusingEnglish: g.whyConfusingEnglish,
    remedy: g.remedyHindi,
  }));

  // Build exact 7-day day-to-day schedule strictly from effectiveGuides
  const modules: StudyPlanDayModule[] = [];

  if (effectiveGuides.length <= 5) {
    // Spread 1..5 selected topics across Days 1..5 so every single chosen topic gets focused study days
    for (let d = 1; d <= 5; d++) {
      const g = effectiveGuides[(d - 1) % effectiveGuides.length];
      const passNum = Math.floor((d - 1) / effectiveGuides.length) + 1;
      const isDeepPass = passNum > 1;
      modules.push({
        day: d,
        dayLabelHindi: `दिवस ${d} (Day ${d})`,
        topicHindi: g.topicHindi,
        title: isDeepPass ? `${g.dayTitleHindi} — गहन अभ्यास व अपवाद` : g.dayTitleHindi,
        titleEnglish: isDeepPass ? `${g.dayTitleEnglish} — Deep Drill & Exceptions` : g.dayTitleEnglish,
        ruleHindi: isDeepPass
          ? `${g.ruleHindi} आज कठिन प्रश्नों व भ्रमित करने वाले विकल्पों को हटाकर सटीकता बढ़ाएँ।`
          : g.ruleHindi,
        ruleEnglish: g.ruleEnglish,
        quickTip: g.quickTip,
        dailyTasksHindi: isDeepPass
          ? [
              `${g.topicHindi} के कठिन/अपवाद उदाहरणों की पुनरावृत्ति करें।`,
              `कस्टम वर्कशीट में 'कठिन (Hard)' स्तर चुनकर ${g.practiceCount + 2} प्रश्न हल करें।`,
              `यदि कोई प्रश्न गलत हो तो गलती-सुधार वर्कशीट में उसका अभ्यास करें।`,
            ]
          : g.tasksHindi,
        practiceCount: isDeepPass ? g.practiceCount + 2 : g.practiceCount,
        simModuleId: g.simModuleId,
      });
    }
  } else {
    // 6+ sub-topics matched: cover them cleanly across Days 1..5 in pairs where needed, without dropping any
    const chunkSize = Math.ceil(effectiveGuides.length / 5);
    for (let d = 1; d <= 5; d++) {
      const slice = effectiveGuides.slice((d - 1) * chunkSize, d * chunkSize);
      const batch = slice.length > 0 ? slice : [effectiveGuides[(d - 1) % effectiveGuides.length]];
      const primary = batch[0];
      const combinedTopics = batch.map((b) => b.topicHindi.split(' (')[0]).join(' + ');
      modules.push({
        day: d,
        dayLabelHindi: `दिवस ${d} (Day ${d})`,
        topicHindi: combinedTopics,
        title: batch.length > 1 ? `${combinedTopics}: नियम व तुलनात्मक अभ्यास` : primary.dayTitleHindi,
        titleEnglish: batch.map((b) => b.topicEnglish).join(' & '),
        ruleHindi: batch.map((b) => `• ${b.topicHindi.split(' (')[0]}: ${b.ruleHindi}`).join(' '),
        ruleEnglish: batch.map((b) => b.ruleEnglish).join(' '),
        quickTip: primary.quickTip,
        dailyTasksHindi: batch.flatMap((b) => b.tasksHindi.slice(0, 2)).slice(0, 4),
        practiceCount: Math.min(12, batch.reduce((acc, b) => acc + Math.ceil(b.practiceCount / batch.length), 0)),
        simModuleId: primary.simModuleId,
      });
    }
  }

  // Day 6: Consolidated Worksheet & Mistake Recovery
  modules.push({
    day: 6,
    dayLabelHindi: 'दिवस 6 (Day 6)',
    topicHindi: 'मिश्रित अभ्यास एवं गलती-सुधार कार्यशाला',
    title: 'चयनित सभी अध्यायों की कस्टम वर्कशीट व गलती-सुधार अभ्यास',
    titleEnglish: 'Mixed Practice Worksheet & Mistake Recovery',
    ruleHindi: `आज अलग-अलग प्रश्नों के बीच नियम तुरंत बदलना सीखें — प्रत्येक प्रश्न पढ़ते ही पहले पहचानें कि वह ${topicsSummaryLabel} में से किस अध्याय का है।`,
    ruleEnglish: 'Practice switching swiftly across grammar rules on mixed questions and review every error explanation.',
    quickTip: 'गलती-सुधार वर्कशीट हमेशा अनलॉक है — वहाँ आपके गलत हुए प्रत्येक प्रश्न-प्रकार के 4-4 अनूठे प्रश्न मिलते हैं।',
    dailyTasksHindi: [
      `वर्कशीट्स स्टोर से 'गलती-सुधार विशेष वर्कशीट' खोलकर हल करें।`,
      `कस्टम वर्कशीट स्टूडियो में ${grade} के लिए 10 प्रश्नों का मिश्रित सेट बनाएँ।`,
      'रिपोर्ट कार्ड में 75% से कम वाले विषय की व्याख्या दोबारा पढ़ें।',
    ],
    practiceCount: 10,
  });

  // Day 7: Weekly Mastery Evaluation
  modules.push({
    day: 7,
    dayLabelHindi: 'दिवस 7 (Day 7)',
    topicHindi: 'साप्ताहिक मूल्यांकन व पोस्ट-चेकपॉइंट टेस्ट',
    title: `${grade} ${board} साप्ताहिक दक्षता परीक्षा (Weekly Final Evaluation)`,
    titleEnglish: `Day 7 Mastery Check & Post-Checkpoint Test`,
    ruleHindi: 'सातवें दिन बिना सहायता लिए पूरे सप्ताह पढ़े गए अध्यायों की परीक्षा दें ताकि डैशबोर्ड पर आपका वास्तविक सुधार प्रतिशत दर्ज हो सके।',
    ruleEnglish: 'Complete the Post-Checkpoint Quiz independently to measure weekly accuracy gain.',
    quickTip: 'परीक्षा में पहले 2 स्पष्ट रूप से गलत विकल्प हटाएँ (Elimination), फिर नियम से अंतिम उत्तर पक्का करें।',
    dailyTasksHindi: [
      'डैशबोर्ड पर "२. पोस्ट-चेकपॉइंट क्विज़ (Post-Quiz)" हल करें।',
      'अपनी साप्ताहिक रिपोर्ट कार्ड में मजबूत पक्ष व सुधार प्रतिशत की जाँच करें।',
      'सभी सही उत्तरों से अर्जित WordCoins से नई विशेष वर्कशीट अनलॉक करें।',
    ],
    practiceCount: 10,
  });

  return {
    courseTitle: `7-दिवसीय व्यक्तिगत ${board} अध्ययन योजना (${grade}): ${topicsSummaryLabel}`,
    summaryHindi: `आपके द्वारा चुने गए विषयों (${topicsSummaryLabel}) के आधार पर ${grade} ${board} के लिए यह सटीक 7-दिवसीय दैनिक कार्ययोजना (Day 1 से Day 7) तैयार की गई है। केवल उन्हीं अध्यायों को शामिल किया गया है जिन्हें आपने चुना है।`,
    summaryEnglish: `Targeted 7-day day-by-day ${board} study plan for ${grade}, focused strictly on your selected weak topics: ${topicsSummaryLabel}.`,
    estimatedDays: 7,
    diagnosticWeaknessNotes,
    modules,
    motivationalQuoteHindi: 'प्रतिदिन छोटा पर सटीक अभ्यास ही व्याकरण में शत-प्रतिशत दक्षता दिलाता है। — शब्दशिल्प',
    motivationalQuoteEnglish: 'Focused daily practice builds 100% mastery step by step. — ShabdShilp',
  };
}

export function normalizeSevenDayCourse(
  rawCourse: any,
  weakTopicsInput: string | string[] | undefined,
  grade = 'कक्षा 8',
  board = 'ICSE'
): SevenDayStudyPlan {
  const deterministic = buildDeterministicSevenDayPlan(weakTopicsInput, grade, board);
  if (!rawCourse || typeof rawCourse !== 'object') {
    return deterministic;
  }

  const rawNotes: DiagnosticWeaknessNote[] = Array.isArray(rawCourse.diagnosticWeaknessNotes)
    ? rawCourse.diagnosticWeaknessNotes.filter((n: any) => n && n.topic && n.whyConfusingHindi && n.remedy)
    : [];

  // Filter AI notes so they align with selected deterministic topics (preventing off-topic drift),
  // and preserve deterministic notes for any selected topic the AI omitted.
  const detNotes = deterministic.diagnosticWeaknessNotes;
  const alignedNotes: DiagnosticWeaknessNote[] = detNotes.map((detNote) => {
    const tokens = detNote.topic
      .split(/[\s,()/-]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2);
    const matchingAiNote = rawNotes.find((rn) =>
      tokens.some((tok) => String(rn.topic).includes(tok))
    );
    return matchingAiNote || detNote;
  });

  const rawModules: any[] = Array.isArray(rawCourse.modules) ? rawCourse.modules : [];
  const normalizedDays: StudyPlanDayModule[] = [];

  for (let d = 1; d <= 7; d++) {
    const match = rawModules.find((m) => Number(m?.day) === d) || rawModules[d - 1];
    const fallbackDay = deterministic.modules[d - 1];
    if (match && match.title && match.ruleHindi) {
      normalizedDays.push({
        day: d,
        dayLabelHindi: match.dayLabelHindi || `दिवस ${d} (Day ${d})`,
        topicHindi: match.topicHindi || match.topic || fallbackDay.topicHindi,
        title: String(match.title),
        titleEnglish: String(match.titleEnglish || fallbackDay.titleEnglish),
        ruleHindi: String(match.ruleHindi),
        ruleEnglish: String(match.ruleEnglish || fallbackDay.ruleEnglish),
        quickTip: String(match.quickTip || fallbackDay.quickTip),
        dailyTasksHindi:
          Array.isArray(match.dailyTasksHindi) && match.dailyTasksHindi.length > 0
            ? match.dailyTasksHindi.map(String)
            : fallbackDay.dailyTasksHindi,
        practiceCount: Number(match.practiceCount) > 0 ? Number(match.practiceCount) : fallbackDay.practiceCount,
        simModuleId: match.simModuleId || fallbackDay.simModuleId,
      });
    } else {
      normalizedDays.push(fallbackDay);
    }
  }

  return {
    courseTitle: typeof rawCourse.courseTitle === 'string' && rawCourse.courseTitle.trim()
      ? rawCourse.courseTitle
      : deterministic.courseTitle,
    summaryHindi: typeof rawCourse.summaryHindi === 'string' && rawCourse.summaryHindi.trim()
      ? rawCourse.summaryHindi
      : deterministic.summaryHindi,
    summaryEnglish: typeof rawCourse.summaryEnglish === 'string' && rawCourse.summaryEnglish.trim()
      ? rawCourse.summaryEnglish
      : deterministic.summaryEnglish,
    estimatedDays: 7,
    diagnosticWeaknessNotes: alignedNotes.length > 0 ? alignedNotes : detNotes,
    modules: normalizedDays,
    motivationalQuoteHindi: rawCourse.motivationalQuoteHindi || deterministic.motivationalQuoteHindi,
    motivationalQuoteEnglish: rawCourse.motivationalQuoteEnglish || deterministic.motivationalQuoteEnglish,
  };
}
