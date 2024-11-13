console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
console.log('WebSocket URL:', process.env.NEXT_PUBLIC_WS_URL);

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export interface Unit {
  position: [number, number];
  type: string;
  health: number;
}

export interface GameState {
  minimap: {
    height_map: number[][];
    visibility_map: number[][];
  };
  units: Unit[];
  connected: boolean;
  current_action?: string;
}

export class GameStateManager {
  private ws: WebSocket | null = null;
  private clientId: string;

  constructor() {
    this.clientId = Math.random().toString(36).substring(7);
  }

  connect(onStateUpdate: (state: GameState) => void): void {
    this.ws = new WebSocket(`${WS_BASE_URL}/ws/${this.clientId}`);

    this.ws.onmessage = (event) => {
      const state: GameState = JSON.parse(event.data);
      onStateUpdate(state);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(onStateUpdate), 5000);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendAction(action: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action }));
    }
  }

  async getGameState(): Promise<GameState> {
    const response = await fetch(`${API_BASE_URL}/game/state`);
    if (!response.ok) {
      throw new Error('Failed to fetch game state');
    }
    return response.json();
  }

  async performAction(action: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/game/action/${action}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to perform action');
    }
  }
}

export const gameStateManager = new GameStateManager();
