// Music knowledge base
const musicKnowledge = [
  {
    "prompt": "What is a major chord?",
    "completion": "A major chord consists of three notes: the root, major third, and perfect fifth. For example, C major = C, E, G. 🎵"
  },
  {
    "prompt": "What is a minor chord?",
    "completion": "A minor chord includes the root, minor third, and perfect fifth. Example: A minor = A, C, E."
  },
  {
    "prompt": "What is a scale in music?",
    "completion": "A scale is a sequence of notes ordered by pitch. The C major scale is C D E F G A B."
  },
  {
    "prompt": "Explain the 4/4 time signature.",
    "completion": "4/4 time means 4 beats per measure, and each beat is a quarter note. It's the most common time signature. 🥁"
  },
  {
    "prompt": "How can I improve my rhythm?",
    "completion": "Practice with a metronome daily, start slow, and increase speed gradually. Try clapping and tapping exercises. 🕒"
  },
  {
    "prompt": "What is a triad?",
    "completion": "A triad is a chord made up of three notes — the root, third, and fifth."
  },
  {
    "prompt": "What are chord progressions?",
    "completion": "Chord progressions are sequences of chords used to structure songs. A common one is I–IV–V–I."
  },
  {
    "prompt": "What is a seventh chord?",
    "completion": "A seventh chord adds the seventh note to a triad. Example: G7 = G, B, D, F."
  },
  {
    "prompt": "What is an arpeggio?",
    "completion": "An arpeggio is when you play the notes of a chord one after the other instead of together."
  },
  {
    "prompt": "What is a metronome used for?",
    "completion": "A metronome is used to keep a steady tempo while practicing rhythm or timing. 🧭"
  },
  {
    "prompt": "How do I write a melody?",
    "completion": "Start with a scale, use stepwise motion, and try to keep a singable and simple phrase structure."
  },
  {
    "prompt": "What is a key signature?",
    "completion": "A key signature shows the sharps or flats in a scale. C major has no sharps or flats."
  },
  {
    "prompt": "What are dynamics in music?",
    "completion": "Dynamics indicate volume changes in music, such as piano (soft) or forte (loud)."
  }
];

// Topic-specific response templates
const responseTemplates = {
  chords: (genre: string, level: string) => `
🎵 Let's explore this chord concept in ${genre} music.

For ${level} players, here's what to focus on:

1. Basic Structure:
   - Root note
   - Chord quality
   - Common variations

2. Practice Tips:
   - Start slow
   - Focus on clean transitions
   - Listen for proper voicing

Would you like specific examples or exercises? 💡`,

  scales: (genre: string, level: string) => `
🎵 Let's work on scales in ${genre} music!

For ${level} players:

1. Scale Structure:
   - Notes and intervals
   - Pattern recognition
   - Key characteristics

2. Practice Method:
   - Use a metronome
   - Start slowly
   - Practice in patterns

Need help with specific fingerings or exercises? 🎸`,

  practice: (genre: string, level: string) => `
💪 Here's a structured practice routine for ${level} ${genre} players:

1. Warm-up (10-15 mins):
   - Finger exercises
   - Basic scales
   - Simple patterns

2. Technical Work (20-30 mins):
   - Specific exercises
   - Pattern practice
   - Speed building

Would you like me to break down any of these sections? ✨`,

  theory: (genre: string, level: string) => `
📚 Let's explore music theory in ${genre}!

For ${level} players:

1. Key Concepts:
   - Scales and modes
   - Chord progressions
   - Rhythm patterns

2. Application:
   - Song analysis
   - Common patterns
   - Practice exercises

What specific aspect would you like to focus on? 🎵`
};

// Find the closest matching knowledge base entry
const findClosestMatch = (message: string): string | null => {
  const messageLower = message.toLowerCase();
  let bestMatch = { entry: null, score: 0 };

  for (const entry of musicKnowledge) {
    const promptWords = entry.prompt.toLowerCase().split(' ');
    const score = promptWords.reduce((acc, word) => 
      acc + (messageLower.includes(word) ? 1 : 0), 0) / promptWords.length;

    if (score > 0.5 && score > bestMatch.score) {
      bestMatch = { entry, score };
    }
  }

  return bestMatch.entry ? bestMatch.entry.completion : null;
};

// Topic detection for specialized responses
const detectTopic = (message: string): string => {
  const topics = {
    chords: ['chord', 'progression', 'harmony', 'key'],
    scales: ['scale', 'mode', 'notes', 'key'],
    practice: ['practice', 'exercise', 'routine', 'drill'],
    songwriting: ['write', 'compose', 'song', 'melody'],
    rhythm: ['rhythm', 'beat', 'tempo', 'time']
  };

  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return topic;
    }
  }
  return 'general';
};

interface Context {
  genre: string;
  level: string;
  recentTopics: string[];
  strengths: string[];
  areasToImprove: string[];
}

export const generateMelvaResponse = async (
  messages: { role: string; content: string }[],
  context: Context
): Promise<string> => {
  try {
    // First try to find a direct match in the knowledge base
    const lastMessage = messages[messages.length - 1].content;
    const knowledgeMatch = findClosestMatch(lastMessage);
    if (knowledgeMatch) {
      return knowledgeMatch;
    }

    // Use template-based response if available
    const topic = detectTopic(lastMessage);
    const template = responseTemplates[topic as keyof typeof responseTemplates];
    if (template) {
      return template(context.genre, context.level);
    }

    // Default response if no match found
    return `Let me help you with ${topic} in ${context.genre} music! What specific aspect would you like to explore? 🎵`;
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};