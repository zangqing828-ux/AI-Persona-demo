/**
 * Pet Food Industry - Product Data
 * Test products for simulation
 */

import type { Product } from '../../../../client/src/data/petFoodSimulation.js';

/** 待测产品 */
export const testProducts: Product[] = [
  {
    id: 'PROD001',
    name: '鲜萃高蛋白全价猫粮',
    brand: '萌宠优选',
    category: '全价猫粮',
    price: 268,
    weight: '1.5kg',
    targetPet: '猫',
    mainIngredients: ['鲜鸡肉', '三文鱼', '鸡肝', '鸡蛋'],
    proteinContent: 42,
    fatContent: 18,
    carbContent: 25,
    additives: ['牛磺酸', '益生菌', 'Omega-3'],
    sellingPoints: ['75%动物蛋白', '无谷配方', '添加益生菌'],
    packaging: '可重封铝箔袋',
    certifications: ['AAFCO认证', '无谷认证'],
  },
  {
    id: 'PROD002',
    name: '关节养护成犬粮',
    brand: '萌宠优选',
    category: '功能犬粮',
    price: 328,
    weight: '2kg',
    targetPet: '狗',
    mainIngredients: ['鸭肉', '三文鱼', '甘薯', '豌豆'],
    proteinContent: 28,
    fatContent: 15,
    carbContent: 40,
    additives: ['氨糖', '软骨素', 'MSM', '鱼油'],
    sellingPoints: ['关节养护配方', '低敏蛋白源', '添加氨糖软骨素'],
    packaging: '拉链自封袋',
    certifications: ['AAFCO认证'],
  },
];
