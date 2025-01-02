export interface WebGazerData {
  x: number;
  y: number;
}

export interface WebGazer {
  setGazeListener: (callback: (data: WebGazerData | null) => void) => WebGazer;
  begin: () => Promise<void>;
  end: () => void;
  showVideo: (show: boolean) => void;
  showFaceOverlay: (show: boolean) => void;
  showFaceFeedbackBox: (show: boolean) => void;
}

declare global {
  interface Window {
    webgazer: WebGazer;
  }
}

export {};
