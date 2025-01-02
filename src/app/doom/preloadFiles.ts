// Function to preload files before DOOM initialization
export async function preloadDoomFiles(): Promise<{ [key: string]: Uint8Array }> {
  const files = {
    '/doom/doom1.wad': '/doom/doom1.wad',
    '/doom/default.cfg': '/doom/default.cfg'
  };

  const loadedFiles: { [key: string]: Uint8Array } = {};

  try {
    await Promise.all(
      Object.entries(files).map(async ([destPath, srcPath]) => {
        const response = await fetch(srcPath);
        const arrayBuffer = await response.arrayBuffer();
        loadedFiles[destPath] = new Uint8Array(arrayBuffer);
      })
    );
    return loadedFiles;
  } catch (error) {
    console.error('Failed to preload files:', error);
    throw error;
  }
}
