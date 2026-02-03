/**
 * Project-level configuration types
 * Defines all user-configurable settings for a project
 */

import { BaseConfig } from './config';

/**
 * Interview Question Types
 */
export type QuestionType = 'single-choice' | 'multiple-choice' | 'open-ended' | 'rating';

/**
 * Interview Question
 */
export interface InterviewQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  targetPersonaType?: string;
  order: number;
  required?: boolean;
  scoringWeight?: number;
}

/**
 * Interview Script Rules
 * Defines how agents respond during interviews
 */
export interface InterviewScriptRules {
  persona: {
    greeting?: string;
    farewell?: string;
    probingStyle?: 'direct' | 'exploratory' | 'empathetic';
    maxFollowUps: number;
  };
  adaptive: {
    enableFollowUps: boolean;
    sentimentTriggers: boolean;
    clarificationMode: boolean;
  };
}

/**
 * Interview Triggers
 * Conditions that trigger adaptive interview behavior
 */
export interface InterviewTrigger {
  id: string;
  condition: string;
  action: 'ask-followup' | 'clarify' | 'redirect' | 'end';
  params?: Record<string, unknown>;
}

/**
 * Interview Configuration
 */
export interface InterviewConfig extends BaseConfig {
  questions: InterviewQuestion[];
  scriptRules: InterviewScriptRules;
  triggers: InterviewTrigger[];
}

/**
 * Purchase Intent Scoring
 */
export interface PurchaseIntentScoring {
  thresholds: {
    high: number;
    medium: number;
    low: number;
  };
  weights: {
    trustLevel: number;
    pricePerception: number;
    ingredientConcerns: number;
    socialProof: number;
  };
  customRules?: ScoringRule[];
}

/**
 * NPS Scoring
 */
export interface NPSScoring {
  promotersMin: number;      // 9-10
  passivesMin: number;       // 7-8
  detractorsMax: number;     // 0-6
  weightInOverallScore: number;
}

/**
 * Price Sensitivity Scoring
 */
export interface PriceSensitivityScoring {
  priceRanges: {
    low: number;
    medium: number;
    high: number;
  };
  elasticity: {
    verySensitive: number;
    moderatelySensitive: number;
    notSensitive: number;
  };
}

/**
 * Risk Assessment Scoring
 */
export interface RiskAssessmentScoring {
  riskFactors: Array<{
    id: string;
    name: string;
    weight: number;
    threshold: number;
  }>;
  aggregationMethod: 'weighted-sum' | 'max' | 'average';
}

/**
 * Scoring Rule
 */
export interface ScoringRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  weight: number;
}

/**
 * Scoring Configuration
 */
export interface ScoringConfig extends BaseConfig {
  purchaseIntent: PurchaseIntentScoring;
  nps: NPSScoring;
  priceSensitivity: PriceSensitivityScoring;
  riskAssessment: RiskAssessmentScoring;
}

/**
 * Test Parameters
 */
export interface TestParameters {
  sampleSize: number;
  confidenceLevel: number;
  marginOfError: number;
  iterations?: number;
}

/**
 * A/B Test Configuration
 */
export interface ABTestConfig {
  enabled: boolean;
  variants: Array<{
    id: string;
    name: string;
    allocation: number; // percentage
  }>;
  successMetrics: string[];
}

/**
 * Product Configuration
 */
export interface ProductConfig extends BaseConfig {
  productId: string;
  customAttributes: Record<string, unknown>;
  testParameters: TestParameters;
  abTestConfig?: ABTestConfig;
}

/**
 * CDP Tag Condition Operator
 */
export type TagOperator = 'equals' | 'contains' | 'greater-than' | 'less-than' | 'in';

/**
 * CDP Tag Condition
 */
export interface TagCondition {
  attribute: string;
  operator: TagOperator;
  value: unknown;
}

/**
 * CDP Tag
 */
export interface CDPTag {
  id: string;
  name: string;
  category: string;
  color: string;
  conditions: TagCondition[];
}

/**
 * Segment Rule
 */
export interface SegmentRule {
  id: string;
  name: string;
  tagCombination: 'AND' | 'OR';
  tagIds: string[];
  estimatedSize?: number;
}

/**
 * Audience Configuration
 */
export interface AudienceConfig extends BaseConfig {
  customTags: CDPTag[];
  segmentRules: SegmentRule[];
  targetSegments: string[];
}

/**
 * Data Masking Rules
 */
export interface DataMaskingRules {
  enablePiiMasking: boolean;
  maskFields: string[];
  anonymizeThreshold: number;
}

/**
 * Report Branding
 */
export interface ReportBranding {
  logoUrl?: string;
  primaryColor: string;
  companyName: string;
}

/**
 * Report Configuration
 */
export interface ReportConfig extends BaseConfig {
  includedMetrics: string[];
  keyInsights: string[];
  dataMasking: DataMaskingRules;
  exportFormat: 'pdf' | 'excel' | 'json';
  branding: ReportBranding;
}
