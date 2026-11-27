import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Loader2, 
  BookOpen, 
  Trophy,
  Info,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';
import { UpsargPratyayWord, QuizQuestion, GradeLevel, SavedReportSummary } from '../types';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { buildWorksheetReport, toSavedReportSummary } from '../utils/worksheetReport';
import { WorksheetReportCard } from './WorksheetReportCard';

interface UpsargPratyayStudioProps {
  grade: GradeLevel;
  wordCoins: number;
  onAddWordCoins: (coins: number) => void;
  bilingualMode: boolean;
  onOpenWorksheets: () => void;
  onRecordWrongAnswer?: (topicOrId: string, topicNameHindi?: string, topicNameEnglish?: string, questionText?: string) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
}

// Built-in verified word bank for instant client-side generation (0ms latency fallback & instant view)
const AFFIX_PRESET_BANK: Record<string, Array<{ root: string; word: string; meaningHindi: string; meaningEnglish: string; ex: string }>> = {
  'अनु': [
    { root: 'रूप', word: 'अनुरूप', meaningHindi: 'समान, अनुकूल, अनुसार', meaningEnglish: 'Matching / suitable', ex: 'यह कार्य आपके पद के अनुरूप है।' },
    { root: 'शासन', word: 'अनुशासन', meaningHindi: 'नियम-पालन, आत्म-नियंत्रण', meaningEnglish: 'Discipline', ex: 'छात्रों को अनुशासन का पालन करना चाहिए।' },
    { root: 'वाद', word: 'अनुवाद', meaningHindi: 'एक भाषा से दूसरी भाषा में रूपांतरण', meaningEnglish: 'Translation', ex: 'उसने इस पुस्तक का हिंदी में अनुवाद किया।' },
    { root: 'भव', word: 'अनुभव', meaningHindi: 'तजुर्बा, जीवन से मिली सीख', meaningEnglish: 'Experience', ex: 'बुजुर्गों का अनुभव बहुत मूल्यवान होता है।' },
    { root: 'राग', word: 'अनुराग', meaningHindi: 'गहरा प्रेम, प्रीति', meaningEnglish: 'Deep affection', ex: 'मीराबाई को कृष्ण से गहरा अनुराग था।' },
    { root: 'सार', word: 'अनुसार', meaningHindi: 'मुताबिक, अनुकूल', meaningEnglish: 'According to', ex: 'समय सारणी के अनुसार अध्ययन करें।' },
    { root: 'गमन', word: 'अनुगमन', meaningHindi: 'पीछे-पीछे चलना, अनुसरण', meaningEnglish: 'Following behind', ex: 'शिष्य ने गुरु के मार्ग का अनुगमन किया।' },
    { root: 'करण', word: 'अनुकरण', meaningHindi: 'नकल करना, सीखकर दोहराना', meaningEnglish: 'Imitation', ex: 'छोटे बच्चे बड़ों का अनुकरण करते हैं।' },
    { root: 'चर', word: 'अनुचर', meaningHindi: 'सेवक, साथ चलने वाला', meaningEnglish: 'Attendant / follower', ex: 'राजा के साथ अनेक अनुचर चल रहे थे।' },
    { root: 'क्रम', word: 'अनुक्रम', meaningHindi: 'सिलसिला, क्रमवार व्यवस्था', meaningEnglish: 'Sequence', ex: 'रोल नंबर को अनुक्रम में लिखें।' },
    { root: 'मान', word: 'अनुमान', meaningHindi: 'अंदाज़ा, कयास', meaningEnglish: 'Estimation / guess', ex: 'उसका मौसम का अनुमान सही निकला।' },
    { root: 'कूल', word: 'अनुकूल', meaningHindi: 'माफिक, हितकर', meaningEnglish: 'Favorable', ex: 'यह मौसम स्वास्थ्य के अनुकूल है।' },
    { root: 'मोदन', word: 'अनुमोदन', meaningHindi: 'स्वीकृति, सहमति', meaningEnglish: 'Approval', ex: 'प्रस्ताव को सर्वसम्मति से अनुमोदन मिला।' },
    { root: 'कंपा', word: 'अनुकंपा', meaningHindi: 'दया, विशेष कृपा', meaningEnglish: 'Compassion', ex: 'उन्हें अनुकंपा के आधार पर नियुक्ति मिली।' },
    { root: 'लेख', word: 'अनुलेख', meaningHindi: 'लिखावट का सुंदर अभ्यास', meaningEnglish: 'Transcription', ex: 'प्रतिदिन एक पृष्ठ अनुलेख लिखना चाहिए।' },
  ],
  'प्र': [
    { root: 'गति', word: 'प्रगति', meaningHindi: 'आगे बढ़ना, उन्नति', meaningEnglish: 'Progress', ex: 'भारत विज्ञान के क्षेत्र में तीव्र प्रगति कर रहा है।' },
    { root: 'सिद्ध', word: 'प्रसिद्ध', meaningHindi: 'विख्यात, नामचीन', meaningEnglish: 'Famous', ex: 'ताजमहल विश्व प्रसिद्ध ऐतिहासिक धरोहर है।' },
    { root: 'योग', word: 'प्रयोग', meaningHindi: 'व्यवहार, इस्तेमाल, परीक्षण', meaningEnglish: 'Usage / experiment', ex: 'वैज्ञानिकों ने प्रयोगशाला में नया प्रयोग किया।' },
    { root: 'बल', word: 'प्रबल', meaningHindi: 'अत्यधिक शक्तिशाली', meaningEnglish: 'Strong / mighty', ex: 'उसकी जीतने की इच्छा बहुत प्रबल थी।' },
    { root: 'धान', word: 'प्रधान', meaningHindi: 'मुख्य, सबसे महत्वपूर्ण', meaningEnglish: 'Chief / primary', ex: 'गाँव के प्रधान ने स्वच्छता अभियान चलाया।' },
    { root: 'हार', word: 'प्रहार', meaningHindi: 'चोट, प्रहार', meaningEnglish: 'Strike / blow', ex: 'सैनिक ने शत्रु के वार पर करारा प्रहार किया।' },
    { root: 'माण', word: 'प्रमाण', meaningHindi: 'सबूत, साक्ष्य', meaningEnglish: 'Proof / evidence', ex: 'सत्य को किसी बाह्य प्रमाण की आवश्यकता नहीं होती।' },
    { root: 'यत्न', word: 'प्रयत्न', meaningHindi: 'कोशिश, उद्यम', meaningEnglish: 'Effort', ex: 'सफलता पाने के लिए निरंतर प्रयत्न आवश्यक है।' },
    { root: 'भाव', word: 'प्रभाव', meaningHindi: 'असर, रुतबा', meaningEnglish: 'Impact / influence', ex: 'अच्छी संगति का गहरा प्रभाव पड़ता है।' },
    { root: 'देश', word: 'प्रदेश', meaningHindi: 'राज्य, क्षेत्र', meaningEnglish: 'Province / region', ex: 'राजस्थान भारत का क्षेत्रफल में बड़ा प्रदेश है।' },
  ],
  'अधि': [
    { root: 'कार', word: 'अधिकार', meaningHindi: 'हक, स्वामित्व, प्रभुत्व', meaningEnglish: 'Right / authority', ex: 'शिक्षा पाना प्रत्येक बालक का मौलिक अधिकार है।' },
    { root: 'नायक', word: 'अधिनायक', meaningHindi: 'सर्वोच्च नेता, शासक', meaningEnglish: 'Supreme leader', ex: 'जन-गण-मन में भारत भाग्य विधाता को अधिनायक कहा गया है।' },
    { root: 'पति', word: 'अधिपति', meaningHindi: 'स्वामी, राजा', meaningEnglish: 'Sovereign lord', ex: 'वह संपूर्ण भूभाग के अधिपति बने।' },
    { root: 'भार', word: 'अधिभार', meaningHindi: 'अतिरिक्त कर या शुल्क', meaningEnglish: 'Surcharge', ex: 'विलंब से बिल भरने पर अधिभार लगेगा।' },
    { root: 'नियम', word: 'अधिनियम', meaningHindi: 'संसद द्वारा पारित कानून', meaningEnglish: 'Act / legislation', ex: 'संसद ने नया शिक्षा अधिनियम पारित किया।' },
    { root: 'वक्ता', word: 'अधिवक्ता', meaningHindi: 'वकील, कानून विशेषज्ञ', meaningEnglish: 'Advocate / lawyer', ex: 'अधिवक्ता ने न्यायालय में न्याय की गुहार लगाई।' },
    { root: 'राज्य', word: 'अधिराज्य', meaningHindi: 'विशाल साम्राज्य', meaningEnglish: 'Dominion / empire', ex: 'सम्राट अशोक का अधिराज्य चारों दिशाओं में फैला था।' },
    { root: 'शुल्क', word: 'अधिशुल्क', meaningHindi: 'अतिरिक्त महसूल', meaningEnglish: 'Excess duty', ex: 'विदेशी आयात पर अधिशुल्क लगाया गया।' },
  ],
  'अप': [
    { root: 'मान', word: 'अपमान', meaningHindi: 'अनादर, बेइज्जती', meaningEnglish: 'Insult / disrespect', ex: 'हमें किसी का भी अपमान नहीं करना चाहिए।' },
    { root: 'शब्द', word: 'अपशब्द', meaningHindi: 'गाली, बुरे वचन', meaningEnglish: 'Abusive words', ex: 'क्रोध में भी अपशब्द बोलने से बचें।' },
    { root: 'यश', word: 'अपयश', meaningHindi: 'बदनामी, अकीर्ति', meaningEnglish: 'Infamy / dishonor', ex: 'गलत संगति से व्यक्ति को अपयश मिलता है।' },
    { root: 'वाद', word: 'अपवाद', meaningHindi: 'नियम से अलग स्थिति', meaningEnglish: 'Exception', ex: 'प्रत्येक व्याकरण नियम का कोई न कोई अपवाद होता है।' },
    { root: 'व्यय', word: 'अपव्यय', meaningHindi: 'फिजूलखर्ची', meaningEnglish: 'Wasteful expense', ex: 'धन का अपव्यय करने वाले बाद में पछताते हैं।' },
    { root: 'हरण', word: 'अपहरण', meaningHindi: 'जबरन उठा ले जाना', meaningEnglish: 'Abduction', ex: 'पुलिस ने अपहरणकर्ताओं को तत्काल पकड़ लिया।' },
  ],
  'सु': [
    { root: 'पुत्र', word: 'सुपुत्र', meaningHindi: 'सदाचारी बेटा', meaningEnglish: 'Virtuous son', ex: 'श्रवण कुमार अपने माता-पिता के सुपुत्र थे।' },
    { root: 'विचार', word: 'सुविचार', meaningHindi: 'अच्छे व नेक विचार', meaningEnglish: 'Noble thoughts', ex: 'प्रतिदिन सुबह एक सुविचार पढ़ना चाहिए।' },
    { root: 'गंध', word: 'सुगंध', meaningHindi: 'मनभावन खुशबू', meaningEnglish: 'Pleasant fragrance', ex: 'उपवन में खिले मोगरे की सुगंध मन मोह रही है।' },
    { root: 'मार्ग', word: 'सुमार्ग', meaningHindi: 'सच्चा व नेक रास्ता', meaningEnglish: 'Righteous path', ex: 'महापुरुषों के उपदेश हमें सुमार्ग पर चलाते हैं।' },
    { root: 'डोल', word: 'सुडौल', meaningHindi: 'सुंदर गठन वाला', meaningEnglish: 'Well-proportioned', ex: 'नियमित योग और व्यायाम से शरीर सुडौल बनता है।' },
    { root: 'गम', word: 'सुगम', meaningHindi: 'जहाँ जाना आसान हो, सरल', meaningEnglish: 'Accessible / easy', ex: 'पक्की सड़क बनने से पहाड़ी यात्रा सुगम हो गई।' },
    { root: 'मति', word: 'सुमति', meaningHindi: 'सद्बुद्धि, अच्छी सोच', meaningEnglish: 'Good sense / wisdom', ex: 'जहाँ सुमति तहाँ संपत्ति नाना।' },
    { root: 'लभ', word: 'सुलभ', meaningHindi: 'आसानी से प्राप्त होने वाला', meaningEnglish: 'Easily available', ex: 'आजकल इंटरनेट पर ज्ञान सुलभ है।' },
  ],
  'वि': [
    { root: 'ज्ञान', word: 'विज्ञान', meaningHindi: 'विशिष्ट ज्ञान, क्रमबद्ध शोध', meaningEnglish: 'Science', ex: 'विज्ञान ने मानव जीवन को बहुत सरल बना दिया है।' },
    { root: 'शेष', word: 'विशेष', meaningHindi: 'खास, असाधारण', meaningEnglish: 'Special / unique', ex: 'आज के उत्सव के लिए विशेष प्रबंध किए गए हैं।' },
    { root: 'देश', word: 'विदेश', meaningHindi: 'दूसरा मुल्क, परदेस', meaningEnglish: 'Foreign country', ex: 'वह उच्च शिक्षा प्राप्त करने विदेश गया है।' },
    { root: 'पक्ष', word: 'विपक्ष', meaningHindi: 'विरोधी दल या मत', meaningEnglish: 'Opposition', ex: 'लोकतंत्र में विपक्ष की भूमिका महत्वपूर्ण होती है।' },
    { root: 'शुद्ध', word: 'विशुद्ध', meaningHindi: 'एकदम पवित्र, मिलावट रहित', meaningEnglish: 'Pure / unadulterated', ex: 'यह विशुद्ध देशी घी की मिठाई है।' },
    { root: 'जय', word: 'विजय', meaningHindi: 'जीत, फतह', meaningEnglish: 'Victory', ex: 'सत्य की हमेशा विजय होती है।' },
    { root: 'कास', word: 'विकास', meaningHindi: 'उन्नति, फैलाव', meaningEnglish: 'Development / growth', ex: 'गाँव का चौतरफा विकास हो रहा है।' },
    { root: 'भाग', word: 'विभाग', meaningHindi: 'कार्यालय का अंग, अनुभाग', meaningEnglish: 'Department', ex: 'उन्होंने शिक्षा विभाग में आवेदन दिया।' },
  ],
  'ता': [
    { root: 'सुन्दर', word: 'सुन्दरता', meaningHindi: 'सुन्दर होने का भाव या गुण', meaningEnglish: 'Beauty', ex: 'कश्मीर की प्राकृतिक सुन्दरता सबको लुभाती है।' },
    { root: 'सफल', word: 'सफलता', meaningHindi: 'कामयाबी, विजय', meaningEnglish: 'Success', ex: 'कड़ा परिश्रम ही जीवन में सफलता दिलाता है।' },
    { root: 'मानव', word: 'मानवता', meaningHindi: 'इंसानियत, परोपकार', meaningEnglish: 'Humanity', ex: 'संकट में दूसरों की सहायता करना ही मानवता है।' },
    { root: 'मित्र', word: 'मित्रता', meaningHindi: 'दोस्ती का पवित्र भाव', meaningEnglish: 'Friendship', ex: 'कृष्ण और सुदामा की मित्रता अमर है।' },
    { root: 'कठिन', word: 'कठिनता', meaningHindi: 'मुश्किल होने की अवस्था', meaningEnglish: 'Difficulty', ex: 'धैर्य रखने से कठिनता भी सुगमता में बदल जाती है।' },
    { root: 'योग्य', word: 'योग्यता', meaningHindi: 'काबिलियत, क्षमता', meaningEnglish: 'Capability / merit', ex: 'उसने अपनी प्रतिभा और योग्यता से प्रथम स्थान पाया।' },
    { root: 'सरल', word: 'सरलता', meaningHindi: 'सहजता, सादगी', meaningEnglish: 'Simplicity', ex: 'गांधीजी का संपूर्ण जीवन सरलता का संदेश देता है।' },
    { root: 'महान', word: 'महानता', meaningHindi: 'बड़प्पन, उच्च आदर्श', meaningEnglish: 'Greatness', ex: 'दूसरों की गलतियों को क्षमा करने में ही महानता है।' },
    { root: 'सज्जन', word: 'सज्जनता', meaningHindi: 'नेक व भद्र स्वभाव', meaningEnglish: 'Gentleness / nobility', ex: 'उनकी सज्जनता देखकर सभी प्रभावित हुए।' },
    { root: 'मधुर', word: 'मधुरता', meaningHindi: 'मीठापन, कोमलता', meaningEnglish: 'Sweetness', ex: 'कोयल की वाणी में अनूठी मधुरता होती है।' },
    { root: 'शीतल', word: 'शीतलता', meaningHindi: 'ठंडक, शांति', meaningEnglish: 'Coolness', ex: 'चंद्रमा की किरणें मन को शीतलता प्रदान करती हैं।' },
    { root: 'वीर', word: 'वीरता', meaningHindi: 'बहादुरी, शौर्य', meaningEnglish: 'Bravery / valor', ex: 'रानी लक्ष्मीबाई ने युद्ध में अद्भुत वीरता दिखाई।' },
    { root: 'निर्मल', word: 'निर्मलता', meaningHindi: 'स्वच्छता, निष्कपटता', meaningEnglish: 'Purity', ex: 'गंगाजल की निर्मलता सभी को आकर्षित करती है।' },
    { root: 'सत्य', word: 'सत्यता', meaningHindi: 'सच्चाई, प्रामाणिकता', meaningEnglish: 'Truthfulness', ex: 'जाँच के बाद इस खबर की सत्यता प्रमाणित हुई।' },
    { root: 'अधीन', word: 'अधीनता', meaningHindi: 'गुलामी, परतंत्रता', meaningEnglish: 'Subordination', ex: 'क्रांतिकारियों ने विदेशी अधीनता स्वीकार नहीं की।' },
  ],
  'इक': [
    { root: 'धर्म', word: 'धार्मिक', meaningHindi: 'धर्म संबंधी, आस्थावान', meaningEnglish: 'Religious', ex: 'यह स्थल अत्यंत पवित्र और धार्मिक है।' },
    { root: 'समाज', word: 'सामाजिक', meaningHindi: 'समाज से जुड़ा हुआ', meaningEnglish: 'Social', ex: 'हमें सामाजिक कुरीतियों को मिलकर समाप्त करना चाहिए।' },
    { root: 'इतिहास', word: 'ऐतिहासिक', meaningHindi: 'इतिहास से संबंधित', meaningEnglish: 'Historical', ex: 'कुतुबमीनार भारत का एक प्रसिद्ध ऐतिहासिक स्मारक है।' },
    { root: 'वर्ष', word: 'वार्षिक', meaningHindi: 'साल में एक बार होने वाला', meaningEnglish: 'Annual', ex: 'विद्यालय का वार्षिक उत्सव धूमधाम से मनाया गया।' },
    { root: 'मास', word: 'मासिक', meaningHindi: 'महीने से जुड़ा हुआ', meaningEnglish: 'Monthly', ex: 'यह पत्रिका मासिक आधार पर प्रकाशित होती है।' },
    { root: 'अर्थ', word: 'आर्थिक', meaningHindi: 'धन व वित्त संबंधी', meaningEnglish: 'Economic', ex: 'देश की आर्थिक स्थिति में निरंतर सुधार हो रहा है।' },
    { root: 'दिन', word: 'दैनिक', meaningHindi: 'प्रतिदिन होने वाला', meaningEnglish: 'Daily', ex: 'दैनिक समाचार पत्र पढ़ने से सामान्य ज्ञान बढ़ता है।' },
    { root: 'नीति', word: 'नैतिक', meaningHindi: 'सदाचार व मूल्यों से जुड़ा', meaningEnglish: 'Moral', ex: 'बच्चों को बचपन से नैतिक शिक्षा देनी चाहिए।' },
    { root: 'विज्ञान', word: 'वैज्ञानिक', meaningHindi: 'विज्ञान संबंधी या अन्वेषक', meaningEnglish: 'Scientific / scientist', ex: 'वैज्ञानिक सोच हमें अंधविश्वास से दूर रखती है।' },
    { root: 'भूगोल', word: 'भौगोलिक', meaningHindi: 'भूमि व प्रकृति संबंधी', meaningEnglish: 'Geographical', ex: 'भारत की भौगोलिक संरचना में पर्वत व नदियाँ हैं।' },
  ],
  'आवट': [
    { root: 'लिख', word: 'लिखावट', meaningHindi: 'लिखने का ढंग, सुलेख', meaningEnglish: 'Handwriting', ex: 'उसकी लिखावट मोती के समान सुंदर है।' },
    { root: 'सजा', word: 'सजावट', meaningHindi: 'सजाने की कला या रूप', meaningEnglish: 'Decoration', ex: 'दीपावली पर पूरे घर की भव्य सजावट की गई।' },
    { root: 'बना', word: 'बनावट', meaningHindi: 'रचना, संरचना, गठन', meaningEnglish: 'Texture / construction', ex: 'इस कश्मीरी शॉल की बनावट अत्यंत बारीक है।' },
    { root: 'थक', word: 'थकावट', meaningHindi: 'थकने की अनुभूति, क्लांति', meaningEnglish: 'Tiredness / fatigue', ex: 'दिनभर दौड़धूप करने से उसे थकावट हो गई।' },
    { root: 'मिला', word: 'मिलावट', meaningHindi: 'अशुद्ध मिश्रण', meaningEnglish: 'Adulteration', ex: 'खाद्य पदार्थों में मिलावट करना दंडनीय अपराध है।' },
    { root: 'रुक', word: 'रुकावट', meaningHindi: 'बाधा, अवरोध', meaningEnglish: 'Obstacle / hindrance', ex: 'धैर्यवान मनुष्य किसी भी रुकावट से नहीं डरता।' },
    { root: 'दिख', word: 'दिखावट', meaningHindi: 'दिखावा, बाह्य प्रदर्शन', meaningEnglish: 'Show / display', ex: 'सच्चे संतों के जीवन में दिखावट नहीं होती।' },
    { root: 'गिर', word: 'गिरावट', meaningHindi: 'नीचे आना, मूल्य में कमी', meaningEnglish: 'Decline / drop', ex: 'बाजार के भावों में अचानक गिरावट आई।' },
  ],
  'ईय': [
    { root: 'भारत', word: 'भारतीय', meaningHindi: 'भारत देश का निवासी', meaningEnglish: 'Indian', ex: 'हमें अपनी समृद्ध भारतीय संस्कृति पर गर्व है।' },
    { root: 'राष्ट्र', word: 'राष्ट्रीय', meaningHindi: 'राष्ट्र से संबंधित', meaningEnglish: 'National', ex: 'तिरंगा हमारा गौरवशाली राष्ट्रीय ध्वज है।' },
    { root: 'मानव', word: 'मानवीय', meaningHindi: 'मनुष्यता के अनुकूल', meaningEnglish: 'Human / humane', ex: 'युद्ध पीड़ितों की सहायता मानवीय कर्तव्य है।' },
    { root: 'स्वर्ग', word: 'स्वर्गीय', meaningHindi: 'स्वर्गवासी, दिवंगत', meaningEnglish: 'Heavenly / late', ex: 'स्वर्गीय दादाजी की सीख सदैव याद रहती है।' },
    { root: 'नाटक', word: 'नाटकीय', meaningHindi: 'नाटक जैसा, चौंकाने वाला', meaningEnglish: 'Dramatic', ex: 'मैच के अंतिम क्षणों में नाटकीय मोड़ आया।' },
    { root: 'प्रांत', word: 'प्रांतीय', meaningHindi: 'राज्य या इलाके से जुड़ा', meaningEnglish: 'Provincial', ex: 'यह प्रांतीय स्तर की वाद-विवाद प्रतियोगिता है।' },
  ],
  'वान / मान': [
    { root: 'धन', word: 'धनवान', meaningHindi: 'पैसे वाला, समृद्ध', meaningEnglish: 'Wealthy', ex: 'वह जितना धनवान है, उतना ही दयालु भी है।' },
    { root: 'गुण', word: 'गुणवान', meaningHindi: 'सद्गुणों से युक्त', meaningEnglish: 'Virtuous', ex: 'गुणवान व्यक्ति का सर्वत्र आदर होता है।' },
    { root: 'बल', word: 'बलवान', meaningHindi: 'ताकतवर, शूरवीर', meaningEnglish: 'Strong / mighty', ex: 'हनुमान जी अत्यंत बलवान और पराक्रमी हैं।' },
    { root: 'भाग्य', word: 'भाग्यवान', meaningHindi: 'किस्मत वाला', meaningEnglish: 'Fortunate / lucky', ex: 'सच्चे मित्र मिलना भाग्यवान होने की निशानी है।' },
    { root: 'बुद्धि', word: 'बुद्धिमान', meaningHindi: 'अकलमंद, चतुर', meaningEnglish: 'Intelligent', ex: 'बीरबल अकबर के दरबार के सबसे बुद्धिमान मंत्री थे।' },
    { root: 'दया', word: 'दयावान', meaningHindi: 'कृपा करने वाला', meaningEnglish: 'Kind-hearted', ex: 'राजा हरिश्चंद्र अत्यंत दयावान थे।' },
  ],
  'दार': [
    { root: 'समझ', word: 'समझदार', meaningHindi: 'अकलमंद, सुलझा हुआ', meaningEnglish: 'Sensible', ex: 'वह कठिन परिस्थितियों में भी समझदार निर्णय लेता है।' },
    { root: 'चमक', word: 'चमकदार', meaningHindi: 'रोशन, दीप्तिमान', meaningEnglish: 'Shiny / sparkling', ex: 'आसमान में तारा अत्यंत चमकदार दिख रहा है।' },
    { root: 'हवा', word: 'हवादार', meaningHindi: 'जहाँ स्वच्छ वायु आती हो', meaningEnglish: 'Airy / ventilated', ex: 'यह कमरा बहुत खुला और हवादार है।' },
    { root: 'ईमान', word: 'ईमानदार', meaningHindi: 'सच्चा, कर्तव्यनिष्ठ', meaningEnglish: 'Honest', ex: 'ईमानदार व्यक्ति कभी सिर झुकाकर नहीं जीता।' },
    { root: 'असर', word: 'असरदार', meaningHindi: 'प्रभावशाली', meaningEnglish: 'Effective', ex: 'यह आयुर्वेदिक दवा खांसी में बहुत असरदार है।' },
  ]
};

// Helper to construct exact word count synchronously so table is NEVER empty
function buildLocalAffixData(
  morphemeType: 'upsarg' | 'pratyay',
  affix: string,
  count: number
) {
  const isPratyay = morphemeType === 'pratyay';
  const cleanAffix = affix.trim() || (isPratyay ? 'ता' : 'अनु');

  let bank = AFFIX_PRESET_BANK[cleanAffix];
  if (!bank) {
    const defaultRoots = isPratyay
      ? ['सुन्दर', 'सफल', 'मानव', 'कठिन', 'सरल', 'योग्य', 'महान', 'निर्मल', 'सत्य', 'वीर', 'मधुर', 'शीतल', 'दीन', 'प्रभु', 'सज्जन']
      : ['ज्ञान', 'कार', 'बल', 'भाव', 'रूप', 'वाद', 'मति', 'देश', 'योग', 'मान', 'गति', 'गमन', 'सार', 'शासन', 'हार'];

    bank = defaultRoots.map((r) => ({
      root: r,
      word: isPratyay ? `${r}${cleanAffix}` : `${cleanAffix}${r}`,
      meaningHindi: isPratyay ? `${r} होने का भाव या गुण` : `${cleanAffix} भाव से युक्त ${r}`,
      meaningEnglish: isPratyay ? `Quality or state of ${r}` : `${cleanAffix} combined with ${r}`,
      ex: isPratyay ? `उसने ${r}${cleanAffix} का अनुपम परिचय दिया।` : `${cleanAffix}${r} से कार्य सिद्ध हुआ।`
    }));
  }

  const words: UpsargPratyayWord[] = [];
  for (let i = 0; i < count; i++) {
    const item = bank[i % bank.length];
    // if index exceeds bank length, give unique variation
    const wordForm = i >= bank.length ? (isPratyay ? `${item.root}_${i+1}${cleanAffix}` : `${cleanAffix}${item.root}_${i+1}`) : item.word;
    words.push({
      word: wordForm,
      rootWord: item.root,
      affix: cleanAffix,
      breakupFormula: isPratyay ? `${item.root} + ${cleanAffix} = ${wordForm}` : `${cleanAffix} + ${item.root} = ${wordForm}`,
      meaningHindi: item.meaningHindi,
      meaningEnglish: item.meaningEnglish,
      sentenceExampleHindi: item.ex,
      sentenceExampleEnglish: `Illustrative sentence for '${wordForm}'.`
    });
  }

  const sampleWord = words[0];
  const sampleWord2 = words[1] || words[0];
  const sampleWord3 = words[2] || words[0];
  const sampleWord4 = words[3] || words[1] || words[0];
  const sampleWord5 = words[4] || words[2] || words[0];

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `'${sampleWord.word}' शब्द में मूल शब्द (Root Word) क्या है?`,
      questionEnglish: `What is the root word in '${sampleWord.word}'?`,
      options: [
        { textHindi: sampleWord.rootWord, textEnglish: 'Root Word' },
        { textHindi: cleanAffix, textEnglish: 'Affix' },
        { textHindi: words[2]?.rootWord || 'शब्द', textEnglish: 'Alternative' },
        { textHindi: 'कोई नहीं', textEnglish: 'None of these' }
      ],
      correctIndex: 0,
      explanationHindi: `'${sampleWord.word}' में मूल शब्द '${sampleWord.rootWord}' है और '${cleanAffix}' ${isPratyay ? 'प्रत्यय' : 'उपसर्ग'} है।`,
      explanationEnglish: `In '${sampleWord.word}', the root is '${sampleWord.rootWord}' and '${cleanAffix}' is the ${isPratyay ? 'suffix' : 'prefix'}.`
    },
    {
      id: 'q2',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `'${cleanAffix}' व्याकरण की दृष्टि से क्या है?`,
      questionEnglish: `What is '${cleanAffix}' from a grammatical viewpoint?`,
      options: [
        { 
          textHindi: isPratyay ? 'प्रत्यय (Suffix - अंत में जुड़ने वाला)' : 'उपसर्ग (Prefix - आगे जुड़ने वाला)',
          textEnglish: isPratyay ? 'Suffix (attached at the end)' : 'Prefix (attached at the start)'
        },
        { 
          textHindi: isPratyay ? 'उपसर्ग (Prefix - आगे जुड़ने वाला)' : 'प्रत्यय (Suffix - अंत में जुड़ने वाला)',
          textEnglish: isPratyay ? 'Prefix (attached at the start)' : 'Suffix (attached at the end)'
        },
        { textHindi: 'संधि (Sandhi)', textEnglish: 'Euphonic combination' },
        { textHindi: 'समास (Samas)', textEnglish: 'Compound word' }
      ],
      correctIndex: 0,
      explanationHindi: `'${cleanAffix}' शब्द के ${isPratyay ? 'अंत (पीछे)' : 'आरंभ (आगे)'} में जुड़ता है, अतः यह ${isPratyay ? 'प्रत्यय' : 'उपसर्ग'} है।`,
      explanationEnglish: `'${cleanAffix}' attaches at the ${isPratyay ? 'end' : 'beginning'}, so it is a ${isPratyay ? 'suffix' : 'prefix'}.`
    },
    {
      id: 'q3',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `'${sampleWord2.word}' का सही विच्छेद (Correct Dissection) कौन-सा है?`,
      questionEnglish: `Which is the correct breakup formula for '${sampleWord2.word}'?`,
      options: [
        { textHindi: sampleWord2.breakupFormula, textEnglish: sampleWord2.breakupFormula },
        { textHindi: `${cleanAffix} + विकार`, textEnglish: `${cleanAffix} + vikaar` },
        { textHindi: `मूल + ${cleanAffix}`, textEnglish: `mool + ${cleanAffix}` },
        { textHindi: 'इनमें से कोई नहीं', textEnglish: 'None of the above' }
      ],
      correctIndex: 0,
      explanationHindi: `शुद्ध विग्रह सूत्र: ${sampleWord2.breakupFormula} है।`,
      explanationEnglish: `Accurate dissection formula is: ${sampleWord2.breakupFormula}`
    },
    {
      id: 'q4',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `'${sampleWord3.word}' का सही अर्थ क्या है?`,
      questionEnglish: `What is the accurate meaning of '${sampleWord3.word}'?`,
      options: [
        { textHindi: sampleWord3.meaningHindi, textEnglish: sampleWord3.meaningEnglish },
        { textHindi: 'विपरीत और नकारात्मक कार्य', textEnglish: 'Opposite action' },
        { textHindi: 'अति साधारण वस्तु', textEnglish: 'Ordinary object' },
        { textHindi: 'स्थान का नाम', textEnglish: 'Place name' }
      ],
      correctIndex: 0,
      explanationHindi: `'${sampleWord3.word}' का प्रामाणिक अर्थ '${sampleWord3.meaningHindi}' होता है।`,
      explanationEnglish: `The established textual meaning is '${sampleWord3.meaningEnglish}'.`
    },
    {
      id: 'q5',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `उपसर्ग और प्रत्यय में मुख्य संरचनात्मक अंतर क्या है?`,
      questionEnglish: `What is the fundamental structural difference between prefix and suffix?`,
      options: [
        { textHindi: 'उपसर्ग शब्द के आरंभ में और प्रत्यय शब्द के अंत में जुड़ता है', textEnglish: 'Prefix joins at beginning, suffix at the end' },
        { textHindi: 'दोनों केवल अंत में जुड़ते हैं', textEnglish: 'Both join at the end' },
        { textHindi: 'उपसर्ग का कोई अर्थ नहीं होता', textEnglish: 'Prefix has no meaning' },
        { textHindi: 'प्रत्यय केवल क्रियाओं में लगता है', textEnglish: 'Suffix attaches only to verbs' }
      ],
      correctIndex: 0,
      explanationHindi: `उपसर्ग मूल शब्द के पूर्व (आगे) लगकर अर्थ में विशेषता लाते हैं, जबकि प्रत्यय शब्द के अंत (पीछे) में जुड़ते हैं।`,
      explanationEnglish: `Prefixes attach at the front; suffixes attach at the tail end.`
    },
    {
      id: 'q6',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `'${sampleWord4.word}' में '${cleanAffix}' जोड़ने पर मूल शब्द के अर्थ में क्या प्रभाव पड़ा?`,
      questionEnglish: `What semantic impact does '${cleanAffix}' have on the root word in '${sampleWord4.word}'?`,
      options: [
        { textHindi: 'अर्थ में नवीनता, तीव्रता या विशिष्टता आ गई', textEnglish: 'Introduced novelty, intensity, or grammatical specification' },
        { textHindi: 'अर्थ पूरी तरह नष्ट हो गया', textEnglish: 'Meaning was destroyed' },
        { textHindi: 'कोई प्रभाव नहीं पड़ा', textEnglish: 'No effect whatsoever' },
        { textHindi: 'शब्द का विलोम बन गया', textEnglish: 'Always creates antonym' }
      ],
      correctIndex: 0,
      explanationHindi: `शब्दांश जुड़ने से मूल शब्द के अर्थ में नवता और विशिष्ट भाव उत्पन्न होता है।`,
      explanationEnglish: `Affixation yields semantic enrichment or derived grammatical function.`
    },
    {
      id: 'q7',
      topicId: 'upsarg_pratyay',
      topicNameHindi: 'उपसर्ग एवं प्रत्यय',
      topicNameEnglish: 'Affixes',
      questionHindi: `निम्न में से कौन-सा शब्द '${cleanAffix}' के सटीक योग से निर्मित है?`,
      questionEnglish: `Which word is authentically constructed using '${cleanAffix}'?`,
      options: [
        { textHindi: sampleWord5.word, textEnglish: sampleWord5.word },
        { textHindi: 'अकस्मात्', textEnglish: 'Akasmat' },
        { textHindi: 'यथाशीघ्र', textEnglish: 'Yathashighra' },
        { textHindi: 'प्रतिध्वनि', textEnglish: 'Pratidhvani' }
      ],
      correctIndex: 0,
      explanationHindi: `'${sampleWord5.word}' शुद्ध विग्रह: ${sampleWord5.breakupFormula} के अनुसार बना है।`,
      explanationEnglish: `'${sampleWord5.word}' is accurately formed via '${sampleWord5.breakupFormula}'.`
    }
  ];

  return {
    morphemeType: isPratyay ? 'प्रत्यय' : 'उपसर्ग',
    morpheme: cleanAffix,
    morphemeMeaningHindi: isPratyay 
      ? 'शब्द के अंत में जुड़कर नए शब्द व भाववाचक अर्थ का सृजन करने वाला शब्दांश'
      : 'शब्द के आरंभ में जुड़कर उसके मूल अर्थ में विशेषता या परिवर्तन लाने वाला शब्दांश',
    morphemeMeaningEnglish: isPratyay 
      ? 'A suffix attached at the end of a root word to derive modified meanings.'
      : 'A prefix placed before a root word to alter, intensify, or reverse meaning.',
    ruleHindi: isPratyay
      ? `नियम: मूल शब्द (${sampleWord.rootWord}) + प्रत्यय (${cleanAffix}) = नया शब्द (${sampleWord.word})`
      : `नियम: उपसर्ग (${cleanAffix}) + मूल शब्द (${sampleWord.rootWord}) = नया शब्द (${sampleWord.word})`,
    ruleEnglish: isPratyay
      ? `Rule: Root Word (${sampleWord.rootWord}) + Suffix (${cleanAffix}) = Derivative (${sampleWord.word})`
      : `Rule: Prefix (${cleanAffix}) + Root Word (${sampleWord.rootWord}) = Compound (${sampleWord.word})`,
    words,
    quizQuestions: randomizeQuizSet(quizQuestions)
  };
}

export const UpsargPratyayStudio: React.FC<UpsargPratyayStudioProps> = ({
  grade,
  wordCoins,
  onAddWordCoins,
  bilingualMode,
  onOpenWorksheets,
  onRecordWrongAnswer,
  onRecordReport,
}) => {
  const [morphemeType, setMorphemeType] = useState<'upsarg' | 'pratyay'>('upsarg');
  const [selectedMorpheme, setSelectedMorpheme] = useState<string>('अनु');
  const [customMorphemeInput, setCustomMorphemeInput] = useState<string>('');
  const [requestedWordCount, setRequestedWordCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Results: Pre-populated with default 5-word table on initial mount so table is NEVER missing
  const [generatedData, setGeneratedData] = useState<{
    morphemeType: string;
    morpheme: string;
    morphemeMeaningHindi: string;
    morphemeMeaningEnglish: string;
    ruleHindi: string;
    ruleEnglish: string;
    words: UpsargPratyayWord[];
    quizQuestions: QuizQuestion[];
  }>(() => buildLocalAffixData('upsarg', 'अनु', 5));

  // Questionnaire round state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<{
    correctCount: number;
    coinsEarned: number;
  } | null>(null);

  // Preset affixes
  const commonUpsargs = [
    { affix: 'अनु', meaning: 'पीछे, अनुसार, समान (following, matching)' },
    { affix: 'प्र', meaning: 'आगे, अधिक, विशिष्ट (forward, eminent)' },
    { affix: 'अधि', meaning: 'श्रेष्ठ, ऊपर, अधिकार (superior, supreme)' },
    { affix: 'अप', meaning: 'बुरा, विपरीत, हीन (bad, contrary)' },
    { affix: 'सु', meaning: 'अच्छा, सरल, सुंदर (good, pleasant)' },
    { affix: 'वि', meaning: 'विशेष, भिन्न, विज्ञान (special, science)' },
  ];

  const commonPratyays = [
    { affix: 'ता', meaning: 'भाववाचक संज्ञा बनाने वाला (-ness, state)' },
    { affix: 'इक', meaning: 'संबंधवाचक विशेषण (-ic, related to)' },
    { affix: 'आवट', meaning: 'कार्य का भाव, रचना (manner, formation)' },
    { affix: 'ईय', meaning: 'संबंध या जाति सूचक (-ian, belonging)' },
    { affix: 'वान / मान', meaning: 'युक्त, वाला (possessing, having)' },
    { affix: 'दार', meaning: 'रखने वाला (holder, owner)' },
  ];

  // Core generator function: uses verified curated bank immediately and only queries API for custom affixes or extended counts
  const handleGenerate = async (
    typeToUse?: 'upsarg' | 'pratyay',
    affixToUse?: string,
    countToUse?: number
  ) => {
    const currentType = typeToUse || morphemeType;
    const currentCount = countToUse || requestedWordCount;
    let targetAffix = affixToUse;
    if (!targetAffix) {
      targetAffix = customMorphemeInput.trim() || selectedMorpheme;
    }

    // Instantly set local data so user experiences 0ms UI delay!
    const localData = buildLocalAffixData(currentType, targetAffix, currentCount);
    setGeneratedData(localData);
    setQuizSubmitted(false);
    setUserAnswers({});
    setQuizResults(null);

    const curatedBank = AFFIX_PRESET_BANK[targetAffix.trim()];
    if (curatedBank && curatedBank.length >= currentCount) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/upsarg-pratyay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          morphemeType: currentType,
          morpheme: targetAffix,
          wordCount: currentCount,
          grade,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.words && data.words.length > 0) {
          setGeneratedData({
            ...data,
            quizQuestions: Array.isArray(data.quizQuestions)
              ? randomizeQuizSet(data.quizQuestions)
              : localData.quizQuestions,
          });
        }
      }
    } catch (e) {
      console.warn('API enrichment fallback to local data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch type (Upsarg <-> Pratyay) and auto-generate default table
  const handleToggleType = (newType: 'upsarg' | 'pratyay') => {
    setMorphemeType(newType);
    const defaultAffix = newType === 'upsarg' ? 'अनु' : 'ता';
    setSelectedMorpheme(defaultAffix);
    setCustomMorphemeInput('');
    handleGenerate(newType, defaultAffix, requestedWordCount);
  };

  // Select Preset affix pill and auto-generate
  const handleSelectPreset = (affix: string) => {
    setSelectedMorpheme(affix);
    setCustomMorphemeInput('');
    handleGenerate(morphemeType, affix, requestedWordCount);
  };

  // Change Word Count (3, 5, 8, 10, 15) and immediately update table
  const handleChangeWordCount = (cnt: number) => {
    setRequestedWordCount(cnt);
    const affixToUse = customMorphemeInput.trim() || selectedMorpheme;
    handleGenerate(morphemeType, affixToUse, cnt);
  };

  // Custom Input submit on Enter
  const handleKeyDownCustom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const affixToUse = customMorphemeInput.trim() || selectedMorpheme;
      handleGenerate(morphemeType, affixToUse, requestedWordCount);
    }
  };

  const handleSelectOption = (questionIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers({ ...userAnswers, [questionIdx]: optIdx });
  };

  const handleGradeQuiz = () => {
    if (!generatedData || !generatedData.quizQuestions) return;
    let correct = 0;
    generatedData.quizQuestions.forEach((q, idx) => {
      const choice = userAnswers[idx];
      const optLen = Array.isArray(q.options) ? q.options.length : 0;
      const hasAnswered =
        typeof choice === 'number' &&
        Number.isInteger(choice) &&
        choice >= 0 &&
        (optLen === 0 || choice < optLen);
      if (hasAnswered) {
        if (choice === q.correctIndex) {
          correct++;
        } else {
          onRecordWrongAnswer?.(
            'upsarg_pratyay',
            'उपसर्ग और प्रत्यय',
            'Prefixes & Suffixes',
            q.questionHindi
          );
        }
      }
    });

    // 2 correct answers = 1 WordCoin
    const coinsEarned = Math.floor(correct / 2);
    setQuizResults({
      correctCount: correct,
      coinsEarned,
    });
    setQuizSubmitted(true);

    if (coinsEarned > 0) {
      onAddWordCoins(coinsEarned);
      triggerCelebration();
      triggerCoinBurst();
    }

    if (onRecordReport) {
      const report = buildWorksheetReport({
        titleHindi: `${generatedData.morphemeType} '${generatedData.morpheme}' प्रश्नावली रिपोर्ट`,
        titleEnglish: `Affix '${generatedData.morpheme}' Quiz Report`,
        questions: generatedData.quizQuestions,
        userAnswers,
        answerLookupMode: 'byIndex',
        fallbackTopicId: morphemeType === 'upsarg' ? 'upsarg' : 'pratyay',
        fallbackTopicHindi: morphemeType === 'upsarg' ? 'उपसर्ग (Prefix)' : 'प्रत्यय (Suffix)',
        fallbackTopicEnglish: morphemeType === 'upsarg' ? 'Prefixes' : 'Suffixes',
        wordCoinsEarned: coinsEarned,
      });
      onRecordReport(
        toSavedReportSummary(report, {
          id: `affix_${morphemeType}_${generatedData.morpheme}_${Date.now()}`,
          sourceType: 'upsarg_pratyay',
          grade,
        })
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Explanation - Royal Indigo & Violet Gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-900/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-2">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-center bg-[#091124] border border-white/25 shadow-lg shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-amber-300/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>इच्छित शब्द-संख्या जनरेटर एवं क्विज (Custom Word Count & Quiz)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                उपसर्ग एवं प्रत्यय स्टूडियो (Affix Studio)
              </h2>
            </div>
          </div>
          <p className="text-sm text-indigo-100 mt-2.5 leading-relaxed font-normal">
            उपसर्ग और प्रत्यय को रटने के बजाय उनके मूल शब्द और अर्थ-परिवर्तन को तालिका में देखें। आप जितनी चाहें उतनी शब्द संख्या (Word Count) चुन सकते हैं। अवधारणा समझने के बाद <strong>प्रश्नावली दौर (Questionnaire Round)</strong> खेलें और हर <strong>2 सही उत्तर पर 1 WordCoin</strong> कमाएँ!
          </p>

          {bilingualMode && (
            <p className="text-xs text-indigo-200 mt-1.5 italic">
              Generate custom length word lists with clear breakdown of prefix/suffix and root word. Take the MCQ quiz where 2 correct answers = 1 WordCoin to unlock special worksheets.
            </p>
          )}

          {/* Quick Stats Pill */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-black/30 px-3.5 py-2 rounded-xl border border-white/15">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>आपके सिक्के: <strong className="text-amber-300 text-sm font-black">{wordCoins} WordCoins</strong></span>
            </div>
            <button
              onClick={onOpenWorksheets}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>वर्कशीट्स स्टोर देखें (Unlock Worksheets)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Card: Type, Affix & User Requested Word Count */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 text-lg">
              <span>१. शब्दांश का प्रकार एवं शब्द-संख्या चयन</span>
              <span className="text-xs font-normal text-slate-500 font-sans">(Select Affix & Count)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Choose Prefix or Suffix and select how many words you want generated in the live table.
            </p>
          </div>

          {/* Toggle Type: Upsarg (Prefix) vs Pratyay (Suffix) */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleToggleType('upsarg')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                morphemeType === 'upsarg'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {morphemeType === 'upsarg' && <Check className="w-3 h-3 text-amber-300" />}
              <span>उपसर्ग (Prefix - आगे)</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleType('pratyay')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                morphemeType === 'pratyay'
                  ? 'bg-[#D47758] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {morphemeType === 'pratyay' && <Check className="w-3 h-3 text-white" />}
              <span>प्रत्यय (Suffix - पीछे)</span>
            </button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2.5">
            लोकप्रिय {morphemeType === 'upsarg' ? 'उपसर्ग' : 'प्रत्यय'} चुनें (Select a Preset to Generate Instantly):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {(morphemeType === 'upsarg' ? commonUpsargs : commonPratyays).map((item) => {
              const isSelected = selectedMorpheme === item.affix && !customMorphemeInput;
              return (
                <button
                  key={item.affix}
                  type="button"
                  onClick={() => handleSelectPreset(item.affix)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? morphemeType === 'upsarg'
                        ? 'bg-[#2A5847]/10 border-[#2A5847] text-[#2A5847] font-bold shadow-xs'
                        : 'bg-[#D47758]/10 border-[#D47758] text-[#D47758] font-bold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-100/60'
                  }`}
                >
                  <span className={`text-lg font-black font-editorial ${
                    isSelected 
                      ? morphemeType === 'upsarg' ? 'text-[#2A5847]' : 'text-[#D47758]'
                      : 'text-stone-800'
                  }`}>
                    {item.affix}
                  </span>
                  <span className="text-[10px] text-stone-500 line-clamp-1 mt-1 font-normal">
                    {item.meaning}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input & Requested Word Count */}
        <div className="grid sm:grid-cols-2 gap-5 pt-1">
          {/* Custom Affix */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              या कोई अन्य {morphemeType === 'upsarg' ? 'उपसर्ग' : 'प्रत्यय'} लिखें (Type Custom):
            </label>
            <div className="relative">
              <input
                type="text"
                value={customMorphemeInput}
                onChange={(e) => setCustomMorphemeInput(e.target.value)}
                onKeyDown={handleKeyDownCustom}
                placeholder={morphemeType === 'upsarg' ? 'उदा. सम्, निर्, प्रति, परा' : 'उदा. आवट, इक, ईय, वान'}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#2A5847] bg-stone-50 focus:bg-white text-stone-800 pr-10"
              />
              <button
                type="button"
                onClick={() => {
                  const affixToUse = customMorphemeInput.trim() || selectedMorpheme;
                  handleGenerate(morphemeType, affixToUse, requestedWordCount);
                }}
                className="absolute right-2 top-2 p-1 text-stone-500 hover:text-[#2A5847] cursor-pointer"
                title="Generate for custom affix"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              Enter दबाएँ या सर्च आइकॉन पर क्लिक करें।
            </p>
          </div>

          {/* Asked Word Count Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-800">
                आप कितने शब्दों की सूची चाहते हैं? (Select Word Count):
              </label>
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {requestedWordCount} शब्द
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {[3, 5, 8, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => handleChangeWordCount(cnt)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    requestedWordCount === cnt
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              संख्या बदलते ही तालिका स्वतः अपडेट हो जाती है।
            </p>
          </div>
        </div>

        {/* Generate / Refresh Button Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>वर्तमान चयनित: <strong>{generatedData.morphemeType} '{generatedData.morpheme}'</strong> ({generatedData.words.length} शब्द)</span>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleGenerate()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>तालिका अपडेट हो रही है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{requestedWordCount} शब्दों की तालिका व क्विज बनाएँ (Generate)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Results View: Always rendered with immediate fallback and live updates */}
      <div className="space-y-6">
        {/* Rules & Meaning Callout Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-black text-indigo-700 uppercase tracking-wide mb-1">
            <Info className="w-4 h-4 text-indigo-600" />
            <span className="font-editorial text-sm tracking-normal">
              {generatedData.morphemeType}: '{generatedData.morpheme}' की स्पष्ट व्याख्या एवं नियम सूत्र
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block">अर्थ (Meaning):</span>
              <span className="text-xs font-extrabold text-indigo-900 block mt-0.5">
                {generatedData.morphemeMeaningHindi}
              </span>
              {bilingualMode && (
                <span className="text-[11px] text-stone-500 italic block mt-0.5">
                  {generatedData.morphemeMeaningEnglish}
                </span>
              )}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200">
              <span className="text-[11px] font-bold text-stone-400 block">नियम सूत्र (Grammar Rule):</span>
              <span className="text-xs font-extrabold text-stone-900 block mt-0.5">
                {generatedData.ruleHindi}
              </span>
              {bilingualMode && (
                <span className="text-[11px] text-stone-500 italic block mt-0.5">
                  {generatedData.ruleEnglish}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Formatted Table of Words with Explicit Morpheme/Root Breakdown */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-base font-black text-indigo-950 font-editorial flex items-center gap-2">
                <span>{generatedData.morphemeType} '{generatedData.morpheme}' के {generatedData.words.length} शब्दों की विस्तृत तालिका</span>
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                प्रत्येक शब्द में उपसर्ग/प्रत्यय और मूल शब्द का स्पष्ट विच्छेद, विग्रह सूत्र और अर्थ दर्शाया गया है।
              </p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
              कुल शब्द: {generatedData.words.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">क्र.</th>
                  <th className="py-3 px-4">नया शब्द (Word)</th>
                  <th className="py-3 px-4">{generatedData.morphemeType} (Affix)</th>
                  <th className="py-3 px-4">मूल शब्द (Root)</th>
                  <th className="py-3 px-4">विग्रह सूत्र (Formula)</th>
                  <th className="py-3 px-4">शब्द का अर्थ (Meaning)</th>
                  <th className="py-3 px-4">उदाहरण वाक्य (Sentence)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {generatedData.words.map((w, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      <span className="px-2.5 py-1 bg-amber-50 text-slate-900 rounded-lg border border-amber-300 font-editorial font-bold">
                        {w.word}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 bg-violet-100 text-violet-800 font-bold rounded-md text-[11px] border border-violet-200">
                        {w.affix}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-md text-[11px] border border-indigo-200">
                        {w.rootWord}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {w.breakupFormula}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {w.meaningHindi}
                      </span>
                      {bilingualMode && (
                        <span className="text-[11px] text-slate-400 block italic">
                          {w.meaningEnglish}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      <span className="block italic text-[11px] leading-snug">
                        "{w.sentenceExampleHindi}"
                      </span>
                      {bilingualMode && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          "{w.sentenceExampleEnglish}"
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Questionnaire Round (MCQ Quiz for WordCoins) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-sm">
                <Trophy className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-lg font-black text-indigo-950 font-editorial">
                  प्रश्नावली दौर: समझ की परीक्षा (Questionnaire Round)
                </h4>
                <p className="text-xs text-slate-500">
                  हर २ सही उत्तर पर १ WordCoin प्राप्त करें! (2 correct answers = 1 WordCoin)
                </p>
              </div>
            </div>

            {quizSubmitted && quizResults && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-300 rounded-xl">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">
                  +{quizResults.coinsEarned} WordCoins अर्जित किए!
                </span>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-5">
            {generatedData.quizQuestions.map((q, qIdx) => {
              const userChoice = userAnswers[qIdx];
              const optLen = Array.isArray(q.options) ? q.options.length : 0;
              const isAnswered =
                typeof userChoice === 'number' &&
                Number.isInteger(userChoice) &&
                userChoice >= 0 &&
                (optLen === 0 || userChoice < optLen);
              const isCorrect = isAnswered && userChoice === q.correctIndex;

              return (
                <div 
                  key={qIdx}
                  className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block mb-0.5">
                        प्रश्न {qIdx + 1}
                      </span>
                      <h5 className="text-sm font-bold text-stone-900 leading-snug">
                        {q.questionHindi}
                      </h5>
                      {bilingualMode && (
                        <p className="text-[11px] text-stone-400 italic mt-0.5">
                          {q.questionEnglish}
                        </p>
                      )}
                    </div>

                    {quizSubmitted && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> सही (+0.5 pt)
                          </span>
                        ) : isAnswered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
                            <XCircle className="w-3 h-3" /> गलत
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                            अनुत्तरित (0 अंक)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {(() => {
                      const placeholderRx = /^(correct\s*(option|answer|formula)|wrong\s*(option|answer)|incorrect\s*\w*|generic\s*placeholder|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i;
                      const allHaveSafeEng = Array.isArray(q.options) && q.options.every((o: any) => {
                        const s = typeof o === 'object' && typeof o?.textEnglish === 'string' ? o.textEnglish.trim() : '';
                        return s.length > 0 && !placeholderRx.test(s);
                      });
                      return q.options.map((optText, oIdx) => {
                        const isChosen = userChoice === oIdx;
                        let btnStyle = 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100/80';

                        if (quizSubmitted) {
                          if (isAnswered) {
                            if (oIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                            } else if (isChosen) {
                              btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                            }
                          } else if (oIdx === q.correctIndex) {
                            btnStyle = 'bg-stone-100 border-dashed border-emerald-500 text-stone-800 font-semibold';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-1 ring-indigo-500';
                        }

                        const optLabel = typeof optText === 'string' ? optText : (optText as any)?.textHindi || String(optText);
                        const optEnglish = allHaveSafeEng && typeof optText === 'object' && (optText as any)?.textEnglish
                          ? String((optText as any).textEnglish).trim()
                          : null;

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <div>
                              <span className="font-medium">{optLabel}</span>
                              {bilingualMode && optEnglish && (
                                <span className="block text-[10px] text-stone-400 font-normal">
                                  {optEnglish}
                                </span>
                              )}
                            </div>
                            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold border-current/30 shrink-0 ml-2">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Feedback Explanation (shown after submission) */}
                  {quizSubmitted && (
                    <div className="mt-2 p-3.5 bg-white rounded-xl border border-stone-200 text-xs">
                      <span className="font-bold text-stone-900 block mb-0.5">स्पष्टीकरण (Explanation):</span>
                      <p className="text-stone-900 font-bold leading-relaxed">{q.explanationHindi}</p>
                      {bilingualMode && (
                        <p className="text-[11px] text-stone-700 font-bold italic mt-0.5">{q.explanationEnglish}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission / Retry */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 flex-wrap gap-3">
            <span className="text-xs text-stone-500 font-medium">
              {!quizSubmitted ? `${Object.keys(userAnswers).length} / ${generatedData.quizQuestions.length} उत्तर दिए गए` : 'प्रश्नावली पूर्ण!'}
            </span>

            {!quizSubmitted ? (
              <button
                type="button"
                disabled={Object.keys(userAnswers).length === 0}
                onClick={handleGradeQuiz}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>उत्तर जाँचें व WordCoins जीतें</span>
                <Coins className="w-3.5 h-3.5 text-amber-300" />
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setQuizSubmitted(false);
                    setUserAnswers({});
                    setQuizResults(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  पुनः प्रयास करें (Retry)
                </button>
                <button
                  type="button"
                  onClick={onOpenWorksheets}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>वर्कशीट्स अनलॉक करें</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Full Diagnostic Report for Upsarg & Pratyay Questionnaire */}
        {quizSubmitted && quizResults && (
          <WorksheetReportCard
            report={buildWorksheetReport({
              titleHindi: `${generatedData.morphemeType} '${generatedData.morpheme}' प्रश्नावली रिपोर्ट`,
              titleEnglish: `Affix '${generatedData.morpheme}' Quiz Report`,
              questions: generatedData.quizQuestions,
              userAnswers,
              answerLookupMode: 'byIndex',
              fallbackTopicId: morphemeType === 'upsarg' ? 'upsarg' : 'pratyay',
              fallbackTopicHindi: morphemeType === 'upsarg' ? 'उपसर्ग (Prefix)' : 'प्रत्यय (Suffix)',
              fallbackTopicEnglish: morphemeType === 'upsarg' ? 'Prefixes' : 'Suffixes',
              wordCoinsEarned: quizResults.coinsEarned,
            })}
            bilingualMode={bilingualMode}
          />
        )}
      </div>
    </div>
  );
};
