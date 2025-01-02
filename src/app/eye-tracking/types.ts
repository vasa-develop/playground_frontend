// @ts-check
import type { WebGazerData, WebGazer } from 'webgazer';

declare global {
  interface Window {
    webgazer: WebGazer;
  }
}

export type { WebGazerData, WebGazer };
