/**
 * Core Simulation Types
 * Generic simulation abstractions for the platform
 */

import type { JsonValue } from '../../../shared/types/platform.js';

// =============================================================================
// Simulation Context
// =============================================================================

export interface SimulationContext {
  personaProfileId: string;
  productId: string;
  industryId: string;
  metadata?: Record<string, JsonValue>;
}

// =============================================================================
// Simulation Engine
// =============================================================================

export interface SimulationEngine {
  simulate(context: SimulationContext): SimulationResult;
  canHandle(context: SimulationContext): boolean;
  getEngineType(): SimulationEngineType;
}

export type SimulationEngineType = 'rule-based' | 'llm' | 'hybrid';

// =============================================================================
// Simulation Result
// =============================================================================

export interface SimulationResult {
  id: string;
  engineType: SimulationEngineType;
  context: SimulationContext;
  result: Record<string, JsonValue>;
  confidence: number; // 0-100
  timestamp: Date;
  executionTime: number; // milliseconds
  steps: SimulationStep[];
}

export interface SimulationStep {
  name: string;
  description: string;
  result: JsonValue;
  executionTime: number;
}

// =============================================================================
// Rule-Based Simulation
// =============================================================================

export interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority?: number;
}

export interface RuleEvaluationContext {
  variables: Record<string, JsonValue>;
  history: string[];
}

export interface RuleEvaluationResult {
  matchedRule: Rule | null;
  result: JsonValue;
  confidence: number;
  executionTime: number;
}

// =============================================================================
// LLM-Based Simulation
// =============================================================================

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LLMPrompt {
  system: string;
  user: string;
  context?: Record<string, JsonValue>;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: Date;
}

// =============================================================================
// Hybrid Simulation
// =============================================================================

export interface HybridStrategy {
  useLLMFor: string[]; // List of attribute names to use LLM for
  useRulesFor: string[]; // List of attribute names to use rules for
  fallbackEngine: SimulationEngineType;
}

// =============================================================================
// Simulation Batch
// =============================================================================

export interface SimulationBatchConfig {
  contexts: SimulationContext[];
  maxConcurrent?: number;
  onProgress?: (progress: number, total: number) => void;
}

export interface SimulationBatchResult {
  results: SimulationResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageConfidence: number;
    totalExecutionTime: number;
  };
  errors: Array<{
    context: SimulationContext;
    error: string;
  }>;
}
