/**
 * Questionnaire Results Component
 * Displays survey/questionnaire data with filtering capabilities
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { ResponseCard } from './ResponseCard';

export interface Question {
  id: string;
  text: string;
  type: 'single-choice' | 'multiple-choice' | 'open-ended' | 'rating';
  options?: string[];
  targetPersonaType?: string;
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

export interface QuestionnaireResultsProps {
  questions: Question[];
  responses: QuestionResponse[];
  onExport?: (format: 'csv' | 'json' | 'xlsx') => void;
}

export function QuestionnaireResults({
  questions,
  responses,
  onExport,
}: QuestionnaireResultsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('all');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  // Get unique values for filters
  const personaTypes = useMemo(() => {
    return Array.from(new Set(responses.map(r => r.personaType)));
  }, [responses]);

  const segments = useMemo(() => {
    return Array.from(new Set(responses.map(r => r.segment).filter(Boolean))) as string[];
  }, [responses]);

  // Filter responses
  const filteredResponses = useMemo(() => {
    return responses.filter(response => {
      if (selectedQuestion !== 'all' && response.questionId !== selectedQuestion) return false;
      if (selectedPersona !== 'all' && response.personaType !== selectedPersona) return false;
      if (selectedSegment !== 'all' && response.segment !== selectedSegment) return false;
      if (selectedSentiment !== 'all' && response.sentiment !== selectedSentiment) return false;

      if (searchTerm) {
        const question = questions.find(q => q.id === response.questionId);
        const questionText = question?.text.toLowerCase() || '';
        const answerText = String(response.answer).toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        if (!questionText.includes(searchLower) && !answerText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [responses, selectedQuestion, selectedPersona, selectedSegment, selectedSentiment, searchTerm, questions]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = responses.length;
    const sentimentCounts = responses.reduce((acc, r) => {
      if (r.sentiment) {
        acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      positive: sentimentCounts.positive || 0,
      neutral: sentimentCounts.neutral || 0,
      negative: sentimentCounts.negative || 0,
      filtered: filteredResponses.length,
    };
  }, [responses, filteredResponses]);

  const toggleExpand = (responseId: string) => {
    setExpandedResponses(prev => {
      const next = new Set(prev);
      if (next.has(responseId)) {
        next.delete(responseId);
      } else {
        next.add(responseId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedResponses(new Set(filteredResponses.map(r => r.id)));
  };

  const collapseAll = () => {
    setExpandedResponses(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">总回复数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">正面情感</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.positive / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">中性情感</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.neutral / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">负面情感</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.negative / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>筛选条件</CardTitle>
              <CardDescription>过滤和分析问卷回复</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                全部展开
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                全部折叠
              </Button>
              {onExport && (
                <Button size="sm" onClick={() => onExport('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>搜索</Label>
              <Input
                placeholder="搜索问题或回复..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>问题</Label>
              <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                <SelectTrigger>
                  <SelectValue placeholder="选择问题" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部问题</SelectItem>
                  {questions.map(q => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.text.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>用户画像</Label>
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger>
                  <SelectValue placeholder="选择画像" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部画像</SelectItem>
                  {personaTypes.map(persona => (
                    <SelectItem key={persona} value={persona}>
                      {persona}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>细分人群</Label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="选择细分" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部细分</SelectItem>
                  {segments.map(segment => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>情感倾向</Label>
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger>
                  <SelectValue placeholder="选择情感" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部情感</SelectItem>
                  <SelectItem value="positive">正面</SelectItem>
                  <SelectItem value="neutral">中性</SelectItem>
                  <SelectItem value="negative">负面</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              显示 {stats.filtered} / {stats.total} 条回复
            </p>
            {(selectedQuestion !== 'all' ||
              selectedPersona !== 'all' ||
              selectedSegment !== 'all' ||
              selectedSentiment !== 'all' ||
              searchTerm) && (
              <Button
                variant="link"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setSelectedQuestion('all');
                  setSelectedPersona('all');
                  setSelectedSegment('all');
                  setSelectedSentiment('all');
                  setSearchTerm('');
                }}
              >
                清除筛选
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responses List */}
      <div className="space-y-4">
        {filteredResponses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>没有找到符合条件的回复</p>
              <p className="text-sm mt-2">请调整筛选条件后重试</p>
            </CardContent>
          </Card>
        ) : (
          filteredResponses.map(response => {
            const question = questions.find(q => q.id === response.questionId);
            const isExpanded = expandedResponses.has(response.id);

            return (
              <ResponseCard
                key={response.id}
                question={question}
                response={response}
                isExpanded={isExpanded}
                onToggleExpand={() => toggleExpand(response.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
