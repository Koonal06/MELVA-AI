import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Volume2, AudioWaveform as Waveform, Music2, Drum, Play, Square, Pause, RotateCcw } from 'lucide-react';

interface DrumSynth {
  name: string;
  id: string;
  color: string;
  icon: React.ReactNode;
  category: 'drums' | 'percussion' | 'effects';
  createSound: () => Tone.Synth | Tone.NoiseSynth | Tone.PolySynth;
}

const DRUM_SOUNDS: DrumSynth[] = [
  // Drums
  {
    name: 'Kick',
    id: 'kick',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: <Drum className="w-6 h-6 mb-2" />,
    category: 'drums',
    createSound: () => new Tone.PolySynth(Tone.MembraneSynth, {
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1
      }
    }).toDestination()
  },
  {
    name: 'Snare',
    id: 'snare',
    color: 'bg-purple-600 hover:bg-purple-700',
    icon: <Drum className="w-6 h-6 mb-2" />,
    category: 'drums',
    createSound: () => new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1
      }
    }).toDestination()
  },
  {
    name: 'Hi-Hat',
    id: 'hihat',
    color: 'bg-green-600 hover:bg-green-700',
    icon: <Music2 className="w-6 h-6 mb-2" />,
    category: 'drums',
    createSound: () => new Tone.PolySynth(Tone.MetalSynth, {
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination()
  },
  // Percussion
  {
    name: 'Clap',
    id: 'clap',
    color: 'bg-pink-600 hover:bg-pink-700',
    icon: <Volume2 className="w-6 h-6 mb-2" />,
    category: 'percussion',
    createSound: () => new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.15,
        sustain: 0,
        release: 0.05
      }
    }).toDestination()
  },
  {
    name: 'Tom',
    id: 'tom',
    color: 'bg-orange-600 hover:bg-orange-700',
    icon: <Drum className="w-6 h-6 mb-2" />,
    category: 'drums',
    createSound: () => new Tone.PolySynth(Tone.MembraneSynth, {
      pitchDecay: 0.05,
      octaves: 2,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.05
      }
    }).toDestination()
  },
  {
    name: 'Rim',
    id: 'rim',
    color: 'bg-yellow-600 hover:bg-yellow-700',
    icon: <Music2 className="w-6 h-6 mb-2" />,
    category: 'percussion',
    createSound: () => new Tone.PolySynth(Tone.MetalSynth, {
      frequency: 800,
      envelope: {
        attack: 0.001,
        decay: 0.05,
        release: 0.01
      },
      harmonicity: 3.1,
      modulationIndex: 16,
      resonance: 8000,
      octaves: 0.5
    }).toDestination()
  },
  {
    name: 'Crash',
    id: 'crash',
    color: 'bg-indigo-600 hover:bg-indigo-700',
    icon: <Waveform className="w-6 h-6 mb-2" />,
    category: 'effects',
    createSound: () => new Tone.PolySynth(Tone.MetalSynth, {
      frequency: 300,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        release: 0.2
      },
      harmonicity: 4.1,
      modulationIndex: 64,
      resonance: 2000,
      octaves: 2.5
    }).toDestination()
  },
  {
    name: 'Shaker',
    id: 'shaker',
    color: 'bg-teal-600 hover:bg-teal-700',
    icon: <Volume2 className="w-6 h-6 mb-2" />,
    category: 'percussion',
    createSound: () => new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.05
      }
    }).toDestination()
  }
];

const STEPS = 16;
const DEFAULT_BPM = 120;

const BeatPad: React.FC = () => {
  const [synths, setSynths] = useState<{ [key: string]: Tone.Synth | Tone.NoiseSynth | Tone.PolySynth }>({});
  const [error, setError] = useState<string | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'drums' | 'percussion' | 'effects'>('all');
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [sequence, setSequence] = useState<{ [key: string]: boolean[] }>({});

  useEffect(() => {
    const synthMap: { [key: string]: Tone.Synth | Tone.NoiseSynth | Tone.PolySynth } = {};
    const initialSequence: { [key: string]: boolean[] } = {};
    
    DRUM_SOUNDS.forEach(drum => {
      try {
        synthMap[drum.id] = drum.createSound();
        initialSequence[drum.id] = Array(STEPS).fill(false);
      } catch (err) {
        console.error(`Failed to create ${drum.name} synth:`, err);
        setError(`Failed to initialize ${drum.name} sound`);
      }
    });

    setSynths(synthMap);
    setSequence(initialSequence);

    // Initialize Transport
    Tone.Transport.bpm.value = DEFAULT_BPM;
    Tone.Transport.timeSignature = 4;

    return () => {
      Object.values(synthMap).forEach(synth => {
        synth.dispose();
      });
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const handleStartAudio = async () => {
    try {
      await Tone.start();
      setAudioStarted(true);
      console.log("🔊 Audio context started");
    } catch (err) {
      console.error('Error starting audio context:', err);
      setError('Failed to start audio context');
    }
  };

  const handlePadClick = async (id: string) => {
    try {
      if (!audioStarted) {
        await handleStartAudio();
      }
      
      const synth = synths[id];
      if (synth) {
        setActiveSound(id);
        setTimeout(() => setActiveSound(null), 150);

        if (synth instanceof Tone.PolySynth) {
          if (id === 'kick' || id === 'tom') {
            synth.triggerAttackRelease(id === 'kick' ? 'C1' : 'G1', '8n');
          } else {
            synth.triggerAttackRelease('C4', '16n');
          }
        } else {
          synth.triggerAttackRelease('16n');
        }
      }
    } catch (err) {
      console.error('Error playing sound:', err);
      setError('Error playing sound. Please try again.');
    }
  };

  const toggleStep = async (soundId: string, step: number) => {
    if (!audioStarted) {
      await handleStartAudio();
    }

    setSequence(prev => ({
      ...prev,
      [soundId]: prev[soundId].map((value, i) => i === step ? !value : value)
    }));
  };

  const startSequencer = async () => {
    if (!audioStarted) {
      await handleStartAudio();
    }

    // Clear any existing events
    Tone.Transport.cancel();

    // Create new sequence
    const loop = new Tone.Sequence(
      (time) => {
        DRUM_SOUNDS.forEach(({ id }) => {
          if (sequence[id][currentStep]) {
            const synth = synths[id];
            if (synth) {
              if (synth instanceof Tone.PolySynth) {
                if (id === 'kick' || id === 'tom') {
                  synth.triggerAttackRelease(id === 'kick' ? 'C1' : 'G1', '8n', time);
                } else {
                  synth.triggerAttackRelease('C4', '16n', time);
                }
              } else {
                synth.triggerAttackRelease('16n', time);
              }
            }
          }
        });
        
        // Use Tone.Draw to ensure UI updates are synchronized with audio
        Tone.Draw.schedule(() => {
          setCurrentStep((prev) => (prev + 1) % STEPS);
        }, time);
      },
      Array.from({ length: STEPS }, (_, i) => i),
      '16n'
    );

    loop.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stopSequencer = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const resetSequence = () => {
    stopSequencer();
    setSequence(prev => {
      const reset: typeof prev = {};
      Object.keys(prev).forEach(key => {
        reset[key] = Array(STEPS).fill(false);
      });
      return reset;
    });
  };

  const filteredSounds = DRUM_SOUNDS.filter(
    sound => activeCategory === 'all' || sound.category === activeCategory
  );

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Beat Pad</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">BPM:</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
              min="60"
              max="200"
            />
          </div>
          {!audioStarted ? (
            <button
              onClick={handleStartAudio}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
            >
              Start Audio
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? stopSequencer : startSequencer}
                className={`p-2 rounded-lg transition-colors ${
                  isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={resetSequence}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {(['all', 'drums', 'percussion', 'effects'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Sequencer Grid */}
        <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <div className="space-y-2 min-w-[600px]">
            {filteredSounds.map(sound => (
              <div key={sound.id} className="flex items-center gap-2">
                <div className={`w-24 px-3 py-2 ${sound.color} rounded-lg text-sm font-medium`}>
                  {sound.name}
                </div>
                <div className="flex-1 grid grid-cols-16 gap-1">
                  {sequence[sound.id]?.map((isActive, step) => (
                    <button
                      key={step}
                      onClick={() => toggleStep(sound.id, step)}
                      className={`w-full aspect-square rounded transition-all ${
                        isActive 
                          ? `${sound.color} scale-90`
                          : 'bg-gray-700 hover:bg-gray-600'
                      } ${currentStep === step && isPlaying ? 'ring-2 ring-white' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sound Pads */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredSounds.map(drum => (
            <button
              key={drum.id}
              onClick={() => handlePadClick(drum.id)}
              className={`p-6 rounded-xl flex flex-col items-center justify-center ${drum.color} ${
                activeSound === drum.id ? 'scale-95' : ''
              } transition-all duration-150`}
            >
              {drum.icon}
              <span className="font-bold">{drum.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-400">
        <p className="text-center">
          Click the grid to create patterns or use the pads to play sounds directly!
        </p>
        <p className="text-center text-xs">
          Use the category filters above to focus on specific sound types
        </p>
      </div>
    </div>
  );
};

export default BeatPad;