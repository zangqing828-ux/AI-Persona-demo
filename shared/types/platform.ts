/**
 * Core Platform Types
 * Domain-independent abstractions for the AI Persona Agent Platform
 */

import type { z } from 'zod';

// =============================================================================
// Base Types
// =============================================================================

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// =============================================================================
// Persona Types
// =============================================================================

export type AttributeType = 'string' | 'number' | 'boolean' | 'enum' | 'multi-enum' | 'range';

export interface AttributeConfig {
  id: string;
  name: string;
  type: AttributeType;
  options?: string[]; // For enum types
  min?: number; // For range types
  max?: number; // For range types
  required?: boolean;
  description?: string;
}

export interface ProfileGenerationConfig {
  sampleSize: number;
  attributes: AttributeConfig[];
}

export interface PersonaTypeConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  profileSchema: z.ZodSchema;
  generation: ProfileGenerationConfig;
  canSimulate: boolean;
  canBeInterviewed: boolean;
}

export interface PersonaProfile extends BaseEntity {
  typeId: string; // Links to PersonaTypeConfig.id
  attributes: Record<string, JsonValue>;
}

// =============================================================================
// Agent Types
// =============================================================================

export type SimulationEngineType = 'rule-based' | 'llm' | 'hybrid';

export interface RuleConfig {
  condition: string;
  action: string;
  priority?: number;
}

export interface AgentSimulationConfig {
  engine: SimulationEngineType;
  prompts?: string[];
  rules?: RuleConfig[];
}

export interface AgentConfig {
  id: string;
  name: string;
  personaType: string; // Links to PersonaTypeConfig.id
  simulation: AgentSimulationConfig;
  outputSchema: z.ZodSchema;
}

export interface AgentSimulationResult extends BaseEntity {
  agentId: string;
  personaProfileId: string;
  result: Record<string, JsonValue>;
  confidence?: number;
  metadata?: Record<string, JsonValue>;
}

// =============================================================================
// Simulation Types
// =============================================================================

export interface ProgressConfig {
  increment: number;
  intervalMs: number;
  maxProgress: number;
}

export interface SimulationConfig {
  progress: {
    personaGeneration: ProgressConfig;
    dualSimulation: ProgressConfig;
    interactionAnalysis: ProgressConfig;
    batchInterview: ProgressConfig;
  };
}

export interface SimulationStep {
  id: string;
  name: string;
  component: string;
  completed: boolean;
}

// =============================================================================
// Analysis Types
// =============================================================================

export interface ScenarioAnalysis {
  id: string;
  scenarioType: string;
  personaProfileId: string;
  analysis: Record<string, JsonValue>;
  score?: number;
  recommendations?: string[];
}

export interface InteractionEvent {
  timestamp: Date;
  type: string;
  actor: string; // Which persona type
  action: string;
  context?: Record<string, JsonValue>;
}

// =============================================================================
// CDP (Customer Data Platform) Types
// =============================================================================

export interface CDPTag {
  id: string;
  name: string;
  category: string;
  description?: string;
  conditions?: Record<string, JsonValue>;
}

export interface AudienceSegment {
  id: string;
  name: string;
  tags: string[]; // Tag IDs
  estimatedSize?: number;
}

// =============================================================================
// Product Types
// =============================================================================

export interface Product extends BaseEntity {
  name: string;
  category: string;
  attributes: Record<string, JsonValue>;
  targetAudience?: string[]; // Persona type IDs
}

// =============================================================================
// UI Types
// =============================================================================

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface TerminologyConfig {
  simulation: string;
  persona: string;
  product: string;
  interview: string;
  analysis: string;
  dashboard: string;
}

export interface IconMapping {
  [key: string]: string; // Maps icon IDs to icon names (e.g., lucide-react)
}

export interface UIConfig {
  theme: ThemeConfig;
  terminology: TerminologyConfig;
  icons: IconMapping;
}

// =============================================================================
// Domain Knowledge Types
// =============================================================================

export interface Ontology {
  categories: string[];
  attributes: string[];
  relationships?: Record<string, string[]>;
}

export interface DomainKnowledgeConfig {
  ontology: Ontology;
  rules: string[];
  examples?: Record<string, JsonValue[]>;
}

// =============================================================================
// Batch Interview Types
// =============================================================================

export interface InterviewQuestion {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'open-ended' | 'rating';
  options?: string[];
  targetPersonaType?: string;
}

export interface InterviewResponse {
  questionId: string;
  answer: string | string[] | number;
  confidence?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface BatchInterviewConfig {
  totalSamples: number;
  maxLogs: number;
  statsUpdateInterval: number;
  intentDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface BatchInterviewResult {
  totalInterviewed: number;
  responses: InterviewResponse[];
  stats: {
    highIntent: number;
    mediumIntent: number;
    lowIntent: number;
    averageSentiment: number;
  };
}

// =============================================================================
// Workflow Types
// =============================================================================

/**
 * Mode-specific configuration for workflow steps
 * Controls how a step behaves in different user modes
 */
export interface ModeConfig {
  /** Whether this step is required in beginner mode (defaults to true) */
  requiredInBeginnerMode?: boolean;
  /** Whether this step can be skipped in expert mode (defaults to false) */
  skippableInExpertMode?: boolean;
  /** Default value to use when step is skipped in expert mode */
  defaultValue?: unknown;
}

/**
 * Describes how a configuration affects the simulation outcome
 * Used for explainability features
 */
export interface ConfigImpact {
  /** Name of the metric being affected (e.g., "purchase likelihood", "engagement score") */
  metricName: string;
  /** Weight of influence (0-100, higher = greater impact) */
  influenceWeight: number;
  /** Human-readable description of the impact */
  description: string;
  /** List of step IDs that are affected by this configuration */
  affectedSteps: string[];
}

/**
 * Explainability metadata for workflow steps
 * Helps users understand why a step exists and how it affects the simulation
 */
export interface ExplainabilityMetadata {
  /** Explanation of why this step exists in the workflow */
  whyThisStep: string;
  /** High-level overview of how this step impacts simulation results */
  impactOverview: string;
  /** Detailed breakdown of configuration impacts */
  configImpacts: ConfigImpact[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  component: string;
  description?: string;
  required?: boolean;

  // NEW: Mode-specific configuration
  /** Controls step behavior in beginner vs expert mode */
  modeConfig?: ModeConfig;

  // NEW: Explainability metadata (for Phase 2)
  /** Provides explanations about the step's purpose and impact */
  explainability?: ExplainabilityMetadata;
}

export interface WorkflowConfig {
  steps: WorkflowStep[];
  /** Optional default mode for the workflow ('beginner' | 'expert') */
  defaultMode?: 'beginner' | 'expert';
  /** Whether mode switching is allowed for this workflow */
  allowModeSwitch?: boolean;
}

// =============================================================================
// Dashboard Types
// =============================================================================

export interface MetricData {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  data: Record<string, JsonValue[]>;
}

export interface InsightDashboard {
  metrics: MetricData[];
  charts: ChartData[];
  keyInsights: string[];
  recommendations: string[];
}
