import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export class AudioStorage {
  private storageDir: string;

  constructor() {
    this.storageDir = join(process.cwd(), 'public', 'generated-audio');
  }

  async initialize(): Promise<void> {
    try {
      await mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      console.error('Error creating storage directory:', error);
      throw error;
    }
  }

  async saveAudio(buffer: Buffer): Promise<string> {
    const filename = `audio-${Date.now()}.wav`;
    const filepath = join(this.storageDir, filename);

    try {
      await writeFile(filepath, buffer);
      // Return the public URL
      return `/generated-audio/${filename}`;
    } catch (error) {
      console.error('Error saving audio file:', error);
      throw error;
    }
  }
}
