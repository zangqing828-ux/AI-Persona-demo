/**
 * Core configuration type definitions
 * Defines the base types used across the configuration management system
 */

/**
 * Configuration hierarchy levels
 */
export enum ConfigLevel {
  PLATFORM = 'platform',    // Read-only, system-wide defaults
  INDUSTRY = 'industry',    // Industry-specific templates
  PROJECT = 'project',      // User-configurable project settings
}

/**
 * Configuration metadata
 * Tracks versioning, ownership, and modification history
 */
export interface ConfigMetadata {
  id: string;
  level: ConfigLevel;
  industryId?: string;
  projectId?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy?: string;
}

/**
 * Base configuration interface
 * All configurations must extend this interface
 */
export interface BaseConfig {
  metadata: ConfigMetadata;
}

/**
 * Configuration change history entry
 * Tracks all modifications for audit trail
 */
export interface ConfigChange {
  id: string;
  timestamp: Date;
  configId: string;
  type: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changedBy: string;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

/**
 * Configuration export format
 */
export type ConfigExportFormat = 'json' | 'yaml' | 'env';
