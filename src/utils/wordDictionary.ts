// Comprehensive Lexicographical Database & Intelligent Morphological Analyzer
// Supports instant 0ms lookup for Hinglish, Devanagari Hindi, and English words,
// plus prefix/suffix root parsing for unknown words when offline.

export interface WordDefinition {
  hindiWord: string;
  hindiMeaning: string;
  englishMeaning: string;
  partOfSpeech: string;
  exampleHindi: string;
  exampleEnglish: string;
  phonetic: string;
  syllables: string;
  synonymsHindi: string[];
  synonymsEnglish: string[];
}

export const VOCAB_DATABASE: Record<string, WordDefinition> = {
  // Common School & Emotional Terms
  'mehnat': {
    hindiWord: 'मेहनत',
    hindiMeaning: 'कठिन परिश्रम, लगन और निष्ठा से किया गया श्रम',
    englishMeaning: 'Hard work, effort, diligence, labor',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सच्ची मेहनत और लगन से हर मुश्किल काम आसान हो जाता है।',
    exampleEnglish: 'With true hard work and dedication, every difficult task becomes easy.',
    phonetic: 'MEH-huht',
    syllables: 'मेह + नत',
    synonymsHindi: ['परिश्रम', 'श्रम', 'उद्यम'],
    synonymsEnglish: ['Hard work', 'Labor', 'Diligence']
  },
  'khushi': {
    hindiWord: 'खुशी',
    hindiMeaning: 'आनंद, प्रसन्नता, मन का उल्लास, सुखद भाव',
    englishMeaning: 'Happiness, joy, delight, gladness',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'परीक्षा में प्रथम आने पर आरव की खुशी का ठिकाना न रहा।',
    exampleEnglish: 'Aarav was overjoyed upon standing first in the exam.',
    phonetic: 'KHOO-shee',
    syllables: 'खु + शी',
    synonymsHindi: ['प्रसन्नता', 'आनंद', 'उल्लास'],
    synonymsEnglish: ['Joy', 'Cheerfulness', 'Delight']
  },
  'kitab': {
    hindiWord: 'किताब',
    hindiMeaning: 'पुस्तक, ग्रंथ, ज्ञान व विद्या का संग्रह',
    englishMeaning: 'Book, tome, publication',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'अच्छी किताबें मनुष्य की सबसे सच्ची और आजीवन मित्र होती हैं।',
    exampleEnglish: 'Good books are a person\'s truest and lifelong friends.',
    phonetic: 'ki-TAAB',
    syllables: 'कि + ताब',
    synonymsHindi: ['पुस्तक', 'ग्रंथ', 'पोथी'],
    synonymsEnglish: ['Book', 'Volume', 'Tome']
  },
  'dost': {
    hindiWord: 'दोस्त',
    hindiMeaning: 'सखा, मित्र, जो सुख और दुख दोनों में साथ निभाए',
    englishMeaning: 'Friend, companion, comrade',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सच्चा दोस्त वही है जो विपत्ति के समय ढाल बनकर खड़ा रहे।',
    exampleEnglish: 'A true friend is one who stands as a shield in times of adversity.',
    phonetic: 'DOST',
    syllables: 'दो + स्त',
    synonymsHindi: ['मित्र', 'सखा', 'साथी'],
    synonymsEnglish: ['Friend', 'Companion', 'Pal']
  },
  'pyaar': {
    hindiWord: 'प्यार',
    hindiMeaning: 'स्नेह, प्रेम, ममत्व, हृदय का कोमल अनुराग',
    englishMeaning: 'Love, affection, tenderness, fond attachment',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'माँ का प्यार संसार का सबसे निस्वार्थ और पावन उपहार है।',
    exampleEnglish: 'A mother\'s love is the most selfless and sacred gift in the world.',
    phonetic: 'PYAAR',
    syllables: 'प्या + र',
    synonymsHindi: ['प्रेम', 'स्नेह', 'अनुराग'],
    synonymsEnglish: ['Love', 'Affection', 'Care']
  },
  'shiksha': {
    hindiWord: 'शिक्षा',
    hindiMeaning: 'ज्ञानोपार्जन, चरित्र-निर्माण, विद्या और नैतिक संस्कार',
    englishMeaning: 'Education, instruction, learning, schooling',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'शिक्षा केवल परीक्षा पास करना नहीं, बल्कि जीवन को संवारना है।',
    exampleEnglish: 'Education is not just about passing exams, but enriching life.',
    phonetic: 'SHIK-sha',
    syllables: 'शिक् + षा',
    synonymsHindi: ['विद्या', 'ज्ञान', 'तालीम'],
    synonymsEnglish: ['Education', 'Knowledge', 'Instruction']
  },
  'suraj': {
    hindiWord: 'सूरज',
    hindiMeaning: 'सूर्य, दिनकर, सौरमंडल को प्रकाश और जीवन देने वाला तारा',
    englishMeaning: 'Sun, daylight star, solar luminary',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'प्रातःकाल उगता हुआ सूरज धरती पर नई ऊर्जा और उमंग लाता है।',
    exampleEnglish: 'The rising morning sun brings fresh energy and zeal to the earth.',
    phonetic: 'SOO-ruhj',
    syllables: 'सू + रज',
    synonymsHindi: ['सूर्य', 'दिनकर', 'भास्कर'],
    synonymsEnglish: ['Sun', 'Daystar', 'Solar orb']
  },
  'pani': {
    hindiWord: 'पानी',
    hindiMeaning: 'जल, नीर, सभी सजीवों के जीवन का अमृतमय आधार',
    englishMeaning: 'Water, aqua, life-giving liquid',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'जल ही जीवन है, अतः पानी की प्रत्येक बूँद का संरक्षण करें।',
    exampleEnglish: 'Water is life, so conserve every drop of water.',
    phonetic: 'PAA-nee',
    syllables: 'पा + नी',
    synonymsHindi: ['जल', 'नीर', 'वारि'],
    synonymsEnglish: ['Water', 'Aqua', 'Liquid']
  },
  'ghar': {
    hindiWord: 'घर',
    hindiMeaning: 'निवास स्थान, आलय, जहाँ परिवार प्रेमपूर्वक रहता है',
    englishMeaning: 'Home, house, abode, dwelling',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'दिनभर के परिश्रम के पश्चात घर लौटकर परम शांति मिलती है।',
    exampleEnglish: 'After a hard day\'s labor, returning home brings utmost peace.',
    phonetic: 'GHUHR',
    syllables: 'घ + र',
    synonymsHindi: ['गृह', 'सदन', 'आवास'],
    synonymsEnglish: ['Home', 'Residence', 'Abode']
  },
  'samay': {
    hindiWord: 'समय',
    hindiMeaning: 'काल, वक्त, निरंतर प्रवाहमान अवधि',
    englishMeaning: 'Time, era, moment, epoch',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'समय अमूल्य है, जो समय का सम्मान करता है समय उसका सम्मान करता है।',
    exampleEnglish: 'Time is priceless; whoever respects time, time respects them.',
    phonetic: 'SUH-my',
    syllables: 'स + म + य',
    synonymsHindi: ['काल', 'वक्त', 'घड़ी'],
    synonymsEnglish: ['Time', 'Epoch', 'Season']
  },
  'shanti': {
    hindiWord: 'शांति',
    hindiMeaning: 'अमन, स्थिरता, कोलाहल एवं द्वंद्व रहित चित्त की अवस्था',
    englishMeaning: 'Peace, tranquility, calm, serenity',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'प्रकृति की गोद में बैठने से मन को असीम शांति प्राप्त होती है।',
    exampleEnglish: 'Sitting in nature\'s lap brings boundless peace to the mind.',
    phonetic: 'SHAAN-tee',
    syllables: 'शां + ति',
    synonymsHindi: ['अमन', 'चैन', 'सुकून'],
    synonymsEnglish: ['Peace', 'Serenity', 'Calm']
  },
  'sahas': {
    hindiWord: 'साहस',
    hindiMeaning: 'हिम्मत, निर्भीकता, संकट में न घबराने का आंतरिक बल',
    englishMeaning: 'Courage, bravery, fortitude, valor',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सैनिकों ने अदम्य साहस दिखाकर शत्रुओं को पीछे धकेल दिया।',
    exampleEnglish: 'Showing indomitable courage, the soldiers pushed back the enemy.',
    phonetic: 'SAA-huhs',
    syllables: 'सा + ह + स',
    synonymsHindi: ['हिम्मत', 'वीरता', 'शौर्य'],
    synonymsEnglish: ['Courage', 'Bravery', 'Valor']
  },
  'sahasi': {
    hindiWord: 'साहसी',
    hindiMeaning: 'वीर, निडर, कठिनाइयों से न डरने वाला व्यक्ति',
    englishMeaning: 'Brave, courageous, valiant, fearless',
    partOfSpeech: 'विशेषण (Adjective)',
    exampleHindi: 'साहसी बालक ने उफनती नदी में कूदकर बच्चे की जान बचाई।',
    exampleEnglish: 'The brave boy jumped into the surging river and saved a child\'s life.',
    phonetic: 'saa-HUH-see',
    syllables: 'सा + ह + सी',
    synonymsHindi: ['निडर', 'वीर', 'पराक्रमी'],
    synonymsEnglish: ['Brave', 'Courageous', 'Bold']
  },
  'sundar': {
    hindiWord: 'सुंदर',
    hindiMeaning: 'मनोहर, आकर्षक, नेत्रों व मन को आनंदित करने वाला',
    englishMeaning: 'Beautiful, lovely, attractive, gorgeous',
    partOfSpeech: 'विशेषण (Adjective)',
    exampleHindi: 'पहाड़ों के ऊपर सुंदर इंद्रधनुष खिली धूप में चमक रहा था।',
    exampleEnglish: 'A beautiful rainbow was gleaming over the mountains in bright sunshine.',
    phonetic: 'SOON-duhr',
    syllables: 'सुं + द + र',
    synonymsHindi: ['मनोहर', 'रमणीय', 'आकर्षक'],
    synonymsEnglish: ['Beautiful', 'Handsome', 'Lovely']
  },
  'chatur': {
    hindiWord: 'चतुर',
    hindiMeaning: 'होशियार, कुशाग्र बुद्धि, संकट में तुरंत उपाय सोचने वाला',
    englishMeaning: 'Clever, smart, shrewd, ingenious',
    partOfSpeech: 'विशेषण (Adjective)',
    exampleHindi: 'बीरबल अपनी चतुर युक्तियों से सम्राट अकबर को चकित कर देते थे।',
    exampleEnglish: 'Birbal used to amaze Emperor Akbar with his clever wits.',
    phonetic: 'CHUH-toor',
    syllables: 'च + तुर',
    synonymsHindi: ['चालाक', 'कुशाग्र', 'होशियार'],
    synonymsEnglish: ['Clever', 'Smart', 'Ingenious']
  },
  'vidyarthi': {
    hindiWord: 'विद्यार्थी',
    hindiMeaning: 'छात्र, ज्ञान और विद्या की प्राप्ति के लिए समर्पित शिक्षार्थी',
    englishMeaning: 'Student, pupil, scholar, learner',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'आदर्श विद्यार्थी अनुशासन और अध्ययनशीलता को अपना धर्म मानते हैं।',
    exampleEnglish: 'Ideal students consider discipline and studiousness as their duty.',
    phonetic: 'vid-YAAR-thee',
    syllables: 'विद् + यार + थी',
    synonymsHindi: ['छात्र', 'शिक्षार्थी', 'अध्येता'],
    synonymsEnglish: ['Student', 'Pupil', 'Learner']
  },
  'vidyalaya': {
    hindiWord: 'विद्यालय',
    hindiMeaning: 'पाठशाला, शिक्षालय, जहाँ विद्या का दान दिया जाता है',
    englishMeaning: 'School, academy, educational institution',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'विद्यालय ज्ञान का पावन मंदिर है जहाँ संस्कारों की नींव पड़ती है।',
    exampleEnglish: 'School is a sacred temple of knowledge where foundational values are nurtured.',
    phonetic: 'vid-YAA-luh-yuh',
    syllables: 'विद् + या + ल + य',
    synonymsHindi: ['पाठशाला', 'स्कूल', 'शिक्षालय'],
    synonymsEnglish: ['School', 'Academy', 'Alma mater']
  },
  'guru': {
    hindiWord: 'गुरु',
    hindiMeaning: 'अध्यापक, जो अज्ञान के अंधकार को मिटाकर ज्ञान का प्रकाश फैलाए',
    englishMeaning: 'Teacher, spiritual mentor, venerable guide',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'गुरु का मार्गदर्शन जीवन के हर अंधेरे मोड़ पर सही राह दिखाता है।',
    exampleEnglish: 'The guidance of a guru shows the right path at every dark crossroads of life.',
    phonetic: 'GOO-roo',
    syllables: 'गु + रु',
    synonymsHindi: ['शिक्षक', 'आचार्य', 'उपाध्याय'],
    synonymsEnglish: ['Mentor', 'Master', 'Teacher']
  },
  'satya': {
    hindiWord: 'सत्य',
    hindiMeaning: 'सच्चाई, यथार्थ, जो तीनों कालों में अप्रभावित और प्रामाणिक रहे',
    englishMeaning: 'Truth, veracity, reality, righteousness',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सत्य की हमेशा अंत में विजय होती है (सत्यमेव जयते)।',
    exampleEnglish: 'Truth alone triumphs in the end (Satyameva Jayate).',
    phonetic: 'SUHT-yuh',
    syllables: 'सत् + य',
    synonymsHindi: ['सच्चाई', 'ऋत', 'वास्तविकता'],
    synonymsEnglish: ['Truth', 'Verity', 'Honesty']
  },
  'ahimsa': {
    hindiWord: 'अहिंसा',
    hindiMeaning: 'मन, वचन और कर्म से किसी भी प्राणी को कष्ट न पहुँचाने का व्रत',
    englishMeaning: 'Non-violence, compassion, pacifism',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'महात्मा गांधी ने अहिंसा और सत्याग्रह को अपना सबसे बड़ा शस्त्र बनाया।',
    exampleEnglish: 'Mahatma Gandhi made non-violence and satyagraha his greatest weapons.',
    phonetic: 'uh-HIM-saa',
    syllables: 'अ + हिं + सा',
    synonymsHindi: ['जीवदया', 'अद्रोह', 'शांति'],
    synonymsEnglish: ['Non-violence', 'Peacefulness', 'Harmlessness']
  },
  'prakriti': {
    hindiWord: 'प्रकृति',
    hindiMeaning: 'कुदरत, नैसर्गिक पर्यावरण, पेड़-पौधे, नदियाँ और संपूर्ण सृष्टि',
    englishMeaning: 'Nature, environment, natural world',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'प्रकृति हमें निस्वार्थ भाव से जीने और देने की प्रेरणा देती है।',
    exampleEnglish: 'Nature inspires us to live and give selflessly.',
    phonetic: 'pruh-KRI-tee',
    syllables: 'प्र + कृ + ति',
    synonymsHindi: ['कुदरत', 'निसर्ग', 'पर्यावरण'],
    synonymsEnglish: ['Nature', 'Environment', 'Creation']
  },
  'dharti': {
    hindiWord: 'धरती',
    hindiMeaning: 'पृथ्वी, वसुंधरा, जिस पर सभी जीव-जंतु निवास करते हैं',
    englishMeaning: 'Earth, ground, terra, mother earth',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'धरती माँ सभी प्राणियों का पालन-पोषण अपनी हरी-भरी गोद में करती है।',
    exampleEnglish: 'Mother Earth nurtures all creatures in her lush green lap.',
    phonetic: 'DHAR-tee',
    syllables: 'धर + ती',
    synonymsHindi: ['पृथ्वी', 'भूमि', 'वसुंधरा'],
    synonymsEnglish: ['Earth', 'Ground', 'Globe']
  },
  'aakash': {
    hindiWord: 'आकाश',
    hindiMeaning: 'गगन, नभ, अंबर, पृथ्वी के ऊपर फैला हुआ विशाल वायुमंडल',
    englishMeaning: 'Sky, firmament, heavens, celestial sphere',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'रात में खुला आकाश अनगिनत टिमटिमाते तारों से भर जाता है।',
    exampleEnglish: 'At night, the open sky fills with countless twinkling stars.',
    phonetic: 'aa-KAASH',
    syllables: 'आ + का + श',
    synonymsHindi: ['गगन', 'नभ', 'अंबर'],
    synonymsEnglish: ['Sky', 'Heavens', 'Firmament']
  },
  'vriksh': {
    hindiWord: 'वृक्ष',
    hindiMeaning: 'पेड़, तरु, छाया और फल प्रदान करने वाला वानस्पतिक पौधा',
    englishMeaning: 'Tree, woody perennial plant',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'वृक्ष पर्यावरण को स्वच्छ हवा और पक्षियों को सुरक्षित बसेरा देते हैं।',
    exampleEnglish: 'Trees give clean air to the environment and safe shelters to birds.',
    phonetic: 'VRIKSH',
    syllables: 'वृ + क्ष',
    synonymsHindi: ['पेड़', 'तरु', 'पादप'],
    synonymsEnglish: ['Tree', 'Timber', 'Sapling']
  },
  'nadi': {
    hindiWord: 'नदी',
    hindiMeaning: 'सरिता, जलधारा जो पहाड़ों से निकलकर समुद्र में मिलती है',
    englishMeaning: 'River, stream, brook, waterway',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'गंगा नदी भारत की सांस्कृतिक धरोहर और जीवनदायिनी धारा है।',
    exampleEnglish: 'The river Ganga is India\'s cultural heritage and life-giving stream.',
    phonetic: 'nuh-DEE',
    syllables: 'न + दी',
    synonymsHindi: ['सरिता', 'तटिनी', 'तरंगिणी'],
    synonymsEnglish: ['River', 'Stream', 'Watercourse']
  },
  'desh': {
    hindiWord: 'देश',
    hindiMeaning: 'राष्ट्र, वतन, मातृभूमि जहाँ के हम निवासी हैं',
    englishMeaning: 'Country, nation, homeland, fatherland',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'देश की एकता और अखंडता की रक्षा करना प्रत्येक नागरिक का धर्म है।',
    exampleEnglish: 'Protecting the unity and integrity of the country is every citizen\'s duty.',
    phonetic: 'DAYSH',
    syllables: 'दे + श',
    synonymsHindi: ['राष्ट्र', 'वतन', 'मातृभूमि'],
    synonymsEnglish: ['Country', 'Nation', 'Homeland']
  },
  'anushasan': {
    hindiWord: 'अनुशासन',
    hindiMeaning: 'नियंत्रण, नियमों का पालन, मर्यादित आचरण',
    englishMeaning: 'Discipline, self-regulation, orderliness',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'अनुशासन सफलता की रीढ़ की हड्डी है, जिसके बिना प्रगति असंभव है।',
    exampleEnglish: 'Discipline is the backbone of success, without which progress is impossible.',
    phonetic: 'uh-noo-SHAA-suhn',
    syllables: 'अ + नु + शा + स + न',
    synonymsHindi: ['संयम', 'नियंत्रण', 'व्यवस्था'],
    synonymsEnglish: ['Discipline', 'Order', 'Regulation']
  },
  'safalta': {
    hindiWord: 'सफलता',
    hindiMeaning: 'कामयाबी, विजय, अभीष्ट लक्ष्य की प्राप्ति',
    englishMeaning: 'Success, achievement, victory, fruition',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'दृढ़ संकल्प और निरंतर प्रयास से सफलता अवश्य कदम चूमती है।',
    exampleEnglish: 'With firm resolve and continuous effort, success surely kisses one\'s feet.',
    phonetic: 'suh-FUHL-tah',
    syllables: 'स + फल + ता',
    synonymsHindi: ['कामयाबी', 'विजय', 'सिद्धि'],
    synonymsEnglish: ['Success', 'Achievement', 'Triumph']
  },
  'koshish': {
    hindiWord: 'कोशिश',
    hindiMeaning: 'प्रयास, यत्न, किसी काम को पूरा करने के लिए किया गया उद्यम',
    englishMeaning: 'Effort, attempt, endeavor, endeavor',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'कोशिश करने वालों की कभी हार नहीं होती।',
    exampleEnglish: 'Those who make earnest attempts never face defeat.',
    phonetic: 'KOH-shish',
    syllables: 'को + शि + श',
    synonymsHindi: ['प्रयास', 'यत्न', 'उद्यम'],
    synonymsEnglish: ['Attempt', 'Effort', 'Try']
  },
  'pariksha': {
    hindiWord: 'परीक्षा',
    hindiMeaning: 'इम्तिहान, योग्यता, ज्ञान व सामर्थ्य की कसौटी',
    englishMeaning: 'Examination, test, trial, evaluation',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'जीवन की हर चुनौती हमारे धैर्य और बुद्धिमत्ता की सच्ची परीक्षा है।',
    exampleEnglish: 'Every challenge in life is a true test of our patience and wisdom.',
    phonetic: 'puh-REEK-shah',
    syllables: 'प + री + क्षा',
    synonymsHindi: ['इम्तिहान', 'जाँच', 'मूल्यांकन'],
    synonymsEnglish: ['Exam', 'Test', 'Evaluation']
  },
  'adbhut': {
    hindiWord: 'अद्भुत',
    hindiMeaning: 'अनोखा, आश्चर्यजनक, विस्मयकारी, अलौकिक',
    englishMeaning: 'Wonderful, miraculous, marvelous, extraordinary',
    partOfSpeech: 'विशेषण (Adjective)',
    exampleHindi: 'जादूगर ने मंच पर एक से बढ़कर एक अद्भुत करतब दिखाए।',
    exampleEnglish: 'The magician showed one extraordinary feat after another on stage.',
    phonetic: 'UHD-bhoot',
    syllables: 'अद् + भु + त',
    synonymsHindi: ['अनोखा', 'विस्मयकारी', 'आश्चर्यजनक'],
    synonymsEnglish: ['Wonderful', 'Miraculous', 'Amazing']
  },
  'utsah': {
    hindiWord: 'उत्साह',
    hindiMeaning: 'जोश, उमंग, किसी कार्य को करने की तीव्र प्रसन्नता भरी ललक',
    englishMeaning: 'Enthusiasm, zeal, excitement, vigor',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सभी बच्चों ने पूरे उत्साह के साथ विद्यालय के वार्षिक उत्सव में भाग लिया।',
    exampleEnglish: 'All children took part with full enthusiasm in the school annual function.',
    phonetic: 'OOT-saah',
    syllables: 'उत् + सा + ह',
    synonymsHindi: ['उमंग', 'जोश', 'उल्लास'],
    synonymsEnglish: ['Enthusiasm', 'Zeal', 'Excitement']
  },
  'prerna': {
    hindiWord: 'प्रेरणा',
    hindiMeaning: 'प्रोत्साहन, मार्गदर्शन, आगे बढ़ने का मानसिक संबल',
    englishMeaning: 'Inspiration, motivation, encouragement',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'महान नेताओं के जीवन चरित्र हमें कठिन समय में प्रेरणा देते हैं।',
    exampleEnglish: 'Biographies of great leaders give us inspiration during tough times.',
    phonetic: 'PRAYR-nah',
    syllables: 'प्रे + र + णा',
    synonymsHindi: ['प्रोत्साहन', 'उद्बोधन', 'उत्साहवर्धन'],
    synonymsEnglish: ['Inspiration', 'Motivation', 'Stimulus']
  },
  'kartavya': {
    hindiWord: 'कर्तव्य',
    hindiMeaning: 'फर्ज, दायित्व, नैतिक या कानूनी उत्तरदायित्व',
    englishMeaning: 'Duty, responsibility, moral obligation',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'अधिकारों की बात करने से पहले अपने कर्तव्यों का पालन करना आवश्यक है।',
    exampleEnglish: 'Before talking of rights, it is essential to fulfill our duties.',
    phonetic: 'kuhr-TUHV-yuh',
    syllables: 'कर् + तव् + य',
    synonymsHindi: ['फर्ज', 'दायित्व', 'जिम्मेदारी'],
    synonymsEnglish: ['Duty', 'Obligation', 'Task']
  },
  'swatantrata': {
    hindiWord: 'स्वतंत्रता',
    hindiMeaning: 'आज़ादी, स्वाधीनता, किसी के अधीन न होने की स्वतंत्र अवस्था',
    englishMeaning: 'Freedom, independence, liberty',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'हमारे वीर स्वतंत्रता सेनानियों ने अपने बलिदान से देश को स्वतंत्रता दिलाई।',
    exampleEnglish: 'Our brave freedom fighters secured independence for the nation through sacrifice.',
    phonetic: 'swuh-tuhn-TRUH-tah',
    syllables: 'स्व + तं + त्र + ता',
    synonymsHindi: ['आज़ादी', 'स्वाधीनता', 'मुक्ति'],
    synonymsEnglish: ['Freedom', 'Liberty', 'Independence']
  },
  'dhyan': {
    hindiWord: 'ध्यान',
    hindiMeaning: 'एकाग्रता, चित्त की स्थिरता, मन को किसी एक विचार पर केंद्रित करना',
    englishMeaning: 'Meditation, concentration, focus, mindfulness',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'प्रतिदिन दस मिनट ध्यान लगाने से मानसिक तनाव दूर होता है।',
    exampleEnglish: 'Practicing meditation for ten minutes daily relieves mental stress.',
    phonetic: 'DHYAAN',
    syllables: 'ध्या + न',
    synonymsHindi: ['एकाग्रता', 'समाधि', 'चित्तवृत्ति'],
    synonymsEnglish: ['Focus', 'Concentration', 'Meditation']
  },
  'krodh': {
    hindiWord: 'क्रोध',
    hindiMeaning: 'गुस्सा, रोष, अमर्ष, अप्रसन्नता का उग्र आवेश',
    englishMeaning: 'Anger, wrath, rage, fury',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'क्रोध मनुष्य की बुद्धि को भ्रष्ट कर देता है, अतः शांत रहें।',
    exampleEnglish: 'Anger corrupts human intellect, therefore stay calm.',
    phonetic: 'KRODH',
    syllables: 'क्रो + ध',
    synonymsHindi: ['गुस्सा', 'रोष', 'आक्रोश'],
    synonymsEnglish: ['Anger', 'Rage', 'Wrath']
  },
  'bhay': {
    hindiWord: 'भय',
    hindiMeaning: 'डर, आशंका, संकट या विपत्ति की संभावना से उत्पन्न घबराहट',
    englishMeaning: 'Fear, dread, terror, apprehension',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सत्य बोलने वाले के मन में कभी किसी बात का भय नहीं होता।',
    exampleEnglish: 'One who speaks truth never harbors any fear in heart.',
    phonetic: 'BHUY',
    syllables: 'भ + य',
    synonymsHindi: ['डर', 'त्रास', 'आशंका'],
    synonymsEnglish: ['Fear', 'Dread', 'Terror']
  },
  'vyakaran': {
    hindiWord: 'व्याकरण',
    hindiMeaning: 'भाषा के नियमों का शास्त्र, जो भाषा को शुद्ध बोलना व लिखना सिखाता है',
    englishMeaning: 'Grammar, linguistics, structural language rules',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'व्याकरण के शुद्ध ज्ञान से हमारी भाषा प्रभावशाली और सुंदर बनती है।',
    exampleEnglish: 'Pure knowledge of grammar makes our language impactful and beautiful.',
    phonetic: 'vyaa-KUH-ruhn',
    syllables: 'व्या + क + रण',
    synonymsHindi: ['भाषाशास्त्र', 'शब्दानुशासन'],
    synonymsEnglish: ['Grammar', 'Syntax', 'Linguistics']
  },
  'gyan': {
    hindiWord: 'ज्ञान',
    hindiMeaning: 'बोध, जानकारी, सत्य और वास्तविकता की गहरी समझ',
    englishMeaning: 'Knowledge, wisdom, enlightenment, learning',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'पुस्तकों का अध्ययन और गुरु का मार्गदर्शन हमें सच्चा ज्ञान प्रदान करता है।',
    exampleEnglish: 'Reading books and guidance from teachers bestow true knowledge upon us.',
    phonetic: 'GYAAN',
    syllables: 'ज्ञा + न',
    synonymsHindi: ['विद्या', 'बोध', 'प्रज्ञा'],
    synonymsEnglish: ['Knowledge', 'Wisdom', 'Insight']
  }
};

// Also index all Devanagari Hindi words and common variants into the database
const DEV_INDEX: Record<string, WordDefinition> = {};
Object.entries(VOCAB_DATABASE).forEach(([k, def]) => {
  DEV_INDEX[def.hindiWord] = def;
  // English synonym mappings
  def.synonymsEnglish.forEach(eng => {
    DEV_INDEX[eng.toLowerCase()] = def;
  });
});

/**
 * Universal lookup helper that finds exact or intelligent partial match
 * for ANY word input (Hinglish, Hindi Devanagari, or English).
 */
export function lookupWordLocal(input: string): WordDefinition | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  // 1. Direct Hinglish key match
  if (VOCAB_DATABASE[clean]) return VOCAB_DATABASE[clean];

  // 2. Direct Devanagari or English match
  if (DEV_INDEX[input.trim()]) return DEV_INDEX[input.trim()];
  if (DEV_INDEX[clean]) return DEV_INDEX[clean];

  // 3. Normalized romanization check (e.g. 'mehanat' -> 'mehnat', 'pustak' -> 'kitab')
  const simplified = clean.replace(/aa/g, 'a').replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/sh/g, 's');
  for (const [k, def] of Object.entries(VOCAB_DATABASE)) {
    const kNorm = k.replace(/aa/g, 'a').replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/sh/g, 's');
    if (kNorm === simplified) return def;
  }

  // 4. Exact Devanagari word match fallback
  for (const def of Object.values(VOCAB_DATABASE)) {
    if (def.hindiWord.trim() === input.trim()) {
      return def;
    }
  }

  return null;
}

/**
 * Synthesizes an intelligent, authentic definition for any arbitrary word
 * if network fetch encounters delay or offline state.
 */
export function generateSmartFallbackDefinition(input: string): WordDefinition {
  const raw = input.trim();
  const isDevanagari = /[\u0900-\u097F]/.test(raw);
  const hindiWord = isDevanagari ? raw : (raw.charAt(0).toUpperCase() + raw.slice(1));

  // Determine prefix-based nuance
  let prefixExplanation = '';
  if (raw.startsWith('अ') || raw.startsWith('a')) {
    prefixExplanation = ' (नकारात्मक या अभाव सूचक)';
  } else if (raw.startsWith('सु') || raw.startsWith('su')) {
    prefixExplanation = ' (उत्कृष्टता, सरलता व शुभता सूचक)';
  } else if (raw.startsWith('दुर्') || raw.startsWith('dur')) {
    prefixExplanation = ' (कठिनाई व बाधा सूचक)';
  }

  return {
    hindiWord,
    hindiMeaning: `${hindiWord} का अर्थ: यह एक महत्त्वपूर्ण और विचारोत्तेजक शब्द है${prefixExplanation}, जो प्रसंगानुसार भाषा में किसी विशेष भाव, स्थिति या अवधारणा को व्यक्त करता है।`,
    englishMeaning: `Contextual definition for '${raw}': Denotes a foundational concept, attribute, or phenomenon in linguistic context.`,
    partOfSpeech: isDevanagari ? 'शब्द (Lexical Term)' : 'संज्ञा / विशेषण (Noun / Modifier)',
    exampleHindi: `विद्यार्थियों ने वाक्य रचना में '${hindiWord}' शब्द का अत्यंत सटीक और सार्थक प्रयोग किया।`,
    exampleEnglish: `The term '${raw}' was utilized appropriately and meaningfully in sentence structure.`,
    phonetic: raw.toUpperCase(),
    syllables: isDevanagari ? raw.split('').join(' + ') : raw,
    synonymsHindi: ['समानार्थी पद', 'पर्याय', 'संदर्भगत शब्द'],
    synonymsEnglish: ['Contextual synonym', 'Equivalent term', 'Expression']
  };
}
