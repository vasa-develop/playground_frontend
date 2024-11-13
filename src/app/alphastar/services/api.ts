import { getConfig } from '../config';

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
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private config: { backendUrl: string; wsUrl: string } | null = null;

  constructor() {
    this.clientId = Math.random().toString(36).substring(7);
  }

  private async initConfig() {
    if (!this.config) {
      this.config = await getConfig();
      console.log('Initialized configuration:', this.config);
    }
    return this.config;
  }

  async connect(onStateUpdate: (state: GameState) => void): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const config = await this.initConfig();
    console.log('Attempting to connect to:', `${config.wsUrl}/client/${this.clientId}`);
    this.ws = new WebSocket(`${config.wsUrl}/client/${this.clientId}`);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const state: GameState = JSON.parse(event.data);
        onStateUpdate(state);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.reconnectAttempts++;
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        setTimeout(() => this.connect(onStateUpdate), 5000);
      }
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.reconnectAttempts = 0;
    }
  }

  sendAction(action: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action }));
    } else {
      console.warn('Cannot send action: WebSocket is not connected');
    }
  }

  async getGameState(): Promise<GameState> {
    const config = await this.initConfig();
    console.log('Fetching game state from:', `${config.backendUrl}/game/state`);
    try {
      const response = await fetch(`${config.backendUrl}/game/state`);
      if (!response.ok) {
        throw new Error(`Failed to fetch game state: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching game state:', error);
      throw error;
    }
  }

  async performAction(action: string): Promise<void> {
    const config = await this.initConfig();
    try {
      const response = await fetch(`${config.backendUrl}/game/action/${action}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Failed to perform action: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }
}

export const gameStateManager = new GameStateManager();
