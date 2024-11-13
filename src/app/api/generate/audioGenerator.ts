import * as tf from '@tensorflow/tfjs-node';

export class AudioGenerator {
  private sampleRate: number = 16000;
  private duration: number = 2; // 2 seconds

  constructor() {
    tf.setBackend('tensorflow');
  }

  private generateBaseWaveform(temperature: number): Float32Array {
    // Generate a simple sine wave with some noise based on temperature
    const numSamples = this.sampleRate * this.duration;
    const frequency = 440; // A4 note
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / this.sampleRate;
      // Base sine wave
      const sine = Math.sin(2 * Math.PI * frequency * t);
      // Add controlled randomness based on temperature
      const noise = (Math.random() * 2 - 1) * temperature;
      samples[i] = sine * (1 - temperature) + noise * temperature;
    }

    return samples;
  }

  private adjustPitch(samples: Float32Array, pitchShift: number): Float32Array {
    // Simple pitch shifting by resampling
    const pitchScale = Math.pow(2, pitchShift / 12); // Convert semitones to frequency ratio
    const newLength = Math.floor(samples.length / pitchScale);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const sourceIndex = i * pitchScale;
      const index1 = Math.floor(sourceIndex);
      const index2 = Math.min(index1 + 1, samples.length - 1);
      const fraction = sourceIndex - index1;

      // Linear interpolation
      result[i] = samples[index1] * (1 - fraction) + samples[index2] * fraction;
    }

    return result;
  }

  private adjustSpeed(samples: Float32Array, speedMultiplier: number): Float32Array {
    const newLength = Math.floor(samples.length / speedMultiplier);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const sourceIndex = i * speedMultiplier;
      const index1 = Math.floor(sourceIndex);
      const index2 = Math.min(index1 + 1, samples.length - 1);
      const fraction = sourceIndex - index1;

      // Linear interpolation
      result[i] = samples[index1] * (1 - fraction) + samples[index2] * fraction;
    }

    return result;
  }

  public async generateAudio(
    temperature: number,
    pitch: number,
    speed: number
  ): Promise<{ buffer: Buffer; sampleRate: number }> {
    // Generate base waveform
    let samples = this.generateBaseWaveform(temperature);

    // Apply pitch shift
    if (pitch !== 0) {
      samples = this.adjustPitch(samples, pitch);
    }

    // Apply speed adjustment
    if (speed !== 1) {
      samples = this.adjustSpeed(samples, speed);
    }

    // Convert to 16-bit PCM
    const pcmData = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Create WAV file buffer
    const buffer = Buffer.alloc(44 + pcmData.length * 2);

    // WAV Header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + pcmData.length * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(this.sampleRate, 24);
    buffer.writeUInt32LE(this.sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(pcmData.length * 2, 40);

    // Write audio data
    for (let i = 0; i < pcmData.length; i++) {
      buffer.writeInt16LE(pcmData[i], 44 + i * 2);
    }

    return {
      buffer,
      sampleRate: this.sampleRate
    };
  }
}
