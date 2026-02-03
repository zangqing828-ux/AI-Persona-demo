/**
 * Insight Card Component
 * Displays insights with source citations and metadata
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, MessageSquare, BarChart3, ExternalLink, Copy } from 'lucide-react';

export interface SourceCitation {
  id: string;
  type: 'questionnaire' | 'interview' | 'metric' | 'document';
  title: string;
  excerpt?: string;
  url?: string;
  timestamp: Date;
  relevanceScore?: number;
}

export interface InsightCardProps {
  id: string;
  title: string;
  insight: string;
  confidence: number;
  category?: 'opportunity' | 'risk' | 'strength' | 'trend';
  sources?: SourceCitation[];
  metadata?: Record<string, unknown>;
  onCitationClick?: (citation: SourceCitation) => void;
  onShare?: () => void;
}

export function InsightCard({
  title,
  insight,
  confidence,
  category,
  sources = [],
  metadata,
  onCitationClick,
  onShare,
}: InsightCardProps) {
  const getCategoryIcon = () => {
    switch (category) {
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'risk':
        return <BarChart3 className="w-5 h-5 text-red-600" />;
      case 'strength':
        return <BarChart3 className="w-5 h-5 text-green-600" />;
      case 'trend':
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'opportunity':
        return 'bg-yellow-50 border-yellow-300';
      case 'risk':
        return 'bg-red-50 border-red-300';
      case 'strength':
        return 'bg-green-50 border-green-300';
      case 'trend':
        return 'bg-blue-50 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const getSourceIcon = (type: SourceCitation['type']) => {
    switch (type) {
      case 'questionnaire':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'interview':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'metric':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSourceTypeLabel = (type: SourceCitation['type']) => {
    switch (type) {
      case 'questionnaire':
        return '问卷';
      case 'interview':
        return '访谈';
      case 'metric':
        return '指标';
      case 'document':
        return '文档';
    }
  };

  const handleCopy = async () => {
    const text = `${title}\n\n${insight}\n\n来源: ${sources.map(s => s.title).join(', ')}`;
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className={`border-2 transition-all hover:shadow-md ${getCategoryColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">{getCategoryIcon()}</div>
            <div className="flex-1">
              <CardTitle className="text-base mb-1">{title}</CardTitle>
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category === 'opportunity' ? '机会' : category === 'risk' ? '风险' : category === 'strength' ? '优势' : '趋势'}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              置信度: {confidence}%
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              title="复制"
            >
              <Copy className="w-4 h-4" />
            </Button>
            {onShare && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onShare}
                title="分享"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Insight Text */}
        <p className="text-sm leading-relaxed">{insight}</p>

        {/* Metadata */}
        {metadata && Object.keys(metadata).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(metadata).slice(0, 3).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {String(value)}
              </Badge>
            ))}
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              来源 ({sources.length})
            </p>
            <div className="space-y-2">
              {sources.slice(0, 3).map(source => (
                <div
                  key={source.id}
                  className="flex items-start gap-2 p-2 bg-background/50 rounded hover:bg-background transition-colors cursor-pointer"
                  onClick={() => onCitationClick?.(source)}
                >
                  <div className="mt-0.5">{getSourceIcon(source.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getSourceTypeLabel(source.type)}
                      </Badge>
                      {source.relevanceScore && (
                        <span className="text-xs text-muted-foreground">
                          相关性: {(source.relevanceScore * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{source.title}</p>
                    {source.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {source.excerpt}
                      </p>
                    )}
                  </div>
                  {source.url && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  )}
                </div>
              ))}

              {sources.length > 3 && (
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  查看全部 {sources.length} 个来源 →
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Confidence Indicator */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>AI 分析置信度</span>
            <span className="font-medium">{confidence}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
