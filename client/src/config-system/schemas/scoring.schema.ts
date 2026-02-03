/**
 * Scoring Configuration Zod Schemas
 * Runtime validation for scoring-related configurations
 */

import { z } from 'zod';
import { configMetadataSchema } from './interview.schema';

/**
 * Purchase Intent Scoring Schema
 */
export const purchaseIntentScoringSchema = z.object({
  thresholds: z.object({
    high: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    low: z.number().min(0).max(100),
  }).refine(data => data.high > data.medium && data.medium > data.low, {
    message: "Thresholds must be in descending order: high > medium > low",
  }),
  weights: z.object({
    trustLevel: z.number().min(0).max(1),
    pricePerception: z.number().min(0).max(1),
    ingredientConcerns: z.number().min(0).max(1),
    socialProof: z.number().min(0).max(1),
  }).refine(data => {
    const sum = data.trustLevel + data.pricePerception + data.ingredientConcerns + data.socialProof;
    return Math.abs(sum - 1.0) < 0.01; // Allow small floating point errors
  }, {
    message: "Weights must sum to 1.0",
  }),
  customRules: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    condition: z.string().min(1),
    action: z.string().min(1),
    weight: z.number().min(0).max(1),
  })).optional(),
});

/**
 * NPS Scoring Schema
 */
export const npsScoringSchema = z.object({
  promotersMin: z.number().int().min(0).max(10),
  passivesMin: z.number().int().min(0).max(10),
  detractorsMax: z.number().int().min(0).max(10),
  weightInOverallScore: z.number().min(0).max(1),
}).refine(data => data.promotersMin > data.passivesMin && data.passivesMin > data.detractorsMax, {
  message: "NPS thresholds must be in ascending order: promotersMin > passivesMin > detractorsMax",
});

/**
 * Price Sensitivity Scoring Schema
 */
export const priceSensitivityScoringSchema = z.object({
  priceRanges: z.object({
    low: z.number().positive(),
    medium: z.number().positive(),
    high: z.number().positive(),
  }).refine(data => data.low < data.medium && data.medium < data.high, {
    message: "Price ranges must be in ascending order: low < medium < high",
  }),
  elasticity: z.object({
    verySensitive: z.number().min(0).max(1),
    moderatelySensitive: z.number().min(0).max(1),
    notSensitive: z.number().min(0).max(1),
  }).refine(data => {
    const sum = data.verySensitive + data.moderatelySensitive + data.notSensitive;
    return Math.abs(sum - 1.0) < 0.01;
  }, {
    message: "Elasticity values must sum to 1.0",
  }),
});

/**
 * Risk Assessment Scoring Schema
 */
export const riskAssessmentScoringSchema = z.object({
  riskFactors: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    weight: z.number().min(0).max(1),
    threshold: z.number().min(0).max(100),
  })).min(1),
  aggregationMethod: z.enum(['weighted-sum', 'max', 'average']),
});

/**
 * Complete Scoring Config Schema
 */
export const scoringConfigSchema = z.object({
  metadata: configMetadataSchema,
  purchaseIntent: purchaseIntentScoringSchema,
  nps: npsScoringSchema,
  priceSensitivity: priceSensitivityScoringSchema,
  riskAssessment: riskAssessmentScoringSchema,
});

/**
 * Type exports
 */
export type PurchaseIntentScoringDTO = z.infer<typeof purchaseIntentScoringSchema>;
export type NPSScoringDTO = z.infer<typeof npsScoringSchema>;
export type PriceSensitivityScoringDTO = z.infer<typeof priceSensitivityScoringSchema>;
export type RiskAssessmentScoringDTO = z.infer<typeof riskAssessmentScoringSchema>;
export type ScoringConfigDTO = z.infer<typeof scoringConfigSchema>;
