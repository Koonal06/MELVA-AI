import { Context, Emotion, Topic } from './types';

interface PlanBlock {
  title: string;
  minutes: number;
  detail: string;
}

export interface DynamicPlan {
  totalMinutes: number;
  blocks: PlanBlock[];
}

function baseDistribution(level: string): [number, number, number, number] {
  const normalized = level.toLowerCase();
  if (normalized.includes('beginner')) return [8, 9, 5, 3];
  if (normalized.includes('advanced')) return [6, 10, 6, 3];
  return [7, 9, 6, 3];
}

function adjustForEmotion(
  distribution: [number, number, number, number],
  emotion: Emotion
): [number, number, number, number] {
  if (emotion === 'frustrated') return [9, 8, 4, 4];
  if (emotion === 'confused') return [10, 8, 4, 3];
  if (emotion === 'motivated') return [6, 10, 6, 3];
  return distribution;
}

export function buildDynamicPracticePlan(
  context: Context,
  lastTopic: Topic,
  sessionFocus: string,
  emotionalState: Emotion
): DynamicPlan {
  const [techMin, coreMin, creativityMin, perfMin] = adjustForEmotion(
    baseDistribution(context.level),
    emotionalState
  );

  const focus = sessionFocus || lastTopic;
  const genre = context.genre || 'music';

  return {
    totalMinutes: 25,
    blocks: [
      {
        title: 'Technique',
        minutes: techMin,
        detail: `Warm-up and precision prep focused on ${focus}.`,
      },
      {
        title: 'Core Topic',
        minutes: coreMin,
        detail: `Deep work on ${lastTopic} for ${genre} with slow-to-clean progression.`,
      },
      {
        title: 'Creativity',
        minutes: creativityMin,
        detail: `Create a short ${genre} idea using today's focus.`,
      },
      {
        title: 'Quick Performance Run',
        minutes: perfMin,
        detail: 'Single take, then one note: what improved and what is next.',
      },
    ],
  };
}

export function formatPlan(plan: DynamicPlan): string {
  const lines = ['🎯 Today’s 25-Minute Plan', ''];
  plan.blocks.forEach((block, index) => {
    lines.push(`${index + 1}. ${block.title} (${block.minutes} min)`);
    lines.push(`   ${block.detail}`);
  });
  return lines.join('\n');
}
