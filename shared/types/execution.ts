/**
 * Execution trace for explainability
 * Captures detailed execution information for result-to-configuration tracing,
 * decision path visualization, and audit trail generation.
 */

/**
 * Individual rule match information
 */
export interface RuleMatch {
  ruleId: string;
  ruleName: string;
  condition: string;
  matched: boolean;
  confidence: number; // 0-100
  result: unknown;
}

/**
 * Trace information for a single workflow step
 */
export interface StepTrace {
  stepId: string;
  stepName: string;
  configSnapshot: Record<string, unknown>;
  executionTime: number; // milliseconds
  rulesTriggered: RuleMatch[];
  intermediateOutputs: unknown[];
  timestamp: Date;
}

/**
 * Complete execution trace for a batch interview session
 */
export interface ExecutionTrace {
  traceId: string;
  sessionId: string;
  timestamp: Date;
  workflowConfig: {
    industry: string;
    steps: string[];
    mode: 'beginner' | 'expert';
  };
  stepTraces: StepTrace[];
  finalMetrics: {
    [metricName: string]: number | string;
  };
  totalExecutionTime: number; // milliseconds
}

/**
 * Configuration snapshot captured before interview execution
 */
export interface ConfigSnapshot {
  industry: string;
  productId?: string;
  audienceSegments?: string[];
  questionnaire?: unknown[];
  scoringRules?: unknown[];
  mode: 'beginner' | 'expert';
  skippedSteps: string[];
  timestamp: Date;
}

/**
 * Storage utilities for execution traces
 */
export interface ExecutionTraceStorage {
  getStoredTraces: () => ExecutionTrace[];
  storeExecutionTrace: (trace: ExecutionTrace) => void;
  clearTraces: () => void;
  getTraceById: (traceId: string) => ExecutionTrace | null;
}
