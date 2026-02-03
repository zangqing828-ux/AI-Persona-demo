/**
 * Dashboard Type Definitions
 * Core types for the Insight Dashboard V2
 */

/**
 * Survey response data
 */
export interface SurveyResponse {
  responseId: string;
  questionId: string;
  personaId: string;
  personaType: string;
  answer: string | string[] | number;
  timestamp: Date;
  confidence?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  metadata?: {
    age?: number;
    gender?: string;
    segment?: string;
    [key: string]: unknown;
  };
}

/**
 * Interview response with semantic annotations
 */
export interface InterviewResponse {
  responseId: string;
  questionId: string;
  personaId: string;
  personaName: string;
  personaType: string;
  personaSegment: string;
  answer: string;
  semanticAnnotations: SemanticAnnotation[];
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Semantic annotation for text highlighting
 */
export interface SemanticAnnotation {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'keyword' | 'sentiment' | 'entity' | 'concern';
  score: number;
  category?: string;
}

/**
 * Hierarchical metric structure (3-level indicators)
 */
export interface MetricHierarchy {
  id: string;
  level: 1 | 2 | 3;
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  dataPoints: DataPoint[];
  children?: MetricHierarchy[];
  argumentation: Argumentation;
  insight: string;
}

/**
 * Data point with source information
 */
export interface DataPoint {
  source: string;
  sourceType: 'survey' | 'interview' | 'simulation' | 'transaction';
  sampleSize: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Argumentation structure with evidence strength
 */
export interface Argumentation {
  strength: 'strong' | 'moderate' | 'weak';
  evidence: Evidence[];
  logic: LogicChain;
  confidence: number;
  sources: DataSource[];
}

/**
 * Evidence supporting a claim
 */
export interface Evidence {
  claim: string;
  supportingData: SupportingData[];
  strength: number; // 0-100
}

/**
 * Supporting data point
 */
export interface SupportingData {
  type: 'statistic' | 'quote' | 'correlation' | 'trend';
  value: string | number;
  source: string;
  sampleSize?: number;
}

/**
 * Logical chain of reasoning
 */
export interface LogicChain {
  premise: string[];
  reasoning: string;
  conclusion: string;
  alternativeExplanations?: string[];
}

/**
 * Data source reference
 */
export interface DataSource {
  id: string;
  type: 'question' | 'interview' | 'simulation' | 'transaction';
  question?: string;
  responseCount: number;
  dateRange: [Date, Date];
}
