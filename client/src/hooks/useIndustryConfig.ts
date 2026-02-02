/**
 * React hook for accessing industry configuration
 */

import { useMemo } from 'react';
import { getCurrentIndustry, getIndustry, setCurrentIndustry } from '../config/industries.js';

/**
 * Hook to access current industry configuration
 */
export function useIndustryConfig() {
  const currentIndustryId = getCurrentIndustry();
  const industryConfig = useMemo(() => getIndustry(currentIndustryId), [currentIndustryId]);

  const switchIndustry = (id: string) => {
    setCurrentIndustry(id);
    window.location.reload(); // Reload to apply new industry
  };

  return {
    industryId: currentIndustryId,
    industryConfig,
    switchIndustry,
  };
}
