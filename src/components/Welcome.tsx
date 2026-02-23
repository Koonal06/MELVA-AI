import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music2,
  Brain,
  AudioWaveform as Waveform,
} from 'lucide-react';

interface Option {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

function Welcome() {
  const navigate = useNavigate();

  const options: Option[] = [
    {
      id: 'teacher',
      title: 'AI-Based Music Suggestions',
      description: 'Get personalized music recommendations from a teacher\'s perspective',
      icon: <Music2 className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      path: '/onboarding'
    },
    {
      id: 'analysis',
      title: 'Music Pattern Analysis',
      description: 'Upload your music for AI-powered analysis and insights',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      path: '/onboarding'
    },
    {
      id: 'beats',
      title: 'AI-Generated Beats',
      description: 'Create custom beats using AI based on your input',
      icon: <Waveform className="w-8 h-8" />,
      color: 'from-pink-500 to-pink-600',
      path: '/onboarding'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to MELVA!</h1>
          <p className="text-xl text-gray-300">
            Your AI-powered music assistant. Choose how you'd like to explore music today.
          </p>
        </div>

        <div className="grid gap-6">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.path, { state: { selectedOption: option.id } })}
              className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-500 transition-all duration-300 text-left group"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Welcome;