import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request with body:', body);

    const response = await fetch('http://34.224.102.66:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Backend request failed:', response.status);
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to generate audio' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend response:', data);

    // Update audio URL to include full backend URL if it's a relative path
    if (data.audio_url && !data.audio_url.startsWith('http')) {
      data.audio_url = `http://34.224.102.66:3000${data.audio_url}`;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
