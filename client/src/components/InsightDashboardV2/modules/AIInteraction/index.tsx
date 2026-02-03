/**
 * AI Interaction Module
 * Chat interface for AI-powered insights
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { ChatInterface, RAGQuery, RAGResult } from './ChatInterface';
import { SelectionTracker } from './SelectionTracker';

export interface AIInteractionProps {
  selectedText?: string | null;
  queryInsights?: (query: RAGQuery) => Promise<RAGResult>;
}

export function AIInteraction({
  selectedText,
  queryInsights,
}: AIInteractionProps) {
  const [trackedSelections, setTrackedSelections] = useState<string[]>([]);

  const mockQueryInsights = async (query: RAGQuery): Promise<RAGResult> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      answer: `基于调研数据分析，${query.query}\n\n根据10,000个虚拟消费者的测试结果，我们发现：\n\n1. 购买意向分布：高意向28%、中意向45%、低意向27%\n2. 核心目标人群是"科学养宠型"（平均分72分）\n3. 主要顾虑：价格偏高（42%）、品牌知名度（35%）、成分透明度（28%）\n\n建议：强化成分安全卖点，提供试吃装降低尝试门槛`,
      sources: [],
      confidence: 0.85,
    };
  };

  const queryFunction = queryInsights || mockQueryInsights;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI 洞察助手</CardTitle>
          <p className="text-sm text-muted-foreground">
            基于调研数据的智能分析与洞察
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatInterface queryInsights={queryFunction} selectedText={selectedText} />
        </div>
        <div>
          <SelectionTracker
            onSelection={(selection) => {
              console.log('Selection tracked:', selection);
              setTrackedSelections(prev => [...prev, selection.text]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AIInteraction;
