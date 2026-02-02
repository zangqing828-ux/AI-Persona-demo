/**
 * Generic Simulation Engine
 * Supports rule-based, LLM-based, and hybrid simulation
 */

import { nanoid } from 'nanoid';
import type {
  HybridStrategy,
  LLMConfig,
  Rule,
  RuleEvaluationContext,
  RuleEvaluationResult,
  SimulationBatchConfig,
  SimulationBatchResult,
  SimulationContext,
  SimulationEngine,
  SimulationEngineType,
  SimulationResult,
  SimulationStep,
} from './types.js';

// =============================================================================
// Rule-Based Engine
// =============================================================================

export class RuleBasedEngine implements SimulationEngine {
  constructor(private rules: Rule[]) {}

  getEngineType(): SimulationEngineType {
    return 'rule-based';
  }

  canHandle(context: SimulationContext): boolean {
    return this.rules.length > 0;
  }

  simulate(context: SimulationContext): SimulationResult {
    const startTime = Date.now();
    const steps: SimulationStep[] = [];

    // Evaluate rules
    const evaluationResult = this.evaluateRules(context);

    steps.push({
      name: 'rule-evaluation',
      description: 'Evaluate simulation rules',
      result: evaluationResult.result,
      executionTime: evaluationResult.executionTime,
    });

    const executionTime = Date.now() - startTime;

    return {
      id: nanoid(),
      engineType: this.getEngineType(),
      context,
      result: evaluationResult.result as Record<string, unknown>,
      confidence: evaluationResult.confidence,
      timestamp: new Date(),
      executionTime,
      steps,
    };
  }

  private evaluateRules(context: SimulationContext): RuleEvaluationResult {
    const startTime = Date.now();
    const evaluationContext: RuleEvaluationContext = {
      variables: { ...context.metadata },
      history: [],
    };

    // Sort rules by priority (higher priority first)
    const sortedRules = [...this.rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    // Find first matching rule
    for (const rule of sortedRules) {
      if (this.evaluateCondition(rule.condition, evaluationContext)) {
        const result = this.executeAction(rule.action, evaluationContext);

        return {
          matchedRule: rule,
          result,
          confidence: 85, // Rule-based engines have moderate confidence
          executionTime: Date.now() - startTime,
        };
      }
    }

    // No matching rule found
    return {
      matchedRule: null,
      result: { message: 'No matching rule found' },
      confidence: 0,
      executionTime: Date.now() - startTime,
    };
  }

  private evaluateCondition(condition: string, context: RuleEvaluationContext): boolean {
    // Simple condition evaluation - in production, use a proper expression parser
    // For now, support basic conditions like "age > 25" or "concerns.includes('健康')"

    try {
      // Replace variables with values
      let evaluated = condition;
      for (const [key, value] of Object.entries(context.variables)) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (typeof value === 'string') {
          evaluated = evaluated.replace(regex, `'${value}'`);
        } else if (typeof value === 'boolean') {
          evaluated = evaluated.replace(regex, String(value));
        } else if (typeof value === 'number') {
          evaluated = evaluated.replace(regex, String(value));
        }
      }

      // Evaluate the condition (simplified - use proper parser in production)
      // This is a very basic implementation for demonstration
      return Function(`"use strict"; return (${evaluated})`)() as boolean;
    } catch {
      return false;
    }
  }

  private executeAction(action: string, context: RuleEvaluationContext): Record<string, unknown> {
    // Parse action and execute it
    // For now, return a simple result object
    return {
      action,
      result: 'executed',
      variables: { ...context.variables },
    };
  }
}

// =============================================================================
// LLM-Based Engine
// =============================================================================

export class LLMEngine implements SimulationEngine {
  constructor(private config: LLMConfig) {}

  getEngineType(): SimulationEngineType {
    return 'llm';
  }

  canHandle(context: SimulationContext): boolean {
    return !!this.config.apiKey;
  }

  async simulate(context: SimulationContext): Promise<SimulationResult> {
    const startTime = Date.now();
    const steps: SimulationStep[] = [];

    // Build prompt from context
    const prompt = this.buildPrompt(context);

    steps.push({
      name: 'prompt-generation',
      description: 'Generate LLM prompt',
      result: { system: prompt.system, user: prompt.user },
      executionTime: 0,
    });

    // Call LLM (placeholder - implement actual API call)
    const llmResult = await this.callLLM(prompt);

    steps.push({
      name: 'llm-inference',
      description: 'Execute LLM inference',
      result: { content: llmResult.content, usage: llmResult.usage },
      executionTime: 0,
    });

    // Parse response
    const parsedResult = this.parseResponse(llmResult.content);

    const executionTime = Date.now() - startTime;

    return {
      id: nanoid(),
      engineType: this.getEngineType(),
      context,
      result: parsedResult,
      confidence: 75, // LLM confidence varies
      timestamp: new Date(),
      executionTime,
      steps,
    };
  }

  private buildPrompt(context: SimulationContext): { system: string; user: string } {
    const system = 'You are an AI simulation assistant. Analyze the given context and provide simulation results.';

    const user = `Context: ${JSON.stringify(context.metadata, null, 2)}

Please simulate the persona's reaction and provide:
1. Initial reaction
2. Decision/reasoning
3. Confidence level
4. Key considerations

Respond in JSON format.`;

    return { system, user };
  }

  private async callLLM(prompt: { system: string; user: string }): Promise<{
    content: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    // Placeholder for actual LLM API call
    // In production, implement actual OpenAI/Anthropic API call here
    return {
      content: JSON.stringify({
        reaction: 'Simulated response',
        decision: 'positive',
        confidence: 0.8,
        considerations: ['Quality', 'Price', 'Brand'],
      }),
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  private parseResponse(content: string): Record<string, unknown> {
    try {
      return JSON.parse(content);
    } catch {
      return { rawResponse: content };
    }
  }
}

// =============================================================================
// Hybrid Engine
// =============================================================================

export class HybridEngine implements SimulationEngine {
  constructor(
    private ruleEngine: RuleBasedEngine,
    private llmEngine: LLMEngine,
    private strategy: HybridStrategy
  ) {}

  getEngineType(): SimulationEngineType {
    return 'hybrid';
  }

  canHandle(context: SimulationContext): boolean {
    return this.ruleEngine.canHandle(context) || this.llmEngine.canHandle(context);
  }

  async simulate(context: SimulationContext): Promise<SimulationResult> {
    const startTime = Date.now();
    const steps: SimulationStep[] = [];
    const result: Record<string, unknown> = {};

    // Determine which attributes to use rules for
    const ruleAttributes = Object.keys(context.metadata ?? {}).filter((key) =>
      this.strategy.useRulesFor.includes(key)
    );

    // Determine which attributes to use LLM for
    const llmAttributes = Object.keys(context.metadata ?? {}).filter((key) =>
      this.strategy.useLLMFor.includes(key)
    );

    // Run rule-based simulation for specified attributes
    if (ruleAttributes.length > 0 && this.ruleEngine.canHandle(context)) {
      const ruleContext = {
        ...context,
        metadata: Object.fromEntries(
          ruleAttributes.map((key) => [key, context.metadata?.[key]])
        ),
      };

      const ruleResult = this.ruleEngine.simulate(ruleContext);
      Object.assign(result, ruleResult.result);

      steps.push(...ruleResult.steps);
    }

    // Run LLM simulation for specified attributes
    if (llmAttributes.length > 0 && this.llmEngine.canHandle(context)) {
      const llmContext = {
        ...context,
        metadata: Object.fromEntries(
          llmAttributes.map((key) => [key, context.metadata?.[key]])
        ),
      };

      const llmResult = await this.llmEngine.simulate(llmContext);
      Object.assign(result, llmResult.result);

      steps.push(...llmResult.steps);
    }

    const executionTime = Date.now() - startTime;

    return {
      id: nanoid(),
      engineType: this.getEngineType(),
      context,
      result,
      confidence: 80, // Hybrid engines combine both approaches
      timestamp: new Date(),
      executionTime,
      steps,
    };
  }
}

// =============================================================================
// Batch Simulation
// =============================================================================

export async function runBatchSimulation(
  engine: SimulationEngine,
  config: SimulationBatchConfig
): Promise<SimulationBatchResult> {
  const results: SimulationResult[] = [];
  const errors: SimulationBatchResult['errors'] = [];
  let successful = 0;
  let failed = 0;
  let totalConfidence = 0;

  const maxConcurrent = config.maxConcurrent ?? 5;
  const contexts = config.contexts;

  // Process in batches
  for (let i = 0; i < contexts.length; i += maxConcurrent) {
    const batch = contexts.slice(i, i + maxConcurrent);

    const batchResults = await Promise.allSettled(
      batch.map((context) => {
        const result = engine.simulate(context);
        return result instanceof Promise ? result : Promise.resolve(result);
      })
    );

    for (const settledResult of batchResults) {
      if (settledResult.status === 'fulfilled') {
        results.push(settledResult.value);
        successful++;
        totalConfidence += settledResult.value.confidence;
      } else {
        const contextIndex = results.length + errors.length;
        errors.push({
          context: contexts[contextIndex],
          error: settledResult.reason?.message ?? 'Unknown error',
        });
        failed++;
      }
    }

    // Report progress
    if (config.onProgress) {
      config.onProgress(i + batch.length, contexts.length);
    }
  }

  const averageConfidence = successful > 0 ? totalConfidence / successful : 0;
  const totalExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0);

  return {
    results,
    summary: {
      total: contexts.length,
      successful,
      failed,
      averageConfidence: Math.round(averageConfidence),
      totalExecutionTime,
    },
    errors,
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Create a rule-based engine
 */
export function createRuleBasedEngine(rules: Rule[]): SimulationEngine {
  return new RuleBasedEngine(rules);
}

/**
 * Create an LLM-based engine
 */
export function createLLMEngine(config: LLMConfig): SimulationEngine {
  return new LLMEngine(config);
}

/**
 * Create a hybrid engine
 */
export function createHybridEngine(
  ruleEngine: RuleBasedEngine,
  llmEngine: LLMEngine,
  strategy: HybridStrategy
): SimulationEngine {
  return new HybridEngine(ruleEngine, llmEngine, strategy);
}
