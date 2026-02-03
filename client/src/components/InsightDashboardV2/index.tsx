/**
 * Insight Dashboard V2.0
 * 基于真实业务数据的洞察仪表盘
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  MessageSquare,
  Grid3x3,
} from 'lucide-react';
import { RawResults } from './modules/RawResults';
import { DeepAnalysis } from './modules/DeepAnalysis';
import { AIInteraction } from './modules/AIInteraction';
import {
  surveyData as mockSurveyData,
  interviewData as mockInterviewData,
  metricsTree as mockMetricTree,
  personaSegments as mockPersonaSegments,
  aiInsights as mockAIInsights,
} from '@/data/insightDashboardMock';

export default function InsightDashboardV2() {
  const [activeTab, setActiveTab] = useState<'raw' | 'analysis' | 'ai'>('raw');

  // 转换数据格式以适配组件接口
  const questionnaireData = {
    questions: [
      {
        id: 'q1',
        text: '您对"鲜萃高蛋白全价猫粮"的整体满意度如何？',
        type: 'rating' as const,
        options: undefined,
        targetPersonaType: 'user',
      },
      {
        id: 'q2',
        text: '您最关注产品的哪个方面？',
        type: 'single-choice' as const,
        options: ['蛋白质含量', '成分安全性', '价格', '品牌知名度'],
        targetPersonaType: 'user',
      },
      {
        id: 'q3',
        text: '您认为268元/1.5kg的价格如何？',
        type: 'single-choice' as const,
        options: ['很便宜', '合理', '有点贵', '太贵了'],
        targetPersonaType: 'user',
      },
    ],
    responses: mockSurveyData.map((data, index) => ({
      id: `qr${index}`,
      questionId: 'q1',
      respondentId: data.persona.id,
      personaType: data.persona.petPersonality,
      segment: data.persona.petPersonality,
      answer: typeof data.answer === 'number' ? data.answer : data.answerText || '',
      timestamp: data.timestamp,
      sentiment:
        typeof data.answer === 'number'
          ? data.answer >= 4
            ? 'positive' as const
            : data.answer === 3
              ? 'neutral' as const
              : 'negative' as const
          : 'neutral' as const,
    })),
  };

  const interviewData = {
    responses: mockInterviewData.map((data, index) => ({
      id: `ir${index}`,
      interviewId: `int${index}`,
      respondentId: data.persona.id,
      personaType: data.persona.petPersonality,
      segment: data.persona.petPersonality,
      question: data.question,
      answer: data.answer,
      timestamp: data.timestamp,
      sentiment: 'neutral' as const,
      keywords: data.keywords,
      topics: [data.persona.petPersonality],
      confidence: 0.8,
    })),
  };

  const crossAnalysisData = {
    data: mockPersonaSegments.map((seg) => ({
      id: seg.type,
      dimension1: seg.type,
      dimension2: '全部',
      metric: '平均得分',
      value: seg.averageScore,
      count: seg.sampleSize,
      timestamp: new Date(),
    })),
    dimensions: {
      dimension1: '人群类型',
      dimension2: '细分',
      metric: '平均得分',
    },
  };

  const segmentMetrics: Array<{
    segmentId: string;
    segmentName: string;
    metricName: string;
    value: number;
    sampleSize: number;
  }> = mockPersonaSegments.map((seg) => ({
    segmentId: seg.type,
    segmentName: seg.type,
    metricName: '平均得分',
    value: seg.averageScore,
    sampleSize: seg.sampleSize,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>洞察仪表盘</CardTitle>
          <p className="text-sm text-muted-foreground">
            基于10,000+虚拟消费者测试结果的数据分析与洞察
          </p>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="raw">
            <FileText className="w-4 h-4 mr-2" />
            原始数据
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <MessageSquare className="w-4 h-4 mr-2" />
            深度分析
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Grid3x3 className="w-4 h-4 mr-2" />
            智能洞察
          </TabsTrigger>
        </TabsList>

        <TabsContent value="raw" className="mt-6">
          <RawResults
            questionnaireData={questionnaireData}
            interviewData={interviewData}
            crossAnalysisData={crossAnalysisData}
          />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <DeepAnalysis
            metrics={mockMetricTree as any}
            segmentMetrics={segmentMetrics}
            segmentInsights={mockPersonaSegments.map((seg) => ({
              segmentId: seg.type,
              segmentName: seg.type,
              insight: seg.keyInsights[0] || '',
              strength: seg.averageScore >= 60 ? 'positive' : 'negative',
              confidence: 0.8,
            }))}
            segments={mockPersonaSegments.map((s) => s.type)}
          />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AIInteraction
            selectedText={null}
            queryInsights={async () => ({
              answer: mockAIInsights[0]?.description || '',
              sources: [],
              confidence: mockAIInsights[0]?.confidence || 0.8,
            })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
