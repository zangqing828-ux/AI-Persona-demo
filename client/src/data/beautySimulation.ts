/**
 * Beauty Industry Simulation Data
 * CDP tags, user profiles, and simulation results for beauty industry
 */

export interface CDPTag {
  id: string;
  label: string;
  count: number;
}

// CDP Tags for Beauty Industry
export const beautyCDPTags: Record<string, CDPTag[]> = {
  skinType: [
    { id: 'dry', label: '干性肌肤', count: 2800 },
    { id: 'oily', label: '油性肌肤', count: 3200 },
    { id: 'combination', label: '混合性肌肤', count: 4500 },
    { id: 'sensitive', label: '敏感性肌肤', count: 2500 },
  ],
  concerns: [
    { id: 'acne', label: '痘痘', count: 3800 },
    { id: 'whitening', label: '美白', count: 4200 },
    { id: 'anti_aging', label: '抗衰', count: 3500 },
    { id: 'sensitive', label: '敏感', count: 2500 },
    { id: 'moisturizing', label: '保湿', count: 4800 },
    { id: 'oil_control', label: '控油', count: 2800 },
    { id: 'pores', label: '毛孔粗大', count: 3200 },
    { id: 'spots', label: '色斑', count: 2100 },
  ],
  beautyRoutine: [
    { id: 'basic', label: '基础护肤', count: 4500 },
    { id: 'advanced', label: '进阶护肤', count: 3800 },
    { id: 'refined', label: '精致护肤', count: 2700 },
  ],
  income: [
    { id: 'low', label: '低收入', count: 3200 },
    { id: 'medium', label: '中等收入', count: 4800 },
    { id: 'high', label: '高收入', count: 2200 },
    { id: 'high_net_worth', label: '高净值', count: 800 },
  ],
  ageGroup: [
    { id: 'young', label: '18-25岁', count: 2500 },
    { id: 'adult', label: '26-35岁', count: 4200 },
    { id: 'middle', label: '36-45岁', count: 2800 },
    { id: 'senior', label: '46岁以上', count: 1500 },
  ],
};

// Advanced filters for beauty industry
export const beautyAdvancedFilters = [
  { id: 'newUser', label: '仅新用户（注册<30天）' },
  { id: 'activeUser', label: '活跃用户（30天内有购买）' },
  { id: 'vip', label: 'VIP会员' },
  { id: 'kolFollower', label: 'KOL关注者' },
];
