declare global {
  interface Window {
    webgazer: any;
  }
}

let webgazer: any = null;

export const initWebGazer = async () => {
  try {
    // Wait for window.webgazer to be available (with timeout)
    const timeout = 5000; // 5 seconds timeout
    const startTime = Date.now();
    
    while (!window.webgazer) {
      if (Date.now() - startTime > timeout) {
        throw new Error('WebGazer failed to load after 5 seconds');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!webgazer) {
      webgazer = window.webgazer;
      console.log('Initializing WebGazer...');
      await webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .begin();
      console.log('WebGazer initialized successfully');
    }

    return webgazer;
  } catch (error) {
    console.error('WebGazer initialization error:', error);
    throw error;
  }
};

export const cleanupWebGazer = () => {
  try {
    if (webgazer?.end) {
      webgazer.end();
    }
  } catch (error) {
    console.warn('Error during WebGazer cleanup:', error);
  } finally {
    webgazer = null;
  }
}; 