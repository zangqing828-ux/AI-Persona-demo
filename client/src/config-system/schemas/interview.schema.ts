/**
 * Interview Configuration Zod Schemas
 * Runtime validation for interview-related configurations
 */

import { z } from 'zod';

/**
 * Question Type Schema
 */
export const questionTypeSchema = z.enum([
  'single-choice',
  'multiple-choice',
  'open-ended',
  'rating',
]);

/**
 * Interview Question Schema
 */
export const interviewQuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: questionTypeSchema,
  options: z.array(z.string()).optional(),
  targetPersonaType: z.string().optional(),
  order: z.number().int().min(0),
  required: z.boolean().default(false),
  scoringWeight: z.number().min(0).max(1).optional(),
});

/**
 * Interview Script Rules Schema
 */
export const interviewScriptRulesSchema = z.object({
  persona: z.object({
    greeting: z.string().optional(),
    farewell: z.string().optional(),
    probingStyle: z.enum(['direct', 'exploratory', 'empathetic']).optional(),
    maxFollowUps: z.number().int().min(0).default(3),
  }),
  adaptive: z.object({
    enableFollowUps: z.boolean().default(true),
    sentimentTriggers: z.boolean().default(true),
    clarificationMode: z.boolean().default(false),
  }),
});

/**
 * Interview Trigger Schema
 */
export const interviewTriggerSchema = z.object({
  id: z.string().min(1),
  condition: z.string().min(1),
  action: z.enum(['ask-followup', 'clarify', 'redirect', 'end']),
  params: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Interview Config Metadata Schema
 */
export const configMetadataSchema = z.object({
  id: z.string().min(1),
  level: z.enum(['platform', 'industry', 'project']),
  industryId: z.string().optional(),
  projectId: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().optional(),
});

/**
 * Complete Interview Config Schema
 */
export const interviewConfigSchema = z.object({
  metadata: configMetadataSchema,
  questions: z.array(interviewQuestionSchema).min(1),
  scriptRules: interviewScriptRulesSchema,
  triggers: z.array(interviewTriggerSchema),
});

/**
 * Type exports
 */
export type InterviewQuestionDTO = z.infer<typeof interviewQuestionSchema>;
export type InterviewConfigDTO = z.infer<typeof interviewConfigSchema>;
