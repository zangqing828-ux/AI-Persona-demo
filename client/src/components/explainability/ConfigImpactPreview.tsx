import { type JSX } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type {
  ConfigImpact,
  ExplainabilityMetadata,
} from "@shared/types/platform";

// =============================================================================
// Props Interface
// =============================================================================

interface ConfigImpactPreviewProps {
  /** Current configuration values */
  currentConfig: Record<string, unknown>;
  /** Proposed configuration values */
  proposedConfig: Record<string, unknown>;
  /** Explainability metadata for this step */
  explainability: ExplainabilityMetadata;
  /** Callback when user accepts proposed changes */
  onAccept?: (proposedConfig: Record<string, unknown>) => void;
  /** Callback when user cancels */
  onCancel?: () => void;
  /** Compact mode for inline display */
  compact?: boolean;
}

// =============================================================================
// Types
// =============================================================================

interface ConfigChange {
  key: string;
  current: unknown;
  proposed: unknown;
  type: "added" | "removed" | "changed" | "same";
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Compute differences between current and proposed configurations
 * Returns an immutable array of changes
 */
function computeDiff(
  current: Record<string, unknown>,
  proposed: Record<string, unknown>
): ConfigChange[] {
  const allKeys = new Set([
    ...Object.keys(current ?? {}),
    ...Object.keys(proposed ?? {}),
  ]);

  return Array.from(allKeys).map((key) => {
    const currentValue = current?.[key];
    const proposedValue = proposed?.[key];

    if (!(key in (current ?? {}))) {
      return { key, current: undefined, proposed: proposedValue, type: "added" };
    }
    if (!(key in (proposed ?? {}))) {
      return { key, current: currentValue, proposed: undefined, type: "removed" };
    }
    if (currentValue !== proposedValue) {
      return { key, current: currentValue, proposed: proposedValue, type: "changed" };
    }
    return { key, current: currentValue, proposed: proposedValue, type: "same" };
  });
}

/**
 * Format a configuration value for display
 */
function formatValue(value: unknown): string {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * Determine the type of change for visual indicators
 */
function getChangeType(
  current: unknown,
  proposed: unknown
): "increase" | "decrease" | "same" | "unknown" {
  const currentNum = typeof current === "number" ? current : NaN;
  const proposedNum = typeof proposed === "number" ? proposed : NaN;

  if (!isNaN(currentNum) && !isNaN(proposedNum)) {
    if (proposedNum > currentNum) {
      return "increase";
    }
    if (proposedNum < currentNum) {
      return "decrease";
    }
    return "same";
  }

  if (current === proposed) {
    return "same";
  }

  return "unknown";
}

/**
 * Render change indicator icon and styling
 */
function renderChangeIndicator(change: ConfigChange): JSX.Element {
  const changeType = getChangeType(change.current, change.proposed);

  const indicators = {
    increase: { icon: "↑", color: "text-green-600", label: "增加" },
    decrease: { icon: "↓", color: "text-red-600", label: "减少" },
    same: { icon: "−", color: "text-gray-600", label: "无变化" },
    unknown: { icon: "?", color: "text-blue-600", label: "未知" },
  };

  const { icon, color, label } = indicators[changeType];

  return (
    <span className={cn("inline-flex items-center gap-1", color)} aria-label={label}>
      <span className="font-semibold" aria-hidden="true">
        {icon}
      </span>
    </span>
  );
}

// =============================================================================
// Sub-Components
// =============================================================================

interface ConfigDiffTableProps {
  current: Record<string, unknown>;
  proposed: Record<string, unknown>;
  compact?: boolean;
}

function ConfigDiffTable({
  current,
  proposed,
  compact = false,
}: ConfigDiffTableProps): JSX.Element {
  const changes = computeDiff(current, proposed);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left text-sm font-medium">配置项</th>
            <th className="p-2 text-left text-sm font-medium">当前值</th>
            <th className="p-2 text-left text-sm font-medium">建议值</th>
            <th className="p-2 text-left text-sm font-medium">变化</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => (
            <tr
              key={change.key}
              className={cn(
                "border-b transition-colors hover:bg-muted/30",
                change.type !== "same" && "bg-muted/20"
              )}
            >
              <td className="p-2 text-sm font-medium">{change.key}</td>
              <td className={cn(
                "p-2 text-sm text-muted-foreground",
                compact ? "text-xs" : ""
              )}>
                {formatValue(change.current)}
              </td>
              <td className={cn(
                "p-2 text-sm",
                compact ? "text-xs" : "",
                change.type === "added" && "text-green-600 font-medium"
              )}>
                {formatValue(change.proposed)}
              </td>
              <td className="p-2 text-sm">
                {renderChangeIndicator(change)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ImpactPredictionsProps {
  impacts: ConfigImpact[];
  compact?: boolean;
}

function ImpactPredictions({
  impacts,
  compact = false,
}: ImpactPredictionsProps): JSX.Element {
  const CONFIDENCE_THRESHOLDS = {
    HIGH: 70,
    MEDIUM: 40,
  } as const;

  const getConfidenceColor = (weight: number): string => {
    if (weight >= CONFIDENCE_THRESHOLDS.HIGH) {
      return "bg-green-500";
    }
    if (weight >= CONFIDENCE_THRESHOLDS.MEDIUM) {
      return "bg-yellow-500";
    }
    return "bg-orange-500";
  };

  return (
    <div className={cn("space-y-3", compact ? "space-y-2" : "")}>
      {impacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无影响数据</p>
      ) : (
        impacts.map((impact) => (
          <div
            key={impact.metricName}
            className={cn(
              "border rounded-lg p-3 transition-all duration-300",
              compact ? "p-2" : "p-4"
            )}
          >
            {/* Header: Metric Name and Confidence Badge */}
            <div className="flex items-center justify-between gap-2">
              <h5 className={cn(
                "font-semibold",
                compact ? "text-xs" : "text-sm"
              )}>
                {impact.metricName}
              </h5>
              <Badge
                className={cn("text-xs px-2 py-1", getConfidenceColor(impact.influenceWeight))}
                variant="default"
              >
                {impact.influenceWeight}%
              </Badge>
            </div>

            {/* Description */}
            <p className={cn(
              "text-sm text-muted-foreground mt-2",
              compact && "text-xs"
            )}>
              {impact.description}
            </p>

            {/* Influence Weight Progress Bar */}
            <div className={cn(
              "mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
              compact && "mt-2 h-1.5"
            )}>
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  getConfidenceColor(impact.influenceWeight)
                )}
                style={{ width: `${impact.influenceWeight}%` }}
                role="progressbar"
                aria-valuenow={impact.influenceWeight}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${impact.metricName} - 影响权重 ${impact.influenceWeight}%`}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

interface AffectedStepsListProps {
  impacts: ConfigImpact[];
}

function AffectedStepsList({ impacts }: AffectedStepsListProps): JSX.Element {
  // Collect unique affected steps
  const affectedStepsSet = new Set(impacts.flatMap((impact) => impact.affectedSteps));
  const affectedSteps = Array.from(affectedStepsSet);

  if (affectedSteps.length === 0) {
    return <p className="text-sm text-muted-foreground">无影响的步骤</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {affectedSteps.map((stepId) => (
        <Badge key={stepId} variant="outline" className="text-xs">
          {stepId}
        </Badge>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function ConfigImpactPreview({
  currentConfig,
  proposedConfig,
  explainability,
  onAccept,
  onCancel,
  compact = false,
}: ConfigImpactPreviewProps): JSX.Element {
  const handleAccept = () => {
    onAccept?.(proposedConfig);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div
      className={cn(
        "config-impact-preview space-y-4",
        compact ? "space-y-3" : ""
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "space-y-1",
          compact ? "space-y-0.5" : ""
        )}
      >
        <h3 className="text-lg font-semibold">配置影响预览</h3>
        <p className={cn(
          "text-sm text-muted-foreground",
          compact && "text-xs"
        )}>
          查看此配置如何影响最终结果
        </p>
      </header>

      {/* Configuration Changes */}
      <section
        className={cn(
          "space-y-2",
          compact && "space-y-1.5"
        )}
      >
        <h4 className="text-base font-medium">配置变更</h4>
        <div className="border rounded-lg">
          <ConfigDiffTable
            current={currentConfig}
            proposed={proposedConfig}
            compact={compact}
          />
        </div>
      </section>

      {/* Predicted Impacts */}
      <section
        className={cn(
          "space-y-2",
          compact && "space-y-1.5"
        )}
      >
        <h4 className="text-base font-medium">预期影响</h4>
        <ImpactPredictions
          impacts={explainability.configImpacts}
          compact={compact}
        />
      </section>

      {/* Affected Steps */}
      <section
        className={cn(
          "space-y-2",
          compact && "space-y-1.5"
        )}
      >
        <h4 className="text-base font-medium">影响的步骤</h4>
        <AffectedStepsList impacts={explainability.configImpacts} />
      </section>

      {/* Actions */}
      <footer className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          size={compact ? "sm" : "default"}
        >
          取消
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleAccept}
          size={compact ? "sm" : "default"}
        >
          应用更改
        </Button>
      </footer>
    </div>
  );
}
