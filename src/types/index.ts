export type GradeLevel = 'कक्षा 5' | 'कक्षा 6' | 'कक्षा 7' | 'कक्षा 8' | 'कक्षा 9' | 'कक्षा 10';
export type BoardType = 'ICSE';

export interface QuizOption {
  textHindi: string;
  textEnglish: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicNameHindi: string;
  topicNameEnglish: string;
  questionHindi: string;
  questionEnglish: string;
  sentenceHindi?: string;
  sentenceEnglish?: string;
  options: QuizOption[];
  correctIndex: number;
  explanationHindi: string;
  explanationEnglish: string;
  ruleTipHindi?: string;
  ruleTipEnglish?: string;
  difficulty?: 'सरल (Easy)' | 'मध्यम (Medium)' | 'कठिन (Hard)';
}

export interface GrammarModule {
  id: string;
  slug: string;
  titleHindi: string;
  titleEnglish: string;
  subtitleHindi: string;
  subtitleEnglish: string;
  iconName: string;
  bottleneckHindi: string;
  bottleneckEnglish: string;
  interactionNameHindi: string;
  interactionNameEnglish: string;
  whatStudentGainsHindi: string;
  whatStudentGainsEnglish: string;
  paramparaCorner: {
    definitionHindi: string;
    definitionEnglish: string;
    classicalShlokaOrRule: string;
    heritageContext: string;
  };
  rulesSummary: {
    ruleHindi: string;
    ruleEnglish: string;
    exampleHindi: string;
    exampleEnglish: string;
  }[];
  quickCheckQuestions: QuizQuestion[];
}

export interface KarakData {
  name: string;
  marker: string;
  meaningHindi: string;
  meaningEnglish: string;
  exampleHindi: string;
  exampleEnglish: string;
  category: 'Karan' | 'Apadan' | 'Other';
}

export interface VakyaItem {
  sentenceHindi: string;
  sentenceEnglish: string;
  type: 'सरल (Simple)' | 'संयुक्त (Compound)' | 'मिश्र (Complex)';
  clauses: {
    text: string;
    isIndependent: boolean;
    role?: 'master' | 'dependent' | 'connector';
  }[];
  connectors: string[];
  explanationHindi: string;
  explanationEnglish: string;
}

export interface VachyaStageItem {
  id: string;
  kartriHindi: string;
  kartriEnglish: string;
  karmHindi: string;
  karmEnglish: string;
  subject: string;
  object: string;
  verbActive: string;
  verbPassive: string;
  connector: string; // 'के द्वारा'
}

export interface KaalDialItem {
  id: string;
  rootWord: string; // e.g. लिख
  baseSentence: string; // लड़की पत्र लिखती है
  tenses: {
    tense: 'वर्तमान काल (Present)' | 'भूतकाल (Past)' | 'भविष्यत् काल (Future)';
    subType: string; // सामान्य, अपूर्ण, पूर्ण
    conjugatedEnding: string; // रहा था / ता है / गा
    fullSentenceHindi: string;
    fullSentenceEnglish: string;
  }[];
}

export interface MuhavaraItem {
  id: string;
  muhavara: string;
  literalImageDescription: string;
  literalHindi: string;
  literalEnglish: string;
  metaphorHindi: string;
  metaphorEnglish: string;
  sentenceHindi: string;
  sentenceEnglish: string;
}

export interface UpsargPratyayWord {
  word: string;
  rootWord: string;
  affix: string;
  breakupFormula: string;
  meaningHindi: string;
  meaningEnglish: string;
  sentenceExampleHindi: string;
  sentenceExampleEnglish: string;
}

export interface ComprehensionShortQuestion {
  id: string;
  questionHindi: string;
  questionEnglish: string;
  sampleAnswerHindi: string;
  sampleAnswerEnglish: string;
  topicId?: string;
  topicNameHindi?: string;
  topicNameEnglish?: string;
}

export interface ApathitGadyanshPassage {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  theme: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'very_hard';
  difficultyLabelHindi?: string;
  gradeLevel: GradeLevel;
  passageHindi: string;
  hindiSummary?: string;
  relatedStoryHindi?: string;
  englishSummary?: string;
  vocabularyList: {
    word: string;
    meaningHindi: string;
    meaningEnglish: string;
  }[];
  questions: QuizQuestion[];
  shortQuestions?: ComprehensionShortQuestion[];
}

export interface WorksheetItem {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  costWordCoins: number;
  descriptionHindi: string;
  descriptionEnglish: string;
  topicsCovered: string[];
  questionCount: number;
  isUnlocked: boolean;
  grades?: GradeLevel[];
  downloadUrl?: string;
  practiceQuestions: QuizQuestion[];
}

export interface CheckpointQuizResult {
  quizType: 'pre' | 'post';
  score: number;
  totalQuestions: number;
  answeredCount?: number;
  percentage: number;
  weakTopics: string[];
  masteredTopics: string[];
  errorDetails: string[];
  earnedCoins: number;
}

export interface MistakeTopicStat {
  topicKey: string;
  topicNameHindi: string;
  topicNameEnglish: string;
  wrongCount: number;
  lastWrongAt: string;
  sampleQuestions?: string[];
}

export interface SavedReportSummary {
  id: string;
  sourceType: 'worksheet' | 'custom_worksheet' | 'checkpoint_quiz' | 'gadyansh' | 'upsarg_pratyay' | 'grammar_module' | 'weak_areas_review' | 'katha_shilpi';
  moduleId?: string;
  titleHindi: string;
  titleEnglish?: string;
  grade?: string;
  score: number;
  maxScore: number;
  attemptedCount?: number;
  unansweredCount?: number;
  percentage: number;
  wordCoinsEarned: number;
  weakAreasHindi: string[];
  strongAreasHindi: string[];
  adviceSummaryHindi: string;
  date: string;
  timestamp: string;
}

export interface SavedWorksheetResult {
  score: number;
  maxScore: number;
  percentage: number;
  answers: Record<string, number>;
  completedAt: string;
}

export interface UserProgressState {
  hasOnboarded: boolean;
  onboardingMode: 'weakTopics' | 'preCheck' | 'none';
  selectedGrade: GradeLevel;
  selectedBoard?: BoardType;
  userName: string;
  wordCoins: number; // 2 correct answers = 1 WordCoin
  correctAnswersTotal: number;
  totalQuestionsAnswered: number;
  weakTopicsDeclared: string[];
  diagnosticScore: number;
  preCheckpointCompleted?: boolean;
  postCheckpointCompleted?: boolean;
  preCheckpointScore?: number | null;
  postCheckpointScore?: number | null;
  lastActiveDate?: string | null;
  timeTravel: {
    past: {
      date: string;
      baselineScore: number;
      weakTopics: string[];
      notesHindi: string;
      notesEnglish: string;
      errorsAnalysis: string[];
    };
    present: {
      currentMastery: number;
      topicsMastered: string[];
      improvementPercentage: number;
      activeStreakDays: number;
      accuracyRate: number;
    };
    future: {
      projectedExamScore: number;
      boardTargetStatus: string;
      strategicRoadmap: {
        milestone: string;
        goalHindi: string;
        goalEnglish: string;
        weeklyRoutine: string;
      }[];
    };
  };
  unlockedWorksheetIds: string[];
  badgesEarned: {
    id: string;
    nameHindi: string;
    nameEnglish: string;
    descriptionHindi: string;
    descriptionEnglish: string;
    icon: string;
    unlockedAt: string;
  }[];
  gadyanshHistory: {
    passageId: string;
    passageTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: string;
  }[];
  savedReports?: SavedReportSummary[];
  completedSimulationModules?: string[];
  completedWorksheetResults?: Record<string, SavedWorksheetResult>;
  mistakeHistory?: Record<string, MistakeTopicStat>;
  simulationCompletions?: Record<string, number>;
  simulationTopicMetrics?: Record<string, SimulationTopicMetric>;
  workbookAttempts?: WorkbookAttemptRecord[];
  kathaShilpiPortfolio?: CreativeSubmissionRecord[];
  upsargPratyaySearchesCount: number;
  storiesCreatedCount: number;
}

export interface SimulationTopicMetric {
  completions: number;
  attempts: number;
  totalScoreSum: number;
  totalMaxSum: number;
  lastAccuracyPct: number;
  lastCompletedAt: string;
}

export interface WorkbookAttemptRecord {
  id: string;
  workbookId: string;
  titleHindi: string;
  mcqCorrect: number;
  mcqTotal: number;
  paraSelectCorrect: number;
  paraSelectTotal: number;
  paraBhedCorrect: number;
  paraBhedTotal: number;
  overallScore: number;
  overallMax: number;
  percentage: number;
  completedAt: string;
}

export interface CreativeHomeworkAssignment {
  id: string;
  teacherUid?: string;
  teacherEmail: string;
  teacherName: string;
  genreId: string;
  titleHindi: string;
  instructionsHindi: string;
  wordLimit: number;
  dueDate: string;
  grade: GradeLevel;
  section: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreativeSubmissionRecord {
  id: string;
  homeworkId?: string;
  teacherEmail?: string;
  studentUid?: string;
  studentEmail: string;
  studentName: string;
  grade: GradeLevel;
  section?: string;
  genreId: string;
  titleHindi: string;
  submissionMode: 'typed' | 'handwritten';
  fileName?: string;
  mimeType?: string;
  transcribedText: string;
  overallScore: number;
  rubricScores: {
    format: number;
    content: number;
    language: number;
    vyakaranVartani?: number;
    praroop?: number;
    shabdavaliBhav?: number;
  };
  grammarErrors: {
    originalWord: string;
    correctedWord: string;
    explanationHindi: string;
  }[];
  structureFeedback?: string;
  vocabularySuggestions?: {
    originalHindi?: string;
    upgradedHindi: string;
    muhavaraOrSynonym: string;
    usageNoteHindi: string;
  }[];
  feedbackHindi: string;
  feedbackEnglish?: string;
  status: 'Submitted' | 'Reviewed';
  teacherRemarks?: string;
  coinsAwarded: number;
  submittedAt: string;
}

export interface ParagraphWordAnnotation {
  word: string;
  categoryId: 'sangya' | 'sarvanam' | 'visheshan' | 'kriya' | 'avyay';
  bhedHindi: string;
  roleHindi: string;
}

export interface ParagraphSentenceAnnotation {
  sentenceIndex: number;
  bhedType: 'saral' | 'sanyukt' | 'mishrit' | 'vidhanvachak' | 'nishedhvachak' | 'prashnavachak' | 'vismayadi';
  bhedHindi: string;
  roleHindi: string;
}

export interface InteractiveParagraphQuestion {
  id: string;
  mode: 'word' | 'sentence';
  topicId: string;
  topicNameHindi: string;
  promptHindi: string;
  promptEnglish: string;
  paragraphTitleHindi: string;
  paragraphSentences: string[];
  // For mode === 'word'
  targetWordCategory?: 'sangya' | 'sarvanam' | 'visheshan' | 'kriya' | 'avyay';
  targetCategoryLabelHindi?: string;
  wordAnnotations?: Record<string, ParagraphWordAnnotation>; // keyed by normalized word token
  bhedOptions?: { value: string; labelHindi: string }[];
  roleOptions?: { value: string; labelHindi: string }[];
  // For mode === 'sentence'
  targetSentenceBhed?: 'saral' | 'sanyukt' | 'mishrit' | 'vidhanvachak' | 'nishedhvachak' | 'prashnavachak' | 'vismayadi';
  targetSentenceBhedLabelHindi?: string;
  sentenceAnnotations?: ParagraphSentenceAnnotation[];
  explanationHindi: string;
  explanationEnglish: string;
}

export interface InteractiveWorkbookDefinition {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  topicsCovered: string[];
  costWordCoins: number;
  requiredLessonModuleIds: string[]; // e.g., ['sangya', 'sarvanam'] or ['karak', 'kriya']
  minCompletionsPerRequiredLesson: number;
  mcqQuestions: QuizQuestion[];
  paragraphQuestions: InteractiveParagraphQuestion[];
}

export interface TeacherWorksheet {
  id: string;
  teacherEmail: string;
  teacherName: string;
  grade: GradeLevel;
  section: string;
  topic: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  titleHindi: string;
  titleEnglish: string;
  createdAt: string;
  isActive: boolean;
  questions: {
    id: string;
    topicId: string;
    topicNameHindi: string;
    topicNameEnglish: string;
    questionHindi: string;
    questionEnglish: string;
    options: { textHindi: string; textEnglish: string }[];
    correctIndex: number;
    explanationHindi: string;
    explanationEnglish: string;
  }[];
}

export interface StudentWorksheetSubmission {
  worksheetId: string;
  studentEmail: string;
  studentName: string;
  grade: GradeLevel;
  score: number;
  maxScore: number;
  percentage: number;
  attemptedAt: string;
  answers: Record<string, number>;
}


