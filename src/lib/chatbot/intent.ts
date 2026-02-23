import { BrainMemory, Intent, IntentScoreResult, Topic } from './types';

interface IntentProfile {
  keywords: string[];
  weight: number;
}

const intentProfiles: Record<Intent, IntentProfile> = {
  greeting: {
    keywords: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good evening', 'sup'],
    weight: 1.1,
  },
  explain: {
    keywords: ['what is', 'explain', 'why', 'theory', 'meaning', 'difference'],
    weight: 1.2,
  },
  how_to: {
    keywords: ['how to', 'how do i', 'steps', 'guide', 'show me', 'teach me'],
    weight: 1.3,
  },
  practice_plan: {
    keywords: ['practice plan', 'routine', 'schedule', 'daily plan', 'week plan', 'drill plan'],
    weight: 1.4,
  },
  motivation: {
    keywords: ['stuck', 'frustrated', 'give up', "can't", 'hard', 'demotivated', 'discouraged'],
    weight: 1.3,
  },
  analysis: {
    keywords: ['analyze', 'analysis', 'feedback', 'what is wrong', 'review this', 'diagnose'],
    weight: 1.35,
  },
  songwriting: {
    keywords: ['songwriting', 'write a song', 'lyrics', 'hook', 'verse', 'chorus', 'compose'],
    weight: 1.3,
  },
  ear_training: {
    keywords: ['ear training', 'interval', 'transcribe', 'dictation', 'hear chords'],
    weight: 1.25,
  },
  fallback: {
    keywords: [],
    weight: 0.6,
  },
};

const topicIntentAffinity: Partial<Record<Topic, Intent[]>> = {
  songwriting: ['songwriting', 'how_to', 'practice_plan'],
  ear_training: ['ear_training', 'how_to', 'practice_plan'],
  practice: ['practice_plan', 'how_to'],
  rhythm: ['how_to', 'practice_plan', 'analysis'],
  harmony: ['explain', 'analysis', 'how_to'],
  chords: ['explain', 'how_to', 'practice_plan'],
};

function countMatches(text: string, keywords: string[]): number {
  return keywords.reduce((sum, keyword) => {
    if (!keyword) return sum;
    return text.includes(keyword) ? sum + 1 : sum;
  }, 0);
}

export function detectIntentWithConfidence(
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
    fallback: 0.15,
  };

  (Object.keys(intentProfiles) as Intent[]).forEach((intent) => {
    const profile = intentProfiles[intent];
    const baseMatches = countMatches(text, profile.keywords);
    scores[intent] += baseMatches * profile.weight;
  });

  // Conversation continuity bonus.
  if (lastIntent !== 'fallback') {
    scores[lastIntent] += 0.35;
  }

  // Topic-intent affinity bonus.
  const relatedIntents = topicIntentAffinity[lastTopic] || [];
  relatedIntents.forEach((intent) => {
    scores[intent] += 0.25;
  });

  // Question signal tends to be instructional/explainer intent.
  if (text.includes('?')) {
    scores.how_to += 0.2;
    scores.explain += 0.15;
  }

  const sorted = (Object.entries(scores) as Array<[Intent, number]>).sort((a, b) => b[1] - a[1]);
  const [topIntent, topScore] = sorted[0];
  const total = sorted.reduce((acc, [, score]) => acc + score, 0);
  const confidence = total > 0 ? topScore / total : 0;
  const threshold = 0.24;

  if (topScore < 0.55 || confidence < threshold) {
    return {
      intent: 'fallback',
      confidence: Math.max(confidence, 0.2),
      scores,
    };
  }

  return {
    intent: topIntent,
    confidence,
    scores,
  };
}

export function detectTopic(input: string): Topic {
  const text = input.toLowerCase();
  const topicKeywords: Record<Topic, string[]> = {
    chords: ['chord', 'progression', 'voicing', 'triad', 'seventh'],
    scales: ['scale', 'mode', 'pentatonic', 'major', 'minor'],
    rhythm: ['rhythm', 'timing', 'tempo', 'groove', 'metronome', 'subdivision'],
    melody: ['melody', 'hook', 'motif', 'phrase', 'lead line'],
    harmony: ['harmony', 'voice leading', 'cadence', 'modulation', 'resolution'],
    songwriting: ['song', 'lyrics', 'chorus', 'verse', 'arrangement', 'compose'],
    ear_training: ['ear', 'interval', 'transcribe', 'dictation', 'hearing'],
    technique: ['technique', 'posture', 'fingering', 'articulation', 'tension'],
    practice: ['practice', 'routine', 'schedule', 'drill', 'session'],
    general: [],
  };

  let bestTopic: Topic = 'general';
  let bestScore = 0;
  (Object.keys(topicKeywords) as Topic[]).forEach((topic) => {
    const score = countMatches(text, topicKeywords[topic]);
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  });
  return bestTopic;
}

export function detectEmotion(input: string): BrainMemory['emotionalState'] {
  const text = input.toLowerCase();
  if (/(stuck|frustrated|annoyed|hate this|give up|hopeless)/.test(text)) return 'frustrated';
  if (/(confused|not sure|idk|don't understand|unclear)/.test(text)) return 'confused';
  if (/(excited|motivated|let's go|great progress|feeling good)/.test(text)) return 'motivated';
  return 'neutral';
}

