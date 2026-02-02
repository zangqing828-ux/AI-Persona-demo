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

export interface WorkflowStep {
  id: string;
  name: string;
  component: string;
  description?: string;
  required?: boolean;
}

export interface WorkflowConfig {
  steps: WorkflowStep[];
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
