/**
 * Argumentation Card Component
 * Displays argumentation strength and evidence details
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, XCircle, FileText, MessageSquare, Eye, FlaskConical } from 'lucide-react';
import { Argumentation, Evidence, DataSource } from './MetricHierarchy';

export interface ArgumentationCardProps {
  argumentation: Argumentation;
  showTitle?: boolean;
}

export function ArgumentationCard({ argumentation, showTitle = true }: ArgumentationCardProps) {
  const getStrengthIcon = () => {
    switch (argumentation.strength) {
      case 'strong':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'moderate':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'weak':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStrengthColor = () => {
    switch (argumentation.strength) {
      case 'strong':
        return 'bg-green-50 border-green-300';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-300';
      case 'weak':
        return 'bg-red-50 border-red-300';
    }
  };

  const getStrengthLabel = () => {
    switch (argumentation.strength) {
      case 'strong':
        return '强论证';
      case 'moderate':
        return '中等论证';
      case 'weak':
        return '弱论证';
    }
  };

  const getEvidenceTypeIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'survey':
        return <FileText className="w-4 h-4" />;
      case 'interview':
        return <MessageSquare className="w-4 h-4" />;
      case 'behavioral':
        return <Eye className="w-4 h-4" />;
      case 'experimental':
        return <FlaskConical className="w-4 h-4" />;
    }
  };

  const getEvidenceTypeLabel = (type: Evidence['type']) => {
    switch (type) {
      case 'survey':
        return '问卷调查';
      case 'interview':
        return '深度访谈';
      case 'behavioral':
        return '行为观察';
      case 'experimental':
        return '实验数据';
    }
  };

  const getSourceTypeLabel = (type: DataSource['type']) => {
    switch (type) {
      case 'questionnaire':
        return '问卷';
      case 'interview':
        return '访谈';
      case 'observation':
        return '观察';
      case 'experiment':
        return '实验';
    }
  };

  const calculateEvidenceScore = (evidence: Evidence[]): number => {
    let score = 0;

    // Sample size contribution (max 40 points)
    const totalSampleSize = evidence.reduce((sum, e) => sum + e.sampleSize, 0);
    if (totalSampleSize >= 1000) score += 40;
    else if (totalSampleSize >= 500) score += 30;
    else if (totalSampleSize >= 100) score += 20;
    else score += 10;

    // Source diversity (max 30 points)
    const uniqueTypes = new Set(evidence.map(e => e.type)).size;
    score += uniqueTypes * 10;

    // Recency (max 20 points)
    const now = new Date();
    const recentEvidence = evidence.filter(e => {
      const daysDiff = (now.getTime() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length;
    score += (recentEvidence / evidence.length) * 20;

    // Cross-validation (max 10 points)
    const hasMultipleSources = evidence.length >= 3;
    if (hasMultipleSources) score += 10;

    return Math.min(100, Math.round(score));
  };

  const evidenceScore = calculateEvidenceScore(argumentation.evidence);

  return (
    <Card className={`border-2 ${getStrengthColor()}`}>
      {showTitle && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {getStrengthIcon()}
              {getStrengthLabel()}
            </CardTitle>
            <Badge variant="outline">置信度: {argumentation.confidence}%</Badge>
          </div>
        </CardHeader>
      )}

      <CardContent className={showTitle ? '' : 'pt-6'}>
        <div className="space-y-4">
          {/* Logic Chain */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">论证逻辑链</p>
            <div className="space-y-2">
              {argumentation.logic.premise.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">前提:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {argumentation.logic.premise.map((premise, index) => (
                      <li key={index} className="ml-2">{premise}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">推理过程:</p>
                <p className="text-sm">{argumentation.logic.reasoning}</p>
              </div>

              <div className="bg-muted/50 p-2 rounded">
                <p className="text-xs text-muted-foreground mb-1">结论:</p>
                <p className="text-sm font-medium">{argumentation.logic.conclusion}</p>
              </div>
            </div>
          </div>

          {/* Evidence List */}
          {argumentation.evidence.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  证据 ({argumentation.evidence.length} 条)
                </p>
                <Badge variant="outline">证据得分: {evidenceScore}/100</Badge>
              </div>

              <div className="space-y-2">
                {argumentation.evidence.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-muted-foreground">
                        {getEvidenceTypeIcon(evidence.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {getEvidenceTypeLabel(evidence.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            样本量: {evidence.sampleSize}
                          </span>
                        </div>
                        <p className="text-sm">{evidence.description}</p>
                        {evidence.sourceUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 mt-1 text-xs"
                            asChild
                          >
                            <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">
                              查看原始数据 →
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Sources */}
          {argumentation.sources.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                数据来源 ({argumentation.sources.length} 个)
              </p>
              <div className="flex flex-wrap gap-2">
                {argumentation.sources.map((source) => (
                  <Badge key={source.id} variant="outline" className="text-xs">
                    {getSourceTypeLabel(source.type)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Strength Breakdown */}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">证据强度分析</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">样本量得分:</span>
                <span className="font-medium">
                  {Math.min(40, Math.round(
                    argumentation.evidence.reduce((sum, e) => sum + e.sampleSize, 0) >= 1000
                      ? 40
                      : argumentation.evidence.reduce((sum, e) => sum + e.sampleSize, 0) >= 500
                        ? 30
                        : argumentation.evidence.reduce((sum, e) => sum + e.sampleSize, 0) >= 100
                          ? 20
                          : 10
                  ))}/40
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">来源多样性:</span>
                <span className="font-medium">
                  {Math.min(30, new Set(argumentation.evidence.map(e => e.type)).size * 10)}/30
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">数据新鲜度:</span>
                <span className="font-medium">
                  {Math.round(
                    (argumentation.evidence.filter(e => {
                      const daysDiff = (new Date().getTime() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                      return daysDiff <= 30;
                    }).length / argumentation.evidence.length) * 20
                  )}/20
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">交叉验证:</span>
                <span className="font-medium">
                  {argumentation.evidence.length >= 3 ? 10 : 0}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
