declare module 'webgazer' {
  interface WebGazer {
    setRegression(type: string): WebGazer;
    setTracker(type: string): WebGazer;
    begin(): Promise<void>;
    end(): void;
    showVideo(show: boolean): void;
    showFaceOverlay(show: boolean): void;
    showFaceFeedbackBox(show: boolean): void;
    getCurrentPrediction(): Promise<{ x: number; y: number } | null>;
    setGazeListener(callback: (data: { x: number; y: number } | null) => void): void;
    isReady(): boolean;
  }

  const webgazer: WebGazer;
  export default webgazer;
}
