import React, { useState, useRef, useEffect } from 'react';
import { Upload, Music2, Clock, Activity, Brain, AudioWaveform as Waveform, Volume2, RefreshCw } from 'lucide-react';
import AudioAnalyzer from './AudioAnalyzer';
import ChordSuggestions from './ChordSuggestions';
import MelvaChat from './MelvaChat';
import type { AudioAnalysisResult } from '../lib/audioAnalysis';

interface MusicAnalysisProps {
  initialAnalysis?: AudioAnalysisResult;
}

function MusicAnalysis({ initialAnalysis }: MusicAnalysisProps) {
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(initialAnalysis || null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const visualizationRef = useRef<HTMLDivElement>(null);
  const [showSpectogram, setShowSpectogram] = useState(false);

  const handleAnalysis = (result: AudioAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleRating = async (rating: number) => {
    setUserRating(rating);
    // Store rating in Supabase for future pattern refinement
    // This would be implemented in a real production environment
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Advanced Music Analysis
          </h2>
          <p className="text-gray-400">
            Get detailed insights into your music's patterns, structure, and theory. Play or sing into your microphone
            to start analyzing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AudioAnalyzer onAnalysis={handleAnalysis} visualizationContainer={visualizationRef.current} />

            {/* Visualization Container */}
            <div ref={visualizationRef} className="bg-gray-900 rounded-xl p-4 h-32" />

            {analysisResult && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <Music2 className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-gray-400 text-sm">Key</p>
                    <p className="font-semibold">{analysisResult.key} {analysisResult.scale}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-500 mb-2" />
                    <p className="text-gray-400 text-sm">Tempo</p>
                    <p className="font-semibold">{analysisResult.tempo} BPM</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <Activity className="w-6 h-6 text-green-500 mb-2" />
                    <p className="text-gray-400 text-sm">Complexity</p>
                    <p className="font-semibold">
                      {Math.round(analysisResult.rhythmComplexity * 100)}%
                    </p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <Volume2 className="w-6 h-6 text-pink-500 mb-2" />
                    <p className="text-gray-400 text-sm">Dynamics</p>
                    <p className="font-semibold">
                      {Math.round(analysisResult.dynamics.mean * 100)}%
                    </p>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-gray-900 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Pattern Analysis</h3>
                  
                  <div className="space-y-6">
                    {/* Rhythm Section */}
                    <div>
                      <h4 className="text-lg font-medium mb-2">Rhythm Profile</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Syncopation</p>
                          <div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${analysisResult.syncopation * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Swing</p>
                          <div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500"
                              style={{ width: `${analysisResult.swing * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Complexity</p>
                          <div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${analysisResult.rhythmComplexity * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Melody Features */}
                    <div>
                      <h4 className="text-lg font-medium mb-2">Melodic Structure</h4>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <span>Scale: {analysisResult.melodyFeatures.scale}</span>
                          <span>Variations: {analysisResult.melodyFeatures.variations}</span>
                        </div>
                        <div className="h-24 relative">
                          {analysisResult.melodyFeatures.contour.map((value, index) => (
                            <div
                              key={index}
                              className="absolute w-1 bg-blue-500"
                              style={{
                                height: `${Math.abs(value) * 100}%`,
                                left: `${(index / analysisResult.melodyFeatures.contour.length) * 100}%`,
                                bottom: value > 0 ? '50%' : 'auto',
                                top: value <= 0 ? '50%' : 'auto',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Modulations */}
                    {analysisResult.modulations.count > 0 && (
                      <div>
                        <h4 className="text-lg font-medium mb-2">Key Changes</h4>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center gap-4">
                            {analysisResult.modulations.keys.map((key, index) => (
                              <React.Fragment key={index}>
                                <span className="text-blue-400">{key}</span>
                                {index < analysisResult.modulations.keys.length - 1 && (
                                  <RefreshCw className="w-4 h-4 text-gray-500" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <ChordSuggestions
                  chords={analysisResult.chords}
                  confidence={analysisResult.confidence}
                  tempo={analysisResult.tempo}
                />

                {/* User Feedback */}
                <div className="bg-gray-900 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Rate This Analysis</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRating(rating)}
                        className={`p-2 rounded-full transition-colors ${
                          userRating === rating
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 overflow-hidden sticky top-6">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Ask MELVA</h3>
                <p className="text-sm text-gray-400">
                  Get help understanding your analysis results
                </p>
              </div>
              <div className="h-[600px]">
                <MelvaChat />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicAnalysis;