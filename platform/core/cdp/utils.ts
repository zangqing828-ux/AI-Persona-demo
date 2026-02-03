/**
 * CDP Utilities
 * Helper functions for audience selection and tagging
 */

import type {
  AudienceProfile,
  AudienceSegment,
  CDPTag,
  ProfileTaggingResult,
  SegmentAnalysis,
  SegmentCharacteristics,
  SegmentOverlap,
  TagCondition,
  TagMatchResult,
  TagOperator,
} from './types.js';

// =============================================================================
// Tag Matching
// =============================================================================

/**
 * Check if a profile matches a tag condition
 * @throws {Error} If condition is invalid (missing required fields)
 */
export function matchesCondition(
  profile: AudienceProfile,
  condition: TagCondition
): boolean {
  // Input validation
  if (!condition.attribute) {
    throw new Error('TagCondition is missing required field: attribute');
  }
  if (!condition.operator) {
    throw new Error('TagCondition is missing required field: operator');
  }

  const value = profile.attributes[condition.attribute];

  // Handle missing attribute values
  if (value === undefined) {
    return false;
  }

  // Type guards for number values
  const isNumber = (v: unknown): v is number => typeof v === 'number' && !isNaN(v);

  switch (condition.operator) {
    case 'equals':
      return value === condition.value;

    case 'not-equals':
      return value !== condition.value;

    case 'contains':
      if (Array.isArray(value)) {
        return value.includes(condition.value);
      }
      if (typeof value === 'string') {
        return value.includes(condition.value as string);
      }
      return false;

    case 'not-contains':
      if (Array.isArray(value)) {
        return !value.includes(condition.value);
      }
      if (typeof value === 'string') {
        return !value.includes(condition.value as string);
      }
      return true;

    case 'greater-than':
      if (isNumber(value) && isNumber(condition.value)) {
        return value > condition.value;
      }
      return false;

    case 'less-than':
      if (isNumber(value) && isNumber(condition.value)) {
        return value < condition.value;
      }
      return false;

    case 'between':
      if (
        isNumber(value) &&
        isNumber(condition.min) &&
        isNumber(condition.max)
      ) {
        return value >= condition.min && value <= condition.max;
      }
      return false;

    case 'in':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(value);
      }
      return false;

    case 'not-in':
      if (Array.isArray(condition.value)) {
        return !condition.value.includes(value);
      }
      return true;

    default:
      return false;
  }
}

/**
 * Check if a profile matches a tag
 */
export function matchesTag(profile: AudienceProfile, tag: CDPTag): TagMatchResult {
  if (!tag.conditions || tag.conditions.length === 0) {
    return {
      tagId: tag.id,
      tagName: tag.name,
      matched: false,
      confidence: 0,
      reason: 'No conditions defined for tag',
    };
  }

  let matchedCount = 0;
  const totalConditions = tag.conditions.length;

  for (const condition of tag.conditions) {
    if (matchesCondition(profile, condition)) {
      matchedCount++;
    }
  }

  const matched = matchedCount === totalConditions;
  const confidence = Math.round((matchedCount / totalConditions) * 100);

  return {
    tagId: tag.id,
    tagName: tag.name,
    matched,
    confidence,
    reason: matched
      ? `Matched ${matchedCount}/${totalConditions} conditions`
      : `Only matched ${matchedCount}/${totalConditions} conditions`,
  };
}

/**
 * Tag a profile with multiple tags
 */
export function tagProfile(profile: AudienceProfile, tags: CDPTag[]): ProfileTaggingResult {
  const matches: TagMatchResult[] = [];
  const matchedTags: string[] = [];
  const unmatchedTags: string[] = [];

  for (const tag of tags) {
    const matchResult = matchesTag(profile, tag);
    matches.push(matchResult);

    if (matchResult.matched) {
      matchedTags.push(tag.id);
    } else {
      unmatchedTags.push(tag.id);
    }
  }

  const coverage = tags.length > 0 ? Math.round((matchedTags.length / tags.length) * 100) : 0;

  return {
    profileId: profile.id,
    matches,
    matchedTags,
    unmatchedTags,
    coverage,
  };
}

// =============================================================================
// Segment Operations
// =============================================================================

/**
 * Get profiles that belong to a segment
 */
export function getSegmentProfiles(
  segment: AudienceSegment,
  profiles: AudienceProfile[]
): AudienceProfile[] {
  return profiles.filter((profile) =>
    segment.tags.every((tagId) => profile.tags.includes(tagId))
  );
}

/**
 * Calculate segment characteristics
 */
export function calculateSegmentCharacteristics(
  segment: AudienceSegment,
  profiles: AudienceProfile[]
): SegmentCharacteristics {
  const segmentProfiles = getSegmentProfiles(segment, profiles);

  const commonAttributes: Record<string, { value: unknown; frequency: number }[]> = {};
  const uniqueAttributes: string[] = [];
  const averageValues: Record<string, number> = {};

  // Find common attributes
  for (const profile of segmentProfiles) {
    for (const [key, value] of Object.entries(profile.attributes)) {
      if (!commonAttributes[key]) {
        commonAttributes[key] = [];
      }

      const existing = commonAttributes[key].find((item) => item.value === value);
      if (existing) {
        existing.frequency++;
      } else {
        commonAttributes[key].push({ value, frequency: 1 });
      }
    }
  }

  // Filter for common attributes (appear in >50% of profiles)
  const threshold = Math.max(1, Math.floor(segmentProfiles.length * 0.5));
  for (const [key, values] of Object.entries(commonAttributes)) {
    commonAttributes[key] = values.filter((v) => v.frequency >= threshold);
    if (commonAttributes[key].length === 0) {
      delete commonAttributes[key];
    }
  }

  // Find unique attributes (only in this segment)
  // This would require comparing with other segments - simplified for now

  // Calculate average values for numeric attributes
  for (const [key, values] of Object.entries(commonAttributes)) {
    const numericValues = values
      .map((v) => v.value)
      .filter((v): v is number => typeof v === 'number');

    if (numericValues.length > 0) {
      const sum = numericValues.reduce((acc, v) => acc + v, 0);
      averageValues[key] = Math.round(sum / numericValues.length);
    }
  }

  return {
    commonAttributes,
    uniqueAttributes,
    averageValues,
  };
}

/**
 * Calculate overlap between two segments
 */
export function calculateSegmentOverlap(
  segment1: AudienceSegment,
  segment2: AudienceSegment,
  profiles: AudienceProfile[]
): SegmentOverlap {
  const profiles1 = new Set(getSegmentProfiles(segment1, profiles).map((p) => p.id));
  const profiles2 = new Set(getSegmentProfiles(segment2, profiles).map((p) => p.id));

  const intersection = new Set([...profiles1].filter((id) => profiles2.has(id)));
  const union = new Set([...profiles1, ...profiles2]);

  const overlapSize = intersection.size;
  const overlapPercentage =
    profiles1.size > 0 ? Math.round((overlapSize / profiles1.size) * 100) : 0;
  const jaccardIndex = union.size > 0 ? intersection.size / union.size : 0;

  return {
    segmentId: segment2.id,
    segmentName: segment2.name,
    overlapSize,
    overlapPercentage,
    jaccardIndex: Math.round(jaccardIndex * 1000) / 1000,
  };
}

/**
 * Analyze a segment
 */
export function analyzeSegment(
  segment: AudienceSegment,
  allSegments: AudienceSegment[],
  profiles: AudienceProfile[]
): SegmentAnalysis {
  const segmentProfiles = getSegmentProfiles(segment, profiles);
  const size = segmentProfiles.length;
  const percentage =
    profiles.length > 0 ? Math.round((size / profiles.length) * 100) : 0;

  const characteristics = calculateSegmentCharacteristics(segment, profiles);

  const overlaps = allSegments
    .filter((s) => s.id !== segment.id)
    .map((s) => calculateSegmentOverlap(segment, s, profiles));

  return {
    segmentId: segment.id,
    segmentName: segment.name,
    size,
    percentage,
    characteristics,
    overlaps,
  };
}

// =============================================================================
// Audience Builder
// =============================================================================

/**
 * Build segments from tag combinations
 */
export function buildSegmentsFromTags(
  tagCombinations: string[][],
  existingSegments: AudienceSegment[],
  profiles: AudienceProfile[]
): AudienceSegment[] {
  const segments: AudienceSegment[] = [];
  let segmentCounter = 0;

  for (const combination of tagCombinations) {
    // Check if this combination already exists
    const exists = existingSegments.some(
      (s) =>
        s.tags.length === combination.length &&
        s.tags.every((t) => combination.includes(t))
    );

    if (exists) continue;

    // Create new segment
    const segment: AudienceSegment = {
      id: `segment_${segmentCounter++}`,
      name: `Segment ${combination.join(' + ')}`,
      tags: combination,
      actualSize: profiles.filter((p) =>
        combination.every((tagId) => p.tags.includes(tagId))
      ).length,
    };

    segments.push(segment);
  }

  return segments;
}

/**
 * Estimate segment size before applying
 */
export function estimateSegmentSize(
  tags: string[],
  profiles: AudienceProfile[]
): number {
  return profiles.filter((p) => tags.every((tagId) => p.tags.includes(tagId))).length;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get all tags from a list of profiles
 */
export function getProfileTags(profiles: AudienceProfile[]): Set<string> {
  const tags = new Set<string>();
  for (const profile of profiles) {
    for (const tag of profile.tags) {
      tags.add(tag);
    }
  }
  return tags;
}

/**
 * Sort segments by size
 */
export function sortSegmentsBySize(segments: AudienceSegment[]): AudienceSegment[] {
  return [...segments].sort((a, b) => (b.actualSize ?? 0) - (a.actualSize ?? 0));
}

/**
 * Find duplicate segments
 */
export function findDuplicateSegments(segments: AudienceSegment[]): AudienceSegment[][] {
  const duplicates: AudienceSegment[][] = [];
  const processed = new Set<string>();

  for (let i = 0; i < segments.length; i++) {
    if (processed.has(segments[i].id)) continue;

    const similar = [segments[i]];

    for (let j = i + 1; j < segments.length; j++) {
      if (processed.has(segments[j].id)) continue;

      const tags1 = new Set(segments[i].tags);
      const tags2 = new Set(segments[j].tags);

      if (
        tags1.size === tags2.size &&
        [...tags1].every((tag) => tags2.has(tag))
      ) {
        similar.push(segments[j]);
        processed.add(segments[j].id);
      }
    }

    if (similar.length > 1) {
      duplicates.push(similar);
    }

    processed.add(segments[i].id);
  }

  return duplicates;
}
