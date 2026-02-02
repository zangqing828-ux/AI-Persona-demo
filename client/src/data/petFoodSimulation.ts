/**
 * AI 消费者模拟 - 宠物食品品牌
 * 核心数据模型和模拟数据
 *
 * 基于 PPT 设计理念：
 * 1. 人宠双视角 - Owner Agent + Pet Agent
 * 2. 五大 Agent 协作
 * 3. 批量化访谈能力
 * 4. 量化+质化结合
 */

// ==================== 类型定义 ====================

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
  relationship: string;
  feedingScenario: string;
  emotionalBond: string;
}

/** 产品信息 */
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

/** Owner Agent 模拟结果 */
export interface OwnerSimulation {
  personaId: string;
  productId: string;
  initialReaction: string;
  pricePerception: "便宜" | "合理" | "偏贵" | "太贵";
  trustLevel: number; // 0-100
  ingredientConcerns: string[];
  purchaseIntent: "high" | "medium" | "low";
  intentScore: number; // 0-100
  keyConsiderations: string[];
  objections: string[];
  triggerPoints: string[];
  predictedBehavior: string;
  socialProofNeeds: string[];
}

/** Pet Agent 模拟结果 */
export interface PetSimulation {
  personaId: string;
  productId: string;
  smellAttraction: number; // 0-100 开袋吸引力
  tasteAcceptance: number; // 0-100 适口性
  digestiveRisk: "low" | "medium" | "high";
  expectedBehavior: string;
  physiologicalResponse: string;
  longTermSuitability: string;
  riskFactors: string[];
  positiveFactors: string[];
}

/** 交互分析结果 */
export interface InteractionAnalysis {
  personaId: string;
  productId: string;
  scenario: "surprise" | "satisfaction" | "disappointment" | "rejection";
  scenarioDescription: string;
  repurchaseRate: number; // 0-100
  npsScore: number; // -100 to 100
  churnRisk: "low" | "medium" | "high";
  keyInsight: string;
  recommendation: string;
}

/** 喂食场景剧本 */
export interface FeedingScript {
  personaId: string;
  productId: string;
  scenes: {
    action: string;
    petReaction: string;
    ownerEmotion: string;
    dialogue?: string;
  }[];
  overallMood: string;
  marketingInsight: string;
}

/** 批量测试结果统计 */
export interface BatchTestStats {
  totalSamples: number;
  purchaseIntentDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  avgIntentScore: number;
  avgNpsScore: number;
  avgRepurchaseRate: number;
  topConcerns: { concern: string; count: number; percentage: number }[];
  topTriggers: { trigger: string; count: number; percentage: number }[];
  digestiveRiskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  pricePerceptionDistribution: {
    cheap: number;
    reasonable: number;
    expensive: number;
    tooExpensive: number;
  };
  segmentAnalysis: {
    segment: string;
    count: number;
    avgIntentScore: number;
    avgNpsScore: number;
    keyInsight: string;
  }[];
}

// ==================== 模拟数据 ====================

/** 宠物主人样本数据 */
export const ownerProfiles: OwnerProfile[] = [
  {
    id: "O001",
    name: "张小萌",
    age: 28,
    gender: "女",
    city: "上海",
    occupation: "互联网产品经理",
    income: "高",
    feedingPhilosophy: "科学养宠",
    purchaseChannel: ["天猫", "京东", "小红书"],
    priceRange: "200-400元/月",
    concerns: ["成分安全", "营养配比", "品牌口碑"],
    socialPlatform: ["小红书", "微博", "抖音"],
  },
  {
    id: "O002",
    name: "李大壮",
    age: 35,
    gender: "男",
    city: "北京",
    occupation: "金融分析师",
    income: "高净值",
    feedingPhilosophy: "精细养",
    purchaseChannel: ["进口超市", "代购", "品牌官网"],
    priceRange: "500元以上/月",
    concerns: ["进口品质", "配方科学", "适口性"],
    socialPlatform: ["知乎", "微信公众号"],
  },
  {
    id: "O003",
    name: "王美丽",
    age: 24,
    gender: "女",
    city: "成都",
    occupation: "大学生",
    income: "低",
    feedingPhilosophy: "穷养",
    purchaseChannel: ["拼多多", "淘宝", "线下超市"],
    priceRange: "100元以下/月",
    concerns: ["价格", "性价比", "不拉稀"],
    socialPlatform: ["抖音", "B站", "小红书"],
  },
  {
    id: "O004",
    name: "陈阿姨",
    age: 55,
    gender: "女",
    city: "广州",
    occupation: "退休教师",
    income: "中",
    feedingPhilosophy: "跟风养",
    purchaseChannel: ["宠物店", "社区团购", "子女代买"],
    priceRange: "150-250元/月",
    concerns: ["邻居推荐", "宠物店建议", "不上火"],
    socialPlatform: ["微信", "抖音"],
  },
  {
    id: "O005",
    name: "刘潇洒",
    age: 32,
    gender: "男",
    city: "深圳",
    occupation: "创业者",
    income: "高",
    feedingPhilosophy: "科学养宠",
    purchaseChannel: ["京东", "天猫", "宠物医院"],
    priceRange: "300-500元/月",
    concerns: ["成分透明", "无诱食剂", "肠胃友好"],
    socialPlatform: ["知乎", "小红书", "微信"],
  },
];

/** 宠物样本数据 */
export const petProfiles: PetProfile[] = [
  {
    id: "P001",
    name: "布丁",
    species: "猫",
    breed: "布偶猫",
    age: 2,
    weight: 4.5,
    healthStatus: ["玻璃胃", "泪痕"],
    allergies: ["谷物"],
    eatingHabit: "挑食",
    digestiveSystem: "敏感",
    activityLevel: "低",
    currentFood: "某进口无谷猫粮",
  },
  {
    id: "P002",
    name: "大黄",
    species: "狗",
    breed: "金毛",
    age: 5,
    weight: 32,
    healthStatus: ["关节问题", "皮肤敏感"],
    allergies: ["鸡肉"],
    eatingHabit: "贪吃",
    digestiveSystem: "正常",
    activityLevel: "高",
    currentFood: "某国产狗粮",
  },
  {
    id: "P003",
    name: "小橘",
    species: "猫",
    breed: "中华田园猫",
    age: 1,
    weight: 3.8,
    healthStatus: ["健康"],
    allergies: [],
    eatingHabit: "正常",
    digestiveSystem: "强健",
    activityLevel: "高",
    currentFood: "超市猫粮",
  },
  {
    id: "P004",
    name: "豆豆",
    species: "狗",
    breed: "泰迪",
    age: 8,
    weight: 5,
    healthStatus: ["老年", "牙齿问题"],
    allergies: ["牛肉"],
    eatingHabit: "挑食",
    digestiveSystem: "敏感",
    activityLevel: "低",
    currentFood: "某品牌老年犬粮",
  },
  {
    id: "P005",
    name: "毛球",
    species: "猫",
    breed: "英短",
    age: 3,
    weight: 5.2,
    healthStatus: ["肥胖", "尿路问题风险"],
    allergies: [],
    eatingHabit: "贪吃",
    digestiveSystem: "正常",
    activityLevel: "低",
    currentFood: "某品牌室内猫粮",
  },
];

/** 人宠组合画像 */
export const dualPersonas: DualPersona[] = [
  {
    id: "DP001",
    owner: ownerProfiles[0],
    pet: petProfiles[0],
    relationship: "焦虑的新手猫妈妈 + 体弱多病的布偶",
    feedingScenario: "每天定时定量喂食，会仔细观察便便状态",
    emotionalBond: "把猫当孩子养，愿意为健康付出高溢价",
  },
  {
    id: "DP002",
    owner: ownerProfiles[1],
    pet: petProfiles[1],
    relationship: "理性的精英狗爸 + 活力满满的大金毛",
    feedingScenario: "注重科学配比，会研究配料表",
    emotionalBond: "视狗为家人，追求最优解",
  },
  {
    id: "DP003",
    owner: ownerProfiles[2],
    pet: petProfiles[2],
    relationship: "预算有限的学生党 + 皮实的田园猫",
    feedingScenario: "能吃饱就行，偶尔加餐罐头",
    emotionalBond: "喜欢但经济能力有限",
  },
  {
    id: "DP004",
    owner: ownerProfiles[3],
    pet: petProfiles[3],
    relationship: "传统的退休阿姨 + 陪伴多年的老泰迪",
    feedingScenario: "听宠物店推荐，偶尔喂人食",
    emotionalBond: "相依为命的老伙伴",
  },
  {
    id: "DP005",
    owner: ownerProfiles[4],
    pet: petProfiles[4],
    relationship: "成分党理工男 + 需要减肥的英短",
    feedingScenario: "严格控制热量，定期称重",
    emotionalBond: "用数据说话的科学喂养",
  },
];

/** 待测产品 */
export const testProducts: Product[] = [
  {
    id: "PROD001",
    name: "鲜萃高蛋白全价猫粮",
    brand: "萌宠优选",
    category: "全价猫粮",
    price: 268,
    weight: "1.5kg",
    targetPet: "猫",
    mainIngredients: ["鲜鸡肉", "三文鱼", "鸡肝", "鸡蛋"],
    proteinContent: 42,
    fatContent: 18,
    carbContent: 25,
    additives: ["牛磺酸", "益生菌", "Omega-3"],
    sellingPoints: ["75%动物蛋白", "无谷配方", "添加益生菌"],
    packaging: "可重封铝箔袋",
    certifications: ["AAFCO认证", "无谷认证"],
  },
  {
    id: "PROD002",
    name: "关节养护成犬粮",
    brand: "萌宠优选",
    category: "功能犬粮",
    price: 328,
    weight: "2kg",
    targetPet: "狗",
    mainIngredients: ["鸭肉", "三文鱼", "甘薯", "豌豆"],
    proteinContent: 28,
    fatContent: 15,
    carbContent: 40,
    additives: ["氨糖", "软骨素", "MSM", "鱼油"],
    sellingPoints: ["关节养护配方", "低敏蛋白源", "添加氨糖软骨素"],
    packaging: "拉链自封袋",
    certifications: ["AAFCO认证"],
  },
];

/** Owner Agent 模拟结果示例 */
export const ownerSimulations: OwnerSimulation[] = [
  {
    personaId: "DP001",
    productId: "PROD001",
    initialReaction:
      '看到"75%动物蛋白"和"无谷配方"眼前一亮，这正是我一直在找的。但268元/1.5kg的价格让我有点犹豫，需要看看其他成分党的评价。',
    pricePerception: "合理",
    trustLevel: 72,
    ingredientConcerns: ["想确认是否真的无诱食剂", "益生菌的菌株和活性"],
    purchaseIntent: "high",
    intentScore: 78,
    keyConsiderations: [
      "蛋白含量42%符合我的期望",
      "无谷配方对玻璃胃友好",
      "添加益生菌可能改善便便",
    ],
    objections: [
      "价格略高于我目前使用的品牌",
      "没有看到第三方检测报告",
      "不确定布偶猫是否爱吃",
    ],
    triggerPoints: [
      "如果有小红书成分党的详细测评",
      "如果有试吃装可以先测试适口性",
      "如果有买二送一的活动",
    ],
    predictedBehavior: "会先在小红书搜索测评，如果口碑好会购买试吃装测试",
    socialProofNeeds: ["成分党测评", "兽医推荐", "同品种猫的反馈"],
  },
  {
    personaId: "DP002",
    productId: "PROD002",
    initialReaction:
      "关节养护配方正是大黄需要的，氨糖软骨素的添加很专业。328元/2kg的价格在功能粮里算合理，但我需要确认鸭肉来源和氨糖含量。",
    pricePerception: "合理",
    trustLevel: 68,
    ingredientConcerns: [
      "氨糖和软骨素的具体含量",
      "鸭肉是否为主要蛋白来源",
      "碳水含量40%是否偏高",
    ],
    purchaseIntent: "medium",
    intentScore: 65,
    keyConsiderations: [
      "关节养护功能符合大黄的需求",
      "鸭肉低敏，避开了鸡肉过敏",
      "有AAFCO认证",
    ],
    objections: [
      "碳水含量40%对金毛来说偏高",
      "没有看到临床试验数据",
      "不确定氨糖含量是否足够",
    ],
    triggerPoints: [
      "如果能提供氨糖软骨素的具体含量",
      "如果有关节改善的案例分享",
      "如果有兽医的专业背书",
    ],
    predictedBehavior: "会在知乎搜索相关讨论，可能会咨询宠物医院的意见",
    socialProofNeeds: ["兽医推荐", "临床数据", "用户长期反馈"],
  },
  {
    personaId: "DP003",
    productId: "PROD001",
    initialReaction:
      "268元/1.5kg？这也太贵了吧，我现在买的超市粮才50块一大袋。虽然成分看起来不错，但真的超出预算太多了。",
    pricePerception: "太贵",
    trustLevel: 45,
    ingredientConcerns: ["不太懂这些成分有什么用", "感觉是智商税"],
    purchaseIntent: "low",
    intentScore: 25,
    keyConsiderations: ["小橘吃超市粮也很健康", "学生党真的负担不起"],
    objections: [
      "价格是目前粮的5倍以上",
      "不确定贵的粮是否真的更好",
      "田园猫没那么娇气",
    ],
    triggerPoints: [
      "如果有学生专属优惠",
      "如果有超小包装试吃",
      "如果能分期付款",
    ],
    predictedBehavior: "可能会在抖音看看测评，但大概率不会购买",
    socialProofNeeds: ["性价比对比", "田园猫主人的反馈"],
  },
  {
    personaId: "DP004",
    productId: "PROD002",
    initialReaction:
      "关节养护？豆豆确实腿脚不太好了。但这个牌子我没听说过，不知道靠不靠谱。要不问问宠物店老板？",
    pricePerception: "偏贵",
    trustLevel: 40,
    ingredientConcerns: ["不太看得懂配料表", "不知道这些成分好不好"],
    purchaseIntent: "medium",
    intentScore: 48,
    keyConsiderations: ["豆豆确实需要关节养护", "如果宠物店推荐可能会买"],
    objections: [
      "品牌不熟悉，不敢轻易尝试",
      "价格比平时买的贵",
      "不确定老年狗能不能吃",
    ],
    triggerPoints: [
      "如果宠物店老板推荐",
      "如果邻居家狗吃了效果好",
      "如果有老年犬专用说明",
    ],
    predictedBehavior: "会先问宠物店老板，或者等子女帮忙查查",
    socialProofNeeds: ["宠物店推荐", "熟人口碑", "老年犬案例"],
  },
  {
    personaId: "DP005",
    productId: "PROD001",
    initialReaction:
      "蛋白42%、脂肪18%、碳水25%，这个配比对需要减肥的毛球来说脂肪略高。让我算算每日热量摄入...",
    pricePerception: "合理",
    trustLevel: 65,
    ingredientConcerns: [
      "脂肪含量18%对减肥猫偏高",
      "需要确认代谢能数据",
      "益生菌菌株信息",
    ],
    purchaseIntent: "medium",
    intentScore: 58,
    keyConsiderations: [
      "高蛋白有助于维持肌肉",
      "无谷配方碳水较低",
      "但脂肪含量不太适合减肥",
    ],
    objections: [
      "脂肪18%对减肥猫来说偏高",
      "没有标注代谢能",
      "可能需要搭配减肥粮使用",
    ],
    triggerPoints: [
      "如果能提供详细的营养成分表",
      "如果有减肥猫的喂食建议",
      "如果有低脂版本",
    ],
    predictedBehavior: "会详细计算热量，可能会混合低脂粮一起喂",
    socialProofNeeds: ["详细营养数据", "减肥案例", "兽医建议"],
  },
];

/** Pet Agent 模拟结果示例 */
export const petSimulations: PetSimulation[] = [
  {
    personaId: "DP001",
    productId: "PROD001",
    smellAttraction: 82,
    tasteAcceptance: 75,
    digestiveRisk: "low",
    expectedBehavior:
      "开袋时会凑过来闻，可能会舔舔嘴。首次喂食可能会谨慎试探，但大概率会吃完。",
    physiologicalResponse:
      "由于添加了益生菌且无谷物，对玻璃胃布偶猫较为友好。预计便便成型良好，泪痕可能略有改善。",
    longTermSuitability:
      "长期食用适合度较高，高蛋白配方符合猫咪生理需求，益生菌有助于肠道健康。",
    riskFactors: ["初次换粮需要7-10天过渡期", "个别猫可能对三文鱼过敏"],
    positiveFactors: [
      "高动物蛋白符合猫咪天性",
      "无谷物减少消化负担",
      "益生菌改善肠道环境",
    ],
  },
  {
    personaId: "DP002",
    productId: "PROD002",
    smellAttraction: 70,
    tasteAcceptance: 78,
    digestiveRisk: "low",
    expectedBehavior:
      "金毛通常不挑食，开袋就会兴奋。会大口吃完，可能还会舔碗。",
    physiologicalResponse:
      "鸭肉蛋白源避开了鸡肉过敏，消化应该顺畅。氨糖软骨素需要长期食用才能看到关节改善。",
    longTermSuitability:
      "关节养护功能适合5岁以上大型犬，但碳水含量略高，需注意体重管理。",
    riskFactors: ["碳水40%可能导致体重增加", "需要配合运动"],
    positiveFactors: ["低敏蛋白源", "关节养护成分", "适口性好"],
  },
  {
    personaId: "DP003",
    productId: "PROD001",
    smellAttraction: 85,
    tasteAcceptance: 88,
    digestiveRisk: "low",
    expectedBehavior:
      "田园猫通常适应性强，高蛋白配方会非常吸引。预计会吃得很香，可能会催促加餐。",
    physiologicalResponse:
      "健康的田园猫消化系统强健，高蛋白配方完全可以适应。便便预计成型好，毛色可能更亮。",
    longTermSuitability:
      "非常适合年轻健康的田园猫，高蛋白有助于保持活力和肌肉。",
    riskFactors: ["几乎没有风险"],
    positiveFactors: ["高蛋白满足活跃猫咪需求", "无谷物易消化", "营养全面"],
  },
  {
    personaId: "DP004",
    productId: "PROD002",
    smellAttraction: 65,
    tasteAcceptance: 60,
    digestiveRisk: "medium",
    expectedBehavior:
      "老年泰迪可能因牙齿问题咀嚼困难，需要泡软。可能会挑挑拣拣，吃得比较慢。",
    physiologicalResponse:
      "老年犬消化功能下降，需要观察便便情况。关节养护成分对老年犬有益，但见效需要时间。",
    longTermSuitability:
      "功能性成分适合老年犬，但颗粒可能需要调整。建议泡软喂食。",
    riskFactors: ["颗粒可能太硬", "老年犬消化能力下降", "换粮需要更长过渡期"],
    positiveFactors: ["关节养护成分", "低敏配方", "营养均衡"],
  },
  {
    personaId: "DP005",
    productId: "PROD001",
    smellAttraction: 80,
    tasteAcceptance: 85,
    digestiveRisk: "low",
    expectedBehavior:
      "贪吃的英短会非常喜欢高蛋白配方，可能会吃得很快。需要控制喂食量。",
    physiologicalResponse:
      "脂肪18%对需要减肥的猫来说略高，可能不利于体重控制。建议减少喂食量或混合低脂粮。",
    longTermSuitability:
      "营养配方优秀，但对减肥猫来说需要严格控制份量。高蛋白有助于维持肌肉。",
    riskFactors: ["脂肪含量可能导致体重增加", "贪吃猫需要严格控量"],
    positiveFactors: ["高蛋白维持肌肉", "无谷物减少碳水", "营养全面"],
  },
];

/** 交互分析结果示例 */
export const interactionAnalyses: InteractionAnalysis[] = [
  {
    personaId: "DP001",
    productId: "PROD001",
    scenario: "satisfaction",
    scenarioDescription: "主人的高期望得到满足：布丁爱吃且便便改善",
    repurchaseRate: 78,
    npsScore: 45,
    churnRisk: "low",
    keyInsight:
      '成分党妈妈的核心诉求是"看得见的效果"，便便改善是最直观的正反馈',
    recommendation:
      '强化"肠道健康可视化"的营销点，提供便便对比图的用户UGC征集活动',
  },
  {
    personaId: "DP002",
    productId: "PROD002",
    scenario: "satisfaction",
    scenarioDescription: "理性预期基本满足：大黄爱吃，关节改善需要时间观察",
    repurchaseRate: 65,
    npsScore: 25,
    churnRisk: "medium",
    keyInsight: "理性用户需要数据支撑，关节改善的长周期可能导致中途流失",
    recommendation: "提供关节健康追踪工具，定期推送改善进度，增强用户粘性",
  },
  {
    personaId: "DP003",
    productId: "PROD001",
    scenario: "rejection",
    scenarioDescription: "价格门槛过高，即使产品优秀也难以转化",
    repurchaseRate: 15,
    npsScore: -20,
    churnRisk: "high",
    keyInsight: "学生群体对价格极度敏感，需要差异化的产品线或营销策略",
    recommendation: "考虑推出小包装入门款，或与校园渠道合作提供学生优惠",
  },
  {
    personaId: "DP004",
    productId: "PROD002",
    scenario: "surprise",
    scenarioDescription: "超出预期：豆豆吃得比以前香，走路似乎更轻松了",
    repurchaseRate: 72,
    npsScore: 55,
    churnRisk: "low",
    keyInsight:
      '老年宠物主人对"陪伴更久"有强烈情感诉求，效果超预期会带来高忠诚度',
    recommendation: '打造"陪伴更久"的情感营销，收集老年宠物改善案例',
  },
  {
    personaId: "DP005",
    productId: "PROD001",
    scenario: "disappointment",
    scenarioDescription: "部分失望：毛球爱吃但体重没有下降",
    repurchaseRate: 45,
    npsScore: 5,
    churnRisk: "medium",
    keyInsight: '数据党用户对"减肥效果"有明确预期，脂肪含量成为扣分项',
    recommendation: "考虑推出低脂版本，或提供详细的减肥喂食指南",
  },
];

/** 喂食场景剧本示例 */
export const feedingScripts: FeedingScript[] = [
  {
    personaId: "DP001",
    productId: "PROD001",
    scenes: [
      {
        action: "张小萌打开猫粮袋，一股淡淡的鱼香味飘出",
        petReaction: "布丁竖起耳朵，从猫爬架上跳下来，小跑到饭盆前",
        ownerEmotion: "看到布丁这么积极，心里有点小期待",
        dialogue: '"布丁，新粮来啦，闻闻看喜不喜欢？"',
      },
      {
        action: "倒入适量猫粮，颗粒大小适中，表面有光泽",
        petReaction: "布丁先闻了闻，然后开始小口小口地吃，发出轻微的咀嚼声",
        ownerEmotion: "松了一口气，挑食的布丁居然在吃",
        dialogue: '"哎呀，居然吃了！看来这个配方还不错"',
      },
      {
        action: "几分钟后，布丁吃完了碗里的猫粮",
        petReaction: "布丁舔了舔嘴，开始洗脸，然后跳上沙发打盹",
        ownerEmotion: "满足感油然而生，觉得这钱花得值",
        dialogue: '"乖宝宝，吃饱了就好好休息"',
      },
    ],
    overallMood: "温馨满足",
    marketingInsight: '可以用"挑食猫也爱吃"作为营销点，配合真实用户的喂食视频',
  },
  {
    personaId: "DP002",
    productId: "PROD002",
    scenes: [
      {
        action: "李大壮按照计算好的份量称重狗粮",
        petReaction: "大黄在旁边转圈圈，尾巴摇得像螺旋桨",
        ownerEmotion: "看着大黄的热情，嘴角微微上扬",
        dialogue: '"等等，让爸爸先称好"',
      },
      {
        action: "将狗粮倒入食盆，大黄立刻开始大口吃",
        petReaction: "大黄吃得很香，不到两分钟就吃完了，还舔了舔碗",
        ownerEmotion: "观察大黄的进食状态，在手机上记录",
        dialogue: '"吃得不错，希望关节能慢慢好起来"',
      },
      {
        action: "喂食后带大黄出门散步",
        petReaction: "大黄精神很好，但上楼梯时还是有点慢",
        ownerEmotion: "心疼但也理解需要时间",
        dialogue: '"慢慢来，爸爸陪你"',
      },
    ],
    overallMood: "理性期待",
    marketingInsight: '强调"科学配方+耐心等待"的理念，提供关节健康追踪功能',
  },
];

/** 批量测试统计数据 */
export const batchTestStats: BatchTestStats = {
  totalSamples: 10000,
  purchaseIntentDistribution: {
    high: 2800,
    medium: 4500,
    low: 2700,
  },
  avgIntentScore: 58.5,
  avgNpsScore: 22,
  avgRepurchaseRate: 62,
  topConcerns: [
    { concern: "价格偏高", count: 4200, percentage: 42 },
    { concern: "品牌知名度不足", count: 3500, percentage: 35 },
    { concern: "成分透明度", count: 2800, percentage: 28 },
    { concern: "适口性不确定", count: 2200, percentage: 22 },
    { concern: "缺少试吃装", count: 1800, percentage: 18 },
  ],
  topTriggers: [
    { trigger: "成分党测评背书", count: 5200, percentage: 52 },
    { trigger: "试吃装体验", count: 4800, percentage: 48 },
    { trigger: "促销活动", count: 4500, percentage: 45 },
    { trigger: "兽医推荐", count: 3800, percentage: 38 },
    { trigger: "同品种用户反馈", count: 3200, percentage: 32 },
  ],
  digestiveRiskDistribution: {
    low: 7200,
    medium: 2200,
    high: 600,
  },
  pricePerceptionDistribution: {
    cheap: 500,
    reasonable: 3800,
    expensive: 4200,
    tooExpensive: 1500,
  },
  segmentAnalysis: [
    {
      segment: "科学养宠型",
      count: 3200,
      avgIntentScore: 72,
      avgNpsScore: 38,
      keyInsight: "核心目标人群，对成分和功效有深度认知，愿意为品质付费",
    },
    {
      segment: "精细养型",
      count: 1800,
      avgIntentScore: 68,
      avgNpsScore: 32,
      keyInsight: "高净值人群，追求最优解，需要专业背书和数据支撑",
    },
    {
      segment: "跟风养型",
      count: 2500,
      avgIntentScore: 52,
      avgNpsScore: 18,
      keyInsight: "依赖社交证明，需要KOL和熟人推荐",
    },
    {
      segment: "穷养型",
      count: 2500,
      avgIntentScore: 35,
      avgNpsScore: -5,
      keyInsight: "价格敏感度极高，需要差异化产品线或入门策略",
    },
  ],
};

/** 模拟流程步骤 */
export const simulationSteps = [
  {
    id: 1,
    name: "概念测试配置",
    description: "上传产品信息，配置测试参数",
    icon: "Settings",
  },
  {
    id: 2,
    name: "虚拟客群选择",
    description: "从CDP选择或创建目标人群",
    icon: "Users",
  },
  {
    id: 3,
    name: "人宠画像生成",
    description: "Dual-Persona Agent 构建人宠组合",
    icon: "UserCircle",
  },
  {
    id: 4,
    name: "双视角模拟",
    description: "Owner Agent + Pet Agent 并行模拟",
    icon: "Brain",
  },
  {
    id: 5,
    name: "交互分析",
    description: "Interaction Analyst Agent 预期确认",
    icon: "LineChart",
  },
  {
    id: 6,
    name: "批量化访谈",
    description: "10,000+ 虚拟消费者批量测试",
    icon: "BarChart",
  },
  {
    id: 7,
    name: "洞察仪表盘",
    description: "量化看板 + 质化反馈 + 场景回放",
    icon: "PieChart",
  },
];
