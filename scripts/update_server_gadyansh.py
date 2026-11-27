import re

new_route = """app.post('/api/ai/gadyansh-generate', async (req: Request, res: Response) => {
  const { topic = 'पर्यावरण और प्रकृति संरक्षण', grade = 'कक्षा 8', difficulty = 'medium' } = req.body;
  const cleanTopic = (topic || '').trim() || 'पर्यावरण और प्रकृति';

  const diffLabel = difficulty === 'easy' ? 'सरल (Easy)' : difficulty === 'very_hard' ? 'अत्यंत कठिन (Very Hard)' : 'मध्यम (Medium)';
  const diffInstructions = difficulty === 'easy'
    ? 'Difficulty Level: Easy (सरल). Use clear, lucid, everyday Hindi words suited for beginners/class 8, yet maintain a long, lengthy and detailed exposition (350-400 words).'
    : difficulty === 'very_hard'
    ? 'Difficulty Level: Very Hard (अत्यंत कठिन). Use elevated Sanskritized (तत्सम) vocabulary, profound philosophical and analytical tone, intricate syntactic structures, and deep critical depth (450-500+ words).'
    : 'Difficulty Level: Medium (मध्यम). Use refined, literary standard Hindi, rich contextual metaphors, and structured thought development (400-450 words).';

  if (ai) {
    try {
      const prompt = `You are a distinguished Hindi literature professor and CBSE/State Board curriculum designer for ShabdShilp.
The student requested an in-depth, long Hindi Reading Comprehension Passage (दीर्घ अपठित गद्यांश) on the topic: "${cleanTopic}".
Target Grade: ${grade}.
${diffInstructions}

CRITICAL USER REQUIREMENT: The passage MUST be LONG and LENGTHY (at least 350 to 500 words across 3-4 structured paragraphs) and include AT LEAST 8 HIGH-QUALITY COMPREHENSIVE QUESTIONS.

Return ONLY valid JSON matching this schema:
{
  "id": "custom_${Date.now()}",
  "titleHindi": "Formal, engaging Hindi title",
  "titleEnglish": "English title",
  "theme": "1-2 word category tag in Hindi",
  "difficulty": "${difficulty}",
  "difficultyLabelHindi": "${diffLabel}",
  "gradeLevel": "${grade}",
  "passageHindi": "A lengthy, rich, multi-paragraph 350-500 word Hindi passage",
  "englishSummary": "A concise 3-4 sentence English summary of the core message",
  "vocabularyList": [
    { "word": "कठिन शब्द 1", "meaningHindi": "सरल अर्थ हिंदी में", "meaningEnglish": "English meaning" },
    { "word": "कठिन शब्द 2", "meaningHindi": "सरल अर्थ हिंदी में", "meaningEnglish": "English meaning" },
    { "word": "कठिन शब्द 3", "meaningHindi": "सरल अर्थ हिंदी में", "meaningEnglish": "English meaning" },
    { "word": "कठिन शब्द 4", "meaningHindi": "सरल अर्थ हिंदी में", "meaningEnglish": "English meaning" }
  ],
  "questions": [
    {
      "id": "cq_1",
      "topicId": "comprehension",
      "topicNameHindi": "अपठित गद्यांश",
      "topicNameEnglish": "Reading Comprehension",
      "questionHindi": "केंद्रीय भाव / मुख्य विषय पर प्रश्न",
      "questionEnglish": "Central theme question",
      "options": [
        { "textHindi": "विकल्प 1", "textEnglish": "Option 1" },
        { "textHindi": "विकल्प 2", "textEnglish": "Option 2" },
        { "textHindi": "विकल्प 3", "textEnglish": "Option 3" },
        { "textHindi": "विकल्प 4", "textEnglish": "Option 4" }
      ],
      "correctIndex": 0,
      "explanationHindi": "हिंदी में विस्तृत व स्पष्ट व्याख्या",
      "explanationEnglish": "Clear English explanation"
    }
  ]
}
Make sure "questions" has EXACTLY 8 distinct questions testing:
1. Central theme
2. Direct factual detail from text
3. Inferred meaning / reasoning
4. Vocabulary / meaning of word in context
5. Author's intention / moral takeaway
6. Antonym / synonym / grammar aspect
7. Analytical critical evaluation
8. Practical civic / life application.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
        8000
      );

      const parsed = JSON.parse(response.text || '{}');
      if (parsed && parsed.passageHindi && Array.isArray(parsed.questions) && parsed.questions.length >= 4) {
        parsed.id = parsed.id || `custom_${Date.now()}`;
        parsed.difficulty = difficulty;
        parsed.difficultyLabelHindi = diffLabel;
        parsed.gradeLevel = grade;
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('AI gadyansh-generate fallback due to:', err?.message);
    }
  }

  // Robust, lengthy 400-word fallback tailored to the selected topic and difficulty
  const customId = `custom_${Date.now()}`;
  return res.json({
    id: customId,
    titleHindi: `${cleanTopic}: एक समग्र एवं चिंतनशील दृष्टिकोण`,
    titleEnglish: `${cleanTopic}: A Comprehensive Perspective`,
    theme: 'विशेष विषय (Custom Topic)',
    difficulty,
    difficultyLabelHindi: diffLabel,
    gradeLevel: grade,
    passageHindi: `आज के 21वीं सदी के तीव्र गति से बदलते परिवेश में '${cleanTopic}' का विषय केवल एक सैद्धांतिक चर्चा का मुद्दा नहीं, बल्कि हमारे सामाजिक, बौद्धिक एवं नैतिक जीवन की सुदृढ़ आधारशिला बन चुका है। जब हम इसके विभिन्न ऐतिहासिक और समकालीन आयामों का सूक्ष्म विश्लेषण करते हैं, तो यह बात स्पष्ट रूप से उभरकर सामने आती है कि किसी भी समाज अथवा राष्ट्र की वास्तविक प्रगति केवल भौतिक सुख-सुविधाओं और औद्योगिक विस्तार से निर्धारित नहीं होती, बल्कि नागरिकों की वैचारिक सजगता और दायित्व-बोध से परिलक्षित होती है।\\n\\n'${cleanTopic}' हमें यह सिखाता है कि संतुलन, अनुशासन और दूरदर्शिता के अभाव में विकास की कोई भी बड़ी योजना अंततः दिशाहीन हो जाती है। हमारे जीवन में आने वाली निरंतर चुनौतियाँ हमें यह स्मरण कराती हैं कि यदि हम समय रहते उचित कदम न उठाएँ, तो आने वाली पीढ़ियों के समक्ष विकट संकट खड़े हो सकते हैं। ज्ञान का सच्चा उद्देश्य केवल सूचनाओं का संचय करना नहीं है, बल्कि उस ज्ञान को लोक-कल्याण और मानवीय मूल्यों के संवर्धन में प्रयोग करना है। प्राचीन काल से ही हमारी संस्कृति में यह मान्यता रही है कि विचार जब तक आचरण में न ढलें, तब तक उनका कोई वास्तविक प्रभाव समाज पर नहीं पड़ता।\\n\\nअतः आज के युवाओं का यह सर्वोपरि दायित्व है कि वे '${cleanTopic}' को केवल परीक्षा कक्ष या निबंध लेखन तक सीमित न रखकर अपने व्यावहारिक जीवन में पूरी निष्ठा के साथ आत्मसात करें। सामूहिक सहयोग, निरंतर स्वाध्याय और सत्यनिष्ठा के बल पर ही हम एक ऐसा समरस और प्रगतिशील समाज निर्मित कर सकते हैं, जहाँ प्रत्येक व्यक्ति को अपने सपनों को साकार करने के समान अवसर प्राप्त हों। इस विषय पर गंभीरतापूर्वक मनन करना और राष्ट्रहित में सकारात्मक योगदान देना ही समय की सबसे बड़ी माँग है।`,
    englishSummary: `This passage provides a profound contemplation on '${cleanTopic}', illustrating that societal and national progress relies not merely on material accumulation, but on moral responsibility, holistic balance, and proactive civic engagement.`,
    vocabularyList: [
      { word: 'आयाम (Dimensions)', meaningHindi: 'पहलू, दिशा या स्वरूप', meaningEnglish: 'Facets / dimensions' },
      { word: 'सूक्ष्म (Subtle / Analytical)', meaningHindi: 'बारीक और गहन विश्लेषण', meaningEnglish: 'In-depth / meticulous' },
      { word: 'परिलक्षित (Reflected)', meaningHindi: 'दिखाई पड़ना या प्रकट होना', meaningEnglish: 'Manifested / reflected' },
      { word: 'आत्मसात (Internalize)', meaningHindi: 'पूरी तरह अपने आचरण में अपना लेना', meaningEnglish: 'Adopt / internalize into action' }
    ],
    questions: [
      {
        id: 'cq_1',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `प्रस्तुत गद्यांश का मूल केंद्रीय भाव क्या है?`,
        questionEnglish: `What is the core central message of the passage?`,
        options: [
          { textHindi: `'${cleanTopic}' के प्रति सजगता और व्यावहारिक संतुलन को आचरण में उतारना`, textEnglish: `Adopting awareness and balance towards '${cleanTopic}' in action` },
          { textHindi: `केवल पुरानी परंपराओं की अंधी नकल करना`, textEnglish: `Blindly imitating old traditions` },
          { textHindi: `भौतिक संसाधनों का असीमित उपभोग करना`, textEnglish: `Unlimited consumption of material goods` },
          { textHindi: `समस्याओं के समाधान से विमुख हो जाना`, textEnglish: `Turning away from solving problems` }
        ],
        correctIndex: 0,
        explanationHindi: `गद्यांश में '${cleanTopic}' को केवल सैद्धांतिक न मानकर आचरण में आत्मसात करने पर बल दिया गया है।`,
        explanationEnglish: `Passage emphasizes internalizing '${cleanTopic}' practically rather than remaining theoretical.`
      },
      {
        id: 'cq_2',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `गद्यांश के अनुसार किसी समाज की सच्ची प्रगति का वास्तविक पैमाना क्या है?`,
        questionEnglish: `According to the passage, what is the true yardstick of societal progress?`,
        options: [
          { textHindi: `नागरिकों की वैचारिक सजगता और दायित्व-बोध`, textEnglish: `Citizens' awareness and sense of duty` },
          { textHindi: `केवल बड़ी इमारतों और सड़कों का निर्माण`, textEnglish: `Construction of big buildings only` },
          { textHindi: `दूसरों पर हुकूमत करने की क्षमता`, textEnglish: `Ability to dominate others` },
          { textHindi: `विदेशी वस्तुओं का अत्यधिक संचय`, textEnglish: `Accumulation of foreign goods` }
        ],
        correctIndex: 0,
        explanationHindi: `लेखक के अनुसार वास्तविक प्रगति भौतिक विस्तार से नहीं, अपितु वैचारिक सजगता और दायित्व-बोध से निर्धारित होती है।`,
        explanationEnglish: `Real advancement is marked by conscious civic duty rather than mere physical sprawl.`
      },
      {
        id: 'cq_3',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `ज्ञान का सच्चा उद्देश्य लेखक ने किसे माना है?`,
        questionEnglish: `What does the author consider as the true goal of knowledge?`,
        options: [
          { textHindi: `लोक-कल्याण और मानवीय मूल्यों का संवर्धन`, textEnglish: `Public welfare and enrichment of human values` },
          { textHindi: `केवल सूचनाओं और आंकड़ों का संचय करना`, textEnglish: `Mere gathering of information and statistics` },
          { textHindi: `दूसरों को नीचा दिखाने का माध्यम`, textEnglish: `A tool to demean others` },
          { textHindi: `धन कमाने का एकमात्र साधन`, textEnglish: `Solely a way to earn wealth` }
        ],
        correctIndex: 0,
        explanationHindi: `गद्यांश में स्पष्ट कहा गया है कि ज्ञान का साध्य सूचनाएं बटोरना नहीं, बल्कि लोक-कल्याण और मानवीय मूल्य बढ़ाना है।`,
        explanationEnglish: `Knowledge must serve common good and bolster ethical values.`
      },
      {
        id: 'cq_4',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `'आत्मसात' शब्द का सही अर्थ क्या है?`,
        questionEnglish: `What is the accurate meaning of 'आत्मसात'?`,
        options: [
          { textHindi: 'पूरी तरह अपने भीतर ग्रहण कर लेना (Internalize)', textEnglish: 'Internalize / adopt wholeheartedly' },
          { textHindi: 'किसी चीज को फेंक देना (Discard)', textEnglish: 'Discard' },
          { textHindi: 'डरकर भाग जाना (Flee in fear)', textEnglish: 'Flee in fear' },
          { textHindi: 'केवल बातें करना (Only talk)', textEnglish: 'Only talk' }
        ],
        correctIndex: 0,
        explanationHindi: `'आत्मसात' का अर्थ किसी सिद्धांत या मूल्य को अपने स्वभाव और आचरण में पूरी तरह समाहित कर लेना है।`,
        explanationEnglish: `'आत्मसात' means completely incorporating something into one's essence and actions.`
      },
      {
        id: 'cq_5',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `लेखक के अनुसार आज के युवाओं का सर्वोपरि कर्तव्य क्या है?`,
        questionEnglish: `What is the paramount duty of today's youth according to the author?`,
        options: [
          { textHindi: `'${cleanTopic}' को व्यावहारिक जीवन में निष्ठापूर्वक लागू करना`, textEnglish: `Faithfully implementing '${cleanTopic}' in practical life` },
          { textHindi: `केवल परीक्षा में अंक लाने तक सीमित रहना`, textEnglish: `Limiting efforts only to exam scores` },
          { textHindi: `सामाजिक समस्याओं की उपेक्षा करना`, textEnglish: `Ignoring societal challenges` },
          { textHindi: `बिना सोचे समझे किसी भी राह पर चलना`, textEnglish: `Rushing into things without thought` }
        ],
        correctIndex: 0,
        explanationHindi: `युवाओं का कर्तव्य है कि वे इस विषय को केवल विचारों तक न रखकर दैनिक आचरण में ढालें।`,
        explanationEnglish: `The youth must translate ideals into lived social action.`
      },
      {
        id: 'cq_6',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `'प्रगतिशील' शब्द में मूल शब्द और प्रत्यय क्या हैं?`,
        questionEnglish: `Identify root and suffix in 'प्रगतिशील':`,
        options: [
          { textHindi: 'प्रगति + शील', textEnglish: 'Pragati + Sheel' },
          { textHindi: 'प्र + गतिशील', textEnglish: 'Pra + Gatisheel' },
          { textHindi: 'प्रगत + ईशील', textEnglish: 'Pragat + Eesheel' },
          { textHindi: 'प्रगतिश + ईल', textEnglish: 'Pragatish + Eel' }
        ],
        correctIndex: 0,
        explanationHindi: "'प्रगति' मूल संज्ञा है और 'शील' (स्वभाव वाला) प्रत्यय है, मिलकर 'प्रगतिशील' बना है।",
        explanationEnglish: "'प्रगति' is the root noun; 'शील' is the adjectival suffix."
      },
      {
        id: 'cq_7',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `विकास की कोई भी योजना कब दिशाहीन हो जाती है?`,
        questionEnglish: `When does any development plan lose its direction?`,
        options: [
          { textHindi: 'संतुलन, अनुशासन और दूरदर्शिता के अभाव में', textEnglish: 'In the absence of balance, discipline, and foresight' },
          { textHindi: 'जब धन की प्रचुरता हो', textEnglish: 'When there is excess of money' },
          { textHindi: 'जब सभी नागरिक मिलकर कार्य करें', textEnglish: 'When all citizens collaborate' },
          { textHindi: 'जब वैज्ञानिक अनुसंधान किया जाए', textEnglish: 'When scientific research is conducted' }
        ],
        correctIndex: 0,
        explanationHindi: "गद्यांश के दूसरे अनुच्छेद में बताया गया है कि संतुलन और अनुशासन के बिना विकास अधूरा रहता है।",
        explanationEnglish: "Without balance and foresight, physical development becomes counterproductive."
      },
      {
        id: 'cq_8',
        topicId: 'comprehension',
        topicNameHindi: 'अपठित गद्यांश',
        topicNameEnglish: 'Reading Comprehension',
        questionHindi: `प्रस्तुत गद्यांश का सर्वाधिक उपयुक्त एवं सार्थक शीर्षक क्या होगा?`,
        questionEnglish: `What is the most fitting title for the given passage?`,
        options: [
          { textHindi: `'${cleanTopic}': प्रासंगिकता, संतुलन और दायित्व-बोध`, textEnglish: `'${cleanTopic}': Relevance, Balance & Sense of Duty` },
          { textHindi: `केवल पुरानी मान्यताओं का विवरण`, textEnglish: `Description of Ancient Beliefs Only` },
          { textHindi: `औद्योगिक प्रतिस्पर्धा का इतिहास`, textEnglish: `History of Industrial Competition` },
          { textHindi: `परीक्षा की तैयारी के नियम`, textEnglish: `Rules of Exam Preparation` }
        ],
        correctIndex: 0,
        explanationHindi: "सम्पूर्ण गद्यांश '${cleanTopic}' की समकालीन प्रासंगिकता, संतुलन और नागरिक दायित्व पर केंद्रित है।",
        explanationEnglish: "The comprehensive treatise focuses on modern relevance, balance, and civic stewardship."
      }
    ]
  });
});"""

with open('server.ts', 'r', encoding='utf-8') as f:
    server_content = f.read()

# Replace gadyansh-generate route in server.ts
server_content = re.sub(
    r"app\.post\('/api/ai/gadyansh-generate'[\s\S]*?\n\}\);\n\n// 6\.",
    new_route.strip() + "\n\n// 6.",
    server_content
)

with open('server.ts', 'w', encoding='utf-8') as f:
    server_content_updated = f.write(server_content)

print("Updated server.ts /api/ai/gadyansh-generate successfully!")
