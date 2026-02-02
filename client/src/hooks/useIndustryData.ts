/**
 * useIndustryData Hook
 * 根据当前行业动态加载对应的数据
 */

import { useMemo } from 'react';
import { useIndustryConfig } from './useIndustryConfig';

// Import industry-specific data
import { testProducts as petFoodProducts } from '../data/petFoodSimulation';
import { testProducts as beautyTestProducts } from '@platform/industries/beauty/data/products.js';

export function useIndustryData() {
  const { industryId } = useIndustryConfig();

  // 根据行业选择对应的产品数据
  const products = useMemo(() => {
    switch (industryId) {
      case 'pet-food':
        return petFoodProducts;
      case 'beauty':
        return beautyTestProducts;
      default:
        return petFoodProducts;
    }
  }, [industryId]);

  // 根据行业选择对应的工作流步骤
  const workflowSteps = useMemo(() => {
    switch (industryId) {
      case 'pet-food':
        return [
          { id: 1, name: '概念测试配置', description: '上传产品信息，配置测试参数', icon: 'Settings' },
          { id: 2, name: '客群选择', description: '从CDP选择或创建目标人群', icon: 'Users' },
          { id: 3, name: '双视角画像生成', description: '构建主人+宠物双视角画像', icon: 'UserCircle' },
          { id: 4, name: '双视角模拟', description: '主人和宠物的双视角决策模拟', icon: 'Brain' },
          { id: 5, name: '互动分析', description: '主宠互动场景分析', icon: 'LineChart' },
          { id: 6, name: '批量访谈', description: '10,000+ 虚拟消费者批量测试', icon: 'BarChart' },
          { id: 7, name: '洞察仪表盘', description: '量化看板 + 质化反馈', icon: 'PieChart' },
        ];
      case 'beauty':
        return [
          { id: 1, name: '概念测试配置', description: '上传产品信息，配置测试参数', icon: 'Settings' },
          { id: 2, name: '客群选择', description: '从CDP选择或创建目标人群', icon: 'Users' },
          { id: 3, name: '用户画像生成', description: '构建用户画像', icon: 'UserCircle' },
          { id: 4, name: '购买模拟', description: '模拟用户购买决策过程', icon: 'Brain' },
          { id: 5, name: '批量访谈', description: '10,000+ 虚拟消费者批量测试', icon: 'BarChart' },
          { id: 6, name: '洞察仪表盘', description: '量化看板 + 质化反馈', icon: 'PieChart' },
        ];
      default:
        return [];
    }
  }, [industryId]);

  return {
    products,
    workflowSteps,
    currentIndustry: industryId,
  };
}
