/**
 * Pet Food Industry Configuration
 * Complete industry configuration for pet food simulation platform
 */

import { z } from 'zod';
import type { IndustryConfig } from '../../../shared/types/industry.js';
import type { JsonValue } from '../../../shared/types/platform.js';

// =============================================================================
// Pet Food Schemas
// =============================================================================

export const ownerProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(['男', '女']),
  city: z.string(),
  occupation: z.string(),
  income: z.enum(['低', '中', '高', '高净值']),
  feedingPhilosophy: z.enum(['科学养宠', '穷养', '跟风养', '精细养']),
  purchaseChannel: z.array(z.string()),
  priceRange: z.string(),
  concerns: z.array(z.string()),
  socialPlatform: z.array(z.string()),
});

export const petProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: z.enum(['猫', '狗']),
  breed: z.string(),
  age: z.number(),
  weight: z.number(),
  healthStatus: z.array(z.string()),
  allergies: z.array(z.string()),
  eatingHabit: z.enum(['挑食', '正常', '贪吃']),
  digestiveSystem: z.enum(['敏感', '正常', '强健']),
  activityLevel: z.enum(['低', '中', '高']),
  currentFood: z.string(),
});

export const dualPersonaSchema = z.object({
  id: z.string(),
  owner: ownerProfileSchema,
  pet: petProfileSchema,
  relationship: z.string(),
  feedingScenario: z.string(),
  emotionalBond: z.string(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  price: z.number(),
  weight: z.string(),
  targetPet: z.enum(['猫', '狗', '通用']),
  mainIngredients: z.array(z.string()),
  proteinContent: z.number(),
  fatContent: z.number(),
  carbContent: z.number(),
  additives: z.array(z.string()),
  sellingPoints: z.array(z.string()),
  packaging: z.string(),
  certifications: z.array(z.string()),
});

export const ownerSimulationSchema = z.object({
  personaId: z.string(),
  productId: z.string(),
  initialReaction: z.string(),
  pricePerception: z.enum(['便宜', '合理', '偏贵', '太贵']),
  trustLevel: z.number(),
  ingredientConcerns: z.array(z.string()),
  purchaseIntent: z.enum(['high', 'medium', 'low']),
  intentScore: z.number(),
  keyConsiderations: z.array(z.string()),
  objections: z.array(z.string()),
  triggerPoints: z.array(z.string()),
  predictedBehavior: z.string(),
  socialProofNeeds: z.array(z.string()),
});

export const petSimulationSchema = z.object({
  personaId: z.string(),
  productId: z.string(),
  smellAttraction: z.number(),
  tasteAcceptance: z.number(),
  digestiveRisk: z.enum(['low', 'medium', 'high']),
  expectedBehavior: z.string(),
  physiologicalResponse: z.string(),
  longTermSuitability: z.string(),
  riskFactors: z.array(z.string()),
  positiveFactors: z.array(z.string()),
});

export const interactionAnalysisSchema = z.object({
  personaId: z.string(),
  productId: z.string(),
  scenario: z.enum(['surprise', 'satisfaction', 'disappointment', 'rejection']),
  scenarioDescription: z.string(),
  repurchaseRate: z.number(),
  npsScore: z.number(),
  churnRisk: z.enum(['low', 'medium', 'high']),
  keyInsight: z.string(),
  recommendation: z.string(),
});

export const feedingScriptSchema = z.object({
  personaId: z.string(),
  productId: z.string(),
  scenes: z.array(
    z.object({
      action: z.string(),
      petReaction: z.string(),
      ownerEmotion: z.string(),
      dialogue: z.string().optional(),
    })
  ),
  overallMood: z.string(),
  marketingInsight: z.string(),
});

// =============================================================================
// Pet Food Industry Config
// =============================================================================

export const petFoodIndustryConfig: IndustryConfig = {
  // Basic metadata
  id: 'pet-food',
  name: '宠物食品',
  description: 'AI消费者模拟平台 - 宠物食品行业版',
  version: '1.0.0',

  // Persona types: Owner + Pet dual perspective
  personaTypes: [
    {
      id: 'owner',
      name: '主人',
      icon: 'User',
      color: 'text-blue-500',
      profileSchema: ownerProfileSchema,
      generation: {
        sampleSize: 5,
        attributes: [
          { id: 'name', name: '姓名', type: 'string' },
          { id: 'age', name: '年龄', type: 'range', min: 18, max: 70 },
          { id: 'gender', name: '性别', type: 'enum', options: ['男', '女'] },
          { id: 'city', name: '城市', type: 'string' },
          { id: 'occupation', name: '职业', type: 'string' },
          {
            id: 'income',
            name: '收入水平',
            type: 'enum',
            options: ['低', '中', '高', '高净值'],
          },
          {
            id: 'feedingPhilosophy',
            name: '养宠理念',
            type: 'enum',
            options: ['科学养宠', '穷养', '跟风养', '精细养'],
          },
          {
            id: 'purchaseChannel',
            name: '购买渠道',
            type: 'multi-enum',
            options: ['天猫', '京东', '拼多多', '淘宝', '小红书', '抖音', '宠物店', '宠物医院', '进口超市'],
          },
          { id: 'priceRange', name: '预算范围', type: 'string' },
          {
            id: 'concerns',
            name: '关注点',
            type: 'multi-enum',
            options: ['成分安全', '营养配比', '品牌口碑', '价格', '适口性', '进口品质', '配方科学', '成分透明'],
          },
          {
            id: 'socialPlatform',
            name: '常用平台',
            type: 'multi-enum',
            options: ['小红书', '微博', '抖音', 'B站', '知乎', '微信'],
          },
        ],
      },
      canSimulate: true,
      canBeInterviewed: true,
    },
    {
      id: 'pet',
      name: '宠物',
      icon: 'GitBranch',
      color: 'text-orange-500',
      profileSchema: petProfileSchema,
      generation: {
        sampleSize: 5,
        attributes: [
          { id: 'name', name: '名字', type: 'string' },
          {
            id: 'species',
            name: '物种',
            type: 'enum',
            options: ['猫', '狗'],
          },
          { id: 'breed', name: '品种', type: 'string' },
          { id: 'age', name: '年龄', type: 'range', min: 0, max: 20 },
          { id: 'weight', name: '体重(kg)', type: 'range', min: 1, max: 50 },
          {
            id: 'healthStatus',
            name: '健康状况',
            type: 'multi-enum',
            options: ['健康', '玻璃胃', '泪痕', '关节问题', '皮肤敏感', '老年', '牙齿问题', '肥胖', '尿路问题风险'],
          },
          {
            id: 'allergies',
            name: '过敏源',
            type: 'multi-enum',
            options: ['谷物', '鸡肉', '牛肉', '鱼肉', '无'],
          },
          {
            id: 'eatingHabit',
            name: '饮食习惯',
            type: 'enum',
            options: ['挑食', '正常', '贪吃'],
          },
          {
            id: 'digestiveSystem',
            name: '消化系统',
            type: 'enum',
            options: ['敏感', '正常', '强健'],
          },
          {
            id: 'activityLevel',
            name: '活跃度',
            type: 'enum',
            options: ['低', '中', '高'],
          },
          { id: 'currentFood', name: '当前食物', type: 'string' },
        ],
      },
      canSimulate: true,
      canBeInterviewed: false,
    },
  ],

  // Workflow: 7-step simulation process
  workflow: {
    steps: [
      {
        id: 'concept-test',
        name: '概念测试配置',
        component: 'ConceptTestConfig',
        description: '上传产品信息，配置测试参数',
      },
      {
        id: 'audience',
        name: '虚拟客群选择',
        component: 'AudienceSelector',
        description: '从CDP选择或创建目标人群',
      },
      {
        id: 'persona',
        name: '人宠画像生成',
        component: 'DualPersonaGenerator',
        description: 'Dual-Persona Agent 构建人宠组合',
      },
      {
        id: 'dual-sim',
        name: '双视角模拟',
        component: 'DualSimulation',
        description: 'Owner Agent + Pet Agent 并行模拟',
      },
      {
        id: 'interaction',
        name: '交互分析',
        component: 'InteractionAnalysis',
        description: 'Interaction Analyst Agent 预期确认',
      },
      {
        id: 'batch',
        name: '批量化访谈',
        component: 'BatchInterview',
        description: '10,000+ 虚拟消费者批量测试',
      },
      {
        id: 'insight',
        name: '洞察仪表盘',
        component: 'InsightDashboard',
        description: '量化看板 + 质化反馈 + 场景回放',
      },
    ],
  },

  // Agents: Owner Agent and Pet Agent
  agents: [
    {
      id: 'owner-agent',
      name: '主人模拟器',
      personaType: 'owner',
      simulation: {
        engine: 'hybrid',
        prompts: [
          '模拟宠物主人看到新产品的第一反应',
          '分析价格感知和购买意愿',
          '列出关键考虑因素和异议点',
        ],
        rules: [
          {
            condition: 'feedingPhilosophy === "科学养宠" && proteinContent > 35',
            action: 'set purchaseIntent to "high" and increase trustLevel',
            priority: 10,
          },
          {
            condition: 'feedingPhilosophy === "穷养" && price > 200',
            action: 'set purchaseIntent to "low" and pricePerception to "太贵"',
            priority: 10,
          },
          {
            condition: 'income === "高净值" && certifications.includes("进口认证")',
            action: 'increase trustLevel and purchaseIntent',
            priority: 8,
          },
          {
            condition: 'concerns.includes("成分安全") && mainIngredients.includes("谷物")',
            action: 'add ingredientConcern about grains',
            priority: 9,
          },
          {
            condition: 'price < 100 && priceRange.includes("100元以下")',
            action: 'set pricePerception to "便宜"',
            priority: 7,
          },
        ],
      },
      outputSchema: ownerSimulationSchema,
    },
    {
      id: 'pet-agent',
      name: '宠物模拟器',
      personaType: 'pet',
      simulation: {
        engine: 'rule-based',
        rules: [
          {
            condition: 'species === "猫" && targetPet === "猫"',
            action: 'set smellAttraction to 80+ and tasteAcceptance to 75+',
            priority: 10,
          },
          {
            condition: 'species === "狗" && targetPet === "狗"',
            action: 'set smellAttraction to 70+ and tasteAcceptance to 78+',
            priority: 10,
          },
          {
            condition: 'digestiveSystem === "敏感" && mainIngredients.includes("谷物")',
            action: 'set digestiveRisk to "high" and add riskFactor',
            priority: 10,
          },
          {
            condition: 'eatingHabit === "挑食" && fatContent > 20',
            action: 'reduce tasteAcceptance by 15',
            priority: 8,
          },
          {
            condition: 'allergies.length > 0 && mainIngredients intersects allergies',
            action: 'set digestiveRisk to "high" and add riskFactor',
            priority: 10,
          },
          {
            condition: 'activityLevel === "高" && proteinContent > 35',
            action: 'add positiveFactor about high protein',
            priority: 7,
          },
        ],
      },
      outputSchema: petSimulationSchema,
    },
  ],

  // UI configuration
  ui: {
    theme: {
      primaryColor: 'blue',
      secondaryColor: 'orange',
      accentColor: 'green',
    },
    terminology: {
      simulation: '模拟',
      persona: '画像',
      product: '产品',
      interview: '访谈',
      analysis: '分析',
      dashboard: '仪表盘',
    },
    icons: {
      owner: 'User',
      pet: 'GitBranch',
      product: 'Package',
      simulation: 'Activity',
      analysis: 'LineChart',
      dashboard: 'PieChart',
    },
  },

  // Schemas
  schemas: {
    profile: {
      owner: ownerProfileSchema,
      pet: petProfileSchema,
      dualPersona: dualPersonaSchema,
    },
    product: productSchema,
    simulation: z.object({
      owner: ownerSimulationSchema,
      pet: petSimulationSchema,
      interaction: interactionAnalysisSchema,
      feedingScript: feedingScriptSchema,
    }),
  },

  // Domain knowledge
  domain: {
    ontology: {
      categories: ['全价猫粮', '全价犬粮', '功能猫粮', '功能犬粮', '零食', '保健品'],
      attributes: [
        '蛋白质含量',
        '脂肪含量',
        '碳水化合物含量',
        '主要成分',
        '添加剂',
        '包装',
        '认证',
        '价格',
        '重量',
      ],
      relationships: {
        '高蛋白': ['肌肉发育', '活力充沛'] as any,
        '无谷': ['低敏', '易消化'] as any,
        '添加益生菌': ['肠道健康', '便便改善'] as any,
        '添加氨糖软骨素': ['关节养护', '老年犬适用'] as any,
      },
    },
    rules: [
      '猫咪是肉食动物，需要高蛋白饮食',
      '玻璃胃宠物应避免谷物和高脂肪',
      '肥胖宠物需要低脂高蛋白配方',
      '老年宠物需要关节养护成分',
      '过敏宠物应避开过敏源',
      '换粮需要7-10天过渡期',
      '高活性宠物需要更高能量密度',
    ],
    examples: {} as Record<string, JsonValue[]>,
  },
};

// =============================================================================
// CDP Tag Definitions for Pet Food
// =============================================================================

export const petFoodCDPTags = [
  // 养宠理念
  {
    id: 'tag-feeding-science',
    name: '科学养宠',
    category: '养宠理念',
    color: 'text-blue-500',
    conditions: [
      { attribute: 'feedingPhilosophy', operator: 'equals', value: '科学养宠' },
    ],
  },
  {
    id: 'tag-feeding-budget',
    name: '预算优先',
    category: '养宠理念',
    color: 'text-gray-500',
    conditions: [
      { attribute: 'feedingPhilosophy', operator: 'equals', value: '穷养' },
    ],
  },
  {
    id: 'tag-feeding-trend',
    name: '跟风养宠',
    category: '养宠理念',
    color: 'text-purple-500',
    conditions: [
      { attribute: 'feedingPhilosophy', operator: 'equals', value: '跟风养' },
    ],
  },
  {
    id: 'tag-feeding-premium',
    name: '精细养宠',
    category: '养宠理念',
    color: 'text-amber-500',
    conditions: [
      { attribute: 'feedingPhilosophy', operator: 'equals', value: '精细养' },
    ],
  },

  // 宠物类型
  {
    id: 'tag-pet-cat',
    name: '猫主人',
    category: '宠物类型',
    color: 'text-orange-500',
    conditions: [{ attribute: 'pet.species', operator: 'equals', value: '猫' }],
  },
  {
    id: 'tag-pet-dog',
    name: '狗主人',
    category: '宠物类型',
    color: 'text-green-500',
    conditions: [{ attribute: 'pet.species', operator: 'equals', value: '狗' }],
  },

  // 健康关注
  {
    id: 'tag-concern-sensitive-stomach',
    name: '肠胃敏感',
    category: '健康关注',
    color: 'text-red-500',
    conditions: [
      { attribute: 'pet.digestiveSystem', operator: 'equals', value: '敏感' },
    ],
  },
  {
    id: 'tag-concern-allergies',
    name: '过敏关注',
    category: '健康关注',
    color: 'text-red-500',
    conditions: [{ attribute: 'pet.allergies', operator: 'greater-than', value: 0 }],
  },
  {
    id: 'tag-concern-joint',
    name: '关节关注',
    category: '健康关注',
    color: 'text-yellow-500',
    conditions: [{ attribute: 'pet.healthStatus', operator: 'contains', value: '关节问题' }],
  },

  // 价格区间
  {
    id: 'tag-price-low',
    name: '低价位',
    category: '价格敏感',
    color: 'text-green-500',
    conditions: [
      { attribute: 'income', operator: 'equals', value: '低' },
      { attribute: 'price', operator: 'less-than', value: 100 },
    ],
  },
  {
    id: 'tag-price-high',
    name: '高价位',
    category: '价格敏感',
    color: 'text-purple-500',
    conditions: [
      { attribute: 'income', operator: 'in', value: ['高', '高净值'] },
      { attribute: 'price', operator: 'greater-than', value: 300 },
    ],
  },

  // 购买渠道
  {
    id: 'tag-channel-online',
    name: '线上购买',
    category: '购买渠道',
    color: 'text-blue-500',
    conditions: [
      { attribute: 'purchaseChannel', operator: 'contains', value: '天猫' },
      { attribute: 'purchaseChannel', operator: 'contains', value: '京东' },
    ],
  },
  {
    id: 'tag-channel-offline',
    name: '线下购买',
    category: '购买渠道',
    color: 'text-orange-500',
    conditions: [
      { attribute: 'purchaseChannel', operator: 'contains', value: '宠物店' },
    ],
  },
];
