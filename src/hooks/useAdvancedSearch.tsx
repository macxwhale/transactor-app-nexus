
import { useState, useMemo, useCallback } from "react";
import { useStatePersistence } from "./useStatePersistence";
import { SearchFilter } from "@/components/search/AdvancedSearch";

interface SearchConfig<T> {
  searchableFields: (keyof T)[];
  filterableFields: Array<{
    key: keyof T;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean';
  }>;
  persistenceKey?: string;
}

interface SearchState {
  query: string;
  filters: SearchFilter[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export function useAdvancedSearch<T>(
  data: T[],
  config: SearchConfig<T>
) {
  const { searchableFields, filterableFields, persistenceKey } = config;

  // Use state persistence if key is provided
  const { state: persistedState, setState: setPersistedState } = useStatePersistence({
    key: persistenceKey || 'advanced_search',
    defaultValue: {
      query: '',
      filters: [],
      sortField: '',
      sortDirection: 'asc' as const
    }
  });

  const [searchState, setSearchState] = useState<SearchState>(persistedState);

  // Update persisted state when search state changes
  const updateSearchState = useCallback((newState: Partial<SearchState>) => {
    const updatedState = { ...searchState, ...newState };
    setSearchState(updatedState);
    if (persistenceKey) {
      setPersistedState(updatedState);
    }
  }, [searchState, persistenceKey, setPersistedState]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply text search
    if (searchState.query.trim()) {
      const query = searchState.query.toLowerCase();
      result = result.filter(item =>
        searchableFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Apply filters
    searchState.filters.forEach(filter => {
      result = result.filter(item => {
        const fieldValue = item[filter.field as keyof T];
        if (fieldValue === undefined || fieldValue === null) return false;

        const value = String(fieldValue).toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case 'contains':
            return value.includes(filterValue);
          case 'equals':
            return value === filterValue;
          case 'starts_with':
            return value.startsWith(filterValue);
          case 'ends_with':
            return value.endsWith(filterValue);
          case 'greater_than':
            return Number(fieldValue) > Number(filter.value);
          case 'less_than':
            return Number(fieldValue) < Number(filter.value);
          default:
            return true;
        }
      });
    });

    // Apply sorting
    if (searchState.sortField) {
      result.sort((a, b) => {
        const aValue = a[searchState.sortField as keyof T];
        const bValue = b[searchState.sortField as keyof T];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue > bValue ? 1 : -1;
        return searchState.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchState, searchableFields]);

  // Search handlers
  const handleSearch = useCallback((query: string, filters: SearchFilter[]) => {
    updateSearchState({ query, filters });
  }, [updateSearchState]);

  const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    updateSearchState({ sortField: field, sortDirection: direction });
  }, [updateSearchState]);

  const handleClear = useCallback(() => {
    updateSearchState({
      query: '',
      filters: [],
      sortField: '',
      sortDirection: 'asc'
    });
  }, [updateSearchState]);

  // Get search field options for the AdvancedSearch component
  const searchFieldOptions = useMemo(() => 
    filterableFields.map(field => ({
      value: String(field.key),
      label: field.label
    })), [filterableFields]);

  return {
    searchState,
    filteredData,
    searchFieldOptions,
    handleSearch,
    handleSort,
    handleClear,
    resultCount: filteredData.length,
    totalCount: data.length
  };
}
