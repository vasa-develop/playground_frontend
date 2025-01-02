declare global {
  interface Window {
    Module: EmscriptenModule;
  }

  interface EmscriptenModule {
    onRuntimeInitialized?: () => void;
    wasmBinary?: ArrayBuffer;
    wasmMemory?: WebAssembly.Memory;
    noInitialRun?: boolean;
    preRun?: (() => void | Promise<void>) | (() => void | Promise<void>)[];
    postRun?: () => void;
    printErr?: (text: string) => void;
    canvas?: HTMLCanvasElement | null;
    arguments?: string[];
    print?: (text: string) => void;
    setStatus?: (text: string) => void;
    totalDependencies?: number;
    monitorRunDependencies?: (left: number) => void;
    FS?: EmscriptenFS;
    callMain?: (args: string[]) => void;
    TOTAL_MEMORY?: number;
    ALLOW_MEMORY_GROWTH?: boolean;
    FORCE_ALIGNED_MEMORY?: boolean;
    ASSERTIONS?: number;
    locateFile?: (path: string) => string;
    runtimeInitialized?: boolean;
  }

  interface EmscriptenFS {
    createPreloadedFile: (parent: string, name: string, url: string, canRead: boolean, canWrite: boolean) => void;
    analyzePath: (path: string) => { exists: boolean };
    mkdir: (path: string) => void;
    writeFile: (path: string, data: ArrayBuffer | string) => void;
    readFile: (path: string) => Uint8Array;
    readdir: (path: string) => string[];
  }
}

export {};
