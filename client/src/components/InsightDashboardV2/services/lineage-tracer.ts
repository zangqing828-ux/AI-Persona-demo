/**
 * Data Lineage Tracer
 * Tracks data flow from raw responses to conclusions
 */

import type { DataLineageNode, LineagePath, DataTrace } from '../types/lineage';

export class LineageTracer {
  /**
   * Trace data lineage for a conclusion
   */
  traceConclusion(conclusionId: string, metrics: any[]): DataTrace {
    const conclusion = this.findConclusion(conclusionId, metrics);
    if (!conclusion) {
      throw new Error(`Conclusion ${conclusionId} not found`);
    }

    return {
      conclusion: conclusion.name,
      intermediateMetrics: this.extractIntermediateMetrics(conclusion),
      rawDataSources: this.extractDataSources(conclusion),
    };
  }

  /**
   * Build lineage tree
   */
  buildLineageTree(conclusionId: string, metrics: any[]): DataLineageNode {
    const conclusion = this.findConclusion(conclusionId, metrics);

    return {
      id: conclusion.id,
      type: 'conclusion',
      label: conclusion.name,
      value: conclusion.value,
      children: this.buildMetricTree(conclusion.children || []),
    };
  }

  /**
   * Find path from conclusion to data
   */
  findPath(fromId: string, toId: string, metrics: any[]): LineagePath {
    const fromNode = this.findNode(fromId, metrics);
    const toNode = this.findNode(toId, metrics);

    const path = this.calculatePath(fromNode, toNode);

    return {
      from: fromId,
      to: toId,
      path,
    };
  }

  private findConclusion(id: string, metrics: any[]): any {
    for (const metric of metrics) {
      if (metric.id === id) return metric;
      if (metric.children) {
        const found = this.findConclusion(id, metric.children);
        if (found) return found;
      }
    }
    return null;
  }

  private findNode(id: string, metrics: any[]): any {
    return this.findConclusion(id, metrics);
  }

  private extractIntermediateMetrics(conclusion: any): string[] {
    if (!conclusion.children) return [];
    return conclusion.children.map((c: any) => c.name);
  }

  private extractDataSources(conclusion: any): Array<{
    type: string;
    id: string;
    count: number;
  }> {
    const sources: Array<{ type: string; id: string; count: number }> = [];

    if (conclusion.dataPoints) {
      conclusion.dataPoints.forEach((dp: any) => {
        sources.push({
          type: dp.sourceType,
          id: dp.source,
          count: dp.sampleSize || 1,
        });
      });
    }

    if (conclusion.children) {
      conclusion.children.forEach((child: any) => {
        sources.push(...this.extractDataSources(child));
      });
    }

    return sources;
  }

  private buildMetricTree(metrics: any[]): DataLineageNode[] {
    return metrics.map(metric => ({
      id: metric.id,
      type: 'metric',
      label: metric.name,
      value: metric.value,
      children: metric.dataPoints ? metric.dataPoints.map((dp: any) => ({
        id: dp.source,
        type: 'data',
        label: dp.source,
        value: dp.sampleSize,
      })) : [],
    }));
  }

  private calculatePath(fromNode: any, _toNode: any): Array<{
    nodeId: string;
    nodeName: string;
    transformation?: string;
  }> {
    const path: Array<{ nodeId: string; nodeName: string; transformation?: string }> = [];

    path.push({
      nodeId: fromNode.id,
      nodeName: fromNode.name,
    });

    if (fromNode.children) {
      fromNode.children.forEach((child: any) => {
        path.push({
          nodeId: child.id,
          nodeName: child.name,
          transformation: child.aggregationMethod || 'aggregate',
        });
      });
    }

    return path;
  }
}

// Export singleton instance
export const lineageTracer = new LineageTracer();
