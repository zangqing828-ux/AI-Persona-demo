import { type JSX } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import type { ExecutionTrace } from "@shared/types/execution";

// =============================================================================
// Props Interface
// =============================================================================

interface DecisionPathVisualizerProps {
  /** Execution trace to visualize */
  executionTrace: ExecutionTrace;
  /** Compact display mode */
  compact?: boolean;
  /** Callback when step is clicked */
  onStepClick?: (stepId: string) => void;
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDuration(milliseconds: number): string {
  if (milliseconds === 0) return "0ms";
  if (milliseconds < 1000) return `${milliseconds}ms`;
  return `${(milliseconds / 1000).toFixed(1)}s`;
}

function getStepStatus(executionTime: number): "completed" | "skipped" {
  return executionTime > 0 ? "completed" : "skipped";
}

function getStatusIcon(status: "completed" | "skipped"): JSX.Element {
  if (status === "completed") {
    return (
      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// =============================================================================
// Timeline Step Component
// =============================================================================

interface TimelineStepProps {
  step: ExecutionTrace["stepTraces"][number];
  index: number;
  total: number;
  compact?: boolean;
  onClick?: (stepId: string) => void;
}

function TimelineStep({ step, index, total, compact, onClick }: TimelineStepProps) {
  const status = getStepStatus(step.executionTime);
  // const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    onClick?.(step.stepId);
  };

  return (
    <TooltipProvider>
      <div className="relative">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  status === "completed"
                    ? "bg-green-50 border-green-200 hover:bg-green-100"
                    : "bg-orange-50 border-orange-200 hover:bg-orange-100",
                  compact && "w-8 h-8",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                )}
                onClick={handleClick}
                aria-label={`${step.stepName} - ${status}`}
              >
                {getStatusIcon(status)}

                {/* Connector line */}
                {index < total - 1 && (
                  <div className="absolute top-5 left-10 w-20 h-0.5 bg-gray-200" />
                )}
              </button>
            </TooltipTrigger>

            <TooltipContent side="bottom" className="max-w-xs">
              <div className="p-2">
                <h4 className="font-semibold text-sm mb-1">{step.stepName}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  执行时间: {formatDuration(step.executionTime)}
                </p>
                <div className="text-xs">
                  <p className="text-gray-700 font-medium">配置:</p>
                  <p className="text-gray-600 truncate">
                    {JSON.stringify(step.configSnapshot)}
                  </p>
                </div>
                {step.rulesTriggered.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    触发规则: {step.rulesTriggered.length}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {!compact && (
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {step.stepName}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDuration(step.executionTime)}
              </p>
            </div>
          )}
        </div>

        {/* Vertical connector line */}
        {index < total - 1 && (
          <div className="absolute left-5 top-10 w-0.5 h-8 bg-gray-200" />
        )}
      </div>
    </TooltipProvider>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function DecisionPathVisualizer({
  executionTrace,
  compact = false,
  onStepClick
}: DecisionPathVisualizerProps): JSX.Element {
  const { stepTraces, totalExecutionTime } = executionTrace;

  return (
    <div className={cn(
      "decision-path-visualizer",
      compact
        ? "p-3 space-y-2"
        : "p-6 space-y-6",
      "bg-white rounded-lg border border-gray-200"
    )}>
      {/* Header */}
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          决策路径
        </h3>
        <p className="text-sm text-gray-600">
          总执行时间: {formatDuration(totalExecutionTime)}
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {stepTraces.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            没有执行步骤
          </div>
        ) : (
          <div className={cn(
            "space-y-4",
            compact && "space-y-2"
          )}>
            {stepTraces.map((step, index) => (
              <TimelineStep
                key={step.stepId}
                step={step}
                index={index}
                total={stepTraces.length}
                compact={compact}
                onClick={onStepClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}