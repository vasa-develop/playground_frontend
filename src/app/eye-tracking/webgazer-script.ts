let webgazerInstance: any = null;

export const initializeWebGazer = async () => {
  try {
    webgazerInstance = (window as any).webgazer;
    
    // Initialize with the same settings as the working example
    await webgazerInstance
      .setRegression('ridge')
      .setTracker('TFFacemesh')
      .begin();
    
    return webgazerInstance;
  } catch (error) {
    console.error('WebGazer initialization error:', error);
    throw error;
  }
};

export const cleanupWebGazer = () => {
  if (webgazerInstance) {
    webgazerInstance.end();
    webgazerInstance = null;
  }
}; 