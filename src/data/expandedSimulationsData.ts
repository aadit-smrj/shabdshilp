import {
  GrammarModule,
  KaalDialItem,
  MuhavaraItem,
  VachyaStageItem,
  VakyaItem,
} from '../types';

export interface KarakCableScenario {
  id: 'tree' | 'pen' | 'roof' | 'knife' | 'river' | 'brush';
  label: string;
  node1Emoji: string;
  node1Label: string;
  node2Emoji: string;
  node2Label: string;
  answer: 'Karan' | 'Apadan';
  successHindi: string;
  successEnglish: string;
  errorHindi: string;
  errorEnglish: string;
}

export const KARAK_CABLES_SCENARIOS: KarakCableScenario[] = [
  {
    id: 'tree',
    label: 'पेड़ से पत्ता गिरा',
    node1Emoji: '🌳',
    node1Label: 'पेड़',
    node2Emoji: '🍃',
    node2Label: 'पत्ता',
    answer: 'Apadan',
    successHindi: 'बधाई! पत्ता पेड़ से अलग (detach) हो गया! केबल टूट गई - यह शुद्ध अपादान कारक है।',
    successEnglish: 'Correct! The leaf detaches from the tree. The cable snaps - proving Apadan (separation).',
    errorHindi: 'गलत! यदि यह करण (साधन) होता, तो पत्ता पेड़ को एक औजार की तरह इस्तेमाल कर रहा होता! यहाँ पत्ता अलग हो रहा है, अतः अपादान है।',
    errorEnglish: 'Incorrect! Separation occurs here, not tool usage, so it is Apadan Karak.'
  },
  {
    id: 'pen',
    label: 'कलम से लिखा',
    node1Emoji: '✒️',
    node1Label: 'कलम',
    node2Emoji: '📝',
    node2Label: 'लिखावट',
    answer: 'Karan',
    successHindi: 'सटीक! कलम यहाँ लिखने की क्रिया का उपकरण (साधन) है, अतः करण कारक है।',
    successEnglish: 'Spot on! The pen is the instrument utilized for writing, making it Karan Karak.',
    errorHindi: 'गलत! यहाँ कलम से कोई अलगाव नहीं हो रहा, बल्कि कलम के माध्यम से कार्य हो रहा है।',
    errorEnglish: 'Incorrect! Writing with a pen is instrumental (Karan), not separation.'
  },
  {
    id: 'roof',
    label: 'छत से कूदा',
    node1Emoji: '🏠',
    node1Label: 'छत',
    node2Emoji: '🏃',
    node2Label: 'व्यक्ति',
    answer: 'Apadan',
    successHindi: 'सही! छत से कूदने पर छत और व्यक्ति के मध्य दूरी बढ़ गई - अपादान कारक।',
    successEnglish: 'Correct! Jumping off the roof creates separation from the source, hence Apadan Karak.',
    errorHindi: 'गलत! छत कूदने का औजार नहीं है, यहाँ स्थान से अलगाव हो रहा है।',
    errorEnglish: 'Incorrect! The roof is not an instrument here; separation is taking place.'
  },
  {
    id: 'knife',
    label: 'चाकू से फल काटा',
    node1Emoji: '🔪',
    node1Label: 'चाकू',
    node2Emoji: '🍎',
    node2Label: 'फल',
    answer: 'Karan',
    successHindi: 'शाबाश! चाकू फल काटने का मुख्य औजार (साधन) है, इसलिए यह करण कारक है।',
    successEnglish: 'Great! The knife is the physical tool used to cut the fruit (Karan Karak).',
    errorHindi: 'गलत! फल चाकू से अलग होकर दूर नहीं जा रहा, बल्कि चाकू को साधन के रूप में प्रयोग किया गया है।',
    errorEnglish: 'Incorrect! Here the knife is an instrument (Karan), not a point of separation.'
  },
  {
    id: 'river',
    label: 'हिमालय से गंगा निकली',
    node1Emoji: '🏔️',
    node1Label: 'हिमालय',
    node2Emoji: '🌊',
    node2Label: 'गंगा',
    answer: 'Apadan',
    successHindi: 'उत्कृष्ट! उद्गम स्थान (हिमालय) से नदी निकलकर अलग बह रही है, अतः अपादान कारक है।',
    successEnglish: 'Excellent! Origin/emergence from a fixed source indicates Apadan Karak.',
    errorHindi: 'गलत! हिमालय कोई साधन नहीं है, बल्कि गंगा के उद्गम व अलगाव का स्रोत है।',
    errorEnglish: 'Incorrect! Himalayas act as the origin point of departure (Apadan).'
  },
  {
    id: 'brush',
    label: 'ब्रश से चित्र बनाया',
    node1Emoji: '🖌️',
    node1Label: 'ब्रश',
    node2Emoji: '🎨',
    node2Label: 'चित्र',
    answer: 'Karan',
    successHindi: 'बहुत बढ़िया! ब्रश चित्र बनाने का माध्यम व उपकरण है, इसलिए यह करण कारक है।',
    successEnglish: 'Well done! The brush is the instrument used to paint (Karan Karak).',
    errorHindi: 'गलत! ब्रश से कोई अलगाव नहीं हो रहा; यह चित्रकारी का साधन है।',
    errorEnglish: 'Incorrect! The brush is an instrument of creation (Karan).'
  }
];

export const EXTRA_VAKYA_TRAIN_EXAMPLES: VakyaItem[] = [
  {
    sentenceHindi: 'मैं स्टेशन पहुँचा किंतु गाड़ी जा चुकी थी।',
    sentenceEnglish: 'I reached the station, however the train had already left.',
    type: 'संयुक्त (Compound)',
    clauses: [
      { text: 'मैं स्टेशन पहुँचा', isIndependent: true },
      { text: 'गाड़ी जा चुकी थी', isIndependent: true }
    ],
    connectors: ['किंतु'],
    explanationHindi: "'किंतु' विरोधदर्शक समानाधिकरण योजक है जो दो स्वतंत्र वाक्यों को जोड़ता है।",
    explanationEnglish: "'किंतु' joins two independent clauses showing contrast (Compound Sentence)."
  },
  {
    sentenceHindi: 'यदि तुम समय पर पढ़ोगे, तो परीक्षा में प्रथम आओगे।',
    sentenceEnglish: 'If you study on time, then you will stand first in the exam.',
    type: 'मिश्र (Complex)',
    clauses: [
      { text: 'यदि तुम समय पर पढ़ोगे', isIndependent: false, role: 'dependent' },
      { text: 'तो परीक्षा में प्रथम आओगे', isIndependent: true, role: 'master' }
    ],
    connectors: ['यदि...तो'],
    explanationHindi: "'यदि...तो' शर्तवाचक व्यधिकरण योजक एक आश्रित उपवाक्य को प्रधान उपवाक्य से जोड़ता है।",
    explanationEnglish: "Conditional pair 'यदि...तो' links a dependent clause to the main clause."
  },
  {
    sentenceHindi: 'प्रातःकाल होते ही पक्षी मधुर गीत गाने लगे।',
    sentenceEnglish: 'At dawn, the birds began singing sweet songs.',
    type: 'सरल (Simple)',
    clauses: [
      { text: 'प्रातःकाल होते ही पक्षी मधुर गीत गाने लगे', isIndependent: true }
    ],
    connectors: [],
    explanationHindi: 'इस वाक्य में एक उद्देश्य (पक्षी) और एक मुख्य समापिका क्रिया (गाने लगे) है, अतः सरल वाक्य है।',
    explanationEnglish: 'One subject and one finite verb phrase with no conjunctions make a Simple Sentence.'
  }
];

export const EXTRA_VACHYA_SPOTLIGHT_ITEMS: VachyaStageItem[] = [
  {
    id: 'vachya_4',
    subject: 'कवि',
    object: 'सुंदर कविता',
    verbActive: 'सुनाता है',
    verbPassive: 'सुनाई जाती है',
    connector: 'के द्वारा',
    kartriHindi: 'कवि सुंदर कविता सुनाता है।',
    kartriEnglish: 'The poet recites a beautiful poem.',
    karmHindi: 'कवि के द्वारा सुंदर कविता सुनाई जाती है।',
    karmEnglish: 'A beautiful poem is recited by the poet.'
  },
  {
    id: 'vachya_5',
    subject: 'माली',
    object: 'पौधे',
    verbActive: 'सींचता है',
    verbPassive: 'सींचे जाते हैं',
    connector: 'के द्वारा',
    kartriHindi: 'माली पौधे सींचता है।',
    kartriEnglish: 'The gardener waters the plants.',
    karmHindi: 'माली के द्वारा पौधे सींचे जाते हैं।',
    karmEnglish: 'The plants are watered by the gardener.'
  },
  {
    id: 'vachya_6',
    subject: 'अध्यापिका',
    object: 'पाठ',
    verbActive: 'पढ़ाती हैं',
    verbPassive: 'पढ़ाया जाता है',
    connector: 'के द्वारा',
    kartriHindi: 'अध्यापिका पाठ पढ़ाती हैं।',
    kartriEnglish: 'The teacher teaches the lesson.',
    karmHindi: 'अध्यापिका के द्वारा पाठ पढ़ाया जाता है।',
    karmEnglish: 'The lesson is taught by the teacher.'
  }
];

export const EXTRA_KAAL_DIAL_ITEMS: KaalDialItem[] = [
  {
    id: 'kaal_3',
    rootWord: 'पढ़ (Padh)',
    baseSentence: 'छात्र पुस्तक पढ़ता है',
    tenses: [
      {
        tense: 'वर्तमान काल (Present)',
        subType: 'सामान्य वर्तमान (Simple Present)',
        conjugatedEnding: 'पढ़ता है',
        fullSentenceHindi: 'छात्र पुस्तक पढ़ता है।',
        fullSentenceEnglish: 'The student reads a book.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'अपूर्ण भूतकाल (Past Continuous)',
        conjugatedEnding: 'पढ़ रहा था',
        fullSentenceHindi: 'छात्र पुस्तक पढ़ रहा था।',
        fullSentenceEnglish: 'The student was reading a book.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'पूर्ण भूतकाल (Past Perfect)',
        conjugatedEnding: 'पढ़ी थी',
        fullSentenceHindi: 'छात्र ने पुस्तक पढ़ी थी।',
        fullSentenceEnglish: 'The student had read the book.'
      },
      {
        tense: 'भविष्यत् काल (Future)',
        subType: 'सामान्य भविष्यत् (Simple Future)',
        conjugatedEnding: 'पढ़ेगा',
        fullSentenceHindi: 'छात्र पुस्तक पढ़ेगा।',
        fullSentenceEnglish: 'The student will read the book.'
      }
    ]
  },
  {
    id: 'kaal_4',
    rootWord: 'खेल (Khel)',
    baseSentence: 'बच्चे मैदान में खेलते हैं',
    tenses: [
      {
        tense: 'वर्तमान काल (Present)',
        subType: 'अपूर्ण वर्तमान (Present Continuous)',
        conjugatedEnding: 'खेल रहे हैं',
        fullSentenceHindi: 'बच्चे मैदान में खेल रहे हैं।',
        fullSentenceEnglish: 'Children are playing in the field.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'सामान्य भूतकाल (Simple Past)',
        conjugatedEnding: 'खेले',
        fullSentenceHindi: 'बच्चे मैदान में खेले।',
        fullSentenceEnglish: 'Children played in the field.'
      },
      {
        tense: 'भविष्यत् काल (Future)',
        subType: 'संभाव्य भविष्यत् (Probable Future)',
        conjugatedEnding: 'खेलेंगे',
        fullSentenceHindi: 'शायद बच्चे मैदान में खेलेंगे।',
        fullSentenceEnglish: 'Perhaps children will play in the field.'
      }
    ]
  },
  {
    id: 'kaal_5',
    rootWord: 'चल (Chal)',
    baseSentence: 'यात्री स्टेशन की ओर चलता है',
    tenses: [
      {
        tense: 'वर्तमान काल (Present)',
        subType: 'सामान्य वर्तमान (Simple Present)',
        conjugatedEnding: 'चलता है',
        fullSentenceHindi: 'यात्री स्टेशन की ओर चलता है।',
        fullSentenceEnglish: 'The traveler walks toward the station.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'आसन्न भूतकाल (Recent Past)',
        conjugatedEnding: 'चला है',
        fullSentenceHindi: 'यात्री अभी स्टेशन की ओर चला है।',
        fullSentenceEnglish: 'The traveler has just walked toward the station.'
      },
      {
        tense: 'भविष्यत् काल (Future)',
        subType: 'सामान्य भविष्यत् (Simple Future)',
        conjugatedEnding: 'चलेगा',
        fullSentenceHindi: 'यात्री कल सुबह चलेगा।',
        fullSentenceEnglish: 'The traveler will depart tomorrow morning.'
      }
    ]
  },
  {
    id: 'kaal_6',
    rootWord: 'खा (Khaa)',
    baseSentence: 'बालक फल खाता है',
    tenses: [
      {
        tense: 'वर्तमान काल (Present)',
        subType: 'संदिग्ध वर्तमान (Doubtful Present)',
        conjugatedEnding: 'खाता होगा',
        fullSentenceHindi: 'बालक फल खाता होगा।',
        fullSentenceEnglish: 'The child must be eating fruit.'
      },
      {
        tense: 'भूतकाल (Past)',
        subType: 'पूर्ण भूतकाल (Past Perfect)',
        conjugatedEnding: 'खा चुका था',
        fullSentenceHindi: 'बालक फल खा चुका था।',
        fullSentenceEnglish: 'The child had finished eating the fruit.'
      },
      {
        tense: 'भविष्यत् काल (Future)',
        subType: 'सामान्य भविष्यत् (Simple Future)',
        conjugatedEnding: 'खाएगा',
        fullSentenceHindi: 'बालक भोजन के बाद फल खाएगा।',
        fullSentenceEnglish: 'The child will eat fruit after the meal.'
      }
    ]
  }
];

export const EXTRA_MUHAVARA_LIST: MuhavaraItem[] = [
  {
    id: 'mh_6',
    muhavara: 'गागर में सागर भरना',
    literalImageDescription: 'एक छोटे मिट्टी के घड़े में पूरा विशाल समुद्र समाया हुआ',
    literalHindi: 'छोटी गागर में पूरा समुद्र भर देना',
    literalEnglish: 'Pouring the entire ocean into a small pitcher',
    metaphorHindi: 'थोड़े शब्दों में बहुत गहरी और बड़ी बात कह देना',
    metaphorEnglish: 'To express profound ideas in very few words',
    sentenceHindi: 'कवि बिहारी ने अपने दोहों में गागर में सागर भर दिया है।',
    sentenceEnglish: 'Poet Bihari packed deep wisdom into brief couplets.'
  },
  {
    id: 'mh_7',
    muhavara: 'अंगूठा दिखाना',
    literalImageDescription: 'हाथ का अंगूठा सामने दिखाकर मना करने का संकेत',
    literalHindi: 'सामने वाले को हाथ का अंगूठा दिखाना',
    literalEnglish: 'Showing one’s thumb to someone',
    metaphorHindi: 'ऐन वक्त पर किसी काम के लिए साफ़ इनकार कर देना',
    metaphorEnglish: 'To flatly refuse at the critical moment',
    sentenceHindi: 'जब मैंने मित्र से मदद माँगी, तो उसने साफ़ अंगूठा दिखा दिया।',
    sentenceEnglish: 'When I asked my friend for help, he flatly refused.'
  },
  {
    id: 'mh_8',
    muhavara: 'ईद का चाँद होना',
    literalImageDescription: 'आसमान में बड़ी प्रतीक्षा के बाद निकला पतला चमकीला चाँद',
    literalHindi: 'ईद की रात को आसमान में चाँद बन जाना',
    literalEnglish: 'Becoming the moon of Eid',
    metaphorHindi: 'बहुत दिनों के बाद दिखाई देना या मिलना',
    metaphorEnglish: 'To be seen rarely or after a very long time',
    sentenceHindi: 'अरे रमेश! तुम तो आजकल ईद का चाँद हो गए हो, दिखाई ही नहीं देते।',
    sentenceEnglish: 'Hey Ramesh! You have become so rare to see these days.'
  },
  {
    id: 'mh_9',
    muhavara: 'अंधे की लाठी होना',
    literalImageDescription: 'नेत्रहीन व्यक्ति के हाथ में रास्ता दिखाती एक मजबूत लकड़ी की लाठी',
    literalHindi: 'नेत्रहीन व्यक्ति के हाथ की छड़ी बन जाना',
    literalEnglish: 'Being a blind person’s walking stick',
    metaphorHindi: 'किसी असहाय व्यक्ति का एकमात्र सहारा होना',
    metaphorEnglish: 'To be the sole support of a helpless person',
    sentenceHindi: 'श्रवण कुमार अपने वृद्ध माता-पिता के लिए अंधे की लाठी थे।',
    sentenceEnglish: 'Shravan Kumar was the sole support for his elderly parents.'
  },
  {
    id: 'mh_10',
    muhavara: 'नाकों चने चबवाना',
    literalImageDescription: 'नाक के पास रखे सख्त भुने हुए चनों को चबाने की कोशिश',
    literalHindi: 'मुँह की बजाय नाक से चने चबाने को मजबूर करना',
    literalEnglish: 'Forcing someone to chew chickpeas with their nose',
    metaphorHindi: 'बहुत अधिक तंग या परेशान कर देना',
    metaphorEnglish: 'To trouble or harass someone intensely',
    sentenceHindi: 'भारतीय सैनिकों ने रणभूमि में शत्रुओं को नाकों चने चबवा दिए।',
    sentenceEnglish: 'Indian soldiers gave the enemies a very hard time on the battlefield.'
  },
  {
    id: 'mh_11',
    muhavara: 'कमर कसना',
    literalImageDescription: 'कपड़े या बेल्ट को कमर के चारों ओर कसकर बाँधना',
    literalHindi: 'अपनी कमर को रस्सी या पट्टी से कसकर बाँध लेना',
    literalEnglish: 'Tightening a belt around one’s waist',
    metaphorHindi: 'किसी कार्य के लिए दृढ़ निश्चय के साथ तैयार होना',
    metaphorEnglish: 'To get firmly determined and ready for a task',
    sentenceHindi: 'वार्षिक परीक्षा निकट आते ही सभी विद्यार्थियों ने कमर कस ली।',
    sentenceEnglish: 'As the final exams approached, all students geared up with determination.'
  },
  {
    id: 'mh_12',
    muhavara: 'कान भरना',
    literalImageDescription: 'किसी के कान में फुसफुसाकर ढेर सारे शब्द डालना',
    literalHindi: 'दूसरे व्यक्ति के कान के अंदर कोई चीज़ भरना',
    literalEnglish: 'Filling someone’s ear with things',
    metaphorHindi: 'किसी के विरुद्ध चुगली या झूठी शिकायत करना',
    metaphorEnglish: 'To backbite or poison someone’s mind against another',
    sentenceHindi: 'मंथरा ने कैकेयी के कान भरकर राम के लिए वनवास माँगने को प्रेरित किया।',
    sentenceEnglish: 'Manthara poisoned Kaikeyi’s mind against Ram.'
  },
  {
    id: 'mh_13',
    muhavara: 'घी के दीये जलाना',
    literalImageDescription: 'मिट्टी के चमकते दीयों में शुद्ध घी डालकर रोशनी करना',
    literalHindi: 'तेल की जगह देसी घी डालकर दीपक जलाना',
    literalEnglish: 'Lighting lamps with clarified butter (ghee)',
    metaphorHindi: 'अत्यधिक खुशियाँ और उत्सव मनाना',
    metaphorEnglish: 'To celebrate with immense joy and festivity',
    sentenceHindi: 'विश्व कप जीतकर टीम के लौटने पर पूरे देश में घी के दीये जलाए गए।',
    sentenceEnglish: 'The whole country celebrated joyfully when the team returned with the World Cup.'
  },
  {
    id: 'mh_14',
    muhavara: 'लोहे के चने चबाना',
    literalImageDescription: 'धातु और लोहे से बने सख्त गोल चनों को दाँतों से तोड़ना',
    literalHindi: 'असली लोहे से बने कठोर दाने चबाना',
    literalEnglish: 'Chewing chickpeas made of solid iron',
    metaphorHindi: 'अत्यंत कठिन या असंभव सा प्रतीत होने वाला कार्य करना',
    metaphorEnglish: 'To accomplish an extremely difficult or daunting task',
    sentenceHindi: 'बिना ऑक्सीजन सिलेंडर के एवरेस्ट चढ़ना लोहे के चने चबाने जैसा है।',
    sentenceEnglish: 'Climbing Everest without an oxygen cylinder is an extraordinarily tough feat.'
  },
  {
    id: 'mh_15',
    muhavara: 'पेट में चूहे कूदना',
    literalImageDescription: 'पेट के अंदर नन्हे चूहों का उछल-कूद मचाना',
    literalHindi: 'इंसान के पेट के भीतर चूहों की दौड़ लगना',
    literalEnglish: 'Mice jumping around inside one’s stomach',
    metaphorHindi: 'बहुत तेज़ या असहनीय भूख लगना',
    metaphorEnglish: 'To feel intensely hungry; starving',
    sentenceHindi: 'सुबह से कुछ नहीं खाया, अब तो मेरे पेट में चूहे कूद रहे हैं।',
    sentenceEnglish: 'I haven’t eaten since morning; now I am starving.'
  },
  {
    id: 'mh_16',
    muhavara: 'चार चाँद लगाना',
    literalImageDescription: 'एक चाँद के पास तीन और चमकते चाँद जोड़कर सजाना',
    literalHindi: 'आसमान में एक के बजाय चार चंद्रमा सजा देना',
    literalEnglish: 'Placing four moons in the sky',
    metaphorHindi: 'किसी की शोभा, सुंदरता या प्रतिष्ठा को बहुत बढ़ा देना',
    metaphorEnglish: 'To enhance the beauty, grace, or glory manifold',
    sentenceHindi: 'आपकी मधुर वाणी ने आज के सांस्कृतिक कार्यक्रम में चार चाँद लगा दिए।',
    sentenceEnglish: 'Your melodious voice added great charm to today’s cultural event.'
  },
  {
    id: 'mh_17',
    muhavara: 'पानी-पानी होना',
    literalImageDescription: 'पूरा शरीर पिघलकर पानी की बूँदों में बदल जाना',
    literalHindi: 'शरीर का गलकर बिल्कुल पानी बन जाना',
    literalEnglish: 'Melting completely into water',
    metaphorHindi: 'अपनी गलती पर बहुत अधिक लज्जित या शर्मिंदा होना',
    metaphorEnglish: 'To feel deeply ashamed or embarrassed',
    sentenceHindi: 'चोरी पकड़े जाने पर मोहन सबके सामने शर्म से पानी-पानी हो गया।',
    sentenceEnglish: 'When caught stealing, Mohan was overwhelmed with shame in front of everyone.'
  },
  {
    id: 'mh_18',
    muhavara: 'अपना उल्लू सीधा करना',
    literalImageDescription: 'एक टेढ़े बैठे उल्लू को पकड़कर सीधा खड़ा करना',
    literalHindi: 'अपने पालतू उल्लू को बिल्कुल सीधा बैठाना',
    literalEnglish: 'Making one’s owl sit straight',
    metaphorHindi: 'दूसरों की परवाह किए बिना केवल अपना स्वार्थ सिद्ध करना',
    metaphorEnglish: 'To serve only one’s own selfish interest',
    sentenceHindi: 'स्वार्थी लोग मीठी बातें करके केवल अपना उल्लू सीधा करना जानते हैं।',
    sentenceEnglish: 'Selfish people use sweet words only to serve their own interests.'
  }
];

export interface AffixSimItem {
  id: string;
  kind: 'उपसर्ग (Prefix)' | 'प्रत्यय (Suffix)';
  affix: string;
  rootWord: string;
  combinedWord: string;
  distractors?: string[];
  meaningHindi: string;
  meaningEnglish: string;
  exampleHindi: string;
}

export const UPSARG_PRATYAY_SIM_ITEMS: AffixSimItem[] = [
  {
    id: 'af_1',
    kind: 'उपसर्ग (Prefix)',
    affix: 'अनु',
    rootWord: 'शासन',
    combinedWord: 'अनुशासन',
    distractors: ['अनूशासन', 'अन्शासन', 'अनुशाशन'],
    meaningHindi: 'नियमों का पालन करना (Discipline)',
    meaningEnglish: 'Following rules; self-discipline',
    exampleHindi: 'विद्यार्थी जीवन में अनुशासन का बड़ा महत्व है।'
  },
  {
    id: 'af_2',
    kind: 'उपसर्ग (Prefix)',
    affix: 'प्रति',
    rootWord: 'एक',
    combinedWord: 'प्रत्येक',
    distractors: ['प्रतिएक', 'प्रतीक', 'प्रत्यक'],
    meaningHindi: 'हर एक व्यक्ति या वस्तु (Every single one)',
    meaningEnglish: 'Each and every one (Yan Sandhi assimilation)',
    exampleHindi: 'कक्षा के प्रत्येक छात्र ने प्रश्न हल किया।'
  },
  {
    id: 'af_3',
    kind: 'उपसर्ग (Prefix)',
    affix: 'दुर्',
    rootWord: 'जन',
    combinedWord: 'दुर्जन',
    distractors: ['दुरजन', 'दुज्जन', 'दुर्जनक'],
    meaningHindi: 'बुरे स्वभाव वाला व्यक्ति (Wicked person)',
    meaningEnglish: 'Bad-natured person',
    exampleHindi: 'हमें दुर्जन की संगति से बचना चाहिए।'
  },
  {
    id: 'af_4',
    kind: 'प्रत्यय (Suffix)',
    affix: 'इक',
    rootWord: 'समाज',
    combinedWord: 'सामाजिक',
    distractors: ['समाजिक', 'समाजीक', 'सामजिक'],
    meaningHindi: 'समाज से संबंधित (Social)',
    meaningEnglish: 'Related to society (initial vowel lengthening)',
    exampleHindi: 'वृक्षारोपण एक महान सामाजिक कार्य है।'
  },
  {
    id: 'af_5',
    kind: 'प्रत्यय (Suffix)',
    affix: 'आवट',
    rootWord: 'लिख्',
    combinedWord: 'लिखावट',
    distractors: ['लिखवट', 'लीखावट', 'लिखावत'],
    meaningHindi: 'लिखने का ढंग या शैली (Handwriting)',
    meaningEnglish: 'Way or style of writing',
    exampleHindi: 'अनीता की लिखावट बहुत सुंदर है।'
  },
  {
    id: 'af_6',
    kind: 'प्रत्यय (Suffix)',
    affix: 'ता',
    rootWord: 'सुन्दर',
    combinedWord: 'सुन्दरता',
    distractors: ['सौन्दरता', 'सुन्दरताई', 'सुन्दराता'],
    meaningHindi: 'सुंदर होने का भाव (Beauty)',
    meaningEnglish: 'Abstract noun formed from adjective',
    exampleHindi: 'प्रकृति की सुन्दरता मन मोह लेती है।'
  }
];

export interface SandhiSimItem {
  id: string;
  sandhiType: string;
  part1: string;
  part2: string;
  result: string;
  distractors?: string[];
  ruleHindi: string;
  ruleEnglish: string;
}

export const SANDHI_SIM_ITEMS: SandhiSimItem[] = [
  {
    id: 'sd_1',
    sandhiType: 'दीर्घ स्वर संधि',
    part1: 'विद्या',
    part2: 'आलय',
    result: 'विद्यालय',
    distractors: ['विद्याआलय', 'विद्यलय', 'विद्याल्य'],
    ruleHindi: 'आ + आ = आ (समान दीर्घ स्वरों का मेल)',
    ruleEnglish: 'aa + aa merges into long aa.'
  },
  {
    id: 'sd_2',
    sandhiType: 'गुण स्वर संधि',
    part1: 'महा',
    part2: 'ईश',
    result: 'महेश',
    distractors: ['महाईश', 'महीश', 'महेष'],
    ruleHindi: 'आ + ई = ए (अ/आ के बाद इ/ई आने पर ए बनता है)',
    ruleEnglish: 'aa + ee combines into vowel e.'
  },
  {
    id: 'sd_3',
    sandhiType: 'यण स्वर संधि',
    part1: 'अति',
    part2: 'अंत',
    result: 'अत्यंत',
    distractors: ['अतिअंत', 'अत्यांत', 'अतींत'],
    ruleHindi: 'इ + अ = य (इ/ई के बाद असमान स्वर आने पर य् बनता है)',
    ruleEnglish: 'i + a transforms i into y.'
  },
  {
    id: 'sd_4',
    sandhiType: 'वृद्धि स्वर संधि',
    part1: 'सदा',
    part2: 'एव',
    result: 'सदैव',
    distractors: ['सदेव', 'सदाएव', 'सदैय'],
    ruleHindi: 'आ + ए = ऐ (अ/आ के बाद ए/ऐ आने पर ऐ हो जाता है)',
    ruleEnglish: 'aa + e raises to ai.'
  },
  {
    id: 'sd_5',
    sandhiType: 'व्यंजन संधि',
    part1: 'सत्',
    part2: 'जन',
    result: 'सज्जन',
    distractors: ['सतजन', 'सत्जन', 'साजन'],
    ruleHindi: 'त् + ज = ज्ज (त् के बाद ज आने पर त् भी ज् में बदल जाता है)',
    ruleEnglish: 't before j assimilates into jj.'
  },
  {
    id: 'sd_6',
    sandhiType: 'विसर्ग संधि',
    part1: 'नमः',
    part2: 'ते',
    result: 'नमस्ते',
    distractors: ['नमःते', 'नमोते', 'नमश्ते'],
    ruleHindi: 'ः + त = स्त (विसर्ग के बाद त आने पर स् हो जाता है)',
    ruleEnglish: 'Visarga followed by t becomes s.'
  }
];

export interface SamasSimItem {
  id: string;
  word: string;
  vigraha: string;
  samasType: string;
  hintHindi: string;
  hintEnglish: string;
}

export const SAMAS_SIM_ITEMS: SamasSimItem[] = [
  {
    id: 'sm_1',
    word: 'रसोईघर',
    vigraha: 'रसोई के लिए घर',
    samasType: 'सम्प्रदान तत्पुरुष समास',
    hintHindi: "इसमें 'के लिए' कारक चिन्ह का लोप हुआ है और उत्तरपद (घर) प्रधान है।",
    hintEnglish: "Postposition 'के लिए' is elided; second term is dominant."
  },
  {
    id: 'sm_2',
    word: 'नीलकमल',
    vigraha: 'नीला है जो कमल',
    samasType: 'कर्मधारय समास',
    hintHindi: 'पहला पद विशेषण (नीला) और दूसरा पद विशेष्य (कमल) है।',
    hintEnglish: 'Adjective-noun modifier relationship between terms.'
  },
  {
    id: 'sm_3',
    word: 'चौराहा',
    vigraha: 'चार राहों का समूह',
    samasType: 'द्विगु समास',
    hintHindi: "पहला पद संख्यावाचक ('चार') है और समस्तपद समूह का बोध कराता है।",
    hintEnglish: 'First component is a numeral representing a group.'
  },
  {
    id: 'sm_4',
    word: 'माता-पिता',
    vigraha: 'माता और पिता',
    samasType: 'द्वंद्व समास',
    hintHindi: "दोनों पद समान रूप से प्रधान हैं और विग्रह में 'और' लगता है।",
    hintEnglish: "Both components are equally important, joined by 'and'."
  },
  {
    id: 'sm_5',
    word: 'पीतांबर',
    vigraha: 'पीले हैं वस्त्र जिसके (श्रीकृष्ण)',
    samasType: 'बहुव्रीहि समास',
    hintHindi: 'दोनों पद मिलकर किसी तीसरे विशेष अर्थ (श्रीकृष्ण/विष्णु) की ओर संकेत करते हैं।',
    hintEnglish: 'Compound refers to a third external referent.'
  },
  {
    id: 'sm_6',
    word: 'यथाशक्ति',
    vigraha: 'शक्ति के अनुसार',
    samasType: 'अव्ययीभाव समास',
    hintHindi: "पहला पद अव्यय ('यथा') है और पूरा पद क्रियाविशेषण (अव्यय) बन जाता है।",
    hintEnglish: 'First term is an indeclinable prefix making the whole word adverbial.'
  }
];

export interface ClassifierSimItem {
  id: string;
  wordOrSentence: string;
  highlight: string;
  category: string;
  explanationHindi: string;
  explanationEnglish: string;
  promptHindi?: string;
  correctOption?: string;
  distractors?: string[];
}

export const SANGYA_SIM_ITEMS: ClassifierSimItem[] = [
  {
    id: 'sg_1',
    wordOrSentence: 'हिमालय भारत के उत्तर में स्थित है।',
    highlight: 'हिमालय / भारत',
    category: 'व्यक्तिवाचक संज्ञा (Proper Noun)',
    explanationHindi: 'किसी विशेष पर्वत या देश का निश्चित नाम व्यक्तिवाचक संज्ञा कहलाता है।',
    explanationEnglish: 'Specific unique names of a mountain or country are Proper Nouns.'
  },
  {
    id: 'sg_2',
    wordOrSentence: 'नदियाँ और पर्वत प्रकृति की शोभा हैं।',
    highlight: 'नदियाँ / पर्वत',
    category: 'जातिवाचक संज्ञा (Common Noun)',
    explanationHindi: 'संपूर्ण वर्ग या जाति का बोध कराने वाले शब्द जातिवाचक संज्ञा हैं।',
    explanationEnglish: 'Denotes an entire class or category rather than one unique item.'
  },
  {
    id: 'sg_3',
    wordOrSentence: 'गांधीजी ने सदैव ईमानदारी और अहिंसा का मार्ग चुना।',
    highlight: 'ईमानदारी / अहिंसा',
    category: 'भाववाचक संज्ञा (Abstract Noun)',
    explanationHindi: 'गुण, दशा या भाव का बोध कराने वाले शब्द जिन्हें केवल महसूस किया जाए।',
    explanationEnglish: 'Intangible qualities or states felt rather than touched.'
  },
  {
    id: 'sg_4',
    wordOrSentence: 'सोना और चाँदी कीमती धातुएँ हैं।',
    highlight: 'सोना / चाँदी',
    category: 'द्रव्यवाचक संज्ञा (Material Noun)',
    explanationHindi: 'मापी या तौली जाने वाली वस्तुओं/धातुओं का नाम द्रव्यवाचक संज्ञा है।',
    explanationEnglish: 'Substances or materials measured by weight or volume.'
  },
  {
    id: 'sg_5',
    wordOrSentence: 'भारतीय सेना ने सीमा की रक्षा की।',
    highlight: 'सेना',
    category: 'समूहवाचक संज्ञा (Collective Noun)',
    explanationHindi: 'सैनिकों के पूरे दल या समूह का एक साथ बोध कराने वाला शब्द।',
    explanationEnglish: 'Represents a single unified collection or group.'
  },
  {
    id: 'sg_6',
    wordOrSentence: '‘मित्र’ से ‘मित्रता’ और ‘मीठा’ से ‘मिठास’ बनता है।',
    highlight: 'मित्र → मित्रता',
    category: 'भाववाचक संज्ञा निर्माण',
    explanationHindi: 'जातिवाचक संज्ञा, सर्वनाम या विशेषण में प्रत्यय जोड़कर भाववाचक संज्ञा बनती है।',
    explanationEnglish: 'Suffixes transform common nouns/adjectives into abstract nouns.'
  }
];

export const SARVANAM_SIM_ITEMS: ClassifierSimItem[] = [
  {
    id: 'sv_1',
    wordOrSentence: 'मैं कल दिल्ली जाऊँगा और हम सब साथ घूमेंगे।',
    highlight: 'मैं / हम',
    category: 'पुरुषवाचक सर्वनाम (Personal Pronoun)',
    explanationHindi: 'बोलने वाले (उत्तम पुरुष), सुनने वाले (मध्यम) या अन्य व्यक्ति के लिए प्रयुक्त सर्वनाम।',
    explanationEnglish: 'Refers to the speaker, listener, or third person.'
  },
  {
    id: 'sv_2',
    wordOrSentence: 'यह मेरी नई साइकिल है और वह तुम्हारा बैग है।',
    highlight: 'यह / वह',
    category: 'निश्चयवाचक सर्वनाम (Demonstrative)',
    explanationHindi: 'निकट या दूर की किसी निश्चित वस्तु की ओर स्पष्ट संकेत करता है।',
    explanationEnglish: 'Points to a definite near or far object/person.'
  },
  {
    id: 'sv_3',
    wordOrSentence: 'दरवाज़े पर कोई खड़ा है, शायद कुछ लाया है।',
    highlight: 'कोई / कुछ',
    category: 'अनिश्चयवाचक सर्वनाम (Indefinite)',
    explanationHindi: 'जिससे किसी निश्चित व्यक्ति या वस्तु का बोध न हो।',
    explanationEnglish: 'Refers to an unspecified or uncertain person/thing.'
  },
  {
    id: 'sv_4',
    wordOrSentence: 'जैसा करोगे, वैसा भरोगे। / जिसकी लाठी, उसकी भैंस।',
    highlight: 'जैसा...वैसा',
    category: 'संबंधवाचक सर्वनाम (Relative)',
    explanationHindi: 'वाक्य के दो उपवाक्यों या संज्ञा-सर्वनामों के बीच परस्पर संबंध जोड़ता है।',
    explanationEnglish: 'Establishes correlation between two clauses.'
  },
  {
    id: 'sv_5',
    wordOrSentence: 'बाहर कौन शोर मचा रहा है और तुम क्या चाहते हो?',
    highlight: 'कौन / क्या',
    category: 'प्रश्नवाचक सर्वनाम (Interrogative)',
    explanationHindi: 'प्रश्न पूछने के लिए प्रयुक्त होने वाले सर्वनाम शब्द।',
    explanationEnglish: 'Used to ask questions about people or things.'
  },
  {
    id: 'sv_6',
    wordOrSentence: 'मैं अपना गृहकार्य स्वयं ही पूरा कर लूँगा।',
    highlight: 'स्वयं / अपने आप',
    category: 'निजवाचक सर्वनाम (Reflexive)',
    explanationHindi: 'कर्ता द्वारा स्वयं (खुद) के लिए प्रयुक्त होने वाला सर्वनाम।',
    explanationEnglish: 'Indicates the subject performs the action independently.'
  }
];

export const VISHESHAN_SIM_ITEMS: ClassifierSimItem[] = [
  {
    id: 'vs_1',
    wordOrSentence: 'बगीचे में सुंदर और सुगंधित लाल गुलाब खिले हैं।',
    highlight: 'सुंदर / लाल',
    category: 'गुणवाचक विशेषण (Adjective of Quality)',
    explanationHindi: 'संज्ञा के गुण, रंग, आकार या स्वभाव की विशेषता बताता है।',
    explanationEnglish: 'Describes quality, color, shape, or nature.'
  },
  {
    id: 'vs_2',
    wordOrSentence: 'मेले में पाँच सौ विद्यार्थी और कुछ शिक्षक आए।',
    highlight: 'पाँच सौ / कुछ',
    category: 'संख्यावाचक विशेषण (Numeral Adjective)',
    explanationHindi: 'गिनती योग्य संज्ञाओं की निश्चित या अनिश्चित संख्या बताता है।',
    explanationEnglish: 'Specifies definite or indefinite count of countable nouns.'
  },
  {
    id: 'vs_3',
    wordOrSentence: 'दुकान से दो लीटर दूध और थोड़ा चावल लाओ।',
    highlight: 'दो लीटर / थोड़ा',
    category: 'परिमाणवाचक विशेषण (Quantity Adjective)',
    explanationHindi: 'माप-तौल वाली वस्तुओं की मात्रा (परिमाण) का बोध कराता है।',
    explanationEnglish: 'Measures quantity of uncountable/measured substances.'
  },
  {
    id: 'vs_4',
    wordOrSentence: 'यह पुस्तक मेरी है और वह लड़का प्रथम आया।',
    highlight: 'यह पुस्तक / वह लड़का',
    category: 'सार्वनामिक विशेषण (Pronominal Adjective)',
    explanationHindi: 'जब सर्वनाम किसी संज्ञा से ठीक पहले आकर उसकी ओर संकेत करे।',
    explanationEnglish: 'Pronoun placed right before a noun acting as a determiner.'
  },
  {
    id: 'vs_5',
    wordOrSentence: 'अधिक (मूलावस्था) → अधिकतर',
    highlight: 'दो वस्तुओं में तुलना (-तर)',
    category: 'विशेषण की उत्तरावस्था (Comparative)',
    explanationHindi: 'दो वस्तुओं या व्यक्तियों के बीच तुलना करने के लिए ‘-तर’ या ‘से अधिक’ लगता है।',
    explanationEnglish: 'Compares two entities using comparative form.'
  },
  {
    id: 'vs_6',
    wordOrSentence: 'श्रेष्ठ → श्रेष्ठतम / सुंदर → सुंदरतम',
    highlight: 'सभी में सर्वश्रेष्ठ (-तम)',
    category: 'विशेषण की उत्तमावस्था (Superlative)',
    explanationHindi: 'अनेकों में से किसी एक को सर्वश्रेष्ठ बताने के लिए ‘-तम’ या ‘सबसे’ लगता है।',
    explanationEnglish: 'Expresses highest degree among all.'
  }
];

export const SHABD_BHANDAR_SIM_ITEMS: ClassifierSimItem[] = [
  {
    id: 'sb_1',
    wordOrSentence: 'कमल = पंकज, नीरज, जलज, सरोज',
    highlight: 'कमल • पंकज • नीरज',
    category: 'समानार्थी / पर्यायवाची (Synonyms)',
    explanationHindi: 'समान अर्थ प्रकट करने वाले शब्द (‘जल’ + ‘ज’ = जल में जन्म लेने वाला कमल)।',
    explanationEnglish: 'Words sharing identical or closely related meanings.'
  },
  {
    id: 'sb_2',
    wordOrSentence: 'अनुकूल ↔ प्रतिकूल | सजीव ↔ निर्जीव | उत्थान ↔ पतन',
    highlight: 'अनुकूल ↔ प्रतिकूल',
    category: 'विपरीतार्थक / विलोम (Antonyms)',
    explanationHindi: 'एक-दूसरे के ठीक विपरीत अर्थ देने वाले शब्द-युग्म।',
    explanationEnglish: 'Pairs of words with opposite meanings.'
  },
  {
    id: 'sb_3',
    wordOrSentence: 'जो कभी बूढ़ा न हो → अजर | जो सब कुछ जानता हो → सर्वज्ञ',
    highlight: 'पूरा वाक्यांश → एक पद',
    category: 'अनेक शब्दों के लिए एक शब्द (One-Word)',
    explanationHindi: 'संक्षिप्त व प्रभावशाली लेखन के लिए पूरे वाक्यांश के स्थान पर एक सटीक शब्द।',
    explanationEnglish: 'Single compact term substituting an entire descriptive phrase.'
  },
  {
    id: 'sb_4',
    wordOrSentence: 'अनिल (हवा) बनाम अनल (आग) | दिन (दिवस) बनाम दीन (गरीब)',
    highlight: 'अनिल / अनल • दिन / दीन',
    category: 'समोच्चारित भिन्नार्थक (Homonyms)',
    explanationHindi: 'सुनने में लगभग समान किंतु वर्तनी और अर्थ में पूरी तरह भिन्न शब्द।',
    explanationEnglish: 'Sound similar but differ sharply in spelling and meaning.'
  },
  {
    id: 'sb_5',
    wordOrSentence: 'दुग्ध → दूध | अग्नि → आग',
    highlight: 'संस्कृत रूप → हिंदी रूप',
    category: 'उत्पत्ति के आधार पर शब्द (Origin)',
    explanationHindi: 'संस्कृत के मूल शब्द तत्सम और रूप बदलकर हिंदी में आए शब्द तद्भव कहलाते हैं।',
    explanationEnglish: 'Direct Sanskrit loans vs evolved Hindi forms.'
  },
  {
    id: 'sb_6',
    wordOrSentence: 'कनक = सोना, धतूरा, गेहूँ | कर = हाथ, टैक्स, किरण',
    highlight: 'कनक • कर (प्रसंग भेद)',
    category: 'एक शब्द के अनेक अर्थ (Polysemy)',
    explanationHindi: 'प्रसंग के अनुसार एक ही शब्द के विभिन्न सटीक अर्थ निकलते हैं।',
    explanationEnglish: 'Single word carrying multiple context-dependent meanings.'
  }
];

export const EXTRA_GRAMMAR_MODULES: GrammarModule[] = [
  {
    id: 'sandhi',
    slug: 'sandhi-lab',
    titleHindi: 'संधि (Sandhi Fusion Lab)',
    titleEnglish: 'Phonetic Word Fusion',
    subtitleHindi: 'स्वर, व्यंजन एवं विसर्ग संधि के नियमों का सटीक मेल व विच्छेद',
    subtitleEnglish: 'Interactive vowel, consonant and visarga fusion lab',
    iconName: 'Zap',
    bottleneckHindi: 'विद्यार्थी यण, गुण व वृद्धि संधि के स्वर परिवर्तनों और विसर्ग/व्यंजन संधि के विच्छेद में अटक जाते हैं।',
    bottleneckEnglish: 'Students often confuse vowel shifts in Gun/Vriddhi/Yan Sandhi and consonant assimilation.',
    interactionNameHindi: 'संधि फ़्यूज़न लैब (Sandhi Lab)',
    interactionNameEnglish: 'Sandhi Fusion Lab',
    whatStudentGainsHindi: 'दो वर्णों के मिलने से बनने वाली नई ध्वनि को देखकर पहचानने की क्षमता।',
    whatStudentGainsEnglish: 'Intuitive mastery over combining and splitting Sandhi compounds.',
    paramparaCorner: {
      definitionHindi: 'दो निकटवर्ती वर्णों के परस्पर मेल से जो विकार (परिवर्तन) उत्पन्न होता है, उसे संधि कहते हैं।',
      definitionEnglish: 'Phonetic modification resulting from the union of two adjacent sounds.',
      classicalShlokaOrRule: 'परः सन्निकर्षः संहिता (पाणिनी अष्टाध्यायी)',
      heritageContext: 'पाणिनी के सूत्र उच्चारण की सहजता और ध्वनि-विज्ञान पर आधारित हैं।'
    },
    rulesSummary: [
      {
        ruleHindi: 'स्वर संधि: दो स्वरों के मेल से विकार (दीर्घ, गुण, वृद्धि, यण, अयादि)।',
        ruleEnglish: 'Swar Sandhi: Union of two vowels.',
        exampleHindi: 'अति + अंत = अत्यंत (यण संधि)',
        exampleEnglish: 'ati + ant = atyant'
      },
      {
        ruleHindi: 'व्यंजन व विसर्ग संधि: व्यंजन या विसर्ग (ः) के बाद स्वर/व्यंजन आने पर परिवर्तन।',
        ruleEnglish: 'Vyanjan & Visarga Sandhi: Consonant or visarga assimilation.',
        exampleHindi: 'सत् + जन = सज्जन | नमः + ते = नमस्ते',
        exampleEnglish: 'sat + jan = sajjan'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_sd1',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'विद्यालय' शब्द का सही संधि-विच्छेद और भेद क्या है?",
        questionEnglish: "What is the correct split and type of 'विद्यालय'?",
        options: [
          { textHindi: 'विद्या + आलय (दीर्घ स्वर संधि)', textEnglish: 'Vidya + Alay (Dirgha)' },
          { textHindi: 'विद्य + आलय (गुण संधि)', textEnglish: 'Vidyaa + Alay' },
          { textHindi: 'विद्या + लय (यण संधि)', textEnglish: 'Vidya + Lay' },
          { textHindi: 'विद् + आलय (व्यंजन संधि)', textEnglish: 'Vid + Alay' }
        ],
        correctIndex: 0,
        explanationHindi: "आ + आ = आ बनने के कारण यह दीर्घ स्वर संधि है (विद्या + आलय)।",
        explanationEnglish: "aa + aa yields long aa in Dirgha Swar Sandhi."
      },
      {
        id: 'qc_sd2',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'महेश' में कौन-सी संधि है?",
        questionEnglish: "Which Sandhi is present in 'महेश'?",
        options: [
          { textHindi: 'दीर्घ संधि', textEnglish: 'Dirgha' },
          { textHindi: 'गुण स्वर संधि (महा + ईश)', textEnglish: 'Gun Swar Sandhi' },
          { textHindi: 'वृद्धि संधि', textEnglish: 'Vriddhi' },
          { textHindi: 'अयादि संधि', textEnglish: 'Ayadi' }
        ],
        correctIndex: 1,
        explanationHindi: "महा + ईश (आ + ई = ए) से 'महेश' बनता है, जो गुण स्वर संधि का उदाहरण है।",
        explanationEnglish: "aa + ee transforms to 'e', the hallmark of Gun Sandhi."
      },
      {
        id: 'qc_sd3',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'स्वागत' शब्द का शुद्ध संधि-विच्छेद चुनिए:",
        questionEnglish: "Choose the correct split of 'स्वागत':",
        options: [
          { textHindi: 'स्व + आगत', textEnglish: 'Sva + Aagat' },
          { textHindi: 'सु + आगत (यण संधि)', textEnglish: 'Su + Aagat (Yan)' },
          { textHindi: 'स्वा + गत', textEnglish: 'Svaa + Gat' },
          { textHindi: 'स + आगत', textEnglish: 'Sa + Aagat' }
        ],
        correctIndex: 1,
        explanationHindi: "उ के बाद आ आने पर उ का 'व्' बन जाता है (सु + आगत = स्वागत, यण संधि)।",
        explanationEnglish: "u + aa converts u to v (Yan Sandhi)."
      },
      {
        id: 'qc_sd4',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'सदैव' (सदा + एव) किस संधि का उदाहरण है?",
        questionEnglish: "'सदैव' exemplifies which Sandhi?",
        options: [
          { textHindi: 'गुण संधि', textEnglish: 'Gun' },
          { textHindi: 'वृद्धि स्वर संधि', textEnglish: 'Vriddhi Swar Sandhi' },
          { textHindi: 'दीर्घ संधि', textEnglish: 'Dirgha' },
          { textHindi: 'विसर्ग संधि', textEnglish: 'Visarga' }
        ],
        correctIndex: 1,
        explanationHindi: "आ + ए = ऐ होने के कारण यहाँ वृद्धि स्वर संधि है।",
        explanationEnglish: "aa + e raises to 'ai' in Vriddhi Sandhi."
      },
      {
        id: 'qc_sd5',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'जगदीश' शब्द का सही संधि-विच्छेद क्या है?",
        questionEnglish: "What is the correct split of 'जगदीश'?",
        options: [
          { textHindi: 'जग + दीश', textEnglish: 'Jag + Deesh' },
          { textHindi: 'जगत् + ईश (व्यंजन संधि)', textEnglish: 'Jagat + Eesh' },
          { textHindi: 'जगद + ईश', textEnglish: 'Jagad + Eesh' },
          { textHindi: 'जगः + ईश', textEnglish: 'Jagah + Eesh' }
        ],
        correctIndex: 1,
        explanationHindi: "त् के बाद स्वर 'ई' आने पर त् अपने ही वर्ग के तीसरे वर्ण 'द्' में बदल जाता है।",
        explanationEnglish: "t softens to d before vowel ee."
      },
      {
        id: 'qc_sd6',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'निः + छल' के मेल से कौन सा शब्द बनता है?",
        questionEnglish: "What word is formed by 'निः + छल'?",
        options: [
          { textHindi: 'निश्चल', textEnglish: 'Nishchal' },
          { textHindi: 'निश्छल', textEnglish: 'Nishchhal' },
          { textHindi: 'निछल', textEnglish: 'Nichhal' },
          { textHindi: 'निषछल', textEnglish: 'Nishchhal' }
        ],
        correctIndex: 1,
        explanationHindi: "विसर्ग के बाद छ आने पर विसर्ग का 'श्' हो जाता है → निश्छल।",
        explanationEnglish: "Visarga before chh turns into sh -> निश्छल."
      },
      {
        id: 'qc_sd7',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'पवन' (पो + अन) किस संधि का भेद है?",
        questionEnglish: "'पवन' belongs to which Sandhi type?",
        options: [
          { textHindi: 'अयादि स्वर संधि', textEnglish: 'Ayadi Swar Sandhi' },
          { textHindi: 'यण संधि', textEnglish: 'Yan Sandhi' },
          { textHindi: 'गुण संधि', textEnglish: 'Gun Sandhi' },
          { textHindi: 'दीर्घ संधि', textEnglish: 'Dirgha Sandhi' }
        ],
        correctIndex: 0,
        explanationHindi: "ओ + अ = अव् बनने के कारण यह अयादि स्वर संधि है।",
        explanationEnglish: "o + a becomes av in Ayadi Sandhi."
      },
      {
        id: 'qc_sd8',
        topicId: 'sandhi',
        topicNameHindi: 'संधि',
        topicNameEnglish: 'Sandhi',
        questionHindi: "'महोत्सव' का सही संधि-विच्छेद क्या होगा?",
        questionEnglish: "What is the correct split of 'महोत्सव'?",
        options: [
          { textHindi: 'महो + त्सव', textEnglish: 'Maho + Tsav' },
          { textHindi: 'महा + उत्सव (गुण संधि)', textEnglish: 'Maha + Utsav' },
          { textHindi: 'मह + उत्सव', textEnglish: 'Mah + Utsav' },
          { textHindi: 'मही + उत्सव', textEnglish: 'Mahi + Utsav' }
        ],
        correctIndex: 1,
        explanationHindi: "आ + उ = ओ (महा + उत्सव = महोत्सव, गुण स्वर संधि)।",
        explanationEnglish: "aa + u becomes o."
      }
    ]
  },
  {
    id: 'samas',
    slug: 'samas-split',
    titleHindi: 'समास (Samas Compound Split)',
    titleEnglish: 'Compound Dissector',
    subtitleHindi: 'तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व, बहुव्रीहि व अव्ययीभाव विग्रह',
    subtitleEnglish: 'Master the 6 Samas compound categories via interactive vigraha',
    iconName: 'Layers',
    bottleneckHindi: 'कर्मधारय व बहुव्रीहि तथा द्विगु व बहुव्रीहि के विग्रह में अंतर समझना विद्यार्थियों को भ्रमित करता है।',
    bottleneckEnglish: 'Distinguishing between Karmadharaya, Dvigu, and Bahuvrihi depends on exact vigraha.',
    interactionNameHindi: 'समास विग्रह लैब (Samas Split)',
    interactionNameEnglish: 'Samas Vigraha Dissector',
    whatStudentGainsHindi: 'समस्तपद को देखकर सही विग्रह और भेद पहचानने की अचूक तकनीक।',
    whatStudentGainsEnglish: 'Accurate dissection and classification of compound words.',
    paramparaCorner: {
      definitionHindi: 'दो या दो से अधिक शब्दों के मेल से नया संक्षिप्त सार्थक शब्द बनाने की प्रक्रिया को समास कहते हैं।',
      definitionEnglish: 'Compounding two or more words into a single concise meaningful word.',
      classicalShlokaOrRule: 'समसनं समासः (अनेक पदानां एकपदीभवनम्)',
      heritageContext: 'समास भाषा को संक्षिप्त, ओजस्वी और प्रभावशाली बनाता है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'द्विगु समास: पहला पद संख्यावाचक होता है (चौराहा = चार राहों का समूह)।',
        ruleEnglish: 'Dvigu: First word is a number.',
        exampleHindi: 'त्रिलोक, सप्तर्षि, पंचवटी',
        exampleEnglish: 'Trilok, Panchavati'
      },
      {
        ruleHindi: 'द्वंद्व समास: दोनों पद प्रधान होते हैं (माता-पिता = माता और पिता)।',
        ruleEnglish: 'Dvandva: Both terms carry equal weight.',
        exampleHindi: 'दिन-रात, सुख-दुख, पाप-पुण्य',
        exampleEnglish: 'Din-Raat, Sukh-Dukh'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_sm1',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'चौराहा' शब्द में कौन सा समास है?",
        questionEnglish: "Which Samas is in 'चौराहा'?",
        options: [
          { textHindi: 'द्विगु समास (चार राहों का समूह)', textEnglish: 'Dvigu Samas' },
          { textHindi: 'द्वंद्व समास', textEnglish: 'Dvandva Samas' },
          { textHindi: 'कर्मधारय समास', textEnglish: 'Karmadharaya' },
          { textHindi: 'अव्ययीभाव समास', textEnglish: 'Avyayibhav' }
        ],
        correctIndex: 0,
        explanationHindi: "पहला पद 'चौ' (चार) संख्यावाचक है और समूह का बोध कराता है, अतः द्विगु समास है।",
        explanationEnglish: "First member is numeral 'four' forming a group."
      },
      {
        id: 'qc_sm2',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'नीलकमल' का सही समास-विग्रह और भेद क्या है?",
        questionEnglish: "Identify vigraha and Samas for 'नीलकमल':",
        options: [
          { textHindi: 'नीला और कमल (द्वंद्व)', textEnglish: 'Blue and Lotus' },
          { textHindi: 'नीला है जो कमल (कर्मधारय समास)', textEnglish: 'Lotus that is blue (Karmadharaya)' },
          { textHindi: 'नील का कमल (तत्पुरुष)', textEnglish: 'Lotus of blue' },
          { textHindi: 'नीले कमल वाला (बहुव्रीहि)', textEnglish: 'Bahuvrihi' }
        ],
        correctIndex: 1,
        explanationHindi: "यहाँ 'नीला' विशेषण और 'कमल' विशेष्य है, अतः कर्मधारय समास है।",
        explanationEnglish: "Adjective-noun relation marks Karmadharaya Samas."
      },
      {
        id: 'qc_sm3',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'यथासंभव' किस समास का उदाहरण है?",
        questionEnglish: "'यथासंभव' is an example of which Samas?",
        options: [
          { textHindi: 'तत्पुरुष समास', textEnglish: 'Tatpurush' },
          { textHindi: 'अव्ययीभाव समास (जैसा संभव हो)', textEnglish: 'Avyayibhav Samas' },
          { textHindi: 'द्विगु समास', textEnglish: 'Dvigu' },
          { textHindi: 'द्वंद्व समास', textEnglish: 'Dvandva' }
        ],
        correctIndex: 1,
        explanationHindi: "पहला पद 'यथा' अव्यय होने के कारण यह अव्ययीभाव समास है।",
        explanationEnglish: "Begins with indeclinable prefix 'यथा'."
      },
      {
        id: 'qc_sm4',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'दशानन' (दस हैं आनन जिसके - रावण) में कौन सा समास है?",
        questionEnglish: "Which Samas is in 'दशानन' (ten-headed, i.e., Ravana)?",
        options: [
          { textHindi: 'बहुव्रीहि समास', textEnglish: 'Bahuvrihi Samas' },
          { textHindi: 'तत्पुरुष समास', textEnglish: 'Tatpurush' },
          { textHindi: 'द्वंद्व समास', textEnglish: 'Dvandva' },
          { textHindi: 'अव्ययीभाव समास', textEnglish: 'Avyayibhav' }
        ],
        correctIndex: 0,
        explanationHindi: "जब दोनों पद मिलकर किसी तीसरे विशेष व्यक्ति (रावण) का बोध कराएँ, वहाँ बहुव्रीहि समास होता है।",
        explanationEnglish: "Points to an external third person (Ravana), making it Bahuvrihi."
      },
      {
        id: 'qc_sm5',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'देशभक्ति' शब्द में कौन सा समास है?",
        questionEnglish: "Which Samas is in 'देशभक्ति'?",
        options: [
          { textHindi: 'सम्प्रदान तत्पुरुष (देश के लिए भक्ति)', textEnglish: 'Sampradan Tatpurush' },
          { textHindi: 'द्विगु समास', textEnglish: 'Dvigu' },
          { textHindi: 'अव्ययीभाव समास', textEnglish: 'Avyayibhav' },
          { textHindi: 'द्वंद्व समास', textEnglish: 'Dvandva' }
        ],
        correctIndex: 0,
        explanationHindi: "'देश के लिए भक्ति' विग्रह में सम्प्रदान कारक चिन्ह 'के लिए' का लोप है।",
        explanationEnglish: "Elision of 'के लिए' forms Sampradan Tatpurush."
      },
      {
        id: 'qc_sm6',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'सुख-दुख' किस समास का उदाहरण है?",
        questionEnglish: "'सुख-दुख' belongs to which Samas?",
        options: [
          { textHindi: 'द्वंद्व समास (सुख और दुख)', textEnglish: 'Dvandva Samas' },
          { textHindi: 'कर्मधारय समास', textEnglish: 'Karmadharaya' },
          { textHindi: 'तत्पुरुष समास', textEnglish: 'Tatpurush' },
          { textHindi: 'द्विगु समास', textEnglish: 'Dvigu' }
        ],
        correctIndex: 0,
        explanationHindi: "दोनों विपरीतार्थक पद प्रधान हैं और 'और/या' से जुड़ते हैं, अतः द्वंद्व समास है।",
        explanationEnglish: "Equal dual terms joined by 'and/or'."
      },
      {
        id: 'qc_sm7',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'हस्तलिखित' (हाथ से लिखा हुआ) में कौन सा तत्पुरुष समास है?",
        questionEnglish: "'हस्तलिखित' uses which sub-type of Tatpurush?",
        options: [
          { textHindi: 'करण तत्पुरुष समास', textEnglish: 'Karan Tatpurush' },
          { textHindi: 'अपादान तत्पुरुष', textEnglish: 'Apadan Tatpurush' },
          { textHindi: 'अधिकरण तत्पुरुष', textEnglish: 'Adhikaran Tatpurush' },
          { textHindi: 'कर्म तत्पुरुष', textEnglish: 'Karm Tatpurush' }
        ],
        correctIndex: 0,
        explanationHindi: "यहाँ हाथ साधन है ('हाथ से/के द्वारा'), अतः करण तत्पुरुष समास है।",
        explanationEnglish: "Hand is the instrument ('से'), denoting Karan Tatpurush."
      },
      {
        id: 'qc_sm8',
        topicId: 'samas',
        topicNameHindi: 'समास',
        topicNameEnglish: 'Samas',
        questionHindi: "'आजीवन' (जीवन भर) किस समास के अंतर्गत आता है?",
        questionEnglish: "'आजीवन' falls under which Samas?",
        options: [
          { textHindi: 'अव्ययीभाव समास', textEnglish: 'Avyayibhav Samas' },
          { textHindi: 'द्विगु समास', textEnglish: 'Dvigu' },
          { textHindi: 'बहुव्रीहि समास', textEnglish: 'Bahuvrihi' },
          { textHindi: 'द्वंद्व समास', textEnglish: 'Dvandva' }
        ],
        correctIndex: 0,
        explanationHindi: "'आ' उपसर्ग/अव्यय से प्रारंभ होने के कारण यह अव्ययीभाव समास है।",
        explanationEnglish: "Prefix 'आ' forms an indeclinable compound."
      }
    ]
  },
  {
    id: 'sangya',
    slug: 'sangya-classifier',
    titleHindi: 'संज्ञा व भाववाचक निर्माण (Sangya Classifier)',
    titleEnglish: 'Noun & Abstract Transformation',
    subtitleHindi: 'व्यक्तिवाचक, जातिवाचक, भाववाचक, द्रव्यवाचक एवं समूहवाचक संज्ञाएँ',
    subtitleEnglish: 'Classify all 5 noun types and build abstract nouns accurately',
    iconName: 'BookOpen',
    bottleneckHindi: 'विशेषण या जातिवाचक शब्दों से शुद्ध भाववाचक संज्ञा बनाते समय वर्तनी व प्रत्यय की त्रुटियाँ होती हैं।',
    bottleneckEnglish: 'Students make suffix errors when deriving abstract nouns from adjectives and common nouns.',
    interactionNameHindi: 'संज्ञा वर्गीकरण लैब (Sangya Lab)',
    interactionNameEnglish: 'Noun Classification Stage',
    whatStudentGainsHindi: 'संज्ञा के पाँचों भेदों की सटीक पहचान और ICSE परीक्षा के लिए भाववाचक संज्ञा निर्माण।',
    whatStudentGainsEnglish: 'Precision in identifying noun types and forming abstract nouns.',
    paramparaCorner: {
      definitionHindi: 'किसी व्यक्ति, वस्तु, स्थान, प्राणी या भाव के नाम को संज्ञा कहते हैं।',
      definitionEnglish: 'A naming word denoting a person, place, object, or abstract feeling.',
      classicalShlokaOrRule: 'नाम सर्वस्य पदार्थस्य संज्ञा इत्यभिधीयते।',
      heritageContext: 'व्याकरण में संज्ञा को नामपद (विकारी शब्द) के रूप में प्रथम स्थान प्राप्त है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'व्यक्तिवाचक बनाम जातिवाचक: एक विशेष नाम व्यक्तिवाचक, पूरा वर्ग जातिवाचक होता है।',
        ruleEnglish: 'Proper vs Common: Specific unique entity vs entire class.',
        exampleHindi: 'गंगा (व्यक्तिवाचक) — नदी (जातिवाचक)',
        exampleEnglish: 'Ganga (Proper) — River (Common)'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_sg1',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'बचपन' और 'बुढ़ापा' किस प्रकार की संज्ञाएँ हैं?",
        questionEnglish: "'बचपन' and 'बुढ़ापा' belong to which noun category?",
        options: [
          { textHindi: 'भाववाचक संज्ञा (Abstract Noun)', textEnglish: 'Abstract Noun' },
          { textHindi: 'जातिवाचक संज्ञा', textEnglish: 'Common Noun' },
          { textHindi: 'द्रव्यवाचक संज्ञा', textEnglish: 'Material Noun' },
          { textHindi: 'व्यक्तिवाचक संज्ञा', textEnglish: 'Proper Noun' }
        ],
        correctIndex: 0,
        explanationHindi: "बचपन और बुढ़ापा जीवन की अवस्था/भाव को दर्शाते हैं, अतः भाववाचक संज्ञा हैं।",
        explanationEnglish: "Represent stages/states rather than physical objects."
      },
      {
        id: 'qc_sg2',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'मीठा' विशेषण से बनने वाली शुद्ध भाववाचक संज्ञा कौन-सी है?",
        questionEnglish: "Select the accurate abstract noun derived from 'मीठा':",
        options: [
          { textHindi: 'मीठापन', textEnglish: 'Meethapan' },
          { textHindi: 'मिठास', textEnglish: 'Mithaas' },
          { textHindi: 'मिठाई', textEnglish: 'Mithaai' },
          { textHindi: 'मीठाता', textEnglish: 'Meethata' }
        ],
        correctIndex: 1,
        explanationHindi: "'मीठा' से 'मिठास' भाववाचक संज्ञा बनती है ('मिठाई' जातिवाचक संज्ञा है)।",
        explanationEnglish: "'मिठास' denotes sweetness (abstract), whereas 'मिठाई' is a physical sweet."
      },
      {
        id: 'qc_sg3',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "निम्नलिखित में से समूहवाचक संज्ञा कौन-सी है?",
        questionEnglish: "Which of the following is a Collective Noun?",
        options: [
          { textHindi: 'चाँदी', textEnglish: 'Silver' },
          { textHindi: 'कक्षा / दल', textEnglish: 'Class / Squad' },
          { textHindi: 'हिमालय', textEnglish: 'Himalayas' },
          { textHindi: 'मित्रता', textEnglish: 'Friendship' }
        ],
        correctIndex: 1,
        explanationHindi: "'कक्षा' और 'दल' विद्यार्थियों या लोगों के समूह का बोध कराते हैं।",
        explanationEnglish: "'कक्षा' denotes a collection of students."
      },
      {
        id: 'qc_sg4',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'चतुर' शब्द की भाववाचक संज्ञा क्या होगी?",
        questionEnglish: "What is the abstract noun form of 'चतुर'?",
        options: [
          { textHindi: 'चतुराई / चातुर्य', textEnglish: 'Chaturai / Chaturya' },
          { textHindi: 'चतुरताई', textEnglish: 'Chaturtai' },
          { textHindi: 'चतुराना', textEnglish: 'Chaturana' },
          { textHindi: 'चातुर', textEnglish: 'Chaatur' }
        ],
        correctIndex: 0,
        explanationHindi: "'चतुर' में 'आई' प्रत्यय लगने से 'चतुराई' भाववाचक संज्ञा बनती है।",
        explanationEnglish: "Suffix 'आई' yields 'चतुराई'."
      },
      {
        id: 'qc_sg5',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'तेल', 'घी' और 'ताँबा' किस संज्ञा के अंतर्गत आते हैं?",
        questionEnglish: "'Oil', 'ghee', and 'copper' belong to which noun type?",
        options: [
          { textHindi: 'द्रव्यवाचक संज्ञा', textEnglish: 'Material Noun' },
          { textHindi: 'समूहवाचक संज्ञा', textEnglish: 'Collective Noun' },
          { textHindi: 'भाववाचक संज्ञा', textEnglish: 'Abstract Noun' },
          { textHindi: 'व्यक्तिवाचक संज्ञा', textEnglish: 'Proper Noun' }
        ],
        correctIndex: 0,
        explanationHindi: "तौले या मापे जाने वाले पदार्थ द्रव्यवाचक संज्ञा कहलाते हैं।",
        explanationEnglish: "Substances weighed or measured are Material Nouns."
      },
      {
        id: 'qc_sg6',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'अपना' सर्वनाम से बनी भाववाचक संज्ञा पहचानिए:",
        questionEnglish: "Identify the abstract noun formed from pronoun 'अपना':",
        options: [
          { textHindi: 'अपनापन / अपनत्व', textEnglish: 'Apnapan / Apnatva' },
          { textHindi: 'आपसी', textEnglish: 'Aapasi' },
          { textHindi: 'अपनी', textEnglish: 'Apni' },
          { textHindi: 'अपनित', textEnglish: 'Apnit' }
        ],
        correctIndex: 0,
        explanationHindi: "'अपना' में 'पन' या 'त्व' प्रत्यय जोड़कर 'अपनापन / अपनत्व' भाववाचक संज्ञा बनती है।",
        explanationEnglish: "'अपनापन' expresses the abstract feeling of belonging."
      },
      {
        id: 'qc_sg7',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'शहर' और 'पुस्तक' किस संज्ञा के उदाहरण हैं?",
        questionEnglish: "'शहर' and 'पुस्तक' are examples of:",
        options: [
          { textHindi: 'जातिवाचक संज्ञा', textEnglish: 'Common Noun' },
          { textHindi: 'व्यक्तिवाचक संज्ञा', textEnglish: 'Proper Noun' },
          { textHindi: 'भाववाचक संज्ञा', textEnglish: 'Abstract Noun' },
          { textHindi: 'द्रव्यवाचक संज्ञा', textEnglish: 'Material Noun' }
        ],
        correctIndex: 0,
        explanationHindi: "ये शब्द किसी एक विशेष शहर या पुस्तक का नहीं, बल्कि पूरी जाति का बोध कराते हैं।",
        explanationEnglish: "General names for any city or book are Common Nouns."
      },
      {
        id: 'qc_sg8',
        topicId: 'sangya',
        topicNameHindi: 'संज्ञा',
        topicNameEnglish: 'Noun',
        questionHindi: "'हँसना' क्रिया से बनने वाली भाववाचक संज्ञा कौन-सी है?",
        questionEnglish: "Which abstract noun derives from the verb 'हँसना'?",
        options: [
          { textHindi: 'हँसी', textEnglish: 'Hansi' },
          { textHindi: 'हँसमुख', textEnglish: 'Hansmukh' },
          { textHindi: 'हँसाना', textEnglish: 'Hansana' },
          { textHindi: 'हँसता', textEnglish: 'Hansta' }
        ],
        correctIndex: 0,
        explanationHindi: "'हँसना' क्रिया से 'हँसी' भाववाचक संज्ञा बनती है।",
        explanationEnglish: "'हँसी' (laughter) is the abstract noun from verb 'हँसना'."
      }
    ]
  },
  {
    id: 'sarvanam',
    slug: 'sarvanam-pointer',
    titleHindi: 'सर्वनाम (Sarvanam Pointer)',
    titleEnglish: 'Pronoun Reference Stage',
    subtitleHindi: 'पुरुषवाचक, निश्चय, अनिश्चय, संबंध, प्रश्न व निजवाचक सर्वनाम',
    subtitleEnglish: 'Master all 6 Hindi pronoun categories in real context',
    iconName: 'Compass',
    bottleneckHindi: '‘यह/वह’ (निश्चयवाचक बनाम सार्वनामिक विशेषण) और ‘आप’ (मध्यम पुरुष बनाम निजवाचक) में भ्रम होता है।',
    bottleneckEnglish: 'Context differentiates demonstrative pronouns from pronominal adjectives and reflexive usage.',
    interactionNameHindi: 'सर्वनाम पॉइंटर (Sarvanam Pointer)',
    interactionNameEnglish: 'Pronoun Pointer Stage',
    whatStudentGainsHindi: 'संदर्भ देखकर सर्वनाम के छः भेदों को तुरंत और सही पहचानने की समझ।',
    whatStudentGainsEnglish: 'Contextual mastery over all 6 Hindi pronoun types.',
    paramparaCorner: {
      definitionHindi: 'संज्ञा के स्थान पर प्रयुक्त होने वाले शब्दों को सर्वनाम कहते हैं।',
      definitionEnglish: 'Words used in place of nouns to avoid repetition.',
      classicalShlokaOrRule: 'सर्वेषां नाम्नां स्थाने प्रयुज्यते इति सर्वनाम।',
      heritageContext: 'हिंदी में मूल सर्वनाम 11 (मैं, तू, आप, यह, वह, जो, सो, कोई, कुछ, कौन, क्या) और भेद 6 हैं।'
    },
    rulesSummary: [
      {
        ruleHindi: 'निजवाचक सर्वनाम (आप, स्वयं, खुद): जब कर्ता स्वयं के लिए ‘आप’ का प्रयोग करे।',
        ruleEnglish: 'Reflexive: Subject uses स्वयं/आप for itself.',
        exampleHindi: 'मैं यह काम आप ही कर लूँगा।',
        exampleEnglish: 'I will do this work myself.'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_sv1',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'दाल में कुछ काला है।' इस वाक्य में 'कुछ' कौन सा सर्वनाम है?",
        questionEnglish: "In 'दाल में कुछ काला है', what pronoun is 'कुछ'?",
        options: [
          { textHindi: 'निश्चयवाचक सर्वनाम', textEnglish: 'Demonstrative' },
          { textHindi: 'अनिश्चयवाचक सर्वनाम', textEnglish: 'Indefinite Pronoun' },
          { textHindi: 'संबंधवाचक सर्वनाम', textEnglish: 'Relative' },
          { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive' }
        ],
        correctIndex: 1,
        explanationHindi: "'कुछ' और 'कोई' अनिश्चित वस्तु या व्यक्ति का बोध कराते हैं, अतः अनिश्चयवाचक सर्वनाम हैं।",
        explanationEnglish: "'कुछ' refers to an indefinite or unspecified thing."
      },
      {
        id: 'qc_sv2',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'मैं अपने आप चला जाऊँगा।' में 'अपने आप' किस भेद का उदाहरण है?",
        questionEnglish: "In 'I will go on my own', what pronoun is 'अपने आप'?",
        options: [
          { textHindi: 'पुरुषवाचक सर्वनाम', textEnglish: 'Personal' },
          { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive Pronoun' },
          { textHindi: 'प्रश्नवाचक सर्वनाम', textEnglish: 'Interrogative' },
          { textHindi: 'संबंधवाचक सर्वनाम', textEnglish: 'Relative' }
        ],
        correctIndex: 1,
        explanationHindi: "कर्ता के साथ 'स्वयं / खुद / अपने आप' का प्रयोग निजवाचक सर्वनाम दर्शाता है।",
        explanationEnglish: "Indicates self-performed action by the subject."
      },
      {
        id: 'qc_sv3',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'जो बोएगा, सो काटेगा।' में 'जो...सो' किस प्रकार के सर्वनाम हैं?",
        questionEnglish: "What type of pronouns are 'जो...सो'?",
        options: [
          { textHindi: 'संबंधवाचक सर्वनाम', textEnglish: 'Relative Pronoun' },
          { textHindi: 'निश्चयवाचक सर्वनाम', textEnglish: 'Demonstrative' },
          { textHindi: 'अनिश्चयवाचक सर्वनाम', textEnglish: 'Indefinite' },
          { textHindi: 'पुरुषवाचक सर्वनाम', textEnglish: 'Personal' }
        ],
        correctIndex: 0,
        explanationHindi: "'जो...सो' और 'जिसकी...उसकी' दो उपवाक्यों के बीच संबंध जोड़ने वाले संबंधवाचक सर्वनाम हैं।",
        explanationEnglish: "Correlative pair linking two clauses is Relative Pronoun."
      },
      {
        id: 'qc_sv4',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'हम' और 'मेरा' पुरुषवाचक सर्वनाम के किस उपभेद में आते हैं?",
        questionEnglish: "'हम' and 'मेरा' belong to which personal pronoun sub-type?",
        options: [
          { textHindi: 'उत्तम पुरुष (First Person)', textEnglish: 'First Person' },
          { textHindi: 'मध्यम पुरुष (Second Person)', textEnglish: 'Second Person' },
          { textHindi: 'अन्य पुरुष (Third Person)', textEnglish: 'Third Person' },
          { textHindi: 'निजवाचक (Reflexive)', textEnglish: 'Reflexive' }
        ],
        correctIndex: 0,
        explanationHindi: "बोलने वाला अपने लिए 'मैं, हम, मेरा, हमारा' (उत्तम पुरुष) प्रयोग करता है।",
        explanationEnglish: "Speaker pronouns fall under First Person (उत्तम पुरुष)."
      },
      {
        id: 'qc_sv5',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'दरवाज़े पर कौन आया है?' में 'कौन' किस भेद का सर्वनाम है?",
        questionEnglish: "In 'Who came to the door?', what pronoun is 'कौन'?",
        options: [
          { textHindi: 'प्रश्नवाचक सर्वनाम', textEnglish: 'Interrogative Pronoun' },
          { textHindi: 'निश्चयवाचक सर्वनाम', textEnglish: 'Demonstrative' },
          { textHindi: 'संबंधवाचक सर्वनाम', textEnglish: 'Relative' },
          { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive' }
        ],
        correctIndex: 0,
        explanationHindi: "प्राणी के विषय में प्रश्न पूछने के लिए 'कौन' प्रश्नवाचक सर्वनाम का प्रयोग होता है।",
        explanationEnglish: "'कौन' asks a question about an animate subject."
      },
      {
        id: 'qc_sv6',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'वह मेरी घड़ी है।' यहाँ 'वह' किस भेद का उदाहरण है?",
        questionEnglish: "In 'वह मेरी घड़ी है', what is 'वह'?",
        options: [
          { textHindi: 'निश्चयवाचक सर्वनाम', textEnglish: 'Demonstrative Pronoun' },
          { textHindi: 'अनिश्चयवाचक सर्वनाम', textEnglish: 'Indefinite' },
          { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive' },
          { textHindi: 'प्रश्नवाचक सर्वनाम', textEnglish: 'Interrogative' }
        ],
        correctIndex: 0,
        explanationHindi: "यहाँ 'वह' दूर की किसी निश्चित वस्तु (घड़ी) की ओर संकेत कर रहा है, अतः निश्चयवाचक सर्वनाम है।",
        explanationEnglish: "Points definitively to a specific watch without immediately preceding the noun."
      },
      {
        id: 'qc_sv7',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "हिंदी में सर्वनाम के कुल कितने मुख्य भेद होते हैं?",
        questionEnglish: "How many main types of pronouns exist in Hindi?",
        options: [
          { textHindi: '6 भेद', textEnglish: '6 types' },
          { textHindi: '4 भेद', textEnglish: '4 types' },
          { textHindi: '8 भेद', textEnglish: '8 types' },
          { textHindi: '5 भेद', textEnglish: '5 types' }
        ],
        correctIndex: 0,
        explanationHindi: "पुरुषवाचक, निश्चयवाचक, अनिश्चयवाचक, संबंधवाचक, प्रश्नवाचक और निजवाचक — कुल 6 भेद।",
        explanationEnglish: "There are 6 standard categories of Hindi pronouns."
      },
      {
        id: 'qc_sv8',
        topicId: 'sarvanam',
        topicNameHindi: 'सर्वनाम',
        topicNameEnglish: 'Pronoun',
        questionHindi: "'आप अंदर बैठ जाइए।' यहाँ आदरसूचक 'आप' कौन सा सर्वनाम है?",
        questionEnglish: "In polite 'आप अंदर बैठ जाइए', what pronoun is 'आप'?",
        options: [
          { textHindi: 'मध्यम पुरुषवाचक सर्वनाम', textEnglish: 'Second Person Pronoun' },
          { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive Pronoun' },
          { textHindi: 'उत्तम पुरुष', textEnglish: 'First Person' },
          { textHindi: 'अनिश्चयवाचक', textEnglish: 'Indefinite' }
        ],
        correctIndex: 0,
        explanationHindi: "जब 'आप' का प्रयोग श्रोता (सामने वाले व्यक्ति) को आदर देने के लिए हो, तो वह मध्यम पुरुषवाचक होता है।",
        explanationEnglish: "Honorific 'आप' addressing the listener is Second Person."
      }
    ]
  },
  {
    id: 'visheshan',
    slug: 'visheshan-lens',
    titleHindi: 'विशेषण एवं अवस्थाएँ (Visheshan Lens)',
    titleEnglish: 'Adjectives & Comparison Lens',
    subtitleHindi: 'गुण, संख्या, परिमाण, सार्वनामिक विशेषण व तुलना की तीन अवस्थाएँ',
    subtitleEnglish: 'Distinguish count vs measure and master positive/comparative/superlative',
    iconName: 'Sparkles',
    bottleneckHindi: 'संख्यावाचक व परिमाणवाचक तथा निश्चयवाचक सर्वनाम व सार्वनामिक विशेषण के बीच अंतर समझना कठिन लगता है।',
    bottleneckEnglish: 'Countable vs measurable adjectives and pronominal adjectives cause frequent exam slips.',
    interactionNameHindi: 'विशेषण लेंस (Visheshan Lens)',
    interactionNameEnglish: 'Adjective & Degree Lens',
    whatStudentGainsHindi: 'संज्ञा-विशेषण संबंध और तुलनात्मक अवस्थाओं (-तर / -तम) का स्पष्ट ज्ञान।',
    whatStudentGainsEnglish: 'Clear command of adjective classification and degrees.',
    paramparaCorner: {
      definitionHindi: 'जो शब्द संज्ञा या सर्वनाम की विशेषता (गुण, संख्या, मात्रा आदि) बताते हैं, उन्हें विशेषण कहते हैं।',
      definitionEnglish: 'Words that qualify or modify nouns and pronouns.',
      classicalShlokaOrRule: 'विशेष्यस्य गुण-संख्या-परिमाणादि बोधकं विशेषणम्।',
      heritageContext: 'जिसकी विशेषता बताई जाए उसे विशेष्य और विशेषता की भी विशेषता बताने वाले को प्रविशेषण कहते हैं।'
    },
    rulesSummary: [
      {
        ruleHindi: 'संख्या बनाम परिमाण: गिने जाने योग्य = संख्यावाचक, मापे/तौले जाने योग्य = परिमाणवाचक।',
        ruleEnglish: 'Countable = Numeral; Measured/weighed = Quantity.',
        exampleHindi: 'चार केले (संख्यावाचक) — दो किलो आम (परिमाणवाचक)',
        exampleEnglish: '4 bananas (Numeral) — 2 kg mangoes (Quantity)'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_vs1',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'दो मीटर कपड़ा' में 'दो मीटर' किस प्रकार का विशेषण है?",
        questionEnglish: "What kind of adjective is 'दो मीटर' in 'दो मीटर कपड़ा'?",
        options: [
          { textHindi: 'निश्चित परिमाणवाचक विशेषण', textEnglish: 'Definite Quantity Adjective' },
          { textHindi: 'निश्चित संख्यावाचक विशेषण', textEnglish: 'Definite Numeral' },
          { textHindi: 'गुणवाचक विशेषण', textEnglish: 'Quality Adjective' },
          { textHindi: 'सार्वनामिक विशेषण', textEnglish: 'Pronominal' }
        ],
        correctIndex: 0,
        explanationHindi: "कपड़ा मीटर से मापा जाता है (गिना नहीं जाता), अतः निश्चित परिमाणवाचक विशेषण है।",
        explanationEnglish: "Cloth is measured by length rather than counted."
      },
      {
        id: 'qc_vs2',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'यह घर बहुत सुंदर है।' इस वाक्य में 'यह' क्या है?",
        questionEnglish: "In 'यह घर बहुत सुंदर है', what role does 'यह' play?",
        options: [
          { textHindi: 'सार्वनामिक (संकेतवाचक) विशेषण', textEnglish: 'Pronominal Adjective' },
          { textHindi: 'निजवाचक सर्वनाम', textEnglish: 'Reflexive Pronoun' },
          { textHindi: 'परिमाणवाचक विशेषण', textEnglish: 'Quantity Adjective' },
          { textHindi: 'प्रविशेषण', textEnglish: 'Intensifier' }
        ],
        correctIndex: 0,
        explanationHindi: "'यह' सर्वनाम संज्ञा ('घर') से ठीक पहले आकर उसकी ओर संकेत कर रहा है, अतः सार्वनामिक विशेषण है।",
        explanationEnglish: "Directly precedes noun 'घर' as a demonstrative determiner."
      },
      {
        id: 'qc_vs3',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'बगीचे में लाल गुलाब खिले हैं।' इसमें 'लाल' और 'गुलाब' क्रमशः क्या हैं?",
        questionEnglish: "In 'लाल गुलाब', what are 'लाल' and 'गुलाब' respectively?",
        options: [
          { textHindi: 'विशेषण और विशेष्य', textEnglish: 'Adjective and Qualified Noun' },
          { textHindi: 'विशेष्य और प्रविशेषण', textEnglish: 'Noun and Intensifier' },
          { textHindi: 'क्रिया और कर्ता', textEnglish: 'Verb and Subject' },
          { textHindi: 'सर्वनाम और संज्ञा', textEnglish: 'Pronoun and Noun' }
        ],
        correctIndex: 0,
        explanationHindi: "विशेषता बताने वाला शब्द 'लाल' विशेषण है और जिसकी विशेषता बताई जाए ('गुलाब') वह विशेष्य है।",
        explanationEnglish: "'लाल' modifies 'गुलाब', making them Visheshan and Visheshya."
      },
      {
        id: 'qc_vs4',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'वह अत्यंत बुद्धिमान छात्र है।' में 'अत्यंत' शब्द व्याकरण की दृष्टि से क्या है?",
        questionEnglish: "In 'अत्यंत बुद्धिमान', what is 'अत्यंत'?",
        options: [
          { textHindi: 'प्रविशेषण (विशेषण की विशेषता बताने वाला)', textEnglish: 'Pravisheshan (Intensifier)' },
          { textHindi: 'परिमाणवाचक विशेषण', textEnglish: 'Quantity Adjective' },
          { textHindi: 'संख्यावाचक विशेषण', textEnglish: 'Numeral Adjective' },
          { textHindi: 'विशेष्य', textEnglish: 'Qualified Noun' }
        ],
        correctIndex: 0,
        explanationHindi: "जो शब्द विशेषण ('बुद्धिमान') की भी विशेषता बताए, उसे प्रविशेषण कहते हैं।",
        explanationEnglish: "A word modifying another adjective is called Pravisheshan."
      },
      {
        id: 'qc_vs5',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'उच्च' विशेषण की उत्तमावस्था (Superlative) क्या होगी?",
        questionEnglish: "What is the superlative degree of 'उच्च'?",
        options: [
          { textHindi: 'उच्चतर', textEnglish: 'Uchchatar' },
          { textHindi: 'उच्चतम', textEnglish: 'Uchchatam' },
          { textHindi: 'ऊँचाई', textEnglish: 'Oonchai' },
          { textHindi: 'उच्चता', textEnglish: 'Uchchata' }
        ],
        correctIndex: 1,
        explanationHindi: "उत्तरावस्था में '-तर' (उच्चतर) और उत्तमावस्था में '-तम' (उच्चतम) प्रत्यय लगता है।",
        explanationEnglish: "Superlative degree uses suffix '-तम'."
      },
      {
        id: 'qc_vs6',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'कक्षा में कुछ विद्यार्थी उपस्थित थे।' यहाँ 'कुछ' कौन सा विशेषण है?",
        questionEnglish: "In 'कुछ विद्यार्थी', what adjective is 'कुछ'?",
        options: [
          { textHindi: 'अनिश्चित संख्यावाचक विशेषण', textEnglish: 'Indefinite Numeral Adjective' },
          { textHindi: 'अनिश्चित परिमाणवाचक', textEnglish: 'Indefinite Quantity' },
          { textHindi: 'गुणवाचक विशेषण', textEnglish: 'Quality' },
          { textHindi: 'सार्वनामिक विशेषण', textEnglish: 'Pronominal' }
        ],
        correctIndex: 0,
        explanationHindi: "विद्यार्थियों को गिना जा सकता है, पर 'कुछ' से निश्चित गिनती ज्ञात नहीं है।",
        explanationEnglish: "Students are countable, and 'कुछ' gives an indefinite number."
      },
      {
        id: 'qc_vs7',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'भारत' संज्ञा से बनने वाला सही विशेषण शब्द चुनिए:",
        questionEnglish: "Select the adjective formed from 'भारत':",
        options: [
          { textHindi: 'भारतीय', textEnglish: 'Bharatiya' },
          { textHindi: 'भारती', textEnglish: 'Bharati' },
          { textHindi: 'भारतपन', textEnglish: 'Bharatpan' },
          { textHindi: 'भारतीयता', textEnglish: 'Bharatiyata' }
        ],
        correctIndex: 0,
        explanationHindi: "'भारत' + 'ईय' = 'भारतीय' विशेषण है (जबकि 'भारतीयता' भाववाचक संज्ञा है)।",
        explanationEnglish: "'भारतीय' is an adjective; 'भारतीयता' is an abstract noun."
      },
      {
        id: 'qc_vs8',
        topicId: 'visheshan',
        topicNameHindi: 'विशेषण',
        topicNameEnglish: 'Adjective',
        questionHindi: "'प्राचीन' और 'ताज़ा' विशेषण के किस भेद में आते हैं?",
        questionEnglish: "'प्राचीन' and 'ताज़ा' belong to which adjective type?",
        options: [
          { textHindi: 'गुणवाचक विशेषण', textEnglish: 'Adjective of Quality' },
          { textHindi: 'संख्यावाचक विशेषण', textEnglish: 'Numeral' },
          { textHindi: 'परिमाणवाचक विशेषण', textEnglish: 'Quantity' },
          { textHindi: 'सार्वनामिक विशेषण', textEnglish: 'Pronominal' }
        ],
        correctIndex: 0,
        explanationHindi: "काल, दशा, रंग, आकार आदि का बोध कराने वाले शब्द गुणवाचक विशेषण होते हैं।",
        explanationEnglish: "Words describing time-age or freshness fall under Quality Adjectives."
      }
    ]
  },
  {
    id: 'shabd-bhandar',
    slug: 'shabd-bhandar',
    titleHindi: 'शब्द भंडार: पर्यायवाची, विलोम व वाक्यांश',
    titleEnglish: 'Vocabulary, Synonyms & Antonyms Lab',
    subtitleHindi: 'पर्यायवाची, विलोम, श्रुतिसम भिन्नार्थक, तत्सम-तद्भव व एकार्थी प्रयोग',
    subtitleEnglish: 'Master ICSE board vocabulary categories interactively',
    iconName: 'Award',
    bottleneckHindi: 'श्रुतिसम भिन्नार्थक (अनल-अनिल) तथा तत्सम-तद्भव और वाक्यांश के लिए एक शब्द परीक्षा में सीधे अंक दिलाते या काटते हैं।',
    bottleneckEnglish: 'Homonyms, Sanskrit-Hindi origins, and one-word substitutions frequently test precision.',
    interactionNameHindi: 'शब्द भंडार लैब (Shabd Lab)',
    interactionNameEnglish: 'Vocabulary Relations Lab',
    whatStudentGainsHindi: 'समृद्ध हिंदी शब्द-ज्ञान और ICSE व्याकरण अनुभाग में शत-प्रतिशत सटीकता।',
    whatStudentGainsEnglish: 'Richer vocabulary command and precision for ICSE exams.',
    paramparaCorner: {
      definitionHindi: 'पर्यायवाची (समानार्थी), विलोम (विपरीतार्थी) और एकल शब्द भाषा की अभिव्यक्ति क्षमता को समृद्ध करते हैं।',
      definitionEnglish: 'Synonyms, antonyms, and compact substitutions enrich expressive clarity.',
      classicalShlokaOrRule: 'शब्दानां विविधाः शक्तयः अभिधा लक्षणा व्यञ्जना च।',
      heritageContext: 'संस्कृत और हिंदी कोश परंपरा में अमरकोश शब्द-संपदा का महान ग्रंथ रहा है।'
    },
    rulesSummary: [
      {
        ruleHindi: 'तत्सम बनाम तद्भव: तत्सम शब्द तत्-सम (संस्कृत के समान) होते हैं।',
        ruleEnglish: 'Tatsam = original Sanskrit word; Tadbhav = simplified Hindi derivative.',
        exampleHindi: 'अक्षि → आँख | हस्त → हाथ | सूर्य → सूरज',
        exampleEnglish: 'Akshi -> Aankh | Hasta -> Haath'
      }
    ],
    quickCheckQuestions: [
      {
        id: 'qc_sb1',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'सूर्य' का पर्यायवाची शब्द कौन-सा नहीं है?",
        questionEnglish: "Which of the following is NOT a synonym of 'सूर्य'?",
        options: [
          { textHindi: 'दिनकर', textEnglish: 'Dinkar' },
          { textHindi: 'भास्कर', textEnglish: 'Bhaskar' },
          { textHindi: 'सुधाकर (चंद्रमा)', textEnglish: 'Sudhakar (Moon)' },
          { textHindi: 'दिवाकर', textEnglish: 'Diwakar' }
        ],
        correctIndex: 2,
        explanationHindi: "'सुधाकर' चंद्रमा का पर्यायवाची है, जबकि दिनकर, दिवाकर और भास्कर सूर्य के पर्यायवाची हैं।",
        explanationEnglish: "'Sudhakar' means Moon, whereas the rest mean Sun."
      },
      {
        id: 'qc_sb2',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'उत्कर्ष' शब्द का सही विलोम शब्द क्या है?",
        questionEnglish: "What is the correct antonym of 'उत्कर्ष'?",
        options: [
          { textHindi: 'अपकर्ष', textEnglish: 'Apkarsh' },
          { textHindi: 'निष्कर्ष', textEnglish: 'Nishkarsh' },
          { textHindi: 'संकर्ष', textEnglish: 'Sankarsh' },
          { textHindi: 'प्रकर्ष', textEnglish: 'Prakarsh' }
        ],
        correctIndex: 0,
        explanationHindi: "'उत्कर्ष' (उन्नति) का ठीक विपरीतार्थक विलोम 'अपकर्ष' (अवनति) होता है।",
        explanationEnglish: "'Apkarsh' (decline) is the opposite of 'Utkarsh' (rise)."
      },
      {
        id: 'qc_sb3',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'जो किए गए उपकार को मानता हो' — वाक्यांश के लिए एक शब्द चुनिए:",
        questionEnglish: "One word for 'One who acknowledges kindness done to them':",
        options: [
          { textHindi: 'कृतज्ञ', textEnglish: 'Kritagya (Grateful)' },
          { textHindi: 'कृतघ्न', textEnglish: 'Kritaghna (Ungrateful)' },
          { textHindi: 'सर्वज्ञ', textEnglish: 'Sarvagya' },
          { textHindi: 'अल्पज्ञ', textEnglish: 'Alpagya' }
        ],
        correctIndex: 0,
        explanationHindi: "उपकार मानने वाले को 'कृतज्ञ' और उपकार न मानने वाले को 'कृतघ्न' कहते हैं।",
        explanationEnglish: "'Kritagya' means grateful; 'Kritaghna' means ungrateful."
      },
      {
        id: 'qc_sb4',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'अनल' और 'अनिल' श्रुतिसम भिन्नार्थक शब्दों के क्रमशः सही अर्थ क्या हैं?",
        questionEnglish: "What do 'अनल' and 'अनिल' mean respectively?",
        options: [
          { textHindi: 'आग और हवा', textEnglish: 'Fire and Wind' },
          { textHindi: 'हवा और आग', textEnglish: 'Wind and Fire' },
          { textHindi: 'जल और आकाश', textEnglish: 'Water and Sky' },
          { textHindi: 'कमल और बादल', textEnglish: 'Lotus and Cloud' }
        ],
        correctIndex: 0,
        explanationHindi: "'अनल' का अर्थ अग्नि (आग) और 'अनिल' का अर्थ वायु (हवा) होता है।",
        explanationEnglish: "Anal = Fire; Anil = Wind/Air."
      },
      {
        id: 'qc_sb5',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'हस्त' और 'कर्ण' शब्दों के तद्भव रूप क्रमशः क्या हैं?",
        questionEnglish: "What are the Tadbhav (Hindi) forms of 'हस्त' and 'कर्ण'?",
        options: [
          { textHindi: 'हाथ और कान', textEnglish: 'Haath and Kaan' },
          { textHindi: 'पैर और आँख', textEnglish: 'Pair and Aankh' },
          { textHindi: 'हाथी और किरण', textEnglish: 'Haathi and Kiran' },
          { textHindi: 'हँसी और काम', textEnglish: 'Hansi and Kaam' }
        ],
        correctIndex: 0,
        explanationHindi: "तत्सम 'हस्त' से तद्भव 'हाथ' और 'कर्ण' से 'कान' बनता है।",
        explanationEnglish: "Hasta becomes Haath (hand); Karna becomes Kaan (ear)."
      },
      {
        id: 'qc_sb6',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'अम्बर' शब्द के दो भिन्न अनेकार्थी अर्थ क्या हैं?",
        questionEnglish: "What are two distinct meanings of 'अम्बर'?",
        options: [
          { textHindi: 'आकाश और वस्त्र', textEnglish: 'Sky and Cloth' },
          { textHindi: 'पृथ्वी और जल', textEnglish: 'Earth and Water' },
          { textHindi: 'सोना और गेहूँ', textEnglish: 'Gold and Wheat' },
          { textHindi: 'हाथ और कर', textEnglish: 'Hand and Tax' }
        ],
        correctIndex: 0,
        explanationHindi: "'अम्बर' का प्रयोग 'आकाश' (गगन) तथा 'वस्त्र' (कपड़ा, जैसे पीताम्बर) दोनों अर्थों में होता है।",
        explanationEnglish: "'Ambar' means both sky and garment."
      },
      {
        id: 'qc_sb7',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'अल्प' का विलोम और 'कमल' का एक पर्यायवाची क्रमशः चुनिए:",
        questionEnglish: "Pick the antonym of 'अल्प' and synonym of 'कमल':",
        options: [
          { textHindi: 'अधिक और पंकज', textEnglish: 'Adhik and Pankaj' },
          { textHindi: 'न्यून और नीरद', textEnglish: 'Nyun and Neerad' },
          { textHindi: 'थोड़ा और जलद', textEnglish: 'Thoda and Jalad' },
          { textHindi: 'सघन और वारिद', textEnglish: 'Saghan and Vaarid' }
        ],
        correctIndex: 0,
        explanationHindi: "'अल्प' (कम) का विलोम 'अधिक' है और 'पंकज' (कीचड़ में जन्मा) कमल का पर्यायवाची है।",
        explanationEnglish: "Antonym of 'alp' is 'adhik', and 'pankaj' means lotus ('neerad/jalad' mean cloud)."
      },
      {
        id: 'qc_sb8',
        topicId: 'shabd-bhandar',
        topicNameHindi: 'शब्द भंडार',
        topicNameEnglish: 'Vocabulary',
        questionHindi: "'जिसके समान कोई दूसरा न हो' — एक शब्द में क्या कहेंगे?",
        questionEnglish: "One word for 'Unique / Unparalleled':",
        options: [
          { textHindi: 'अद्वितीय', textEnglish: 'Advitiya' },
          { textHindi: 'अनुपस्थित', textEnglish: 'Anupasthit' },
          { textHindi: 'अमर', textEnglish: 'Amar' },
          { textHindi: 'अदृश्य', textEnglish: 'Adrishya' }
        ],
        correctIndex: 0,
        explanationHindi: "जिसके समान दूसरा न हो, वह 'अद्वितीय' कहलाता है।",
        explanationEnglish: "'Advitiya' means without a second / unique."
      }
    ]
  }
];
