interface Context {
  genre: string;
  level: string;
  recentTopics: string[];
  strengths: string[];
  areasToImprove: string[];
}

interface ConversationMemory {
  lastTopic?: string;
  topicDepth: number;
  questionAsked: boolean;
  suggestionsGiven: boolean;
  personalizedAdvice: boolean;
  followUpContext?: string;
}

// Expanded knowledge base for different topics
const responses = {
  theory: {
    initial: [
      "Let's explore {concept} in {genre} music. This is fundamental for {level} players. 🎵",
      "I'd love to help you understand {concept}. In {genre}, it's particularly important because...",
      "Great question about {concept}! For {level} players in {genre}, here's how we can break it down..."
    ],
    followUp: [
      "Now that we've covered the basics of {concept}, shall we dive deeper into how it's used in {genre}?",
      "That's a good foundation for {concept}. Would you like to explore some practical applications in {genre}?",
      "You're getting the hang of {concept}! Ready to see how it's applied in real {genre} pieces?"
    ],
    examples: [
      "Here's a classic example from {genre}: {example}",
      "Let me demonstrate this with a popular {genre} piece: {example}",
      "In {genre}, you'll often hear this in songs like {example}"
    ]
  },
  practice: {
    initial: [
      "For {level} {genre} players, here's an effective practice routine for {technique}...",
      "Let's design a {genre}-focused practice schedule that suits your {level} level...",
      "I'll help you structure your {genre} practice sessions to master {technique}..."
    ],
    followUp: [
      "How are you finding these exercises? We can adjust them to better suit your needs.",
      "Would you like to explore more advanced practice techniques for {genre}?",
      "Shall we break down this practice routine into smaller, manageable steps?"
    ],
    encouragement: [
      "Remember, consistent practice is key in {genre} music. You're doing great! 🌟",
      "I can see you're dedicated to improving your {genre} skills. Keep it up! 💪",
      "Your commitment to practicing {genre} is admirable. Let's keep building on that! 🎵"
    ]
  },
  technique: {
    initial: [
      "Let's work on your {technique} technique in {genre}. For {level} players, here's what to focus on...",
      "Mastering {technique} in {genre} requires attention to these key elements...",
      "I'll guide you through developing your {technique} skills for {genre} music..."
    ],
    correction: [
      "Watch out for this common mistake when practicing {technique} in {genre}...",
      "Many {level} players struggle with this aspect of {technique}. Here's how to overcome it...",
      "Let me help you refine your {technique} technique for better {genre} performance..."
    ],
    progression: [
      "You're making progress with {technique}! Ready to try something more challenging?",
      "Now that you're comfortable with basic {technique}, let's explore some advanced applications in {genre}.",
      "Your {technique} technique is improving! Shall we add some {genre}-specific variations?"
    ]
  },
  composition: {
    initial: [
      "Creating {genre} music starts with understanding these fundamental elements...",
      "Let's explore {genre} composition techniques suitable for {level} musicians...",
      "I'll help you develop your {genre} songwriting skills step by step..."
    ],
    development: [
      "Now that you have a basic melody, let's develop it using {genre} techniques...",
      "Your composition shows potential! Here's how we can enhance it with {genre} elements...",
      "Let's explore different ways to arrange your piece in {genre} style..."
    ],
    feedback: [
      "Your composition has strong elements of {genre}. Here's what works well...",
      "I can help you refine this section to better fit the {genre} style...",
      "Let's analyze how we can make your piece more authentic to {genre}..."
    ]
  }
};

// Enhanced topic extraction with weighted relevance
const extractTopics = (message: string): { topic: string; relevance: number }[] => {
  const topics = {
    'scales': ['scale', 'mode', 'key', 'notes'],
    'chords': ['chord', 'harmony', 'progression', 'voicing'],
    'rhythm': ['rhythm', 'tempo', 'timing', 'beat', 'groove'],
    'melody': ['melody', 'tune', 'melodic', 'line', 'phrase'],
    'technique': ['technique', 'fingering', 'position', 'form', 'posture'],
    'practice': ['practice', 'exercise', 'routine', 'drill', 'warm-up'],
    'theory': ['theory', 'concept', 'understand', 'learn', 'knowledge'],
    'composition': ['compose', 'write', 'create', 'arrange', 'songwriting']
  };

  return Object.entries(topics)
    .map(([topic, keywords]) => ({
      topic,
      relevance: keywords.reduce((count, keyword) => 
        count + (message.toLowerCase().split(keyword.toLowerCase()).length - 1), 0)
    }))
    .filter(({ relevance }) => relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
};

// Conversation state management
let conversationMemory: ConversationMemory = {
  topicDepth: 0,
  questionAsked: false,
  suggestionsGiven: false,
  personalizedAdvice: false
};

const generateFollowUp = (category: string, context: Context, topic: string): string => {
  const followUps = responses[category as keyof typeof responses].followUp;
  return customizeResponse(
    followUps[Math.floor(Math.random() * followUps.length)],
    context,
    topic
  );
};

const addPersonalizedAdvice = (context: Context, topic: string): string => {
  const advice = {
    beginner: [
      "Start with the basics and build a strong foundation in {genre}.",
      "Focus on developing good habits early in your {genre} journey.",
      "Take your time with fundamental {genre} techniques."
    ],
    intermediate: [
      "Now's a great time to expand your {genre} repertoire.",
      "Try incorporating more advanced {genre} techniques.",
      "Challenge yourself with complex {genre} pieces."
    ],
    advanced: [
      "Explore innovative approaches to {genre} music.",
      "Consider teaching or mentoring others in {genre}.",
      "Push the boundaries of traditional {genre} techniques."
    ]
  };

  const levelAdvice = advice[context.level.toLowerCase() as keyof typeof advice];
  return levelAdvice[Math.floor(Math.random() * levelAdvice.length)]
    .replace('{genre}', context.genre);
};

const customizeResponse = (template: string, context: Context, topic: string = ''): string => {
  let response = template
    .replace(/{genre}/g, context.genre)
    .replace(/{level}/g, context.level)
    .replace(/{concept}/g, topic)
    .replace(/{technique}/g, topic);

  // Add examples based on genre
  if (response.includes('{example}')) {
    const examples = {
      jazz: ['Giant Steps', 'Autumn Leaves', 'Blue in Green'],
      classical: ['Moonlight Sonata', 'Für Elise', 'Claire de Lune'],
      rock: ['Sweet Child O\' Mine', 'Stairway to Heaven', 'Bohemian Rhapsody'],
      blues: ['Sweet Home Chicago', 'The Thrill is Gone', 'Crossroad Blues']
    };

    const genreExamples = examples[context.genre.toLowerCase() as keyof typeof examples] || examples.jazz;
    response = response.replace('{example}', genreExamples[Math.floor(Math.random() * genreExamples.length)]);
  }

  return response;
};

export const generateMelvaResponse = async (
  messages: { role: string; content: string }[],
  context: Context
): Promise<string> => {
  try {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const extractedTopics = extractTopics(lastMessage);
    const mainTopic = extractedTopics[0]?.topic || '';

    // Determine response category and type
    let category: keyof typeof responses;
    let responseType: 'initial' | 'followUp' | 'development' | 'feedback';

    if (mainTopic === conversationMemory.lastTopic) {
      conversationMemory.topicDepth++;
      category = mainTopic as keyof typeof responses;
      responseType = conversationMemory.topicDepth > 1 ? 'development' : 'followUp';
    } else {
      conversationMemory.topicDepth = 0;
      category = (mainTopic || 'practice') as keyof typeof responses;
      responseType = 'initial';
      conversationMemory.lastTopic = mainTopic;
    }

    // Generate base response
    const responseOptions = responses[category][responseType];
    let response = customizeResponse(
      responseOptions[Math.floor(Math.random() * responseOptions.length)],
      context,
      mainTopic
    );

    // Add context-aware elements
    if (!conversationMemory.personalizedAdvice) {
      response += "\n\n" + addPersonalizedAdvice(context, mainTopic);
      conversationMemory.personalizedAdvice = true;
    }

    // Add follow-up question if none asked recently
    if (!conversationMemory.questionAsked) {
      response += "\n\n" + generateFollowUp(category, context, mainTopic);
      conversationMemory.questionAsked = true;
    }

    // Add encouragement periodically
    if (Math.random() > 0.7) {
      const encouragement = responses.practice.encouragement;
      response += "\n\n" + customizeResponse(
        encouragement[Math.floor(Math.random() * encouragement.length)],
        context,
        mainTopic
      );
    }

    // Reset question flag for next interaction
    conversationMemory.questionAsked = false;

    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};