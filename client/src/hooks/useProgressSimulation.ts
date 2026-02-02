import { useState, useEffect, useRef } from "react";

interface ProgressSimulationOptions {
  increment?: number;
  intervalMs?: number;
  maxProgress?: number;
  onComplete?: () => void;
}

export function useProgressSimulation(options: ProgressSimulationOptions = {}) {
  const {
    increment = 5,
    intervalMs = 100,
    maxProgress = 100,
    onComplete,
  } = options;

  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  useEffect(() => {
    if (!isRunning) return;

    let timer: NodeJS.Timeout | null = null;

    try {
      timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + increment, maxProgress);

          if (newProgress >= maxProgress) {
            if (timer) clearInterval(timer);
            setIsRunning(false);
            onCompleteRef.current?.();
            return maxProgress;
          }

          return newProgress;
        });
      }, intervalMs);
    } catch (error) {
      setIsRunning(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, increment, intervalMs, maxProgress]);

  return {
    progress,
    isRunning,
    start,
    stop,
    reset,
  };
}
