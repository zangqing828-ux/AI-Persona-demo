/**
 * AI 消费者模拟 - 宠物食品品牌
 * 主页面组件
 *
 * 设计风格：智能中台美学
 * - 左侧步骤导航
 * - 中央工作区
 * - 专业的企业级 SaaS 风格
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
import { useIndustryData } from "@/hooks/useIndustryData";
import { useIndustryConfig } from "@/hooks/useIndustryConfig";
import ConfigPanel from "@/components/config-system/ConfigPanel";
import { Button } from "@/components/ui/button";

const stepIcons: Record<string, React.ReactNode> = {
  Settings: <Settings className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  UserCircle: <UserCircle className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  LineChart: <LineChart className="w-4 h-4" />,
  BarChart: <BarChart3 className="w-4 h-4" />,
  PieChart: <PieChart className="w-4 h-4" />,
};

export default function Home() {
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

  const handleStepClick = (stepId: number) => {
    // 允许点击已完成的步骤或当前步骤的下一步
    if (completedSteps.includes(stepId) || stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const renderStepContent = () => {
    try {
      // Map workflow steps to components based on industry
      if (currentIndustry === 'beauty') {
        // Beauty industry workflow (6 steps)
        switch (currentStep) {
          case 1:
            return <ConceptTestConfig onComplete={handleStepComplete} />;
          case 2:
            return <AudienceSelector onComplete={handleStepComplete} />;
          case 3:
            return <UserPersonaGenerator onComplete={handleStepComplete} />;
          case 4:
            return <UserSimulation onComplete={handleStepComplete} />;
          case 5:
            return <BatchInterview onComplete={handleStepComplete} />;
          case 6:
            return <InsightDashboardV2 />;
          default:
            return null;
        }
      } else {
        // Pet food industry workflow (7 steps)
        switch (currentStep) {
          case 1:
            return <ConceptTestConfig onComplete={handleStepComplete} />;
          case 2:
            return <AudienceSelector onComplete={handleStepComplete} />;
          case 3:
            return <DualPersonaGenerator onComplete={handleStepComplete} />;
          case 4:
            return <DualSimulation onComplete={handleStepComplete} />;
          case 5:
            return <InteractionAnalysis onComplete={handleStepComplete} />;
          case 6:
            return <BatchInterview onComplete={handleStepComplete} />;
          case 7:
            return <InsightDashboardV2 />;
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
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isClickable = isCompleted || step.id <= currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isClickable}
                  role="menuitem"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.name} ${isCompleted ? "已完成" : isCurrent ? "当前步骤" : ""}`}
                  aria-disabled={!isClickable}
                  tabIndex={isClickable ? 0 : -1}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/20"
                      : isCompleted
                        ? "bg-muted/50 hover:bg-muted"
                        : "hover:bg-muted/30 opacity-50"
                  } ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div
                    className={`step-indicator shrink-0 ${
                      isCompleted
                        ? "step-indicator-completed"
                        : isCurrent
                          ? "step-indicator-active"
                          : "step-indicator-pending"
                    }`}
                  >
                    {isCompleted ? (
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
                      className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-foreground"}`}
                    >
                      {step.name}
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
          <div className="mt-4 pt-4 border-t">
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
