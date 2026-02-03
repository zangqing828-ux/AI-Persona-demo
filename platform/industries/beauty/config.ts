/**
 * Beauty Industry Configuration
 * Complete industry configuration for beauty/skincare simulation platform
 */

import { z } from 'zod';
import type { IndustryConfig } from '../../../shared/types/industry.js';
import type { JsonValue } from '../../../shared/types/platform.js';

// =============================================================================
// Type Definitions
// =============================================================================

interface OntologyRelationships {
  [key: string]: string[];
}

// =============================================================================
// Beauty Schemas
// =============================================================================

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(['女', '男']),
  city: z.string(),
  occupation: z.string(),
  income: z.enum(['低', '中', '高', '高净值']),
  skinType: z.enum(['干性', '油性', '混合性', '敏感性']),
  concerns: z.array(z.string()),
  budgetRange: z.string(),
  purchaseChannels: z.array(z.string()),
  beautyRoutine: z.enum(['基础', '进阶', '精致']),
  socialPlatforms: z.array(z.string()),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  price: z.number(),
  size: z.string(),
  targetSkin: z.array(z.string()),
  mainIngredients: z.array(z.string()),
  benefits: z.array(z.string()),
  packaging: z.string(),
  certifications: z.array(z.string()),
});

export const userSimulationSchema = z.object({
  personaId: z.string(),
  productId: z.string(),
  initialReaction: z.string(),
  pricePerception: z.enum(['便宜', '合理', '偏贵', '太贵']),
  interest: z.number(),
  ingredientAppeal: z.string(),
  purchaseIntent: z.enum(['high', 'medium', 'low']),
  intentScore: z.number(),
  keyConsiderations: z.array(z.string()),
  concerns: z.array(z.string()),
  triggers: z.array(z.string()),
  predictedBehavior: z.string(),
  socialProofNeeds: z.array(z.string()),
});

// =============================================================================
// Beauty Industry Config
// =============================================================================

export const beautyIndustryConfig: IndustryConfig = {
  // Basic metadata
  id: 'beauty',
  name: '美妆护肤',
  description: 'AI消费者模拟平台 - 美妆护肤行业版',
  version: '1.0.0',

  // Persona types: User only (simplified from pet food's dual persona)
  personaTypes: [
    {
      id: 'user',
      name: '用户',
      icon: 'User',
      color: 'text-pink-500',
      profileSchema: userProfileSchema,
      generation: {
        sampleSize: 5,
        attributes: [
          { id: 'name', name: '姓名', type: 'string' },
          { id: 'age', name: '年龄', type: 'range', min: 18, max: 65 },
          { id: 'gender', name: '性别', type: 'enum', options: ['女', '男'] },
          { id: 'city', name: '城市', type: 'string' },
          { id: 'occupation', name: '职业', type: 'string' },
          {
            id: 'income',
            name: '收入水平',
            type: 'enum',
            options: ['低', '中', '高', '高净值'],
          },
          {
            id: 'skinType',
            name: '肤质',
            type: 'enum',
            options: ['干性', '油性', '混合性', '敏感性'],
          },
          {
            id: 'concerns',
            name: '肌肤困扰',
            type: 'multi-enum',
            options: ['痘痘', '美白', '抗衰', '敏感', '保湿', '控油', '毛孔粗大', '色斑'],
          },
          { id: 'budgetRange', name: '预算范围', type: 'string' },
          {
            id: 'purchaseChannels',
            name: '购买渠道',
            type: 'multi-enum',
            options: ['天猫', '京东', '小红书', '抖音', '丝芙兰', '专柜', '代购'],
          },
          {
            id: 'beautyRoutine',
            name: '护肤习惯',
            type: 'enum',
            options: ['基础', '进阶', '精致'],
          },
          {
            id: 'socialPlatforms',
            name: '常用平台',
            type: 'multi-enum',
            options: ['小红书', '抖音', '微博', 'B站', '微信'],
          },
        ],
      },
      canSimulate: true,
      canBeInterviewed: true,
    },
  ],

  // Workflow: 6-step simulation process (no dual persona)
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
        name: '客群选择',
        component: 'AudienceSelector',
        description: '从CDP选择或创建目标人群',
      },
      {
        id: 'persona',
        name: '用户画像生成',
        component: 'PersonaGenerator',
        description: '构建用户画像',
      },
      {
        id: 'simulation',
        name: '购买模拟',
        component: 'UserSimulation',
        description: '模拟用户购买决策过程',
      },
      {
        id: 'batch',
        name: '批量访谈',
        component: 'BatchInterview',
        description: '10,000+ 虚拟消费者批量测试',
      },
      {
        id: 'insight',
        name: '洞察仪表盘',
        component: 'InsightDashboard',
        description: '量化看板 + 质化反馈',
      },
    ],
  },

  // Agents: User Agent only (simplified)
  agents: [
    {
      id: 'user-agent',
      name: '用户模拟器',
      personaType: 'user',
      simulation: {
        engine: 'hybrid',
        prompts: [
          '模拟消费者看到护肤产品的第一反应',
          '分析价格感知和购买意愿',
          '列出关键考虑因素和顾虑',
        ],
        rules: [
          {
            condition: 'skinType === "敏感性" && mainIngredients.includes("酒精")',
            action: 'set purchaseIntent to "low" and add concern about irritation',
            priority: 10,
          },
          {
            condition: 'concerns.includes("抗衰") && mainIngredients.includes("视黄醇")',
            action: 'increase interest and add keyConsideration about anti-aging',
            priority: 10,
          },
          {
            condition: 'concerns.includes("美白") && mainIngredients.includes("维生素C")',
            action: 'increase interest and add positive factor',
            priority: 9,
          },
          {
            condition: 'income === "高" && price > 500',
            action: 'set pricePerception to "合理"',
            priority: 7,
          },
          {
            condition: 'income === "低" && price > 300',
            action: 'set pricePerception to "太贵" and reduce purchaseIntent',
            priority: 10,
          },
          {
            condition: 'beautyRoutine === "精致" && certifications.length > 0',
            action: 'increase interest and trust',
            priority: 8,
          },
        ],
      },
      outputSchema: userSimulationSchema,
    },
  ],

  // UI configuration
  ui: {
    theme: {
      primaryColor: 'pink',
      secondaryColor: 'purple',
      accentColor: 'rose',
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
      user: 'User',
      product: 'Sparkles',
      simulation: 'Target',
      analysis: 'TrendingUp',
      dashboard: 'BarChart3',
    },
  },

  // Schemas
  schemas: {
    profile: {
      user: userProfileSchema,
    },
    product: productSchema,
    simulation: z.object({
      user: userSimulationSchema,
    }),
  },

  // Domain knowledge
  domain: {
    ontology: {
      categories: ['面部护理', '身体护理', '防晒', '彩妆', '香水', '工具'],
      attributes: ['肤质', '功效', '成分', '质地', '价格', '品牌'],
      relationships: {
        '干性肤质': ['保湿', '滋润'],
        '油性肤质': ['控油', '清爽'],
        '敏感性肌肤': ['温和', '低敏'],
        '抗衰老': ['视黄醇', '维生素C', '肽类'],
        '美白': ['烟酰胺', '维生素C', '熊果苷'],
        '痘痘肌': ['水杨酸', '茶树油', '烟酰胺'],
      } satisfies OntologyRelationships,
    },
    rules: [
      '敏感性肌肤应避免含酒精、香精产品',
      '油性肌肤适合清爽质地、无油配方',
      '抗衰老需要含视黄醇、肽类等活性成分',
      '美白需要坚持使用，并配合防晒',
      '痘痘肌应选择温和、低敏产品',
      '换季时需要调整护肤routine',
    ],
    examples: {} as Record<string, JsonValue[]>,
  },
};

// =============================================================================
// CDP Tag Definitions for Beauty
// =============================================================================

export const beautyCDPTags = [
  // 肤质
  {
    id: 'tag-skin-dry',
    name: '干性肌肤',
    category: '肤质',
    color: 'text-blue-500',
    conditions: [{ attribute: 'skinType', operator: 'equals', value: '干性' }],
  },
  {
    id: 'tag-skin-oily',
    name: '油性肌肤',
    category: '肤质',
    color: 'text-yellow-500',
    conditions: [{ attribute: 'skinType', operator: 'equals', value: '油性' }],
  },
  {
    id: 'tag-skin-sensitive',
    name: '敏感肌肤',
    category: '肤质',
    color: 'text-red-500',
    conditions: [{ attribute: 'skinType', operator: 'equals', value: '敏感性' }],
  },

  // 护肤困扰
  {
    id: 'tag-concern-acne',
    name: '痘痘困扰',
    category: '护肤困扰',
    color: 'text-orange-500',
    conditions: [{ attribute: 'concerns', operator: 'contains', value: '痘痘' }],
  },
  {
    id: 'tag-concern-anti-aging',
    name: '抗衰需求',
    category: '护肤困扰',
    color: 'text-purple-500',
    conditions: [{ attribute: 'concerns', operator: 'contains', value: '抗衰' }],
  },
  {
    id: 'tag-concern-whitening',
    name: '美白需求',
    category: '护肤困扰',
    color: 'text-pink-500',
    conditions: [{ attribute: 'concerns', operator: 'contains', value: '美白' }],
  },

  // 价格敏感度
  {
    id: 'tag-budget-low',
    name: '价格敏感',
    category: '价格敏感',
    color: 'text-green-500',
    conditions: [
      { attribute: 'income', operator: 'equals', value: '低' },
      { attribute: 'price', operator: 'less-than', value: 200 },
    ],
  },
  {
    id: 'tag-budget-high',
    name: '高端消费',
    category: '价格敏感',
    color: 'text-purple-500',
    conditions: [
      { attribute: 'income', operator: 'in', value: ['高', '高净值'] },
      { attribute: 'price', operator: 'greater-than', value: 500 },
    ],
  },

  // 护肤习惯
  {
    id: 'tag-routine-basic',
    name: '基础护肤',
    category: '护肤习惯',
    color: 'text-gray-500',
    conditions: [{ attribute: 'beautyRoutine', operator: 'equals', value: '基础' }],
  },
  {
    id: 'tag-routine-advanced',
    name: '精致护肤',
    category: '护肤习惯',
    color: 'text-pink-500',
    conditions: [{ attribute: 'beautyRoutine', operator: 'equals', value: '精致' }],
  },
];
