/**
 * CDP (Customer Data Platform) Types
 * Generic audience selection and segmentation types
 */

import type { JsonValue } from '../../shared/types/platform.js';

// =============================================================================
// CDP Tag
// =============================================================================

export interface CDPTag {
  id: string;
  name: string;
  category: string;
  description?: string;
  color?: string;
  conditions?: TagCondition[];
  metadata?: Record<string, JsonValue>;
}

export interface TagCondition {
  attribute: string;
  operator: TagOperator;
  value?: JsonValue;
  min?: number;
  max?: number;
}

export type TagOperator = 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than' | 'between' | 'in' | 'not-in';

// =============================================================================
// Audience Segment
// =============================================================================

export interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  tags: string[]; // Tag IDs
  criteria?: SegmentCriteria;
  estimatedSize?: number;
  actualSize?: number;
  metadata?: Record<string, JsonValue>;
}

export interface SegmentCriteria {
  operator: 'and' | 'or';
  conditions: TagCondition[];
}

// =============================================================================
// Audience Selector
// =============================================================================

export interface AudienceSelectorConfig {
  availableTags: CDPTag[];
  selectedTags: string[];
  maxSegments?: number;
  allowCustomTags?: boolean;
}

export interface AudienceSelection {
  segments: AudienceSegment[];
  totalProfiles: number;
  coverage: number; // 0-100 percentage
  overlap: number; // 0-100 percentage of overlap between segments
}

// =============================================================================
// Audience Profile
// =============================================================================

export interface AudienceProfile {
  id: string;
  attributes: Record<string, JsonValue>;
  tags: string[]; // Tag IDs that match this profile
  segments: string[]; // Segment IDs this profile belongs to
  lastUpdated: Date;
}

// =============================================================================
// Tag Matching
// =============================================================================

export interface TagMatchResult {
  tagId: string;
  tagName: string;
  matched: boolean;
  confidence: number; // 0-100
  reason?: string;
}

export interface ProfileTaggingResult {
  profileId: string;
  matches: TagMatchResult[];
  matchedTags: string[];
  unmatchedTags: string[];
  coverage: number; // Percentage of tags that matched
}

// =============================================================================
// Segment Analysis
// =============================================================================

export interface SegmentAnalysis {
  segmentId: string;
  segmentName: string;
  size: number;
  percentage: number; // Of total population
  characteristics: SegmentCharacteristics;
  overlaps: SegmentOverlap[];
}

export interface SegmentCharacteristics {
  commonAttributes: Record<string, { value: JsonValue; frequency: number }[]>;
  uniqueAttributes: string[];
  averageValues: Record<string, number>;
}

export interface SegmentOverlap {
  segmentId: string;
  segmentName: string;
  overlapSize: number;
  overlapPercentage: number; // Of this segment's size
  jaccardIndex: number; // 0-1 similarity index
}

// =============================================================================
// Batch Tagging
// =============================================================================

export interface BatchTaggingConfig {
  profiles: AudienceProfile[];
  tags: CDPTag[];
  onProgress?: (progress: number, total: number) => void;
}

export interface BatchTaggingResult {
  results: ProfileTaggingResult[];
  summary: {
    totalProfiles: number;
    totalTags: number;
    averageCoverage: number;
    mostCommonTags: Array<{ tagId: string; tagName: string; count: number }>;
    leastCommonTags: Array<{ tagId: string; tagName: string; count: number }>;
  };
}

// =============================================================================
// Audience Builder
// =============================================================================

export interface AudienceBuilderConfig {
  basePopulation: AudienceProfile[];
  availableTags: CDPTag[];
  existingSegments?: AudienceSegment[];
}

export interface AudienceBuildStrategy {
  name: string;
  description: string;
  tagCombinations: string[][]; // Arrays of tag IDs to combine
  minSegmentSize?: number;
  maxSegments?: number;
}

export interface AudienceBuildResult {
  segments: AudienceSegment[];
  coverage: number; // Percentage of base population covered
  duplicates: number; // Number of duplicate segments found
  recommendations: string[];
}
