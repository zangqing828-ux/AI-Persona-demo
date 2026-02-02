/**
 * 虚拟客群选择组件
 * 步骤2：从CDP选择或创建目标人群
 * 支持多行业动态渲染
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
import { useIndustryConfig } from "@/hooks/useIndustryConfig";

// Pet food CDP tags
const petFoodCDPTags = {
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

// Beauty industry CDP tags
import { beautyCDPTags as beautyCDPTagsData, beautyAdvancedFilters as beautyAdvancedFiltersData } from "@/data/beautySimulation";

interface Props {
  onComplete: () => void;
}

export default function AudienceSelector({ onComplete }: Props) {
  const { industryId } = useIndustryConfig();

  // Get industry-specific tags and filters
  const currentCDPTags = useMemo(() => {
    return industryId === 'beauty' ? beautyCDPTagsData : petFoodCDPTags;
  }, [industryId]);

  const currentAdvancedFilters = useMemo(() => {
    return industryId === 'beauty' ? beautyAdvancedFiltersData : [
      { id: 'newUser', label: '仅新用户（注册<30天）' },
      { id: 'activeUser', label: '活跃用户（30天内有购买）' },
      { id: 'multiPet', label: '多宠家庭' },
    ];
  }, [industryId]);

  // Default selected tags based on industry
  const defaultTags = useMemo(() => {
    return industryId === 'beauty'
      ? ['combination', 'acne', 'advanced']
      : ['scientific', 'cat', 'sensitive_stomach'];
  }, [industryId]);

  const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags);
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
    for (const category of Object.values(currentCDPTags)) {
      const tag = category.find((t: any) => t.id === tagId);
      if (tag) return tag.label;
    }
    return tagId;
  }, [currentCDPTags]);

  // Render tag categories based on industry
  const renderTagCategories = () => {
    if (industryId === 'beauty') {
      const beautyTags = currentCDPTags as any;
      return (
        <>
          {/* Skin Type */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              肤质类型
            </h4>
            <div className="flex flex-wrap gap-2">
              {beautyTags.skinType.map((tag: any) => (
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

          {/* Skin Concerns */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              护肤困扰
            </h4>
            <div className="flex flex-wrap gap-2">
              {beautyTags.concerns.map((tag: any) => (
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

          {/* Beauty Routine */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              护肤习惯
            </h4>
            <div className="flex flex-wrap gap-2">
              {beautyTags.beautyRoutine.map((tag: any) => (
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

          {/* Income Level */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              收入水平
            </h4>
            <div className="flex flex-wrap gap-2">
              {beautyTags.income.map((tag: any) => (
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
              {beautyTags.ageGroup.map((tag: any) => (
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
        </>
      );
    }

    // Pet food industry (original)
    return (
      <>
        {/* Feeding Philosophy */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            养宠理念
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentCDPTags.feedingPhilosophy.map((tag: any) => (
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
            {currentCDPTags.petType.map((tag: any) => (
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
            {currentCDPTags.healthConcern.map((tag: any) => (
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
            {currentCDPTags.priceRange.map((tag: any) => (
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
            {currentCDPTags.ageGroup.map((tag: any) => (
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
      </>
    );
  };

  // Get next step text based on industry
  const getNextStepText = () => {
    return industryId === 'beauty' ? '下一步：生成用户画像' : '下一步：生成人宠画像';
  };

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
              {renderTagCategories()}
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
                {currentAdvancedFilters.map((filter: any) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <Checkbox id={filter.id} />
                    <label htmlFor={filter.id} className="text-sm">
                      {filter.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={selectedTags.length === 0}
            onClick={onComplete}
          >
            {getNextStepText()}
          </Button>
        </div>
      </div>
    </div>
  );
}
