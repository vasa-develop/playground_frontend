import { NextResponse } from 'next/server';
import { AudioGenerator } from './audioGenerator';
import { AudioStorage } from './storage';

const audioGenerator = new AudioGenerator();
const audioStorage = new AudioStorage();

// Initialize storage directory
audioStorage.initialize().catch(console.error);

export async function POST(request: Request) {
  try {
    const { temperature, pitch, speed } = await request.json();

    // Validate parameters
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 1) {
      return NextResponse.json(
        { error: 'Temperature must be a number between 0 and 1' },
        { status: 400 }
      );
    }

    if (typeof pitch !== 'number' || pitch < -12 || pitch > 12) {
      return NextResponse.json(
        { error: 'Pitch must be a number between -12 and 12' },
        { status: 400 }
      );
    }

    if (typeof speed !== 'number' || speed < 0.5 || speed > 2) {
      return NextResponse.json(
        { error: 'Speed must be a number between 0.5 and 2' },
        { status: 400 }
      );
    }

    // Generate audio
    const { buffer } = await audioGenerator.generateAudio(temperature, pitch, speed);

    // Save audio file and get URL
    const audioUrl = await audioStorage.saveAudio(buffer);

    return NextResponse.json({
      audioUrl,
      parameters: {
        temperature,
        pitch,
        speed
      }
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
