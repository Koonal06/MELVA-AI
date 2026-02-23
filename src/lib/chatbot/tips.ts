import { TopicTips } from './types';

export const progressiveTips: Record<string, TopicTips> = {
  chords: {
    beginner: {
      depth1: [
        'Build major and minor triads in one key: root, 3rd, 5th.',
        'Play I-V-vi-IV slowly at 60 BPM with clean changes.',
      ],
      depth2: [
        'Practice inversions for I, IV, V to reduce hand movement.',
        'Voice-lead by keeping common tones between adjacent chords.',
      ],
      application: [
        'Write an 8-bar progression using one inversion per bar, then record it.',
        'Reharmonize one simple melody using at least 2 different chord choices.',
      ],
    },
    intermediate: {
      depth1: [
        'Use 7th chords and connect them with guide tones (3rd/7th).',
        'Practice secondary dominants in one key center.',
      ],
      depth2: [
        'Add modal interchange chords in pre-chorus for contrast.',
        'Train smooth top-line voice movement while changing harmony.',
      ],
      application: [
        'Compose a 16-bar progression with one borrowed chord and justify why it works.',
        'Create two reharmonizations of the same chorus and compare tension profiles.',
      ],
    },
    advanced: {
      depth1: [
        'Use upper-structure tensions with clear resolution targets.',
        'Design inner-voice motion independently from melody.',
      ],
      depth2: [
        'Blend chromatic mediants while preserving functional anchors.',
        'Control harmonic rhythm to shape phrase-level energy.',
      ],
      application: [
        'Arrange a full section using tension-release mapping per bar.',
        'Create a reharmonization that preserves melody but changes emotional arc.',
      ],
    },
  },
  scales: {
    beginner: {
      depth1: [
        'Play one octave major scale at 60 BPM with consistent fingering.',
        'Say note names aloud while playing to reinforce mapping.',
      ],
      depth2: [
        'Practice 3-note and 4-note scale fragments in time.',
        'Alternate ascending and descending entries from different starting tones.',
      ],
      application: [
        'Improvise 8 bars using only scale degrees 1,2,3,5, then expand.',
        'Write one short melody using scale skips, not only stepwise motion.',
      ],
    },
    intermediate: {
      depth1: [
        'Map modes to chord qualities in one key.',
        'Practice scale fragments over backing harmony, not in isolation.',
      ],
      depth2: [
        'Target chord tones on strong beats; use scalar motion between them.',
        'Switch modal color between sections for contrast.',
      ],
      application: [
        'Create a 12-bar solo plan using two modal centers.',
        'Compose a motif and sequence it through diatonic positions.',
      ],
    },
    advanced: {
      depth1: [
        'Practice outside-inside phrasing with controlled landing notes.',
        'Apply synthetic scales only when harmony supports them.',
      ],
      depth2: [
        'Use rhythmic displacement to make scalar ideas feel musical.',
        'Shape long lines across chord changes, not per-chord fragments.',
      ],
      application: [
        'Transcribe and re-voice one advanced scalar run in your style.',
        'Design a solo etude that modulates while preserving motivic identity.',
      ],
    },
  },
  rhythm: {
    beginner: {
      depth1: [
        'Clap quarter notes, then eighth notes for 2 minutes each.',
        'Use metronome clicks on beats 2 and 4 for groove awareness.',
      ],
      depth2: [
        'Practice subdivisions out loud: 1-and-2-and, then triplets.',
        'Accent offbeats lightly to improve internal pulse.',
      ],
      application: [
        'Record a 60-second groove at fixed BPM with no timing drift.',
        'Create a 2-bar rhythm motif and repeat with variation.',
      ],
    },
    intermediate: {
      depth1: [
        'Alternate straight and swung eighths intentionally.',
        'Practice syncopated accents while keeping kick/snare stable.',
      ],
      depth2: [
        'Shift phrase starts before/after beat 1 while preserving pulse.',
        'Use ghost notes for groove density control.',
      ],
      application: [
        'Write 4 bars with increasing rhythmic complexity and perform cleanly.',
        'Practice one groove at 3 tempi and compare consistency.',
      ],
    },
    advanced: {
      depth1: [
        'Work on polymetric accent cycles over stable meter.',
        'Displace motifs across barlines without losing pocket.',
      ],
      depth2: [
        'Integrate tuplets naturally into core groove.',
        'Control microtiming (laid-back vs pushed) intentionally.',
      ],
      application: [
        'Build a rhythm etude with planned tension-release across 16 bars.',
        'Transcribe groove feel from a reference track and emulate it.',
      ],
    },
  },
  melody: {
    beginner: {
      depth1: [
        'Create a 4-note motif and repeat with one small change.',
        'Leave space between phrases to keep melody singable.',
      ],
      depth2: [
        'Use stepwise motion, then add one strategic leap.',
        'End phrases on stable notes (1, 3, or 5).',
      ],
      application: [
        'Write an 8-bar melody using motif + variation format.',
        'Sing your melody before playing; adjust awkward intervals.',
      ],
    },
    intermediate: {
      depth1: [
        'Target chord tones on strong beats.',
        'Develop motifs with sequence and rhythmic displacement.',
      ],
      depth2: [
        'Create contour contrast between verse and chorus.',
        'Use anticipation notes before chord changes.',
      ],
      application: [
        'Write two chorus melodies and choose the stronger hook by replay test.',
        'Refine one melody by reducing unnecessary note density.',
      ],
    },
    advanced: {
      depth1: [
        'Shape long-form melodic arcs across multiple sections.',
        'Use rhythm before pitch complexity for expressive clarity.',
      ],
      depth2: [
        'Layer melodic counter-lines without masking primary hook.',
        'Control cadence tension with delayed resolution tones.',
      ],
      application: [
        'Compose a through-line melody that evolves across full arrangement.',
        'Write a call-response pair with asymmetrical phrase lengths.',
      ],
    },
  },
  harmony: {
    beginner: {
      depth1: [
        'Pair melody tones with matching chord tones first.',
        'Stay diatonic before introducing color chords.',
      ],
      depth2: [
        'Use passing chords only where melody supports them.',
        'Check for smooth bass motion between harmony changes.',
      ],
      application: [
        'Harmonize one 8-bar melody using two different chord maps.',
        'Record both harmonizations and compare emotional effect.',
      ],
    },
    intermediate: {
      depth1: [
        'Connect chords through guide-tone lines.',
        'Use modal interchange in one section for contrast.',
      ],
      depth2: [
        'Balance functional harmony with color harmony.',
        'Use slash chords for smoother bass movement.',
      ],
      application: [
        'Create a reharm version and an original version of same phrase.',
        'Annotate where each harmony increases/decreases tension.',
      ],
    },
    advanced: {
      depth1: [
        'Control macro tension curves across sections.',
        'Use chromatic mediants with clear melodic anchors.',
      ],
      depth2: [
        'Design voice-leading first, then assign chord labels.',
        'Use harmonic rhythm to drive arrangement pacing.',
      ],
      application: [
        'Compose 16 bars with explicit tension map and validate by listening pass.',
        'Produce two alternate harmonic narratives from same melody.',
      ],
    },
  },
  songwriting: {
    beginner: {
      depth1: [
        'Write an 8-bar idea before editing.',
        'Choose one emotion and title first.',
      ],
      depth2: [
        'Keep chorus lyric phrasing simple and repeatable.',
        'Create contrast between verse and chorus energy.',
      ],
      application: [
        'Draft verse + chorus skeleton in 20 minutes.',
        'Rewrite chorus once with stronger rhythmic hook.',
      ],
    },
    intermediate: {
      depth1: [
        'Define section roles: setup, tension, release.',
        'Align melody contour with lyrical emphasis.',
      ],
      depth2: [
        'Improve transitions with pre-chorus lift.',
        'Use arrangement drops to spotlight hook.',
      ],
      application: [
        'Write full structure map and fill each section purposefully.',
        'A/B test two hooks by singing both over same chords.',
      ],
    },
    advanced: {
      depth1: [
        'Design narrative arc across full arrangement.',
        'Use harmonic/melodic callbacks for cohesion.',
      ],
      depth2: [
        'Control lyrical information density by section.',
        'Plan dynamic contours before final production choices.',
      ],
      application: [
        'Write a complete song brief: story, arc, hook, production intent.',
        'Create two advanced arrangement passes and compare impact.',
      ],
    },
  },
  ear_training: {
    beginner: {
      depth1: [
        'Sing then play major/minor thirds daily.',
        'Transcribe one short melody by ear each day.',
      ],
      depth2: [
        'Identify tonic by humming before touching instrument.',
        'Practice interval recognition in ascending and descending forms.',
      ],
      application: [
        'Transcribe 4 bars by ear and verify with instrument.',
        'Build a mini quiz of 10 interval checks for yourself.',
      ],
    },
    intermediate: {
      depth1: [
        'Identify cadences and bass movement by ear.',
        'Transcribe chord roots from short clips.',
      ],
      depth2: [
        'Recognize chord quality from guide tones.',
        'Train phrase-level rhythmic dictation with metronome.',
      ],
      application: [
        'Transcribe one chorus progression and compare against chart.',
        'Do blind interval + chord quality drills for 10 minutes.',
      ],
    },
    advanced: {
      depth1: [
        'Transcribe articulation and phrasing, not only notes.',
        'Train altered tension recognition in harmonic context.',
      ],
      depth2: [
        'Identify modulations and pivot chords by ear.',
        'Differentiate voicing color changes in dense arrangements.',
      ],
      application: [
        'Create a full ear-led transcription of one advanced phrase.',
        'Perform harmonic dictation with secondary dominants and modal borrow.',
      ],
    },
  },
  technique: {
    beginner: {
      depth1: [
        'Practice slowly enough to stay relaxed.',
        'Reset posture whenever tension appears.',
      ],
      depth2: [
        'Use micro-loops for difficult transitions.',
        'Increase tempo only after clean reps.',
      ],
      application: [
        'Record 60 seconds at two tempos; compare cleanliness.',
        'Focus one session entirely on weak transition mechanics.',
      ],
    },
    intermediate: {
      depth1: [
        'Loop weak transitions before full run-throughs.',
        'Use deliberate metronome ladders (+5 BPM only when clean).',
      ],
      depth2: [
        'Train motion economy and finger preparation.',
        'Separate articulation control from speed targets.',
      ],
      application: [
        'Design a 15-minute technical block with measurable goals.',
        'Run one piece at 70/85/100% tempo and evaluate consistency.',
      ],
    },
    advanced: {
      depth1: [
        'Audit motion economy at performance tempo.',
        'Balance expressive nuance with repeatability.',
      ],
      depth2: [
        'Refine control over dynamic extremes and articulation.',
        'Reduce technical noise while preserving phrasing intent.',
      ],
      application: [
        'Create a performance-readiness checklist and self-score.',
        'Record a mock performance and isolate top 2 technical leaks.',
      ],
    },
  },
  practice: {
    beginner: {
      depth1: [
        'Use a 25/5 focus cycle.',
        'Track one measurable goal each session.',
      ],
      depth2: [
        'Split time: warmup, skill, song, review.',
        'End every session with one tiny win capture.',
      ],
      application: [
        'Run a 7-day plan with daily logs and one reflection line.',
        'Adjust next day based on yesterday’s bottleneck.',
      ],
    },
    intermediate: {
      depth1: [
        'Split sessions into technique, repertoire, creativity.',
        'Finish with one performance-style run.',
      ],
      depth2: [
        'Allocate extra time to weakest competency each week.',
        'Use short diagnostic recordings during practice, not only at end.',
      ],
      application: [
        'Design and run a weekly progression plan with BPM targets.',
        'Review weekly metrics and rebalance next cycle.',
      ],
    },
    advanced: {
      depth1: [
        'Use macro weekly goals + micro daily objectives.',
        'Drive practice decisions from recording review.',
      ],
      depth2: [
        'Rotate priority domains while preserving maintenance work.',
        'Integrate performance simulation regularly.',
      ],
      application: [
        'Build a periodized 4-week practice block with checkpoints.',
        'Conduct weekly retrospective with objective metrics.',
      ],
    },
  },
  general: {
    beginner: {
      depth1: ['Choose one micro-goal for the next 15 minutes.', 'Record yourself once and review one improvement point.'],
      depth2: ['Pick one bottleneck and repeat only that for 5 focused minutes.', 'Use a metronome and reduce speed until fully clean.'],
      application: ['Run a 10-minute focused session and send back what improved.', 'Track one metric now: BPM, clean reps, or timing consistency.'],
    },
    intermediate: {
      depth1: ['Pick one bottleneck and design one drill for it.', 'Use deliberate practice: observe, adjust, retry.'],
      depth2: ['Isolate failure points and train transitions only.', 'Use two recorded takes and compare specific differences.'],
      application: ['Build a mini plan: goal, drill, metric, review.', 'Run one controlled test and refine based on results.'],
    },
    advanced: {
      depth1: ['Optimize decisions by listening to arrangement context first.', 'Prioritize musical intent over mechanical complexity.'],
      depth2: ['Trim unnecessary complexity that hurts clarity.', 'Use objective recording review before changing strategy.'],
      application: ['Draft a high-level improvement map for this week.', 'Run a performance simulation and annotate weak points.'],
    },
  },
};

