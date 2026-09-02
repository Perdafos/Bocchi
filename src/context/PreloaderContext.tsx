import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface AssetToPreload {
  url: string;
  type: 'image' | 'font' | 'audio';
}

export interface PreloadTask {
  id: string;
  url: string;
  type: 'image' | 'font' | 'audio';
  status: 'pending' | 'loading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export interface PreloaderState {
  isComplete: boolean;
  isReady: boolean;
  progress: number;
  phase: 'idle' | 'loading' | 'almost' | 'complete';
  tasks: Map<string, PreloadTask>;
  stats: {
    total: number;
    loaded: number;
    failed: number;
  };
  startTime: number | null;
  elapsedTime: number;
}

export interface PreloaderContextValue extends PreloaderState {
  registerAssets: (assets: AssetToPreload[]) => void;
  markReady: () => void;
  startPreload: () => Promise<void>;
  waitUntilComplete: () => Promise<void>;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const PreloaderContext = createContext<PreloaderContextValue | null>(null);

export const usePreloader = (): PreloaderContextValue => {
  const ctx = useContext(PreloaderContext);
  if (!ctx) throw new Error('usePreloader must be used within PreloaderProvider');
  return ctx;
};

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
interface PreloaderProviderProps {
  children: React.ReactNode;
  /** Assets to preload immediately on mount. Default: [] */
  initialAssets?: AssetToPreload[];
  /** Minimum time (ms) to show preloader. Default: 2000 */
  minDisplayTime?: number;
  /** Custom assets to preload from config */
  assetManifest?: AssetToPreload[];
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({
  children,
  minDisplayTime = 2000,
  assetManifest = [],
}) => {
  const [tasks, setTasks] = useState<Map<string, PreloadTask>>(new Map());
  const [isComplete, setIsComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [phase, setPhase] = useState<PreloaderState['phase']>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const readyResolveRef = useRef<(() => void) | null>(null);
  const completeResolveRef = useRef<(() => void) | null>(null);
  const initDoneRef = useRef(false);

  // Calculate progress
  const stats = React.useMemo(() => {
    const arr = Array.from(tasks.values());
    return {
      total: arr.length,
      loaded: arr.filter(t => t.status === 'done').length,
      failed: arr.filter(t => t.status === 'error').length,
    };
  }, [tasks]);

  const progress = React.useMemo(() => {
    if (stats.total === 0) return 0;
    const totalProgress = Array.from(tasks.values()).reduce((sum, t) => sum + t.progress, 0);
    return Math.min(100, (totalProgress / stats.total) * 100);
  }, [tasks, stats.total]);

  // Update elapsed time
  useEffect(() => {
    if (phase === 'idle' || !startTimeRef.current) return;
    const interval = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // ─────────────────────────────────────────────
  // Preload a single image
  // ─────────────────────────────────────────────
  const preloadImage = useCallback((task: PreloadTask): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      let settled = false;

      const cleanup = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };

      img.onload = () => {
        setTasks(prev => {
          const next = new Map(prev);
          next.set(task.id, { ...task, status: 'done', progress: 100 });
          return next;
        });
        cleanup();
      };

      img.onerror = () => {
        setTasks(prev => {
          const next = new Map(prev);
          next.set(task.id, { ...task, status: 'error', progress: 100, error: 'Failed to load' });
          return next;
        });
        cleanup();
      };

      // Track incremental progress for large images
      if (img.complete) {
        cleanup();
        return;
      }

      // Simulate progress updates for visual feedback
      let simulated = 0;
      const progressInterval = setInterval(() => {
        simulated = Math.min(90, simulated + Math.random() * 15);
        setTasks(prev => {
          const current = prev.get(task.id);
          if (current && current.status === 'loading') {
            const next = new Map(prev);
            next.set(task.id, { ...current, progress: simulated });
            return next;
          }
          return prev;
        });
      }, 80);

      img.onload = () => {
        clearInterval(progressInterval);
        setTasks(prev => {
          const next = new Map(prev);
          next.set(task.id, { ...task, status: 'done', progress: 100 });
          return next;
        });
        cleanup();
      };

      img.onerror = () => {
        clearInterval(progressInterval);
        setTasks(prev => {
          const next = new Map(prev);
          next.set(task.id, { ...task, status: 'error', progress: 100, error: 'Failed to load' });
          return next;
        });
        cleanup();
      };

      setTasks(prev => {
        const next = new Map(prev);
        next.set(task.id, { ...task, status: 'loading', progress: 0 });
        return next;
      });

      img.src = task.url;
    });
  }, []);

  // ─────────────────────────────────────────────
  // Preload fonts
  // ─────────────────────────────────────────────
  const preloadFont = useCallback(async (task: PreloadTask): Promise<void> => {
    setTasks(prev => {
      const next = new Map(prev);
      next.set(task.id, { ...task, status: 'loading', progress: 10 });
      return next;
    });

    try {
      await document.fonts.load(task.url);
      setTasks(prev => {
        const next = new Map(prev);
        next.set(task.id, { ...task, status: 'done', progress: 100 });
        return next;
      });
    } catch {
      setTasks(prev => {
        const next = new Map(prev);
        next.set(task.id, { ...task, status: 'error', progress: 100 });
        return next;
      });
    }
  }, []);

  // ─────────────────────────────────────────────
  // Preload audio
  // ─────────────────────────────────────────────
  const preloadAudio = useCallback(async (task: PreloadTask): Promise<void> => {
    setTasks(prev => {
      const next = new Map(prev);
      next.set(task.id, { ...task, status: 'loading', progress: 10 });
      return next;
    });

    return new Promise((resolve) => {
      const audio = new Audio();
      let settled = false;
      const cleanup = () => {
        if (!settled) {
          settled = true;
          audio.src = '';
          resolve();
        }
      };

      audio.addEventListener('canplaythrough', () => {
        setTasks(prev => {
          const next = new Map(prev);
          next.set(task.id, { ...task, status: 'done', progress: 100 });
          return next;
        });
        cleanup();
      }, { once: true });

      audio.addEventListener('error', () => {
        setTasks(prev => {
          const next = new Map(prev);
          next.set(task.id, { ...task, status: 'error', progress: 100 });
          return next;
        });
        cleanup();
      }, { once: true });

      // Timeout fallback
      setTimeout(() => {
        setTasks(prev => {
          const next = new Map(prev);
          const current = next.get(task.id);
          if (current && current.status !== 'done') {
            next.set(task.id, { ...current, status: 'done', progress: 100 });
          }
          return next;
        });
        cleanup();
      }, 5000);

      audio.preload = 'auto';
      audio.src = task.url;
      audio.load();
    });
  }, []);

  // ─────────────────────────────────────────────
  // Register assets to preload queue
  // ─────────────────────────────────────────────
  const registerAssets = useCallback((assets: AssetToPreload[]) => {
    setTasks(prev => {
      const next = new Map(prev);
      for (const asset of assets) {
        const id = `${asset.type}-${asset.url}`;
        if (!next.has(id)) {
          next.set(id, {
            id,
            url: asset.url,
            type: asset.type,
            status: 'pending',
            progress: 0,
          });
        }
      }
      return next;
    });
  }, []);

  // ─────────────────────────────────────────────
  // Mark app as ready (all components rendered)
  // ─────────────────────────────────────────────
  const markReady = useCallback(() => {
    setIsReady(true);
    readyResolveRef.current?.();
  }, []);

  // ─────────────────────────────────────────────
  // Start the preloading process
  // ─────────────────────────────────────────────
  const startPreload = useCallback(async (): Promise<void> => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    startTimeRef.current = Date.now();
    setPhase('loading');

    // Register manifest assets
    if (assetManifest.length > 0) {
      registerAssets(assetManifest);
    }

    // Wait a tick for state to update
    await new Promise(r => setTimeout(r, 50));

    const pendingTasks = Array.from(tasks.values()).filter(t => t.status === 'pending');

    // Preload in parallel batches to avoid overwhelming the browser
    const BATCH_SIZE = 6;
    for (let i = 0; i < pendingTasks.length; i += BATCH_SIZE) {
      const batch = pendingTasks.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(task => {
          switch (task.type) {
            case 'image': return preloadImage(task);
            case 'font': return preloadFont(task);
            case 'audio': return preloadAudio(task);
            default: return Promise.resolve();
          }
        })
      );
    }

    // Ensure minimum display time
    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    const remaining = Math.max(0, minDisplayTime - elapsed);
    if (remaining > 0) {
      await new Promise(r => setTimeout(r, remaining));
    }

    setPhase('almost');

    // Brief pause at 100% before allowing entry
    await new Promise(r => setTimeout(r, 500));
    setPhase('complete');
    setIsComplete(true);
    completeResolveRef.current?.();
  }, [tasks, assetManifest, registerAssets, preloadImage, preloadFont, preloadAudio, minDisplayTime]);

  // ─────────────────────────────────────────────
  // Wait until preloader is complete (100%)
  // ─────────────────────────────────────────────
  const waitUntilComplete = useCallback((): Promise<void> => {
    if (isComplete) return Promise.resolve();
    return new Promise(resolve => {
      completeResolveRef.current = resolve;
    });
  }, [isComplete]);

  const value: PreloaderContextValue = {
    isComplete,
    isReady,
    progress,
    phase,
    tasks,
    stats: {
      total: stats.total,
      loaded: stats.loaded,
      failed: stats.failed,
    },
    startTime: startTimeRef.current,
    elapsedTime,
    registerAssets,
    markReady,
    startPreload,
    waitUntilComplete,
  };

  return (
    <PreloaderContext.Provider value={value}>
      {children}
    </PreloaderContext.Provider>
  );
};

export default PreloaderProvider;
