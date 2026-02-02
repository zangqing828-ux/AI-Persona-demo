/**
 * Persona Profiler
 * Analyzes and compares persona profiles
 */

import type { JsonValue } from '../../shared/types/platform.js';
import type {
  PersonaAnalysis,
  PersonaComparison,
  PersonaProfiler,
  PersonaProfile,
  PersonaSegment,
  SegmentationCriteria,
} from './types.js';

// =============================================================================
// Default Persona Profiler Implementation
// =============================================================================

export class DefaultPersonaProfiler implements PersonaProfiler {
  /**
   * Analyze a single persona profile
   */
  analyze(profile: PersonaProfile): PersonaAnalysis {
    const characteristics = this.extractCharacteristics(profile);
    const { strengths, weaknesses } = this.identifyStrengthsAndWeaknesses(profile, characteristics);
    const recommendations = this.generateRecommendations(profile, characteristics);

    return {
      profileId: profile.id,
      strengths,
      weaknesses,
      characteristics,
      recommendations,
      score: this.calculateScore(profile),
    };
  }

  /**
   * Compare multiple persona profiles
   */
  compare(profiles: PersonaProfile[]): PersonaComparison {
    if (profiles.length < 2) {
      throw new Error('At least 2 profiles are required for comparison');
    }

    const profileIds = profiles.map((p) => p.id);
    const similarities = this.findSimilarities(profiles);
    const differences = this.findDifferences(profiles);
    const compatibilityScore = this.calculateCompatibility(profiles);

    return {
      profiles: profileIds,
      similarities,
      differences,
      compatibilityScore,
    };
  }

  /**
   * Segment profiles based on criteria
   */
  segment(profiles: PersonaProfile[], criteria: SegmentationCriteria[]): PersonaSegment[] {
    const segments: PersonaSegment[] = [];

    for (let i = 0; i < criteria.length; i++) {
      const criterion = criteria[i];
      const matchingProfiles = profiles.filter((profile) =>
        this.matchesCriteria(profile, criterion)
      );

      if (matchingProfiles.length > 0) {
        const characteristics = this.extractSegmentCharacteristics(matchingProfiles);

        segments.push({
          id: `segment_${i}`,
          name: this.generateSegmentName(criterion),
          criteria: criterion,
          profiles: matchingProfiles,
          size: matchingProfiles.length,
          characteristics,
        });
      }
    }

    return segments;
  }

  // =============================================================================
  // Private Methods
  // =============================================================================

  /**
   * Extract characteristics from a profile
   */
  private extractCharacteristics(profile: PersonaProfile): Record<string, JsonValue> {
    const characteristics: Record<string, JsonValue> = {};

    for (const [key, value] of Object.entries(profile.attributes)) {
      // Store key attributes as characteristics
      if (this.isKeyAttribute(key)) {
        characteristics[key] = value;
      }
    }

    return characteristics;
  }

  /**
   * Identify strengths and weaknesses based on attributes
   */
  private identifyStrengthsAndWeaknesses(
    profile: PersonaProfile,
    characteristics: Record<string, JsonValue>
  ): { strengths: string[]; weaknesses: string[] } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // This is a generic implementation - specific industries should override
    for (const [key, value] of Object.entries(characteristics)) {
      if (typeof value === 'string') {
        // Positive attributes
        if (key.includes('philosophy') || key.includes('level')) {
          strengths.push(`${key}: ${value}`);
        }
      } else if (typeof value === 'number') {
        if (value > 70) {
          strengths.push(`${key}: ${value} (high)`);
        } else if (value < 30) {
          weaknesses.push(`${key}: ${value} (low)`);
        }
      }
    }

    return { strengths, weaknesses };
  }

  /**
   * Generate recommendations based on profile
   */
  private generateRecommendations(
    profile: PersonaProfile,
    characteristics: Record<string, JsonValue>
  ): string[] {
    const recommendations: string[] = [];

    // Generic recommendation logic - should be overridden by industry-specific implementations
    for (const [key, value] of Object.entries(characteristics)) {
      if (typeof value === 'number') {
        if (value < 30) {
          recommendations.push(`Consider improving ${key}`);
        }
      }
    }

    return recommendations;
  }

  /**
   * Calculate a score for the profile
   */
  private calculateScore(profile: PersonaProfile): number {
    // Generic scoring based on attribute completeness
    let score = 0;
    const totalAttributes = Object.keys(profile.attributes).length;

    for (const value of Object.values(profile.attributes)) {
      if (value !== null && value !== undefined) {
        score += 100 / totalAttributes;
      }
    }

    return Math.round(score);
  }

  /**
   * Find similarities between profiles
   */
  private findSimilarities(profiles: PersonaProfile[]): string[] {
    const similarities: string[] = [];
    const allKeys = Object.keys(profiles[0].attributes);

    for (const key of allKeys) {
      const values = profiles.map((p) => p.attributes[key]);
      const firstValue = values[0];

      if (values.every((v) => v === firstValue)) {
        similarities.push(`${key}: ${JSON.stringify(firstValue)}`);
      }
    }

    return similarities;
  }

  /**
   * Find differences between profiles
   */
  private findDifferences(profiles: PersonaProfile[]): string[] {
    const differences: string[] = [];
    const allKeys = new Set<string>();

    profiles.forEach((p) => {
      Object.keys(p.attributes).forEach((key) => allKeys.add(key));
    });

    for (const key of allKeys) {
      const values = profiles.map((p) => p.attributes[key]);
      const uniqueValues = new Set(values);

      if (uniqueValues.size > 1) {
        differences.push(`${key}: varies (${Array.from(uniqueValues).join(', ')})`);
      }
    }

    return differences;
  }

  /**
   * Calculate compatibility score between profiles
   */
  private calculateCompatibility(profiles: PersonaProfile[]): number {
    if (profiles.length < 2) return 100;

    let totalSimilarity = 0;
    let comparableAttributes = 0;

    // Compare all profiles with each other
    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const similarity = this.calculateProfileSimilarity(profiles[i], profiles[j]);
        totalSimilarity += similarity;
        comparableAttributes++;
      }
    }

    return comparableAttributes > 0
      ? Math.round(totalSimilarity / comparableAttributes)
      : 0;
  }

  /**
   * Calculate similarity between two profiles
   */
  private calculateProfileSimilarity(profile1: PersonaProfile, profile2: PersonaProfile): number {
    const keys1 = Object.keys(profile1.attributes);
    const keys2 = Object.keys(profile2.attributes);
    const allKeys = new Set([...keys1, ...keys2]);

    let matches = 0;

    for (const key of allKeys) {
      const value1 = profile1.attributes[key];
      const value2 = profile2.attributes[key];

      if (value1 === value2) {
        matches++;
      }
    }

    return Math.round((matches / allKeys.size) * 100);
  }

  /**
   * Check if a profile matches segmentation criteria
   */
  private matchesCriteria(profile: PersonaProfile, criteria: SegmentationCriteria): boolean {
    const value = profile.attributes[criteria.attribute];

    switch (criteria.operator) {
      case 'equals':
        return value === criteria.value;

      case 'contains':
        if (Array.isArray(value)) {
          return value.includes(criteria.value);
        }
        if (typeof value === 'string') {
          return value.includes(criteria.value as string);
        }
        return false;

      case 'range':
        if (typeof value === 'number' && criteria.min !== undefined && criteria.max !== undefined) {
          return value >= criteria.min && value <= criteria.max;
        }
        return false;

      case 'greater-than':
        if (typeof value === 'number' && criteria.value !== undefined) {
          return value > (criteria.value as number);
        }
        return false;

      case 'less-than':
        if (typeof value === 'number' && criteria.value !== undefined) {
          return value < (criteria.value as number);
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Extract characteristics for a segment
   */
  private extractSegmentCharacteristics(profiles: PersonaProfile[]): Record<string, JsonValue> {
    const characteristics: Record<string, JsonValue> = {};
    const allKeys = new Set<string>();

    profiles.forEach((p) => {
      Object.keys(p.attributes).forEach((key) => allKeys.add(key));
    });

    for (const key of allKeys) {
      const values = profiles.map((p) => p.attributes[key]).filter((v) => v !== undefined);

      if (values.length > 0) {
        if (typeof values[0] === 'number') {
          // For numbers, calculate average
          const sum = values.reduce((acc: number, v) => acc + (v as number), 0);
          characteristics[key] = Math.round(sum / values.length);
        } else {
          // For other types, use the most common value
          const frequency: Record<string, number> = {};
          values.forEach((v) => {
            const key = JSON.stringify(v);
            frequency[key] = (frequency[key] || 0) + 1;
          });

          const mostCommon = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0];
          if (mostCommon) {
            characteristics[key] = JSON.parse(mostCommon);
          }
        }
      }
    }

    return characteristics;
  }

  /**
   * Generate a segment name from criteria
   */
  private generateSegmentName(criteria: SegmentationCriteria): string {
    const parts = [criteria.attribute];

    if (criteria.operator === 'range') {
      parts.push(`${criteria.min ?? 0}-${criteria.max ?? 100}`);
    } else if (criteria.value !== undefined) {
      parts.push(String(criteria.value));
    }

    return parts.join(' ');
  }

  /**
   * Check if an attribute is a key attribute
   */
  private isKeyAttribute(key: string): boolean {
    const keyPatterns = [
      'age',
      'gender',
      'income',
      'level',
      'type',
      'philosophy',
      'preference',
      'concern',
      'habit',
      'status',
    ];

    return keyPatterns.some((pattern) => key.toLowerCase().includes(pattern));
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Create a default persona profiler
 */
export function createPersonaProfiler(): PersonaProfiler {
  return new DefaultPersonaProfiler();
}

/**
 * Analyze a profile
 */
export function analyzeProfile(profile: PersonaProfile): PersonaAnalysis {
  const profiler = new DefaultPersonaProfiler();
  return profiler.analyze(profile);
}

/**
 * Compare profiles
 */
export function compareProfiles(profiles: PersonaProfile[]): PersonaComparison {
  const profiler = new DefaultPersonaProfiler();
  return profiler.compare(profiles);
}
