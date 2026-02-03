import { ExecutionTrace } from '@shared/types/execution';
import React from 'react';

interface MetricExplainerProps {
  executionTrace: ExecutionTrace;
  metricName: string;
  compact?: boolean;
}

interface Factor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

interface ConfigStep {
  stepId: string;
  stepName: string;
  configSnapshot: Record<string, unknown>;
  timestamp: Date;
}

interface RuleMatch {
  ruleId: string;
  ruleName: string;
  condition: string;
  matched: boolean;
  confidence: number;
}

// Predefined formulas for common metrics
const metricFormulas: Record<string, string> = {
  '购买意愿': '购买意愿 = (价格敏感度 × 0.3) + (品质评分 × 0.5) + (品牌信任 × 0.2)',
  '推荐意向': '推荐意向 = 购买意愿 × 净推荐系数',
  '价格敏感度': '价格敏感度 = 1 - (竞争价格 / 基础价格)',
  '品质评分': '品质评分 = 品质得分 / 最大评分',
  '品牌信任': '品牌信任 = 基础信任 + 体验修正',
  '净推荐系数': '净推荐系数 = (推荐者 - 贬损者) / 总人数'
};

function FormulaDisplay({ metricName }: { metricName: string }) {
  const formula = metricFormulas[metricName] || '公式未定义';

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
      {formula}
    </div>
  );
}

function FactorsBreakdown({ trace, metricName }: { trace: ExecutionTrace; metricName: string }) {
  const factors: Factor[] = [];

  // Extract contributing factors from final metrics
  const metricValue = trace.finalMetrics[metricName];
  if (typeof metricValue === 'number') {
    factors.push({
      name: metricName,
      value: metricValue,
      weight: 1.0,
      contribution: metricValue
    });
  }

  // Add placeholder factors based on the metric name
  if (metricName === '购买意愿') {
    factors.push(
      { name: '价格敏感度', value: 0.7, weight: 0.3, contribution: 0.21 },
      { name: '品质评分', value: 0.8, weight: 0.5, contribution: 0.4 },
      { name: '品牌信任', value: 0.6, weight: 0.2, contribution: 0.12 }
    );
  }

  return (
    <div className="space-y-3">
      {factors.map((factor, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border">
          <div className="flex-1">
            <div className="font-medium text-sm">{factor.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              权重: {factor.weight}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{factor.value.toFixed(2)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              贡献: {factor.contribution.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfigSources({ trace }: { trace: ExecutionTrace }) {
  const configSteps: ConfigStep[] = trace.stepTraces.map((stepTrace) => ({
    stepId: stepTrace.stepId,
    stepName: stepTrace.stepName,
    configSnapshot: stepTrace.configSnapshot,
    timestamp: stepTrace.timestamp
  }));

  return (
    <div className="space-y-2">
      {configSteps.map((step) => (
        <div key={step.stepId} className="p-3 bg-white dark:bg-gray-700 rounded-lg border text-sm">
          <div className="font-medium">{step.stepName}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {Object.entries(step.configSnapshot).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{key}:</span>
                <span>{typeof value === 'number' ? value.toFixed(2) : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RulesAnalysis({ trace }: { trace: ExecutionTrace }) {
  const rules: RuleMatch[] = [];

  // Collect all rules from all step traces
  trace.stepTraces.forEach(stepTrace => {
    rules.push(...stepTrace.rulesTriggered);
  });

  return (
    <div className="space-y-2">
      {rules.map((rule) => (
        <div key={rule.ruleId} className="p-3 bg-white dark:bg-gray-700 rounded-lg border text-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium">{rule.ruleName}</div>
              <div className={`text-xs font-medium ${
                rule.matched ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                状态: {rule.matched ? '已触发' : '未触发'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                置信度: {rule.confidence}
              </div>
            </div>
          </div>
        </div>
      ))}
      {rules.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          无触发的规则
        </div>
      )}
    </div>
  );
}

export function MetricExplainer({ executionTrace, metricName, compact = false }: MetricExplainerProps) {
  return (
    <div className={`metric-explainer ${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* Formula Section */}
      <section className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`text-lg font-semibold mb-3 ${compact ? 'text-sm' : ''}`}>
          计算公式
        </h3>
        <FormulaDisplay metricName={metricName} />
      </section>

      {/* Contributing Factors */}
      <section className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`text-lg font-semibold mb-3 ${compact ? 'text-sm' : ''}`}>
          影响因素
        </h3>
        <FactorsBreakdown
          trace={executionTrace}
          metricName={metricName}
        />
      </section>

      {/* Configuration Sources */}
      <section className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`text-lg font-semibold mb-3 ${compact ? 'text-sm' : ''}`}>
          配置来源
        </h3>
        <ConfigSources trace={executionTrace} />
      </section>

      {/* Rules Triggered */}
      <section className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`text-lg font-semibold mb-3 ${compact ? 'text-sm' : ''}`}>
          触发的规则
        </h3>
        <RulesAnalysis
          trace={executionTrace}
        />
      </section>
    </div>
  );
}