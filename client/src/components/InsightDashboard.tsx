/**
 * 洞察仪表盘组件
 * 步骤7：量化看板 + 质化反馈 + 场景回放
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { batchTestStats } from "@/data/petFoodSimulation";

const COLORS = {
  primary: "#4F46E5",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  muted: "#6B7280",
};

export default function InsightDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // 验证数据
  if (!batchTestStats) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">数据加载失败</p>
        <p className="text-muted-foreground text-sm mt-2">请刷新页面重试</p>
      </div>
    );
  }

  // 购买意向分布数据
  const intentData = [
    {
      name: "高意向",
      value: batchTestStats.purchaseIntentDistribution.high || 0,
      color: COLORS.success,
    },
    {
      name: "中意向",
      value: batchTestStats.purchaseIntentDistribution.medium || 0,
      color: COLORS.warning,
    },
    {
      name: "低意向",
      value: batchTestStats.purchaseIntentDistribution.low || 0,
      color: COLORS.danger,
    },
  ];

  // 价格感知分布数据
  const priceData = [
    {
      name: "便宜",
      value: batchTestStats.pricePerceptionDistribution.cheap || 0,
      color: COLORS.success,
    },
    {
      name: "合理",
      value: batchTestStats.pricePerceptionDistribution.reasonable || 0,
      color: COLORS.primary,
    },
    {
      name: "偏贵",
      value: batchTestStats.pricePerceptionDistribution.expensive || 0,
      color: COLORS.warning,
    },
    {
      name: "太贵",
      value: batchTestStats.pricePerceptionDistribution.tooExpensive || 0,
      color: COLORS.danger,
    },
  ];

  // 消化风险分布数据
  const digestiveData = [
    {
      name: "低风险",
      value: batchTestStats.digestiveRiskDistribution.low || 0,
      color: COLORS.success,
    },
    {
      name: "中风险",
      value: batchTestStats.digestiveRiskDistribution.medium || 0,
      color: COLORS.warning,
    },
    {
      name: "高风险",
      value: batchTestStats.digestiveRiskDistribution.high || 0,
      color: COLORS.danger,
    },
  ];

  // 人群分层数据
  const segmentData = (batchTestStats.segmentAnalysis || []).map(seg => ({
    name: seg.segment,
    意向分: seg.avgIntentScore || 0,
    NPS: (seg.avgNpsScore || 0) + 50, // 调整为正数便于显示
    人数: seg.count || 0,
  }));

  // 雷达图数据
  const radarData = [
    { subject: "购买意向", A: 58.5, fullMark: 100 },
    { subject: "NPS", A: 72, fullMark: 100 },
    { subject: "复购率", A: 62, fullMark: 100 },
    { subject: "价格接受度", A: 43, fullMark: 100 },
    { subject: "品牌信任", A: 55, fullMark: 100 },
    { subject: "适口性预期", A: 78, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">洞察仪表盘</h2>
          <p className="text-muted-foreground mt-1">
            基于 {batchTestStats.totalSamples.toLocaleString()}{" "}
            份样本的综合分析报告
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">平均购买意向</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">
              {batchTestStats.avgIntentScore}
            </p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              高于行业均值 8%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">NPS 净推荐值</p>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">
              +{batchTestStats.avgNpsScore}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              推荐者 &gt; 贬损者
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">预测复购率</p>
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">
              {batchTestStats.avgRepurchaseRate}%
            </p>
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <Minus className="w-3 h-3" />
              接近行业均值
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">高意向占比</p>
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">28%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {batchTestStats.purchaseIntentDistribution.high.toLocaleString()}{" "}
              人
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="concerns">顾虑分析</TabsTrigger>
          <TabsTrigger value="segments">人群分层</TabsTrigger>
          <TabsTrigger value="insights">关键洞察</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Intent Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">购买意向分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={intentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {intentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "人数",
                        ]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {intentData.map(item => (
                    <div
                      key={`intent-${item.name}`}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Perception */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">价格感知分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={priceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {priceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "人数",
                        ]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {priceData.map(item => (
                    <div
                      key={`price-${item.name}`}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Digestive Risk */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">消化风险分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={digestiveData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {digestiveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "人数",
                        ]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {digestiveData.map(item => (
                    <div
                      key={`digestive-${item.name}`}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">综合评估雷达图</CardTitle>
              <CardDescription>产品在各维度的表现评分</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="评分"
                      dataKey="A"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Concerns Tab */}
        <TabsContent value="concerns" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Top Concerns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  主要顾虑 TOP 5
                </CardTitle>
                <CardDescription>消费者最关心的问题</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {batchTestStats.topConcerns.map((concern, idx) => (
                  <div key={`concern-${idx}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {concern.concern}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {concern.percentage}%
                      </span>
                    </div>
                    <Progress value={concern.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {concern.count.toLocaleString()} 人提及
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Triggers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  转化触发点 TOP 5
                </CardTitle>
                <CardDescription>最能促进购买的因素</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {batchTestStats.topTriggers.map((trigger, idx) => (
                  <div key={`trigger-${idx}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {trigger.trigger}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {trigger.percentage}%
                      </span>
                    </div>
                    <Progress value={trigger.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {trigger.count.toLocaleString()} 人认可
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">人群分层分析</CardTitle>
              <CardDescription>不同养宠理念人群的表现对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={segmentData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="意向分" fill={COLORS.primary} />
                    <Bar dataKey="NPS" fill={COLORS.success} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Segment Details */}
          <div className="grid md:grid-cols-2 gap-4">
            {batchTestStats.segmentAnalysis.map((segment, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {segment.segment}
                    </CardTitle>
                    <Badge variant="outline">
                      {segment.count.toLocaleString()} 人
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        平均意向分
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          segment.avgIntentScore >= 60
                            ? "text-green-600"
                            : segment.avgIntentScore >= 40
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {segment.avgIntentScore}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">平均 NPS</p>
                      <p
                        className={`text-xl font-bold ${
                          segment.avgNpsScore >= 20
                            ? "text-green-600"
                            : segment.avgNpsScore >= 0
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {segment.avgNpsScore > 0 ? "+" : ""}
                        {segment.avgNpsScore}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">关键洞察：</span>
                      {segment.keyInsight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {/* Key Findings */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  核心发现
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        产品力获得认可
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        72%
                        的消费者对产品成分和配方表示认可，"75%动物蛋白"和"无谷配方"是最受欢迎的卖点。
                        科学养宠型人群的意向分高达 72 分，是核心目标客群。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        价格是主要障碍
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        42% 的消费者认为价格偏高，尤其是穷养型人群（意向分仅
                        35）。
                        建议推出小包装入门款或学生优惠策略，降低尝试门槛。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        社交证明是关键转化因素
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        52% 的消费者表示"成分党测评背书"会显著提升购买意愿， 48%
                        希望有试吃装体验。建议加强 KOL 合作和试用装投放。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  行动建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        强化成分党营销
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        与小红书、知乎的宠物成分党 KOL 合作，产出深度测评内容。
                        重点展示配料表解读、营养成分对比、便便改善效果。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        推出试吃装策略
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        推出 50g 试吃装（定价 19.9 元），降低首次尝试门槛。
                        配合"试吃不满意全额退款"承诺，消除适口性顾虑。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        差异化人群策略
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        科学养宠型：强调成分优势和功效数据；
                        跟风养型：加强社交证明和熟人推荐；
                        穷养型：考虑推出性价比子品牌或学生优惠。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        建立效果追踪机制
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        开发"便便日记"小程序功能，帮助用户记录喂食效果。
                        收集真实用户数据，形成口碑素材，提升复购率。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
