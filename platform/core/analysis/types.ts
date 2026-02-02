/**
 * Core Analysis Types
 * Generic analysis abstractions for the platform
 */

import type { JsonValue } from '../../shared/types/platform.js';

// =============================================================================
// Scenario Analysis
// =============================================================================

export interface ScenarioDefinition {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  triggers: ScenarioTrigger[];
}

export type ScenarioType = 'positive' | 'negative' | 'neutral' | 'mixed';

export interface ScenarioTrigger {
  condition: string;
  threshold?: number;
  attributes?: Record<string, JsonValue>;
}

export interface ScenarioAnalysis {
  id: string;
  personaProfileId: string;
  productId: string;
  scenario: ScenarioDefinition;
  likelihood: number; // 0-100
  impact: number; // 0-100
  severity: 'low' | 'medium' | 'high';
  insights: string[];
  recommendations: string[];
  confidence: number; // 0-100
}

// =============================================================================
// Interaction Analysis
// =============================================================================

export interface InteractionEvent {
  timestamp: Date;
  actor: string; // Persona type ID
  action: string;
  target?: string;
  context?: Record<string, JsonValue>;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intensity?: number; // 0-100
}

export interface InteractionSequence {
  events: InteractionEvent[];
  overallSentiment: 'positive' | 'neutral' | 'negative';
  overallIntensity: number; // 0-100
  duration: number; // milliseconds
}

export interface InteractionAnalysisResult {
  personaProfileId: string;
  productId: string;
  sequence: InteractionSequence;
  scenarios: ScenarioAnalysis[];
  keyMoments: InteractionEvent[];
  emotionalJourney: EmotionalJourneyPoint[];
  summary: {
    positiveEvents: number;
    negativeEvents: number;
    neutralEvents: number;
    overallSatisfaction: number; // 0-100
    churnRisk: 'low' | 'medium' | 'high';
    repurchaseLikelihood: number; // 0-100
  };
}

export interface EmotionalJourneyPoint {
  timestamp: Date;
  emotion: string;
  intensity: number;
  description: string;
}

// =============================================================================
// Batch Analysis
// =============================================================================

export interface BatchAnalysisConfig {
  personaProfileIds: string[];
  productId: string;
  scenarios: ScenarioDefinition[];
  onProgress?: (progress: number, total: number) => void;
}

export interface BatchAnalysisResult {
  results: InteractionAnalysisResult[];
  aggregateMetrics: AggregateMetrics;
  topScenarios: Array<{
    scenario: ScenarioDefinition;
    count: number;
    averageLikelihood: number;
    averageImpact: number;
  }>;
  segments: AnalysisSegment[];
}

export interface AggregateMetrics {
  totalAnalyzed: number;
  averageSatisfaction: number;
  averageRepurchaseLikelihood: number;
  churnRiskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topPositiveFactors: Array<{ factor: string; count: number }>;
  topNegativeFactors: Array<{ factor: string; count: number }>;
}

export interface AnalysisSegment {
  id: string;
  name: string;
  criteria: string;
  profiles: string[];
  characteristics: Record<string, JsonValue>;
  metrics: {
    size: number;
    averageSatisfaction: number;
    averageRepurchaseLikelihood: number;
    churnRisk: 'low' | 'medium' | 'high';
  };
}

// =============================================================================
// Insight Generation
// =============================================================================

export interface Insight {
  id: string;
  type: InsightType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  impact: string;
  recommendation: string;
  priority: number; // 1-10
}

export type InsightType =
  | 'opportunity'
  | 'risk'
  | 'trend'
  | 'anomaly'
  | 'correlation'
  | 'pattern';

export interface InsightReport {
  id: string;
  generatedAt: Date;
  personaProfileId?: string;
  productId?: string;
  insights: Insight[];
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
}
