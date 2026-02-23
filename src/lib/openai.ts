import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
    const systemPrompt = `You are MELVA, a friendly and knowledgeable AI music tutor specializing in ${context.genre} music. 
Your role is to help ${context.level} level students understand music theory, rhythm, and practice techniques.

Key Guidelines:
- Keep responses encouraging, clear, and tailored to the student's level
- Focus on practical, actionable advice
- Use music terminology appropriate for their level
- Provide specific examples when explaining concepts
- Suggest exercises or practice techniques when relevant

Student Context:
- Level: ${context.level}
- Recent topics: ${context.recentTopics.join(', ')}
- Strengths: ${context.strengths.join(', ')}
- Areas to improve: ${context.areasToImprove.join(', ')}

Remember to:
1. Break down complex concepts into digestible parts
2. Relate explanations to ${context.genre} music when possible
3. Encourage regular practice and proper technique
4. Provide positive reinforcement while maintaining educational value`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    });

    return completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble generating a response. Could you please rephrase your question?";
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};