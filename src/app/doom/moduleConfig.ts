// DOOM Module configuration
interface StatusInfo {
  time: number;
  text: string;
}

interface SetStatusFunction extends Function {
  (text: string): void;
  last?: StatusInfo;
}

interface DoomModule {
  print: (text: string) => void;
  canvas: HTMLCanvasElement | null;
  setStatus: SetStatusFunction;
  totalDependencies: number;
  monitorRunDependencies: (left: number) => void;
  arguments: string[];
  locateFile: (path: string) => string;
}

export const createModuleConfig = (): DoomModule => ({
  print: (function() {
    return function(text: string) {
      console.log(text);
    };
  })(),
  canvas: (function() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return null;
    }
    canvas.addEventListener("webglcontextlost", function(e: Event) { 
      alert('WebGL context lost. You will need to reload the page.'); 
      e.preventDefault(); 
    }, false);
    return canvas;
  })(),
  setStatus: function(text: string) {
    if (!this.setStatus.last) {
      this.setStatus.last = { time: 0, text: '' };
    }
    if (text === this.setStatus.last.text) return;
    const now = Date.now();
    if (this.setStatus.last && now - this.setStatus.last.time < 30) return;
    this.setStatus.last = { time: now, text };
    console.log('Status:', text);
  },
  totalDependencies: 0,
  monitorRunDependencies: function(left: number) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    this.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
  },
  arguments: ['-iwad', '/doom/doom1.wad'],
  locateFile: function(path: string) { return '/doom/' + path; }
});
