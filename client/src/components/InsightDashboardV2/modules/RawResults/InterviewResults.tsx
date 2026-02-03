/**
 * Interview Results Component
 * Displays open-ended interview responses with semantic highlighting
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Download, Search, Filter } from 'lucide-react';
import { SemanticHighlighter } from './SemanticHighlighter';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface InterviewResponse {
  id: string;
  interviewId: string;
  respondentId: string;
  personaType: string;
  segment?: string;
  question: string;
  answer: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
  topics?: string[];
  confidence?: number;
}

export interface InterviewResultsProps {
  responses: InterviewResponse[];
  onExport?: (format: 'csv' | 'json' | 'xlsx') => void;
}

export function InterviewResults({ responses, onExport }: InterviewResultsProps) {
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Extract unique topics
  const topics = useMemo(() => {
    const topicSet = new Set<string>();
    responses.forEach(r => {
      r.topics?.forEach(topic => topicSet.add(topic));
    });
    return Array.from(topicSet);
  }, [responses]);

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
      if (selectedPersona !== 'all' && response.personaType !== selectedPersona) return false;
      if (selectedSegment !== 'all' && response.segment !== selectedSegment) return false;
      if (selectedSentiment !== 'all' && response.sentiment !== selectedSentiment) return false;
      if (selectedTopic !== 'all' && !response.topics?.includes(selectedTopic)) return false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const questionText = response.question.toLowerCase();
        const answerText = response.answer.toLowerCase();
        const keywordsText = response.keywords?.join(' ').toLowerCase() || '';

        if (
          !questionText.includes(searchLower) &&
          !answerText.includes(searchLower) &&
          !keywordsText.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [responses, selectedPersona, selectedSegment, selectedSentiment, selectedTopic, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = responses.length;
    const sentimentCounts = responses.reduce((acc, r) => {
      if (r.sentiment) {
        acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topicCounts = responses.reduce((acc, r) => {
      r.topics?.forEach(topic => {
        acc[topic] = (acc[topic] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const avgConfidence =
      responses.reduce((sum, r) => sum + (r.confidence || 0), 0) / total;

    return {
      total,
      positive: sentimentCounts.positive || 0,
      neutral: sentimentCounts.neutral || 0,
      negative: sentimentCounts.negative || 0,
      filtered: filteredResponses.length,
      avgConfidence: avgConfidence.toFixed(2),
      topicCounts,
    };
  }, [responses, filteredResponses]);

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
            <p className="text-xs text-muted-foreground mt-1">访谈记录</p>
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
            <CardTitle className="text-sm font-medium">平均置信度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(Number(stats.avgConfidence) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI 分析准确度</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">识别主题</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
            <p className="text-xs text-muted-foreground mt-1">主要讨论话题</p>
          </CardContent>
        </Card>
      </div>

      {/* Topic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>主题分布</CardTitle>
          <CardDescription>访谈中讨论的主要话题</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.topicCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([topic, count]) => (
                <Badge
                  key={topic}
                  variant={selectedTopic === topic ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTopic(selectedTopic === topic ? 'all' : topic)
                  }
                >
                  {topic} ({count})
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>筛选条件</CardTitle>
              <CardDescription>过滤和分析访谈回复</CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'card' | 'list')}>
                <TabsList>
                  <TabsTrigger value="card">卡片视图</TabsTrigger>
                  <TabsTrigger value="list">列表视图</TabsTrigger>
                </TabsList>
              </Tabs>
              {onExport && (
                <Button size="sm" onClick={() => onExport('json')}>
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>搜索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索问题、回复或关键词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
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
              显示 {stats.filtered} / {stats.total} 条访谈记录
            </p>
            {(selectedPersona !== 'all' ||
              selectedSegment !== 'all' ||
              selectedSentiment !== 'all' ||
              selectedTopic !== 'all' ||
              searchTerm) && (
              <Button
                variant="link"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setSelectedPersona('all');
                  setSelectedSegment('all');
                  setSelectedSentiment('all');
                  setSelectedTopic('all');
                  setSearchTerm('');
                }}
              >
                清除筛选
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responses */}
      <div className={viewMode === 'card' ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
        {filteredResponses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>没有找到符合条件的访谈记录</p>
              <p className="text-sm mt-2">请调整筛选条件后重试</p>
            </CardContent>
          </Card>
        ) : (
          filteredResponses.map(response => (
            <Card
              key={response.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{response.personaType}</Badge>
                      {response.segment && <Badge variant="secondary">{response.segment}</Badge>}
                      <Badge
                        variant="outline"
                        className={getSentimentColor(response.sentiment)}
                      >
                        {response.sentiment === 'positive'
                          ? '正面'
                          : response.sentiment === 'negative'
                            ? '负面'
                            : '中性'}
                      </Badge>
                      {response.confidence && (
                        <Badge variant="outline" className="text-xs">
                          置信度: {(response.confidence * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-base font-semibold">{response.question}</h3>

                    <div className="text-sm text-muted-foreground">
                      <span className="font-mono">{response.respondentId}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {format(new Date(response.timestamp), 'yyyy-MM-dd HH:mm', {
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Answer with semantic highlighting */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">回复内容</p>
                    <SemanticHighlighter text={response.answer} keywords={response.keywords || []} />
                  </div>

                  {/* Keywords */}
                  {response.keywords && response.keywords.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">关键词</p>
                      <div className="flex flex-wrap gap-2">
                        {response.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics */}
                  {response.topics && response.topics.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">讨论话题</p>
                      <div className="flex flex-wrap gap-2">
                        {response.topics.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => setSelectedTopic(topic)}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
