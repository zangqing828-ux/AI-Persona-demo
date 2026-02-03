/**
 * AI 消费者模拟 - 宠物食品品牌
 * 主页面组件
 *
 * 设计风格：智能中台美学
 * - 左侧步骤导航
 * - 中央工作区
 * - 专业的企业级 SaaS 风格
 * - 支持新手/专家双模式
 */

import { useState } from "react";
import {
  Settings,
  Users,
  UserCircle,
  Brain,
  LineChart,
  BarChart3,
  PieChart,
  ChevronRight,
} from "lucide-react";
import ConceptTestConfig from "@/components/ConceptTestConfig";
import AudienceSelector from "@/components/AudienceSelector";
import DualPersonaGenerator from "@/components/DualPersonaGenerator";
import DualSimulation from "@/components/DualSimulation";
import UserPersonaGenerator from "@/components/UserPersonaGenerator";
import UserSimulation from "@/components/UserSimulation";
import InteractionAnalysis from "@/components/InteractionAnalysis";
import BatchInterview from "@/components/BatchInterview";
import InsightDashboardV2 from "@/components/InsightDashboardV2";
import { IndustrySelector } from "@/components/IndustrySelector";
import { ModeSwitcher } from "@/components/workflow/ModeSwitcher";
import { StepWrapper } from "@/components/workflow/StepWrapper";
import { UserModeProvider, useUserMode } from "@/contexts/UserModeContext";
import { useIndustryData } from "@/hooks/useIndustryData";
import { useIndustryConfig } from "@/hooks/useIndustryConfig";
import ConfigPanel from "@/components/config-system/ConfigPanel";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import type { ExplainabilityMetadata } from "@shared/types/platform";

const stepIcons: Record<string, React.ReactNode> = {
  Settings: <Settings className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  UserCircle: <UserCircle className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  LineChart: <LineChart className="w-4 h-4" />,
  BarChart: <BarChart3 className="w-4 h-4" />,
  PieChart: <PieChart className="w-4 h-4" />,
};

// Explainability metadata for each workflow step
const STEP_EXPLAINABILITY: Record<number, ExplainabilityMetadata> = {
  1: {
    whyThisStep: "配置产品信息，包括价格、蛋白质含量等关键属性，这将影响所有后续的模拟分析。",
    impactOverview: "产品的价格、成分、品质直接影响购买意愿评分和信任度",
    configImpacts: [
      {
        metricName: "购买意愿",
        influenceWeight: 85,
        description: "高蛋白含量会显著提升科学养宠用户的购买意愿",
        affectedSteps: ["4", "6"],
      },
      {
        metricName: "价格敏感度",
        influenceWeight: 90,
        description: "价格直接影响穷养用户的决策，对高净值用户影响较小",
        affectedSteps: ["4", "5"],
      },
    ],
  },
  2: {
    whyThisStep: "选择和配置目标客群，定义要模拟的受众类型和规模。",
    impactOverview: "养宠理念、收入水平、健康关注等因素直接影响购买决策路径",
    configImpacts: [
      {
        metricName: "转化率预测",
        influenceWeight: 75,
        description: "科学养宠人群转化率通常高于其他人群",
        affectedSteps: ["6", "7"],
      },
    ],
  },
  3: {
    whyThisStep: "基于客群配置构建详细的用户画像，为模拟提供真实的用户背景。",
    impactOverview: "用户画像的准确性直接影响模拟结果的可信度",
    configImpacts: [
      {
        metricName: "模拟准确性",
        influenceWeight: 95,
        description: "详细的用户偏好和行为特征是准确模拟的基础",
        affectedSteps: ["4", "5"],
      },
    ],
  },
  4: {
    whyThisStep: "基于用户画像进行决策模拟，预测真实场景下的用户行为。",
    impactOverview: "这是核心分析环节，预测购买决策过程并生成互动数据",
    configImpacts: [
      {
        metricName: "购买意向",
        influenceWeight: 90,
        description: "模拟结果直接反映产品在目标客群中的接受度",
        affectedSteps: ["5", "6"],
      },
    ],
  },
  5: {
    whyThisStep: "分析用户与产品/服务的互动过程，深入理解用户行为模式。",
    impactOverview: "揭示行为背后的原因，识别关键决策点，优化产品体验",
    configImpacts: [
      {
        metricName: "优化建议",
        influenceWeight: 80,
        description: "互动分析发现产品痛点和改进机会",
        affectedSteps: ["6", "7"],
      },
    ],
  },
  6: {
    whyThisStep: "基于前面的所有配置，对大量虚拟用户进行批量访谈，收集真实的反馈数据。",
    impactOverview: "核心分析环节，生成大量真实反馈，支持后续深度洞察",
    configImpacts: [
      {
        metricName: "数据丰富度",
        influenceWeight: 85,
        description: "批量访谈提供大规模、多维度的用户反馈数据",
        affectedSteps: ["7"],
      },
    ],
  },
  7: {
    whyThisStep: "汇总所有模拟和访谈数据，提供可视化的洞察分析和决策支持。",
    impactOverview: "全面的数据可视化，支持多维度分析，提供决策建议",
    configImpacts: [
      {
        metricName: "决策质量",
        influenceWeight: 100,
        description: "洞察仪表盘整合所有分析结果，直接影响最终决策",
        affectedSteps: [],
      },
    ],
  },
};

// Inner component that uses UserMode context
function HomeContent() {
  const { mode, skippedSteps, isStepSkipped, unskipStep } = useUserMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState(() => {
    // Read from localStorage on mount
    return localStorage.getItem('current-industry') || 'pet-food';
  });

  // Get industry config
  const { industryConfig } = useIndustryConfig();
  const { workflowSteps } = useIndustryData();

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < workflowSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkipStep = (stepId: string) => {
    const stepNum = parseInt(stepId, 10);
    const nextStep = stepNum + 1;

    if (nextStep <= workflowSteps.length) {
      setCurrentStep(nextStep);
    }
  };

  const handleUseDefaults = (stepId: string) => {
    logger.log(`[Phase 2] Applying defaults for step ${stepId}`);
    // TODO: Phase 2 will apply actual default configurations
  };

  const handleStepClick = (stepNum: number) => {
    const stepId = String(stepNum);

    // If clicking on a skipped step, restore it
    if (isStepSkipped(stepId)) {
      unskipStep(stepId);
    }

    // Allow clicking completed steps or current step
    if (completedSteps.includes(stepNum) || stepNum <= currentStep || isStepSkipped(stepId)) {
      setCurrentStep(stepNum);
    }
  };

  const renderStepContent = () => {
    try {
      // Map workflow steps to components based on industry
      if (currentIndustry === 'beauty') {
        // Beauty industry workflow (6 steps)
        switch (currentStep) {
          case 1:
            return (
              <StepWrapper
                stepId="1"
                stepName="概念测试配置"
                isCurrent={true}
                isComplete={completedSteps.includes(1)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('1')}
                onUseDefaults={() => handleUseDefaults('1')}
                explainability={STEP_EXPLAINABILITY[1]}
              >
                <ConceptTestConfig onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 2:
            return (
              <StepWrapper
                stepId="2"
                stepName="客群选择"
                isCurrent={true}
                isComplete={completedSteps.includes(2)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('2')}
                onUseDefaults={() => handleUseDefaults('2')}
                explainability={STEP_EXPLAINABILITY[2]}
              >
                <AudienceSelector onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 3:
            return (
              <StepWrapper
                stepId="3"
                stepName="用户画像生成"
                isCurrent={true}
                isComplete={completedSteps.includes(3)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('3')}
                onUseDefaults={() => handleUseDefaults('3')}
                explainability={STEP_EXPLAINABILITY[3]}
              >
                <UserPersonaGenerator onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 4:
            return (
              <StepWrapper
                stepId="4"
                stepName="购买模拟"
                isCurrent={true}
                isComplete={completedSteps.includes(4)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('4')}
                onUseDefaults={() => handleUseDefaults('4')}
                explainability={STEP_EXPLAINABILITY[4]}
              >
                <UserSimulation onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 5:
            return (
              <StepWrapper
                stepId="5"
                stepName="批量访谈"
                isCurrent={true}
                isComplete={completedSteps.includes(5)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('5')}
                onUseDefaults={() => handleUseDefaults('5')}
                explainability={STEP_EXPLAINABILITY[6]}
              >
                <BatchInterview onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 6:
            return (
              <StepWrapper
                stepId="6"
                stepName="洞察仪表盘"
                isCurrent={true}
                isComplete={completedSteps.includes(6)}
                canSkip={false}
                explainability={STEP_EXPLAINABILITY[7]}
              >
                <InsightDashboardV2 />
              </StepWrapper>
            );
          default:
            return null;
        }
      } else {
        // Pet food industry workflow (7 steps)
        switch (currentStep) {
          case 1:
            return (
              <StepWrapper
                stepId="1"
                stepName="概念测试配置"
                isCurrent={true}
                isComplete={completedSteps.includes(1)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('1')}
                onUseDefaults={() => handleUseDefaults('1')}
                explainability={STEP_EXPLAINABILITY[1]}
              >
                <ConceptTestConfig onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 2:
            return (
              <StepWrapper
                stepId="2"
                stepName="客群选择"
                isCurrent={true}
                isComplete={completedSteps.includes(2)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('2')}
                onUseDefaults={() => handleUseDefaults('2')}
                explainability={STEP_EXPLAINABILITY[2]}
              >
                <AudienceSelector onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 3:
            return (
              <StepWrapper
                stepId="3"
                stepName="双视角画像生成"
                isCurrent={true}
                isComplete={completedSteps.includes(3)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('3')}
                onUseDefaults={() => handleUseDefaults('3')}
                explainability={STEP_EXPLAINABILITY[3]}
              >
                <DualPersonaGenerator onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 4:
            return (
              <StepWrapper
                stepId="4"
                stepName="双视角模拟"
                isCurrent={true}
                isComplete={completedSteps.includes(4)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('4')}
                onUseDefaults={() => handleUseDefaults('4')}
                explainability={STEP_EXPLAINABILITY[4]}
              >
                <DualSimulation onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 5:
            return (
              <StepWrapper
                stepId="5"
                stepName="互动分析"
                isCurrent={true}
                isComplete={completedSteps.includes(5)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('5')}
                onUseDefaults={() => handleUseDefaults('5')}
                explainability={STEP_EXPLAINABILITY[5]}
              >
                <InteractionAnalysis onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 6:
            return (
              <StepWrapper
                stepId="6"
                stepName="批量访谈"
                isCurrent={true}
                isComplete={completedSteps.includes(6)}
                canSkip={mode === 'expert'}
                onSkip={() => handleSkipStep('6')}
                onUseDefaults={() => handleUseDefaults('6')}
                explainability={STEP_EXPLAINABILITY[6]}
              >
                <BatchInterview onComplete={handleStepComplete} />
              </StepWrapper>
            );
          case 7:
            return (
              <StepWrapper
                stepId="7"
                stepName="洞察仪表盘"
                isCurrent={true}
                isComplete={completedSteps.includes(7)}
                canSkip={false}
                explainability={STEP_EXPLAINABILITY[7]}
              >
                <InsightDashboardV2 />
              </StepWrapper>
            );
          default:
            return null;
        }
      }
    } catch (error) {
      return (
        <div className="p-8 text-center">
          <p className="text-destructive">加载步骤内容时出错</p>
          <p className="text-muted-foreground text-sm mt-2">请刷新页面重试</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showConfig ? (
        <div className="h-screen flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-6">
            <Button
              variant="ghost"
              onClick={() => setShowConfig(false)}
            >
              ← 返回工作流
            </Button>
          </header>
          <ConfigPanel />
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="h-16 border-b bg-card flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="/images/marketingforce-logo.png"
            alt="Marketingforce"
            className="h-8 object-contain"
          />
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              AI {industryConfig?.name}消费者模拟
            </h1>
            <p className="text-xs text-muted-foreground">
              {industryConfig?.description}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="w-4 h-4 mr-2" />
            配置
          </Button>
          <IndustrySelector
            currentIndustry={currentIndustry}
            onIndustryChange={(industryId) => {
              setCurrentIndustry(industryId);
              window.location.reload();
            }}
          />
          <div className="w-px h-6 bg-border" />
          <ModeSwitcher />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar - Step Navigation */}
        <aside className="w-72 border-r bg-card p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-sm font-medium text-foreground mb-1">
              模拟流程
            </h2>
            <p className="text-xs text-muted-foreground">
              完成以下步骤获取洞察
            </p>
          </div>

          <nav className="flex-1 space-y-1">
            {workflowSteps.map(step => {
              const stepId = String(step.id);
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isSkipped = isStepSkipped(stepId);
              const isClickable = isCompleted || step.id <= currentStep || isSkipped;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isClickable}
                  role="menuitem"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.name} ${isCompleted ? "已完成" : isCurrent ? "当前步骤" : isSkipped ? "已跳过" : ""}`}
                  aria-disabled={!isClickable}
                  tabIndex={isClickable ? 0 : -1}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/20"
                      : isSkipped
                        ? "bg-orange-50/50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
                        : isCompleted
                          ? "bg-muted/50 hover:bg-muted"
                          : "hover:bg-muted/30 opacity-50"
                  } ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div
                    className={`step-indicator shrink-0 ${
                      isSkipped
                        ? "bg-orange-500"
                        : isCompleted
                          ? "step-indicator-completed"
                          : isCurrent
                            ? "step-indicator-active"
                            : "step-indicator-pending"
                    }`}
                  >
                    {isSkipped ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                    ) : isCompleted ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      stepIcons[step.icon]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-primary"
                          : isSkipped
                            ? "text-orange-700 dark:text-orange-300"
                            : "text-foreground"
                      }`}
                    >
                      {step.name}
                      {isSkipped && (
                        <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                          (已跳过)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Progress Summary */}
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>完成进度</span>
                <span>
                  {completedSteps.length}/{workflowSteps.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(completedSteps.length / workflowSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Skipped Steps Indicator */}
            {skippedSteps.size > 0 && (
              <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
                已跳过 {skippedSteps.size} 个步骤
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {renderStepContent()}
          </div>
        </main>
      </div>
    </>
    )}
    </div>
  );
}

// Main component with UserModeProvider wrapper
export default function Home() {
  return (
    <UserModeProvider>
      <HomeContent />
    </UserModeProvider>
  );
}
