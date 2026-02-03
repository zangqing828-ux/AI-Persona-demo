/**
 * Argumentation Visualizer Component
 * Visualizes argumentation strength with interactive indicators
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle2, AlertCircle, XCircle, TrendingUp, ExternalLink } from 'lucide-react';
import { Argumentation } from '../DeepAnalysis/MetricHierarchy';

export interface ArgumentationVisualizerProps {
  argumentation: Argumentation;
  showDetails?: boolean;
}

export function ArgumentationVisualizer({
  argumentation,
  showDetails = true,
}: ArgumentationVisualizerProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  const getStrengthIcon = () => {
    switch (argumentation.strength) {
      case 'strong':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'moderate':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'weak':
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStrengthColor = () => {
    switch (argumentation.strength) {
      case 'strong':
        return {
          bg: 'bg-green-50',
          border: 'border-green-300',
          text: 'text-green-800',
          progress: 'bg-green-600',
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          progress: 'bg-yellow-600',
        };
      case 'weak':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-800',
          progress: 'bg-red-600',
        };
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

  const getStrengthDescription = () => {
    switch (argumentation.strength) {
      case 'strong':
        return '证据充分，来源多样，数据新鲜，可信度高';
      case 'moderate':
        return '证据适中，来源尚可，需要补充更多数据';
      case 'weak':
        return '证据不足，来源单一，需要进一步验证';
    }
  };

  const colors = getStrengthColor();

  // Calculate evidence scores
  const evidenceScores = {
    sampleSize: Math.min(100, Math.round(
      argumentation.evidence.reduce((sum, e) => sum + e.sampleSize, 0) / 25
    )),
    diversity: Math.min(100, new Set(argumentation.evidence.map(e => e.type)).size * 25),
    recency: Math.min(100, Math.round(
      (argumentation.evidence.filter(e => {
        const daysDiff = (new Date().getTime() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      }).length / argumentation.evidence.length) * 100
    )),
    validation: argumentation.evidence.length >= 3 ? 100 : argumentation.evidence.length * 33,
  };

  const overallScore = Math.round(
    (evidenceScores.sampleSize * 0.4 +
     evidenceScores.diversity * 0.3 +
     evidenceScores.recency * 0.2 +
     evidenceScores.validation * 0.1)
  );

  return (
    <div className="space-y-4">
      {/* Overall Strength Card */}
      <Card className={`border-2 ${colors.border} ${colors.bg}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              论证强度评估
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStrengthIcon()}
              <Badge variant="outline" className={`text-lg px-4 py-1 ${colors.border} ${colors.text}`}>
                {getStrengthLabel()}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">综合得分</span>
              <span className="text-2xl font-bold">{overallScore}/100</span>
            </div>
            <Progress value={overallScore} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {getStrengthDescription()}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AI 置信度</span>
              <Badge variant="outline">{argumentation.confidence}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <>
          {/* Evidence Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">证据质量分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sample Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">样本量得分</span>
                  <span className="text-sm font-bold">{evidenceScores.sampleSize}/100</span>
                </div>
                <Progress value={evidenceScores.sampleSize} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  总样本: {argumentation.evidence.reduce((sum, e) => sum + e.sampleSize, 0).toLocaleString()}
                </p>
              </div>

              {/* Source Diversity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">来源多样性</span>
                  <span className="text-sm font-bold">{evidenceScores.diversity}/100</span>
                </div>
                <Progress value={evidenceScores.diversity} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {new Set(argumentation.evidence.map(e => e.type)).size} 种证据类型
                </p>
              </div>

              {/* Data Recency */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">数据新鲜度</span>
                  <span className="text-sm font-bold">{evidenceScores.recency}/100</span>
                </div>
                <Progress value={evidenceScores.recency} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {argumentation.evidence.filter(e => {
                    const daysDiff = (new Date().getTime() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 30;
                  }).length} / {argumentation.evidence.length} 条为近30天数据
                </p>
              </div>

              {/* Cross-validation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">交叉验证</span>
                  <span className="text-sm font-bold">{evidenceScores.validation}/100</span>
                </div>
                <Progress value={evidenceScores.validation} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {argumentation.evidence.length >= 3 ? '已通过交叉验证' : '需要更多证据支持'}
                </p>
              </div>

              {/* Improvement Suggestions */}
              {argumentation.strength !== 'strong' && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">改进建议</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {evidenceScores.sampleSize < 70 && (
                      <li>• 增加样本量以提高统计显著性</li>
                    )}
                    {evidenceScores.diversity < 70 && (
                      <li>• 引入更多类型的证据来源</li>
                    )}
                    {evidenceScores.recency < 70 && (
                      <li>• 使用最新数据以提高时效性</li>
                    )}
                    {evidenceScores.validation < 70 && (
                      <li>• 收集更多独立证据进行交叉验证</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence List */}
          {argumentation.evidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">证据列表 ({argumentation.evidence.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {argumentation.evidence.map((evidence, index) => (
                    <div
                      key={evidence.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedEvidence === evidence.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedEvidence(
                        selectedEvidence === evidence.id ? null : evidence.id
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              证据 #{index + 1}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              样本: {evidence.sampleSize.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{evidence.description}</p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                      </div>

                      {selectedEvidence === evidence.id && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">类型:</span>
                              <span className="ml-2">{evidence.type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">时间:</span>
                              <span className="ml-2">
                                {new Date(evidence.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {evidence.sourceUrl && (
                            <a
                              href={evidence.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              查看原始数据 <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
