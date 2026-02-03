import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { GraduationCap, Zap } from "lucide-react";
import { useUserMode } from "../../contexts/UserModeContext";
import { cn } from "../../lib/utils";

// Constants for mode configurations
const MODE_CONFIG = {
  beginner: {
    label: "新手模式",
    description: "引导式体验 - 每步都有详细说明",
    icon: GraduationCap,
    toggleLabel: "切换到专家模式",
    color: "bg-blue-500",
    ariaPressed: false,
  },
  expert: {
    label: "专家模式",
    description: "完全控制 - 可跳过非关键步骤",
    icon: Zap,
    toggleLabel: "切换到新手模式",
    color: "bg-purple-500",
    ariaPressed: true,
  },
} as const;

const DIALOG_TITLE = "切换到专家模式";
const DIALOG_DESCRIPTION =
  "专家模式允许跳过某些配置步骤，使用默认值。这可能会影响模拟结果的准确性。";
const CONFIRM_BUTTON_LABEL = "确认切换";
const CANCEL_BUTTON_LABEL = "取消";

const STATS_BADGE_TEMPLATE = "可跳过 {count} 个步骤";

const ANIMATION_DURATION = 0.3; // 300ms

interface ModeSwitcherProps {
  className?: string;
}

export function ModeSwitcher({ className }: ModeSwitcherProps) {
  const { mode, toggleMode, skippedSteps } = useUserMode();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasSeenExpertWarning, setHasSeenExpertWarning] = useState(false);

  // Load expert warning state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-persona-expert-warning-seen");
      if (stored) {
        setHasSeenExpertWarning(JSON.parse(stored));
      }
    } catch (error) {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  const currentConfig = MODE_CONFIG[mode];
  const Icon = currentConfig.icon;

  const handleToggleClick = () => {
    if (mode === "beginner" && !hasSeenExpertWarning) {
      // First time switching to expert mode - show confirmation
      setShowConfirmDialog(true);
    } else {
      // Subsequent toggles or switching back to beginner
      handleConfirmToggle();
    }
  };

  const handleConfirmToggle = () => {
    toggleMode();

    // Mark expert warning as seen if we just switched to expert
    if (mode === "beginner") {
      setHasSeenExpertWarning(true);
      try {
        localStorage.setItem(
          "ai-persona-expert-warning-seen",
          JSON.stringify(true)
        );
      } catch (error) {
        // Silently fail if localStorage is unavailable
      }
    }

    setShowConfirmDialog(false);
  };

  const handleCancelToggle = () => {
    setShowConfirmDialog(false);
  };

  const skippedStepsCount = skippedSteps.size;
  const statsText = STATS_BADGE_TEMPLATE.replace(
    "{count}",
    String(skippedStepsCount)
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Mode Icon with Animation */}
      <motion.div
        key={mode}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        className="flex-shrink-0"
      >
        <Icon
          data-icon={mode === "beginner" ? "graduation-cap" : "zap"}
          aria-hidden="true"
          className={cn(
            "h-5 w-5",
            mode === "beginner" ? "text-blue-500" : "text-purple-500"
          )}
        />
      </motion.div>

      {/* Mode Info */}
      <div className="flex flex-col">
        <motion.span
          key={`label-${mode}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: ANIMATION_DURATION }}
          className="text-sm font-medium"
        >
          {currentConfig.label}
        </motion.span>
        <motion.span
          key={`desc-${mode}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: ANIMATION_DURATION, delay: 0.05 }}
          className="text-xs text-muted-foreground"
        >
          {currentConfig.description}
        </motion.span>

        {/* Stats Badge (Expert Mode Only) */}
        <AnimatePresence mode="wait">
          {mode === "expert" && (
            <motion.span
              key="stats-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: ANIMATION_DURATION, delay: 0.1 }}
              className="text-xs font-medium text-purple-600 dark:text-purple-400"
            >
              {statsText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <motion.button
        type="button"
        onClick={handleToggleClick}
        aria-pressed={currentConfig.ariaPressed}
        aria-label={currentConfig.toggleLabel}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
          mode === "expert"
            ? "bg-purple-500"
            : "bg-gray-200 dark:bg-gray-700"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleClick();
          }
        }}
      >
        <motion.span
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          animate={{
            x: mode === "expert" ? 20 : 0,
          }}
          transition={{ duration: ANIMATION_DURATION }}
        />
      </motion.button>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelToggle();
          }
        }}
      >
        <DialogContent
          onEscapeKeyDown={handleCancelToggle}
          onPointerDownOutside={handleCancelToggle}
          onInteractOutside={handleCancelToggle}
        >
          <DialogTitle>{DIALOG_TITLE}</DialogTitle>
          <DialogDescription>{DIALOG_DESCRIPTION}</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelToggle}>
              {CANCEL_BUTTON_LABEL}
            </Button>
            <Button onClick={handleConfirmToggle}>
              {CONFIRM_BUTTON_LABEL}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
