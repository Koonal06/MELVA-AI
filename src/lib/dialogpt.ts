import { generateMelvaResponse } from './melva-brain';

interface Context {
  genre: string;
  level: string;
  recentTopics: string[];
  strengths: string[];
  areasToImprove: string[];
}

// Track conversation state
let conversationState = {
  lastTopic: '',
  topicDepth: 0,
  hasGreeted: false,
  lastResponse: '',
  messageCount: 0
};

export const generateResponse = async (
  messages: { role: string; content: string }[],
  context: Context
): Promise<string> => {
  try {
    const lastMessage = messages[messages.length - 1].content;
    
    // Update conversation state
    conversationState.messageCount++;
    
    // Generate response using MELVA's brain with full history and context
    const response = generateMelvaResponse(lastMessage, {
      messages,
      context,
    });
    
    // Update state with the new response
    conversationState.lastResponse = response;
    
    return response;
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};
