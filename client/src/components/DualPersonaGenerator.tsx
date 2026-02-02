/**
 * 人宠画像生成组件
 * 步骤3：Dual-Persona Craft Agent 可视化展示
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
  User,
  Cat,
  Dog,
  Heart,
  ShoppingBag,
  TrendingUp,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";
import { dualPersonas } from "@/data/petFoodSimulation";
import { useProgressSimulation } from "@/hooks/useProgressSimulation";
import { SIMULATION_CONFIG } from "@/config/simulation";

interface Props {
  onComplete: () => void;
}

export default function DualPersonaGenerator({ onComplete }: Props) {
  const [activePersona, setActivePersona] = useState<string | null>(null);

  const {
    progress,
    isRunning: isGenerating,
    start: startGeneration,
    stop: stopGeneration,
  } = useProgressSimulation({
    increment: SIMULATION_CONFIG.PROGRESS.PERSONA_GENERATION.INCREMENT,
    intervalMs: SIMULATION_CONFIG.PROGRESS.PERSONA_GENERATION.INTERVAL_MS,
    maxProgress: SIMULATION_CONFIG.PROGRESS.PERSONA_GENERATION.MAX_PROGRESS,
    onComplete: () => {
      setActivePersona(dualPersonas[0].id);
    },
  });

  useEffect(() => {
    startGeneration();
    return () => stopGeneration();
  }, []);

  const currentPersona = dualPersonas.find(p => p.id === activePersona);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "科学养宠":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "跟风养":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "穷养":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "精细养":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">人宠画像生成</h2>
        <p className="text-muted-foreground mt-1">
          Dual-Persona Craft Agent 正在构建人宠组合画像
        </p>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  Dual-Persona Craft Agent 运行中
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  正在基于 CDP 数据构建虚拟人宠组合...
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

      {/* Generated Personas */}
      {!isGenerating && (
        <>
          {/* Persona Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dualPersonas.map(persona => (
              <Button
                key={persona.id}
                variant={activePersona === persona.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePersona(persona.id)}
                className="shrink-0"
              >
                {persona.owner.name} & {persona.pet.name}
              </Button>
            ))}
          </div>

          {currentPersona && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Owner Profile */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[oklch(0.6_0.18_280)] to-[oklch(0.5_0.2_300)] flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {currentPersona.owner.name}
                      </CardTitle>
                      <CardDescription>
                        {currentPersona.owner.age}岁 ·{" "}
                        {currentPersona.owner.gender}
                      </CardDescription>
                      <Badge
                        className={`mt-1 ${getSegmentColor(currentPersona.owner.feedingPhilosophy)}`}
                      >
                        {currentPersona.owner.feedingPhilosophy}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{currentPersona.owner.occupation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{currentPersona.owner.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>收入 {currentPersona.owner.income}</span>
                    </div>
                  </div>

                  {/* Consumption Behavior */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      消费行为特征
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          月均宠物消费
                        </span>
                        <span className="font-medium">
                          {currentPersona.owner.priceRange}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Channels */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">购买渠道偏好</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPersona.owner.purchaseChannel.map(
                        (channel: string) => (
                          <Badge
                            key={`${currentPersona.id}-channel-${channel}`}
                            variant="outline"
                            className="text-xs"
                          >
                            {channel}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* Concerns */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">关注因素</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPersona.owner.concerns.map((concern: string) => (
                        <Badge
                          key={`${currentPersona.id}-concern-${concern}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Profile */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      {currentPersona.pet.species === "猫" ? (
                        <img
                          src="/images/cat-persona.png"
                          alt="Cat"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/images/dog-persona.png"
                          alt="Dog"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {currentPersona.pet.name}
                        {currentPersona.pet.species === "猫" ? (
                          <Cat className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Dog className="w-4 h-4 text-amber-600" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {currentPersona.pet.breed} · {currentPersona.pet.age}岁
                      </CardDescription>
                      <Badge variant="outline" className="mt-1">
                        {currentPersona.pet.weight}kg
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Health Status */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      健康状况
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPersona.pet.healthStatus.map((status: string) => (
                        <Badge
                          key={`${currentPersona.id}-health-${status}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">活动水平</span>
                        <span className="font-medium">
                          {currentPersona.pet.activityLevel}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">消化系统</span>
                        <span className="font-medium">
                          {currentPersona.pet.digestiveSystem}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Eating Habit */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">饮食习惯</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {currentPersona.pet.eatingHabit}
                      </Badge>
                    </div>
                  </div>

                  {/* Allergies */}
                  {currentPersona.pet.allergies.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3 text-amber-600">
                        过敏原
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentPersona.pet.allergies.map((allergy: string) => (
                          <Badge
                            key={`${currentPersona.id}-allergy-${allergy}`}
                            variant="destructive"
                            className="text-xs"
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Food */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">当前主粮</h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">
                        {currentPersona.pet.currentFood}
                      </p>
                    </div>
                  </div>

                  {/* Feeding Scenario */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      喂食场景
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentPersona.feedingScenario}
                    </p>
                  </div>

                  {/* Emotional Bond */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">情感纽带</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentPersona.emotionalBond}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end">
            <Button size="lg" onClick={onComplete}>
              下一步：双视角模拟
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
