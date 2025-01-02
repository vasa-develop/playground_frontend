declare module 'webgazer' {
  interface WebGazerData {
    x: number;
    y: number;
  }

  interface WebGazer {
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

  declare global {
    interface Window {
      webgazer: WebGazer;
    }
  }

  const webgazer: WebGazer;
  export type { WebGazerData, WebGazer };
  export default webgazer;
}
