/**
 * Question Library Component
 * Provides pre-configured question templates
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import type { InterviewQuestion } from '@/config-system/types/project';

export interface QuestionLibraryProps {
  onQuestionSelect: (question: InterviewQuestion) => void;
  industryId?: string;
}

const QUESTION_TEMPLATES: Record<string, InterviewQuestion[]> = {
  'pet-food': [
    {
      id: 'template_1',
      text: '您对这个宠粮品牌的信任度如何？',
      type: 'rating',
      order: 0,
      required: true,
      scoringWeight: 0.8,
      targetPersonaType: 'owner',
    },
    {
      id: 'template_2',
      text: '您最关注宠粮的哪些方面？',
      type: 'multiple-choice',
      order: 1,
      required: true,
      options: ['营养成分', '口味', '价格', '品牌信誉', '宠物接受度'],
      targetPersonaType: 'owner',
    },
    {
      id: 'template_3',
      text: '您的宠物对这个产品的反应如何？',
      type: 'single-choice',
      order: 2,
      required: true,
      options: ['非常喜欢', '比较喜欢', '一般', '不喜欢'],
      targetPersonaType: 'pet',
    },
    {
      id: 'template_4',
      text: '您认为这个产品的主要优势是什么？',
      type: 'open-ended',
      order: 3,
      required: false,
      targetPersonaType: 'owner',
    },
  ],
  'beauty': [
    {
      id: 'template_5',
      text: '您的肌肤类型是？',
      type: 'single-choice',
      order: 0,
      required: true,
      options: ['干性', '油性', '混合性', '敏感性'],
      targetPersonaType: 'user',
    },
    {
      id: 'template_6',
      text: '您最关心的肌肤问题是？',
      type: 'multiple-choice',
      order: 1,
      required: true,
      options: ['保湿', '美白', '抗衰', '祛痘', '敏感修护'],
      targetPersonaType: 'user',
    },
    {
      id: 'template_7',
      text: '您对这个护肤品的购买意向如何？',
      type: 'rating',
      order: 2,
      required: true,
      scoringWeight: 0.9,
      targetPersonaType: 'user',
    },
  ],
};

export function QuestionLibrary({ onQuestionSelect, industryId = 'pet-food' }: QuestionLibraryProps) {
  const templates = QUESTION_TEMPLATES[industryId] || QUESTION_TEMPLATES['pet-food'];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'single-choice': '单选',
      'multiple-choice': '多选',
      'open-ended': '开放',
      'rating': '评分',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'single-choice': 'bg-blue-500',
      'multiple-choice': 'bg-green-500',
      'open-ended': 'bg-purple-500',
      'rating': 'bg-orange-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">问题模板库</h3>
        <Badge variant="secondary">{templates.length} 个模板</Badge>
      </div>

      <div className="grid gap-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTypeColor(template.type)}>
                      {getTypeLabel(template.type)}
                    </Badge>
                    {template.targetPersonaType && (
                      <Badge variant="outline">{template.targetPersonaType}</Badge>
                    )}
                    {template.required && (
                      <Badge variant="destructive">必填</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{template.text}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuestionSelect({ ...template, id: `q_${Date.now()}` })}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  添加
                </Button>
              </div>
            </CardHeader>

            {template.options && template.options.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.options.map((option, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {index + 1}. {option}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}

            {template.scoringWeight && (
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  评分权重: {(template.scoringWeight * 100).toFixed(0)}%
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
