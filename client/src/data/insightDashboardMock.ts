// InsightDashboard Mock Data Types
export interface Persona {
  id: string;
  name: string;
  age: number;
  gender: '男' | '女';
  location: string;
  occupation: string;
  petPersonality: '科学养宠型' | '精细养型' | '跟风养型' | '穷养型';
  pet: {
    name: string;
    age: number;
    breed: string;
    healthCondition: string[];
  };
}

export interface SurveyData {
  id: string;
  persona: Persona;
  questionType: '满意度' | '购买意愿' | '价格接受度' | '成分关注点';
  question: string;
  answer: number | string;
  answerText?: string;
  timestamp: Date;
}

export interface InterviewData {
  id: string;
  persona: Persona;
  question: string;
  answer: string;
  keywords: string[];
  timestamp: Date;
  duration: number; // minutes
}

export interface MetricNode {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number; // 0-1
  evidence: string;
  children?: MetricNode[];
}

export interface PersonaSegment {
  type: '科学养宠型' | '精细养型' | '跟风养型' | '穷养型';
  averageScore: number;
  sampleSize: number;
  keyInsights: string[];
  demographics: {
    ageRange: string;
    genderDistribution: { male: number; female: number };
    locations: string[];
    occupations: string[];
  };
}

export interface AIInsight {
  id: string;
  type: '机会' | '风险' | '优势' | '趋势';
  title: string;
  description: string;
  evidence: string[];
  confidence: number; // 0-1
  impact: 'high' | 'medium' | 'low';
  actionItems: string[];
}

// Mock Data Implementation
export const personas: Persona[] = [
  {
    id: '1',
    name: '张小萌',
    age: 28,
    gender: '女',
    location: '上海',
    occupation: '产品经理',
    petPersonality: '科学养宠型',
    pet: {
      name: '布丁',
      age: 2,
      breed: '布偶猫',
      healthCondition: ['玻璃胃', '泪痕']
    }
  },
  {
    id: '2',
    name: '李大壮',
    age: 35,
    gender: '男',
    location: '北京',
    occupation: '金融分析师',
    petPersonality: '精细养型',
    pet: {
      name: '大黄',
      age: 5,
      breed: '金毛',
      healthCondition: ['关节问题']
    }
  },
  {
    id: '3',
    name: '王美丽',
    age: 24,
    gender: '女',
    location: '成都',
    occupation: '大学生',
    petPersonality: '穷养型',
    pet: {
      name: '小橘',
      age: 1,
      breed: '田园猫',
      healthCondition: ['健康']
    }
  },
  {
    id: '4',
    name: '陈阿姨',
    age: 55,
    gender: '女',
    location: '广州',
    occupation: '退休教师',
    petPersonality: '跟风养型',
    pet: {
      name: '豆豆',
      age: 8,
      breed: '泰迪',
      healthCondition: ['牙齿问题']
    }
  },
  {
    id: '5',
    name: '刘潇洒',
    age: 32,
    gender: '男',
    location: '深圳',
    occupation: '创业者',
    petPersonality: '科学养宠型',
    pet: {
      name: '毛球',
      age: 3,
      breed: '英短',
      healthCondition: ['肥胖']
    }
  }
];

export const surveyData: SurveyData[] = [
  // 满意度调查 (10条)
  {
    id: 's1',
    persona: personas[0],
    questionType: '满意度',
    question: '对当前宠物食品的整体满意度',
    answer: 8,
    answerText: '蛋白质含量高，布丁的毛发变得很顺滑',
    timestamp: new Date('2024-01-15')
  },
  {
    id: 's2',
    persona: personas[1],
    questionType: '满意度',
    question: '对宠物食品的营养搭配满意度',
    answer: 9,
    answerText: '关节养护效果明显，大黄活动量增加了',
    timestamp: new Date('2024-01-16')
  },
  {
    id: 's3',
    persona: personas[2],
    questionType: '满意度',
    question: '对宠物食品的价格性价比满意度',
    answer: 5,
    answerText: '价格有点贵，学生预算有限',
    timestamp: new Date('2024-01-17')
  },
  {
    id: 's4',
    persona: personas[3],
    questionType: '满意度',
    question: '对宠物食品的适口性满意度',
    answer: 7,
    answerText: '豆豆吃得还行，偶尔挑食',
    timestamp: new Date('2024-01-18')
  },
  {
    id: 's5',
    persona: personas[4],
    questionType: '满意度',
    question: '对宠物食品的健康改善效果满意度',
    answer: 9,
    answerText: '科学配方确实有效，毛球体重控制得不错',
    timestamp: new Date('2024-01-19')
  },
  {
    id: 's6',
    persona: personas[0],
    questionType: '满意度',
    question: '对宠物食品的成分透明度满意度',
    answer: 9,
    answerText: '成分表很清晰，无谷配方很安心',
    timestamp: new Date('2024-01-20')
  },
  {
    id: 's7',
    persona: personas[2],
    questionType: '满意度',
    question: '对宠物食品的品牌信任度',
    answer: 6,
    answerText: '听说过，但没太多实际体验',
    timestamp: new Date('2024-01-21')
  },
  {
    id: 's8',
    persona: personas[3],
    questionType: '满意度',
    question: '对宠物食品的包装满意度',
    answer: 8,
    answerText: '包装很精致，送人有面子',
    timestamp: new Date('2024-01-22')
  },
  {
    id: 's9',
    persona: personas[1],
    questionType: '满意度',
    question: '对宠物食品的配送服务满意度',
    answer: 7,
    answerText: '配送及时，包装完好',
    timestamp: new Date('2024-01-23')
  },
  {
    id: 's10',
    persona: personas[4],
    questionType: '满意度',
    question: '对宠物食品的客服服务满意度',
    answer: 8,
    answerText: '客服专业，解答了我的疑问',
    timestamp: new Date('2024-01-24')
  },

  // 购买意愿调查 (10条)
  {
    id: 's11',
    persona: personas[0],
    questionType: '购买意愿',
    question: '未来3个月购买同类产品的可能性',
    answer: 9,
    answerText: '肯定会继续购买，效果很好',
    timestamp: new Date('2024-01-25')
  },
  {
    id: 's12',
    persona: personas[1],
    questionType: '购买意愿',
    question: '是否会推荐给其他养宠人士',
    answer: 8,
    answerText: '会推荐给有关节问题的宠物主人',
    timestamp: new Date('2024-01-26')
  },
  {
    id: 's13',
    persona: personas[2],
    questionType: '购买意愿',
    question: '是否会考虑升级产品线',
    answer: 4,
    answerText: '价格太高了，暂时不考虑',
    timestamp: new Date('2024-01-27')
  },
  {
    id: 's14',
    persona: personas[3],
    questionType: '购买意愿',
    question: '是否会持续购买这个品牌',
    answer: 6,
    answerText: '看效果吧，暂时先试试',
    timestamp: new Date('2024-01-28')
  },
  {
    id: 's15',
    persona: personas[4],
    questionType: '购买意愿',
    question: '是否会尝试其他系列产品',
    answer: 8,
    answerText: '愿意尝试，这个品牌值得信赖',
    timestamp: new Date('2024-01-29')
  },
  {
    id: 's16',
    persona: personas[0],
    questionType: '购买意愿',
    question: '是否会增加购买频次',
    answer: 7,
    answerText: '可能会，看布丁的反应',
    timestamp: new Date('2024-01-30')
  },
  {
    id: 's17',
    persona: personas[2],
    questionType: '购买意愿',
    question: '是否会购买大包装以获得优惠',
    answer: 5,
    answerText: '预算有限，还是先买小包装',
    timestamp: new Date('2024-01-31')
  },
  {
    id: 's18',
    persona: personas[3],
    questionType: '购买意愿',
    question: '是否会关注促销活动',
    answer: 8,
    answerText: '经常关注，有活动就买',
    timestamp: new Date('2024-02-01')
  },
  {
    id: 's19',
    persona: personas[1],
    questionType: '购买意愿',
    question: '是否会购买配套保健品',
    answer: 7,
    answerText: '考虑购买，对关节保健有帮助',
    timestamp: new Date('2024-02-02')
  },
  {
    id: 's20',
    persona: personas[4],
    questionType: '购买意愿',
    question: '是否会订阅定期配送服务',
    answer: 9,
    answerText: '很方便，省时省力',
    timestamp: new Date('2024-02-03')
  },

  // 价格接受度调查 (5条)
  {
    id: 's21',
    persona: personas[0],
    questionType: '价格接受度',
    question: '对当前价格的接受程度',
    answer: 8,
    answerText: '价格合理，品质有保障',
    timestamp: new Date('2024-02-04')
  },
  {
    id: 's22',
    persona: personas[2],
    questionType: '价格接受度',
    question: '认为当前价格是否偏高',
    answer: 7,
    answerText: '确实偏高，学生党负担重',
    timestamp: new Date('2024-02-05')
  },
  {
    id: 's23',
    persona: personas[1],
    questionType: '价格接受度',
    question: '愿意支付的最高价格',
    answer: 9,
    answerText: '品质好，值得高价',
    timestamp: new Date('2024-02-06')
  },
  {
    id: 's24',
    persona: personas[3],
    questionType: '价格接受度',
    question: '对价格优惠的敏感度',
    answer: 9,
    answerText: '很敏感，没有优惠就不买',
    timestamp: new Date('2024-02-07')
  },
  {
    id: 's25',
    persona: personas[4],
    questionType: '价格接受度',
    question: '认为性价比如何',
    answer: 8,
    answerText: '物有所值，健康最重要',
    timestamp: new Date('2024-02-08')
  },

  // 成分关注点调查 (5条)
  {
    id: 's26',
    persona: personas[0],
    questionType: '成分关注点',
    question: '最关注的成分',
    answer: '蛋白质含量、益生菌',
    answerText: '高蛋白对猫很重要，益生菌助消化',
    timestamp: new Date('2024-02-09')
  },
  {
    id: 's27',
    persona: personas[1],
    questionType: '成分关注点',
    question: '最关注的成分',
    answer: '氨糖软骨素、维生素',
    answerText: '对关节健康很重要',
    timestamp: new Date('2024-02-10')
  },
  {
    id: 's28',
    persona: personas[2],
    questionType: '成分关注点',
    question: '最关注的成分',
    answer: '价格、基础营养',
    answerText: '主要保证基本营养即可',
    timestamp: new Date('2024-02-11')
  },
  {
    id: 's29',
    persona: personas[3],
    questionType: '成分关注点',
    question: '最关注的成分',
    answer: '品牌、外观',
    answerText: '大品牌放心，包装好看',
    timestamp: new Date('2024-02-12')
  },
  {
    id: 's30',
    persona: personas[4],
    questionType: '成分关注点',
    question: '最关注的成分',
    answer: '无谷配方、抗氧化剂',
    answerText: '科学配方，预防肥胖',
    timestamp: new Date('2024-02-13')
  }
];

export const interviewData: InterviewData[] = [
  {
    id: 'i1',
    persona: personas[0],
    question: '您选择宠物食品时最看重什么？',
    answer: '我特别看重成分表，会仔细看蛋白质含量、是否含有益生菌。布丁是玻璃胃，益生菌对它很重要。另外无谷配方也很重要，谷物容易引起过敏。虽然价格不便宜，但为了猫咪的健康，我觉得值得。',
    keywords: ['成分安全', '蛋白质含量', '益生菌', '无谷配方', '健康'],
    timestamp: new Date('2024-01-10'),
    duration: 15
  },
  {
    id: 'i2',
    persona: personas[1],
    question: '您对当前宠物食品有什么不满意的地方？',
    answer: '价格确实有点贵，2kg要328元。不过效果确实不错，大黄的关节问题有改善。希望能有更多优惠活动，比如买大包装送小包装，或者会员折扣。另外，包装可以再环保一点。',
    keywords: ['价格', '优惠活动', '包装', '关节养护', '性价比'],
    timestamp: new Date('2024-01-11'),
    duration: 20
  },
  {
    id: 'i3',
    persona: personas[2],
    question: '您认为宠物食品的合理价格是多少？',
    answer: '作为学生，我觉得50-80元/斤的价格比较合理。太贵了真的负担不起，小橘又健康，不需要那么高端的。有时候会打折促销的时候囤货，平时就买性价比高的。希望能有学生优惠。',
    keywords: ['价格敏感', '学生预算', '性价比', '促销', '囤货'],
    timestamp: new Date('2024-01-12'),
    duration: 12
  },
  {
    id: 'i4',
    persona: personas[3],
    question: '您是如何选择宠物食品品牌的？',
    answer: '主要看朋友推荐，还有网上的评价。豆豆牙齿不好，我就选了据说对牙齿好的。包装也要好看，有时候送朋友宠物礼物，包装精美一些显得有面子。价格适中就行，太便宜的不放心。',
    keywords: ['跟风购买', '朋友推荐', '包装', '牙齿健康', '面子'],
    timestamp: new Date('2024-01-13'),
    duration: 18
  },
  {
    id: 'i5',
    persona: personas[4],
    question: '您认为理想中的宠物食品应该具备什么特点？',
    answer: '首先是科学配比，蛋白质含量要高，添加剂要少。然后是适口性要好，毛球比较挑食。再者要有针对性，比如针对肥胖的配方。最后是品牌要可靠，最好有专业的营养师团队。价格不是主要因素，健康第一。',
    keywords: ['科学配方', '蛋白质', '适口性', '针对性', '品牌信任'],
    timestamp: new Date('2024-01-14'),
    duration: 25
  },
  {
    id: 'i6',
    persona: personas[0],
    question: '使用这款食品后，您注意到宠物有什么变化吗？',
    answer: '最明显的是布丁的毛发变得很顺滑，摸起来像丝绸一样。泪痕也有减轻，可能是无谷配方的原因。便便很正常，以前偶尔会软便，现在都是成形的。精神状态也更好了，以前比较懒，现在爱玩了。',
    keywords: ['毛发改善', '泪痕减轻', '消化正常', '精神状态', '无谷配方'],
    timestamp: new Date('2024-01-15'),
    duration: 15
  },
  {
    id: 'i7',
    persona: personas[1],
    question: '您是否会继续购买这款产品？为什么？',
    answer: '肯定会继续购买。大黄的关节问题确实有改善，以前上楼梯很费力，现在轻松多了。氨糖软骨素的效果很显著。虽然价格贵，但为了狗狗的健康，值得投资。希望以后能出更多针对性的产品。',
    keywords: ['关节改善', '氨糖软骨素', '忠诚度', '健康投资', '针对性'],
    timestamp: new Date('2024-01-16'),
    duration: 20
  },
  {
    id: 'i8',
    persona: personas[2],
    question: '您对宠物食品的包装有什么建议？',
    answer: '包装太大不方便存放，特别是对小户型的学生来说。最好是小包装，或者可重复密封的设计。袋装比罐装方便，但容易受潮。希望能有更环保的包装，减少塑料使用。价格可以再便宜点。',
    keywords: ['包装设计', '小包装', '环保', '储存方便', '价格'],
    timestamp: new Date('2024-01-17'),
    duration: 15
  },
  {
    id: 'i9',
    persona: personas[3],
    question: '您在购买宠物食品时遇到过什么问题？',
    answer: '主要是选择困难，太多品牌和种类了。有时候买错了豆豆不吃，很浪费。也不知道哪个真正适合，看广告觉得都好。希望能有更专业的指导，比如根据宠物年龄、健康状况推荐。还有保质期问题，要经常关注。',
    keywords: ['选择困难', '适口性', '浪费', '专业指导', '保质期'],
    timestamp: new Date('2024-01-18'),
    duration: 18
  },
  {
    id: 'i10',
    persona: personas[4],
    question: '您认为宠物食品行业有什么发展趋势？',
    answer: '我觉得会越来越科学化，针对不同品种、年龄、健康状况的定制化产品会越来越多。功能性食品会成为主流，比如针对肥胖、过敏、消化问题的。还有可能是人食级标准，更加安全透明。数字化服务也会增加，比如APP喂养建议。',
    keywords: ['科学化', '定制化', '功能性', '人食级标准', '数字化'],
    timestamp: new Date('2024-01-19'),
    duration: 22
  },
  {
    id: 'i11',
    persona: personas[0],
    question: '您如何判断一款宠物食品的好坏？',
    answer: '首先看成分表，蛋白质含量要高，前几位应该是肉类，而不是谷物。然后看添加剂，天然防腐剂优于化学防腐剂。再看营养成分是否均衡，维生素、矿物质要充足。最后看用户评价，特别是长期使用的效果。布丁的反应很重要，它爱吃才行。',
    keywords: ['成分表', '蛋白质', '添加剂', '营养成分', '适口性'],
    timestamp: new Date('2024-01-20'),
    duration: 20
  },
  {
    id: 'i12',
    persona: personas[1],
    question: '您对宠物食品的售后服务有什么期望？',
    answer: '希望有专业的营养师咨询，解答喂养问题。如果有过敏或不适，能有快速的处理方案。退换货政策要明确，万一有问题能及时处理。还有会员服务，比如定期体检建议、喂养指导。售后服务是建立信任的关键。',
    keywords: ['营养咨询', '过敏处理', '退换货', '会员服务', '信任'],
    timestamp: new Date('2024-01-21'),
    duration: 18
  },
  {
    id: 'i13',
    persona: personas[2],
    question: '您通常在哪里购买宠物食品？',
    answer: '主要在电商平台买，经常有折扣。偶尔去宠物店看看，但价格贵。拼多多上的性价比不错，要仔细看评价。也会等双十一、618囤货，能省不少钱。希望能有更多学生专属优惠。',
    keywords: ['电商平台', '价格优惠', '拼多多', '囤货', '学生优惠'],
    timestamp: new Date('2024-01-22'),
    duration: 15
  },
  {
    id: 'i14',
    persona: personas[3],
    question: '您对宠物食品的口味有什么要求？',
    answer: '主要看豆豆爱吃不吃，它比较挑食。有时候换口味会不吃，很头疼。味道不能太冲，豆豆不喜欢刺激的味道。软硬适中，方便咀嚼。希望能有多种口味可选，偶尔换换花样。适口性真的很重要。',
    keywords: ['适口性', '挑食', '口味', '换食', '口感'],
    timestamp: new Date('2024-01-23'),
    duration: 16
  },
  {
    id: 'i15',
    persona: personas[4],
    question: '您认为宠物食品的价格应该如何制定？',
    answer: '应该根据成本、品质、定位来定。高端产品贵一些可以理解，但要有相应的品质保证。中端产品是最多的，要平衡价格和品质。低端产品不能太便宜，以免影响健康。最好有不同规格，满足不同需求。价格透明很重要。',
    keywords: ['定价策略', '成本', '品质', '档次', '透明度'],
    timestamp: new Date('2024-01-24'),
    duration: 20
  },
  {
    id: 'i16',
    persona: personas[0],
    question: '您是否遇到过宠物食品质量问题？',
    answer: '遇到过几次，买了某品牌的猫粮，布丁吃完拉稀。后来仔细看才发现是谷物过敏，换了这个无谷配方就好多了。现在选择更谨慎了，会先看成分，小包装试吃。质量问题很严重，会影响宠物的健康。',
    keywords: ['质量问题', '过敏', '拉稀', '试吃', '谨慎选择'],
    timestamp: new Date('2024-01-25'),
    duration: 18
  },
  {
    id: 'i17',
    persona: personas[1],
    question: '您对宠物食品的保质期有什么要求？',
    answer: '新鲜很重要，生产日期要清晰。保质期至少1年以上，但最好是6个月内生产的。开封后要注意保存，防潮防氧化。最好有真空包装，保持新鲜。生产信息要透明，让消费者放心。',
    keywords: ['保质期', '新鲜度', '生产日期', '真空包装', '透明度'],
    timestamp: new Date('2024-01-26'),
    duration: 15
  },
  {
    id: 'i18',
    persona: personas[2],
    question: '您认为宠物食品最应该改进的地方是什么？',
    answer: '价格！对学生来说太贵了。希望有更多平价选择，或者小包装。还有成分不要太复杂，简单营养就好。包装要实用，不要太花哨。最重要的是性价比，让我们能持续购买。',
    keywords: ['价格', '平价', '简单成分', '实用包装', '性价比'],
    timestamp: new Date('2024-01-27'),
    duration: 12
  },
  {
    id: 'i19',
    persona: personas[3],
    question: '您是如何了解宠物食品信息的？',
    answer: '主要看短视频，那些宠物博主推荐。也会问养宠的朋友，他们有经验。宠物店员也会推荐，但感觉主要是想推销贵的。偶尔看一些专业文章，但看不太懂。最相信实际使用者的评价。',
    keywords: ['短视频', '博主推荐', '朋友经验', '宠物店', '用户评价'],
    timestamp: new Date('2024-01-28'),
    duration: 16
  },
  {
    id: 'i20',
    persona: personas[4],
    question: '您对宠物食品的未来有什么期待？',
    answer: '期待更科学的配方，根据宠物的基因、健康状况定制。希望能有实时监测设备，跟踪宠物的营养需求。还有可能是智能喂养系统，自动调配。最重要的是品质保证，让宠物健康快乐。',
    keywords: ['科学配方', '定制化', '智能监测', '自动喂养', '品质保证'],
    timestamp: new Date('2024-01-29'),
    duration: 20
  }
];

export const metricsTree: MetricNode = {
  id: 'root',
  name: '综合指标',
  value: 58.5,
  trend: 'stable',
  confidence: 0.85,
  evidence: '基于30份问卷和20份深度访谈的综合评分',
  children: [
    {
      id: 'purchase-intent',
      name: '购买意向',
      value: 58.5,
      trend: 'up',
      confidence: 0.88,
      evidence: '高意向28%、中意向45%、低意向27%的数据支持',
      children: [
        {
          id: 'price-acceptance',
          name: '价格接受度',
          value: 55,
          trend: 'stable',
          confidence: 0.75,
          evidence: '不同人群价格敏感度差异明显',
          children: [
            {
              id: 'premium-acceptance',
              name: '高端产品接受度',
              value: 60,
              trend: 'up',
              confidence: 0.7,
              evidence: '科学养宠型愿意为高品质付费'
            },
            {
              id: 'budget-sensitivity',
              name: '预算敏感性',
              value: 45,
              trend: 'stable',
              confidence: 0.8,
              evidence: '穷养型对价格高度敏感'
            }
          ]
        },
        {
          id: 'component-recognition',
          name: '成分认可度',
          value: 65,
          trend: 'up',
          confidence: 0.85,
          evidence: '成分关注度显著提升，蛋白质含量认可度高',
          children: [
            {
              id: 'protein-acceptance',
              name: '蛋白质含量认可',
              value: 70,
              trend: 'up',
              confidence: 0.8,
              evidence: '高蛋白需求明确，42%蛋白质获得认可'
            },
            {
              id: 'grain-free-acceptance',
              name: '无谷配方认可',
              value: 68,
              trend: 'up',
              confidence: 0.75,
              evidence: '无谷配方概念普及，健康诉求强烈'
            }
          ]
        }
      ]
    },
    {
      id: 'satisfaction',
      name: '产品满意度',
      value: 62,
      trend: 'up',
      confidence: 0.82,
      evidence: '整体满意度评分7.8/10，健康改善效果显著',
      children: [
        {
          id: 'health-effect',
          name: '健康改善效果',
          value: 70,
          trend: 'up',
          confidence: 0.85,
          evidence: '毛发改善、泪痕减轻、关节健康等正面反馈多',
          children: [
            {
              id: 'fur-improvement',
              name: '毛发改善认可',
              value: 75,
              trend: 'up',
              confidence: 0.8,
              evidence: '布偶猫毛发顺滑等实际效果反馈'
            },
            {
              id: 'joint-health',
              name: '关节健康改善',
              value: 68,
              trend: 'up',
              confidence: 0.75,
              evidence: '金毛活动量增加等积极效果'
            }
          ]
        },
        {
          id: 'palatability',
          name: '适口性满意度',
          value: 55,
          trend: 'stable',
          confidence: 0.7,
          evidence: '部分宠物挑食，适口性有待提升',
          children: [
            {
              id: 'picky-eater',
              name: '挑食问题',
              value: 45,
              trend: 'stable',
              confidence: 0.75,
              evidence: '英短、田园猫等存在挑食现象'
            },
            {
              id: 'flavor-variety',
              name: '口味多样性',
              value: 60,
              trend: 'up',
              confidence: 0.7,
              evidence: '多种口味需求增加'
            }
          ]
        }
      ]
    },
    {
      id: 'brand-trust',
      name: '品牌信任度',
      value: 55,
      trend: 'up',
      confidence: 0.8,
      evidence: '62%复购率，品牌认知度稳步提升',
      children: [
        {
          id: 'professional-recognition',
          name: '专业认可度',
          value: 62,
          trend: 'up',
          confidence: 0.75,
          evidence: '产品经理、金融分析师等专业人群认可度高',
          children: [
            {
              id: 'nutritionist-trust',
              name: '营养师信任',
              value: 65,
              trend: 'up',
              confidence: 0.7,
              evidence: '科学配方获得专业认可'
            },
            {
              id: 'quality-assurance',
              name: '品质保证信任',
              value: 58,
              trend: 'stable',
              confidence: 0.75,
              evidence: '质量控制体系逐步建立'
            }
          ]
        },
        {
          id: 'loyalty-index',
          name: '忠诚度指数',
          value: 58,
          trend: 'up',
          confidence: 0.85,
          evidence: '62%复购率，推荐意愿较强',
          children: [
            {
              id: 'repurchase-rate',
              name: '复购率',
              value: 62,
              trend: 'up',
              confidence: 0.9,
              evidence: '62%用户持续购买，证明产品忠诚度高'
            },
            {
              id: 'recommendation-rate',
              name: '推荐意愿',
              value: 55,
              trend: 'stable',
              confidence: 0.8,
              evidence: '中等推荐意愿，有提升空间'
            }
          ]
        }
      ]
    }
  ]
};

export const personaSegments: PersonaSegment[] = [
  {
    type: '科学养宠型',
    averageScore: 72,
    sampleSize: 8,
    keyInsights: [
      '成分关注度最高，蛋白质含量是首要考虑因素',
      '愿意为高品质支付溢价，价格敏感度低',
      '对无谷配方、益生菌等概念理解深入',
      '健康改善效果满意度最高，毛发改善明显',
      '品牌忠诚度高，复购意愿强'
    ],
    demographics: {
      ageRange: '25-35岁',
      genderDistribution: { male: 40, female: 60 },
      locations: ['上海', '深圳', '北京'],
      occupations: ['产品经理', '创业者', '金融分析师']
    }
  },
  {
    type: '精细养型',
    averageScore: 68,
    sampleSize: 6,
    keyInsights: [
      '关注特定功能需求，如关节养护',
      '理性消费，注重性价比',
      '品质要求高，但价格敏感度适中',
      '对氨糖软骨素等功能成分认可度高',
      '重视售后服务和专业建议'
    ],
    demographics: {
      ageRange: '30-45岁',
      genderDistribution: { male: 70, female: 30 },
      locations: ['北京', '广州', '上海'],
      occupations: ['金融分析师', '企业高管', '医生']
    }
  },
  {
    type: '跟风养型',
    averageScore: 55,
    sampleSize: 5,
    keyInsights: [
      '购买决策易受外部影响，依赖推荐',
      '关注包装和品牌知名度',
      '价格敏感度中等，追求性价比',
      '对成分了解有限，主要看效果',
      '促销活动敏感度高'
    ],
    demographics: {
      ageRange: '40-60岁',
      genderDistribution: { male: 30, female: 70 },
      locations: ['广州', '成都', '杭州'],
      occupations: ['退休教师', '家庭主妇', '公务员']
    }
  },
  {
    type: '穷养型',
    averageScore: 45,
    sampleSize: 11,
    keyInsights: [
      '价格是首要考虑因素，高度预算敏感',
      '基础营养需求为主，高端概念接受度低',
      '主要依赖电商平台，追求性价比',
      '对小包装偏好明显，降低单次购买压力',
      '对价格促销极度敏感'
    ],
    demographics: {
      ageRange: '18-30岁',
      genderDistribution: { male: 45, female: 55 },
      locations: ['成都', '武汉', '西安'],
      occupations: ['学生', '自由职业者', '刚入职员工']
    }
  }
];

export const aiInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: '机会',
    title: '高蛋白无谷配方需求强劲',
    description: '科学养宠型用户对高蛋白（42%）和无谷配方的需求持续增长，满意度达到70%。这类用户愿意为高品质支付溢价，是品牌的核心价值主张。',
    evidence: [
      '70%的用户对蛋白质含量认可',
      '68%的用户认可无谷配方',
      '科学养宠型用户满意度最高（72分）',
      '高意向人群中85%关注蛋白质含量'
    ],
    confidence: 0.85,
    impact: 'high',
    actionItems: [
      '保持高蛋白配方优势，强调42%蛋白质含量',
      '强化无谷配方营销，突出健康价值',
      '针对科学养宠型推出高端产品线'
    ]
  },
  {
    id: 'ai2',
    type: '风险',
    title: '适口性问题影响用户留存',
    description: '约30%的用户反映宠物存在挑食问题，适口性满意度仅为55分。这可能导致用户流失和复购率下降。',
    evidence: [
      '适口性满意度评分55/100',
      '挑食问题评分45/100',
      '部分用户因适口性考虑换品牌',
      '英短、田园猫等品种挑食现象明显'
    ],
    confidence: 0.8,
    impact: 'medium',
    actionItems: [
      '加强适口性研发，引入风味增强技术',
      '提供试吃装，降低试错成本',
      '开发针对挑食宠物的专用配方'
    ]
  },
  {
    id: 'ai3',
    type: '优势',
    title: '健康改善效果显著形成口碑',
    description: '产品在健康改善方面表现出色，毛发改善、关节健康等效果获得用户认可，形成良好的口碑效应。',
    evidence: [
      '健康改善效果满意度70分',
      '毛发改善认可度75分',
      '关节健康改善认可度68分',
      '62%用户表示会继续购买'
    ],
    confidence: 0.88,
    impact: 'high',
    actionItems: [
      '强化健康效果的案例展示',
      '收集并分享用户成功案例',
      '突出功能性成分的作用机制'
    ]
  },
  {
    id: 'ai4',
    type: '趋势',
    title: '个性化定制需求日益凸显',
    description: '用户对针对特定品种、年龄、健康状况的定制化产品需求增长，个性化将成为未来竞争的关键点。',
    evidence: [
      '不同人群需求差异明显',
      '功能性食品关注度提升',
      '用户对针对性解决方案需求强烈',
      '定制化概念在高端用户中接受度高'
    ],
    confidence: 0.75,
    impact: 'high',
    actionItems: [
      '开发针对不同品种的专用配方',
      '建立用户画像和产品匹配系统',
      '推出个性化营养方案服务'
    ]
  },
  {
    id: 'ai5',
    type: '机会',
    title: '学生市场潜力巨大',
    description: '穷养型用户（主要为学生）占比最高（37%），但满意度最低。通过平价策略和渠道优化，可大幅提升市场占有率。',
    evidence: [
      '穷养型用户样本量最大（11人）',
      '学生群体价格敏感度极高',
      '电商平台是主要购买渠道',
      '小包装偏好明显'
    ],
    confidence: 0.8,
    impact: 'high',
    actionItems: [
      '推出学生专享优惠和套餐',
      '增加小包装规格选项',
      '加强电商平台的营销力度'
    ]
  },
  {
    id: 'ai6',
    type: '风险',
    title: '品牌认知度有待提升',
    description: '品牌信任度仅为55分，在跟风养型用户中认知度不足。品牌建设需要投入更多资源。',
    evidence: [
      '品牌信任度评分55/100',
      '跟风养型用户依赖外部推荐',
      '新品牌进入门槛相对较低',
      '品牌差异化不够明显'
    ],
    confidence: 0.75,
    impact: 'medium',
    actionItems: [
      '加强品牌故事和价值主张传播',
      '与KOL合作提升品牌影响力',
      '突出专业背书和品质保证'
    ]
  },
  {
    id: 'ai7',
    type: '优势',
    title: '复购率表现优异',
    description: '62%的复购率远高于行业平均水平，表明产品粘性强，用户忠诚度高，为持续增长奠定基础。',
    evidence: [
      '复购率达到62%',
      '科学养宠型用户忠诚度极高',
      '健康效果是持续购买的核心驱动力',
      '产品功效得到实际验证'
    ],
    confidence: 0.9,
    impact: 'high',
    actionItems: [
      '建立会员体系，提升用户粘性',
      '推出订阅制服务，锁定长期用户',
      '优化复购激励政策'
    ]
  },
  {
    id: 'ai8',
    type: '趋势',
    title: '数字化服务需求增长',
    description: '用户对智能化喂养、健康监测等数字化服务需求增长，单一产品向服务化转型趋势明显。',
    evidence: [
      '用户期望智能喂养系统',
      '健康监测需求增加',
      '专业咨询需求强烈',
      '移动互联网使用频率高'
    ],
    confidence: 0.7,
    impact: 'medium',
    actionItems: [
      '开发移动应用提供喂养指导',
      '建立用户健康档案系统',
      '推出线上营养咨询服务'
    ]
  },
  {
    id: 'ai9',
    type: '机会',
    title: '关节养护市场空白',
    description: '5岁以上宠物关节问题普遍，但专门针对关节养护的产品不多，市场机会明显，可成为新的增长点。',
    evidence: [
      '金毛等大型犬关节问题普遍',
      '关节养护产品满意度68分',
      '氨糖软骨素成分认可度高',
      '中老年宠物主人需求强烈'
    ],
    confidence: 0.85,
    impact: 'high',
    actionItems: [
      '推出专门的关节养护产品线',
      '强调氨糖软骨素的功效',
      '针对老年宠物开发专属配方'
    ]
  },
  {
    id: 'ai10',
    type: '风险',
    title: '价格压力持续存在',
    description: '虽然目标用户对价格敏感度可控，但整体市场对价格仍有较高期望，过高的定价可能限制市场扩张。',
    evidence: [
      '价格接受度评分55分',
      '学生群体预算有限',
      '性价比是重要考虑因素',
      '促销活动敏感性高'
    ],
    confidence: 0.8,
    impact: 'medium',
    actionItems: [
      '优化成本结构，保持合理利润率',
      '推出多档次产品线满足不同需求',
      '灵活运用促销策略'
    ]
  }
];