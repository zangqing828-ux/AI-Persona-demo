/**
 * Response Card Component
 * Displays individual questionnaire response with expandable details
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface Question {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'open-ended' | 'rating';
  options?: string[];
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  respondentId: string;
  personaType: string;
  segment?: string;
  answer: string | string[] | number;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ResponseCardProps {
  question?: Question;
  response: QuestionResponse;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function ResponseCard({
  question,
  response,
  isExpanded,
  onToggleExpand,
}: ResponseCardProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getSentimentLabel = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '正面';
      case 'negative':
        return '负面';
      case 'neutral':
        return '中性';
      default:
        return '未标记';
    }
  };

  const formatAnswer = (answer: string | string[] | number, questionType?: string) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }

    if (questionType === 'rating' && typeof answer === 'number') {
      return '⭐'.repeat(answer) + '☆'.repeat(5 - answer);
    }

    return String(answer);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{response.personaType}</Badge>
              {response.segment && <Badge variant="secondary">{response.segment}</Badge>}
              <Badge
                variant="outline"
                className={getSentimentColor(response.sentiment)}
              >
                {getSentimentLabel(response.sentiment)}
              </Badge>
            </div>

            {question && (
              <h3 className="text-base font-semibold pr-8">{question.text}</h3>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{response.respondentId}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {format(new Date(response.timestamp), 'yyyy-MM-dd HH:mm', {
                    locale: zhCN,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 border-t">
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">回复内容</p>
              <p className="text-base leading-relaxed">
                {formatAnswer(response.answer, question?.type)}
              </p>
            </div>

            {question?.options && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  可选答案
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option, index) => {
                    const isSelected = Array.isArray(response.answer)
                      ? response.answer.includes(option)
                      : response.answer === option;

                    return (
                      <Badge
                        key={index}
                        variant={isSelected ? 'default' : 'outline'}
                        className={isSelected ? '' : 'opacity-50'}
                      >
                        {option}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {question?.type === 'rating' && typeof response.answer === 'number' && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">评分</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">
                    {formatAnswer(response.answer, question.type)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    / 5 分
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">问题 ID</p>
                  <p className="font-mono text-xs">{response.questionId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">回复 ID</p>
                  <p className="font-mono text-xs">{response.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
