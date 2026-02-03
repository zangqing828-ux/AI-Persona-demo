/**
 * Pet Food Industry - Pet Agent
 * Simulates pet's physiological response to food
 */

import type { PetProfile, Product, PetSimulation } from '../../../../shared/types/pet-food.js';
import {
  PROTEIN,
  FAT,
  CARB,
  DIGESTIVE_RISK,
  ACCEPTANCE,
  TASTE_ACCEPTANCE,
  SMELL_ATTRACTION,
  CONFIDENCE_SCORE,
  INGREDIENT_KEYWORDS,
} from '../constants.js';

/**
 * Pet Agent simulation logic
 */
export class PetAgent {
  /**
   * Simulate pet's reaction to a product
   */
  simulate(pet: PetProfile, product: Product): PetSimulation {
    const smellAttraction = this.calculateSmellAttraction(pet, product);
    const tasteAcceptance = this.calculateTasteAcceptance(pet, product);
    const digestiveRisk = this.assessDigestiveRisk(pet, product);
    const expectedBehavior = this.predictBehavior(pet, product);
    const confidence = this.calculateConfidence(pet, product);

    return {
      personaId: pet.id,
      productId: product.id,
      profile: pet,
      product: product,
      smellAttraction,
      tasteAcceptance,
      digestiveRisk,
      expectedBehavior,
      physiologicalReaction: this.predictPhysiologicalResponse(pet, product),
      tastePreference: {
        score: tasteAcceptance,
        factors: this.getTastePreferenceFactors(pet, product)
      },
      digestiveReaction: this.predictPhysiologicalResponse(pet, product),
      healthImpact: this.assessHealthImpact(pet, product),
      acceptance: this.determineAcceptance(tasteAcceptance, digestiveRisk),
      confidence,
    };
  }

  private calculateSmellAttraction(pet: PetProfile, product: Product): number {
    let attraction = SMELL_ATTRACTION.BASE;

    // Species match
    if (product.targetPet === pet.species) {
      attraction += SMELL_ATTRACTION.SPECIES_MATCH_BONUS;
    }

    // High protein = more attractive
    if (product.proteinContent > PROTEIN.HIGH) {
      attraction += SMELL_ATTRACTION.HIGH_PROTEIN_BONUS;
    }

    // Fresh ingredients
    if (product.mainIngredients.some((i) => i.includes(INGREDIENT_KEYWORDS.FRESH) || i.includes(INGREDIENT_KEYWORDS.SALMON))) {
      attraction += SMELL_ATTRACTION.FRESH_MEAT_BONUS;
    }

    // Eating habit
    if (pet.eatingHabit === '贪吃') {
      attraction += 10;
    } else if (pet.eatingHabit === '挑食') {
      attraction -= 5;
    }

    // Age factor
    if (pet.age > 7) {
      attraction -= 5; // Older pets have reduced smell
    }

    return Math.min(SMELL_ATTRACTION.MAX, Math.max(SMELL_ATTRACTION.MIN, attraction));
  }

  private calculateTasteAcceptance(pet: PetProfile, product: Product): number {
    let acceptance = TASTE_ACCEPTANCE.BASE;

    // Species match
    if (product.targetPet === pet.species) {
      acceptance += 10;
    }

    // Eating habit
    if (pet.eatingHabit === '贪吃') {
      acceptance += 15;
    } else if (pet.eatingHabit === '挑食') {
      acceptance -= 10;
    }

    // High quality ingredients
    if (product.mainIngredients.some((i) => i.includes(INGREDIENT_KEYWORDS.FRESH) || i.includes('肉'))) {
      acceptance += 10;
    }

    // Fat content (tasty but may be unhealthy)
    if (product.fatContent > FAT.MEDIUM) {
      acceptance += 5;
    }

    // Digestive system
    if (pet.digestiveSystem === '敏感' && product.carbContent > CARB.HIGH) {
      acceptance -= 5;
    }

    return Math.min(TASTE_ACCEPTANCE.MAX, Math.max(TASTE_ACCEPTANCE.MIN, acceptance));
  }

  private assessDigestiveRisk(pet: PetProfile, product: Product): PetSimulation['digestiveRisk'] {
    let riskScore = 0;

    // Allergies
    const hasAllergen = product.mainIngredients.some((ingredient) =>
      pet.allergies.some((allergy) => ingredient.includes(allergy))
    );
    if (hasAllergen) {
      riskScore += 30;
    }

    // Digestive system
    if (pet.digestiveSystem === '敏感') {
      // High carb
      if (product.carbContent > CARB.HIGH) {
        riskScore += 15;
      }
      // High fat
      if (product.fatContent > 18) {
        riskScore += 10;
      }
      // Grains
      if (product.mainIngredients.some((i) => ['小麦', '玉米', '大米'].includes(i))) {
        riskScore += 20;
      }
    } else if (pet.digestiveSystem === '强健') {
      riskScore = Math.max(0, riskScore - 10);
    }

    // Health status
    if (pet.healthStatus.includes('玻璃胃')) {
      if (product.carbContent > CARB.HIGH || product.fatContent > 18) {
        riskScore += 15;
      }
    }

    if (pet.healthStatus.includes('老年')) {
      riskScore += 5;
    }

    // Age factor
    if (pet.age > 10) {
      riskScore += 5;
    }

    // Mitigating factors
    if (product.additives.includes(INGREDIENT_KEYWORDS.PROBIOTICS)) {
      riskScore -= 10;
    }
    if (product.sellingPoints.some((s) => s.includes('低敏'))) {
      riskScore -= 10;
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    if (riskScore >= 50) return DIGESTIVE_RISK.HIGH;
    if (riskScore >= 25) return DIGESTIVE_RISK.MEDIUM;
    return DIGESTIVE_RISK.LOW;
  }

  private predictBehavior(pet: PetProfile, product: Product): string {
    const behaviors: string[] = [];
    const smell = this.calculateSmellAttraction(pet, product);
    const taste = this.calculateTasteAcceptance(pet, product);

    // Initial reaction
    if (smell > 75) {
      behaviors.push('开袋时会兴奋地跑过来');
    } else if (smell > TASTE_ACCEPTANCE.MEDIUM_THRESHOLD) {
      behaviors.push('会过来闻一闻');
    } else {
      behaviors.push('可能会犹豫一下');
    }

    // Eating behavior
    if (pet.eatingHabit === '贪吃') {
      behaviors.push('会大口吃完');
    } else if (pet.eatingHabit === '挑食') {
      if (taste > TASTE_ACCEPTANCE.HIGH_THRESHOLD) {
        behaviors.push('会小口试探后慢慢吃完');
      } else {
        behaviors.push('可能会挑挑拣拣');
      }
    } else {
      behaviors.push('会正常进食');
    }

    // Health factors
    if (pet.healthStatus.includes('牙齿问题')) {
      behaviors.push('但可能需要泡软');
    }

    if (pet.activityLevel === '低') {
      behaviors.push('吃完后会休息');
    } else if (pet.activityLevel === '高') {
      behaviors.push('吃完后可能还会讨要更多');
    }

    return behaviors.join('，');
  }

  private predictPhysiologicalResponse(pet: PetProfile, product: Product): string {
    const responses: string[] = [];
    const digestiveRisk = this.assessDigestiveRisk(pet, product);

    // Digestive system response
    if (digestiveRisk === DIGESTIVE_RISK.LOW) {
      if (pet.species === '猫') {
        responses.push('由于高蛋白配方符合猫咪天性');
      }
      if (pet.digestiveSystem === '敏感' && product.sellingPoints.some((s) => s.includes('无谷'))) {
        responses.push('无谷配方减少了消化负担');
      }
      if (product.additives.includes(INGREDIENT_KEYWORDS.PROBIOTICS)) {
        responses.push('益生菌有助于改善肠道环境');
      }
      responses.push('预计便便成型良好');
    } else if (digestiveRisk === DIGESTIVE_RISK.MEDIUM) {
      responses.push('需要观察便便状态');
      if (pet.digestiveSystem === '敏感') {
        responses.push('建议7-10天缓慢换粮');
      }
    } else {
      responses.push('可能引起消化不适');
      responses.push('建议谨慎换粮或咨询兽医');
    }

    // Health status specific
    if (pet.healthStatus.includes('玻璃胃') && digestiveRisk === DIGESTIVE_RISK.LOW) {
      responses.push('对玻璃胃较为友好');
    }

    if (pet.healthStatus.includes('关节问题') && product.additives.includes(INGREDIENT_KEYWORDS.GLUCOSAMINE)) {
      responses.push('氨糖软骨素需要长期食用才能看到关节改善');
    }

    if (pet.healthStatus.includes('泪痕') && product.additives.includes('Omega-3')) {
      responses.push('Omega-3可能改善泪痕');
    }

    // Overall
    if (pet.digestiveSystem === '强健') {
      responses.push('健康的消化系统能很好适应');
    }

    return responses.join('，');
  }

  private calculateConfidence(pet: PetProfile, product: Product): number {
    let confidence = CONFIDENCE_SCORE.BASE;

    // Species match
    if (product.targetPet === pet.species) {
      confidence += CONFIDENCE_SCORE.SPECIES_MATCH_BONUS;
    }

    // Low digestive risk
    const digestiveRisk = this.assessDigestiveRisk(pet, product);
    if (digestiveRisk === DIGESTIVE_RISK.LOW) {
      confidence += CONFIDENCE_SCORE.LOW_RISK_BONUS;
    } else if (digestiveRisk === DIGESTIVE_RISK.HIGH) {
      confidence += CONFIDENCE_SCORE.HIGH_RISK_PENALTY;
    }

    // High acceptance
    const acceptance = this.determineAcceptance(this.calculateTasteAcceptance(pet, product), digestiveRisk);
    if (acceptance === ACCEPTANCE.LIKE) {
      confidence += CONFIDENCE_SCORE.LIKE_BONUS;
    } else if (acceptance === ACCEPTANCE.DISLIKE) {
      confidence += CONFIDENCE_SCORE.DISLIKE_PENALTY;
    }

    // Health considerations
    if (pet.healthStatus.includes('玻璃胃') && product.sellingPoints.some(s => s.includes('低敏'))) {
      confidence += CONFIDENCE_SCORE.HEALTH_CONSIDERATION_BONUS;
    }

    return Math.min(CONFIDENCE_SCORE.MAX, Math.max(CONFIDENCE_SCORE.MIN, confidence));
  }

  private getTastePreferenceFactors(pet: PetProfile, product: Product): string[] {
    const factors: string[] = [];

    // Species-specific preferences
    if (product.targetPet === pet.species) {
      factors.push(`专为${pet.species}设计`);
    }

    // High protein
    if (product.proteinContent > PROTEIN.HIGH) {
      factors.push('高蛋白含量');
    }

    // Fresh ingredients
    if (product.mainIngredients.some(i => i.includes(INGREDIENT_KEYWORDS.FRESH) || i.includes('肉'))) {
      factors.push('新鲜肉类原料');
    }

    // Fat content
    if (product.fatContent > FAT.MEDIUM && pet.eatingHabit === '贪吃') {
      factors.push('脂肪含量适中');
    }

    // No allergens
    const hasAllergen = product.mainIngredients.some(ingredient =>
      pet.allergies.some(allergy => ingredient.includes(allergy))
    );
    if (!hasAllergen) {
      factors.push('不含已知过敏源');
    }

    return factors;
  }

  private determineAcceptance(tasteAcceptance: number, digestiveRisk: "low" | "medium" | "high"): "喜欢" | "不喜欢" | "中立" {
    if (digestiveRisk === DIGESTIVE_RISK.HIGH) return ACCEPTANCE.DISLIKE;
    if (tasteAcceptance >= TASTE_ACCEPTANCE.HIGH_THRESHOLD) return ACCEPTANCE.LIKE;
    if (tasteAcceptance >= TASTE_ACCEPTANCE.MEDIUM_THRESHOLD) return ACCEPTANCE.NEUTRAL;
    return ACCEPTANCE.DISLIKE;
  }

  private assessHealthImpact(pet: PetProfile, product: Product): string {
    const impacts: string[] = [];

    // Protein benefits
    if (product.proteinContent > PROTEIN.MEDIUM) {
      if (pet.species === '猫' || pet.activityLevel === '高') {
        impacts.push('蛋白质充足，支持肌肉发育');
      }
    }

    // Fat considerations
    if (product.fatContent > FAT.HIGH && pet.healthStatus.includes('肥胖')) {
      impacts.push('脂肪含量偏高，需要注意控制喂食量');
    }

    // Digestive health
    if (product.additives.includes(INGREDIENT_KEYWORDS.PROBIOTICS)) {
      impacts.push('益生菌有助于改善肠道健康');
    }

    // Age-specific benefits
    if (pet.age > 7 && product.additives.includes(INGREDIENT_KEYWORDS.GLUCOSAMINE)) {
      impacts.push('关节养护成分适合老年宠物');
    }

    // Allergen concerns
    const hasAllergen = product.mainIngredients.some(ingredient =>
      pet.allergies.some(allergy => ingredient.includes(allergy))
    );
    if (hasAllergen) {
      impacts.push('可能引起过敏反应');
    }

    return impacts.length > 0 ? impacts.join('，') : '整体影响中性';
  }
}

/**
 * Create pet agent instance
 */
export function createPetAgent(): PetAgent {
  return new PetAgent();
}