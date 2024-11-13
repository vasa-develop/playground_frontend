import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://34.224.102.66:3000';

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

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ temperature, pitch, speed }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'Failed to generate audio' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      audioUrl: `${BACKEND_URL}${data.audio_url}`,
      parameters: data.parameters
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
