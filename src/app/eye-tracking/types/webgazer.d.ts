declare module 'webgazer' {
  interface WebGazerData {
    x: number;
    y: number;
  }

  interface WebGazer {
    setGazeListener: (callback: (data: WebGazerData | null, timestamp: number) => void) => WebGazer;
    begin: () => Promise<void>;
    end: () => void;
    showVideo: (show: boolean) => WebGazer;
    showFaceOverlay: (show: boolean) => WebGazer;
    showFaceFeedbackBox: (show: boolean) => WebGazer;
    showPredictionPoints: (show: boolean) => WebGazer;
    pause: () => WebGazer;
    resume: () => WebGazer;
  }

  const webgazer: WebGazer;
  export type { WebGazer, WebGazerData };
  export default webgazer;
}
