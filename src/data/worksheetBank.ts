import { GradeLevel, MistakeTopicStat, QuizQuestion } from '../types';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { CLASS5_AND_6_RAW_BANK } from './class5And6Bank';
import { CLASS7_TO_10_RAW_BANK } from './class7To10Bank';
import { getCurriculumForGrade } from './classCurriculum';

export interface RawBankQuestion {
  qH: string;
  qE: string;
  correct: string;
  wrongs: [string, string, string];
  expH: string;
  expE: string;
}

const RAW_BANK: Record<string, RawBankQuestion[]> = {
  ...CLASS5_AND_6_RAW_BANK,
  ...CLASS7_TO_10_RAW_BANK,
  karak: [
    {
      qH: "'पेड़ से सेब गिरा।' वाक्य में 'से' किस कारक का चिह्न है?",
      qE: "In 'The apple fell from the tree', which case is marked by 'से'?",
      correct: 'अपादान कारक (अलगाव)',
      wrongs: ['करण कारक (साधन)', 'कर्म कारक', 'अधिकरण कारक'],
      expH: 'यहाँ सेब के पेड़ से अलग होने का भाव है, अतः अपादान कारक है।',
      expE: 'Detachment from the tree indicates Apadan Karak.'
    },
    {
      qH: "'रोहन ने चाकू से फल काटा।' में 'चाकू से' कौन-सा कारक है?",
      qE: "In 'Rohan cut the fruit with a knife', identify the case of 'चाकू से'.",
      correct: 'करण कारक (साधन)',
      wrongs: ['अपादान कारक', 'कर्ता कारक', 'सम्प्रदान कारक'],
      expH: 'चाकू काटने की क्रिया का साधन है, अतः करण कारक है।',
      expE: 'Knife is the instrument of action, marking Karan Karak.'
    },
    {
      qH: "'माँ ने भूखे को भोजन दिया।' वाक्य में 'भूखे को' में कौन-सा कारक है?",
      qE: "In 'Mother gave food to the hungry', which case applies to 'भूखे को'?",
      correct: 'सम्प्रदान कारक',
      wrongs: ['कर्म कारक', 'करण कारक', 'संबंध कारक'],
      expH: 'किसी को कुछ देने के भाव में सम्प्रदान कारक होता है।',
      expE: 'Giving to someone invokes Sampradan Karak.'
    },
    {
      qH: "'छत पर मोर नाच रहा है।' वाक्य में अधिकरण कारक पद कौन-सा है?",
      qE: "In 'The peacock is dancing on the roof', which phrase is Adhikaran Karak?",
      correct: 'छत पर',
      wrongs: ['मोर', 'नाच रहा है', 'कोई नहीं'],
      expH: "स्थान या आधार बताने वाले पद ('में/पर') अधिकरण कारक होते हैं।",
      expE: 'Location or support takes Adhikaran Karak.'
    },
    {
      qH: "'अरे भाई! तुम कहाँ जा रहे हो?' में कौन-सा कारक प्रयुक्त हुआ है?",
      qE: "Which case is used in 'Hey brother! Where are you going?'?",
      correct: 'संबोधन कारक',
      wrongs: ['कर्ता कारक', 'संबंध कारक', 'अपादान कारक'],
      expH: 'किसी को पुकारने या संबोधित करने में संबोधन कारक होता है।',
      expE: 'Addressing someone directly uses Sambodhan Karak.'
    },
    {
      qH: "'यह राजा का महल है।' में 'राजा का' किस कारक का उदाहरण है?",
      qE: "In 'This is the king's palace', which case is 'राजा का'?",
      correct: 'संबंध कारक',
      wrongs: ['कर्ता कारक', 'कर्म कारक', 'करण कारक'],
      expH: "'का, के, की' विभक्तियाँ संज्ञाओं के बीच संबंध बताती हैं।",
      expE: 'Possession or relation between nouns marks Sambandh Karak.'
    },
    {
      qH: "'बच्चा कुत्ते से डरता है।' वाक्य में कौन-सा कारक है?",
      qE: "Identify the case in 'The child is afraid of the dog'.",
      correct: 'अपादान कारक (भय का भाव)',
      wrongs: ['करण कारक', 'कर्म कारक', 'अधिकरण कारक'],
      expH: 'भय, रक्षा या घृणा के संदर्भ में अपादान कारक होता है।',
      expE: 'Fear or avoidance triggers Apadan Karak.'
    },
    {
      qH: "'सुनीता ने मधुर गीत गाया।' में कर्ता कारक कौन-सा है?",
      qE: "Identify the agent (Karta) in 'Sunita sang a sweet song'.",
      correct: 'सुनीता ने',
      wrongs: ['मधुर गीत', 'गाया', 'मधुर'],
      expH: "क्रिया करने वाली 'सुनीता' है जिसके साथ 'ने' परसर्ग जुड़ा है।",
      expE: 'Sunita performs the action, marked by ergative ने.'
    },
    {
      qH: "'गंगा हिमालय से निकलती है।' में 'हिमालय से' कौन-सा कारक है?",
      qE: "In 'Ganga originates from the Himalayas', identify the case of 'हिमालय से'.",
      correct: 'अपादान कारक',
      wrongs: ['करण कारक', 'संबंध कारक', 'अधिकरण कारक'],
      expH: 'उद्गम स्थान से अलग होने का भाव होने के कारण अपादान कारक है।',
      expE: 'Origin or emerging from a source uses Apadan Karak.'
    },
    {
      qH: "'हम कानों से सुनते हैं।' इस वाक्य में 'कानों से' कौन-सा कारक है?",
      qE: "In 'We hear with our ears', which case is 'कानों से'?",
      correct: 'करण कारक',
      wrongs: ['अपादान कारक', 'कर्म कारक', 'सम्प्रदान कारक'],
      expH: 'सुनने की क्रिया का माध्यम या साधन कान हैं, अतः करण कारक है।',
      expE: 'Ears serve as the instrument for hearing.'
    },
    {
      qH: "'मेज पर किताबें रखी हैं।' में 'पर' किस कारक का परसर्ग है?",
      qE: "In 'Books are kept on the table', 'पर' belongs to which case?",
      correct: 'अधिकरण कारक',
      wrongs: ['संबंध कारक', 'कर्म कारक', 'करण कारक'],
      expH: "'में' और 'पर' अधिकरण कारक की विभक्तियाँ हैं।",
      expE: "'में' and 'पर' are postpositions for Adhikaran Karak."
    },
    {
      qH: "'पिताजी ने बच्चों के लिए खिलौने खरीदे।' में 'बच्चों के लिए' कौन-सा कारक है?",
      qE: "In 'Father bought toys for the children', which case is 'बच्चों के लिए'?",
      correct: 'सम्प्रदान कारक',
      wrongs: ['संबंध कारक', 'कर्म कारक', 'अपादान कारक'],
      expH: "'के लिए' विभक्ति चिह्न सम्प्रदान कारक को दर्शाता है।",
      expE: "Beneficiary marker 'के लिए' signifies Sampradan Karak."
    },
    {
      qH: "'रमेश ने सोहन को पुस्तक पढ़ाई।' इसमें 'पुस्तक' किस कारक के अंतर्गत आती है?",
      qE: "In 'Ramesh taught Sohan a book', what case is 'पुस्तक'?",
      correct: 'कर्म कारक',
      wrongs: ['कर्ता कारक', 'करण कारक', 'अधिकरण कारक'],
      expH: 'क्रिया का सीधा फल जिस वस्तु पर पड़े, वह कर्म कारक होती है।',
      expE: 'The direct object receiving the verb action is Karm Karak.'
    },
    {
      qH: "'हे ईश्वर! सबका कल्याण करो।' वाक्य में प्रयुक्त कारक पहचानिए:",
      qE: "Identify the case in 'O God! Bless everyone.':",
      correct: 'संबोधन कारक',
      wrongs: ['कर्ता कारक', 'सम्प्रदान कारक', 'संबंध कारक'],
      expH: "ईश्वर को पुकारने के लिए 'हे' व विस्मयादिबोधक चिह्न लगा है, जो संबोधन कारक है।",
      expE: 'Calling upon God uses Sambodhan Karak.'
    },
    {
      qH: "'राम श्याम से अधिक बुद्धिमान है।' तुलना के अर्थ में कौन-सा कारक है?",
      qE: "In 'Ram is wiser than Shyam', comparison invokes which case?",
      correct: 'अपादान कारक',
      wrongs: ['करण कारक', 'संबंध कारक', 'अधिकरण कारक'],
      expH: 'दो वस्तुओं या व्यक्तियों की तुलना में अपादान कारक प्रयुक्त होता है।',
      expE: 'Comparison between two entities uses Apadan Karak in Hindi.'
    },
    {
      qH: "'बिल्ली कमरे में बैठी है।' में कौन-सा कारक है?",
      qE: "Which case is highlighted in 'The cat is sitting in the room'?",
      correct: 'अधिकरण कारक',
      wrongs: ['कर्म कारक', 'करण कारक', 'अपादान कारक'],
      expH: "'कमरे में' बैठने का स्थान बता रहा है, अतः अधिकरण कारक है।",
      expE: "'कमरे में' specifies spatial location (Adhikaran)."
    },
    {
      qH: "'मेरी बहन कल दिल्ली जाएगी।' में 'मेरी' किस कारक का चिह्न लिए हुए है?",
      qE: "In 'My sister will go to Delhi tomorrow', which case is shown by 'मेरी'?",
      correct: 'संबंध कारक',
      wrongs: ['कर्ता कारक', 'कर्म कारक', 'सम्प्रदान कारक'],
      expH: "सर्वनाम के साथ 'रा, रे, री' लगने पर संबंध कारक होता है।",
      expE: "Possessive pronouns ending in 'री' mark Sambandh Karak."
    },
    {
      qH: "'मज़दूर कुदाल से मिट्टी खोद रहा है।' में 'कुदाल से' क्या है?",
      qE: "In 'The laborer is digging soil with a spade', what is 'कुदाल से'?",
      correct: 'करण कारक',
      wrongs: ['अपादान कारक', 'कर्म कारक', 'अधिकरण कारक'],
      expH: 'कुदाल मिट्टी खोदने का उपकरण (साधन) है।',
      expE: 'Spade is the tool used for digging (Karan Karak).'
    },
    {
      qH: "'लड़की ने गुरुजी से संगीत सीखा।' सीखने के संदर्भ में 'गुरुजी से' कौन-सा कारक है?",
      qE: "In 'The girl learned music from the Guru', identify 'गुरुजी से'.",
      correct: 'अपादान कारक',
      wrongs: ['करण कारक', 'सम्प्रदान कारक', 'संबंध कारक'],
      expH: 'किसी से विद्या या ज्ञान सीखने के संदर्भ में अपादान कारक होता है।',
      expE: 'Learning from a teacher takes Apadan Karak.'
    },
    {
      qH: "'अध्यापक ने छात्रों को पाठ समझाया।' में 'छात्रों को' कौन-सा कारक है?",
      qE: "In 'The teacher explained the lesson to the students', identify 'छात्रों को'.",
      correct: 'कर्म कारक',
      wrongs: ['अपादान कारक', 'करण कारक', 'अधिकरण कारक'],
      expH: 'समझाने की क्रिया का प्रभाव छात्रों पर पड़ रहा है, अतः कर्म कारक है।',
      expE: 'Students are the recipient object of the verb.'
    }
  ],

  vakya: [
    {
      qH: "'सूर्योदय हुआ और पक्षी चहचहाने लगे।' यह किस प्रकार का वाक्य है?",
      qE: "Classify: 'The sun rose and birds began to chirp.'",
      correct: 'संयुक्त वाक्य (Compound)',
      wrongs: ['सरल वाक्य', 'मिश्र वाक्य', 'संदेहवाचक वाक्य'],
      expH: "दो स्वतंत्र उपवाक्य 'और' योजक से जुड़े हैं, अतः संयुक्त वाक्य है।",
      expE: "Two independent clauses linked by 'और'."
    },
    {
      qH: "'जैसे ही उसने घंटी बजाई, वैसे ही चपरासी आ गया।' यह कौन-सा वाक्य है?",
      qE: "Identify: 'As soon as he rang the bell, the peon arrived.'",
      correct: 'मिश्र वाक्य (Complex)',
      wrongs: ['सरल वाक्य', 'संयुक्त वाक्य', 'विस्मयादिबोधक वाक्य'],
      expH: "'जैसे ही... वैसे ही' से मुख्य व आश्रित उपवाक्य जुड़े हैं।",
      expE: 'Contains a dependent adverbial clause.'
    },
    {
      qH: "'परिश्रमी छात्र परीक्षा में अवश्य सफल होते हैं।' रचना के आधार पर वाक्य है:",
      qE: "Classify structurally: 'Hardworking students surely succeed in exams.'",
      correct: 'सरल वाक्य (Simple)',
      wrongs: ['मिश्र वाक्य', 'संयुक्त वाक्य', 'आज्ञावाचक वाक्य'],
      expH: 'एक ही उद्देश्य और एक ही मुख्य क्रिया होने के कारण सरल वाक्य है।',
      expE: 'Single finite predicate forms a Simple Sentence.'
    },
    {
      qH: "'शायद आज शाम को तेज़ बारिश होगी।' अर्थ के आधार पर यह कौन-सा वाक्य है?",
      qE: "Identify by meaning: 'Perhaps it will rain heavily this evening.'",
      correct: 'संदेहवाचक वाक्य',
      wrongs: ['विधानवाचक वाक्य', 'संकेतवाचक वाक्य', 'इच्छावाचक वाक्य'],
      expH: "'शायद' शब्द अनिश्चितता या संदेह प्रकट करता है।",
      expE: "'Perhaps' indicates doubt or possibility."
    },
    {
      qH: "'यदि समय पर वर्षा होती तो फसल अच्छी होती।' यह कौन-सा वाक्य है?",
      qE: "Classify by meaning: 'If it rained on time, the crop would be good.'",
      correct: 'संकेतवाचक वाक्य',
      wrongs: ['इच्छावाचक वाक्य', 'संदेहवाचक वाक्य', 'निषेधवाचक वाक्य'],
      expH: 'एक क्रिया का होना दूसरी शर्त पर निर्भर होने से संकेतवाचक वाक्य है।',
      expE: 'Conditional dependency marks Sanketvachak.'
    },
    {
      qH: "'वह बाज़ार गया परंतु पुस्तक नहीं ला सका।' किस प्रकार का वाक्य है?",
      qE: "Classify: 'He went to the market but could not bring the book.'",
      correct: 'संयुक्त वाक्य',
      wrongs: ['सरल वाक्य', 'मिश्र वाक्य', 'आज्ञावाचक वाक्य'],
      expH: "'परंतु' समानाधिकरण योजक दो स्वतंत्र वाक्यों को जोड़ता है।",
      expE: "Coordinating conjunction 'परंतु' joins independent clauses."
    },
    {
      qH: "'जो व्यक्ति ईमानदार होता है, उसका सब सम्मान करते हैं।' वाक्य भेद बताइए:",
      qE: "Identify type: 'Everyone respects a person who is honest.'",
      correct: 'मिश्र वाक्य',
      wrongs: ['सरल वाक्य', 'संयुक्त वाक्य', 'विधानवाचक वाक्य'],
      expH: "'जो... उसका' संबंधवाचक योजक मिश्र वाक्य की पहचान है।",
      expE: "Correlative 'जो... उसका' links main and subordinate clauses."
    },
    {
      qH: "'ईश्वर करे तुम्हारी यात्रा मंगलमय हो!' अर्थ के आधार पर वाक्य है:",
      qE: "Classify by meaning: 'May God make your journey auspicious!'",
      correct: 'इच्छावाचक वाक्य',
      wrongs: ['विस्मयादिबोधक वाक्य', 'आज्ञावाचक वाक्य', 'संदेहवाचक वाक्य'],
      expH: 'शुभकामना या आशीर्वाद प्रकट करने वाले वाक्य इच्छावाचक होते हैं।',
      expE: 'Wishes and blessings are Icchavachak.'
    },
    {
      qH: "'कृपया शांत बैठकर अपना कार्य कीजिए।' किस प्रकार का वाक्य है?",
      qE: "Identify: 'Please sit quietly and do your work.'",
      correct: 'आज्ञावाचक वाक्य',
      wrongs: ['विधानवाचक वाक्य', 'संदेहवाचक वाक्य', 'निषेधवाचक वाक्य'],
      expH: 'आदेश, अनुरोध या उपदेश का भाव आज्ञावाचक वाक्य होता है।',
      expE: 'Requests and commands are Agyavachak.'
    },
    {
      qH: "'वाह! कितना सुंदर दृश्य है।' यह किस प्रकार का वाक्य है?",
      qE: "Classify: 'Wow! What a beautiful scene.'",
      correct: 'विस्मयादिबोधक वाक्य',
      wrongs: ['इच्छावाचक वाक्य', 'प्रश्नवाचक वाक्य', 'संकेतवाचक वाक्य'],
      expH: 'आश्चर्य, हर्ष या शोक के तीव्र भाव विस्मयादिबोधक वाक्य में आते हैं।',
      expE: 'Exclamations of awe belong to Vismayadibodhak.'
    },
    {
      qH: "'मैं आज विद्यालय नहीं जाऊँगा।' अर्थ की दृष्टि से वाक्य भेद है:",
      qE: "Identify by meaning: 'I will not go to school today.'",
      correct: 'निषेधवाचक वाक्य',
      wrongs: ['विधानवाचक वाक्य', 'संकेतवाचक वाक्य', 'प्रश्नवाचक वाक्य'],
      expH: "कार्य के न होने ('नहीं') का बोध निषेधवाचक वाक्य है।",
      expE: 'Negation marks Nishedhvachak.'
    },
    {
      qH: "'गाँधीजी ने कहा कि सदा सत्य बोलो।' रचना के आधार पर वाक्य बताइए:",
      qE: "Classify structurally: 'Gandhiji said that always speak the truth.'",
      correct: 'मिश्र वाक्य',
      wrongs: ['सरल वाक्य', 'संयुक्त वाक्य', 'इच्छावाचक वाक्य'],
      expH: "'कि' योजक से जुड़ा संज्ञा आश्रित उपवाक्य मिश्र वाक्य बनाता है।",
      expE: "Subordinator 'कि' introduces a noun clause."
    },
    {
      qH: "'नदियाँ पहाड़ों से निकलती हैं।' यह अर्थ के आधार पर कौन-सा वाक्य है?",
      qE: "Classify: 'Rivers originate from mountains.'",
      correct: 'विधानवाचक वाक्य',
      wrongs: ['संदेहवाचक वाक्य', 'संकेतवाचक वाक्य', 'निषेधवाचक वाक्य'],
      expH: 'सामान्य कथन या सत्य तथ्य बताने वाला वाक्य विधानवाचक होता है।',
      expE: 'Affirmative factual statement is Vidhanvachak.'
    },
    {
      qH: "'तुम परिश्रम करो अन्यथा असफल हो जाओगे।' रचना के अनुसार वाक्य है:",
      qE: "Classify: 'Work hard otherwise you will fail.'",
      correct: 'संयुक्त वाक्य',
      wrongs: ['सरल वाक्य', 'मिश्र वाक्य', 'विधानवाचक वाक्य'],
      expH: "'अन्यथा' योजक दो स्वतंत्र उपवाक्यों को जोड़ रहा है।",
      expE: "Coordinator 'अन्यथा' links two independent clauses."
    },
    {
      qH: "'कठोर होने पर भी वह दयालु है।' इस सरल वाक्य का संयुक्त रूप क्या होगा?",
      qE: "Convert simple sentence 'Despite being strict, he is kind' to compound:",
      correct: 'वह कठोर है, परंतु दयालु है।',
      wrongs: ['यद्यपि वह कठोर है तथापि दयालु है।', 'जो कठोर होता है वह दयालु है।', 'वह कठोर होकर भी दयालु है।'],
      expH: "'परंतु' समुच्चयबोधक का प्रयोग करके दो स्वतंत्र वाक्य बनते हैं।",
      expE: "Compound uses 'परंतु' to balance both independent statements."
    },
    {
      qH: "'जब सुबह हुई तब चिड़ियाँ बोलने लगीं।' इसका सरल वाक्य रूप चुनिए:",
      qE: "Convert complex sentence 'When morning came, birds began singing' to simple:",
      correct: 'सुबह होने पर चिड़ियाँ बोलने लगीं।',
      wrongs: ['सुबह हुई और चिड़ियाँ बोलने लगीं।', 'चिड़ियाँ बोलीं क्योंकि सुबह हुई।', 'जैसे सुबह हुई, चिड़ियाँ बोलीं।'],
      expH: 'एक ही मुख्य क्रिया रखकर सरल वाक्य बनाया जाता है।',
      expE: 'Collapsing the time clause forms a single finite-verb Simple sentence.'
    },
    {
      qH: "'क्या तुमने अपना गृहकार्य पूरा कर लिया?' यह किस प्रकार का वाक्य है?",
      qE: "Classify: 'Have you completed your homework?'",
      correct: 'प्रश्नवाचक वाक्य',
      wrongs: ['संदेहवाचक वाक्य', 'आज्ञावाचक वाक्य', 'विधानवाचक वाक्य'],
      expH: 'प्रश्न पूछने के भाव और (?) चिह्न के कारण प्रश्नवाचक वाक्य है।',
      expE: 'Interrogative structure indicates Prashnavachak.'
    },
    {
      qH: "'वह बीमार होने के कारण स्कूल न जा सका।' यह कौन-सा वाक्य है?",
      qE: "Identify: 'Due to being ill, he could not go to school.'",
      correct: 'सरल वाक्य',
      wrongs: ['संयुक्त वाक्य', 'मिश्र वाक्य', 'विस्मयादिबोधक वाक्य'],
      expH: 'यहाँ केवल एक मुख्य क्रिया (न जा सका) है, कोई योजक नहीं।',
      expE: 'Contains a single finite predicate without clause connectors.'
    },
    {
      qH: "'चूंकि आज छुट्टी है, इसलिए बाज़ार बंद रहेगा।' रचना के अनुसार वाक्य है:",
      qE: "Classify: 'Since today is a holiday, the market will remain closed.'",
      correct: 'मिश्र वाक्य',
      wrongs: ['सरल वाक्य', 'संयुक्त वाक्य', 'निषेधवाचक वाक्य'],
      expH: "'चूंकि... इसलिए' कारण-परिणाम का आश्रित संबंध दर्शाते हैं।",
      expE: "'चूंकि... इसलिए' forms an adverbial complex clause."
    },
    {
      qH: "'मैं चाहता हूँ कि तुम डॉक्टर बनो।' में आश्रित उपवाक्य किस भेद का है?",
      qE: "Identify subordinate clause in 'I want that you become a doctor':",
      correct: 'संज्ञा उपवाक्य',
      wrongs: ['विशेषण उपवाक्य', 'क्रियाविशेषण उपवाक्य', 'प्रधान उपवाक्य'],
      expH: "'कि' से आरंभ होने वाला उपवाक्य संज्ञा उपवाक्य होता है।",
      expE: "Clauses introduced by 'कि' serve as Noun clauses."
    }
  ],

  vachya: [
    {
      qH: "'अमित पत्र लिखता है।' इस वाक्य का कर्मवाच्य रूप क्या होगा?",
      qE: "Convert 'Amit writes a letter' to passive voice (Karmvachya):",
      correct: 'अमित द्वारा पत्र लिखा जाता है।',
      wrongs: ['अमित से पत्र लिखा गया था।', 'अमित ने पत्र लिखा।', 'अमित द्वारा पत्र लिखा जाएगा।'],
      expH: "सकर्मक क्रिया के कर्मवाच्य में कर्ता के साथ 'द्वारा' व कर्म के अनुसार क्रिया लगती है।",
      expE: "Uses agentive 'द्वारा' and matches verb to object 'पत्र'."
    },
    {
      qH: "'रोगी से उठा नहीं जाता।' वाक्य में कौन-सा वाच्य है?",
      qE: "Identify voice in 'The patient cannot stand up':",
      correct: 'भाववाच्य',
      wrongs: ['कर्तृवाच्य', 'कर्मवाच्य', 'मिश्र वाच्य'],
      expH: 'अकर्मक क्रिया के साथ असमर्थता का भाव भाववाच्य कहलाता है।',
      expE: 'Intransitive verb with inability denotes Bhavvachya.'
    },
    {
      qH: "'पक्षियों द्वारा आकाश में उड़ा जाता है।' किस वाच्य का उदाहरण है?",
      qE: "Identify voice: 'Flying in the sky is done by birds':",
      correct: 'भाववाच्य',
      wrongs: ['कर्तृवाच्य', 'कर्मवाच्य', 'सकर्मक वाच्य'],
      expH: "'उड़ना' अकर्मक क्रिया है; अतः 'द्वारा' लगने पर भी भाववाच्य है।",
      expE: 'Flying is intransitive, so its passive form is Bhavvachya.'
    },
    {
      qH: "'हलवाई द्वारा मिठाइयाँ बनाई गईं।' का कर्तृवाच्य रूप क्या होगा?",
      qE: "Convert to active voice: 'Sweets were made by the confectioner':",
      correct: 'हलवाई ने मिठाइयाँ बनाईं।',
      wrongs: ['हलवाई मिठाइयाँ बनाएगा।', 'हलवाई मिठाइयाँ बना रहा है।', 'हलवाई से मिठाई नहीं बनती।'],
      expH: "सकर्मक भूतकाल के कर्तृवाच्य में कर्ता के साथ 'ने' आता है।",
      expE: "Past transitive active uses 'ने' with the subject."
    },
    {
      qH: "'बच्चे मैदान में खेल रहे हैं।' यह किस वाच्य का वाक्य है?",
      qE: "Identify voice: 'Children are playing on the ground':",
      correct: 'कर्तृवाच्य',
      wrongs: ['कर्मवाच्य', 'भाववाच्य', 'अज्ञात वाच्य'],
      expH: 'यहाँ क्रिया का लिंग और वचन कर्ता (बच्चे) के अनुसार है।',
      expE: 'Verb agrees directly with subject (बच्चे).'
    },
    {
      qH: "'दादी से इतनी दूर चला नहीं जाता।' का कर्तृवाच्य रूपांतरण होगा:",
      qE: "Convert to active voice: 'Grandma cannot walk so far':",
      correct: 'दादी इतनी दूर नहीं चल सकतीं।',
      wrongs: ['दादी ने दूर चला।', 'दादी द्वारा दूर चला गया।', 'दादी दूर चल रही हैं।'],
      expH: "भाववाच्य से कर्तृवाच्य बनाते समय 'सकना' क्रिया का प्रयोग किया जाता है।",
      expE: "Active equivalent expresses ability with 'सकना'."
    },
    {
      qH: "'तुलसीदास ने रामचरितमानस की रचना की।' इसका कर्मवाच्य रूप है:",
      qE: "Convert to Karmvachya: 'Tulsidas composed Ramcharitmanas':",
      correct: 'तुलसीदास के द्वारा रामचरितमानस की रचना की गई।',
      wrongs: ['तुलसीदास ने रचना कर दी।', 'तुलसीदास से रचना नहीं होती।', 'तुलसीदास रचना करेंगे।'],
      expH: "'के द्वारा' जोड़कर और भूतकाल की कर्म-प्रधान क्रिया लगाकर कर्मवाच्य बनता है।",
      expE: "Adds 'के द्वारा' and focuses verb on the work composed."
    },
    {
      qH: "'चलो, अब सोया जाए।' यह किस वाच्य का प्रयोग है?",
      qE: "Identify voice: 'Come, let it be slept now':",
      correct: 'भाववाच्य',
      wrongs: ['कर्तृवाच्य', 'कर्मवाच्य', 'संयुक्त वाच्य'],
      expH: "'सोना' अकर्मक क्रिया होने और भाव की प्रधानता के कारण भाववाच्य है।",
      expE: 'Intransitive suggestion focusing on action is Bhavvachya.'
    },
    {
      qH: "'सरकार द्वारा कई नए विद्यालय खोले गए।' किस वाच्य में है?",
      qE: "Identify voice: 'Many new schools were opened by the government':",
      correct: 'कर्मवाच्य',
      wrongs: ['कर्तृवाच्य', 'भाववाच्य', 'संदेह वाच्य'],
      expH: "यहाँ कर्म (विद्यालय) प्रधान है और 'खोलना' सकर्मक क्रिया है।",
      expE: 'Transitive verb agrees with plural object (विद्यालय).'
    },
    {
      qH: "इनमें से किस वाक्य में कर्मवाच्य का प्रयोग नहीं हो सकता?",
      qE: "Which type of verb cannot form Karmvachya?",
      correct: 'अकर्मक क्रिया वाले वाक्यों में',
      wrongs: ['सकर्मक क्रिया वाले वाक्यों में', 'द्विकर्मक क्रिया में', 'संयुक्त सकर्मक क्रिया में'],
      expH: 'कर्मवाच्य के लिए वाक्य में कर्म का होना या क्रिया का सकर्मक होना अनिवार्य है।',
      expE: 'Intransitive verbs lack an object, so they form Bhavvachya instead.'
    },
    {
      qH: "'माली पौधों को सींच रहा है।' इसका कर्मवाच्य रूप क्या होगा?",
      qE: "Convert to Karmvachya: 'The gardener is watering the plants':",
      correct: 'माली द्वारा पौधों को सींचा जा रहा है।',
      wrongs: ['माली से पौधे नहीं सींचे जाते।', 'माली ने पौधे सींचे।', 'माली पौधे सींचेगा।'],
      expH: "अपूर्ण वर्तमान काल का 'रहा है' कर्मवाच्य में 'जा रहा है' में बदलता है।",
      expE: "Present continuous active takes auxiliary 'जा रहा है' in passive."
    },
    {
      qH: "'मरीज़ से अब हँसा जाता है।' में कौन-सा वाच्य है?",
      qE: "Identify voice: 'The patient can now laugh':",
      correct: 'भाववाच्य',
      wrongs: ['कर्तृवाच्य', 'कर्मवाच्य', 'प्रेरणार्थक'],
      expH: "'हँसना' अकर्मक क्रिया है और 'से' के साथ भाव की प्रधानता है।",
      expE: 'Intransitive verb with agentive से forms Bhavvachya.'
    },
    {
      qH: "'लता मधुर भजन गाती है।' का कर्मवाच्य होगा:",
      qE: "Passive of 'Lata sings sweet hymns':",
      correct: 'लता के द्वारा मधुर भजन गाया जाता है।',
      wrongs: ['लता ने मधुर भजन गाया।', 'लता से गाया नहीं जाता।', 'लता मधुर भजन गाएगी।'],
      expH: "कर्ता स्त्रीलिंग होने पर भी क्रिया कर्म 'भजन' (पुल्लिंग) के अनुसार बदलती है।",
      expE: "Verb switches to masculine singular to match 'भजन'."
    },
    {
      qH: "'आइए, थोड़ा टहला जाए।' को कर्तृवाच्य में कैसे लिखेंगे?",
      qE: "Convert 'Let it be strolled a bit' to Active Voice:",
      correct: 'आइए, थोड़ा टहलें।',
      wrongs: ['आइए, टहलना किया जाए।', 'हमारे द्वारा टहला गया।', 'टहलने से लाभ होता है।'],
      expH: 'कर्ता/श्रोता को सीधे क्रिया करने का प्रस्ताव कर्तृवाच्य है।',
      expE: 'Direct plural subjunctive proposal forms active voice.'
    },
    {
      qH: "'नेताजी द्वारा भाषण दिया गया।' का कर्तृवाच्य क्या होगा?",
      qE: "Active voice of 'A speech was given by the leader':",
      correct: 'नेताजी ने भाषण दिया।',
      wrongs: ['नेताजी से भाषण नहीं दिया गया।', 'नेताजी भाषण दे रहे हैं।', 'नेताजी भाषण देंगे।'],
      expH: "भूतकाल में 'द्वारा' हटाकर कर्ता के साथ 'ने' लगाया जाता है।",
      expE: "Replacing द्वारा with ने restores active past voice."
    },
    {
      qH: "'उससे यह भारी बोझ नहीं उठाया जाता।' किस वाच्य का उदाहरण है?",
      qE: "Identify voice: 'This heavy load cannot be lifted by him':",
      correct: 'कर्मवाच्य',
      wrongs: ['भाववाच्य', 'कर्तृवाच्य', 'कोई नहीं'],
      expH: "यहाँ कर्म 'भारी बोझ' उपस्थित है और 'उठाना' सकर्मक क्रिया है, अतः कर्मवाच्य है।",
      expE: "Presence of object 'भारी बोझ' makes this Karmvachya despite negation."
    },
    {
      qH: "'हम रोज़ व्यायाम करते हैं।' में कौन-सा वाच्य है?",
      qE: "Identify voice: 'We exercise daily':",
      correct: 'कर्तृवाच्य',
      wrongs: ['कर्मवाच्य', 'भाववाच्य', 'द्विवाच्य'],
      expH: 'क्रिया कर्ता (हम) के अनुसार प्रयुक्त हुई है।',
      expE: 'Verb directly follows subject हम.'
    },
    {
      qH: "'चित्रकार सुंदर चित्र बनाता है।' को कर्मवाच्य में बदलिए:",
      qE: "Convert to passive: 'The painter draws a beautiful picture':",
      correct: 'चित्रकार द्वारा सुंदर चित्र बनाया जाता है।',
      wrongs: ['चित्रकार ने सुंदर चित्र बनाया।', 'चित्रकार से चित्र नहीं बनता।', 'चित्रकार सुंदर चित्र बनाएगा।'],
      expH: "सामान्य वर्तमान काल के कर्मवाच्य में 'जाता है' जुड़ता है।",
      expE: "Simple present passive attaches 'जाता है'."
    },
    {
      qH: "'मछलियाँ पानी में तैरती हैं।' का भाववाच्य रूप क्या होगा?",
      qE: "Impersonal voice of 'Fish swim in water':",
      correct: 'मछलियों द्वारा पानी में तैरा जाता है।',
      wrongs: ['मछलियाँ पानी में तैरेंगी।', 'मछलियों ने पानी में तैरा।', 'मछलियाँ पानी में तैर चुकी हैं।'],
      expH: 'तैरना अकर्मक क्रिया है, जिसका अन्य पुरुष एकवचन रूप भाववाच्य बनाता है।',
      expE: 'Neutral masculine singular passive of तैरना forms Bhavvachya.'
    },
    {
      qH: "वाच्य के मुख्य रूप से कितने भेद होते हैं?",
      qE: "How many primary types of Voice (Vachya) exist in Hindi?",
      correct: 'तीन (कर्तृवाच्य, कर्मवाच्य, भाववाच्य)',
      wrongs: ['दो (सकर्मक, अकर्मक)', 'चार', 'पाँच'],
      expH: 'हिंदी व्याकरण में वाच्य के तीन भेद हैं: कर्तृ, कर्म और भाववाच्य।',
      expE: 'Hindi recognizes 3 voices: Active, Passive, Impersonal.'
    }
  ],

  kaal: [
    {
      qH: "'लड़की ने सुंदर चित्र बनाया था।' किस काल का उदाहरण है?",
      qE: "Identify tense: 'The girl had drawn a beautiful picture.'",
      correct: 'पूर्ण भूतकाल',
      wrongs: ['सामान्य भूतकाल', 'अपूर्ण भूतकाल', 'आसन्न भूतकाल'],
      expH: 'क्रिया बहुत पहले समाप्त हो चुकी थी (बनाया था), अतः पूर्ण भूतकाल है।',
      expE: 'Completed in distant past indicates Past Perfect.'
    },
    {
      qH: "'अध्यापक कक्षा में पढ़ा रहे हैं।' यह कौन-सा काल है?",
      qE: "Identify tense: 'The teacher is teaching in the class.'",
      correct: 'अपूर्ण वर्तमान काल',
      wrongs: ['सामान्य वर्तमान काल', 'पूर्ण वर्तमान काल', 'संभाव्य वर्तमान'],
      expH: 'कार्य वर्तमान में निरंतर चल रहा है, पूरा नहीं हुआ।',
      expE: 'Ongoing present action indicates Present Continuous.'
    },
    {
      qH: "'गाड़ी अभी-अभी स्टेशन से निकली है।' कौन-सा भूतकाल है?",
      qE: "Identify sub-type: 'The train has just left the station.'",
      correct: 'आसन्न भूतकाल',
      wrongs: ['सामान्य भूतकाल', 'पूर्ण भूतकाल', 'संदिग्ध भूतकाल'],
      expH: 'जो क्रिया कुछ ही क्षण पहले समाप्त हुई हो, वह आसन्न भूतकाल है।',
      expE: 'Action completed moments ago is Asanna Bhootkaal.'
    },
    {
      qH: "'यदि तुम परिश्रम करोगे तो अवश्य सफल होगे।' काल भेद है:",
      qE: "Identify tense: 'If you work hard, you will surely succeed.'",
      correct: 'हेतुहेतुमद् भविष्यत् काल',
      wrongs: ['सामान्य भविष्यत् काल', 'संभाव्य भविष्यत् काल', 'अपूर्ण वर्तमान'],
      expH: 'भविष्य में एक क्रिया का होना दूसरी शर्त पर निर्भर है।',
      expE: 'Conditional future outcome marks Hetuhetumad Bhavishyat.'
    },
    {
      qH: "'शायद कल माताजी दिल्ली से आएँ।' यह किस काल का वाक्य है?",
      qE: "Identify tense: 'Perhaps mother may arrive from Delhi tomorrow.'",
      correct: 'संभाव्य भविष्यत् काल',
      wrongs: ['सामान्य भविष्यत् काल', 'पूर्ण भूतकाल', 'आसन्न भूतकाल'],
      expH: 'भविष्य में किसी कार्य के होने की संभावना प्रकट हो रही है।',
      expE: 'Possibility in the future marks Sambhavya Bhavishyat.'
    },
    {
      qH: "'पक्षी आकाश में उड़ते हैं।' यह किस काल का वाक्य है?",
      qE: "Identify tense: 'Birds fly in the sky.'",
      correct: 'सामान्य वर्तमान काल',
      wrongs: ['अपूर्ण वर्तमान काल', 'पूर्ण वर्तमान काल', 'सामान्य भूतकाल'],
      expH: 'दैनिक या स्वाभाविक क्रिया (' + 'ता है / ते हैं) सामान्य वर्तमान काल है।',
      expE: 'Habitual universal truth uses Simple Present.'
    },
    {
      qH: "'मोहित पुस्तक पढ़ रहा होगा।' वाक्य में कौन-सा काल है?",
      qE: "Identify tense: 'Mohit might be reading a book right now.'",
      correct: 'संदिग्ध वर्तमान काल',
      wrongs: ['अपूर्ण भूतकाल', 'हेतुहेतुमद् भविष्यत्', 'सामान्य भूतकाल'],
      expH: 'वर्तमान में किसी कार्य के जारी रहने में संदेह (' + 'रहा होगा) संदिग्ध वर्तमान है।',
      expE: 'Doubt about an ongoing present event marks Sandigdh Vartaman.'
    },
    {
      qH: "'हम पिछले साल मनाली घूमने गए।' किस काल का उदाहरण है?",
      qE: "Identify tense: 'We went to visit Manali last year.'",
      correct: 'सामान्य भूतकाल',
      wrongs: ['आसन्न भूतकाल', 'पूर्ण भूतकाल', 'अपूर्ण भूतकाल'],
      expH: 'भूतकाल में कार्य के सामान्य रूप से होने का बोध है (था/है नहीं लगा)।',
      expE: 'Simple completed past action without auxiliary.'
    },
    {
      qH: "'जब मैं घर पहुँचा, तब वर्षा हो रही थी।' में 'वर्षा हो रही थी' कौन-सा काल है?",
      qE: "In 'When I reached home, it was raining', what tense is 'वर्षा हो रही थी'?",
      correct: 'अपूर्ण भूतकाल',
      wrongs: ['पूर्ण भूतकाल', 'आसन्न भूतकाल', 'संदिग्ध भूतकाल'],
      expH: 'भूतकाल में क्रिया के जारी रहने का पता चल रहा है।',
      expE: 'Action in progress in the past is Past Continuous.'
    },
    {
      qH: "'यदि वर्षा होती तो फसल न सूखती।' कौन-सा काल है?",
      qE: "Identify tense: 'Had it rained, the crops would not have dried.'",
      correct: 'हेतुहेतुमद् भूतकाल',
      wrongs: ['संदिग्ध भूतकाल', 'पूर्ण भूतकाल', 'सामान्य भविष्यत्'],
      expH: 'भूतकाल की एक क्रिया के न होने से दूसरी क्रिया प्रभावित हुई।',
      expE: 'Unfulfilled past condition marks Hetuhetumad Bhootkaal.'
    },
    {
      qH: "'बस निकल चुकी होगी।' में कौन-सा काल है?",
      qE: "Identify tense: 'The bus must have left.'",
      correct: 'संदिग्ध भूतकाल',
      wrongs: ['पूर्ण भूतकाल', 'सामान्य भविष्यत्', 'अपूर्ण वर्तमान'],
      expH: 'भूतकाल में कार्य के पूरा होने पर अनुमान या संदेह व्यक्त है।',
      expE: 'Uncertainty about a past event marks Sandigdh Bhootkaal.'
    },
    {
      qH: "'राम कल आगरा जाएगा।' यह किस काल का सरल उदाहरण है?",
      qE: "Identify tense: 'Ram will go to Agra tomorrow.'",
      correct: 'सामान्य भविष्यत् काल',
      wrongs: ['संभाव्य भविष्यत् काल', 'हेतुहेतुमद् भविष्यत्', 'वर्तमान काल'],
      expH: 'भविष्य में किसी कार्य के सामान्य रूप से होने का स्पष्ट संकेत है।',
      expE: 'Plain future event marks Samanya Bhavishyat.'
    },
    {
      qH: "भूतकाल के कुल कितने भेद माने गए हैं?",
      qE: "How many sub-types of Past Tense (Bhootkaal) are there in Hindi?",
      correct: 'छह (6)',
      wrongs: ['तीन (3)', 'चार (4)', 'पाँच (5)'],
      expH: 'सामान्य, आसन्न, पूर्ण, अपूर्ण, संदिग्ध और हेतुहेतुमद्—भूतकाल के 6 भेद हैं।',
      expE: 'Bhootkaal has 6 standard sub-divisions.'
    },
    {
      qH: "'मैंने अपना पाठ याद कर लिया है।' यह किस काल का वाक्य है?",
      qE: "Identify tense: 'I have memorized my lesson.'",
      correct: 'आसन्न भूतकाल / पूर्ण वर्तमान',
      wrongs: ['अपूर्ण वर्तमान', 'अपूर्ण भूतकाल', 'हेतुहेतुमद् भविष्यत्'],
      expH: 'क्रिया के अभी-अभी पूर्ण होने का संकेत आसन्न भूत या पूर्ण वर्तमान है।',
      expE: 'Recent completion connected to present.'
    },
    {
      qH: "'गाँधीजी अहिंसा के पुजारी थे।' किस काल में है?",
      qE: "Identify tense: 'Gandhiji was a devotee of non-violence.'",
      correct: 'सामान्य / पूर्ण भूतकाल',
      wrongs: ['अपूर्ण भूतकाल', 'आसन्न भूतकाल', 'वर्तमान काल'],
      expH: 'बीते समय की स्थिति का वर्णन भूतकाल दर्शाता है।',
      expE: 'Past state description belongs to Bhootkaal.'
    },
    {
      qH: "'किसान खेत में हल चला रहा है।' को सामान्य भूतकाल में बदलिए:",
      qE: "Convert 'The farmer is ploughing the field' to Simple Past:",
      correct: 'किसान ने खेत में हल चलाया।',
      wrongs: ['किसान हल चला रहा था।', 'किसान हल चलाएगा।', 'किसान हल चला चुका है।'],
      expH: 'सामान्य भूतकाल में सहायक क्रिया (था/है) नहीं लगती।',
      expE: 'Simple past drops auxiliary markers.'
    },
    {
      qH: "'बच्चे ने खिलौना तोड़ा।' को अपूर्ण वर्तमान काल में कैसे लिखेंगे?",
      qE: "Convert 'The child broke the toy' to Present Continuous:",
      correct: 'बच्चा खिलौना तोड़ रहा है।',
      wrongs: ['बच्चा खिलौना तोड़ता है।', 'बच्चा खिलौना तोड़ चुका है।', 'बच्चा खिलौना तोड़ेगा।'],
      expH: "'रहा है' जोड़ने से क्रिया की निरंतरता (अपूर्ण वर्तमान) प्रकट होती है।",
      expE: "'रहा है' expresses ongoing present action."
    },
    {
      qH: "इनमें से कौन-सा वाक्य संभाव्य वर्तमान काल का उदाहरण है?",
      qE: "Which sentence exemplifies Doubtful/Probable Present (Sambhavya Vartaman)?",
      correct: 'शायद पिताजी घर लौट आए हों।',
      wrongs: ['पिताजी घर आ गए।', 'पिताजी घर आ रहे हैं।', 'पिताजी कल आएँगे।'],
      expH: 'वर्तमान में कार्य पूर्ण होने की संभावना संभाव्य वर्तमान है।',
      expE: 'Expresses current possibility of arrival.'
    },
    {
      qH: "'मेरा मित्र कल मेरे घर आया था।' में काल पहचानिए:",
      qE: "Identify tense: 'My friend had come to my house yesterday.'",
      correct: 'पूर्ण भूतकाल',
      wrongs: ['आसन्न भूतकाल', 'अपूर्ण भूतकाल', 'सामान्य भविष्यत्'],
      expH: "'आया था' क्रिया की पूर्ण समाप्ति दर्शाता है।",
      expE: "Auxiliary 'था' after past participle indicates Past Perfect."
    },
    {
      qH: "'सूर्य पूर्व दिशा से निकलता है।' यह किस काल के अंतर्गत आता है?",
      qE: "Identify tense: 'The sun rises in the east.'",
      correct: 'सामान्य वर्तमान काल',
      wrongs: ['अपूर्ण वर्तमान काल', 'भूतकाल', 'संभाव्य भविष्यत्'],
      expH: 'सदा सत्य रहने वाली घटनाएँ सामान्य वर्तमान काल में होती हैं।',
      expE: 'Universal facts are expressed in Simple Present.'
    }
  ],

  muhavara: [
    {
      qH: "'ईद का चाँद होना' मुहावरे का सही अर्थ क्या है?",
      qE: "What is the meaning of 'ईद का चाँद होना'?",
      correct: 'बहुत दिनों बाद दिखाई देना',
      wrongs: ['बहुत सुंदर दिखना', 'नया त्योहार मनाना', 'चुपचाप भाग जाना'],
      expH: 'ईद का चाँद कभी-कभार दिखता है, अतः बहुत समय बाद मिलने को कहते हैं।',
      expE: 'Used when someone appears after a very long absence.'
    },
    {
      qH: "'दाँतों तले उँगली दबाना' का सटीक अर्थ है:",
      qE: "Meaning of 'दाँतों तले उँगली दबाना':",
      correct: 'आश्चर्यचकित / दंग रह जाना',
      wrongs: ['दाँत में दर्द होना', 'डरकर छिप जाना', 'गुस्सा करना'],
      expH: 'अत्यधिक आश्चर्य व्यक्त करने के लिए प्रयुक्त होता है।',
      expE: 'Expresses utter amazement or astonishment.'
    },
    {
      qH: "'आँखों का तारा होना' का क्या अभिप्राय है?",
      qE: "What does 'आँखों का तारा होना' signify?",
      correct: 'अत्यंत प्यारा होना',
      wrongs: ['आँखें खराब होना', 'आसमान देखना', 'बहुत तेज़ भागना'],
      expH: 'किसी के लिए बहुत प्रिय या दुलारा होना।',
      expE: 'Means being the apple of someone\'s eye.'
    },
    {
      qH: "'कोल्हू का बैल होना' मुहावरे का सही अर्थ चुनिए:",
      qE: "Meaning of 'कोल्हू का बैल होना':",
      correct: 'दिन-रात लगातार परिश्रम करना',
      wrongs: ['आलस्य करना', 'मूर्खतापूर्ण काम करना', 'बैलगाड़ी चलाना'],
      expH: 'बिना रुके निरंतर कठोर मेहनत करने वाले के लिए कहा जाता है।',
      expE: 'Working tirelessly day and night.'
    },
    {
      qH: "'नौ दो ग्यारह होना' का अर्थ क्या है?",
      qE: "What does 'नौ दो ग्यारह होना' mean?",
      correct: 'चुपके से भाग जाना',
      wrongs: ['गिनती सीखना', 'एकत्रित होना', 'गणित में तेज़ होना'],
      expH: 'चोरी या अपराध करके तुरंत गायब हो जाना।',
      expE: 'To flee or vanish quickly.'
    },
    {
      qH: "'अंगूठा दिखाना' मुहावरे का सही अर्थ है:",
      qE: "Meaning of 'अंगूठा दिखाना':",
      correct: 'ज़रूरत के समय साफ मना कर देना',
      wrongs: ['मदद के लिए तैयार रहना', 'जीत का संकेत देना', 'चित्र बनाना'],
      expH: 'अंतिम समय पर सहायता करने से इनकार करना।',
      expE: 'Refusing point-blank at the moment of need.'
    },
    {
      qH: "'कमर कसना' मुहावरे से क्या तात्पर्य है?",
      qE: "What does 'कमर कसना' mean?",
      correct: 'किसी कार्य के लिए पूरी तरह तैयार होना',
      wrongs: ['कमर में दर्द होना', 'आराम करना', 'पहनने के कपड़े बदलना'],
      expH: 'दृढ़ निश्चय के साथ किसी चुनौती का सामना करने को तैयार होना।',
      expE: 'To gird up one\'s loins / prepare firmly.'
    },
    {
      qH: "'ऊँट के मुँह में जीरा' लोकोक्ति का सही अर्थ है:",
      qE: "Meaning of proverb 'ऊँट के मुँह में जीरा':",
      correct: 'अधिक आवश्यकता वाले को बहुत कम मिलना',
      wrongs: ['स्वादिष्ट भोजन बनना', 'पशुओं को दवा देना', 'पर्याप्त भोजन मिलना'],
      expH: 'बड़ी जरूरत की तुलना में अत्यंत तुच्छ मात्रा।',
      expE: 'A drop in the ocean.'
    },
    {
      qH: "'अधजल गगरी छलकत जाए' लोकोक्ति का अर्थ है:",
      qE: "Meaning of 'अधजल गगरी छलकत जाए':",
      correct: 'कम ज्ञान वाला व्यक्ति अधिक दिखावा करता है',
      wrongs: ['भरे घड़े से पानी गिरना', 'परिश्रम से सफलता मिलती है', 'सच्चे ज्ञानी बोलते नहीं'],
      expH: 'अल्पज्ञानी व्यक्ति अपने ज्ञान का बढ़-चढ़कर प्रदर्शन करता है।',
      expE: 'Empty vessels make the most noise.'
    },
    {
      qH: "'घी के दीये जलाना' किस भाव को प्रकट करता है?",
      qE: "What emotion does 'घी के दीये जलाना' express?",
      correct: 'अत्यधिक खुशियाँ मनाना',
      wrongs: ['दीपावली पर खर्च करना', 'रोशनी कम करना', 'दुखी होना'],
      expH: 'बड़ी सफलता या प्रिय व्यक्ति के आगमन पर अपार हर्ष मनाना।',
      expE: 'To rejoice or celebrate extravagantly.'
    },
    {
      qH: "'लोहे के चने चबाना' का क्या अर्थ है?",
      qE: "What does 'लोहे के चने चबाना' mean?",
      correct: 'बहुत कठिन कार्य करना / संघर्ष करना',
      wrongs: ['मज़बूत दाँत होना', 'स्वादिष्ट भोजन खाना', 'आसान जीत पाना'],
      expH: 'अत्यंत दुष्कर या चुनौतीपूर्ण काम पूरा करना।',
      expE: 'To face an extremely tough task.'
    },
    {
      qH: "'नाच न जाने आँगन टेढ़ा' लोकोक्ति कब कही जाती है?",
      qE: "When is 'नाच न जाने आँगन टेढ़ा' used?",
      correct: 'अपनी अयोग्यता छिपाने के लिए दूसरों में दोष निकालना',
      wrongs: ['अच्छा नृत्य करने पर', 'घर की मरम्मत कराते समय', 'संगीत सीखते समय'],
      expH: 'स्वयं काम न आने पर साधनों या परिस्थितियों को दोष देना।',
      expE: 'A bad workman blames his tools.'
    },
    {
      qH: "'आसमान सिर पर उठाना' का सही अर्थ है:",
      qE: "Meaning of 'आसमान सिर पर उठाना':",
      correct: 'बहुत अधिक शोर मचाना / उपद्रव करना',
      wrongs: ['बहुत ऊँचा कूदना', 'भारी सामान उठाना', 'चुपचाप पढ़ना'],
      expH: 'अत्यधिक कोलाहल या ऊधम मचाना।',
      expE: 'To create a huge uproar or chaos.'
    },
    {
      qH: "'कान भरना' मुहावरे का क्या अर्थ है?",
      qE: "What does 'कान भरना' mean?",
      correct: 'पीठ पीछे किसी की चुगली करना',
      wrongs: ['कान साफ करना', 'अच्छी सलाह देना', 'तेज़ आवाज़ में बोलना'],
      expH: 'किसी के विरुद्ध दूसरे के मन में भड़काऊ बातें डालना।',
      expE: 'To poison someone\'s ears / backbite.'
    },
    {
      qH: "'एक पंथ दो काज' का सटीक अर्थ चुनिए:",
      qE: "Meaning of 'एक पंथ दो काज':",
      correct: 'एक ही प्रयास से दो काम एक साथ सिद्ध होना',
      wrongs: ['दो रास्तों पर एक साथ चलना', 'दोनों काम अधूरे रहना', 'लंबी यात्रा करना'],
      expH: 'एक प्रयत्न में दोहरा लाभ प्राप्त करना।',
      expE: 'Killing two birds with one stone.'
    },
    {
      qH: "'गले का हार होना' का अर्थ क्या है?",
      qE: "What does 'गले का हार होना' signify?",
      correct: 'अत्यंत प्रिय होना',
      wrongs: ['गहने पहनना', 'परेशानी बनना', 'नाराज़ हो जाना'],
      expH: 'किसी को बहुत प्रिय या लाड़ला होना।',
      expE: 'To be deeply cherished or beloved.'
    },
    {
      qH: "'चिकना घड़ा होना' मुहावरे का अर्थ है:",
      qE: "Meaning of 'चिकना घड़ा होना':",
      correct: 'किसी बात का कोई असर न होना (बेशर्म होना)',
      wrongs: ['मिट्टी के बर्तन बनाना', 'बहुत साफ-सुथरा रहना', 'तुरंत बात मान लेना'],
      expH: 'बार-बार समझाने या डांटने पर भी प्रभाव न पड़ना।',
      expE: 'Being shameless or impervious to advice.'
    },
    {
      qH: "'गागर में सागर भरना' का अर्थ क्या है?",
      qE: "What does 'गागर में सागर भरना' mean?",
      correct: 'थोड़े शब्दों में बहुत गहरी और बड़ी बात कह देना',
      wrongs: ['समुद्र से पानी लाना', 'लंबा भाषण देना', 'असंभव काम की कोशिश करना'],
      expH: 'संक्षिप्त शब्दों में विशाल भाव समाहित करना।',
      expE: 'To pack profound meaning into very few words.'
    },
    {
      qH: "'फूला न समाना' मुहावरे का सही अर्थ बताइए:",
      qE: "Meaning of 'फूला न समाना':",
      correct: 'अत्यधिक प्रसन्न होना',
      wrongs: ['बीमार पड़ जाना', 'गुस्से में लाल होना', 'मोटा हो जाना'],
      expH: 'मन में इतनी खुशी होना कि संभाली न जाए।',
      expE: 'To be bursting with joy.'
    },
    {
      qH: "'आम के आम गुठलियों के दाम' लोकोक्ति का अर्थ है:",
      qE: "Meaning of 'आम के आम गुठलियों के दाम':",
      correct: 'दुहरा लाभ प्राप्त होना',
      wrongs: ['नुकसान उठाना', 'फलों का व्यापार करना', 'सस्ता सामान खरीदना'],
      expH: 'किसी कार्य या वस्तु से दो तरफ से फायदा मिलना।',
      expE: 'Double benefit / profit from all sides.'
    }
  ],

  upsarg_pratyay: [
    {
      qH: "'अभिमान' शब्द में कौन-सा उपसर्ग प्रयुक्त हुआ है?",
      qE: "Which prefix is used in 'अभिमान'?",
      correct: 'अभि',
      wrongs: ['अ', 'मान', 'अभिम्'],
      expH: "'अभि' उपसर्ग + 'मान' मूल शब्द = अभिमान।",
      expE: "'अभि' is the prefix attached to root 'मान'."
    },
    {
      qH: "'मिठास' शब्द में कौन-सा प्रत्यय है?",
      qE: "Identify the suffix in 'मिठास':",
      correct: 'आस',
      wrongs: ['ठास', 'स', 'मीठ'],
      expH: "मीठा + आस = मिठास (भाववाचक तद्धित प्रत्यय)।",
      expE: "'आस' suffix creates the abstract noun."
    },
    {
      qH: "'दुर्घटना' शब्द में प्रयुक्त उपसर्ग पहचानिए:",
      qE: "Which prefix is in 'दुर्घटना'?",
      correct: 'दुर्',
      wrongs: ['दु', 'दुर्ग', 'घटना'],
      expH: "'दुर्' (बुरा/कठिन) + घटना = दुर्घटना।",
      expE: "'दुर्' means bad or unfortunate."
    },
    {
      qH: "'वैज्ञानिक' शब्द का शुद्ध मूल शब्द और प्रत्यय विच्छेद क्या है?",
      qE: "Break down 'वैज्ञानिक' into root word and suffix:",
      correct: 'विज्ञान + इक',
      wrongs: ['वि + ज्ञानिक', 'वैज्ञान + इक', 'विज्ञा + निक'],
      expH: "'इक' प्रत्यय जुड़ने से प्रथम स्वर 'इ' बदलकर 'ऐ' हो जाता है।",
      expE: "Suffix 'इक' lengthens the initial vowel to 'ऐ'."
    },
    {
      qH: "'अत्यंत' शब्द में कौन-सा उपसर्ग छिपा है?",
      qE: "Identify the prefix hidden in 'अत्यंत':",
      correct: 'अति',
      wrongs: ['अ', 'अत्य', 'अंत'],
      expH: "अति + अंत = अत्यंत (यण संधि के कारण इ का य बन गया)।",
      expE: "अति + अंत combines into अत्यंत."
    },
    {
      qH: "'लिखावट' शब्द किस मूल धातु व प्रत्यय से बना है?",
      qE: "Break 'लिखावट' into root and suffix:",
      correct: 'लिख् + आवट',
      wrongs: ['लिख + वट', 'लिखा + ट', 'लि + खावट'],
      expH: "'लिख्' क्रिया धातु में 'आवट' कृत् प्रत्यय लगा है।",
      expE: "Verbal root 'लिख्' + suffix 'आवट'."
    },
    {
      qH: "'सुपुत्र' में 'सु' उपसर्ग का अर्थ क्या है?",
      qE: "What does prefix 'सु' denote in 'सुपुत्र'?",
      correct: 'अच्छा / श्रेष्ठ',
      wrongs: ['बुरा', 'कमज़ोर', 'बिना'],
      expH: "'सु' उपसर्ग अच्छाई, सुंदरता या सरलता दर्शाता है।",
      expE: "'सु' signifies good or noble."
    },
    {
      qH: "'दयालु' शब्द में कौन-सा प्रत्यय जुड़ा है?",
      qE: "Identify the suffix in 'दयालु':",
      correct: 'आलु',
      wrongs: ['लु', 'उ', 'दया'],
      expH: "दया + आलु = दयालु।",
      expE: "'आलु' forms the adjective दयालु."
    },
    {
      qH: "'निर्मल' शब्द में कौन-सा उपसर्ग है?",
      qE: "Which prefix appears in 'निर्मल'?",
      correct: 'निर्',
      wrongs: ['नि', 'निस्', 'मल'],
      expH: "निर् (बिना/रहित) + मल = निर्मल।",
      expE: "'निर्' means free from or without."
    },
    {
      qH: "'सामाजिक' शब्द में मूल शब्द क्या है?",
      qE: "What is the root word in 'सामाजिक'?",
      correct: 'समाज',
      wrongs: ['सामाज', 'समान', 'इक'],
      expH: "समाज + इक = सामाजिक ('इक' प्रत्यय से अ का आ हो गया)।",
      expE: "Root is 'समाज' + suffix 'इक'."
    },
    {
      qH: "'लापरवाह' शब्द में किस भाषा का उपसर्ग लगा है?",
      qE: "'ला' in 'लापरवाह' is a prefix from which tradition?",
      correct: 'अरबी-फ़ारसी (उर्दू) उपसर्ग',
      wrongs: ['संस्कृत उपसर्ग', 'हिंदी तद्भव उपसर्ग', 'अंग्रेजी उपसर्ग'],
      expH: "'ला' (बिना) एक उर्दू/अरबी उपसर्ग है।",
      expE: "'ला' is an Urdu/Arabic prefix meaning without."
    },
    {
      qH: "'घबराहट' में कौन-सा प्रत्यय प्रयुक्त हुआ है?",
      qE: "Identify the suffix in 'घबराहट':",
      correct: 'आहट',
      wrongs: ['हट', 'राहट', 'ट'],
      expH: "घबरा + आहट = घबराहट।",
      expE: "'आहट' creates abstract nouns of feeling."
    },
    {
      qH: "'पराजय' शब्द में उपसर्ग अलग कीजिए:",
      qE: "Extract the prefix from 'पराजय':",
      correct: 'परा',
      wrongs: ['प', 'पर', 'जय'],
      expH: "'परा' (उल्टा/पीछे) + जय = पराजय (हार)।",
      expE: "'परा' indicates reversal or defeat."
    },
    {
      qH: "'बचपन' शब्द में मूल शब्द और प्रत्यय क्या है?",
      qE: "Separate root and suffix in 'बचपन':",
      correct: 'बच्चा + पन',
      wrongs: ['बच + पन', 'बच् + अपन', 'बच्चा + अन'],
      expH: "'बच्चा' जातिवाचक संज्ञा से 'पन' प्रत्यय जुड़कर 'बचपन' भाववाचक संज्ञा बना।",
      expE: "Noun बच्चा + suffix पन yields abstract noun बचपन."
    },
    {
      qH: "'अनपढ़' शब्द में 'अन' क्या है?",
      qE: "What grammatical unit is 'अन' in 'अनपढ़'?",
      correct: 'हिंदी का उपसर्ग (निषेध अर्थ में)',
      wrongs: ['प्रत्यय', 'समास पद', 'कारक चिह्न'],
      expH: "'अन' (नहीं/रहित) हिंदी का तद्भव उपसर्ग है।",
      expE: "'अन' is a native Hindi negative prefix."
    },
    {
      qH: "'ऐतिहासिक' शब्द में मूल शब्द कौन-सा है?",
      qE: "Identify the root word of 'ऐतिहासिक':",
      correct: 'इतिहास',
      wrongs: ['ऐतिहास', 'हास', 'इति'],
      expH: "इतिहास + इक = ऐतिहासिक।",
      expE: "Root is 'इतिहास' transformed by 'इक'."
    },
    {
      qH: "'दुस्साहस' शब्द का उपसर्ग पहचानिए:",
      qE: "Identify the prefix in 'दुस्साहस':",
      correct: 'दुस्',
      wrongs: ['दु', 'दुर्', 'साहस'],
      expH: "दुस् + साहस = दुस्साहस।",
      expE: "'दुस्' attaches to 'साहस'."
    },
    {
      qH: "'खिलौना' शब्द में कौन-सा प्रत्यय है?",
      qE: "Which suffix forms 'खिलौना'?",
      correct: 'औना',
      wrongs: ['ना', 'लौना', 'औ'],
      expH: "खेल् + औना = खिलौना।",
      expE: "Verbal root खेल + औना forms toy."
    },
    {
      qH: "किस शब्द में 'प्र' उपसर्ग का प्रयोग नहीं हुआ है?",
      qE: "Which word does NOT use the prefix 'प्र'?",
      correct: 'प्रत्येक (इसमें प्रति उपसर्ग है)',
      wrongs: ['प्रबल', 'प्रगति', 'प्रचार'],
      expH: "प्रत्येक = प्रति + एक (यहाँ 'प्रति' उपसर्ग है, 'प्र' नहीं)।",
      expE: "'प्रत्येक' comes from 'प्रति + एक'."
    },
    {
      qH: "'ईमानदार' में प्रयुक्त प्रत्यय क्या है?",
      qE: "Identify the suffix in 'ईमानदार':",
      correct: 'दार',
      wrongs: ['ई', 'मान', 'आर'],
      expH: "ईमान + दार = ईमानदार।",
      expE: "'दार' is a possessive adjectival suffix."
    }
  ],

  sandhi: [
    {
      qH: "'सूर्योदय' का सही संधि-विच्छेद क्या है?",
      qE: "Correct Sandhi split of 'सूर्योदय':",
      correct: 'सूर्य + उदय (गुण संधि)',
      wrongs: ['सूर्यो + दय', 'सूर्य + दय', 'सूर्या + उदय'],
      expH: 'अ + उ = ओ (गुण स्वर संधि)।',
      expE: 'A + U yields O under Guna Sandhi.'
    },
    {
      qH: "'अत्यंत' शब्द की संधि पहचानिए:",
      qE: "Identify the Sandhi type in 'अत्यंत':",
      correct: 'यण स्वर संधि (अति + अंत)',
      wrongs: ['दीर्घ संधि', 'वृद्धि संधि', 'व्यंजन संधि'],
      expH: 'इ + अ = य बनने से यण स्वर संधि होती है।',
      expE: 'इ followed by अ transforms to य (Yan Sandhi).'
    },
    {
      qH: "'विद्यालय' में कौन-सी संधि है?",
      qE: "Which Sandhi is present in 'विद्यालय'?",
      correct: 'दीर्घ स्वर संधि (विद्या + आलय)',
      wrongs: ['गुण संधि', 'वृद्धि संधि', 'अयादि संधि'],
      expH: 'आ + आ = आ होने के कारण दीर्घ स्वर संधि है।',
      expE: 'Matching vowels merge into a long vowel (Deergha).'
    },
    {
      qH: "'सदैव' का सही संधि-विच्छेद है:",
      qE: "Split 'सदैव' correctly:",
      correct: 'सदा + एव (वृद्धि संधि)',
      wrongs: ['सद + एव', 'सदै + व', 'सदा + ऐव'],
      expH: 'आ + ए = ऐ (वृद्धि स्वर संधि)।',
      expE: 'आ + ए produces ऐ (Vriddhi Sandhi).'
    },
    {
      qH: "'पवन' शब्द किस संधि का उदाहरण है?",
      qE: "Identify the Sandhi in 'पवन' (पो + अन):",
      correct: 'अयादि स्वर संधि',
      wrongs: ['गुण संधि', 'दीर्घ संधि', 'व्यंजन संधि'],
      expH: 'पो + अन = पवन (ओ का अव् हो गया)।',
      expE: 'ओ + अ becomes अव् (Ayadi Sandhi).'
    },
    {
      qH: "'जगदीश' का सही संधि-विच्छेद क्या होगा?",
      qE: "Correct split of 'जगदीश':",
      correct: 'जगत् + ईश (व्यंजन संधि)',
      wrongs: ['जग + दीश', 'जगद + ईश', 'जगत + ईश'],
      expH: 'त् + ई = दी (व्यंजन संधि का प्रथम-तृतीय वर्ण नियम)।',
      expE: 'Voiceless त् voices to द् before vowel ई.'
    },
    {
      qH: "'नमस्ते' किस संधि का प्रसिद्ध उदाहरण है?",
      qE: "'नमस्ते' is an example of which Sandhi?",
      correct: 'विसर्ग संधि (नमः + ते)',
      wrongs: ['व्यंजन संधि', 'गुण संधि', 'अयादि संधि'],
      expH: 'नमः + ते में विसर्ग (ः) का स् में परिवर्तन हुआ है।',
      expE: 'Visarga changes to स् before त.'
    },
    {
      qH: "'महर्षि' का शुद्ध संधि-विच्छेद चुनिए:",
      qE: "Choose the correct split of 'महर्षि':",
      correct: 'महा + ऋषि (गुण संधि)',
      wrongs: ['महर + षि', 'मह + ऋषि', 'महा + अर्षि'],
      expH: 'आ + ऋ = अर् (गुण स्वर संधि)।',
      expE: 'आ + ऋ creates अर् (Guna Sandhi).'
    },
    {
      qH: "'स्वागत' शब्द का संधि-विच्छेद है:",
      qE: "Correct Sandhi split of 'स्वागत':",
      correct: 'सु + आगत (यण संधि)',
      wrongs: ['स्व + आगत', 'स्वा + गत', 'सु + गत'],
      expH: 'उ + आ = वा (यण स्वर संधि)।',
      expE: 'उ followed by आ turns into वा.'
    },
    {
      qH: "'मनोरथ' में कौन-सी संधि है?",
      qE: "Identify Sandhi in 'मनोरथ' (मनः + रथ):",
      correct: 'विसर्ग संधि',
      wrongs: ['गुण स्वर संधि', 'व्यंजन संधि', 'वृद्धि संधि'],
      expH: 'मनः + रथ में विसर्ग का ' + 'ओ हो गया है।',
      expE: 'Visarga followed by र produces ओ.'
    },
    {
      qH: "'उज्ज्वल' का सही संधि-विच्छेद क्या है?",
      qE: "Split 'उज्ज्वल' accurately:",
      correct: 'उत् + ज्वल (व्यंजन संधि)',
      wrongs: ['उज् + ज्वल', 'उज + वल', 'उत + जल'],
      expH: 'त् के बाद ज आने पर त् भी ज् में बदल जाता है।',
      expE: 'त् assimilates into ज् before ज्व.'
    },
    {
      qH: "'नयन' का संधि-विच्छेद होगा:",
      qE: "Correct split of 'नयन':",
      correct: 'ने + अन (अयादि संधि)',
      wrongs: ['नय + न', 'नै + अन', 'न + यन'],
      expH: 'ए + अ = अय् होने से ने + अन = नयन।',
      expE: 'ए transforms to अय् before अ.'
    },
    {
      qH: "'परमेश्वर' किस संधि का उदाहरण है?",
      qE: "Which Sandhi forms 'परमेश्वर'?",
      correct: 'गुण स्वर संधि (परम + ईश्वर)',
      wrongs: ['वृद्धि संधि', 'दीर्घ संधि', 'यण संधि'],
      expH: 'अ + ई = ए होने से गुण संधि है।',
      expE: 'अ + ई yields ए.'
    },
    {
      qH: "'महोत्सव' का संधि-विच्छेद बताइए:",
      qE: "Split 'महोत्सव' correctly:",
      correct: 'महा + उत्सव',
      wrongs: ['महो + त्सव', 'मह + उत्सव', 'महि + उत्सव'],
      expH: 'आ + उ = ओ (गुण संधि)।',
      expE: 'आ + उ merges into ओ.'
    },
    {
      qH: "'सज्जन' में कौन-सी संधि प्रयुक्त हुई है?",
      qE: "Identify Sandhi in 'सज्जन':",
      correct: 'व्यंजन संधि (सत् + जन)',
      wrongs: ['विसर्ग संधि', 'दीर्घ संधि', 'गुण संधि'],
      expH: 'त् + ज = ज्ज (व्यंजन संधि)।',
      expE: 'Consonant assimilation सत् + जन.'
    },
    {
      qH: "'दुर्गम' का संधि-विच्छेद क्या है?",
      qE: "Split 'दुर्गम' accurately:",
      correct: 'दुः + गम (विसर्ग संधि)',
      wrongs: ['दुर + गम', 'दु + गम', 'दुर्ग् + अम'],
      expH: 'विसर्ग का रेफ (र्) में परिवर्तन हुआ है।',
      expE: 'Visarga becomes र above ग.'
    },
    {
      qH: "'वनौषधि' किस संधि का उदाहरण है?",
      qE: "Identify Sandhi in 'वनौषधि' (वन + औषधि):",
      correct: 'वृद्धि स्वर संधि',
      wrongs: ['गुण संधि', 'अयादि संधि', 'दीर्घ संधि'],
      expH: 'अ + औ = औ (वृद्धि संधि)।',
      expE: 'अ + औ yields औ (Vriddhi).'
    },
    {
      qH: "'रवींद्र' का सही संधि-विच्छेद चुनिए:",
      qE: "Split 'रवींद्र' correctly:",
      correct: 'रवि + इंद्र (दीर्घ संधि)',
      wrongs: ['रवी + इंद्र', 'रवि + ईंद्र', 'रव + इंद्र'],
      expH: 'इ + इ = ई (दीर्घ स्वर संधि)।',
      expE: 'Short इ + short इ lengthens to ई.'
    },
    {
      qH: "'इत्यादि' का संधि-विच्छेद क्या होगा?",
      qE: "Correct split of 'इत्यादि':",
      correct: 'इति + आदि (यण संधि)',
      wrongs: ['इत्य + आदि', 'इत + यादि', 'ईति + आदि'],
      expH: 'इ + आ = या (यण स्वर संधि)।',
      expE: 'इ before आ becomes या.'
    },
    {
      qH: "'संहार' का शुद्ध संधि-विच्छेद है:",
      qE: "Split 'संहार' accurately:",
      correct: 'सम् + हार (व्यंजन संधि)',
      wrongs: ['सं + हार', 'सन + हार', 'सः + हार'],
      expH: 'म् के बाद ह आने पर म् अनुस्वार (ं) में बदलता है।',
      expE: 'म् converts to anusvara before ह.'
    }
  ],

  samas: [
    {
      qH: "'नीलकंठ' (नीला है कंठ जिसका अर्थात् शिव) में कौन-सा समास है?",
      qE: "Identify Samas in 'नीलकंठ' (He whose throat is blue = Shiva):",
      correct: 'बहुव्रीहि समास',
      wrongs: ['कर्मधारय समास', 'तत्पुरुष समास', 'द्विगु समास'],
      expH: 'दोनों पद मिलकर किसी तीसरे विशेष अर्थ (शिव) की ओर संकेत करते हैं।',
      expE: 'Refers to a third implied person (Lord Shiva).'
    },
    {
      qH: "'चौराहा' (चार राहों का समूह) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'चौराहा' (group of 4 paths):",
      correct: 'द्विगु समास',
      wrongs: ['द्वंद्व समास', 'अव्ययीभाव समास', 'कर्मधारय समास'],
      expH: 'प्रथम पद ' + "'चौ' (चार) संख्यावाचक होने के कारण द्विगु समास है।",
      expE: 'Numeric first element indicates Dvigu Samas.'
    },
    {
      qH: "'यथाशक्ति' (शक्ति के अनुसार) में कौन-सा समास है?",
      qE: "Which Samas is 'यथाशक्ति'?",
      correct: 'अव्ययीभाव समास',
      wrongs: ['तत्पुरुष समास', 'द्वंद्व समास', 'कर्मधारय समास'],
      expH: "पहला पद 'यथा' अव्यय है, अतः अव्ययीभाव समास है।",
      expE: "Indeclinable prefix 'यथा' marks Avyayibhav."
    },
    {
      qH: "'माता-पिता' (माता और पिता) में कौन-सा समास है?",
      qE: "Identify Samas in 'माता-पिता':",
      correct: 'द्वंद्व समास',
      wrongs: ['द्विगु समास', 'बहुव्रीहि समास', 'अव्ययीभाव समास'],
      expH: "दोनों पद प्रधान हैं और विग्रह में 'और' आता है।",
      expE: 'Both members are equally primary (Dvandva).'
    },
    {
      qH: "'रसोईघर' (रसोई के लिए घर) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'रसोईघर' (kitchen):",
      correct: 'तत्पुरुष समास (सम्प्रदान)',
      wrongs: ['कर्मधारय समास', 'द्विगु समास', 'अव्ययीभाव समास'],
      expH: "विग्रह में 'के लिए' कारक चिह्न का लोप हुआ है।",
      expE: 'Elision of case marker marks Tatpurush.'
    },
    {
      qH: "'नीलकमल' (नीला है जो कमल) में कौन-सा समास है?",
      qE: "Identify Samas in 'नीलकमल' (blue lotus):",
      correct: 'कर्मधारय समास',
      wrongs: ['द्वंद्व समास', 'द्विगु समास', 'अव्ययीभाव समास'],
      expH: 'यहाँ विशेषण (नील) और विशेष्य (कमल) का संबंध है।',
      expE: 'Adjective-noun relationship denotes Karmadharaya.'
    },
    {
      qH: "'राजपुत्र' (राजा का पुत्र) का समास भेद बताइए:",
      qE: "Which Samas is 'राजपुत्र'?",
      correct: 'तत्पुरुष समास (संबंध)',
      wrongs: ['कर्मधारय समास', 'द्वंद्व समास', 'बहुव्रीहि समास'],
      expH: "'का' संबंध कारक विभक्ति का लोप होने से तत्पुरुष समास है।",
      expE: "Omission of genitive 'का' marks Sambandh Tatpurush."
    },
    {
      qH: "'आजीवन' (जीवन भर) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'आजीवन' (lifelong):",
      correct: 'अव्ययीभाव समास',
      wrongs: ['तत्पुरुष समास', 'द्विगु समास', 'कर्मधारय समास'],
      expH: "'आ' उपसर्ग/अव्यय पूर्व पद होने से अव्ययीभाव समास है।",
      expE: "Indeclinable 'आ' at start makes it Avyayibhav."
    },
    {
      qH: "'त्रिफला' (तीन फलों का समाहार) में कौन-सा समास है?",
      qE: "Identify Samas in 'त्रिफला':",
      correct: 'द्विगु समास',
      wrongs: ['द्वंद्व समास', 'अव्ययीभाव समास', 'तत्पुरुष समास'],
      expH: "'त्रि' (तीन) संख्यावाची पद है जो समूह का बोध कराता है।",
      expE: 'First numeral + group meaning = Dvigu.'
    },
    {
      qH: "'दशानन' (दस हैं आनन जिसके अर्थात् रावण) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'दशानन' (Ravana):",
      correct: 'बहुव्रीहि समास',
      wrongs: ['द्विगु समास', 'तत्पुरुष समास', 'अव्ययीभाव समास'],
      expH: 'तीसरे विशेष व्यक्ति (रावण) का बोध कराने के कारण बहुव्रीहि समास है।',
      expE: 'Denotes a specific third entity (Ravana).'
    },
    {
      qH: "'पाप-पुण्य' का समास-विग्रह और भेद क्या है?",
      qE: "Dissolve and identify Samas for 'पाप-पुण्य':",
      correct: 'पाप और पुण्य — द्वंद्व समास',
      wrongs: ['पाप का पुण्य — तत्पुरुष', 'पाप के लिए पुण्य — अव्ययीभाव', 'पाप रूपी पुण्य — कर्मधारय'],
      expH: 'विपरीतार्थक दोनों पद प्रधान हैं, अतः द्वंद्व समास है।',
      expE: 'Paired opposites joined by और form Dvandva.'
    },
    {
      qH: "'महात्मा' (महान है जो आत्मा) में कौन-सा समास है?",
      qE: "Identify Samas in 'महात्मा':",
      correct: 'कर्मधारय समास',
      wrongs: ['तत्पुरुष समास', 'द्विगु समास', 'द्वंद्व समास'],
      expH: 'महान (विशेषण) और आत्मा (विशेष्य) का मेल कर्मधारय है।',
      expE: 'Modifier-noun structure defines Karmadharaya.'
    },
    {
      qH: "'दिन-रात' में किस समास का प्रयोग हुआ है?",
      qE: "Identify Samas in 'दिन-रात':",
      correct: 'द्वंद्व समास',
      wrongs: ['अव्ययीभाव समास', 'द्विगु समास', 'तत्पुरुष समास'],
      expH: 'दो अलग-अलग संज्ञा पद बराबर महत्व रखते हैं।',
      expE: 'Two co-equal nouns signify Dvandva.'
    },
    {
      qH: "'रातोंरात' (रात ही रात में) में कौन-सा समास है?",
      qE: "Which Samas is 'रातोंरात'?",
      correct: 'अव्ययीभाव समास',
      wrongs: ['द्वंद्व समास', 'तत्पुरुष समास', 'कर्मधारय समास'],
      expH: 'एक ही शब्द की पुनरुक्ति (दोहराव) होने पर अव्ययीभाव समास होता है।',
      expE: 'Reduplication of the same word marks Avyayibhav.'
    },
    {
      qH: "'देशभक्ति' (देश के लिए भक्ति) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'देशभक्ति':",
      correct: 'तत्पुरुष समास',
      wrongs: ['कर्मधारय समास', 'द्विगु समास', 'बहुव्रीहि समास'],
      expH: "'के लिए' कारक चिह्न का लोप होने से तत्पुरुष समास है।",
      expE: "Omission of 'के लिए' forms Tatpurush."
    },
    {
      qH: "'गजानन' (गज के समान आनन है जिसका अर्थात् गणेश) कौन-सा समास है?",
      qE: "Identify Samas in 'गजानन' (Lord Ganesha):",
      correct: 'बहुव्रीहि समास',
      wrongs: ['द्विगु समास', 'द्वंद्व समास', 'अव्ययीभाव समास'],
      expH: 'भगवान गणेश के लिए रूढ़ होने के कारण बहुव्रीहि समास है।',
      expE: 'Refers symbolically to Lord Ganesha.'
    },
    {
      qH: "'चंद्रमुख' (चंद्र के समान मुख) में कौन-सा समास है?",
      qE: "Identify Samas in 'चंद्रमुख' (moon-like face):",
      correct: 'कर्मधारय समास',
      wrongs: ['तत्पुरुष समास', 'द्विगु समास', 'द्वंद्व समास'],
      expH: 'उपमेय-उपमान संबंध होने से कर्मधारय समास है।',
      expE: 'Metaphorical comparison marks Karmadharaya.'
    },
    {
      qH: "'नवरत्न' (नौ रत्नों का समूह) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'नवरत्न':",
      correct: 'द्विगु समास',
      wrongs: ['द्वंद्व समास', 'अव्ययीभाव समास', 'तत्पुरुष समास'],
      expH: "पहला पद 'नव' (नौ) संख्यावाचक विशेषण है।",
      expE: "Initial number 'नव' indicates Dvigu."
    },
    {
      qH: "'अकालपीड़ित' (अकाल से पीड़ित) में कौन-सा समास है?",
      qE: "Identify Samas in 'अकालपीड़ित':",
      correct: 'तत्पुरुष समास (करण)',
      wrongs: ['अव्ययीभाव समास', 'द्वंद्व समास', 'द्विगु समास'],
      expH: "'से' करण कारक विभक्ति छिपी होने के कारण तत्पुरुष समास है।",
      expE: "Elided 'से' instrumental case marks Tatpurush."
    },
    {
      qH: "'प्रतिदिन' (प्रत्येक दिन) किस समास का उदाहरण है?",
      qE: "Identify Samas in 'प्रतिदिन' (every day):",
      correct: 'अव्ययीभाव समास',
      wrongs: ['कर्मधारय समास', 'तत्पुरुष समास', 'द्विगु समास'],
      expH: "'प्रति' अव्यय होने और समस्त पद क्रियाविशेषण बनने से अव्ययीभाव है।",
      expE: "Indeclinable 'प्रति' makes the whole compound an adverb."
    }
  ],

  sangya: [
    {
      qH: "'बुढ़ापा' किस प्रकार की संज्ञा है?",
      qE: "Which type of noun is 'बुढ़ापा' (old age)?",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: 'अवस्था, गुण या भाव का बोध कराने वाले शब्द भाववाचक संज्ञा होते हैं।',
      expE: 'Age/state names denote Abstract Nouns.'
    },
    {
      qH: "'हिमालय' किस संज्ञा का उदाहरण है?",
      qE: "Identify noun type for 'हिमालय':",
      correct: 'व्यक्तिवाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'भाववाचक संज्ञा', 'समूहवाचक संज्ञा'],
      expH: 'किसी एक विशेष पर्वत का नाम होने से व्यक्तिवाचक संज्ञा है।',
      expE: 'A specific mountain name is a Proper Noun.'
    },
    {
      qH: "'नदी' शब्द किस संज्ञा भेद के अंतर्गत आता है?",
      qE: "Classify the noun 'नदी' (river):",
      correct: 'जातिवाचक संज्ञा',
      wrongs: ['व्यक्तिवाचक संज्ञा', 'भाववाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: "'नदी' संपूर्ण नदी जाति का बोध कराता है, किसी एक का नहीं।",
      expE: 'Represents an entire class of waterways (Common Noun).'
    },
    {
      qH: "'सोना' और 'चाँदी' किस संज्ञा के उदाहरण हैं?",
      qE: "Which noun type are 'सोना' (gold) and 'चाँदी' (silver)?",
      correct: 'द्रव्यवाचक संज्ञा',
      wrongs: ['भाववाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'समूहवाचक संज्ञा'],
      expH: 'धातु या नापे-तौले जाने वाले पदार्थ द्रव्यवाचक संज्ञा होते हैं।',
      expE: 'Metals and materials are Material Nouns.'
    },
    {
      qH: "'सेना' और 'कक्षा' किस प्रकार की संज्ञा हैं?",
      qE: "Classify 'सेना' (army) and 'कक्षा' (class):",
      correct: 'समूहवाचक संज्ञा',
      wrongs: ['द्रव्यवाचक संज्ञा', 'भाववाचक संज्ञा', 'व्यक्तिवाचक संज्ञा'],
      expH: 'प्राणियों या वस्तुओं के समुदाय का बोध कराने वाले शब्द समूहवाचक हैं।',
      expE: 'Collections of people form Collective Nouns.'
    },
    {
      qH: "'सफलता' संज्ञा का कौन-सा भेद है?",
      qE: "Identify noun category for 'सफलता' (success):",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['व्यक्तिवाचक संज्ञा', 'जातिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: "'सफल' विशेषण से बनी भाववाचक संज्ञा 'सफलता' है।",
      expE: 'Abstract concept of succeeding.'
    },
    {
      qH: "'रामायण' किस प्रकार की संज्ञा है?",
      qE: "Classify 'रामायण':",
      correct: 'व्यक्तिवाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'समूहवाचक संज्ञा', 'भाववाचक संज्ञा'],
      expH: 'एक विशेष पवित्र ग्रंथ का नाम होने से व्यक्तिवाचक है।',
      expE: 'Specific scripture title is a Proper Noun.'
    },
    {
      qH: "'पंडित' शब्द से बनने वाली शुद्ध भाववाचक संज्ञा क्या होगी?",
      qE: "Abstract noun derived from 'पंडित':",
      correct: 'पांडित्य',
      wrongs: ['पंडिताईन', 'पंडितों', 'पंडिताना'],
      expH: "'पंडित' जातिवाचक से 'पांडित्य' भाववाचक संज्ञा बनती है।",
      expE: "'पांडित्य' denotes scholarship/learning."
    },
    {
      qH: "'हरियाली' किस संज्ञा का उदाहरण है?",
      qE: "Identify noun type of 'हरियाली' (greenery):",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: "'हरा' विशेषण से बना गुण/भाव बोधक शब्द है।",
      expE: 'Derived abstract quality of being green.'
    },
    {
      qH: "'देश में जयचंदों की कमी नहीं है।' में 'जयचंदों' किस संज्ञा का रूप है?",
      qE: "In plural metaphorical use 'जयचंदों' (traitors), which noun is it?",
      correct: 'जातिवाचक संज्ञा',
      wrongs: ['व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा', 'समूहवाचक संज्ञा'],
      expH: 'व्यक्तिवाचक संज्ञा जब किसी गुण/दोष की पूरी जाति दर्शाए, तो जातिवाचक बन जाती है।',
      expE: 'Proper name used pluralized as a type acts as Common Noun.'
    },
    {
      qH: "'दूध' और 'तेल' किस संज्ञा के अंतर्गत आते हैं?",
      qE: "Classify 'दूध' (milk) and 'तेल' (oil):",
      correct: 'द्रव्यवाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'भाववाचक संज्ञा', 'समूहवाचक संज्ञा'],
      expH: 'तरल पदार्थ द्रव्यवाचक संज्ञा में गिने जाते हैं।',
      expE: 'Liquids fall under Material Nouns.'
    },
    {
      qH: "'अच्छा' विशेषण से भाववाचक संज्ञा बनाइए:",
      qE: "Form the abstract noun from 'अच्छा':",
      correct: 'अच्छाई',
      wrongs: ['अच्छे', 'अच्छों', 'अच्छापन'],
      expH: "अच्छा + ई = अच्छाई (भाववाचक संज्ञा)।",
      expE: "'अच्छाई' means goodness."
    },
    {
      qH: "'भीड़' शब्द कौन-सी संज्ञा है?",
      qE: "Identify noun type for 'भीड़' (crowd):",
      correct: 'समूहवाचक संज्ञा',
      wrongs: ['द्रव्यवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'भाववाचक संज्ञा'],
      expH: 'लोगों के एकत्रित समूह का बोध कराता है।',
      expE: 'Crowd is a Collective Noun.'
    },
    {
      qH: "'गंगा' और 'दिल्ली' किस संज्ञा के उदाहरण हैं?",
      qE: "Classify 'गंगा' and 'दिल्ली':",
      correct: 'व्यक्तिवाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'समूहवाचक संज्ञा', 'भाववाचक संज्ञा'],
      expH: 'विशिष्ट नदी व नगर के नाम व्यक्तिवाचक संज्ञा हैं।',
      expE: 'Specific geographical names are Proper Nouns.'
    },
    {
      qH: "'चतुराई' किस संज्ञा भेद का उदाहरण है?",
      qE: "Classify 'चतुराई' (cleverness):",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: 'यह एक मानसिक गुण/भाव को व्यक्त करता है।',
      expE: 'Mental trait/quality is an Abstract Noun.'
    },
    {
      qH: "'पक्षी' शब्द किस संज्ञा का बोध कराता है?",
      qE: "Identify noun type of 'पक्षी' (bird):",
      correct: 'जातिवाचक संज्ञा',
      wrongs: ['व्यक्तिवाचक संज्ञा', 'भाववाचक संज्ञा', 'द्रव्यवाचक संज्ञा'],
      expH: 'सभी पक्षियों की समग्र जाति का नाम है।',
      expE: 'Refers to the whole category of birds.'
    },
    {
      qH: "'बच्चा' से बनने वाली भाववाचक संज्ञा कौन-सी है?",
      qE: "Abstract noun from 'बच्चा' (child):",
      correct: 'बचपन',
      wrongs: ['बच्ची', 'बच्चे', 'बालक'],
      expH: 'बचपन जीवन की एक अवस्था का भाव है।',
      expE: 'Childhood (बचपन) is the abstract noun.'
    },
    {
      qH: "'मिठास' शब्द किस संज्ञा भेद में आता है?",
      qE: "Which noun type is 'मिठास' (sweetness)?",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['द्रव्यवाचक संज्ञा', 'जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा'],
      expH: 'स्वाद के गुण का अमूर्त अनुभव भाववाचक संज्ञा है।',
      expE: 'Sweetness is an intangible quality.'
    },
    {
      qH: "'गुच्छा' (चाबियों या अंगूर का) किस संज्ञा का उदाहरण है?",
      qE: "Classify 'गुच्छा' (bunch):",
      correct: 'समूहवाचक संज्ञा',
      wrongs: ['भाववाचक संज्ञा', 'द्रव्यवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा'],
      expH: 'एकत्रित वस्तुओं के झुंड/समूह को दर्शाता है।',
      expE: 'Bunch is a Collective Noun.'
    },
    {
      qH: "'थकान' किस क्रिया शब्द से बनी भाववाचक संज्ञा है?",
      qE: "'थकान' (tiredness) is an abstract noun derived from which verb?",
      correct: 'थकना',
      wrongs: ['थकावट', 'थका', 'थामना'],
      expH: "'थकना' क्रिया से 'थकान' भाववाचक संज्ञा बनी है।",
      expE: 'Formed from the verb थकना (to tire).'
    }
  ],

  sarvanam: [
    {
      qH: "'मैं अपने आप चला जाऊँगा।' में 'अपने आप' कौन-सा सर्वनाम है?",
      qE: "In 'I will go by myself', what pronoun is 'अपने आप'?",
      correct: 'निजवाचक सर्वनाम',
      wrongs: ['पुरुषवाचक सर्वनाम', 'निश्चयवाचक सर्वनाम', 'अनिश्चयवाचक सर्वनाम'],
      expH: 'कर्ता के स्वयं के लिए प्रयुक्त ' + "'अपने आप/स्वयं' निजवाचक सर्वनाम है।",
      expE: 'Reflexive pronouns referring back to subject are Nijvachak.'
    },
    {
      qH: "'दरवाज़े पर कोई खड़ा है।' वाक्य में 'कोई' किस सर्वनाम का उदाहरण है?",
      qE: "In 'Someone is standing at the door', identify 'कोई':",
      correct: 'अनिश्चयवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'संबंधवाचक सर्वनाम', 'प्रश्नवाचक सर्वनाम'],
      expH: "व्यक्ति निश्चित नहीं है, अतः 'कोई' अनिश्चयवाचक सर्वनाम है।",
      expE: 'Indefinite identity takes Anishchayvachak.'
    },
    {
      qH: "'यह मेरी पुस्तक है।' में 'यह' किस सर्वनाम के रूप में आया है?",
      qE: "In 'This is my book', what pronoun is 'यह'?",
      correct: 'निश्चयवाचक सर्वनाम',
      wrongs: ['अनिश्चयवाचक सर्वनाम', 'निजवाचक सर्वनाम', 'प्रश्नवाचक सर्वनाम'],
      expH: 'पास की निश्चित वस्तु की ओर संकेत करने के कारण निश्चयवाचक सर्वनाम है।',
      expE: 'Points definitely to a nearby object.'
    },
    {
      qH: "'जैसा करोगे, वैसा भरोगे।' में कौन-सा सर्वनाम है?",
      qE: "Identify pronoun type in 'As you sow, so shall you reap':",
      correct: 'संबंधवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'पुरुषवाचक सर्वनाम', 'निजवाचक सर्वनाम'],
      expH: "'जैसा... वैसा' दो उपवाक्यों के बीच संबंध जोड़ता है।",
      expE: 'Correlative pairs mark Sambandhvachak.'
    },
    {
      qH: "'तुम कहाँ जा रहे हो?' में 'कहाँ / कौन' किस प्रकार के सर्वनाम श्रेणी में प्रश्न पूछते हैं?",
      qE: "'कौन / क्या' in questions belong to which pronoun category?",
      correct: 'प्रश्नवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'निजवाचक सर्वनाम', 'संबंधवाचक सर्वनाम'],
      expH: 'प्रश्न करने के लिए प्रयुक्त सर्वनाम प्रश्नवाचक कहलाते हैं।',
      expE: 'Used to ask questions (Interrogative Pronoun).'
    },
    {
      qH: "'हम सब भारत के नागरिक हैं।' में 'हम' किस पुरुष का सर्वनाम है?",
      qE: "In 'We are citizens of India', which person is 'हम'?",
      correct: 'उत्तम पुरुषवाचक सर्वनाम',
      wrongs: ['मध्यम पुरुषवाचक', 'अन्य पुरुषवाचक', 'निजवाचक'],
      expH: 'बोलने वाला वक्ता अपने लिए ' + "'मैं / हम' उत्तम पुरुष का प्रयोग करता है।",
      expE: 'First person plural (हम) is Uttam Purush.'
    },
    {
      qH: "'आप यहाँ बैठ जाइए।' आदरसूचक 'आप' किस भेद के अंतर्गत आता है?",
      qE: "Respectful 'आप' (you) addressing the listener belongs to:",
      correct: 'मध्यम पुरुषवाचक सर्वनाम',
      wrongs: ['उत्तम पुरुषवाचक', 'निजवाचक सर्वनाम', 'अनिश्चयवाचक सर्वनाम'],
      expH: 'श्रोता (सुनने वाले) के लिए प्रयुक्त ' + "'तुम/आप' मध्यम पुरुष होता है।",
      expE: 'Second person addressing listener is Madhyam Purush.'
    },
    {
      qH: "'दाल में कुछ काला है।' वाक्य में 'कुछ' कौन-सा सर्वनाम है?",
      qE: "In 'Something is fishy', what pronoun is 'कुछ'?",
      correct: 'अनिश्चयवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'संबंधवाचक सर्वनाम', 'निजवाचक सर्वनाम'],
      expH: 'अनिश्चित वस्तु का बोध कराने से अनिश्चयवाचक सर्वनाम है।',
      expE: 'Unspecified thing takes Anishchayvachak.'
    },
    {
      qH: "'जो मेहनत करेगा, वह सफल होगा।' में 'जो... वह' क्या हैं?",
      qE: "Identify 'जो... वह' in 'He who works hard will succeed':",
      correct: 'संबंधवाचक सर्वनाम',
      wrongs: ['प्रश्नवाचक सर्वनाम', 'निजवाचक सर्वनाम', 'अनिश्चयवाचक सर्वनाम'],
      expH: 'दो वाक्यांशों के बीच परस्पर संबंध बताने वाले सर्वनाम संबंधवाचक होते हैं।',
      expE: 'Relative pronouns connect clauses.'
    },
    {
      qH: "'वे कल आगरा गए थे।' में 'वे' कौन-सा पुरुषवाचक सर्वनाम है?",
      qE: "In 'They went to Agra yesterday', identify 'वे':",
      correct: 'अन्य पुरुषवाचक सर्वनाम',
      wrongs: ['उत्तम पुरुषवाचक', 'मध्यम पुरुषवाचक', 'निजवाचक'],
      expH: 'वक्ता और श्रोता के अतिरिक्त तीसरे व्यक्ति के लिए ' + "'वह / वे' अन्य पुरुष होता है।",
      expE: 'Third person reference marks Anya Purush.'
    },
    {
      qH: "हिंदी में सर्वनाम के कुल कितने मुख्य भेद हैं?",
      qE: "How many main types of Pronouns (Sarvanam) exist in Hindi?",
      correct: 'छह (6)',
      wrongs: ['चार (4)', 'पाँच (5)', 'आठ (8)'],
      expH: 'पुरुषवाचक, निश्चयवाचक, अनिश्चयवाचक, संबंधवाचक, प्रश्नवाचक और निजवाचक।',
      expE: 'Hindi defines 6 principal classes of pronouns.'
    },
    {
      qH: "'वह अपना काम स्वयं कर लेगा।' में 'स्वयं' किस सर्वनाम का भेद है?",
      qE: "Identify 'स्वयं' in 'He will do his work himself':",
      correct: 'निजवाचक सर्वनाम',
      wrongs: ['पुरुषवाचक सर्वनाम', 'निश्चयवाचक सर्वनाम', 'संबंधवाचक सर्वनाम'],
      expH: 'स्वयं, खुद, स्वतः आदि शब्द निजवाचक सर्वनाम होते हैं।',
      expE: "'स्वयं' reflects back onto the subject."
    },
    {
      qH: "'बाहर कौन आया है?' में 'कौन' किस सर्वनाम का उदाहरण है?",
      qE: "In 'Who has come outside?', identify 'कौन':",
      correct: 'प्रश्नवाचक सर्वनाम',
      wrongs: ['अनिश्चयवाचक सर्वनाम', 'संबंधवाचक सर्वनाम', 'निश्चयवाचक सर्वनाम'],
      expH: 'प्राणी के विषय में प्रश्न पूछने के लिए प्रयुक्त हुआ है।',
      expE: "Interrogative 'कौन' asks about a person."
    },
    {
      qH: "'वह मेरा घर है, जो सामने दिख रहा है।' में 'वह' (निश्चित घर) क्या है?",
      qE: "In 'That is my house', 'वह' pointing directly to it is:",
      correct: 'निश्चयवाचक सर्वनाम',
      wrongs: ['अनिश्चयवाचक सर्वनाम', 'निजवाचक सर्वनाम', 'प्रश्नवाचक सर्वनाम'],
      expH: 'दूर स्थित निश्चित वस्तु का संकेत करने के कारण निश्चयवाचक है।',
      expE: 'Demonstrates a specific distant house.'
    },
    {
      qH: "'जिसकी लाठी उसकी भैंस' में कौन-सा सर्वनाम निहित है?",
      qE: "Which pronoun pair is used in 'जिसकी लाठी उसकी भैंस'?",
      correct: 'संबंधवाचक सर्वनाम',
      wrongs: ['अनिश्चयवाचक सर्वनाम', 'प्रश्नवाचक सर्वनाम', 'निजवाचक सर्वनाम'],
      expH: "'जिसकी... उसकी' संबंधवाचक सर्वनाम का युग्म है।",
      expE: 'Correlative possessive pronouns.'
    },
    {
      qH: "'मुझे कुछ खाने को दीजिए।' में 'कुछ' किसके अंतर्गत आता है?",
      qE: "In 'Give me something to eat', what is 'कुछ'?",
      correct: 'अनिश्चयवाचक सर्वनाम',
      wrongs: ['निश्चयवाचक सर्वनाम', 'निजवाचक सर्वनाम', 'संबंधवाचक सर्वनाम'],
      expH: 'खाने की कोई निश्चित वस्तु नहीं बताई गई है।',
      expE: 'Indefinite food item.'
    },
    {
      qH: "'मैं खुद चलकर देख लूँगा।' में 'खुद' कौन-सा सर्वनाम है?",
      qE: "Identify 'खुद' in 'I will go and see myself':",
      correct: 'निजवाचक सर्वनाम',
      wrongs: ['उत्तम पुरुष सर्वनाम', 'अनिश्चयवाचक सर्वनाम', 'निश्चयवाचक सर्वनाम'],
      expH: 'अपनापन/स्वयं का बोध कराने के कारण निजवाचक है।',
      expE: "'खुद' is reflexive (Nijvachak)."
    },
    {
      qH: "'तुम्हें आज क्या चाहिए?' में 'क्या' किस सर्वनाम भेद में आएगा?",
      qE: "In 'What do you want today?', classify 'क्या':",
      correct: 'प्रश्नवाचक सर्वनाम',
      wrongs: ['अनिश्चयवाचक सर्वनाम', 'निश्चयवाचक सर्वनाम', 'संबंधवाचक सर्वनाम'],
      expH: 'वस्तु के संबंध में प्रश्न करने से प्रश्नवाचक सर्वनाम है।',
      expE: 'Questions about an object.'
    },
    {
      qH: "'ये फल बहुत मीठे हैं।' में 'ये' किस श्रेणी में है (जब फल से पहले आया हो)?",
      qE: "If 'ये' precedes 'फल' directly ('ये फल'), what grammatical role does it play?",
      correct: 'सार्वनामिक विशेषण',
      wrongs: ['निजवाचक सर्वनाम', 'संबंधवाचक सर्वनाम', 'अनिश्चयवाचक सर्वनाम'],
      expH: 'संज्ञा से ठीक पहले आकर उसकी विशेषता या संकेत बताने वाला सर्वनाम सार्वनामिक विशेषण बनता है।',
      expE: 'A demonstrative directly preceding a noun acts as a pronominal adjective.'
    },
    {
      qH: "'तुम अपना पाठ ध्यान से पढ़ो।' में 'तुम' किस सर्वनाम के अंतर्गत है?",
      qE: "Classify 'तुम' in 'You read your lesson carefully':",
      correct: 'मध्यम पुरुषवाचक सर्वनाम',
      wrongs: ['उत्तम पुरुषवाचक', 'अन्य पुरुषवाचक', 'संबंधवाचक'],
      expH: 'सामने वाले श्रोता को संबोधित करने वाला शब्द मध्यम पुरुष है।',
      expE: 'Addressing listener directly is Madhyam Purush.'
    }
  ],

  visheshan: [
    {
      qH: "'वीर सैनिक देश की रक्षा करते हैं।' में 'वीर' किस प्रकार का विशेषण है?",
      qE: "Identify adjective type of 'वीर' in 'Brave soldiers protect the country':",
      correct: 'गुणवाचक विशेषण',
      wrongs: ['संख्यावाचक विशेषण', 'परिमाणवाचक विशेषण', 'सार्वनामिक विशेषण'],
      expH: 'संज्ञा के गुण, दोष या स्वभाव बताने वाले शब्द गुणवाचक विशेषण होते हैं।',
      expE: 'Describes bravery/quality (Gunvachak).'
    },
    {
      qH: "'चार किलो चीनी ले आओ।' में 'चार किलो' कौन-सा विशेषण है?",
      qE: "Identify 'चार किलो' in 'Bring four kilos of sugar':",
      correct: 'निश्चित परिमाणवाचक विशेषण',
      wrongs: ['निश्चित संख्यावाचक', 'अनिश्चित परिमाणवाचक', 'गुणवाचक विशेषण'],
      expH: 'तौली जाने वाली वस्तु की निश्चित मात्रा (4 किलो) होने से निश्चित परिमाणवाचक है।',
      expE: 'Exact weighed measurement marks Definite Quantitative.'
    },
    {
      qH: "'कक्षा में दस छात्र बैठे हैं।' में 'दस' कौन-सा विशेषण है?",
      qE: "Identify 'दस' in 'Ten students are sitting in class':",
      correct: 'निश्चित संख्यावाचक विशेषण',
      wrongs: ['अनिश्चित संख्यावाचक', 'परिमाणवाचक विशेषण', 'गुणवाचक विशेषण'],
      expH: 'गिने जा सकने वाले छात्रों की निश्चित संख्या (10) बताई गई है।',
      expE: 'Exact countable number marks Definite Numeral.'
    },
    {
      qH: "'थोड़ा पानी पिला दीजिए।' में 'थोड़ा' किस विशेषण का भेद है?",
      qE: "Identify 'थोड़ा' in 'Please give a little water':",
      correct: 'अनिश्चित परिमाणवाचक विशेषण',
      wrongs: ['अनिश्चित संख्यावाचक', 'निश्चित परिमाणवाचक', 'सार्वनामिक विशेषण'],
      expH: 'नापे/मापे जाने वाले पानी की अनिश्चित मात्रा बताई गई है।',
      expE: 'Unspecified quantity of an uncountable substance.'
    },
    {
      qH: "'वह घर बहुत सुंदर है।' में 'वह' (संज्ञा से पहले) कौन-सा विशेषण है?",
      qE: "In 'That house is very beautiful', classify 'वह':",
      correct: 'सार्वनामिक विशेषण',
      wrongs: ['गुणवाचक विशेषण', 'परिमाणवाचक विशेषण', 'संख्यावाचक विशेषण'],
      expH: 'संज्ञा (घर) से पहले आकर उसकी ओर संकेत करने वाला सर्वनाम सार्वनामिक विशेषण है।',
      expE: 'Pronoun modifying an immediately following noun.'
    },
    {
      qH: "'कुछ बच्चे पार्क में खेल रहे हैं।' में 'कुछ' कौन-सा विशेषण है?",
      qE: "Identify 'कुछ' in 'Some children are playing in the park':",
      correct: 'अनिश्चित संख्यावाचक विशेषण',
      wrongs: ['अनिश्चित परिमाणवाचक', 'निश्चित संख्यावाचक', 'गुणवाचक विशेषण'],
      expH: 'बच्चे गिने जा सकते हैं पर उनकी निश्चित संख्या नहीं दी गई है।',
      expE: 'Uncertain count of countable nouns.'
    },
    {
      qH: "'काला घोड़ा तेज़ दौड़ता है।' में विशेष्य पद कौन-सा है?",
      qE: "Identify the Visheshya (noun modified) in 'काला घोड़ा तेज़ दौड़ता है':",
      correct: 'घोड़ा',
      wrongs: ['काला', 'तेज़', 'दौड़ता है'],
      expH: 'जिस संज्ञा की विशेषता बताई जाती है, उसे विशेष्य कहते हैं (यहाँ घोड़ा)।',
      expE: "'घोड़ा' is the noun described by 'काला'."
    },
    {
      qH: "'इतिहास' संज्ञा से बनने वाला शुद्ध विशेषण शब्द है:",
      qE: "Which adjective is derived from 'इतिहास'?",
      correct: 'ऐतिहासिक',
      wrongs: ['इतिहासक', 'ऐतिहास', 'इतिहासी'],
      expH: "इतिहास + इक = ऐतिहासिक।",
      expE: "'ऐतिहासिक' means historical."
    },
    {
      qH: "'रमेश बहुत ईमानदार है।' में 'बहुत' क्या है?",
      qE: "In 'Ramesh is very honest', what grammatical role is 'बहुत'?",
      correct: 'प्रविशेषण',
      wrongs: ['क्रियाविशेषण', 'विशेष्य', 'सार्वनामिक विशेषण'],
      expH: 'विशेषण (ईमानदार) की भी विशेषता बताने वाले शब्द प्रविशेषण कहलाते हैं।',
      expE: 'Modifies an adjective (Pravisheshan).'
    },
    {
      qH: "'नीला आसमान' में 'नीला' किस विशेषण का उदाहरण है?",
      qE: "Classify 'नीला' in 'नीला आसमान' (blue sky):",
      correct: 'गुणवाचक विशेषण (रंगबोधक)',
      wrongs: ['संख्यावाचक', 'परिमाणवाचक', 'सार्वनामिक'],
      expH: 'रंग, रूप, आकार का बोध कराने वाले शब्द गुणवाचक विशेषण होते हैं।',
      expE: 'Colors belong to Gunvachak adjectives.'
    },
    {
      qH: "'दूसरा कमरा खाली है।' में 'दूसरा' कौन-सा संख्यावाचक विशेषण है?",
      qE: "What subtype of numeral adjective is 'दूसरा' (second)?",
      correct: 'क्रमवाचक निश्चित संख्यावाचक',
      wrongs: ['आवृत्तिवाचक', 'समुदायवाचक', 'परिमाणवाचक'],
      expH: 'पहला, दूसरा, तीसरा आदि क्रम का बोध कराते हैं।',
      expE: 'Ordinal numbers show sequence.'
    },
    {
      qH: "'यह कमीज़ दो मीटर कपड़े से बनी है।' में 'दो मीटर' क्या है?",
      qE: "Classify 'दो मीटर' in 'two meters of cloth':",
      correct: 'निश्चित परिमाणवाचक विशेषण',
      wrongs: ['निश्चित संख्यावाचक', 'गुणवाचक', 'सार्वनामिक'],
      expH: 'कपड़ा मीटर में नापा जाता है, अतः निश्चित परिमाणवाचक है।',
      expE: 'Exact length measurement marks Definite Quantitative.'
    },
    {
      qH: "'भारत' से निर्मित विशेषण शब्द चुनिए:",
      qE: "Adjective formed from 'भारत':",
      correct: 'भारतीय',
      wrongs: ['भारतत्व', 'भारता', 'भारतीयता'],
      expH: "भारत + ईय = भारतीय (विशेषण), जबकि 'भारतीयता' भाववाचक संज्ञा है।",
      expE: "'भारतीय' (Indian) is the adjective."
    },
    {
      qH: "'ताज़े फल स्वास्थ्य के लिए अच्छे होते हैं।' में 'ताज़े' कौन-सा विशेषण है?",
      qE: "Identify 'ताज़े' in 'Fresh fruits are good for health':",
      correct: 'गुणवाचक विशेषण (दशाबोधक)',
      wrongs: ['संख्यावाचक', 'परिमाणवाचक', 'सार्वनामिक'],
      expH: 'वस्तु की दशा या अवस्था (ताज़ा/बासी) गुणवाचक विशेषण है।',
      expE: 'Freshness is a qualitative state.'
    },
    {
      qH: "'दया' शब्द का सही विशेषण रूप क्या होगा?",
      qE: "Adjective form of 'दया' (compassion):",
      correct: 'दयालु',
      wrongs: ['दयावानता', 'दयी', 'दयाता'],
      expH: "दया + आलु = दयालु (जैसे: दयालु राजा)।",
      expE: "'दयालु' (compassionate) describes a noun."
    },
    {
      qH: "'पहाड़ी रास्ता पथरीला है।' में 'पथरीला' किस प्रकार का विशेषण है?",
      qE: "Classify 'पथरीला' in 'The mountain path is rocky':",
      correct: 'गुणवाचक विशेषण',
      wrongs: ['परिमाणवाचक', 'संख्यावाचक', 'सार्वनामिक'],
      expH: 'रास्ते का गुण/स्वभाव बता रहा है।',
      expE: 'Describes the rocky quality of the path.'
    },
    {
      qH: "'कश्मीरी सेब सिंदूरी लाल होता है।' में 'सिंदूरी' क्या है?",
      qE: "In 'सिंदूरी लाल' (vermilion red), what is 'सिंदूरी'?",
      correct: 'प्रविशेषण',
      wrongs: ['संज्ञा', 'क्रिया', 'सर्वनाम'],
      expH: "यह 'लाल' विशेषण की तीव्रता/विशेषता बता रहा है।",
      expE: 'Intensifies the adjective लाल.'
    },
    {
      qH: "विशेषण के मुख्यतः कितने भेद होते हैं?",
      qE: "How many main kinds of Adjectives (Visheshan) are taught in Hindi?",
      correct: 'चार (गुणवाचक, संख्यावाचक, परिमाणवाचक, सार्वनामिक)',
      wrongs: ['दो', 'तीन', 'छह'],
      expH: 'गुणवाचक, संख्यावाचक, परिमाणवाचक और सार्वनामिक—ये 4 भेद हैं।',
      expE: 'There are 4 standard classes of adjectives.'
    },
    {
      qH: "'कोई लड़का बाहर बुला रहा है।' में 'कोई' (लड़का के आगे) क्या है?",
      qE: "In 'कोई लड़का' (some boy), what is 'कोई'?",
      correct: 'सार्वनामिक विशेषण',
      wrongs: ['गुणवाचक विशेषण', 'संख्यावाचक विशेषण', 'परिमाणवाचक विशेषण'],
      expH: 'अनिश्चयवाचक सर्वनाम संज्ञा के ठीक आगे आने से सार्वनामिक विशेषण बना है।',
      expE: 'Acts as an indefinite pronominal adjective.'
    },
    {
      qH: "'तीनों भाई मेला देखने गए।' में 'तीनों' किस प्रकार का विशेषण है?",
      qE: "Identify 'तीनों' in 'All three brothers went to the fair':",
      correct: 'समुदायवाचक संख्यावाचक विशेषण',
      wrongs: ['क्रमवाचक', 'परिमाणवाचक', 'गुणवाचक'],
      expH: 'दोनों, तीनों, चारों आदि संख्या के समूह/समुदाय का बोध कराते हैं।',
      expE: 'Denotes a collective group count.'
    }
  ],

  kriya: [
    {
      qH: "'बच्चा जोर-जोर से रो रहा है।' रचना/कर्म के आधार पर कौन-सी क्रिया है?",
      qE: "Classify the verb in 'The child is crying loudly':",
      correct: 'अकर्मक क्रिया',
      wrongs: ['सकर्मक क्रिया', 'द्विकर्मक क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: "'रोना' क्रिया में कोई कर्म नहीं होता, फल सीधे कर्ता पर पड़ता है।",
      expE: 'Crying takes no direct object (Intransitive).'
    },
    {
      qH: "'राधा सुंदर पत्र लिखती है।' में कौन-सी क्रिया है?",
      qE: "Identify verb type in 'Radha writes a beautiful letter':",
      correct: 'सकर्मक क्रिया',
      wrongs: ['अकर्मक क्रिया', 'अपूर्ण क्रिया', 'नामधातु क्रिया'],
      expH: "'लिखना' क्रिया के साथ कर्म ('पत्र') जुड़ा हुआ है।",
      expE: 'Has direct object पत्र (Transitive).'
    },
    {
      qH: "'माँ ने बच्चों को कहानी सुनाई।' वाक्य में क्रिया का भेद पहचानिए:",
      qE: "Identify verb subtype in 'Mother told the children a story':",
      correct: 'द्विकर्मक क्रिया',
      wrongs: ['अकर्मक क्रिया', 'संयुक्त क्रिया', 'सहायक क्रिया'],
      expH: "यहाँ दो कर्म हैं—'बच्चों को' (गौण कर्म) और 'कहानी' (मुख्य कर्म)।",
      expE: 'Contains two objects: children & story (Dvikarmak).'
    },
    {
      qH: "'अध्यापक ने छात्र से पाठ पढ़वाया।' में कौन-सी क्रिया है?",
      qE: "Identify verb in 'The teacher made the student read the lesson':",
      correct: 'प्रेरणार्थक क्रिया',
      wrongs: ['पूर्वकालिक क्रिया', 'नामधातु क्रिया', 'अकर्मक क्रिया'],
      expH: 'कर्ता स्वयं काम न कर किसी दूसरे को कार्य करने की प्रेरणा दे रहा है।',
      expE: 'Causative verb where subject induces another to act.'
    },
    {
      qH: "'वह खाना खाकर सो गया।' में 'खाकर' किस प्रकार की क्रिया है?",
      qE: "In 'After eating food, he slept', what is 'खाकर'?",
      correct: 'पूर्वकालिक क्रिया',
      wrongs: ['प्रेरणार्थक क्रिया', 'सकर्मक क्रिया', 'नामधातु क्रिया'],
      expH: 'मुख्य क्रिया (सो गया) से पहले समाप्त होने वाली क्रिया (-कर प्रत्यय) पूर्वकालिक होती है।',
      expE: 'Action completed prior to the main verb (-कर).'
    },
    {
      qH: "'हाथ' संज्ञा से बनी 'हथियाना' किस प्रकार की क्रिया है?",
      qE: "What type of verb is 'हथियाना' derived from noun 'हाथ'?",
      correct: 'नामधातु क्रिया',
      wrongs: ['संयुक्त क्रिया', 'प्रेरणार्थक क्रिया', 'सहायक क्रिया'],
      expH: 'संज्ञा, सर्वनाम या विशेषण से बनने वाली क्रिया को नामधातु क्रिया कहते हैं।',
      expE: 'Verbs coined from nouns/adjectives are Naamdhatu.'
    },
    {
      qH: "'रमेश ने पुस्तक पढ़ ली।' में दो क्रियाओं के योग से बनी कौन-सी क्रिया है?",
      qE: "Identify 'पढ़ ली' formed by combining two verbs:",
      correct: 'संयुक्त क्रिया',
      wrongs: ['पूर्वकालिक क्रिया', 'नामधातु क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: 'दो या अधिक धातुओं (पढ़ + ली) के मेल से संयुक्त क्रिया बनती है।',
      expE: 'Combination of main + vector verb forms Compound Verb.'
    },
    {
      qH: "'हँसना', 'उड़ना', 'दौड़ना' किस श्रेणी की क्रियाएँ हैं?",
      qE: "What category do 'हँसना' (laugh), 'उड़ना' (fly), 'दौड़ना' (run) belong to?",
      correct: 'अकर्मक क्रिया',
      wrongs: ['सकर्मक क्रिया', 'द्विकर्मक क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: 'इन क्रियाओं का स्वाभाविक रूप से कोई कर्म नहीं होता।',
      expE: 'Naturally intransitive actions.'
    },
    {
      qH: "'गरम' विशेषण से बनने वाली नामधातु क्रिया क्या होगी?",
      qE: "Naamdhatu verb formed from adjective 'गरम':",
      correct: 'गरमाना',
      wrongs: ['गरमी', 'गर्मित', 'गरमना'],
      expH: "'गरम' से 'गरमाना' नामधातु क्रिया बनती है।",
      expE: "'गरमाना' means to heat up."
    },
    {
      qH: "'नौकर से सामान उठवाया।' में 'उठवाया' कौन-सा रूप है?",
      qE: "Which causative degree is 'उठवाया' (got lifted through someone)?",
      correct: 'द्वितीय प्रेरणार्थक क्रिया',
      wrongs: ['प्रथम प्रेरणार्थक', 'अकर्मक क्रिया', 'पूर्वकालिक क्रिया'],
      expH: "'-वाना / -वाया' लगने से द्वितीय प्रेरणार्थक क्रिया बनती है।",
      expE: 'Second causative uses -वा suffix.'
    },
    {
      qH: "'राम स्कूल जाता है।' में 'है' क्या कहलाता है?",
      qE: "What is 'है' at the end of 'राम स्कूल जाता है'?",
      correct: 'सहायक क्रिया (Auxiliary Verb)',
      wrongs: ['मुख्य क्रिया', 'पूर्वकालिक क्रिया', 'नामधातु क्रिया'],
      expH: 'मुख्य क्रिया (जाता) के काल व अर्थ को स्पष्ट करने वाली क्रिया सहायक क्रिया है।',
      expE: "'है' supports tense of the main verb."
    },
    {
      qH: "'धोबी ने कपड़े धोए।' में कौन-सी क्रिया है?",
      qE: "Classify the verb in 'The washerman washed clothes':",
      correct: 'सकर्मक क्रिया',
      wrongs: ['अकर्मक क्रिया', 'पूर्वकालिक क्रिया', 'नामधातु क्रिया'],
      expH: "'कपड़े' कर्म मौजूद होने से सकर्मक क्रिया है।",
      expE: "Has direct object 'कपड़े'."
    },
    {
      qH: "'लड़का पढ़कर खेलने गया।' में पूर्वकालिक क्रिया पद चुनिए:",
      qE: "Select the Purvakalik verb in 'लड़का पढ़कर खेलने गया':",
      correct: 'पढ़कर',
      wrongs: ['खेलने', 'गया', 'लड़का'],
      expH: "'पढ़ + कर' पहले पूरी होने वाली क्रिया है।",
      expE: "'पढ़कर' (having studied) preceded going."
    },
    {
      qH: "'चिड़िया पेड़ पर बैठी है।' में 'बैठी है' कैसी क्रिया है?",
      qE: "In 'The bird is sitting on the tree', classify 'बैठी है':",
      correct: 'अकर्मक क्रिया',
      wrongs: ['सकर्मक क्रिया', 'द्विकर्मक क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: "यहाँ 'पेड़ पर' अधिकरण कारक है, कर्म नहीं। बैठना अकर्मक है।",
      expE: "'पेड़ पर' is locative, not an object."
    },
    {
      qH: "'सुहाना' या 'अपनाना' किस शब्द से बनी नामधातु क्रिया है?",
      qE: "'अपनाना' (to adopt) is a Naamdhatu verb derived from:",
      correct: 'अपना (सर्वनाम)',
      wrongs: ['आपस', 'अपनत्व', 'आना'],
      expH: "'अपना' सर्वनाम से 'अपनाना' नामधातु क्रिया बनी है।",
      expE: 'Derived from pronoun अपना.'
    },
    {
      qH: "'बच्चे ने दूध पिया।' में कर्म क्या है?",
      qE: "Identify the object (Karm) in 'The child drank milk':",
      correct: 'दूध',
      wrongs: ['बच्चे ने', 'पिया', 'कोई नहीं'],
      expH: "'क्या पिया?' प्रश्न का उत्तर 'दूध' ही कर्म है।",
      expE: "Answers 'what did he drink?' -> दूध."
    },
    {
      qH: "'सूरज पूरब में चमक रहा है।' में कौन-सी क्रिया है?",
      qE: "Identify verb type in 'The sun is shining in the east':",
      correct: 'अकर्मक क्रिया',
      wrongs: ['सकर्मक क्रिया', 'द्विकर्मक क्रिया', 'प्रेरणार्थक क्रिया'],
      expH: 'चमकने की क्रिया का कोई कर्म नहीं है।',
      expE: 'Shining is intransitive.'
    },
    {
      qH: "'चटनी पीसती है' किस प्रकार की क्रिया है?",
      qE: "Classify the verb in 'चटनी पीसती है' (grinds chutney):",
      correct: 'सकर्मक क्रिया',
      wrongs: ['अकर्मक क्रिया', 'नामधातु क्रिया', 'पूर्वकालिक क्रिया'],
      expH: "'चटनी' कर्म होने के कारण सकर्मक क्रिया है।",
      expE: "Takes object 'चटनी'."
    },
    {
      qH: "'वह दौड़ते-दौड़ते थक गया।' में 'दौड़ते-दौड़ते' किस क्रिया का रूप है?",
      qE: "What kind of participle is 'दौड़ते-दौड़ते'?",
      correct: 'तात्कालिक / क्रियाविशेषण कृदंत',
      wrongs: ['प्रेरणार्थक क्रिया', 'द्विकर्मक क्रिया', 'नामधातु क्रिया'],
      expH: 'जारी क्रिया के दौरान दूसरी घटना होने को दर्शाता है।',
      expE: 'Present imperfective adverbial participle.'
    },
    {
      qH: "'राजा ने भिखारी को कंबल दिया।' वाक्य में मुख्य कर्म कौन-सा है?",
      qE: "In 'The king gave a blanket to the beggar', identify the direct object:",
      correct: 'कंबल',
      wrongs: ['भिखारी को', 'राजा ने', 'दिया'],
      expH: 'अप्राणीवाचक ' + "'कंबल' मुख्य कर्म तथा 'भिखारी को' गौण कर्म (सम्प्रदान) है।",
      expE: 'Inanimate item given (कंबल) is the main direct object.'
    }
  ],

  shabd_bhed: [
    {
      qH: "'अग्नि' किस प्रकार का शब्द (उत्पत्ति के आधार पर) है?",
      qE: "Classify 'अग्नि' by origin:",
      correct: 'तत्सम शब्द',
      wrongs: ['तद्भव शब्द', 'देशज शब्द', 'विदेशी शब्द'],
      expH: 'संस्कृत के ज्यों-के-त्यों हिंदी में प्रयुक्त शब्द तत्सम कहलाते हैं।',
      expE: 'Direct unmodified Sanskrit word.'
    },
    {
      qH: "'आग' किस प्रकार का शब्द है?",
      qE: "Classify 'आग' (fire) by origin:",
      correct: 'तद्भव शब्द',
      wrongs: ['तत्सम शब्द', 'देशज शब्द', 'विदेशी शब्द'],
      expH: "'अग्नि' से रूप बदलकर बना शब्द 'आग' तद्भव है।",
      expE: 'Evolved from Sanskrit अग्नि.'
    },
    {
      qH: "'लोटा', 'थैला', 'खटिया' किस श्रेणी के शब्द हैं?",
      qE: "Which origin category do 'लोटा', 'थैला', 'खटिया' belong to?",
      correct: 'देशज शब्द',
      wrongs: ['तत्सम शब्द', 'तद्भव शब्द', 'विदेशी शब्द'],
      expH: 'क्षेत्रीय बोलियों से हिंदी में आए शब्द देशज कहलाते हैं।',
      expE: 'Indigenous regional words.'
    },
    {
      qH: "'डॉक्टर', 'स्कूल', 'रेल' किस प्रकार के शब्द हैं?",
      qE: "Classify 'डॉक्टर', 'स्कूल', 'रेल':",
      correct: 'विदेशी (आगत) शब्द',
      wrongs: ['देशज शब्द', 'तत्सम शब्द', 'तद्भव शब्द'],
      expH: 'अंग्रेजी आदि विदेशी भाषाओं से आए शब्द आगत/विदेशी कहलाते हैं।',
      expE: 'Loanwords borrowed from foreign languages.'
    },
    {
      qH: "'रेलगाड़ी' (रेल + गाड़ी) रचना के आधार पर कैसा शब्द है?",
      qE: "Classify 'रेलगाड़ी' (English + Hindi):",
      correct: 'संकर शब्द (Hybrid)',
      wrongs: ['रूढ़ शब्द', 'तत्सम शब्द', 'योगरूढ़ शब्द'],
      expH: 'दो भिन्न भाषाओं के शब्दों के मेल से बने शब्द संकर कहलाते हैं।',
      expE: 'Formed from two different languages.'
    },
    {
      qH: "'पंकज' (कीचड़ में जन्मा अर्थात् कमल) रचना के आधार पर क्या है?",
      qE: "Classify 'पंकज' by structural formation:",
      correct: 'योगरूढ़ शब्द',
      wrongs: ['रूढ़ शब्द', 'सामान्य यौगिक शब्द', 'विदेशी शब्द'],
      expH: 'दो खंडों से बने पर किसी विशेष अर्थ (कमल) में रूढ़ शब्द योगरूढ़ होते हैं।',
      expE: 'Compound word fixed to a single specific meaning.'
    },
    {
      qH: "'घर' और 'जल' रचना की दृष्टि से कैसे शब्द हैं?",
      qE: "Classify 'घर' and 'जल' by word structure:",
      correct: 'रूढ़ शब्द',
      wrongs: ['यौगिक शब्द', 'योगरूढ़ शब्द', 'संकर शब्द'],
      expH: 'जिन शब्दों के सार्थक टुकड़े न किए जा सकें, वे रूढ़ कहलाते हैं।',
      expE: 'Atomic words that cannot be split meaningfully.'
    },
    {
      qH: "'पाठशाला' (पाठ + शाला) रचना के आधार पर कैसा शब्द है?",
      qE: "Classify 'पाठशाला' structurally:",
      correct: 'यौगिक शब्द',
      wrongs: ['रूढ़ शब्द', 'योगरूढ़ शब्द', 'तद्भव शब्द'],
      expH: 'दो सार्थक शब्दों के योग से बना सामान्य अर्थ वाला शब्द यौगिक है।',
      expE: 'Compound with literal combined meaning.'
    },
    {
      qH: "'और', 'परंतु', 'लेकिन' प्रयोग के आधार पर क्या हैं?",
      qE: "Classify 'और', 'परंतु', 'लेकिन' by inflection:",
      correct: 'अविकारी (अव्यय - समुच्चयबोधक)',
      wrongs: ['विकारी शब्द', 'सर्वनाम', 'विशेषण'],
      expH: 'जिनके रूप लिंग, वचन, काल से नहीं बदलते, वे अविकारी (अव्यय) हैं।',
      expE: 'Indeclinable conjunctions (Avyaya).'
    },
    {
      qH: "'धीरे-धीरे' किस अव्यय के अंतर्गत आता है?",
      qE: "Which Avyaya subtype is 'धीरे-धीरे' (slowly)?",
      correct: 'क्रियाविशेषण अव्यय (रीतिवाचक)',
      wrongs: ['संबंधबोधक अव्यय', 'समुच्चयबोधक अव्यय', 'विस्मयादिबोधक अव्यय'],
      expH: 'क्रिया के होने का ढंग (रीति) बताता है।',
      expE: 'Adverb of manner.'
    },
    {
      qH: "'दुग्ध' का तद्भव रूप क्या होगा?",
      qE: "What is the Tadbhav equivalent of 'दुग्ध'?",
      correct: 'दूध',
      wrongs: ['दही', 'घी', 'मक्खन'],
      expH: 'संस्कृत ' + "'दुग्ध' से हिंदी 'दूध' बना है।",
      expE: 'दुग्ध -> दूध.'
    },
    {
      qH: "'कर्पूर' का शुद्ध तद्भव रूप पहचानिए:",
      qE: "Tadbhav form of 'कर्पूर':",
      correct: 'कपूर',
      wrongs: ['कपड़ा', 'कपूर्र', 'कपूरा'],
      expH: "'कर्पूर' तत्सम से 'कपूर' तद्भव बना है।",
      expE: 'कर्पूर -> कपूर (camphor).'
    },
    {
      qH: "'अरे! वाह!' किस अव्यय का उदाहरण है?",
      qE: "Which Avyaya is 'अरे! वाह!'?",
      correct: 'विस्मयादिबोधक अव्यय',
      wrongs: ['क्रियाविशेषण', 'संबंधबोधक', 'समुच्चयबोधक'],
      expH: 'मन के तीव्र भाव (आश्चर्य/हर्ष) को प्रकट करता है।',
      expE: 'Interjection expressing strong feeling.'
    },
    {
      qH: "'पेड़ के नीचे' में 'के नीचे' कौन-सा अविकारी शब्द है?",
      qE: "Identify 'के नीचे' in 'पेड़ के नीचे' (under the tree):",
      correct: 'संबंधबोधक अव्यय',
      wrongs: ['समुच्चयबोधक अव्यय', 'विस्मयादिबोधक अव्यय', 'विशेषण'],
      expH: 'संज्ञा/सर्वनाम का संबंध वाक्य के अन्य शब्दों से जोड़ने वाला अव्यय संबंधबोधक है।',
      expE: 'Postposition linking a noun to the rest of the sentence.'
    },
    {
      qH: "'सूर्य' का तत्सम-तद्भव युग्म क्या है?",
      qE: "Tatsam-Tadbhav pair for Sun:",
      correct: 'सूर्य (तत्सम) — सूरज (तद्भव)',
      wrongs: ['सूरज — दिनकर', 'भानु — रवि', 'प्रभाकर — दिवाकर'],
      expH: 'सूर्य तत्सम रूप है जिसका तद्भव सूरज है।',
      expE: 'सूर्य evolves into सूरज.'
    },
    {
      qH: "इनमें से कौन-सा शब्द विकारी (परिवर्तनशील) श्रेणी का है?",
      qE: "Which category is a declinable (Vikari) word class?",
      correct: 'संज्ञा, सर्वनाम, विशेषण, क्रिया',
      wrongs: ['क्रियाविशेषण', 'समुच्चयबोधक', 'संबंधबोधक'],
      expH: 'विकारी के चार भेद हैं: संज्ञा, सर्वनाम, विशेषण और क्रिया।',
      expE: 'Nouns, pronouns, adjectives, and verbs inflect.'
    },
    {
      qH: "'अश्व' का तद्भव शब्द क्या है?",
      qE: "Tadbhav word for 'अश्व'?",
      correct: 'घोड़ा',
      wrongs: ['हाथी', 'गधा', 'ऊँट'],
      expH: "संस्कृत 'अश्व' का हिंदी रूप 'घोड़ा' (घोटक से) प्रचलित है।",
      expE: 'घोड़ा corresponds to horse.'
    },
    {
      qH: "'कमल' शब्द के लिए 'जलज' (योगरूढ़) का अर्थ कैसे निकलता है?",
      qE: "Why is 'जलज' classified as Yogroodh?",
      correct: 'जल में जन्म लेने के बाद भी केवल कमल के लिए रूढ़ होने से',
      wrongs: ['छोटे रूप के कारण', 'विदेशी होने से', 'अव्यय होने से'],
      expH: 'जल में अनेक जीव जन्म लेते हैं, पर जलज का अर्थ केवल कमल के लिए निश्चित हो गया है।',
      expE: 'Although literally meaning water-born, it specifically means lotus.'
    },
    {
      qH: "'किताब' और 'क़लम' किस भाषा से हिंदी में आए हैं?",
      qE: "'किताब' and 'क़लम' entered Hindi from which language?",
      correct: 'अरबी',
      wrongs: ['संस्कृत', 'पुर्तगाली', 'फ्रांसीसी'],
      expH: 'किताब और क़लम अरबी मूल के आगत शब्द हैं।',
      expE: 'Both are Arabic loanwords.'
    },
    {
      qH: "'तुम्हारे बिना काम नहीं चलेगा।' में 'बिना' (या के बिना) कौन-सा पद है?",
      qE: "In 'तुम्हारे बिना', classify 'बिना':",
      correct: 'संबंधबोधक अव्यय',
      wrongs: ['समुच्चयबोधक', 'निपात', 'संज्ञा'],
      expH: 'सर्वनाम के साथ लगकर अन्य पदों से संबंध जोड़ता है।',
      expE: 'Functions as a postpositional Sambandhbodhak.'
    }
  ],

  ashuddhi_shodhan: [
    {
      qH: "वर्तनी की दृष्टि से शुद्ध शब्द चुनिए:",
      qE: "Select the correctly spelled Hindi word:",
      correct: 'उज्ज्वल',
      wrongs: ['उज्वल', 'उज्जवल', 'ऊज्वल'],
      expH: "उत् + ज्वल = उज्ज्वल (दोनों 'ज' आधे होते हैं)।",
      expE: "Both 'ज' letters are half-consonants."
    },
    {
      qH: "'कवि' का स्त्रीलिंग शुद्ध वर्तनी रूप क्या है?",
      qE: "Select the correct feminine spelling of poet (Kavi):",
      correct: 'कवयित्री',
      wrongs: ['कविइत्री', 'कवियित्री', 'कवयत्री'],
      expH: "शुद्ध मानक वर्तनी 'कवयित्री' है।",
      expE: "'कवयित्री' is the standard spelling."
    },
    {
      qH: "निम्न में से कौन-सा वाक्य व्याकरण की दृष्टि से पूर्णतः शुद्ध है?",
      qE: "Which sentence is grammatically pure?",
      correct: 'यहाँ गाय का शुद्ध दूध मिलता है।',
      wrongs: ['मेरे को घर जाना है।', 'कृपया करके मेरी बात सुनें।', 'वहाँ अनेकों लोग आए थे।'],
      expH: "'मेरे को' की जगह 'मुझे', 'कृपया करके' में पुनरुक्ति, तथा 'अनेकों' अशुद्ध (अनेक बहुवचन है)।",
      expE: 'Avoids redundancy, colloquialisms, and double plurals.'
    },
    {
      qH: "शुद्ध वर्तनी वाला शब्द पहचानिए:",
      qE: "Identify the pure spelling:",
      correct: 'आशीर्वाद',
      wrongs: ['आर्शीवाद', 'आशिर्वाद', 'आशीरवाद'],
      expH: "रेफ (र्) हमेशा 'वा' के ऊपर लगता है: आशीर्वाद।",
      expE: 'Ref sits on वा because it is pronounced after शी.'
    },
    {
      qH: "'वह गुनगुना गर्म पानी पीता है।' इस वाक्य में किस प्रकार की अशुद्धि है?",
      qE: "What error is in 'वह गुनगुना गर्म पानी पीता है'?",
      correct: 'पुनरुक्ति / अनावश्यक पद दोष',
      wrongs: ['लिंग दोष', 'कारक दोष', 'काल दोष'],
      expH: "'गुनगुना' का अर्थ ही हल्का गर्म होता है, अतः 'गर्म' अनावश्यक है।",
      expE: "'गुनगुना' already implies warm; 'गर्म' is redundant."
    },
    {
      qH: "निम्नलिखित में से शुद्ध वर्तनी चुनिए:",
      qE: "Select the accurate spelling for 'festival':",
      correct: 'त्योहार',
      wrongs: ['त्यौहार', 'तियोहार', 'त्योहर'],
      expH: 'मानक हिंदी में ' + "'त्योहार' (एक मात्रा) शुद्ध है।",
      expE: 'Uses single ओ matra.'
    },
    {
      qH: "'मैं आपके दर्शन करने आया हूँ।' यह वाक्य शुद्ध है या अशुद्ध?",
      qE: "Evaluate 'मैं आपके दर्शन करने आया हूँ' (Darshan takes plural agreement):",
      correct: 'पूर्णतः शुद्ध वाक्य (दर्शन सदा बहुवचन है)',
      wrongs: ['अशुद्ध (करना होगा)', 'अशुद्ध (तेरे होगा)', 'अशुद्ध (आया हैं होगा)'],
      expH: "'दर्शन', 'हस्ताक्षर', 'आँसू', 'प्राण' सदैव बहुवचन में प्रयुक्त होते हैं।",
      expE: "'दर्शन' is always plural; hence 'करने' is accurate."
    },
    {
      qH: "'बाघ और बकरी एक घाट पर पानी पीती है।' का शुद्ध रूप क्या होगा?",
      qE: "Correct the agreement in 'बाघ और बकरी एक घाट पर पानी पीती है':",
      correct: 'बाघ और बकरी एक घाट पर पानी पीते हैं।',
      wrongs: ['बाघ और बकरी पानी पीता है।', 'बाघ और बकरी पानी पीती हैं।', 'बाघ ने बकरी को पानी पीया।'],
      expH: 'दो भिन्न लिंगों के कर्ता ' + "'और' से जुड़ने पर क्रिया पुल्लिंग बहुवचन होती है।",
      expE: 'Mixed gender subjects linked by और take masculine plural verb.'
    },
    {
      qH: "'पुस्तक पर मत लिखो।' और 'यह पेंसिल किसकी है?' में से अशुद्ध वाक्य पहचानिए (यदि कोई हो):",
      qE: "Select the INCORRECT sentence among these:",
      correct: 'दही बहुत खट्टी है। (शुद्ध: दही बहुत खट्टा है)',
      wrongs: ['पुस्तक पर मत लिखो।', 'यह पेंसिल किसकी है?', 'आज मौसम सुहावना है।'],
      expH: "'दही' पुल्लिंग शब्द है, अतः 'खट्टा है' शुद्ध रूप है।",
      expE: "'दही' is masculine in Hindi, not feminine."
    },
    {
      qH: "शुद्ध वर्तनी चुनिए:",
      qE: "Select the correct spelling of 'healthy':",
      correct: 'स्वास्थ्य',
      wrongs: ['स्वास्थ', 'स्वस्थ्य', 'स्वास्थय'],
      expH: "'स् + वा + स् + थ् + य' मिलकर 'स्वास्थ्य' बनता है।",
      expE: 'Ends in conjunct स्थ्य.'
    },
    {
      qH: "'मैं रविवार के दिन घूमने जाऊँगा।' में अनावश्यक शब्द हटाकर शुद्ध रूप होगा:",
      qE: "Rectify redundancy in 'मैं रविवार के दिन घूमने जाऊँगा':",
      correct: 'मैं रविवार को घूमने जाऊँगा।',
      wrongs: ['मैं रविवार की दिन जाऊँगा।', 'मैं रविवार में घूमने जाऊँगा।', 'मैं दिन रविवार जाऊँगा।'],
      expH: "'वार' का अर्थ ही दिन होता है, अतः 'के दिन' लिखना अनावश्यक है।",
      expE: "'रविवार' already contains 'वार' (day)."
    },
    {
      qH: "किस विकल्प में 'श्रीमान/श्रीमती' दोनों शुद्ध लिखे हैं?",
      qE: "Select the accurately spelled pair:",
      correct: 'श्रीमती और कृपा',
      wrongs: ['श्रीमति और क्रपा', 'श्रीमती और क्रपा', 'श्रीमति और कृपा'],
      expH: "'श्रीमती' में दीर्घ ई तथा 'कृपा' में ऋ की मात्रा होती है।",
      expE: 'श्रीमती (long ī) and कृपा (ṛ vowel).'
    },
    {
      qH: "'सप्रमाण सहित उत्तर दीजिए।' का शुद्ध रूप क्या होगा?",
      qE: "Fix the tautology in 'सप्रमाण सहित उत्तर दीजिए':",
      correct: 'सप्रमाण उत्तर दीजिए। (या प्रमाण सहित उत्तर दीजिए)',
      wrongs: ['सप्रमाण के सहित उत्तर दें।', 'प्रमाण सह उत्तर दीजिए।', 'निःप्रमाण सहित उत्तर दें।'],
      expH: "'स' का अर्थ ही 'सहित' होता है, अतः दोनों एक साथ नहीं आ सकते।",
      expE: "'स-' already means 'with', so 'सहित' duplicates it."
    },
    {
      qH: "शुद्ध वाक्य चुनिए:",
      qE: "Choose the grammatically correct sentence:",
      correct: 'उनके प्राण पखेरू उड़ गए।',
      wrongs: ['उसका प्राण निकल गया।', 'मेरा प्राण संकट में है।', 'उनका प्राण चला गया।'],
      expH: "'प्राण' नित्य बहुवचन पुल्लिंग शब्द है, इसलिए क्रिया भी बहुवचन ('गए') होगी।",
      expE: "'प्राण' always takes plural masculine verbs."
    },
    {
      qH: "वर्तनी की दृष्टि से शुद्ध शब्द कौन-सा है?",
      qE: "Select the correctly spelled word for 'literary':",
      correct: 'साहित्यिक',
      wrongs: ['साहत्यिक', 'साहित्यक', 'साहीत्यिक'],
      expH: "साहित्य + इक = साहित्यिक।",
      expE: 'साहित्य + इक -> साहित्यिक.'
    },
    {
      qH: "'नेताजी को एक गुलाब की माला पहनाई।' में पदक्रम दोष सुधारकर शुद्ध वाक्य होगा:",
      qE: "Fix word-order error in 'एक गुलाब की माला':",
      correct: 'नेताजी को गुलाब की एक माला पहनाई।',
      wrongs: ['नेताजी ने गुलाब की माला पहनाई।', 'एक गुलाब माला नेताजी पहनाई।', 'गुलाब एक की माला पहनाई।'],
      expH: 'एक गुलाब की माला नहीं बनती; माला एक है जो गुलाबों की है।',
      expE: "'एक' modifies 'माला', not 'गुलाब'."
    },
    {
      qH: "'तुम्हारे माताजी आए हैं।' में लिंग संबंधी अशुद्धि ठीक कीजिए:",
      qE: "Fix the gender concord in 'तुम्हारे माताजी आए हैं':",
      correct: 'तुम्हारी माताजी आई हैं।',
      wrongs: ['तुम्हारे माताजी आई है।', 'तुम्हारा माताजी आई हैं।', 'तुम्हारी माताजी आया है।'],
      expH: "'माताजी' स्त्रीलिंग हैं, अतः 'तुम्हारी' और 'आई हैं' (आदरार्थ बहुवचन) होगा।",
      expE: 'Feminine subject with honorific plural verb.'
    },
    {
      qH: "निम्न में से किस शब्द की वर्तनी अशुद्ध है?",
      qE: "Identify the MISSPELLED word:",
      correct: 'परिक्षा (शुद्ध: परीक्षा)',
      wrongs: ['निरोग', 'महत्त्व', 'कवि'],
      expH: "'परीक्षा' में 'र' पर दीर्घ 'ई' की मात्रा आती है।",
      expE: 'परीक्षा requires long ई.'
    },
    {
      qH: "'उसने संतोष का साँस लिया।' का शुद्ध रूप क्या होगा?",
      qE: "Fix gender error in 'संतोष का साँस लिया':",
      correct: 'उसने संतोष की साँस ली।',
      wrongs: ['उसने संतोष को साँस लिया।', 'उसने संतोष से साँस ली।', 'वह संतोष का साँस ली।'],
      expH: "'साँस' स्त्रीलिंग शब्द है, अतः 'की साँस ली' शुद्ध है।",
      expE: "'साँस' is feminine in Hindi."
    },
    {
      qH: "निम्न में से शुद्ध वर्तनी वाला शब्द चुनिए:",
      qE: "Select the correctly spelled word:",
      correct: 'पूजनीय',
      wrongs: ['पूज्यनीय', 'पुजनीय', 'पूजनिय'],
      expH: "या तो 'पूज्य' होता है या 'पूजनीय'—दोनों मिलाकर 'पूज्यनीय' अशुद्ध है।",
      expE: 'Valid forms are पूज्य or पूजनीय.'
    }
  ],

  gadyansh: [
    {
      qH: "अपठित गद्यांश का शीर्षक चुनते समय सबसे महत्वपूर्ण बात क्या होती है?",
      qE: "What is most essential when choosing a title for an unseen passage?",
      correct: 'शीर्षक संक्षिप्त, सार्थक और संपूर्ण गद्यांश के केंद्रीय भाव से जुड़ा हो',
      wrongs: ['शीर्षक कम से कम 15 शब्दों का हो', 'केवल अंतिम पंक्ति के शब्द उठा लिए जाएँ', 'कोई कठिन संस्कृत शब्द जोड़ दिया जाए'],
      expH: 'उत्तम शीर्षक पूरे गद्यांश के मुख्य विचार को संक्षेप में व्यक्त करता है।',
      expE: 'A good title concisely reflects the central theme.'
    },
    {
      qH: "अपठित गद्यांश के प्रश्नों के उत्तर किस पर आधारित होने चाहिए?",
      qE: "Answers in unseen comprehension must strictly rely on:",
      correct: 'केवल दिए गए गद्यांश में निहित तथ्यों व भावों पर',
      wrongs: ['केवल अपने बाहरी अनुमान पर', 'दूसरे पाठों की जानकारी पर', 'अपनी कल्पना से बनाई कहानी पर'],
      expH: 'उत्तर सदैव अनुच्छेद के दायरे और लेखक के आशय के भीतर ही होने चाहिए।',
      expE: 'Answers must derive strictly from passage evidence.'
    },
    {
      qH: "'पर्यावरण संरक्षण आज की सबसे बड़ी आवश्यकता है।' यहाँ 'संरक्षण' शब्द का अर्थ है:",
      qE: "In 'पर्यावरण संरक्षण', what does 'संरक्षण' mean?",
      correct: 'बचाव व उचित देखभाल (Protection)',
      wrongs: ['विनाश करना', 'अधिक दोहन करना', 'त्याग देना'],
      expH: "सम् + रक्षण = संरक्षण अर्थात् भली-भाँति रक्षा करना।",
      expE: 'Sanrakshan means careful preservation.'
    },
    {
      qH: "'नैतिक मूल्य समाज को अनुशासित रखते हैं।' में 'नैतिक' शब्द में मूल शब्द व प्रत्यय क्या है?",
      qE: "Extract root and suffix of 'नैतिक':",
      correct: 'नीति + इक',
      wrongs: ['नैत + इक', 'न + इतिक', 'नीति + क'],
      expH: "'नीति' मूल शब्द में 'इक' प्रत्यय जुड़ने से 'नैतिक' विशेषण बनता है।",
      expE: "नीति + इक transforms to नैतिक."
    },
    {
      qH: "'स्वावलंबी व्यक्ति कभी पराधीन नहीं होता।' में 'पराधीन' का विलोम शब्द होगा:",
      qE: "Antonym of 'पराधीन' (dependent on others):",
      correct: 'स्वाधीन',
      wrongs: ['अधीन', 'परतंत्र', 'निर्धन'],
      expH: 'पराधीन (दूसरे के अधीन) का विलोम स्वाधीन (स्वयं के अधीन/स्वतंत्र) होता है।',
      expE: 'Opposite of dependent is independent (स्वाधीन).'
    },
    {
      qH: "गद्यांश पढ़ते समय कठिन शब्दों का अर्थ समझने की सर्वोत्तम विधि क्या है?",
      qE: "Best way to deduce an unfamiliar word's meaning while reading:",
      correct: 'आस-पास की पंक्तियों का संदर्भ (Context) देखना',
      wrongs: ['शब्द को छोड़कर आगे बढ़ जाना', 'गलत अनुमान लगा लेना', 'पूरा अनुच्छेद न पढ़ना'],
      expH: 'संदर्भगत अर्थ से वाक्य का वास्तविक तात्पर्य स्पष्ट हो जाता है।',
      expE: 'Contextual clues reveal intended word meaning.'
    },
    {
      qH: "'समय का सदुपयोग सफलता की कुंजी है।' में 'सदुपयोग' का संधि-विच्छेद है:",
      qE: "Split 'सदुपयोग':",
      correct: 'सत् + उपयोग',
      wrongs: ['सदु + पयोग', 'सद + उपयोग', 'सा + उपयोग'],
      expH: "सत् + उपयोग = सदुपयोग (अच्छा उपयोग)।",
      expE: "सत् + उपयोग forms सदुपयोग."
    },
    {
      qH: "'अनुशासनहीनता' शब्द में उपसर्ग और प्रत्यय दोनों अलग कीजिए:",
      qE: "Identify prefix and suffix in 'अनुशासनहीनता':",
      correct: 'अनु (उपसर्ग) + शासन + हीन + ता (प्रत्यय)',
      wrongs: ['अ + नुशासन + ता', 'अनु + शास + हीनता', 'अन + शासन + ता'],
      expH: "'अनु' उपसर्ग और 'ता' भाववाचक प्रत्यय से बना शब्द है।",
      expE: 'Built with prefix अनु and suffixes हीन + ता.'
    },
    {
      qH: "गद्यांश का 'केंद्रीय भाव' जानने के लिए किस अनुच्छेद पर विशेष ध्यान देना चाहिए?",
      qE: "Where is the central idea typically anchored in a passage?",
      correct: 'प्रारंभिक तथा अंतिम सारांश पंक्तियों पर',
      wrongs: ['केवल बीच के किसी एक उदाहरण पर', 'केवल विराम चिह्नों पर', 'केवल किसी व्यक्ति के नाम पर'],
      expH: 'प्रायः भूमिका और निष्कर्ष में लेखक अपना मुख्य संदेश स्पष्ट करता है।',
      expE: 'Introduction and conclusion frame the core thesis.'
    },
    {
      qH: "'सकारात्मक दृष्टिकोण जीवन में उत्साह भरता है।' में विशेषण पद चुनिए:",
      qE: "Identify the adjective in 'सकारात्मक दृष्टिकोण':",
      correct: 'सकारात्मक',
      wrongs: ['दृष्टिकोण', 'जीवन', 'उत्साह'],
      expH: "'दृष्टिकोण' संज्ञा की विशेषता 'सकारात्मक' बता रहा है।",
      expE: "'सकारात्मक' modifies दृष्टिकोण."
    },
    {
      qH: "'परोपकार' (दूसरों पर उपकार) शब्द में कौन-सी संधि है?",
      qE: "Identify Sandhi in 'परोपकार':",
      correct: 'गुण स्वर संधि (पर + उपकार)',
      wrongs: ['वृद्धि संधि', 'दीर्घ संधि', 'विसर्ग संधि'],
      expH: "पर + उपकार (अ + उ = ओ) गुण स्वर संधि है।",
      expE: 'पर + उपकार produces ओ.'
    },
    {
      qH: "'दुर्बल' शब्द का उपयुक्त विपरीतार्थक (विलोम) शब्द है:",
      qE: "Antonym of 'दुर्बल' (weak):",
      correct: 'सबल',
      wrongs: ['कमज़ोर', 'निर्बल', 'अबल'],
      expH: "'दुर्बल' (कमज़ोर) का सटीक विलोम 'सबल' (बलवान) होता है।",
      expE: 'Opposite of weak is strong (सबल).'
    },
    {
      qH: "'जलवायु परिवर्तन आज वैश्विक चिंता का विषय है।' में 'वैश्विक' शब्द का अर्थ है:",
      qE: "What does 'वैश्विक' mean?",
      correct: 'पूरे विश्व से संबंधित (Global)',
      wrongs: ['केवल एक गाँव का', 'स्थानीय', 'व्यक्तिगत'],
      expH: "विश्व + इक = वैश्विक (संसार व्यापी)।",
      expE: 'Pertaining to the entire world (Global).'
    },
    {
      qH: "'कृतज्ञ' और 'कृतघ्न' शब्दों में क्या अंतर है?",
      qE: "Distinguish 'कृतज्ञ' vs 'कृतघ्न':",
      correct: 'कृतज्ञ = उपकार मानने वाला; कृतघ्न = उपकार न मानने वाला',
      wrongs: ['दोनों का अर्थ समान है', 'दोनों परिश्रम के पर्याय हैं', 'कृतज्ञ का अर्थ आलसी है'],
      expH: 'यह परीक्षा में पूछा जाने वाला अत्यंत महत्वपूर्ण विलोम युग्म है।',
      expE: 'Grateful vs ungrateful.'
    },
    {
      qH: "'सूर्य का प्रकाश अंधकार को मिटा देता है।' में 'अंधकार' का पर्यायवाची कौन-सा नहीं है?",
      qE: "Which word is NOT a synonym of 'अंधकार' (darkness)?",
      correct: 'उजाला',
      wrongs: ['तम', 'अँधेरा', 'तिमिर'],
      expH: 'तम, तिमिर और अँधेरा अंधकार के पर्याय हैं, जबकि उजाला इसका विलोम है।',
      expE: "'उजाला' means light, the opposite of darkness."
    },
    {
      qH: "अपठित गद्यांश पर आधारित उत्तर लिखते समय भाषा कैसी होनी चाहिए?",
      qE: "What language style is best when answering comprehension questions?",
      correct: 'सरल, स्पष्ट और संक्षिप्त अपने शब्दों में',
      wrongs: ['गद्यांश की पूरी पंक्तियों को बिना समझे उतारना', 'अत्यंत अस्पष्ट और लंबी भाषा', 'अनावश्यक कहानियाँ जोड़ना'],
      expH: 'ICSE व सभी बोर्ड परीक्षाओं में संक्षिप्त और सटीक उत्तरों को पूरे अंक मिलते हैं।',
      expE: 'Clear, concise, and direct answers score full marks.'
    },
    {
      qH: "'लोकतांत्रिक' शब्द का सही विच्छेद है:",
      qE: "Split 'लोकतांत्रिक':",
      correct: 'लोकतंत्र + इक',
      wrongs: ['लोक + तांत्रिक', 'लोका + तंत्रिक', 'लोकता + त्रिक'],
      expH: "'लोकतंत्र' में 'इक' प्रत्यय जुड़कर 'लोकतांत्रिक' बनता है।",
      expE: 'Formed from लोकतंत्र + इक.'
    },
    {
      qH: "'परिश्रम के बिना किसी भी लक्ष्य की सिद्धि असंभव है।' यहाँ 'सिद्धि' से तात्पर्य है:",
      qE: "What does 'सिद्धि' mean here?",
      correct: 'सफलता या पूर्ण प्राप्ति',
      wrongs: ['हार', 'आलस्य', 'रुकावट'],
      expH: "'सिद्धि' का अर्थ किसी कार्य या लक्ष्य की पूर्ण सफलता है।",
      expE: 'Signifies attainment or fulfillment.'
    },
    {
      qH: "'पुस्तकालय ज्ञान का मंदिर है।' में 'पुस्तकालय' का समास भेद है:",
      qE: "Identify Samas in 'पुस्तकालय' (पुस्तकों का आलय):",
      correct: 'तत्पुरुष समास',
      wrongs: ['द्विगु समास', 'द्वंद्व समास', 'अव्ययीभाव समास'],
      expH: "पुस्तकों का आलय ('का' विभक्ति का लोप होने से संबंध तत्पुरुष)।",
      expE: 'Tatpurush compound (house of books).'
    },
    {
      qH: "'सच्ची मित्रता जीवन को आनंदमय बनाती है।' में 'मित्रता' क्या है?",
      qE: "What grammatical part of speech is 'मित्रता'?",
      correct: 'भाववाचक संज्ञा',
      wrongs: ['विशेषण', 'क्रिया', 'सर्वनाम'],
      expH: "मित्र (जातिवाचक) + ता = मित्रता (भाववाचक संज्ञा)।",
      expE: 'Abstract noun formed with -ता.'
    }
  ]
};

// Map topic aliases (from both Student CustomWorksheetStudio & TeacherDashboard) cleanly
const TOPIC_ALIAS_MAP: Record<string, string[]> = {
  karak: ['karak'],
  vakya: ['vakya'],
  'vakya-vichar': ['vakya_vichar'],
  vakya_vichar: ['vakya_vichar'],
  'vakya-ashuddhi': ['vakya_vichar', 'ashuddhi_shodhan'],
  vakya_ashuddhi: ['vakya_vichar', 'ashuddhi_shodhan'],
  vachya: ['vachya'],
  kaal: ['kaal'],
  muhavara: ['muhavara'],
  muhavare: ['muhavara'],
  'muhavare-sim': ['muhavara'],
  upsarg_pratyay: ['upsarg_pratyay'],
  'upsarg-pratyay': ['upsarg_pratyay'],
  upsarg: ['upsarg_pratyay'],
  pratyay: ['upsarg_pratyay'],
  sandhi: ['sandhi'],
  samas: ['samas'],
  samay: ['samas'],
  sandhi_samas: ['sandhi', 'samas'],
  sangya: ['sangya'],
  sarvanam: ['sarvanam'],
  visheshan: ['visheshan'],
  kriya: ['kriya'],
  'kriya-kaal': ['kriya_kaal', 'kriya', 'kaal'],
  kriya_kaal: ['kriya_kaal', 'kriya', 'kaal'],
  ling: ['ling'],
  vachan: ['vachan'],
  'viram-chinh': ['viram_chinh'],
  viram_chinh: ['viram_chinh'],
  paryayvachi: ['paryayvachi'],
  vilom: ['vilom'],
  'anek-shabd': ['anek_shabd'],
  anek_shabd: ['anek_shabd'],
  'shabd-vichar': ['shabd_vichar'],
  shabd_vichar: ['shabd_vichar'],
  avikari: ['avikari', 'nipat_extra'],
  nipat: ['nipat_extra', 'avikari'],
  anekarthi: ['anekarthi'],
  shrutisam: ['shrutisam'],
  'pad-parichay': ['pad_parichay'],
  pad_parichay: ['pad_parichay'],
  'visheshan-nirman': ['visheshan_nirman'],
  visheshan_nirman: ['visheshan_nirman'],
  'vartani-shuddhi': ['vartani_shuddhi'],
  vartani_shuddhi: ['vartani_shuddhi'],
  'vakya-shuddhi': ['vakya_shuddhi'],
  vakya_shuddhi: ['vakya_shuddhi'],
  'vakya-parivartan': ['vakya_parivartan'],
  vakya_parivartan: ['vakya_parivartan'],
  'shabd-bhandar': ['paryayvachi', 'vilom', 'anekarthi', 'shrutisam', 'anek_shabd'],
  shabd_bhandar: ['paryayvachi', 'vilom', 'anekarthi', 'shrutisam', 'anek_shabd'],
  shabd_bhed: ['shabd_bhed', 'pad_parichay'],
  ashuddhi_shodhan: ['ashuddhi_shodhan', 'vakya_shuddhi', 'vartani_shuddhi'],
  gadyansh: ['gadyansh'],
  comprehension: ['gadyansh'],
  mixed_board: [
    'karak',
    'vakya',
    'vachya',
    'kaal',
    'muhavara',
    'upsarg_pratyay',
    'sandhi',
    'samas',
    'shabd_bhed',
    'ashuddhi_shodhan',
    'sangya',
    'sarvanam',
    'visheshan',
    'kriya'
  ]
};

const TOPIC_DISPLAY_LABELS: Record<string, { hi: string; en: string }> = {
  karak: { hi: 'कारक एवं परसर्ग', en: 'Case Markers (Karak)' },
  vakya: { hi: 'वाक्य एवं उसके भेद', en: 'Sentence Types (Vakya)' },
  vakya_vichar: { hi: 'वाक्य-विचार', en: 'Sentence Structure' },
  vakya_ashuddhi: { hi: 'वाक्य-विचार व अशुद्धि शोधन', en: 'Syntax & Error Correction' },
  vachya: { hi: 'वाच्य परिवर्तन', en: 'Voice (Vachya)' },
  kaal: { hi: 'काल भेद', en: 'Tenses (Kaal)' },
  muhavara: { hi: 'मुहावरे एवं लोकोक्तियाँ', en: 'Idioms & Proverbs' },
  upsarg_pratyay: { hi: 'उपसर्ग और प्रत्यय', en: 'Prefixes & Suffixes' },
  sandhi: { hi: 'संधि विच्छेद', en: 'Sandhi' },
  samas: { hi: 'समास एवं विग्रह', en: 'Compounds (Samas)' },
  sangya: { hi: 'संज्ञा व भेद', en: 'Noun (Sangya)' },
  sarvanam: { hi: 'सर्वनाम व भेद', en: 'Pronoun (Sarvanam)' },
  visheshan: { hi: 'विशेषण व भेद', en: 'Adjective (Visheshan)' },
  kriya: { hi: 'क्रिया व भेद', en: 'Verb (Kriya)' },
  kriya_kaal: { hi: 'क्रिया और काल', en: 'Verbs & Tenses' },
  ling: { hi: 'लिंग परिवर्तन', en: 'Gender (Ling)' },
  vachan: { hi: 'वचन परिवर्तन', en: 'Number (Vachan)' },
  viram_chinh: { hi: 'विराम-चिह्न', en: 'Punctuation Marks' },
  paryayvachi: { hi: 'पर्यायवाची शब्द', en: 'Synonyms' },
  vilom: { hi: 'विलोम शब्द', en: 'Antonyms' },
  anek_shabd: { hi: 'अनेक शब्दों के लिए एक शब्द', en: 'One-Word Substitution' },
  shabd_vichar: { hi: 'शब्द-विचार', en: 'Word Classification' },
  avikari: { hi: 'अविकारी शब्द व निपात', en: 'Indeclinables & Nipat' },
  anekarthi: { hi: 'अनेकार्थी शब्द', en: 'Polysemous Words' },
  shrutisam: { hi: 'श्रुतिसमभिन्नार्थक शब्द', en: 'Homophones' },
  pad_parichay: { hi: 'पद-परिचय', en: 'Pad-Parichay' },
  visheshan_nirman: { hi: 'विशेषण निर्माण', en: 'Adjective Derivation' },
  vartani_shuddhi: { hi: 'वर्तनी शुद्धि', en: 'Spelling Correction' },
  vakya_shuddhi: { hi: 'वाक्य शुद्धि', en: 'Sentence Correction' },
  vakya_parivartan: { hi: 'वाक्य-परिवर्तन', en: 'Sentence Transformation' },
  shabd_bhandar: { hi: 'शब्द भंडार', en: 'Vocabulary Treasure' },
  shabd_bhed: { hi: 'शब्द भेद', en: 'Parts of Speech' },
  ashuddhi_shodhan: { hi: 'अशुद्धि शोधन', en: 'Error Correction' },
  gadyansh: { hi: 'अपठित गद्यांश', en: 'Reading Comprehension' },
  nibandh: { hi: 'निबंध लेखन', en: 'Essay Writing (Nibandh)' },
  kahani: { hi: 'कहानी लेखन', en: 'Story Writing (Kahani)' },
  anuched: { hi: 'अनुच्छेद लेखन', en: 'Paragraph Writing (Anuched)' },
  patra: { hi: 'पत्र लेखन (औपचारिक/अनौपचारिक)', en: 'Letter Writing (Patra)' },
  soochna: { hi: 'सूचना लेखन', en: 'Notice Writing (Soochna)' },
  diary: { hi: 'डायरी लेखन', en: 'Diary Writing' },
  vigyapan: { hi: 'विज्ञापन लेखन', en: 'Advertisement Writing (Vigyapan)' },
  rachna_lekhan: { hi: 'रचना एवं लेखन (कथा शिल्पी)', en: 'Composition & Writing' },
  mixed_board: { hi: 'संपूर्ण व्याकरण अभ्यास', en: 'Mixed Grammar Practice' },
};

export function getCanonicalTopicLabels(topicKey: string, fallbackHi?: string, fallbackEn?: string): { hi: string; en: string } {
  const mapped = TOPIC_DISPLAY_LABELS[topicKey];
  if (mapped) return mapped;
  return {
    hi: fallbackHi || topicKey,
    en: fallbackEn || topicKey,
  };
}

export function isInternalSimKeySnippet(text?: string | null): boolean {
  const trimmed = (text || '').trim();
  if (!trimmed) return true;
  if (/^(classifier|kaal|muhavara|vakya|vachya|karak|affix|upsarg|pratyay|sandhi|samas|qc)_[a-z0-9_-]+$/i.test(trimmed)) {
    return true;
  }
  if (/^[a-z0-9-]+(?:_[a-z0-9-]+)+$/i.test(trimmed)) {
    return true;
  }
  return false;
}

export function sanitizeMistakeSampleQuestions(samples?: unknown): string[] {
  if (!Array.isArray(samples)) return [];
  const seen = new Set<string>();
  const cleaned: string[] = [];
  for (const rawItem of samples) {
    if (typeof rawItem !== 'string') continue;
    const trimmed = rawItem.trim();
    if (!trimmed || isInternalSimKeySnippet(trimmed) || seen.has(trimmed)) continue;
    seen.add(trimmed);
    cleaned.push(trimmed);
  }
  return cleaned;
}

export function resolveTopicKeyFromString(topicOrId: string): string {
  const lower = (topicOrId || '').trim().toLowerCase();
  const normalizedSlug = lower.replace(/-/g, '_');
  if (TOPIC_ALIAS_MAP[lower]) {
    if (lower === 'upsarg' || lower === 'pratyay' || lower === 'upsarg-pratyay') return 'upsarg_pratyay';
    if (lower === 'samay') return 'samas';
    if (lower === 'muhavare' || lower === 'muhavare-sim') return 'muhavara';
    if (lower === 'comprehension') return 'gadyansh';
    if (lower === 'nipat') return 'avikari';
    if (TOPIC_DISPLAY_LABELS[normalizedSlug]) return normalizedSlug;
    return normalizedSlug;
  }
  if (lower.includes('विशेषण निर्माण') || lower.includes('adjective derivation')) return 'visheshan_nirman';
  if (lower.includes('वर्तनी शुद्धि') || lower.includes('spelling purity') || lower.includes('spelling correction')) return 'vartani_shuddhi';
  if (lower.includes('वाक्य शुद्धि') || lower.includes('sentence correction')) return 'vakya_shuddhi';
  if (lower.includes('वाक्य-परिवर्तन') || lower.includes('वाक्य परिवर्तन') || lower.includes('sentence transformation')) return 'vakya_parivartan';
  if (lower.includes('पद-परिचय') || lower.includes('pad-parichay') || lower.includes('pad parichay')) return 'pad_parichay';
  if (lower.includes('अनेक शब्दों') || lower.includes('one word') || lower.includes('one-word')) return 'anek_shabd';
  if (lower.includes('अनेकार्थी') || lower.includes('polysem')) return 'anekarthi';
  if (lower.includes('श्रुतिसम') || lower.includes('homophone')) return 'shrutisam';
  if (lower.includes('पर्यायवाची') || lower.includes('synonym')) return 'paryayvachi';
  if (lower.includes('विलोम') || lower.includes('antonym')) return 'vilom';
  if (lower.includes('विराम') || lower.includes('punctuation')) return 'viram_chinh';
  if (lower.includes('अविकारी') || lower.includes('अव्यय') || lower.includes('निपात') || lower.includes('indeclinable')) return 'avikari';
  if (lower.includes('शब्द-विचार') || lower.includes('word classification')) return 'shabd_vichar';
  if (lower.includes('क्रिया और काल') || lower.includes('verbs & tenses')) return 'kriya_kaal';
  if (lower.includes('वाक्य-विचार और अशुद्धि') || lower.includes('syntax & error')) return 'vakya_ashuddhi';
  if (lower.includes('वाक्य-विचार') || lower.includes('sentence structure') || lower.includes('sentence basics')) return 'vakya_vichar';
  if (lower.includes('लिंग') || lower.includes('gender')) return 'ling';
  if (lower.includes('वचन') || lower.includes('number')) return 'vachan';
  if (lower.includes('संज्ञा') || lower.includes('noun')) return 'sangya';
  if (lower.includes('सर्वनाम') || lower.includes('pronoun')) return 'sarvanam';
  if (lower.includes('विशेषण') || lower.includes('adjective')) return 'visheshan';
  if (lower.includes('क्रिया') || lower.includes('verb')) return 'kriya';
  if (lower.includes('कारक') || lower.includes('karak')) return 'karak';
  if (lower.includes('वाक्य') || lower.includes('sentence')) return 'vakya';
  if (lower.includes('वाच्य') || lower.includes('voice')) return 'vachya';
  if (lower.includes('काल') || lower.includes('tense')) return 'kaal';
  if (lower.includes('उपसर्ग') || lower.includes('प्रत्यय') || lower.includes('affix') || lower.includes('prefix') || lower.includes('suffix')) return 'upsarg_pratyay';
  if (lower.includes('मुहावरे') || lower.includes('लोकोक्ति') || lower.includes('idiom')) return 'muhavara';
  if (lower.includes('संधि') && lower.includes('समास')) return 'sandhi_samas';
  if (lower.includes('संधि') || lower.includes('sandhi')) return 'sandhi';
  if (lower.includes('समास') || lower.includes('samas') || lower.includes('compound')) return 'samas';
  if (lower.includes('शब्द भंडार') || lower.includes('vocabulary')) return 'shabd_bhandar';
  if (lower.includes('शब्द') || lower.includes('parts of speech')) return 'shabd_bhed';
  if (lower.includes('अशुद्धि') || lower.includes('वर्तनी') || lower.includes('correction')) return 'ashuddhi_shodhan';
  if (lower.includes('गद्यांश') || lower.includes('comprehension')) return 'gadyansh';
  if (lower.includes('निबंध') || lower.includes('nibandh') || lower.includes('essay')) return 'nibandh';
  if (lower.includes('कहानी') || lower.includes('kahani') || lower.includes('story')) return 'kahani';
  if (lower.includes('अनुच्छेद') || lower.includes('anuched') || lower.includes('paragraph')) return 'anuched';
  if (lower.includes('पत्र') || lower.includes('patra') || lower.includes('letter')) return 'patra';
  if (lower.includes('सूचना') || lower.includes('soochna') || lower.includes('notice')) return 'soochna';
  if (lower.includes('डायरी') || lower.includes('diary')) return 'diary';
  if (lower.includes('विज्ञापन') || lower.includes('vigyapan') || lower.includes('advertisement')) return 'vigyapan';
  if (lower.includes('रचना') || lower.includes('लेखन') || lower.includes('composition')) return 'rachna_lekhan';
  return 'mixed_board';
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Normalizes a question text for deduplication checks
 */
export function normalizeQuestionKey(text: string): string {
  return (text || '')
    .replace(/^प्रश्न\s*\d+\s*[:.]\s*/i, '')
    .replace(/^Q\s*\d+\s*[:.]\s*/i, '')
    .replace(/^\d+\s*[.)]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Guarantees `count` completely unique, non-repeating questions with balanced randomized options.
 * Optional `existingQuestions` are preserved first (deduplicated) and topped up from the curated bank.
 * When `grade` is supplied, `mixed_board` and fallback pools stay strictly within that grade's syllabus.
 */
export function getUniqueWorksheetQuestions(
  topicOrId: string,
  count: number,
  topicNameHindi: string,
  topicNameEnglish: string,
  existingQuestions: QuizQuestion[] = [],
  grade?: GradeLevel
): QuizQuestion[] {
  const seen = new Set<string>();
  const finalQuestions: QuizQuestion[] = [];

  for (const q of existingQuestions) {
    if (!q || !q.questionHindi || !Array.isArray(q.options) || q.options.length < 4) continue;
    const key = normalizeQuestionKey(q.questionHindi);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    finalQuestions.push({
      ...q,
      id: `ws_q_${finalQuestions.length + 1}_${Date.now()}`,
      topicId: q.topicId || resolveTopicKeyFromString(topicOrId),
      topicNameHindi: q.topicNameHindi || topicNameHindi,
      topicNameEnglish: q.topicNameEnglish || topicNameEnglish,
    });
    if (finalQuestions.length >= count) break;
  }

  if (finalQuestions.length < count) {
    const resolvedKey = resolveTopicKeyFromString(topicOrId);
    const gradeConfig = grade ? getCurriculumForGrade(grade) : null;
    const bankKeys =
      resolvedKey === 'mixed_board' && gradeConfig
        ? gradeConfig.mixedBankKeys
        : TOPIC_ALIAS_MAP[resolvedKey] || ['karak'];

    let pool: RawBankQuestion[] = [];
    for (const bk of bankKeys) {
      if (RAW_BANK[bk]) pool.push(...RAW_BANK[bk]);
    }
    pool = shuffleArray(pool);

    // If pool is still smaller than count, pull extra items ONLY from allowed keys for that grade
    if (pool.length < count) {
      const allowedExtraKeys = gradeConfig
        ? gradeConfig.mixedBankKeys
        : Object.keys(RAW_BANK);
      const extraPool = shuffleArray(
        allowedExtraKeys
          .filter((k) => !bankKeys.includes(k) && Array.isArray(RAW_BANK[k]))
          .flatMap((k) => RAW_BANK[k])
      );
      pool = [...pool, ...extraPool];
    }

    for (const item of pool) {
      if (finalQuestions.length >= count) break;
      const key = normalizeQuestionKey(item.qH);
      if (seen.has(key)) continue;
      seen.add(key);
      finalQuestions.push({
        id: `ws_q_${finalQuestions.length + 1}_${Date.now()}`,
        topicId: resolvedKey,
        topicNameHindi,
        topicNameEnglish,
        questionHindi: item.qH,
        questionEnglish: item.qE,
        options: [
          { textHindi: item.correct, textEnglish: '' },
          ...item.wrongs.map((w) => ({ textHindi: w, textEnglish: '' }))
        ],
        correctIndex: 0,
        explanationHindi: item.expH,
        explanationEnglish: item.expE,
      });
    }
  }

  return randomizeQuizSet(finalQuestions.slice(0, count));
}

export function getAllRawBankQuestions(): RawBankQuestion[] {
  return Object.values(RAW_BANK).flat();
}

/**
 * Generates a focused mini-quiz (default 6 questions) from the user's `mistakeHistory` entries.
 * Prioritizes questions matching `sampleQuestions` stored in `mistakeHistory` (if found in the bank)
 * along with fresh unique questions for those weak topics.
 */
export function buildWeakAreasMiniQuiz(
  mistakes: MistakeTopicStat[],
  maxQuestions: number = 6,
  selectedTopicKeys?: string[]
): QuizQuestion[] {
  const targetCount = Math.max(3, Math.min(15, maxQuestions));
  const seen = new Set<string>();
  const nonce = Date.now();

  const filtered = (Array.isArray(mistakes) ? mistakes : [])
    .filter((m) => m && m.wrongCount > 0)
    .filter((m) => {
      if (!selectedTopicKeys || selectedTopicKeys.length === 0) return true;
      const resolved = resolveTopicKeyFromString(m.topicKey || m.topicNameHindi || '');
      return selectedTopicKeys.includes(m.topicKey) || selectedTopicKeys.includes(resolved);
    })
    .sort((a, b) => {
      if ((b.wrongCount || 0) !== (a.wrongCount || 0)) {
        return (b.wrongCount || 0) - (a.wrongCount || 0);
      }
      return String(b.lastWrongAt || '').localeCompare(String(a.lastWrongAt || ''));
    });

  if (filtered.length === 0) {
    return [];
  }

  const allBankFallback = shuffleArray(Object.values(RAW_BANK).flat());

  // Build ordered candidate pools per weak topic, prioritizing exact/similar missed sampleQuestions
  const topicQueues: {
    topicKey: string;
    labels: { hi: string; en: string };
    items: RawBankQuestion[];
  }[] = filtered.map((stat) => {
    const resolvedKey = resolveTopicKeyFromString(stat.topicKey || stat.topicNameHindi || 'karak');
    const labels = getCanonicalTopicLabels(resolvedKey, stat.topicNameHindi, stat.topicNameEnglish);
    const bankKeys = TOPIC_ALIAS_MAP[resolvedKey] || ['karak'];

    let pool: RawBankQuestion[] = [];
    for (const bk of bankKeys) {
      if (RAW_BANK[bk]) pool.push(...RAW_BANK[bk]);
    }
    if (pool.length === 0) {
      pool = [...allBankFallback];
    }

    const snippets = (stat.sampleQuestions || [])
      .map((s) => normalizeQuestionKey(s))
      .filter((s) => s.length >= 6);

    const matched: RawBankQuestion[] = [];
    const others: RawBankQuestion[] = [];

    for (const item of pool) {
      const qNorm = normalizeQuestionKey(item.qH);
      const isMatch = snippets.some(
        (snip) => qNorm === snip || qNorm.includes(snip.slice(0, 24)) || snip.includes(qNorm.slice(0, 24))
      );
      if (isMatch) {
        matched.push(item);
      } else {
        others.push(item);
      }
    }

    return {
      topicKey: resolvedKey,
      labels,
      items: [...shuffleArray(matched), ...shuffleArray(others)],
    };
  });

  const picked: QuizQuestion[] = [];
  let cursor = 0;
  let stallCount = 0;

  while (picked.length < targetCount && stallCount < topicQueues.length) {
    const queue = topicQueues[cursor % topicQueues.length];
    cursor += 1;

    let addedForTopic = false;
    while (queue.items.length > 0) {
      const item = queue.items.shift()!;
      const qKey = normalizeQuestionKey(item.qH);
      if (seen.has(qKey)) continue;
      seen.add(qKey);
      picked.push({
        id: `weak_review_${queue.topicKey}_${picked.length + 1}_${nonce}`,
        topicId: queue.topicKey,
        topicNameHindi: queue.labels.hi,
        topicNameEnglish: queue.labels.en,
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
      addedForTopic = true;
      break;
    }

    stallCount = addedForTopic ? 0 : stallCount + 1;
  }

  // If the requested count is larger than the selected weak topic pools, pad cleanly from general bank
  if (picked.length < targetCount) {
    for (const item of allBankFallback) {
      if (picked.length >= targetCount) break;
      const qKey = normalizeQuestionKey(item.qH);
      if (seen.has(qKey)) continue;
      seen.add(qKey);
      const fallbackQueue = topicQueues[picked.length % topicQueues.length];
      picked.push({
        id: `weak_review_extra_${picked.length + 1}_${nonce}`,
        topicId: fallbackQueue.topicKey,
        topicNameHindi: fallbackQueue.labels.hi,
        topicNameEnglish: fallbackQueue.labels.en,
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
    }
  }

  return randomizeQuizSet(picked);
}

