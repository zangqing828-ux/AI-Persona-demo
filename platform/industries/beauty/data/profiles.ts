/**
 * Beauty Industry - Sample Profiles Data
 * User profiles for beauty/skincare simulation
 */

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: '女' | '男';
  city: string;
  occupation: string;
  income: '低' | '中' | '高' | '高净值';
  skinType: '干性' | '油性' | '混合性' | '敏感性';
  concerns: string[];
  budgetRange: string;
  purchaseChannels: string[];
  beautyRoutine: '基础' | '进阶' | '精致';
  socialPlatforms: string[];
}

/** 用户样本数据 */
export const userProfiles: UserProfile[] = [
  {
    id: 'U001',
    name: '林小雅',
    age: 26,
    gender: '女',
    city: '上海',
    occupation: '市场经理',
    income: '高',
    skinType: '混合性',
    concerns: ['痘痘', '美白', '毛孔粗大'],
    budgetRange: '500-1000元/月',
    purchaseChannels: ['天猫', '小红书', '丝芙兰'],
    beautyRoutine: '进阶',
    socialPlatforms: ['小红书', '抖音', '微博'],
  },
  {
    id: 'U002',
    name: '陈静',
    age: 35,
    gender: '女',
    city: '北京',
    occupation: '律师',
    income: '高净值',
    skinType: '干性',
    concerns: ['抗衰', '保湿', '细纹'],
    budgetRange: '2000元以上/月',
    purchaseChannels: ['专柜', '海淘', '高端SPA'],
    beautyRoutine: '精致',
    socialPlatforms: ['微信', '小红书'],
  },
  {
    id: 'U003',
    name: '王芳',
    age: 22,
    gender: '女',
    city: '武汉',
    occupation: '应届毕业生',
    income: '低',
    skinType: '油性',
    concerns: ['痘痘', '控油', '黑头'],
    budgetRange: '200元以下/月',
    purchaseChannels: ['拼多多', '淘宝', '屈臣氏'],
    beautyRoutine: '基础',
    socialPlatforms: ['抖音', 'B站', '小红书'],
  },
  {
    id: 'U004',
    name: '刘敏',
    age: 42,
    gender: '女',
    city: '深圳',
    occupation: '医生',
    income: '高',
    skinType: '敏感性',
    concerns: ['敏感', '保湿', '泛红'],
    budgetRange: '800-1500元/月',
    purchaseChannels: ['医院', '天猫国际', '专柜'],
    beautyRoutine: '精致',
    socialPlatforms: ['知乎', '微信', '小红书'],
  },
  {
    id: 'U005',
    name: '赵莉',
    age: 29,
    gender: '女',
    city: '杭州',
    occupation: '设计师',
    income: '中',
    skinType: '混合性',
    concerns: ['美白', '色斑', '熬夜'],
    budgetRange: '300-600元/月',
    purchaseChannels: ['天猫', '京东', '小红书'],
    beautyRoutine: '进阶',
    socialPlatforms: ['小红书', '微博', 'B站'],
  },
];
