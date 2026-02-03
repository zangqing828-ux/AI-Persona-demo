import { render, screen } from '@testing-library/react';
import { MetricExplainer } from '../MetricExplainer';
import { ExecutionTrace } from '@shared/types/execution';

// Mock ExecutionTrace for testing
const mockExecutionTrace: ExecutionTrace = {
  traceId: 'trace-123',
  sessionId: 'session-456',
  timestamp: new Date('2024-01-01T10:00:00Z'),
  workflowConfig: {
    industry: 'pet-food',
    steps: ['config-1', 'config-2', 'metric-1'],
    mode: 'expert'
  },
  stepTraces: [
    {
      stepId: 'config-1',
      stepName: '价格敏感度配置',
      configSnapshot: {
        basePrice: 100,
        competitorPrice: 80,
        priceSensitivity: 0.7
      },
      executionTime: 100,
      rulesTriggered: [],
      intermediateOutputs: [],
      timestamp: new Date('2024-01-01T10:00:01Z')
    },
    {
      stepId: 'config-2',
      stepName: '品质评分配置',
      configSnapshot: {
        qualityScore: 4.0,
        maxScore: 5.0,
        qualityRating: 0.8
      },
      executionTime: 100,
      rulesTriggered: [],
      intermediateOutputs: [],
      timestamp: new Date('2024-01-01T10:00:02Z')
    },
    {
      stepId: 'metric-1',
      stepName: '购买意愿计算',
      configSnapshot: {
        priceSensitivity: 0.7,
        qualityRating: 0.8,
        brandTrust: 0.6
      },
      executionTime: 100,
      rulesTriggered: [
        {
          ruleId: 'rule-1',
          ruleName: '高购买意愿规则',
          condition: 'purchaseIntent > 0.7',
          matched: true,
          confidence: 95,
          result: { purchaseIntent: 0.73 }
        }
      ],
      intermediateOutputs: [],
      timestamp: new Date('2024-01-01T10:00:03Z')
    }
  ],
  finalMetrics: {
    '购买意愿': 0.73,
    '推荐意向': 0.66,
    '价格敏感度': 0.7,
    '品质评分': 0.8,
    '品牌信任': 0.6
  },
  totalExecutionTime: 300
};

describe('MetricExplainer', () => {
  const defaultProps = {
    executionTrace: mockExecutionTrace,
    metricName: '购买意愿'
  };

  test('renders formula section', () => {
    render(<MetricExplainer {...defaultProps} />);

    expect(screen.getByText('计算公式')).toBeTruthy();
    expect(screen.getByText('购买意愿 = (价格敏感度 × 0.3) + (品质评分 × 0.5) + (品牌信任 × 0.2)')).toBeTruthy();
  });

  test('renders contributing factors section', () => {
    render(<MetricExplainer {...defaultProps} />);

    expect(screen.getByText('影响因素')).toBeTruthy();
    expect(screen.getByText('品质评分')).toBeTruthy();
    expect(screen.getByText('价格敏感度')).toBeTruthy();
    expect(screen.getByText('品牌信任')).toBeTruthy();
  });

  test('renders configuration sources section', () => {
    render(<MetricExplainer {...defaultProps} />);

    expect(screen.getByText('配置来源')).toBeTruthy();
    expect(screen.getByText('价格敏感度配置')).toBeTruthy();
    expect(screen.getByText('品质评分配置')).toBeTruthy();
  });

  test('renders rules analysis section', () => {
    render(<MetricExplainer {...defaultProps} />);

    expect(screen.getByText('触发的规则')).toBeTruthy();
    expect(screen.getByText('高购买意愿规则')).toBeTruthy();
  });

  test('renders in compact mode when compact prop is true', () => {
    render(<MetricExplainer {...defaultProps} compact={true} />);

    // Should still show all sections but in a more compact format
    expect(screen.getByText('计算公式')).toBeTruthy();
    expect(screen.getByText('影响因素')).toBeTruthy();
    expect(screen.getByText('配置来源')).toBeTruthy();
    expect(screen.getByText('触发的规则')).toBeTruthy();
  });

  test('handles unknown metric gracefully', () => {
    const unknownMetricProps = {
      ...defaultProps,
      metricName: '未知指标'
    };

    render(<MetricExplainer {...{...unknownMetricProps, executionTrace: mockExecutionTrace}} />);

    expect(screen.getByText('公式未定义')).toBeTruthy();
  });

  test('displays factor contributions correctly', () => {
    render(<MetricExplainer {...defaultProps} />);

    // Check that factors are displayed with their contributions
    const qualityRating = screen.getByText('品质评分');
    const priceSensitivity = screen.getByText('价格敏感度');
    const brandTrust = screen.getByText('品牌信任');

    expect(qualityRating).toBeTruthy();
    expect(priceSensitivity).toBeTruthy();
    expect(brandTrust).toBeTruthy();
  });

  test('shows rule confidence levels', () => {
    render(<MetricExplainer {...defaultProps} />);

    expect(screen.getByText(/置信度/)).toBeTruthy();
    expect(screen.getByText(/95/)).toBeTruthy();
  });

  test('handles empty execution trace gracefully', () => {
    const emptyTraceProps = {
      executionTrace: {
        traceId: 'empty-trace',
        sessionId: 'empty-session',
        timestamp: new Date('2024-01-01T10:00:00Z'),
        workflowConfig: {
          industry: 'pet-food',
          steps: [],
          mode: 'beginner'
        },
        stepTraces: [],
        finalMetrics: {},
        totalExecutionTime: 0
      },
      metricName: '购买意愿'
    };

    expect(() => render(<MetricExplainer {...emptyTraceProps} />)).not.toThrow();
  });

  test('handles missing metric calculation in trace', () => {
    const traceWithoutMetric = {
      ...mockExecutionTrace,
      stepTraces: mockExecutionTrace.stepTraces.filter(step => step.stepName !== '购买意愿计算')
    };

    const props = {
      ...defaultProps,
      executionTrace: traceWithoutMetric
    };

    expect(() => render(<MetricExplainer {...props} />)).not.toThrow();
  });
});