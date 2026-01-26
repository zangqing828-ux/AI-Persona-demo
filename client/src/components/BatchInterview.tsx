/**
 * 批量化访谈组件
 * 步骤6：10,000+ 虚拟消费者批量测试
 */

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  Users,
  Zap,
  Clock,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Cat,
  Dog,
  Play,
  Pause
} from "lucide-react";
import { batchTestStats } from "@/data/petFoodSimulation";

interface Props {
  onComplete: () => void;
}

// 模拟的访谈日志
const generateInterviewLog = (index: number) => {
  const names = ['张小萌', '李大壮', '王美丽', '陈阿姨', '刘潇洒', '赵小明', '孙丽丽', '周大伟', '吴小红', '郑强'];
  const petNames = ['布丁', '大黄', '小橘', '豆豆', '毛球', '咪咪', '旺财', '花花', '球球', '妞妞'];
  const species = ['猫', '狗'];
  const intents = ['高', '中', '低'];
  const reactions = [
    '对成分表示认可，价格可接受',
    '担心适口性，想要试吃装',
    '价格超出预算，暂不考虑',
    '非常感兴趣，准备购买',
    '需要更多用户评价',
    '对品牌不熟悉，持观望态度',
    '关注关节养护功能',
    '担心换粮过渡期',
    '对无谷配方很满意',
    '希望有更小包装'
  ];

  return {
    id: index + 1,
    ownerName: names[index % names.length],
    petName: petNames[index % petNames.length],
    species: species[index % 2],
    intent: intents[index % 3],
    reaction: reactions[index % reactions.length],
    score: Math.floor(Math.random() * 40) + 40,
    timestamp: new Date(Date.now() - (1000 - index) * 100).toLocaleTimeString()
  };
};

export default function BatchInterview({ onComplete }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [logs, setLogs] = useState<ReturnType<typeof generateInterviewLog>[]>([]);
  const [stats, setStats] = useState({
    highIntent: 0,
    mediumIntent: 0,
    lowIntent: 0,
    avgScore: 0
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSamples = 10000;

  const startSimulation = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setCompletedCount(prev => {
        const newCount = Math.min(prev + Math.floor(Math.random() * 50) + 20, totalSamples);
        const newProgress = (newCount / totalSamples) * 100;
        setProgress(newProgress);

        // 添加新日志
        const newLog = generateInterviewLog(newCount);
        setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 49)]);

        // 更新统计
        setStats(prevStats => ({
          highIntent: Math.floor(newCount * 0.28),
          mediumIntent: Math.floor(newCount * 0.45),
          lowIntent: Math.floor(newCount * 0.27),
          avgScore: 58 + Math.floor(Math.random() * 5)
        }));

        if (newCount >= totalSamples) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsRunning(false);
        }

        return newCount;
      });
    }, 100);
  };

  const pauseSimulation = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeSimulation = () => {
    setIsPaused(false);
    startSimulation();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const isComplete = completedCount >= totalSamples;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground">批量化访谈</h2>
        <p className="text-muted-foreground mt-1">
          10,000 只虚拟宠物的批量消费者模拟测试
        </p>
      </div>

      {/* Control Panel */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  {isComplete ? '批量测试完成' : isRunning ? '批量测试进行中' : '准备开始批量测试'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isComplete 
                    ? `已完成 ${totalSamples.toLocaleString()} 个虚拟消费者的模拟访谈`
                    : `目标样本量：${totalSamples.toLocaleString()} 个虚拟消费者`
                  }
                </p>
              </div>
            </div>
            
            {!isComplete && (
              <div className="flex gap-2">
                {!isRunning && !isPaused && (
                  <Button onClick={startSimulation} className="gap-2">
                    <Play className="w-4 h-4" />
                    开始测试
                  </Button>
                )}
                {isRunning && !isPaused && (
                  <Button onClick={pauseSimulation} variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" />
                    暂停
                  </Button>
                )}
                {isPaused && (
                  <Button onClick={resumeSimulation} className="gap-2">
                    <Play className="w-4 h-4" />
                    继续
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">测试进度</span>
              <span className="font-medium">
                {completedCount.toLocaleString()} / {totalSamples.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                预计剩余：{isComplete ? '0' : Math.ceil((totalSamples - completedCount) / 500)} 秒
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                处理速度：~500 样本/秒
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Real-time Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                实时统计
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Intent Distribution */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">购买意向分布</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      高意向
                    </span>
                    <span className="text-sm font-medium">{stats.highIntent.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${completedCount > 0 ? (stats.highIntent / completedCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      中意向
                    </span>
                    <span className="text-sm font-medium">{stats.mediumIntent.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${completedCount > 0 ? (stats.mediumIntent / completedCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      低意向
                    </span>
                    <span className="text-sm font-medium">{stats.lowIntent.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${completedCount > 0 ? (stats.lowIntent / completedCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Avg Score */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">平均意向分</span>
                  <span className="text-2xl font-bold text-primary">{stats.avgScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          {isComplete && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">测试完成</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      已收集 {totalSamples.toLocaleString()} 份有效样本，可进入数据分析阶段
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Real-time Log */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                实时访谈日志
              </CardTitle>
              <CardDescription>
                滚动显示最新的模拟访谈结果
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-6 pb-4" ref={scrollRef}>
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>点击"开始测试"启动批量访谈</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, idx) => (
                      <div 
                        key={`${log.id}-${idx}`}
                        className={`p-3 rounded-lg border bg-card transition-all duration-300 ${
                          idx === 0 ? 'animate-fade-in border-primary/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {log.species === '猫' ? (
                                <Cat className="w-4 h-4 text-orange-500" />
                              ) : (
                                <Dog className="w-4 h-4 text-amber-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {log.ownerName} & {log.petName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                #{log.id.toString().padStart(5, '0')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant="outline"
                              className={`text-xs ${
                                log.intent === '高' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                log.intent === '中' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                'bg-red-500/10 text-red-600 border-red-500/20'
                              }`}
                            >
                              意向{log.intent}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.timestamp}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 pl-10">
                          {log.reaction}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={onComplete}
          disabled={!isComplete}
        >
          下一步：查看洞察仪表盘
        </Button>
      </div>
    </div>
  );
}
