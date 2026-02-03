/**
 * Config Context and Hook
 * Provides React-friendly API for accessing and managing configurations
 */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { configRepository } from '../storage/config-repository';
import type {
  InterviewConfig,
  ScoringConfig,
  ProductConfig,
  AudienceConfig,
  ReportConfig,
} from '../types/project';

interface ConfigContextValue {
  configs: {
    interview?: InterviewConfig;
    scoring?: ScoringConfig;
    product?: ProductConfig;
    audience?: AudienceConfig;
    report?: ReportConfig;
  };
  loading: boolean;
  error: Error | null;
  saveInterviewConfig: (config: InterviewConfig) => Promise<void>;
  saveScoringConfig: (config: ScoringConfig) => Promise<void>;
  saveProductConfig: (config: ProductConfig) => Promise<void>;
  saveAudienceConfig: (config: AudienceConfig) => Promise<void>;
  saveReportConfig: (config: ReportConfig) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface ConfigProviderProps {
  projectId: string;
  industryId: string;
  children: ReactNode;
}

/**
 * Config Provider Component
 * Wraps the application to provide config state management
 */
export function ConfigProvider({
  projectId,
  industryId,
  children,
}: ConfigProviderProps) {
  const [configs, setConfigs] = useState<ConfigContextValue['configs']>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load configs on mount
  useEffect(() => {
    loadConfigs();
  }, [projectId, industryId]);

  async function loadConfigs() {
    try {
      setLoading(true);
      setError(null);
      const loaded = await configRepository.getProjectConfig(projectId);

      // If no configs exist, load industry defaults
      if (!loaded.interview || !loaded.scoring) {
        await configRepository.resetToDefaults(projectId, industryId);
        const reloaded = await configRepository.getProjectConfig(projectId);
        setConfigs(reloaded);
      } else {
        setConfigs(loaded);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load configs:', err);
    } finally {
      setLoading(false);
    }
  }

  const saveInterviewConfig = useCallback(async (config: InterviewConfig) => {
    await configRepository.saveInterviewConfig(config);
    setConfigs(prev => ({ ...prev, interview: config }));
  }, []);

  const saveScoringConfig = useCallback(async (config: ScoringConfig) => {
    await configRepository.saveScoringConfig(config);
    setConfigs(prev => ({ ...prev, scoring: config }));
  }, []);

  const saveProductConfig = useCallback(async (config: ProductConfig) => {
    await configRepository.saveProductConfig(config);
    setConfigs(prev => ({ ...prev, product: config }));
  }, []);

  const saveAudienceConfig = useCallback(async (config: AudienceConfig) => {
    await configRepository.saveAudienceConfig(config);
    setConfigs(prev => ({ ...prev, audience: config }));
  }, []);

  const saveReportConfig = useCallback(async (config: ReportConfig) => {
    await configRepository.saveReportConfig(config);
    setConfigs(prev => ({ ...prev, report: config }));
  }, []);

  const resetToDefaults = useCallback(async () => {
    await configRepository.resetToDefaults(projectId, industryId);
    await loadConfigs();
  }, [projectId, industryId]);

  const refresh = useCallback(async () => {
    await loadConfigs();
  }, []);

  const value: ConfigContextValue = {
    configs,
    loading,
    error,
    saveInterviewConfig,
    saveScoringConfig,
    saveProductConfig,
    saveAudienceConfig,
    saveReportConfig,
    resetToDefaults,
    refresh,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

/**
 * useConfig Hook
 * Access config state and operations from any component
 */
export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}
