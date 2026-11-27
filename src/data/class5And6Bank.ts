import type { RawBankQuestion } from './worksheetBank';

export const CLASS5_AND_6_RAW_BANK: Record<string, RawBankQuestion[]> = {
  ling: [
    {
      qH: "'कवि' शब्द का शुद्ध स्त्रीलिंग रूप क्या है?",
      qE: "What is the correct feminine form of 'कवि' (Poet)?",
      correct: 'कवयित्री',
      wrongs: ['कवियित्री', 'कवित्री', 'कविनी'],
      expH: "'कवि' का शुद्ध स्त्रीलिंग और वर्तनी 'कवयित्री' होती है।",
      expE: "The standard feminine form of 'kavi' is 'kavayitri'."
    },
    {
      qH: "'सम्राट' शब्द का सही स्त्रीलिंग रूप चुनिए:",
      qE: "Choose the feminine form of 'सम्राट' (Emperor):",
      correct: 'सम्राज्ञी',
      wrongs: ['सम्राटिन', 'सम्राटी', 'महारानी'],
      expH: "'सम्राट' का तत्सम स्त्रीलिंग रूप 'सम्राज्ञी' होता है।",
      expE: "'Samragyi' (Empress) is the feminine equivalent of 'Samrat'."
    },
    {
      qH: "निम्नलिखित में से कौन-सा शब्द 'नित्य पुल्लिंग' (हमेशा पुल्लिंग) है?",
      qE: "Which word is always masculine (Nitya Pulling)?",
      correct: 'तोता',
      wrongs: ['कोयल', 'तितली', 'गिलहरी'],
      expH: "'तोता' शब्द सदैव पुल्लिंग में प्रयुक्त होता है (स्त्रीलिंग हेतु 'मादा तोता' लिखते हैं)।",
      expE: "'Tota' (parrot) is permanently masculine unless prefixed with 'maada'."
    },
    {
      qH: "इनमें से कौन-सा शब्द 'सदैव स्त्रीलिंग' (नित्य स्त्रीलिंग) रहता है?",
      qE: "Which word is permanently feminine (Nitya Striling)?",
      correct: 'मछली',
      wrongs: ['कौआ', 'खटमल', 'चीता'],
      expH: "'मछली', 'कोयल' और 'तितली' नित्य स्त्रीलिंग शब्द हैं।",
      expE: "'Machhli' (fish) is permanently feminine."
    },
    {
      qH: "'विद्वान' शब्द का उचित स्त्रीलिंग रूप क्या होगा?",
      qE: "What is the feminine form of 'विद्वान' (Scholar)?",
      correct: 'विदुषी',
      wrongs: ['विद्वानी', 'विद्वता', 'विदुषिका'],
      expH: "'विद्वान' का शुद्ध स्त्रीलिंग 'विदुषी' होता है।",
      expE: "'Vidushi' is the feminine form of 'Vidwan'."
    },
    {
      qH: "'अध्यापक' शब्द में 'इका' प्रत्यय लगाने से कौन-सा स्त्रीलिंग रूप बनेगा?",
      qE: "Which feminine noun is formed by adding 'इका' to 'अध्यापक'?",
      correct: 'अध्यापिका',
      wrongs: ['अध्यापकनी', 'अध्यापकी', 'अध्यापाइन'],
      expH: "'अक' अंत वाले शब्दों में 'इका' जोड़कर स्त्रीलिंग बनता है (अध्यापक → अध्यापिका)।",
      expE: "Nouns ending in '-ak' take '-ika' in the feminine."
    },
    {
      qH: "'सेठ' शब्द का स्त्रीलिंग रूप क्या होगा?",
      qE: "What is the feminine of 'सेठ'?",
      correct: 'सेठानी',
      wrongs: ['सेठिन', 'सेठी', 'सेठिका'],
      expH: "'सेठ' में 'आनी' प्रत्यय जुड़ने से 'सेठानी' बनता है।",
      expE: "Adding '-aani' to 'Seth' gives 'Sethani'."
    },
    {
      qH: "'लोटा' शब्द का सही स्त्रीलिंग रूप चुनिए:",
      qE: "Choose the feminine form of 'लोटा':",
      correct: 'लुटिया',
      wrongs: ['लोटी', 'लोटनी', 'लोटिया'],
      expH: "'आ' से 'इया' प्रत्यय परिवर्तन द्वारा 'लोटा' का 'लुटिया' बनता है।",
      expE: "'Lota' changes to diminutive feminine 'Lutiya'."
    },
    {
      qH: "हिंदी में 'नदियों' और 'भाषाओं' के नाम प्रायः किस लिंग में होते हैं?",
      qE: "Names of rivers and languages in Hindi are generally in which gender?",
      correct: 'स्त्रीलिंग',
      wrongs: ['पुल्लिंग', 'उभयलिंग', 'नपुंसकलिंग'],
      expH: "गंगा, यमुना, हिंदी, संस्कृत आदि नदियों व भाषाओं के नाम स्त्रीलिंग होते हैं (अपवाद: सोन, ब्रह्मपुत्र)।",
      expE: "Most river and language names are feminine in Hindi."
    },
    {
      qH: "दिनों और महीनों के नाम (जैसे सोमवार, मार्च) सामान्यतः किस लिंग के अंतर्गत आते हैं?",
      qE: "Names of days and months generally fall under which gender?",
      correct: 'पुल्लिंग',
      wrongs: ['स्त्रीलिंग', 'नपुंसकलिंग', 'अव्यय'],
      expH: "दिनों व महीनों के नाम प्रायः पुल्लिंग होते हैं (अपवाद: जनवरी, फरवरी, मई, जुलाई स्त्रीलिंग हैं)।",
      expE: "Days and most months are masculine."
    },
    {
      qH: "'बैल' का सही स्त्रीलिंग शब्द क्या है?",
      qE: "What is the feminine counterpart of 'बैल' (Ox)?",
      correct: 'गाय',
      wrongs: ['बैलिन', 'बैली', 'भैंस'],
      expH: "'बैल' (पुल्लिंग) का स्वतंत्र स्त्रीलिंग रूप 'गाय' होता है।",
      expE: "'Gaay' (Cow) is the feminine counterpart of 'Bail' (Ox)."
    },
    {
      qH: "'वर' शब्द का सही स्त्रीलिंग रूप क्या है?",
      qE: "What is the feminine counterpart of 'वर' (Groom)?",
      correct: 'वधू',
      wrongs: ['वरी', 'वरानी', 'वरण'],
      expH: "'वर' (दूल्हा) का स्त्रीलिंग शब्द 'वधू' (दुल्हन) होता है।",
      expE: "'Vadhu' (Bride) pairs with 'Var' (Groom)."
    },
    {
      qH: "'सुनार' का स्त्रीलिंग रूप पहचानिए:",
      qE: "Identify the feminine form of 'सुनार' (Goldsmith):",
      correct: 'सुनारिन',
      wrongs: ['सुनारी', 'सुनारनी', 'सुनारिका'],
      expH: "व्यावसायिक शब्दों में 'इन' प्रत्यय लगने से 'सुनारिन' बनता है।",
      expE: "'Sunar' takes '-in' suffix to form 'Sunarin'."
    },
    {
      qH: "'दही' शब्द का व्याकरणिक लिंग क्या है?",
      qE: "What is the grammatical gender of 'दही' (Curd)?",
      correct: 'पुल्लिंग (दही खट्टा है)',
      wrongs: ['स्त्रीलिंग (दही खट्टी है)', 'उभयलिंग', 'नपुंसकलिंग'],
      expH: "दही, घी, पानी और मोती अपवाद रूप से पुल्लिंग शब्द हैं।",
      expE: "'Dahi' (curd) is grammatically masculine in Hindi."
    },
    {
      qH: "'शेर' शब्द का स्त्रीलिंग रूप चुनिए:",
      qE: "Choose the feminine form of 'शेर':",
      correct: 'शेरनी',
      wrongs: ['शेरिन', 'शेरी', 'शेरानी'],
      expH: "'नी' प्रत्यय जुड़ने पर 'शेर' से 'शेरनी' बनता है।",
      expE: "Adding '-ni' to 'Sher' gives 'Sherni'."
    },
    {
      qH: "'श्रीमान' का शुद्ध स्त्रीलिंग रूप क्या होगा?",
      qE: "What is the correct feminine form of 'श्रीमान'?",
      correct: 'श्रीमती',
      wrongs: ['श्रीमानी', 'श्रीमतीनी', 'श्रीमन्ता'],
      expH: "'मान' का स्त्रीलिंग 'मती' होता है (श्रीमान → श्रीमती)।",
      expE: "Words ending in '-maan' shift to '-mati' in feminine."
    },
    {
      qH: "'पंडित' शब्द का स्त्रीलिंग रूप क्या है?",
      qE: "What is the feminine form of 'पंडित'?",
      correct: 'पंडिताइन',
      wrongs: ['पंडितनी', 'पंडिटी', 'पंडितिका'],
      expH: "'आइन' प्रत्यय जुड़ने से 'पंडित' का स्त्रीलिंग 'पंडिताइन' बनता है।",
      expE: "Adding '-aain' gives 'Panditain'."
    },
    {
      qH: "'अभिनेता' शब्द का स्त्रीलिंग रूप क्या होगा?",
      qE: "What is the feminine form of 'अभिनेता' (Actor)?",
      correct: 'अभिनेत्री',
      wrongs: ['अभिनेती', 'अभिनेतानी', 'अभिनेतिका'],
      expH: "'ता' से अंत होने वाले तत्सम शब्दों में 'ता' का 'त्री' हो जाता है (अभिनेता → अभिनेत्री)।",
      expE: "Masculine '-ta' nouns shift to '-tri' ('Abhinetri')."
    },
    {
      qH: "इनमें से कौन-सा शब्द पुल्लिंग है?",
      qE: "Which of the following words is masculine?",
      correct: 'पर्वत',
      wrongs: ['नदी', 'पुस्तक', 'खिड़की'],
      expH: "'पर्वत' (ऊँचा पर्वत) पुल्लिंग शब्द है, जबकि नदी, पुस्तक और खिड़की स्त्रीलिंग हैं।",
      expE: "'Parvat' (mountain) is masculine; the others are feminine."
    },
    {
      qH: "हिंदी भाषा में लिंग के कितने भेद माने जाते हैं?",
      qE: "How many grammatical genders exist in Hindi?",
      correct: 'दो (पुल्लिंग और स्त्रीलिंग)',
      wrongs: ['तीन (पुल्लिंग, स्त्रीलिंग, नपुंसकलिंग)', 'चार', 'पाँच'],
      expH: "संस्कृत के विपरीत हिंदी व्याकरण में केवल दो लिंग होते हैं: पुल्लिंग व स्त्रीलिंग।",
      expE: "Hindi has two grammatical genders: Masculine and Feminine."
    }
  ],

  vachan: [
    {
      qH: "'चिड़िया' शब्द का शुद्ध बहुवचन रूप क्या होगा?",
      qE: "What is the correct plural form of 'चिड़िया' (Bird)?",
      correct: 'चिड़ियाँ',
      wrongs: ['चिड़ियाएँ', 'चिड़ियों', 'चिड़िया'],
      expH: "'या' से अंत होने वाले स्त्रीलिंग शब्दों पर चंद्रबिंदु (ँ) लगाकर बहुवचन बनता है।",
      expE: "Feminine nouns ending in '-ya' take a chandrabindu ('चिड़ियाँ')."
    },
    {
      qH: "'नदी' शब्द का बहुवचन रूप क्या होगा?",
      qE: "What is the plural of 'नदी' (River)?",
      correct: 'नदियाँ',
      wrongs: ['नदीयाँ', 'नदिएँ', 'नदीएँ'],
      expH: "ईकारांत स्त्रीलिंग शब्दों में दीर्घ 'ई' का ह्रस्व 'इ' होकर 'याँ' जुड़ता है (नदी → नदियाँ)।",
      expE: "Long 'ee' shortens to 'i' before adding '-yaan' ('नदियाँ')."
    },
    {
      qH: "इनमें से कौन-सा शब्द 'सदैव बहुवचन' (नित्य बहुवचन) में प्रयुक्त होता है?",
      qE: "Which word is always used in the plural (Nitya Bahuvachan)?",
      correct: 'आँसू',
      wrongs: ['दूध', 'सोना', 'आकाश'],
      expH: "'आँसू', 'प्राण', 'दर्शन' और 'हस्ताक्षर' शब्द सदैव बहुवचन में प्रयोग किए जाते हैं।",
      expE: "'Aansu' (tears) is always treated as plural in Hindi."
    },
    {
      qH: "निम्नलिखित में से कौन-सा शब्द 'सदैव एकवचन' में प्रयोग होता है?",
      qE: "Which word is always used in the singular?",
      correct: 'जनता',
      wrongs: ['बाल', 'लोग', 'प्राण'],
      expH: "'जनता', 'वर्षा', 'पानी' और 'सोना' सदैव एकवचन के रूप में प्रयुक्त होते हैं।",
      expE: "'Janata' (public) takes singular verb agreement."
    },
    {
      qH: "'पुस्तक' शब्द का बहुवचन रूप चुनिए:",
      qE: "Choose the plural form of 'पुस्तक' (Book):",
      correct: 'पुस्तकें',
      wrongs: ['पुस्तकों', 'पुस्तकाएँ', 'पुस्तकियाँ'],
      expH: "अकारांत स्त्रीलिंग शब्द के अंत में 'एँ' जोड़ने से 'पुस्तकें' बनता है।",
      expE: "'Pustak' takes '-en' to form 'Pustaken'."
    },
    {
      qH: "'वधू' शब्द का शुद्ध बहुवचन रूप क्या है?",
      qE: "What is the correct plural of 'वधू' (Bride)?",
      correct: 'वधुएँ',
      wrongs: ['वधूएँ', 'वधुयाँ', 'वधुओं'],
      expH: "दीर्घ 'ऊ' को ह्रस्व 'उ' में बदलकर 'एँ' लगाने से 'वधुएँ' बनता है।",
      expE: "Long 'oo' shortens to 'u' + '-en' ('वधुएँ')."
    },
    {
      qH: "'बच्चा' शब्द का बहुवचन रूप (बिना परसर्ग के) क्या होगा?",
      qE: "What is the nominative plural of 'बच्चा'?",
      correct: 'बच्चे',
      wrongs: ['बच्चों', 'बच्चियाँ', 'बच्चाएँ'],
      expH: "आकारांत पुल्लिंग शब्दों में 'आ' के स्थान पर 'ए' लगता है (बच्चा → बच्चे)।",
      expE: "Masculine '-aa' nouns shift to '-e' in nominative plural."
    },
    {
      qH: "'छात्र' शब्द में कौन-सा गणवाचक शब्द जोड़कर बहुवचन बनाया जाता है?",
      qE: "Which collective word turns 'छात्र' into plural?",
      correct: 'छात्रगण',
      wrongs: ['छात्रें', 'छात्रियाँ', 'छात्राएँ'],
      expH: "कुछ पुल्लिंग शब्दों के अंत में 'गण', 'जन' या 'वृंद' जुड़ता है (छात्रगण, शिक्षकगण)।",
      expE: "'गण' suffix forms respectful plural 'छात्रगण'."
    },
    {
      qH: "'आदर प्रकट करने' के लिए एक व्यक्ति हेतु भी किस वचन का प्रयोग किया जाता है?",
      qE: "Which grammatical number is used to show respect to a single elder?",
      correct: 'बहुवचन (जैसे: पिताजी आ रहे हैं)',
      wrongs: ['एकवचन (पिताजी आ रहा है)', 'द्विवचन', 'कोई नहीं'],
      expH: "हिंदी में आदर व सम्मान दर्शाने के लिए एकवचन के स्थान पर बहुवचन क्रिया लगती है।",
      expE: "Honorifics in Hindi require plural verb agreement."
    },
    {
      qH: "'गौ' शब्द का बहुवचन रूप क्या है?",
      qE: "What is the plural form of 'गौ' (Cow)?",
      correct: 'गौएँ',
      wrongs: ['गौयाँ', 'गौओं', 'गौए'],
      expH: "'गौ' में 'एँ' जुड़ने पर 'गौएँ' बनता है।",
      expE: "'Gau' pluralizes to 'Gauen'."
    },
    {
      qH: "'मिठाई' का शुद्ध बहुवचन रूप चुनिए:",
      qE: "Choose the correct plural of 'मिठाई' (Sweet):",
      correct: 'मिठाइयाँ',
      wrongs: ['मिठाईयाँ', 'मिठाईएँ', 'मिठाइओं'],
      expH: "दीर्घ 'ई' का ह्रस्व 'इ' और 'याँ' जुड़कर 'मिठाइयाँ' बनता है।",
      expE: "Long 'ee' becomes short 'i' + '-yaan' ('मिठाइयाँ')."
    },
    {
      qH: "'कवि' का बहुवचन बनाने हेतु कौन-सा शब्द जोड़ना उपयुक्त है?",
      qE: "Which suffix pluralizes 'कवि' (Poet)?",
      correct: 'कविगण / कविवृंद',
      wrongs: ['कवियाँ', 'कविएँ', 'कविनाएँ'],
      expH: "पुल्लिंग संज्ञा 'कवि' में 'गण' या 'वृंद' लगाकर बहुवचन बनाते हैं।",
      expE: "'कविगण' or 'कविवृंद' denotes plural poets."
    },
    {
      qH: "'आँख' शब्द का बहुवचन क्या होगा?",
      qE: "What is the plural form of 'आँख' (Eye)?",
      correct: 'आँखें',
      wrongs: ['आँखियाँ', 'आँखो', 'आँखयाँ'],
      expH: "'आँख' अकारांत स्त्रीलिंग है, अतः 'आँखें' बनेगा।",
      expE: "'Aankh' pluralizes to 'Aankhen'."
    },
    {
      qH: "'लता' शब्द का बहुवचन रूप क्या है?",
      qE: "What is the plural form of 'लता' (Creeper)?",
      correct: 'लताएँ',
      wrongs: ['लतें', 'लतायाँ', 'लताओं'],
      expH: "आकारांत स्त्रीलिंग शब्दों के अंत में 'एँ' जुड़ता है (लता → लताएँ)।",
      expE: "Feminine '-aa' nouns add '-en' ('लताएँ')."
    },
    {
      qH: "'प्रजा' और 'वर्षा' शब्द किस वचन में आते हैं?",
      qE: "'प्रजा' and 'वर्षा' belong to which number category?",
      correct: 'सदैव एकवचन',
      wrongs: ['सदैव बहुवचन', 'द्विवचन', 'उभयवचन'],
      expH: "'प्रजा' व 'वर्षा' एकवचन में प्रयुक्त होने वाले शब्द हैं।",
      expE: "'Praja' and 'Varsha' remain grammatically singular."
    },
    {
      qH: "'हस्ताक्षर' शब्द का वाक्य में सही प्रयोग किस वचन में होता है?",
      qE: "How is 'हस्ताक्षर' (Signature) used in Hindi sentences?",
      correct: 'बहुवचन में (मैंने हस्ताक्षर कर दिए हैं)',
      wrongs: ['एकवचन में (मैंने हस्ताक्षर कर दिया)', 'दोनों में गलत', 'केवल भूतकाल में'],
      expH: "'हस्ताक्षर' नित्य बहुवचन शब्द है।",
      expE: "'Hastakshar' always takes plural verb agreement."
    },
    {
      qH: "'डिबिया' शब्द का बहुवचन रूप क्या होगा?",
      qE: "What is the plural of 'डिबिया' (Small box)?",
      correct: 'डिबियाँ',
      wrongs: ['डिबियाएँ', 'डिबियों', 'डिबिया'],
      expH: "'या' से समाप्त होने वाले स्त्रीलिंग शब्द चंद्रबिंदु लगाकर बहुवचन बनते हैं।",
      expE: "'-iya' endings add chandrabindu: 'डिबियाँ'."
    },
    {
      qH: "'रोटी' शब्द का बहुवचन चुनिए:",
      qE: "Choose the plural form of 'रोटी':",
      correct: 'रोटियाँ',
      wrongs: ['रोटीयाँ', 'रोटिएँ', 'रोटें'],
      expH: "'रोटी' में 'ई' ह्रस्व होकर 'याँ' जुड़ता है (रोटियाँ)।",
      expE: "'Roti' pluralizes to 'Rotiyaan'."
    },
    {
      qH: "'प्राण' शब्द का शुद्ध बहुवचन प्रयोग कौन-सा है?",
      qE: "Which sentence uses 'प्राण' correctly?",
      correct: 'रोगी के प्राण निकल गए।',
      wrongs: ['रोगी का प्राण निकल गया।', 'रोगी की प्राण निकल गई।', 'रोगी ने प्राण निकला।'],
      expH: "'प्राण' सदैव बहुवचन पुल्लिंग में प्रयुक्त होता है।",
      expE: "'Pran' always requires masculine plural agreement."
    },
    {
      qH: "हिंदी व्याकरण में वचन के कितने भेद होते हैं?",
      qE: "How many grammatical numbers exist in Hindi?",
      correct: 'दो (एकवचन और बहुवचन)',
      wrongs: ['तीन (एकवचन, द्विवचन, बहुवचन)', 'चार', 'पाँच'],
      expH: "हिंदी में वचन के दो ही भेद हैं: एकवचन और बहुवचन।",
      expE: "Hindi has two numbers: Singular and Plural."
    }
  ],

  viram_chinh: [
    {
      qH: "जब वाक्य पूर्ण हो जाए, तो उसके अंत में कौन-सा चिह्न लगाया जाता है?",
      qE: "Which punctuation mark is placed at the end of a complete declarative sentence?",
      correct: 'पूर्ण विराम ( । )',
      wrongs: ['अल्प विराम ( , )', 'अर्ध विराम ( ; )', 'योजक चिह्न ( - )'],
      expH: "हिंदी में सामान्य कथन समाप्त होने पर 'पूर्ण विराम ( । )' का प्रयोग किया जाता है।",
      expE: "Purna Viram (।) marks the end of a declarative sentence."
    },
    {
      qH: "वाक्य में पढ़ते समय बहुत थोड़े समय के लिए रुकने पर किस चिह्न का प्रयोग होता है?",
      qE: "Which mark indicates a brief pause inside a sentence?",
      correct: 'अल्प विराम ( , )',
      wrongs: ['पूर्ण विराम ( । )', 'विस्मयादिबोधक ( ! )', 'लाघव चिह्न ( ॰ )'],
      expH: "समान पदों को अलग करने या थोड़ा रुकने के लिए 'अल्प विराम ( , )' लगाते हैं।",
      expE: "Comma (Alpa Viram) denotes a short pause."
    },
    {
      qH: "हर्ष, शोक, आश्चर्य या घृणा के भाव प्रकट करने वाले शब्दों के साथ कौन-सा चिह्न लगता है?",
      qE: "Which punctuation mark expresses surprise, joy, or sorrow?",
      correct: 'विस्मयादिबोधक चिह्न ( ! )',
      wrongs: ['प्रश्नवाचक चिह्न ( ? )', 'उद्धरण चिह्न ( " " )', 'कोष्ठक ( ( ) )'],
      expH: "'वाह!', 'अरे!', 'हाय!' जैसे शब्दों के बाद विस्मयादिबोधक चिह्न (!) लगता है।",
      expE: "Exclamation mark (!) expresses intense emotion."
    },
    {
      qH: "'माता-पिता' और 'दिन-रात' जैसे शब्द-युग्मों के बीच लगा छोटा चिह्न ( - ) क्या कहलाता है?",
      qE: "What is the mark connecting word pairs like 'माता-पिता'?",
      correct: 'योजक चिह्न ( - )',
      wrongs: ['विवरण चिह्न ( :- )', 'निर्देशक चिह्न ( — )', 'हंसपद ( ^ )'],
      expH: "दो शब्दों या विलोम-युग्मों को जोड़ने वाला छोटा चिह्न 'योजक चिह्न (-)' होता है।",
      expE: "Hyphen (Yojak Chinh) connects paired or compound words."
    },
    {
      qH: "किसी के कहे हुए शब्दों को ज्यों-का-त्यों लिखने के लिए किस चिह्न का प्रयोग करते हैं?",
      qE: "Which mark encloses someone's exact spoken words verbatim?",
      correct: 'दोहरा उद्धरण चिह्न ( " ... " )',
      wrongs: ['लाघव चिह्न ( ॰ )', 'अर्ध विराम ( ; )', 'कोष्ठक ( ( ) )'],
      expH: "कथन को ज्यों का त्यों प्रस्तुत करने के लिए दोहरे उद्धरण चिह्न (\"...\") का प्रयोग होता है।",
      expE: "Double quotation marks enclose direct speech."
    },
    {
      qH: "लिखते समय यदि कोई शब्द छूट जाए, तो उसे ऊपर लिखने के लिए किस चिह्न का प्रयोग होता है?",
      qE: "Which symbol marks an omitted word inserted above the line?",
      correct: 'हंसपद या त्रुटिपूरक चिह्न ( ^ )',
      wrongs: ['लोप चिह्न ( ... )', 'लाघव चिह्न ( ॰ )', 'विवरण चिह्न ( :- )'],
      expH: "छूटे हुए अंश को दर्शाने के लिए 'हंसपद (^)' लगाया जाता है।",
      expE: "Caret (Hanspad ^) indicates missing inserted text."
    },
    {
      qH: "'डॉ॰ राजेंद्र प्रसाद' में 'डॉ' के आगे लगा छोटा गोला ( ॰ ) कौन-सा विराम चिह्न है?",
      qE: "What is the abbreviation dot in 'डॉ॰' called?",
      correct: 'लाघव चिह्न ( ॰ )',
      wrongs: ['पूर्ण विराम', 'अर्ध विराम', 'अवतरण चिह्न'],
      expH: "बड़े शब्दों को संक्षिप्त रूप में लिखने के लिए 'लाघव चिह्न (॰)' लगाते हैं।",
      expE: "Laghav Chinh indicates abbreviation."
    },
    {
      qH: "'तुम कल विद्यालय क्यों नहीं आए?' इस वाक्य के अंत में कौन-सा चिह्न लगा है?",
      qE: "Which mark ends the sentence 'Why didn't you come to school yesterday?'",
      correct: 'प्रश्नवाचक चिह्न ( ? )',
      wrongs: ['विस्मयादिबोधक चिह्न ( ! )', 'पूर्ण विराम ( । )', 'अल्प विराम ( , )'],
      expH: "प्रश्न पूछने वाले वाक्यों के अंत में प्रश्नवाचक चिह्न (?) लगता है।",
      expE: "Question mark (?) concludes an interrogative sentence."
    },
    {
      qH: "'सूर्योदय हुआ; चिड़ियाँ चहचहाने लगीं।' में 'हुआ' के बाद लगा चिह्न ( ; ) क्या कहलाता है?",
      qE: "What is the semicolon (;) called in Hindi punctuation?",
      correct: 'अर्ध विराम ( ; )',
      wrongs: ['अल्प विराम ( , )', 'उप विराम ( : )', 'पूर्ण विराम ( । )'],
      expH: "जहाँ अल्प विराम से अधिक और पूर्ण विराम से कम रुकना हो, वहाँ 'अर्ध विराम (;)' लगता है।",
      expE: "Semicolon (Ardh Viram) marks a medium pause."
    },
    {
      qH: "किसी पुस्तक, उपनाम या शीर्षक को विशेष रूप से दिखाने के लिए कौन-सा चिह्न लगता है?",
      qE: "Which mark highlights a book title or pen name?",
      correct: 'इकहरा उद्धरण चिह्न ( ‘ ... ’ )',
      wrongs: ['योजक चिह्न ( - )', 'लाघव चिह्न ( ॰ )', 'हंसपद ( ^ )'],
      expH: "नाम, उपनाम या पुस्तक का नाम लिखने में इकहरा उद्धरण चिह्न ('...') प्रयुक्त होता है।",
      expE: "Single quotes highlight book titles or epithets."
    },
    {
      qH: "किसी विषय की व्याख्या या सूची आरंभ करने से पहले कौन-सा चिह्न ( :- ) लगाया जाता है?",
      qE: "Which sign introduces an explanation or list?",
      correct: 'विवरण चिह्न ( :- )',
      wrongs: ['हंसपद ( ^ )', 'विस्मयादिबोधक ( ! )', 'प्रश्नवाचक ( ? )'],
      expH: "सूची या विस्तृत विवरण देने से पहले विवरण चिह्न (:-) का प्रयोग होता है।",
      expE: "Vivaran Chinh introduces lists or details."
    },
    {
      qH: "अर्थ को और स्पष्ट करने के लिए शब्द के आगे लगाया जाने वाला चिह्न ( ) क्या कहलाता है?",
      qE: "What are brackets ( ) used to clarify a word called?",
      correct: 'कोष्ठक चिह्न ( ( ) )',
      wrongs: ['योजक चिह्न', 'उद्धरण चिह्न', 'अर्ध विराम'],
      expH: "किसी कठिन शब्द का सरल अर्थ या नाटक में भाव लिखने के लिए 'कोष्ठक ( )' प्रयोग होता है।",
      expE: "Parentheses (Koshthak) enclose clarifications."
    },
    {
      qH: "निम्नलिखित में से किस वाक्य में विराम-चिह्न का शुद्ध प्रयोग हुआ है?",
      qE: "Which sentence uses punctuation correctly?",
      correct: 'रोहन, मोहन और सोहन खेल रहे हैं।',
      wrongs: ['रोहन मोहन और, सोहन खेल रहे हैं?', 'रोहन! मोहन, और सोहन खेल रहे हैं।', 'रोहन मोहन और सोहन खेल रहे हैं,'],
      expH: "तीन नामों के बीच अल्प विराम और अंत में पूर्ण विराम (।) का प्रयोग शुद्ध है।",
      expE: "Comma separates items in a list and । ends the sentence."
    },
    {
      qH: "तुलनात्मक शब्दों 'सा, सी, से' से पहले प्रायः किस चिह्न का प्रयोग होता है?",
      qE: "Which mark is placed before 'सा, सी, से' in similes like 'चाँद-सा'?",
      correct: 'योजक चिह्न ( - )',
      wrongs: ['पूर्ण विराम ( । )', 'विवरण चिह्न ( :- )', 'लाघव चिह्न ( ॰ )'],
      expH: "'चाँद-सा मुखड़ा' और 'फूल-सी मुस्कान' में योजक चिह्न (-) लगता है।",
      expE: "Hyphen connects similes with 'सा, सी, से'."
    },
    {
      qH: "'विज्ञान : वरदान या अभिशाप' में 'विज्ञान' के बाद लगा चिह्न ( : ) क्या कहलाता है?",
      qE: "What is the colon (:) in Hindi titles called?",
      correct: 'उप विराम ( : )',
      wrongs: ['अर्ध विराम ( ; )', 'पूर्ण विराम ( । )', 'त्रुटि चिह्न ( ^ )'],
      expH: "शीर्षकों को अलग करके दिखाने हेतु 'उप विराम (:)' का प्रयोग होता है।",
      expE: "Upa-Viram (:) separates title and subtitle."
    }
  ],

  paryayvachi: [
    {
      qH: "'कमल' शब्द का सही पर्यायवाची समूह चुनिए:",
      qE: "Choose the synonym group for 'कमल' (Lotus):",
      correct: 'पंकज, नीरज, जलज',
      wrongs: ['नीरद, जलद, बादल', 'दिनकर, दिवाकर, रवि', 'अनिल, पवन, समीर'],
      expH: "पंक (कीचड़) या जल में 'ज' (जन्म लेने वाला) = पंकज, नीरज, जलज कमल के पर्यायवाची हैं।",
      expE: "Words ending in '-ज' attached to water roots mean Lotus."
    },
    {
      qH: "'सूर्य' शब्द के सही पर्यायवाची कौन-से हैं?",
      qE: "Which words are synonyms of 'सूर्य' (Sun)?",
      correct: 'दिनकर, दिवाकर, भास्कर',
      wrongs: ['शशि, राकेश, इंदु', 'समीर, अनिल, मारुत', 'सरिता, तटिनी, तरंगिणी'],
      expH: "दिनकर, दिवाकर, रवि, भानु व भास्कर सूर्य के प्रसिद्ध पर्यायवाची हैं।",
      expE: "Dinkar, Diwakar, and Bhaskar all mean Sun."
    },
    {
      qH: "'बादल' का पर्यायवाची शब्द कौन-सा है?",
      qE: "Which word means 'बादल' (Cloud)?",
      correct: 'मेघ / जलद / नीरद',
      wrongs: ['जलज', 'पंकज', 'राकेश'],
      expH: "पानी के पर्यायवाची के अंत में 'द' (देने वाला) लगाने से बादल के पर्यायवाची (जलद, नीरद) बनते हैं।",
      expE: "Water root + '-द' forms Cloud synonyms like 'Jalad'."
    },
    {
      qH: "'हवा' (वायु) का पर्यायवाची शब्द कौन-सा नहीं है?",
      qE: "Which of the following is NOT a synonym of 'हवा' (Air)?",
      correct: 'अनल (यह आग है)',
      wrongs: ['अनिल', 'पवन', 'समीर'],
      expH: "'अनिल', 'पवन', 'समीर' हवा के पर्यायवाची हैं, जबकि 'अनल' आग का पर्यायवाची है।",
      expE: "'Anal' means Fire, not Air ('Anil')."
    },
    {
      qH: "'चंद्रमा' शब्द का पर्यायवाची कौन-सा है?",
      qE: "Identify a synonym for 'चंद्रमा' (Moon):",
      correct: 'शशि / राकेश / मयंक',
      wrongs: ['प्रभाकर', 'दिनकर', 'अंशुमाली'],
      expH: "शशि, राकेश, मयंक, सुधाकर चंद्रमा के पर्यायवाची हैं।",
      expE: "Shashi, Rakesh, and Mayank denote the Moon."
    },
    {
      qH: "'पानी' (जल) का पर्यायवाची समूह पहचानिए:",
      qE: "Select the synonym group for 'पानी' (Water):",
      correct: 'नीर, सलिल, अंबु',
      wrongs: ['पावक, दहन, अग्नि', 'विहग, खग, पंछी', 'नभ, अंबर, गगन'],
      expH: "नीर, सलिल, तोय, अंबु, वारि जल के पर्यायवाची हैं।",
      expE: "Neer, Salil, and Ambu mean Water."
    },
    {
      qH: "'पृथ्वी' (धरती) का पर्यायवाची शब्द कौन-सा है?",
      qE: "Which word means 'पृथ्वी' (Earth)?",
      correct: 'वसुंधरा / धरा / भू',
      wrongs: ['व्योम', 'सलिल', 'समीर'],
      expH: "धरा, भू, भूमि, वसुंधरा, अवनि पृथ्वी के पर्यायवाची हैं।",
      expE: "Vasundhara, Dhara, and Bhu mean Earth."
    },
    {
      qH: "'पहाड़' (पर्वत) का सही पर्यायवाची कौन-सा है?",
      qE: "Choose the synonym of 'पहाड़' (Mountain):",
      correct: 'गिरि / शैल / अचल',
      wrongs: ['सरिता', 'कानन', 'उदधि'],
      expH: "गिरि, शैल, नग और अचल पर्वत के पर्यायवाची हैं।",
      expE: "Giri, Shail, and Achal mean Mountain."
    },
    {
      qH: "'पेड़' (वृक्ष) का पर्यायवाची समूह चुनिए:",
      qE: "Select the synonyms for 'पेड़' (Tree):",
      correct: 'तरु, पादप, विटप',
      wrongs: ['कुसुम, सुमन, प्रसून', 'तड़ाग, सर, ताल', 'गृह, आलय, सदन'],
      expH: "तरु, पादप, विटप, द्रुम पेड़ के पर्यायवाची हैं (कुसुम/सुमन फूल के हैं)।",
      expE: "Taru, Padap, and Vitap mean Tree."
    },
    {
      qH: "'फूल' (पुष्प) का पर्यायवाची कौन-सा है?",
      qE: "Identify the synonym of 'फूल' (Flower):",
      correct: 'सुमन / कुसुम / प्रसून',
      wrongs: ['विटप', 'अनल', 'विहग'],
      expH: "सुमन, कुसुम, प्रसून और पुष्प फूल के पर्यायवाची हैं।",
      expE: "Suman, Kusum, and Prasun mean Flower."
    },
    {
      qH: "'घर' शब्द का सही पर्यायवाची समूह कौन-सा है?",
      qE: "Choose the synonym group for 'घर' (Home):",
      correct: 'गृह, आलय, निकेतन',
      wrongs: ['नभ, अंबर, गगन', 'वन, कानन, अरण्य', 'नयन, चक्षु, लोचन'],
      expH: "गृह, आलय, सदन, भवन, निकेतन घर के पर्यायवाची हैं।",
      expE: "Grih, Alay, and Niketan mean Home."
    },
    {
      qH: "'आँख' (नेत्र) का पर्यायवाची शब्द चुनिए:",
      qE: "Choose a synonym for 'आँख' (Eye):",
      correct: 'नयन / चक्षु / लोचन',
      wrongs: ['श्रवण', 'हस्त', 'रसना'],
      expH: "नयन, चक्षु, लोचन, दृग आँख के पर्यायवाची हैं।",
      expE: "Nayan, Chakshu, and Lochan mean Eye."
    },
    {
      qH: "'नदी' का सही पर्यायवाची शब्द समूह है:",
      qE: "Which group contains synonyms of 'नदी' (River)?",
      correct: 'सरिता, तटिनी, तरंगिणी',
      wrongs: ['सिंधु, सागर, रत्नाकर', 'पर्वत, गिरि, शैल', 'आकाश, व्योम, नभ'],
      expH: "सरिता, तटिनी, तरंगिणी, निर्झरिणी नदी के पर्यायवाची हैं।",
      expE: "Sarita, Tatini, and Tarangini mean River."
    },
    {
      qH: "'राजा' का पर्यायवाची कौन-सा है?",
      qE: "Which word is a synonym of 'राजा' (King)?",
      correct: 'नृप / भूपति / नरेश',
      wrongs: ['रंक', 'अनुचर', 'सेवक'],
      expH: "नृप, भूप, भूपति, नरेश, महीप राजा के पर्यायवाची हैं।",
      expE: "Nrip, Bhupati, and Naresh mean King."
    },
    {
      qH: "'पक्षी' का सही पर्यायवाची कौन-सा है?",
      qE: "Select the synonym of 'पक्षी' (Bird):",
      correct: 'खग / विहग / नभचर',
      wrongs: ['जलचर', 'थलचर', 'मृग'],
      expH: "ख (आकाश) में गमन करने वाला 'खग', विहग और नभचर पक्षी के पर्यायवाची हैं।",
      expE: "Khag, Vihag, and Nabhchar mean Bird."
    }
  ],

  vilom: [
    {
      qH: "'अनुकूल' शब्द का सही विलोम (विपरीतार्थक) क्या है?",
      qE: "What is the antonym of 'अनुकूल' (Favorable)?",
      correct: 'प्रतिकूल',
      wrongs: ['अननुकूल', 'सुकूल', 'विकूल'],
      expH: "'अनुकूल' का शुद्ध विलोम शब्द 'प्रतिकूल' होता है।",
      expE: "'Pratikool' (unfavorable) is the opposite of 'Anukool'."
    },
    {
      qH: "'उत्थान' शब्द का विपरीतार्थक शब्द चुनिए:",
      qE: "Choose the opposite of 'उत्थान' (Rise):",
      correct: 'पतन',
      wrongs: ['उदय', 'प्रस्थान', 'अवनत'],
      expH: "'उत्थान' (उठना/प्रगति) का विलोम 'पतन' (गिरना) होता है।",
      expE: "'Patan' (downfall) is the antonym of 'Utthan'."
    },
    {
      qH: "'सजीव' का सही विलोम शब्द क्या है?",
      qE: "What is the antonym of 'सजीव' (Living)?",
      correct: 'निर्जीव',
      wrongs: ['अजीव', 'मृतक', 'अचेतन'],
      expH: "'सजीव' (प्राण सहित) का विलोम 'निर्जीव' (प्राण रहित) होता है।",
      expE: "'Nirjeev' (non-living) is opposite to 'Sajeev'."
    },
    {
      qH: "'प्राचीन' शब्द का उचित विलोम शब्द क्या होगा?",
      qE: "What is the opposite of 'प्राचीन' (Ancient)?",
      correct: 'नवीन / अर्वाचीन',
      wrongs: ['पुरातन', 'अतीत', 'आधुनिकता'],
      expH: "'प्राचीन' (पुराना) का शुद्ध विलोम 'नवीन' या 'अर्वाचीन' होता है।",
      expE: "'Naveen' or 'Arvachin' (modern/new) opposes 'Prachin'."
    },
    {
      qH: "'आदान' शब्द का विलोम युग्म क्या है?",
      qE: "What is the antonym of 'आदान' (Taking)?",
      correct: 'प्रदान',
      wrongs: ['निदान', 'वरदान', 'दान'],
      expH: "'आदान' (लेना) का ठीक विलोम 'प्रदान' (देना) होता है।",
      expE: "'Aadaan-Pradaan' (Give and Take) are opposites."
    },
    {
      qH: "'मौखिक' शब्द का सही विलोम क्या है?",
      qE: "What is the antonym of 'मौखिक' (Oral)?",
      correct: 'लिखित',
      wrongs: ['अमौखिक', 'पठित', 'कथित'],
      expH: "'मौखिक' (बोलकर) का विपरीत 'लिखित' (लिखकर) होता है।",
      expE: "'Likhit' (written) is the opposite of 'Maukhik' (oral)."
    },
    {
      qH: "'कृतज्ञ' (उपकार मानने वाला) का शुद्ध विलोम शब्द चुनिए:",
      qE: "Choose the antonym of 'कृतज्ञ' (Grateful):",
      correct: 'कृतघ्न',
      wrongs: ['अकृतज्ञ', 'विज्ञ', 'अज्ञ'],
      expH: "किए गए उपकार को न मानने वाले को 'कृतघ्न' कहते हैं।",
      expE: "'Kritaghna' (ungrateful) opposes 'Kritagya'."
    },
    {
      qH: "'स्वदेश' शब्द का विलोम क्या होगा?",
      qE: "What is the antonym of 'स्वदेश' (Homeland)?",
      correct: 'परदेश / विदेश',
      wrongs: ['अदेश', 'निजदेश', 'कुदेश'],
      expH: "'स्वदेश' का विलोम 'विदेश' या 'परदेश' होता है।",
      expE: "'Videsh' / 'Pardesh' opposes 'Swadesh'."
    },
    {
      qH: "'आशा' का सही विलोम शब्द पहचानिए:",
      qE: "Identify the opposite of 'आशा' (Hope):",
      correct: 'निराशा',
      wrongs: ['अनाशा', 'दुराशा', 'कुआशा'],
      expH: "'आशा' में 'निर्' उपसर्ग लगने से विलोम 'निराशा' बनता है।",
      expE: "'Nirasha' (despair) is the antonym of 'Asha'."
    },
    {
      qH: "'अंधकार' का विलोम शब्द क्या है?",
      qE: "What is the antonym of 'अंधकार' (Darkness)?",
      correct: 'प्रकाश',
      wrongs: ['तम', 'अँधेरा', 'रात्रि'],
      expH: "'अंधकार' का शुद्ध तत्सम विलोम 'प्रकाश' होता है।",
      expE: "'Prakash' (light) opposes 'Andhkar'."
    },
    {
      qH: "'उपकार' शब्द का विपरीतार्थक क्या होगा?",
      qE: "What is the opposite of 'उपकार' (Benevolence)?",
      correct: 'अपकार',
      wrongs: ['निष्कार', 'अनाकार', 'सुकार'],
      expH: "'उपकार' (भलाई) का ठीक विपरीत 'अपकार' (बुराई/हानि) है।",
      expE: "'Apkaar' (harm) opposes 'Upkaar'."
    },
    {
      qH: "'विजय' का सही विलोम शब्द चुनिए:",
      qE: "Choose the antonym of 'विजय' (Victory):",
      correct: 'पराजय',
      wrongs: ['अजय', 'निर्जय', 'जीत'],
      expH: "'विजय' का विलोम 'पराजय' (हार) होता है।",
      expE: "'Parajay' (defeat) opposes 'Vijay'."
    },
    {
      qH: "'आयात' (बाहर से मँगाना) का सही विलोम क्या है?",
      qE: "What is the antonym of 'आयात' (Import)?",
      correct: 'निर्यात',
      wrongs: ['प्रयात', 'आगम', 'व्यापार'],
      expH: "विदेश से मँगाना 'आयात' और बाहर भेजना 'निर्यात' कहलाता है।",
      expE: "'Niryat' (export) is the opposite of 'Aayat' (import)."
    },
    {
      qH: "'दुर्जन' शब्द का विलोम शब्द कौन-सा है?",
      qE: "What is the antonym of 'दुर्जन' (Wicked person)?",
      correct: 'सज्जन',
      wrongs: ['अजन', 'कुजन', 'महाजन'],
      expH: "'दुर्जन' (बुरा व्यक्ति) का विलोम 'सज्जन' (अच्छा व्यक्ति) होता है।",
      expE: "'Sajjan' (noble person) opposes 'Durjan'."
    },
    {
      qH: "'उदय' शब्द का विपरीतार्थक क्या है?",
      qE: "What is the opposite of 'उदय' (Rising)?",
      correct: 'अस्त',
      wrongs: ['उदित', 'प्रातः', 'अंत'],
      expH: "'उदय' (उगना) का शुद्ध विलोम 'अस्त' (डूबना) होता है।",
      expE: "'Ast' (setting) is the exact opposite of 'Uday'."
    }
  ],

  anek_shabd: [
    {
      qH: "'जो कभी बूढ़ा न हो' — इस वाक्यांश के लिए एक शब्द क्या होगा?",
      qE: "One word for 'One who never ages':",
      correct: 'अजर',
      wrongs: ['अमर', 'अजेय', 'अटल'],
      expH: "'जरा' (बुढ़ापा) न आए → 'अजर', और जिसकी मृत्यु न हो → 'अमर'।",
      expE: "'Ajar' means ageless; 'Amar' means immortal."
    },
    {
      qH: "'जो सब कुछ जानता हो' — के लिए उपयुक्त एक शब्द चुनिए:",
      qE: "One word for 'All-knowing / Omniscient':",
      correct: 'सर्वज्ञ',
      wrongs: ['अल्पज्ञ', 'अज्ञानी', 'विद्वान'],
      expH: "'सर्व' (सब) + 'ज्ञ' (जानने वाला) = 'सर्वज्ञ'।",
      expE: "'Sarvagya' means omniscient."
    },
    {
      qH: "'प्रतिदिन होने वाला' — के लिए एक शब्द क्या है?",
      qE: "One word for 'Happening daily':",
      correct: 'दैनिक',
      wrongs: ['साप्ताहिक', 'पाक्षिक', 'मासिक'],
      expH: "प्रतिदिन → दैनिक; सप्ताह में एक बार → साप्ताहिक; महीने में एक बार → मासिक।",
      expE: "'Dainik' means daily."
    },
    {
      qH: "'जिसके माता-पिता न हों' — इस वाक्यांश के लिए एक शब्द है:",
      qE: "One word for 'A child without parents':",
      correct: 'अनाथ',
      wrongs: ['सनाथ', 'निराश्रित', 'असहाय'],
      expH: "जिसका कोई नाथ (पालक) न हो, उसे 'अनाथ' कहते हैं।",
      expE: "'Anath' means orphan."
    },
    {
      qH: "'जो दूसरों पर उपकार करता हो' — एक शब्द बताइए:",
      qE: "One word for 'One who helps/benefits others':",
      correct: 'परोपकारी',
      wrongs: ['स्वार्थी', 'कृतज्ञ', 'दयावान'],
      expH: "पर + उपकार + ई = 'परोपकारी'।",
      expE: "'Paropkari' means benevolent / charitable."
    },
    {
      qH: "'जल में रहने वाला' — वाक्यांश के लिए एक शब्द चुनिए:",
      qE: "One word for 'Living in water':",
      correct: 'जलचर',
      wrongs: ['नभचर', 'थलचर', 'निशाचर'],
      expH: "जल में विचरण करने वाले जीव 'जलचर' कहलाते हैं।",
      expE: "'Jalchar' means aquatic creature."
    },
    {
      qH: "'जो सत्य बोलता हो' — के लिए एक सटीक शब्द है:",
      qE: "One word for 'One who speaks the truth':",
      correct: 'सत्यवादी',
      wrongs: ['मृदुभाषी', 'मितभाषी', 'वाचाल'],
      expH: "सत्य बोलने वाले व्यक्ति को 'सत्यवादी' (जैसे राजा हरिश्चंद्र) कहते हैं।",
      expE: "'Satyavadi' means truthful."
    },
    {
      qH: "'जहाँ पहुँचना कठिन हो' — के लिए एक शब्द क्या होगा?",
      qE: "One word for 'A place difficult to reach':",
      correct: 'दुर्गम',
      wrongs: ['सुगम', 'अगम', 'निर्जन'],
      expH: "कठिनाई से गमन योग्य स्थान 'दुर्गम' और आसान रास्ता 'सुगम' कहलाता है।",
      expE: "'Durgam' means inaccessible / difficult to reach."
    },
    {
      qH: "'जो देखने योग्य हो' — वाक्यांश के लिए एक शब्द चुनिए:",
      qE: "One word for 'Worth seeing':",
      correct: 'दर्शनीय',
      wrongs: ['पठनीय', 'श्रवणीय', 'पूजनीय'],
      expH: "देखने योग्य स्थान या वस्तु 'दर्शनीय' कहलाती है।",
      expE: "'Darshaniya' means worth visiting/seeing."
    },
    {
      qH: "'माँस न खाने वाला' — के लिए एक शब्द बताइए:",
      qE: "One word for 'Vegetarian (one who does not eat meat)':",
      correct: 'शाकाहारी',
      wrongs: ['माँसाहारी', 'सर्वाहारी', 'फलाहारी'],
      expH: "शाक-सब्जी व अन्न खाने वाला 'शाकाहारी' कहलाता है।",
      expE: "'Shakahari' means vegetarian."
    },
    {
      qH: "'जिसका कोई आकार न हो' — के लिए एक शब्द क्या होगा?",
      qE: "One word for 'Formless':",
      correct: 'निराकार',
      wrongs: ['साकार', 'अनाकार', 'विकार'],
      expH: "निर् + आकार = 'निराकार' (बिना आकार के), तथा आकार सहित 'साकार'।",
      expE: "'Nirakar' means formless."
    },
    {
      qH: "'जो ईश्वर में विश्वास रखता हो' — उसे क्या कहते हैं?",
      qE: "One word for 'A believer in God':",
      correct: 'आस्तिक',
      wrongs: ['नास्तिक', 'धार्मिक', 'साधक'],
      expH: "ईश्वर में आस्था रखने वाला 'आस्तिक' और न मानने वाला 'नास्तिक' होता है।",
      expE: "'Aastik' means theist."
    },
    {
      qH: "'सौ वर्षों का समूह' — के लिए एक शब्द चुनिए:",
      qE: "One word for 'A period of 100 years':",
      correct: 'शताब्दी',
      wrongs: ['दशक', 'सहस्राब्दी', 'सप्ताह'],
      expH: "100 वर्षों की अवधि 'शताब्दी' और 10 वर्षों की 'दशक' कहलाती है।",
      expE: "'Shatabdi' means century."
    },
    {
      qH: "'जो बहुत कम बोलता हो' — वाक्यांश के लिए एक शब्द है:",
      qE: "One word for 'One who speaks very little':",
      correct: 'मितभाषी',
      wrongs: ['वाचाल', 'मृदुभाषी', 'कटुभाषी'],
      expH: "कम बोलने वाला 'मितभाषी' और बहुत अधिक बोलने वाला 'वाचाल' कहलाता है।",
      expE: "'Mitbhashi' means reticent / soft-spoken in measure."
    },
    {
      qH: "'जंगल में लगने वाली आग' — के लिए एक शब्द चुनिए:",
      qE: "One word for 'Forest fire':",
      correct: 'दावानल',
      wrongs: ['बड़वानल', 'जठराग्नि', 'मंदाग्नि'],
      expH: "जंगल की आग → दावानल, समुद्र की आग → बड़वानल, पेट की आग → जठराग्नि।",
      expE: "'Davanal' specifically denotes wildfire in a forest."
    }
  ],

  kriya_kaal: [
    {
      qH: "'बच्चा दूध पी रहा है।' इस वाक्य में कौन-सी क्रिया और काल है?",
      qE: "Identify the verb type and tense in 'The child is drinking milk':",
      correct: 'सकर्मक क्रिया • वर्तमान काल',
      wrongs: ['अकर्मक क्रिया • भूतकाल', 'सकर्मक क्रिया • भविष्यत् काल', 'अकर्मक क्रिया • वर्तमान काल'],
      expH: "यहाँ 'दूध' कर्म है (सकर्मक क्रिया) और 'रहा है' से वर्तमान समय का बोध हो रहा है।",
      expE: "Has direct object 'milk' (transitive) and present continuous ending."
    },
    {
      qH: "'पक्षी आकाश में उड़ रहे हैं।' वाक्य में कौन-सी क्रिया है?",
      qE: "Which type of verb is in 'Birds are flying in the sky'?",
      correct: 'अकर्मक क्रिया (कर्म नहीं है)',
      wrongs: ['सकर्मक क्रिया', 'द्विकर्मक क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: "'उड़ना' क्रिया का सीधा प्रभाव कर्ता (पक्षी) पर ही पड़ रहा है, इसमें कर्म नहीं है।",
      expE: "'Flying' does not take a direct object, so it is intransitive."
    },
    {
      qH: "'कल हमारा विद्यालय बंद रहेगा।' यह वाक्य किस काल का है?",
      qE: "Which tense is 'Tomorrow our school will remain closed'?",
      correct: 'भविष्यत् काल',
      wrongs: ['वर्तमान काल', 'भूतकाल', 'संदिग्ध भूतकाल'],
      expH: "'बंद रहेगा' से आने वाले समय (भविष्य) का बोध हो रहा है।",
      expE: "'रहेगा' denotes future time."
    },
    {
      qH: "'माँ ने स्वादिष्ट भोजन पकाया।' इस वाक्य का काल पहचानिए:",
      qE: "Identify the tense in 'Mother cooked delicious food':",
      correct: 'भूतकाल (कार्य बीत चुका है)',
      wrongs: ['वर्तमान काल', 'भविष्यत् काल', 'अपूर्ण वर्तमान'],
      expH: "भोजन पकाने का कार्य बीते समय में हो चुका है, अतः भूतकाल है।",
      expE: "Action completed in the past marks Bhootkaal."
    },
    {
      qH: "जिस शब्द से किसी काम के करने या होने का बोध हो, उसे क्या कहते हैं?",
      qE: "What is a word that denotes an action or state of being called?",
      correct: 'क्रिया',
      wrongs: ['संज्ञा', 'सर्वनाम', 'विशेषण'],
      expH: "पढ़ना, लिखना, सोना, दौड़ना आदि काम का बोध कराने वाले शब्द 'क्रिया' कहलाते हैं।",
      expE: "Words denoting action or state are Verbs (Kriya)."
    },
    {
      qH: "'राधा पत्र लिखती है।' वाक्य को भविष्यत् काल में बदलने पर क्या रूप बनेगा?",
      qE: "Convert 'Radha writes a letter' into Future tense:",
      correct: 'राधा पत्र लिखेगी।',
      wrongs: ['राधा ने पत्र लिखा।', 'राधा पत्र लिख रही थी।', 'राधा पत्र लिख चुकी है।'],
      expH: "भविष्यत् काल की पहचान क्रिया के अंत में 'गा, गे, गी' से होती है।",
      expE: "Future tense ends in '-गी' for feminine singular."
    },
    {
      qH: "'सोना, हँसना, रोना' सामान्यतः किस प्रकार की क्रियाएँ हैं?",
      qE: "'Sleeping, laughing, crying' belong to which verb category?",
      correct: 'अकर्मक क्रियाएँ',
      wrongs: ['सकर्मक क्रियाएँ', 'द्विकर्मक क्रियाएँ', 'सहायक क्रियाएँ'],
      expH: "इन क्रियाओं को किसी कर्म (Object) की आवश्यकता नहीं होती, अतः अकर्मक हैं।",
      expE: "These actions require no direct object (Intransitive)."
    },
    {
      qH: "'बच्चे ने पुस्तक पढ़ी।' को वर्तमान काल में बदलिए:",
      qE: "Convert 'The child read the book' to Present tense:",
      correct: 'बच्चा पुस्तक पढ़ता है।',
      wrongs: ['बच्चा पुस्तक पढ़ेगा।', 'बच्चा पुस्तक पढ़ चुका था।', 'बच्चा पुस्तक पढ़ रहा था।'],
      expH: "'पढ़ता है' वर्तमान काल को दर्शाता है।",
      expE: "'पढ़ता है' expresses Present tense."
    },
    {
      qH: "काल के मुख्य कितने भेद होते हैं?",
      qE: "How many main types of Tenses (Kaal) are there?",
      correct: 'तीन (भूत, वर्तमान, भविष्यत्)',
      wrongs: ['दो', 'चार', 'छह'],
      expH: "समय के आधार पर काल के तीन मुख्य भेद हैं: वर्तमान, भूत और भविष्यत् काल।",
      expE: "There are 3 primary tenses: Present, Past, and Future."
    },
    {
      qH: "'अध्यापक ने छात्र को कलम दी।' इसमें कितने कर्म हैं?",
      qE: "How many objects are in 'The teacher gave a pen to the student'?",
      correct: 'दो कर्म (छात्र और कलम — द्विकर्मक)',
      wrongs: ['एक भी कर्म नहीं', 'केवल एक कर्म', 'तीन कर्म'],
      expH: "'किसको' (छात्र को) और 'क्या' (कलम) — दो कर्म होने से यह द्विकर्मक क्रिया है।",
      expE: "Two objects ('student' and 'pen') make it Dwikarmak."
    },
    {
      qH: "'मैं रोज़ सुबह पार्क में टहलता हूँ।' यह किस काल का उदाहरण है?",
      qE: "Identify the tense: 'I walk in the park every morning.'",
      correct: 'सामान्य वर्तमान काल',
      wrongs: ['भूतकाल', 'भविष्यत् काल', 'पूर्ण भूतकाल'],
      expH: "दैनिक आदत या वर्तमान समय में होने वाली क्रिया वर्तमान काल होती है।",
      expE: "Habitual daily actions take Simple Present tense."
    },
    {
      qH: "'रोहन दौड़ रहा था।' को भूतकाल से भविष्यत् काल में बदलिए:",
      qE: "Convert 'Rohan was running' to Future tense:",
      correct: 'रोहन दौड़ेगा।',
      wrongs: ['रोहन दौड़ता है।', 'रोहन दौड़ चुका है।', 'रोहन दौड़ रहा है।'],
      expH: "भविष्य में क्रिया होने हेतु 'दौड़ेगा' प्रयोग होता है।",
      expE: "'रोहन दौड़ेगा' expresses future action."
    }
  ],

  vakya_vichar: [
    {
      qH: "वाक्य के मुख्य दो अंग कौन-से होते हैं?",
      qE: "What are the two main structural parts of a sentence?",
      correct: 'उद्देश्य (Subject) और विधेय (Predicate)',
      wrongs: ['संज्ञा और सर्वनाम', 'उपसर्ग और प्रत्यय', 'कर्ता और कारक'],
      expH: "वाक्य में जिसके विषय में कुछ कहा जाए वह 'उद्देश्य' और जो कहा जाए वह 'विधेय' होता है।",
      expE: "Every sentence comprises a Subject (Uddeshya) and Predicate (Vidheya)."
    },
    {
      qH: "'मोर बाग में सुंदर नाच रहा है।' इस वाक्य में 'उद्देश्य' क्या है?",
      qE: "Identify the Subject (उद्देश्य) in 'The peacock is dancing nicely in the garden':",
      correct: 'मोर',
      wrongs: ['बाग में', 'सुंदर', 'नाच रहा है'],
      expH: "यहाँ कार्य करने वाला और वाक्य का मुख्य विषय 'मोर' उद्देश्य है।",
      expE: "'Mor' (the peacock) is the subject."
    },
    {
      qH: "'छोटे बच्चे मैदान में फुटबॉल खेल रहे हैं।' में 'विधेय' भाग कौन-सा है?",
      qE: "Identify the Predicate (विधेय) in 'Little children are playing football on the field':",
      correct: 'मैदान में फुटबॉल खेल रहे हैं',
      wrongs: ['छोटे बच्चे', 'बच्चे', 'छोटे'],
      expH: "उद्देश्य ('छोटे बच्चे') के बारे में कही गई शेष पूरी बात विधेय कहलाती है।",
      expE: "Everything stated about the subject is the predicate."
    },
    {
      qH: "'तुम्हारा नाम क्या है?' अर्थ के आधार पर यह किस प्रकार का वाक्य है?",
      qE: "Classify by meaning: 'What is your name?'",
      correct: 'प्रश्नवाचक वाक्य',
      wrongs: ['विधानवाचक वाक्य', 'निषेधवाचक वाक्य', 'आज्ञावाचक वाक्य'],
      expH: "प्रश्न पूछने का भाव होने से यह प्रश्नवाचक वाक्य है।",
      expE: "Asking a question denotes Prashnavachak Vakya."
    },
    {
      qH: "'आज मौसम बहुत सुहावना है।' यह कौन-सा वाक्य है?",
      qE: "Classify: 'Today the weather is very pleasant.'",
      correct: 'विधानवाचक वाक्य',
      wrongs: ['निषेधवाचक वाक्य', 'प्रश्नवाचक वाक्य', 'विस्मयादिबोधक वाक्य'],
      expH: "किसी बात के सामान्य रूप से होने की सूचना देने वाला वाक्य विधानवाचक होता है।",
      expE: "A plain affirmative statement is Vidhanvachak."
    },
    {
      qH: "'सड़क पर कचरा मत फैलाओ।' अर्थ के आधार पर वाक्य भेद चुनिए:",
      qE: "Identify sentence type: 'Do not litter on the road.'",
      correct: 'निषेधवाचक / आज्ञावाचक (मनाही का भाव)',
      wrongs: ['इच्छावाचक वाक्य', 'संदेहवाचक वाक्य', 'संकेतवाचक वाक्य'],
      expH: "किसी कार्य को न करने ('मत' / 'नहीं') का भाव निषेधवाचक वाक्य दर्शाता है।",
      expE: "Prohibition/negation marks Nishedhvachak."
    },
    {
      qH: "'भगवान तुम्हारी रक्षा करें!' यह किस प्रकार का वाक्य है?",
      qE: "Identify: 'May God protect you!'",
      correct: 'इच्छावाचक वाक्य',
      wrongs: ['प्रश्नवाचक वाक्य', 'निषेधवाचक वाक्य', 'विधानवाचक वाक्य'],
      expH: "आशीर्वाद व शुभकामना प्रकट करने वाले वाक्य इच्छावाचक कहलाते हैं।",
      expE: "Blessings and wishes are Icchavachak."
    },
    {
      qH: "'अरे! तुम इतनी जल्दी आ गए।' यह अर्थ की दृष्टि से कौन-सा वाक्य है?",
      qE: "Identify: 'Oh! You arrived so soon.'",
      correct: 'विस्मयादिबोधक वाक्य',
      wrongs: ['संदेहवाचक वाक्य', 'आज्ञावाचक वाक्य', 'संकेतवाचक वाक्य'],
      expH: "अचानक आश्चर्य प्रकट होने के कारण यह विस्मयादिबोधक वाक्य है।",
      expE: "Sudden astonishment marks Vismayadibodhak."
    },
    {
      qH: "'कृपया मुझे एक गिलास पानी दीजिए।' कौन-सा वाक्य है?",
      qE: "Classify: 'Please give me a glass of water.'",
      correct: 'आज्ञावाचक वाक्य (विनती/अनुरोध)',
      wrongs: ['प्रश्नवाचक वाक्य', 'संदेहवाचक वाक्य', 'निषेधवाचक वाक्य'],
      expH: "आज्ञा, आदेश, प्रार्थना या अनुरोध आज्ञावाचक वाक्य के अंतर्गत आते हैं।",
      expE: "Polite requests fall under Agyavachak (Imperative)."
    },
    {
      qH: "सारथक शब्दों का वह व्यवस्थित समूह जो पूरा अर्थ प्रकट करे, क्या कहलाता है?",
      qE: "What is a meaningful, well-arranged group of words expressing complete thought called?",
      correct: 'वाक्य',
      wrongs: ['वर्ण', 'अक्षर', 'शब्दांश'],
      expH: "सार्थक पदों का व्यवस्थित एवं पूर्ण अर्थ देने वाला समूह 'वाक्य' कहलाता है।",
      expE: "A structured group of meaningful words conveying complete sense is a Sentence (Vakya)."
    },
    {
      qH: "'मैं रोज़ स्कूल जाता हूँ।' को निषेधवाचक वाक्य में बदलिए:",
      qE: "Convert 'I go to school daily' to Negative sentence:",
      correct: 'मैं रोज़ स्कूल नहीं जाता हूँ।',
      wrongs: ['क्या मैं स्कूल जाता हूँ?', 'शायद मैं स्कूल जाऊँगा।', 'काश मैं स्कूल जाता!'],
      expH: "सकारात्मक वाक्य में 'नहीं' जोड़ने से निषेधवाचक वाक्य बनता है।",
      expE: "Inserting 'नहीं' converts affirmative to negative."
    },
    {
      qH: "'शायद आज मेहमान आएँगे।' किस प्रकार का वाक्य है?",
      qE: "Identify: 'Perhaps guests will arrive today.'",
      correct: 'संदेहवाचक वाक्य',
      wrongs: ['विधानवाचक वाक्य', 'इच्छावाचक वाक्य', 'आज्ञावाचक वाक्य'],
      expH: "'शायद' शब्द अनिश्चय या संदेह का भाव प्रकट करता है।",
      expE: "'Shayad' signals uncertainty (Sandehvachak)."
    }
  ],

  shabd_vichar: [
    {
      qH: "जो शब्द संस्कृत भाषा से बिना किसी परिवर्तन के सीधे हिंदी में आए हैं, वे क्या कहलाते हैं?",
      qE: "Words borrowed from Sanskrit into Hindi without alteration are called:",
      correct: 'तत्सम शब्द',
      wrongs: ['तद्भव शब्द', 'देशज शब्द', 'विदेशी शब्द'],
      expH: "तत् (उसके = संस्कृत के) + सम (समान) = तत्सम शब्द (जैसे अग्नि, सूर्य, दुग्ध)।",
      expE: "Tatsam words retain their original Sanskrit spelling."
    },
    {
      qH: "'दुग्ध' का तद्भव रूप और 'आग' का तत्सम रूप क्रमशः क्या है?",
      qE: "What is the Tadbhav of 'दुग्ध' and Tatsam of 'आग'?",
      correct: 'दूध और अग्नि',
      wrongs: ['दही और अनल', 'घी और पावक', 'क्षीर और ज्वाला'],
      expH: "संस्कृत 'दुग्ध' से हिंदी 'दूध' तथा 'अग्नि' से 'आग' तद्भव बना है।",
      expE: "Dugdha -> Doodh; Aag <- Agni."
    },
    {
      qH: "'लोटा', 'पगड़ी' और 'थैला' उत्पत्ति के आधार पर किस वर्ग के शब्द हैं?",
      qE: "'लोटा', 'पगड़ी', and 'थैला' belong to which word origin class?",
      correct: 'देशज शब्द',
      wrongs: ['विदेशी शब्द', 'तत्सम शब्द', 'तद्भव शब्द'],
      expH: "स्थानीय बोलियों व देश की आवश्यकताओं से उपजे शब्द 'देशज' कहलाते हैं।",
      expE: "Indigenous words originating in regional dialects are Deshaj."
    },
    {
      qH: "'स्कूल', 'स्टेशन', 'चाय' और 'कमीज़' किस श्रेणी के शब्द हैं?",
      qE: "'स्कूल', 'स्टेशन', 'चाय', and 'कमीज़' fall under which category?",
      correct: 'विदेशी (आगत) शब्द',
      wrongs: ['तत्सम शब्द', 'देशज शब्द', 'तद्भव शब्द'],
      expH: "अंग्रेजी, अरबी, फारसी, चीनी आदि विदेशी भाषाओं से आए शब्द 'विदेशी शब्द' हैं।",
      expE: "Words adopted from foreign languages are Videshi (loanwords)."
    },
    {
      qH: "जिन शब्दों के सार्थक खंड (टुकड़े) न किए जा सकें, वे रचना के आधार पर क्या कहलाते हैं?",
      qE: "Words that cannot be split into smaller meaningful parts are:",
      correct: 'रूढ़ शब्द (जैसे: घर, जल, फल)',
      wrongs: ['यौगिक शब्द', 'योगरूढ़ शब्द', 'विकारी शब्द'],
      expH: "जैसे 'जल' के 'ज' और 'ल' करने पर कोई अर्थ नहीं निकलता, अतः रूढ़ शब्द है।",
      expE: "Indivisible basic root words are called Roodh Shabd."
    },
    {
      qH: "'पाठशाला' (पाठ + शाला) और 'रसोईघर' (रसोई + घर) रचना के अनुसार किस प्रकार के शब्द हैं?",
      qE: "Structurally, 'पाठशाला' and 'रसोईघर' are:",
      correct: 'यौगिक शब्द',
      wrongs: ['रूढ़ शब्द', 'योगरूढ़ शब्द', 'देशज शब्द'],
      expH: "दो सार्थक शब्दों या उपसर्ग-प्रत्यय के मेल से बने सामान्य अर्थ वाले शब्द 'यौगिक' होते हैं।",
      expE: "Compound words with literal combined meanings are Yaugik."
    },
    {
      qH: "'दशानन' (दस मुख वाला = रावण) और 'पंकज' (कीचड़ में जन्मा = कमल) कौन-से शब्द हैं?",
      qE: "'दशानन' and 'पंकज' (which refer to a special third meaning) are:",
      correct: 'योगरूढ़ शब्द',
      wrongs: ['रूढ़ शब्द', 'साधारण यौगिक शब्द', 'विदेशी शब्द'],
      expH: "जो शब्द यौगिक होते हुए भी किसी विशेष परंपरागत (तीसरे) अर्थ के लिए रूढ़ हो जाएँ, वे योगरूढ़ हैं।",
      expE: "Compound words specialized to a unique referent are Yogroodh."
    },
    {
      qH: "इनमें से कौन-सा शब्द 'तद्भव' है?",
      qE: "Which of these words is Tadbhav?",
      correct: 'हाथ (तत्सम: हस्त)',
      wrongs: ['अक्षि', 'मस्तक', 'कर्ण'],
      expH: "'हस्त' तत्सम है जिसका परिवर्तित हिंदी रूप 'हाथ' तद्भव है।",
      expE: "'Haath' evolved from Sanskrit 'Hasta'."
    },
    {
      qH: "'रेलगाड़ी' (अंग्रेजी 'रेल' + हिंदी 'गाड़ी') किस प्रकार का शब्द है?",
      qE: "'रेलगाड़ी' (combining English and Hindi roots) is a:",
      correct: 'संकर शब्द (दो भाषाओं का मेल)',
      wrongs: ['रूढ़ शब्द', 'तत्सम शब्द', 'योगरूढ़ शब्द'],
      expH: "दो भिन्न भाषाओं के शब्दों से मिलकर बने शब्द 'संकर शब्द' कहलाते हैं।",
      expE: "Hybrid words blending two languages are Sankar Shabd."
    },
    {
      qH: "प्रयोग के आधार पर शब्द के दो मुख्य भेद कौन-से हैं?",
      qE: "By grammatical usage, what are the two main divisions of words?",
      correct: 'विकारी और अविकारी',
      wrongs: ['तत्सम और तद्भव', 'रूढ़ और यौगिक', 'सार्थक और निरर्थक'],
      expH: "जिनमें लिंग-वचन-काल से बदलाव आए वे विकारी (संज्ञा, सर्वनाम, विशेषण, क्रिया), जिनमें न आए वे अविकारी।",
      expE: "Declinable (Vikari) and Indeclinable (Avikari)."
    },
    {
      qH: "'मस्तक' और 'सूर्य' किस प्रकार के शब्द हैं?",
      qE: "What origin type are 'मस्तक' and 'सूर्य'?",
      correct: 'तत्सम शब्द',
      wrongs: ['तद्भव शब्द', 'देशज शब्द', 'विदेशी शब्द'],
      expH: "मस्तक (तद्भव: माथा) और सूर्य (तद्भव: सूरज) शुद्ध संस्कृत तत्सम शब्द हैं।",
      expE: "Both are direct Sanskrit Tatsam forms."
    },
    {
      qH: "'चाय' और 'लीची' मुख्यतः किस विदेशी भाषा से हिंदी में आए शब्द हैं?",
      qE: "'चाय' and 'लीची' entered Hindi from which language?",
      correct: 'चीनी भाषा',
      wrongs: ['पुर्तगाली', 'तुर्की', 'जापानी'],
      expH: "'चाय' और 'लीची' चीनी भाषा से हिंदी में आए आगत शब्द हैं।",
      expE: "Chai and Litchi are Chinese loanwords."
    }
  ],

  avikari: [
    {
      qH: "'कछुआ धीरे-धीरे चलता है।' में 'धीरे-धीरे' किस प्रकार का अविकारी शब्द है?",
      qE: "In 'The tortoise walks slowly', what type of Avikari word is 'धीरे-धीरे'?",
      correct: 'रीतिवाचक क्रियाविशेषण',
      wrongs: ['संबंधबोधक', 'समुच्चयबोधक', 'विस्मयादिबोधक'],
      expH: "'धीरे-धीरे' चलने की रीति (तरीका) बता रहा है, अतः क्रियाविशेषण (रीतिवाचक) है।",
      expE: "'Dheere-dheere' is an adverb of manner (Ritivachak Kriyavisheshan)."
    },
    {
      qH: "'घर के सामने सुंदर बगीचा है।' में 'के सामने' कौन-सा अविकारी शब्द है?",
      qE: "In 'There is a garden in front of the house', what is 'के सामने'?",
      correct: 'संबंधबोधक अव्यय',
      wrongs: ['समुच्चयबोधक अव्यय', 'क्रियाविशेषण', 'विस्मयादिबोधक'],
      expH: "जो अव्यय संज्ञा/सर्वनाम का संबंध वाक्य के अन्य शब्दों से जोड़े ('के सामने', 'के ऊपर'), वह संबंधबोधक है।",
      expE: "'के सामने' functions as a postposition (Sambandhbodhak)."
    },
    {
      qH: "'राम और श्याम अच्छे मित्र हैं।' में 'और' किस अविकारी भेद का उदाहरण है?",
      qE: "In 'Ram and Shyam are good friends', what is 'और'?",
      correct: 'समुच्चयबोधक अव्यय (योजक)',
      wrongs: ['संबंधबोधक अव्यय', 'क्रियाविशेषण', 'विस्मयादिबोधक'],
      expH: "दो शब्दों या वाक्यों को जोड़ने वाले अव्यय शब्द 'समुच्चयबोधक' कहलाते हैं।",
      expE: "'Aur' is a conjunction (Samuchchayabodhak)."
    },
    {
      qH: "'शाबाश! तुमने प्रथम स्थान प्राप्त किया।' में 'शाबाश!' क्या है?",
      qE: "What category does 'शाबाश!' belong to?",
      correct: 'विस्मयादिबोधक अव्यय',
      wrongs: ['क्रियाविशेषण', 'संबंधबोधक', 'निपात'],
      expH: "हर्ष, प्रशंसा, शोक या आश्चर्य प्रकट करने वाले शब्द विस्मयादिबोधक कहलाते हैं।",
      expE: "'Shabash!' is an interjection (Vismayadibodhak)."
    },
    {
      qH: "'कल माताजी आएँगी।' में 'कल' कौन-सा क्रियाविशेषण है?",
      qE: "In 'Mother will arrive tomorrow', what type of adverb is 'कल'?",
      correct: 'कालवाचक क्रियाविशेषण',
      wrongs: ['स्थानवाचक क्रियाविशेषण', 'परिमाणवाचक क्रियाविशेषण', 'रीतिवाचक क्रियाविशेषण'],
      expH: "क्रिया के होने का समय ('कल', 'अभी', 'प्रतिदिन') कालवाचक क्रियाविशेषण बताता है।",
      expE: "'Kal' denotes time (Kaalvachak Kriyavisheshan)."
    },
    {
      qH: "'बच्चे छत पर खेल रहे हैं' की जगह 'बच्चे ऊपर खेल रहे हैं' में 'ऊपर' क्या है?",
      qE: "In 'Children are playing upstairs', what is 'ऊपर'?",
      correct: 'स्थानवाचक क्रियाविशेषण',
      wrongs: ['संबंधबोधक', 'परिमाणवाचक क्रियाविशेषण', 'समुच्चयबोधक'],
      expH: "क्रिया के घटित होने के स्थान ('ऊपर', 'नीचे', 'यहाँ', 'वहाँ') का बोध स्थानवाचक क्रियाविशेषण कराता है।",
      expE: "'Upar' without ke/se acts directly as adverb of place."
    },
    {
      qH: "'थोड़ा खाओ, ज़्यादा चबाओ।' में 'थोड़ा' और 'ज़्यादा' क्या हैं?",
      qE: "What adverb subtype are 'थोड़ा' and 'ज़्यादा' when modifying verbs?",
      correct: 'परिमाणवाचक क्रियाविशेषण',
      wrongs: ['कालवाचक क्रियाविशेषण', 'रीतिवाचक क्रियाविशेषण', 'संबंधबोधक'],
      expH: "क्रिया की मात्रा या नाप-तौल ('थोड़ा', 'ज़्यादा', 'कम') परिमाणवाचक क्रियाविशेषण होते हैं।",
      expE: "Adverbs indicating verbal degree/quantity are Parimanvachak."
    },
    {
      qH: "अविकारी शब्दों (अव्यय) की मुख्य विशेषता क्या है?",
      qE: "What defines Avikari (indeclinable) words?",
      correct: 'लिंग, वचन, काल के अनुसार इनका रूप कभी नहीं बदलता',
      wrongs: ['ये केवल बहुवचन में रहते हैं', 'ये केवल संज्ञा के आगे आते हैं', 'इनका लिंग बदलता रहता है'],
      expH: "अ + विकारी = जिनमें कोई परिवर्तन न हो (जैसे और, धीरे, पर, वाह)।",
      expE: "Avikari words never inflect for gender, number, or tense."
    },
    {
      qH: "'वह बीमार था, इसलिए नहीं आया।' में 'इसलिए' किस अव्यय का उदाहरण है?",
      qE: "Identify 'इसलिए' in 'He was sick, therefore did not come':",
      correct: 'व्यधिकरण/समानाधिकरण समुच्चयबोधक',
      wrongs: ['विस्मयादिबोधक', 'कालवाचक क्रियाविशेषण', 'संबंधबोधक'],
      expH: "दो उपवाक्यों को जोड़ने के कारण 'इसलिए' समुच्चयबोधक अव्यय है।",
      expE: "'Isliye' links two clauses as a conjunction."
    },
    {
      qH: "'तुम्हारे बिना मेरा काम नहीं चलेगा।' में 'के/तुम्हारे बिना' कौन-सा अव्यय है?",
      qE: "What is 'बिना' linking 'तुम्हारे' to the sentence?",
      correct: 'संबंधबोधक अव्यय',
      wrongs: ['विस्मयादिबोधक', 'क्रियाविशेषण', 'समुच्चयबोधक'],
      expH: "सर्वनाम के साथ जुड़कर संबंध बताने वाला शब्द 'संबंधबोधक' होता है।",
      expE: "'Bina' connects the pronoun to the rest of the clause."
    },
    {
      qH: "'मैं भी आपके साथ चलूँगा।' में 'भी' शब्द क्या है?",
      qE: "In 'I too will come with you', what grammatical particle is 'भी'?",
      correct: 'निपात (अवधारक अव्यय)',
      wrongs: ['संबंधबोधक', 'विस्मयादिबोधक', 'क्रियाविशेषण'],
      expH: "जो अव्यय पद किसी शब्द पर विशेष बल देने के लिए जुड़ते हैं ('भी', 'ही', 'तो', 'तक'), वे निपात कहलाते हैं।",
      expE: "Emphatic particles like 'bhi', 'hi', 'to' are Nipaat."
    },
    {
      qH: "अविकारी शब्दों के मुख्य चार भेद कौन-से हैं?",
      qE: "What are the 4 main types of Avikari words?",
      correct: 'क्रियाविशेषण, संबंधबोधक, समुच्चयबोधक, विस्मयादिबोधक',
      wrongs: ['संज्ञा, सर्वनाम, विशेषण, क्रिया', 'तत्सम, तद्भव, देशज, विदेशी', 'कर्ता, कर्म, करण, अपादान'],
      expH: "ये चारों अविकारी (अव्यय) के मुख्य भेद हैं।",
      expE: "Adverbs, Postpositions, Conjunctions, and Interjections."
    }
  ],

  anekarthi: [
    {
      qH: "'कनक' शब्द के दो भिन्न सही अर्थ कौन-से हैं?",
      qE: "Which pair gives two distinct meanings of 'कनक'?",
      correct: 'सोना और धतूरा (तथा गेहूँ)',
      wrongs: ['चाँदी और पत्थर', 'जल और हवा', 'आग और पानी'],
      expH: "'कनक-कनक ते सौ गुनी' दोहे में कनक का अर्थ 'सोना' व 'धतूरा' दोनों लिया गया है।",
      expE: "'Kanak' denotes both Gold and Datura (thorn-apple)."
    },
    {
      qH: "'कर' शब्द का अनेकार्थी अर्थ समूह पहचानिए:",
      qE: "Select the multiple meanings of 'कर':",
      correct: 'हाथ, टैक्स (शुल्क), हाथी की सूँड़, किरण',
      wrongs: ['पैर, आकाश, भूमि', 'नदी, पर्वत, पेड़', 'पुस्तक, कलम, दवात'],
      expH: "'कर' के प्रमुख अर्थ हाथ, कर (टैक्स), किरण और सूँड़ होते हैं।",
      expE: "'Kar' means hand, tax, ray, and elephant trunk."
    },
    {
      qH: "'अंबर' शब्द किन दो भिन्न अर्थों में प्रयुक्त होता है?",
      qE: "Which two meanings apply to 'अंबर'?",
      correct: 'आकाश और वस्त्र (कपड़ा)',
      wrongs: ['धरती और पाताल', 'आग और जल', 'सोना और ताँबा'],
      expH: "'पीतांबर' (पीला वस्त्र) तथा 'नीलांबर' (नीला आकाश) दोनों में अंबर शब्द आता है।",
      expE: "'Ambar' means both Sky and Garment."
    },
    {
      qH: "'हार' शब्द के दो अलग-अलग अर्थ क्या हैं?",
      qE: "What are two distinct meanings of 'हार'?",
      correct: 'माला (गले का आभूषण) और पराजय',
      wrongs: ['जीत और उपहार', 'शस्त्र और वस्त्र', 'फूल और काँटा'],
      expH: "गले का मोतियों का 'हार' और खेल में 'हार' (पराजय) दो प्रसिद्ध अर्थ हैं।",
      expE: "'Haar' means both necklace/garland and defeat."
    },
    {
      qH: "'पत्र' शब्द के सही अनेकार्थी अर्थ चुनिए:",
      qE: "Pick the meanings of 'पत्र':",
      correct: 'चिट्ठी और पेड़ का पत्ता',
      wrongs: ['पेड़ की जड़ और फल', 'कलम और स्याही', 'किताब और पेंसिल'],
      expH: "'पत्र' का अर्थ पेड़ का पत्ता और संदेश की चिट्ठी दोनों होता है।",
      expE: "'Patra' means both leaf and letter."
    },
    {
      qH: "'फल' शब्द के दो भिन्न अर्थ क्या हैं?",
      qE: "What are two meanings of 'फल'?",
      correct: 'खाने का फल (आम) और परिणाम (नतीजा)',
      wrongs: ['फूल और कली', 'तालाब और नदी', 'तारा और चाँद'],
      expH: "'मेहनत का फल' (परिणाम) और 'मीठा फल' (खाने वाला) दोनों सही हैं।",
      expE: "'Phal' means both fruit and consequence/result."
    },
    {
      qH: "'उत्तर' शब्द के दो भिन्न अर्थ कौन-से हैं?",
      qE: "Choose two meanings of 'उत्तर':",
      correct: 'एक दिशा और प्रश्न का जवाब',
      wrongs: ['पूरब और पश्चिम', 'ऊँचा और नीचा', 'दिन और रात'],
      expH: "'उत्तर दिशा' तथा 'सवाल का उत्तर' दोनों अर्थ प्रचलित हैं।",
      expE: "'Uttar' means both North and Answer."
    },
    {
      qH: "'मधु' शब्द के सही अनेकार्थी अर्थ बताइए:",
      qE: "Which meanings belong to 'मधु'?",
      correct: 'शहद और वसंत ऋतु (तथा मीठा)',
      wrongs: ['नमक और मिर्च', 'गरमी और बरसात', 'कोयला और लोहा'],
      expH: "'मधु' शहद, मीठा और वसंत ऋतु के लिए प्रयुक्त होता है।",
      expE: "'Madhu' signifies honey, sweetness, and spring."
    },
    {
      qH: "'लाल' शब्द के दो प्रचलित अर्थ क्या हैं?",
      qE: "What are two common meanings of 'लाल'?",
      correct: 'एक रंग और प्यारा बेटा (पुत्र)',
      wrongs: ['पीला और नीला', 'मित्र और शत्रु', 'सोना और चाँदी'],
      expH: "'लाल रंग' और 'माँ का लाल' (बेटा) इसके दो प्रमुख अर्थ हैं।",
      expE: "'Laal' means both red color and beloved child/son."
    },
    {
      qH: "'तीर' शब्द के कौन-से दो भिन्न अर्थ होते हैं?",
      qE: "Select two distinct meanings of 'तीर':",
      correct: 'बाण और नदी का किनारा',
      wrongs: ['तलवार और ढाल', 'नाव और समुद्र', 'पहाड़ और झरना'],
      expH: "'धनुष का तीर' (बाण) और 'यमुना तीर' (तट/किनारा) दोनों सही हैं।",
      expE: "'Teer' means both arrow and riverbank."
    },
    {
      qH: "'सोना' शब्द किन दो अर्थों में आता है?",
      qE: "Which two meanings does 'सोना' have?",
      correct: 'एक बहुमूल्य धातु (स्वर्ण) और नींद लेना (क्रिया)',
      wrongs: ['जागना और दौड़ना', 'ताँबा और पीतल', 'रोटी और पानी'],
      expH: "'सोना' संज्ञा रूप में स्वर्ण धातु और क्रिया रूप में शयन (नींद) होता है।",
      expE: "'Sona' means Gold as a noun and to sleep as a verb."
    },
    {
      qH: "'वर' शब्द के दो भिन्न अर्थ चुनिए:",
      qE: "Identify two meanings of 'वर':",
      correct: 'दूल्हा और वरदान (तथा श्रेष्ठ)',
      wrongs: ['वधू और कन्या', 'मित्र और भाई', 'घर और आँगन'],
      expH: "'वर' का अर्थ दूल्हा, श्रेष्ठ तथा आशीर्वाद/वरदान होता है।",
      expE: "'Var' means groom, boon, and best."
    }
  ],

  shrutisam: [
    {
      qH: "'अनल' और 'अनिल' के क्रमशः सही अर्थ क्या हैं?",
      qE: "What are the respective meanings of 'अनल' and 'अनिल'?",
      correct: 'आग और हवा',
      wrongs: ['हवा और आग', 'पानी और मिट्टी', 'धूप और छाँव'],
      expH: "'अनल' का अर्थ अग्नि (आग) और 'अनिल' का अर्थ वायु (हवा) है।",
      expE: "Anal = Fire; Anil = Wind."
    },
    {
      qH: "'दिन' और 'दीन' श्रुतिसमभिन्नार्थक शब्दों का सही जोड़ा है:",
      qE: "Distinguish 'दिन' and 'दीन':",
      correct: 'दिवस (Day) और गरीब (Poor)',
      wrongs: ['गरीब और दिवस', 'रात और अमीर', 'सुबह और शाम'],
      expH: "ह्रस्व 'दि' वाला 'दिन' = दिवस, जबकि दीर्घ 'दी' वाला 'दीन' = गरीब/दुखी।",
      expE: "Din = Day; Deen = Poor/Needy."
    },
    {
      qH: "'कुल' और 'कूल' के सही अर्थ क्रमशः चुनिए:",
      qE: "What do 'कुल' and 'कूल' mean respectively?",
      correct: 'वंश/सारा और नदी का किनारा',
      wrongs: ['किनारा और वंश', 'ठंडा और गरम', 'फूल और काँटा'],
      expH: "'कुल' का अर्थ परिवार/वंश या जोड़ तथा 'कूल' का अर्थ तट (किनारा) होता है।",
      expE: "Kul = Family/Total; Kool = Bank/Shore."
    },
    {
      qH: "'ओर' और 'और' में क्या अंतर है?",
      qE: "What is the difference between 'ओर' and 'और'?",
      correct: 'दिशा/तरफ़ और तथा (तथा अन्य)',
      wrongs: ['तथा और दिशा', 'ऊपर और नीचे', 'पास और दूर'],
      expH: "'नदी की ओर' (तरफ़/दिशा) तथा 'राम और श्याम' (तथा) क्रमशः सही हैं।",
      expE: "Or = Direction/Towards; Aur = And/More."
    },
    {
      qH: "'नीर' और 'नीड़' के सही अर्थ बताइए:",
      qE: "What do 'नीर' and 'नीड़' mean?",
      correct: 'जल (पानी) और घोंसला',
      wrongs: ['घोंसला और पानी', 'पेड़ और पत्ता', 'आकाश और धरती'],
      expH: "'नीर' पानी को कहते हैं और 'नीड़' चिड़िया के घोंसले को कहते हैं।",
      expE: "Neer = Water; Need = Nest."
    },
    {
      qH: "'गृह' और 'ग्रह' शब्दों के क्रमशः सही अर्थ क्या हैं?",
      qE: "Differentiate 'गृह' and 'ग्रह':",
      correct: 'घर और आकाशीय पिंड (नक्षत्र)',
      wrongs: ['नक्षत्र और घर', 'पर्वत और नदी', 'बाग और उपवन'],
      expH: "'गृह' (ऋ की मात्रा) = घर, जबकि 'ग्रह' (पदेन र) = पृथ्वी, मंगल आदि ग्रह।",
      expE: "Grih = Home; Grah = Planet."
    },
    {
      qH: "'अंश' और 'अंस' के सही अर्थ चुनिए:",
      qE: "What do 'अंश' and 'अंस' mean respectively?",
      correct: 'भाग/हिस्सा और कंधा',
      wrongs: ['कंधा और हिस्सा', 'आँख और कान', 'हाथ और पैर'],
      expH: "तालव्य 'श' वाला 'अंश' = हिस्सा, दंत्य 'स' वाला 'अंस' = कंधा।",
      expE: "Ansh = Portion/Part; Ans = Shoulder."
    },
    {
      qH: "'पवन' और 'पावन' का सही अर्थ युग्म क्या है?",
      qE: "Distinguish 'पवन' and 'पावन':",
      correct: 'हवा और पवित्र',
      wrongs: ['पवित्र और हवा', 'आग और पानी', 'फूल और खुशबू'],
      expH: "'पवन' का अर्थ वायु (हवा) तथा 'पावन' का अर्थ शुद्ध/पवित्र है।",
      expE: "Pawan = Wind; Paawan = Sacred/Pure."
    },
    {
      qH: "'समान' और 'सामान' के क्रमशः अर्थ पहचानिए:",
      qE: "What do 'समान' and 'सामान' mean?",
      correct: 'बराबर और वस्तु/असबाब',
      wrongs: ['वस्तु और बराबर', 'नया और पुराना', 'कम और ज़्यादा'],
      expH: "'समान' यानी एक जैसा/बराबर और 'सामान' यानी चीज़ें/असबाब।",
      expE: "Samaan = Equal/Similar; Saamaan = Luggage/Goods."
    },
    {
      qH: "'अवधि' और 'अवधी' में सही अंतर चुनिए:",
      qE: "Differentiate 'अवधि' and 'अवधी':",
      correct: 'समय-सीमा और एक क्षेत्रीय भाषा/बोली',
      wrongs: ['बोली और समय', 'दिन और रात', 'पुस्तक और लेखक'],
      expH: "ह्रस्व 'धि' = समय या काल-सीमा; दीर्घ 'धी' = अवध क्षेत्र की भाषा (रामचरितमानस की बोली)।",
      expE: "Avadhi = Time duration; Avadhee = Awadhi dialect."
    },
    {
      qH: "'कपट' और 'कपाट' के क्रमशः सही अर्थ क्या हैं?",
      qE: "What do 'कपट' and 'कपाट' mean?",
      correct: 'धोखा/छल और दरवाज़ा (किवाड़)',
      wrongs: ['दरवाज़ा और धोखा', 'कमरा और छत', 'मित्रता और शत्रुता'],
      expH: "'कपट' का अर्थ छल-धोखा और 'कपाट' का अर्थ दरवाज़ा होता है।",
      expE: "Kapat = Deceit; Kapaat = Door/Gate."
    },
    {
      qH: "'आदि' और 'आदी' के क्रमशः सही अर्थ बताइए:",
      qE: "Distinguish 'आदि' and 'आदी':",
      correct: 'प्रारंभ/इत्यादि और अभ्यस्त (लत लगा हुआ)',
      wrongs: ['अभ्यस्त और प्रारंभ', 'अंत और मध्य', 'नया और ताज़ा'],
      expH: "'आदि' = शुरुआत या वगैरह; 'आदी' = किसी चीज़ की आदत होना।",
      expE: "Aadi (short i) = Beginning/Etc.; Aadee (long ee) = Accustomed/Addicted."
    }
  ]
};
