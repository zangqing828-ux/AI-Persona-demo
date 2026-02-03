import React, { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserMode } from "../../contexts/UserModeContext";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { ConfigExplanation } from "../explainability/ConfigExplanation";
import type { ExplainabilityMetadata } from "@shared/types/platform";

// Constants for step status
const STEP_STATUS = {
  PENDING: "准备中",
  CURRENT: "进行中",
  COMPLETED: "已完成",
  SKIPPED: "已跳过",
} as const;

const STATUS_VARIANTS = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  current: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  skipped: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
} as const;

const EXPAND_BUTTON_LABEL = "展开";
const COLLAPSE_BUTTON_LABEL = "收起";
const SKIP_BUTTON_LABEL = "跳过此步骤";
const USE_DEFAULTS_BUTTON_LABEL = "使用默认值";
const SKIPPED_STEP_TITLE = "此步骤已跳过";
const SKIPPED_STEP_DESCRIPTION = "使用默认值";
const RESTORE_BUTTON_LABEL = "恢复";

const ANIMATION_DURATION = 0.3; // 300ms

// Types
interface StepWrapperProps {
  stepId: string;
  stepName: string;
  children: ReactNode;
  isComplete?: boolean;
  isCurrent?: boolean;
  canSkip?: boolean;
  onSkip?: () => void;
  onUseDefaults?: () => void;
  explainability?: ExplainabilityMetadata;
}

// Skipped Step Placeholder Component
interface SkippedStepPlaceholderProps {
  stepName: string;
  onRestore: () => void;
}

function SkippedStepPlaceholder({
  stepName,
  onRestore,
}: SkippedStepPlaceholderProps) {
  return (
    <Card
      data-testid="skipped-step-placeholder"
      className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20"
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={STATUS_VARIANTS.skipped}>
            {STEP_STATUS.SKIPPED}
          </Badge>
          <div>
            <h3 className="font-medium text-sm">{stepName}</h3>
            <p className="text-xs text-muted-foreground">
              {SKIPPED_STEP_TITLE} - {SKIPPED_STEP_DESCRIPTION}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRestore}
          aria-label={`${RESTORE_BUTTON_LABEL} ${stepName}`}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {RESTORE_BUTTON_LABEL}
        </Button>
      </CardContent>
    </Card>
  );
}

// Guidance Panel Component
interface GuidancePanelProps {
  explainability: ExplainabilityMetadata;
  mode: "beginner" | "expert";
  isExpanded: boolean;
  onToggle: () => void;
}

function GuidancePanel({
  explainability,
  mode,
  isExpanded,
  onToggle,
}: GuidancePanelProps) {
  const isExpertMode = mode === "expert";
  const shouldShowContent = isExpanded || mode === "beginner";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: ANIMATION_DURATION }}
      className="border-b border-border pb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">
          为什么需要这一步？
        </h4>
        {isExpertMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            aria-label={isExpanded ? COLLAPSE_BUTTON_LABEL : EXPAND_BUTTON_LABEL}
            className="h-8 gap-1 text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                {COLLAPSE_BUTTON_LABEL}
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                {EXPAND_BUTTON_LABEL}
              </>
            )}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {shouldShowContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <ConfigExplanation
              explainability={explainability}
              mode={mode}
              compact={isExpertMode && !isExpanded}
              hideTitle={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main StepWrapper Component
export function StepWrapper({
  stepId,
  stepName,
  children,
  isComplete = false,
  isCurrent = false,
  canSkip = false,
  onSkip,
  onUseDefaults,
  explainability,
}: StepWrapperProps) {
  const { mode, skipStep, unskipStep, isStepSkipped } = useUserMode();
  const [guidanceExpanded, setGuidanceExpanded] = useState(false);

  // Check if step is skipped from context
  const stepIsSkipped = isStepSkipped(stepId);

  // Handle skip action
  const handleSkip = () => {
    skipStep(stepId);
    onSkip?.();
  };

  // Handle use defaults action (different from skip)
  const handleUseDefaults = () => {
    onUseDefaults?.();
  };

  // Handle restore action
  const handleRestore = () => {
    unskipStep(stepId);
  };

  // Determine step status
  const getStepStatus = () => {
    if (stepIsSkipped) return "skipped";
    if (isCurrent) return "current";
    if (isComplete) return "completed";
    return "pending";
  };

  const stepStatus = getStepStatus();
  const statusText = STEP_STATUS[stepStatus.toUpperCase() as keyof typeof STEP_STATUS];
  const statusVariant = STATUS_VARIANTS[stepStatus];

  // Show placeholder if step is skipped
  if (stepIsSkipped) {
    return (
      <SkippedStepPlaceholder
        stepName={stepName}
        onRestore={handleRestore}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: ANIMATION_DURATION }}
      className="space-y-4"
    >
      {/* Step Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={statusVariant}>
              {statusText}
            </Badge>
            <h2 className="text-lg font-semibold">{stepName}</h2>
          </div>

          {/* Expert Mode Actions */}
          {mode === "expert" && canSkip && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkip}
                  aria-label={`${SKIP_BUTTON_LABEL} ${stepName}`}
                >
                  {SKIP_BUTTON_LABEL}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUseDefaults}
                  aria-label={USE_DEFAULTS_BUTTON_LABEL}
                >
                  {USE_DEFAULTS_BUTTON_LABEL}
                </Button>
              </div>
              {/* Quick Stats - Placeholder for Phase 2 */}
              <div className="text-xs text-muted-foreground">
                影响预览功能即将推出
              </div>
            </div>
          )}
        </CardHeader>

        {/* Guidance Panel */}
        {explainability && (
          <div className="px-6">
            <GuidancePanel
              explainability={explainability}
              mode={mode}
              isExpanded={guidanceExpanded}
              onToggle={() => setGuidanceExpanded(!guidanceExpanded)}
            />
          </div>
        )}

        {/* Step Content */}
        <CardContent className="pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${stepStatus}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: ANIMATION_DURATION }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
