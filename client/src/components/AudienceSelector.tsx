/**
 * 虚拟客群选择组件
 * 步骤2：从CDP选择或创建目标人群
 */

import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Users, Filter, Database, Tag, X } from "lucide-react";

interface Props {
  onComplete: () => void;
}

// CDP 标签数据
const cdpTags = {
  feedingPhilosophy: [
    { id: "scientific", label: "科学养宠", count: 3200 },
    { id: "premium", label: "精细养", count: 1800 },
    { id: "follower", label: "跟风养", count: 2500 },
    { id: "budget", label: "穷养", count: 2500 },
  ],
  petType: [
    { id: "cat", label: "猫", count: 5500 },
    { id: "dog", label: "狗", count: 4500 },
  ],
  healthConcern: [
    { id: "sensitive_stomach", label: "肠胃敏感", count: 2800 },
    { id: "obesity", label: "肥胖/减重", count: 1500 },
    { id: "joint", label: "关节问题", count: 1200 },
    { id: "skin", label: "皮肤敏感", count: 900 },
    { id: "urinary", label: "泌尿问题", count: 600 },
  ],
  priceRange: [
    { id: "low", label: "100元以下/月", count: 2500 },
    { id: "mid", label: "100-300元/月", count: 4500 },
    { id: "high", label: "300-500元/月", count: 2200 },
    { id: "premium", label: "500元以上/月", count: 800 },
  ],
  ageGroup: [
    { id: "young", label: "18-25岁", count: 2000 },
    { id: "adult", label: "26-35岁", count: 4500 },
    { id: "middle", label: "36-50岁", count: 2500 },
    { id: "senior", label: "50岁以上", count: 1000 },
  ],
};

export default function AudienceSelector({ onComplete }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "scientific",
    "cat",
    "sensitive_stomach",
  ]);
  const [sampleSize, setSampleSize] = useState([5000]);

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagId));
  }, []);

  // 计算预估人群数量
  const estimatedCount = useMemo(
    () =>
      Math.min(
        selectedTags.length > 0
          ? Math.floor(10000 / (selectedTags.length * 0.8))
          : 10000,
        10000
      ),
    [selectedTags.length]
  );

  const getTagLabel = useCallback((tagId: string) => {
    for (const category of Object.values(cdpTags)) {
      const tag = category.find(t => t.id === tagId);
      if (tag) return tag.label;
    }
    return tagId;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">虚拟客群选择</h2>
        <p className="text-muted-foreground mt-1">
          从 CDP 中选择标签组合，创建目标测试人群
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tag Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  已选标签
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => (
                    <Badge
                      key={tagId}
                      variant="default"
                      className="pl-3 pr-1 py-1 flex items-center gap-1"
                    >
                      {getTagLabel(tagId)}
                      <button
                        onClick={() => removeTag(tagId)}
                        className="ml-1 hover:bg-primary-foreground/20 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tag Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                CDP 人群标签库
              </CardTitle>
              <CardDescription>拖拽或点击标签添加到测试人群</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feeding Philosophy */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  养宠理念
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cdpTags.feedingPhilosophy.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-border"
                      }`}
                    >
                      {tag.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        {(tag.count / 1000).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pet Type */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  宠物类型
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cdpTags.petType.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-border"
                      }`}
                    >
                      {tag.id === "cat" ? "🐱" : "🐕"} {tag.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        {(tag.count / 1000).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Health Concerns */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  健康关注
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cdpTags.healthConcern.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-border"
                      }`}
                    >
                      {tag.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        {(tag.count / 1000).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  消费能力
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cdpTags.priceRange.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-border"
                      }`}
                    >
                      {tag.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        {(tag.count / 1000).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  年龄分布
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cdpTags.ageGroup.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-border"
                      }`}
                    >
                      {tag.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        {(tag.count / 1000).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                人群预览
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-primary">
                  {estimatedCount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  预估匹配人数
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    模拟样本量
                  </span>
                  <span className="text-sm font-medium">
                    {sampleSize[0].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={sampleSize}
                  onValueChange={setSampleSize}
                  min={100}
                  max={10000}
                  step={100}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">已选标签</span>
                  <span className="font-medium">{selectedTags.length} 个</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">预计耗时</span>
                  <span className="font-medium">
                    ~{Math.ceil(sampleSize[0] / 1000)} 分钟
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                高级筛选
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="newUser" />
                  <label htmlFor="newUser" className="text-sm">
                    仅新用户（注册&lt;30天）
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activeUser" defaultChecked />
                  <label htmlFor="activeUser" className="text-sm">
                    活跃用户（30天内有购买）
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="multiPet" />
                  <label htmlFor="multiPet" className="text-sm">
                    多宠家庭
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={selectedTags.length === 0}
            onClick={onComplete}
          >
            下一步：生成人宠画像
          </Button>
        </div>
      </div>
    </div>
  );
}
