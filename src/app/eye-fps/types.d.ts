declare global {
  interface Window {
    webgazer: {
      setRegression: (type: string) => typeof window.webgazer;
      setGazeListener: (listener: (data: { x: number; y: number } | null) => void) => typeof window.webgazer;
      setBlinkListener: (listener: (blinking: boolean) => void) => typeof window.webgazer;
      begin: () => Promise<void>;
      end: () => void;
    };
    scene: any;
    controls: any;
    THREE: any;
    updateCrosshair?: (x: number, y: number) => void;
    handleShoot?: () => void;
  }
}

export {};
