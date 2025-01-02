export interface WebGazerData {
  x: number;
  y: number;
}

export interface WebGazer {
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

declare module 'webgazer' {
  export { WebGazer, WebGazerData };
  const webgazer: WebGazer;
  export default webgazer;
}
