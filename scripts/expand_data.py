import re
import sys

def main():
    with open('src/data/grammarData.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Expand VAKYA questions (id: 'vakya')
    vakya_questions = """    quickCheckQuestions: [
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
    ]"""

    # 2. Expand VACHYA questions (id: 'vachya')
    vachya_questions = """    quickCheckQuestions: [
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
    ]"""

    # 3. Expand KAAL questions (id: 'kaal')
    kaal_questions = """    quickCheckQuestions: [
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
    ]"""

    # 4. Expand MUHAVARE questions (id: 'muhavare')
    muhavare_questions = """    quickCheckQuestions: [
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
          { textHindi: 'स्वयं अपना नुकसान करना (Harm oneself)', textEnglish: 'Harm one\'s own self' },
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
    ]"""

    # 5. Expand UPSARG-PRATYAY questions (id: 'upsarg-pratyay')
    upsarg_questions = """    quickCheckQuestions: [
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
    ]"""

    # Replace each module's quickCheckQuestions
    # For vakya
    content = re.sub(
        r"(id:\s*'vakya'[\s\S]*?rulesSummary:\s*\[[\s\S]*?\]\s*,\s*)quickCheckQuestions:\s*\[[\s\S]*?\](\s*\})",
        r"\g<1>" + vakya_questions.strip() + r"\g<2>",
        content
    )

    # For vachya
    content = re.sub(
        r"(id:\s*'vachya'[\s\S]*?rulesSummary:\s*\[[\s\S]*?\]\s*,\s*)quickCheckQuestions:\s*\[[\s\S]*?\](\s*\})",
        r"\g<1>" + vachya_questions.strip() + r"\g<2>",
        content
    )

    # For kaal
    content = re.sub(
        r"(id:\s*'kaal'[\s\S]*?rulesSummary:\s*\[[\s\S]*?\]\s*,\s*)quickCheckQuestions:\s*\[[\s\S]*?\](\s*\})",
        r"\g<1>" + kaal_questions.strip() + r"\g<2>",
        content
    )

    # For muhavare
    content = re.sub(
        r"(id:\s*'muhavare'[\s\S]*?rulesSummary:\s*\[[\s\S]*?\]\s*,\s*)quickCheckQuestions:\s*\[[\s\S]*?\](\s*\})",
        r"\g<1>" + muhavare_questions.strip() + r"\g<2>",
        content
    )

    # For upsarg-pratyay
    content = re.sub(
        r"(id:\s*'upsarg-pratyay'[\s\S]*?rulesSummary:\s*\[[\s\S]*?\]\s*,\s*)quickCheckQuestions:\s*\[[\s\S]*?\](\s*\})",
        r"\g<1>" + upsarg_questions.strip() + r"\g<2>",
        content
    )

    with open('src/data/grammarData.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully expanded questions for all modules!")

if __name__ == '__main__':
    main()
