import type webgazer from '../../types/webgazer';

let webgazerInstance: webgazer.WebGazer | null = null;

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

    if (!webgazerInstance) {
      webgazerInstance = window.webgazer;
      console.log('Initializing WebGazer...');
      await webgazerInstance
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .begin();
      console.log('WebGazer initialized successfully');
    }

    return webgazerInstance;
  } catch (error) {
    console.error('WebGazer initialization error:', error);
    throw error;
  }
};

export const cleanupWebGazer = () => {
  try {
    if (webgazerInstance?.end) {
      webgazerInstance.end();
    }
  } catch (error) {
    console.warn('Error during WebGazer cleanup:', error);
  } finally {
    webgazerInstance = null;
  }
}; 