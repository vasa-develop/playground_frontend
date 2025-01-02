declare namespace webgazer {
  interface PredictionData {
    x: number;
    y: number;
  }

  type GazeListener = (data: PredictionData | null, elapsedTime: number) => void;

  interface WebGazer {
    setRegression(type: 'ridge'): WebGazer;
    setTracker(tracker: 'TFFacemesh'): WebGazer;
    begin(): Promise<void>;
    setGazeListener(listener: GazeListener): void;
    end(): void;
  }

  const webgazer: WebGazer;
}

declare global {
  interface Window {
    webgazer: typeof webgazer.webgazer;
  }
}

export = webgazer; 