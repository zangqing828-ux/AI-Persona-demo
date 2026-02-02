/**
 * Beauty Industry - Product Data
 * Test products for simulation
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  size: string;
  targetSkin: string[];
  mainIngredients: string[];
  benefits: string[];
  packaging: string;
  certifications: string[];
}

/** 待测产品 */
export const testProducts: Product[] = [
  {
    id: 'BEAU001',
    name: '维C焕亮精华液',
    brand: '肌研社',
    category: '精华液',
    price: 298,
    size: '30ml',
    targetSkin: ['所有肤质', '暗沉肌肤', '色斑肌肤'],
    mainIngredients: ['维生素C', '烟酰胺', '透明质酸', '熊果苷'],
    benefits: ['提亮肤色', '淡化色斑', '抗氧化', '保湿'],
    packaging: '深色避光滴管瓶',
    certifications: ['GMPC认证', '无动物实验'],
  },
  {
    id: 'BEAU002',
    name: '视黄醇抗晚霜',
    brand: '肌研社',
    category: '面霜',
    price: 368,
    size: '50g',
    targetSkin: ['所有肤质', '初老肌肤', '细纹肌肤'],
    mainIngredients: ['视黄醇', '肽类', '神经酰胺', '角鲨烷'],
    benefits: ['抗衰老', '淡化细纹', '紧致肌肤', '修护屏障'],
    packaging: '真空压泵瓶',
    certifications: ['GMPC认证', '皮肤科测试'],
  },
];
