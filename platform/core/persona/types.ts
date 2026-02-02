/**
 * Core Persona Types
 * Generic persona abstractions for the platform
 */

import type { z } from 'zod';
import type { AttributeConfig, BaseEntity, JsonValue } from '../../shared/types/platform.js';

// =============================================================================
// Persona Profile
// =============================================================================

export interface PersonaProfile extends BaseEntity {
  typeId: string;
  name: string;
  attributes: Record<string, JsonValue>;
  metadata?: Record<string, JsonValue>;
}

// =============================================================================
// Persona Generation
// =============================================================================

export interface PersonaGenerationOptions {
  count: number;
  seed?: number;
  constraints?: Record<string, JsonValue>;
}

export interface PersonaGenerationResult {
  profiles: PersonaProfile[];
  metadata: {
    totalGenerated: number;
    generationTime: number;
    seed?: number;
  };
}

// =============================================================================
// Attribute Value Generation
// =============================================================================

export interface AttributeValueGenerator {
  generate(attribute: AttributeConfig, context?: Record<string, JsonValue>): JsonValue;
}

export interface AttributeRangeConstraint {
  min?: number;
  max?: number;
  exclude?: JsonValue[];
}

// =============================================================================
// Persona Type Definition
// =============================================================================

export interface PersonaTypeDefinition {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  schema: z.ZodSchema;
  attributes: AttributeConfig[];
  canSimulate: boolean;
  canBeInterviewed: boolean;
  examples?: PersonaProfile[];
}

// =============================================================================
// Persona Profiling
// =============================================================================

export interface PersonaProfiler {
  analyze(profile: PersonaProfile): PersonaAnalysis;
  compare(profiles: PersonaProfile[]): PersonaComparison;
  segment(profiles: PersonaProfile[], criteria: SegmentationCriteria): PersonaSegment[];
}

export interface PersonaAnalysis {
  profileId: string;
  strengths: string[];
  weaknesses: string[];
  characteristics: Record<string, JsonValue>;
  recommendations: string[];
  score?: number;
}

export interface PersonaComparison {
  profiles: string[];
  similarities: string[];
  differences: string[];
  compatibilityScore: number;
}

export interface SegmentationCriteria {
  attribute: string;
  operator: 'equals' | 'contains' | 'range' | 'greater-than' | 'less-than';
  value?: JsonValue;
  min?: number;
  max?: number;
}

export interface PersonaSegment {
  id: string;
  name: string;
  criteria: SegmentationCriteria;
  profiles: PersonaProfile[];
  size: number;
  characteristics: Record<string, JsonValue>;
}

// =============================================================================
// Persona Registry
// =============================================================================

export interface PersonaRegistry {
  types: Record<string, PersonaTypeDefinition>;
  profiles: Record<string, PersonaProfile[]>;
  defaultType?: string;
}
