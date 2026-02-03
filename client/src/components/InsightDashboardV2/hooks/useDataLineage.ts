/**
 * useDataLineage Hook
 * Provides data lineage tracing functionality
 */

import { lineageTracer } from '../services/lineage-tracer';
import type { DataTrace, DataLineageNode, LineagePath } from '../types/lineage';

export function useDataLineage(metrics: any[]) {
  /**
   * Trace data lineage for a conclusion
   */
  function traceConclusion(conclusionId: string): DataTrace {
    return lineageTracer.traceConclusion(conclusionId, metrics);
  }

  /**
   * Build lineage tree
   */
  function buildLineageTree(conclusionId: string): DataLineageNode {
    return lineageTracer.buildLineageTree(conclusionId, metrics);
  }

  /**
   * Find path from conclusion to data
   */
  function findPath(fromId: string, toId: string): LineagePath {
    return lineageTracer.findPath(fromId, toId, metrics);
  }

  return {
    traceConclusion,
    buildLineageTree,
    findPath,
  };
}
