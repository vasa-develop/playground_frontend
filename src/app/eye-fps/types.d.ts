/// <reference types="react" />

declare global {
  interface Window {
    webgazer: {
      setRegression: (type: string) => typeof window.webgazer;
      setGazeListener: (listener: (data: { x: number; y: number } | null) => void) => typeof window.webgazer;
      setBlinkListener: (listener: (blinking: boolean) => void) => typeof window.webgazer;
      begin: () => Promise<void>;
      end: () => void;
      showVideo: (show: boolean) => typeof window.webgazer;
      showFaceOverlay: (show: boolean) => typeof window.webgazer;
      showFaceFeedback: (show: boolean) => typeof window.webgazer;
      recordScreenPosition: (x: number, y: number) => typeof window.webgazer;
    };
    scene: any;
    controls: any;
    THREE: any;
    updateCrosshair?: (x: number, y: number) => void;
    handleShoot?: () => void;
  }

  // Extend JSX namespace to include custom attributes
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
    }
  }
}

export {};
