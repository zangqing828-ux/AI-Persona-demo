/**
 * Generic Analysis Engine
 * Analyzes simulation results and generates insights
 */

import { nanoid } from 'nanoid';
import type {
  AnalysisSegment,
  AggregateMetrics,
  BatchAnalysisConfig,
  BatchAnalysisResult,
  EmotionalJourneyPoint,
  InteractionAnalysisResult,
  InteractionEvent,
  InteractionSequence,
  ScenarioAnalysis,
  ScenarioDefinition,
  ScenarioType,
} from './types.js';

// =============================================================================
// Scenario Analyzer
// =============================================================================

export class ScenarioAnalyzer {
  private scenarios: Map<string, ScenarioDefinition>;

  constructor(scenarios: ScenarioDefinition[]) {
    this.scenarios = new Map(scenarios.map((s) => [s.id, s]));
  }

  /**
   * Analyze which scenarios are likely based on simulation results
   */
  analyzeScenarios(
    personaProfileId: string,
    productId: string,
    simulationResult: Record<string, unknown>,
    context?: Record<string, unknown>
  ): ScenarioAnalysis[] {
    const analyses: ScenarioAnalysis[] = [];

    for (const scenario of this.scenarios.values()) {
      const analysis = this.analyzeSingleScenario(
        personaProfileId,
        productId,
        scenario,
        simulationResult,
        context
      );

      if (analysis.likelihood > 30) {
        // Only include scenarios with >30% likelihood
        analyses.push(analysis);
      }
    }

    // Sort by likelihood (descending)
    return analyses.sort((a, b) => b.likelihood - a.likelihood);
  }

  private analyzeSingleScenario(
    personaProfileId: string,
    productId: string,
    scenario: ScenarioDefinition,
    simulationResult: Record<string, unknown>,
    context?: Record<string, unknown>
  ): ScenarioAnalysis {
    let triggerMatchCount = 0;
    let totalTriggers = scenario.triggers.length;

    for (const trigger of scenario.triggers) {
      if (this.evaluateTrigger(trigger, simulationResult, context)) {
        triggerMatchCount++;
      }
    }

    const likelihood = totalTriggers > 0 ? (triggerMatchCount / totalTriggers) * 100 : 0;
    const impact = this.calculateImpact(scenario.type, simulationResult);
    const severity = this.determineSeverity(scenario.type, likelihood, impact);

    const { insights, recommendations } = this.generateScenarioInsights(
      scenario,
      simulationResult,
      likelihood
    );

    return {
      id: nanoid(),
      personaProfileId,
      productId,
      scenario,
      likelihood: Math.round(likelihood),
      impact: Math.round(impact),
      severity,
      insights,
      recommendations,
      confidence: Math.min(likelihood + 10, 100),
    };
  }

  private evaluateTrigger(
    trigger: { condition: string; threshold?: number; attributes?: Record<string, unknown> },
    simulationResult: Record<string, unknown>,
    context?: Record<string, unknown>
  ): boolean {
    // Check if attributes match
    if (trigger.attributes) {
      for (const [key, value] of Object.entries(trigger.attributes)) {
        if (simulationResult[key] !== value && (context?.[key] ?? undefined) !== value) {
          return false;
        }
      }
    }

    // Check condition (simplified - use proper expression parser in production)
    if (trigger.condition) {
      try {
        const result = this.evaluateCondition(trigger.condition, {
          ...simulationResult,
          ...context,
        });
        return result;
      } catch {
        return false;
      }
    }

    // Check threshold
    if (trigger.threshold !== undefined) {
      const value = simulationResult.score as number | undefined;
      if (value !== undefined && value >= trigger.threshold) {
        return true;
      }
    }

    return false;
  }

  private evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
    // Very basic condition evaluation - use proper parser in production
    try {
      const variables = Object.keys(context);
      let evaluated = condition;

      for (const key of variables) {
        const value = context[key];
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (typeof value === 'string') {
          evaluated = evaluated.replace(regex, `'${value}'`);
        } else if (typeof value === 'boolean') {
          evaluated = evaluated.replace(regex, String(value));
        } else if (typeof value === 'number') {
          evaluated = evaluated.replace(regex, String(value));
        }
      }

      return Function(`"use strict"; return (${evaluated})`)() as boolean;
    } catch {
      return false;
    }
  }

  private calculateImpact(type: ScenarioType, simulationResult: Record<string, unknown>): number {
    // Calculate impact based on scenario type and simulation results
    const baseImpact = {
      positive: 80,
      negative: 70,
      neutral: 30,
      mixed: 50,
    }[type];

    // Adjust based on confidence/intent scores
    const confidence = (simulationResult.confidence as number) ?? 50;
    const intentScore = (simulationResult.intentScore as number) ?? 50;

    return baseImpact * (confidence / 100) * (intentScore / 100);
  }

  private determineSeverity(
    type: ScenarioType,
    likelihood: number,
    impact: number
  ): 'low' | 'medium' | 'high' {
    const score = likelihood * 0.4 + impact * 0.6;

    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private generateScenarioInsights(
    scenario: ScenarioDefinition,
    simulationResult: Record<string, unknown>,
    likelihood: number
  ): { insights: string[]; recommendations: string[] } {
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Generate insights based on scenario type
    switch (scenario.type) {
      case 'positive':
        insights.push(`Strong ${scenario.name} potential (${likelihood}% likely)`);
        recommendations.push('Leverage this scenario in marketing messaging');
        break;

      case 'negative':
        insights.push(`Risk of ${scenario.name} (${likelihood}% likely)`);
        recommendations.push('Address potential concerns proactively');
        break;

      case 'neutral':
        insights.push(`Moderate ${scenario.name} outcome expected`);
        recommendations.push('Consider ways to enhance the experience');
        break;

      case 'mixed':
        insights.push(`Mixed signals - ${scenario.name} possible`);
        recommendations.push('Prepare for multiple outcome scenarios');
        break;
    }

    return { insights, recommendations };
  }
}

// =============================================================================
// Interaction Analyzer
// =============================================================================

export class InteractionAnalyzer {
  /**
   * Analyze interaction sequence between personas
   */
  analyzeInteraction(
    personaProfileId: string,
    productId: string,
    events: InteractionEvent[]
  ): InteractionAnalysisResult {
    const sequence = this.buildSequence(events);
    const keyMoments = this.identifyKeyMoments(events);
    const emotionalJourney = this.buildEmotionalJourney(events);
    const summary = this.generateSummary(events);

    return {
      personaProfileId,
      productId,
      sequence,
      scenarios: [], // Will be populated by ScenarioAnalyzer
      keyMoments,
      emotionalJourney,
      summary,
    };
  }

  private buildSequence(events: InteractionEvent[]): InteractionSequence {
    if (events.length === 0) {
      return {
        events: [],
        overallSentiment: 'neutral',
        overallIntensity: 0,
        duration: 0,
      };
    }

    const positiveEvents = events.filter((e) => e.sentiment === 'positive').length;
    const negativeEvents = events.filter((e) => e.sentiment === 'negative').length;
    const neutralEvents = events.filter((e) => e.sentiment === 'neutral').length;

    const overallSentiment: 'positive' | 'neutral' | 'negative' =
      positiveEvents > negativeEvents ? 'positive' : negativeEvents > positiveEvents ? 'negative' : 'neutral';

    const totalIntensity = events.reduce((sum, e) => sum + (e.intensity ?? 0), 0);
    const overallIntensity = events.length > 0 ? totalIntensity / events.length : 0;

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const duration = lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime();

    return {
      events,
      overallSentiment,
      overallIntensity: Math.round(overallIntensity),
      duration,
    };
  }

  private identifyKeyMoments(events: InteractionEvent[]): InteractionEvent[] {
    // Identify events with high intensity or strong sentiment
    return events.filter((e) => {
      const highIntensity = (e.intensity ?? 0) >= 70;
      const strongSentiment =
        e.sentiment === 'positive' || e.sentiment === 'negative';

      return highIntensity || strongSentiment;
    });
  }

  private buildEmotionalJourney(events: InteractionEvent[]): EmotionalJourneyPoint[] {
    const journey: EmotionalJourneyPoint[] = [];

    for (const event of events) {
      if (event.sentiment && event.intensity !== undefined) {
        journey.push({
          timestamp: event.timestamp,
          emotion: event.sentiment,
          intensity: event.intensity,
          description: event.action,
        });
      }
    }

    return journey;
  }

  private generateSummary(events: InteractionEvent[]): InteractionAnalysisResult['summary'] {
    const positiveEvents = events.filter((e) => e.sentiment === 'positive').length;
    const negativeEvents = events.filter((e) => e.sentiment === 'negative').length;
    const neutralEvents = events.filter((e) => e.sentiment === 'neutral').length;

    const overallSatisfaction = events.length > 0
      ? (positiveEvents * 100 + neutralEvents * 50 - negativeEvents * 50) / events.length
      : 50;

    const churnRisk: 'low' | 'medium' | 'high' =
      overallSatisfaction >= 70 ? 'low' : overallSatisfaction >= 40 ? 'medium' : 'high';

    const repurchaseLikelihood = Math.max(0, Math.min(100, overallSatisfaction));

    return {
      positiveEvents,
      negativeEvents,
      neutralEvents,
      overallSatisfaction: Math.round(overallSatisfaction),
      churnRisk,
      repurchaseLikelihood: Math.round(repurchaseLikelihood),
    };
  }
}

// =============================================================================
// Batch Analyzer
// =============================================================================

export class BatchAnalyzer {
  constructor(
    private scenarioAnalyzer: ScenarioAnalyzer,
    private interactionAnalyzer: InteractionAnalyzer
  ) {}

  /**
   * Analyze multiple personas in batch
   */
  async analyzeBatch(config: BatchAnalysisConfig): Promise<BatchAnalysisResult> {
    const results: InteractionAnalysisResult[] = [];
    const scenarioCounts = new Map<string, { count: number; totalLikelihood: number; totalImpact: number }>();

    for (let i = 0; i < config.personaProfileIds.length; i++) {
      const personaId = config.personaProfileIds[i];

      // Mock interaction events (in production, these would come from simulation results)
      const events: InteractionEvent[] = [
        {
          timestamp: new Date(),
          actor: personaId,
          action: 'views_product',
          sentiment: 'neutral',
          intensity: 50,
        },
      ];

      const interactionResult = this.interactionAnalyzer.analyzeInteraction(
        personaId,
        config.productId,
        events
      );

      // Analyze scenarios
      const scenarioAnalyses = this.scenarioAnalyzer.analyzeScenarios(
        personaId,
        config.productId,
        {},
        {}
      );

      interactionResult.scenarios = scenarioAnalyses;

      // Aggregate scenario counts
      for (const analysis of scenarioAnalyses) {
        const key = analysis.scenario.id;
        const existing = scenarioCounts.get(key) ?? { count: 0, totalLikelihood: 0, totalImpact: 0 };
        existing.count++;
        existing.totalLikelihood += analysis.likelihood;
        existing.totalImpact += analysis.impact;
        scenarioCounts.set(key, existing);
      }

      results.push(interactionResult);

      if (config.onProgress) {
        config.onProgress(i + 1, config.personaProfileIds.length);
      }
    }

    const aggregateMetrics = this.calculateAggregateMetrics(results);
    const topScenarios = this.getTopScenarios(scenarioCounts);
    const segments = this.createSegments(results);

    return {
      results,
      aggregateMetrics,
      topScenarios,
      segments,
    };
  }

  private calculateAggregateMetrics(results: InteractionAnalysisResult[]): AggregateMetrics {
    const totalAnalyzed = results.length;

    let totalSatisfaction = 0;
    let totalRepurchase = 0;
    let churnRiskDistribution = { low: 0, medium: 0, high: 0 };
    let sentimentDistribution = { positive: 0, neutral: 0, negative: 0 };
    const positiveFactors = new Map<string, number>();
    const negativeFactors = new Map<string, number>();

    for (const result of results) {
      totalSatisfaction += result.summary.overallSatisfaction;
      totalRepurchase += result.summary.repurchaseLikelihood;

      churnRiskDistribution[result.summary.churnRisk]++;

      const sequence = result.sequence;
      sentimentDistribution[sequence.overallSentiment]++;

      // Aggregate factors from scenarios
      for (const scenario of result.scenarios) {
        for (const insight of scenario.insights) {
          const key = insight;
          if (scenario.scenario.type === 'positive') {
            positiveFactors.set(key, (positiveFactors.get(key) ?? 0) + 1);
          } else if (scenario.scenario.type === 'negative') {
            negativeFactors.set(key, (negativeFactors.get(key) ?? 0) + 1);
          }
        }
      }
    }

    return {
      totalAnalyzed,
      averageSatisfaction: Math.round(totalSatisfaction / totalAnalyzed),
      averageRepurchaseLikelihood: Math.round(totalRepurchase / totalAnalyzed),
      churnRiskDistribution,
      sentimentDistribution,
      topPositiveFactors: this.mapToSortedArray(positiveFactors),
      topNegativeFactors: this.mapToSortedArray(negativeFactors),
    };
  }

  private getTopScenarios(
    scenarioCounts: Map<string, { count: number; totalLikelihood: number; totalImpact: number }>
  ): Array<{
    scenario: ScenarioDefinition;
    count: number;
    averageLikelihood: number;
    averageImpact: number;
  }> {
    // This would need access to scenario definitions - placeholder implementation
    return [];
  }

  private createSegments(results: InteractionAnalysisResult[]): AnalysisSegment[] {
    // Simple segmentation by satisfaction level
    const highSatisfaction = results.filter((r) => r.summary.overallSatisfaction >= 70);
    const mediumSatisfaction = results.filter(
      (r) => r.summary.overallSatisfaction >= 40 && r.summary.overallSatisfaction < 70
    );
    const lowSatisfaction = results.filter((r) => r.summary.overallSatisfaction < 40);

    return [
      {
        id: 'segment_high',
        name: 'High Satisfaction',
        criteria: 'overallSatisfaction >= 70',
        profiles: highSatisfaction.map((r) => r.personaProfileId),
        characteristics: { averageSatisfaction: 70 },
        metrics: {
          size: highSatisfaction.length,
          averageSatisfaction: this.average(highSatisfaction, (r) => r.summary.overallSatisfaction),
          averageRepurchaseLikelihood: this.average(highSatisfaction, (r) => r.summary.repurchaseLikelihood),
          churnRisk: 'low' as const,
        },
      },
      {
        id: 'segment_medium',
        name: 'Medium Satisfaction',
        criteria: '40 <= overallSatisfaction < 70',
        profiles: mediumSatisfaction.map((r) => r.personaProfileId),
        characteristics: { averageSatisfaction: 55 },
        metrics: {
          size: mediumSatisfaction.length,
          averageSatisfaction: this.average(mediumSatisfaction, (r) => r.summary.overallSatisfaction),
          averageRepurchaseLikelihood: this.average(mediumSatisfaction, (r) => r.summary.repurchaseLikelihood),
          churnRisk: 'medium' as const,
        },
      },
      {
        id: 'segment_low',
        name: 'Low Satisfaction',
        criteria: 'overallSatisfaction < 40',
        profiles: lowSatisfaction.map((r) => r.personaProfileId),
        characteristics: { averageSatisfaction: 25 },
        metrics: {
          size: lowSatisfaction.length,
          averageSatisfaction: this.average(lowSatisfaction, (r) => r.summary.overallSatisfaction),
          averageRepurchaseLikelihood: this.average(lowSatisfaction, (r) => r.summary.repurchaseLikelihood),
          churnRisk: 'high' as const,
        },
      },
    ];
  }

  private average<T>(array: T[], selector: (item: T) => number): number {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + selector(item), 0);
    return Math.round(sum / array.length);
  }

  private mapToSortedArray(map: Map<string, number>): Array<{ factor: string; count: number }> {
    return Array.from(map.entries())
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
