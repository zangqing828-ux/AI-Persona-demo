/**
 * 双视角模拟组件
 * 步骤4：Owner Agent + Pet Agent 并行模拟
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  User, 
  Cat,
  Dog,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { 
  dualPersonas, 
  ownerSimulations, 
  petSimulations,
  testProducts,
  type OwnerSimulation,
  type PetSimulation 
} from "@/data/petFoodSimulation";

interface Props {
  onComplete: () => void;
}

export default function DualSimulation({ onComplete }: Props) {
  const [isSimulating, setIsSimulating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activePersona, setActivePersona] = useState(dualPersonas[0].id);
  const [activeTab, setActiveTab] = useState('owner');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsSimulating(false);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const currentPersona = dualPersonas.find(p => p.id === activePersona);
  const ownerResult = ownerSimulations.find(s => s.personaId === activePersona);
  const petResult = petSimulations.find(s => s.personaId === activePersona);
  const product = testProducts[0];

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'high': return 'text-green-600 bg-green-500/10';
      case 'medium': return 'text-amber-600 bg-amber-500/10';
      case 'low': return 'text-red-600 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">双视角模拟</h2>
        <p className="text-muted-foreground mt-1">
          Owner Agent（主人买）+ Pet Agent（宠物吃）并行模拟
        </p>
      </div>

      {/* Simulation Status */}
      {isSimulating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.6_0.18_280/0.2)] flex items-center justify-center border-2 border-background">
                  <User className="w-5 h-5 text-[oklch(0.5_0.18_280)]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-[oklch(0.65_0.2_145/0.2)] flex items-center justify-center border-2 border-background">
                  <Cat className="w-5 h-5 text-[oklch(0.5_0.2_145)]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  双视角 Agent 并行运行中
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Owner Agent 分析购买决策 · Pet Agent 预测生理反应
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
      {!isSimulating && (
        <>
          {/* Persona Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dualPersonas.map((persona) => (
              <Button
                key={persona.id}
                variant={activePersona === persona.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActivePersona(persona.id)}
                className="shrink-0"
              >
                {persona.owner.name} & {persona.pet.name}
              </Button>
            ))}
          </div>

          {/* Product Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">测试产品</p>
                  <p className="font-medium text-foreground">{product.name}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-semibold text-primary">¥{product.price}</p>
                  <p className="text-xs text-muted-foreground">{product.weight}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dual View Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner" className="gap-2">
                <User className="w-4 h-4" />
                Owner Agent · 主人视角
              </TabsTrigger>
              <TabsTrigger value="pet" className="gap-2">
                {currentPersona?.pet.species === '猫' ? (
                  <Cat className="w-4 h-4" />
                ) : (
                  <Dog className="w-4 h-4" />
                )}
                Pet Agent · 宠物视角
              </TabsTrigger>
            </TabsList>

            {/* Owner Agent Results */}
            <TabsContent value="owner" className="space-y-4">
              {ownerResult && (
                <>
                  {/* Initial Reaction */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        初始反应
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        "{ownerResult.initialReaction}"
                      </p>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">购买意向</p>
                        <p className={`text-2xl font-bold ${
                          ownerResult.intentScore >= 70 ? 'text-green-600' :
                          ownerResult.intentScore >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {ownerResult.intentScore}
                        </p>
                        <Badge className={`mt-2 ${getIntentColor(ownerResult.purchaseIntent)}`}>
                          {ownerResult.purchaseIntent === 'high' ? '高' :
                           ownerResult.purchaseIntent === 'medium' ? '中' : '低'}
                        </Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">信任度</p>
                        <p className="text-2xl font-bold text-foreground">
                          {ownerResult.trustLevel}
                        </p>
                        <Progress value={ownerResult.trustLevel} className="mt-2 h-1.5" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">价格感知</p>
                        <p className="text-lg font-bold text-foreground">
                          {ownerResult.pricePerception}
                        </p>
                        {ownerResult.pricePerception === '合理' ? (
                          <ThumbsUp className="w-5 h-5 text-green-600 mx-auto mt-1" />
                        ) : ownerResult.pricePerception === '太贵' ? (
                          <ThumbsDown className="w-5 h-5 text-red-600 mx-auto mt-1" />
                        ) : (
                          <Minus className="w-5 h-5 text-amber-600 mx-auto mt-1" />
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">预测行为</p>
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {ownerResult.predictedBehavior.slice(0, 30)}...
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          关键考量因素
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {ownerResult.keyConsiderations.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          顾虑与异议
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {ownerResult.objections.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <TrendingDown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          转化触发点
                        </CardTitle>
                        <CardDescription>
                          以下因素可能促使该用户完成购买
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {ownerResult.triggerPoints.map((trigger, idx) => (
                            <Badge key={idx} variant="outline" className="py-1.5">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Pet Agent Results */}
            <TabsContent value="pet" className="space-y-4">
              {petResult && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">开袋吸引力</p>
                        <p className="text-2xl font-bold text-foreground">
                          {petResult.smellAttraction}
                        </p>
                        <Progress value={petResult.smellAttraction} className="mt-2 h-1.5" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">适口性预测</p>
                        <p className="text-2xl font-bold text-foreground">
                          {petResult.tasteAcceptance}
                        </p>
                        <Progress value={petResult.tasteAcceptance} className="mt-2 h-1.5" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">消化风险</p>
                        <p className={`text-lg font-bold ${getRiskColor(petResult.digestiveRisk)}`}>
                          {petResult.digestiveRisk === 'low' ? '低风险' :
                           petResult.digestiveRisk === 'medium' ? '中等' : '高风险'}
                        </p>
                        {petResult.digestiveRisk === 'low' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mt-1" />
                        ) : petResult.digestiveRisk === 'high' ? (
                          <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mt-1" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mt-1" />
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">长期适合度</p>
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {petResult.longTermSuitability.slice(0, 30)}...
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Behavioral Prediction */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {currentPersona?.pet.species === '猫' ? (
                          <Cat className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Dog className="w-4 h-4 text-amber-600" />
                        )}
                        行为预测
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {petResult.expectedBehavior}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Physiological Response */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        生理反应预测
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {petResult.physiologicalResponse}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Risk & Positive Factors */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          正向因素
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {petResult.positiveFactors.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <ThumbsUp className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          风险因素
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {petResult.riskFactors.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button size="lg" onClick={onComplete}>
              下一步：交互分析
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
