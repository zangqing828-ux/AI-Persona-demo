import { type JSX } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import type {
  ConfigImpact,
  ExplainabilityMetadata,
} from "@shared/types/platform";

// =============================================================================
// Props Interface
// =============================================================================

interface ConfigExplanationProps {
  /** Explainability metadata from workflow step config */
  explainability: ExplainabilityMetadata;
  /** Optional: Current configuration values */
  currentConfig?: Record<string, unknown>;
  /** Optional: Mode-aware display ('beginner' = detailed, 'expert' = compact) */
  mode?: "beginner" | "expert";
  /** Optional: Compact display for tooltips/sidebars */
  compact?: boolean;
  /** Optional: Hide the main title (useful when embedded in other components) */
  hideTitle?: boolean;
}

// =============================================================================
// Constants
// =============================================================================

const CONFIDENCE_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const;

const CONFIDENCE_COLORS = {
  HIGH: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-orange-500",
} as const;

// =============================================================================
// Helper Functions
// =============================================================================

function getConfidenceColor(influenceWeight: number): string {
  if (influenceWeight >= CONFIDENCE_THRESHOLDS.HIGH) {
    return CONFIDENCE_COLORS.HIGH;
  }
  if (influenceWeight >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return CONFIDENCE_COLORS.MEDIUM;
  }
  return CONFIDENCE_COLORS.LOW;
}

function getConfidenceLabel(influenceWeight: number): string {
  if (influenceWeight >= CONFIDENCE_THRESHOLDS.HIGH) {
    return "高影响";
  }
  if (influenceWeight >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return "中等影响";
  }
  return "低影响";
}

// =============================================================================
// ImpactCard Component
// =============================================================================

interface ImpactCardProps {
  impact: ConfigImpact;
  compact?: boolean;
}

function ImpactCard({ impact, compact = false }: ImpactCardProps): JSX.Element {
  const confidenceColor = getConfidenceColor(impact.influenceWeight);
  const confidenceLabel = getConfidenceLabel(impact.influenceWeight);

  return (
    <div
      className={cn(
        "border rounded-lg transition-all duration-300",
        compact ? "p-3" : "p-4"
      )}
    >
      {/* Header: Metric Name and Confidence Badge */}
      <div className="flex items-center justify-between gap-2">
        <h5 className="font-semibold text-sm">{impact.metricName}</h5>
        <Badge
          className={cn("text-xs px-2 py-1", confidenceColor)}
          variant="default"
        >
          {impact.influenceWeight}%
        </Badge>
      </div>

      {/* Description */}
      <p
        className={cn(
          "text-sm text-muted-foreground mt-2",
          compact && "text-xs"
        )}
      >
        {impact.description}
      </p>

      {/* Influence Weight Progress Bar */}
      <div
        className={cn(
          "mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          compact && "mt-2 h-1.5"
        )}
      >
        <div
          className={cn("h-full transition-all duration-300", confidenceColor)}
          style={{ width: `${impact.influenceWeight}%` }}
          role="progressbar"
          aria-valuenow={impact.influenceWeight}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${impact.metricName} - ${confidenceLabel}`}
        />
      </div>

      {/* Affected Steps Badges */}
      {impact.affectedSteps.length > 0 && (
        <div
          className={cn(
            "mt-3 flex flex-wrap gap-1",
            compact && "mt-2"
          )}
        >
          {impact.affectedSteps.map((stepId: string) => (
            <Badge key={stepId} variant="outline" className="text-xs">
              {stepId}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function ConfigExplanation({
  explainability,
  currentConfig: _currentConfig,
  mode = "beginner",
  compact = false,
  hideTitle = false,
}: ConfigExplanationProps): JSX.Element {
  const isExpertMode = mode === "expert";
  const isCompactMode = compact || isExpertMode;

  return (
    <div className="config-explanation space-y-4">
      {/* Why This Step Section */}
      <section
        className={cn(
          "space-y-2",
          isCompactMode && "space-y-1"
        )}
      >
        {!hideTitle && (
          <h3 className="text-lg font-semibold">为什么需要这一步？</h3>
        )}
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isCompactMode && "text-xs"
          )}
        >
          {explainability.whyThisStep}
        </p>
      </section>

      {/* Impact Overview Section */}
      <section
        className={cn(
          "space-y-2",
          isCompactMode && "space-y-1"
        )}
      >
        <h4 className="text-base font-medium">影响概览</h4>
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isCompactMode && "text-xs"
          )}
        >
          {explainability.impactOverview}
        </p>
      </section>

      {/* Config Impacts List */}
      <section
        className={cn(
          "space-y-3",
          isCompactMode && "space-y-2"
        )}
      >
        <h4 className="text-base font-medium">配置影响</h4>
        <div
          className={cn(
            "grid gap-3",
            isCompactMode ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          )}
        >
          {explainability.configImpacts.map((impact: ConfigImpact) => (
            <ImpactCard
              key={impact.metricName}
              impact={impact}
              compact={isCompactMode}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
