/**
 * Generic Progress Simulation Hook
 * Reusable progress simulation with customizable increment, interval, and max
 */

import { useState, useEffect, useRef } from 'react';

export interface ProgressSimulationOptions {
  increment?: number;
  intervalMs?: number;
  maxProgress?: number;
  onComplete?: () => void;
  onStart?: () => void;
  onStop?: () => void;
}

export interface ProgressSimulationState {
  progress: number; // 0 to maxProgress
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  setProgress: (value: number) => void;
}

/**
 * Progress simulation hook
 *
 * @example
 * ```tsx
 * const { progress, isRunning, start, stop, reset } = useProgressSimulation({
 *   increment: 5,
 *   intervalMs: 100,
 *   maxProgress: 100,
 *   onComplete: () => console.log('Complete!'),
 * });
 *
 * return (
 *   <div>
 *     <progress value={progress} max={100} />
 *     <button onClick={start}>Start</button>
 *     <button onClick={stop}>Stop</button>
 *     <button onClick={reset}>Reset</button>
 *   </div>
 * );
 * ```
 */
export function useProgressSimulation(
  options: ProgressSimulationOptions = {}
): ProgressSimulationState {
  const {
    increment = 5,
    intervalMs = 100,
    maxProgress = 100,
    onComplete,
    onStart,
    onStop,
  } = options;

  const [progress, setProgressState] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const onCompleteRef = useRef(onComplete);
  const onStartRef = useRef(onStart);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgressState(0);
    onStartRef.current?.();
  };

  const stop = () => {
    setIsRunning(false);
    onStopRef.current?.();
  };

  const reset = () => {
    setIsRunning(false);
    setProgressState(0);
  };

  const setProgress = (value: number) => {
    const clampedValue = Math.max(0, Math.min(value, maxProgress));
    setProgressState(clampedValue);
  };

  useEffect(() => {
    if (!isRunning) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    try {
      timer = setInterval(() => {
        if (!isMounted) return;

        setProgressState((prev) => {
          const newProgress = Math.min(prev + increment, maxProgress);

          if (newProgress >= maxProgress) {
            if (timer) clearInterval(timer);
            // Defer state update to avoid affecting current render
            setTimeout(() => {
              if (isMounted) {
                setIsRunning(false);
                onCompleteRef.current?.();
              }
            }, 0);
            return maxProgress;
          }

          return newProgress;
        });
      }, intervalMs);
    } catch (error) {
      console.error('Progress simulation error:', error);
      setTimeout(() => {
        if (isMounted) setIsRunning(false);
      }, 0);
    }

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [isRunning, increment, intervalMs, maxProgress]);

  return {
    progress,
    isRunning,
    start,
    stop,
    reset,
    setProgress,
  };
}

/**
 * Hook for batch progress simulation with variable increments
 */
export function useBatchProgressSimulation(
  options: ProgressSimulationOptions & {
    minIncrement?: number;
    maxIncrement?: number;
  } = {}
) {
  const { minIncrement = 20, maxIncrement = 70, ...baseOptions } = options;

  const [currentIncrement, setCurrentIncrement] = useState(minIncrement);

  const progressSimulation = useProgressSimulation({
    ...baseOptions,
    increment: currentIncrement,
  });

  /**
   * Start with random increment between min and max
   */
  const startWithRandomIncrement = () => {
    const randomIncrement =
      Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) + minIncrement;
    setCurrentIncrement(randomIncrement);
    progressSimulation.start();
  };

  return {
    ...progressSimulation,
    start: startWithRandomIncrement,
    currentIncrement,
  };
}

/**
 * Hook for multi-stage progress simulation
 */
export function useMultiStageProgressSimulation(
  stages: Array<{ name: string; maxProgress: number; duration?: number }>
) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const currentStage = stages[currentStageIndex];

  const progressSimulation = useProgressSimulation({
    maxProgress: currentStage.maxProgress,
    intervalMs: currentStage.duration ?? 100,
    increment: currentStage.maxProgress / 20, // Complete in ~20 steps
    onComplete: () => {
      if (currentStageIndex < stages.length - 1) {
        setCurrentStageIndex((prev) => prev + 1);
      }
    },
  });

  const totalProgress =
    stages.reduce((acc, stage, index) => {
      if (index < currentStageIndex) {
        return acc + stage.maxProgress;
      }
      if (index === currentStageIndex) {
        return acc + progressSimulation.progress;
      }
      return acc;
    }, 0) / stages.length;

  return {
    ...progressSimulation,
    currentStage: currentStage.name,
    currentStageIndex,
    totalProgress,
    isComplete: currentStageIndex === stages.length - 1 && progressSimulation.progress >= currentStage.maxProgress,
  };
}
