import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  ArrowRightLeft,
  Search,
  Sparkles,
  Check,
  RotateCcw,
  Languages,
  Zap,
  CheckCircle2,
  Mic,
  Smile,
  BookMarked,
  AlertCircle,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { lookupWordLocal, VOCAB_DATABASE, WordDefinition } from '../utils/wordDictionary';

interface DashboardVocabStudioProps {
  bilingualMode: boolean;
}

// Comprehensive built-in dictionary for 0ms instant offline lookup & fallback
const HINGLISH_DICT: Record<string, {
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
}> = {
  'khushi': {
    hindiWord: 'खुशी',
    hindiMeaning: 'आनंद, प्रसन्नता, सुखद अनुभव',
    englishMeaning: 'Happiness, joy, delight',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'परीक्षा में अच्छे अंक पाकर आरव की खुशी का ठिकाना न रहा।',
    exampleEnglish: 'Aarav was overjoyed after scoring great marks in the exam.',
    phonetic: 'KHOO-shee',
    syllables: 'खु + शी',
    synonymsHindi: ['प्रसन्नता', 'आनंद', 'उल्लास'],
    synonymsEnglish: ['Joy', 'Cheerfulness', 'Gladness']
  },
  'mehnat': {
    hindiWord: 'मेहनत',
    hindiMeaning: 'कठिन परिश्रम, लगन से किया गया काम',
    englishMeaning: 'Hard work, effort, diligence',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सच्ची मेहनत और लगन से हर मुश्किल काम आसान हो जाता है।',
    exampleEnglish: 'With true hard work and dedication, every difficult task becomes easy.',
    phonetic: 'MEH-huht',
    syllables: 'मेह + नत',
    synonymsHindi: ['परिश्रम', 'श्रम', 'उद्यम'],
    synonymsEnglish: ['Hard work', 'Labor', 'Diligence']
  },
  'kitab': {
    hindiWord: 'किताब',
    hindiMeaning: 'पुस्तक, अध्ययन सामग्री',
    englishMeaning: 'Book, volume',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'किताबें हमारी सबसे अच्छी और सच्ची मित्र होती हैं।',
    exampleEnglish: 'Books are our best and truest friends.',
    phonetic: 'ki-TAAB',
    syllables: 'कि + ताब',
    synonymsHindi: ['पुस्तक', 'ग्रंथ', 'पोथी'],
    synonymsEnglish: ['Book', 'Tome', 'Publication']
  },
  'dost': {
    hindiWord: 'दोस्त',
    hindiMeaning: 'सखा, मित्र, जो सुख-दुख में साथ दे',
    englishMeaning: 'Friend, companion',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सच्चा दोस्त वही है जो कठिन समय में मदद करे।',
    exampleEnglish: 'A true friend is one who helps during difficult times.',
    phonetic: 'DOST',
    syllables: 'दो + स्त',
    synonymsHindi: ['मित्र', 'सखा', 'साथी'],
    synonymsEnglish: ['Friend', 'Pal', 'Companion']
  },
  'jungle': {
    hindiWord: 'जंगल',
    hindiMeaning: 'वन, पेड़ों और वन्य जीवों का आवास',
    englishMeaning: 'Forest, jungle, woods',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'जंगल में हरे-भरे पेड़ और कलकल बहती नदियाँ थीं।',
    exampleEnglish: 'The forest was filled with lush green trees and babbling rivers.',
    phonetic: 'JUNG-guhl',
    syllables: 'जं + ग + ल',
    synonymsHindi: ['वन', 'कानन', 'अरण्य'],
    synonymsEnglish: ['Forest', 'Woods', 'Wilderness']
  },
  'pyaar': {
    hindiWord: 'प्यार',
    hindiMeaning: 'स्नेह, प्रेम, गहरा लगाव',
    englishMeaning: 'Love, affection, tenderness',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'माँ का प्यार दुनिया में सबसे निस्वार्थ और अनमोल होता है।',
    exampleEnglish: "A mother's love is the most selfless and priceless in the world.",
    phonetic: 'PYAAR',
    syllables: 'प्या + र',
    synonymsHindi: ['प्रेम', 'स्नेह', 'दुलार'],
    synonymsEnglish: ['Love', 'Affection', 'Care']
  },
  'shiksha': {
    hindiWord: 'शिक्षा',
    hindiMeaning: 'ज्ञान प्राप्ति, पढ़ाई-लिखाई, तालीम',
    englishMeaning: 'Education, learning, knowledge',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'शिक्षा व्यक्ति के चरित्र का निर्माण और जीवन को दिशा देती है।',
    exampleEnglish: "Education shapes a person's character and gives direction to life.",
    phonetic: 'SHIK-sha',
    syllables: 'शिक् + षा',
    synonymsHindi: ['विद्या', 'ज्ञान', 'तालीम'],
    synonymsEnglish: ['Education', 'Learning', 'Instruction']
  },
  'suraj': {
    hindiWord: 'सूरज',
    hindiMeaning: 'सूर्य, दिन में प्रकाश और ऊर्जा देने वाला तारा',
    englishMeaning: 'Sun, solar orb',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सुबह सूरज की किरणें धरती पर नया उत्साह लाती हैं।',
    exampleEnglish: 'Morning sun rays bring fresh enthusiasm to the earth.',
    phonetic: 'SOO-ruhj',
    syllables: 'सू + रज',
    synonymsHindi: ['सूर्य', 'दिनकर', 'भास्कर'],
    synonymsEnglish: ['Sun', 'Daystar', 'Solar body']
  },
  'duniya': {
    hindiWord: 'दुनिया',
    hindiMeaning: 'संसार, विश्व, जगत्',
    englishMeaning: 'World, universe, cosmos',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'यह दुनिया विविधता और सुंदर संस्कृतियों से भरी हुई है।',
    exampleEnglish: 'This world is filled with diversity and beautiful cultures.',
    phonetic: 'doo-NEE-yah',
    syllables: 'दु + नि + या',
    synonymsHindi: ['संसार', 'विश्व', 'जग'],
    synonymsEnglish: ['World', 'Earth', 'Globe']
  },
  'sapna': {
    hindiWord: 'सपना',
    hindiMeaning: 'ख्वाब, लक्ष्य, भविष्य की कल्पना',
    englishMeaning: 'Dream, vision, aspiration',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'उसने वैज्ञानिक बनकर देश की सेवा करने का सपना देखा।',
    exampleEnglish: 'He dreamed of becoming a scientist and serving the nation.',
    phonetic: 'SUHP-nah',
    syllables: 'स + प + ना',
    synonymsHindi: ['ख्वाब', 'कल्पना', 'अरमान'],
    synonymsEnglish: ['Dream', 'Vision', 'Aspiration']
  },
  'namaste': {
    hindiWord: 'नमस्ते',
    hindiMeaning: 'अभिवादन, दोनों हाथ जोड़कर प्रणाम करना',
    englishMeaning: 'Greetings, respectful salutation',
    partOfSpeech: 'अव्यय / अभिवादन (Greeting)',
    exampleHindi: 'उसने दोनों हाथ जोड़कर आदरपूर्वक "नमस्ते" कहा।',
    exampleEnglish: 'He folded both hands and respectfully said "Namaste".',
    phonetic: 'nuh-muh-STAY',
    syllables: 'न + म + स्ते',
    synonymsHindi: ['प्रणाम', 'नमस्कार', 'अभिवादन'],
    synonymsEnglish: ['Greetings', 'Salutations', 'Welcome']
  },
  'shukriya': {
    hindiWord: 'शुक्रिया',
    hindiMeaning: 'धन्यवाद, आभार प्रकट करना',
    englishMeaning: 'Thank you, gratitude, thanks',
    partOfSpeech: 'अव्यय / आभार (Gratitude)',
    exampleHindi: 'मदद के लिए उसने दिल से शुक्रिया अदा किया।',
    exampleEnglish: 'He expressed heartfelt thanks for the help.',
    phonetic: 'shook-REE-yah',
    syllables: 'शुक् + रि + या',
    synonymsHindi: ['धन्यवाद', 'आभार', 'कृतज्ञता'],
    synonymsEnglish: ['Thanks', 'Gratitude', 'Appreciation']
  },
  'dhanyawad': {
    hindiWord: 'धन्यवाद',
    hindiMeaning: 'आभार, कृतज्ञता व्यक्त करना',
    englishMeaning: 'Thank you, expression of gratitude',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'अतिथि ने सुंदर स्वागत के लिए सबको धन्यवाद दिया।',
    exampleEnglish: 'The guest thanked everyone for the warm welcome.',
    phonetic: 'dhun-yuh-VAAD',
    syllables: 'धन् + य + वाद',
    synonymsHindi: ['आभार', 'शुक्रिया', 'साधुवाद'],
    synonymsEnglish: ['Gratitude', 'Thanks', 'Thanksgiving']
  },
  'pariksha': {
    hindiWord: 'परीक्षा',
    hindiMeaning: 'इम्तिहान, योग्यता की जाँच',
    englishMeaning: 'Exam, test, evaluation',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'विद्यार्थी पूरे मन से वार्षिक परीक्षा की तैयारी कर रहे हैं।',
    exampleEnglish: 'Students are preparing whole-heartedly for the annual examination.',
    phonetic: 'puh-REEK-shah',
    syllables: 'प + री + क्षा',
    synonymsHindi: ['इम्तिहान', 'जाँच', 'मूल्यांकन'],
    synonymsEnglish: ['Examination', 'Test', 'Evaluation']
  },
  'shikshak': {
    hindiWord: 'शिक्षक',
    hindiMeaning: 'अध्यापक, गुरु, मार्गदर्शन करने वाला',
    englishMeaning: 'Teacher, educator, mentor',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सच्चे शिक्षक बच्चों के भविष्य को उज्ज्वल बनाते हैं।',
    exampleEnglish: 'True teachers shape the bright future of children.',
    phonetic: 'SHIK-shuhk',
    syllables: 'शिक्ष + क',
    synonymsHindi: ['अध्यापक', 'गुरु', 'आचार्य'],
    synonymsEnglish: ['Teacher', 'Mentor', 'Educator']
  },
  'pani': {
    hindiWord: 'पानी',
    hindiMeaning: 'जल, नीर, जीवनदाता तरल पदार्थ',
    englishMeaning: 'Water, life-giving liquid',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'जल ही जीवन का सच्चा आधार है, पानी व्यर्थ न बहाएं।',
    exampleEnglish: 'Water is the true foundation of life, do not waste water.',
    phonetic: 'PAA-nee',
    syllables: 'पा + नी',
    synonymsHindi: ['जल', 'नीर', 'वारि'],
    synonymsEnglish: ['Water', 'Aqua', 'Liquid']
  },
  'ghar': {
    hindiWord: 'घर',
    hindiMeaning: 'मकान, निवास स्थल, आलय जहाँ परिवार रहता है',
    englishMeaning: 'Home, residence, dwelling place',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'दिन भर की कड़ी मेहनत के बाद सब अपने घर लौट आए।',
    exampleEnglish: 'After a hard day of work, everyone returned home.',
    phonetic: 'GHUHR',
    syllables: 'घ + र',
    synonymsHindi: ['गृह', 'सदन', 'आवास'],
    synonymsEnglish: ['Home', 'Abode', 'House']
  },
  'samay': {
    hindiWord: 'समय',
    hindiMeaning: 'काल, वक्त, निरंतर गतिशील रहने वाला पल',
    englishMeaning: 'Time, moment, epoch',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'समय का सदुपयोग करने वाला व्यक्ति सदैव सफल होता है।',
    exampleEnglish: 'A person who makes good use of time always succeeds.',
    phonetic: 'SUH-my',
    syllables: 'स + म + य',
    synonymsHindi: ['काल', 'वक्त', 'घड़ी'],
    synonymsEnglish: ['Time', 'Period', 'Season']
  },
  'shanti': {
    hindiWord: 'शांति',
    hindiMeaning: 'अमन, स्थिरता, कोलाहल रहित शांत अवस्था',
    englishMeaning: 'Peace, tranquility, calm, serenity',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'शांत वातावरण में मन एकाग्र होकर पढ़ाई करता है।',
    exampleEnglish: 'In a peaceful environment, the mind studies with focus.',
    phonetic: 'SHAAN-tee',
    syllables: 'शां + ति',
    synonymsHindi: ['अमन', 'चैन', 'सुकून'],
    synonymsEnglish: ['Peace', 'Calm', 'Serenity']
  },
  'vidyalaya': {
    hindiWord: 'विद्यालय',
    hindiMeaning: 'पाठशाला, स्कूल, जहाँ विद्या और ज्ञान प्राप्त होता है',
    englishMeaning: 'School, institution of learning',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'विद्यार्थी प्रतिदिन समय पर विद्यालय पहुँचते हैं।',
    exampleEnglish: 'Students reach school on time every day.',
    phonetic: 'vid-YAA-luh-yuh',
    syllables: 'विद् + या + ल + य',
    synonymsHindi: ['पाठशाला', 'स्कूल', 'शिक्षालय'],
    synonymsEnglish: ['School', 'Academy', 'Alma mater']
  },
  'dosti': {
    hindiWord: 'दोस्ती',
    hindiMeaning: 'मित्रता, सख्य भाव, परस्पर सच्चा स्नेह',
    englishMeaning: 'Friendship, fellowship, companionship',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'कृष्ण और सुदामा की दोस्ती इतिहास में अमर है।',
    exampleEnglish: 'The friendship of Krishna and Sudama is immortal in history.',
    phonetic: 'DOS-tee',
    syllables: 'दो + स्ती',
    synonymsHindi: ['मित्रता', 'सखाभाव', 'यारी'],
    synonymsEnglish: ['Friendship', 'Amity', 'Bond']
  },
  'himmat': {
    hindiWord: 'हिम्मत',
    hindiMeaning: 'साहस, बहादुरी, कठिनाइयों का सामना करने का बल',
    englishMeaning: 'Courage, bravery, grit, boldness',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'मुश्किल परिस्थितियों में कभी हिम्मत नहीं हारनी चाहिए।',
    exampleEnglish: 'One should never lose courage in difficult circumstances.',
    phonetic: 'HIM-muht',
    syllables: 'हिम् + मत',
    synonymsHindi: ['साहस', 'शौर्य', 'हौसला'],
    synonymsEnglish: ['Courage', 'Valour', 'Boldness']
  },
  'safalta': {
    hindiWord: 'सफलता',
    hindiMeaning: 'कामयाबी, विजय, लक्ष्य की प्राप्ति',
    englishMeaning: 'Success, achievement, triumph',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'निरंतर अभ्यास और धैर्य से सफलता प्राप्त होती है।',
    exampleEnglish: 'Continuous practice and patience lead to success.',
    phonetic: 'suh-FUHL-tah',
    syllables: 'स + फल + ता',
    synonymsHindi: ['कामयाबी', 'विजय', 'सिद्धि'],
    synonymsEnglish: ['Success', 'Triumph', 'Achievement']
  },
  'prem': {
    hindiWord: 'प्रेम',
    hindiMeaning: 'स्नेह, अनुराग, हृदय का गहरा लगाव',
    englishMeaning: 'Love, deep affection, adoration',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'प्रेम और सद्भाव से दुनिया का हर दिल जीता जा सकता है।',
    exampleEnglish: 'With love and harmony, every heart in the world can be won.',
    phonetic: 'PRAYM',
    syllables: 'प्रे + म',
    synonymsHindi: ['प्यार', 'स्नेह', 'अनुराग'],
    synonymsEnglish: ['Love', 'Affection', 'Compassion']
  },
  'satya': {
    hindiWord: 'सत्य',
    hindiMeaning: 'सच्चाई, यथार्थ, जो कभी असत्य न हो',
    englishMeaning: 'Truth, reality, verity',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleHindi: 'सत्य की हमेशा अंत में विजय होती है।',
    exampleEnglish: 'Truth always triumphs in the end.',
    phonetic: 'SUHT-yuh',
    syllables: 'सत् + य',
    synonymsHindi: ['सच्चाई', 'ऋत', 'वास्तविकता'],
    synonymsEnglish: ['Truth', 'Verity', 'Fact']
  }
};

// Common bilingual word translations for Tab 2
const BILINGUAL_CONVERSION_MAP: Record<string, { hi: string; en: string; type: string; exampleHi: string; exampleEn: string }> = {
  'courage': { hi: 'साहस / हिम्मत', en: 'Courage', type: 'Noun', exampleHi: 'उसने कठिन समय में कभी साहस नहीं छोड़ा।', exampleEn: 'He never lost courage in difficult times.' },
  'water': { hi: 'पानी / जल', en: 'Water', type: 'Noun', exampleHi: 'जल ही जीवन का आधार है।', exampleEn: 'Water is the foundation of life.' },
  'friendship': { hi: 'दोस्ती / मित्रता', en: 'Friendship', type: 'Noun', exampleHi: 'सच्ची मित्रता जीवन की सबसे बड़ी दौलत है।', exampleEn: 'True friendship is the greatest wealth of life.' },
  'knowledge': { hi: 'ज्ञान / विद्या', en: 'Knowledge', type: 'Noun', exampleHi: 'ज्ञान बाँटने से निरंतर बढ़ता है।', exampleEn: 'Knowledge continuously grows by sharing.' },
  'nature': { hi: 'प्रकृति / कुदरत', en: 'Nature', type: 'Noun', exampleHi: 'प्रकृति हमें निस्वार्थ भाव से सब कुछ देती है।', exampleEn: 'Nature gives us everything selflessly.' },
  'success': { hi: 'सफलता / विजय', en: 'Success', type: 'Noun', exampleHi: 'कड़ी मेहनत ही सफलता की कुंजी है।', exampleEn: 'Hard work is the key to success.' },
  'patience': { hi: 'धैर्य / सब्र', en: 'Patience', type: 'Noun', exampleHi: 'कठिन परिस्थितियों में धैर्य रखना चाहिए।', exampleEn: 'One should maintain patience in difficult situations.' },
  'honesty': { hi: 'ईमानदारी / सच्चाई', en: 'Honesty', type: 'Noun', exampleHi: 'ईमानदारी सबसे अच्छी नीति है।', exampleEn: 'Honesty is the best policy.' },
  'peace': { hi: 'शांति / अमन', en: 'Peace', type: 'Noun', exampleHi: 'शांतिपूर्ण वातावरण में मन एकाग्र रहता है।', exampleEn: 'The mind remains focused in a peaceful environment.' },
  'time': { hi: 'समय / काल', en: 'Time', type: 'Noun', exampleHi: 'बीता हुआ समय कभी वापस नहीं आता।', exampleEn: 'Time once lost never returns.' },
  'school': { hi: 'विद्यालय / पाठशाला', en: 'School', type: 'Noun', exampleHi: 'हम रोज़ विद्यालय जाते हैं।', exampleEn: 'We go to school daily.' },
  'teacher': { hi: 'शिक्षक / अध्यापक', en: 'Teacher', type: 'Noun', exampleHi: 'शिक्षक हमें ज्ञान का प्रकाश देते हैं।', exampleEn: 'Teachers give us the light of knowledge.' }
};

export const DashboardVocabStudio: React.FC<DashboardVocabStudioProps> = ({ bilingualMode }) => {
  const [activeTab, setActiveTab] = useState<'meaning' | 'convert' | 'pronounce'>('meaning');

  // Tab 1: Hinglish Meaning State
  const [meaningInput, setMeaningInput] = useState<string>('mehnat');
  const [meaningResult, setMeaningResult] = useState<any>(HINGLISH_DICT['mehnat']);
  const [isLoadingMeaning, setIsLoadingMeaning] = useState<boolean>(false);
  const [isLoadingVisual, setIsLoadingVisual] = useState<boolean>(false);
  const [meaningError, setMeaningError] = useState<string | null>(null);
  const [useVisualFallback, setUseVisualFallback] = useState<boolean>(false);
  const meaningRequestSeqRef = useRef<number>(0);
  const meaningCacheRef = useRef<Map<string, any>>(new Map());

  // Tab 2: Word Convert State
  const [convertInput, setConvertInput] = useState<string>('courage');
  const [convertDirection, setConvertDirection] = useState<'en_to_hi' | 'hi_to_en'>('en_to_hi');
  const [isLoadingConvert, setIsLoadingConvert] = useState<boolean>(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [convertResult, setConvertResult] = useState<{
    inputText: string;
    translatedText: string;
    partOfSpeech: string;
    exampleSentence: string;
    transliteration?: string;
    alternatives?: string[];
  } | null>({
    inputText: 'courage',
    translatedText: 'साहस / हिम्मत',
    partOfSpeech: 'संज्ञा (Noun)',
    exampleSentence: 'उसने कठिन समय में कभी साहस नहीं छोड़ा। (He never lost courage in difficult times.)',
    transliteration: 'Saahas / Himmat',
    alternatives: ['साहस', 'हिम्मत', 'वीरता'],
  });

  // Tab 3: Pronounce State
  const [pronounceInput, setPronounceInput] = useState<string>('namaste');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoadingPronounce, setIsLoadingPronounce] = useState<boolean>(false);
  const [pronounceError, setPronounceError] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsAudioCacheRef = useRef<Map<string, string>>(new Map());
  const pronounceCacheRef = useRef<Map<string, any>>(new Map());
  const ttsServerCooldownUntilRef = useRef<number>(0);
  const [pronounceData, setPronounceData] = useState<{
    word: string;
    devanagari: string;
    phonetic: string;
    syllables: string;
    meaning: string;
    meaningHindi?: string;
    pronunciationTipHindi?: string;
  }>({
    word: 'namaste',
    devanagari: 'नमस्ते',
    phonetic: 'nuh-muh-STAY',
    syllables: 'न + म + स्ते',
    meaning: 'Greetings, respectful salutation',
    meaningHindi: 'आदरपूर्वक अभिवादन',
    pronunciationTipHindi: 'अंतिम "स्ते" में आधे "स" और "त" को मिलाकर स्पष्ट बोलें।',
  });

  const fetchVisualOnly = async (
    rawWord: string,
    hindiWord: string,
    englishMeaning: string,
    reqId: number
  ) => {
    setIsLoadingVisual(true);
    try {
      const res = await fetch('/api/ai/word-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawWord, hindiWord, englishMeaning }),
      });
      const visual = await res.json().catch(() => null);
      if (reqId !== meaningRequestSeqRef.current) return;
      if (res.ok && visual?.visualImageUrl) {
        setMeaningResult((prev: any) => {
          if (!prev) return prev;
          const updated = { ...prev, ...visual };
          meaningCacheRef.current.set(rawWord.toLowerCase(), updated);
          return updated;
        });
      }
    } catch {
      // Visual fallback remains clean
    } finally {
      if (reqId === meaningRequestSeqRef.current) {
        setIsLoadingVisual(false);
      }
    }
  };

  useEffect(() => {
    const seq = ++meaningRequestSeqRef.current;
    const def = HINGLISH_DICT['mehnat'];
    fetchVisualOnly('mehnat', def.hindiWord, def.englishMeaning, seq);
  }, []);

  // Handle Tab 1 Lookup (Instant Local + Live AI Backend + Word Image for ANY word)
  const handleLookupMeaning = async (term?: string) => {
    const raw = (term ?? meaningInput).trim();
    if (!raw) return;

    const reqId = ++meaningRequestSeqRef.current;
    setMeaningError(null);
    setUseVisualFallback(false);

    const cacheKey = raw.toLowerCase();
    const cachedFull = meaningCacheRef.current.get(cacheKey);
    if (cachedFull && cachedFull.visualImageUrl) {
      setMeaningResult(cachedFull);
      setIsLoadingMeaning(false);
      setIsLoadingVisual(false);
      return;
    }

    const localMatch = lookupWordLocal(raw);
    if (localMatch) {
      setMeaningResult(localMatch);
    } else {
      setMeaningResult(null);
    }

    setIsLoadingMeaning(true);
    setIsLoadingVisual(true);
    try {
      const res = await fetch('/api/ai/word-meaning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: raw }),
      });
      const data = await res.json().catch(() => null);
      if (reqId !== meaningRequestSeqRef.current) return;
      if (res.ok && data && data.hindiWord && data.hindiMeaning) {
        meaningCacheRef.current.set(cacheKey, data);
        setMeaningResult(data);
        setMeaningError(null);
        if (!data.visualImageUrl) {
          fetchVisualOnly(raw, data.hindiWord, data.englishMeaning, reqId);
        } else {
          setIsLoadingVisual(false);
        }
      } else if (localMatch) {
        fetchVisualOnly(raw, localMatch.hindiWord, localMatch.englishMeaning, reqId);
      } else {
        setMeaningError(data?.error || 'शब्दार्थ खोजने में समस्या आई। कृपया पुनः प्रयास करें।');
        setIsLoadingVisual(false);
      }
    } catch (err) {
      console.warn('Word meaning fetch error:', err);
      if (reqId !== meaningRequestSeqRef.current) return;
      if (localMatch) {
        fetchVisualOnly(raw, localMatch.hindiWord, localMatch.englishMeaning, reqId);
      } else {
        setMeaningError('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
        setIsLoadingVisual(false);
      }
    } finally {
      if (reqId === meaningRequestSeqRef.current) {
        setIsLoadingMeaning(false);
      }
    }
  };

  // Handle Tab 2 Convert (Instant Local + Live AI Backend)
  const handleConvert = async (inputVal?: string, directionOverride?: 'en_to_hi' | 'hi_to_en') => {
    const val = (inputVal ?? convertInput).trim();
    if (!val) return;
    const activeDirection = directionOverride ?? convertDirection;

    setConvertError(null);
    const lower = val.toLowerCase();
    const localConvertMatch = activeDirection === 'en_to_hi' ? BILINGUAL_CONVERSION_MAP[lower] : undefined;
    if (localConvertMatch) {
      setConvertResult({
        inputText: val,
        translatedText: localConvertMatch.hi,
        partOfSpeech: localConvertMatch.type,
        exampleSentence: `${localConvertMatch.exampleHi} (${localConvertMatch.exampleEn})`,
        transliteration: localConvertMatch.hi,
        alternatives: localConvertMatch.hi.split(' / '),
      });
    } else {
      setConvertResult(null);
    }

    setIsLoadingConvert(true);
    try {
      const res = await fetch('/api/ai/word-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: val, direction: activeDirection }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.translatedText) {
        setConvertResult({
          inputText: val,
          translatedText: data.translatedText,
          partOfSpeech: data.partOfSpeech || 'Word',
          exampleSentence: data.exampleSentenceHindi
            ? `${data.exampleSentenceHindi}${data.exampleSentenceEnglish ? ` (${data.exampleSentenceEnglish})` : ''}`
            : `उदाहरण: ${data.translatedText}`,
          transliteration: data.transliteration || data.translatedText,
          alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
        });
        setConvertError(null);
      } else if (!localConvertMatch) {
        setConvertError(data?.error || 'अनुवाद करने में समस्या आई। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.warn('Translate fetch error:', err);
      if (!localConvertMatch) {
        setConvertError('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
      }
    } finally {
      setIsLoadingConvert(false);
    }
  };

  const speakWithBrowserFallback = (textToSpeak: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = speechRate;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.lang.includes('IN'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  // Handle Tab 3 Pronounce Audio (supports any Hinglish, Devanagari Hindi, or English word via AI + TTS)
  const handlePronounce = async (term?: string) => {
    const raw = (term ?? pronounceInput).trim();
    if (!raw) return;

    setPronounceError(null);
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const entry = lookupWordLocal(raw) || HINGLISH_DICT[raw.toLowerCase()];
    let devanagariWord = entry ? entry.hindiWord : raw;
    let phoneticGuide = entry ? entry.phonetic : raw.toUpperCase();
    let syllablesBreakup = entry ? entry.syllables : raw;
    let wordMeaning = entry ? entry.englishMeaning : '';
    let wordMeaningHindi = entry ? entry.hindiMeaning : '';
    let tipHindi = 'हिंदी एक ध्वन्यात्मक भाषा है—जैसा लिखा जाता है, वैसा ही स्पष्ट उच्चारित होता है।';

    if (entry) {
      setPronounceData({
        word: raw,
        devanagari: devanagariWord,
        phonetic: phoneticGuide,
        syllables: syllablesBreakup,
        meaning: wordMeaning,
        meaningHindi: wordMeaningHindi,
        pronunciationTipHindi: tipHindi,
      });
    } else {
      const cachedPronounce = pronounceCacheRef.current.get(raw.toLowerCase());
      if (cachedPronounce) {
        devanagariWord = cachedPronounce.hindiText || devanagariWord;
        phoneticGuide = cachedPronounce.phonetic || phoneticGuide;
        syllablesBreakup = cachedPronounce.syllables || devanagariWord;
        wordMeaning = cachedPronounce.meaningEnglish || '';
        wordMeaningHindi = cachedPronounce.meaningHindi || '';
        tipHindi = cachedPronounce.pronunciationTipHindi || tipHindi;
      } else {
        setIsLoadingPronounce(true);
        const controller = new AbortController();
        const timerId = window.setTimeout(() => controller.abort(), 18000);
        try {
          const res = await fetch('/api/ai/speech-pronounce', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: raw }),
            signal: controller.signal,
          });
          const data = await res.json().catch(() => null);
          if (res.ok && data?.hindiText) {
            pronounceCacheRef.current.set(raw.toLowerCase(), data);
            devanagariWord = data.hindiText;
            phoneticGuide = data.phonetic || phoneticGuide;
            syllablesBreakup = data.syllables || devanagariWord;
            wordMeaning = data.meaningEnglish || '';
            wordMeaningHindi = data.meaningHindi || '';
            tipHindi = data.pronunciationTipHindi || tipHindi;
          } else {
            setPronounceError(data?.error || 'उच्चारण विश्लेषण प्राप्त नहीं हो सका।');
          }
        } catch (e) {
          console.warn('Pronounce lookup fallback:', e);
          setPronounceError('सर्वर से संपर्क करने में समय अधिक लगा। कृपया पुनः प्रयास करें।');
        } finally {
          window.clearTimeout(timerId);
          setIsLoadingPronounce(false);
        }
      }

      setPronounceData({
        word: raw,
        devanagari: devanagariWord,
        phonetic: phoneticGuide,
        syllables: syllablesBreakup,
        meaning: wordMeaning || 'Hindi pronunciation analysis',
        meaningHindi: wordMeaningHindi,
        pronunciationTipHindi: tipHindi,
      });
    }

    const playWavBase64 = async (base64Str: string) => {
      const binaryStr = atob(base64Str);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = speechRate;
      activeAudioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        speakWithBrowserFallback(devanagariWord);
      };
      await audio.play();
    };

    const ttsCacheKey = devanagariWord.toLowerCase();
    const cachedTtsAudio = ttsAudioCacheRef.current.get(ttsCacheKey);
    if (cachedTtsAudio) {
      setIsSpeaking(true);
      try {
        await playWavBase64(cachedTtsAudio);
        return;
      } catch (_err) {
        // Fall through to browser speech if autoplay blocked
      }
    }

    if (Date.now() < ttsServerCooldownUntilRef.current) {
      setIsSpeaking(true);
      speakWithBrowserFallback(devanagariWord);
      return;
    }

    // Play genuine server-generated WAV TTS audio first, with browser speechSynthesis fallback
    setIsSpeaking(true);
    const ttsController = new AbortController();
    const ttsTimerId = window.setTimeout(() => ttsController.abort(), 16000);
    try {
      const ttsRes = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: devanagariWord }),
        signal: ttsController.signal,
      });
      const ttsData = await ttsRes.json().catch(() => null);
      if (ttsRes.ok && ttsData?.audioBase64) {
        ttsAudioCacheRef.current.set(ttsCacheKey, ttsData.audioBase64);
        await playWavBase64(ttsData.audioBase64);
        return;
      }
      if (ttsData?.useBrowserSpeech && typeof ttsData?.retryAfterSeconds === 'number') {
        ttsServerCooldownUntilRef.current =
          Date.now() + Math.min(ttsData.retryAfterSeconds, 300) * 1000;
      }
    } catch (ttsErr) {
      console.warn('Server TTS fallback to browser speech:', ttsErr);
    } finally {
      window.clearTimeout(ttsTimerId);
    }
    speakWithBrowserFallback(devanagariWord);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI भाषा एवं शब्द स्टूडियो (Language & Vocab Studio)</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            शब्दार्थ, अनुवाद एवं शुद्ध उच्चारण (Vocab, Translation & Speech)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            हिंग्लिश या देवनागरी में कोई भी शब्द लिखें, दोनों भाषाओं (हिंदी व अंग्रेजी) में सटीक अर्थ जानें, अनुवाद करें और शुद्ध उच्चारण सुनें।
          </p>
        </div>

        {/* Studio Tab Pills */}
        <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('meaning')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'meaning'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>१. शब्दार्थ खोजें</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('convert')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'convert'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>२. अंग्रेजी ⇄ हिंदी</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pronounce')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pronounce'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>३. शुद्ध उच्चारण</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: HINGLISH & HINDI WORD MEANING ================= */}
      {activeTab === 'meaning' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-indigo-50/70 border border-indigo-200 p-3.5 rounded-2xl text-xs text-indigo-950 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>सर्वसमावेशी शब्दार्थ खोजें: </strong>
              हिंग्लिश (जैसे: <em>'mehnat'</em>, <em>'sahasi'</em>, <em>'chatur'</em>) अथवा देवनागरी (जैसे: <em>'साहस'</em>, <em>'विद्यार्थी'</em>, <em>'अद्भुत'</em>) में कोई भी शब्द लिखें। AI तुरंत <strong>हिंदी व अंग्रेजी दोनों</strong> में प्रामाणिक शब्दकोश अर्थ व वाक्य प्रयोग बताएगा!
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">लोकप्रिय शब्द (20):</span>
            {[
              'mehnat', 'kitab', 'suraj', 'pani', 'कमल',
              'khushi', 'शांति', 'साहस', 'vidyalaya', 'जंगल',
              'घर', 'prakriti', 'chatur', 'ज्ञान', 'अहिंसा',
              'safalta', 'अनुशासन', 'utsah', 'satya', 'तितली'
            ].map(
              (w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setMeaningInput(w);
                    handleLookupMeaning(w);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
                    meaningInput === w
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {w}
                </button>
              )
            )}
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={meaningInput}
                onChange={(e) => setMeaningInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookupMeaning()}
                placeholder="हिंग्लिश या हिंदी शब्द लिखें (e.g. mehnat, sahas, adbhut, vidyarthi, prakriti, sundar)..."
                className="w-full text-sm p-3 pl-10 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-sans text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="button"
              disabled={isLoadingMeaning}
              onClick={() => handleLookupMeaning()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-70"
            >
              {isLoadingMeaning ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>AI खोज रहा है...</span>
                </>
              ) : (
                <>
                  <span>सटीक अर्थ खोजें</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </>
              )}
            </button>
          </div>

          {/* Meaning Error Banner */}
          {meaningError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{meaningError}</span>
            </div>
          )}

          {/* Meaning Result Card */}
          {meaningResult && (
            <div className="bg-slate-50/80 border-2 border-indigo-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h4 className="text-3xl font-black font-hindi text-indigo-700">
                    {meaningResult.hindiWord}
                  </h4>
                  <span className="text-xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    खोज पद: "{meaningInput}"
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                    {meaningResult.partOfSpeech}
                  </span>
                  {isLoadingMeaning && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3 text-indigo-600" /> AI शब्दकोश विश्लेषण जारी है...
                    </span>
                  )}
                </div>
              </div>

              {/* Both Hindi & English Meanings Side-by-Side */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    हिंदी में सरल अर्थ (Hindi Meaning):
                  </span>
                  <p className="text-base font-bold text-slate-900 font-hindi">
                    {meaningResult.hindiMeaning}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-violet-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
                    अंग्रेजी में अर्थ (English Meaning):
                  </span>
                  <p className="text-base font-bold text-slate-900 font-sans">
                    {meaningResult.englishMeaning}
                  </p>
                </div>
              </div>

              {/* Example sentences */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  वाक्य में प्रयोग (Usage in Sentence):
                </span>
                <p className="text-slate-900 font-hindi text-sm">
                  <strong>हिंदी:</strong> {meaningResult.exampleHindi}
                </p>
                {bilingualMode && (
                  <p className="text-slate-600 italic">
                    <strong>English:</strong> {meaningResult.exampleEnglish}
                  </p>
                )}
              </div>

              {/* Synonyms */}
              {meaningResult.synonymsHindi && meaningResult.synonymsHindi.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-500">पर्यायवाची (Synonyms):</span>
                  {meaningResult.synonymsHindi.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-white text-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 font-hindi font-medium shadow-2xs"
                    >
                      {s}
                    </span>
                  ))}
                  {bilingualMode && meaningResult.synonymsEnglish && (
                    <span className="text-slate-400 text-[11px]">
                      ({Array.isArray(meaningResult.synonymsEnglish) ? meaningResult.synonymsEnglish.join(', ') : meaningResult.synonymsEnglish})
                    </span>
                  )}
                </div>
              )}

              {/* Below Word Meaning: Visual Image Section (Direct Object Photo or Emotion/Concept Illustration) */}
              <div className="bg-white rounded-2xl border border-indigo-100 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {meaningResult.visualSourceType === 'direct_photo' ? (
                      <Camera className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                    )}
                    <span className="text-xs font-extrabold text-slate-800">
                      शब्द का दृश्य चित्र (Visual Meaning)
                    </span>
                  </div>

                  {meaningResult.visualImageUrl && (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        meaningResult.visualSourceType === 'direct_photo'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-violet-50 text-violet-800 border-violet-200'
                      }`}
                    >
                      {meaningResult.visualSourceType === 'direct_photo'
                        ? '📸 प्रत्यक्ष वस्तु चित्र (Direct Image)'
                        : '🎨 भाव एवं संकल्पना चित्रण (Concept Visual)'}
                    </span>
                  )}
                </div>

                {isLoadingVisual && !meaningResult.visualImageUrl ? (
                  <div className="w-full h-56 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-2 animate-pulse">
                    <ImageIcon className="w-8 h-8 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-500">
                      "{meaningResult.hindiWord}" का सटीक चित्र तैयार किया जा रहा है...
                    </span>
                  </div>
                ) : meaningResult.visualImageUrl ? (
                  <div className="grid sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-7 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center max-h-72">
                      <img
                        src={
                          useVisualFallback && meaningResult.visualFallbackUrl
                            ? meaningResult.visualFallbackUrl
                            : meaningResult.visualImageUrl
                        }
                        alt={`${meaningResult.hindiWord} - ${meaningResult.englishMeaning}`}
                        referrerPolicy="no-referrer"
                        onError={() => {
                          if (!useVisualFallback && meaningResult.visualFallbackUrl) {
                            setUseVisualFallback(true);
                          }
                        }}
                        className="w-full max-h-72 object-contain sm:object-cover transition-transform duration-300 hover:scale-[1.02]"
                      />
                    </div>
                    <div className="sm:col-span-5 space-y-2 text-xs">
                      <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                        {meaningResult.visualCategory === 'object'
                          ? 'प्रत्यक्ष वस्तु (Concrete Object)'
                          : meaningResult.visualCategory === 'emotion'
                          ? 'भाववाचक संज्ञा / भावना (Emotion)'
                          : 'संकल्पना एवं क्रिया (Concept)'}
                      </div>
                      <p className="text-sm font-bold text-slate-900 font-hindi leading-relaxed">
                        {meaningResult.visualCaptionHindi || `"${meaningResult.hindiWord}" का दृश्य रूप`}
                      </p>
                      {bilingualMode && meaningResult.visualCaptionEnglish && (
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          {meaningResult.visualCaptionEnglish}
                        </p>
                      )}
                      <div className="pt-1 text-[11px] text-slate-500 font-hindi">
                        अर्थ को चित्र से जोड़कर याद रखने पर शब्दावली लंबे समय तक स्मरण रहती है।
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ENGLISH ⇄ HINDI CONVERTER ================= */}
      {activeTab === 'convert' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-violet-50/70 border border-violet-200 p-3.5 rounded-2xl text-xs text-violet-950 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>अंग्रेजी ⇄ हिंदी शब्द परिवर्तक: </strong>
              अंग्रेजी शब्द लिखें और हिंदी में रूपांतरण पाएँ, अथवा हिंदी लिखकर उसका सटीक अंग्रेजी शब्द प्राप्त करें।
            </span>

            {/* Toggle Direction */}
            <button
              type="button"
              onClick={() => {
                const next = convertDirection === 'en_to_hi' ? 'hi_to_en' : 'en_to_hi';
                const sample = next === 'en_to_hi' ? 'courage' : 'साहस';
                setConvertDirection(next);
                setConvertInput(sample);
                handleConvert(sample, next);
              }}
              className="px-3 py-1 bg-white hover:bg-violet-50 text-violet-700 font-bold rounded-xl border border-violet-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>
                {convertDirection === 'en_to_hi' ? 'English ➔ हिंदी' : 'हिंदी ➔ English'}
              </span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">त्वरित शब्द:</span>
            {(convertDirection === 'en_to_hi'
              ? ['courage', 'friendship', 'knowledge', 'nature', 'success', 'patience', 'honesty', 'peace', 'water', 'school']
              : ['साहस', 'मित्रता', 'ज्ञान', 'प्रकृति', 'सफलता', 'ईमानदारी', 'शांति', 'विद्यालय', 'परिश्रम', 'सपना']
            ).map(
              (w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setConvertInput(w);
                    handleConvert(w);
                  }}
                  className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  {w}
                </button>
              )
            )}
          </div>

          {/* Input & Convert Action */}
          <div className="flex gap-2">
            <input
              type="text"
              value={convertInput}
              onChange={(e) => setConvertInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
              placeholder={
                convertDirection === 'en_to_hi'
                  ? 'Type an English word or phrase (e.g. courage, friendship, hard work)...'
                  : 'हिंदी शब्द लिखें (जैसे: साहस, मित्रता, परिश्रम)...'
              }
              className="flex-1 text-sm p-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-violet-600 bg-white font-semibold text-slate-900"
            />
            <button
              type="button"
              disabled={isLoadingConvert}
              onClick={() => handleConvert()}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-70"
            >
              {isLoadingConvert ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>अनुवाद हो रहा है...</span>
                </>
              ) : (
                <>
                  <span>परिवर्तित करें</span>
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Convert Error Banner */}
          {convertError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{convertError}</span>
            </div>
          )}

          {/* Result Card */}
          {convertResult && (
            <div className="bg-slate-50/80 border-2 border-violet-200/80 rounded-3xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500">
                  मूल शब्द/वाक्य: <strong className="text-slate-900">"{convertResult.inputText}"</strong>
                </span>
                {convertResult.partOfSpeech && (
                  <span className="text-[11px] font-bold bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-md border border-violet-200">
                    {convertResult.partOfSpeech}
                  </span>
                )}
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block mb-1">
                  रूपांतरित परिणाम (Translated Output):
                </span>
                <div className="text-2xl font-black font-hindi text-slate-900">
                  {convertResult.translatedText}
                </div>
                {convertResult.transliteration && (
                  <span className="text-xs text-slate-400 font-mono block mt-1">
                    उच्चारण (Roman): {convertResult.transliteration}
                  </span>
                )}
                {convertResult.alternatives && convertResult.alternatives.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400">विकल्प (Alternatives):</span>
                    {convertResult.alternatives.map((alt, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-800 border border-violet-200 font-medium"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {convertResult.exampleSentence && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block mb-0.5">उदाहरण वाक्य:</span>
                  <p>{convertResult.exampleSentence}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: HINGLISH TO HINDI AUDIO PRONUNCIATION ================= */}
      {activeTab === 'pronounce' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-950 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>हिंग्लिश उच्चारण (Audio Pronunciation): </strong>
              हिंग्लिश में कोई भी शब्द लिखें (जैसे: <em>'namaste'</em>, <em>'shukriya'</em>, <em>'shikshak'</em>, <em>'pariksha'</em>, <em>'pani'</em>). AI उसे शुद्ध देवनागरी में बदलकर <strong>हिंदी आवाज़ में बोलकर सुनाएगा</strong>!
            </span>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-300 text-[11px] font-bold">
              <span className="text-slate-500 px-1">गति:</span>
              <button
                type="button"
                onClick={() => setSpeechRate(0.75)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  speechRate === 0.75 ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                0.75x (धीमी)
              </button>
              <button
                type="button"
                onClick={() => setSpeechRate(1.0)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  speechRate === 1.0 ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1.0x (सामान्य)
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">सुझाव:</span>
            {['namaste', 'shukriya', 'dhanyawad', 'pariksha', 'shikshak', 'mehnat', 'jungle', 'pani', 'shanti', 'himmat'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => {
                  setPronounceInput(w);
                  handlePronounce(w);
                }}
                className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                {w}
              </button>
            ))}
          </div>

          {/* Input & Pronounce Action */}
          <div className="flex gap-2">
            <input
              type="text"
              value={pronounceInput}
              onChange={(e) => setPronounceInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePronounce()}
              placeholder="हिंग्लिश शब्द लिखें (e.g. namaste, shukriya, pariksha, pani)..."
              className="flex-1 text-sm p-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white font-mono text-slate-900"
            />
            <button
              type="button"
              disabled={isLoadingPronounce}
              onClick={() => handlePronounce()}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-70"
            >
              {isLoadingPronounce ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-slate-900" />
                  <span>खोज रहा है...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-slate-900" />
                  <span>उच्चारण सुनें (Speak)</span>
                </>
              )}
            </button>
          </div>

          {/* Pronounce Error Banner */}
          {pronounceError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{pronounceError}</span>
            </div>
          )}

          {/* Pronunciation Audio Card */}
          {pronounceData && (
            <div className="bg-slate-50/80 border-2 border-amber-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono">
                    इनपुट: "{pronounceData.word}"
                  </span>
                  <h4 className="text-3xl font-black font-hindi text-slate-900">
                    {pronounceData.devanagari}
                  </h4>
                  {pronounceData.meaningHindi && (
                    <p className="text-xs font-bold text-indigo-700 font-hindi">
                      अर्थ: {pronounceData.meaningHindi}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 font-sans italic">
                    {pronounceData.meaning}
                  </p>
                </div>

                {/* Big Speaker Button */}
                <button
                  type="button"
                  onClick={() => handlePronounce(pronounceData.word)}
                  className={`px-5 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Volume2 className="w-5 h-5 text-amber-300" />
                  <span>{isSpeaking ? 'उच्चारण हो रहा है...' : 'दोबारा सुनें (Play Audio)'}</span>
                </button>
              </div>

              {/* Phonetics & Syllables Breakdown */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ध्वनि गाइड (Phonetic Guide):
                  </span>
                  <div className="text-base font-black font-mono text-indigo-600">
                    {pronounceData.phonetic}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    मात्रा व अक्षर विग्रह (Syllables):
                  </span>
                  <div className="text-base font-black font-hindi text-slate-800">
                    {pronounceData.syllables}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                💡 <strong>उच्चारण टिप:</strong> {pronounceData.pronunciationTipHindi || 'हिंदी एक ध्वन्यात्मक (phonetic) भाषा है—जैसा लिखा जाता है, वैसा ही उच्चारित होता है। स्वर और मात्राओं पर ध्यान दें।'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
