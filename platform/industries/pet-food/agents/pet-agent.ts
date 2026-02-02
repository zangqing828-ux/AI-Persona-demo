/**
 * Pet Food Industry - Pet Agent
 * Simulates pet's physiological response to food
 */

import type { PetProfile, Product } from '../../../../client/src/data/petFoodSimulation.js';
import type { PetSimulation } from '../../../../client/src/data/petFoodSimulation.js';

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
    const physiologicalResponse = this.predictPhysiologicalResponse(pet, product);
    const longTermSuitability = this.assessLongTermSuitability(pet, product);
    const riskFactors = this.identifyRiskFactors(pet, product);
    const positiveFactors = this.identifyPositiveFactors(pet, product);

    return {
      personaId: pet.id,
      productId: product.id,
      smellAttraction,
      tasteAcceptance,
      digestiveRisk,
      expectedBehavior,
      physiologicalResponse,
      longTermSuitability,
      riskFactors,
      positiveFactors,
    };
  }

  private calculateSmellAttraction(pet: PetProfile, product: Product): number {
    let attraction = 60; // Base attraction

    // Species match
    if (product.targetPet === pet.species) {
      attraction += 15;
    }

    // High protein = more attractive
    if (product.proteinContent > 35) {
      attraction += 10;
    }

    // Fresh ingredients
    if (product.mainIngredients.some((i) => i.includes('鲜') || i.includes('三文鱼'))) {
      attraction += 10;
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

    return Math.min(100, Math.max(0, attraction));
  }

  private calculateTasteAcceptance(pet: PetProfile, product: Product): number {
    let acceptance = 70; // Base acceptance

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
    if (product.mainIngredients.some((i) => i.includes('鲜') || i.includes('肉'))) {
      acceptance += 10;
    }

    // Fat content (tasty but may be unhealthy)
    if (product.fatContent > 15) {
      acceptance += 5;
    }

    // Digestive system
    if (pet.digestiveSystem === '敏感' && product.carbContent > 30) {
      acceptance -= 5;
    }

    return Math.min(100, Math.max(0, acceptance));
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
      if (product.carbContent > 35) {
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
      if (product.carbContent > 30 || product.fatContent > 18) {
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
    if (product.additives.includes('益生菌')) {
      riskScore -= 10;
    }
    if (product.sellingPoints.some((s) => s.includes('低敏'))) {
      riskScore -= 10;
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    if (riskScore >= 50) return 'high';
    if (riskScore >= 25) return 'medium';
    return 'low';
  }

  private predictBehavior(pet: PetProfile, product: Product): string {
    const behaviors: string[] = [];
    const smell = this.calculateSmellAttraction(pet, product);
    const taste = this.calculateTasteAcceptance(pet, product);

    // Initial reaction
    if (smell > 75) {
      behaviors.push('开袋时会兴奋地跑过来');
    } else if (smell > 60) {
      behaviors.push('会过来闻一闻');
    } else {
      behaviors.push('可能会犹豫一下');
    }

    // Eating behavior
    if (pet.eatingHabit === '贪吃') {
      behaviors.push('会大口吃完');
    } else if (pet.eatingHabit === '挑食') {
      if (taste > 70) {
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
    if (digestiveRisk === 'low') {
      if (pet.species === '猫') {
        responses.push('由于高蛋白配方符合猫咪天性');
      }
      if (pet.digestiveSystem === '敏感' && product.sellingPoints.some((s) => s.includes('无谷'))) {
        responses.push('无谷配方减少了消化负担');
      }
      if (product.additives.includes('益生菌')) {
        responses.push('益生菌有助于改善肠道环境');
      }
      responses.push('预计便便成型良好');
    } else if (digestiveRisk === 'medium') {
      responses.push('需要观察便便状态');
      if (pet.digestiveSystem === '敏感') {
        responses.push('建议7-10天缓慢换粮');
      }
    } else {
      responses.push('可能引起消化不适');
      responses.push('建议谨慎换粮或咨询兽医');
    }

    // Health status specific
    if (pet.healthStatus.includes('玻璃胃') && digestiveRisk === 'low') {
      responses.push('对玻璃胃较为友好');
    }

    if (pet.healthStatus.includes('关节问题') && product.additives.includes('氨糖')) {
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

  private assessLongTermSuitability(pet: PetProfile, product: Product): string {
    const digestiveRisk = this.assessDigestiveRisk(pet, product);
    const smell = this.calculateSmellAttraction(pet, product);
    const taste = this.calculateTasteAcceptance(pet, product);

    if (digestiveRisk === 'high') {
      return '不建议长期食用，存在健康风险';
    }

    if (digestiveRisk === 'medium') {
      return '可以长期食用但需要密切观察，可能需要调整喂食量';
    }

    const assessments: string[] = [];

    if (smell > 75 && taste > 75) {
      assessments.push('适口性优秀，宠物爱吃');
    } else if (smell > 60 && taste > 60) {
      assessments.push('适口性良好，大部分宠物会接受');
    }

    if (product.proteinContent > 35) {
      if (pet.species === '猫') {
        assessments.push('高蛋白配方符合猫咪生理需求');
      } else if (pet.species === '狗' && pet.activityLevel === '高') {
        assessments.push('高蛋白满足活跃狗狗需求');
      }
    }

    if (pet.healthStatus.includes('关节问题') && product.additives.includes('氨糖')) {
      assessments.push('关节养护功能适合老年宠物');
    }

    if (pet.healthStatus.includes('肥胖') && product.fatContent > 18) {
      assessments.push('但需要注意控制体重');
    }

    if (assessments.length === 0) {
      return '适合长期食用，营养配方均衡';
    }

    return assessments.join('，') + '，适合长期食用。';
  }

  private identifyRiskFactors(pet: PetProfile, product: Product): string[] {
    const risks: string[] = [];

    // Allergy risk
    const allergen = product.mainIngredients.find((ingredient) =>
      pet.allergies.some((allergy) => ingredient.includes(allergy))
    );
    if (allergen) {
      risks.push(`含过敏源${allergen}`);
    }

    // Digestive risk
    if (pet.digestiveSystem === '敏感') {
      if (product.carbContent > 30) {
        risks.push('碳水含量较高');
      }
      if (product.fatContent > 18) {
        risks.push('脂肪含量较高');
      }
      if (product.mainIngredients.some((i) => ['小麦', '玉米', '大米'].includes(i))) {
        risks.push('含谷物成分');
      }
    }

    // Health status risks
    if (pet.healthStatus.includes('肥胖') && product.fatContent > 18) {
      risks.push('脂肪含量不利于减肥');
    }

    if (pet.healthStatus.includes('牙齿问题') && !product.sellingPoints.some((s) => s.includes('小颗粒'))) {
      risks.push('颗粒可能较硬，老年宠物咀嚼困难');
    }

    // Transition risk
    if (pet.digestiveSystem === '敏感' || pet.age > 7) {
      risks.push('换粮需要7-10天过渡期');
    }

    // Eating habit
    if (pet.eatingHabit === '挑食' && product.proteinContent < 30) {
      risks.push('蛋白含量可能不够吸引挑食的宠物');
    }

    return risks;
  }

  private identifyPositiveFactors(pet: PetProfile, product: Product): string[] {
    const positives: string[] = [];

    // Species match
    if (product.targetPet === pet.species) {
      positives.push('配方针对该物种设计');
    }

    // High protein
    if (product.proteinContent > 35) {
      if (pet.species === '猫') {
        positives.push('高动物蛋白符合猫咪天性');
      } else if (pet.activityLevel === '高') {
        positives.push('高蛋白满足活跃需求');
      }
    }

    // Grain free
    if (product.sellingPoints.some((s) => s.includes('无谷'))) {
      if (pet.digestiveSystem === '敏感' || pet.healthStatus.includes('玻璃胃')) {
        positives.push('无谷物减少消化负担');
      }
    }

    // Additives
    if (product.additives.includes('益生菌')) {
      positives.push('益生菌改善肠道环境');
    }
    if (product.additives.includes('Omega-3')) {
      positives.push('Omega-3有益皮肤和毛发');
    }
    if (product.additives.includes('氨糖') || product.additives.includes('软骨素')) {
      if (pet.healthStatus.includes('关节问题') || pet.age > 5) {
        positives.push('关节养护成分');
      }
    }

    // Fresh ingredients
    if (product.mainIngredients.some((i) => i.includes('鲜'))) {
      positives.push('新鲜肉类原料');
    }

    // Digestive system
    if (pet.digestiveSystem === '强健') {
      positives.push('健康的消化系统能很好适应各种配方');
    }

    // Certifications
    if (product.certifications.length > 0) {
      positives.push(`有${product.certifications.join('、')}认证`);
    }

    return positives;
  }
}

/**
 * Create pet agent instance
 */
export function createPetAgent(): PetAgent {
  return new PetAgent();
}
