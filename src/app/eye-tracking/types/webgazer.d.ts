declare module 'webgazer' {
  export interface WebGazerData {
    x: number;
    y: number;
  }

  export interface WebGazer {
    setGazeListener: (callback: (data: WebGazerData | null, elapsedTime: number) => void) => WebGazer;
    begin: () => Promise<void>;
    end: () => void;
    showVideo: (show: boolean) => WebGazer;
    showFaceOverlay: (show: boolean) => WebGazer;
    showFaceFeedbackBox: (show: boolean) => WebGazer;
    showPredictionPoints: (show: boolean) => WebGazer;
    setRegression: (regression: string) => WebGazer;
    setTracker: (tracker: string) => WebGazer;
    addMouseEventListeners: () => void;
    removeMouseEventListeners: () => void;
    clearData: () => void;
  }

  const webgazer: WebGazer;
  export default webgazer;
}

declare global {
  interface Window {
    webgazer: WebGazer;
  }
}
