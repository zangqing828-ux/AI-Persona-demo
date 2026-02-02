/**
 * Industry Configuration Types
 * Defines how different industries configure the AI Persona Agent Platform
 */

import type { z } from 'zod';
import type {
  PersonaTypeConfig,
  AgentConfig,
  UIConfig,
  WorkflowConfig,
  DomainKnowledgeConfig,
} from './platform.js';

// =============================================================================
// Industry Config
// =============================================================================

export interface IndustryConfig {
  // Basic metadata
  id: string;
  name: string;
  description: string;
  version: string;

  // Persona types (e.g., Owner + Pet, User, Buyer + Influencer)
  personaTypes: PersonaTypeConfig[];

  // Simulation workflow steps
  workflow: WorkflowConfig;

  // Agent definitions (pluggable agents per industry)
  agents: AgentConfig[];

  // UI theming (colors, icons, terminology)
  ui: UIConfig;

  // Data models (industry-specific schemas)
  schemas: {
    profile: Record<string, z.ZodSchema>;
    product: z.ZodSchema;
    simulation: z.ZodSchema;
  };

  // Domain knowledge (ontology, rules)
  domain: DomainKnowledgeConfig;
}

// =============================================================================
// Industry Registry
// =============================================================================

export interface IndustryRegistry {
  industries: Record<string, IndustryConfig>;
  defaultIndustry: string;
}

// =============================================================================
// Industry-Specific Extensions
// =============================================================================

/**
 * Pet Food Industry Configuration Extensions
 */
export interface PetFoodIndustryConfig extends IndustryConfig {
  id: 'pet-food';
  personaTypes: [
    PersonaTypeConfig & { id: 'owner' },
    PersonaTypeConfig & { id: 'pet' }
  ];
}

/**
 * Beauty Industry Configuration Extensions
 */
export interface BeautyIndustryConfig extends IndustryConfig {
  id: 'beauty';
  personaTypes: [
    PersonaTypeConfig & { id: 'user' },
    PersonaTypeConfig & { id: 'skin-analyzer' }
  ];
}

/**
 * Baby Care Industry Configuration Extensions
 */
export interface BabyCareIndustryConfig extends IndustryConfig {
  id: 'baby-care';
  personaTypes: [
    PersonaTypeConfig & { id: 'parent' },
    PersonaTypeConfig & { id: 'baby' },
    PersonaTypeConfig & { id: 'pediatrician' }
  ];
}

// =============================================================================
// Industry Data
// =============================================================================

export interface IndustryData {
  profiles: Record<string, unknown[]>;
  products: unknown[];
  examples?: Record<string, unknown[]>;
}

// =============================================================================
// Validation
// =============================================================================

export interface IndustryConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateIndustryConfig(
  config: IndustryConfig
): IndustryConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!config.id) errors.push('Industry ID is required');
  if (!config.name) errors.push('Industry name is required');
  if (!config.version) errors.push('Industry version is required');

  // Validate persona types
  if (!config.personaTypes || config.personaTypes.length === 0) {
    errors.push('At least one persona type is required');
  }

  // Validate workflow
  if (!config.workflow || !config.workflow.steps || config.workflow.steps.length === 0) {
    errors.push('At least one workflow step is required');
  }

  // Validate agents
  if (!config.agents || config.agents.length === 0) {
    warnings.push('No agents defined - simulation capabilities may be limited');
  }

  // Validate schemas
  if (!config.schemas) {
    errors.push('Schema definitions are required');
  } else {
    if (!config.schemas.profile) errors.push('Profile schemas are required');
    if (!config.schemas.product) errors.push('Product schema is required');
    if (!config.schemas.simulation) errors.push('Simulation schema is required');
  }

  // Validate domain knowledge
  if (!config.domain) {
    warnings.push('No domain knowledge defined - consider adding ontology and rules');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
