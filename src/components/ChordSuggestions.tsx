import React from 'react';
import { Music2, ArrowRight } from 'lucide-react';

interface ChordSuggestionsProps {
  chords: string[];
  confidence: number;
  tempo: number;
}

const ChordSuggestions: React.FC<ChordSuggestionsProps> = ({
  chords,
  confidence,
  tempo
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Suggested Progressions</h3>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {chords.map((chord, index) => (
            <React.Fragment key={index}>
              <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-mono">
                {chord}
              </div>
              {index < chords.length - 1 && (
                <ArrowRight className="w-5 h-5 text-gray-500" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-sm">{Math.round(confidence * 100)}%</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Tempo</p>
            <div className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-blue-500" />
              <span>{Math.round(tempo)} BPM</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>
            Try playing these chords in sequence. They follow common patterns in
            this key and should sound harmonious with your music.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChordSuggestions;