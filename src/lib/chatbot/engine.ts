import { analyzeEmotion } from './emotionalAnalyzer';
import { scoreIntent } from './intentEngine';
import {
  consumeDiagnosticIfAnswered,
  memory,
  rememberAdvice,
  selectUnseenAdvice,
  setDiagnosticQuestion,
  shouldAskDiagnostic,
  updateMemoryOnTurn,
} from './memoryManager';
import { buildDynamicPracticePlan, formatPlan } from './practicePlanner';
import {
  composeMicroCoachQuestion,
  composePracticePlanResponse,
  composeTeachingResponse,
  composeTopicSwitchClarifier,
} from './responseComposer';
import { progressiveTips } from './tips';
import { detectTopic, shouldClarifyRapidSwitch } from './topicEngine';
import { BrainOptions, Context, LevelTips, Topic } from './types';

const defaultContext: Context = {
  genre: 'pop',
  level: 'intermediate',
  recentTopics: [],
  strengths: [],
  areasToImprove: [],
};

function getLevelKey(level: string): 'beginner' | 'intermediate' | 'advanced' {
  const normalized = level.toLowerCase();
  if (normalized.includes('beginner')) return 'beginner';
  if (normalized.includes('advanced')) return 'advanced';
  return 'intermediate';
}

function getDepthBucket(levelTips: LevelTips, depth: number): { mode: 'depth1' | 'depth2' | 'application' | 'custom'; tips: string[] } {
  if (depth <= 0) return { mode: 'depth1', tips: levelTips.depth1 };
  if (depth === 1) return { mode: 'depth2', tips: levelTips.depth2 };
  if (depth === 2) return { mode: 'application', tips: levelTips.application };
  return { mode: 'custom', tips: [] };
}

function buildCustomDrill(topic: Topic, context: Context): string {
  return `Custom ${topic} drill for ${context.genre}: 3 min isolate, 6 min slow clean reps, 4 min build tempo, 2 min record-and-review.`;
}

function pickAdvice(topic: Topic, context: Context): { tipA: string; tipB: string; mode: string } {
  const topicTips = progressiveTips[topic] || progressiveTips.general;
  const levelTips = topicTips[getLevelKey(context.level)];
  const bucket = getDepthBucket(levelTips, memory.topicDepth);

  if (bucket.mode === 'custom') {
    const tipA = buildCustomDrill(topic, context);
    const tipB = 'Repeat once more and track one metric: clean reps or stable timing.';
    rememberAdvice(topic, [tipA, tipB]);
    return { tipA, tipB, mode: 'custom' };
  }

  const unseen = selectUnseenAdvice(topic, bucket.tips);
  const tipA = unseen[0] || buildCustomDrill(topic, context);
  const tipB = unseen[1] || 'Repeat with a small measurable improvement.';
  rememberAdvice(topic, [tipA, tipB]);
  return { tipA, tipB, mode: bucket.mode };
}

function buildWhyItMatters(topic: Topic, context: Context): string {
  if (topic === 'general') {
    return `Building a clear routine improves consistency and confidence in your ${context.genre} practice.`;
  }
  return `Improving ${topic} increases consistency and musical control in your ${context.genre} playing.`;
}

function buildImmediateApplication(tipB: string): string {
  return `${tipB} Then record 30 seconds and note one improvement point.`;
}

function naturalGreeting(input: string, context: Context): string | null {
  const text = input.toLowerCase().trim();
  if (/^(hi|hello|hey|yo|sup|good morning|good evening|good afternoon)[!. ]*$/.test(text)) {
    return `Hey! Ready to improve your ${context.genre} today?`;
  }
  return null;
}

function isAcknowledgement(input: string): boolean {
  return /^(yes|yeah|yep|ok|okay|sure|then|go on|continue|cool|nice)[!. ]*$/i.test(input.trim());
}

function inferFallbackTopic(context: Context): Topic {
  const fromRecent = (context.recentTopics[0] || '').toLowerCase();
  if (fromRecent.includes('chord')) return 'chords';
  if (fromRecent.includes('rhythm') || fromRecent.includes('tempo')) return 'rhythm';
  if (fromRecent.includes('scale')) return 'scales';
  if (fromRecent.includes('song')) return 'songwriting';
  if (fromRecent.includes('ear')) return 'ear_training';
  if (fromRecent.includes('technique')) return 'technique';
  return 'practice';
}

function generateResponse(input: string, options: BrainOptions = {}): string {
  const context = options.context || defaultContext;
  const detectedTopic = detectTopic(input);
  const emotionSignal = analyzeEmotion(input);
  const intentResult = scoreIntent(input, memory.lastIntent, memory.lastTopic);
  const previousTopic = memory.lastTopic;
  const text = input.trim();
  const lowSignal = text.split(/\s+/).filter(Boolean).length <= 2;
  const ack = isAcknowledgement(text);
  const topic =
    detectedTopic === 'general' && (ack || lowSignal)
      ? (memory.sessionFocus as Topic) || (memory.lastTopic as Topic) || inferFallbackTopic(context)
      : detectedTopic;
  const countAsTopicProgress = !(ack || (lowSignal && detectedTopic === 'general'));

  updateMemoryOnTurn(intentResult.intent, topic, emotionSignal.emotionalState, input, {
    countAsTopicProgress,
  });

  const greeting = naturalGreeting(input, context);
  if (greeting && input.trim().split(/\s+/).length <= 6) {
    return greeting;
  }

  if (ack && memory.lastIntent === 'greeting') {
    return `Nice. Do you want to start with chords, rhythm, songwriting, or ear training for ${context.genre}?`;
  }

  const diagnosticResolution = consumeDiagnosticIfAnswered(input);
  if (diagnosticResolution) {
    return diagnosticResolution;
  }

  if (previousTopic !== topic && shouldClarifyRapidSwitch(memory.topicHistory)) {
    return composeTopicSwitchClarifier(previousTopic, topic);
  }

  if (intentResult.intent === 'practice_plan') {
    const plan = buildDynamicPracticePlan(context, memory.lastTopic, memory.sessionFocus, memory.emotionalState);
    const formatted = formatPlan(plan);
    return composePracticePlanResponse(formatted, memory.strugglingWith);
  }

  if (shouldAskDiagnostic(topic)) {
    const q = composeMicroCoachQuestion(intentResult.intent);
    setDiagnosticQuestion(topic, q);
    return q;
  }

  const { tipA, tipB, mode } = pickAdvice(topic, context);
  const response = composeTeachingResponse(
    context,
    topic,
    {
      coreAdvice: tipA,
      whyItMatters: buildWhyItMatters(topic, context),
      immediateApplication: buildImmediateApplication(tipB),
    },
    emotionSignal.positiveSignal
  );

  if (memory.topicFrequency[topic] >= 3) {
    return `${response}\n\nI notice ${topic} keeps coming up. Want to focus on improving it this week?`;
  }

  return `${response}\n\nDepth Mode: ${mode} | Intent Confidence: ${(intentResult.confidence * 100).toFixed(0)}%`;
}

export function generateTutorResponse(input: string, options: BrainOptions = {}): string {
  return generateResponse(input, options);
}
