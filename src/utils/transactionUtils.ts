
// Valid status types to ensure consistent handling
export const VALID_STATUSES = ['pending', 'completed', 'failed', 'processing'];

/**
 * Normalizes transaction status values to one of the standard statuses
 */
export const normalizeStatus = (status: string | null): 'pending' | 'completed' | 'failed' | 'processing' => {
  if (!status) return 'pending';
  
  // Convert to lowercase for consistent comparison
  const lowercaseStatus = status.toLowerCase();
  
  if (lowercaseStatus.includes('pend')) return 'pending';
  if (lowercaseStatus.includes('complet')) return 'completed';
  if (lowercaseStatus.includes('fail')) return 'failed';
  if (lowercaseStatus.includes('process')) return 'processing';
  
  // Default to pending if unknown status
  console.warn(`Unknown status encountered: ${status}, defaulting to 'pending'`);
  return 'pending';
};
