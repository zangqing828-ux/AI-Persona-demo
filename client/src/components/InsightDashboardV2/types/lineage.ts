/**
 * Data Lineage Type Definitions
 * Types for tracking data flow and provenance
 */

/**
 * Data lineage node in the hierarchy
 */
export interface DataLineageNode {
  id: string;
  type: 'conclusion' | 'metric' | 'data' | 'response';
  label: string;
  value?: unknown;
  source?: string;
  children?: DataLineageNode[];
  metadata?: {
    sampleSize?: number;
    timestamp?: Date;
    transformation?: string;
    [key: string]: unknown;
  };
}

/**
 * Path from conclusion to data source
 */
export interface LineagePath {
  from: string; // Conclusion ID
  to: string;   // Data source ID
  path: Array<{
    nodeId: string;
    nodeName: string;
    transformation?: string;
  }>;
}

/**
 * Data trace for a conclusion
 */
export interface DataTrace {
  conclusion: string;
  intermediateMetrics: string[];
  rawDataSources: Array<{
    type: string;
    id: string;
    count: number;
  }>;
}

/**
 * Lineage visualization edge
 */
export interface LineageEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'aggregation' | 'filter' | 'transform' | 'direct';
}
