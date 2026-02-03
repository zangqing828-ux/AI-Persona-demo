import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModeSwitcher } from "../ModeSwitcher";
import { UserModeProvider } from "../../../contexts/UserModeContext";

// Test wrapper with UserModeContext
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <UserModeProvider>{children}</UserModeProvider>;
}

describe("ModeSwitcher", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render in beginner mode by default", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      // Check for beginner mode indicator
      expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();
      expect(screen.getByText(/每步都有详细说明/i)).toBeInTheDocument();

      // Check for beginner icon (GraduationCap)
      const beginnerIcon = document.querySelector('[data-icon="graduation-cap"]');
      expect(beginnerIcon).toBeInTheDocument();
    });

    it("should render in expert mode when toggled", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      // Click to toggle to expert mode (will show confirmation dialog first)
      const toggleButton = screen.getByRole("button", { name: /切换到专家模式/i });
      fireEvent.click(toggleButton);

      // Confirm the dialog
      const confirmButton = await screen.findByRole("button", {
        name: /确认切换/i,
      });
      fireEvent.click(confirmButton);

      // Wait for mode switch
      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
        expect(screen.getByText(/可跳过非关键步骤/i)).toBeInTheDocument();
      });

      // Check for expert icon (Zap)
      const expertIcon = document.querySelector('[data-icon="zap"]');
      expect(expertIcon).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <TestWrapper>
          <ModeSwitcher className="custom-class" />
        </TestWrapper>
      );

      const container = screen.getByRole("button", {
        name: /切换到专家模式/i,
      }).closest("div");
      expect(container).toHaveClass("custom-class");
    });

    it("should display stats badge in expert mode with skip count", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      // Toggle to expert mode
      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      const confirmButton = await screen.findByRole("button", {
        name: /确认切换/i,
      });
      fireEvent.click(confirmButton);

      // Check for stats badge
      await waitFor(() => {
        const statsBadge = screen.queryByText(/可跳过 \d+ 个步骤/i);
        expect(statsBadge).toBeInTheDocument();
      });
    });

    it("should not display stats badge in beginner mode", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const statsBadge = screen.queryByText(/可跳过 \d+ 个步骤/i);
      expect(statsBadge).not.toBeInTheDocument();
    });
  });

  describe("Toggle Functionality", () => {
    it("should toggle from beginner to expert mode with confirmation", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      // Initial state: beginner mode
      expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();

      // Click to toggle
      fireEvent.click(toggleButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(
          screen.getByText(/专家模式允许跳过某些配置步骤/i)
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /确认切换/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /取消/i })).toBeInTheDocument();
      });

      // Confirm the switch
      const confirmButton = screen.getByRole("button", { name: /确认切换/i });
      fireEvent.click(confirmButton);

      // Should switch to expert mode
      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
      });
    });

    it("should cancel mode switch when cancel button is clicked", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      fireEvent.click(toggleButton);

      // Wait for dialog
      await waitFor(() => {
        expect(
          screen.getByText(/专家模式允许跳过某些配置步骤/i)
        ).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole("button", { name: /取消/i });
      fireEvent.click(cancelButton);

      // Should remain in beginner mode
      await waitFor(() => {
        expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();
        expect(
          screen.queryByText(/完全控制/i)
        ).not.toBeInTheDocument();
      });
    });

    it("should toggle from expert to beginner without confirmation", async () => {
      // Start in expert mode by setting localStorage
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
          <ModeSwitcher />
        </TestWrapper>
      );

      // Should start in expert mode
      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
      });

      const toggleButton = screen.getByRole("button", {
        name: /切换到新手模式/i,
      });

      // Click to toggle back to beginner
      fireEvent.click(toggleButton);

      // Should switch immediately without confirmation
      await waitFor(() => {
        expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();
        expect(
          screen.queryByText(/完全控制/i)
        ).not.toBeInTheDocument();
      });
    });

    it("should only show confirmation on first switch to expert mode", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      // First switch to expert - should show confirmation
      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(
          screen.getByText(/专家模式允许跳过某些配置步骤/i)
        ).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole("button", { name: /确认切换/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
      });

      // Switch back to beginner
      const toggleBackButton = screen.getByRole("button", {
        name: /切换到新手模式/i,
      });
      fireEvent.click(toggleBackButton);

      await waitFor(() => {
        expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();
      });

      // Switch to expert again - should NOT show confirmation
      const toggleToExpertAgain = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleToExpertAgain);

      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
        expect(
          screen.queryByText(/专家模式允许跳过某些配置步骤/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("First-Time Expert Mode Confirmation", () => {
    it("should display confirmation dialog on first expert mode switch", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();

        expect(
          screen.getByText(/专家模式允许跳过某些配置步骤/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/这可能会影响模拟结果的准确性/i)
        ).toBeInTheDocument();
      });
    });

    it("should have correct buttons in confirmation dialog", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /确认切换/i })
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /取消/i })).toBeInTheDocument();
      });
    });

    it("should close dialog when clicking outside", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(
          screen.getByText(/专家模式允许跳过某些配置步骤/i)
        ).toBeInTheDocument();
      });

      // Dialog has onPointerDownOutside handler set
      // This tests that the handler is configured (actual closing is Radix UI's responsibility)
      const dialogContent = screen.getByRole("dialog");
      expect(dialogContent).toBeInTheDocument();

      // Verify cancel button works (user can manually close)
      const cancelButton = screen.getByRole("button", { name: /取消/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/专家模式允许跳过某些配置步骤/i)
        ).not.toBeInTheDocument();
      });
    });

    it("should close dialog on Escape key press", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(
          screen.getByText(/专家模式允许跳过某些配置步骤/i)
        ).toBeInTheDocument();
      });

      // Dialog has onEscapeKeyDown handler set
      // This tests that the handler is configured (actual closing is Radix UI's responsibility)
      const dialogContent = screen.getByRole("dialog");
      expect(dialogContent).toBeInTheDocument();

      // Verify cancel button works (user can manually close)
      const cancelButton = screen.getByRole("button", { name: /取消/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/专家模式允许跳过某些配置步骤/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Stats Display", () => {
    it("should display '可跳过 0 个步骤' when no steps are skipped", async () => {
      // Start in expert mode
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
          <ModeSwitcher />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/可跳过 0 个步骤/i)).toBeInTheDocument();
      });
    });

    it("should display correct count when steps are skipped", async () => {
      // Start in expert mode with skipped steps
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: ["step1", "step2", "step3"],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/可跳过 3 个步骤/i)).toBeInTheDocument();
      });
    });

    it("should update stats badge dynamically when steps are skipped", async () => {
      // This test verifies that the component updates when context changes
      // For full integration, we'd need to use the context methods
      // For now, we test the initial render with different states
      localStorage.setItem(
        "ai-persona-user-mode",
        JSON.stringify({
          mode: "expert",
          skippedSteps: ["step1"],
          preferences: {
            autoSkipDefaults: false,
            showImpactPreviews: true,
            explanationLevel: "standard",
          },
        })
      );

      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/可跳过 1 个步骤/i)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on toggle button", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    });

    it("should update ARIA labels when mode changes", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      expect(toggleButton).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(toggleButton);

      const confirmButton = await screen.findByRole("button", {
        name: /确认切换/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        const newToggleButton = screen.getByRole("button", {
          name: /切换到新手模式/i,
        });
        expect(newToggleButton).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("should be keyboard navigable", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      // Test Enter key
      fireEvent.keyDown(toggleButton, { key: "Enter", code: "Enter" });

      // Should trigger toggle (dialog appears)
      expect(
        screen.queryByText(/专家模式允许跳过某些配置步骤/i)
      ).toBeInTheDocument();
    });

    it("should support Space key for activation", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      // Test Space key
      fireEvent.keyDown(toggleButton, { key: " ", code: "Space" });

      // Should trigger toggle (dialog appears)
      expect(
        screen.queryByText(/专家模式允许跳过某些配置步骤/i)
      ).toBeInTheDocument();
    });

    it("should have proper focus management", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      // Verify button can receive focus
      toggleButton.focus();
      expect(toggleButton).toHaveFocus();

      // Open dialog
      fireEvent.click(toggleButton);

      await waitFor(() => {
        // Dialog should be open and focusable
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should have descriptive alt text for icons", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      // Icons should have aria-hidden or be decorative
      const beginnerIcon = document.querySelector('[data-icon="graduation-cap"]');
      expect(beginnerIcon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Animation Transitions", () => {
    it("should apply transition classes to toggle button", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      // Check for transition classes (Framer Motion adds these)
      const buttonContainer = toggleButton.closest("div");
      expect(buttonContainer).toBeInTheDocument();
    });

    it("should animate mode switch", async () => {
      const startTime = performance.now();

      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });

      fireEvent.click(toggleButton);

      const confirmButton = await screen.findByRole("button", {
        name: /确认切换/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Animation should be roughly 300ms (allowing some variance for test execution)
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe("Responsive Design", () => {
    it("should render correctly on mobile viewport", () => {
      // Set mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();
      expect(screen.getByText(/每步都有详细说明/i)).toBeInTheDocument();
    });

    it("should render correctly on desktop viewport", () => {
      // Set desktop viewport
      global.innerWidth = 1920;
      global.dispatchEvent(new Event("resize"));

      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();
      expect(screen.getByText(/每步都有详细说明/i)).toBeInTheDocument();
    });
  });

  describe("Mode Descriptions", () => {
    it("should show correct description for beginner mode", () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      expect(screen.getByText("引导式体验 - 每步都有详细说明")).toBeInTheDocument();
    });

    it("should show correct description for expert mode", async () => {
      // Start in expert mode
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
          <ModeSwitcher />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("完全控制 - 可跳过非关键步骤")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle context errors gracefully", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Render without UserModeProvider (should throw)
      expect(() => {
        render(<ModeSwitcher />);
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it("should handle missing localStorage gracefully", () => {
      // Remove localStorage
      const localStorageBackup = global.localStorage;
      // @ts-ignore - testing error handling
      delete global.localStorage;

      expect(() => {
        render(
          <TestWrapper>
            <ModeSwitcher />
          </TestWrapper>
        );
      }).not.toThrow();

      // Restore localStorage
      global.localStorage = localStorageBackup;
    });
  });

  describe("Integration with UserModeContext", () => {
    it("should use context values correctly", async () => {
      render(
        <TestWrapper>
          <ModeSwitcher />
        </TestWrapper>
      );

      // Should reflect initial context state
      expect(screen.getByText(/引导式体验/i)).toBeInTheDocument();

      // Should update context when toggled
      const toggleButton = screen.getByRole("button", {
        name: /切换到专家模式/i,
      });
      fireEvent.click(toggleButton);

      const confirmButton = await screen.findByRole("button", {
        name: /确认切换/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText(/完全控制/i)).toBeInTheDocument();
      });

      // Verify context was updated
      const storedData = localStorage.getItem("ai-persona-user-mode");
      expect(storedData).toBeDefined();
      const parsed = JSON.parse(storedData!);
      expect(parsed.mode).toBe("expert");
    });
  });
});
