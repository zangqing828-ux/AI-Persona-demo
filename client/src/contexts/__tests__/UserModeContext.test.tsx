import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { UserModeProvider, useUserMode } from '../UserModeContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Wrapper component for testing
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <UserModeProvider>{children}</UserModeProvider>;
  };
}

describe('UserModeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('initialization', () => {
    it('should initialize with beginner mode by default', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mode).toBe('beginner');
    });

    it('should load saved mode from localStorage', () => {
      const savedData = JSON.stringify({
        mode: 'expert',
        skippedSteps: ['step1'],
        preferences: {
          autoSkipDefaults: true,
          showImpactPreviews: true,
          explanationLevel: 'detailed',
        },
      });
      localStorageMock.getItem.mockReturnValue(savedData);

      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mode).toBe('expert');
      expect(result.current.isStepSkipped('step1')).toBe(true);
    });

    it('should have default preferences', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.preferences).toEqual({
        autoSkipDefaults: false,
        showImpactPreviews: true,
        explanationLevel: 'standard',
      });
    });
  });

  describe('mode toggle', () => {
    it('should toggle from beginner to expert', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mode).toBe('beginner');

      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('expert');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should toggle from expert to beginner', () => {
      const savedData = JSON.stringify({
        mode: 'expert',
        skippedSteps: [],
        preferences: {
          autoSkipDefaults: false,
          showImpactPreviews: true,
          explanationLevel: 'standard',
        },
      });
      localStorageMock.getItem.mockReturnValue(savedData);

      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mode).toBe('expert');

      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('beginner');
    });
  });

  describe('step skip management', () => {
    it('should skip a step', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.skipStep('step1');
      });

      expect(result.current.isStepSkipped('step1')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should unskip a step', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.skipStep('step1');
      });

      expect(result.current.isStepSkipped('step1')).toBe(true);

      act(() => {
        result.current.unskipStep('step1');
      });

      expect(result.current.isStepSkipped('step1')).toBe(false);
    });

    it('should handle multiple skipped steps', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.skipStep('step1');
        result.current.skipStep('step2');
        result.current.skipStep('step3');
      });

      expect(result.current.isStepSkipped('step1')).toBe(true);
      expect(result.current.isStepSkipped('step2')).toBe(true);
      expect(result.current.isStepSkipped('step3')).toBe(true);
      expect(result.current.skippedSteps.size).toBe(3);
    });

    it('should not duplicate skipped steps', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.skipStep('step1');
        result.current.skipStep('step1');
      });

      expect(result.current.skippedSteps.size).toBe(1);
    });
  });

  describe('localStorage persistence', () => {
    it('should save state to localStorage on mode change', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.toggleMode();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ai-persona-user-mode',
        expect.stringContaining('"mode":"expert"')
      );
    });

    it('should save state to localStorage on step skip', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.skipStep('step1');
      });

      // Get the last setItem call (after state update)
      const lastCall =
        localStorageMock.setItem.mock.calls[
          localStorageMock.setItem.mock.calls.length - 1
        ];
      const savedData = JSON.parse(lastCall[1] as string);

      expect(savedData.skippedSteps).toContain('step1');
    });

    it('should save state to localStorage on step unskip', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.skipStep('step1');
        result.current.unskipStep('step1');
      });

      // Get the last setItem call (after state update)
      const lastCall =
        localStorageMock.setItem.mock.calls[
          localStorageMock.setItem.mock.calls.length - 1
        ];
      const savedData = JSON.parse(lastCall[1] as string);

      expect(savedData.skippedSteps).not.toContain('step1');
    });
  });

  describe('preferences reset', () => {
    it('should reset preferences to defaults', () => {
      const savedData = JSON.stringify({
        mode: 'expert',
        skippedSteps: ['step1', 'step2'],
        preferences: {
          autoSkipDefaults: true,
          showImpactPreviews: false,
          explanationLevel: 'minimal',
        },
      });
      localStorageMock.getItem.mockReturnValue(savedData);

      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mode).toBe('expert');
      expect(result.current.skippedSteps.size).toBe(2);
      expect(result.current.preferences.autoSkipDefaults).toBe(true);

      act(() => {
        result.current.resetPreferences();
      });

      expect(result.current.mode).toBe('beginner');
      expect(result.current.skippedSteps.size).toBe(0);
      expect(result.current.preferences).toEqual({
        autoSkipDefaults: false,
        showImpactPreviews: true,
        explanationLevel: 'standard',
      });
    });
  });

  describe('error handling', () => {
    it('should handle localStorage unavailability gracefully', () => {
      // Mock localStorage to throw errors
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      // Should still initialize with defaults
      expect(result.current.mode).toBe('beginner');

      // Should not throw when toggling mode
      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('expert');
    });

    it('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      // Should fall back to defaults
      expect(result.current.mode).toBe('beginner');
      expect(result.current.skippedSteps.size).toBe(0);
    });

    it('should handle partial localStorage data', () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ mode: 'expert' })
      );

      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      // Should load available data and use defaults for rest
      expect(result.current.mode).toBe('expert');
      expect(result.current.preferences).toEqual({
        autoSkipDefaults: false,
        showImpactPreviews: true,
        explanationLevel: 'standard',
      });
    });
  });

  describe('context error handling', () => {
    it('should throw error when useUserMode is used outside provider', () => {
      expect(() => {
        renderHook(() => useUserMode());
      }).toThrow('useUserMode must be used within UserModeProvider');
    });
  });

  describe('immutability', () => {
    it('should not mutate skippedSteps Set directly', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      const initialSize = result.current.skippedSteps.size;

      act(() => {
        result.current.skipStep('step1');
      });

      // The Set reference should remain immutable
      expect(result.current.skippedSteps.size).toBe(initialSize + 1);

      // Adding another step should create a new Set
      const previousSet = result.current.skippedSteps;
      act(() => {
        result.current.skipStep('step2');
      });

      expect(result.current.skippedSteps.size).toBe(2);
      expect(result.current.skippedSteps).not.toBe(previousSet);
    });
  });

  describe('explanationLevel validation', () => {
    it('should accept valid explanation levels', () => {
      const { result } = renderHook(() => useUserMode(), {
        wrapper: createWrapper(),
      });

      expect(['minimal', 'standard', 'detailed']).toContain(
        result.current.preferences.explanationLevel
      );
    });
  });
});
