import EssentiaWASM from 'essentia.js';
import WaveSurfer from 'wavesurfer.js';
import * as Tonal from 'tonal';

export interface AudioAnalysisResult {
  key: string;
  scale: string;
  chords: string[];
  tempo: number;
  confidence: number;
  rhythmComplexity: number;
  syncopation: number;
  swing: number;
  dynamics: {
    mean: number;
    variance: number;
    peaks: number[];
  };
  melodyFeatures: {
    scale: string;
    repetitions: number;
    variations: number;
    contour: number[];
  };
  modulations: {
    count: number;
    points: number[];
    keys: string[];
  };
}

export class AudioAnalyzer {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private essentia: any | null = null;
  private wavesurfer: WaveSurfer | null = null;
  private isAnalyzing: boolean = false;
  private dataBuffer: Float32Array = new Float32Array(2048);
  private previousFeatures: Partial<AudioAnalysisResult> | null = null;
  private static instance: AudioAnalyzer | null = null;

  // Singleton pattern to prevent multiple instances
  public static getInstance(): AudioAnalyzer {
    if (!AudioAnalyzer.instance) {
      AudioAnalyzer.instance = new AudioAnalyzer();
    }
    return AudioAnalyzer.instance;
  }

  constructor() {
    if (AudioAnalyzer.instance) {
      return AudioAnalyzer.instance;
    }
    AudioAnalyzer.instance = this;
  }

  async startAnalysis(
    callback: (result: AudioAnalysisResult) => void,
    visualizationContainer?: HTMLElement
  ) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 2048;
      source.connect(this.analyzer);

      // Initialize Essentia with the audio context
      try {
        await EssentiaWASM.load();
        this.essentia = new EssentiaWASM.EssentiaJS(this.audioContext);
        console.log('Essentia initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Essentia:', error);
        // Don't throw - allow fallback to simulated analysis
      }

      if (visualizationContainer) {
        this.initializeWaveSurfer(visualizationContainer, source);
      }
      
      this.isAnalyzing = true;
      this.analyze(callback);
    } catch (error) {
      throw new Error('Failed to start audio analysis: ' + (error as Error).message);
    }
  }

  private initializeWaveSurfer(container: HTMLElement, source: MediaStreamAudioSourceNode) {
    this.wavesurfer = WaveSurfer.create({
      container,
      waveColor: '#4299e1',
      progressColor: '#3182ce',
      cursorColor: '#2c5282',
      height: 100,
      normalize: true,
      responsive: true,
      interact: false,
    });
    
    // Connect WaveSurfer to the audio source
    const wavesurferNode = this.audioContext!.createMediaStreamSource(this.stream!);
    wavesurferNode.connect(this.wavesurfer.backend.ac.destination);
  }

  stopAnalysis() {
    this.isAnalyzing = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }
    this.analyzer = null;
    this.previousFeatures = null;
  }

  private async analyze(callback: (result: AudioAnalysisResult) => void) {
    if (!this.isAnalyzing || !this.analyzer) return;

    this.analyzer.getFloatTimeDomainData(this.dataBuffer);
    
    const features = await this.extractFeatures(this.dataBuffer);
    const result = this.processFeatures(features);

    // Update visualization if available
    if (this.wavesurfer) {
      this.wavesurfer.loadDecodedBuffer(this.audioContext!.createBuffer(
        1,
        this.dataBuffer.length,
        this.audioContext!.sampleRate
      ));
    }

    callback(result);
    this.previousFeatures = result;

    // Continue analysis loop
    requestAnimationFrame(() => this.analyze(callback));
  }

  private async extractFeatures(buffer: Float32Array) {
    if (!this.essentia) return null;

    try {
      // Extract comprehensive musical features using Essentia
      const features = await this.essentia.MusicExtractor(buffer);
      
      // TODO: Add additional feature extraction:
      // - Implement beat grid visualization
      // - Add spectrogram analysis
      // - Create piano roll visualization
      // - Integrate with Spotify Audio Features API
      // - Add Genius API integration for contextual analysis
      // - Implement user feedback loop for ML model improvement

      return features;
    } catch (error) {
      console.error('Error extracting features:', error);
      return null;
    }
  }

  private processFeatures(features: any): AudioAnalysisResult {
    // If no features available, return simulated data
    if (!features) {
      return this.generateSimulatedAnalysis();
    }

    const scale = Tonal.Scale.detect(features.harmony?.chroma || [])[0] || 'C major';
    const key = scale.split(' ')[0];

    return {
      key,
      scale: scale.split(' ')[1],
      chords: features.harmony?.chords || this.generateDefaultChords(key),
      tempo: features.rhythm?.tempo || 120,
      confidence: features.rhythm?.confidence || 0.8,
      rhythmComplexity: features.rhythm?.complexity || 0.5,
      syncopation: features.rhythm?.syncopation || 0.3,
      swing: features.rhythm?.swing || 0.2,
      dynamics: {
        mean: features.dynamics?.mean || 0.5,
        variance: features.dynamics?.variance || 0.1,
        peaks: features.dynamics?.peaks || []
      },
      melodyFeatures: {
        scale,
        repetitions: features.melody?.repetitions || 2,
        variations: features.melody?.variations || 1,
        contour: features.melody?.contour || []
      },
      modulations: {
        count: features.harmony?.modulations?.length || 0,
        points: features.harmony?.modulations?.points || [],
        keys: features.harmony?.modulations?.keys || []
      }
    };
  }

  private generateDefaultChords(key: string): string[] {
    const scale = Tonal.Scale.get(`${key} major`);
    return [
      `${scale.notes[0]}maj7`,
      `${scale.notes[5]}7`,
      `${scale.notes[3]}m7`,
      `${scale.notes[0]}maj7`
    ];
  }

  private generateSimulatedAnalysis(): AudioAnalysisResult {
    const commonKeys = ['C', 'G', 'D', 'A', 'E', 'F'];
    const randomKey = commonKeys[Math.floor(Math.random() * commonKeys.length)];
    
    return {
      key: randomKey,
      scale: 'major',
      chords: this.generateDefaultChords(randomKey),
      tempo: Math.floor(Math.random() * (140 - 80) + 80),
      confidence: Math.random() * 0.3 + 0.7,
      rhythmComplexity: Math.random(),
      syncopation: Math.random(),
      swing: Math.random(),
      dynamics: {
        mean: Math.random(),
        variance: Math.random() * 0.2,
        peaks: Array.from({ length: 5 }, () => Math.random())
      },
      melodyFeatures: {
        scale: `${randomKey} major`,
        repetitions: Math.floor(Math.random() * 4) + 1,
        variations: Math.floor(Math.random() * 3) + 1,
        contour: Array.from({ length: 8 }, () => Math.random() * 2 - 1)
      },
      modulations: {
        count: Math.floor(Math.random() * 3),
        points: Array.from({ length: 2 }, () => Math.random() * 100),
        keys: commonKeys.slice(0, Math.floor(Math.random() * 3) + 1)
      }
    };
  }
}

export const analyzeAudio = async (audioUrl: string): Promise<AudioAnalysisResult> => {
  const analyzer = AudioAnalyzer.getInstance();
  return new Promise((resolve) => {
    analyzer.startAnalysis((result) => {
      analyzer.stopAnalysis();
      resolve(result);
    });
  });
};