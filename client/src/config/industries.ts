/**
 * Industry Registry
 * Central registry for all industry configurations
 */

import type { IndustryConfig } from '@shared/types/industry.js';

// Import industry configs
import { petFoodIndustryConfig } from '@platform/industries/pet-food/config.js';
import { beautyIndustryConfig } from '@platform/industries/beauty/config.js';

// Export industry configs
export { petFoodIndustryConfig, beautyIndustryConfig };
export { petFoodCDPTags } from '@platform/industries/pet-food/config.js';
export { beautyCDPTags } from '@platform/industries/beauty/config.js';

// Import pet food data
export {
  ownerProfiles,
  petProfiles,
  dualPersonas,
} from '@platform/industries/pet-food/data/profiles.js';
export { testProducts } from '@platform/industries/pet-food/data/products.js';

// Import beauty data
export { userProfiles as beautyUserProfiles } from '@platform/industries/beauty/data/profiles.js';
export { testProducts as beautyTestProducts } from '@platform/industries/beauty/data/products.js';

// Import agents
export { createOwnerAgent } from '@platform/industries/pet-food/agents/owner-agent.js';
export { createPetAgent } from '@platform/industries/pet-food/agents/pet-agent.js';

// Import types from original file (for backward compatibility)
import type {
  OwnerProfile,
  PetProfile,
  DualPersona,
  Product,
  OwnerSimulation,
  PetSimulation,
  InteractionAnalysis,
  FeedingScript,
  BatchTestStats,
} from '../data/petFoodSimulation';

export type {
  OwnerProfile,
  PetProfile,
  DualPersona,
  Product,
  OwnerSimulation,
  PetSimulation,
  InteractionAnalysis,
  FeedingScript,
  BatchTestStats,
};

/**
 * Industry registry
 */
export const INDUSTRIES: Record<string, IndustryConfig> = {
  'pet-food': petFoodIndustryConfig,
  'beauty': beautyIndustryConfig,
};

/**
 * Default industry
 */
export const DEFAULT_INDUSTRY = 'pet-food';

/**
 * Get industry config by ID
 */
export function getIndustry(id: string): IndustryConfig | undefined {
  return INDUSTRIES[id];
}

/**
 * Get all available industries
 */
export function getAvailableIndustries(): IndustryConfig[] {
  return Object.values(INDUSTRIES);
}

/**
 * Get current industry (from localStorage or default)
 */
export function getCurrentIndustry(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('current-industry');
    if (stored && INDUSTRIES[stored]) {
      return stored;
    }
  }
  return DEFAULT_INDUSTRY;
}

/**
 * Set current industry
 */
export function setCurrentIndustry(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current-industry', id);
  }
}
