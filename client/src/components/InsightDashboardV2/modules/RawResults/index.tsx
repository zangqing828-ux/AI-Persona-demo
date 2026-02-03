/**
 * Raw Results Module
 * Main entry point for questionnaire and interview results display
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MessageSquare, Grid3x3 } from 'lucide-react';
import { QuestionnaireResults, QuestionnaireResultsProps } from './QuestionnaireResults';
import { InterviewResults, InterviewResultsProps } from './InterviewResults';
import { CrossAnalysis, CrossAnalysisProps } from './CrossAnalysis';
import { exportData } from './export-utils';

export interface RawResultsProps {
  questionnaireData: QuestionnaireResultsProps;
  interviewData: InterviewResultsProps;
  crossAnalysisData: CrossAnalysisProps;
  onTextSelection?: (text: string) => void;
}

export function RawResults({
  questionnaireData,
  interviewData,
  crossAnalysisData,
  onTextSelection,
}: RawResultsProps) {
  const [activeTab, setActiveTab] = useState<'questionnaire' | 'interview' | 'cross'>('questionnaire');

  const handleQuestionnaireExport = (format: 'csv' | 'json' | 'xlsx') => {
    const data = questionnaireData.responses.map(r => ({
      回复ID: r.id,
      问题ID: r.questionId,
      用户画像: r.personaType,
      细分人群: r.segment || '未分类',
      回复: typeof r.answer === 'object' ? r.answer.join(', ') : r.answer,
      情感: r.sentiment || '未标记',
      时间: r.timestamp,
    }));

    exportData(data, format, `questionnaire-results-${format}`);
  };

  const handleInterviewExport = (format: 'csv' | 'json' | 'xlsx') => {
    const data = interviewData.responses.map(r => ({
      访谈ID: r.id,
      用户画像: r.personaType,
      细分人群: r.segment || '未分类',
      问题: r.question,
      回复: r.answer,
      关键词: r.keywords?.join(', ') || '',
      话题: r.topics?.join(', ') || '',
      情感: r.sentiment || '未标记',
      置信度: r.confidence || 0,
      时间: r.timestamp,
    }));

    exportData(data, format, `interview-results-${format}`);
  };

  const handleCrossAnalysisExport = (format: 'csv' | 'json' | 'xlsx') => {
    const data = crossAnalysisData.data.map(d => ({
      维度1: d.dimension1,
      维度2: d.dimension2,
      指标: d.metric,
      值: d.value,
      样本数: d.count,
    }));

    exportData(data, format, `cross-analysis-${format}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>原始研究数据</CardTitle>
          <CardDescription>
            查看和分析问卷、访谈及交叉分析数据
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questionnaire">
            <FileText className="w-4 h-4 mr-2" />
            问卷结果
          </TabsTrigger>
          <TabsTrigger value="interview">
            <MessageSquare className="w-4 h-4 mr-2" />
            访谈记录
          </TabsTrigger>
          <TabsTrigger value="cross">
            <Grid3x3 className="w-4 h-4 mr-2" />
            交叉分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionnaire" className="mt-6">
          <QuestionnaireResults
            {...questionnaireData}
            onExport={handleQuestionnaireExport}
          />
        </TabsContent>

        <TabsContent value="interview" className="mt-6">
          <InterviewResults
            {...interviewData}
            onExport={handleInterviewExport}
          />
        </TabsContent>

        <TabsContent value="cross" className="mt-6">
          <CrossAnalysis {...crossAnalysisData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RawResults;

// Re-export types for convenience
export type {
  Question,
  QuestionResponse,
} from './QuestionnaireResults';

export type {
  InterviewResponse,
} from './InterviewResults';

export type {
  AnalysisDataPoint,
} from './CrossAnalysis';
