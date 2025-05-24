
import { useMemo, useCallback } from "react";

export const usePerformanceOptimization = () => {
  // Memoized debounce function
  const debounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Memoized throttle function
  const throttle = useCallback((func: (...args: any[]) => void, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const startTime = performance.now();
    fn();
    const endTime = performance.now();
    console.log(`${name} took ${endTime - startTime} milliseconds`);
  }, []);

  return { debounce, throttle, measurePerformance };
};
