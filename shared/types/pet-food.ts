/**
 * Pet Food Industry Types
 * Shared type definitions for pet food simulation
 */

// =============================================================================
// Pet Food Profile Types
// =============================================================================

/** 宠物主人画像 */
export interface OwnerProfile {
  id: string;
  name: string;
  age: number;
  gender: "男" | "女";
  city: string;
  occupation: string;
  income: "低" | "中" | "高" | "高净值";
  feedingPhilosophy: "科学养宠" | "穷养" | "跟风养" | "精细养";
  purchaseChannel: string[];
  priceRange: string;
  concerns: string[];
  socialPlatform: string[];
}

/** 宠物画像 */
export interface PetProfile {
  id: string;
  name: string;
  species: "猫" | "狗";
  breed: string;
  age: number;
  weight: number;
  healthStatus: string[];
  allergies: string[];
  eatingHabit: "挑食" | "正常" | "贪吃";
  digestiveSystem: "敏感" | "正常" | "强健";
  activityLevel: "低" | "中" | "高";
  currentFood: string;
}

/** 人宠组合画像 */
export interface DualPersona {
  id: string;
  owner: OwnerProfile;
  pet: PetProfile;
  matchScore: number;
  relationship: string;
  feedingScenario: string;
  emotionalBond: string;
}

/** 产品定义 */
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  weight: string;
  targetPet: "猫" | "狗" | "通用";
  mainIngredients: string[];
  proteinContent: number;
  fatContent: number;
  carbContent: number;
  additives: string[];
  sellingPoints: string[];
  packaging: string;
  certifications: string[];
}

// =============================================================================
// Simulation Result Types
// =============================================================================

/** Owner Agent 模拟结果 */
export interface OwnerSimulation {
  personaId: string;
  productId: string;
  profile: OwnerProfile;
  product: Product;
  initialReaction: string;
  pricePerception: {
    score: number;
    feedback: string;
    level: "便宜" | "合理" | "偏贵" | "太贵";
  };
  trustLevel: {
    score: number;
    factors: string[];
  };
  ingredientConcerns: string[];
  purchaseIntent: "high" | "medium" | "low";
  intentScore: number;
  keyConsiderations: string[];
  objections: string[];
  triggerPoints: string[];
  predictedBehavior: string;
  socialProofNeeds: string[];
  finalDecision: "购买" | "不购买" | "考虑中";
  confidence: number;
  reasoning: string[];
}

/** Pet Agent 模拟结果 */
export interface PetSimulation {
  personaId: string;
  productId: string;
  profile: PetProfile;
  product: Product;
  smellAttraction: number;
  tasteAcceptance: number;
  digestiveRisk: "low" | "medium" | "high";
  expectedBehavior: string;
  physiologicalReaction: string;
  tastePreference: {
    score: number;
    factors: string[];
  };
  digestiveReaction: string;
  healthImpact: string;
  acceptance: "喜欢" | "不喜欢" | "中立";
  confidence: number;
}

/** 双视角模拟结果 */
export interface DualSimulationResult {
  dualPersona: DualPersona;
  product: Product;
  ownerSimulation: OwnerSimulation;
  petSimulation: PetSimulation;
  combinedDecision: "强烈推荐" | "推荐" | "中立" | "不推荐";
  recommendationReason: string[];
  matchScore: number;
}

// =============================================================================
// Constants
// =============================================================================

/** 喂养哲学类型 */
export const FEEDING_PHILOSOPHY_TYPES = [
  "科学养宠",
  "穷养",
  "跟风养",
  "精细养",
] as const;

/** 宠物种类 */
export const PET_SPECIES = ["猫", "狗", "通用"] as const;

/** 收入水平 */
export const INCOME_LEVELS = ["低", "中", "高", "高净值"] as const;

/** 决策类型 */
export const DECISION_TYPES = ["购买", "不购买", "考虑中"] as const;

/** 接受度 */
export const ACCEPTANCE_TYPES = ["喜欢", "不喜欢", "中立"] as const;
