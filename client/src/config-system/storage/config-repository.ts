/**
 * Config Repository
 * Provides a high-level API for config CRUD operations
 * Handles business logic and change tracking
 */

import { configDB, STORES } from './indexed-db';
import type {
  InterviewConfig,
  ScoringConfig,
  ProductConfig,
  AudienceConfig,
  ReportConfig,
} from '../types/project';
import type { ConfigChange, BaseConfig, ConfigLevel } from '../types/config';

/**
 * Repository pattern for config CRUD operations
 */
export class ConfigRepository {
  /**
   * Get all project configurations
   */
  async getProjectConfig(projectId: string): Promise<{
    interview?: InterviewConfig;
    scoring?: ScoringConfig;
    product?: ProductConfig;
    audience?: AudienceConfig;
    report?: ReportConfig;
  }> {
    const configs = await Promise.all([
      configDB.get<InterviewConfig>(STORES.project, `interview_${projectId}`),
      configDB.get<ScoringConfig>(STORES.project, `scoring_${projectId}`),
      configDB.get<ProductConfig>(STORES.project, `product_${projectId}`),
      configDB.get<AudienceConfig>(STORES.project, `audience_${projectId}`),
      configDB.get<ReportConfig>(STORES.project, `report_${projectId}`),
    ]);

    return {
      interview: configs[0],
      scoring: configs[1],
      product: configs[2],
      audience: configs[3],
      report: configs[4],
    };
  }

  /**
   * Save interview configuration
   */
  async saveInterviewConfig(config: InterviewConfig): Promise<void> {
    const updatedConfig = {
      ...config,
      id: config.metadata.id, // Add id at top level for IndexedDB
      metadata: {
        ...config.metadata,
        updatedAt: new Date(),
      },
    };
    await configDB.set(STORES.project, updatedConfig);
    await this.logChange('interview', config.metadata.id, config);
  }

  /**
   * Save scoring configuration
   */
  async saveScoringConfig(config: ScoringConfig): Promise<void> {
    const updatedConfig = {
      ...config,
      id: config.metadata.id, // Add id at top level for IndexedDB
      metadata: {
        ...config.metadata,
        updatedAt: new Date(),
      },
    };
    await configDB.set(STORES.project, updatedConfig);
    await this.logChange('scoring', config.metadata.id, config);
  }

  /**
   * Save product configuration
   */
  async saveProductConfig(config: ProductConfig): Promise<void> {
    const updatedConfig = {
      ...config,
      id: config.metadata.id, // Add id at top level for IndexedDB
      metadata: {
        ...config.metadata,
        updatedAt: new Date(),
      },
    };
    await configDB.set(STORES.project, updatedConfig);
    await this.logChange('product', config.metadata.id, config);
  }

  /**
   * Save audience configuration
   */
  async saveAudienceConfig(config: AudienceConfig): Promise<void> {
    const updatedConfig = {
      ...config,
      id: config.metadata.id, // Add id at top level for IndexedDB
      metadata: {
        ...config.metadata,
        updatedAt: new Date(),
      },
    };
    await configDB.set(STORES.project, updatedConfig);
    await this.logChange('audience', config.metadata.id, config);
  }

  /**
   * Save report configuration
   */
  async saveReportConfig(config: ReportConfig): Promise<void> {
    const updatedConfig = {
      ...config,
      id: config.metadata.id, // Add id at top level for IndexedDB
      metadata: {
        ...config.metadata,
        updatedAt: new Date(),
      },
    };
    await configDB.set(STORES.project, updatedConfig);
    await this.logChange('report', config.metadata.id, config);
  }

  /**
   * Get industry default configurations
   */
  async getIndustryDefaults(industryId: string): Promise<{
    interview?: InterviewConfig;
    scoring?: ScoringConfig;
    audience?: AudienceConfig;
  }> {
    const configs = await Promise.all([
      configDB.get<InterviewConfig>(STORES.industry, `interview_${industryId}`),
      configDB.get<ScoringConfig>(STORES.industry, `scoring_${industryId}`),
      configDB.get<AudienceConfig>(STORES.industry, `audience_${industryId}`),
    ]);

    return {
      interview: configs[0],
      scoring: configs[1],
      audience: configs[2],
    };
  }

  /**
   * Reset project config to industry defaults
   */
  async resetToDefaults(projectId: string, industryId: string): Promise<void> {
    const defaults = await this.getIndustryDefaults(industryId);

    const promises: Promise<void>[] = [];

    if (defaults.interview) {
      promises.push(this.saveInterviewConfig({
        ...defaults.interview,
        metadata: {
          ...defaults.interview.metadata,
          id: `interview_${projectId}`,
          level: 'project' as ConfigLevel,
          projectId,
        },
      }));
    }

    if (defaults.scoring) {
      promises.push(this.saveScoringConfig({
        ...defaults.scoring,
        metadata: {
          ...defaults.scoring.metadata,
          id: `scoring_${projectId}`,
          level: 'project' as ConfigLevel,
          projectId,
        },
      }));
    }

    if (defaults.audience) {
      promises.push(this.saveAudienceConfig({
        ...defaults.audience,
        metadata: {
          ...defaults.audience.metadata,
          id: `audience_${projectId}`,
          level: 'project' as ConfigLevel,
          projectId,
        },
      }));
    }

    await Promise.all(promises);
  }

  /**
   * Get change history for a config
   */
  async getChangeHistory(configId: string, limit?: number): Promise<ConfigChange[]> {
    // Get all history entries for this config
    const allChanges = await configDB.getAll<ConfigChange>(STORES.history);
    const configChanges = allChanges
      .filter(change => change.configId === configId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return limit ? configChanges.slice(0, limit) : configChanges;
  }

  /**
   * Log configuration changes
   */
  private async logChange(
    type: string,
    id: string,
    config: BaseConfig
  ): Promise<void> {
    const change: ConfigChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      configId: id,
      type,
      field: 'config',
      oldValue: null, // TODO: Implement diff tracking
      newValue: config,
      changedBy: config.metadata.lastModifiedBy || 'system',
    };

    await configDB.set(STORES.history, change);
  }

  /**
   * Delete all project configurations
   */
  async deleteProjectConfig(projectId: string): Promise<void> {
    const promises = [
      configDB.delete(STORES.project, `interview_${projectId}`),
      configDB.delete(STORES.project, `scoring_${projectId}`),
      configDB.delete(STORES.project, `product_${projectId}`),
      configDB.delete(STORES.project, `audience_${projectId}`),
      configDB.delete(STORES.project, `report_${projectId}`),
    ];

    await Promise.all(promises);
  }
}

// Export singleton instance
export const configRepository = new ConfigRepository();
