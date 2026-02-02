/**
 * 用户画像生成组件（美妆行业）
 * 步骤3：Persona Craft Agent 可视化展示
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
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Heart,
  MapPin,
  Briefcase,
} from "lucide-react";
import { userProfiles } from "@platform/industries/beauty/data/profiles.ts";
import { useProgressSimulation } from "@/hooks/useProgressSimulation";
import { SIMULATION_CONFIG } from "@/config/simulation";

interface Props {
  onComplete: () => void;
}

export default function UserPersonaGenerator({ onComplete }: Props) {
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
      setActivePersona(userProfiles[0].id);
    },
  });

  useEffect(() => {
    startGeneration();
    return () => stopGeneration();
  }, []);

  const currentPersona = userProfiles.find(p => p.id === activePersona);

  const getSegmentColor = (concerns: string[]) => {
    if (concerns.includes('抗衰')) {
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    }
    if (concerns.includes('美白')) {
      return "bg-pink-500/10 text-pink-600 border-pink-500/20";
    }
    if (concerns.includes('痘痘')) {
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    }
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">用户画像生成</h2>
        <p className="text-muted-foreground mt-1">
          Persona Craft Agent 正在构建用户画像
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
                  Persona Craft Agent 运行中
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  正在基于 CDP 数据构建虚拟用户画像...
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

          {currentPersona && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* User Profile Card */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {currentPersona.name}
                      </CardTitle>
                      <CardDescription>
                        {currentPersona.age}岁 ·{" "}
                        {currentPersona.gender} · {currentPersona.city}
                      </CardDescription>
                      <Badge
                        className={`mt-1 ${getSegmentColor(currentPersona.concerns)}`}
                      >
                        {currentPersona.skinType}肌肤
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{currentPersona.occupation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{currentPersona.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>收入 {currentPersona.income}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>护肤习惯：{currentPersona.beautyRoutine}</span>
                    </div>
                  </div>

                  {/* Skin Concerns */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      护肤困扰
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPersona.concerns.map((concern) => (
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

                  {/* Consumption Behavior */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      消费行为特征
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          月均护肤预算
                        </span>
                        <span className="font-medium">
                          {currentPersona.budgetRange}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Channels */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">购买渠道偏好</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPersona.purchaseChannels.map(
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

                  {/* Social Platforms */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">常用社交平台</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPersona.socialPlatforms.map((platform: string) => (
                        <Badge
                          key={`${currentPersona.id}-platform-${platform}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end">
            <Button size="lg" onClick={onComplete}>
              下一步：购买模拟
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
