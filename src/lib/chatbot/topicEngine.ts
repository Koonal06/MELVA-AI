import { Topic } from './types';

const topicKeywords: Record<Topic, string[]> = {
  chords: ['chord', 'progression', 'voicing', 'triad', 'seventh'],
  scales: ['scale', 'mode', 'pentatonic', 'major scale', 'minor scale'],
  rhythm: ['rhythm', 'timing', 'tempo', 'groove', 'beat', 'metronome'],
  melody: ['melody', 'hook', 'motif', 'phrase', 'tune'],
  harmony: ['harmony', 'voice leading', 'cadence', 'modulation', 'resolve'],
  songwriting: ['song', 'lyrics', 'chorus', 'verse', 'compose', 'arrangement'],
  ear_training: ['ear', 'interval', 'transcribe', 'dictation'],
  technique: ['technique', 'posture', 'fingering', 'articulation', 'control'],
  practice: ['practice', 'routine', 'schedule', 'drill', 'session'],
  general: [],
};

function countMatches(text: string, words: string[]): number {
  return words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
}

export function detectTopic(input: string): Topic {
  const text = input.toLowerCase();
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

export function shouldClarifyRapidSwitch(topicHistory: string[]): boolean {
  if (topicHistory.length < 4) return false;
  const recent = topicHistory.slice(-4);
  let switches = 0;
  for (let i = 1; i < recent.length; i += 1) {
    if (recent[i] !== recent[i - 1]) switches += 1;
  }
  return switches >= 3;
}

