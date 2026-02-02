/**
 * Pet Food Industry - Owner Agent
 * Simulates pet owner's decision-making process
 */

import type { OwnerProfile, Product } from '../../../../client/src/data/petFoodSimulation.js';
import type { OwnerSimulation } from '../../../../client/src/data/petFoodSimulation.js';

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

    return {
      personaId: owner.id,
      productId: product.id,
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
    };
  }

  private generateInitialReaction(owner: OwnerProfile, product: Product): string {
    const reactions: string[] = [];

    // Check feeding philosophy
    if (owner.feedingPhilosophy === '科学养宠') {
      if (product.proteinContent > 35) {
        reactions.push(`看到"${product.proteinContent}%蛋白质"眼前一亮`);
      }
      if (product.mainIngredients.some((i) => i.includes('鲜') || i.includes('三文鱼'))) {
        reactions.push('成分看起来很专业');
      }
    } else if (owner.feedingPhilosophy === '穷养') {
      if (product.price > 200) {
        reactions.push(`价格${product.price}元让我有点犹豫`);
      }
    } else if (owner.feedingPhilosophy === '精细养') {
      if (product.certifications.length > 0) {
        reactions.push(`有${product.certifications.join('、')}认证`);
      }
    }

    // Check concerns
    if (owner.concerns.includes('成分安全') && product.sellingPoints.some((s) => s.includes('无'))) {
      reactions.push('卖点符合我的关注点');
    }

    return reactions.join('，') + '。';
  }

  private evaluatePricePerception(owner: OwnerProfile, product: Product): OwnerSimulation['pricePerception'] {
    if (owner.feedingPhilosophy === '穷养') {
      if (product.price < 100) return '便宜';
      if (product.price > 200) return '太贵';
    }

    if (owner.feedingPhilosophy === '精细养' || owner.income === '高净值') {
      if (product.price < 200) return '便宜';
      if (product.price > 500) return '合理';
    }

    if (owner.feedingPhilosophy === '科学养宠') {
      if (product.price < 150) return '便宜';
      if (product.price < 300) return '合理';
      if (product.price < 400) return '偏贵';
      return '太贵';
    }

    if (owner.feedingPhilosophy === '跟风养') {
      if (product.price > 300) return '偏贵';
      if (product.price < 150) return '便宜';
    }

    return '合理';
  }

  private calculateTrustLevel(owner: OwnerProfile, product: Product): number {
    let trust = 50;

    // Brand
    if (product.brand === '萌宠优选') trust += 5;

    // Certifications
    trust += product.certifications.length * 10;

    // Selling points match concerns
    const matchingPoints = product.sellingPoints.filter((sp) =>
      owner.concerns.some((c) => sp.includes(c))
    );
    trust += matchingPoints.length * 5;

    // High protein
    if (product.proteinContent > 35) trust += 5;

    // Price alignment
    const pricePerception = this.evaluatePricePerception(owner, product);
    if (pricePerception === '合理') trust += 10;
    if (pricePerception === '便宜' || pricePerception === '太贵') trust -= 10;

    return Math.min(100, Math.max(0, trust));
  }

  private identifyIngredientConcerns(owner: OwnerProfile, product: Product): string[] {
    const concerns: string[] = [];

    if (owner.concerns.includes('成分安全')) {
      if (!product.certifications.includes('无谷认证') && product.carbContent > 30) {
        concerns.push('谷物含量可能较高');
      }
      if (!product.additives.includes('益生菌') && owner.feedingPhilosophy === '科学养宠') {
        concerns.push('没有看到益生菌添加');
      }
    }

    if (owner.concerns.includes('配方科学')) {
      if (product.proteinContent < 30) {
        concerns.push('蛋白质含量可能偏低');
      }
      if (product.fatContent > 20) {
        concerns.push('脂肪含量偏高');
      }
    }

    if (owner.feedingPhilosophy === '精细养' && owner.income === '高净值') {
      concerns.push('需要确认原料来源');
      concerns.push('需要第三方检测报告');
    }

    return concerns;
  }

  private determinePurchaseIntent(owner: OwnerProfile, product: Product): OwnerSimulation['purchaseIntent'] {
    const score = this.calculateIntentScore(owner, product);

    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private calculateIntentScore(owner: OwnerProfile, product: Product): number {
    let score = 50;

    // Price alignment
    const pricePerception = this.evaluatePricePerception(owner, product);
    if (pricePerception === '合理') score += 20;
    if (pricePerception === '便宜') score += 10;
    if (pricePerception === '偏贵') score -= 10;
    if (pricePerception === '太贵') score -= 30;

    // Feeding philosophy match
    if (owner.feedingPhilosophy === '科学养宠' && product.proteinContent > 35) {
      score += 15;
    }
    if (owner.feedingPhilosophy === '精细养' && product.certifications.length > 0) {
      score += 10;
    }

    // Concerns addressed
    const concernsAddressed = owner.concerns.filter((c) =>
      product.sellingPoints.some((sp) => sp.includes(c))
    );
    score += concernsAddressed.length * 5;

    // Trust level
    score += (this.calculateTrustLevel(owner, product) - 50) * 0.3;

    return Math.min(100, Math.max(0, score));
  }

  private extractKeyConsiderations(owner: OwnerProfile, product: Product): string[] {
    const considerations: string[] = [];

    if (owner.feedingPhilosophy === '科学养宠') {
      if (product.proteinContent > 35) {
        considerations.push(`蛋白含量${product.proteinContent}%符合期望`);
      }
      if (product.sellingPoints.some((s) => s.includes('无谷'))) {
        considerations.push('无谷配方对消化友好');
      }
      if (product.additives.includes('益生菌')) {
        considerations.push('益生菌可能改善肠道健康');
      }
    }

    if (owner.concerns.includes('成分安全')) {
      if (product.certifications.length > 0) {
        considerations.push(`有${product.certifications.join('、')}认证`);
      }
    }

    if (owner.feedingPhilosophy === '精细养') {
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
    if (pricePerception === '偏贵' || pricePerception === '太贵') {
      objections.push('价格超出了预算');
    }

    // Uncertainty
    if (owner.feedingPhilosophy === '科学养宠') {
      objections.push('不确定${product.targetPet === "猫" ? "猫咪" : "狗狗"}是否会爱吃');
    }
    if (owner.feedingPhilosophy === '精细养') {
      objections.push('没有看到第三方检测报告');
    }

    // Ingredient concerns
    if (owner.concerns.includes('成分安全') && !product.mainIngredients.some((i) => i.includes('鲜'))) {
      objections.push('主要成分不够明确');
    }

    // Brand
    if (product.brand !== '知名品牌' && owner.feedingPhilosophy === '跟风养') {
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
    if (pricePerception === '偏贵' || pricePerception === '太贵') {
      triggers.push('如果有促销活动');
    }

    // Professional endorsement
    if (owner.feedingPhilosophy === '精细养' || owner.feedingPhilosophy === '科学养宠') {
      triggers.push('如果有兽医推荐');
    }

    // Peer feedback
    if (owner.feedingPhilosophy === '跟风养') {
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
    if (intent === 'high') {
      behaviors.push('口碑好会购买试吃装');
    } else if (intent === 'medium') {
      behaviors.push('会先研究再决定');
    } else {
      behaviors.push('大概率不会购买');
    }

    return behaviors.join('，');
  }

  private identifySocialProofNeeds(owner: OwnerProfile): string[] {
    const needs: string[] = [];

    if (owner.feedingPhilosophy === '科学养宠') {
      needs.push('成分党测评');
    }

    if (owner.feedingPhilosophy === '精细养') {
      needs.push('兽医推荐');
      needs.push('临床数据');
    }

    if (owner.feedingPhilosophy === '跟风养') {
      needs.push('熟人口碑');
      needs.push('KOL推荐');
    }

    if (owner.feedingPhilosophy === '科学养宠' || owner.feedingPhilosophy === '精细养') {
      needs.push('同品种用户反馈');
    }

    return needs;
  }
}

/**
 * Create owner agent instance
 */
export function createOwnerAgent(): OwnerAgent {
  return new OwnerAgent();
}
