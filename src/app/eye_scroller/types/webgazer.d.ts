declare module 'webgazer' {
  interface WebGazerData {
    x: number;
    y: number;
  }

  interface WebGazer {
    setRegression: (type: string) => WebGazer;
    setTracker: (type: string) => WebGazer;
    begin: () => Promise<void>;
    end: () => void;
    setGazeListener: (callback: (data: WebGazerData | null) => void) => WebGazer;
  }

  const webgazer: WebGazer;
  export default webgazer;
  export type { WebGazer, WebGazerData };
}
