import { BrainMemory, Emotion, Intent, Topic } from './types';

export const memory: BrainMemory = {
  turn: 0,
  lastIntent: 'fallback',
  lastTopic: 'general',
  topicDepth: 0,
  messageCount: 0,
  hasGreeted: false,
  currentGoal: '',
  sessionFocus: '',
  strugglingWith: '',
  repetitionCount: 0,
  emotionalState: 'neutral',
  recentAdviceKeys: [],
  topicHistory: [],
  topicFrequency: {},
  pendingDiagnosticQuestion: '',
  diagnosticTopic: 'general',
  switchStreak: 0,
};

export function updateMemoryOnTurn(
  intent: Intent,
  topic: Topic,
  emotion: Emotion,
  input: string,
  options: { countAsTopicProgress?: boolean } = {}
): void {
  const countAsTopicProgress = options.countAsTopicProgress ?? true;
  memory.turn += 1;
  memory.messageCount += 1;
  memory.lastIntent = intent;
  memory.emotionalState = emotion;

  if (countAsTopicProgress) {
    if (topic === memory.lastTopic) {
      memory.topicDepth += 1;
      memory.repetitionCount += 1;
      memory.switchStreak = 0;
    } else {
      memory.topicDepth = 0;
      memory.repetitionCount = 0;
      memory.switchStreak += 1;
      memory.sessionFocus = topic;
      memory.lastTopic = topic;
    }

    memory.topicHistory.push(topic);
    if (memory.topicHistory.length > 24) {
      memory.topicHistory = memory.topicHistory.slice(-24);
    }

    memory.topicFrequency[topic] = (memory.topicFrequency[topic] || 0) + 1;
    if (memory.topicFrequency[topic] >= 3) {
      memory.strugglingWith = topic;
    }
  }

  const trimmed = input.replace(/\s+/g, ' ').trim();
  if (/(goal|focus|want to|trying to|need to|improve)/i.test(trimmed)) {
    memory.currentGoal = trimmed.length > 90 ? `${trimmed.slice(0, 90)}...` : trimmed;
  }
}

export function selectUnseenAdvice(topic: Topic, tips: string[]): string[] {
  const unseen = tips.filter((tip) => !memory.recentAdviceKeys.includes(`${topic}:${tip}`));
  if (unseen.length >= 2) return unseen;
  memory.recentAdviceKeys = [];
  return tips;
}

export function rememberAdvice(topic: Topic, advice: string[]): void {
  advice.forEach((tip) => memory.recentAdviceKeys.push(`${topic}:${tip}`));
  if (memory.recentAdviceKeys.length > 20) {
    memory.recentAdviceKeys = memory.recentAdviceKeys.slice(-20);
  }
}

export function shouldAskDiagnostic(topic: Topic): boolean {
  if (memory.pendingDiagnosticQuestion) return false;
  if (memory.emotionalState === 'frustrated' || memory.emotionalState === 'confused') return true;
  return memory.repetitionCount > 0 && topic !== 'general' && memory.turn % 3 === 0;
}

export function setDiagnosticQuestion(topic: Topic, question: string): void {
  memory.pendingDiagnosticQuestion = question;
  memory.diagnosticTopic = topic;
}

export function consumeDiagnosticIfAnswered(input: string): string {
  if (!memory.pendingDiagnosticQuestion) return '';
  const text = input.toLowerCase();
  const isSpeed = /(speed|fast|tempo)/.test(text);
  const isAccuracy = /(accuracy|clean|mistake|precision)/.test(text);
  if (!isSpeed && !isAccuracy) return '';

  const response = isSpeed
    ? 'Good call. We will lower tempo by 10 BPM, lock clean reps, then rebuild speed.'
    : 'Great, accuracy first. We will isolate the weak transition and require 2 clean reps before tempo increase.';

  memory.pendingDiagnosticQuestion = '';
  memory.diagnosticTopic = 'general';
  return response;
}
