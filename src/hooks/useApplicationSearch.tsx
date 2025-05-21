
import { useState, useMemo } from 'react';
import { Application } from '@/lib/api';

export function useApplicationSearch(applications: Application[]) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) {
      return applications;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    return applications.filter(app => 
      app.name.toLowerCase().includes(lowerSearch) || 
      app.business_short_code.toLowerCase().includes(lowerSearch) ||
      app.app_id.toLowerCase().includes(lowerSearch)
    );
  }, [applications, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredApplications
  };
}
