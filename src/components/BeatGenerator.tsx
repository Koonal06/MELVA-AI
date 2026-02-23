import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Play, PauseCircle, Download, AudioWaveform as Waveform, Sliders, Music, RefreshCcw as RefreshCw } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import BeatPad from './BeatPad';

interface Beat {
  id: string;
  tempo: number;
  pattern: string[];
  instruments: string[];
  intensity: number;
}

const mockBeat: Beat = {
  id: 'beat-1',
  tempo: 120,
  pattern: ['kick', 'snare', 'hihat', 'kick'],
  instruments: ['Drum Kit', 'Percussion', 'Bass'],
  intensity: 0.7
};

const instruments = [
  'Drum Kit',
  'Percussion',
  'Bass',
  '808',
  'Synth',
  'Piano'
];

function BeatGenerator() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(['Drum Kit']);
  const [tempo, setTempo] = useState(120);
  const [intensity, setIntensity] = useState(0.7);
  const [generatedBeat, setGeneratedBeat] = useState<Beat | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
      
      mediaRecorder.ondataavailable = async (event) => {
        console.log('Recording finished, processing audio...');
        setIsGenerating(true);
        setTimeout(() => {
          setGeneratedBeat(mockBeat);
          setIsGenerating(false);
        }, 2000);
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleTapStart = () => {
    setIsTapping(true);
    setTapTimes([]);
    lastTapTimeRef.current = Date.now();
  };

  const handleTap = () => {
    if (!isTapping) return;
    
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTimeRef.current;
    
    if (timeSinceLastTap > 200) {
      setTapTimes(prev => [...prev, currentTime]);
      lastTapTimeRef.current = currentTime;
    }
  };

  const handleTapStop = () => {
    setIsTapping(false);
    if (tapTimes.length > 1) {
      const intervals = tapTimes.slice(1).map((time, i) => time - tapTimes[i]);
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedTempo = Math.round(60000 / averageInterval);
      setTempo(calculatedTempo);
      generateBeat();
    }
  };

  const generateBeat = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedBeat(mockBeat);
      setIsGenerating(false);
    }, 2000);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateBeat();
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const downloadMidi = () => {
    console.log('Downloading MIDI file...');
  };

  const handlePlay = async (previewUrl: string | undefined, id: string) => {
    if (!previewUrl) return;
    setAudioUrl(previewUrl);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AI Beat Generator
          </h2>
          <p className="text-gray-400">
            Create custom beats using your voice, tapping, or text descriptions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Input Methods */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Input Method</h3>
              
              {/* Voice Recording */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-4 rounded-full ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                  >
                    {isRecording ? (
                      <StopCircle className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </button>
                  <div>
                    <p className="font-semibold">Voice Input</p>
                    {isRecording && (
                      <p className="text-red-500">
                        Recording: {recordingTime}s
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Beat Tapping */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onMouseDown={handleTapStart}
                    onMouseUp={handleTapStop}
                    onClick={handleTap}
                    className={`p-4 rounded-full ${
                      isTapping
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                  >
                    <Waveform className="w-6 h-6" />
                  </button>
                  <div>
                    <p className="font-semibold">Tap Pattern</p>
                    <p className="text-sm text-gray-400">
                      Click and hold to start, tap to create pattern
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Input */}
              <form onSubmit={handlePromptSubmit}>
                <label className="block text-gray-300 mb-2">
                  Describe your beat
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Upbeat EDM, 120 BPM"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </div>

            {/* Beat Controls */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Customize Beat</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tempo</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="60"
                      max="180"
                      value={tempo}
                      onChange={(e) => setTempo(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="min-w-[80px] text-right">
                      {tempo} BPM
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Intensity</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity * 100}
                      onChange={(e) => setIntensity(Number(e.target.value) / 100)}
                      className="flex-1"
                    />
                    <span className="min-w-[80px] text-right">
                      {Math.round(intensity * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Instruments</label>
                  <div className="grid grid-cols-2 gap-2">
                    {instruments.map((instrument) => (
                      <button
                        key={instrument}
                        onClick={() => {
                          setSelectedInstruments(prev =>
                            prev.includes(instrument)
                              ? prev.filter(i => i !== instrument)
                              : [...prev, instrument]
                          );
                        }}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          selectedInstruments.includes(instrument)
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-800 hover:bg-gray-700'
                        } transition-colors`}
                      >
                        {instrument}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <BeatPad />

            {isGenerating ? (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
                  <p className="text-gray-400">Generating your beat...</p>
                </div>
              </div>
            ) : generatedBeat && (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Generated Beat</h3>
                
                {audioUrl && (
                  <AudioPlayer
                    src={audioUrl}
                    title="Generated Beat"
                    artist={`${generatedBeat.tempo} BPM`}
                  />
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Pattern</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {generatedBeat.pattern.map((step, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 p-2 rounded text-center text-sm"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Instruments</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedBeat.instruments.map((instrument, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded"
                        >
                          {instrument}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateBeat}
                  className="w-full mt-4 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeatGenerator;