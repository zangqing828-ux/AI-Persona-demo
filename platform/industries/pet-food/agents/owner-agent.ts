/**
 * Pet Food Industry - Owner Agent
 * Simulates pet owner's decision-making process
 */

import type { OwnerProfile, Product, OwnerSimulation } from '../../../../shared/types/pet-food.js';
import * as CONSTANTS from '../constants.js';

/**
 * Owner Agent simulation logic
 */
export class OwnerAgent {
  /**
   * Simulate owner's reaction to a product
   */
  simulate(owner: OwnerProfile, product: Product): OwnerSimulation {
    const initialReaction = this.generateInitialReaction(owner, product);
    const pricePerception = this.evaluatePricePerception(owner, product);
    const trustLevel = this.calculateTrustLevel(owner, product);
    const ingredientConcerns = this.identifyIngredientConcerns(owner, product);
    const purchaseIntent = this.determinePurchaseIntent(owner, product);
    const intentScore = this.calculateIntentScore(owner, product);
    const keyConsiderations = this.extractKeyConsiderations(owner, product);
    const objections = this.identifyObjections(owner, product);
    const triggerPoints = this.identifyTriggerPoints(owner, product);
    const predictedBehavior = this.predictBehavior(owner, product);
    const socialProofNeeds = this.identifySocialProofNeeds(owner);
    const finalDecision = this.determineFinalDecision(owner, product);
    const reasoning = this.generateReasoning(owner, product);

    return {
      personaId: owner.id,
      productId: product.id,
      profile: owner,
      product: product,
      initialReaction,
      pricePerception,
      trustLevel,
      ingredientConcerns,
      purchaseIntent,
      intentScore,
      keyConsiderations,
      objections,
      triggerPoints,
      predictedBehavior,
      socialProofNeeds,
      finalDecision,
      confidence: intentScore,
      reasoning,
    };
  }

  private generateInitialReaction(owner: OwnerProfile, product: Product): string {
    const reactions: string[] = [];

    // Check feeding philosophy
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
      if (product.proteinContent > CONSTANTS.PROTEIN.HIGH) {
        reactions.push(`看到"${product.proteinContent}%蛋白质"眼前一亮`);
      }
      if (product.mainIngredients.some((i) => i.includes(CONSTANTS.INGREDIENT_KEYWORDS.FRESH) || i.includes(CONSTANTS.INGREDIENT_KEYWORDS.SALMON))) {
        reactions.push('成分看起来很专业');
      }
    } else if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.BUDGET) {
      if (product.price > CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.BUDGET.PRICE_EXPENSIVE) {
        reactions.push(`价格${product.price}元让我有点犹豫`);
      }
    } else if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM) {
      if (product.certifications.length > 0) {
        reactions.push(`有${product.certifications.join('、')}认证`);
      }
    }

    // Check concerns
    if (owner.concerns.includes(CONSTANTS.CONCERNS.INGREDIENT_SAFETY) && product.sellingPoints.some((s) => s.includes(CONSTANTS.INGREDIENT_KEYWORDS.NO_GRAIN))) {
      reactions.push('卖点符合我的关注点');
    }

    return reactions.join('，') + '。';
  }

  private evaluatePricePerception(owner: OwnerProfile, product: Product): OwnerSimulation['pricePerception'] {
    let level: typeof CONSTANTS.PRICE_PERCEPTION[keyof typeof CONSTANTS.PRICE_PERCEPTION];
    let feedback = '';

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.BUDGET) {
      if (product.price < CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.BUDGET.PRICE_CHEAP) {
        level = CONSTANTS.PRICE_PERCEPTION.CHEAP;
        feedback = '价格很实惠，符合预算';
      } else if (product.price > CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.BUDGET.PRICE_EXPENSIVE) {
        level = CONSTANTS.PRICE_PERCEPTION.TOO_EXPENSIVE;
        feedback = '价格超出预算太多';
      } else {
        level = CONSTANTS.PRICE_PERCEPTION.REASONABLE;
        feedback = '价格在可接受范围内';
      }
    } else if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM || owner.income === CONSTANTS.INCOME_LEVEL.HIGH_NET_WORTH) {
      if (product.price < CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.PREMIUM.PRICE_CHEAP) {
        level = CONSTANTS.PRICE_PERCEPTION.CHEAP;
        feedback = '性价比不错';
      } else if (product.price > CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.PREMIUM.PRICE_REASONABLE) {
        level = CONSTANTS.PRICE_PERCEPTION.REASONABLE;
        feedback = '价格符合高端定位';
      } else {
        level = CONSTANTS.PRICE_PERCEPTION.REASONABLE;
        feedback = '价格合理，品质保证';
      }
    } else if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
      if (product.price < CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.SCIENTIFIC.PRICE_CHEAP) {
        level = CONSTANTS.PRICE_PERCEPTION.CHEAP;
        feedback = '价格亲民，营养可能不够全面';
      } else if (product.price < CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.SCIENTIFIC.PRICE_REASONABLE) {
        level = CONSTANTS.PRICE_PERCEPTION.REASONABLE;
        feedback = '价格适中，营养配比合理';
      } else if (product.price < CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.SCIENTIFIC.PRICE_EXPENSIVE) {
        level = CONSTANTS.PRICE_PERCEPTION.EXPENSIVE;
        feedback = '价格偏高，但营养配置更全面';
      } else {
        level = CONSTANTS.PRICE_PERCEPTION.TOO_EXPENSIVE;
        feedback = '价格过高，性价比不足';
      }
    } else if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.FOLLOWER) {
      if (product.price > CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.FOLLOWER.PRICE_EXPENSIVE) {
        level = CONSTANTS.PRICE_PERCEPTION.EXPENSIVE;
        feedback = '价格偏高，需要更多证明';
      } else if (product.price < CONSTANTS.FEEDING_PHILOSOPHY_THRESHOLDS.FOLLOWER.PRICE_CHEAP) {
        level = CONSTANTS.PRICE_PERCEPTION.CHEAP;
        feedback = '价格实惠，但担心品质';
      } else {
        level = CONSTANTS.PRICE_PERCEPTION.REASONABLE;
        feedback = '价格适中，可以尝试';
      }
    } else {
      level = CONSTANTS.PRICE_PERCEPTION.REASONABLE;
      feedback = '价格在预期范围内';
    }

    return {
      score: level === CONSTANTS.PRICE_PERCEPTION.CHEAP ? 80 : level === CONSTANTS.PRICE_PERCEPTION.REASONABLE ? 60 : level === CONSTANTS.PRICE_PERCEPTION.EXPENSIVE ? 40 : 20,
      feedback,
      level
    };
  }

  private calculateTrustLevel(owner: OwnerProfile, product: Product): OwnerSimulation['trustLevel'] {
    let trust: number = CONSTANTS.TRUST_SCORE.BASE;
    const factors: string[] = [];

    // Brand
    if (product.brand === CONSTANTS.BRANDS.MENG_CHO) {
      trust += CONSTANTS.TRUST_SCORE.BRAND_BONUS;
      factors.push('品牌信任度高');
    }

    // Certifications
    if (product.certifications.length > 0) {
      trust += product.certifications.length * CONSTANTS.TRUST_SCORE.CERTIFICATION_BONUS;
      factors.push(`有${product.certifications.join('、')}认证`);
    }

    // Selling points match concerns (optimized O(n*m) → O(n) using Set)
    const concernSet = new Set(owner.concerns);
    const matchingPoints = product.sellingPoints.filter((sp) =>
      concernSet.has(sp) || owner.concerns.some((c) => sp.includes(c))
    );
    trust += matchingPoints.length * CONSTANTS.TRUST_SCORE.SELLING_POINT_MATCH_BONUS;
    matchingPoints.forEach(point => factors.push(`卖点${point}符合我的关注点`));

    // High protein
    if (product.proteinContent > CONSTANTS.PROTEIN.HIGH) {
      trust += CONSTANTS.TRUST_SCORE.HIGH_PROTEIN_BONUS;
      factors.push('蛋白质含量高');
    }

    // Price alignment
    const pricePerception = this.evaluatePricePerception(owner, product);
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.REASONABLE) {
      trust += CONSTANTS.TRUST_SCORE.PRICE_ALIGNMENT_BONUS;
      factors.push('价格合理');
    } else if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.CHEAP || pricePerception.level === CONSTANTS.PRICE_PERCEPTION.TOO_EXPENSIVE) {
      trust += CONSTANTS.TRUST_SCORE.PRICE_MISALIGNMENT_PENALTY;
      factors.push('价格不理想');
    }

    // Add trust factors based on feeding philosophy
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC && product.proteinContent > CONSTANTS.PROTEIN.HIGH) {
      factors.push('高蛋白配方科学');
    }
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM && product.certifications.length > 0) {
      factors.push('认证产品有保障');
    }

    trust = Math.min(CONSTANTS.TRUST_SCORE.MAX, Math.max(CONSTANTS.TRUST_SCORE.MIN, trust));

    return {
      score: trust,
      factors
    };
  }

  private identifyIngredientConcerns(owner: OwnerProfile, product: Product): string[] {
    const concerns: string[] = [];

    if (owner.concerns.includes(CONSTANTS.CONCERNS.INGREDIENT_SAFETY)) {
      if (!product.certifications.includes(CONSTANTS.CERTIFICATIONS.NO_GRAIN) && product.carbContent > CONSTANTS.CARB.HIGH) {
        concerns.push('谷物含量可能较高');
      }
      if (!product.additives.includes(CONSTANTS.INGREDIENT_KEYWORDS.PROBIOTICS) && owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
        concerns.push('没有看到益生菌添加');
      }
    }

    if (owner.concerns.includes(CONSTANTS.CONCERNS.FORMULA_SCIENTIFIC)) {
      if (product.proteinContent < CONSTANTS.PROTEIN.MEDIUM) {
        concerns.push('蛋白质含量可能偏低');
      }
      if (product.fatContent > CONSTANTS.FAT.HIGH) {
        concerns.push('脂肪含量偏高');
      }
    }

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM && owner.income === CONSTANTS.INCOME_LEVEL.HIGH_NET_WORTH) {
      concerns.push('需要确认原料来源');
      concerns.push('需要第三方检测报告');
    }

    return concerns;
  }

  private determinePurchaseIntent(owner: OwnerProfile, product: Product): OwnerSimulation['purchaseIntent'] {
    const score = this.calculateIntentScore(owner, product);

    if (score >= CONSTANTS.INTENT_SCORE.HIGH_THRESHOLD) return CONSTANTS.PURCHASE_INTENT.HIGH;
    if (score >= CONSTANTS.INTENT_SCORE.MEDIUM_THRESHOLD) return CONSTANTS.PURCHASE_INTENT.MEDIUM;
    return CONSTANTS.PURCHASE_INTENT.LOW;
  }

  private calculateIntentScore(owner: OwnerProfile, product: Product): number {
    let score = CONSTANTS.TRUST_SCORE.BASE;

    // Price alignment
    const pricePerception = this.evaluatePricePerception(owner, product);
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.REASONABLE) score += 20;
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.CHEAP) score += 10;
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.EXPENSIVE) score -= 10;
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.TOO_EXPENSIVE) score -= 30;

    // Feeding philosophy match
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC && product.proteinContent > CONSTANTS.PROTEIN.HIGH) {
      score += 15;
    }
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM && product.certifications.length > 0) {
      score += 10;
    }

    // Concerns addressed
    const concernsAddressed = owner.concerns.filter((c) =>
      product.sellingPoints.some((sp) => sp.includes(c))
    );
    score += concernsAddressed.length * 5;

    // Trust level
    score += (this.calculateTrustLevel(owner, product).score - CONSTANTS.TRUST_SCORE.BASE) * 0.3;

    return Math.min(CONSTANTS.INTENT_SCORE.MAX, Math.max(CONSTANTS.INTENT_SCORE.MIN, score));
  }

  private extractKeyConsiderations(owner: OwnerProfile, product: Product): string[] {
    const considerations: string[] = [];

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
      if (product.proteinContent > CONSTANTS.PROTEIN.HIGH) {
        considerations.push(`蛋白含量${product.proteinContent}%符合期望`);
      }
      if (product.sellingPoints.some((s) => s.includes(CONSTANTS.INGREDIENT_KEYWORDS.NO_GRAIN))) {
        considerations.push('无谷配方对消化友好');
      }
      if (product.additives.includes(CONSTANTS.INGREDIENT_KEYWORDS.PROBIOTICS)) {
        considerations.push('益生菌可能改善肠道健康');
      }
    }

    if (owner.concerns.includes(CONSTANTS.CONCERNS.INGREDIENT_SAFETY)) {
      if (product.certifications.length > 0) {
        considerations.push(`有${product.certifications.join('、')}认证`);
      }
    }

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM) {
      if (product.mainIngredients.length > 0) {
        considerations.push(`主要成分: ${product.mainIngredients.slice(0, 3).join('、')}`);
      }
    }

    return considerations;
  }

  private identifyObjections(owner: OwnerProfile, product: Product): string[] {
    const objections: string[] = [];

    // Price objections
    const pricePerception = this.evaluatePricePerception(owner, product);
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.EXPENSIVE || pricePerception.level === CONSTANTS.PRICE_PERCEPTION.TOO_EXPENSIVE) {
      objections.push('价格超出了预算');
    }

    // Uncertainty
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
      objections.push(`不确定${product.targetPet === "猫" ? "猫咪" : "狗狗"}是否会爱吃`);
    }
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM) {
      objections.push('没有看到第三方检测报告');
    }

    // Ingredient concerns
    if (owner.concerns.includes(CONSTANTS.CONCERNS.INGREDIENT_SAFETY) && !product.mainIngredients.some((i) => i.includes(CONSTANTS.INGREDIENT_KEYWORDS.FRESH))) {
      objections.push('主要成分不够明确');
    }

    // Brand
    if (product.brand !== CONSTANTS.BRANDS.MENG_CHO && owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.FOLLOWER) {
      objections.push('品牌不熟悉');
    }

    return objections;
  }

  private identifyTriggerPoints(owner: OwnerProfile, product: Product): string[] {
    const triggers: string[] = [];
    const pricePerception = this.evaluatePricePerception(owner, product);

    // Social proof
    if (owner.socialPlatform.includes('小红书')) {
      triggers.push('如果有小红书成分党的详细测评');
    }
    if (owner.socialPlatform.includes('知乎')) {
      triggers.push('如果有知乎专业分析');
    }

    // Trial
    triggers.push('如果有试吃装可以先测试适口性');

    // Promotion
    if (pricePerception.level === CONSTANTS.PRICE_PERCEPTION.EXPENSIVE || pricePerception.level === CONSTANTS.PRICE_PERCEPTION.TOO_EXPENSIVE) {
      triggers.push('如果有促销活动');
    }

    // Professional endorsement
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM || owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
      triggers.push('如果有兽医推荐');
    }

    // Peer feedback
    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.FOLLOWER) {
      triggers.push('如果有邻居家宠物用过效果好');
    }

    return triggers;
  }

  private predictBehavior(owner: OwnerProfile, product: Product): string {
    const behaviors: string[] = [];

    // Research behavior
    if (owner.socialPlatform.includes('小红书')) {
      behaviors.push('会在小红书搜索测评');
    }
    if (owner.socialPlatform.includes('知乎')) {
      behaviors.push('会在知乎查看专业分析');
    }
    if (owner.socialPlatform.includes('抖音')) {
      behaviors.push('会在抖音看视频测评');
    }

    // Purchase decision
    const intent = this.determinePurchaseIntent(owner, product);
    if (intent === CONSTANTS.PURCHASE_INTENT.HIGH) {
      behaviors.push('口碑好会购买试吃装');
    } else if (intent === CONSTANTS.PURCHASE_INTENT.MEDIUM) {
      behaviors.push('会先研究再决定');
    } else {
      behaviors.push('大概率不会购买');
    }

    return behaviors.join('，');
  }

  private identifySocialProofNeeds(owner: OwnerProfile): string[] {
    const needs: string[] = [];

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC) {
      needs.push('成分党测评');
    }

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM) {
      needs.push('兽医推荐');
      needs.push('临床数据');
    }

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.FOLLOWER) {
      needs.push('熟人口碑');
      needs.push('KOL推荐');
    }

    if (owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.SCIENTIFIC || owner.feedingPhilosophy === CONSTANTS.FEEDING_PHILOSOPHY.PREMIUM) {
      needs.push('同品种用户反馈');
    }

    return needs;
  }

  private determineFinalDecision(owner: OwnerProfile, product: Product): typeof CONSTANTS.FINAL_DECISION[keyof typeof CONSTANTS.FINAL_DECISION] {
    const intentScore = this.calculateIntentScore(owner, product);
    const trustScore = this.calculateTrustLevel(owner, product).score;
    const hasMajorConcerns = this.identifyObjections(owner, product).length > CONSTANTS.DECISION_THRESHOLDS.MAX_CONCERNS_FOR_BUY;

    if (intentScore >= CONSTANTS.DECISION_THRESHOLDS.BUY_MIN_SCORE && trustScore >= CONSTANTS.DECISION_THRESHOLDS.MIN_TRUST_FOR_BUY && !hasMajorConcerns) {
      return CONSTANTS.FINAL_DECISION.BUY;
    } else if (intentScore < CONSTANTS.DECISION_THRESHOLDS.NOT_BUY_MAX_SCORE || trustScore < CONSTANTS.DECISION_THRESHOLDS.MIN_TRUST_FOR_BUY || hasMajorConcerns) {
      return CONSTANTS.FINAL_DECISION.NOT_BUY;
    } else {
      return CONSTANTS.FINAL_DECISION.CONSIDER;
    }
  }

  private generateReasoning(owner: OwnerProfile, product: Product): string[] {
    const reasoning: string[] = [];

    // Price consideration
    const pricePerception = this.evaluatePricePerception(owner, product);
    reasoning.push(`价格${product.price}元，${pricePerception.feedback}`);

    // Trust factors
    const trustFactors = this.calculateTrustLevel(owner, product).factors;
    reasoning.push('信任因素：' + trustFactors.slice(0, 3).join('、'));

    // Concerns
    const concerns = this.identifyIngredientConcerns(owner, product);
    if (concerns.length > 0) {
      reasoning.push('担忧：' + concerns.join('、'));
    }

    // Positive considerations
    const considerations = this.extractKeyConsiderations(owner, product);
    if (considerations.length > 0) {
      reasoning.push('考虑因素：' + considerations.slice(0, 3).join('、'));
    }

    // Final decision based on intent
    const intentScore = this.calculateIntentScore(owner, product);
    if (intentScore >= CONSTANTS.INTENT_SCORE.HIGH_THRESHOLD) {
      reasoning.push('购买意向较高，愿意尝试');
    } else if (intentScore >= CONSTANTS.INTENT_SCORE.MEDIUM_THRESHOLD) {
      reasoning.push('需要更多信息和考虑');
    } else {
      reasoning.push('购买意向较低，暂不考虑');
    }

    return reasoning;
  }
}

/**
 * Create owner agent instance
 */
export function createOwnerAgent(): OwnerAgent {
  return new OwnerAgent();
}
