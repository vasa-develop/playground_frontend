import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Make request to backend API
    const response = await fetch('http://34.224.102.66:8080/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to generate audio' },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Update audio URL to include full backend URL
    data.audio_url = `http://34.224.102.66:8080${data.audio_url}`;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
