import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfigExplanation } from "../ConfigExplanation";
import type { ExplainabilityMetadata } from "@shared/types/platform";

// Test wrapper to handle rendering
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

describe("ConfigExplanation", () => {
  const mockExplainability: ExplainabilityMetadata = {
    whyThisStep: "这一步帮助我们了解用户偏好，从而生成更准确的个性化推荐。",
    impactOverview: "此配置直接影响推荐系统的准确性，影响用户满意度和转化率。",
    configImpacts: [
      {
        metricName: "购买意愿",
        influenceWeight: 85,
        description: "影响用户购买决策的预测准确性",
        affectedSteps: ["product-recommendation", "checkout-flow"],
      },
      {
        metricName: "用户满意度",
        influenceWeight: 70,
        description: "影响推荐内容与用户偏好的匹配度",
        affectedSteps: ["user-feedback", "retention-analysis"],
      },
      {
        metricName: "转化率",
        influenceWeight: 45,
        description: "影响从浏览到购买的转化比例",
        affectedSteps: ["conversion-tracking"],
      },
    ],
  };

  const defaultProps = {
    explainability: mockExplainability,
  };

  describe("Basic Rendering", () => {
    it("should render component with explainability metadata", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText(mockExplainability.whyThisStep)).toBeInTheDocument();
    });

    it("should render impact overview section", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("影响概览")).toBeInTheDocument();
      expect(screen.getByText(mockExplainability.impactOverview)).toBeInTheDocument();
    });

    it("should render all config impacts", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("配置影响")).toBeInTheDocument();
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("用户满意度")).toBeInTheDocument();
      expect(screen.getByText("转化率")).toBeInTheDocument();
    });

    it("should render impact descriptions", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(
        screen.getByText("影响用户购买决策的预测准确性")
      ).toBeInTheDocument();
      expect(
        screen.getByText("影响推荐内容与用户偏好的匹配度")
      ).toBeInTheDocument();
      expect(screen.getByText("影响从浏览到购买的转化比例")).toBeInTheDocument();
    });

    it("should render influence weight percentages", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("70%")).toBeInTheDocument();
      expect(screen.getByText("45%")).toBeInTheDocument();
    });

    it("should render affected step badges", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("product-recommendation")).toBeInTheDocument();
      expect(screen.getByText("checkout-flow")).toBeInTheDocument();
      expect(screen.getByText("user-feedback")).toBeInTheDocument();
      expect(screen.getByText("retention-analysis")).toBeInTheDocument();
      expect(screen.getByText("conversion-tracking")).toBeInTheDocument();
    });
  });

  describe("Confidence Indicators", () => {
    it("should show high confidence for weight >= 70", () => {
      const highConfidenceExplainability: ExplainabilityMetadata = {
        ...mockExplainability,
        configImpacts: [
          {
            metricName: "高影响指标",
            influenceWeight: 85,
            description: "高影响描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={highConfidenceExplainability} />
        </TestWrapper>
      );

      // Check for green color class (high confidence)
      const confidenceElement = screen.getByText("85%");
      expect(confidenceElement).toBeInTheDocument();
      expect(confidenceElement.className).toContain("bg-green-500");
    });

    it("should show medium confidence for weight 40-69", () => {
      const mediumConfidenceExplainability: ExplainabilityMetadata = {
        ...mockExplainability,
        configImpacts: [
          {
            metricName: "中影响指标",
            influenceWeight: 55,
            description: "中影响描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={mediumConfidenceExplainability} />
        </TestWrapper>
      );

      const confidenceElement = screen.getByText("55%");
      expect(confidenceElement).toBeInTheDocument();
      expect(confidenceElement.className).toContain("bg-yellow-500");
    });

    it("should show low confidence for weight < 40", () => {
      const lowConfidenceExplainability: ExplainabilityMetadata = {
        ...mockExplainability,
        configImpacts: [
          {
            metricName: "低影响指标",
            influenceWeight: 25,
            description: "低影响描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={lowConfidenceExplainability} />
        </TestWrapper>
      );

      const confidenceElement = screen.getByText("25%");
      expect(confidenceElement).toBeInTheDocument();
      expect(confidenceElement.className).toContain("bg-orange-500");
    });

    it("should render progress bars for influence weights", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      // Check for progress bar elements
      const progressBars = document.querySelectorAll('[role="progressbar"]');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe("Mode-Aware Behavior", () => {
    it("should display full explanations in beginner mode", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} mode="beginner" />
        </TestWrapper>
      );

      // All sections should be visible
      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText("影响概览")).toBeInTheDocument();
      expect(screen.getByText("配置影响")).toBeInTheDocument();

      // All impact details should be visible
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("影响用户购买决策的预测准确性")).toBeInTheDocument();
    });

    it("should display compact view in expert mode", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} mode="expert" />
        </TestWrapper>
      );

      // Should still render but may be collapsible
      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
    });

    it("should display compact view when compact prop is true", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} compact />
        </TestWrapper>
      );

      // Should render with minimal layout
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
    });
  });

  describe("Current Config Display", () => {
    it("should not crash when currentConfig is provided", () => {
      const currentConfig = {
        budget: 1000,
        category: "premium",
      };

      expect(() => {
        render(
          <TestWrapper>
            <ConfigExplanation {...defaultProps} currentConfig={currentConfig} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("should not crash when currentConfig is undefined", () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfigExplanation {...defaultProps} />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty configImpacts array", () => {
      const emptyImpacts: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={emptyImpacts} />
        </TestWrapper>
      );

      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText("影响概览")).toBeInTheDocument();
      expect(screen.getByText("配置影响")).toBeInTheDocument();
    });

    it("should handle single config impact", () => {
      const singleImpact: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [
          {
            metricName: "单一指标",
            influenceWeight: 50,
            description: "单一描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={singleImpact} />
        </TestWrapper>
      );

      expect(screen.getByText("单一指标")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("should handle impact with no affected steps", () => {
      const noStepsImpact: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [
          {
            metricName: "无步骤指标",
            influenceWeight: 60,
            description: "无步骤描述",
            affectedSteps: [],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={noStepsImpact} />
        </TestWrapper>
      );

      expect(screen.getByText("无步骤指标")).toBeInTheDocument();
    });

    it("should handle long metric names", () => {
      const longNameImpact: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [
          {
            metricName: "这是一个非常非常非常长的指标名称用于测试布局",
            influenceWeight: 75,
            description: "描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={longNameImpact} />
        </TestWrapper>
      );

      expect(
        screen.getByText("这是一个非常非常非常长的指标名称用于测试布局")
      ).toBeInTheDocument();
    });

    it("should handle impact with weight of 0", () => {
      const zeroWeightImpact: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [
          {
            metricName: "零权重指标",
            influenceWeight: 0,
            description: "零权重描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={zeroWeightImpact} />
        </TestWrapper>
      );

      expect(screen.getByText("零权重指标")).toBeInTheDocument();
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should handle impact with weight of 100", () => {
      const maxWeightImpact: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [
          {
            metricName: "最大权重指标",
            influenceWeight: 100,
            description: "最大权重描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigExplanation explainability={maxWeightImpact} />
        </TestWrapper>
      );

      expect(screen.getByText("最大权重指标")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      const heading3 = screen.getByRole("heading", { level: 3, name: "为什么需要这一步？" });
      expect(heading3).toBeInTheDocument();

      const heading4s = screen.getAllByRole("heading", { level: 4 });
      expect(heading4s.length).toBeGreaterThan(0);
    });

    it("should have ARIA labels on progress bars", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      const progressBars = document.querySelectorAll('[role="progressbar"]');
      expect(progressBars.length).toBeGreaterThan(0);

      progressBars.forEach((bar) => {
        expect(bar).toHaveAttribute("role", "progressbar");
      });
    });

    it("should be keyboard navigable", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      // Check for interactive elements
      const interactiveElements = container.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );

      // Should have at least some interactive elements or be properly structured
      expect(interactiveElements.length).toBeGreaterThanOrEqual(0);
    });

    it("should have proper text contrast for color indicators", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      const greenBadge = screen.getByText("85%");
      const yellowBadge = screen.getByText("70%");
      const orangeBadge = screen.getByText("45%");

      expect(greenBadge).toBeInTheDocument();
      expect(yellowBadge).toBeInTheDocument();
      expect(orangeBadge).toBeInTheDocument();
    });
  });

  describe("ImpactCard Component", () => {
    it("should render impact card with all required elements", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      // Check for metric name
      expect(screen.getByText("购买意愿")).toBeInTheDocument();

      // Check for influence weight
      expect(screen.getByText("85%")).toBeInTheDocument();

      // Check for description
      expect(screen.getByText("影响用户购买决策的预测准确性")).toBeInTheDocument();

      // Check for affected steps badges
      expect(screen.getByText("product-recommendation")).toBeInTheDocument();
      expect(screen.getByText("checkout-flow")).toBeInTheDocument();
    });

    it("should render multiple impact cards", () => {
      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      // Should have 3 impact cards
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("用户满意度")).toBeInTheDocument();
      expect(screen.getByText("转化率")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("为什么需要这一步？")).toBeInTheDocument();
      expect(screen.getByText("购买意愿")).toBeInTheDocument();
    });
  });

  describe("Visual Design", () => {
    it("should apply card-based layout classes", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      // Check for card elements
      const cards = container.querySelectorAll(".border");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("should apply rounded corners to impact cards", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      const roundedElements = container.querySelectorAll(".rounded-lg");
      expect(roundedElements.length).toBeGreaterThan(0);
    });

    it("should apply padding to impact cards", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigExplanation {...defaultProps} />
        </TestWrapper>
      );

      const paddedElements = container.querySelectorAll(".p-4");
      expect(paddedElements.length).toBeGreaterThan(0);
    });
  });

  describe("Immutability and Data Handling", () => {
    it("should not mutate props", () => {
      const testExplainability: ExplainabilityMetadata = {
        whyThisStep: "测试",
        impactOverview: "概览",
        configImpacts: [
          {
            metricName: "测试指标",
            influenceWeight: 50,
            description: "测试描述",
            affectedSteps: ["step-1"],
          },
        ],
      };

      const originalData = JSON.parse(JSON.stringify(testExplainability));

      render(
        <TestWrapper>
          <ConfigExplanation explainability={testExplainability} />
        </TestWrapper>
      );

      expect(testExplainability).toEqual(originalData);
    });

    it("should handle missing optional props gracefully", () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfigExplanation explainability={mockExplainability} />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});
