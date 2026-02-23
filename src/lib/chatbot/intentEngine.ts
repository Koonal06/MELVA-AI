import { Intent, IntentScoreResult, Topic } from './types';

interface IntentRule {
  keywords: string[];
  weight: number;
}

const intentRules: Record<Intent, IntentRule> = {
  greeting: {
    keywords: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good evening', 'good afternoon'],
    weight: 1.1,
  },
  explain: {
    keywords: ['what is', 'explain', 'why', 'theory', 'difference', 'meaning'],
    weight: 1.2,
  },
  how_to: {
    keywords: ['how to', 'how do i', 'steps', 'guide me', 'teach me', 'show me'],
    weight: 1.25,
  },
  practice_plan: {
    keywords: ['practice plan', 'routine', 'schedule', 'daily plan', 'weekly plan', '25 minute plan'],
    weight: 1.35,
  },
  motivation: {
    keywords: ['stuck', 'frustrated', 'can’t', "can't", 'bad', 'struggling', 'discouraged', 'confused'],
    weight: 1.3,
  },
  analysis: {
    keywords: ['analyze', 'analysis', 'feedback', 'what is wrong', 'diagnose', 'review this'],
    weight: 1.3,
  },
  songwriting: {
    keywords: ['songwriting', 'write a song', 'lyrics', 'verse', 'chorus', 'hook', 'compose'],
    weight: 1.3,
  },
  ear_training: {
    keywords: ['ear training', 'interval', 'transcribe', 'dictation', 'hear'],
    weight: 1.25,
  },
  fallback: {
    keywords: [],
    weight: 0.5,
  },
};

const topicAffinity: Partial<Record<Topic, Intent[]>> = {
  songwriting: ['songwriting', 'how_to', 'practice_plan'],
  ear_training: ['ear_training', 'practice_plan', 'how_to'],
  practice: ['practice_plan', 'how_to'],
  harmony: ['explain', 'analysis'],
  chords: ['explain', 'how_to'],
  rhythm: ['how_to', 'practice_plan', 'analysis'],
};

function keywordMatches(text: string, keywords: string[]): number {
  return keywords.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
}

export function scoreIntent(
  input: string,
  lastIntent: Intent,
  lastTopic: Topic
): IntentScoreResult {
  const text = input.toLowerCase();
  const scores: Record<Intent, number> = {
    greeting: 0,
    explain: 0,
    how_to: 0,
    practice_plan: 0,
    motivation: 0,
    analysis: 0,
    songwriting: 0,
    ear_training: 0,
    fallback: 0.1,
  };

  (Object.keys(intentRules) as Intent[]).forEach((intent) => {
    const rule = intentRules[intent];
    const matches = keywordMatches(text, rule.keywords);
    scores[intent] += matches * rule.weight;
  });

  if (lastIntent !== 'fallback') {
    scores[lastIntent] += 0.3;
  }

  (topicAffinity[lastTopic] || []).forEach((intent) => {
    scores[intent] += 0.25;
  });

  if (text.includes('?')) {
    scores.how_to += 0.2;
    scores.explain += 0.15;
  }

  const sorted = (Object.entries(scores) as Array<[Intent, number]>).sort((a, b) => b[1] - a[1]);
  const [bestIntent, bestScore] = sorted[0];
  const total = sorted.reduce((sum, [, val]) => sum + val, 0);
  const confidence = total > 0 ? bestScore / total : 0;

  if (bestScore < 0.55 || confidence < 0.24) {
    return { intent: 'fallback', confidence: Math.max(confidence, 0.2), scores };
  }

  return { intent: bestIntent, confidence, scores };
}

