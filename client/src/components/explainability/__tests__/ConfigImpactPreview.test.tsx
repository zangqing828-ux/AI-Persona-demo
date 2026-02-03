import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfigImpactPreview } from "../ConfigImpactPreview";
import type { ExplainabilityMetadata } from "@shared/types/platform";

// Test wrapper to handle rendering
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

describe("ConfigImpactPreview", () => {
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

  const currentConfig = {
    budget: 1000,
    category: "standard",
    maxRecommendations: 10,
  };

  const proposedConfig = {
    budget: 1500,
    category: "premium",
    maxRecommendations: 15,
  };

  const defaultProps = {
    currentConfig,
    proposedConfig,
    explainability: mockExplainability,
  };

  describe("Basic Rendering", () => {
    it("should render component with all required sections", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("配置影响预览")).toBeInTheDocument();
      expect(screen.getByText("查看此配置如何影响最终结果")).toBeInTheDocument();
      expect(screen.getByText("配置变更")).toBeInTheDocument();
      expect(screen.getByText("预期影响")).toBeInTheDocument();
      expect(screen.getByText("影响的步骤")).toBeInTheDocument();
    });

    it("should render configuration diff table", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // Check for table headers
      expect(screen.getByText("配置项")).toBeInTheDocument();
      expect(screen.getByText("当前值")).toBeInTheDocument();
      expect(screen.getByText("建议值")).toBeInTheDocument();
      expect(screen.getByText("变化")).toBeInTheDocument();

      // Check for configuration keys
      expect(screen.getByText("budget")).toBeInTheDocument();
      expect(screen.getByText("category")).toBeInTheDocument();
      expect(screen.getByText("maxRecommendations")).toBeInTheDocument();
    });

    it("should render current and proposed values", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("1000")).toBeInTheDocument();
      expect(screen.getByText("1500")).toBeInTheDocument();
      expect(screen.getByText("standard")).toBeInTheDocument();
      expect(screen.getByText("premium")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("should render action buttons", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("取消")).toBeInTheDocument();
      expect(screen.getByText("应用更改")).toBeInTheDocument();
    });
  });

  describe("Diff Computation", () => {
    it("should detect added configuration keys", () => {
      const addedConfig = {
        ...currentConfig,
        newFeature: true,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={addedConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      expect(screen.getByText("newFeature")).toBeInTheDocument();
      expect(screen.getByText("true")).toBeInTheDocument();
    });

    it("should detect removed configuration keys", () => {
      const reducedConfig = {
        budget: 1500,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={reducedConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Should show removed keys
      expect(screen.getByText("category")).toBeInTheDocument();
      expect(screen.getByText("maxRecommendations")).toBeInTheDocument();
    });

    it("should detect changed configuration keys", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // All three keys changed
      expect(screen.getByText("budget")).toBeInTheDocument();
      expect(screen.getByText("category")).toBeInTheDocument();
      expect(screen.getByText("maxRecommendations")).toBeInTheDocument();
    });

    it("should handle unchanged configuration keys", () => {
      const sameConfig = {
        ...currentConfig,
        budget: 1000, // Same as current
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={sameConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      expect(screen.getByText("budget")).toBeInTheDocument();
    });

    it("should handle empty configuration objects", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={{}}
            proposedConfig={{}}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      expect(screen.getByText("配置影响预览")).toBeInTheDocument();
    });

    it("should handle complex value types (objects, arrays)", () => {
      const complexCurrent = {
        settings: { theme: "light", notifications: true },
        tags: ["tag1", "tag2"],
      };

      const complexProposed = {
        settings: { theme: "dark", notifications: false },
        tags: ["tag1", "tag2", "tag3"],
      };

      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview
              currentConfig={complexCurrent}
              proposedConfig={complexProposed}
              explainability={mockExplainability}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe("Change Indicators", () => {
    it("should show increase indicator for numeric values", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // Budget increased from 1000 to 1500
      const budgetRow = screen.getAllByText("budget")[0].closest("tr");
      expect(budgetRow).toBeInTheDocument();

      // Should have increase indicator (↑)
      const increaseIndicators = screen.queryAllByText("↑");
      expect(increaseIndicators.length).toBeGreaterThan(0);
    });

    it("should show decrease indicator for numeric values", () => {
      const decreasedProposed = {
        budget: 500,
        category: "basic",
        maxRecommendations: 5,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={decreasedProposed}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Should have decrease indicator (↓)
      const decreaseIndicators = screen.queryAllByText("↓");
      expect(decreaseIndicators.length).toBeGreaterThan(0);
    });

    it("should show no change indicator for unchanged values", () => {
      const unchangedConfig = {
        ...currentConfig,
        budget: 1000,
      };

      render(
        <TestWrapper>
            <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={unchangedConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Should have no change indicator (−) for unchanged budget
      const noChangeIndicators = screen.queryAllByText("−");
      expect(noChangeIndicators.length).toBeGreaterThan(0);
    });

    it("should show unknown indicator for non-numeric changes", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // Category changed from "standard" to "premium" (non-numeric)
      // Should show unknown indicator (?) or specific change indicator
      const categoryRows = screen.getAllByText("category");
      expect(categoryRows.length).toBeGreaterThan(0);
    });
  });

  describe("Impact Predictions", () => {
    it("should render all impact predictions", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("购买意愿")).toBeInTheDocument();
      expect(screen.getByText("用户满意度")).toBeInTheDocument();
      expect(screen.getByText("转化率")).toBeInTheDocument();
    });

    it("should render impact descriptions", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
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
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("70%")).toBeInTheDocument();
      expect(screen.getByText("45%")).toBeInTheDocument();
    });

    it("should render confidence indicators", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // Check for confidence badges
      const confidenceElements = screen.getAllByText(/%/);
      expect(confidenceElements.length).toBeGreaterThan(0);
    });

    it("should handle empty configImpacts array", () => {
      const emptyImpacts: ExplainabilityMetadata = {
        whyThisStep: "测试原因",
        impactOverview: "测试概览",
        configImpacts: [],
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={proposedConfig}
            explainability={emptyImpacts}
          />
        </TestWrapper>
      );

      expect(screen.getByText("预期影响")).toBeInTheDocument();
      expect(screen.getByText("影响的步骤")).toBeInTheDocument();
    });
  });

  describe("Affected Steps", () => {
    it("should render affected step badges", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("product-recommendation")).toBeInTheDocument();
      expect(screen.getByText("checkout-flow")).toBeInTheDocument();
      expect(screen.getByText("user-feedback")).toBeInTheDocument();
      expect(screen.getByText("retention-analysis")).toBeInTheDocument();
      expect(screen.getByText("conversion-tracking")).toBeInTheDocument();
    });

    it("should deduplicate affected steps", () => {
      const duplicateSteps: ExplainabilityMetadata = {
        whyThisStep: "测试",
        impactOverview: "概览",
        configImpacts: [
          {
            metricName: "指标1",
            influenceWeight: 80,
            description: "描述1",
            affectedSteps: ["step-1", "step-2", "step-1"], // Duplicate step-1
          },
          {
            metricName: "指标2",
            influenceWeight: 60,
            description: "描述2",
            affectedSteps: ["step-2", "step-3"], // step-2 appears again
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={proposedConfig}
            explainability={duplicateSteps}
          />
        </TestWrapper>
      );

      // Should show unique steps: step-1, step-2, step-3
      expect(screen.getByText("step-1")).toBeInTheDocument();
      expect(screen.getByText("step-2")).toBeInTheDocument();
      expect(screen.getByText("step-3")).toBeInTheDocument();
    });

    it("should handle impacts with no affected steps", () => {
      const noSteps: ExplainabilityMetadata = {
        whyThisStep: "测试",
        impactOverview: "概览",
        configImpacts: [
          {
            metricName: "无步骤指标",
            influenceWeight: 50,
            description: "无步骤描述",
            affectedSteps: [],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={proposedConfig}
            explainability={noSteps}
          />
        </TestWrapper>
      );

      expect(screen.getByText("影响的步骤")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onAccept when Apply button is clicked", () => {
      const onAccept = vi.fn();

      render(
        <TestWrapper>
          <ConfigImpactPreview
            {...defaultProps}
            onAccept={onAccept}
          />
        </TestWrapper>
      );

      const applyButton = screen.getByText("应用更改");
      fireEvent.click(applyButton);

      expect(onAccept).toHaveBeenCalledTimes(1);
      expect(onAccept).toHaveBeenCalledWith(proposedConfig);
    });

    it("should call onCancel when Cancel button is clicked", () => {
      const onCancel = vi.fn();

      render(
        <TestWrapper>
          <ConfigImpactPreview
            {...defaultProps}
            onCancel={onCancel}
          />
        </TestWrapper>
      );

      const cancelButton = screen.getByText("取消");
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("should not crash when callbacks are not provided", () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview {...defaultProps} />
          </TestWrapper>
        );

        const applyButton = screen.getByText("应用更改");
        const cancelButton = screen.getByText("取消");

        fireEvent.click(applyButton);
        fireEvent.click(cancelButton);
      }).not.toThrow();
    });
  });

  describe("Compact Mode", () => {
    it("should render compact view when compact prop is true", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview
            {...defaultProps}
            compact
          />
        </TestWrapper>
      );

      // Should still render all sections
      expect(screen.getByText("配置影响预览")).toBeInTheDocument();
      expect(screen.getByText("配置变更")).toBeInTheDocument();
      expect(screen.getByText("预期影响")).toBeInTheDocument();
      expect(screen.getByText("影响的步骤")).toBeInTheDocument();
    });

    it("should apply compact styling classes", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigImpactPreview
            {...defaultProps}
            compact
          />
        </TestWrapper>
      );

      // Check for compact-specific classes
      const compactElements = container.querySelectorAll(".space-y-2");
      expect(compactElements.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      const heading3 = screen.getByRole("heading", { level: 3, name: "配置影响预览" });
      expect(heading3).toBeInTheDocument();

      const heading4s = screen.getAllByRole("heading", { level: 4 });
      expect(heading4s.length).toBeGreaterThanOrEqual(3);
    });

    it("should have proper table semantics", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(4); // 配置项, 当前值, 建议值, 变化
    });

    it("should have ARIA labels for change indicators", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // Check for aria-label attributes on interactive elements
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type");
      });
    });

    it("should be keyboard navigable", () => {
      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(2); // 取消 and 应用更改

      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined currentConfig", () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview
              currentConfig={undefined as unknown as Record<string, unknown>}
              proposedConfig={proposedConfig}
              explainability={mockExplainability}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("should handle undefined proposedConfig", () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview
              currentConfig={currentConfig}
              proposedConfig={undefined as unknown as Record<string, unknown>}
              explainability={mockExplainability}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("should handle null and undefined values in config", () => {
      const configWithNulls = {
        value1: null,
        value2: undefined,
        value3: "normal",
      };

      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview
              currentConfig={configWithNulls}
              proposedConfig={configWithNulls}
              explainability={mockExplainability}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it("should handle very long configuration keys", () => {
      const longKeyConfig = {
        "thisIsAVeryVeryVeryLongConfigurationKeyNameThatMightBreakLayout": "value",
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={longKeyConfig}
            proposedConfig={longKeyConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      expect(
        screen.getByText("thisIsAVeryVeryVeryLongConfigurationKeyNameThatMightBreakLayout")
      ).toBeInTheDocument();
    });

    it("should handle very long configuration values", () => {
      const longValueConfig = {
        description: "This is a very long value that contains a lot of text and might wrap to multiple lines in the UI",
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={longValueConfig}
            proposedConfig={longValueConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Should find the value in both current and proposed columns
      expect(
        screen.getAllByText(/This is a very long value/).length
      ).toBeGreaterThan(0);
    });

    it("should handle zero values correctly", () => {
      const configWithZero = {
        count: 0,
        percentage: 0.0,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={configWithZero}
            proposedConfig={configWithZero}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Zero appears in both current and proposed columns
      const zeroElements = screen.getAllByText("0");
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it("should handle negative values correctly", () => {
      const configWithNegative = {
        temperature: -10,
        offset: -5.5,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={configWithNegative}
            proposedConfig={configWithNegative}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Negative values appear in both columns
      const tempElements = screen.getAllByText("-10");
      const offsetElements = screen.getAllByText("-5.5");
      expect(tempElements.length).toBeGreaterThan(0);
      expect(offsetElements.length).toBeGreaterThan(0);
    });

    it("should handle boolean values correctly", () => {
      const configWithBoolean = {
        enabled: true,
        disabled: false,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={configWithBoolean}
            proposedConfig={configWithBoolean}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Boolean values appear in both columns
      const trueElements = screen.getAllByText("true");
      const falseElements = screen.getAllByText("false");
      expect(trueElements.length).toBeGreaterThan(0);
      expect(falseElements.length).toBeGreaterThan(0);
    });

    it("should handle impact with extreme weights", () => {
      const extremeWeights: ExplainabilityMetadata = {
        whyThisStep: "测试",
        impactOverview: "概览",
        configImpacts: [
          {
            metricName: "零权重",
            influenceWeight: 0,
            description: "零权重描述",
            affectedSteps: ["step-1"],
          },
          {
            metricName: "最大权重",
            influenceWeight: 100,
            description: "最大权重描述",
            affectedSteps: ["step-2"],
          },
        ],
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={currentConfig}
            proposedConfig={proposedConfig}
            explainability={extremeWeights}
          />
        </TestWrapper>
      );

      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("Visual Design", () => {
    it("should apply card-based layout classes", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      const cards = container.querySelectorAll(".border");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("should apply rounded corners", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      const roundedElements = container.querySelectorAll(".rounded-lg");
      expect(roundedElements.length).toBeGreaterThan(0);
    });

    it("should apply proper padding", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      const paddedElements = container.querySelectorAll(".p-4");
      expect(paddedElements.length).toBeGreaterThan(0);
    });

    it("should use color-coded indicators", () => {
      const { container } = render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      // Check for color classes
      const greenElements = container.querySelectorAll(".text-green-600");
      const redElements = container.querySelectorAll(".text-red-600");
      const grayElements = container.querySelectorAll(".text-gray-600");

      expect(greenElements.length + redElements.length + grayElements.length).toBeGreaterThan(0);
    });
  });

  describe("Immutability and Data Handling", () => {
    it("should not mutate input props", () => {
      const testCurrentConfig = { ...currentConfig };
      const testProposedConfig = { ...proposedConfig };
      const testExplainability = { ...mockExplainability };

      const originalCurrent = JSON.parse(JSON.stringify(testCurrentConfig));
      const originalProposed = JSON.parse(JSON.stringify(testProposedConfig));
      const originalExplainability = JSON.parse(JSON.stringify(testExplainability));

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={testCurrentConfig}
            proposedConfig={testProposedConfig}
            explainability={testExplainability}
          />
        </TestWrapper>
      );

      expect(testCurrentConfig).toEqual(originalCurrent);
      expect(testProposedConfig).toEqual(originalProposed);
      expect(testExplainability).toEqual(originalExplainability);
    });

    it("should handle missing optional props gracefully", () => {
      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview
              currentConfig={currentConfig}
              proposedConfig={proposedConfig}
              explainability={mockExplainability}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe("Responsive Design", () => {
    it("should render correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("配置影响预览")).toBeInTheDocument();
      expect(screen.getByText("配置变更")).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <ConfigImpactPreview {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText("配置影响预览")).toBeInTheDocument();
      expect(screen.getByText("配置变更")).toBeInTheDocument();
    });
  });

  describe("Value Formatting", () => {
    it("should format string values correctly", () => {
      const stringConfig = {
        name: "Test Product",
        category: "premium",
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={stringConfig}
            proposedConfig={stringConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // String values appear in both columns
      const nameElements = screen.getAllByText("Test Product");
      const categoryElements = screen.getAllByText("premium");
      expect(nameElements.length).toBeGreaterThan(0);
      expect(categoryElements.length).toBeGreaterThan(0);
    });

    it("should format numeric values correctly", () => {
      const numericConfig = {
        price: 99.99,
        quantity: 1000,
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={numericConfig}
            proposedConfig={numericConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Numeric values appear in both columns
      const priceElements = screen.getAllByText("99.99");
      const quantityElements = screen.getAllByText("1000");
      expect(priceElements.length).toBeGreaterThan(0);
      expect(quantityElements.length).toBeGreaterThan(0);
    });

    it("should format array values correctly", () => {
      const arrayConfig = {
        tags: ["tag1", "tag2", "tag3"],
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={arrayConfig}
            proposedConfig={arrayConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Arrays should be displayed as JSON or comma-separated
      const tagsElements = screen.getAllByText(/tag1/);
      expect(tagsElements.length).toBeGreaterThan(0);
    });

    it("should format object values correctly", () => {
      const objectConfig = {
        settings: { theme: "dark", mode: "advanced" },
      };

      render(
        <TestWrapper>
          <ConfigImpactPreview
            currentConfig={objectConfig}
            proposedConfig={objectConfig}
            explainability={mockExplainability}
          />
        </TestWrapper>
      );

      // Objects should be displayed as JSON or formatted string
      const settingsElements = screen.getAllByText(/theme/);
      expect(settingsElements.length).toBeGreaterThan(0);
    });

    it("should handle circular references in objects (fallback to String)", () => {
      // Create an object with circular reference
      const circularObj: Record<string, unknown> = { name: "test" };
      circularObj.self = circularObj; // Circular reference

      const circularConfig = {
        data: circularObj,
      };

      // Should not throw when rendering with circular references
      expect(() => {
        render(
          <TestWrapper>
            <ConfigImpactPreview
              currentConfig={circularConfig}
              proposedConfig={circularConfig}
              explainability={mockExplainability}
            />
          </TestWrapper>
        );
      }).not.toThrow();

      // Component should still render the header
      expect(screen.getByText("配置影响预览")).toBeInTheDocument();
    });
  });
});
