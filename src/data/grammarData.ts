import {
  GrammarModule,
  KarakData,
  VakyaItem,
  VachyaStageItem,
  KaalDialItem,
  MuhavaraItem,
  ApathitGadyanshPassage,
  WorksheetItem,
  QuizQuestion
} from '../types';

export const ALL_GRAMMAR_MODULES: GrammarModule[] = [
  {
    id: 'karak',
    slug: 'karak-cables',
    titleHindi: 'कारक (Karak Cables)',
    titleEnglish: 'Case Markers Simulation',
    subtitleHindi: 'करण (साधन) बनाम अपादान (अलगाव) का स्पष्ट दृश्य भेद',
    subtitleEnglish: 'Visual logic distinguishing instrument from separation',
    iconName: 'Cable',
    bottleneckHindi: "विद्यार्थी 'से' विभक्ति में भ्रमित होते हैं—'कलम से लिखा' (करण) या 'पेड़ से पत्ता गिरा' (अपादान)।",
    bottleneckEnglish: "Students confuse 'से' between Karan (by/with tool) and Apadan (separation from).",
    interactionNameHindi: 'कारक केबल (Karak Cables)',
    interactionNameEnglish: 'Karak Cables Simulation',
    whatStudentGainsHindi: 'स्थानिक एवं तार्किक समझ, ताकि विभक्ति देखकर तुक्का न लगाना पड़े।',
    whatStudentGainsEnglish: 'Spatial and logical reason for each karak, eliminating guesswork.',
    paramparaCorner: {
      definitionHindi: 'संज्ञा या सर्वनाम के जिस रूप से वाक्य के अन्य शब्दों (विशेषकर क्रिया) के साथ उसका संबंध जाना जाए, उसे कारक कहते हैं।',
      definitionEnglish: 'The grammatical form of a noun or pronoun that defines its relational role to other words, especially the verb.',
      classicalShlokaOrRule: 'कर्ता ने अरु कर्म को, करण रीति से जान। सम्प्रदान को के लिए, अपादान से मान॥',
      heritageContext: 'प्राचीन वैयाकरण पाणिनी ने कारक को क्रिया से सीधे संबंध रखने वाला तत्व (कारकाणि षट्) माना है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'करण कारक: क्रिया को करने का साधन या माध्यम (से, के द्वारा)।',
        ruleEnglish: 'Karan Karak: The instrument or means used to perform action (with/by).',
        exampleHindi: 'रोहन ने चाकू से सेब काटा। (चाकू = साधन)',
        exampleEnglish: 'Rohan cut the apple with a knife. (Knife = tool)'
      },
      {
        ruleHindi: 'अपादान कारक: किसी वस्तु या व्यक्ति का दूसरी से अलग होना, डरना या तुलना (से)।',
        ruleEnglish: 'Apadan Karak: Detachment, fear, or separation from a source (from).',
        exampleHindi: 'गंगा हिमालय से निकलती है। (हिमालय से अलग होना)',
        exampleEnglish: 'Ganga emerges from the Himalayas. (Separation)'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_k1',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'वृक्ष से पत्ते गिरते हैं' में 'से' किस कारक की विभक्ति है?",
        questionEnglish: "In 'Leaves fall from the tree', what is 'से' marking?",
        sentenceHindi: 'वृक्ष से पत्ते गिरते हैं।',
        sentenceEnglish: 'Leaves fall from the tree.',
        options: [
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak (Separation)' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak (Instrument)' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak (Object)' },
          { textHindi: 'सम्बन्ध कारक (Relation)', textEnglish: 'Sambandh Karak (Relation)' }
        ],
        correctIndex: 0,
        explanationHindi: 'यहाँ पत्ता पेड़ से अलग (detach) हो रहा है, अतः अलगाव के कारण अपादान कारक है।',
        explanationEnglish: 'Here the leaf is detaching from the tree, so separation dictates Apadan Karak.'
      },
      {
        id: 'qc_k2',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'अध्यापिका ने कलम से उत्तर पुस्तिका जाँची।' में 'कलम से' कौन सा कारक है?",
        questionEnglish: "In 'Teacher checked the notebook with a pen', what karak is 'कलम से'?",
        sentenceHindi: 'अध्यापिका ने कलम से उत्तर पुस्तिका जाँची।',
        sentenceEnglish: 'Teacher checked the notebook with a pen.',
        options: [
          { textHindi: 'करण कारक (Instrument/Tool)', textEnglish: 'Karan Karak (Instrument/Tool)' },
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak (Separation)' },
          { textHindi: 'कर्ता कारक (Doer)', textEnglish: 'Karta Karak (Doer)' },
          { textHindi: 'अधिकरण कारक (Place)', textEnglish: 'Adhikaran Karak (Place)' }
        ],
        correctIndex: 0,
        explanationHindi: 'कलम जाँचने की क्रिया का साधन (instrument) है, इसलिए यह करण कारक है।',
        explanationEnglish: 'The pen is the tool used for checking, hence Karan Karak.'
      },
      {
        id: 'qc_k3',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'गरीबों को कंबल दान करो।' रेखांकित पद में कौन सा कारक है?",
        questionEnglish: "In 'Donate blankets to the poor', what karak is 'गरीबों को'?",
        options: [
          { textHindi: 'सम्प्रदान कारक (Giving/Donation)', textEnglish: 'Sampradan Karak' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak' },
          { textHindi: 'सम्बन्ध कारक (Relation)', textEnglish: 'Sambandh Karak' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'दान देने के अर्थ में जिसे वस्तु सदा के लिए दी जाए, वहाँ सम्प्रदान कारक होता है।',
        explanationEnglish: 'In acts of giving/charity, the recipient takes Sampradan Karak.'
      },
      {
        id: 'qc_k4',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'मेज पर सुंदर फूलदान रखा है।' में 'पर' किस कारक का चिन्ह है?",
        questionEnglish: "In 'The vase is on the table', what karak is 'पर'?",
        options: [
          { textHindi: 'अधिकरण कारक (Location/Support)', textEnglish: 'Adhikaran Karak' },
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak' }
        ],
        correctIndex: 0,
        explanationHindi: "'में' और 'पर' क्रिया के आधार या स्थान का बोध कराने वाले अधिकरण कारक के चिन्ह हैं।",
        explanationEnglish: "'पर' indicates spatial locus/support, marking Adhikaran Karak."
      },
      {
        id: 'qc_k5',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'रोहन की बहन बहुत बुद्धिमान है।' में कौन सा कारक प्रयुक्त है?",
        questionEnglish: "In 'Rohan's sister is very intelligent', which karak is used?",
        options: [
          { textHindi: 'सम्बन्ध कारक (Relation - का/की/के)', textEnglish: 'Sambandh Karak' },
          { textHindi: 'कर्ता कारक (Doer)', textEnglish: 'Karta Karak' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak' }
        ],
        correctIndex: 0,
        explanationHindi: "'रोहन की बहन' दो संज्ञाओं के बीच आपसी सम्बन्ध दर्शाती है।",
        explanationEnglish: "Marks relation between two nouns using 'की' (Sambandh Karak)."
      },
      {
        id: 'qc_k6',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'अरे बालक! सड़क पर मत दौड़ो।' में 'अरे' किस कारक का सूचक है?",
        questionEnglish: "In 'Hey boy! Do not run on the road', what is 'अरे'?",
        options: [
          { textHindi: 'संबोधन कारक (Vocative/Address)', textEnglish: 'Sambodhan Karak' },
          { textHindi: 'कर्ता कारक (Doer)', textEnglish: 'Karta Karak' },
          { textHindi: 'अधिकरण कारक (Location)', textEnglish: 'Adhikaran Karak' },
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak' }
        ],
        correctIndex: 0,
        explanationHindi: "पुकारने या सचेत करने के लिए प्रयुक्त शब्द संबोधन कारक (हे, अरे, भो) होते हैं।",
        explanationEnglish: "Used to call or alert someone, representing Vocative (Sambodhan)."
      },
      {
        id: 'qc_k7',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'बच्चा शेर से डरकर भाग गया।' में 'शेर से' में कौन सा कारक है?",
        questionEnglish: "In 'Child fled fearing the lion', what karak is 'शेर से'?",
        options: [
          { textHindi: 'अपादान कारक (Fear / Separation)', textEnglish: 'Apadan Karak' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak' },
          { textHindi: 'कर्ता कारक (Doer)', textEnglish: 'Karta Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'डरने, लजाने या सीखने के अर्थ में भी अपादान कारक की विभक्ति (से) लगती है।',
        explanationEnglish: 'Emotions of fear or fleeing from danger take Apadan Karak.'
      },
      {
        id: 'qc_k8',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'किसान हल से खेत जोतता है।' में 'हल से' किस कारक का उदाहरण है?",
        questionEnglish: "In 'Farmer plows field with plow', what is 'हल से'?",
        options: [
          { textHindi: 'करण कारक (Tool/Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak' },
          { textHindi: 'अधिकरण कारक (Place)', textEnglish: 'Adhikaran Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'हल जोतने की क्रिया का मुख्य साधन (tool) है, अतः करण कारक है।',
        explanationEnglish: 'The plow is the instrument of plowing, hence Karan Karak.'
      },
      {
        id: 'qc_k9',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'राम ने रावण को बाण से मारा।' इस वाक्य में 'बाण से' क्या है?",
        questionEnglish: "In 'Ram struck Ravan with an arrow', what is 'बाण से'?",
        options: [
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak' },
          { textHindi: 'कर्ता कारक (Subject)', textEnglish: 'Karta Karak' },
          { textHindi: 'सम्प्रदान कारक (Recipient)', textEnglish: 'Sampradan Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'मारने की क्रिया का माध्यम/साधन बाण है, इसलिए करण कारक है।',
        explanationEnglish: 'Arrow was the tool/weapon used, denoting Karan Karak.'
      },
      {
        id: 'qc_k10',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'छत से बिल्ली कूद पड़ी।' में 'छत से' कौन सा कारक है?",
        questionEnglish: "In 'Cat jumped from the roof', what is 'छत से'?",
        options: [
          { textHindi: 'अपादान कारक (Separation/Detachment)', textEnglish: 'Apadan Karak' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'अधिकरण कारक (Location)', textEnglish: 'Adhikaran Karak' },
          { textHindi: 'सम्बन्ध कारक (Relation)', textEnglish: 'Sambandh Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'छत से बिल्ली का अलगाव (detachment) हो रहा है, अतः अपादान कारक है।',
        explanationEnglish: 'Separation from the rooftop indicates Apadan Karak.'
      }
    ]
  },
  {
    id: 'vakya',
    slug: 'vakya-bhed',
    titleHindi: 'वाक्य भेद (Vakya-Bhed Sorter)',
    titleEnglish: 'Sentence Structure Train Coupler',
    subtitleHindi: 'सरल, संयुक्त एवं मिश्र वाक्यों का संयोजन व रूपांतरण',
    subtitleEnglish: 'Visual coupling of simple, compound & complex clauses',
    iconName: 'Train',
    bottleneckHindi: 'सरल से संयुक्त या मिश्र बनाते समय योजक (कंजंक्शन) कहाँ लगाना है और आश्रित उपवाक्य कैसे पहचानना है, इसमें संशय होता है।',
    bottleneckEnglish: 'Students struggle with where conjunctions attach and identifying dependent clauses in complex sentences.',
    interactionNameHindi: 'ट्रेन कपलर (Train Coupler Sorter)',
    interactionNameEnglish: 'Train Coupler Interface',
    whatStudentGainsHindi: 'उपवाक्यों के जुड़ने की वास्तविक संरचना समझ में आती है।',
    whatStudentGainsEnglish: 'A physical mental model of how independent & dependent clauses connect.',
    paramparaCorner: {
      definitionHindi: 'रचना की दृष्टि से वाक्य के तीन भेद होते हैं: सरल (एक उद्देश्य, एक विधेय), संयुक्त (स्वतंत्र उपवाक्य + योजक), मिश्र (मुख्य उपवाक्य + आश्रित उपवाक्य)।',
      definitionEnglish: 'By structure, Hindi sentences have 3 types: Simple, Compound, and Complex.',
      classicalShlokaOrRule: 'साध्यैकार्थो भवेत्सरलः, सयुक्तो योजकैर्युतः। मिश्रस्तु स्वाश्रितैर्युक्तो वाक्यभेदस्त्रिधोच्यते॥',
      heritageContext: 'अर्थ और रचना के आधार पर वाक्यों का वर्गीकरण भारतीय व्याकरण चिंतन की वैज्ञानिक परंपरा है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'संयुक्त वाक्य: और, एवं, तथा, या, अथवा, इसलिए, किंतु, परंतु से दो स्वतंत्र वाक्य जुड़ते हैं।',
        ruleEnglish: 'Compound sentence: Joins two independent complete clauses using coordinating conjunctions.',
        exampleHindi: 'सूर्य निकला और पक्षी चहचहाने लगे।',
        exampleEnglish: 'The sun rose and birds began to chirp.'
      },
      {
        ruleHindi: 'मिश्र वाक्य: कि, जो-वह, जैसा-वैसा, यदि-तो, क्योंकि से एक प्रधान व एक आश्रित उपवाक्य जुड़ते हैं।',
        ruleEnglish: 'Complex sentence: Consists of one principal clause and one or more subordinate dependent clauses.',
        exampleHindi: 'अध्यापक ने कहा कि कल विद्यालय में अवकाश रहेगा।',
        exampleEnglish: 'The teacher said that tomorrow will be a school holiday.'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_v1',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'सूर्योदय हुआ और पक्षी चहचहाने लगे।' यह किस प्रकार का वाक्य है?",
        questionEnglish: "'The sun rose and birds began to chirp.' What type of sentence is this?",
        options: [
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound sentence' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple sentence' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex sentence' },
          { textHindi: 'संदेहवाचक वाक्य (Dubitative)', textEnglish: 'Dubitative sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "'सूर्योदय हुआ' और 'पक्षी चहचहाने लगे' दो स्वतंत्र उपवाक्य समानाधिकरण योजक 'और' से जुड़े हैं, अतः यह संयुक्त वाक्य है।",
        explanationEnglish: "Two independent clauses are joined by coordinating conjunction 'और', making it a compound sentence."
      },
      {
        id: 'qc_v2',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'जो परिश्रमी होते हैं, वे सदा सफल होते हैं।' यह किस प्रकार का वाक्य है?",
        questionEnglish: "'Those who are hardworking always succeed.' What type of sentence is this?",
        options: [
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex sentence' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple sentence' },
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound sentence' },
          { textHindi: 'इच्छावाचक वाक्य (Optative)', textEnglish: 'Optative sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "इसमें 'जो परिश्रमी होते हैं' आश्रित उपवाक्य है और 'वे सदा सफल होते हैं' मुख्य उपवाक्य है, अतः यह मिश्र वाक्य है।",
        explanationEnglish: "Contains a dependent relative clause joined to a main clause with 'जो...वे'."
      },
      {
        id: 'qc_v3',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'घंटी बजते ही सब छात्र कक्षा में चले गए।' यह कौन सा वाक्य है?",
        questionEnglish: "'As soon as the bell rang, all students went into the classroom.' What type of sentence is this?",
        options: [
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple sentence' },
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound sentence' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex sentence' },
          { textHindi: 'आज्ञावाचक वाक्य (Imperative)', textEnglish: 'Imperative sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "इस वाक्य में एक ही उद्देश्य (सब छात्र) और एक ही मुख्य समापिका क्रिया (चले गए) है। इसमें कोई योजक नहीं है, अतः सरल वाक्य है।",
        explanationEnglish: "Has a single subject and finite predicate without connectors, making it a simple sentence."
      },
      {
        id: 'qc_v4',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'वह बाजार गया ताकि फल खरीद सके।' को सरल वाक्य में बदलिए:",
        questionEnglish: "Convert 'He went to the market so that he could buy fruits' into a simple sentence:",
        options: [
          { textHindi: 'वह फल खरीदने के लिए बाजार गया।', textEnglish: 'He went to market to buy fruits.' },
          { textHindi: 'वह बाजार गया और उसने फल खरीदे।', textEnglish: 'He went to market and bought fruits.' },
          { textHindi: 'जब वह बाजार गया तब फल खरीदा।', textEnglish: 'When he went to market he bought fruits.' },
          { textHindi: 'क्योंकि वह बाजार गया इसलिए फल मिला।', textEnglish: 'Because he went to market so he got fruits.' }
        ],
        correctIndex: 0,
        explanationHindi: "सरल वाक्य में दोनों क्रियाओं को एक समापिका क्रिया में समेटा जाता है: 'फल खरीदने के लिए बाजार गया'।",
        explanationEnglish: "Converts the purpose clause into an infinitive phrase with single finite verb."
      },
      {
        id: 'qc_v5',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'यद्यपि वह निर्धन है, तथापि ईमानदार है।' इसे संयुक्त वाक्य में कैसे लिखेंगे?",
        questionEnglish: "Convert 'Although he is poor, yet he is honest' into compound sentence:",
        options: [
          { textHindi: 'वह निर्धन है किंतु ईमानदार है।', textEnglish: 'He is poor but honest.' },
          { textHindi: 'वह निर्धन होकर भी ईमानदार है।', textEnglish: 'Despite being poor he is honest.' },
          { textHindi: 'जब वह निर्धन हुआ तब ईमानदार बना।', textEnglish: 'When he became poor then became honest.' },
          { textHindi: 'निर्धनता के कारण वह ईमानदार है।', textEnglish: 'Due to poverty he is honest.' }
        ],
        correctIndex: 0,
        explanationHindi: "'किंतु / परंतु' विरोधदर्शक समानाधिकरण योजक जोड़कर संयुक्त वाक्य बनता है: 'वह निर्धन है किंतु ईमानदार है'।",
        explanationEnglish: "Uses the coordinator 'किंतु' (but) to unite two independent clauses."
      },
      {
        id: 'qc_v6',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'अध्यापक ने कहा कि कल विद्यालय बंद रहेगा।' रेखांकित उपवाक्य 'कल विद्यालय बंद रहेगा' का भेद क्या है?",
        questionEnglish: "What type of dependent clause is 'कल विद्यालय बंद रहेगा'?",
        options: [
          { textHindi: 'संज्ञा आश्रित उपवाक्य (Noun clause)', textEnglish: 'Noun dependent clause' },
          { textHindi: 'विशेषण उपवाक्य (Adjective clause)', textEnglish: 'Adjective clause' },
          { textHindi: 'क्रियाविशेषण उपवाक्य (Adverb clause)', textEnglish: 'Adverb clause' },
          { textHindi: 'मुख्य उपवाक्य (Principal clause)', textEnglish: 'Principal clause' }
        ],
        correctIndex: 0,
        explanationHindi: "'कि' से जुड़ने वाले उपवाक्य जो मुख्य क्रिया का कर्म बनते हैं, 'संज्ञा आश्रित उपवाक्य' कहलाते हैं।",
        explanationEnglish: "Clauses starting with 'कि' acting as the direct object of speech verbs are noun clauses."
      },
      {
        id: 'qc_v7',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "मिश्र वाक्य की सही पहचान क्या है?",
        questionEnglish: "What is the defining characteristic of a complex sentence?",
        options: [
          { textHindi: 'एक प्रधान उपवाक्य और एक या अधिक आश्रित उपवाक्य', textEnglish: 'One principal clause and one or more dependent clauses' },
          { textHindi: 'केवल दो स्वतंत्र उपवाक्य', textEnglish: 'Only two independent clauses' },
          { textHindi: 'केवल एक उद्देश्य और एक विधेय', textEnglish: 'Single subject and single predicate' },
          { textHindi: 'बिना किसी क्रिया का वाक्य', textEnglish: 'A sentence without verbs' }
        ],
        correctIndex: 0,
        explanationHindi: "मिश्र वाक्य में एक मुख्य (प्रधान) उपवाक्य होता है और शेष उपवाक्य उस पर आश्रित होते हैं।",
        explanationEnglish: "A complex sentence consists of a principal clause and dependent subordinate clauses."
      },
      {
        id: 'qc_v8',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'राघव बीमार था, इसलिए विद्यालय नहीं आ सका।' यह कौन सा वाक्य है?",
        questionEnglish: "'Raghav was sick, therefore he could not come to school.' Identify sentence type:",
        options: [
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound sentence' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple sentence' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex sentence' },
          { textHindi: 'प्रश्नवाचक वाक्य (Interrogative)', textEnglish: 'Interrogative sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "'इसलिए' परिणामबोधक समानाधिकरण योजक है जो दो स्वतंत्र वाक्यों को जोड़ता है।",
        explanationEnglish: "'इसलिए' (therefore) is a coordinating conjunction forming a compound sentence."
      },
      {
        id: 'qc_v9',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'वही घड़ी मिल गई, जो कल खो गई थी।' इसमें 'जो कल खो गई थी' किस प्रकार का उपवाक्य है?",
        questionEnglish: "In 'The watch that was lost yesterday was found', what clause is 'जो कल खो गई थी'?",
        options: [
          { textHindi: 'विशेषण आश्रित उपवाक्य (Adjective clause)', textEnglish: 'Adjective dependent clause' },
          { textHindi: 'संज्ञा उपवाक्य (Noun clause)', textEnglish: 'Noun clause' },
          { textHindi: 'क्रियाविशेषण उपवाक्य (Adverb clause)', textEnglish: 'Adverb clause' },
          { textHindi: 'समानाधिकरण उपवाक्य (Coordinated clause)', textEnglish: 'Coordinated clause' }
        ],
        correctIndex: 0,
        explanationHindi: "जो उपवाक्य मुख्य उपवाक्य की किसी संज्ञा (घड़ी) की विशेषता बताता है, वह विशेषण उपवाक्य होता है।",
        explanationEnglish: "Subordinate clause qualifying a noun in the main clause is an adjective clause."
      },
      {
        id: 'qc_v10',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य रूपांतरण',
        topicNameEnglish: 'Sentence Transformation',
        questionHindi: "'सूर्यास्त के समय लालिमा छा गई।' का मिश्र वाक्य में रूपांतरण क्या होगा?",
        questionEnglish: "Convert 'At sunset redness spread across the sky' into complex sentence:",
        options: [
          { textHindi: 'जब सूर्यास्त हुआ, तब लालिमा छा गई।', textEnglish: 'When sunset occurred, redness spread.' },
          { textHindi: 'सूर्यास्त हुआ और लालिमा छा गई।', textEnglish: 'Sunset occurred and redness spread.' },
          { textHindi: 'सूर्यास्त होते ही लालिमा छाने लगी।', textEnglish: 'As soon as sunset happened, redness spread.' },
          { textHindi: 'लालिमा छाने के लिए सूर्यास्त हुआ।', textEnglish: 'Sunset happened for redness to spread.' }
        ],
        correctIndex: 0,
        explanationHindi: "'जब...तब' का प्रयोग कालवाचक क्रियाविशेषण आश्रित उपवाक्य बनाकर मिश्र वाक्य रचता है।",
        explanationEnglish: "'जब...तब' creates a time-based adverbial clause yielding a complex sentence."
      }
    ]
  },
  {
    id: 'vachya',
    slug: 'vachya-spotlight',
    titleHindi: 'वाच्य (Vachya Spotlight)',
    titleEnglish: 'Voice Spotlight Stage',
    subtitleHindi: 'कर्तृवाच्य, कर्मवाच्य और भाववाच्य का केंद्र बिंदु',
    subtitleEnglish: 'Active, Passive & Impersonal voice spotlight shifting',
    iconName: 'Sun',
    bottleneckHindi: 'कर्तृवाच्य से कर्मवाच्य बदलते समय छात्र भूल जाते हैं कि केंद्र कर्ता से हटकर कर्म पर आ जाता है और क्रिया कर्म के अनुसार बदलती है।',
    bottleneckEnglish: 'Students forget that moving active to passive shifts verb agreement to the object.',
    interactionNameHindi: 'स्टेज स्पॉटलाइट (Spotlight Shifter)',
    interactionNameEnglish: 'Stage Spotlight Interface',
    whatStudentGainsHindi: 'स्पॉटलाइट घुमाने पर क्रिया का रूप अपने आप बदलने का कारण समझ में आता है।',
    whatStudentGainsEnglish: 'Understand why the verb changes when focus shifts, rather than memorizing a formula.',
    paramparaCorner: {
      definitionHindi: 'क्रिया के जिस रूप से यह ज्ञात हो कि वाक्य में क्रिया का मुख्य विषय कर्ता है, कर्म है या भाव, उसे वाच्य कहते हैं।',
      definitionEnglish: 'The grammatical voice indicating whether the predicate primarily highlights the subject, object, or feeling/state.',
      classicalShlokaOrRule: 'कर्तरि कर्मणि भावे च त्रिधा वाच्यमुदीरितम्।',
      heritageContext: 'संस्कृत से हिंदी तक वाच्य का संबंध वक्ता के दृष्टिकोण और वाक्य में प्रभाव के केंद्र से है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'कर्तृवाच्य: क्रिया का लिंग और वचन कर्ता के अनुसार होता है। (राम सेब खाता है)',
        ruleEnglish: 'Active Voice: Verb agrees with subject in gender and number. (Ram eats an apple)',
        exampleHindi: 'लड़की गीत गाती है।',
        exampleEnglish: 'The girl sings a song.'
      },
      {
        ruleHindi: "कर्मवाच्य: कर्ता के साथ 'से' या 'के द्वारा' लगता है, क्रिया कर्म के अनुसार होती है। (राम के द्वारा सेब खाया जाता है)",
        ruleEnglish: "Passive Voice: Adds 'के द्वारा' to subject, verb agrees with object. (Apple is eaten by Ram)",
        exampleHindi: 'लड़की के द्वारा गीत गाया जाता है।',
        exampleEnglish: 'The song is sung by the girl.'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_vc1',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'अमित द्वारा पत्र लिखा जाता है।' यह वाक्य किस वाच्य का उदाहरण है?",
        questionEnglish: "'Letter is written by Amit.' Which voice is this?",
        options: [
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive voice' },
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active voice' },
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal voice' },
          { textHindi: 'मिश्र वाच्य', textEnglish: 'Mixed voice' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्ता के साथ 'द्वारा' लगा है और क्रिया 'लिखा जाता है' कर्म (पत्र) के लिंग-वचन के अनुसार है, अतः यह कर्मवाच्य है।",
        explanationEnglish: "Subject is accompanied by 'द्वारा' and the transitive verb agrees with object (पत्र)."
      },
      {
        id: 'qc_vc2',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'दादी जी से अब तेज चला नहीं जाता।' यह वाक्य किस वाच्य का उदाहरण है?",
        questionEnglish: "'Grandmother cannot walk fast now.' Which voice is this?",
        options: [
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal voice' },
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active voice' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive voice' },
          { textHindi: 'क्रियावाच्य', textEnglish: 'Action voice' }
        ],
        correctIndex: 0,
        explanationHindi: "अकर्मक क्रिया (चलना) में असमर्थता का भाव प्रधान है और क्रिया एकवचन पुल्लिंग में है, अतः यह भाववाच्य है।",
        explanationEnglish: "Intransitive verb expressing inability with neutral 3rd person singular verb is Bhavavachya."
      },
      {
        id: 'qc_vc3',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'माली ने सुंदर पौधे लगाए।' को कर्मवाच्य में बदलिए:",
        questionEnglish: "Convert 'Gardener planted beautiful plants' to Passive Voice:",
        options: [
          { textHindi: 'माली द्वारा सुंदर पौधे लगाए गए।', textEnglish: 'Beautiful plants were planted by the gardener.' },
          { textHindi: 'माली से पौधे नहीं लगाए जाते।', textEnglish: 'Plants cannot be planted by gardener.' },
          { textHindi: 'माली पौधे लगा रहा है।', textEnglish: 'Gardener is planting plants.' },
          { textHindi: 'माली सुंदर पौधों को लगाएगा।', textEnglish: 'Gardener will plant beautiful plants.' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्ता 'माली' के साथ 'द्वारा' जोड़कर क्रिया भूतकाल में 'लगाए गए' (पुल्लिंग बहुवचन) कर्म के अनुरूप बनेगी।",
        explanationEnglish: "Add 'द्वारा' to agent, align verb tense and agreement with plural object 'पौधे'."
      },
      {
        id: 'qc_vc4',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'पक्षी आकाश में उड़ते हैं।' यह कौन सा वाच्य है?",
        questionEnglish: "'Birds fly in the sky.' Which voice is this?",
        options: [
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active voice' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive voice' },
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal voice' },
          { textHindi: 'इनमें से कोई नहीं', textEnglish: 'None of these' }
        ],
        correctIndex: 0,
        explanationHindi: "क्रिया 'उड़ते हैं' सीधे कर्ता 'पक्षी' के अनुसार बहुवचन में प्रयुक्त हुई है, इसलिए यह कर्तृवाच्य है।",
        explanationEnglish: "Verb 'उड़ते हैं' directly agrees with subject 'पक्षी' without any agent marker."
      },
      {
        id: 'qc_vc5',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'बच्चा रात भर रोता रहा।' का भाववाच्य क्या होगा?",
        questionEnglish: "Convert 'Child kept crying all night' to Bhavavachya:",
        options: [
          { textHindi: 'बच्चे से रात भर रोया गया।', textEnglish: 'Crying was done by the child all night.' },
          { textHindi: 'बच्चे द्वारा रोना किया गया।', textEnglish: 'Crying was executed by child.' },
          { textHindi: 'बच्चा रोता ही रहेगा।', textEnglish: 'Child will keep crying.' },
          { textHindi: 'रात भर रोने का काम हुआ।', textEnglish: 'Action of crying occurred.' }
        ],
        correctIndex: 0,
        explanationHindi: "अकर्मक क्रिया 'रोना' का भाववाच्य रूप 'बच्चे से रात भर रोया गया' बनता है।",
        explanationEnglish: "Intransitive verb 'रोना' takes oblique agent + 'से' + past neutral singular verb 'रोया गया'."
      },
      {
        id: 'qc_vc6',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "कर्मवाच्य केवल किन क्रियाओं का बन सकता है?",
        questionEnglish: "Passive voice can only be formed with which verbs?",
        options: [
          { textHindi: 'सकर्मक क्रिया (Transitive verbs)', textEnglish: 'Transitive verbs' },
          { textHindi: 'अकर्मक क्रिया (Intransitive verbs)', textEnglish: 'Intransitive verbs' },
          { textHindi: 'केवल प्रेरणार्थक क्रिया', textEnglish: 'Only causative verbs' },
          { textHindi: 'किसी भी क्रिया का', textEnglish: 'Any verb' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्मवाच्य के लिए वाक्य में 'कर्म' (Object) का होना अनिवार्य है, अतः यह केवल सकर्मक क्रियाओं का ही बनता है।",
        explanationEnglish: "Passive voice requires an object (कर्म), so it can strictly be formed with transitive verbs."
      },
      {
        id: 'qc_vc7',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "भाववाच्य में क्रिया सदैव किस रूप में रहती है?",
        questionEnglish: "In Bhavavachya, in what form does the verb always appear?",
        options: [
          { textHindi: 'अन्य पुरुष, पुल्लिंग, एकवचन', textEnglish: 'Third person, masculine, singular' },
          { textHindi: 'उत्तम पुरुष, स्त्रीलिंग, बहुवचन', textEnglish: 'First person, feminine, plural' },
          { textHindi: 'मध्यम पुरुष, पुल्लिंग, बहुवचन', textEnglish: 'Second person, masculine, plural' },
          { textHindi: 'कर्ता के लिंग और वचन के अनुसार', textEnglish: 'According to subject gender and number' }
        ],
        correctIndex: 0,
        explanationHindi: "भाववाच्य की क्रिया सदा अन्य पुरुष, पुल्लिंग तथा एकवचन में ही प्रयुक्त होती है।",
        explanationEnglish: "In Bhavavachya the verb is invariably fixed in 3rd person masculine singular."
      },
      {
        id: 'qc_vc8',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'कवि ने सुंदर कविता सुनाई।' का कर्मवाच्य रूप क्या होगा?",
        questionEnglish: "Convert 'Poet recited a beautiful poem' to passive voice:",
        options: [
          { textHindi: 'कवि द्वारा सुंदर कविता सुनाई गई।', textEnglish: 'Beautiful poem was recited by the poet.' },
          { textHindi: 'कवि से कविता सुनाना हुआ।', textEnglish: 'Recitation happened from poet.' },
          { textHindi: 'कविता कवि को सुनाई जाती है।', textEnglish: 'Poem is recited to poet.' },
          { textHindi: 'कवि सुंदर कविता सुनाता है।', textEnglish: 'Poet recites beautiful poem.' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्म 'कविता' स्त्रीलिंग एकवचन है, इसलिए क्रिया 'सुनाई गई' स्त्रीलिंग एकवचन में बदलेगी।",
        explanationEnglish: "Object 'कविता' is feminine singular, so verb agrees as 'सुनाई गई'."
      },
      {
        id: 'qc_vc9',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'चलो, अब सोया जाए।' यह किस वाच्य का उदाहरण है?",
        questionEnglish: "'Come on, let sleeping be done now.' Which voice is this?",
        options: [
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal voice' },
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active voice' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive voice' },
          { textHindi: 'अकर्मक वाच्य', textEnglish: 'Intransitive voice' }
        ],
        correctIndex: 0,
        explanationHindi: "'सोना' अकर्मक क्रिया है और प्रस्ताव या भाव मुख्य होने के कारण यह भाववाच्य है।",
        explanationEnglish: "Intransitive verb expressing a proposal with no object is Bhavavachya."
      },
      {
        id: 'qc_vc10',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य परिवर्तन',
        topicNameEnglish: 'Voice Transformation',
        questionHindi: "'मजदूरों ने पुल तैयार किया।' इस वाक्य का वाच्य भेद पहचानिए:",
        questionEnglish: "Identify the voice of 'Laborers built the bridge':",
        options: [
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active voice' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive voice' },
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal voice' },
          { textHindi: 'मिश्र वाच्य', textEnglish: 'Mixed voice' }
        ],
        correctIndex: 0,
        explanationHindi: "यद्यपि भूतकाल में 'ने' लगा है, पर कर्ता ही क्रिया का मुख्य केंद्र है, अतः यह कर्तृवाच्य है।",
        explanationEnglish: "Active transitive sentence where agent is the syntactic subject, so Kartrivachya."
      }
    ]
  },
  {
    id: 'kaal',
    slug: 'kaal-dial',
    titleHindi: 'काल (Kaal Dial)',
    titleEnglish: 'Tense Dial Time Machine',
    subtitleHindi: 'धातु (Root) स्थिर रहती है, प्रत्यय व सहायक क्रिया बदलती है',
    subtitleEnglish: 'Watch fixed verb roots stay steady while endings change across time',
    iconName: 'Clock',
    bottleneckHindi: 'हिंदी में काल के अनेक उपभेद हैं और लिंग व वचन के अनुसार क्रिया के रूप बदलते हैं, जिसे रटना कठिन लगता है।',
    bottleneckEnglish: 'Hindi tenses have many sub-types and gender/number variations that overwhelm students.',
    interactionNameHindi: 'काल चक्र डायल (Kaal Dial Wheel)',
    interactionNameEnglish: 'Time Dial Slot Machine',
    whatStudentGainsHindi: 'स्पष्ट दृष्टि कि क्रिया का मूल धातु कौन सा है और समय के अनुसार कौन सा अंत बदल रहा है।',
    whatStudentGainsEnglish: 'See clearly the fixed root vs changing inflectional suffix.',
    paramparaCorner: {
      definitionHindi: 'क्रिया के जिस रूप से उसके होने या करने के समय का बोध हो, उसे काल कहते हैं (भूत, वर्तमान, भविष्यत्)।',
      definitionEnglish: 'The grammatical category expressing time of action relative to moment of speaking.',
      classicalShlokaOrRule: 'कालो हि त्रिगुणो ज्ञेयः - भूतः वर्तमानो भविष्यंश्च।',
      heritageContext: 'समय की अनंत धारा में क्रिया की स्थिति को चिन्हित करना काल रचना का आधार है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'वर्तमान काल: जो समय अभी चल रहा है। (पढ़ता है, पढ़ रहा है, पढ़ा है)',
        ruleEnglish: 'Present Tense: Action taking place in the current moment.',
        exampleHindi: 'पक्षी आकाश में उड़ते हैं।',
        exampleEnglish: 'Birds fly in the sky.'
      },
      {
        ruleHindi: 'भूतकाल: जो समय बीत चुका है। (पढ़ा, पढ़ रहा था, पढ़ चुका था)',
        ruleEnglish: 'Past Tense: Action that has already occurred.',
        exampleHindi: 'कल मूसलाधार बारिश हुई थी।',
        exampleEnglish: 'It rained heavily yesterday.'
      },
      {
        ruleHindi: 'भविष्यत् काल: जो समय आगे आने वाला है। (पढ़ेगा, पढ़ रहा होगा)',
        ruleEnglish: 'Future Tense: Action that will happen later.',
        exampleHindi: 'हम कल ताजमहल देखने जाएँगे।',
        exampleEnglish: 'We will go to visit the Taj Mahal tomorrow.'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_kl1',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'रोहन पुस्तक पढ़ रहा है।' इस वाक्य में कौन सा काल है?",
        questionEnglish: "'Rohan is reading a book.' Which tense aspect is this?",
        options: [
          { textHindi: 'अपूर्ण वर्तमान काल (Present Continuous)', textEnglish: 'Present continuous' },
          { textHindi: 'सामान्य वर्तमान काल (Simple Present)', textEnglish: 'Simple present' },
          { textHindi: 'पूर्ण वर्तमान काल (Present Perfect)', textEnglish: 'Present perfect' },
          { textHindi: 'संदिग्ध वर्तमान काल (Dubitative Present)', textEnglish: 'Dubitative present' }
        ],
        correctIndex: 0,
        explanationHindi: "क्रिया वर्तमान में निरंतर जारी है और समाप्त नहीं हुई है, अतः यह अपूर्ण वर्तमान काल (Present Continuous) है।",
        explanationEnglish: "Action is ongoing in present time and not yet completed, making it continuous/imperfect."
      },
      {
        id: 'qc_kl2',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'यदि वर्षा होती, तो फसल अच्छी होती।' यह वाक्य भूतकाल के किस भेद का है?",
        questionEnglish: "'If it had rained, the harvest would have been good.' Which past tense aspect is this?",
        options: [
          { textHindi: 'हेतुहेतुमद् भूतकाल (Conditional Past)', textEnglish: 'Conditional past' },
          { textHindi: 'संदिग्ध भूतकाल (Dubitative Past)', textEnglish: 'Dubitative past' },
          { textHindi: 'पूर्ण भूतकाल (Past Perfect)', textEnglish: 'Past perfect' },
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past continuous' }
        ],
        correctIndex: 0,
        explanationHindi: "जहाँ भूतकाल की एक क्रिया दूसरी क्रिया के होने पर निर्भर थी किंतु कार्य न हो सका, वहाँ हेतुहेतुमद् भूतकाल होता है।",
        explanationEnglish: "Where one past action was dependent upon another condition that did not happen."
      },
      {
        id: 'qc_kl3',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'गाड़ी अभी-अभी स्टेशन से छूटी है।' यह कौन सा काल है?",
        questionEnglish: "'The train has just left the station.' Which tense aspect is this?",
        options: [
          { textHindi: 'आसन्न भूतकाल (Recent Past / Present Perfect)', textEnglish: 'Recent past' },
          { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple past' },
          { textHindi: 'पूर्ण भूतकाल (Past Perfect)', textEnglish: 'Past perfect' },
          { textHindi: 'सामान्य वर्तमान काल (Simple Present)', textEnglish: 'Simple present' }
        ],
        correctIndex: 0,
        explanationHindi: "क्रिया अभी कुछ क्षण पूर्व ही समाप्त हुई है, अतः यह 'आसन्न भूतकाल' (Recent Past) का उदाहरण है।",
        explanationEnglish: "Action concluded just moments ago in the immediate past."
      },
      {
        id: 'qc_kl4',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'पिताजी दफ्तर पहुँच चुके होंगे।' इसमें क्रिया किस काल की है?",
        questionEnglish: "'Father must have reached office.' Which tense is this?",
        options: [
          { textHindi: 'संदिग्ध भूतकाल (Dubitative Past)', textEnglish: 'Dubitative past' },
          { textHindi: 'सामान्य भविष्यत् (Simple Future)', textEnglish: 'Simple future' },
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past continuous' },
          { textHindi: 'पूर्ण वर्तमान काल (Present Perfect)', textEnglish: 'Present perfect' }
        ],
        correctIndex: 0,
        explanationHindi: "भूतकाल में कार्य पूरा होने में संदेह प्रकट किया गया है, अतः यह 'संदिग्ध भूतकाल' है।",
        explanationEnglish: "Expresses uncertainty or presumption about a past completed event."
      },
      {
        id: 'qc_kl5',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'शायद कल हम चिड़ियाघर जाएँगे।' यह वाक्य किस काल का है?",
        questionEnglish: "'Perhaps tomorrow we will go to the zoo.' Identify the tense:",
        options: [
          { textHindi: 'संभाव्य भविष्यत् काल (Probable Future)', textEnglish: 'Probable future' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple future' },
          { textHindi: 'हेतुहेतुमद् भविष्यत् काल (Conditional Future)', textEnglish: 'Conditional future' },
          { textHindi: 'संदिग्ध वर्तमान काल', textEnglish: 'Dubitative present' }
        ],
        correctIndex: 0,
        explanationHindi: "'शायद' शब्द भविष्य में कार्य होने की संभावना व्यक्त करता है, अतः यह 'संभाव्य भविष्यत्' है।",
        explanationEnglish: "'शायद' indicates possibility or probability in future time."
      },
      {
        id: 'qc_kl6',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'मोहन मैदान में खेलता था।' यह वाक्य किस काल का है?",
        questionEnglish: "'Mohan used to play in the field.' Which tense aspect is this?",
        options: [
          { textHindi: 'पूर्ण भूतकाल (Past Perfect / Habitual Past)', textEnglish: 'Habitual / perfect past' },
          { textHindi: 'सामान्य वर्तमान काल (Simple Present)', textEnglish: 'Simple present' },
          { textHindi: 'अपूर्ण वर्तमान काल (Present Continuous)', textEnglish: 'Present continuous' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple future' }
        ],
        correctIndex: 0,
        explanationHindi: "भूतकाल में क्रिया समाप्त हो चुकी थी और बीते समय की आदत का बोध कराती है।",
        explanationEnglish: "Denotes completed or habitual action in the past."
      },
      {
        id: 'qc_kl7',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'सूर्य पूर्व से निकलता है।' यह वाक्य किस काल का है?",
        questionEnglish: "'The sun rises in the east.' Which tense is this?",
        options: [
          { textHindi: 'सामान्य वर्तमान काल (Universal Simple Present)', textEnglish: 'Simple present' },
          { textHindi: 'पूर्ण वर्तमान काल (Present Perfect)', textEnglish: 'Present perfect' },
          { textHindi: 'आसन्न भूतकाल (Recent Past)', textEnglish: 'Recent past' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple future' }
        ],
        correctIndex: 0,
        explanationHindi: "सदा सत्य (शाश्वत सत्य) रहने वाली बातें 'सामान्य वर्तमान काल' में व्यक्त की जाती हैं।",
        explanationEnglish: "Universal truths are expressed in simple present tense."
      },
      {
        id: 'qc_kl8',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'हम कल नई दिल्ली जाएँगे।' यह वाक्य किस काल का है?",
        questionEnglish: "'We will go to New Delhi tomorrow.' What tense is this?",
        options: [
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple future' },
          { textHindi: 'संभाव्य भविष्यत् काल (Probable Future)', textEnglish: 'Probable future' },
          { textHindi: 'सामान्य वर्तमान काल (Simple Present)', textEnglish: 'Simple present' },
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past continuous' }
        ],
        correctIndex: 0,
        explanationHindi: "आने वाले समय में कार्य के सामान्य रूप से होने का संकेत है, अतः यह सामान्य भविष्यत् काल है।",
        explanationEnglish: "Denotes standard future occurrence without conditions."
      },
      {
        id: 'qc_kl9',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'अध्यापिका पढ़ा रही थीं।' यह कौन सा काल है?",
        questionEnglish: "'The teacher was teaching.' Which tense is this?",
        options: [
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past continuous' },
          { textHindi: 'पूर्ण भूतकाल (Past Perfect)', textEnglish: 'Past perfect' },
          { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple past' },
          { textHindi: 'आसन्न भूतकाल (Recent Past)', textEnglish: 'Recent past' }
        ],
        correctIndex: 0,
        explanationHindi: "भूतकाल में क्रिया प्रारंभ होकर उस समय जारी थी, समाप्त नहीं हुई थी, अतः अपूर्ण भूतकाल है।",
        explanationEnglish: "Action was in progress in the past, hence past continuous (Apoorna Bhootkal)."
      },
      {
        id: 'qc_kl10',
        topicId: 'kaal',
        topicNameHindi: 'काल एवं भेद',
        topicNameEnglish: 'Tense & Aspects',
        questionHindi: "'तुम मेहनत करोगे तो अवश्य सफल होओगे।' यह वाक्य किस काल का है?",
        questionEnglish: "'If you work hard you will certainly succeed.' Which tense is this?",
        options: [
          { textHindi: 'हेतुहेतुमद् भविष्यत् काल (Conditional Future)', textEnglish: 'Conditional future' },
          { textHindi: 'संभाव्य भविष्यत् काल (Probable Future)', textEnglish: 'Probable future' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple future' },
          { textHindi: 'सामान्य वर्तमान काल (Simple Present)', textEnglish: 'Simple present' }
        ],
        correctIndex: 0,
        explanationHindi: "भविष्य की एक क्रिया का होना दूसरी भावी क्रिया पर निर्भर है, अतः यह हेतुहेतुमद् भविष्यत् है।",
        explanationEnglish: "One future outcome depends on another future prerequisite."
      }
    ]
  },
  {
    id: 'muhavare',
    slug: 'muhavare-decoder',
    titleHindi: 'मुहावरे (Muhavare Decoder)',
    titleEnglish: 'Idiom Literal-vs-Metaphor Decoder',
    subtitleHindi: 'शाब्दिक हास्यास्पद चित्र बनाम लाक्षणिक वास्तविक अर्थ',
    subtitleEnglish: 'From absurd literal cartoon to memorable real meaning flip',
    iconName: 'Sparkles',
    bottleneckHindi: 'मुहावरों का शाब्दिक अर्थ और वास्तविक भाव भिन्न होते हैं, विद्यार्थी केवल सूची रटते हैं और परीक्षा में भूल जाते हैं।',
    bottleneckEnglish: 'Idioms make no literal sense, so students rote learn and forget them during exams.',
    interactionNameHindi: 'लाक्षणिक डिकोडर (Metaphor Decoder Switch)',
    interactionNameEnglish: 'Literal-to-Metaphor Flip Switch',
    whatStudentGainsHindi: 'चित्र और हास्य के माध्यम से स्थायी स्मृति, जिससे रटना न पड़े।',
    whatStudentGainsEnglish: 'Unforgettable retention through imagery and humor.',
    paramparaCorner: {
      definitionHindi: 'ऐसा वाक्यांश जो अपने सामान्य शाब्दिक अर्थ को छोड़कर किसी विशेष या लाक्षणिक अर्थ को प्रकट करे, उसे मुहावरा कहते हैं।',
      definitionEnglish: 'A set phrase whose figurative meaning is completely different from its literal word-by-word meaning.',
      classicalShlokaOrRule: 'लक्षणा शक्ति मूलकं वाक्यं मुहावरा इत्युच्यते।',
      heritageContext: 'हिंदी भाषा के मुहावरे लोकजीवन और सांस्कृतिक अनुभवों की सजीव धरोहर हैं।'
    },
    rulesSummary: [
      {
        ruleHindi: "मुहावरे हमेशा लाक्षणिक अर्थ देते हैं; इनका शब्दशः अनुवाद नहीं किया जाता।",
        ruleEnglish: 'Idioms are figurative; translating them literally distorts their true meaning.',
        exampleHindi: "आसमान सिर पर उठाना = बहुत अधिक शोर मचाना। (सिर पर आसमान नहीं उठाया जाता)",
        exampleEnglish: "Lifting sky on head = making a tremendous fuss/noise."
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_m1',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'अंगूठा दिखाना' मुहावरे का सही अर्थ क्या है?",
        questionEnglish: "What is the correct meaning of idiom 'अंगूठा दिखाना'?",
        options: [
          { textHindi: 'साफ मना कर देना (Refuse outright)', textEnglish: 'Refuse outright' },
          { textHindi: 'प्रशंसा करना (Praise)', textEnglish: 'Praise someone' },
          { textHindi: 'सहयोग देना (Cooperate)', textEnglish: 'Give cooperation' },
          { textHindi: 'चिढ़ाना (Tease)', textEnglish: 'Tease' }
        ],
        correctIndex: 0,
        explanationHindi: "'अंगूठा दिखाना' का अर्थ ऐन वक्त पर किसी काम के लिए साफ मना कर देना है।",
        explanationEnglish: "'अंगूठा दिखाना' means to refuse point-blank when help was needed."
      },
      {
        id: 'qc_m2',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'आँखों का तारा होना' का क्या अर्थ है?",
        questionEnglish: "What does 'आँखों का तारा होना' mean?",
        options: [
          { textHindi: 'अत्यधिक प्रिय होना (Very dearly loved)', textEnglish: 'Very dearly loved' },
          { textHindi: 'दूर की बात सोचना (Farsighted)', textEnglish: 'Farsighted' },
          { textHindi: 'आँखों की रोशनी बढ़ना (Sharp eyesight)', textEnglish: 'Sharp eyesight' },
          { textHindi: 'रात में जागना (Staying awake)', textEnglish: 'Staying awake' }
        ],
        correctIndex: 0,
        explanationHindi: "'आँखों का तारा होना' का अर्थ है किसी का बहुत प्यारा या दुलारा होना। जैसे: श्रवण कुमार माता-पिता की आँखों का तारा था।",
        explanationEnglish: "Means the apple of someone's eye / deeply cherished."
      },
      {
        id: 'qc_m3',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'ईद का चाँद होना' मुहावरे का सही अर्थ क्या है?",
        questionEnglish: "What is the meaning of 'ईद का चाँद होना'?",
        options: [
          { textHindi: 'बहुत दिनों बाद दिखाई देना (Rarely seen)', textEnglish: 'Rarely seen after long time' },
          { textHindi: 'त्योहार मनाना (Celebrate festival)', textEnglish: 'Celebrate festival' },
          { textHindi: 'सुंदर दिखना (Look beautiful)', textEnglish: 'Look beautiful' },
          { textHindi: 'गले मिलना (Embrace)', textEnglish: 'Embrace' }
        ],
        correctIndex: 0,
        explanationHindi: "'ईद का चाँद होना' का अर्थ है किसी का बहुत दिनों बाद सामने आना।",
        explanationEnglish: "Refers to someone rarely visible, like the new crescent moon of Eid."
      },
      {
        id: 'qc_m4',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'नौ दो ग्यारह होना' का सही अर्थ क्या है?",
        questionEnglish: "What is the meaning of 'नौ दो ग्यारह होना'?",
        options: [
          { textHindi: 'भाग जाना (Flee / Run away)', textEnglish: 'Run away / Flee' },
          { textHindi: 'गणित हल करना (Solve math)', textEnglish: 'Solve math problem' },
          { textHindi: 'मिलकर काम करना (Work together)', textEnglish: 'Work together' },
          { textHindi: 'हार मान लेना (Surrender)', textEnglish: 'Surrender' }
        ],
        correctIndex: 0,
        explanationHindi: "पुलिस को देखते ही चोर नौ दो ग्यारह हो गए, अर्थात् भाग खड़े हुए।",
        explanationEnglish: "Idiom meaning to run away swiftly to escape."
      },
      {
        id: 'qc_m5',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'अपने पाँव पर कुल्हाड़ी मारना' का क्या अर्थ है?",
        questionEnglish: "What does 'अपने पाँव पर कुल्हाड़ी मारना' mean?",
        options: [
          { textHindi: 'स्वयं अपना नुकसान करना (Harm oneself)', textEnglish: 'Harm one self / inflict self harm' },
          { textHindi: 'पेड़ काटना (Chop tree)', textEnglish: 'Chop a tree' },
          { textHindi: 'चोट खाना (Get injured)', textEnglish: 'Accidental injury' },
          { textHindi: 'कठिन परिश्रम करना (Work hard)', textEnglish: 'Work very hard' }
        ],
        correctIndex: 0,
        explanationHindi: "बिना सोचे-समझे गलत निर्णय लेकर स्वयं अपनी ही हानि कर बैठना।",
        explanationEnglish: "To bring deliberate or reckless ruin onto oneself."
      },
      {
        id: 'qc_m6',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'दाँतों तले उँगली दबाना' मुहावरे का सही भाव क्या है?",
        questionEnglish: "What is the meaning of 'दाँतों तले उँगली दबाना'?",
        options: [
          { textHindi: 'आश्चर्यचकित होना (Be astonished)', textEnglish: 'Be astonished / amazed' },
          { textHindi: 'दाँत में दर्द होना (Toothache)', textEnglish: 'Toothache' },
          { textHindi: 'भूख लगना (Feel hungry)', textEnglish: 'Feel hungry' },
          { textHindi: 'गुस्सा दबाना (Suppress anger)', textEnglish: 'Suppress anger' }
        ],
        correctIndex: 0,
        explanationHindi: "जादूगर के हैरतअंगेज कारनामे देखकर दर्शक दाँतों तले उँगली दबाने लगे (अत्यंत चकित हो गए)।",
        explanationEnglish: "To be overcome with utter astonishment or wonder."
      },
      {
        id: 'qc_m7',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'कान भरना' मुहावरे का क्या अर्थ है?",
        questionEnglish: "What is the meaning of 'कान भरना'?",
        options: [
          { textHindi: 'पीठ पीछे चुगली करना (Backbite / Poison ears)', textEnglish: 'Backbite / poison ears' },
          { textHindi: 'कान साफ़ करना (Clean ears)', textEnglish: 'Clean ears' },
          { textHindi: 'जोर से बोलना (Speak loudly)', textEnglish: 'Speak loudly' },
          { textHindi: 'ध्यान से सुनना (Listen carefully)', textEnglish: 'Listen carefully' }
        ],
        correctIndex: 0,
        explanationHindi: "'कान भरना' का अर्थ किसी के विरुद्ध किसी के मन में गलत बातें भरकर भड़काना (चुगली करना) है।",
        explanationEnglish: "To poison someone's mind with sly gossip and backbiting."
      },
      {
        id: 'qc_m8',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'गागर में सागर भरना' का क्या अर्थ है?",
        questionEnglish: "What does 'गागर में सागर भरना' mean?",
        options: [
          { textHindi: 'थोड़े शब्दों में बहुत बड़ी बात कहना (Express much in few words)', textEnglish: 'Express profound meaning in few words' },
          { textHindi: 'मटके में समुद्र का पानी भरना (Fill sea in pitcher)', textEnglish: 'Fill sea in pitcher' },
          { textHindi: 'असंभव कार्य करना (Do impossible task)', textEnglish: 'Do impossible task' },
          { textHindi: 'बहुत अधिक बातें करना (Talk too much)', textEnglish: 'Talk excessively' }
        ],
        correctIndex: 0,
        explanationHindi: "कवि बिहारी के दोहे गागर में सागर भरते हैं, अर्थात् थोड़े से शब्दों में गहन अर्थ समाहित करते हैं।",
        explanationEnglish: "To convey immense depth and meaning with succinct conciseness."
      },
      {
        id: 'qc_m9',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'हवा से बातें करना' मुहावरे का क्या अर्थ है?",
        questionEnglish: "What is the meaning of 'हवा से बातें करना'?",
        options: [
          { textHindi: 'बहुत तेज़ गति से दौड़ना (Run with extreme speed)', textEnglish: 'Run with extreme speed' },
          { textHindi: 'हवा में उड़ना (Fly in the air)', textEnglish: 'Fly in the air' },
          { textHindi: 'घमंड में रहना (Be arrogant)', textEnglish: 'Be arrogant' },
          { textHindi: 'झूठी बातें बोलना (Tell lies)', textEnglish: 'Tell lies' }
        ],
        correctIndex: 0,
        explanationHindi: "महाराणा प्रताप का घोड़ा चेतक हवा से बातें करता था, अर्थात् बिजली जैसी तीव्र गति से दौड़ता था।",
        explanationEnglish: "To travel or gallop with breathtaking speed."
      },
      {
        id: 'qc_m10',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे एवं लोकोक्तियाँ',
        topicNameEnglish: 'Idioms & Proverbs',
        questionHindi: "'फूला न समाना' मुहावरे का उपयुक्त अर्थ क्या है?",
        questionEnglish: "What is the meaning of 'फूला न समाना'?",
        options: [
          { textHindi: 'अत्यधिक प्रसन्न होना (Overjoyed)', textEnglish: 'Overjoyed / ecstatic' },
          { textHindi: 'मोटा हो जाना (Get fat)', textEnglish: 'Become heavy' },
          { textHindi: 'गुस्से से लाल होना (Furious)', textEnglish: 'Furious with anger' },
          { textHindi: 'फूलों की माला पहनना (Wear garland)', textEnglish: 'Wear garland' }
        ],
        correctIndex: 0,
        explanationHindi: "परीक्षा में प्रथम स्थान पाकर रोहन फूला न समाया, अर्थात् वह खुशी से झूम उठा।",
        explanationEnglish: "To be overwhelmed with extreme happiness and joy."
      }
    ]
  },
  {
    id: 'upsarg-pratyay',
    slug: 'upsarg-pratyay-studio',
    titleHindi: 'उपसर्ग एवं प्रत्यय (Prefix & Suffix Studio)',
    titleEnglish: 'Morphological Affix Builder',
    subtitleHindi: 'इच्छित संख्या में शब्दों की तालिका, विग्रह और अर्थ विश्लेषण',
    subtitleEnglish: 'Interactive word count generator, split formula & meaning table',
    iconName: 'Component',
    bottleneckHindi: 'मूल शब्द और उपसर्ग/प्रत्यय का सटीक विच्छेद न कर पाना तथा अर्थ में होने वाले बदलाव को न समझ पाना।',
    bottleneckEnglish: 'Extracting the exact root word and understanding the precise change in meaning caused by the affix.',
    interactionNameHindi: 'उपसर्ग-प्रत्यय जनरेटर (Affix Studio)',
    interactionNameEnglish: 'Affix Generator & Breakdown Table',
    whatStudentGainsHindi: 'मूल शब्द और उपसर्ग/प्रत्यय का विच्छेद करने का आत्मविश्वास और शब्दावली संवर्धन।',
    whatStudentGainsEnglish: 'Crystal clarity on morphological word construction and vocabulary growth.',
    paramparaCorner: {
      definitionHindi: 'उपसर्ग: वे शब्दांश जो शब्द के पहले जुड़कर अर्थ बदलते हैं। प्रत्यय: वे शब्दांश जो शब्द के अंत में जुड़कर नए शब्द बनाते हैं।',
      definitionEnglish: 'Prefixes (Upsarg) attach at the front; Suffixes (Pratyay) attach at the end of root words.',
      classicalShlokaOrRule: 'उपसर्गेण धात्वर्थो बलादन्यत्र नीयते। प्रहाराहारसंहारविहारपरिहारवत्॥',
      heritageContext: 'संस्कृत आचार्य कहते हैं कि जैसे एक ही ‘हृ’ धातु प्र-हार, आ-हार, सं-हार, वि-हार बनकर भिन्न अर्थ देती है, वैसे ही उपसर्ग शब्द शक्ति को बदलते हैं।'
    },
    rulesSummary: [
      {
        ruleHindi: 'उपसर्ग (Prefix): शब्द के पहले जुड़ता है (अधि + कार = अधिकार)।',
        ruleEnglish: 'Prefix: Attaches to the beginning of the root word (Adhi + Kaar = Adhikaar).',
        exampleHindi: 'दुर् + जन = दुर्जन (बुरा व्यक्ति)',
        exampleEnglish: 'Dur + Jan = Durjan (evil person)'
      },
      {
        ruleHindi: 'प्रत्यय (Suffix): शब्द के अंत में जुड़ता है (समाज + इक = सामाजिक)।',
        ruleEnglish: 'Suffix: Attaches to the end of the root word (Samaj + Ik = Samajik).',
        exampleHindi: 'दया + आलु = दयालु (कृपालु)',
        exampleEnglish: 'Daya + Aalu = Dayalu (kind/compassionate)'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_up1',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'अनुशासन' शब्द में कौन सा उपसर्ग है?",
        questionEnglish: "Which prefix is present in 'अनुशासन'?",
        options: [
          { textHindi: 'अनु (Anu)', textEnglish: 'Anu' },
          { textHindi: 'अ (A)', textEnglish: 'A' },
          { textHindi: 'अन (An)', textEnglish: 'An' },
          { textHindi: 'शासन (Shasan)', textEnglish: 'Shasan' }
        ],
        correctIndex: 0,
        explanationHindi: "'अनु' उपसर्ग है और 'शासन' मूल शब्द है। अनु + शासन = अनुशासन।",
        explanationEnglish: "'अनु' is the prefix attached to the root word 'शासन'."
      },
      {
        id: 'qc_up2',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'सामाजिक' शब्द में मूल शब्द और प्रत्यय क्या हैं?",
        questionEnglish: "Identify root word and suffix in 'सामाजिक':",
        options: [
          { textHindi: 'समाज + इक', textEnglish: 'Samaj + Ik' },
          { textHindi: 'सामाज + इक', textEnglish: 'Saamaj + Ik' },
          { textHindi: 'सम + आजिक', textEnglish: 'Sam + Aajik' },
          { textHindi: 'समाजी + क', textEnglish: 'Samaji + K' }
        ],
        correctIndex: 0,
        explanationHindi: "मूल शब्द 'समाज' में 'इक' प्रत्यय लगने से प्रथम स्वर 'अ' का 'आ' में वृद्धि रूप होकर 'सामाजिक' बनता है।",
        explanationEnglish: "Root word 'समाज' + suffix 'इक' causes initial vowel lengthening to form 'सामाजिक'."
      },
      {
        id: 'qc_up3',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'दुर्जन' शब्द में कौन सा उपसर्ग प्रयुक्त हुआ है?",
        questionEnglish: "Which prefix is in 'दुर्जन'?",
        options: [
          { textHindi: 'दुर् (Dur)', textEnglish: 'Dur' },
          { textHindi: 'दु (Du)', textEnglish: 'Du' },
          { textHindi: 'दुष (Dush)', textEnglish: 'Dush' },
          { textHindi: 'दू (Doo)', textEnglish: 'Doo' }
        ],
        correctIndex: 0,
        explanationHindi: "'दुर्' (बुरा) उपसर्ग + 'जन' (लोग) मिलकर 'दुर्जन' बना है।",
        explanationEnglish: "'दुर्' prefix denotes bad or wicked, joined with 'जन' (person)."
      },
      {
        id: 'qc_up4',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'लिखावट' शब्द में कौन सा प्रत्यय लगा है?",
        questionEnglish: "Which suffix is attached in 'लिखावट'?",
        options: [
          { textHindi: 'आवट (Aawat)', textEnglish: 'Aawat' },
          { textHindi: 'वट (Wat)', textEnglish: 'Wat' },
          { textHindi: 'टावट (Taawat)', textEnglish: 'Taawat' },
          { textHindi: 'हट (Hat)', textEnglish: 'Hat' }
        ],
        correctIndex: 0,
        explanationHindi: "'लिख्' धातु में 'आवट' भाववाचक कृत प्रत्यय लगने से 'लिखावट' बनता है।",
        explanationEnglish: "Root verb 'लिख' + suffix 'आवट' forms nominal verbal noun 'लिखावट'."
      },
      {
        id: 'qc_up5',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "किस शब्द में 'प्रति' उपसर्ग नहीं है?",
        questionEnglish: "Which word does NOT have the 'प्रति' prefix?",
        options: [
          { textHindi: 'प्रताप (Pratap)', textEnglish: 'Pratap' },
          { textHindi: 'प्रतिदिन (Pratidin)', textEnglish: 'Pratidin' },
          { textHindi: 'प्रत्येक (Pratyek)', textEnglish: 'Pratyek' },
          { textHindi: 'प्रतिकूल (Pratikool)', textEnglish: 'Pratikool' }
        ],
        correctIndex: 0,
        explanationHindi: "'प्रताप' में 'प्र' उपसर्ग है, जबकि अन्य तीनों में 'प्रति' उपसर्ग (प्रति + एक = प्रत्येक) है।",
        explanationEnglish: "'प्रताप' has prefix 'प्र', while the rest contain 'प्रति'."
      },
      {
        id: 'qc_up6',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'धार्मिक' और 'ऐतिहासिक' शब्दों में समान प्रत्यय कौन सा है?",
        questionEnglish: "Which identical suffix is in 'धार्मिक' and 'ऐतिहासिक'?",
        options: [
          { textHindi: 'इक (Ik)', textEnglish: 'Ik' },
          { textHindi: 'क (K)', textEnglish: 'K' },
          { textHindi: 'मिक (Mik)', textEnglish: 'Mik' },
          { textHindi: 'सिक (Sik)', textEnglish: 'Sik' }
        ],
        correctIndex: 0,
        explanationHindi: "धर्म + इक = धार्मिक और इतिहास + इक = ऐतिहासिक। दोनों में 'इक' तद्धित प्रत्यय है।",
        explanationEnglish: "Both share the Taddhit suffix 'इक'."
      },
      {
        id: 'qc_up7',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'अति' उपसर्ग से बना शब्द कौन सा है?",
        questionEnglish: "Which word is formed with the 'अति' prefix?",
        options: [
          { textHindi: 'अत्याचार (Atyachaar)', textEnglish: 'Atyachaar' },
          { textHindi: 'अभिमान (Abhimaan)', textEnglish: 'Abhimaan' },
          { textHindi: 'अपमान (Apmaan)', textEnglish: 'Apmaan' },
          { textHindi: 'अवगुण (Avagun)', textEnglish: 'Avagun' }
        ],
        correctIndex: 0,
        explanationHindi: "अति + आचार = अत्याचार (यण संधि के नियम से 'इ' का 'य्' बन जाता है)।",
        explanationEnglish: "अति + आचार combines to form 'अत्याचार' via Yan Sandhi."
      },
      {
        id: 'qc_up8',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'सुंदरता' शब्द में 'ता' किस प्रकार का प्रत्यय है?",
        questionEnglish: "What kind of suffix is 'ता' in 'सुंदरता'?",
        options: [
          { textHindi: 'भाववाचक तद्धित प्रत्यय', textEnglish: 'Abstract Taddhit Suffix' },
          { textHindi: 'कृत प्रत्यय', textEnglish: 'Krit Suffix (verb-based)' },
          { textHindi: 'स्त्रीप्रत्यय', textEnglish: 'Feminine gender marker' },
          { textHindi: 'कर्तृवाचक प्रत्यय', textEnglish: 'Agent noun suffix' }
        ],
        correctIndex: 0,
        explanationHindi: "विशेषण 'सुंदर' के अंत में 'ता' जुड़कर भाववाचक संज्ञा 'सुंदरता' बनाता है, अतः यह तद्धित प्रत्यय है।",
        explanationEnglish: "Suffix attaches to adjective to produce abstract noun, so Taddhit."
      },
      {
        id: 'qc_up9',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "'सज्जन' शब्द का सही उपसर्ग एवं मूल शब्द विच्छेद क्या है?",
        questionEnglish: "What is the correct split of 'सज्जन'?",
        options: [
          { textHindi: 'सत् + जन', textEnglish: 'Sat + Jan' },
          { textHindi: 'सज् + जन', textEnglish: 'Saj + Jan' },
          { textHindi: 'स + जन', textEnglish: 'Sa + Jan' },
          { textHindi: 'सज + न', textEnglish: 'Saj + Na' }
        ],
        correctIndex: 0,
        explanationHindi: "'सत्' (सच्चा/अच्छा) उपसर्ग में 'जन' जोड़ने पर व्यंजन संधि नियम से 'त्' का 'ज्' होकर 'सज्जन' बनता है।",
        explanationEnglish: "Prefix 'सत्' + root 'जन' undergoes consonant assimilation to 'सज्जन'."
      },
      {
        id: 'qc_up10',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग एवं प्रत्यय',
        topicNameEnglish: 'Upsarg & Pratyay',
        questionHindi: "उपसर्ग और प्रत्यय में मुख्य अंतर क्या है?",
        questionEnglish: "What is the key difference between prefix and suffix?",
        options: [
          { textHindi: 'उपसर्ग शब्द के आरंभ में और प्रत्यय शब्द के अंत में जुड़ता है', textEnglish: 'Prefix joins at start, suffix at end of word' },
          { textHindi: 'उपसर्ग केवल क्रिया में और प्रत्यय केवल संज्ञा में लगता है', textEnglish: 'Prefix only on verbs, suffix on nouns' },
          { textHindi: 'उपसर्ग का कोई अर्थ नहीं होता, प्रत्यय का होता है', textEnglish: 'Prefix has no meaning, suffix has' },
          { textHindi: 'दोनों केवल अंत में जुड़ते हैं', textEnglish: 'Both join at the end' }
        ],
        correctIndex: 0,
        explanationHindi: "उपसर्ग शब्द के पहले (आरंभ में) जुड़कर नया अर्थ देते हैं, जबकि प्रत्यय शब्द के अंत में जुड़ते हैं।",
        explanationEnglish: "Prefixes (Upsarg) attach at the front; Suffixes (Pratyay) attach at the tail end."
      }
    ]
  }
];

export const KARAK_LIST: KarakData[] = [
  {
    name: 'कर्ता (Karta)',
    marker: 'ने (Ne)',
    meaningHindi: 'क्रिया को करने वाला (Doer)',
    meaningEnglish: 'Doer of the action',
    exampleHindi: 'राम ने रावण को पराजित किया।',
    exampleEnglish: 'Ram defeated Ravana.',
    category: 'Other'
  },
  {
    name: 'कर्म (Karm)',
    marker: 'को (Ko)',
    meaningHindi: 'जिस पर क्रिया का फल पड़े (Receiver)',
    meaningEnglish: 'Receiver of the action',
    exampleHindi: 'माँ ने बच्चे को पुचकारा।',
    exampleEnglish: 'Mother caressed the child.',
    category: 'Other'
  },
  {
    name: 'करण (Karan)',
    marker: 'से, के द्वारा (Se, Ke dwara)',
    meaningHindi: 'क्रिया का साधन या माध्यम (Instrument/Tool)',
    meaningEnglish: 'Instrument, means, or with',
    exampleHindi: 'उसने कलम से सुंदर निबंध लिखा।',
    exampleEnglish: 'He wrote a beautiful essay with a pen.',
    category: 'Karan'
  },
  {
    name: 'सम्प्रदान (Sampradan)',
    marker: 'को, के लिए (Ko, Ke liye)',
    meaningHindi: 'जिसके लिए कार्य किया जाए (Recipient)',
    meaningEnglish: 'For whom action is done',
    exampleHindi: 'राजा ने निर्धन को भोजन दिया।',
    exampleEnglish: 'The king gave food to the poor.',
    category: 'Other'
  },
  {
    name: 'अपादान (Apadan)',
    marker: 'से (Se)',
    meaningHindi: 'अलग होना, डरना या तुलना (Separation/From)',
    meaningEnglish: 'Separation, detachment, origin',
    exampleHindi: 'पत्ता पेड़ से नीचे गिरा।',
    exampleEnglish: 'The leaf fell down from the tree.',
    category: 'Apadan'
  },
  {
    name: 'सम्बन्ध (Sambandh)',
    marker: 'का, के, की, रा, रे, री',
    meaningHindi: 'दो पदों में आपसी संबंध (Relation)',
    meaningEnglish: 'Possession or relation',
    exampleHindi: 'यह मयंक का विद्यालय है।',
    exampleEnglish: "This is Mayank's school.",
    category: 'Other'
  },
  {
    name: 'अधिकरण (Adhikaran)',
    marker: 'में, पर (Mein, Par)',
    meaningHindi: 'क्रिया का आधार, स्थान या काल (Location)',
    meaningEnglish: 'Place, surface, or container',
    exampleHindi: 'चिड़िया डाल पर बैठी है।',
    exampleEnglish: 'The bird is sitting on the branch.',
    category: 'Other'
  },
  {
    name: 'सम्बोधन (Sambodhan)',
    marker: 'हे, अरे, ओ (He, Are, O)',
    meaningHindi: 'पुकारना या सचेत करना (Addressing)',
    meaningEnglish: 'Calling out or addressing',
    exampleHindi: 'हे प्रभु! सब पर दया करो।',
    exampleEnglish: 'O Lord! Have mercy on all.',
    category: 'Other'
  }
];

export const VAKYA_TRAIN_EXAMPLES: VakyaItem[] = [
  {
    sentenceHindi: 'अमित पुस्तकालय गया और उसने नई पुस्तक पढ़ी।',
    sentenceEnglish: 'Amit went to the library and he read a new book.',
    type: 'संयुक्त (Compound)',
    clauses: [
      { text: 'अमित पुस्तकालय गया', isIndependent: true },
      { text: 'उसने नई पुस्तक पढ़ी', isIndependent: true }
    ],
    connectors: ['और'],
    explanationHindi: "'अमित पुस्तकालय गया' और 'उसने नई पुस्तक पढ़ी' दोनों स्वतंत्र वाक्य हैं जिन्हें 'और' योजक जोड़ रहा है।",
    explanationEnglish: "Both are complete independent sentences connected by coordinating conjunction 'और'."
  },
  {
    sentenceHindi: 'जब वर्षा रुकी, तब बालक मैदान में खेलने गए।',
    sentenceEnglish: 'When the rain stopped, then boys went to play in the ground.',
    type: 'मिश्र (Complex)',
    clauses: [
      { text: 'बालक मैदान में खेलने गए', isIndependent: true, role: 'master' },
      { text: 'जब वर्षा रुकी', isIndependent: false, role: 'dependent' }
    ],
    connectors: ['जब...तब'],
    explanationHindi: "'जब वर्षा रुकी' आश्रित उपवाक्य है, जो मुख्य उपवाक्य पर निर्भर है।",
    explanationEnglish: "'जब वर्षा रुकी' is a dependent clause that relies on the master clause."
  },
  {
    sentenceHindi: 'परिश्रमी छात्र परीक्षा में सर्वोच्च अंक प्राप्त करते हैं।',
    sentenceEnglish: 'Hardworking students obtain top marks in the examination.',
    type: 'सरल (Simple)',
    clauses: [
      { text: 'परिश्रमी छात्र परीक्षा में सर्वोच्च अंक प्राप्त करते हैं', isIndependent: true }
    ],
    connectors: [],
    explanationHindi: 'इसमें केवल एक ही उद्देश्य (परिश्रमी छात्र) और एक ही मुख्य विधेय/क्रिया है।',
    explanationEnglish: 'Contains only one subject and one single predicate.'
  }
];

export const VACHYA_SPOTLIGHT_ITEMS: VachyaStageItem[] = [
  {
    id: 'vachya_1',
    subject: 'राम',
    object: 'सेब',
    verbActive: 'खाता है',
    verbPassive: 'खाया जाता है',
    connector: 'के द्वारा',
    kartriHindi: 'राम सेब खाता है।',
    kartriEnglish: 'Ram eats an apple.',
    karmHindi: 'राम के द्वारा सेब खाया जाता है।',
    karmEnglish: 'An apple is eaten by Ram.'
  },
  {
    id: 'vachya_2',
    subject: 'चित्रकार',
    object: 'सुंदर चित्र',
    verbActive: 'बनाता है',
    verbPassive: 'बनाया जाता है',
    connector: 'के द्वारा',
    kartriHindi: 'चित्रकार सुंदर चित्र बनाता है।',
    kartriEnglish: 'The artist paints a beautiful picture.',
    karmHindi: 'चित्रकार के द्वारा सुंदर चित्र बनाया जाता है।',
    karmEnglish: 'A beautiful picture is painted by the artist.'
  },
  {
    id: 'vachya_3',
    subject: 'सुनीता',
    object: 'पत्र',
    verbActive: 'लिखती है',
    verbPassive: 'लिखा जाता है',
    connector: 'के द्वारा',
    kartriHindi: 'सुनीता पत्र लिखती है।',
    kartriEnglish: 'Sunita writes a letter.',
    karmHindi: 'सुनीता के द्वारा पत्र लिखा जाता है।',
    karmEnglish: 'A letter is written by Sunita.'
  }
];

export const KAAL_DIAL_ITEMS: KaalDialItem[] = [
  {
    id: 'kaal_1',
    rootWord: 'लिख (Likh)',
    baseSentence: 'लड़की पत्र लिखती है',
    tenses: [
      {
        tense: 'वर्तमान काल (Present)',
        subType: 'सामान्य वर्तमान (Simple Present)',
        conjugatedEnding: 'लिखती है',
        fullSentenceHindi: 'लड़की पत्र लिखती है।',
        fullSentenceEnglish: 'The girl writes a letter.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'अपूर्ण भूतकाल (Past Continuous)',
        conjugatedEnding: 'लिख रही थी',
        fullSentenceHindi: 'लड़की पत्र लिख रही थी।',
        fullSentenceEnglish: 'The girl was writing a letter.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'पूर्ण भूतकाल (Past Perfect)',
        conjugatedEnding: 'लिखा था',
        fullSentenceHindi: 'लड़की ने पत्र लिखा था।',
        fullSentenceEnglish: 'The girl had written a letter.'
      },
      {
        tense: 'भविष्यत् काल (Future)',
        subType: 'सामान्य भविष्यत् (Simple Future)',
        conjugatedEnding: 'लिखेगी',
        fullSentenceHindi: 'लड़की पत्र लिखेगी।',
        fullSentenceEnglish: 'The girl will write a letter.'
      }
    ]
  },
  {
    id: 'kaal_2',
    rootWord: 'गा (Gaa)',
    baseSentence: 'गायक मंच पर गाता है',
    tenses: [
      {
        tense: 'वर्तमान काल (Present)',
        subType: 'अपूर्ण वर्तमान (Present Continuous)',
        conjugatedEnding: 'गा रहा है',
        fullSentenceHindi: 'गायक मंच पर गा रहा है।',
        fullSentenceEnglish: 'The singer is singing on the stage.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'सामान्य भूतकाल (Simple Past)',
        conjugatedEnding: 'गाया',
        fullSentenceHindi: 'गायक ने मंच पर गाया।',
        fullSentenceEnglish: 'The singer sang on the stage.'
      },
      {
        tense: 'भविष्यत् काल (Future)',
        subType: 'सामान्य भविष्यत् (Simple Future)',
        conjugatedEnding: 'गाएगा',
        fullSentenceHindi: 'गायक मंच पर गाएगा।',
        fullSentenceEnglish: 'The singer will sing on the stage.'
      }
    ]
  }
];

export const MUHAVARA_LIST: MuhavaraItem[] = [
  {
    id: 'mh_1',
    muhavara: 'नौ दो ग्यारह होना',
    literalImageDescription: 'संख्या 9, 2 और 11 हवा में उड़ते हुए',
    literalHindi: 'नौ, दो और ग्यारह बन जाना',
    literalEnglish: 'Becoming nine, two, eleven',
    metaphorHindi: 'रफूचक्कर होना या भाग जाना',
    metaphorEnglish: 'To flee or run away quickly',
    sentenceHindi: 'पुलिस की सायरन सुनते ही चोर नौ दो ग्यारह हो गए।',
    sentenceEnglish: 'Hearing the police siren, the thieves fled immediately.'
  },
  {
    id: 'mh_2',
    muhavara: 'आसमान सिर पर उठाना',
    literalImageDescription: 'एक बच्चा सचमुच नीले आकाश को सिर पर उठाए खड़ा है',
    literalHindi: 'नीले आसमान को दोनों हाथों से सिर पर उठा लेना',
    literalEnglish: 'Lifting the sky onto ones head',
    metaphorHindi: 'बहुत अधिक शोरगुल या उपद्रव मचाना',
    metaphorEnglish: 'To make an unbearable amount of noise and fuss',
    sentenceHindi: 'कक्षा में शिक्षक के न होने पर बच्चों ने आसमान सिर पर उठा लिया।',
    sentenceEnglish: 'In the absence of teacher, the students made a huge fuss.'
  },
  {
    id: 'mh_3',
    muhavara: 'आँखों का तारा होना',
    literalImageDescription: 'आँख की पुतली में एक चमकदार चमकता तारा',
    literalHindi: 'आँखों के भीतर तारा चमकना',
    literalEnglish: 'Having a star inside the eye',
    metaphorHindi: 'बहुत अधिक प्यारा या दुलारा होना',
    metaphorEnglish: 'Apple of one’s eye; deeply beloved',
    sentenceHindi: 'श्रवण कुमार अपने वृद्ध माता-पिता की आँखों का तारा था।',
    sentenceEnglish: 'Shravan Kumar was the apple of his aged parents’ eyes.'
  },
  {
    id: 'mh_4',
    muhavara: 'ऊँट के मुँह में जीरा',
    literalImageDescription: 'एक विशाल ऊँट के खुले मुँह में जीरे का एक नन्हा दाना',
    literalHindi: 'ऊँट जैसे बड़े प्राणी को जीरा खिलाना',
    literalEnglish: 'A tiny cumin seed in a giant camel’s mouth',
    metaphorHindi: 'बहुत बड़ी आवश्यकता की तुलना में बहुत कम वस्तु मिलना',
    metaphorEnglish: 'A drop in the ocean; far less than needed',
    sentenceHindi: 'पहलवान को नाश्ते में केवल एक रोटी देना ऊँट के मुँह में जीरा है।',
    sentenceEnglish: 'Giving just one roti to a heavyweight wrestler is a drop in the ocean.'
  },
  {
    id: 'mh_5',
    muhavara: 'दाँतों तले उँगली दबाना',
    literalImageDescription: 'दाँतों के बीच उँगली दबाकर आँखें फटी की फटी रह जाना',
    literalHindi: 'दाँत से उँगली को काटना',
    literalEnglish: 'Pressing finger under teeth',
    metaphorHindi: 'दंग रह जाना या आश्चर्यचकित होना',
    metaphorEnglish: 'To be completely astonished or awestruck',
    sentenceHindi: 'जादूगर के हैरतअंगेज करतब देखकर सबने दाँतों तले उँगली दबा ली।',
    sentenceEnglish: 'Watching the magician’s miraculous tricks, everyone was astonished.'
  }
];

export const APATHIT_GADYANSH_PASSAGES: ApathitGadyanshPassage[] = [
  {
    id: 'gad_easy',
    titleHindi: 'प्रकृति का अमूल्य वरदान: वृक्ष और हमारा पर्यावरण',
    titleEnglish: 'Nature\'s Invaluable Boon: Trees & Our Environment',
    theme: 'पर्यावरण एवं जीवन संतुलन (Environment & Life Balance)',
    difficulty: 'easy',
    difficultyLabelHindi: 'सरल (Easy)',
    gradeLevel: 'कक्षा 8',
    passageHindi: `प्रकृति ने मानव जाति को जीवित रहने और सुखी जीवन बिताने के लिए अनगिनत अमूल्य उपहार प्रदान किए हैं, जिनमें वृक्षों का स्थान सर्वोपरि है। वृक्ष न केवल धरती का नैसर्गिक सौंदर्य बढ़ाते हैं, बल्कि वे समस्त जीव-जगत के प्राणदाता भी हैं। प्रातःकाल जब सूर्य की प्रथम किरणें हरी पत्तियों पर पड़ती हैं, तब पेड़ प्रकाश संश्लेषण की चमत्कारी प्रक्रिया द्वारा कार्बन डाइऑक्साइड को सोखकर हमें जीवनदायिनी ऑक्सीजन प्रदान करते हैं। यदि धरती पर वृक्ष न हों, तो शुद्ध वायु का अस्तित्व ही समाप्त हो जाएगा और जीव-जंतुओं के लिए साँस लेना भी असंभव हो जाएगा।

इसके अतिरिक्त, वृक्ष पर्यावरण के संतुलन को बनाए रखने में एक रक्षक की भूमिका निभाते हैं। उनकी गहरी जड़ें मिट्टी को मजबूती से बाँधकर रखती हैं, जिससे वर्षा के दिनों में उपजाऊ मिट्टी बहने से बच जाती है और भयानक भू-क्षरण तथा बाढ़ जैसी आपदाओं की तीव्रता काफी कम हो जाती है। घने जंगल बादलों को आकर्षित करके समय पर वर्षा कराने में भी सहायक होते हैं। वृक्ष हमें मीठे फल, सुगन्धित फूल, बहुमूल्य औषधियाँ, इमारती लकड़ी और शीतल छाया प्रदान करते हैं। थका हुआ पथिक जब किसी विशाल वटवृक्ष या नीम के पेड़ की ठंडी छाँव में बैठता है, तो उसकी सारी थकान पल भर में दूर हो जाती है।

पक्षी पेड़ों की डालियों पर अपने सुरक्षित घोंसले बनाकर रहते हैं और उनके मधुर कलरव से संपूर्ण प्रकृति गूँज उठती है। परंतु आज का मनुष्य अपने स्वार्थ और आधुनिक औद्योगीकरण की अंधी दौड़ में अंधाधुंध जंगलों को काट रहा है। यदि यह विनाशकारी क्रम इसी प्रकार चलता रहा, तो हरी-भरी धरती धीरे-धीरे बंजर मरुस्थल में बदल जाएगी। इसलिए हमारा परम कर्तव्य है कि हम न केवल पेड़ों की रक्षा करें, बल्कि प्रत्येक शुभ अवसर पर नए पौधे लगाकर उनका पालन-पोषण करें। वृक्षारोपण केवल एक औपचारिकता नहीं, बल्कि हमारी भावी पीढ़ियों के सुरक्षित भविष्य की अनिवार्य गारंटी है।`,
    hindiSummary: `वृक्ष हमारे पर्यावरण के प्राणदाता हैं जो हमें शुद्ध ऑक्सीजन देते हैं, मिट्टी के कटाव व बाढ़ को रोकते हैं और समय पर वर्षा लाने में मदद करते हैं। मनुष्य द्वारा पेड़ों की अंधाधुंध कटाई धरती के संतुलन को बिगाड़ रही है, इसलिए वृक्षों की रक्षा और नए पौधे लगाना आने वाली पीढ़ियों के सुरक्षित भविष्य के लिए अत्यंत आवश्यक है।`,
    englishSummary: `Nature has endowed mankind with countless gifts, among which trees hold the highest significance. They absorb carbon dioxide to generate life-giving oxygen, bind soil to avert erosion, invite seasonal rainfall, and shelter wildlife. Indiscriminate deforestation threatens this delicate balance, making afforestation an urgent moral duty.`,
    vocabularyList: [
      { word: 'नैसर्गिक (Natural)', meaningHindi: 'प्राकृतिक, स्वाभाविक', meaningEnglish: 'Natural / inherent' },
      { word: 'सर्वोपरि (Supreme)', meaningHindi: 'सबसे ऊँचा या सबसे प्रमुख', meaningEnglish: 'Supreme / paramount' },
      { word: 'भू-क्षरण (Soil erosion)', meaningHindi: 'मिट्टी का कटना या बह जाना', meaningEnglish: 'Soil erosion' },
      { word: 'कलरव (Chirping)', meaningHindi: 'पक्षियों की मीठी चहचहाहट', meaningEnglish: 'Sweet chirping of birds' }
    ],
    questions: [
      {
        id: 'gq_e1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'गद्यांश के अनुसार समस्त जीव-जगत के प्राणदाता किन्हें माना गया है?',
        questionEnglish: 'According to the passage, who are considered life-givers of all living beings?',
        options: [
          { textHindi: 'वृक्षों को (Trees)', textEnglish: 'Trees' },
          { textHindi: 'उद्योगों को (Industries)', textEnglish: 'Industries' },
          { textHindi: 'इमारतों को (Buildings)', textEnglish: 'Buildings' },
          { textHindi: 'वाहनों को (Vehicles)', textEnglish: 'Vehicles' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश में स्पष्ट कहा गया है कि 'वृक्ष समस्त जीव-जगत के प्राणदाता हैं' क्योंकि वे ऑक्सीजन प्रदान करते हैं।",
        explanationEnglish: "The text states trees are life-givers because they generate oxygen via photosynthesis."
      },
      {
        id: 'gq_e2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'वृक्ष भू-क्षरण (मिट्टी के कटाव) को कैसे रोकते हैं?',
        questionEnglish: 'How do trees prevent soil erosion?',
        options: [
          { textHindi: 'उनकी गहरी जड़ें मिट्टी को बाँधकर रखती हैं', textEnglish: 'Their deep roots bind the soil firmly' },
          { textHindi: 'वे बादलों को भगा देते हैं', textEnglish: 'They drive clouds away' },
          { textHindi: 'वे मिट्टी को कठोर बना देते हैं', textEnglish: 'They make soil rocky' },
          { textHindi: 'वे केवल फल गिराते हैं', textEnglish: 'They only drop fruits' }
        ],
        correctIndex: 0,
        explanationHindi: "वृक्षों की जड़ें वर्षा के जल में उपजाऊ मिट्टी को बहने से रोकती हैं।",
        explanationEnglish: "Deep tree roots anchor the topsoil and stop rain wash-off."
      },
      {
        id: 'gq_e3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'नैसर्गिक' शब्द का सर्वाधिक उपयुक्त पर्यायवाची क्या है?",
        questionEnglish: "What is the most suitable synonym of 'नैसर्गिक'?",
        options: [
          { textHindi: 'प्राकृतिक (Natural)', textEnglish: 'Natural' },
          { textHindi: 'बनावटी (Artificial)', textEnglish: 'Artificial' },
          { textHindi: 'कठिन (Difficult)', textEnglish: 'Difficult' },
          { textHindi: 'क्षणिक (Momentary)', textEnglish: 'Momentary' }
        ],
        correctIndex: 0,
        explanationHindi: "'नैसर्गिक' का अर्थ जो प्रकृति द्वारा प्रदत्त हो, अर्थात् प्राकृतिक है।",
        explanationEnglish: "'नैसर्गिक' means innate or natural."
      },
      {
        id: 'gq_e4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'मनुष्य के किस आचरण के कारण धरती बंजर होने का खतरा उत्पन्न हो रहा है?',
        questionEnglish: 'Which human behavior creates the risk of land desertification?',
        options: [
          { textHindi: 'अंधाधुंध वृक्षों की कटाई (Indiscriminate deforestation)', textEnglish: 'Indiscriminate felling of trees' },
          { textHindi: 'पौधों को सींचना (Watering plants)', textEnglish: 'Watering plants' },
          { textHindi: 'जैविक खेती अपनाना (Organic farming)', textEnglish: 'Organic farming' },
          { textHindi: 'समय की पाबंदी (Punctuality)', textEnglish: 'Punctuality' }
        ],
        correctIndex: 0,
        explanationHindi: "औद्योगिकीकरण और स्वार्थ में अंधाधुंध वनों की कटाई से धरती के बंजर होने का खतरा है।",
        explanationEnglish: "Rampant deforestation driven by short-term greed causes desertification."
      },
      {
        id: 'gq_e5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "प्रस्तुत गद्यांश का सर्वाधिक उपयुक्त शीर्षक क्या होगा?",
        questionEnglish: "What would be the most appropriate title for this passage?",
        options: [
          { textHindi: 'वृक्षों का महत्व और पर्यावरण संरक्षण', textEnglish: 'Significance of Trees & Environmental Conservation' },
          { textHindi: 'मिट्टी के प्रकार', textEnglish: 'Types of Soil' },
          { textHindi: 'पक्षियों के घोंसले', textEnglish: 'Nests of Birds' },
          { textHindi: 'वर्षा का विज्ञान', textEnglish: 'Science of Rain' }
        ],
        correctIndex: 0,
        explanationHindi: "सम्पूर्ण गद्यांश में वृक्षों के पर्यावरणीय महत्व और उनके संरक्षण पर बल दिया गया है।",
        explanationEnglish: "The central thesis revolves around ecological value of trees and conservation."
      },
      {
        id: 'gq_e6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'पर्यावरण' शब्द का सही संधि-विच्छेद क्या है?",
        questionEnglish: "What is the correct sandhi-viched of 'पर्यावरण'?",
        options: [
          { textHindi: 'परि + आवरण', textEnglish: 'Pari + Aavaran' },
          { textHindi: 'पर्या + वरण', textEnglish: 'Parya + Varan' },
          { textHindi: 'पर + आवरण', textEnglish: 'Par + Aavaran' },
          { textHindi: 'परी + आवरण', textEnglish: 'Paree + Aavaran' }
        ],
        correctIndex: 0,
        explanationHindi: "परि (चारों ओर) + आवरण (ढकाव) = पर्यावरण (यण संधि)।",
        explanationEnglish: "Pari + Aavaran combines via Yan Sandhi to form Paryavaran."
      },
      {
        id: 'gq_e7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'गद्यांश के अनुसार भावी पीढ़ियों के सुरक्षित भविष्य के लिए क्या अनिवार्य है?',
        questionEnglish: 'According to the passage, what is mandatory for the future generations?',
        options: [
          { textHindi: 'सक्रिय वृक्षारोपण और पौधों का पालन-पोषण', textEnglish: 'Active tree plantation and nurturing' },
          { textHindi: 'जंगलों को साफ करके फैक्ट्रियाँ लगाना', textEnglish: 'Clearing forests for factories' },
          { textHindi: 'केवल बातें करना और नियम बनाना', textEnglish: 'Making rules without action' },
          { textHindi: 'पेड़ों की लकड़ी बेचना', textEnglish: 'Selling timber' }
        ],
        correctIndex: 0,
        explanationHindi: "अंतिम अनुच्छेद में कहा गया है कि वृक्षारोपण और उनका पालन-पोषण भावी पीढ़ी की गारंटी है।",
        explanationEnglish: "Concludes that tree plantation and maintenance guarantee a secure future."
      },
      {
        id: 'gq_e8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'जीवनदायिनी' शब्द में मूल शब्द और प्रत्यय क्या हैं?",
        questionEnglish: "What are the root word and suffix in 'जीवनदायिनी'?",
        options: [
          { textHindi: 'जीवन + दायिनी (देने वाली)', textEnglish: 'Jeevan + Dayini (giver)' },
          { textHindi: 'जीव + नदायिनी', textEnglish: 'Jeev + Nadayini' },
          { textHindi: 'जी + वनदायिनी', textEnglish: 'Jee + Vandayini' },
          { textHindi: 'जीवनदा + यिनी', textEnglish: 'Jeevanda + Yini' }
        ],
        correctIndex: 0,
        explanationHindi: "'जीवन' मूल शब्द है और 'दायिनी' (प्रदान करने वाली) प्रत्यय के रूप में जुड़ा है।",
        explanationEnglish: "'जीवन' is root, 'दायिनी' denotes one who bestows life."
      }
    ],
    shortQuestions: [
      {
        id: 'gsq_e1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'वृक्ष मिट्टी के कटाव और बाढ़ जैसी आपदाओं को रोकने में कैसे मदद करते हैं?',
        questionEnglish: 'How do trees help prevent soil erosion and disasters like floods?',
        sampleAnswerHindi: 'वृक्षों की गहरी जड़ें मिट्टी को मजबूती से बाँधकर रखती हैं, जिससे वर्षा में उपजाऊ मिट्टी नहीं बहती और बाढ़ व भू-क्षरण कम होता है।',
        sampleAnswerEnglish: 'The deep roots of trees hold the soil firmly together, preventing fertile topsoil from washing away during rains and reducing soil erosion and floods.'
      },
      {
        id: 'gsq_e2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'यदि मनुष्य जंगलों को अंधाधुंध काटता रहा, तो धरती पर इसका क्या परिणाम होगा?',
        questionEnglish: 'What will happen to the Earth if humans continue cutting down forests recklessly?',
        sampleAnswerHindi: 'यदि जंगलों की अंधाधुंध कटाई चलती रही, तो शुद्ध वायु समाप्त हो जाएगी और हरी-भरी धरती धीरे-धीरे बंजर मरुस्थल में बदल जाएगी।',
        sampleAnswerEnglish: 'If deforestation continues recklessly, pure air will disappear and our lush green Earth will gradually turn into a barren desert.'
      }
    ]
  },
  {
    id: 'gad_medium',
    titleHindi: 'समय का मूल्य, अनुशासन और वैज्ञानिक चेतना',
    titleEnglish: 'Value of Time, Discipline & Scientific Consciousness',
    theme: 'समय प्रबंधन व बौद्धिक विकास (Time Management & Intellectual Growth)',
    difficulty: 'medium',
    difficultyLabelHindi: 'मध्यम (Medium)',
    gradeLevel: 'कक्षा 9',
    passageHindi: `समय संसार की सर्वाधिक अमूल्य और अपरिवर्तनीय संपदा है। जीवन के प्रत्येक क्षेत्र में सफलता की आधारशिला समय के सदुपयोग और आत्म-अनुशासन पर ही टिकी हुई है। खोई हुई संपत्ति को कठिन परिश्रम से पुनः अर्जित किया जा सकता है, बिगड़े हुए स्वास्थ्य को उत्तम चिकित्सा और संतुलित दिनचर्या से सुधारा जा सकता है, यहाँ तक कि विस्मृत ज्ञान को भी सतत स्वाध्याय से दोबारा प्राप्त किया जा सकता है; किंतु जो क्षण एक बार हमारी उँगलियों से फिसलकर अतीत के गर्त में विलीन हो गया, वह इस ब्रह्मांड की किसी भी शक्ति द्वारा वापस नहीं लौटाया जा सकता।

प्रकृति का समस्त चक्र समयबद्धता और अचूक अनुशासन का उत्कृष्ट प्रमाण है। सूर्य का नियमित उदय-अस्त, ऋतुओं का क्रमिक परिवर्तन, समुद्र का ज्वार-भाटा और आकाशीय नक्षत्रों की निर्धारित गति हमें यह संदेश देती है कि ब्रह्मांड की स्थिरता अनुशासन के नियम पर ही आधारित है। यदि किसान अनुकूल ऋतु में खेत की जुताई और बीज-वपन न करे, तो वर्षा बीत जाने पर उसका पश्चाताप किसी काम नहीं आता। ठीक इसी प्रकार, विद्यार्थी जीवन चरित्र निर्माण और बौद्धिक साधना की वह उर्वर भूमि है, जहाँ समय का एक-एक क्षण भविष्य की दिशा तय करता है। जो छात्र आज के कार्य को कल पर टालने की घातक प्रवृत्ति (प्रोक्रेस्टिनेशन) के शिकार होते हैं, वे अंततः परीक्षा के समय घबराहट और असफलता के भंवर में फँस जाते हैं।

इसके साथ ही, आधुनिक युग में वैज्ञानिक चेतना का विकास भी समय के कुशल प्रबंधन पर निर्भर करता है। आज का युग तकनीकी क्रांति और तीव्र प्रतिस्पर्धा का युग है। वैज्ञानिक दृष्टिकोण हमें रूढ़ियों और अंधविश्वासों से मुक्त कर तर्क, प्रयोग और प्रमाण के आधार पर सत्य की खोज करना सिखाता है। जब समय की पाबंदी और वैज्ञानिक दृष्टिकोण का सुखद समन्वय होता है, तब समाज में नवाचार और प्रगति की नई किरणें प्रस्फुटित होती हैं। जो राष्ट्र समय का सम्मान करते हैं, वे ही वैश्विक मंच पर नेतृत्व करते हैं। अतः प्रत्येक जागरूक नागरिक को समय को केवल घड़ी की सुइयों का चलना नहीं, बल्कि जीवन की अनमोल पूँजी समझकर उसका प्रत्येक पल राष्ट्रहित और आत्म-उत्थान में समर्पित करना चाहिए।`,
    hindiSummary: `समय संसार की सबसे अमूल्य संपदा है, क्योंकि बीता हुआ क्षण कभी वापस नहीं आता। प्रकृति का अचूक अनुशासन हमें समयबद्धता सिखाता है, और जब विद्यार्थी जीवन में समय के सदुपयोग के साथ वैज्ञानिक दृष्टिकोण जुड़ता है, तभी व्यक्ति और राष्ट्र प्रगति के शिखर पर पहुँचते हैं।`,
    englishSummary: `Time is the most irreversible resource in existence. While wealth, health, and knowledge can be regained, spent moments vanish forever into history. Nature operates on meticulous punctuality, demonstrating that order and progress depend on discipline. Combined with a modern scientific temper that prizes reasoning over dogma, temporal stewardship fuels innovation and national prosperity.`,
    vocabularyList: [
      { word: 'अपरिवर्तनीय (Irreversible)', meaningHindi: 'जिसे बदला न जा सके', meaningEnglish: 'Unchangeable / irrevocable' },
      { word: 'उर्वर (Fertile)', meaningHindi: 'उपजाऊ, फलदायी', meaningEnglish: 'Fertile / productive' },
      { word: 'विस्मृत (Forgotten)', meaningHindi: 'भूला हुआ, स्मृति से ओझल', meaningEnglish: 'Forgotten / lapsed' },
      { word: 'प्रस्फुटित (Blossomed)', meaningHindi: 'खिलना या फूट पड़ना', meaningEnglish: 'Emerged / blossomed forth' }
    ],
    questions: [
      {
        id: 'gq_m1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'गद्यांश के अनुसार ऐसी कौन सी संपदा है जिसे किसी भी शक्ति द्वारा वापस नहीं पाया जा सकता?',
        questionEnglish: 'According to the passage, which asset can never be retrieved by any force?',
        options: [
          { textHindi: 'बीता हुआ समय (Elapsed time)', textEnglish: 'Elapsed time' },
          { textHindi: 'खोया हुआ धन (Lost wealth)', textEnglish: 'Lost money' },
          { textHindi: 'बिगड़ा हुआ स्वास्थ्य (Impaired health)', textEnglish: 'Health' },
          { textHindi: 'विस्मृत ज्ञान (Forgotten knowledge)', textEnglish: 'Knowledge' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश स्पष्ट करता है कि धन, स्वास्थ्य और ज्ञान पुनः प्राप्त हो सकते हैं, किंतु बीता हुआ समय कभी वापस नहीं आता।",
        explanationEnglish: "The passage notes that wealth, health, and knowledge can be restored, but time cannot."
      },
      {
        id: 'gq_m2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "प्रकृति की कौन सी विशेषता मनुष्य को अनुशासन का पाठ पढ़ाती है?",
        questionEnglish: 'Which aspect of nature teaches humans the lesson of discipline?',
        options: [
          { textHindi: 'ऋतुओं और आकाशीय पिंडों की नियमित समयबद्ध गति', textEnglish: 'Punctual cyclical movement of seasons and celestial bodies' },
          { textHindi: 'अचानक आने वाले तूफान', textEnglish: 'Sudden unpredictable storms' },
          { textHindi: 'जंगलों की अनियंत्रित वृद्धि', textEnglish: 'Wild uncontrolled growth' },
          { textHindi: 'नदियों का मार्ग बदलना', textEnglish: 'Rivers changing courses' }
        ],
        correctIndex: 0,
        explanationHindi: "सूर्य का समय पर उदय होना, ऋतुओं का चक्र और नक्षत्रों की गति नियमित अनुशासन सिखाते हैं।",
        explanationEnglish: "Cyclical predictability of dawn, seasons, and orbits models cosmic discipline."
      },
      {
        id: 'gq_m3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "विद्यार्थी जीवन को किस रूप में निरूपित किया गया है?",
        questionEnglish: 'How has student life been characterized in the passage?',
        options: [
          { textHindi: 'चरित्र निर्माण और बौद्धिक साधना की उर्वर भूमि', textEnglish: 'Fertile ground for character building and intellectual cultivation' },
          { textHindi: 'केवल खेलकूद और आमोद-प्रमोद का समय', textEnglish: 'Time solely for amusement' },
          { textHindi: 'दूसरों की नकल करने की अवस्था', textEnglish: 'Stage for imitating others' },
          { textHindi: 'बिना किसी उत्तरदायित्व का काल', textEnglish: 'Period devoid of responsibilities' }
        ],
        correctIndex: 0,
        explanationHindi: "विद्यार्थी जीवन चरित्र निर्माण की वह उर्वर भूमि है जहाँ समय का सदुपयोग भविष्य संवारता है।",
        explanationEnglish: "Defined as fertile terrain where timely effort sows future leadership."
      },
      {
        id: 'gq_m4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "वैज्ञानिक दृष्टिकोण की मुख्य विशेषता क्या है?",
        questionEnglish: 'What is the hallmark of a scientific mindset?',
        options: [
          { textHindi: 'तर्क, प्रयोग और प्रमाण के आधार पर सत्य की खोज', textEnglish: 'Pursuit of truth based on logic, experimentation, and evidence' },
          { textHindi: 'पुरानी रूढ़ियों को आँख मूँदकर स्वीकारना', textEnglish: 'Blind adherence to ancient dogma' },
          { textHindi: 'केवल मशीनों का अधिक उपयोग करना', textEnglish: 'Solely using gadgets' },
          { textHindi: 'परंपराओं का बिना सोचे विरोध करना', textEnglish: 'Rejecting tradition without thought' }
        ],
        correctIndex: 0,
        explanationHindi: "वैज्ञानिक दृष्टिकोण रूढ़ियों से परे तर्क, परीक्षण और प्रमाण को सर्वोपरि मानता है।",
        explanationEnglish: "A scientific outlook relies on reason, empirical testing, and verifiable evidence."
      },
      {
        id: 'gq_m5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'उर्वर' शब्द का विलोम शब्द क्या होगा?",
        questionEnglish: "What is the exact antonym of 'उर्वर' (Fertile)?",
        options: [
          { textHindi: 'ऊसर / बंजर (Barren)', textEnglish: 'Barren / sterile' },
          { textHindi: 'सरल (Simple)', textEnglish: 'Simple' },
          { textHindi: 'कठोर (Hard)', textEnglish: 'Hard' },
          { textHindi: 'शुद्ध (Pure)', textEnglish: 'Pure' }
        ],
        correctIndex: 0,
        explanationHindi: "'उर्वर' (उपजाऊ) का विलोम 'ऊसर' या 'बंजर' (अनुपजाऊ) होता है।",
        explanationEnglish: "'उर्वर' (fertile) has the exact antonym 'ऊसर' (barren/sterile)."
      },
      {
        id: 'gq_m6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'आत्म-अनुशासन' में कौन सा समास है?",
        questionEnglish: "Which Samas is found in 'आत्म-अनुशासन' (Self-discipline)?",
        options: [
          { textHindi: 'तत्पुरुष समास (Tatpurush Samas)', textEnglish: 'Tatpurush Samas' },
          { textHindi: 'द्वंद्व समास (Dvandva Samas)', textEnglish: 'Dvandva Samas' },
          { textHindi: 'द्विगु समास (Dvigu Samas)', textEnglish: 'Dvigu Samas' },
          { textHindi: 'कर्मधारय समास (Karmadharaya Samas)', textEnglish: 'Karmadharaya Samas' }
        ],
        correctIndex: 0,
        explanationHindi: "आत्म (स्वयं) का अनुशासन = संबंध तत्पुरुष समास।",
        explanationEnglish: "Discipline of the self (संबंध तत्पुरुष समास)."
      },
      {
        id: 'gq_m7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "वैश्विक मंच पर कौन से राष्ट्र नेतृत्व करते हैं?",
        questionEnglish: 'Which nations lead on the global stage according to the passage?',
        options: [
          { textHindi: 'जो समय का सम्मान और वैज्ञानिक नवाचार करते हैं', textEnglish: 'Those that respect time and pioneer scientific innovation' },
          { textHindi: 'जिनके पास केवल प्राकृतिक संसाधन हों', textEnglish: 'Those having raw resources only' },
          { textHindi: 'जो प्राचीन मान्यताओं में ही अटके रहते हैं', textEnglish: 'Those stuck solely in past rituals' },
          { textHindi: 'जो परिश्रम से बचते हैं', textEnglish: 'Those avoiding hard work' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश बताता है कि समय की कद्र और वैज्ञानिक नवाचार करने वाले देश ही विश्व का मार्गदर्शन करते हैं।",
        explanationEnglish: "Nations that steward time and cultivate empirical innovation lead the global order."
      },
      {
        id: 'gq_m8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "विद्यार्थियों के लिए कार्य टालने की आदत को लेखक ने कैसा बताया है?",
        questionEnglish: 'How does the author describe the habit of procrastination among students?',
        options: [
          { textHindi: 'घातक प्रवृत्ति जो अंततः असफलता में धकेलती है', textEnglish: 'A fatal tendency leading to panic and failure' },
          { textHindi: 'आराम करने का अच्छा तरीका', textEnglish: 'A good way to relax' },
          { textHindi: 'बुद्धिमत्ता का प्रतीक', textEnglish: 'Sign of cleverness' },
          { textHindi: 'स्वाभाविक व हानिरहित आदत', textEnglish: 'A harmless natural habit' }
        ],
        correctIndex: 0,
        explanationHindi: "लेखक ने आज का काम कल पर टालने को 'घातक प्रवृत्ति' कहा है जो अंत में घबराहट और असफलता लाती है।",
        explanationEnglish: "Procrastination is explicitly termed a fatal trap causing panic and defeat."
      }
    ],
    shortQuestions: [
      {
        id: 'gsq_m1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'प्रकृति हमें अनुशासन और समयबद्धता का क्या संदेश देती है?',
        questionEnglish: 'What message does nature give us about discipline and punctuality?',
        sampleAnswerHindi: 'सूर्य के नियमित उदय-अस्त, ऋतुओं के क्रमिक परिवर्तन और नक्षत्रों की निश्चित गति से प्रकृति यह संदेश देती है कि स्थिरता और प्रगति अनुशासन के नियम पर आधारित है।',
        sampleAnswerEnglish: 'Through the regular rising and setting of the sun, seasonal cycles, and fixed motion of stars, nature teaches us that stability and progress depend on discipline.'
      },
      {
        id: 'gsq_m2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'वैज्ञानिक दृष्टिकोण हमें किससे मुक्त करता है और क्या सिखाता है?',
        questionEnglish: 'What does a scientific temper free us from and what does it teach us?',
        sampleAnswerHindi: 'वैज्ञानिक दृष्टिकोण हमें रूढ़ियों और अंधविश्वासों से मुक्त करता है तथा तर्क, प्रयोग और प्रमाण के आधार पर सत्य की खोज करना सिखाता है।',
        sampleAnswerEnglish: 'A scientific temper frees us from dogma and superstition, and teaches us to seek truth based on logic, experimentation, and evidence.'
      }
    ]
  },
  {
    id: 'gad_hard',
    titleHindi: 'सांस्कृतिक चेतना, भारतीय साहित्य और नैतिक मूल्यों का द्वंद्व',
    titleEnglish: 'Cultural Consciousness, Indian Literature & Moral Dilemma',
    theme: 'साहित्य, संस्कृति व दर्शन (Literature, Culture & Philosophy)',
    difficulty: 'hard',
    difficultyLabelHindi: 'अत्यंत कठिन (Very Hard)',
    gradeLevel: 'कक्षा 10',
    passageHindi: `किसी भी राष्ट्र की वास्तविक अस्मिता उसकी गगनचुम्बी अट्टालिकाओं अथवा विपुल भौतिक संपदा में नहीं, अपितु उसकी उस शाश्वत सांस्कृतिक चेतना और नैतिक जीवन-दृष्टि में संनिहित होती है, जो युग-युगांतरों के ऐतिहासिक झंझावातों को सहकर भी अक्षुण्ण बनी रहती है। भारतीय मनीषा ने अनादि काल से यह उद्घोष किया है कि ज्ञान का चरम साध्य केवल सूचनाओं का संचय अथवा व्यावहारिक उपयोगितावाद नहीं, प्रत्युत मनुष्य की अंतःचेतना का परिष्कार और उसमें सार्वभौमिक करुणा एवं सत्यनिष्ठा की प्रतिष्ठा है। हमारे उपनिषदों का अमर संदेश ‘आत्मवत् सर्वभूतेषु’ (समस्त प्राणियों को अपने समान देखना) केवल एक दार्शनिक आदर्श मात्र नहीं, अपितु सामाजिक समरसता और पारिस्थितिक संतुलन का आधारभूत स्तम्भ रहा है।

इस सांस्कृतिक विरासत के संवहन में भारतीय साहित्य की भूमिका अद्वितीय रही है। वाल्मीकि के रामायण से लेकर कालिदास, तुलसीदास, कबीर और आधुनिक युग में रवींद्रनाथ ठाकुर तथा प्रेमचंद तक—हमारे मूर्धन्य साहित्यकारों ने केवल कल्पना-विलास नहीं किया, बल्कि समाज के अंतर्विरोधों, मानवीय संवेदनाओं और कर्तव्य-पथ की दुरूहता को वाणी दी। साहित्य समाज का केवल निष्क्रिय दर्पण नहीं है, बल्कि वह एक ऐसा प्रखर मशालची है जो अंधकारमय कालखंडों में भी सत्य, न्याय और मानवीय गरिमा का मार्ग आलोकित करता है। जब किसी समाज में संवेदनहीनता, स्वार्थपरता और नैतिक क्षरण का प्रसार होने लगता है, तब साहित्य ही वह संजीवनी बनकर उभरता है जो मुरझाते मानवीय मूल्यों को नवजीवन प्रदान करता है।

तथापि, इक्कीसवीं सदी के उत्तर-आधुनिक युग में वैश्वीकरण और अनियंत्रित उपभोक्तावादी संस्कृति के तीव्र प्रभाव ने एक गंभीर वैचारिक द्वंद्व उत्पन्न कर दिया है। आज भौतिक सुख-सुविधाओं की अंधी मृगतृष्णा में व्यक्ति अपनी सांस्कृतिक जड़ों और नैतिक दायित्वों से विच्छिन्न होता जा रहा है। तकनीक ने जहाँ दूरियों को मिटाकर सम्पूर्ण विश्व को एक वैश्विक ग्राम में रूपांतरित किया है, वहीं विडंबना यह है कि उसने मानव-मन के मध्य परस्पर आत्मीयता और सह-अस्तित्व की भावना को संकुचित कर दिया है। इस विषम परिस्थिति में हमारी प्राचीन सांस्कृतिक धरोहर और आधुनिक वैज्ञानिक विवेक के मध्य एक संतुलित समन्वय स्थापित करना अपरिहार्य हो गया है। हमें अपनी जड़ों से पोषण प्राप्त करते हुए नवीन क्षितिजों की ओर अग्रसर होना होगा, ताकि विकास का रथ मानवीय संवेदनाओं को कुचलकर आगे न बढ़े।`,
    hindiSummary: `किसी भी राष्ट्र की वास्तविक पहचान उसकी सांस्कृतिक चेतना, करुणा और नैतिक मूल्यों में निहित होती है, जिनका संरक्षण भारतीय साहित्य ने युगों-युगों से किया है। आज उपभोक्तावाद और तकनीकी अलगाव के दौर में हमें अपनी सांस्कृतिक जड़ों और आधुनिक वैज्ञानिक विवेक के बीच संतुलन बनाना होगा।`,
    englishSummary: `A nation\'s quintessential identity resides not in physical infrastructure, but within its timeless cultural ethos and moral equilibrium. Indian philosophical literature—from the Upanishads to Premchand—has served as an active beacon illuminating duty, universal empathy, and human dignity. Faced with post-modern consumerism and technological alienation, civilizational survival hinges upon synthesizing ancient ethical rootedness with modern critical scientific rationalism.`,
    vocabularyList: [
      { word: 'संनिहित (Inherent / Embodied)', meaningHindi: 'अंदर समाया हुआ या निहित', meaningEnglish: 'Embedded / inherent within' },
      { word: 'अक्षुण्ण (Intact / Undivided)', meaningHindi: 'जो कभी नष्ट न हुआ हो, अखंड', meaningEnglish: 'Unbroken / imperishable' },
      { word: 'अंतर्विरोध (Contradiction)', meaningHindi: 'आपसी टकराव या अंतःसंघर्ष', meaningEnglish: 'Internal contradictions / conflicts' },
      { word: 'अपरिहार्य (Inevitable)', meaningHindi: 'जिसका त्याग न किया जा सके, अत्यंत आवश्यक', meaningEnglish: 'Indispensable / unavoidable' }
    ],
    questions: [
      {
        id: 'gq_h1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "गद्यांश के अनुसार किसी राष्ट्र की वास्तविक अस्मिता किसमें संनिहित होती है?",
        questionEnglish: 'According to the passage, where does a nation\'s true identity reside?',
        options: [
          { textHindi: 'सांस्कृतिक चेतना और नैतिक जीवन-दृष्टि में', textEnglish: 'In cultural consciousness and moral worldview' },
          { textHindi: 'विशाल इमारतों और भौतिक संपदा में', textEnglish: 'In skyscrapers and material assets' },
          { textHindi: 'केवल सामरिक हथियारों की संख्या में', textEnglish: 'In sheer military stockpile' },
          { textHindi: 'विदेशी तकनीकों के अंधानुकरण में', textEnglish: 'In blind imitation of foreign tech' }
        ],
        correctIndex: 0,
        explanationHindi: "प्रथम वाक्य स्पष्ट करता है कि राष्ट्र की पहचान भौतिक वैभव में नहीं, अपितु सांस्कृतिक चेतना और नैतिक दृष्टि में है।",
        explanationEnglish: "The opening sentence declares that identity lies in moral worldview rather than buildings."
      },
      {
        id: 'gq_h2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'आत्मवत् सर्वभूतेषु' उपनिषदीय सूत्र का व्यवहारिक मर्म क्या है?",
        questionEnglish: 'What is the practical essence of the Upanishadic maxim \'Atmavat Sarvabhuteshu\'?',
        options: [
          { textHindi: 'समस्त प्राणियों के प्रति समभाव और सार्वभौमिक करुणा रखना', textEnglish: 'Universal empathy and regarding all beings as oneself' },
          { textHindi: 'केवल अपने लाभ और स्वार्थ की चिंता करना', textEnglish: 'Caring solely for personal gain' },
          { textHindi: 'प्रकृति के दोहन को जायज ठहराना', textEnglish: 'Justifying exploitation of nature' },
          { textHindi: 'समाज से अलग-थलग हो जाना', textEnglish: 'Isolating oneself from society' }
        ],
        correctIndex: 0,
        explanationHindi: "'आत्मवत् सर्वभूतेषु' का अर्थ सभी जीवों को अपने समान मानकर करुणा व समरसता से व्यवहार करना है।",
        explanationEnglish: "It commands viewing every sentient life as equivalent to one's own self."
      },
      {
        id: 'gq_h3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "लेखक ने साहित्य की भूमिका को 'निष्क्रिय दर्पण' से परे क्या संज्ञा दी है?",
        questionEnglish: 'Beyond a passive mirror, what title does the author ascribe to literature?',
        options: [
          { textHindi: 'अंधकार में मार्ग आलोकित करने वाला प्रखर मशालची', textEnglish: 'A blazing torchbearer illuminating truth in darkness' },
          { textHindi: 'कोरी कल्पनाओं का काल्पनिक संसार', textEnglish: 'A realm of mere escapist fantasy' },
          { textHindi: 'केवल व्याकरण के नियमों का संग्रह', textEnglish: 'A dry handbook of grammar rules' },
          { textHindi: 'शासकों की प्रशंसा करने वाला माध्यम', textEnglish: 'A tool for flattering monarchs' }
        ],
        correctIndex: 0,
        explanationHindi: "साहित्य केवल दर्पण नहीं, बल्कि कठिन कालखंडों में न्याय और सत्य का मार्ग दिखाने वाला मशालची है।",
        explanationEnglish: "Characterized as a fiery torchbearer charting the path of justice through historical gloom."
      },
      {
        id: 'gq_h4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "आधुनिक तकनीकी क्रांति की विडंबना गद्यांश में क्या बताई गई है?",
        questionEnglish: 'What paradox of modern technological revolution is highlighted?',
        options: [
          { textHindi: 'वैश्विक दूरियाँ घटीं किंतु दिलों की पारस्परिक आत्मीयता संकुचित हुई', textEnglish: 'Geographical distances shrank, yet human warmth and solidarity narrowed' },
          { textHindi: 'संचार के साधनों में भारी कमी आ गई', textEnglish: 'Communication tools decreased' },
          { textHindi: 'लोग केवल पुस्तकें पढ़ने लगे हैं', textEnglish: 'People only read books now' },
          { textHindi: 'प्रकृति का संरक्षण स्वतः हो गया', textEnglish: 'Nature protected itself automatically' }
        ],
        correctIndex: 0,
        explanationHindi: "विश्व एक ग्राम तो बना, किंतु मनुष्यों के बीच भावनात्मक दूरी और अलगाव बढ़ गया।",
        explanationEnglish: "The tragedy of the global village is the shrinkage of inner emotional communion."
      },
      {
        id: 'gq_h5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'अक्षुण्ण' शब्द का सही अर्थ क्या है?",
        questionEnglish: "What is the precise meaning of 'अक्षुण्ण'?",
        options: [
          { textHindi: 'जो कभी खंडित या नष्ट न हुआ हो (Unbroken / Intact)', textEnglish: 'Intact / unbroken' },
          { textHindi: 'जो तुरंत नष्ट हो जाए (Transient)', textEnglish: 'Transient' },
          { textHindi: 'जो बहुत छोटा हो (Minute)', textEnglish: 'Minute' },
          { textHindi: 'जो दिखाई न दे (Invisible)', textEnglish: 'Invisible' }
        ],
        correctIndex: 0,
        explanationHindi: "'अक्षुण्ण' का अर्थ अखंड, सुरक्षित और न टूटने वाला है।",
        explanationEnglish: "'अक्षुण्ण' denotes unassailable wholeness that withstands dissolution."
      },
      {
        id: 'gq_h6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "'सार्वभौमिक' शब्द में मूल शब्द और प्रत्यय का सही युग्म क्या है?",
        questionEnglish: "Identify the root word and suffix in 'सार्वभौमिक':",
        options: [
          { textHindi: 'सर्वभूमि + इक', textEnglish: 'Sarvabhoomi + Ik' },
          { textHindi: 'सार्व + भौमिक', textEnglish: 'Saarva + Bhaumik' },
          { textHindi: 'सर्वभौम + इक', textEnglish: 'Sarvabhaum + Ik' },
          { textHindi: 'सार्वभौम + क', textEnglish: 'Saarvabhaum + K' }
        ],
        correctIndex: 0,
        explanationHindi: "सर्वभूमि (समस्त पृथ्वी) में 'इक' प्रत्यय लगने से आदि स्वर की वृद्धि होकर 'सार्वभौमिक' बनता है।",
        explanationEnglish: "Sarvabhoomi + suffix 'इक' yields vowel lengthening to form Saarvabhaumik."
      },
      {
        id: 'gq_h7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "वर्तमान विषम परिस्थिति में लेखक किस समन्वय को अपरिहार्य मानते हैं?",
        questionEnglish: 'Which synthesis does the author consider indispensable in our era?',
        options: [
          { textHindi: 'प्राचीन सांस्कृतिक धरोहर और आधुनिक वैज्ञानिक विवेक का संतुलन', textEnglish: 'Equilibrium between ancient cultural heritage and modern scientific reason' },
          { textHindi: 'आधुनिकता को त्यागकर केवल प्राचीन काल में लौट जाना', textEnglish: 'Abandoning modernity to retreat solely to antiquity' },
          { textHindi: 'नैतिक मूल्यों को पूरी तरह समाप्त कर देना', textEnglish: 'Discarding moral values altogether' },
          { textHindi: 'केवल उपभोक्तावादी दृष्टिकोण अपनाना', textEnglish: 'Embracing unchecked consumerism' }
        ],
        correctIndex: 0,
        explanationHindi: "लेखक के अनुसार जड़ों (संस्कृति) से जुड़े रहकर वैज्ञानिक विवेक के साथ आगे बढ़ना ही श्रेयस्कर है।",
        explanationEnglish: "Advocates dynamic synthesis: rootedness in ethical tradition coupled with modern empirical wisdom."
      },
      {
        id: 'gq_h8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: "गद्यांश की समग्र शैली और भाषा-प्रकृति कैसी है?",
        questionEnglish: 'What is the overarching stylistic register and tone of the passage?',
        options: [
          { textHindi: 'गंभीर, तत्समप्रधान, वैचारिक एवं उद्बोधक शैली', textEnglish: 'Profound, Sanskritized (Tatsam), contemplative & exhortative' },
          { textHindi: 'हास्य-व्यंग्य प्रधान और बोलचाल की भाषा', textEnglish: 'Colloquial satire' },
          { textHindi: 'विदेशी शब्दों से भरी अनौपचारिक भाषा', textEnglish: 'Slang-laden informal diction' },
          { textHindi: 'रूखी और नीरस तथ्यात्मक रिपोर्ट', textEnglish: 'Dry factual journalism' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश में उच्च स्तरीय तत्सम शब्दावली और चिंतनशील, प्रेरणादायक वैचारिक शैली प्रयुक्त हुई है।",
        explanationEnglish: "Distinguished by classical Tatsam vocabulary and elevated philosophic prose."
      }
    ],
    shortQuestions: [
      {
        id: 'gsq_h1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'समाज में नैतिक क्षरण और स्वार्थपरता बढ़ने पर साहित्य क्या भूमिका निभाता है?',
        questionEnglish: 'What role does literature play when moral decay and selfishness grow in society?',
        sampleAnswerHindi: 'नैतिक क्षरण और संवेदनहीनता के समय साहित्य संजीवनी बनकर उभरता है और मुरझाते मानवीय मूल्यों, सत्य तथा न्याय को नवजीवन प्रदान करता है।',
        sampleAnswerEnglish: 'During times of moral decay and insensitivity, literature emerges as a revitalizing force (Sanjeevani) that revives fading human values, truth, and justice.'
      },
      {
        id: 'gsq_h2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: 'इक्कीसवीं सदी के वैचारिक द्वंद्व से उबरने के लिए लेखक ने किस समन्वय पर बल दिया है?',
        questionEnglish: 'What synthesis does the author emphasize to overcome the ideological dilemma of the 21st century?',
        sampleAnswerHindi: 'लेखक ने अपनी प्राचीन सांस्कृतिक धरोहर व नैतिक जड़ों से जुड़ते हुए आधुनिक वैज्ञानिक विवेक के साथ संतुलित समन्वय स्थापित करने पर बल दिया है।',
        sampleAnswerEnglish: 'The author emphasizes establishing a balanced synthesis between our ancient cultural heritage/ethical roots and modern scientific reason.'
      }
    ]
  }
];

export const PRE_CHECK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pc_1',
    topicId: 'karak',
    topicNameHindi: 'कारक (Karak)',
    topicNameEnglish: 'Case Markers',
    questionHindi: "'मोहन छत से कूद पड़ा।' इस वाक्य में 'छत से' में कौन सा कारक है?",
    questionEnglish: "In 'Mohan jumped from the roof', what karak is 'छत से'?",
    sentenceHindi: 'मोहन छत से कूद पड़ा।',
    sentenceEnglish: 'Mohan jumped from the roof.',
    options: [
      { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak (Separation)' },
      { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak (Instrument)' },
      { textHindi: 'अधिकरण कारक (Place)', textEnglish: 'Adhikaran Karak (Place)' },
      { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak (Object)' }
    ],
    correctIndex: 0,
    explanationHindi: 'छत से कूदने में मोहन का छत से अलगाव (दूरी) हो रहा है, अतः अपादान कारक है।',
    explanationEnglish: 'Jumping off the roof denotes separation from the surface, hence Apadan Karak.'
  },
  {
    id: 'pc_2',
    topicId: 'karak',
    topicNameHindi: 'कारक (Karak)',
    topicNameEnglish: 'Case Markers',
    questionHindi: "'बढ़ई ने आरी से लकड़ी काटी।' में 'आरी से' क्या व्यक्त करता है?",
    questionEnglish: "In 'The carpenter cut wood with a saw', what does 'आरी से' express?",
    sentenceHindi: 'बढ़ई ने आरी से लकड़ी काटी।',
    sentenceEnglish: 'The carpenter cut wood with a saw.',
    options: [
      { textHindi: 'करण कारक (काटने का साधन)', textEnglish: 'Karan Karak (Tool of cutting)' },
      { textHindi: 'अपादान कारक (अलगाव)', textEnglish: 'Apadan Karak (Separation)' },
      { textHindi: 'सम्प्रदान कारक', textEnglish: 'Sampradan Karak' },
      { textHindi: 'सम्बन्ध कारक', textEnglish: 'Sambandh Karak' }
    ],
    correctIndex: 0,
    explanationHindi: 'आरी यहाँ लकड़ी काटने का औजार/साधन है, इसलिए करण कारक है।',
    explanationEnglish: 'The saw is the tool used for cutting, so it is Karan Karak.'
  },
  {
    id: 'pc_3',
    topicId: 'vakya',
    topicNameHindi: 'वाक्य भेद (Vakya Bhed)',
    topicNameEnglish: 'Sentence Structure',
    questionHindi: "'परिश्रम करो ताकि परीक्षा में सफल हो सको।' यह कैसा वाक्य है?",
    questionEnglish: "What type of sentence is 'Work hard so that you can succeed in exams'?",
    options: [
      { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Mishrit Vakya (Complex)' },
      { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Saral Vakya (Simple)' },
      { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Sanyukt Vakya (Compound)' },
      { textHindi: 'विस्मयादिबोधक वाक्य', textEnglish: 'Exclamatory' }
    ],
    correctIndex: 0,
    explanationHindi: "'ताकि' उद्देश्यबोधक योजक है जो आश्रित उपवाक्य को मुख्य उपवाक्य से जोड़ता है।",
    explanationEnglish: "'ताकि' links a purpose subordinate clause, creating a complex sentence."
  },
  {
    id: 'pc_4',
    topicId: 'vachya',
    topicNameHindi: 'वाच्य (Voice)',
    topicNameEnglish: 'Active/Passive Voice',
    questionHindi: "'पक्षी आकाश में उड़ते हैं।' यह किस वाच्य का उदाहरण है?",
    questionEnglish: "What voice is 'Birds fly in the sky'?",
    options: [
      { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Kartrivachya (Active)' },
      { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Karmvachya (Passive)' },
      { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Bhavvachya (Impersonal)' },
      { textHindi: 'मिश्र वाच्य', textEnglish: 'Mixed' }
    ],
    correctIndex: 0,
    explanationHindi: "क्रिया 'उड़ते हैं' कर्ता 'पक्षी' के अनुसार है, अतः कर्तृवाच्य है।",
    explanationEnglish: "The verb 'उड़ते हैं' directly agrees with subject 'पक्षी', hence Active Voice."
  },
  {
    id: 'pc_5',
    topicId: 'kaal',
    topicNameHindi: 'काल (Tense)',
    topicNameEnglish: 'Kaal',
    questionHindi: "'शायद आज शाम को आँधी आए।' में काल का कौन सा भेद है?",
    questionEnglish: "What tense is 'Perhaps a storm might come this evening'?",
    options: [
      { textHindi: 'संभाव्य भविष्यत् (Probable Future)', textEnglish: 'Probable Future' },
      { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple Past' },
      { textHindi: 'अपूर्ण वर्तमान काल (Present Continuous)', textEnglish: 'Present Continuous' },
      { textHindi: 'हेतुहेतुमद् भूतकाल (Conditional Past)', textEnglish: 'Conditional Past' }
    ],
    correctIndex: 0,
    explanationHindi: "'शायद' और 'आए' आने वाले समय में कार्य होने की संभावना व्यक्त कर रहे हैं।",
    explanationEnglish: "'शायद' conveys probability of an event in the upcoming time."
  },
  {
    id: 'pc_6',
    topicId: 'muhavare',
    topicNameHindi: 'मुहावरे (Idioms)',
    topicNameEnglish: 'Muhavare',
    questionHindi: "'अंगूठा दिखाना' मुहावरे का सही अर्थ क्या है?",
    questionEnglish: "What is the meaning of the idiom 'अंगूठा दिखाना'?",
    options: [
      { textHindi: 'साफ मना कर देना या इनकार करना', textEnglish: 'To outright refuse / deny' },
      { textHindi: 'अंगूठे में चोट लगना', textEnglish: 'Hurting the thumb' },
      { textHindi: 'मदद करना', textEnglish: 'To help someone' },
      { textHindi: 'जीत का जश्न मनाना', textEnglish: 'To celebrate victory' }
    ],
    correctIndex: 0,
    explanationHindi: "'अंगूठा दिखाना' का अर्थ ठीक समय पर किसी काम के लिए साफ मना कर देना है।",
    explanationEnglish: "Refusing to assist or deliver at the decisive moment."
  },
  {
    id: 'pc_7',
    topicId: 'upsarg-pratyay',
    topicNameHindi: 'उपसर्ग एवं प्रत्यय',
    topicNameEnglish: 'Prefix & Suffix',
    questionHindi: "'धार्मिक' शब्द में मूल शब्द और प्रत्यय क्या हैं?",
    questionEnglish: "What are the root word and suffix in 'धार्मिक'?",
    options: [
      { textHindi: 'धर्म (मूल शब्द) + इक (प्रत्यय)', textEnglish: 'Dharm (root) + Ik (suffix)' },
      { textHindi: 'धार + मिक', textEnglish: 'Dhaar + Mik' },
      { textHindi: 'धार्मि + क', textEnglish: 'Dharmi + Ka' },
      { textHindi: 'धा + र्मिक', textEnglish: 'Dha + Rmik' }
    ],
    correctIndex: 0,
    explanationHindi: "धर्म + इक = धार्मिक ('इक' प्रत्यय जुड़ने पर पहला स्वर 'अ' बढ़कर 'आ' बन जाता है)।",
    explanationEnglish: "Dharm + Ik = Dharmik (vowel lengthening from 'a' to 'aa' caused by 'इक')."
  },
  {
    id: 'pc_8',
    topicId: 'upsarg-pratyay',
    topicNameHindi: 'उपसर्ग एवं प्रत्यय',
    topicNameEnglish: 'Prefix & Suffix',
    questionHindi: "'अपमान' शब्द में कौन सा उपसर्ग लगा है?",
    questionEnglish: "Which prefix is attached to 'अपमान'?",
    options: [
      { textHindi: 'अप (Ap - विपरीत/बुरा)', textEnglish: 'Ap (Negative/Inverted)' },
      { textHindi: 'अ (A)', textEnglish: 'A' },
      { textHindi: 'अपि (Api)', textEnglish: 'Api' },
      { textHindi: 'मान (Maan)', textEnglish: 'Maan' }
    ],
    correctIndex: 0,
    explanationHindi: "अप + मान = अपमान ('अप' उपसर्ग विपरीत या बुरा अर्थ जोड़ता है)।",
    explanationEnglish: "'अप' is the prefix conveying negation/dishonor to the root word 'मान'."
  },
  {
    id: 'pc_9',
    topicId: 'sandhi-samas',
    topicNameHindi: 'संधि एवं समास',
    topicNameEnglish: 'Sandhi & Compounds',
    questionHindi: "'सूर्योदय' शब्द का सही संधि-विच्छेद क्या है?",
    questionEnglish: "What is the correct sandhi split of 'सूर्योदय'?",
    options: [
      { textHindi: 'सूर्य + उदय (गुण स्वर संधि)', textEnglish: 'Surya + Uday (Gun Sandhi)' },
      { textHindi: 'सूर्यो + दय', textEnglish: 'Suryo + Day' },
      { textHindi: 'सूर्य + दय', textEnglish: 'Surya + Day' },
      { textHindi: 'सूर्या + उदय', textEnglish: 'Suryaa + Uday' }
    ],
    correctIndex: 0,
    explanationHindi: "सूर्य (अ) + उदय (उ) = सूर्योदय ('अ + उ = ओ' गुण स्वर संधि का प्रामाणिक नियम है)।",
    explanationEnglish: "Surya + Uday combines via Gun Sandhi (a + u = o) into Suryoday."
  },
  {
    id: 'pc_10',
    topicId: 'gadyansh',
    topicNameHindi: 'अपठित गद्यांश',
    topicNameEnglish: 'Reading Comprehension',
    questionHindi: "अपठित गद्यांश का उपयुक्त शीर्षक चुनते समय सबसे महत्वपूर्ण बात क्या है?",
    questionEnglish: "What is the most crucial criteria when choosing a title for an unseen passage?",
    options: [
      { textHindi: 'शीर्षक संक्षिप्त हो और संपूर्ण गद्यांश के मूल भाव को व्यक्त करे', textEnglish: 'Title must be concise and capture central theme' },
      { textHindi: 'शीर्षक कम से कम तीन पंक्तियों का होना चाहिए', textEnglish: 'Title must be at least three lines long' },
      { textHindi: 'गद्यांश के किसी भी एक शब्द को आँख बंद करके चुन लेना', textEnglish: 'Arbitrarily picking any word' },
      { textHindi: 'केवल अत्यंत कठिन संस्कृत शब्दों का प्रयोग करना', textEnglish: 'Only using difficult Sanskrit words' }
    ],
    correctIndex: 0,
    explanationHindi: "शीर्षक का मुख्य धर्म है कि वह संक्षिप्त, सटीक, आकर्षक और गद्यांश के केंद्रीय विचार को समेटे।",
    explanationEnglish: "An ideal title is concise, evocative, and synthesizes the core message of the passage."
  }
];

export const SPECIAL_WORKSHEETS: WorksheetItem[] = [
  {
    id: 'ws_karak_upsarg',
    titleHindi: 'वर्कशीट १: कारक व उपसर्ग-प्रत्यय मास्टरशीट (20 प्रश्न)',
    titleEnglish: 'Worksheet 1: Karak & Affixes Master Sheet (20 Questions)',
    costWordCoins: 5,
    descriptionHindi: 'करण-अपादान अलगाव टेस्ट और 20 सबसे महत्वपूर्ण उपसर्ग-प्रत्यय विग्रह।',
    descriptionEnglish: 'Karan vs Apadan separation drill and 20 high-frequency board affix dissections.',
    topicsCovered: ['कारक', 'उपसर्ग', 'प्रत्यय'],
    questionCount: 20,
    isUnlocked: false,
    practiceQuestions: [
      {
        id: 'w1_q1',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'हाथ से गिलास छूट गया।' इसमें 'से' कौन सा कारक है?",
        questionEnglish: "In 'The glass slipped from the hand', what is 'से'?",
        options: [
          { textHindi: 'अपादान कारक (Separation)', textEnglish: 'Apadan Karak' },
          { textHindi: 'करण कारक (Instrument)', textEnglish: 'Karan Karak' },
          { textHindi: 'कर्ता कारक (Doer)', textEnglish: 'Karta Karak' },
          { textHindi: 'कर्म कारक (Object)', textEnglish: 'Karm Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'हाथ से गिलास छूटकर अलग हो रहा है, अतः अपादान है।',
        explanationEnglish: 'Separation from hand indicates Apadan Karak.'
      },
      {
        id: 'w1_q2',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'अति + अंत' के योग से कौन सा शब्द बनेगा?",
        questionEnglish: "What word is formed by 'अति + अंत'?",
        options: [
          { textHindi: 'अत्यंत (Atyant)', textEnglish: 'Atyant (यण् संधि)' },
          { textHindi: 'अतिअंत', textEnglish: 'Atiant' },
          { textHindi: 'अत्यन्तता', textEnglish: 'Atyantata' },
          { textHindi: 'अतांत', textEnglish: 'Ataant' }
        ],
        correctIndex: 0,
        explanationHindi: "यण संधि के नियम से इ + अ = य् बनकर 'अत्यंत' बनता है।",
        explanationEnglish: "Prefix 'अति' + 'अंत' forms 'अत्यंत' via Yan Sandhi."
      },
      {
        id: 'w1_q3',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'राम ने बाण से रावण को मारा।' में 'बाण से' में कौन सा कारक है?",
        questionEnglish: "In 'Ram killed Ravana with an arrow', what is 'बाण से'?",
        options: [
          { textHindi: 'करण कारक (साधन)', textEnglish: 'Karan Karak (Instrument)' },
          { textHindi: 'अपादान कारक (अलगाव)', textEnglish: 'Apadan Karak (Separation)' },
          { textHindi: 'सम्प्रदान कारक', textEnglish: 'Sampradan Karak' },
          { textHindi: 'अधिकरण कारक', textEnglish: 'Adhikaran Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'बाण मारने की क्रिया का साधन है, इसलिए करण कारक है।',
        explanationEnglish: 'The arrow is the instrument used in action, hence Karan Karak.'
      },
      {
        id: 'w1_q4',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'हिमालय से गंगा निकलती है।' वाक्य में कौन सा कारक है?",
        questionEnglish: "What case marker is in 'Ganga emerges from Himalayas'?",
        options: [
          { textHindi: 'अपादान कारक (उत्पत्ति/अलगाव)', textEnglish: 'Apadan Karak (Origin/Separation)' },
          { textHindi: 'करण कारक', textEnglish: 'Karan Karak' },
          { textHindi: 'सम्बन्ध कारक', textEnglish: 'Sambandh Karak' },
          { textHindi: 'कर्ता कारक', textEnglish: 'Karta Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'नदी का पर्वत से निकलना अलगाव और उत्पत्ति स्थल दर्शाता है, अतः अपादान है।',
        explanationEnglish: 'Emergence/detachment from origin point is Apadan Karak.'
      },
      {
        id: 'w1_q5',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'अनुशासन' शब्द में कौन सा उपसर्ग लगा है?",
        questionEnglish: "Which prefix is attached to 'अनुशासन'?",
        options: [
          { textHindi: 'अनु (Anu)', textEnglish: 'Anu' },
          { textHindi: 'अन (An)', textEnglish: 'An' },
          { textHindi: 'अ (A)', textEnglish: 'A' },
          { textHindi: 'शासन (Shasan)', textEnglish: 'Shasan' }
        ],
        correctIndex: 0,
        explanationHindi: "अनु (पीछे/समान) + शासन = अनुशासन।",
        explanationEnglish: "'अनु' prefix joined with root 'शासन'."
      },
      {
        id: 'w1_q6',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'सामाजिक' शब्द में मूल शब्द और प्रत्यय क्या हैं?",
        questionEnglish: "Identify root and suffix in 'सामाजिक':",
        options: [
          { textHindi: 'समाज + इक', textEnglish: 'Samaj + Ik' },
          { textHindi: 'सामाज + इक', textEnglish: 'Saamaj + Ik' },
          { textHindi: 'सम + आजिक', textEnglish: 'Sam + Aajik' },
          { textHindi: 'समाजी + क', textEnglish: 'Samaji + K' }
        ],
        correctIndex: 0,
        explanationHindi: "'समाज' में 'इक' प्रत्यय लगने से प्रारंभिक स्वर 'अ' का 'आ' हो जाता है।",
        explanationEnglish: "'समाज' + 'इक' leads to initial vowel lengthening."
      },
      {
        id: 'w1_q7',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'दुष्कर्म' शब्द में मूल उपसर्ग क्या है?",
        questionEnglish: "What is the primary prefix in 'दुष्कर्म'?",
        options: [
          { textHindi: 'दुस् / दुष् (बुरा)', textEnglish: 'Dus / Dush' },
          { textHindi: 'दु', textEnglish: 'Du' },
          { textHindi: 'दूर', textEnglish: 'Door' },
          { textHindi: 'दोष', textEnglish: 'Dosh' }
        ],
        correctIndex: 0,
        explanationHindi: "संस्कृत उपसर्ग 'दुस्' संधि के कारण 'दुष्' में बदल जाता है।",
        explanationEnglish: "'दुस्' transforms to 'दुष्' before velar consonants."
      },
      {
        id: 'w1_q8',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'घबराहट' शब्द में कौन सा प्रत्यय प्रयुक्त हुआ है?",
        questionEnglish: "Which suffix is used in 'घबराहट'?",
        options: [
          { textHindi: 'आहट (Aahat)', textEnglish: 'Aahat' },
          { textHindi: 'हट (Hat)', textEnglish: 'Hat' },
          { textHindi: 'राहट (Raahat)', textEnglish: 'Raahat' },
          { textHindi: 'ट (T)', textEnglish: 'T' }
        ],
        correctIndex: 0,
        explanationHindi: "घबराना क्रिया में 'आहट' भाववाचक कृत प्रत्यय है।",
        explanationEnglish: "'घबराना' + 'आहट' forms abstract noun 'घबराहट'."
      },
      {
        id: 'w1_q9',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'पेड़ से सेब जमीन पर गिरा।' इस वाक्य में 'पेड़ से' में कारक बताएं:",
        questionEnglish: "What karak is in 'Apple fell from tree to ground'?",
        options: [
          { textHindi: 'अपादान कारक', textEnglish: 'Apadan Karak' },
          { textHindi: 'करण कारक', textEnglish: 'Karan Karak' },
          { textHindi: 'कर्म कारक', textEnglish: 'Karm Karak' },
          { textHindi: 'सम्बोधन कारक', textEnglish: 'Sambodhan Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'पेड़ से सेब का अलगाव (दूरी) हो रहा है, अतः अपादान है।',
        explanationEnglish: 'Separation of the fruit from tree branch is Apadan.'
      },
      {
        id: 'w1_q10',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'बढ़ई ने आरी से सुंदर मेज बनाई।' में 'आरी से' क्या व्यक्त करता है?",
        questionEnglish: "What does 'आरी से' express in 'Carpenter made table with saw'?",
        options: [
          { textHindi: 'करण कारक (साधन)', textEnglish: 'Karan Karak (Tool)' },
          { textHindi: 'अपादान कारक (अलगाव)', textEnglish: 'Apadan Karak' },
          { textHindi: 'सम्प्रदान कारक', textEnglish: 'Sampradan Karak' },
          { textHindi: 'कर्ता कारक', textEnglish: 'Karta Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'आरी निर्माण कार्य का माध्यम व औजार है।',
        explanationEnglish: 'The saw is the tool enabling the crafting action.'
      },
      {
        id: 'w1_q11',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'सुपुत्र' और 'सुगम' में कौन सा उपसर्ग समान है?",
        questionEnglish: "Which prefix is common in 'सुपुत्र' and 'सुगम'?",
        options: [
          { textHindi: 'सु (अच्छा/सरल)', textEnglish: 'Su (Good/Easy)' },
          { textHindi: 'स', textEnglish: 'Sa' },
          { textHindi: 'सुप', textEnglish: 'Sup' },
          { textHindi: 'स्व', textEnglish: 'Swa' }
        ],
        correctIndex: 0,
        explanationHindi: "दोनों में 'सु' (शुभ/अच्छा) उपसर्ग प्रयुक्त हुआ है।",
        explanationEnglish: "'सु' conveys goodness or ease in both words."
      },
      {
        id: 'w1_q12',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'लिखावट' और 'सजावट' में समान प्रत्यय कौन सा है?",
        questionEnglish: "Which suffix is shared between 'लिखावट' and 'सजावट'?",
        options: [
          { textHindi: 'आवट (Aawat)', textEnglish: 'Aawat' },
          { textHindi: 'वट (Wat)', textEnglish: 'Wat' },
          { textHindi: 'टावट (Taawat)', textEnglish: 'Taawat' },
          { textHindi: 'आवा (Aawa)', textEnglish: 'Aawa' }
        ],
        correctIndex: 0,
        explanationHindi: "लिख् + आवट = लिखावट, सजा + आवट = सजावट।",
        explanationEnglish: "Both share the verbal nominal suffix 'आवट'."
      },
      {
        id: 'w1_q13',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'निडर' शब्द में कौन सा उपसर्ग लगा है?",
        questionEnglish: "Which prefix is attached to 'निडर'?",
        options: [
          { textHindi: 'नि (बिना/रहित)', textEnglish: 'Ni (Without)' },
          { textHindi: 'निर', textEnglish: 'Nir' },
          { textHindi: 'नी', textEnglish: 'Nee' },
          { textHindi: 'डर', textEnglish: 'Dar' }
        ],
        correctIndex: 0,
        explanationHindi: "नि (बिना) + डर = निडर (बिना डर वाला)।",
        explanationEnglish: "'नि' prefix means without fear."
      },
      {
        id: 'w1_q14',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'बचपन' शब्द में मूल शब्द और प्रत्यय क्या हैं?",
        questionEnglish: "Identify root and suffix in 'बचपन':",
        options: [
          { textHindi: 'बच्चा + पन', textEnglish: 'Bachha + Pan' },
          { textHindi: 'बच + पन', textEnglish: 'Bach + Pan' },
          { textHindi: 'बचप + न', textEnglish: 'Bachap + Na' },
          { textHindi: 'बा + चपन', textEnglish: 'Ba + Chapan' }
        ],
        correctIndex: 0,
        explanationHindi: "'बच्चा' संज्ञा में 'पन' भाववाचक तद्धित प्रत्यय जुड़ने से 'बचपन' बनता है।",
        explanationEnglish: "Root 'बच्चा' + suffix 'पन' produces abstract noun 'बचपन'."
      },
      {
        id: 'w1_q15',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'अध्यापिका ने कलम से उत्तर पुस्तिका जाँची।' में 'कलम से' कौन सा कारक है?",
        questionEnglish: "What is 'कलम से' in 'Teacher graded copy with pen'?",
        options: [
          { textHindi: 'करण कारक', textEnglish: 'Karan Karak' },
          { textHindi: 'अपादान कारक', textEnglish: 'Apadan Karak' },
          { textHindi: 'कर्म कारक', textEnglish: 'Karm Karak' },
          { textHindi: 'अधिकरण कारक', textEnglish: 'Adhikaran Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'कलम यहाँ कॉपी जाँचने का साधन है, इसलिए करण कारक है।',
        explanationEnglish: 'Pen is the tool of grading, hence Karan Karak.'
      },
      {
        id: 'w1_q16',
        topicId: 'karak',
        topicNameHindi: 'कारक',
        topicNameEnglish: 'Karak',
        questionHindi: "'राजा ने निर्धनों को अन्न दिया।' में 'निर्धनों को' में कौन सा कारक है?",
        questionEnglish: "What case is 'निर्धनों को' in 'King gave grain to the poor'?",
        options: [
          { textHindi: 'सम्प्रदान कारक (दान/देने का भाव)', textEnglish: 'Sampradan Karak (Giving)' },
          { textHindi: 'कर्म कारक', textEnglish: 'Karm Karak' },
          { textHindi: 'करण कारक', textEnglish: 'Karan Karak' },
          { textHindi: 'सम्बन्ध कारक', textEnglish: 'Sambandh Karak' }
        ],
        correctIndex: 0,
        explanationHindi: 'दान देने की क्रिया में जिसे दिया जाए वह सम्प्रदान कारक होता है।',
        explanationEnglish: 'Recipient of charity takes Sampradan Karak.'
      },
      {
        id: 'w1_q17',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'अभिमान' शब्द में कौन सा उपसर्ग है?",
        questionEnglish: "Which prefix is in 'अभिमान'?",
        options: [
          { textHindi: 'अभि (Abhi)', textEnglish: 'Abhi' },
          { textHindi: 'अ (A)', textEnglish: 'A' },
          { textHindi: 'अप (Ap)', textEnglish: 'Ap' },
          { textHindi: 'मान (Maan)', textEnglish: 'Maan' }
        ],
        correctIndex: 0,
        explanationHindi: "अभि + मान = अभिमान।",
        explanationEnglish: "'अभि' is the Sanskrit prefix meaning towards or pride."
      },
      {
        id: 'w1_q18',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'परोपकार' शब्द का सही उपसर्ग विच्छेद क्या है?",
        questionEnglish: "What is the correct prefix split of 'परोपकार'?",
        options: [
          { textHindi: 'पर + उपकार (दूसरों की भलाई)', textEnglish: 'Par + Upkaar' },
          { textHindi: 'परो + पकार', textEnglish: 'Paro + Pkaar' },
          { textHindi: 'प + रोपकार', textEnglish: 'Pa + Ropkaar' },
          { textHindi: 'परा + उपकार', textEnglish: 'Para + Upkaar' }
        ],
        correctIndex: 0,
        explanationHindi: "'पर' (दूसरा) + 'उपकार' = परोपकार (गुण संधि)।",
        explanationEnglish: "'पर' prefix combines with 'उपकार' via Guna Sandhi."
      },
      {
        id: 'w1_q19',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'सज्जन' शब्द में कौन सा उपसर्ग जुड़ा है?",
        questionEnglish: "Which prefix is in 'सज्जन'?",
        options: [
          { textHindi: 'सत् (Sat - अच्छा/सच्चा)', textEnglish: 'Sat (Good/Noble)' },
          { textHindi: 'सज् (Saj)', textEnglish: 'Saj' },
          { textHindi: 'स (Sa)', textEnglish: 'Sa' },
          { textHindi: 'सम (Sam)', textEnglish: 'Sam' }
        ],
        correctIndex: 0,
        explanationHindi: "सत् + जन = सज्जन (व्यंजन संधि से 'त्' का 'ज्' होना)।",
        explanationEnglish: "'सत्' assimilates to 'ज्' before 'जन'."
      },
      {
        id: 'w1_q20',
        topicId: 'upsarg-pratyay',
        topicNameHindi: 'उपसर्ग-प्रत्यय',
        topicNameEnglish: 'Affixes',
        questionHindi: "'चतुरता' शब्द में कौन सा प्रत्यय प्रयुक्त हुआ है?",
        questionEnglish: "What suffix is attached in 'चतुरता'?",
        options: [
          { textHindi: 'ता (Taa - भाववाचक प्रत्यय)', textEnglish: 'Taa (Abstract Suffix)' },
          { textHindi: 'रता (Rataa)', textEnglish: 'Rataa' },
          { textHindi: 'आ (Aa)', textEnglish: 'Aa' },
          { textHindi: 'त (Ta)', textEnglish: 'Ta' }
        ],
        correctIndex: 0,
        explanationHindi: "विशेषण 'चतुर' में 'ता' प्रत्यय लगने से भाववाचक संज्ञा 'चतुरता' बनती है।",
        explanationEnglish: "'ता' attaches to adjective 'चतुर' forming abstract noun."
      }
    ]
  },
  {
    id: 'ws_gadyansh_pro',
    titleHindi: 'वर्कशीट २: अपठित गद्यांश टॉपर सेट (20 प्रश्न)',
    titleEnglish: 'Worksheet 2: Unseen Passage Topper Drill (20 Questions)',
    costWordCoins: 8,
    descriptionHindi: 'बोर्ड स्तर के गहन गद्यांश प्रश्न: सूक्ष्म अर्थग्रहण, शीर्षक चयन तकनीक, संदर्भगत व्याकरण व वैचारिक विश्लेषण।',
    descriptionEnglish: 'Intensive 20-question comprehension drill covering tone analysis, title selection, contextual grammar, and inferences.',
    topicsCovered: ['अपठित गद्यांश', 'शब्दावली', 'व्याकरण विमर्श'],
    questionCount: 20,
    isUnlocked: false,
    practiceQuestions: [
      {
        id: 'w2_q1',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: 'गद्यांश का शीर्षक चुनते समय सबसे महत्वपूर्ण बात क्या है?',
        questionEnglish: 'What is most crucial when selecting a passage title?',
        options: [
          { textHindi: 'शीर्षक संक्षिप्त और पूरे गद्यांश के केंद्रीय भाव को समेटे हो', textEnglish: 'Title must be concise & encapsulate central theme' },
          { textHindi: 'शीर्षक बहुत लंबा होना चाहिए', textEnglish: 'Title should be very long' },
          { textHindi: 'केवल अंतिम पंक्ति से चुनना चाहिए', textEnglish: 'Pick only from last line' },
          { textHindi: 'शीर्षक अंग्रेजी में होना चाहिए', textEnglish: 'Should be in English' }
        ],
        correctIndex: 0,
        explanationHindi: 'शीर्षक संक्षिप्त, आकर्षक और केंद्रीय विचार का परिचायक होना चाहिए।',
        explanationEnglish: 'A good title encapsulates the core thesis concisely.'
      },
      {
        id: 'w2_q2',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: 'गद्यांश को हल करने की सर्वोत्तम विधि क्या है?',
        questionEnglish: 'What is the best methodology to solve an unseen passage?',
        options: [
          { textHindi: 'पहले प्रश्नों को सरसरी तौर पर पढ़ना फिर एकाग्रता से गद्यांश पढ़ना', textEnglish: 'Skim questions first then read passage with focus' },
          { textHindi: 'गद्यांश पढ़े बिना सीधे उत्तर लगाना', textEnglish: 'Guessing answers without reading' },
          { textHindi: 'केवल पहली पंक्ति पढ़कर उत्तर लिख देना', textEnglish: 'Writing answer from first line only' },
          { textHindi: 'कठिन शब्दों को छोड़ देना', textEnglish: 'Skipping hard words' }
        ],
        correctIndex: 0,
        explanationHindi: 'प्रश्नों को पहले देख लेने से गद्यांश पढ़ते समय मुख्य संकेत तुरंत मिल जाते हैं।',
        explanationEnglish: 'Previewing questions activates target-oriented reading.'
      },
      {
        id: 'w2_q3',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'संदर्भगत अर्थ' (Contextual Meaning) से क्या तात्पर्य है?",
        questionEnglish: "What does 'Contextual Meaning' mean?",
        options: [
          { textHindi: 'वाक्य और प्रसंग के अनुसार शब्द का जो विशेष अर्थ निकले', textEnglish: 'The specific meaning a word takes within sentence context' },
          { textHindi: 'डिक्शनरी का केवल पहला अर्थ', textEnglish: 'Only first dictionary entry' },
          { textHindi: 'शब्द का विलोम शब्द', textEnglish: 'Antonym of the word' },
          { textHindi: 'शब्द का तुकबंदी रूप', textEnglish: 'Rhyming form' }
        ],
        correctIndex: 0,
        explanationHindi: 'कई शब्दों के अनेक अर्थ होते हैं, गद्यांश में वाक्य के संदर्भ से सही अर्थ तय होता है।',
        explanationEnglish: 'Words derive situated nuances based on sentence structure.'
      },
      {
        id: 'w2_q4',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "यदि गद्यांश में 'अविस्मरणीय' शब्द आए, तो इसका अर्थ क्या होगा?",
        questionEnglish: "What does 'अविस्मरणीय' signify?",
        options: [
          { textHindi: 'जिसे कभी भुलाया न जा सके (Unforgettable)', textEnglish: 'Unforgettable' },
          { textHindi: 'जिसे आसानी से भुला दिया जाए', textEnglish: 'Easily forgotten' },
          { textHindi: 'याददाश्त खो जाना', textEnglish: 'Loss of memory' },
          { textHindi: 'बहुत डरावना', textEnglish: 'Terrifying' }
        ],
        correctIndex: 0,
        explanationHindi: "अ + विस्मरण + ईय = जिसे विस्मृत (भुलाया) न किया जा सके।",
        explanationEnglish: "Denotes something deeply memorable that cannot be forgotten."
      },
      {
        id: 'w2_q5',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: 'गद्यांश में लेखक का मुख्य उद्देश्य पहचानने के लिए क्या देखना चाहिए?',
        questionEnglish: 'What should be examined to identify the author’s primary purpose?',
        options: [
          { textHindi: 'गद्यांश का निष्कर्ष और बार-बार दोहराया गया केंद्रीय विचार', textEnglish: 'The conclusion and recurring core philosophy' },
          { textHindi: 'पैराग्राफ की कुल संख्या', textEnglish: 'Total paragraph count' },
          { textHindi: 'अक्षर किस रंग में छपे हैं', textEnglish: 'Color of text' },
          { textHindi: 'लेखक की उम्र', textEnglish: 'Author’s age' }
        ],
        correctIndex: 0,
        explanationHindi: 'अंतिम पैराग्राफ और निष्कर्ष में लेखक का संदेश स्पष्ट रूप से झलकता है।',
        explanationEnglish: 'The overarching argument and concluding synthesis convey the purpose.'
      },
      {
        id: 'w2_q6',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'पर्यावरण' शब्द का सही विच्छेद क्या है?",
        questionEnglish: "What is the correct split of 'पर्यावरण'?",
        options: [
          { textHindi: 'परि + आवरण', textEnglish: 'Pari + Aavaran' },
          { textHindi: 'पर्या + वरण', textEnglish: 'Parya + Varan' },
          { textHindi: 'पर + आवरण', textEnglish: 'Par + Aavaran' },
          { textHindi: 'परी + आवरण', textEnglish: 'Paree + Aavaran' }
        ],
        correctIndex: 0,
        explanationHindi: "परि (चारों ओर) + आवरण (घेरा) = पर्यावरण।",
        explanationEnglish: "'परि' + 'आवरण' joins via Yan Sandhi to form 'पर्यावरण'."
      },
      {
        id: 'w2_q7',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "गद्यांश में 'सद्भावना' शब्द का विलोम क्या होगा?",
        questionEnglish: "What is the antonym of 'सद्भावना'?",
        options: [
          { textHindi: 'दुर्भावना (Ill will / Malice)', textEnglish: 'Durbhavna (Malice)' },
          { textHindi: 'अभावना', textEnglish: 'Abhavna' },
          { textHindi: 'कुभावना', textEnglish: 'Kubhavna' },
          { textHindi: 'निद्भावना', textEnglish: 'Nidbhavna' }
        ],
        correctIndex: 0,
        explanationHindi: "सद्भावना (अच्छी भावना) का विपरीत दुर्भावना (बुरी भावना) होता है।",
        explanationEnglish: "'सद्भावना' opposes 'दुर्भावना'."
      },
      {
        id: 'w2_q8',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'अनुशासनहीनता' शब्द में मूल शब्द क्या है?",
        questionEnglish: "What is the root word in 'अनुशासनहीनता'?",
        options: [
          { textHindi: 'शासन (Shasan)', textEnglish: 'Shasan' },
          { textHindi: 'अनु (Anu)', textEnglish: 'Anu' },
          { textHindi: 'हीन (Heen)', textEnglish: 'Heen' },
          { textHindi: 'ता (Taa)', textEnglish: 'Taa' }
        ],
        correctIndex: 0,
        explanationHindi: "'शासन' मूल शब्द है जिसमें 'अनु' उपसर्ग तथा 'हीन' व 'ता' प्रत्यय जुड़े हैं।",
        explanationEnglish: "'शासन' is the core root noun."
      },
      {
        id: 'w2_q9',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "यदि लेखक किसी सामाजिक समस्या की आलोचना कर रहा हो तो गद्यांश की शैली कैसी होगी?",
        questionEnglish: "What tone is used when criticizing a societal issue?",
        options: [
          { textHindi: 'आलोचनात्मक एवं विश्लेषणात्मक शैली', textEnglish: 'Critical & analytical tone' },
          { textHindi: 'हास्य-व्यंग्य शैली', textEnglish: 'Comic tone' },
          { textHindi: 'काव्यात्मक शैली', textEnglish: 'Poetic tone' },
          { textHindi: 'उदासीन शैली', textEnglish: 'Apathetic tone' }
        ],
        correctIndex: 0,
        explanationHindi: 'समस्या के कारणों व परिणामों का मूल्यांकन आलोचनात्मक शैली में होता है।',
        explanationEnglish: 'Evaluating systemic challenges reflects a critical/analytical stance.'
      },
      {
        id: 'w2_q10',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'आत्मनिर्भर' शब्द में कौन सा समास है?",
        questionEnglish: "Which compound (Samas) is in 'आत्मनिर्भर'?",
        options: [
          { textHindi: 'तत्पुरुष समास (आत्म पर निर्भर - अधिकरण तत्पुरुष)', textEnglish: 'Tatpurush Samas' },
          { textHindi: 'द्विगु समास', textEnglish: 'Dvigu Samas' },
          { textHindi: 'द्वंद्व समास', textEnglish: 'Dvandva Samas' },
          { textHindi: 'कर्मधारय समास', textEnglish: 'Karmadharaya Samas' }
        ],
        correctIndex: 0,
        explanationHindi: "'स्वयं पर निर्भर' में 'पर' अधिकरण कारक विभक्ति का लोप होने से तत्पुरुष है।",
        explanationEnglish: "Suppression of case marker 'पर' indicates Adhikaran Tatpurush."
      },
      {
        id: 'w2_q11',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'अमूल्य' शब्द में 'अ' किस अर्थ में प्रयुक्त हुआ है?",
        questionEnglish: "In 'अमूल्य', what meaning does prefix 'अ' carry?",
        options: [
          { textHindi: 'जिसका कोई मूल्य न आँका जा सके (अति कीमती)', textEnglish: 'Priceless / beyond price' },
          { textHindi: 'बिना मूल्य का (सस्ता)', textEnglish: 'Worthless' },
          { textHindi: 'बहुत बुरा', textEnglish: 'Very bad' },
          { textHindi: 'कम मूल्य वाला', textEnglish: 'Cheap' }
        ],
        correctIndex: 0,
        explanationHindi: "'अमूल्य' का अर्थ अनमोल या अत्यंत कीमती होता है जिसका मोल न लगाया जा सके।",
        explanationEnglish: "Connotes pricelessness rather than worthlessness."
      },
      {
        id: 'w2_q12',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "गद्यांश के प्रश्नों के उत्तर देते समय अपनी राय कब देनी चाहिए?",
        questionEnglish: "When should personal opinion be given in comprehension answers?",
        options: [
          { textHindi: "केवल तभी जब प्रश्न में स्पष्ट रूप से 'आपके विचार से' पूछा गया हो", textEnglish: 'Only when question explicitly prompts for your view' },
          { textHindi: 'हमेशा अपनी मनमर्जी से उत्तर लिखना चाहिए', textEnglish: 'Always write whatever you think' },
          { textHindi: 'गद्यांश की बातों को नकार कर', textEnglish: 'By rejecting passage facts' },
          { textHindi: 'कभी नहीं', textEnglish: 'Never' }
        ],
        correctIndex: 0,
        explanationHindi: 'अपठित गद्यांश के उत्तर सदैव गद्यांश में दिए गए तथ्यों पर आधारित होने चाहिए।',
        explanationEnglish: 'Comprehension strictly tests text-based evidence unless asked otherwise.'
      },
      {
        id: 'w2_q13',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'निरंतर' शब्द का सही समानार्थी क्या है?",
        questionEnglish: "What is the correct synonym of 'निरंतर'?",
        options: [
          { textHindi: 'सतत / लगातार (Continuous)', textEnglish: 'Continuous / incessant' },
          { textHindi: 'रुक-रुक कर', textEnglish: 'Intermittent' },
          { textHindi: 'कभी-कभी', textEnglish: 'Rarely' },
          { textHindi: 'धीमा', textEnglish: 'Slow' }
        ],
        correctIndex: 0,
        explanationHindi: "'निरंतर' का अर्थ बिना रुके लगातार या सतत चलना है।",
        explanationEnglish: "Synonymous with continuous or perpetual."
      },
      {
        id: 'w2_q14',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'अनेकता में एकता' का वैचारिक संदेश क्या है?",
        questionEnglish: "What is the philosophical essence of 'Unity in Diversity'?",
        options: [
          { textHindi: 'विभिन्नताओं के बावजूद परस्पर सामंजस्य और प्रेम', textEnglish: 'Mutual harmony despite diverse identities' },
          { textHindi: 'सबको एक जैसा बना देना', textEnglish: 'Making everyone identical' },
          { textHindi: 'भेदभाव बढ़ाना', textEnglish: 'Promoting discrimination' },
          { textHindi: 'अकेले रहना', textEnglish: 'Living alone' }
        ],
        correctIndex: 0,
        explanationHindi: 'यह भारतीय संस्कृति की मूल भावना है जहाँ विविधता में समरसता है।',
        explanationEnglish: 'Encapsulates social cohesion and multicultural harmony.'
      },
      {
        id: 'w2_q15',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'स्वाध्याय' शब्द का संधि विच्छेद क्या है?",
        questionEnglish: "What is the sandhi split of 'स्वाध्याय'?",
        options: [
          { textHindi: 'स्व + अध्याय', textEnglish: 'Swa + Adhyaya' },
          { textHindi: 'स्वा + ध्याय', textEnglish: 'Swaa + Dhyaya' },
          { textHindi: 'सु + अध्याय', textEnglish: 'Su + Adhyaya' },
          { textHindi: 'स्वय + अध्याय', textEnglish: 'Sway + Adhyaya' }
        ],
        correctIndex: 0,
        explanationHindi: "स्व (स्वयं) + अध्याय (अध्ययन) = स्वाध्याय (दीर्घ स्वर संधि)।",
        explanationEnglish: "'स्व' + 'अध्याय' forms 'स्वाध्याय' via Deergh Sandhi."
      },
      {
        id: 'w2_q16',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'परिश्रम का फल मीठा होता है' वाक्य में कौन सा भाव प्रमुख है?",
        questionEnglish: "What emotion is central in 'Fruit of hard work is sweet'?",
        options: [
          { textHindi: 'कर्म और सफलता का सकारात्मक संबंध', textEnglish: 'Positive link between diligence & success' },
          { textHindi: 'आलस्य का समर्थन', textEnglish: 'Endorsing laziness' },
          { textHindi: 'केवल भाग्य पर भरोसा', textEnglish: 'Relying only on luck' },
          { textHindi: 'निराशावाद', textEnglish: 'Pessimism' }
        ],
        correctIndex: 0,
        explanationHindi: 'यह सूक्ति मेहनत और उसके सुखद परिणाम को रेखांकित करती है।',
        explanationEnglish: 'Reiterates that persistent effort yields rewarding outcomes.'
      },
      {
        id: 'w2_q17',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "गद्यांश में 'सर्वतोमुखी' शब्द का क्या अर्थ है?",
        questionEnglish: "What does 'सर्वतोमुखी' mean in textual context?",
        options: [
          { textHindi: 'सब दिशाओं या सब क्षेत्रों में होने वाला (All-round)', textEnglish: 'All-round / multifaceted' },
          { textHindi: 'केवल एक तरफ देखना', textEnglish: 'One-sided' },
          { textHindi: 'चेहरा घुमाना', textEnglish: 'Turning face' },
          { textHindi: 'पीछे हटना', textEnglish: 'Retreating' }
        ],
        correctIndex: 0,
        explanationHindi: "'सर्वतोमुखी विकास' का अर्थ चारों ओर से चौमुखी सर्वांगीण उन्नति है।",
        explanationEnglish: "Refers to holistic, multifaceted expansion across all facets."
      },
      {
        id: 'w2_q18',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'सहिष्णुता' शब्द का सही अर्थ क्या है?",
        questionEnglish: "What is the accurate meaning of 'सहिष्णुता'?",
        options: [
          { textHindi: 'सहनशीलता और दूसरों के विचारों का आदर (Tolerance)', textEnglish: 'Tolerance & respecting diverse opinions' },
          { textHindi: 'लड़ाई-झगड़ा करना', textEnglish: 'Fighting' },
          { textHindi: 'गुस्सा दिखाना', textEnglish: 'Showing anger' },
          { textHindi: 'चुपचाप भाग जाना', textEnglish: 'Running away' }
        ],
        correctIndex: 0,
        explanationHindi: 'सहिष्णुता सामाजिक सद्भाव और लोकतंत्र का अनिवार्य गुण है।',
        explanationEnglish: 'Denotes patience, broadminded forbearance, and mutual respect.'
      },
      {
        id: 'w2_q19',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "'अतिशयोक्ति' से लेखक का क्या आशय होता है?",
        questionEnglish: "What does 'अतिशयोक्ति' (Hyperbole) denote?",
        options: [
          { textHindi: 'किसी बात को बहुत बढ़ा-चढ़ाकर कहना (Hyperbole)', textEnglish: 'Exaggerating a statement beyond reality' },
          { textHindi: 'सच बोलना', textEnglish: 'Speaking truth' },
          { textHindi: 'संक्षिप्त में कहना', textEnglish: 'Summarizing' },
          { textHindi: 'कम बोलना', textEnglish: 'Speaking less' }
        ],
        correctIndex: 0,
        explanationHindi: "अतिशय + उक्ति = मर्यादा से अधिक बढ़ा-चढ़ाकर कही गई बात।",
        explanationEnglish: "Rhetorical exaggeration for literary or emotional effect."
      },
      {
        id: 'w2_q20',
        topicId: 'gadyansh',
        topicNameHindi: 'गद्यांश कौशल',
        topicNameEnglish: 'Reading Skills',
        questionHindi: "गद्यांश का सार संक्षेप (Précis) लिखते समय मूल गद्यांश का कितना भाग होना चाहिए?",
        questionEnglish: "What fraction of the original passage should a précis be?",
        options: [
          { textHindi: 'लगभग एक-तिहाई (One-third) भाग', textEnglish: 'Approximately one-third' },
          { textHindi: 'आधा (Half)', textEnglish: 'Half' },
          { textHindi: 'दोगुना (Double)', textEnglish: 'Double' },
          { textHindi: 'केवल दो शब्द', textEnglish: 'Only two words' }
        ],
        correctIndex: 0,
        explanationHindi: 'संक्षेपण का मानक नियम है कि वह मूल गद्यांश का लगभग 1/3 भाग हो और अपनी भाषा में हो।',
        explanationEnglish: 'A standard précis condenses core facts to roughly 1/3rd the length.'
      }
    ]
  },
  {
    id: 'ws_vachya_vakya',
    titleHindi: 'वर्कशीट ३: वाच्य व वाक्य-भेद स्पीडशीट (20 प्रश्न)',
    titleEnglish: 'Worksheet 3: Voice & Sentence Types SpeedSheet (20 Questions)',
    costWordCoins: 10,
    descriptionHindi: 'बोर्ड स्तर के 20 त्वरित प्रश्न: कर्तृवाच्य ↔ कर्मवाच्य, सरल ↔ संयुक्त ↔ मिश्र वाक्य रूपांतरण।',
    descriptionEnglish: '20 board-level speed drills: Active to Passive voice and Simple to Compound/Complex sentence conversions.',
    topicsCovered: ['वाच्य', 'वाक्य भेद'],
    questionCount: 20,
    isUnlocked: false,
    practiceQuestions: [
      {
        id: 'w3_q1',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'मुझसे अब चला नहीं जाता।' यह किस वाच्य का उदाहरण है?",
        questionEnglish: "In 'I am unable to walk any further', what voice is this?",
        options: [
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Bhavvachya' },
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Kartrivachya' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Karmvachya' },
          { textHindi: 'कोई नहीं (None)', textEnglish: 'None' }
        ],
        correctIndex: 0,
        explanationHindi: 'अकर्मक क्रिया में असमर्थता का भाव होने के कारण यह भाववाच्य है।',
        explanationEnglish: 'Intransitive verb conveying inability makes it Bhavvachya.'
      },
      {
        id: 'w3_q2',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'अमित ने सुंदर चित्र बनाया।' का कर्मवाच्य रूप क्या होगा?",
        questionEnglish: "What is the passive form of 'Amit drew a beautiful picture'?",
        options: [
          { textHindi: 'अमित द्वारा सुंदर चित्र बनाया गया।', textEnglish: 'A beautiful picture was drawn by Amit.' },
          { textHindi: 'अमित चित्र बना रहा है।', textEnglish: 'Amit is drawing.' },
          { textHindi: 'अमित से चित्र नहीं बनता।', textEnglish: 'Amit cannot draw.' },
          { textHindi: 'अमित चित्र बनाएगा।', textEnglish: 'Amit will draw.' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्ता के साथ 'द्वारा' जोड़कर क्रिया को कर्म के अनुसार बदला गया है।",
        explanationEnglish: "Subject is coupled with 'द्वारा' and verb agrees with the picture (object)."
      },
      {
        id: 'w3_q3',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'सूर्योदय हुआ और पक्षी चहचहाने लगे।' यह किस प्रकार का वाक्य है?",
        questionEnglish: "What type of sentence is 'The sun rose and birds began to chirp'?",
        options: [
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound Sentence' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple Sentence' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex Sentence' },
          { textHindi: 'संदेहात्मक वाक्य', textEnglish: 'Doubtful Sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "दो स्वतंत्र उपवाक्य 'और' समुच्चयबोधक से जुड़े हैं, अतः यह संयुक्त वाक्य है।",
        explanationEnglish: "Two independent clauses joined by 'और' (and) form a compound sentence."
      },
      {
        id: 'w3_q4',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'जो विद्यार्थी कठिन परिश्रम करता है, वह अवश्य सफल होता है।' यह कैसा वाक्य है?",
        questionEnglish: "What type of sentence is 'The student who works hard certainly succeeds'?",
        options: [
          { textHindi: 'मिश्र वाक्य (Complex Sentence)', textEnglish: 'Complex Sentence' },
          { textHindi: 'सरल वाक्य (Simple Sentence)', textEnglish: 'Simple Sentence' },
          { textHindi: 'संयुक्त वाक्य (Compound Sentence)', textEnglish: 'Compound Sentence' },
          { textHindi: 'विस्मयादिबोधक वाक्य', textEnglish: 'Exclamatory Sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "'जो... वह' के कारण मुख्य उपवाक्य पर आश्रित उपवाक्य जुड़ा है, अतः यह मिश्र वाक्य है।",
        explanationEnglish: "Uses correlatives 'जो... वह' where the dependent clause relies on the principal clause."
      },
      {
        id: 'w3_q5',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'पक्षी आकाश में उड़ते हैं।' यह किस वाच्य का वाक्य है?",
        questionEnglish: "In 'Birds fly in the sky', what voice is used?",
        options: [
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active Voice' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive Voice' },
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal Voice' },
          { textHindi: 'मिश्रवाच्य', textEnglish: 'Mixed Voice' }
        ],
        correctIndex: 0,
        explanationHindi: "क्रिया का लिंग व वचन कर्ता ('पक्षी') के अनुसार है, अतः कर्तृवाच्य है।",
        explanationEnglish: 'The verb directly agrees in gender and number with the subject (birds).'
      },
      {
        id: 'w3_q6',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'प्रातःकाल टहलने वाले लोग स्वस्थ रहते हैं।' वाक्य का प्रकार क्या है?",
        questionEnglish: "What is the sentence type of 'People who walk in morning stay healthy'?",
        options: [
          { textHindi: 'सरल वाक्य (Simple Sentence)', textEnglish: 'Simple Sentence' },
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound Sentence' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex Sentence' },
          { textHindi: 'आज्ञावाचक वाक्य', textEnglish: 'Imperative Sentence' }
        ],
        correctIndex: 0,
        explanationHindi: 'इसमें केवल एक मुख्य उद्देश्य (लोग) और एक समापिका क्रिया (रहते हैं) है।',
        explanationEnglish: 'It contains a single subject and a single finite verb, making it Simple.'
      },
      {
        id: 'w3_q7',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'माली द्वारा पौधों को पानी दिया गया।' का कर्तृवाच्य क्या होगा?",
        questionEnglish: "What is active voice for 'Plants were watered by gardener'?",
        options: [
          { textHindi: 'माली ने पौधों को पानी दिया।', textEnglish: 'Gardener watered the plants.' },
          { textHindi: 'माली पानी दे रहा होगा।', textEnglish: 'Gardener might be watering.' },
          { textHindi: 'माली से पानी नहीं दिया जाता।', textEnglish: 'Gardener cannot water.' },
          { textHindi: 'माली पौधे लगाएगा।', textEnglish: 'Gardener will plant.' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्ता 'माली' को मुख्य बनाकर सामान्य भूतकाल क्रिया 'पानी दिया' लगाई गई।",
        explanationEnglish: "Removes 'द्वारा' and formats the active subject directly with 'ने'."
      },
      {
        id: 'w3_q8',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'घंटी बजी और सभी बच्चे कक्षा में चले गए।' वाक्य का भेद बताएं:",
        questionEnglish: "State the sentence type: 'The bell rang and all children went into the class.'",
        options: [
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple' },
          { textHindi: 'इच्छावाचक वाक्य', textEnglish: 'Optative' }
        ],
        correctIndex: 0,
        explanationHindi: "योजक शब्द 'और' दो पूर्ण उपवाक्यों को जोड़ रहा है।",
        explanationEnglish: "Conjunction 'और' coordinates two independent complete clauses."
      },
      {
        id: 'w3_q9',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'दादी जी से अब ऊँचा सुना जाता है।' में कौन सा वाच्य है?",
        questionEnglish: "Which voice is present in this sentence?",
        options: [
          { textHindi: 'भाववाच्य (Bhavvachya)', textEnglish: 'Impersonal Voice' },
          { textHindi: 'कर्मवाच्य (Karmvachya)', textEnglish: 'Passive Voice' },
          { textHindi: 'कर्तृवाच्य (Kartrivachya)', textEnglish: 'Active Voice' },
          { textHindi: 'उपरोक्त कोई नहीं', textEnglish: 'None of above' }
        ],
        correctIndex: 0,
        explanationHindi: 'शारीरिक स्थिति अथवा असमर्थता का भाव प्रधान होने से भाववाच्य है।',
        explanationEnglish: 'Focuses on the state/capacity rather than doer or object.'
      },
      {
        id: 'w3_q10',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'जब वर्षा रुकी, तब हम सब घर से बाहर निकले।' यह कैसा वाक्य है?",
        questionEnglish: "What type of sentence is 'When rain stopped, then we all went out'?",
        options: [
          { textHindi: 'मिश्र वाक्य (Complex Sentence)', textEnglish: 'Complex Sentence' },
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple' },
          { textHindi: 'निषेधवाचक वाक्य', textEnglish: 'Negative Sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "'जब... तब' कालवाचक क्रिया-विशेषण आश्रित उपवाक्य मिश्र वाक्य बनाते हैं।",
        explanationEnglish: "'जब... तब' time-correlatives link dependent clause to principal clause."
      },
      {
        id: 'w3_q11',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'कवि ने सुंदर कविता सुनाई।' का कर्मवाच्य रूपांतरण क्या है?",
        questionEnglish: "What is the passive conversion for 'Poet recited a beautiful poem'?",
        options: [
          { textHindi: 'कवि द्वारा सुंदर कविता सुनाई गई।', textEnglish: 'A poem was recited by poet.' },
          { textHindi: 'कवि से कविता नहीं सुनाई जाती।', textEnglish: 'Poet cannot recite poem.' },
          { textHindi: 'कवि कविता सुना रहा था।', textEnglish: 'Poet was reciting poem.' },
          { textHindi: 'कवि कविता सुनाएगा।', textEnglish: 'Poet will recite poem.' }
        ],
        correctIndex: 0,
        explanationHindi: "कर्म 'कविता' (स्त्रीलिंग) के अनुसार क्रिया 'सुनाई गई' बनी।",
        explanationEnglish: "Verb inflects feminine to match object 'कविता'."
      },
      {
        id: 'w3_q12',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'वह परिश्रमी ही नहीं, बल्कि दयालु भी है।' वाक्य का प्रकार बताएं:",
        questionEnglish: "State the sentence type: 'He is not only hardworking, but also kind.'",
        options: [
          { textHindi: 'संयुक्त वाक्य (Compound)', textEnglish: 'Compound' },
          { textHindi: 'मिश्र वाक्य (Complex)', textEnglish: 'Complex' },
          { textHindi: 'सरल वाक्य (Simple)', textEnglish: 'Simple' },
          { textHindi: 'प्रश्नवाचक वाक्य', textEnglish: 'Interrogative' }
        ],
        correctIndex: 0,
        explanationHindi: "'बल्कि' योजक दो समान स्तर के कथनों को जोड़ रहा है, अतः संयुक्त वाक्य है।",
        explanationEnglish: "Coordinating conjunction 'बल्कि' links two balanced statements."
      },
      {
        id: 'w3_q13',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'बच्चा रात भर रोता रहा।' का भाववाच्य रूप क्या बनेगा?",
        questionEnglish: "What is the impersonal voice form of 'The baby cried all night'?",
        options: [
          { textHindi: 'बच्चे से रात भर रोया गया।', textEnglish: 'The crying was done by the baby all night.' },
          { textHindi: 'बच्चा रो रहा है।', textEnglish: 'Baby is crying.' },
          { textHindi: 'बच्चा रात भर सोएगा।', textEnglish: 'Baby will sleep all night.' },
          { textHindi: 'बच्चे द्वारा रोना रोका गया।', textEnglish: 'Crying was stopped.' }
        ],
        correctIndex: 0,
        explanationHindi: "अकर्मक क्रिया 'रोना' का भाववाच्य 'बच्चे से रोया गया' बनता है।",
        explanationEnglish: "Intransitive verb 'रोना' inflects into impersonal past form with 'से'."
      },
      {
        id: 'w3_q14',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'अध्यापक ने कहा कि कल विद्यालय में अवकाश रहेगा।' में आश्रित उपवाक्य कौन सा है?",
        questionEnglish: "Which is the dependent clause in 'Teacher said that tomorrow will be a school holiday'?",
        options: [
          { textHindi: 'कल विद्यालय में अवकाश रहेगा (संज्ञा उपवाक्य)', textEnglish: 'Tomorrow will be holiday (Noun clause)' },
          { textHindi: 'अध्यापक ने कहा (प्रधान उपवाक्य)', textEnglish: 'Teacher said (Principal clause)' },
          { textHindi: 'विद्यालय में (अधिकरण)', textEnglish: 'In the school' },
          { textHindi: 'कोई नहीं', textEnglish: 'None' }
        ],
        correctIndex: 0,
        explanationHindi: "'कि' से प्रारंभ होने वाला उपवाक्य संज्ञा आश्रित उपवाक्य कहलाता है।",
        explanationEnglish: "Clause introduced by 'कि' functions as a Noun Dependent Clause."
      },
      {
        id: 'w3_q15',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'चलो, अब सोया जाए।' यह वाक्य किस वाच्य का उदाहरण है?",
        questionEnglish: "What voice is used in 'Come, let us sleep now'?",
        options: [
          { textHindi: 'भाववाच्य (Bhavvachya)', textEnglish: 'Impersonal Voice' },
          { textHindi: 'कर्मवाच्य (Karmvachya)', textEnglish: 'Passive Voice' },
          { textHindi: 'कर्तृवाच्य (Kartrivachya)', textEnglish: 'Active Voice' },
          { textHindi: 'अनिश्चयवाच्य', textEnglish: 'Indefinite Voice' }
        ],
        correctIndex: 0,
        explanationHindi: "अकर्मक क्रिया 'सोना' में अनुमति या सुझाव का भाव होने के कारण भाववाच्य है।",
        explanationEnglish: "Impersonal suggestion with intransitive verb 'सोना' signifies Bhavvachya."
      },
      {
        id: 'w3_q16',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'कक्षा में प्रथम आने वाले छात्र को पुरस्कृत किया जाएगा।' का मिश्र वाक्य रूपांतरण क्या होगा?",
        questionEnglish: "What is the complex sentence form of 'The student who stands first in class will be awarded'?",
        options: [
          { textHindi: 'जो छात्र कक्षा में प्रथम आएगा, उसे पुरस्कृत किया जाएगा।', textEnglish: 'The student who stands first in class will be awarded.' },
          { textHindi: 'छात्र प्रथम आया और उसे पुरस्कार मिला।', textEnglish: 'Student came first and got award.' },
          { textHindi: 'छात्र को प्रथम आने पर इनाम दो।', textEnglish: 'Give prize on coming first.' },
          { textHindi: 'यदि छात्र पढ़ता तो प्रथम आता।', textEnglish: 'Had student studied he would come first.' }
        ],
        correctIndex: 0,
        explanationHindi: "'जो... उसे' नित्य-संबंधी सर्वनामों से मुख्य उपवाक्य पर आश्रित विशेषण उपवाक्य जुड़ा है, अतः मिश्र वाक्य है।",
        explanationEnglish: "Correlative pronoun pair 'जो... उसे' links relative adjectival clause to principal clause."
      },
      {
        id: 'w3_q17',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'घायल सैनिक से अब और चला नहीं जाता।' में कौन सा वाच्य है?",
        questionEnglish: "Which voice is used in 'The injured soldier is unable to walk any further'?",
        options: [
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Bhavvachya' },
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Karmvachya' },
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Kartrivachya' },
          { textHindi: 'मिश्रवाच्य', textEnglish: 'Mixed' }
        ],
        correctIndex: 0,
        explanationHindi: "अकर्मक क्रिया 'चलना' के साथ शारीरिक असमर्थता का भाव व्यक्त होने के कारण भाववाच्य है।",
        explanationEnglish: "Intransitive verb expressing physical inability constitutes Bhavvachya."
      },
      {
        id: 'w3_q18',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'वह बाज़ार गया और उसने ताज़े फल खरीदे।' को सरल वाक्य में बदलें:",
        questionEnglish: "Convert 'He went to market and bought fresh fruits' into a Simple sentence:",
        options: [
          { textHindi: 'वह बाज़ार जाकर ताज़े फल खरीद लाया।', textEnglish: 'Having gone to market, he bought fresh fruits.' },
          { textHindi: 'जब वह बाज़ार गया तब उसने फल खरीदे।', textEnglish: 'When he went to market then he bought fruits.' },
          { textHindi: 'क्योंकि वह बाज़ार गया था इसलिए उसने फल लिए।', textEnglish: 'Because he went to market he bought fruits.' },
          { textHindi: 'वह बाज़ार गया ताकि फल खरीद सके।', textEnglish: 'He went to market so that he could buy fruits.' }
        ],
        correctIndex: 0,
        explanationHindi: "पूर्वकालिक क्रिया 'जाकर' का प्रयोग करके दोनों क्रियाओं को एक समापिका क्रिया में समेटकर सरल वाक्य बनाया गया।",
        explanationEnglish: "Converts the first clause into a non-finite participial phrase 'जाकर' to yield one finite verb."
      },
      {
        id: 'w3_q19',
        topicId: 'vachya',
        topicNameHindi: 'वाच्य',
        topicNameEnglish: 'Voice',
        questionHindi: "'सरकार द्वारा नए विद्यालय खोले जा रहे हैं।' इस वाक्य में कौन-सा वाच्य है?",
        questionEnglish: "What voice is used in 'New schools are being opened by the government'?",
        options: [
          { textHindi: 'कर्मवाच्य (Passive Voice)', textEnglish: 'Passive Voice' },
          { textHindi: 'कर्तृवाच्य (Active Voice)', textEnglish: 'Active Voice' },
          { textHindi: 'भाववाच्य (Impersonal Voice)', textEnglish: 'Impersonal Voice' },
          { textHindi: 'अकर्मक वाच्य', textEnglish: 'Intransitive Voice' }
        ],
        correctIndex: 0,
        explanationHindi: "सकर्मक क्रिया में कर्म 'नए विद्यालय' (पुल्लिंग, बहुवचन) के अनुसार क्रिया 'खोले जा रहे हैं' प्रयुक्त हुई है, अतः कर्मवाच्य है।",
        explanationEnglish: "Verb agrees in gender and number with the grammatical object 'नए विद्यालय', hence Passive Voice."
      },
      {
        id: 'w3_q20',
        topicId: 'vakya',
        topicNameHindi: 'वाक्य भेद',
        topicNameEnglish: 'Sentence Structure',
        questionHindi: "'यद्यपि वह निर्धन है, तथापि वह बहुत ईमानदार है।' वाक्य का प्रकार बताएं:",
        questionEnglish: "Identify sentence structure: 'Although he is poor, yet he is very honest.'",
        options: [
          { textHindi: 'मिश्र वाक्य (Complex Sentence)', textEnglish: 'Complex Sentence' },
          { textHindi: 'संयुक्त वाक्य (Compound Sentence)', textEnglish: 'Compound Sentence' },
          { textHindi: 'सरल वाक्य (Simple Sentence)', textEnglish: 'Simple Sentence' },
          { textHindi: 'विधानवाचक वाक्य', textEnglish: 'Assertive Sentence' }
        ],
        correctIndex: 0,
        explanationHindi: "'यद्यपि... तथापि' व्यधिकरण समुच्चयबोधक से जुड़ा होने के कारण यह मिश्र वाक्य है।",
        explanationEnglish: "Subordinating correlatives 'यद्यपि... तथापि' (although... yet) indicate a Complex sentence."
      }
    ]
  },
  {
    id: 'ws_kaal_muhavare',
    titleHindi: 'वर्कशीट ४: काल व मुहावरे परीक्षा-मंथन सेट (20 प्रश्न)',
    titleEnglish: 'Worksheet 4: Tenses & Idioms Exam Sprint (20 Questions)',
    costWordCoins: 15,
    descriptionHindi: '15 WordCoins में अनलॉक: 20 सबसे महत्वपूर्ण बोर्ड मुहावरे और काल के सूक्ष्म उपभेदों का विस्तृत सेट।',
    descriptionEnglish: 'Unlocked with 15 WordCoins: 20 high-yield board idioms and nuanced tense sub-types.',
    topicsCovered: ['काल', 'मुहावरे'],
    questionCount: 20,
    isUnlocked: false,
    practiceQuestions: [
      {
        id: 'w4_q1',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'गागर में सागर भरना' का क्या अर्थ है?",
        questionEnglish: "What does 'गागर में सागर भरना' mean?",
        options: [
          { textHindi: 'कम शब्दों में बहुत गहरी बात कहना', textEnglish: 'Saying profound things in few words' },
          { textHindi: 'मटके में समुद्र का पानी भरना', textEnglish: 'Filling ocean water in pot' },
          { textHindi: 'बहुत बोलना', textEnglish: 'Talking too much' },
          { textHindi: 'नदी किनारे जाना', textEnglish: 'Going to river bank' }
        ],
        correctIndex: 0,
        explanationHindi: 'बिहारी के दोहों के लिए कहा गया है कि वे थोड़े शब्दों में गंभीर अर्थ भर देते हैं।',
        explanationEnglish: 'Expressing expansive wisdom within concise phrasing.'
      },
      {
        id: 'w4_q2',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'यदि वर्षा होती तो फसल अच्छी होती।' में कौन सा काल है?",
        questionEnglish: "Which tense is 'Had it rained, the crop would have been good'?",
        options: [
          { textHindi: 'हेतुहेतुमद् भूतकाल (Conditional Past)', textEnglish: 'Conditional Past' },
          { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple Past' },
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past Continuous' },
          { textHindi: 'संभाव्य भविष्यत् (Probable Future)', textEnglish: 'Probable Future' }
        ],
        correctIndex: 0,
        explanationHindi: 'भूतकाल में एक क्रिया का होना दूसरी क्रिया पर निर्भर था, इसलिए यह हेतुहेतुमद् भूतकाल है।',
        explanationEnglish: 'Denotes an unfulfilled condition in the past where one event depended on another.'
      },
      {
        id: 'w4_q3',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'अंगूठा दिखाना' मुहावरे का सही अर्थ क्या है?",
        questionEnglish: "What does 'अंगूठा दिखाना' mean?",
        options: [
          { textHindi: 'ऐन वक्त पर मना कर देना या इनकार करना', textEnglish: 'Refusing at the crucial moment' },
          { textHindi: 'सहमति देना (Agree)', textEnglish: 'Giving agreement' },
          { textHindi: 'मदद करना (Help)', textEnglish: 'Helping someone' },
          { textHindi: 'पुरस्कार देना (Reward)', textEnglish: 'Giving an award' }
        ],
        correctIndex: 0,
        explanationHindi: 'ज़रूरत के समय साफ़ मना कर देने को अंगूठा दिखाना कहते हैं।',
        explanationEnglish: 'Denotes outright refusal when assistance was expected.'
      },
      {
        id: 'w4_q4',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'लड़की पुस्तक पढ़ रही होगी।' यह किस काल का उदाहरण है?",
        questionEnglish: "What tense is 'The girl must be reading the book'?",
        options: [
          { textHindi: 'संदिग्ध वर्तमान काल (Suspicious Present)', textEnglish: 'Dubitative / Suspicious Present' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple Future' },
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past Continuous' },
          { textHindi: 'पूर्ण वर्तमान काल (Present Perfect)', textEnglish: 'Present Perfect' }
        ],
        correctIndex: 0,
        explanationHindi: "वर्तमान समय में क्रिया के जारी रहने में संदेह (होगी) होने पर संदिग्ध वर्तमान होता है।",
        explanationEnglish: "Indicates doubt about an ongoing action in the present moment."
      },
      {
        id: 'w4_q5',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'अंधे की लाठी' का सटीक अर्थ क्या है?",
        questionEnglish: "What is the exact meaning of 'अंधे की लाठी'?",
        options: [
          { textHindi: 'एकमात्र सहारा (Sole Support)', textEnglish: 'Sole support / lifeline' },
          { textHindi: 'मजबूत छड़ी (Strong stick)', textEnglish: 'Strong stick' },
          { textHindi: 'अंधेरे में रास्ता खोजना', textEnglish: 'Finding way in dark' },
          { textHindi: 'आँखों का इलाज कराना', textEnglish: 'Getting eye treatment' }
        ],
        correctIndex: 0,
        explanationHindi: 'श्रवण कुमार अपने वृद्ध माता-पिता के लिए अंधे की लाठी थे।',
        explanationEnglish: 'Represents someone who is the singular reliance of another.'
      },
      {
        id: 'w4_q6',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'गाड़ी अभी-अभी स्टेशन से छूटी है।' यह कौन सा काल है?",
        questionEnglish: "What tense is 'The train has just left the station'?",
        options: [
          { textHindi: 'आसन्न भूतकाल (Recent Past)', textEnglish: 'Recent Past (Asanna Bhoot)' },
          { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple Past' },
          { textHindi: 'पूर्ण भूतकाल (Past Perfect)', textEnglish: 'Past Perfect' },
          { textHindi: 'तात्कालिक वर्तमान काल', textEnglish: 'Instant Present' }
        ],
        correctIndex: 0,
        explanationHindi: 'क्रिया अभी-अभी कुछ ही क्षण पूर्व समाप्त हुई है, अतः आसन्न भूतकाल है।',
        explanationEnglish: 'Action completed just a moment ago indicates Asanna (Recent) Past.'
      },
      {
        id: 'w4_q7',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'ईद का चाँद होना' मुहावरे का अर्थ है:",
        questionEnglish: "The idiom 'ईद का चाँद होना' means:",
        options: [
          { textHindi: 'बहुत दिनों बाद दिखाई देना', textEnglish: 'Appearing after a very long time' },
          { textHindi: 'त्योहार मनाना', textEnglish: 'Celebrating a festival' },
          { textHindi: 'सुंदर दिखना', textEnglish: 'Looking handsome' },
          { textHindi: 'चाँद को देखना', textEnglish: 'Looking at moon' }
        ],
        correctIndex: 0,
        explanationHindi: 'ईद का चाँद दुर्लभ होता है, इसलिए बहुत दिनों बाद मिलने वाले को कहते हैं।',
        explanationEnglish: 'Refers to someone rarely seen, just like the crescent of Eid.'
      },
      {
        id: 'w4_q8',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'माली पौधों को पानी दे रहा था।' में कौन सा काल है?",
        questionEnglish: "What tense is 'Gardener was watering plants'?",
        options: [
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past Continuous' },
          { textHindi: 'पूर्ण भूतकाल (Past Perfect)', textEnglish: 'Past Perfect' },
          { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple Past' },
          { textHindi: 'संदिग्ध भूतकाल', textEnglish: 'Doubtful Past' }
        ],
        correctIndex: 0,
        explanationHindi: 'भूतकाल में क्रिया चल रही थी और समाप्त नहीं हुई थी, अतः अपूर्ण भूतकाल है।',
        explanationEnglish: 'The activity was underway in the past and unfinished.'
      },
      {
        id: 'w4_q9',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'कोल्हू का बैल' का अर्थ क्या है?",
        questionEnglish: "What does 'कोल्हू का बैल' mean?",
        options: [
          { textHindi: 'दिन-रात लगातार कठिन परिश्रम करने वाला', textEnglish: 'Working non-stop day and night' },
          { textHindi: 'खेत जोतने वाला बैल', textEnglish: 'Ox plowing fields' },
          { textHindi: 'आलसी व्यक्ति', textEnglish: 'Lazy person' },
          { textHindi: 'तेल निकालने की मशीन', textEnglish: 'Oil extraction machine' }
        ],
        correctIndex: 0,
        explanationHindi: 'जो बिना रुके लगातार मेहनत करता रहता है, उसे कोल्हू का बैल कहते हैं।',
        explanationEnglish: 'Someone engaged in unending, relentless physical or mental labor.'
      },
      {
        id: 'w4_q10',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'संभव है कल मामा जी आएँ।' में काल का भेद बताएं:",
        questionEnglish: "State the tense in 'It is possible uncle may come tomorrow':",
        options: [
          { textHindi: 'संभाव्य भविष्यत् काल (Probable Future)', textEnglish: 'Probable Future' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple Future' },
          { textHindi: 'हेतुहेतुमद् भविष्यत् काल', textEnglish: 'Conditional Future' },
          { textHindi: 'संदिग्ध वर्तमान काल', textEnglish: 'Suspicious Present' }
        ],
        correctIndex: 0,
        explanationHindi: "'संभव है' शब्द आने वाले समय में क्रिया की संभावना को दर्शाता है।",
        explanationEnglish: "Expresses probability/possibility of an event occurring in the future."
      },
      {
        id: 'w4_q11',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'दाल में कुछ काला होना' का अर्थ क्या है?",
        questionEnglish: "What does 'दाल में कुछ काला होना' mean?",
        options: [
          { textHindi: 'किसी बात पर संदेह या गड़बड़ी की आशंका होना', textEnglish: 'Suspecting something fishy or wrong' },
          { textHindi: 'दाल जल जाना', textEnglish: 'Lentils getting burned' },
          { textHindi: 'काली दाल बनाना', textEnglish: 'Cooking black lentils' },
          { textHindi: 'स्वाद खराब होना', textEnglish: 'Bad taste' }
        ],
        correctIndex: 0,
        explanationHindi: 'जब किसी स्थिति में धोखे या रहस्य का अंदेशा हो, तब यह मुहावरा बोलते हैं।',
        explanationEnglish: 'Signifies suspicion of foul play or secret wrongdoing.'
      },
      {
        id: 'w4_q12',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'सूर्य पूर्व में उदय होता है।' यह कौन सा काल है?",
        questionEnglish: "What tense is 'The sun rises in the east'?",
        options: [
          { textHindi: 'सामान्य वर्तमान काल (Simple Present / Universal Truth)', textEnglish: 'Simple Present / Universal Truth' },
          { textHindi: 'अपूर्ण वर्तमान काल (Present Continuous)', textEnglish: 'Present Continuous' },
          { textHindi: 'पूर्ण वर्तमान काल (Present Perfect)', textEnglish: 'Present Perfect' },
          { textHindi: 'संभाव्य वर्तमान काल', textEnglish: 'Probable Present' }
        ],
        correctIndex: 0,
        explanationHindi: 'सदा रहने वाले सत्य और नित्य क्रिया के लिए सामान्य वर्तमान काल प्रयुक्त होता है।',
        explanationEnglish: 'Habitual actions and universal truths take Simple Present tense.'
      },
      {
        id: 'w4_q13',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'दांत खट्टे करना' मुहावरे का सही अर्थ है:",
        questionEnglish: "Meaning of 'दांत खट्टे करना':",
        options: [
          { textHindi: 'शत्रु को बुरी तरह हरा देना या पराजित करना', textEnglish: 'Defeating the enemy decisively' },
          { textHindi: 'खट्टा नींबू खाना', textEnglish: 'Eating sour lemon' },
          { textHindi: 'दांतों में दर्द होना', textEnglish: 'Toothache' },
          { textHindi: 'मिठाई खाना', textEnglish: 'Eating sweets' }
        ],
        correctIndex: 0,
        explanationHindi: 'भारतीय सैनिकों ने युद्ध में शत्रु सेना के दांत खट्टे कर दिए।',
        explanationEnglish: 'To inflict a crushing defeat upon an opponent.'
      },
      {
        id: 'w4_q14',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'वह पत्र लिख चुका था।' यह किस काल का वाक्य है?",
        questionEnglish: "What tense is 'He had written the letter'?",
        options: [
          { textHindi: 'पूर्ण भूतकाल (Past Perfect)', textEnglish: 'Past Perfect' },
          { textHindi: 'सामान्य भूतकाल (Simple Past)', textEnglish: 'Simple Past' },
          { textHindi: 'आसन्न भूतकाल (Recent Past)', textEnglish: 'Recent Past' },
          { textHindi: 'अपूर्ण भूतकाल (Past Continuous)', textEnglish: 'Past Continuous' }
        ],
        correctIndex: 0,
        explanationHindi: "क्रिया भूतकाल में बहुत पहले पूर्ण हो चुकी थी ('चुका था')।",
        explanationEnglish: 'Indicates the action was completed well in the past.'
      },
      {
        id: 'w4_q15',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'नौ दो ग्यारह होना' का अर्थ है:",
        questionEnglish: "What does 'नौ दो ग्यारह होना' mean?",
        options: [
          { textHindi: 'रफूचक्कर हो जाना या भाग जाना', textEnglish: 'Fleeing or running away' },
          { textHindi: 'गिनती सीखना', textEnglish: 'Learning counting' },
          { textHindi: 'जोड़ करना', textEnglish: 'Addition' },
          { textHindi: 'आलस्य करना', textEnglish: 'Being lazy' }
        ],
        correctIndex: 0,
        explanationHindi: 'पुलिस की सायरन सुनते ही चोर नौ दो ग्यारह हो गए।',
        explanationEnglish: 'To vanish rapidly from sight or run away.'
      },
      {
        id: 'w4_q16',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'शायद आज शाम बारिश होगी।' में काल है:",
        questionEnglish: "Tense in 'Perhaps it will rain this evening':",
        options: [
          { textHindi: 'संभाव्य भविष्यत् (Probable Future)', textEnglish: 'Probable Future' },
          { textHindi: 'सामान्य भविष्यत् (Simple Future)', textEnglish: 'Simple Future' },
          { textHindi: 'हेतुहेतुमद् भविष्यत् (Conditional Future)', textEnglish: 'Conditional Future' },
          { textHindi: 'संदिग्ध भूतकाल', textEnglish: 'Doubtful Past' }
        ],
        correctIndex: 0,
        explanationHindi: "'शायद' शब्द आने वाले समय में घटना के होने की संभावना दिखाता है।",
        explanationEnglish: "'शायद' (perhaps) indicates probability in the future."
      },
      {
        id: 'w4_q17',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'लोहे के चने चबाना' का अर्थ क्या है?",
        questionEnglish: "Meaning of 'लोहे के चने चबाना':",
        options: [
          { textHindi: 'अत्यंत कठिन संघर्ष का सामना करना', textEnglish: 'Facing an extremely difficult struggle' },
          { textHindi: 'लोहा खाना', textEnglish: 'Eating iron' },
          { textHindi: 'चने की खेती करना', textEnglish: 'Farming chickpeas' },
          { textHindi: 'दांत मजबूत करना', textEnglish: 'Strengthening teeth' }
        ],
        correctIndex: 0,
        explanationHindi: 'ओलंपिक में पदक जीतना लोहे के चने चबाने के समान है।',
        explanationEnglish: 'Undergoing a formidable hardship to achieve success.'
      },
      {
        id: 'w4_q18',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'रोहन प्रतिदिन सुबह व्यायाम करता है।' वाक्य किस काल में है?",
        questionEnglish: "What tense is 'Rohan exercises every morning'?",
        options: [
          { textHindi: 'सामान्य वर्तमान काल (Simple Present)', textEnglish: 'Simple Present' },
          { textHindi: 'तात्कालिक वर्तमान काल (Present Continuous)', textEnglish: 'Present Continuous' },
          { textHindi: 'संदिग्ध वर्तमान काल', textEnglish: 'Doubtful Present' },
          { textHindi: 'भूतकाल', textEnglish: 'Past Tense' }
        ],
        correctIndex: 0,
        explanationHindi: 'दैनिक आदत (routine) को दर्शाने वाली क्रिया सामान्य वर्तमान काल में होती है।',
        explanationEnglish: 'Habitual daily routine actions fall under Simple Present.'
      },
      {
        id: 'w4_q19',
        topicId: 'muhavare',
        topicNameHindi: 'मुहावरे',
        topicNameEnglish: 'Idioms',
        questionHindi: "'हवा से बातें करना' मुहावरे का सही अर्थ क्या है?",
        questionEnglish: "Meaning of 'हवा से बातें करना':",
        options: [
          { textHindi: 'अत्यंत तीव्र गति से दौड़ना', textEnglish: 'Running at extreme high speed' },
          { textHindi: 'हवा में बोलना', textEnglish: 'Talking in the wind' },
          { textHindi: 'घमंड करना', textEnglish: 'Being proud' },
          { textHindi: 'झूठ बोलना', textEnglish: 'Telling lies' }
        ],
        correctIndex: 0,
        explanationHindi: 'महाराणा प्रताप का घोड़ा चेतक हवा से बातें करता था।',
        explanationEnglish: 'Moving or galloping at lightning-fast velocity.'
      },
      {
        id: 'w4_q20',
        topicId: 'kaal',
        topicNameHindi: 'काल',
        topicNameEnglish: 'Tenses',
        questionHindi: "'यदि परिश्रम करोगे तो परीक्षा में प्रथम आओगे।' यह कौन सा काल है?",
        questionEnglish: "Which tense is 'If you work hard, you will secure first rank'?",
        options: [
          { textHindi: 'हेतुहेतुमद् भविष्यत् काल (Conditional Future)', textEnglish: 'Conditional Future' },
          { textHindi: 'सामान्य भविष्यत् काल (Simple Future)', textEnglish: 'Simple Future' },
          { textHindi: 'संभाव्य भविष्यत् काल', textEnglish: 'Probable Future' },
          { textHindi: 'हेतुहेतुमद् भूतकाल', textEnglish: 'Conditional Past' }
        ],
        correctIndex: 0,
        explanationHindi: 'भविष्य में एक काम का होना दूसरे काम की सफलता पर निर्भर है, अतः हेतुहेतुमद् भविष्यत् है।',
        explanationEnglish: 'A future outcome is conditional upon another future prerequisite.'
      }
    ]
  }
];

// Universal deterministic question rebalancer to guarantee mixed answers across A, B, C, D (not Option A only)
const ANSWER_DISTRIBUTION_CYCLE = [1, 2, 3, 0, 2, 1, 3, 0, 3, 2, 0, 1, 1, 3, 0, 2];

function balanceQuizItems<T extends { options: any[]; correctIndex: number }>(items: T[]): T[] {
  if (!Array.isArray(items)) return items;
  items.forEach((q, idx) => {
    if (!q || !Array.isArray(q.options) || q.options.length <= 1) return;
    const oldCorrectIdx = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length
      ? q.correctIndex
      : 0;
    const targetIdx = ANSWER_DISTRIBUTION_CYCLE[idx % ANSWER_DISTRIBUTION_CYCLE.length] % q.options.length;
    if (targetIdx === oldCorrectIdx) return;
    const correctOpt = q.options[oldCorrectIdx];
    q.options.splice(oldCorrectIdx, 1);
    q.options.splice(targetIdx, 0, correctOpt);
    q.correctIndex = targetIdx;
  });
  return items;
}

// Apply rebalancing immediately on data load to all modules, checkpoints, passages, and worksheets
ALL_GRAMMAR_MODULES.forEach((mod) => {
  if (mod.quickCheckQuestions) {
    balanceQuizItems(mod.quickCheckQuestions);
  }
  const stages = (mod as any).stages;
  if (Array.isArray(stages)) {
    stages.forEach((st: any) => {
      if (st && st.practiceSet) {
        balanceQuizItems(st.practiceSet);
      }
    });
  }
});

balanceQuizItems(PRE_CHECK_QUIZ_QUESTIONS);

APATHIT_GADYANSH_PASSAGES.forEach((passage) => {
  if (passage.questions) {
    balanceQuizItems(passage.questions);
  }
});

SPECIAL_WORKSHEETS.forEach((ws) => {
  if (ws.practiceQuestions) {
    balanceQuizItems(ws.practiceQuestions);
  }
});

