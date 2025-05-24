
import { useState, useEffect, useCallback } from "react";
import { stateManager } from "@/utils/stateUtils";

interface UseStatePersistenceOptions<T> {
  key: string;
  defaultValue: T;
  storage?: Storage;
  debounceMs?: number;
}

export function useStatePersistence<T>({
  key,
  defaultValue,
  storage = localStorage,
  debounceMs = 500
}: UseStatePersistenceOptions<T>) {
  // Initialize state from storage or use default
  const [state, setState] = useState<T>(() => {
    return stateManager.loadState({ key, storage }, defaultValue) as T;
  });

  // Create debounced save function
  const debouncedSave = useCallback(
    stateManager.createDebouncedSave({ key, storage }, debounceMs),
    [key, storage, debounceMs]
  );

  // Update state and save to storage
  const updateState = useCallback((newState: T | ((prevState: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prevState: T) => T)(prevState)
        : newState;
      
      // Save to storage with debouncing
      debouncedSave(nextState);
      
      return nextState;
    });
  }, [debouncedSave]);

  // Clear state from storage
  const clearState = useCallback(() => {
    stateManager.removeState({ key, storage });
    setState(defaultValue);
  }, [key, storage, defaultValue]);

  // Load state from storage (useful for manual refresh)
  const reloadState = useCallback(() => {
    const loadedState = stateManager.loadState({ key, storage }, defaultValue) as T;
    setState(loadedState);
  }, [key, storage, defaultValue]);

  return {
    state,
    setState: updateState,
    clearState,
    reloadState
  };
}
