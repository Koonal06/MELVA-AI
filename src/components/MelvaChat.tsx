import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { generateResponse } from '../lib/dialogpt';

interface Message {
  role: string;
  content: string;
  id?: string;
}

interface Context {
  genre: string;
  level: string;
  recentTopics: string[];
  strengths: string[];
  areasToImprove: string[];
}

interface MelvaChatProps {
  userLevel?: string;
  genre?: string;
  focusArea?: string;
  onSuggestionRequest?: (suggestion: string) => void;
}

interface StoredOnboardingProfile {
  genre?: string;
  level?: string;
  teacherAdvice?: string;
}

export default function MelvaChat({
  userLevel,
  genre,
  focusArea,
  onSuggestionRequest,
}: MelvaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProfile, setSavedProfile] = useState<StoredOnboardingProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('melva_onboarding_profile');
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredOnboardingProfile;
      setSavedProfile(parsed);
    } catch (storageError) {
      console.warn('Unable to read onboarding profile from localStorage', storageError);
    }
  }, []);

  const effectiveGenre = genre || savedProfile?.genre || 'pop';
  const effectiveLevel = userLevel || savedProfile?.level || 'intermediate';
  const effectiveFocus = focusArea || savedProfile?.teacherAdvice || '';

  const context: Context = {
    genre: effectiveGenre,
    level: effectiveLevel,
    recentTopics: effectiveFocus
      ? [effectiveFocus, 'chord progressions']
      : ['chord progressions', 'songwriting'],
    strengths: ['rhythm', 'melody writing'],
    areasToImprove: ['music theory', 'harmony'],
  };

  useEffect(() => {
    const styleHint = effectiveGenre ? ` for ${effectiveGenre}` : '';
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I'm MELVA, your AI music tutor${styleHint}. I can tailor guidance to your current style and level. Ask me for drills, songwriting help, or feedback on what you're practicing.`,
      },
    ]);
  }, [effectiveGenre, effectiveLevel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: newMessage.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateResponse([...messages, userMessage], context);
      onSuggestionRequest?.(response);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-700 bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask MELVA anything about music..."
              className="w-full p-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !newMessage.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

