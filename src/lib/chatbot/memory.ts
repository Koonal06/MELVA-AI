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
};

export function updateMemoryCore(intent: Intent, topic: Topic, emotion: Emotion): void {
  memory.turn += 1;
  memory.messageCount += 1;
  memory.lastIntent = intent;
  memory.emotionalState = emotion;

  if (topic === memory.lastTopic) {
    memory.topicDepth += 1;
    memory.repetitionCount += 1;
  } else {
    memory.lastTopic = topic;
    memory.topicDepth = 0;
    memory.repetitionCount = 0;
    memory.sessionFocus = topic;
  }

  memory.topicHistory.push(topic);
  if (memory.topicHistory.length > 20) {
    memory.topicHistory = memory.topicHistory.slice(-20);
  }

  memory.topicFrequency[topic] = (memory.topicFrequency[topic] || 0) + 1;
  if ((memory.topicFrequency[topic] || 0) >= 3) {
    memory.strugglingWith = topic;
  }
}

export function setGoalFromInput(input: string): void {
  const trimmed = input.replace(/\s+/g, ' ').trim();
  if (!trimmed) return;

  const goalTrigger = /(goal|focus|need to|want to|trying to|improve)/i;
  if (goalTrigger.test(trimmed)) {
    memory.currentGoal = trimmed.length > 90 ? `${trimmed.slice(0, 90)}...` : trimmed;
  }
}

export function pickUnseenAdvice(topic: Topic, candidates: string[]): string[] {
  const unseen = candidates.filter((tip) => !memory.recentAdviceKeys.includes(`${topic}:${tip}`));
  if (unseen.length >= 2) return unseen;
  memory.recentAdviceKeys = [];
  return candidates;
}

export function rememberAdvice(topic: Topic, advice: string[]): void {
  advice.forEach((tip) => {
    memory.recentAdviceKeys.push(`${topic}:${tip}`);
  });
  if (memory.recentAdviceKeys.length > 16) {
    memory.recentAdviceKeys = memory.recentAdviceKeys.slice(-16);
  }
}

