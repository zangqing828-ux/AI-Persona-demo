/**
 * 用户购买模拟组件（美妆行业）
 * 步骤4：User Agent 模拟购买决策
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";
import { userProfiles } from "@platform/industries/beauty/data/profiles.ts";
import { testProducts } from "@platform/industries/beauty/data/products.js";
import { useProgressSimulation } from "@/hooks/useProgressSimulation";
import { SIMULATION_CONFIG } from "@/config/simulation";

interface Props {
  onComplete: () => void;
}

// Mock simulation results for beauty industry
const getUserSimulationResult = (personaId: string) => {
  return {
    personaId,
    initialReaction: "这个产品的成分看起来很不错，特别是视黄醇和烟酰胺的添加。不过价格有点偏高，我需要考虑一下性价比。",
    pricePerception: "偏贵" as const,
    interest: 75,
    ingredientAppeal: "成分组合科学，针对我的肌肤困扰",
    purchaseIntent: "medium" as "high" | "medium" | "low",
    intentScore: 68,
    keyConsiderations: [
      "成分含视黄醇，适合抗衰需求",
      "品牌信誉度高，质量有保障",
      "包装设计专业，方便使用",
    ],
    concerns: [
      "价格偏高，超出月预算",
      "视黄醇可能需要建立耐受",
      "不确定是否适合敏感期使用",
    ],
    triggers: [
      "新品优惠活动",
      "KOL推荐背书",
      "小样试用装",
      "分期付款选项",
    ],
    predictedBehavior: "可能会先购买小样试用，如果效果满意再考虑正装",
    socialProofNeeds: ["小红书真实用户评价", "皮肤科医生推荐", "成分分析科普"],
  };
};

export default function UserSimulation({ onComplete }: Props) {
  const [activePersona, setActivePersona] = useState(userProfiles[0].id);

  const {
    progress,
    isRunning: isSimulating,
    start: startSimulation,
    stop: stopSimulation,
  } = useProgressSimulation({
    increment: SIMULATION_CONFIG.PROGRESS.DUAL_SIMULATION.INCREMENT,
    intervalMs: SIMULATION_CONFIG.PROGRESS.DUAL_SIMULATION.INTERVAL_MS,
    maxProgress: SIMULATION_CONFIG.PROGRESS.DUAL_SIMULATION.MAX_PROGRESS,
  });

  useEffect(() => {
    startSimulation();
    return () => stopSimulation();
  }, []);

  const simulationResult = getUserSimulationResult(activePersona);
  const product = testProducts[0];

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "high":
        return "text-green-600 bg-green-500/10";
      case "medium":
        return "text-amber-600 bg-amber-500/10";
      case "low":
        return "text-red-600 bg-red-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getPricePerceptionIcon = (perception: string) => {
    if (perception === "便宜") {
      return <ThumbsUp className="w-5 h-5 text-green-600 mx-auto mt-1" />;
    }
    if (perception === "太贵") {
      return <ThumbsDown className="w-5 h-5 text-red-600 mx-auto mt-1" />;
    }
    return <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mt-1" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">购买模拟</h2>
        <p className="text-muted-foreground mt-1">
          User Agent 模拟用户购买决策过程
        </p>
      </div>

      {/* Simulation Status */}
      {isSimulating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-pink-500 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  User Agent 运行中
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  正在分析用户购买决策...
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
            {userProfiles.map(persona => (
              <Button
                key={persona.id}
                variant={activePersona === persona.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePersona(persona.id)}
                className="shrink-0"
              >
                {persona.name}
              </Button>
            ))}
          </div>

          {/* Product Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">测试产品</p>
                  <p className="font-medium text-foreground">{product.name}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-semibold text-pink-500">
                    ¥{product.price}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Agent Results */}
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
                  "{simulationResult.initialReaction}"
                </p>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    购买意向
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      simulationResult.intentScore >= 70
                        ? "text-green-600"
                        : simulationResult.intentScore >= 50
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {simulationResult.intentScore}
                  </p>
                  <Badge
                    className={`mt-2 ${getIntentColor(simulationResult.purchaseIntent)}`}
                  >
                    {(() => {
                      switch (simulationResult.purchaseIntent) {
                        case "high":
                          return "高";
                        case "medium":
                          return "中";
                        case "low":
                          return "低";
                        default:
                          return "未知";
                      }
                    })()}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    兴趣指数
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {simulationResult.interest}
                  </p>
                  <Progress
                    value={simulationResult.interest}
                    className="mt-2 h-1.5"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    价格感知
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {simulationResult.pricePerception}
                  </p>
                  {getPricePerceptionIcon(simulationResult.pricePerception)}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    预测行为
                  </p>
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {simulationResult.predictedBehavior.slice(0, 30)}...
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
                    {simulationResult.keyConsiderations.map((item, idx) => (
                      <li
                        key={`${activePersona}-consideration-${idx}`}
                        className="flex items-start gap-2 text-sm"
                      >
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
                    {simulationResult.concerns.map((item, idx) => (
                      <li
                        key={`${activePersona}-concern-${idx}`}
                        className="flex items-start gap-2 text-sm"
                      >
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
                    {simulationResult.triggers.map((trigger, idx) => (
                      <Badge
                        key={`${activePersona}-trigger-${idx}`}
                        variant="outline"
                        className="py-1.5"
                      >
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    社交证明需求
                  </CardTitle>
                  <CardDescription>
                    用户需要的社交证明来支持购买决策
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {simulationResult.socialProofNeeds.map((need, idx) => (
                      <Badge
                        key={`${activePersona}-need-${idx}`}
                        variant="secondary"
                        className="py-1.5"
                      >
                        {need}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>

          <div className="flex justify-end">
            <Button size="lg" onClick={onComplete}>
              下一步：批量访谈
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
