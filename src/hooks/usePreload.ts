import { useEffect, useState, useRef } from 'react';
import { usePreloader } from '../context/PreloaderContext';

// ─────────────────────────────────────────────
// Hook: usePreload
// Preload a set of assets and report progress
// ─────────────────────────────────────────────
export interface UsePreloadOptions {
  /** Auto-start preloading on mount. Default: true */
  autoStart?: boolean;
  /** Called when all assets are loaded */
  onComplete?: () => void;
  /** Called on each progress update */
  onProgress?: (progress: number) => void;
}

export const usePreload = (
  assets: Array<{ url: string; type: 'image' | 'font' | 'audio' }>,
  options: UsePreloadOptions = {}
) => {
  const { autoStart = true, onComplete, onProgress } = options;
  const { registerAssets, isComplete, progress, stats, startPreload } = usePreloader();
  const [localProgress, setLocalProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (assets.length > 0) {
      registerAssets(assets);
    }
  }, [assets, registerAssets]);

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      startedRef.current = true;
      startPreload();
    }
  }, [autoStart, startPreload]);

  useEffect(() => {
    setLocalProgress(progress);
    onProgress?.(progress);
  }, [progress, onProgress]);

  useEffect(() => {
    if (isComplete) {
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  return {
    isComplete,
    progress: localProgress,
    stats,
    start: startPreload,
  };
};

export default usePreload;
