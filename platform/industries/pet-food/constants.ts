/**
 * Pet Food Industry - Domain Constants
 * Centralized constants to eliminate hardcoded values and magic numbers
 */

// =============================================================================
// Attribute Names (for data access)
// =============================================================================

export const ATTRIBUTES = {
  FEEDING_PHILOSOPHY: 'feedingPhilosophy',
  CONCERNS: 'concerns',
  INCOME: 'income',
  PURCHASE_CHANNEL: 'purchaseChannel',
  PRICE_RANGE: 'priceRange',
} as const;

// =============================================================================
// Feeding Philosophy Types
// =============================================================================

export const FEEDING_PHILOSOPHY = {
  SCIENTIFIC: '科学养宠',
  BUDGET: '穷养',
  FOLLOWER: '跟风养',
  PREMIUM: '精细养',
} as const;

export type FeedingPhilosophyType = typeof FEEDING_PHILOSOPHY[keyof typeof FEEDING_PHILOSOPHY];

// =============================================================================
// Feeding Philosophy Thresholds
// =============================================================================

export const FEEDING_PHILOSOPHY_THRESHOLDS = {
  SCIENTIFIC: {
    PROTEIN_HIGH: 35,
    PRICE_CHEAP: 150,
    PRICE_REASONABLE: 300,
    PRICE_EXPENSIVE: 400,
  },
  BUDGET: {
    PRICE_CHEAP: 100,
    PRICE_EXPENSIVE: 200,
  },
  PREMIUM: {
    PRICE_CHEAP: 200,
    PRICE_REASONABLE: 500,
  },
  FOLLOWER: {
    PRICE_CHEAP: 150,
    PRICE_EXPENSIVE: 300,
  },
} as const;

// =============================================================================
// Trust Score Calculation
// =============================================================================

export const TRUST_SCORE = {
  BASE: 50,
  BRAND_BONUS: 5,
  CERTIFICATION_BONUS: 10,
  SELLING_POINT_MATCH_BONUS: 5,
  HIGH_PROTEIN_BONUS: 5,
  PRICE_ALIGNMENT_BONUS: 10,
  PRICE_MISALIGNMENT_PENALTY: -10,
  MIN: 0,
  MAX: 100,
} as const;

// =============================================================================
// Protein Content Thresholds
// =============================================================================

export const PROTEIN = {
  HIGH: 35,
  MEDIUM: 30,
  LOW: 20,
} as const;

// =============================================================================
// Fat Content Thresholds
// =============================================================================

export const FAT = {
  HIGH: 20,
  MEDIUM: 15,
  LOW: 10,
} as const;

// =============================================================================
// Carbohydrate Content Thresholds
// =============================================================================

export const CARB = {
  HIGH: 30,
  MEDIUM: 25,
  LOW: 20,
} as const;

// =============================================================================
// Price Perception Levels
// =============================================================================

export const PRICE_PERCEPTION = {
  CHEAP: '便宜',
  REASONABLE: '合理',
  EXPENSIVE: '偏贵',
  TOO_EXPENSIVE: '太贵',
} as const;

export type PricePerceptionLevel = typeof PRICE_PERCEPTION[keyof typeof PRICE_PERCEPTION];

// =============================================================================
// Purchase Intent Levels
// =============================================================================

export const PURCHASE_INTENT = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type PurchaseIntentLevel = typeof PURCHASE_INTENT[keyof typeof PURCHASE_INTENT];

// =============================================================================
// Intent Score Thresholds
// =============================================================================

export const INTENT_SCORE = {
  HIGH_THRESHOLD: 70,
  MEDIUM_THRESHOLD: 40,
  MIN: 0,
  MAX: 100,
} as const;

// =============================================================================
// Digestive Risk Levels
// =============================================================================

export const DIGESTIVE_RISK = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type DigestiveRiskLevel = typeof DIGESTIVE_RISK[keyof typeof DIGESTIVE_RISK];

// =============================================================================
// Pet Acceptance Levels
// =============================================================================

export const ACCEPTANCE = {
  LIKE: '喜欢',
  DISLIKE: '不喜欢',
  NEUTRAL: '中立',
} as const;

export type AcceptanceLevel = typeof ACCEPTANCE[keyof typeof ACCEPTANCE];

// =============================================================================
// Taste Acceptance Thresholds
// =============================================================================

export const TASTE_ACCEPTANCE = {
  BASE: 60,
  HIGH_THRESHOLD: 80,
  MEDIUM_THRESHOLD: 60,
  SPECIES_MATCH_BONUS: 15,
  PREFERRED_FOOD_BONUS: 10,
  HIGH_PROTEIN_BONUS: 10,
  FRESH_INGREDIENT_BONUS: 8,
  PREFERRED_TEXTURE_BONUS: 5,
  MIN: 0,
  MAX: 100,
} as const;

// =============================================================================
// Smell Attraction Thresholds
// =============================================================================

export const SMELL_ATTRACTION = {
  BASE: 60,
  HIGH_PROTEIN_BONUS: 15,
  FRESH_MEAT_BONUS: 10,
  SPECIES_MATCH_BONUS: 10,
  PREFERRED_BRAND_BONUS: 5,
  MIN: 0,
  MAX: 100,
} as const;

// =============================================================================
// Confidence Score Thresholds
// =============================================================================

export const CONFIDENCE_SCORE = {
  BASE: 70,
  SPECIES_MATCH_BONUS: 15,
  LOW_RISK_BONUS: 15,
  HIGH_RISK_PENALTY: -20,
  LIKE_BONUS: 10,
  DISLIKE_PENALTY: -15,
  HEALTH_CONSIDERATION_BONUS: 10,
  MIN: 0,
  MAX: 100,
} as const;

// =============================================================================
// Decision Thresholds
// =============================================================================

export const DECISION_THRESHOLDS = {
  BUY_MIN_SCORE: 70,
  NOT_BUY_MAX_SCORE: 40,
  MAX_CONCERNS_FOR_BUY: 2,
  MIN_TRUST_FOR_BUY: 60,
} as const;

// =============================================================================
// Final Decision Types
// =============================================================================

export const FINAL_DECISION = {
  BUY: '购买',
  NOT_BUY: '不购买',
  CONSIDER: '考虑中',
} as const;

export type FinalDecisionType = typeof FINAL_DECISION[keyof typeof FINAL_DECISION];

// =============================================================================
// Income Levels
// =============================================================================

export const INCOME_LEVEL = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  HIGH_NET_WORTH: '高净值',
} as const;

export type IncomeLevelType = typeof INCOME_LEVEL[keyof typeof INCOME_LEVEL];

// =============================================================================
// Concern Keywords
// =============================================================================

export const CONCERNS = {
  INGREDIENT_SAFETY: '成分安全',
  FORMULA_SCIENTIFIC: '配方科学',
} as const;

// =============================================================================
// Ingredient Keywords
// =============================================================================

export const INGREDIENT_KEYWORDS = {
  FRESH: '鲜',
  SALMON: '三文鱼',
  NO_GRAIN: '无谷',
  PROBIOTICS: '益生菌',
  GLUCOSAMINE: '氨糖',
  CHONDROITIN: '软骨素',
} as const;

// =============================================================================
// Brand Names
// =============================================================================

export const BRANDS = {
  MENG_CHO: '萌宠优选',
} as const;

// =============================================================================
// Certification Names
// =============================================================================

export const CERTIFICATIONS = {
  AAFCO: 'AAFCO认证',
  NO_GRAIN: '无谷认证',
} as const;
