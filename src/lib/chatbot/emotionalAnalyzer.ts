import { Emotion } from './types';

const frustrationKeywords = ['stuck', 'frustrated', "can't", 'can’t', 'bad', 'struggling', 'confused'];
const positiveKeywords = ['great', 'good', 'better', 'improved', 'awesome', 'nice', 'confident', 'motivated'];

export interface EmotionalSignal {
  emotionalState: Emotion;
  positiveSignal: boolean;
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((word) => text.includes(word));
}

export function analyzeEmotion(input: string): EmotionalSignal {
  const text = input.toLowerCase();
  if (includesAny(text, frustrationKeywords)) {
    return { emotionalState: 'frustrated', positiveSignal: false };
  }
  if (includesAny(text, ['confused', "don't understand", 'not sure', 'idk'])) {
    return { emotionalState: 'confused', positiveSignal: false };
  }
  if (includesAny(text, positiveKeywords)) {
    return { emotionalState: 'motivated', positiveSignal: true };
  }
  return { emotionalState: 'neutral', positiveSignal: false };
}

export function getToneGuidance(emotion: Emotion): {
  validationLine: string;
  simplificationFactor: number;
  encouragementLine: string;
} {
  if (emotion === 'frustrated') {
    return {
      validationLine: "I hear you. This part can feel hard, and that's normal.",
      simplificationFactor: 0.8,
      encouragementLine: 'We will target one small win first, then build from there.',
    };
  }
  if (emotion === 'confused') {
    return {
      validationLine: 'Good call asking now. We can simplify this quickly.',
      simplificationFactor: 0.85,
      encouragementLine: 'A clear next step will remove most of the confusion.',
    };
  }
  if (emotion === 'motivated') {
    return {
      validationLine: 'Great momentum. Let us use it efficiently.',
      simplificationFactor: 1.1,
      encouragementLine: 'I will raise the challenge slightly.',
    };
  }
  return {
    validationLine: '',
    simplificationFactor: 1,
    encouragementLine: '',
  };
}

