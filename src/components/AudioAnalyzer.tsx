import React, { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, Music, Volume2, AlertCircle } from 'lucide-react';
import { AudioAnalyzer } from '../lib/audioAnalysis';

interface AudioAnalyzerProps {
  onAnalysis: (result: {
    key: string;
    chords: string[];
    confidence: number;
    tempo: number;
  }) => void;
}

const AudioAnalyzerComponent: React.FC<AudioAnalyzerProps> = ({ onAnalysis }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudioDevices, setHasAudioDevices] = useState<boolean | null>(null);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);

  useEffect(() => {
    checkAudioDevices();
    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.stopAnalysis();
      }
    };
  }, []);

  const checkAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      setHasAudioDevices(audioInputs.length > 0);
    } catch (error) {
      console.error('Error checking audio devices:', error);
      setHasAudioDevices(false);
    }
  };

  const startAnalysis = async () => {
    try {
      setError(null);
      
      if (!hasAudioDevices) {
        setError('No microphone found. Please connect a microphone and try again.');
        return;
      }

      if (!analyzerRef.current) {
        analyzerRef.current = new AudioAnalyzer();
      }
      
      await analyzerRef.current.startAnalysis((result) => {
        onAnalysis(result);
      });
      
      setIsAnalyzing(true);
    } catch (error: any) {
      setError(error.message || 'Failed to start audio analysis');
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    if (analyzerRef.current) {
      analyzerRef.current.stopAnalysis();
    }
    setIsAnalyzing(false);
  };

  if (hasAudioDevices === false) {
    return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="text-center text-red-400 space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <h3 className="text-xl font-semibold">No Microphone Detected</h3>
          <p className="text-gray-400">
            Please connect a microphone to use the audio analysis feature.
            <br />
            Click the button below to check again after connecting a device.
          </p>
          <button
            onClick={checkAudioDevices}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Check for Microphone
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Audio Analysis</h3>
        <button
          onClick={isAnalyzing ? stopAnalysis : startAnalysis}
          className={`p-3 rounded-full transition-colors ${
            isAnalyzing
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAnalyzing ? (
            <StopCircle className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-blue-500" />
            <span>Listening to your music...</span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 animate-pulse" />
          </div>
        </div>
      )}

      {!isAnalyzing && !error && (
        <div className="text-center text-gray-400">
          <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Click the microphone to start analyzing your music</p>
        </div>
      )}
    </div>
  );
};

export default AudioAnalyzerComponent;