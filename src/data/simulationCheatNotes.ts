import { GrammarModule } from '../types';

export interface MuhavaraReasoningDetail {
  literalBreakdownHindi: string;
  logicalBridgeHindi: string;
  logicalBridgeEnglish: string;
  memoryCueHindi: string;
  fitContextHindi: string;
  unfitContextHindi: string;
}

export const MUHAVARA_REASONING_MAP: Record<string, MuhavaraReasoningDetail> = {
  mh_1: {
    literalBreakdownHindi: '9 + 2 = 11 — अर्थात् दो पैरों पर तेज़ी से ग्यारह (11) जैसी दो समानांतर रेखाएँ बनाकर भागना।',
    logicalBridgeHindi: 'जब कोई व्यक्ति अचानक पूरी रफ़्तार से भागता है, तो उसके दोनों पैर ‘11’ की दो सीधी लकीरों की तरह दिखते हैं और वह पल भर में आँखों से ओझल हो जाता है।',
    logicalBridgeEnglish: 'Adding 9 + 2 makes 11 — symbolizing two fast-running legs dashing away in a flash.',
    memoryCueHindi: '11 = दो तेज़ दौड़ते पैर → पलक झपकते भाग जाना',
    fitContextHindi: 'खतरा, पुलिस या पकड़े जाने के डर से चुपचाप और तुरंत भाग जाने के प्रसंग में।',
    unfitContextHindi: 'गणित के सवाल जोड़ने या साधारण टहलने के लिए इसका प्रयोग नहीं होता।',
  },
  mh_2: {
    literalBreakdownHindi: 'इतना विशाल आकाश सिर पर उठाने की कल्पना — मानो धरती-आकाश एक हो जाएँ।',
    logicalBridgeHindi: 'जब कहीं अत्यधिक कोलाहल, ज़िद या हंगामा होता है, तो चारों ओर ऐसा शोर गूँजता है मानो ऊपर का आसमान हिलकर सिर पर आ गिरा हो।',
    logicalBridgeEnglish: 'An impossible image of lifting the whole sky conveys overwhelming chaos and uproar.',
    memoryCueHindi: 'आसमान हिला देने वाला शोर → अत्यधिक उपद्रव व हल्ला',
    fitContextHindi: 'कक्षा में शोरगुल, किसी बात पर भारी हंगामा या अत्यधिक ज़िद करने के प्रसंग में।',
    unfitContextHindi: 'शांत परिश्रम या भारी सामान उठाने के वास्तविक अर्थ में नहीं।',
  },
  mh_3: {
    literalBreakdownHindi: 'आँख की पुतली (तारा) शरीर का सबसे संवेदनशील और अनमोल हिस्सा है जिसके बिना दृष्टि असंभव है।',
    logicalBridgeHindi: 'जैसे हर व्यक्ति अपनी आँख के तारे (पुतली) की रक्षा सबसे अधिक प्रेम और सावधानी से करता है, वैसे ही जो व्यक्ति सबसे प्रिय हो वह ‘आँखों का तारा’ कहलाता है।',
    logicalBridgeEnglish: 'The pupil of the eye is priceless and guarded above all; thus someone cherished most becomes the star of one’s eyes.',
    memoryCueHindi: 'आँख की पुतली = सबसे अनमोल → अत्यंत प्यारा व दुलारा',
    fitContextHindi: 'माता-पिता की प्रिय संतान या किसी अत्यंत स्नेहपात्र व्यक्ति के लिए।',
    unfitContextHindi: 'रात के आकाश के तारों को देखने के शाब्दिक अर्थ में नहीं।',
  },
  mh_4: {
    literalBreakdownHindi: 'ऊँट बहुत विशाल और ज़्यादा खाने वाला प्राणी है, जबकि जीरे का एक दाना सूक्ष्म (अति छोटा) होता है।',
    logicalBridgeHindi: 'यदि विशाल भूख वाले ऊँट के मुँह में एक नन्हा जीरा डाला जाए तो वह उसकी ज़रूरत के आगे नगण्य है — यही विषम अनुपात ‘अधिक आवश्यकता, अत्यंत कम पूर्ति’ का तर्क देता है।',
    logicalBridgeEnglish: 'Contrasting a giant camel’s appetite with a single tiny cumin seed logically shows an extreme shortfall.',
    memoryCueHindi: 'बड़ा ऊँट (बड़ी ज़रूरत) + नन्हा जीरा (बहुत कम पूर्ति)',
    fitContextHindi: 'जब ज़रूरत बहुत बड़ी हो और मिलने वाला संसाधन या भोजन अत्यंत कम हो।',
    unfitContextHindi: 'पर्याप्त या भरपूर चीज़ मिलने पर इसका प्रयोग गलत होगा।',
  },
  mh_5: {
    literalBreakdownHindi: 'अचानक चौंकने या अविश्वसनीय दृश्य देखने पर मनुष्य का हाथ अनजाने में मुँह/दाँतों तक चला जाता है।',
    logicalBridgeHindi: 'यह एक स्वाभाविक मानवीय शारीरिक प्रतिक्रिया (body language) है — जब दिमाग़ किसी अद्भुत घटना को समझ नहीं पाता तो व्यक्ति स्तब्ध होकर दाँतों तले उँगली दबा लेता है।',
    logicalBridgeEnglish: 'Biting one’s finger is an instinctive human gesture of stunned amazement when witnessing the extraordinary.',
    memoryCueHindi: 'अचरज की स्वाभाविक मुद्रा → दंग या आश्चर्यचकित रह जाना',
    fitContextHindi: 'किसी अद्भुत कला, साहस, जादू या अप्रत्याशित सफलता को देखकर।',
    unfitContextHindi: 'गुस्से या भूख को व्यक्त करने के लिए नहीं।',
  },
  mh_6: {
    literalBreakdownHindi: 'गागर (छोटा घड़ा) सीमित स्थान है और सागर (समुद्र) अनंत विस्तार है।',
    logicalBridgeHindi: 'जैसे छोटे से घड़े में विशाल समुद्र को समेटना चमत्कार है, वैसे ही कम शब्दों (जैसे दोहे या सूत्र) में गहन जीवन-दर्शन भर देना ‘गागर में सागर भरना’ कहलाता है।',
    logicalBridgeEnglish: 'Fitting a vast ocean inside a small pitcher logically mirrors packing vast wisdom into very few words.',
    memoryCueHindi: 'छोटी गागर (कम शब्द) + विशाल सागर (गहरा अर्थ)',
    fitContextHindi: 'संक्षिप्त किंतु अत्यंत प्रभावशाली कविता, भाषण या उत्तर की प्रशंसा में।',
    unfitContextHindi: 'लंबा-चौड़ा और उबाऊ निबंध लिखने के प्रसंग में नहीं।',
  },
  mh_7: {
    literalBreakdownHindi: 'पुराने समय में किसी माँग या अपेक्षा पर सामने से अंगूठा हिलाकर ठेंगा (अस्वीकृति) दिखाया जाता था।',
    logicalBridgeHindi: 'यह सीधे तौर पर भरोसा तोड़कर ऐन समय पर हाथ खड़े कर देने का इशारा है — यानी जब मदद की सबसे ज़्यादा ज़रूरत हो तब साफ़ मना कर देना।',
    logicalBridgeEnglish: 'Holding up a thumb in dismissal was a traditional refusal gesture, signaling a blunt ‘no’ at the crucial hour.',
    memoryCueHindi: 'ऐन वक्त पर ठेंगा दिखाना → साफ़ इनकार कर देना',
    fitContextHindi: 'वादा करके या ज़रूरत के समय मदद से मुकर जाने पर।',
    unfitContextHindi: 'किसी को शुभकामना या प्रशंसा (thumbs-up) देने के अंग्रेज़ी अर्थ में भ्रमित न हों।',
  },
  mh_8: {
    literalBreakdownHindi: 'ईद का चाँद पूरे महीने की प्रतीक्षा के बाद एक विशेष रात को थोड़े समय के लिए दिखाई देता है।',
    logicalBridgeHindi: 'जैसे लोग ईद के चाँद के दर्शन के लिए तरसते हैं और वह बहुत दुर्लभ होता है, वैसे ही जो मित्र या परिचित बहुत लंबे समय बाद मिले उसे ‘ईद का चाँद’ कहा जाता है।',
    logicalBridgeEnglish: 'The Eid crescent appears rarely after eager waiting, naturally representing someone seen after a very long gap.',
    memoryCueHindi: 'लंबी प्रतीक्षा के बाद दर्शन → बहुत दिनों बाद दिखना',
    fitContextHindi: 'किसी पुराने मित्र या रिश्तेदार से बहुत दिनों बाद स्नेहपूर्वक मिलने पर।',
    unfitContextHindi: 'रोज़ मिलने वाले सहपाठी के लिए इसका प्रयोग नहीं होगा।',
  },
  mh_9: {
    literalBreakdownHindi: 'नेत्रहीन व्यक्ति के लिए उसकी लाठी ही आँख, दिशा और संतुलन का एकमात्र आधार होती है।',
    logicalBridgeHindi: 'यदि लाठी न हो तो उसका चलना कठिन हो जाए — इसी जीवन-निर्भरता के कारण किसी असहाय व्यक्ति के एकमात्र सहारे को ‘अंधे की लाठी’ कहते हैं।',
    logicalBridgeEnglish: 'A blind person depends entirely on their stick to walk; thus a helpless person’s sole pillar of support is called this.',
    memoryCueHindi: 'लाठी = एकमात्र आधार → असहाय का इकलौता सहारा',
    fitContextHindi: 'वृद्ध माता-पिता की सेवा करने वाली एकमात्र संतान या सहारे के प्रसंग में।',
    unfitContextHindi: 'किसी ऐसे व्यक्ति के लिए जिसके पास अनेक सहायक हों।',
  },
  mh_10: {
    literalBreakdownHindi: 'चने दाँतों से चबाए जाते हैं, नाक से चबाना असंभव और अत्यंत कष्टदायक है।',
    logicalBridgeHindi: 'किसी को इतना विवश और तंग कर देना कि उसे सामान्य काम भी नाक से चने चबाने जैसा कठिन लगने लगे — यही इस मुहावरे का तार्किक आधार है।',
    logicalBridgeEnglish: 'Being forced to chew hard chickpeas through one’s nose captures extreme torment and helplessness.',
    memoryCueHindi: 'असंभव कष्ट देना → बहुत अधिक तंग या परेशान करना',
    fitContextHindi: 'शत्रु को युद्ध या प्रतियोगिता में बुरी तरह छका देने के प्रसंग में।',
    unfitContextHindi: 'स्वयं कठिन काम करने के लिए ‘लोहे के चने चबाना’ आता है, ‘नाकों चने चबवाना’ दूसरे को तंग करने के लिए।',
  },
  mh_11: {
    literalBreakdownHindi: 'प्राचीन योद्धा या यात्री युद्ध/परिश्रम से पहले कमर पर पटका कसकर बाँधते थे ताकि कपड़ा ढीला न रहे।',
    logicalBridgeHindi: 'शारीरिक रूप से कमर कसने का सीधा अर्थ था कि व्यक्ति अब आराम छोड़कर कठिन संघर्ष या लक्ष्य के लिए पूरी तरह तैयार है।',
    logicalBridgeEnglish: 'Warriors tightened their waistbands before battle to move swiftly — logically symbolizing full readiness and resolve.',
    memoryCueHindi: 'योद्धा की तैयारी → दृढ़ निश्चय के साथ तैयार होना',
    fitContextHindi: 'परीक्षा, प्रतियोगिता या बड़े लक्ष्य की तैयारी शुरू करते समय।',
    unfitContextHindi: 'आलस्य करने या काम टालने के संदर्भ में नहीं।',
  },
  mh_12: {
    literalBreakdownHindi: 'कान में लगातार धीमे-धीमे बातें डालते रहना जब तक मन उन बातों से भर न जाए।',
    logicalBridgeHindi: 'जब कोई बार-बार किसी की बुराई या झूठी शिकायत दूसरे के कान में डालता है, तो सुनने वाले का मन संदेह और क्रोध से भर जाता है — यही चुगली की प्रक्रिया है।',
    logicalBridgeEnglish: 'Continuously pouring whispered accusations into someone’s ear poisons their judgment against another person.',
    memoryCueHindi: 'कान में संदेह भरना → चुगली या भड़काने वाली शिकायत करना',
    fitContextHindi: 'किसी के विरुद्ध चुपके से भड़काने या झूठी शिकायत करने के प्रसंग में।',
    unfitContextHindi: 'अच्छी शिक्षा या सच्ची सलाह देने के लिए इसका प्रयोग नहीं होता।',
  },
  mh_13: {
    literalBreakdownHindi: 'सामान्य दिनों में तेल का दीपक जलता है; शुद्ध घी का दीपक केवल महाउत्सव या दिवाली जैसे शुभ अवसर पर जलता है।',
    logicalBridgeHindi: 'श्रीराम के अयोध्या लौटने पर घी के दीये जलाने की परंपरा से जुड़ा यह भाव असाधारण प्रसन्नता और भव्य उत्सव का प्रतीक बन गया।',
    logicalBridgeEnglish: 'Ghee lamps were reserved for the grandest celebrations, naturally symbolizing boundless joy and triumph.',
    memoryCueHindi: 'महाउत्सव के दीपक → अत्यधिक खुशियाँ मनाना',
    fitContextHindi: 'बड़ी जीत, सफलता या शुभ समाचार पर हर्षोल्लास मनाने के लिए।',
    unfitContextHindi: 'सामान्य संध्या-प्रकाश या दुःख के समय नहीं।',
  },
  mh_14: {
    literalBreakdownHindi: 'भुने चने कठोर होते हैं, परंतु लोहे के बने चने दाँतों से तोड़ना लगभग असंभव श्रम माँगता है।',
    logicalBridgeHindi: 'जब कोई कार्य इतना जटिल और चुनौतीपूर्ण हो कि उसे पूरा करने में असाधारण धैर्य और शक्ति लगे, तब उसकी तुलना ‘लोहे के चने चबाने’ से की जाती है।',
    logicalBridgeEnglish: 'Chewing iron-hard chickpeas illustrates tackling a task requiring extraordinary grit and effort.',
    memoryCueHindi: 'लोहा चबाना = असाधारण कठिनाई → अत्यंत कठिन कार्य करना',
    fitContextHindi: 'स्वयं किसी अत्यंत दुष्कर लक्ष्य को साधने के प्रसंग में।',
    unfitContextHindi: 'आसान रोज़मर्रा के कामों के लिए नहीं।',
  },
  mh_15: {
    literalBreakdownHindi: 'खाली पेट में भूख के कारण गुड़गुड़ाहट और बेचैनी की हलचल महसूस होती है।',
    logicalBridgeHindi: 'तेज़ भूख लगने पर पेट के भीतर जो उथल-पुथल और आवाज़ होती है, उसकी सजीव और विनोदपूर्ण कल्पना ‘चूहों के कूदने’ से की गई है।',
    logicalBridgeEnglish: 'The rumbling and restless churning of an empty stomach feels humorously like tiny mice leaping inside.',
    memoryCueHindi: 'खाली पेट की गुड़गुड़ाहट → बहुत तेज़ भूख लगना',
    fitContextHindi: 'काफ़ी देर से कुछ न खाने के बाद तीव्र भूख व्यक्त करने के लिए।',
    unfitContextHindi: 'पेट दर्द की बीमारी या डर के लिए नहीं।',
  },
  mh_16: {
    literalBreakdownHindi: 'एक ही चाँद रात को सुंदर बना देता है; यदि चार चाँद एक साथ चमकें तो सौंदर्य कई गुना बढ़ जाएगा।',
    logicalBridgeHindi: 'सौंदर्य के प्रतीक ‘चाँद’ को चार गुना करने की कल्पना का तर्क है — किसी पहले से अच्छी चीज़ की शोभा या गौरव को और अधिक निखार देना।',
    logicalBridgeEnglish: 'One moon already beautifies the sky; adding four moons multiplies grace, prestige, and splendor.',
    memoryCueHindi: '1 चाँद से 4 चाँद → शोभा और प्रतिष्ठा कई गुना बढ़ाना',
    fitContextHindi: 'किसी प्रतिभा, अतिथि या सजावट से कार्यक्रम की सुंदरता बढ़ जाने पर।',
    unfitContextHindi: 'किसी बिगड़े काम को और खराब करने के अर्थ में नहीं।',
  },
  mh_17: {
    literalBreakdownHindi: 'ठोस वस्तु का पिघलकर पानी बन जाना — अर्थात् आत्मविश्वास का गल जाना और पसीने से तर हो जाना।',
    logicalBridgeHindi: 'जब किसी की गलती या झूठ सबके सामने पकड़ा जाता है, तो शर्म के मारे चेहरा झुक जाता है और पसीना छूटने लगता है — मानो व्यक्ति संकोच से गलकर पानी बन गया हो।',
    logicalBridgeEnglish: 'Sweating and melting away in embarrassment when caught red-handed explains feeling completely humbled by shame.',
    memoryCueHindi: 'शर्म से पसीने-पसीने होकर गल जाना → अत्यधिक लज्जित होना',
    fitContextHindi: 'पकड़े जाने या गलती उजागर होने पर गहरी लज्जा अनुभव करने में।',
    unfitContextHindi: 'बारिश में भीग जाने के वास्तविक अर्थ में नहीं।',
  },
  mh_18: {
    literalBreakdownHindi: 'लोक-प्रयोग में ‘उल्लू’ को अपने मतलब के काम या सीधे लाभ के प्रतीक की तरह इस्तेमाल किया गया।',
    logicalBridgeHindi: 'जब कोई व्यक्ति दूसरों की कठिनाई या हानि की चिंता किए बिना केवल अपने काम को सीधा (सिद्ध) कर लेता है, तो वह ‘अपना उल्लू सीधा करना’ कहलाता है।',
    logicalBridgeEnglish: 'Focusing solely on steering one’s own interest straight regardless of others captures pure self-serving behavior.',
    memoryCueHindi: 'केवल अपना काम सीधा करना → स्वार्थ सिद्ध करना',
    fitContextHindi: 'मतलबी लोगों द्वारा मीठी बातें करके केवल अपना लाभ निकालने के प्रसंग में।',
    unfitContextHindi: 'परोपकार या निःस्वार्थ सहायता के लिए नहीं।',
  },
};

export interface KaalTenseFormSpec {
  id: string;
  mainTense: 'past' | 'present' | 'future';
  mainTenseHindi: string;
  subTypeHindi: string;
  subTypeEnglish: string;
  signalKeywords: string[];
  formulaHindi: string;
  reasoningHindi: string;
  reasoningEnglish: string;
  timelinePosition: number; // 0 to 100
  examples: Record<
    string,
    {
      subject: string;
      objectPart: string;
      rootPart: string;
      tenseEnding: string;
      fullSentence: string;
      english: string;
    }
  >;
}

export const KAAL_VERB_ROOTS = [
  { id: 'likh', labelHindi: 'लिख् (लिखना)', labelEnglish: 'Write' },
  { id: 'padh', labelHindi: 'पढ़् (पढ़ना)', labelEnglish: 'Read' },
  { id: 'gaa', labelHindi: 'गा (गाना)', labelEnglish: 'Sing' },
  { id: 'khel', labelHindi: 'खेल् (खेलना)', labelEnglish: 'Play' },
] as const;

export const KAAL_MECHANISM_SPECS: KaalTenseFormSpec[] = [
  {
    id: 'bhoot_samanya',
    mainTense: 'past',
    mainTenseHindi: 'भूतकाल (Past)',
    subTypeHindi: 'सामान्य भूतकाल',
    subTypeEnglish: 'Simple Past',
    signalKeywords: ['आ / ई / ए (क्रिया का अंत)', 'कल', 'बीते समय में', 'ने + भूतकालिक क्रिया'],
    formulaHindi: 'कर्ता (+ ने) + कर्म + [मूल धातु + आ/या/ई/ए]',
    reasoningHindi: 'कार्य बीते समय में सामान्य रूप से पूरा हो गया, परंतु यह निश्चित नहीं कि ठीक अभी हुआ या बहुत पहले। अंत में “है” या “था” नहीं लगता।',
    reasoningEnglish: 'Action finished in the past without specifying whether it happened just now or long ago — no auxiliary है/था.',
    timelinePosition: 26,
    examples: {
      likh: { subject: 'अनीता ने', objectPart: 'पत्र', rootPart: 'लिख', tenseEnding: 'आ (लिखा)', fullSentence: 'अनीता ने पत्र लिखा।', english: 'Anita wrote a letter.' },
      padh: { subject: 'रोहन ने', objectPart: 'पाठ', rootPart: 'पढ़', tenseEnding: 'आ (पढ़ा)', fullSentence: 'रोहन ने पाठ पढ़ा।', english: 'Rohan read the lesson.' },
      gaa: { subject: 'गायक ने', objectPart: 'गीत', rootPart: 'गा', tenseEnding: 'या (गाया)', fullSentence: 'गायक ने गीत गाया।', english: 'The singer sang a song.' },
      khel: { subject: 'बच्चों ने', objectPart: 'मैच', rootPart: 'खेल', tenseEnding: 'आ (खेला)', fullSentence: 'बच्चों ने मैच खेला।', english: 'The children played a match.' },
    },
  },
  {
    id: 'bhoot_aasan',
    mainTense: 'past',
    mainTenseHindi: 'भूतकाल (Past)',
    subTypeHindi: 'आसन्न भूतकाल',
    subTypeEnglish: 'Immediate / Recent Past',
    signalKeywords: ['आ/ई/ए + है / हैं', 'अभी-अभी', 'तुरंत'],
    formulaHindi: 'सामान्य भूतकाल + [है / हैं]',
    reasoningHindi: '“आसन्न” का अर्थ है ‘निकट’। जब भूतकाल की क्रिया के साथ ‘है’ जुड़ता है, तो वह बताता है कि काम अभी-अभी (वर्तमान के बिल्कुल निकट) पूरा हुआ है।',
    reasoningEnglish: 'Aasan means “near”. Adding है to a completed past verb shows the action finished just moments ago.',
    timelinePosition: 40,
    examples: {
      likh: { subject: 'अनीता ने', objectPart: 'अभी पत्र', rootPart: 'लिख', tenseEnding: 'आ है (लिखा है)', fullSentence: 'अनीता ने अभी पत्र लिखा है।', english: 'Anita has just written a letter.' },
      padh: { subject: 'रोहन ने', objectPart: 'अभी पाठ', rootPart: 'पढ़', tenseEnding: 'आ है (पढ़ा है)', fullSentence: 'रोहन ने अभी पाठ पढ़ा है।', english: 'Rohan has just read the lesson.' },
      gaa: { subject: 'गायक ने', objectPart: 'अभी गीत', rootPart: 'गा', tenseEnding: 'या है (गाया है)', fullSentence: 'गायक ने अभी गीत गाया है।', english: 'The singer has just sung a song.' },
      khel: { subject: 'बच्चों ने', objectPart: 'अभी मैच', rootPart: 'खेल', tenseEnding: 'आ है (खेला है)', fullSentence: 'बच्चों ने अभी मैच खेला है।', english: 'The children have just played a match.' },
    },
  },
  {
    id: 'bhoot_poorn',
    mainTense: 'past',
    mainTenseHindi: 'भूतकाल (Past)',
    subTypeHindi: 'पूर्ण भूतकाल',
    subTypeEnglish: 'Past Perfect',
    signalKeywords: ['आ/ई/ए + था / थी / थे', 'चुका था / चुकी थी', 'बहुत पहले'],
    formulaHindi: 'सामान्य भूतकाल + [था / थी / थे] या [चुका था]',
    reasoningHindi: 'क्रिया के अंत में ‘था/थी/थे’ या ‘चुका था’ बताता है कि कार्य बहुत पहले ही पूरी तरह समाप्त हो चुका था।',
    reasoningEnglish: 'Pairing a completed verb with था/थी/थे confirms the action had already ended well in the past.',
    timelinePosition: 10,
    examples: {
      likh: { subject: 'अनीता ने', objectPart: 'पत्र', rootPart: 'लिख', tenseEnding: 'आ था (लिखा था)', fullSentence: 'अनीता ने पत्र लिखा था।', english: 'Anita had written a letter.' },
      padh: { subject: 'रोहन ने', objectPart: 'पाठ', rootPart: 'पढ़', tenseEnding: 'चुका था', fullSentence: 'रोहन पाठ पढ़ चुका था।', english: 'Rohan had finished reading the lesson.' },
      gaa: { subject: 'गायक ने', objectPart: 'गीत', rootPart: 'गा', tenseEnding: 'या था (गाया था)', fullSentence: 'गायक ने गीत गाया था।', english: 'The singer had sung a song.' },
      khel: { subject: 'बच्चों ने', objectPart: 'मैच', rootPart: 'खेल', tenseEnding: 'आ था (खेला था)', fullSentence: 'बच्चों ने मैच खेला था।', english: 'The children had played a match.' },
    },
  },
  {
    id: 'bhoot_apoorn',
    mainTense: 'past',
    mainTenseHindi: 'भूतकाल (Past)',
    subTypeHindi: 'अपूर्ण भूतकाल',
    subTypeEnglish: 'Past Continuous',
    signalKeywords: ['रहा था / रही थी / रहे थे'],
    formulaHindi: 'कर्ता + कर्म + मूल धातु + [रहा था / रही थी / रहे थे]',
    reasoningHindi: '‘रहा/रही’ निरंतरता (जारी रहने) का चिह्न है और ‘था/थी’ बीते समय का। दोनों मिलकर बताते हैं कि कार्य भूतकाल में चल रहा था, समाप्त नहीं हुआ था।',
    reasoningEnglish: 'रहा/रही marks ongoing motion while था/थी places it in the past — proving the action was still unfinished then.',
    timelinePosition: 20,
    examples: {
      likh: { subject: 'अनीता', objectPart: 'पत्र', rootPart: 'लिख', tenseEnding: 'रही थी', fullSentence: 'अनीता पत्र लिख रही थी।', english: 'Anita was writing a letter.' },
      padh: { subject: 'रोहन', objectPart: 'पाठ', rootPart: 'पढ़', tenseEnding: 'रहा था', fullSentence: 'रोहन पाठ पढ़ रहा था।', english: 'Rohan was reading the lesson.' },
      gaa: { subject: 'गायक', objectPart: 'गीत', rootPart: 'गा', tenseEnding: 'रहा था', fullSentence: 'गायक गीत गा रहा था।', english: 'The singer was singing a song.' },
      khel: { subject: 'बच्चे', objectPart: 'मैच', rootPart: 'खेल', tenseEnding: 'रहे थे', fullSentence: 'बच्चे मैच खेल रहे थे।', english: 'The children were playing a match.' },
    },
  },
  {
    id: 'bhoot_hetu',
    mainTense: 'past',
    mainTenseHindi: 'भूतकाल (Past)',
    subTypeHindi: 'हेतुहेतुमद् भूतकाल',
    subTypeEnglish: 'Conditional Past',
    signalKeywords: ['यदि ... तो ... ता/ती/ते', 'शर्त (Condition) + अधूरी क्रिया'],
    formulaHindi: 'यदि [पहली क्रिया + ता/ती], तो [दूसरी क्रिया + ता/ती]',
    reasoningHindi: '‘हेतु’ का अर्थ है कारण/शर्त। यहाँ भूतकाल में दूसरी क्रिया पहली क्रिया की शर्त पर निर्भर थी, जो पूरी न हो सकी।',
    reasoningEnglish: 'Hetu means cause/condition: the second past action depended on the first, which never occurred.',
    timelinePosition: 15,
    examples: {
      likh: { subject: 'यदि अनीता', objectPart: 'समय पर पत्र', rootPart: 'लिख', tenseEnding: 'ती, तो उत्तर मिलता', fullSentence: 'यदि अनीता समय पर पत्र लिखती, तो उत्तर मिलता।', english: 'Had Anita written the letter on time, a reply would have arrived.' },
      padh: { subject: 'यदि रोहन', objectPart: 'मन से पाठ', rootPart: 'पढ़', tenseEnding: 'ता, तो प्रथम आता', fullSentence: 'यदि रोहन मन से पाठ पढ़ता, तो प्रथम आता।', english: 'Had Rohan studied the lesson sincerely, he would have topped.' },
      gaa: { subject: 'यदि गायक', objectPart: 'सुमधुर गीत', rootPart: 'गा', tenseEnding: 'ता, तो पुरस्कार जीतता', fullSentence: 'यदि गायक सुमधुर गीत गाता, तो पुरस्कार जीतता।', english: 'Had the singer sung melodiously, he would have won.' },
      khel: { subject: 'यदि बच्चे', objectPart: 'अच्छा मैच', rootPart: 'खेल', tenseEnding: 'ते, तो जीत जाते', fullSentence: 'यदि बच्चे अच्छा मैच खेलते, तो जीत जाते।', english: 'Had the children played well, they would have won.' },
    },
  },
  {
    id: 'vartaman_samanya',
    mainTense: 'present',
    mainTenseHindi: 'वर्तमान काल (Present)',
    subTypeHindi: 'सामान्य वर्तमान काल',
    subTypeEnglish: 'Simple Present',
    signalKeywords: ['ता है / ती है / ते हैं', 'प्रतिदिन / सदा / रोज़'],
    formulaHindi: 'कर्ता + कर्म + मूल धातु + [ता है / ती है / ते हैं]',
    reasoningHindi: '‘ता/ती/ते’ आदत, नियम या सामान्य तथ्य का बोध कराते हैं और ‘है/हैं’ इसे वर्तमान समय से जोड़ते हैं।',
    reasoningEnglish: 'ता/ती/ते indicates habit or universal truth, anchored to the present by है/हैं.',
    timelinePosition: 50,
    examples: {
      likh: { subject: 'अनीता', objectPart: 'रोज़ पत्र', rootPart: 'लिख', tenseEnding: 'ती है', fullSentence: 'अनीता रोज़ पत्र लिखती है।', english: 'Anita writes a letter daily.' },
      padh: { subject: 'रोहन', objectPart: 'प्रतिदिन पाठ', rootPart: 'पढ़', tenseEnding: 'ता है', fullSentence: 'रोहन प्रतिदिन पाठ पढ़ता है।', english: 'Rohan reads the lesson every day.' },
      gaa: { subject: 'गायक', objectPart: 'मंच पर गीत', rootPart: 'गा', tenseEnding: 'ता है', fullSentence: 'गायक मंच पर गीत गाता है।', english: 'The singer sings songs on stage.' },
      khel: { subject: 'बच्चे', objectPart: 'शाम को मैच', rootPart: 'खेल', tenseEnding: 'ते हैं', fullSentence: 'बच्चे शाम को मैच खेलते हैं।', english: 'The children play a match in the evening.' },
    },
  },
  {
    id: 'vartaman_apoorn',
    mainTense: 'present',
    mainTenseHindi: 'वर्तमान काल (Present)',
    subTypeHindi: 'अपूर्ण (तात्कालिक) वर्तमान',
    subTypeEnglish: 'Present Continuous',
    signalKeywords: ['रहा है / रही है / रहे हैं', 'इस समय / अभी'],
    formulaHindi: 'कर्ता + कर्म + मूल धातु + [रहा है / रही है / रहे हैं]',
    reasoningHindi: 'क्रिया बोलते समय ठीक इसी क्षण चल रही है और अभी पूरी नहीं हुई है — ‘रहा’ (जारी) + ‘है’ (अभी)।',
    reasoningEnglish: 'The action is actively happening at the exact moment of speaking: रहा (in-progress) + है (now).',
    timelinePosition: 54,
    examples: {
      likh: { subject: 'अनीता', objectPart: 'अभी पत्र', rootPart: 'लिख', tenseEnding: 'रही है', fullSentence: 'अनीता अभी पत्र लिख रही है।', english: 'Anita is writing a letter right now.' },
      padh: { subject: 'रोहन', objectPart: 'इस समय पाठ', rootPart: 'पढ़', tenseEnding: 'रहा है', fullSentence: 'रोहन इस समय पाठ पढ़ रहा है।', english: 'Rohan is reading the lesson right now.' },
      gaa: { subject: 'गायक', objectPart: 'अभी गीत', rootPart: 'गा', tenseEnding: 'रहा है', fullSentence: 'गायक अभी गीत गा रहा है।', english: 'The singer is singing a song now.' },
      khel: { subject: 'बच्चे', objectPart: 'मैदान में मैच', rootPart: 'खेल', tenseEnding: 'रहे हैं', fullSentence: 'बच्चे मैदान में मैच खेल रहे हैं।', english: 'The children are playing a match on the field.' },
    },
  },
  {
    id: 'vartaman_sandigdh',
    mainTense: 'present',
    mainTenseHindi: 'वर्तमान काल (Present)',
    subTypeHindi: 'संदिग्ध वर्तमान काल',
    subTypeEnglish: 'Doubtful / Presumptive Present',
    signalKeywords: ['ता होगा / ती होगी / ते होंगे', 'रहा होगा / रही होगी'],
    formulaHindi: 'मूल धातु + [ता/ती/रहा] + [होगा / होगी / होंगे]',
    reasoningHindi: 'ध्यान दें! ‘होगा’ देखकर इसे भविष्यत् न समझें — आगे ‘ता/ती/रहा’ लगा होने से यह बताता है कि काम अभी वर्तमान में हो रहा होगा (अनुमान/संदेह)।',
    reasoningEnglish: 'Exam trap alert: होगा after ता/ती/रहा expresses doubt about a present ongoing action, NOT future tense.',
    timelinePosition: 58,
    examples: {
      likh: { subject: 'अनीता', objectPart: 'इस समय पत्र', rootPart: 'लिख', tenseEnding: 'ती होगी', fullSentence: 'अनीता इस समय पत्र लिखती होगी।', english: 'Anita must be writing a letter right now.' },
      padh: { subject: 'रोहन', objectPart: 'कमरे में पाठ', rootPart: 'पढ़', tenseEnding: 'रहा होगा', fullSentence: 'रोहन कमरे में पाठ पढ़ रहा होगा।', english: 'Rohan must be reading the lesson in his room.' },
      gaa: { subject: 'गायक', objectPart: 'अभ्यास में गीत', rootPart: 'गा', tenseEnding: 'ता होगा', fullSentence: 'गायक अभ्यास में गीत गाता होगा।', english: 'The singer must be singing during practice.' },
      khel: { subject: 'बच्चे', objectPart: 'बाहर मैच', rootPart: 'खेल', tenseEnding: 'रहे होंगे', fullSentence: 'बच्चे बाहर मैच खेल रहे होंगे।', english: 'The children must be playing a match outside.' },
    },
  },
  {
    id: 'bhavishya_samanya',
    mainTense: 'future',
    mainTenseHindi: 'भविष्यत् काल (Future)',
    subTypeHindi: 'सामान्य भविष्यत् काल',
    subTypeEnglish: 'Simple Future',
    signalKeywords: ['गा / गी / गे (सीधे धातु के बाद)', 'कल (आने वाला)', 'अगले सप्ताह'],
    formulaHindi: 'कर्ता + कर्म + मूल धातु + [एगा / एगी / एँगे]',
    reasoningHindi: 'मूल धातु के सीधे साथ ‘गा/गी/गे’ जुड़ने से निश्चित होता है कि कार्य आने वाले समय में सामान्य रूप से संपन्न होगा।',
    reasoningEnglish: 'Attaching गा/गी/गे directly to the verb stem predicts a future action cleanly.',
    timelinePosition: 80,
    examples: {
      likh: { subject: 'अनीता', objectPart: 'कल पत्र', rootPart: 'लिख', tenseEnding: 'एगी (लिखेगी)', fullSentence: 'अनीता कल पत्र लिखेगी।', english: 'Anita will write a letter tomorrow.' },
      padh: { subject: 'रोहन', objectPart: 'कल पाठ', rootPart: 'पढ़', tenseEnding: 'एगा (पढ़ेगा)', fullSentence: 'रोहन कल पाठ पढ़ेगा।', english: 'Rohan will read the lesson tomorrow.' },
      gaa: { subject: 'गायक', objectPart: 'कल गीत', rootPart: 'गा', tenseEnding: 'एगा (गाएगा)', fullSentence: 'गायक कल गीत गाएगा।', english: 'The singer will sing a song tomorrow.' },
      khel: { subject: 'बच्चे', objectPart: 'कल मैच', rootPart: 'खेल', tenseEnding: 'एँगे (खेलेंगे)', fullSentence: 'बच्चे कल मैच खेलेंगे।', english: 'The children will play a match tomorrow.' },
    },
  },
  {
    id: 'bhavishya_sambhavya',
    mainTense: 'future',
    mainTenseHindi: 'भविष्यत् काल (Future)',
    subTypeHindi: 'संभाव्य भविष्यत् काल',
    subTypeEnglish: 'Probable / Subjunctive Future',
    signalKeywords: ['शायद / संभवतः', 'ए / एँ / ऊँ (बिना गा/गी/गे)'],
    formulaHindi: 'शायद / संभवतः + कर्ता + मूल धातु + [ए / एँ / ऊँ]',
    reasoningHindi: 'भविष्य में कार्य होने की केवल संभावना (इच्छा या अनुमान) हो, निश्चय नहीं — इसलिए ‘गा/गी/गे’ हट जाता है और ‘शायद’ जैसे शब्द जुड़ते हैं।',
    reasoningEnglish: 'Expresses possibility rather than certainty in the future — drops गा/गी/गे and uses subjunctive verb endings.',
    timelinePosition: 92,
    examples: {
      likh: { subject: 'शायद अनीता', objectPart: 'शाम को पत्र', rootPart: 'लिख', tenseEnding: 'ए (लिखे)', fullSentence: 'शायद अनीता शाम को पत्र लिखे।', english: 'Perhaps Anita might write a letter in the evening.' },
      padh: { subject: 'संभवतः रोहन', objectPart: 'कल पाठ', rootPart: 'पढ़', tenseEnding: 'ए (पढ़े)', fullSentence: 'संभवतः रोहन कल पाठ पढ़े।', english: 'Rohan may read the lesson tomorrow.' },
      gaa: { subject: 'शायद गायक', objectPart: 'समारोह में गीत', rootPart: 'गा', tenseEnding: 'ए (गाए)', fullSentence: 'शायद गायक समारोह में गीत गाए।', english: 'Maybe the singer will sing at the ceremony.' },
      khel: { subject: 'शायद बच्चे', objectPart: 'कल मैच', rootPart: 'खेल', tenseEnding: 'एँ (खेलें)', fullSentence: 'शायद बच्चे कल मैच खेलें।', english: 'Perhaps the children will play the match tomorrow.' },
    },
  },
];

export interface CheatKeywordItem {
  keyword: string;
  identifies: string;
  example: string;
}

export interface ChapterCheatNoteData {
  moduleId: string;
  chapterTitleHindi: string;
  chapterTitleEnglish: string;
  coreIdeaHindi: string;
  coreIdeaEnglish: string;
  diagnosticTestLabelHindi: string;
  diagnosticTestLabelEnglish: string;
  keywords: CheatKeywordItem[];
  mechanismSteps: { stepHindi: string; stepEnglish: string }[];
  commonTraps: { trapHindi: string; fixHindi: string }[];
  quickTableHeaders: [string, string, string];
  quickTableRows: [string, string, string][];
}

export const CHAPTER_CHEAT_NOTES: Record<string, ChapterCheatNoteData> = {
  kaal: {
    moduleId: 'kaal',
    chapterTitleHindi: 'काल (Tense) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Kaal (Tense) — Cheat Codes & Identification Keywords',
    coreIdeaHindi: 'काल की पहचान वाक्य के पहले शब्द से नहीं, बल्कि अंत की ‘मुख्य क्रिया + सहायक क्रिया’ के चिह्नों और समय-सूचक शब्दों से होती है।',
    coreIdeaEnglish: 'Identify tense from the verb ending + auxiliary marker at the end of the sentence, never by guesswork.',
    diagnosticTestLabelHindi: 'क्रिया-अंत व समय-रेखा जाँच (Verb Ending & Timeline Test)',
    diagnosticTestLabelEnglish: 'Inspect verb stem + tense suffix + auxiliary',
    keywords: [
      { keyword: 'ता है / ती है / ते हैं', identifies: 'सामान्य वर्तमान काल', example: 'सूर्य पूर्व से निकलता है।' },
      { keyword: 'रहा है / रही है / रहे हैं', identifies: 'अपूर्ण (तात्कालिक) वर्तमान', example: 'अनीता पत्र लिख रही है।' },
      { keyword: 'ता होगा / रहा होगा', identifies: 'संदिग्ध वर्तमान (भविष्य नहीं!)', example: 'वह अभी पढ़ रहा होगा।' },
      { keyword: 'आ / ई / ए (बिना है/था)', identifies: 'सामान्य भूतकाल', example: 'राम ने पुस्तक पढ़ी।' },
      { keyword: 'आ है / ई है / ए हैं + अभी', identifies: 'आसन्न भूतकाल (अभी पूरा हुआ)', example: 'मैं अभी स्कूल से आया हूँ।' },
      { keyword: 'आ था / चुका था / चुकी थी', identifies: 'पूर्ण भूतकाल (बहुत पहले पूरा)', example: 'गाड़ी स्टेशन से जा चुकी थी।' },
      { keyword: 'रहा था / रही थी / रहे थे', identifies: 'अपूर्ण भूतकाल (तब जारी था)', example: 'वर्षा हो रही थी।' },
      { keyword: 'यदि ... ता/ती, तो ... ता/ती', identifies: 'हेतुहेतुमद् भूतकाल (अधूरी शर्त)', example: 'यदि पढ़ते, तो पास होते।' },
      { keyword: 'एगा / एगी / एँगे', identifies: 'सामान्य भविष्यत् काल', example: 'हम कल प्रयागराज जाएँगे।' },
      { keyword: 'शायद / संभवतः + ए / एँ', identifies: 'संभाव्य भविष्यत् काल', example: 'शायद आज वर्षा हो।' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. पहले वाक्य की अंतिम क्रिया को दो भागों में तोड़ें: [मूल धातु] + [अंतिम चिह्न]।',
        stepEnglish: 'Split the final verb into [Root Verb] + [Ending & Auxiliary].',
      },
      {
        stepHindi: '२. मुख्य समय पहचानें: था/थी/थे या केवल आ/ई/ए = भूतकाल; है/हैं/हूँ = वर्तमान; गा/गी/गे या शायद+ए = भविष्यत्।',
        stepEnglish: 'Lock main era: था/completed past = Past; है = Present; गा/गी/गे or शायद+ए = Future.',
      },
      {
        stepHindi: '३. स्थिति (Aspect) जाँचें: ‘रहा’ = अपूर्ण (जारी), ‘चुका/आ+था’ = पूर्ण, ‘आ+है’ = आसन्न, ‘ता+होगा’ = संदिग्ध वर्तमान।',
        stepEnglish: 'Identify aspect: रहा = continuous, चुका/था = perfect, आ+है = recent past, ता+होगा = doubtful present.',
      },
    ],
    commonTraps: [
      {
        trapHindi: '‘वह पढ़ता होगा’ में ‘होगा’ देखकर छात्र इसे भविष्यत् काल मान लेते हैं।',
        fixHindi: 'जब ‘होगा/होगी’ से पहले ‘ता/ती/रहा’ हो, तो वह संदिग्ध वर्तमान काल होता है। भविष्यत् में ‘गा’ सीधे धातु से जुड़ता है (पढ़ेगा)।',
      },
      {
        trapHindi: '‘मैंने खाना खाया है’ में ‘है’ देखकर इसे वर्तमान काल समझ लेना।',
        fixHindi: '‘खाया’ भूतकाल की पूर्ण क्रिया है और ‘है’ केवल निकटता दिखाता है — यह आसन्न भूतकाल है।',
      },
    ],
    quickTableHeaders: ['काल का भेद', 'पहचान कीवर्ड (Cheat Code)', 'उदाहरण'],
    quickTableRows: [
      ['सामान्य वर्तमान', 'ता है / ती है / ते हैं', 'लड़की पत्र लिखती है।'],
      ['अपूर्ण वर्तमान', 'रहा है / रही है / रहे हैं', 'गायक गीत गा रहा है।'],
      ['संदिग्ध वर्तमान', 'ता होगा / रहा होगा', 'बालक फल खाता होगा।'],
      ['सामान्य भूतकाल', 'आ / ई / ए (अंत में है/था नहीं)', 'रोहन ने पाठ पढ़ा।'],
      ['आसन्न भूतकाल', 'आ है / ई है / ए हैं', 'यात्री अभी चला है।'],
      ['पूर्ण भूतकाल', 'आ था / चुका था', 'अनीता ने पत्र लिखा था।'],
      ['अपूर्ण भूतकाल', 'रहा था / रही थी / रहे थे', 'लड़की पत्र लिख रही थी।'],
      ['हेतुहेतुमद् भूतकाल', 'यदि...ता, तो...ता', 'यदि वर्षा होती, तो फसल अच्छी होती।'],
      ['सामान्य भविष्यत्', 'एगा / एगी / एँगे', 'हम कल दिल्ली जाएँगे।'],
      ['संभाव्य भविष्यत्', 'शायद / संभवतः + ए / एँ', 'शायद कल धूप निकले।'],
    ],
  },
  muhavare: {
    moduleId: 'muhavare',
    chapterTitleHindi: 'मुहावरे (Idioms) — समझ-आधारित चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Muhavare — Understanding-Based Cheat Codes & Notes',
    coreIdeaHindi: 'मुहावरे रटने की चीज़ नहीं हैं! हर मुहावरा 3-कदम के तर्क पर चलता है: १. शाब्दिक दृश्य (चित्र सोचें) → २. मानव अनुभव से जुड़ा तार्किक सेतु → ३. लाक्षणिक अर्थ।',
    coreIdeaEnglish: 'Never rote-memorise idioms. Decode every Muhavara in 3 steps: Literal visual → Real-world logical bridge → Figurative meaning.',
    diagnosticTestLabelHindi: '३-चरणीय अर्थ-सेतु विश्लेषण (3-Step Meaning Bridge)',
    diagnosticTestLabelEnglish: 'Literal Image → Logical Bridge → Figurative Context',
    keywords: [
      { keyword: 'शरीर के अंग (आँख, कान, दाँत, कमर, नाक)', identifies: 'भाव व प्रतिक्रिया आधारित मुहावरे', example: 'आँखों का तारा (अत्यंत प्रिय), कान भरना (चुगली)' },
      { keyword: 'विषम तुलना (ऊँट-जीरा, गागर-सागर)', identifies: 'अनुपात व चमत्कार दर्शाने वाले मुहावरे', example: 'ऊँट के मुँह में जीरा (बहुत कम मिलना)' },
      { keyword: 'प्रकृति व उत्सव (चाँद, आसमान, घी के दीये)', identifies: 'सुंदरता, दुर्लभता या हर्ष के मुहावरे', example: 'ईद का चाँद (दुर्लभ), चार चाँद लगाना (शोभा बढ़ाना)' },
      { keyword: 'कठोर धातु/कष्ट (लोहे के चने, नाकों चने)', identifies: 'अत्यधिक कठिनाई या परेशानी के मुहावरे', example: 'लोहे के चने चबाना (कठिन कार्य करना)' },
      { keyword: 'क्रिया का मूल रूप (‘ना’ अंत)', identifies: 'मुहावरे की व्याकरणिक पहचान', example: 'भाग जाना, कमर कसना — वाक्य में काल के अनुसार बदलते हैं' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. शब्दों का चित्र मन में बनाएँ (उदा. ऊँट के मुँह में एक छोटा जीरा)।',
        stepEnglish: 'Visualize the literal picture first (e.g., a tiny cumin seed in a giant camel’s mouth).',
      },
      {
        stepHindi: '२. स्वयं से पूछें: “ऐसी स्थिति वास्तविक जीवन में किस भावना या अनुभव को दिखाती है?” (अत्यधिक कमी)।',
        stepEnglish: 'Ask “What real human feeling or situation does this image mirror?” (extreme insufficiency).',
      },
      {
        stepHindi: '३. वाक्य-प्रयोग नियम: वाक्य में मुहावरे का मूल रूप (न कि उसका अर्थ) प्रयोग करें और लिंग/काल के अनुसार क्रिया बदलें।',
        stepEnglish: 'In sentence framing, use the idiom itself (not its definition) and conjugate its final verb to match gender/tense.',
      },
    ],
    commonTraps: [
      {
        trapHindi: 'छात्र वाक्य-प्रयोग में मुहावरे की जगह उसका अर्थ लिख देते हैं (जैसे: ‘चोर भाग गए’)।',
        fixHindi: 'वाक्य में हमेशा मुहावरा ही आना चाहिए: ‘पुलिस को देखकर चोर नौ दो ग्यारह हो गए।’',
      },
      {
        trapHindi: '‘लोहे के चने चबाना’ और ‘नाकों चने चबवाना’ को एक समझ लेना।',
        fixHindi: '‘चबाना’ = स्वयं कठिन काम करना; ‘चबवाना’ (प्रेरणार्थक) = किसी दूसरे को बुरी तरह परेशान करना।',
      },
    ],
    quickTableHeaders: ['मुहावरा', 'तार्किक सेतु (क्यों?)', 'सही लाक्षणिक अर्थ'],
    quickTableRows: [
      ['नौ दो ग्यारह होना', '11 = दो तेज़ दौड़ते पैर', 'तुरंत भाग जाना / रफूचक्कर होना'],
      ['आँखों का तारा', 'पुतली सबसे अनमोल होती है', 'बहुत अधिक प्यारा होना'],
      ['ऊँट के मुँह में जीरा', 'विशाल ज़रूरत बनाम सूक्ष्म पूर्ति', 'आवश्यकता से बहुत कम मिलना'],
      ['गागर में सागर भरना', 'छोटे घड़े में अनंत समुद्र', 'थोड़े शब्दों में गहरी बात कहना'],
      ['कमर कसना', 'युद्ध से पहले पटका कसना', 'दृढ़ निश्चय से तैयार होना'],
      ['अंधे की लाठी', 'नेत्रहीन का एकमात्र सहारा', 'असहाय का इकलौता आधार'],
      ['ईद का चाँद होना', 'लंबी प्रतीक्षा के बाद दर्शन', 'बहुत दिनों बाद दिखाई देना'],
      ['पानी-पानी होना', 'शर्म से पसीने होकर गल जाना', 'अत्यधिक लज्जित होना'],
    ],
  },
  karak: {
    moduleId: 'karak',
    chapterTitleHindi: 'कारक (Case Markers) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Karak — Decision Tree & Cheat Codes',
    coreIdeaHindi: 'विभक्ति (परसर्ग) रटने के बजाय क्रिया से प्रश्न पूछें — ‘से’ यदि काम का साधन (Tool) हो तो करण, और यदि दूरी/अलगाव/डर/तुलना हो तो अपादान!',
    coreIdeaEnglish: 'Test the verb relationship: if “से” is a tool/means, it is Karan; if it shows separation, fear, or comparison, it is Apadan.',
    diagnosticTestLabelHindi: 'साधन बनाम अलगाव बल-परीक्षण (Tool vs Detachment Test)',
    diagnosticTestLabelEnglish: 'Check whether cable connects (Tool) or snaps (Separation)',
    keywords: [
      { keyword: 'ने (क्रिया करने वाला)', identifies: 'कर्ता कारक', example: 'राम ने पुस्तक पढ़ी।' },
      { keyword: 'को (क्रिया का प्रभाव)', identifies: 'कर्म कारक', example: 'माँ ने बच्चे को सुलाया।' },
      { keyword: 'से / के द्वारा (साधन/औज़ार)', identifies: 'करण कारक', example: 'कलम से पत्र लिखा।' },
      { keyword: 'के लिए / दान में “को”', identifies: 'सम्प्रदान कारक', example: 'गरीबों को कंबल दिए।' },
      { keyword: 'से (अलगाव, डर, तुलना, उत्पत्ति)', identifies: 'अपादान कारक', example: 'पेड़ से पत्ता गिरा; शेर से डरा।' },
      { keyword: 'का / की / के / रा / री / रे', identifies: 'सम्बन्ध कारक', example: 'रोहन की बहन बुद्धिमान है।' },
      { keyword: 'में / पर (स्थान व आधार)', identifies: 'अधिकरण कारक', example: 'मेज पर पुस्तक रखी है।' },
      { keyword: 'हे! / अरे! / ओ!', identifies: 'संबोधन कारक', example: 'अरे बालक! ध्यान से चलो।' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. वाक्य में ‘से’ दिखते ही दूरी जाँचें: क्या दो वस्तुएँ अलग हो रही हैं? हाँ = अपादान; नहीं, वह औज़ार है = करण।',
        stepEnglish: 'When you see “से”, check distance: separating/fearing/comparing = Apadan; acting as tool = Karan.',
      },
      {
        stepHindi: '२. ‘को’ दिखते ही दान/उपहार जाँचें: यदि वस्तु हमेशा के लिए दी जाए (दान/उपहार) तो सम्प्रदान, अन्यथा कर्म कारक।',
        stepEnglish: 'When you see “को”, check permanent giving/charity: giving = Sampradan; direct action target = Karm.',
      },
    ],
    commonTraps: [
      {
        trapHindi: '‘बच्चा कुत्ते से डरता है’ में ‘से’ को करण कारक लिख देना।',
        fixHindi: 'डर, लज्जा, तुलना (राम श्याम से लंबा है) और उत्पत्ति (गंगा हिमालय से निकली) में हमेशा अपादान कारक होता है।',
      },
      {
        trapHindi: '‘राजा ने भिखारी को वस्त्र दिए’ में ‘को’ देखकर कर्म कारक चुनना।',
        fixHindi: 'दान देने के अर्थ में ‘को’ हमेशा सम्प्रदान कारक होता है।',
      },
    ],
    quickTableHeaders: ['कारक', 'विभक्ति चिह्न (Keyword)', 'तार्किक पहचान'],
    quickTableRows: [
      ['कर्ता', 'ने / (शून्य)', 'क्रिया करने वाला कौन?'],
      ['कर्म', 'को / (शून्य)', 'क्रिया का सीधा फल किस पर?'],
      ['करण', 'से, के द्वारा', 'किस साधन/उपकरण से?'],
      ['सम्प्रदान', 'के लिए, को (दान)', 'किसके लिए कार्य हुआ?'],
      ['अपादान', 'से (अलगाव/डर/तुलना)', 'कहाँ से अलग हुआ या डरा?'],
      ['सम्बन्ध', 'का, की, के, रा, री, रे', 'दो संज्ञाओं का आपसी रिश्ता'],
      ['अधिकरण', 'में, पर', 'क्रिया का स्थान या आधार'],
      ['संबोधन', 'हे!, अरे!, ओ!', 'पुकारना या सचेत करना'],
    ],
  },
  vakya: {
    moduleId: 'vakya',
    chapterTitleHindi: 'रचना के आधार पर वाक्य भेद — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vakya Bhed — Clause Split Test & Conjunction Cheat Sheet',
    coreIdeaHindi: 'वाक्य को योजक (Connector) से काटकर देखें: यदि दोनों टुकड़े अकेले पूरा अर्थ दें = संयुक्त; यदि एक टुकड़ा अधूरा (आश्रित) लगे = मिश्र; यदि एक ही मुख्य क्रिया हो = सरल।',
    coreIdeaEnglish: 'Split the sentence at the connector: two standalone clauses = Compound; one dependent incomplete clause = Complex; one finite verb = Simple.',
    diagnosticTestLabelHindi: 'योजक काट-परीक्षण (Connector Split Test)',
    diagnosticTestLabelEnglish: 'Cut at connector and test independence of each clause',
    keywords: [
      { keyword: 'एक ही समापिका क्रिया (कोई योजक नहीं)', identifies: 'सरल वाक्य (Simple)', example: 'घंटी बजते ही छात्र कक्षा में चले गए।' },
      { keyword: 'और, तथा, एवं, या, अथवा, किंतु, परंतु, लेकिन, इसलिए', identifies: 'संयुक्त वाक्य (Compound)', example: 'सूर्योदय हुआ और पक्षी चहचहाने लगे।' },
      { keyword: 'कि (संज्ञा आश्रित)', identifies: 'मिश्र वाक्य (Complex)', example: 'शिक्षक ने कहा कि कल अवकाश रहेगा।' },
      { keyword: 'जो...वह / जिसे...उसे / जैसा...वैसा', identifies: 'मिश्र वाक्य (विशेषण आश्रित)', example: 'जो परिश्रमी हैं, वे सफल होते हैं।' },
      { keyword: 'जब...तब / यदि...तो / क्योंकि / यद्यपि...तथापि', identifies: 'मिश्र वाक्य (क्रियाविशेषण आश्रित)', example: 'जब वर्षा रुकी, तब बच्चे खेले।' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. मुख्य समापिका क्रियाएँ गिनें: केवल १ मुख्य क्रिया = सरल वाक्य।',
        stepEnglish: 'Count finite verbs: only 1 main verb with no clause connector = Simple sentence.',
      },
      {
        stepHindi: '२. योजक पर उँगली रखकर दोनों हिस्से अलग पढ़ें: दोनों पूर्ण स्वतंत्र वाक्य हैं = संयुक्त।',
        stepEnglish: 'Cover the connector and read both halves alone: both complete = Compound.',
      },
      {
        stepHindi: '३. यदि एक भाग “कि/जो/जब/यदि” के कारण अधूरा लगे और दूसरे पर टिके = मिश्र वाक्य।',
        stepEnglish: 'If one clause sounds incomplete and leans on the main clause = Complex.',
      },
    ],
    commonTraps: [
      {
        trapHindi: '‘राम और श्याम विद्यालय गए’ में ‘और’ देखकर संयुक्त वाक्य मान लेना।',
        fixHindi: 'यहाँ ‘और’ दो शब्दों (राम, श्याम) को जोड़ रहा है, दो वाक्यों को नहीं! क्रिया एक ही है, अतः यह सरल वाक्य है।',
      },
      {
        trapHindi: '‘क्योंकि’ और ‘इसलिए’ में भ्रम होना।',
        fixHindi: '‘इसलिए’ संयुक्त वाक्य का योजक है, जबकि ‘क्योंकि’ मिश्र वाक्य (आश्रित कारण) बनाता है।',
      },
    ],
    quickTableHeaders: ['वाक्य भेद', 'पहचान कीवर्ड्स', 'काट-परीक्षण परिणाम'],
    quickTableRows: [
      ['सरल वाक्य', 'कोई वाक्य-योजक नहीं, १ मुख्य क्रिया', 'एक ही अखंड इकाई'],
      ['संयुक्त वाक्य', 'और, एवं, या, किंतु, परंतु, लेकिन, इसलिए', 'दोनों उपवाक्य स्वतंत्र व पूर्ण'],
      ['मिश्र वाक्य', 'कि, जो-वह, जब-तब, यदि-तो, क्योंकि, ताकि', '१ प्रधान + १ आश्रित उपवाक्य'],
    ],
  },
  vachya: {
    moduleId: 'vachya',
    chapterTitleHindi: 'वाच्य (Voice) — स्पॉटलाइट चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vachya — Spotlight Agreement Cheat Sheet',
    coreIdeaHindi: 'वाच्य बदलने का अर्थ है क्रिया की ‘स्पॉटलाइट’ घुमाना — क्रिया किसके लिंग-वचन का अनुसरण कर रही है? कर्ता = कर्तृवाच्य; कर्म = कर्मवाच्य; न कर्ता न कर्म (पुल्लिंग एकवचन) = भाववाच्य।',
    coreIdeaEnglish: 'Check who controls the verb’s gender & number: Subject = Kartri; Object = Karm; Fixed Masculine Singular (no object) = Bhav.',
    diagnosticTestLabelHindi: 'क्रिया-नियंत्रण स्पॉटलाइट जाँच (Verb Agreement Spotlight)',
    diagnosticTestLabelEnglish: 'Flip Subject/Object gender to see which one changes the verb',
    keywords: [
      { keyword: 'कर्ता बिना ‘से/के द्वारा’ (सकर्मक या अकर्मक)', identifies: 'कर्तृवाच्य (Active)', example: 'सुनीता पत्र लिखती है।' },
      { keyword: 'से / के द्वारा + सकर्मक क्रिया + ‘जाना’ रूप', identifies: 'कर्मवाच्य (Passive)', example: 'सुनीता के द्वारा पत्र लिखा जाता है।' },
      { keyword: 'से + अकर्मक क्रिया + ‘नहीं जाता’ (पुल्लिंग एकवचन)', identifies: 'भाववाच्य (Impersonal)', example: 'दादी से चला नहीं जाता।' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. ‘से / के द्वारा’ न हो और क्रिया कर्ता के अनुसार हो → कर्तृवाच्य।',
        stepEnglish: 'No से/के द्वारा and verb agrees with subject → Kartrivachya.',
      },
      {
        stepHindi: '२. ‘से / के द्वारा’ हो तो क्रिया से “क्या?” पूछें: उत्तर मिले (कर्म मौजूद) → कर्मवाच्य।',
        stepEnglish: 'With से/के द्वारा, ask “What?” to the verb: if an object answers → Karmavachya.',
      },
      {
        stepHindi: '३. “क्या?” का उत्तर न मिले (अकर्मक) और क्रिया हमेशा पुल्लिंग एकवचन (‘जाता है’) हो → भाववाच्य।',
        stepEnglish: 'No object (intransitive) and verb locked to masculine singular → Bhavavachya.',
      },
    ],
    commonTraps: [
      {
        trapHindi: 'वाच्य बदलते समय वाक्य का काल (Tense) बदल देना।',
        fixHindi: 'वाच्य परिवर्तन में काल कभी नहीं बदलता! ‘लिखती है’ (वर्तमान) → ‘लिखा जाता है’ (वर्तमान), ‘लिखा गया’ (भूत) नहीं।',
      },
      {
        trapHindi: '‘मुझसे पुस्तक नहीं पढ़ी जाती’ को ‘नहीं’ देखकर भाववाच्य समझ लेना।',
        fixHindi: 'इसमें ‘पुस्तक’ (कर्म) है और ‘पढ़ी जाती’ स्त्रीलिंग कर्म के अनुसार है, अतः यह कर्मवाच्य है, भाववाच्य नहीं।',
      },
    ],
    quickTableHeaders: ['वाच्य भेद', 'अनिवार्य पहचान कीवर्ड्स', 'क्रिया का नियंत्रण'],
    quickTableRows: [
      ['कर्तृवाच्य', 'कर्ता मुख्य; ‘से/के द्वारा’ नहीं', 'कर्ता के लिंग-वचन अनुसार'],
      ['कर्मवाच्य', 'कर्ता + के द्वारा/से + कर्म + जाना रूप', 'कर्म के लिंग-वचन अनुसार'],
      ['भाववाच्य', 'कर्ता + से + अकर्मक क्रिया (असमर्थता)', 'सदा पुल्लिंग, एकवचन, अन्य पुरुष'],
    ],
  },
  'upsarg-pratyay': {
    moduleId: 'upsarg-pratyay',
    chapterTitleHindi: 'उपसर्ग व प्रत्यय — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Upsarg & Pratyay — Word Construction Cheat Codes',
    coreIdeaHindi: 'उपसर्ग शब्द के आगे (बाएँ) जुड़कर अर्थ की दिशा बदलता है; प्रत्यय शब्द के पीछे (दाएँ) जुड़कर शब्द-वर्ग (संज्ञा/विशेषण) बदलता है — बीच का मूल शब्द सार्थक होना अनिवार्य है!',
    coreIdeaEnglish: 'Prefix snaps to the left to shift meaning; suffix snaps to the right to shift grammar role — the remaining root must always be meaningful.',
    diagnosticTestLabelHindi: 'मूल-शब्द अवशेष परीक्षण (Meaningful Root Remainder Test)',
    diagnosticTestLabelEnglish: 'Strip affix and verify the remaining root carries independent meaning',
    keywords: [
      { keyword: 'अ, अन, उप, अनु, प्रति, परि, सु, दुस्/दुर्, वि, सम', identifies: 'प्रमुख उपसर्ग (बाएँ जुड़ते हैं)', example: 'अनु + शासन = अनुशासन' },
      { keyword: 'इक (आदि स्वर दीर्घ करता है!)', identifies: 'विशेषण बनाने वाला प्रत्यय', example: 'समाज + इक = सामाजिक' },
      { keyword: 'ता, त्व, पन, आवट, आहट, ई', identifies: 'भाववाचक संज्ञा प्रत्यय', example: 'लिख् + आवट = लिखावट' },
      { keyword: 'दार, वाला, वान, मान, इत', identifies: 'गुण/विशेषण प्रत्यय', example: 'दया + वान = दयावान' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. शब्दांश हटाने के बाद बचे हुए शब्द का स्वतंत्र अर्थ जाँचें (जैसे ‘अनुशासन’ से ‘अनु’ हटाने पर सार्थक ‘शासन’ बचता है)।',
        stepEnglish: 'Remove the affix and verify the leftover root makes independent sense.',
      },
      {
        stepHindi: '२. ‘इक’ प्रत्यय नियम: शब्द के पहले स्वर में वृद्धि होती है — अ→आ (समाज→सामाजिक), इ/ए→ऐ (इतिहास→ऐतिहासिक), उ/ओ→औ (भूगोल→भौगोलिक)।',
        stepEnglish: '“इक” suffix lengthens the very first vowel of the root word.',
      },
    ],
    commonTraps: [
      {
        trapHindi: '‘समाज + इक’ को ‘समाजिक’ लिख देना।',
        fixHindi: '‘इक’ प्रत्यय हमेशा पहले स्वर ‘अ’ को ‘आ’ बनाता है → सही रूप ‘सामाजिक’ है।',
      },
      {
        trapHindi: '‘अध्यापक’ या ‘स्वागत’ में सीधे पहला अक्षर उपसर्ग मान लेना।',
        fixHindi: 'संधि तोड़कर देखें: ‘सु + आगत = स्वागत’ (उपसर्ग ‘सु’), ‘प्रति + एक = प्रत्येक’ (उपसर्ग ‘प्रति’)।',
      },
    ],
    quickTableHeaders: ['प्रकार', 'स्थान व प्रभाव', 'उदाहरण सूत्र'],
    quickTableRows: [
      ['उपसर्ग (Prefix)', 'मूल शब्द से पहले (अर्थ बदलता है)', 'प्र + हार = प्रहार, दुर् + जन = दुर्जन'],
      ['कृत् प्रत्यय', 'क्रिया/धातु के अंत में', 'लिख् + आवट = लिखावट, पढ़् + आई = पढ़ाई'],
      ['तद्धित प्रत्यय', 'संज्ञा/सर्वनाम/विशेषण के अंत में', 'समाज + इक = सामाजिक, सुंदर + ता = सुंदरता'],
    ],
  },
  sandhi: {
    moduleId: 'sandhi',
    chapterTitleHindi: 'संधि (Phonetic Fusion) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Sandhi — Sound Collision Formula Cheat Sheet',
    coreIdeaHindi: 'संधि पूरे शब्दों का नहीं, बल्कि पहले शब्द के अंतिम वर्ण और दूसरे शब्द के प्रथम वर्ण की ध्वनियों के टकराने से होने वाला ध्वनि-परिवर्तन है।',
    coreIdeaEnglish: 'Sandhi happens strictly at the boundary where the last sound of Word 1 collides with the first sound of Word 2.',
    diagnosticTestLabelHindi: 'सीमांत-ध्वनि टक्कर सूत्र (Boundary Sound Collision Test)',
    diagnosticTestLabelEnglish: 'Inspect exact boundary sounds: End(Part 1) + Start(Part 2)',
    keywords: [
      { keyword: 'बीच में आ, ई, ऊ की बड़ी मात्रा', identifies: 'दीर्घ स्वर संधि (समान स्वर)', example: 'विद्या + आलय = विद्यालय (आ+आ=आ)' },
      { keyword: 'बीच में एक मात्रा: ए, ओ या अर्', identifies: 'गुण स्वर संधि', example: 'महा + ईश = महेश (आ+ई=ए)' },
      { keyword: 'बीच में दो मात्राएँ: ऐ, औ', identifies: 'वृद्धि स्वर संधि', example: 'सदा + एव = सदैव (आ+ए=ऐ)' },
      { keyword: 'य / व / र से पहले आधा व्यंजन', identifies: 'यण स्वर संधि', example: 'अति + अंत = अत्यंत (इ+अ=य)' },
      { keyword: 'प्रथम पद के अंत में हलंत (त्, क्, म्)', identifies: 'व्यंजन संधि', example: 'सत् + जन = सज्जन' },
      { keyword: 'प्रथम पद के अंत में विसर्ग (ः)', identifies: 'विसर्ग संधि', example: 'नमः + ते = नमस्ते' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. संयुक्त शब्द के ठीक बीच की मात्रा या आधे अक्षर को पहचानें।',
        stepEnglish: 'Spot the junction vowel (आ/ई/ऊ, ए/ओ, ऐ/औ) or half-consonant before य/व.',
      },
      {
        stepHindi: '२. विच्छेद के बाद दोनों टुकड़े सार्थक संस्कृत/हिंदी शब्द होने चाहिए (जैसे ‘महा + ईश’, न कि ‘मह + ईश’)।',
        stepEnglish: 'Verify both split halves are valid meaningful words.',
      },
    ],
    commonTraps: [
      {
        trapHindi: 'गुण संधि (ए/ओ) और वृद्धि संधि (ऐ/औ) में उलझना।',
        fixHindi: 'चीट कोड: १ मात्रा (ए, ओ) = गुण संधि; २ मात्राएँ (ऐ, औ) = वृद्धि संधि (मात्रा में वृद्धि)।',
      },
    ],
    quickTableHeaders: ['संधि भेद', 'मध्य-मात्रा चीट कोड', 'उदाहरण'],
    quickTableRows: [
      ['दीर्घ संधि', 'आ, ई, ऊ (बड़ी मात्रा)', 'हिम + आलय = हिमालय'],
      ['गुण संधि', 'ए, ओ, अर् (एक मात्रा)', 'सूर्य + उदय = सूर्योदय'],
      ['वृद्धि संधि', 'ऐ, औ (दो मात्राएँ)', 'एक + एक = एकैक'],
      ['यण संधि', 'आधा अक्षर + य / व', 'इति + आदि = इत्यादि'],
      ['व्यंजन संधि', 'हलंत वर्ण का परिवर्तन (त्→ज्/द्)', 'जगत् + नाथ = जगन्नाथ'],
      ['विसर्ग संधि', 'ः → स् / श् / र् / ओ', 'मनः + बल = मनोबल'],
    ],
  },
  samas: {
    moduleId: 'samas',
    chapterTitleHindi: 'समास (Compound Compression) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Samas — Expansion & Head-Word Cheat Sheet',
    coreIdeaHindi: 'समास दो शब्दों को संक्षिप्त करने की कला है। समास पहचानने का एकमात्र अचूक उपाय है: पहले शब्द का ‘विग्रह (Expansion)’ करें और देखें कौन-सा पद प्रधान है।',
    coreIdeaEnglish: 'Always expand (Vigraha) the compound first and check which half holds the dominant meaning.',
    diagnosticTestLabelHindi: 'विग्रह व पद-प्रधानता जाँच (Expansion & Dominance Test)',
    diagnosticTestLabelEnglish: 'Expand the compound to uncover hidden case markers or third-person meaning',
    keywords: [
      { keyword: 'आगे अव्यय: यथा, प्रति, आ, बे, भर, हर', identifies: 'अव्ययीभाव समास (पूर्वपद प्रधान)', example: 'यथाशक्ति (शक्ति के अनुसार)' },
      { keyword: 'विग्रह में कारक चिह्न: का, के लिए, से, में', identifies: 'तत्पुरुष समास (उत्तरपद प्रधान)', example: 'रसोईघर (रसोई के लिए घर)' },
      { keyword: 'विग्रह में ‘है जो’ या ‘के समान’', identifies: 'कर्मधारय समास (विशेषण-विशेष्य)', example: 'नीलकमल (नीला है जो कमल)' },
      { keyword: 'पहला पद संख्या (त्रि, चौ, पंच, नव) + समूह', identifies: 'द्विगु समास', example: 'चौराहा (चार राहों का समूह)' },
      { keyword: 'योजक चिह्न (-) व विग्रह में ‘और / या’', identifies: 'द्वंद्व समास (दोनों प्रधान)', example: 'माता-पिता (माता और पिता)' },
      { keyword: 'विग्रह में ‘जिसका/जिसके’ → तीसरा विशेष अर्थ', identifies: 'बहुव्रीहि समास (अन्य पद प्रधान)', example: 'पीतांबर (पीले वस्त्र हैं जिसके — श्रीकृष्ण)' },
    ],
    mechanismSteps: [
      {
        stepHindi: '१. शब्द का विग्रह करें: यदि कारक चिह्न निकले तो तत्पुरुष; यदि ‘और/या’ निकले तो द्वंद्व।',
        stepEnglish: 'Expand first: hidden case marker = Tatpurush; hidden “and/or” = Dvandva.',
      },
      {
        stepHindi: '२. संख्या दिखे तो देखें: क्या वह केवल समूह है (द्विगु: चौराहा) या किसी तीसरे विशेष व्यक्ति का नाम (बहुव्रीहि: दशानन = रावण)?',
        stepEnglish: 'If a number appears, check if it just means a group (Dvigu) or points to a unique third identity (Bahuvrihi).',
      },
    ],
    commonTraps: [
      {
        trapHindi: '‘दशानन’ या ‘चतुर्भुज’ में संख्या देखकर आँख मूँदकर द्विगु लिख देना।',
        fixHindi: 'विग्रह पर ध्यान दें: ‘दस हैं आनन जिसके (रावण)’ तीसरा अर्थ देता है, अतः बहुव्रीहि समास है।',
      },
    ],
    quickTableHeaders: ['समास भेद', 'विग्रह कीवर्ड (Cheat Code)', 'उदाहरण'],
    quickTableRows: [
      ['अव्ययीभाव', 'प्रथम पद अव्यय (यथा, प्रति, आ)', 'प्रतिदिन (हर दिन)'],
      ['तत्पुरुष', 'कारक चिह्न (का, को, से, के लिए, में)', 'देशभक्ति (देश के लिए भक्ति)'],
      ['कर्मधारय', 'है जो / रूपी / के समान', 'कमलनयन (कमल के समान नयन)'],
      ['द्विगु', 'प्रथम पद संख्या + का समूह/समाहार', 'नवरत्न (नौ रत्नों का समूह)'],
      ['द्वंद्व', 'और / तथा / या (दोनों समान)', 'रात-दिन (रात और दिन)'],
      ['बहुव्रीहि', 'जिसका/जिसके → तीसरा विशेष अर्थ', 'नीलकंठ (शिव जी)'],
    ],
  },
  sangya: {
    moduleId: 'sangya',
    chapterTitleHindi: 'संज्ञा (Nouns) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Sangya — Noun Classification Cheat Sheet',
    coreIdeaHindi: 'नाम को 3 सवालों से परखें: क्या यह अकेला विशेष नाम है (व्यक्तिवाचक)? पूरी श्रेणी है (जातिवाचक)? या केवल महसूस होने वाला गुण/अवस्था है (भाववाचक)?',
    coreIdeaEnglish: 'Test any noun with 3 questions: Unique individual name? Whole class? Intangible feeling/quality?',
    diagnosticTestLabelHindi: 'व्यक्ति-जाति-भाव त्रि-परीक्षण (Unique / Class / Feeling Test)',
    diagnosticTestLabelEnglish: 'Test whether the noun can be touched, counted as a class, or uniquely named',
    keywords: [
      { keyword: 'अकेला विशेष नाम (हिमालय, गंगा, दिल्ली)', identifies: 'व्यक्तिवाचक संज्ञा', example: 'हिमालय भारत के उत्तर में है।' },
      { keyword: 'संपूर्ण वर्ग (नदी, पर्वत, छात्र, शहर)', identifies: 'जातिवाचक संज्ञा', example: 'नदियाँ जीवन देती हैं।' },
      { keyword: 'अदृश्य भाव + ता/पन/आई/आवट/त्व', identifies: 'भाववाचक संज्ञा', example: 'ईमानदारी, बचपन, मिठास' },
      { keyword: 'माप-तौल धातु/पदार्थ (सोना, दूध, लोहा)', identifies: 'द्रव्यवाचक संज्ञा', example: 'सोना कीमती धातु है।' },
      { keyword: 'झुंड/दल (सेना, कक्षा, भीड़, गुच्छा)', identifies: 'समूहवाचक संज्ञा', example: 'भारतीय सेना वीर है।' },
    ],
    mechanismSteps: [
      { stepHindi: '१. छू/देख नहीं सकते, केवल महसूस कर सकते हैं → भाववाचक संज्ञा।', stepEnglish: 'Intangible emotion/state → Abstract Noun.' },
      { stepHindi: '२. एक ही विशेष व्यक्ति/स्थान/पुस्तक का नाम → व्यक्तिवाचक; पूरी जाति का नाम → जातिवाचक।', stepEnglish: 'One unique name → Proper; whole category → Common.' },
    ],
    commonTraps: [
      { trapHindi: '‘मीठा’ (विशेषण) और ‘मिठास’ (भाववाचक संज्ञा) में भ्रम।', fixHindi: '‘मीठा आम’ संज्ञा की विशेषता है (विशेषण), जबकि ‘मिठास’ स्वयं भाव का नाम है (भाववाचक संज्ञा)।' },
    ],
    quickTableHeaders: ['संज्ञा भेद', 'तत्काल पहचान', 'उदाहरण'],
    quickTableRows: [
      ['व्यक्तिवाचक', 'विशेष एकमात्र नाम', 'गंगा, ताजमहल, प्रेमचंद'],
      ['जातिवाचक', 'संपूर्ण वर्ग या श्रेणी', 'नदी, इमारत, लेखक'],
      ['भाववाचक', 'गुण/अवस्था (अदृश्य)', 'सच्चाई, बुढ़ापा, मित्रता'],
      ['द्रव्यवाचक', 'माप-तौल के पदार्थ', 'पानी, चाँदी, गेहूँ'],
      ['समूहवाचक', 'समुदाय या झुंड', 'कक्षा, सभा, परिवार'],
    ],
  },
  sarvanam: {
    moduleId: 'sarvanam',
    chapterTitleHindi: 'सर्वनाम (Pronouns) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Sarvanam — Pronoun Signal Cheat Sheet',
    coreIdeaHindi: 'संज्ञा की बार-बार पुनरावृत्ति रोकने वाले शब्द सर्वनाम हैं। हर भेद के अपने अचूक संकेत-शब्द (Keywords) होते हैं।',
    coreIdeaEnglish: 'Pronouns replace repeated nouns, and every Hindi pronoun subtype has clear keyword markers.',
    diagnosticTestLabelHindi: 'संकेत-शब्द भूमिका जाँच (Pronoun Role Test)',
    diagnosticTestLabelEnglish: 'Check whether the pronoun points to self, certainty, question, or relation',
    keywords: [
      { keyword: 'मैं, हम / तुम, आप / वह, वे', identifies: 'पुरुषवाचक सर्वनाम (उत्तम/मध्यम/अन्य)', example: 'मैं प्रतिदिन पढ़ता हूँ।' },
      { keyword: 'यह, वह (निश्चित वस्तु की ओर संकेत)', identifies: 'निश्चयवाचक सर्वनाम', example: 'यह मेरी पुस्तक है।' },
      { keyword: 'कोई (प्राणी), कुछ (वस्तु)', identifies: 'अनिश्चयवाचक सर्वनाम', example: 'दरवाज़े पर कोई खड़ा है।' },
      { keyword: 'जो...सो / जैसा...वैसा / जिसकी...उसकी', identifies: 'सम्बन्धवाचक सर्वनाम', example: 'जो करेगा, सो भरेगा।' },
      { keyword: 'कौन, क्या, किसे (?)', identifies: 'प्रश्नवाचक सर्वनाम', example: 'वहाँ कौन बैठा है?' },
      { keyword: 'स्वयं, खुद, अपने-आप', identifies: 'निजवाचक सर्वनाम', example: 'मैं अपना काम स्वयं करता हूँ।' },
    ],
    mechanismSteps: [
      { stepHindi: '१. यदि ‘आप’ सामने वाले को आदर देने के लिए आए = मध्यम पुरुषवाचक; यदि कर्ता के ‘स्वयं’ के अर्थ में आए = निजवाचक।', stepEnglish: '“आप” for respect = Second Person; “आप” meaning oneself = Reflexive.' },
      { stepHindi: '२. जोड़े में आकर दो उपवाक्यों को जोड़ें (जो-सो) = सम्बन्धवाचक।', stepEnglish: 'Correlative pairs linking clauses = Relative pronoun.' },
    ],
    commonTraps: [
      { trapHindi: '‘यह घर मेरा है’ में ‘यह’ को निश्चयवाचक सर्वनाम लिख देना।', fixHindi: 'जब ‘यह/वह’ ठीक संज्ञा (‘घर’) से पहले आकर उसकी ओर संकेत करे, तो वह सार्वनामिक विशेषण बन जाता है।' },
    ],
    quickTableHeaders: ['सर्वनाम भेद', 'कीवर्ड्स (Cheat Codes)', 'उदाहरण'],
    quickTableRows: [
      ['पुरुषवाचक', 'मैं, हम, तुम, आप, वह', 'तुम समय पर आओ।'],
      ['निश्चयवाचक', 'यह, वह (निश्चित संकेत)', 'वह मेरा विद्यालय है।'],
      ['अनिश्चयवाचक', 'कोई, कुछ', 'दूध में कुछ गिरा है।'],
      ['सम्बन्धवाचक', 'जो-सो, जिसकी-उसकी', 'जो परिश्रम करेगा, वह सफल होगा।'],
      ['प्रश्नवाचक', 'कौन, क्या, किसने', 'तुम क्या लिख रहे हो?'],
      ['निजवाचक', 'स्वयं, खुद, अपने-आप', 'वह अपने-आप चला गया।'],
    ],
  },
  visheshan: {
    moduleId: 'visheshan',
    chapterTitleHindi: 'विशेषण (Adjectives) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Visheshan — Adjective Question-Test Cheat Sheet',
    coreIdeaHindi: 'संज्ञा से पहले ३ जादुई प्रश्न पूछें: “कैसा?” = गुणवाचक; “कितने (गिनती)?” = संख्यावाचक; “कितना (माप-तौल)?” = परिमाणवाचक; संज्ञा से पहले सर्वनाम = सार्वनामिक।',
    coreIdeaEnglish: 'Ask the noun 3 magic questions: What kind = Quality; How many (countable) = Number; How much (measured) = Quantity.',
    diagnosticTestLabelHindi: 'कैसा / कितने / कितना जाँच (3-Question Adjective Test)',
    diagnosticTestLabelEnglish: 'Test whether the modifier describes quality, countable number, or measured quantity',
    keywords: [
      { keyword: 'कैसा? (रंग, आकार, गुण, दोष, दशा)', identifies: 'गुणवाचक विशेषण', example: 'ईमानदार बालक, नीला आकाश' },
      { keyword: 'कितने? (गिने जा सकने वाले: दो, कुछ छात्र)', identifies: 'संख्यावाचक विशेषण', example: 'कक्षा में दस छात्र हैं।' },
      { keyword: 'कितना? (माप-तौल: दो लीटर, थोड़ा पानी)', identifies: 'परिमाणवाचक विशेषण', example: 'दो किलो सेब लाओ।' },
      { keyword: 'सर्वनाम + संज्ञा (यह पुस्तक, वह घर)', identifies: 'सार्वनामिक विशेषण', example: 'यह पुस्तक बहुत रोचक है।' },
    ],
    mechanismSteps: [
      { stepHindi: '१. ‘थोड़ा/कुछ’ देखकर सीधे न चुनें — बाद वाली संज्ञा देखें: गिन सकते हैं (कुछ आम) = अनिश्चित संख्यावाचक; तौलते/नापते हैं (थोड़ा दूध) = अनिश्चित परिमाणवाचक।', stepEnglish: 'Check the noun after थोड़ा/कुछ: countable = Indefinite Numeral; uncountable/measured = Indefinite Quantitative.' },
    ],
    commonTraps: [
      { trapHindi: '‘कुछ बच्चे’ और ‘कुछ पानी’ दोनों को एक ही भेद मान लेना।', fixHindi: 'बच्चे गिने जाते हैं (अनिश्चित संख्यावाचक), जबकि पानी मापा जाता है (अनिश्चित परिमाणवाचक)।' },
    ],
    quickTableHeaders: ['विशेषण भेद', 'जाँच का प्रश्न', 'उदाहरण'],
    quickTableRows: [
      ['गुणवाचक', 'कैसा / कैसी?', 'वीर सैनिक, मधुर वाणी'],
      ['संख्यावाचक', 'कितने? (गिनती योग्य)', 'पाँच पुस्तकें, कई मित्र'],
      ['परिमाणवाचक', 'कितना? (नाप-तौल योग्य)', 'चार मीटर कपड़ा, थोड़ा नमक'],
      ['सार्वनामिक', 'कौन-सा (सर्वनाम + संज्ञा)?', 'वह बालक प्रतिभाशाली है।'],
    ],
  },
  ling: {
    moduleId: 'ling',
    chapterTitleHindi: 'लिंग (Gender) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Ling — Mera/Meri Agreement Test Cheat Sheet',
    coreIdeaHindi: 'निर्जीव वस्तुओं का लिंग रटने के बजाय उनके आगे “मेरा/मेरी” या “अच्छा/अच्छी” लगाकर बोलें — क्रिया और विशेषण तुरंत सही लिंग बता देंगे।',
    coreIdeaEnglish: 'Never memorise gender blindly: test nouns with मेरा/मेरी or अच्छा/अच्छी and natural verb agreement.',
    diagnosticTestLabelHindi: '‘मेरा / मेरी’ एवं क्रिया-मेल परीक्षण (Mera/Meri Test)',
    diagnosticTestLabelEnglish: 'Pair the noun with मेरा/मेरी + verb to hear its natural gender',
    keywords: [
      { keyword: 'देश, पर्वत, ग्रह, दिन, महीने, पेड़ (अपवाद: इमली, पृथ्वी)', identifies: 'प्रायः पुल्लिंग', example: 'भारत, हिमालय, सोमवार, आम' },
      { keyword: 'नदियाँ, भाषाएँ, लिपियाँ, तिथियाँ (अपवाद: ब्रह्मपुत्र, सोन)', identifies: 'प्रायः स्त्रीलिंग', example: 'गंगा, हिंदी, देवनागरी, पूर्णिमा' },
      { keyword: '‘वान → वती’, ‘मान → मती’, ‘अक → इका’', identifies: 'लिंग परिवर्तन सूत्र', example: 'बलवान → बलवती, लेखक → लेखिका' },
    ],
    mechanismSteps: [
      { stepHindi: '१. शब्द को छोटे वाक्य में रखें: “मेरी पुस्तक खो गई” (स्त्रीलिंग), “मेरा बस्ता भारी है” (पुल्लिंग)।', stepEnglish: 'Place the noun in a short phrase with मेरा/मेरी to verify agreement.' },
    ],
    commonTraps: [
      { trapHindi: '‘दही’ को ई-कारांत देखकर स्त्रीलिंग समझ लेना।', fixHindi: '‘दही खट्टा है’ (पुल्लिंग) — दही, घी, मोती, पानी पुल्लिंग अपवाद हैं!' },
    ],
    quickTableHeaders: ['वर्ग', 'लिंग पहचान नियम', 'उदाहरण व अपवाद'],
    quickTableRows: [
      ['नदियाँ व भाषाएँ', 'सदैव स्त्रीलिंग', 'यमुना, संस्कृत (अपवाद: ब्रह्मपुत्र)'],
      ['दिन, महीने, पर्वत', 'प्रायः पुल्लिंग', 'मंगलवार, हिमालय (अपवाद: पृथ्वी)'],
      ['प्रत्यय परिवर्तन', 'अक→इका, वान→वती', 'नायक→नायिका, गुणवान→गुणवती'],
    ],
  },
  vachan: {
    moduleId: 'vachan',
    chapterTitleHindi: 'वचन (Number) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vachan — Singular to Plural Rules Cheat Sheet',
    coreIdeaHindi: 'वचन परिवर्तन शब्द के अंतिम स्वर (आ/ई/उ/अ) और उसके लिंग पर निर्भर करता है — साथ ही कुछ शब्द सम्मान या स्वभाव से सदा बहुवचन रहते हैं।',
    coreIdeaEnglish: 'Pluralization depends on the noun’s ending vowel + gender, plus always-plural honourifics.',
    diagnosticTestLabelHindi: 'अंतिम स्वर व नित्य-बहुवचन जाँच (Ending Vowel & Always-Plural Test)',
    diagnosticTestLabelEnglish: 'Check noun gender + final vowel transformation rule',
    keywords: [
      { keyword: 'आकारांत पुल्लिंग (आ → ए)', identifies: 'पुल्लिंग बहुवचन सूत्र', example: 'लड़का → लड़के, कमरा → कमरे' },
      { keyword: 'ईकारांत स्त्रीलिंग (ई → इयाँ)', identifies: 'दीर्घ ई ह्रस्व इ में बदलती है!', example: 'नदी → नदियाँ, लड़की → लड़कियाँ' },
      { keyword: 'अकारांत स्त्रीलिंग (अ → एँ)', identifies: 'स्त्रीलिंग बहुवचन सूत्र', example: 'पुस्तक → पुस्तकें, बात → बातें' },
      { keyword: 'प्राण, आँसू, दर्शन, हस्ताक्षर, बाल, लोग', identifies: 'नित्य बहुवचन (सदा बहुवचन)', example: 'उसके आँसू निकल आए।' },
    ],
    mechanismSteps: [
      { stepHindi: '१. बड़ी ‘ई’ वाले स्त्रीलिंग शब्द का बहुवचन बनाते समय पहले ‘ई’ को छोटी ‘इ’ करें, फिर ‘याँ’ जोड़ें (नदी → नदियाँ)।', stepEnglish: 'Shorten final long ई to short इ before adding याँ (दवाई → दवाइयाँ).' },
    ],
    commonTraps: [
      { trapHindi: '‘नदी’ का बहुवचन ‘नदीयाँ’ (बड़ी ई के साथ) लिख देना।', fixHindi: 'बहुवचन में ‘याँ’ जुड़ते ही पिछली बड़ी ‘ई’ हमेशा छोटी ‘इ’ बन जाती है → ‘नदियाँ’, ‘कहानियाँ’।' },
    ],
    quickTableHeaders: ['नियम प्रकार', 'परिवर्तन सूत्र', 'सही उदाहरण'],
    quickTableRows: [
      ['आकारांत पुल्लिंग', 'आ → ए', 'पत्ता → पत्ते'],
      ['ईकारांत स्त्रीलिंग', 'ई → इयाँ', 'सखी → सखियाँ, दवाई → दवाइयाँ'],
      ['अकारांत स्त्रीलिंग', 'अ → एँ', 'आँख → आँखें, बहन → बहनें'],
      ['नित्य बहुवचन', 'रूप नहीं बदलता, क्रिया बहुवचन', 'हस्ताक्षर किए, दर्शन हुए'],
    ],
  },
  kriya: {
    moduleId: 'kriya',
    chapterTitleHindi: 'क्रिया (Verbs) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Kriya — Transitive vs Intransitive Cheat Sheet',
    coreIdeaHindi: 'क्रिया से ठीक पहले “क्या?” या “किसे?” प्रश्न पूछें — यदि सार्थक उत्तर (कर्म) मिले तो सकर्मक क्रिया, न मिले तो अकर्मक क्रिया!',
    coreIdeaEnglish: 'Ask “What?” or “Whom?” right before the verb: meaningful answer = Transitive (Sakarmak); no object = Intransitive (Akarmak).',
    diagnosticTestLabelHindi: '“क्या / किसे?” कर्म-परीक्षण (What/Whom Object Test)',
    diagnosticTestLabelEnglish: 'Ask “क्या?” or “किसे?” to the verb to detect hidden or explicit objects',
    keywords: [
      { keyword: '“क्या/किसे?” का स्पष्ट उत्तर मिले', identifies: 'सकर्मक क्रिया (Transitive)', example: 'रोहन फल खाता है। (क्या? → फल)' },
      { keyword: 'हँसना, रोना, सोना, उड़ना, दौड़ना, टहलना', identifies: 'अकर्मक क्रिया (Intransitive)', example: 'पक्षी आकाश में उड़ते हैं।' },
      { keyword: 'दो कर्म (किसे + क्या दोनों का उत्तर)', identifies: 'द्विकर्मक क्रिया', example: 'माँ ने बच्चे को दूध पिलाया।' },
      { keyword: '‘कर’ जुड़कर पहली समाप्त क्रिया', identifies: 'पूर्वकालिक क्रिया', example: 'वह खाना खाकर सो गया।' },
      { keyword: 'आना / वाना (दूसरों से करवाना)', identifies: 'प्रेरणार्थक क्रिया', example: 'पढ़ाना (प्रथम), पढ़वाना (द्वितीय)' },
    ],
    mechanismSteps: [
      { stepHindi: '१. कर्ता को उत्तर न मानें! “पक्षी उड़ते हैं” में ‘पक्षी’ कर्ता है (कौन?), कर्म (क्या?) नहीं — अतः अकर्मक।', stepEnglish: 'Don’t mistake the subject (“Who?”) for the object (“What?”).' },
    ],
    commonTraps: [
      { trapHindi: '‘वह पढ़ रहा है’ में कर्म न लिखा देखकर इसे अकर्मक मान लेना।', fixHindi: '‘क्या पढ़ रहा है?’ का संभावित उत्तर (पुस्तक/पाठ) मौजूद है, अतः ‘पढ़ना’ सकर्मक क्रिया है।' },
    ],
    quickTableHeaders: ['क्रिया भेद', 'पहचान कीवर्ड', 'उदाहरण'],
    quickTableRows: [
      ['सकर्मक क्रिया', 'क्या/किसे का उत्तर मिले', 'अनीता पत्र लिखती है।'],
      ['अकर्मक क्रिया', 'प्रभाव केवल कर्ता पर', 'शिशु सो रहा है।'],
      ['पूर्वकालिक क्रिया', 'धातु + कर (पहले की क्रिया)', 'नहाकर मंदिर गया।'],
      ['प्रेरणार्थक क्रिया', 'प्रथम (-आना), द्वितीय (-वाना)', 'माँ बच्चे को भोजन खिलवाती है।'],
    ],
  },
  avikari: {
    moduleId: 'avikari',
    chapterTitleHindi: 'अविकारी शब्द (अव्यय) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Avikari (Indeclinables) — Invariance Test Cheat Sheet',
    coreIdeaHindi: 'अव्यय = ‘न व्यय (खर्च/परिवर्तन) होने वाला’। वाक्य का लिंग, वचन या काल बदलकर देखें — जो शब्द टस से मस न हो (एक जैसा रहे), वही अविकारी है!',
    coreIdeaEnglish: 'Change the sentence’s gender, number, or tense — whichever word refuses to change its form is an Avikari (Avyay).',
    diagnosticTestLabelHindi: 'लिंग-वचन-काल अपरिवर्तन परीक्षण (Invariance Stress Test)',
    diagnosticTestLabelEnglish: 'Mutate gender/tense and observe the word stay 100% unchanged',
    keywords: [
      { keyword: 'कब, कहाँ, कैसे, कितना (क्रिया की विशेषता)', identifies: 'क्रियाविशेषण (Adverb)', example: 'धीरे-धीरे, कल, भीतर, बहुत' },
      { keyword: 'के पास, के बाहर, के साथ, की ओर', identifies: 'संबंधबोधक (Postposition)', example: 'घर के सामने बाग है।' },
      { keyword: 'और, किंतु, लेकिन, क्योंकि, या, इसलिए', identifies: 'समुच्चयबोधक (Conjunction)', example: 'बादल छाए और वर्षा हुई।' },
      { keyword: 'अरे!, वाह!, शाबाश!, हाय!, छी!', identifies: 'विस्मयादिबोधक (Interjection)', example: 'वाह! कितना सुंदर दृश्य है।' },
      { keyword: 'ही, भी, तो, तक, मात्र, भर (बल देने वाले)', identifies: 'निपात (Emphatic Particle)', example: 'तुम्हें आज ही जाना होगा।' },
    ],
    mechanismSteps: [
      { stepHindi: '१. ‘के बाहर’ (संज्ञा के बाद) = संबंधबोधक; केवल ‘बाहर बैठो’ (क्रिया के पहले) = स्थानवाचक क्रियाविशेषण।', stepEnglish: 'With के/की after a noun = Sambandhbodhak; directly modifying a verb = Kriyavisheshan.' },
    ],
    commonTraps: [
      { trapHindi: '‘वह बाहर खड़ा है’ और ‘वह घर के बाहर खड़ा है’ को एक भेद मानना।', fixHindi: '‘बाहर खड़ा है’ = क्रियाविशेषण; ‘घर के बाहर’ = संबंधबोधक अव्यय।' },
    ],
    quickTableHeaders: ['अव्यय भेद', 'पहचान कीवर्ड्स', 'उदाहरण'],
    quickTableRows: [
      ['क्रियाविशेषण', 'धीरे, तेज, कल, ऊपर, थोड़ा', 'घोड़ा तेज़ दौड़ता है।'],
      ['संबंधबोधक', 'के आगे, के नीचे, के बिना', 'पेड़ के नीचे छाया है।'],
      ['समुच्चयबोधक', 'और, परंतु, इसलिए, क्योंकि', 'मेहनत करो ताकि सफल हो।'],
      ['विस्मयादिबोधक', 'वाह!, अरे!, हे भगवान!', 'शाबाश! तुमने जीत लिया।'],
      ['निपात', 'ही, भी, तो, तक, भर', 'वह भी साथ चलेगा।'],
    ],
  },
  'pad-parichay': {
    moduleId: 'pad-parichay',
    chapterTitleHindi: 'पद-परिचय (Parsing) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Pad-Parichay — 5-Point Identity Card Cheat Sheet',
    coreIdeaHindi: 'पद-परिचय किसी रेखांकित शब्द का व्याकरणिक पहचान-पत्र है। सबसे पहले शब्द-भेद (संज्ञा/सर्वनाम/विशेषण/क्रिया/अव्यय) पकड़ें, फिर उसके ३ अनिवार्य गुण लिखें।',
    coreIdeaEnglish: 'Think of Pad-Parichay as a word’s grammar ID card: Part of Speech + Subtype + Gender/Number + Role in sentence.',
    diagnosticTestLabelHindi: 'व्याकरणिक पहचान-पत्र जाँच (Grammar ID Card Inspector)',
    diagnosticTestLabelEnglish: 'Decode Word Class → Subtype → Gender/Number → Syntactic Link',
    keywords: [
      { keyword: 'संज्ञा पद', identifies: 'भेद + लिंग + वचन + कारक + क्रिया से संबंध', example: '‘राम’ = व्यक्तिवाचक संज्ञा, पुल्लिंग, एकवचन, कर्ता कारक' },
      { keyword: 'सर्वनाम पद', identifies: 'भेद + पुरुष + लिंग + वचन + कारक', example: '‘मैं’ = उत्तम पुरुषवाचक सर्वनाम, एकवचन, कर्ता' },
      { keyword: 'विशेषण पद', identifies: 'भेद + लिंग + वचन + विशेष्य का नाम', example: '‘सुंदर’ = गुणवाचक विशेषण, विशेष्य ‘फूल’' },
      { keyword: 'क्रिया पद', identifies: 'सकर्मक/अकर्मक + काल + वाच्य + लिंग + वचन', example: '‘लिखता है’ = सकर्मक क्रिया, वर्तमान काल, कर्तृवाच्य' },
      { keyword: 'अव्यय पद', identifies: 'अव्यय भेद + किस क्रिया/शब्द से संबंध (लिंग-वचन नहीं!)', example: '‘धीरे-धीरे’ = रीतिवाचक क्रियाविशेषण अव्यय' },
    ],
    mechanismSteps: [
      { stepHindi: '१. एक ही शब्द वाक्य के अनुसार बदल जाता है: ‘अच्छा’ = गुणवाचक विशेषण (‘अच्छा लड़का’), या क्रियाविशेषण (‘अच्छा गाया’), या विस्मयादिबोधक (‘अच्छा! तुम आ गए’)।', stepEnglish: 'Always judge a word by its job inside the given sentence, never in isolation.' },
    ],
    commonTraps: [
      { trapHindi: 'अव्यय शब्द के पद-परिचय में भी लिंग और वचन लिख देना।', fixHindi: 'अव्यय अविकारी होते हैं — उनके परिचय में लिंग/वचन नहीं लिखा जाता।' },
    ],
    quickTableHeaders: ['पद का वर्ग', 'अनिवार्य ३-४ बिंदु', 'त्वरित उदाहरण'],
    quickTableRows: [
      ['संज्ञा', 'भेद, लिंग, वचन, कारक', 'पुस्तक = जातिवाचक, स्त्री., एकव., कर्म'],
      ['विशेषण', 'भेद, लिंग, वचन, विशेष्य', 'लाल = गुणवाचक, ‘गुलाब’ का विशेषण'],
      ['क्रिया', 'भेद, काल, वाच्य, लिंग, वचन', 'गया = अकर्मक, भूतकाल, पुल्लिंग, एकव.'],
      ['अव्यय', 'अव्यय भेद व क्रिया-संबंध', 'प्रतिदिन = कालवाचक क्रियाविशेषण'],
    ],
  },
  'viram-chinh': {
    moduleId: 'viram-chinh',
    chapterTitleHindi: 'विराम-चिह्न (Punctuation) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Viram-Chinh — Pause Duration & Meaning Cheat Sheet',
    coreIdeaHindi: 'विराम-चिह्न भाषा के ट्रैफ़िक सिग्नल हैं — ये बताते हैं कहाँ थोड़ा रुकना (,), कहाँ आधा रुकना (;), कहाँ पूरा रुकना (।) और कहाँ भाव या प्रश्न प्रकट करना है।',
    coreIdeaEnglish: 'Punctuation marks are traffic signals of Hindi prose — controlling pause length, quotation, and emotion.',
    diagnosticTestLabelHindi: 'विराम-अंतराल व अर्थ-परिवर्तन जाँच (Pause & Meaning Shift Test)',
    diagnosticTestLabelEnglish: 'Compare how moving or swapping a mark transforms sentence meaning',
    keywords: [
      { keyword: '। (पूर्ण विराम)', identifies: 'साधारण वाक्य की समाप्ति', example: 'मैं विद्यालय जाता हूँ।' },
      { keyword: ', (अल्प विराम)', identifies: 'सबसे छोटा ठहराव / सूची', example: 'रोको मत, जाने दो। बनाम रोको, मत जाने दो।' },
      { keyword: '; (अर्ध विराम)', identifies: 'अल्प विराम से अधिक, पूर्ण से कम ठहराव', example: 'सूर्योदय हुआ; अंधकार मिट गया।' },
      { keyword: '? / !', identifies: 'प्रश्नवाचक / विस्मयादिबोधक', example: 'क्या तुम पढ़ रहे हो? / वाह! कमाल कर दिया!' },
      { keyword: '“ ” (उद्धरण चिह्न)', identifies: 'किसी के कहे शब्दों को ज्यों-का-त्यों लिखना', example: 'गांधीजी ने कहा, “सत्य ही ईश्वर है।”' },
      { keyword: '- (योजक) बनाम — (निर्देशक)', identifies: 'शब्द जोड़ना (-) बनाम संवाद/विवरण (—)', example: 'माता-पिता (योजक); नियम — आगे पढ़ें।' },
    ],
    mechanismSteps: [
      { stepHindi: '१. ‘रोको, मत जाने दो’ बनाम ‘रोको मत, जाने दो’ — एक अल्पविराम पूरा अर्थ उलट देता है।', stepEnglish: 'Comma placement directly shifts logical grouping and meaning.' },
    ],
    commonTraps: [
      { trapHindi: 'योजक (-) और निर्देशक (—) चिह्न को एक समझ लेना।', fixHindi: 'योजक छोटा होता है और दो शब्दों (सुख-दुख) को जोड़ता है; निर्देशक लंबा होता है और उदाहरण/संवाद से पहले आता है।' },
    ],
    quickTableHeaders: ['चिह्न', 'नाम', 'कब प्रयोग करें'],
    quickTableRows: [
      ['।', 'पूर्ण विराम', 'कथन वाक्य पूरा होने पर'],
      [',', 'अल्प विराम', 'सूची, संबोधन या छोटे ठहराव पर'],
      ['?', 'प्रश्नवाचक', 'प्रश्न पूछने पर'],
      ['!', 'विस्मयादिबोधक', 'हर्ष, शोक, आश्चर्य या संबोधन पर'],
      ['“ ”', 'दोहरा उद्धरण', 'प्रत्यक्ष कथन (Direct Quote) में'],
      ['( )', 'कोष्ठक', 'अर्थ स्पष्ट करने या अतिरिक्त जानकारी में'],
    ],
  },
  'vartani-shuddhi': {
    moduleId: 'vartani-shuddhi',
    chapterTitleHindi: 'वर्तनी शुद्धि (Spelling Accuracy) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vartani Shuddhi — Phonetic & Matra Rules Cheat Sheet',
    coreIdeaHindi: 'हिंदी एक ध्वन्यात्मक (Phonetic) भाषा है — जैसा शुद्ध उच्चारण होता है, वैसा ही लिखा जाता है। अधिकांश अशुद्धियाँ मात्रा (इ/ई, उ/ऊ), संयुक्ताक्षर और ‘इक’ प्रत्यय से होती हैं।',
    coreIdeaEnglish: 'Most Hindi spelling errors come from 4 predictable rules: इ/ई length, इक-suffix vowel rise, रेफ़ (र्) placement, and श/ष/स.',
    diagnosticTestLabelHindi: 'उच्चारण व मात्रा नियम जाँच (Matra & Phonetic Rule Inspector)',
    diagnosticTestLabelEnglish: 'Compare common wrong form vs rule-backed standard spelling',
    keywords: [
      { keyword: 'कवयित्री (कविइत्री नहीं!)', identifies: 'अति-महत्वपूर्ण बोर्ड शब्द', example: 'महादेवी वर्मा प्रसिद्ध कवयित्री थीं।' },
      { keyword: 'उज्ज्वल (दोनों ज आधे: ज्ज्व)', identifies: 'उत् + ज्वल (व्यंजन संधि)', example: 'आपका भविष्य उज्ज्वल हो।' },
      { keyword: 'आशीर्वाद (रेफ़ ‘वा’ पर, ‘शी’ पर नहीं)', identifies: 'रेफ़ (र्) अगले अक्षर के ऊपर चढ़ता है', example: 'बड़ों का आशीर्वाद अनमोल है।' },
      { keyword: 'सामाजिक / व्यावहारिक / ऐतिहासिक', identifies: '‘इक’ प्रत्यय से पहला स्वर दीर्घ', example: 'समाज + इक = सामाजिक' },
    ],
    mechanismSteps: [
      { stepHindi: '१. रेफ़ (र्) नियम: जहाँ ‘र्’ की ध्वनि सुनाई दे, रेफ़ ठीक उसके अगले पूर्ण अक्षर के सिर पर लगता है (आशी + र् + वाद = आशीर्वाद)।', stepEnglish: 'Ref (र्) always sits atop the NEXT full consonant after where the “r” sound is heard.' },
      { stepHindi: '२. संधि से जाँचें: ‘उत् + ज्वल = उज्ज्वल’ (इसलिए दोनों ज् आधे हैं)।', stepEnglish: 'Check Sandhi roots to confirm doubled half-consonants.' },
    ],
    commonTraps: [
      { trapHindi: '‘आर्शीवाद’, ‘कविइत्री’, ‘उज्वल’, ‘त्यौहार’ जैसी आम वर्तनी गलतियाँ।', fixHindi: 'शुद्ध रूप: आशीर्वाद, कवयित्री, उज्ज्वल, त्योहार (एक मात्रा), श्रीमती (बड़ी ई)।' },
    ],
    quickTableHeaders: ['अशुद्ध (गलत)', 'शुद्ध (सही)', 'तार्किक कारण'],
    quickTableRows: [
      ['आर्शीवाद', 'आशीर्वाद', '‘र्’ की ध्वनि ‘वा’ से पहले है'],
      ['कविइत्री', 'कवयित्री', 'कवि → कवयित्री मानक रूप'],
      ['उज्वल', 'उज्ज्वल', 'उत् + ज्वल = ज् + ज् + व'],
      ['समाजिक', 'सामाजिक', '‘इक’ प्रत्यय से आदि स्वर दीर्घ'],
      ['त्यौहार', 'त्योहार', 'मानक हिंदी में ‘ओ’ की एक मात्रा'],
    ],
  },
  'vakya-shuddhi': {
    moduleId: 'vakya-shuddhi',
    chapterTitleHindi: 'वाक्य शुद्धि (Sentence Correction) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vakya Shuddhi — 5-Point Error Detector Cheat Sheet',
    coreIdeaHindi: 'अशुद्ध वाक्य को ठीक करने के लिए ५ बिंदुओं का स्कैन चलाएँ: १. लिंग-वचन मेल, २. कारक चिह्न (‘ने’/‘को’), ३. पुनरुक्ति (एक अर्थ के दो शब्द), ४. पदक्रम, ५. उचित क्रिया।',
    coreIdeaEnglish: 'Run a 5-point diagnostic scan: Gender/Number agreement, Karak marker, Redundancy, Word order, and Accurate verb.',
    diagnosticTestLabelHindi: '५-बिंदु वाक्य त्रुटि स्कैनर (5-Point Error Scanner)',
    diagnosticTestLabelEnglish: 'Detect redundancy, agreement clash, or wrong postposition',
    keywords: [
      { keyword: 'पुनरुक्ति दोष (कृपया...की कृपा, केवल...मात्र)', identifies: 'एक ही अर्थ के दो शब्द हटाएँ', example: '‘कृपया आने की कृपा करें’ → ‘कृपया पधारें’' },
      { keyword: 'लिंग-वचन दोष (मेरे को / अनेकों)', identifies: '‘अनेक’ स्वयं बहुवचन है; ‘मेरे को’ → ‘मुझे’', example: '‘अनेकों लोग’ → ‘अनेक लोग’' },
      { keyword: 'पदक्रम दोष (एक फूलों की माला)', identifies: 'विशेषण सही संज्ञा के पास रखें', example: '‘फूलों की एक माला’' },
      { keyword: 'कारक दोष (मैंने जाना है)', identifies: '‘ने’ केवल सकर्मक भूतकाल में', example: '‘मुझे जाना है’' },
    ],
    mechanismSteps: [
      { stepHindi: '१. वाक्य में ‘अनेकों’, ‘मेरे को’, ‘तेरे को’, ‘वापस लौट’, ‘सज्जन पुरुष’ दिखते ही तुरंत पकड़ लें — ये सबसे आम परीक्षा त्रुटियाँ हैं।', stepEnglish: 'Spot classic redundancy & colloquial traps immediately (अनेकों→अनेक, मेरे को→मुझे).' },
    ],
    commonTraps: [
      { trapHindi: '‘एक गरम कप चाय दो’ को सही समझ लेना।', fixHindi: 'कप गरम नहीं, चाय गरम है! शुद्ध पदक्रम: ‘गरम चाय का एक कप दो’।' },
    ],
    quickTableHeaders: ['दोष का प्रकार', 'अशुद्ध वाक्य', 'शुद्ध वाक्य'],
    quickTableRows: [
      ['वचन दोष', 'वहाँ अनेकों पक्षी थे।', 'वहाँ अनेक पक्षी थे।'],
      ['पुनरुक्ति दोष', 'वह वापस लौट आया।', 'वह लौट आया।'],
      ['सर्वनाम दोष', 'मेरे को बाज़ार जाना है।', 'मुझे बाज़ार जाना है।'],
      ['पदक्रम दोष', 'एक फूलों की माला लाओ।', 'फूलों की एक माला लाओ।'],
    ],
  },
};

// Map alias & extended class modules to dedicated rich cheat notes or build tailored ones from module data
const EXTENDED_CHEAT_OVERRIDES: Partial<Record<string, Partial<ChapterCheatNoteData>>> = {
  'kriya-kaal': {
    ...CHAPTER_CHEAT_NOTES.kaal,
    moduleId: 'kriya-kaal',
    chapterTitleHindi: 'क्रिया व काल (Verbs & Tenses) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Kriya & Kaal — Action & Time Cheat Codes',
  },
  'vakya-ashuddhi': {
    ...CHAPTER_CHEAT_NOTES['vakya-shuddhi'],
    moduleId: 'vakya-ashuddhi',
  },
  'vakya-vichar': {
    ...CHAPTER_CHEAT_NOTES.vakya,
    moduleId: 'vakya-vichar',
    chapterTitleHindi: 'वाक्य-विचार (उद्देश्य-विधेय व भेद) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vakya Vichar — Subject, Predicate & Sentence Types',
  },
  'vakya-parivartan': {
    ...CHAPTER_CHEAT_NOTES.vakya,
    moduleId: 'vakya-parivartan',
    chapterTitleHindi: 'वाक्य परिवर्तन (Transformation) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vakya Parivartan — Meaning-Preserving Transformation Guide',
  },
  paryayvachi: {
    moduleId: 'paryayvachi',
    chapterTitleHindi: 'पर्यायवाची शब्द (Synonyms) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Paryayvachi — Root-Family Word Map',
    coreIdeaHindi: 'पर्यायवाची रटने की बजाय ‘मूल शब्द परिवार’ से याद करें! जैसे ‘जल’ के पर्यायवाची के पीछे ‘ज’ (जन्मा) जोड़ने से कमल, ‘द’ (देने वाला) जोड़ने से बादल, और ‘धि’ (धारण करने वाला) जोड़ने से समुद्र बनता है!',
    coreIdeaEnglish: 'Master dozens of synonyms with 1 root formula: Water + ज = Lotus, Water + द = Cloud, Water + धि = Ocean!',
    diagnosticTestLabelHindi: 'शब्द-परिवार व्युत्पत्ति सूत्र (Root-Family Formula)',
    diagnosticTestLabelEnglish: 'Decode synonym families using ज / द / धि suffixes',
    keywords: [
      { keyword: 'जल/नीर/वारि/अंबु + ज (जन्मा)', identifies: 'कमल के पर्यायवाची', example: 'जलज, नीरज, वारिज, अंबुज' },
      { keyword: 'जल/नीर/वारि/अंबु + द (देने वाला)', identifies: 'बादल के पर्यायवाची', example: 'जलद, नीरद, वारिद, अंबुद' },
      { keyword: 'जल/नीर/वारि/अंबु + धि (भंडार)', identifies: 'समुद्र के पर्यायवाची', example: 'जलधि, नीरधि, वारिधि, अंबुधि' },
      { keyword: 'रात (निशा/रजनी) + कर (करने वाला)', identifies: 'चंद्रमा के पर्यायवाची', example: 'निशाकर, रजनीकर, शशि, इंदु' },
    ],
    mechanismSteps: [
      { stepHindi: '१. एक मूल समूह (जल, नीर, वारि, तोय) याद करते ही आपको कमल, बादल और समुद्र के १५+ पर्यायवाची स्वतः मिल जाते हैं।', stepEnglish: 'Memorizing 4 water roots unlocks 16+ synonyms for lotus, cloud, and ocean.' },
    ],
    commonTraps: [
      { trapHindi: '‘जलज’ (कमल) और ‘जलद’ (बादल) को आपस में बदल देना।', fixHindi: '‘ज’ = जन्म लेना (पानी में जन्मा = कमल); ‘द’ = देना (पानी देने वाला = बादल)।' },
    ],
    quickTableHeaders: ['मूल परिवार', 'सूत्र (Cheat Code)', 'बने पर्यायवाची'],
    quickTableRows: [
      ['कमल', 'पानी + ज (जन्म)', 'जलज, पंकज, नीरज, वारिज'],
      ['बादल', 'पानी + द (देना)', 'जलद, नीरद, वारिद, मेघ'],
      ['समुद्र', 'पानी + धि (धारण)', 'जलधि, वारिधि, सागर, रत्नाकर'],
      ['सूर्य', 'दिन + कर / भास्कर', 'दिनकर, दिवाकर, रवि, भानु'],
    ],
  },
  vilom: {
    moduleId: 'vilom',
    chapterTitleHindi: 'विलोम शब्द (Antonyms) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Vilom Shabd — Matching Register & Prefix Rules',
    coreIdeaHindi: 'विलोम शब्द का स्वर्णिम नियम: तत्सम शब्द का विलोम तत्सम में, तद्भव का तद्भव में और संज्ञा का विलोम संज्ञा में ही होना चाहिए!',
    coreIdeaEnglish: 'Golden rule of Antonyms: Match the exact word class and register (Sanskrit-root ↔ Sanskrit-root, everyday ↔ everyday).',
    diagnosticTestLabelHindi: 'उपसर्ग व शब्द-वर्ग संतुलन जाँच (Prefix & Register Match)',
    diagnosticTestLabelEnglish: 'Match Tatsam↔Tatsam and apply opposite prefixes (सु↔दुर्, अ/अन)',
    keywords: [
      { keyword: 'अ / अन् उपसर्ग', identifies: 'सीधा विपरीत अर्थ', example: 'ज्ञान→अज्ञान, आदर→अनादर' },
      { keyword: 'सु ↔ दुर् / कु', identifies: 'अच्छा बनाम बुरा जोड़ा', example: 'सुगम→दुर्गम, सुपुत्र→कुपुत्र' },
      { keyword: 'स ↔ निर् / वि', identifies: 'सहित बनाम रहित जोड़ा', example: 'सजीव→निर्जीव, सार्थक→निरर्थक' },
      { keyword: 'तत्सम ↔ तत्सम नियम', identifies: 'शैली-समानता नियम', example: '‘रात्रि’ का ‘दिवस’ (दिन नहीं); ‘रात’ का ‘दिन’' },
    ],
    mechanismSteps: [
      { stepHindi: '१. पहले शब्द का स्तर देखें: यदि ‘तिमिर’ (तत्सम) पूछा जाए तो विलोम ‘आलोक/प्रकाश’ होगा, ‘उजाला’ नहीं।', stepEnglish: 'Always preserve Sanskrit vs Hindi register when selecting an antonym.' },
    ],
    commonTraps: [
      { trapHindi: '‘अनुराग’ का विलोम ‘घृणा’ लिख देना।', fixHindi: '‘अनु’ का सटीक विपरीत उपसर्ग ‘वि’ है → ‘अनुराग ↔ विराग’, ‘प्रेम ↔ घृणा’।' },
    ],
    quickTableHeaders: ['उपसर्ग जोड़ा', 'तर्क', 'उदाहरण'],
    quickTableRows: [
      ['अ / अन्', 'नकारात्मक उपसर्ग', 'सत्य↔असत्य, उत्तीर्ण↔अनुत्तीर्ण'],
      ['सु ↔ दुर्', 'उत्तम बनाम कठिन', 'सुलभ↔दुर्लभ, सुगंध↔दुर्गंध'],
      ['स ↔ निर्', 'सहित बनाम रहित', 'सबल↔निर्बल, साकार↔निराकार'],
      ['आ ↔ प्र / वि', 'आगमन बनाम प्रस्थान', 'आदान↔प्रदान, अनुकूल↔प्रतिकूल'],
    ],
  },
  'anek-shabd': {
    moduleId: 'anek-shabd',
    chapterTitleHindi: 'अनेक शब्दों के लिए एक शब्द — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'One-Word Substitution — Suffix Decoding Cheat Sheet',
    coreIdeaHindi: 'वाक्यांश को एक शब्द में बदलने के लिए संस्कृत मूल-प्रत्यय पहचानें: ‘ज्ञ’ = जानने वाला, ‘दर्शी’ = देखने वाला, ‘गामी’ = जाने वाला, ‘अ’ = नहीं।',
    coreIdeaEnglish: 'Decode one-word substitutions by root endings: ज्ञ (knower), दर्शी (seer), गामी (goer), अ (not).',
    diagnosticTestLabelHindi: 'संक्षिप्त मूल-प्रत्यय संश्लेषण (Root-Ending Synthesis)',
    diagnosticTestLabelEnglish: 'Combine concept core + Sanskrit agent ending',
    keywords: [
      { keyword: 'अंत में ‘ज्ञ’ (जानने वाला)', identifies: 'ज्ञान-आधारित शब्द', example: 'सर्वज्ञ (सब जानने वाला), अल्पज्ञ (कम जानने वाला)' },
      { keyword: 'अंत में ‘दर्शी’ (देखने वाला)', identifies: 'दृष्टि-आधारित शब्द', example: 'दूरदर्शी (दूर की सोचने वाला), पारदर्शी' },
      { keyword: 'अंत में ‘अ / अन्’ (न होने वाला)', identifies: 'निषेधवाचक एक शब्द', example: 'अमर (जो न मरे), अजेय (जिसे जीता न जा सके)' },
      { keyword: '‘इक’ (काल-आधारित)', identifies: 'समय अंतराल शब्द', example: 'दैनिक (प्रतिदिन), साप्ताहिक, पाक्षिक, मासिक, वार्षिक' },
    ],
    mechanismSteps: [
      { stepHindi: '१. वाक्यांश का मुख्य क्रिया-भाव पकड़ें (जानना→ज्ञ, देखना→दर्शी, विश्वास करना→आस्तिक/नास्तिक)।', stepEnglish: 'Extract the core action in the phrase and snap the matching Sanskrit root ending.' },
    ],
    commonTraps: [
      { trapHindi: '‘कृतज्ञ’ (उपकार मानने वाला) और ‘कृतघ्न’ (उपकार न मानने वाला) में उलझना।', fixHindi: '‘ज्ञ’ = जानने/मानने वाला (कृतज्ञ); ‘घ्न’ = नष्ट करने/भुलाने वाला (कृतघ्न)।' },
    ],
    quickTableHeaders: ['अंतिम चिह्न', 'अर्थ', 'उदाहरण'],
    quickTableRows: [
      ['-ज्ञ', 'जानने वाला', 'सर्वज्ञ, मर्मज्ञ, कृतज्ञ'],
      ['-दर्शी', 'देखने वाला', 'दूरदर्शी, समदर्शी, पारदर्शी'],
      ['-वादी', 'मानने/बोलने वाला', 'आशावादी, निराशावादी, सत्यवादी'],
      ['अ- / नि-', 'रहित / नहीं', 'अदृश्य, निराकार, अद्वितीय'],
    ],
  },
  anekarthi: {
    moduleId: 'anekarthi',
    chapterTitleHindi: 'अनेकार्थी शब्द (Homonyms) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Anekarthi — Context-Driven Meaning Cheat Sheet',
    coreIdeaHindi: 'एक ही शब्द अलग-अलग प्रसंग (वाक्य) में भिन्न अर्थ देता है। प्रसंग की अन्य संज्ञाओं और क्रिया से सटीक अर्थ पहचाना जाता है।',
    coreIdeaEnglish: 'The same word unlocks different meanings depending on surrounding context clues in the sentence.',
    diagnosticTestLabelHindi: 'प्रसंग-आधारित अर्थ रूपांतरण (Context Meaning Switcher)',
    diagnosticTestLabelEnglish: 'Inspect how sentence context activates a specific meaning of the same word',
    keywords: [
      { keyword: 'कनक', identifies: 'सोना (धातु), धतूरा, गेहूँ', example: 'कनक के गहने बनाम कनक का पौधा' },
      { keyword: 'अंबर', identifies: 'आकाश, वस्त्र (कपड़ा)', example: 'नीला अंबर बनाम पीतांबर (पीले वस्त्र)' },
      { keyword: 'कर', identifies: 'हाथ, टैक्स (शुल्क), किरण', example: 'कर जोड़कर प्रणाम / आय-कर भरना' },
      { keyword: 'अंक', identifies: 'गोद, संख्या (नंबर), नाटक का भाग', example: 'माँ के अंक में शिशु / परीक्षा में अच्छे अंक' },
    ],
    mechanismSteps: [
      { stepHindi: '१. शब्द के ठीक साथ आए विशेषण या क्रिया को पढ़ें — वही तय करता है कि ‘उत्तर’ दिशा है या जवाब।', stepEnglish: 'Read the neighbouring verb/adjective to lock the exact intended meaning.' },
    ],
    commonTraps: [
      { trapHindi: 'पर्यायवाची और अनेकार्थी को एक समझ लेना।', fixHindi: 'पर्यायवाची = एक अर्थ के अनेक शब्द (जल, नीर); अनेकार्थी = एक शब्द के अनेक अलग अर्थ (अंबर = आकाश, वस्त्र)।' },
    ],
    quickTableHeaders: ['अनेकार्थी शब्द', 'अर्थ १', 'अर्थ २'],
    quickTableRows: [
      ['अंबर', 'आकाश', 'वस्त्र'],
      ['कनक', 'सोना', 'धतूरा / गेहूँ'],
      ['उत्तर', 'एक दिशा', 'प्रश्न का जवाब'],
      ['पत्र', 'पत्ता', 'चिट्ठी'],
      ['कर', 'हाथ', 'टैक्स / किरण'],
    ],
  },
  shrutisam: {
    moduleId: 'shrutisam',
    chapterTitleHindi: 'श्रुतिसम भिन्नार्थक शब्द — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Shrutisam Bhinnarthak — Sound-Alike Distinction Guide',
    coreIdeaHindi: 'सुनने में लगभग समान किंतु एक मात्रा या अक्षर के अंतर से बिल्कुल भिन्न अर्थ देने वाले शब्द! हर जोड़े के अक्षर में छिपा अंतर याद रखें।',
    coreIdeaEnglish: 'Words that sound nearly identical differ by one vowel/consonant — anchor each pair to a tiny visual cue.',
    diagnosticTestLabelHindi: 'एक-अक्षर ध्वनि-अंतर जाँच (Minimal-Pair Sound Inspector)',
    diagnosticTestLabelEnglish: 'Compare the single-letter difference that flips the entire meaning',
    keywords: [
      { keyword: 'अनल (आग) ↔ अनिल (हवा)', identifies: '‘इ’ की मात्रा = हवा (नील आकाश की हवा)', example: 'अनल की लपटें / शीतल अनिल' },
      { keyword: 'कुल (वंश/योग) ↔ कूल (किनारा)', identifies: 'बड़ा ‘ऊ’ = लंबा नदी का किनारा', example: 'कुल का गौरव / नदी का कूल' },
      { keyword: 'दिन (दिवस) ↔ दीन (गरीब)', identifies: 'बड़ी ‘ई’ = दीन-दुखी (गरीब)', example: 'शुभ दिन / दीन की सहायता' },
      { keyword: 'ओर (दिशा) ↔ और (तथा)', identifies: '१ मात्रा = दिशा; २ मात्रा = जोड़ना', example: 'पूर्व की ओर / राम और श्याम' },
    ],
    mechanismSteps: [
      { stepHindi: '१. छोटी/बड़ी मात्रा से अर्थ जोड़ें: ‘दिन’ (छोटा ‘इ’ = समय का दिन), ‘दीन’ (बड़ी ‘ई’ = गरीब)।', stepEnglish: 'Link the vowel length to a memorable visual cue so you never mix pairs.' },
    ],
    commonTraps: [
      { trapHindi: '‘गृह’ (घर) और ‘ग्रह’ (नक्षत्र) को लिखते समय ऋ (ृ) और र (्र) बदल देना।', fixHindi: 'गृह = घर (गृहकार्य); ग्रह = पृथ्वी/मंगल आदि खगोलीय पिंड।' },
    ],
    quickTableHeaders: ['शब्द १ (अर्थ)', 'शब्द २ (अर्थ)', 'याद रखने का चीट कोड'],
    quickTableRows: [
      ['अनल (आग)', 'अनिल (हवा)', '‘नि’ से नीला आकाश → हवा'],
      ['कुल (वंश/जोड़)', 'कूल (किनारा)', 'लंबा ‘ऊ’ = लंबा तट'],
      ['दिन (दिवस)', 'दीन (गरीब)', 'दीन-दुखी में बड़ी ई'],
      ['गृह (घर)', 'ग्रह (नक्षत्र)', 'गृहकार्य = घर का काम'],
      ['अंश (भाग)', 'अंस (कंधा)', '‘श’ = हिस्सा (भाग)'],
    ],
  },
  'shabd-vichar': {
    moduleId: 'shabd-vichar',
    chapterTitleHindi: 'शब्द-विचार (तत्सम, तद्भव, रूढ़-यौगिक) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Shabd Vichar — Etymology & Structure Cheat Codes',
    coreIdeaHindi: 'उत्पत्ति के आधार पर संस्कृत के मूल शब्द ‘तत्सम’ और सरल हुए हिंदी रूप ‘तद्भव’ कहलाते हैं। कुछ विशेष अक्षर (क्ष, त्र, ज्ञ, ऋ, ष्) देखते ही तत्सम पहचाना जा सकता है!',
    coreIdeaEnglish: 'Spot Sanskrit-origin Tatsam words instantly via signature letters (क्ष, त्र, ज्ञ, ऋ, ष्, श्) vs simplified Tadbhav forms.',
    diagnosticTestLabelHindi: 'अक्षर-चिह्न व उत्पत्ति जाँच (Etymology Signature Test)',
    diagnosticTestLabelEnglish: 'Detect Tatsam, Tadbhav, Deshaj, and Videshaj markers',
    keywords: [
      { keyword: 'क्ष, त्र, ज्ञ, ऋ, ष्, व, संयुक्ताक्षर', identifies: 'तत्सम शब्द (संस्कृत से ज्यों-का-त्यों)', example: 'अग्नि, क्षेत्र, रात्रि, दुग्ध, चंद्र' },
      { keyword: 'चंद्रबिंदु (ँ), सरल तद्भव रूप', identifies: 'तद्भव शब्द (बदला हुआ हिंदी रूप)', example: 'आग, खेत, रात, दूध, चाँद' },
      { keyword: 'स्थानीय बोलियों के शब्द', identifies: 'देशज शब्द', example: 'लोटा, पगड़ी, खिड़की, थैला' },
      { keyword: 'अंग्रेज़ी/अरबी/फ़ारसी शब्द', identifies: 'विदेशी (आगत) शब्द', example: 'स्कूल, किताब, डॉक्टर, स्टेशन' },
    ],
    mechanismSteps: [
      { stepHindi: '१. चंद्रबिंदु (ँ) वाला शब्द लगभग हमेशा तद्भव होता है (चाँद, दाँत, आँख), जबकि अनुस्वार/संयुक्ताक्षर तत्सम (चंद्र, दंत, अक्षि)।', stepEnglish: 'Chandrabindu (ँ) strongly signals Tadbhav; conjuncts/क्ष/त्र/ऋ signal Tatsam.' },
    ],
    commonTraps: [
      { trapHindi: '‘योगरूढ़’ और ‘यौगिक’ में अंतर भूल जाना।', fixHindi: 'यौगिक = सामान्य जुड़ा अर्थ (पाठशाला); योगरूढ़ = जुड़कर विशेष तीसरा अर्थ (पंकज = केवल कमल, बहुव्रीहि जैसे)।' },
    ],
    quickTableHeaders: ['शब्द वर्ग', 'पहचान कीवर्ड', 'उदाहरण'],
    quickTableRows: [
      ['तत्सम', 'संस्कृत मूल (क्ष, त्र, ऋ, व)', 'सूर्य, कर्म, क्षेत्र, ग्राम'],
      ['तद्भव', 'सरल हिंदी (चंद्रबिंदु ँ, ख, ब)', 'सूरज, काम, खेत, गाँव'],
      ['देशज', 'लोक-बोली में जन्मे', 'पगड़ी, झोला, डिबिया'],
      ['विदेशी', 'अन्य भाषाओं से आए', 'कागज़, रेल, चाकू, पेन'],
    ],
  },
  'visheshan-nirman': {
    moduleId: 'visheshan-nirman',
    chapterTitleHindi: 'विशेषण निर्माण (Adjective Formation) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Visheshan Nirman — Suffix-Driven Adjective Builder',
    coreIdeaHindi: 'संज्ञा, सर्वनाम या क्रिया में ‘इक, ई, इत, ईय, मान, वान, इला’ प्रत्यय जोड़कर विशेषण बनाए जाते हैं। ‘इक’ प्रत्यय हमेशा पहले स्वर को दीर्घ करता है।',
    coreIdeaEnglish: 'Transform nouns into adjectives with predictable suffixes (इक, इत, ईय, वान) — remember इक lengthens the opening vowel.',
    diagnosticTestLabelHindi: 'संज्ञा → विशेषण रूपांतरण जाँच (Noun-to-Adjective Transformer)',
    diagnosticTestLabelEnglish: 'Inspect the suffix and initial vowel change producing the adjective',
    keywords: [
      { keyword: '+ इक (प्रथम स्वर दीर्घ)', identifies: 'अ→आ, इ→ऐ, उ→औ', example: 'दिन→दैनिक, धर्म→धार्मिक, उद्योग→औद्योगिक' },
      { keyword: '+ इत', identifies: 'संज्ञा से गुणवाचक विशेषण', example: 'पुष्प→पुष्पित, सम्मान→सम्मानित, आनंद→आनंदित' },
      { keyword: '+ ईय / ईन', identifies: 'संबंध-सूचक विशेषण', example: 'भारत→भारतीय, राष्ट्र→राष्ट्रीय, ग्राम→ग्रामीण' },
      { keyword: '+ वान / मान', identifies: 'युक्त होने के अर्थ में', example: 'धन→धनवान, बुद्धि→बुद्धिमान' },
    ],
    mechanismSteps: [
      { stepHindi: '१. बने हुए शब्द के बाद कोई संज्ञा रखकर पढ़ें (“धार्मिक पुस्तक”, “भारतीय संस्कृति”) — यदि सटीक बैठे तो विशेषण शुद्ध है।', stepEnglish: 'Place a noun right after your constructed word to confirm it functions naturally as an adjective.' },
    ],
    commonTraps: [
      { trapHindi: '‘इतिहास + इक’ को ‘इतिहासिक’ लिख देना।', fixHindi: '‘इ’ का ‘ऐ’ बनता है → सही विशेषण ‘ऐतिहासिक’ है।' },
    ],
    quickTableHeaders: ['संज्ञा (मूल)', 'प्रत्यय', 'शुद्ध विशेषण'],
    quickTableRows: [
      ['इतिहास', '+ इक', 'ऐतिहासिक'],
      ['भूगोल', '+ इक', 'भौगोलिक'],
      ['संस्कृति', '+ इक', 'सांस्कृतिक'],
      ['सम्मान', '+ इत', 'सम्मानित'],
      ['भारत', '+ ईय', 'भारतीय'],
    ],
  },
  'shabd-bhandar': {
    moduleId: 'shabd-bhandar',
    chapterTitleHindi: 'शब्द भंडार (Vocabulary Matrix) — चीट कोड्स व नोट्स',
    chapterTitleEnglish: 'Shabd Bhandar — Synonyms, Antonyms & Idioms Toolkit',
    coreIdeaHindi: 'शब्द भंडार के चार स्तंभ हैं: पर्यायवाची (समान अर्थ), विलोम (विपरीत अर्थ), अनेकार्थी (एक शब्द, अनेक अर्थ) और वाक्यांश के लिए एक शब्द।',
    coreIdeaEnglish: 'Master vocabulary via 4 structural pillars: Synonyms, Antonyms, Context Homonyms, and One-Word Substitutions.',
    diagnosticTestLabelHindi: 'शब्द-संबंध तर्क परीक्षण (Word Relationship Analyzer)',
    diagnosticTestLabelEnglish: 'Inspect root meaning, opposite pair, or context shift',
    keywords: [
      { keyword: 'पर्यायवाची', identifies: 'समान अर्थ देने वाले शब्द', example: 'सूर्य = दिनकर, रवि, भास्कर' },
      { keyword: 'विलोम', identifies: 'उल्टा अर्थ (समान वर्ग में)', example: 'अनुकूल ↔ प्रतिकूल' },
      { keyword: 'अनेकार्थी', identifies: 'प्रसंग से बदलता अर्थ', example: 'अंबर = आकाश / वस्त्र' },
      { keyword: 'एक शब्द', identifies: 'पूरे वाक्यांश का संक्षिप्त रूप', example: 'जो सब जानता हो = सर्वज्ञ' },
    ],
    mechanismSteps: [
      { stepHindi: '१. किसी भी नए शब्द को अकेले न रटें — उसके साथ १ पर्यायवाची और १ विलोम जोड़कर त्रिकोण बनाएँ।', stepEnglish: 'Learn every word as a triangle: Word + 1 Synonym + 1 Antonym.' },
    ],
    commonTraps: [
      { trapHindi: 'समान ध्वनि वाले शब्दों (अनल/अनिल) को पर्यायवाची मान लेना।', fixHindi: 'अनल = आग और अनिल = हवा — ये श्रुतिसम भिन्नार्थक हैं, पर्यायवाची नहीं।' },
    ],
    quickTableHeaders: ['श्रेणी', 'मुख्य पहचान', 'उदाहरण'],
    quickTableRows: [
      ['पर्यायवाची', 'अर्थ समान', 'कमल = जलज, पंकज, नीरज'],
      ['विलोम', 'अर्थ विपरीत', 'उदय ↔ अस्त, सरल ↔ कठिन'],
      ['एक शब्द', 'संक्षिप्त अभिव्यक्ति', 'जिसका अंत न हो = अनंत'],
      ['श्रुतिसम', 'ध्वनि समान, अर्थ भिन्न', 'दिन (दिवस) / दीन (गरीब)'],
    ],
  },
};

export function getChapterCheatNote(
  moduleId: string,
  moduleObj?: GrammarModule
): ChapterCheatNoteData {
  if (CHAPTER_CHEAT_NOTES[moduleId]) {
    return CHAPTER_CHEAT_NOTES[moduleId];
  }
  const override = EXTENDED_CHEAT_OVERRIDES[moduleId];
  if (override && override.keywords && override.mechanismSteps && override.quickTableRows) {
    return override as ChapterCheatNoteData;
  }

  // Fallback builder using the GrammarModule's own rulesSummary & paramparaCorner
  const titleHi = moduleObj?.titleHindi || moduleId;
  const titleEn = moduleObj?.titleEnglish || moduleId;
  const rules = moduleObj?.rulesSummary || [];

  return {
    moduleId,
    chapterTitleHindi: `${titleHi} — चीट कोड्स व नोट्स`,
    chapterTitleEnglish: `${titleEn} — Cheat Codes & Notes`,
    coreIdeaHindi:
      moduleObj?.paramparaCorner?.definitionHindi ||
      moduleObj?.whatStudentGainsHindi ||
      'इस अध्याय के मूल नियम और तार्किक पहचान सूत्र नीचे दिए गए हैं।',
    coreIdeaEnglish:
      moduleObj?.paramparaCorner?.definitionEnglish ||
      moduleObj?.whatStudentGainsEnglish ||
      'Key mechanisms and quick-identification rules for this chapter.',
    diagnosticTestLabelHindi: 'तार्किक नियम व उदाहरण परीक्षण (Logic & Pattern Test)',
    diagnosticTestLabelEnglish: 'Inspect pattern, rule, and reasoning behind every specimen',
    keywords:
      rules.length > 0
        ? rules.map((r, i) => ({
            keyword: `नियम ${i + 1}`,
            identifies: r.ruleHindi,
            example: r.exampleHindi,
          }))
        : [
            {
              keyword: 'मुख्य सूत्र',
              identifies: moduleObj?.bottleneckHindi || 'वाक्य में शब्द की भूमिका जाँचें',
              example: moduleObj?.paramparaCorner?.classicalShlokaOrRule || 'उदाहरण का अभ्यास करें',
            },
          ],
    mechanismSteps:
      rules.length > 0
        ? rules.map((r, i) => ({
            stepHindi: `${i + 1}. ${r.ruleHindi}`,
            stepEnglish: r.ruleEnglish,
          }))
        : [
            {
              stepHindi: '१. पहले उदाहरण की संरचना ध्यान से देखें और उसका मुख्य चिह्न पहचानें।',
              stepEnglish: 'Observe the structural clue in the example first.',
            },
          ],
    commonTraps: [
      {
        trapHindi: moduleObj?.bottleneckHindi || 'केवल रटे हुए उदाहरण पर निर्भर रहना।',
        fixHindi:
          moduleObj?.whatStudentGainsHindi ||
          'हमेशा वाक्य के संदर्भ और व्याकरणिक कारण को परखकर उत्तर तय करें।',
      },
    ],
    quickTableHeaders: ['नियम बिंदु', 'मुख्य पहचान', 'उदाहरण'],
    quickTableRows:
      rules.length > 0
        ? rules.map((r, i) => [`सूत्र ${i + 1}`, r.ruleHindi, r.exampleHindi])
        : [[titleHi, moduleObj?.subtitleHindi || 'मुख्य अवधारणा', moduleObj?.paramparaCorner?.classicalShlokaOrRule || '—']],
  };
}
