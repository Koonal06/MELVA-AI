import { generateTutorResponse } from './chatbot/engine';
import { BrainOptions } from './chatbot/types';

export const generateMelvaResponse = (input: string, options: BrainOptions = {}): string => {
  return generateTutorResponse(input, options);
};

