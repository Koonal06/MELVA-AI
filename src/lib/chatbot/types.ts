export type Intent =
  | 'greeting'
  | 'explain'
  | 'how_to'
  | 'practice_plan'
  | 'motivation'
  | 'analysis'
  | 'songwriting'
  | 'ear_training'
  | 'fallback';

export type Topic =
  | 'chords'
  | 'scales'
  | 'rhythm'
  | 'melody'
  | 'harmony'
  | 'songwriting'
  | 'ear_training'
  | 'technique'
  | 'practice'
  | 'general';

export type Emotion = 'neutral' | 'frustrated' | 'motivated' | 'confused';

export interface Context {
  genre: string;
  level: string;
  recentTopics: string[];
  strengths: string[];
  areasToImprove: string[];
}

export interface ConversationMessage {
  role: string;
  content: string;
}

export interface BrainOptions {
  messages?: ConversationMessage[];
  context?: Context;
}

export interface IntentScoreResult {
  intent: Intent;
  confidence: number;
  scores: Record<Intent, number>;
}

export interface BrainMemory {
  turn: number;
  lastIntent: Intent;
  lastTopic: Topic;
  topicDepth: number;
  messageCount: number;
  hasGreeted: boolean;
  currentGoal: string;
  sessionFocus: string;
  strugglingWith: string;
  repetitionCount: number;
  emotionalState: Emotion;
  recentAdviceKeys: string[];
  topicHistory: string[];
  topicFrequency: Record<string, number>;
  pendingDiagnosticQuestion: string;
  diagnosticTopic: Topic;
  switchStreak: number;
}

export interface LevelTips {
  depth1: string[];
  depth2: string[];
  application: string[];
}

export interface TopicTips {
  beginner: LevelTips;
  intermediate: LevelTips;
  advanced: LevelTips;
}
