// Simple synthesizer for playing chord sounds
export class ChordSynth {
  private ctx: AudioContext;
  private gainNode: GainNode;

  constructor() {
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = 0.3; // Set default volume
  }

  private noteToFreq(note: string): number {
    const A4 = 440;
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = parseInt(note.slice(-1));
    const semitone = notes.indexOf(note.slice(0, -1));
    return A4 * Math.pow(2, (semitone - 9) / 12 + (octave - 4));
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine'): OscillatorNode {
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    
    const oscGain = this.ctx.createGain();
    oscGain.gain.value = 0.2;
    
    osc.connect(oscGain);
    oscGain.connect(this.gainNode);
    
    return osc;
  }

  public async playChord(notes: string[]): Promise<void> {
    // Resume context if suspended (needed for Chrome's autoplay policy)
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const oscillators = notes.map(note => 
      this.createOscillator(this.noteToFreq(note + '4'))
    );

    const now = this.ctx.currentTime;
    
    // Start all oscillators
    oscillators.forEach(osc => {
      osc.start(now);
      // Add slight attack
      const gain = osc.connect(this.ctx.createGain());
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      // Add release
      gain.gain.setValueAtTime(0.2, now + 0.5);
      gain.gain.linearRampToValueAtTime(0, now + 1);
    });

    // Stop oscillators after 1 second
    oscillators.forEach(osc => osc.stop(now + 1));
  }
}