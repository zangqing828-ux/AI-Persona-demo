/**
 * Argumentation Strength Calculator
 * Calculates evidence strength based on multiple factors
 */

import type { Argumentation, Evidence } from '../types/dashboard';

export class ArgumentationCalculator {
  /**
   * Calculate overall argumentation strength
   */
  calculateStrength(argumentation: Partial<Argumentation>): Argumentation {
    const strength = this.determineStrengthLevel(argumentation);
    const confidence = this.calculateConfidence(argumentation);

    return {
      strength,
      evidence: argumentation.evidence || [],
      logic: argumentation.logic || this.buildDefaultLogic(),
      confidence,
      sources: argumentation.sources || [],
    };
  }

  /**
   * Determine strength level: strong, moderate, or weak
   */
  private determineStrengthLevel(arg: Partial<Argumentation>): 'strong' | 'moderate' | 'weak' {
    const score = this.calculateStrengthScore(arg);

    if (score >= 70) return 'strong';
    if (score >= 40) return 'moderate';
    return 'weak';
  }

  /**
   * Calculate strength score (0-100)
   */
  private calculateStrengthScore(arg: Partial<Argumentation>): number {
    let score = 0;

    // Sample size contribution (0-40 points)
    const totalSampleSize = this.getTotalSampleSize(arg);
    score += Math.min(40, totalSampleSize / 25); // 1000+ samples = full points

    // Source diversity (0-30 points)
    const uniqueSourceTypes = new Set(arg.sources?.map(s => s.type) || []).size;
    score += Math.min(30, uniqueSourceTypes * 10); // 3+ sources = full points

    // Recency (0-20 points)
    const avgAge = this.getAverageDataAge(arg);
    if (avgAge < 30) score += 20; // Data within 30 days
    else if (avgAge < 90) score += 10; // Data within 90 days

    // Cross-validation (0-10 points)
    const hasCrossValidation = this.hasCrossValidation(arg);
    if (hasCrossValidation) score += 10;

    return Math.min(100, score);
  }

  private calculateConfidence(arg: Partial<Argumentation>): number {
    const strengthScore = this.calculateStrengthScore(arg);
    const evidenceQuality = this.assessEvidenceQuality(arg.evidence || []);
    const logicScore = this.assessLogicQuality(arg.logic);

    return Math.round((strengthScore * 0.5 + evidenceQuality * 0.3 + logicScore * 0.2));
  }

  private assessEvidenceQuality(evidence: Evidence[]): number {
    if (evidence.length === 0) return 0;

    let quality = 0;
    evidence.forEach(e => {
      const dataPointCount = e.supportingData.length;
      const avgStrength = e.supportingData.reduce((sum, d) => sum + (d.sampleSize || 1), 0) / dataPointCount;

      quality += Math.min(100, avgStrength / 10);
    });

    return Math.min(100, quality / evidence.length);
  }

  private assessLogicQuality(logic?: any): number {
    if (!logic) return 50;

    let score = 50; // Base score

    if (logic.premise && logic.premise.length > 0) score += 20;
    if (logic.reasoning) score += 20;
    if (logic.conclusion) score += 10;

    return Math.min(100, score);
  }

  private getTotalSampleSize(arg: Partial<Argumentation>): number {
    return arg.sources?.reduce((sum, s) => sum + s.responseCount, 0) || 0;
  }

  private getAverageDataAge(arg: Partial<Argumentation>): number {
    if (!arg.sources || arg.sources.length === 0) return Infinity;

    const now = Date.now();
    const avgAge = arg.sources.reduce((sum, s) => {
      const age = (now - new Date(s.dateRange[0]).getTime()) / (1000 * 60 * 60 * 24);
      return sum + age;
    }, 0) / arg.sources.length;

    return avgAge;
  }

  private hasCrossValidation(arg: Partial<Argumentation>): boolean {
    const sourceTypes = new Set(arg.sources?.map(s => s.type) || []);
    return sourceTypes.size >= 2;
  }

  private buildDefaultLogic(): any {
    return {
      premise: [],
      reasoning: '',
      conclusion: '',
    };
  }
}

// Export singleton instance
export const argumentationCalculator = new ArgumentationCalculator();
