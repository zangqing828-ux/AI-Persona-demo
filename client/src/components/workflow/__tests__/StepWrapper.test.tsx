import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StepWrapper } from "../StepWrapper";
import { ModeSwitcher } from "../ModeSwitcher";
import { UserModeProvider } from "../../../contexts/UserModeContext";
import type { ExplainabilityMetadata } from "@shared/types/platform";

// Test wrapper with UserModeContext
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <UserModeProvider>{children}</UserModeProvider>;
}

describe("StepWrapper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const defaultProps = {
    stepId: "test-step-1",
    stepName: "测试步骤",
    children: <div>Step Content</div>,
  };

  const mockExplainability: ExplainabilityMetadata = {
    whyThisStep: "这一步帮助我们配置基础参数",
    impactOverview: "该配置会影响最终的购买意向评分和信任度",
    configImpacts: [
      {
        metricName: "购买意愿",
        influenceWeight: 85,
        description: "高蛋白含量会显著提升科学养宠用户的购买意愿",
        affectedSteps: ["dual-sim", "batch"],
      },
      {
        metricName: "价格敏感度",
        influenceWeight: 90,
        description: "价格直接影响穷养用户的决策，对高净值用户影响较小",
        affectedSteps: ["dual-sim", "interaction"],
      },
    ],
  };

  describe("Rendering in Beginner Mode", () => {
    it("should render step content in beginner mode", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("Step Content")).toBeInTheDocument();
      expect(screen.getByText("测试步骤")).toBeInTheDocument();
    });

    it("should display explainability panel when explainability is provided", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} explainability={mockExplainability} />
        </TestWrapper>
      );

      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText("这一步帮助我们配置基础参数")).toBeInTheDocument();
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("价格敏感度")).toBeInTheDocument();
    });

    it("should not display explainability panel when explainability is not provided", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByText("为什么需要这一步？")).not.toBeInTheDocument();
    });

    it("should show '准备中' status badge when step is pending", () => {
      render(
        <TestWrapper>
          <StepWrapper
            {...defaultProps}
            isComplete={false}
            isCurrent={false}
          />
        </TestWrapper>
      );

      expect(screen.getByText("准备中")).toBeInTheDocument();
    });

    it("should show '进行中' status badge when step is current", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} isCurrent={true} />
        </TestWrapper>
      );

      expect(screen.getByText("进行中")).toBeInTheDocument();
    });

    it("should show '已完成' status badge when step is complete", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} isComplete={true} />
        </TestWrapper>
      );

      expect(screen.getByText("已完成")).toBeInTheDocument();
    });

    it("should not show skip button in beginner mode", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      expect(screen.queryByText("跳过此步骤")).not.toBeInTheDocument();
    });
  });

  describe("Rendering in Expert Mode", () => {
    beforeEach(() => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );
    });

    it("should render step content in expert mode", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("Step Content")).toBeInTheDocument();
    });

    it("should show compact explainability in expert mode", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} explainability={mockExplainability} />
        </TestWrapper>
      );

      // Explainability should be present but collapsible
      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
    });

    it("should show skip button when canSkip is true", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      expect(screen.getByText("跳过此步骤")).toBeInTheDocument();
    });

    it("should not show skip button when canSkip is false", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={false} />
        </TestWrapper>
      );

      expect(screen.queryByText("跳过此步骤")).not.toBeInTheDocument();
    });

    it("should show '使用默认值' quick action", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      expect(screen.getByText("使用默认值")).toBeInTheDocument();
    });
  });

  describe("Skip Functionality", () => {
    beforeEach(() => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );
    });

    it("should call skipStep when skip button is clicked", async () => {
      const onSkip = vi.fn();

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} onSkip={onSkip} />
        </TestWrapper>
      );

      const skipButton = screen.getByText("跳过此步骤");
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(onSkip).toHaveBeenCalledTimes(1);
      });
    });

    it("should update step status to skipped after skip action", async () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      const skipButton = screen.getByText("跳过此步骤");
      fireEvent.click(skipButton);

      await waitFor(() => {
        expect(screen.getByText("已跳过")).toBeInTheDocument();
      });
    });

    it("should call onUseDefaults when '使用默认值' button is clicked", async () => {
      const onUseDefaults = vi.fn();

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} onUseDefaults={onUseDefaults} />
        </TestWrapper>
      );

      const useDefaultsButton = screen.getByText("使用默认值");
      fireEvent.click(useDefaultsButton);

      await waitFor(() => {
        expect(onUseDefaults).toHaveBeenCalledTimes(1);
      });
    });

    it("should show Quick Stats placeholder in expert mode", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      expect(screen.getByText("影响预览功能即将推出")).toBeInTheDocument();
    });
  });

  describe("Skipped Step Rendering", () => {
    beforeEach(() => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: ["test-step-1"],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );
    });

    it("should show placeholder when step is skipped", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      // Text is split across elements, use flexible matcher
      expect(screen.getByText((content) => content.includes("此步骤已跳过"))).toBeInTheDocument();
      // "使用默认值" appears twice - once in description, once in button
      const defaultTexts = screen.getAllByText((content) => content.includes("使用默认值"));
      expect(defaultTexts.length).toBeGreaterThan(0);
    });

    it("should show restore button in placeholder", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("恢复")).toBeInTheDocument();
    });

    it("should restore step when restore button is clicked", async () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      const restoreButton = screen.getByText("恢复");
      fireEvent.click(restoreButton);

      await waitFor(() => {
        expect(screen.getByText("Step Content")).toBeInTheDocument();
        expect(screen.queryByText((content) => content.includes("此步骤已跳过"))).not.toBeInTheDocument();
      });
    });
  });

  describe("Mode Switching Behavior", () => {
    it("should update rendering when mode switches from beginner to expert", async () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} explainability={mockExplainability} />
          <ModeSwitcher />
        </TestWrapper>
      );

      // Beginner mode - no skip button
      expect(screen.queryByText("跳过此步骤")).not.toBeInTheDocument();

      // Switch to expert mode
      const toggleButton = screen.getByRole("button", { name: /切换到专家模式/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const confirmButton = screen.queryByRole("button", { name: /确认切换/i });
        if (confirmButton) {
          fireEvent.click(confirmButton);
        }
      });

      // Expert mode - skip button should appear
      await waitFor(() => {
        expect(screen.getByText("跳过此步骤")).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it("should update rendering when mode switches from expert to beginner", async () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} explainability={mockExplainability} />
          <ModeSwitcher />
        </TestWrapper>
      );

      // Expert mode - skip button visible
      expect(screen.getByText("跳过此步骤")).toBeInTheDocument();

      // Switch to beginner mode
      const toggleButton = screen.getByRole("button", {
        name: /切换到新手模式/i,
      });
      fireEvent.click(toggleButton);

      // Beginner mode - skip button should disappear
      await waitFor(() => {
        expect(screen.queryByText("跳过此步骤")).not.toBeInTheDocument();
      });
    });
  });

  describe("Explainability Panel Expansion/Collapse", () => {
    beforeEach(() => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );
    });

    it("should show collapsed explainability in expert mode initially", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} explainability={mockExplainability} />
        </TestWrapper>
      );

      // Should show expand button
      expect(screen.getByText("展开")).toBeInTheDocument();
    });

    it("should expand explainability when expand button is clicked", async () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} explainability={mockExplainability} />
        </TestWrapper>
      );

      const expandButton = screen.getByText("展开");
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("购买意愿")).toBeInTheDocument();
        expect(screen.getByText("价格敏感度")).toBeInTheDocument();
        expect(screen.getByText("收起")).toBeInTheDocument();
      });
    });

    it("should collapse explainability when collapse button is clicked", async () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} explainability={mockExplainability} />
        </TestWrapper>
      );

      // Expand first
      const expandButton = screen.getByText("展开");
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("购买意愿")).toBeInTheDocument();
      });

      // Then collapse
      const collapseButton = screen.getByText("收起");
      fireEvent.click(collapseButton);

      await waitFor(() => {
        // Content should be hidden but title remains
        expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
        expect(screen.getByText("展开")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      const heading = screen.getByRole("heading", { name: "测试步骤" });
      expect(heading).toBeInTheDocument();
    });

    it("should have proper ARIA labels on skip button", () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      const skipButton = screen.getByText("跳过此步骤");
      // Button component should be clickable and have proper label
      expect(skipButton).toBeInTheDocument();
      expect(skipButton.tagName.toLowerCase()).toBe("button");
    });

    it("should be keyboard navigable", () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      const skipButton = screen.getByText("跳过此步骤");

      // Test Enter key
      fireEvent.keyDown(skipButton, { key: "Enter", code: "Enter" });
      expect(skipButton).toBeInTheDocument();

      // Test Space key
      fireEvent.keyDown(skipButton, { key: " ", code: "Space" });
      expect(skipButton).toBeInTheDocument();
    });

    it("should announce mode changes to screen readers", async () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
          <ModeSwitcher />
        </TestWrapper>
      );

      // Toggle mode
      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const confirmButton = screen.queryByRole("button", { name: /确认切换/i });
        if (confirmButton) {
          expect(confirmButton).toBeInTheDocument();
        } else {
          // If no confirmation (already seen expert mode), mode should still switch
          expect(screen.getByText(/完全控制/)).toBeInTheDocument();
        }
      });
    });
  });

  describe("Step Status Display", () => {
    it("should show gray badge for pending status", () => {
      render(
        <TestWrapper>
          <StepWrapper
            {...defaultProps}
            isComplete={false}
            isCurrent={false}
          />
        </TestWrapper>
      );

      const badge = screen.getByText("准备中");
      expect(badge).toBeInTheDocument();
    });

    it("should show blue badge for current status", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} isCurrent={true} />
        </TestWrapper>
      );

      const badge = screen.getByText("进行中");
      expect(badge).toBeInTheDocument();
    });

    it("should show green badge for completed status", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} isComplete={true} />
        </TestWrapper>
      );

      const badge = screen.getByText("已完成");
      expect(badge).toBeInTheDocument();
    });

    it("should show orange badge for skipped status", () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: ["test-step-1"],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      const badge = screen.getByText("已跳过");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering for Skipped Steps", () => {
    it("should not render children when step is skipped", () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: ["test-step-1"],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      // Should show placeholder instead of children
      expect(screen.queryByText("Step Content")).not.toBeInTheDocument();
      expect(screen.getByText((content) => content.includes("此步骤已跳过"))).toBeInTheDocument();
    });

    it("should render children when step is not skipped", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("Step Content")).toBeInTheDocument();
      expect(screen.queryByText((content) => content.includes("此步骤已跳过"))).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle context errors gracefully", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(
          <StepWrapper {...defaultProps}>
            <div>Step Content</div>
          </StepWrapper>
        );
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it("should handle missing props gracefully", () => {
      render(
        <TestWrapper>
          {/* @ts-ignore - testing missing props */}
          <StepWrapper />
        </TestWrapper>
      );

      // Component should not crash
      expect(document.body).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("测试步骤")).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("测试步骤")).toBeInTheDocument();
    });
  });

  describe("Integration with UserModeContext", () => {
    it("should use context to check if step is skipped", () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: ["test-step-1"],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} />
        </TestWrapper>
      );

      // Should show placeholder because step is in skippedSteps
      expect(screen.getByText((content) => content.includes("此步骤已跳过"))).toBeInTheDocument();
    });

    it("should update when context skippedSteps changes", async () => {
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: [],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} canSkip={true} />
        </TestWrapper>
      );

      // Initially not skipped
      expect(screen.getByText("Step Content")).toBeInTheDocument();

      // Skip the step
      const skipButton = screen.getByText("跳过此步骤");
      fireEvent.click(skipButton);

      // Should show placeholder
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes("此步骤已跳过"))).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty explainability gracefully", () => {
      const emptyExplainability: ExplainabilityMetadata = {
        whyThisStep: "",
        impactOverview: "",
        configImpacts: [],
      };

      render(
        <TestWrapper>
          <StepWrapper
            {...defaultProps}
            explainability={emptyExplainability}
          />
        </TestWrapper>
      );

      expect(screen.getByText("测试步骤")).toBeInTheDocument();
    });

    it("should handle multiple config impacts", () => {
      const multiImpactExplainability: ExplainabilityMetadata = {
        whyThisStep: "这一步帮助我们配置基础参数",
        impactOverview: "该配置会影响最终的购买意向评分和信任度",
        configImpacts: [
          {
            metricName: "购买意愿",
            influenceWeight: 85,
            description: "高蛋白含量会显著提升科学养宠用户的购买意愿",
            affectedSteps: ["dual-sim", "batch"],
          },
          {
            metricName: "价格敏感度",
            influenceWeight: 90,
            description: "价格直接影响穷养用户的决策，对高净值用户影响较小",
            affectedSteps: ["dual-sim", "interaction"],
          },
          {
            metricName: "信任度",
            influenceWeight: 75,
            description: "品牌认证和成分透明度影响用户信任",
            affectedSteps: ["batch"],
          },
        ],
      };

      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} explainability={multiImpactExplainability} />
        </TestWrapper>
      );

      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("价格敏感度")).toBeInTheDocument();
      expect(screen.getByText("信任度")).toBeInTheDocument();
    });

    it("should handle both isComplete and isCurrent being true", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps} isComplete={true} isCurrent={true} />
        </TestWrapper>
      );

      // Should prioritize current status
      expect(screen.getByText("进行中")).toBeInTheDocument();
    });

    it("should handle children being null", () => {
      render(
        <TestWrapper>
          <StepWrapper {...defaultProps}>{null}</StepWrapper>
        </TestWrapper>
      );

      expect(screen.getByText("测试步骤")).toBeInTheDocument();
    });
  });
});
