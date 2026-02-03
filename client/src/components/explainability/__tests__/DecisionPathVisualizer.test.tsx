import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { DecisionPathVisualizer } from "../DecisionPathVisualizer";
import type { ExecutionTrace } from "@shared/types/execution";

// Mock the execution trace data
const mockExecutionTrace: ExecutionTrace = {
  traceId: "trace-123",
  sessionId: "session-456",
  timestamp: new Date("2024-01-15T10:00:00Z"),
  workflowConfig: {
    industry: "tech",
    steps: ["step1", "step2", "step3"],
    mode: "beginner",
  },
  stepTraces: [
    {
      stepId: "step1",
      stepName: "Step 1",
      configSnapshot: { key1: "value1" },
      executionTime: 100,
      rulesTriggered: [],
      intermediateOutputs: [],
      timestamp: new Date("2024-01-15T10:00:00Z"),
    },
    {
      stepId: "step2",
      stepName: "Step 2",
      configSnapshot: { key2: "value2" },
      executionTime: 200,
      rulesTriggered: [],
      intermediateOutputs: [],
      timestamp: new Date("2024-01-15T10:00:01Z"),
    },
    {
      stepId: "step3",
      stepName: "Step 3",
      configSnapshot: { key3: "value3" },
      executionTime: 0,
      rulesTriggered: [],
      intermediateOutputs: [],
      timestamp: new Date("2024-01-15T10:00:01Z"),
    },
  ],
  finalMetrics: {
    accuracy: 85,
    efficiency: 90,
  },
  totalExecutionTime: 300,
};

describe("DecisionPathVisualizer", () => {
  const mockOnStepClick = vi.fn();

  it("renders timeline with steps", () => {
    render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} />);

    expect(screen.getByRole("heading", { name: "决策路径" })).toBeInTheDocument();
    expect(screen.getByText("总执行时间: 300ms")).toBeInTheDocument();

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("displays execution time for completed steps", () => {
    render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} />);

    expect(screen.getByText("100ms")).toBeInTheDocument();
    expect(screen.getByText("200ms")).toBeInTheDocument();
  });

  it("shows skipped steps with appropriate styling", () => {
    render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} />);

    const steps = screen.getAllByRole("button");
    expect(steps).toHaveLength(3);

    // Check class names by looking at the DOM structure
    expect(steps[0]).toHaveClass("bg-green-50");
    expect(steps[1]).toHaveClass("bg-green-50");
    expect(steps[2]).toHaveClass("bg-orange-50");
  });

  it("handles compact mode", () => {
    render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} compact={true} />);

    const container = screen.getByRole("heading", { name: "决策路径" }).closest(".decision-path-visualizer");
    expect(container).toHaveClass("p-3");
    expect(container).toHaveClass("space-y-2");
  });

  it("calls onStepClick when step is clicked", () => {
    render(<DecisionPathVisualizer
      executionTrace={mockExecutionTrace}
      onStepClick={mockOnStepClick}
    />);

    const steps = screen.getAllByRole("button");
    fireEvent.click(steps[0]);

    expect(mockOnStepClick).toHaveBeenCalledWith("step1");
  });

  it("displays hover information", () => {
    // Tooltip content is rendered in the DOM but not directly queryable
    // Test the tooltip structure by checking the button's aria-label
    render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} />);

    const steps = screen.getAllByRole("button");
    expect(steps[0]).toHaveAttribute("aria-label", "Step 1 - completed");
    expect(steps[1]).toHaveAttribute("aria-label", "Step 2 - completed");
    expect(steps[2]).toHaveAttribute("aria-label", "Step 3 - skipped");
  });

  it("formats duration correctly", () => {
    render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} />);

    expect(screen.getByText("总执行时间: 300ms")).toBeInTheDocument();
  });

  it("handles empty execution trace", () => {
    const emptyTrace: ExecutionTrace = {
      traceId: "trace-empty",
      sessionId: "session-empty",
      timestamp: new Date(),
      workflowConfig: {
        industry: "tech",
        steps: [],
        mode: "beginner",
      },
      stepTraces: [],
      finalMetrics: {},
      totalExecutionTime: 0,
    };

    render(<DecisionPathVisualizer executionTrace={emptyTrace} />);

    expect(screen.getByRole("heading", { name: "决策路径" })).toBeInTheDocument();
    expect(screen.getByText("总执行时间: 0ms")).toBeInTheDocument();
    expect(screen.getByText("没有执行步骤")).toBeInTheDocument();
  });

  it("handles onStepClick callback with null", () => {
    expect(() => {
      render(<DecisionPathVisualizer executionTrace={mockExecutionTrace} />);
    }).not.toThrow();
  });
});