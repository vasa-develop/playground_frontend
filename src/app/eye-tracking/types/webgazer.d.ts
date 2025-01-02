declare module 'webgazer' {
  export interface WebGazerData {
    x: number;
    y: number;
  }

  export interface WebGazer {
    setGazeListener: (listener: (data: WebGazerData | null, timestamp: number) => void) => WebGazer;
    begin: () => Promise<void>;
    showVideo: (show: boolean) => WebGazer;
    showFaceOverlay: (show: boolean) => WebGazer;
    showFaceFeedbackBox: (show: boolean) => WebGazer;
    showPredictionPoints: (show: boolean) => WebGazer;
    pause: () => WebGazer;
    resume: () => WebGazer;
    end: () => void;
  }

  const webgazer: WebGazer;
  export default webgazer;
}
