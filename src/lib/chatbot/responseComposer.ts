import { getToneGuidance } from './emotionalAnalyzer';
import { memory } from './memoryManager';
import { formatPlan } from './practicePlanner';
import { Context, Intent, Topic } from './types';

interface TeachingPayload {
  coreAdvice: string;
  whyItMatters: string;
  immediateApplication: string;
}

function challengeBoost(text: string, boosted: boolean): string {
  if (!boosted) return text;
  return `${text} (Challenge +: raise by one small level if clean.)`;
}

export function composeTeachingResponse(
  context: Context,
  topic: Topic,
  payload: TeachingPayload,
  positiveSignal: boolean
): string {
  const guidance = getToneGuidance(memory.emotionalState);

  const lines = [
    guidance.validationLine,
    'Core Advice',
    challengeBoost(payload.coreAdvice, positiveSignal),
    '',
    'Why It Matters',
    payload.whyItMatters,
    '',
    'Immediate Application',
    payload.immediateApplication,
    guidance.encouragementLine,
    `Context: ${context.genre} | ${context.level} | topic=${topic}`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function composePracticePlanResponse(
  planText: string,
  weaknessTopic: string
): string {
  const lines = [planText];

  if (weaknessTopic) {
    lines.push('');
    lines.push(`I notice ${weaknessTopic} keeps coming up. Want to focus on improving it this week?`);
    lines.push('I can auto-build a 7-day structured improvement plan for it.');
  }

  return lines.join('\n');
}

export function composeTopicSwitchClarifier(previousTopic: string, newTopic: string): string {
  return `Do you want to stay on ${previousTopic} or switch fully to ${newTopic}?`;
}

export function composeMicroCoachQuestion(intent: Intent): string {
  if (intent === 'analysis') return 'Are you struggling more with speed or accuracy?';
  return 'What is the main blocker right now: speed, accuracy, or consistency?';
}

export function composePlanWithFormatting(plan: string): string {
  return formatPlan({
    totalMinutes: 25,
    blocks: plan
      .split('\n')
      .filter((line) => /^\d\./.test(line))
      .map((line) => {
        const title = line.replace(/^\d+\.\s*/, '');
        return { title, minutes: 0, detail: '' };
      }),
  });
}

