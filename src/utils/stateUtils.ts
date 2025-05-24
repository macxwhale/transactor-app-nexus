
interface StorageOptions {
  key: string;
  storage?: Storage;
  serializer?: {
    serialize: (value: any) => string;
    deserialize: (value: string) => any;
  };
}

class StateManager {
  private defaultSerializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse
  };

  // Save state to localStorage/sessionStorage
  saveState<T>(value: T, options: StorageOptions): void {
    const { key, storage = localStorage, serializer = this.defaultSerializer } = options;
    
    try {
      const serializedValue = serializer.serialize(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.warn(`Failed to save state for key "${key}":`, error);
    }
  }

  // Load state from localStorage/sessionStorage
  loadState<T>(options: StorageOptions, defaultValue?: T): T | undefined {
    const { key, storage = localStorage, serializer = this.defaultSerializer } = options;
    
    try {
      const serializedValue = storage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return serializer.deserialize(serializedValue);
    } catch (error) {
      console.warn(`Failed to load state for key "${key}":`, error);
      return defaultValue;
    }
  }

  // Remove state from storage
  removeState(options: Pick<StorageOptions, 'key' | 'storage'>): void {
    const { key, storage = localStorage } = options;
    storage.removeItem(key);
  }

  // Clear all state for a prefix
  clearStateByPrefix(prefix: string, storage: Storage = localStorage): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => storage.removeItem(key));
  }

  // Create a debounced save function
  createDebouncedSave<T>(options: StorageOptions, delay: number = 500) {
    let timeoutId: NodeJS.Timeout;
    
    return (value: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.saveState(value, options);
      }, delay);
    };
  }
}

export const stateManager = new StateManager();

// Specific state management hooks and utilities
export const USER_PREFERENCES_KEY = 'user_preferences';
export const FILTER_STATE_KEY = 'filter_state';
export const PAGINATION_STATE_KEY = 'pagination_state';

export interface UserPreferences {
  theme: string;
  itemsPerPage: number;
  defaultView: string;
  autoRefresh: boolean;
}

export interface FilterState {
  searchTerm: string;
  activeFilters: Record<string, any>;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

// Utility functions for common state operations
export const saveUserPreferences = (preferences: UserPreferences) => {
  stateManager.saveState(preferences, { key: USER_PREFERENCES_KEY });
};

export const loadUserPreferences = (): UserPreferences => {
  return stateManager.loadState({ key: USER_PREFERENCES_KEY }, {
    theme: 'system',
    itemsPerPage: 10,
    defaultView: 'table',
    autoRefresh: false
  }) as UserPreferences;
};

export const saveFilterState = (state: FilterState, context: string) => {
  stateManager.saveState(state, { key: `${FILTER_STATE_KEY}_${context}` });
};

export const loadFilterState = (context: string): FilterState => {
  return stateManager.loadState({ key: `${FILTER_STATE_KEY}_${context}` }, {
    searchTerm: '',
    activeFilters: {},
    sortConfig: { field: 'created_at', direction: 'desc' }
  }) as FilterState;
};
