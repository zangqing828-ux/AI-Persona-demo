/**
 * 交互分析组件
 * 步骤5：Interaction Analyst Agent 预期确认算法
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Target
} from "lucide-react";
import { 
  dualPersonas, 
  interactionAnalyses,
  feedingScripts,
  type InteractionAnalysis as InteractionAnalysisType
} from "@/data/petFoodSimulation";

interface Props {
  onComplete: () => void;
}

const scenarioConfig = {
  surprise: {
    icon: Sparkles,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    label: '惊喜',
    description: '超出预期'
  },
  satisfaction: {
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    label: '满意',
    description: '符合预期'
  },
  disappointment: {
    icon: TrendingDown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    label: '失望',
    description: '低于预期'
  },
  rejection: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: '拒绝',
    description: '无法接受'
  }
};

export default function InteractionAnalysis({ onComplete }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  const getAnalysis = (personaId: string) => {
    return interactionAnalyses.find(a => a.personaId === personaId);
  };

  const getScript = (personaId: string) => {
    return feedingScripts.find(s => s.personaId === personaId);
  };

  const getPersona = (personaId: string) => {
    return dualPersonas.find(p => p.id === personaId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">交互分析</h2>
        <p className="text-muted-foreground mt-1">
          Interaction Analyst Agent 基于预期确认算法分析人宠交互场景
        </p>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <LineChart className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  Interaction Analyst Agent 运行中
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  正在分析主人预期与宠物实际反应的匹配度...
                </p>
                <Progress value={progress} className="mt-3 h-2" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isAnalyzing && (
        <>
          {/* Scenario Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                预期确认场景分布
              </CardTitle>
              <CardDescription>
                基于 Owner Agent 预期与 Pet Agent 预测的匹配分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(scenarioConfig).map(([key, config]) => {
                  const count = interactionAnalyses.filter(a => a.scenario === key).length;
                  const Icon = config.icon;
                  return (
                    <div 
                      key={key}
                      className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-5 h-5 ${config.color}`} />
                        <span className={`font-medium ${config.color}`}>{config.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{count}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Individual Analysis Cards */}
          <div className="grid gap-4">
            {interactionAnalyses.map((analysis) => {
              const persona = getPersona(analysis.personaId);
              const config = scenarioConfig[analysis.scenario];
              const Icon = config.icon;
              const script = getScript(analysis.personaId);

              return (
                <Card 
                  key={analysis.personaId}
                  className={`overflow-hidden transition-all duration-200 ${
                    selectedPersona === analysis.personaId ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setSelectedPersona(
                      selectedPersona === analysis.personaId ? null : analysis.personaId
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {persona?.owner.name} & {persona?.pet.name}
                          </CardTitle>
                          <CardDescription>
                            {analysis.scenarioDescription}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor}`}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">复购率预测</p>
                        <p className={`text-xl font-bold ${
                          analysis.repurchaseRate >= 70 ? 'text-green-600' :
                          analysis.repurchaseRate >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {analysis.repurchaseRate}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">NPS 预测</p>
                        <p className={`text-xl font-bold ${
                          analysis.npsScore >= 30 ? 'text-green-600' :
                          analysis.npsScore >= 0 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {analysis.npsScore > 0 ? '+' : ''}{analysis.npsScore}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">流失风险</p>
                        <p className={`text-lg font-bold ${
                          analysis.churnRisk === 'low' ? 'text-green-600' :
                          analysis.churnRisk === 'medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {analysis.churnRisk === 'low' ? '低' :
                           analysis.churnRisk === 'medium' ? '中' : '高'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {selectedPersona === analysis.personaId && (
                    <CardContent className="pt-0 animate-fade-in">
                      <div className="space-y-4 pt-4 border-t">
                        {/* Key Insight */}
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground mb-1">核心洞察</p>
                              <p className="text-sm text-muted-foreground">
                                {analysis.keyInsight}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground mb-1">营销建议</p>
                              <p className="text-sm text-muted-foreground">
                                {analysis.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Feeding Script */}
                        {script && (
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowScript(!showScript);
                              }}
                              className="mb-3"
                            >
                              {showScript ? '收起' : '查看'}喂食场景剧本
                              <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${showScript ? 'rotate-90' : ''}`} />
                            </Button>

                            {showScript && (
                              <div className="space-y-3 animate-fade-in">
                                {script.scenes.map((scene, idx) => (
                                  <div key={idx} className="p-3 bg-muted/30 rounded-lg border">
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <span className="text-muted-foreground">动作：</span>
                                        {scene.action}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">宠物反应：</span>
                                        {scene.petReaction}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">主人情绪：</span>
                                        {scene.ownerEmotion}
                                      </p>
                                      {scene.dialogue && (
                                        <p className="italic text-primary">
                                          {scene.dialogue}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                <div className="p-3 bg-primary/5 rounded-lg">
                                  <p className="text-sm">
                                    <span className="font-medium">整体氛围：</span>
                                    {script.overallMood}
                                  </p>
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">营销启示：</span>
                                    {script.marketingInsight}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button size="lg" onClick={onComplete}>
              下一步：批量化访谈
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
