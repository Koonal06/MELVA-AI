import React, { useState, useEffect, useRef } from 'react';
import { Music2, BookOpen, GraduationCap, Play, Pause, ChevronRight, ChevronLeft, RefreshCw, Volume2 } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import MelvaChat from './MelvaChat';
import { searchTracks, type JamendoTrack } from '../lib/jamendo';
import * as Tonal from 'tonal';
import { ChordSynth } from '../lib/chordSynth';
import { analyzeAudio, type AudioAnalysisResult } from '../lib/audioAnalysis';

interface TeacherRecommendationsProps {
  genre: string;
  level: string;
  teacherAdvice: string;
}

interface ChordData {
  name: string;
  fullName: string;
  description: string;
  notes: { name: string; role: string; color: string }[];
}

function TeacherRecommendations({ genre, level, teacherAdvice }: TeacherRecommendationsProps) {
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMiniChat, setShowMiniChat] = useState(true);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isPlayingChord, setIsPlayingChord] = useState(false);
  const [suggestedChords, setSuggestedChords] = useState<ChordData[]>([]);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysisResult | null>(null);
  
  const synthRef = useRef<ChordSynth | null>(null);
  const currentTrack = currentTrackIndex !== null && tracks.length > 0 ? tracks[currentTrackIndex] : null;
  const currentChord = suggestedChords[currentChordIndex] || suggestedChords[0];

  useEffect(() => {
    // Initialize synth
    synthRef.current = new ChordSynth();
    
    return () => {
      // Cleanup not needed for ChordSynth
    };
  }, []);

  useEffect(() => {
    if (currentTrack?.audio) {
      analyzeAudio(currentTrack.audio).then(analysis => {
        setAudioAnalysis(analysis);
        // Update suggested chords based on analysis
        setSuggestedChords(analysis.chords.map(chord => generateChordData(chord)));
      });
    }
  }, [currentTrack]);

  const generateChordData = (chordSymbol: string): ChordData => {
    const chord = Tonal.Chord.get(chordSymbol);
    const notes = chord.notes;
    const roles = ['Root', '3rd', '5th', '7th'];
    const colors = ['text-red-500', 'text-yellow-500', 'text-green-500', 'text-blue-500'];

    return {
      name: chordSymbol,
      fullName: chord.name,
      description: getChordDescription(chord.type),
      notes: notes.map((note, i) => ({
        name: note,
        role: roles[i] || `Extension`,
        color: colors[i] || 'text-purple-500'
      }))
    };
  };

  const getChordDescription = (type: string): string => {
    const descriptions: { [key: string]: string } = {
      'major': 'A bright, stable sound',
      'minor': 'A soft, melancholic sound',
      'dominant': 'A strong, energetic sound that wants to resolve',
      'diminished': 'A tense, mysterious sound',
      'augmented': 'A bright, otherworldly sound',
      'major seventh': 'A bright, jazzy sound perfect for modern music',
      'minor seventh': 'A soft, jazzy sound with emotional depth',
      'dominant seventh': 'A strong, bluesy sound that pushes forward'
    };
    return descriptions[type] || 'A unique and colorful sound';
  };

  const generateChordsForKey = (key: string, style: string = 'pop'): ChordData[] => {
    let chordProgressions: string[][] = [];
    
    if (style.toLowerCase().includes('jazz')) {
      chordProgressions = [
        [`${key}maj7`, `${key}m7`, `${key}7`, `${key}maj7`],
        [`${key}maj7`, `${key}m7`, `${key}m7b5`, `${key}7`]
      ];
    } else if (style.toLowerCase().includes('blues')) {
      chordProgressions = [
        [`${key}7`, `${key}7`, `${key}7`, `${key}7`],
        [`${key}7`, `${key}4`, `${key}5`, `${key}7`]
      ];
    } else {
      // Pop/Rock progressions
      const scale = Tonal.Scale.get(`${key} major`);
      chordProgressions = [
        [`${key}`, `${key}4`, `${key}5`, `${key}`],
        [`${key}`, `${key}m`, `${key}4`, `${key}5`]
      ];
    }

    return chordProgressions[0].map(chord => generateChordData(chord));
  };

  const fetchTracks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const jamendoTracks = await searchTracks(genre, teacherAdvice);
      
      if (jamendoTracks.length === 0) {
        const broadTracks = await searchTracks('instrumental', 'practice');
        setTracks(broadTracks);
        setError('No exact matches found for your criteria. Showing related suggestions.');
      } else {
        setTracks(jamendoTracks);
      }
    } catch (err) {
      setError('Failed to load tracks. Please try again.');
      setTracks([]);
    } finally {
      setLoading(false);
      setCurrentTrackIndex(0);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [genre, level, teacherAdvice]);

  useEffect(() => {
    // Initialize with default chords if no analysis yet
    if (suggestedChords.length === 0) {
      setSuggestedChords(generateChordsForKey('C', genre));
    }
  }, []);

  const handleNext = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleMelvaSuggestion = (suggestion: string) => {
    console.log('Melva suggested:', suggestion);
  };

  const playChordSound = async () => {
    if (!synthRef.current || !currentChord) return;

    try {
      setIsPlayingChord(true);
      await synthRef.current.playChord(currentChord.notes.map(n => n.name));
      setTimeout(() => setIsPlayingChord(false), 1000);
    } catch (err) {
      console.error('Error playing chord:', err);
      setIsPlayingChord(false);
    }
  };

  // Mock rhythm pattern with intensity values
  const mockRhythmPattern = [1, 0.5, 0.5, 1, 0, 0.5, 0.5, 1];

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Your Personalized Music Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <Music2 className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-gray-400">Genre</p>
              <p className="font-semibold">{genre}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-gray-400">Level</p>
              <p className="font-semibold">{level}</p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <BookOpen className="w-6 h-6 text-pink-500 mb-2" />
              <p className="text-gray-400">Focus Area</p>
              <p className="font-semibold">{teacherAdvice}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-amber-500 bg-amber-500/10 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentTrack && (
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-start gap-4 mb-6">
                    <img 
                      src={currentTrack.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80'}
                      alt={currentTrack.name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold mb-2">{currentTrack.name}</h3>
                        <button
                          onClick={fetchTracks}
                          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                          title="Get new suggestions"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-400 mb-2">{currentTrack.artist_name}</p>
                      <div className="flex flex-wrap gap-2">
                        {currentTrack.tags && currentTrack.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-sm bg-blue-500/20 text-blue-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <AudioPlayer
                    src={currentTrack.audio}
                    title={currentTrack.name}
                    artist={currentTrack.artist_name}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    showSkipButtons
                  />

                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Suggested Chord Progression</h4>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setCurrentChordIndex(prev => (prev - 1 + suggestedChords.length) % suggestedChords.length)}
                          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex-1">
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="text-xl font-bold">{currentChord.name}</h5>
                                <p className="text-gray-400 text-sm">{currentChord.fullName}</p>
                              </div>
                              <button
                                onClick={playChordSound}
                                className={`p-2 rounded-full transition-all ${
                                  isPlayingChord 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                                title="Click to hear this chord!"
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-4">
                              {currentChord.description}
                            </p>

                            <div className="space-y-2">
                              {currentChord.notes.map((note, i) => (
                                <div 
                                  key={i}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span className={`w-2 h-2 rounded-full ${note.color}`} />
                                  <span className="font-mono">{note.name}</span>
                                  <span className="text-gray-400">({note.role})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => setCurrentChordIndex(prev => (prev + 1) % suggestedChords.length)}
                          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">Rhythm Pattern</h4>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-end gap-1 h-20">
                          {mockRhythmPattern.map((intensity, i) => (
                            <div
                              key={i}
                              className={`w-8 rounded-t transition-all duration-300 ${
                                currentChordIndex === i ? 'bg-blue-500' : 'bg-gray-600'
                              }`}
                              style={{
                                height: `${intensity * 100}%`,
                                opacity: currentChordIndex === i ? 1 : 0.7,
                                transform: currentChordIndex === i ? 'scaleY(1.1)' : 'scaleY(1)'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 rounded-lg p-4">
                      <h4 className="text-lg font-semibold mb-2">🧠 Practice Tip</h4>
                      <p className="text-gray-300">
                        Start by strumming gently with the beat. Focus on smooth transitions between chords. 
                        Remember: it's okay to go slow — feeling the groove is more important than speed! 
                        Try counting "1-2-3-4" as you play to stay in time.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 overflow-hidden sticky top-6">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold">Ask Melva</h3>
                  <p className="text-sm text-gray-400">
                    Get help understanding your analysis results
                  </p>
                </div>
                <div className="h-[600px]">
                <MelvaChat
                  userLevel={level}
                  genre={genre}
                  focusArea={teacherAdvice}
                  onSuggestionRequest={handleMelvaSuggestion}
                />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherRecommendations;
