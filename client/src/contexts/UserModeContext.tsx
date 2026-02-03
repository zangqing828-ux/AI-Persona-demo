import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type UserMode = "beginner" | "expert";

type ExplanationLevel = "minimal" | "standard" | "detailed";

interface UserModePreferences {
  autoSkipDefaults: boolean;
  showImpactPreviews: boolean;
  explanationLevel: ExplanationLevel;
}

interface UserModeContextValue {
  mode: UserMode;
  skippedSteps: Set<string>;
  preferences: UserModePreferences;
  toggleMode: () => void;
  skipStep: (stepId: string) => void;
  unskipStep: (stepId: string) => void;
  isStepSkipped: (stepId: string) => boolean;
  resetPreferences: () => void;
}

interface StoredUserModeData {
  mode: UserMode;
  skippedSteps: string[];
  preferences: UserModePreferences;
}

const DEFAULT_PREFERENCES: UserModePreferences = {
  autoSkipDefaults: false,
  showImpactPreviews: true,
  explanationLevel: "standard",
};

const STORAGE_KEY = "ai-persona-user-mode";

const UserModeContext = createContext<UserModeContextValue | undefined>(
  undefined
);

interface UserModeProviderProps {
  children: ReactNode;
}

function loadStoredData(): StoredUserModeData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as unknown;

    // Type guard for stored data
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "mode" in parsed &&
      ("beginner" === parsed.mode || "expert" === parsed.mode)
    ) {
      const data = parsed as Partial<StoredUserModeData>;

      return {
        mode: data.mode ?? "beginner",
        skippedSteps: Array.isArray(data.skippedSteps)
          ? data.skippedSteps
          : [],
        preferences:
          typeof data.preferences === "object" && data.preferences !== null
            ? { ...DEFAULT_PREFERENCES, ...data.preferences }
            : DEFAULT_PREFERENCES,
      };
    }

    return null;
  } catch (error) {
    // Silently fail if localStorage is unavailable or data is corrupted
    return null;
  }
}

function saveStoredData(data: StoredUserModeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Silently fail if localStorage is unavailable
  }
}

export function UserModeProvider({ children }: UserModeProviderProps) {
  const storedData = loadStoredData();

  const [mode, setMode] = useState<UserMode>(() => {
    return storedData?.mode ?? "beginner";
  });

  const [skippedSteps, setSkippedSteps] = useState<Set<string>>(() => {
    return new Set(storedData?.skippedSteps ?? []);
  });

  const [preferences, setPreferences] = useState<UserModePreferences>(() => {
    return storedData?.preferences ?? DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    const data: StoredUserModeData = {
      mode,
      skippedSteps: Array.from(skippedSteps),
      preferences,
    };
    saveStoredData(data);
  }, [mode, skippedSteps, preferences]);

  const toggleMode = () => {
    setMode((prev) => (prev === "beginner" ? "expert" : "beginner"));
  };

  const skipStep = (stepId: string) => {
    setSkippedSteps((prev) => new Set(prev).add(stepId));
  };

  const unskipStep = (stepId: string) => {
    setSkippedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(stepId);
      return newSet;
    });
  };

  const isStepSkipped = (stepId: string) => {
    return skippedSteps.has(stepId);
  };

  const resetPreferences = () => {
    setMode("beginner");
    setSkippedSteps(new Set());
    setPreferences(DEFAULT_PREFERENCES);
  };

  const value: UserModeContextValue = {
    mode,
    skippedSteps,
    preferences,
    toggleMode,
    skipStep,
    unskipStep,
    isStepSkipped,
    resetPreferences,
  };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode(): UserModeContextValue {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error("useUserMode must be used within UserModeProvider");
  }
  return context;
}
