interface AnalyticResult {
  id: string;
  type: 'trend' | 'pattern' | 'correlation' | 'prediction';
  category: 'performance' | 'security' | 'error';
  value: number;
  confidence: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface TrendAnalysis {
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  period: {
    start: number;
    end: number;
  };
  dataPoints: Array<{
    timestamp: number;
    value: number;
  }>;
}

interface PatternAnalysis {
  pattern: string;
  frequency: number;
  significance: number;
  examples: Array<{
    timestamp: number;
    data: Record<string, any>;
  }>;
}

interface CorrelationAnalysis {
  metrics: [string, string];
  coefficient: number;
  strength: 'strong' | 'moderate' | 'weak';
  direction: 'positive' | 'negative';
  sampleSize: number;
}

interface Prediction {
  metric: string;
  predictedValue: number;
  confidence: number;
  timestamp: number;
  factors: Array<{
    name: string;
    impact: number;
  }>;
}

interface Insight {
  id: string;
  type: 'trend' | 'pattern' | 'correlation' | 'prediction';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
  data: TrendAnalysis | PatternAnalysis | CorrelationAnalysis | Prediction;
  recommendations: string[];
}

class DiagnosticAnalyticsService {
  private static instance: DiagnosticAnalyticsService;
  private insights: Insight[] = [];
  private analyticResults: AnalyticResult[] = [];
  private readonly maxHistorySize = 1000;

  private constructor() {}

  public static getInstance(): DiagnosticAnalyticsService {
    if (!DiagnosticAnalyticsService.instance) {
      DiagnosticAnalyticsService.instance = new DiagnosticAnalyticsService();
    }
    return DiagnosticAnalyticsService.instance;
  }

  public async analyzeTrends(
    metric: string,
    data: Array<{ timestamp: number; value: number }>,
    period: { start: number; end: number }
  ): Promise<TrendAnalysis> {
    // Calculate moving average
    const movingAverage = this.calculateMovingAverage(data.map(d => d.value), 5);
    
    // Calculate trend
    const trend = this.determineTrend(movingAverage);
    
    // Calculate change rate
    const changeRate = this.calculateChangeRate(data);

    const analysis: TrendAnalysis = {
      metric,
      trend,
      changeRate,
      period,
      dataPoints: data
    };

    this.addAnalyticResult({
      id: `trend-${Date.now()}`,
      type: 'trend',
      category: 'performance',
      value: changeRate,
      confidence: this.calculateConfidence(data.length),
      timestamp: Date.now()
    });

    return analysis;
  }

  public async detectPatterns(
    data: Array<Record<string, any>>,
    threshold: number
  ): Promise<PatternAnalysis[]> {
    const patterns: PatternAnalysis[] = [];
    
    // Group similar events
    const groups = this.groupSimilarEvents(data);
    
    // Analyze each group for patterns
    for (const [pattern, events] of groups.entries()) {
      if (events.length >= threshold) {
        patterns.push({
          pattern,
          frequency: events.length,
          significance: this.calculateSignificance(events.length, data.length),
          examples: events.slice(0, 5).map(event => ({
            timestamp: event.timestamp,
            data: event
          }))
        });
      }
    }

    return patterns;
  }

  public async analyzeCorrelations(
    metrics: [string, string],
    data: Array<[number, number]>
  ): Promise<CorrelationAnalysis> {
    const coefficient = this.calculateCorrelation(data);
    
    const analysis: CorrelationAnalysis = {
      metrics,
      coefficient,
      strength: this.determineCorrelationStrength(coefficient),
      direction: coefficient >= 0 ? 'positive' : 'negative',
      sampleSize: data.length
    };

    this.addAnalyticResult({
      id: `correlation-${Date.now()}`,
      type: 'correlation',
      category: 'performance',
      value: coefficient,
      confidence: this.calculateConfidence(data.length),
      timestamp: Date.now()
    });

    return analysis;
  }

  public async predictMetric(
    metric: string,
    historicalData: Array<{ timestamp: number; value: number }>,
    factors: Array<{ name: string; value: number }>
  ): Promise<Prediction> {
    // Implement prediction logic using historical data and factors
    const predictedValue = this.calculatePrediction(historicalData, factors);
    const confidence = this.calculatePredictionConfidence(historicalData.length);

    const prediction: Prediction = {
      metric,
      predictedValue,
      confidence,
      timestamp: Date.now() + 24 * 60 * 60 * 1000, // Predict 24 hours ahead
      factors: factors.map(f => ({
        name: f.name,
        impact: this.calculateFactorImpact(f.name, historicalData)
      }))
    };

    this.addAnalyticResult({
      id: `prediction-${Date.now()}`,
      type: 'prediction',
      category: 'performance',
      value: predictedValue,
      confidence,
      timestamp: Date.now()
    });

    return prediction;
  }

  public async generateInsights(
    trends: TrendAnalysis[],
    patterns: PatternAnalysis[],
    correlations: CorrelationAnalysis[],
    predictions: Prediction[]
  ): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Analyze trends
    for (const trend of trends) {
      if (Math.abs(trend.changeRate) > 0.1) {
        insights.push({
          id: `insight-${Date.now()}-${Math.random()}`,
          type: 'trend',
          title: `Significant change in ${trend.metric}`,
          description: `${trend.metric} has ${trend.trend} by ${(trend.changeRate * 100).toFixed(1)}% over the last period`,
          severity: this.determineSeverity(trend.changeRate),
          timestamp: Date.now(),
          data: trend,
          recommendations: this.generateRecommendations('trend', trend)
        });
      }
    }

    // Analyze patterns
    for (const pattern of patterns) {
      if (pattern.significance > 0.7) {
        insights.push({
          id: `insight-${Date.now()}-${Math.random()}`,
          type: 'pattern',
          title: `Recurring pattern detected`,
          description: `Pattern "${pattern.pattern}" occurs ${pattern.frequency} times`,
          severity: this.determineSeverity(pattern.significance),
          timestamp: Date.now(),
          data: pattern,
          recommendations: this.generateRecommendations('pattern', pattern)
        });
      }
    }

    // Store insights
    this.insights = [...this.insights, ...insights].slice(-this.maxHistorySize);

    return insights;
  }

  public getInsights(): Insight[] {
    return this.insights;
  }

  public getAnalyticResults(): AnalyticResult[] {
    return this.analyticResults;
  }

  private addAnalyticResult(result: AnalyticResult): void {
    this.analyticResults = [result, ...this.analyticResults].slice(0, this.maxHistorySize);
  }

  private calculateMovingAverage(values: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < values.length - window + 1; i++) {
      const windowValues = values.slice(i, i + window);
      const average = windowValues.reduce((a, b) => a + b) / window;
      result.push(average);
    }
    return result;
  }

  private determineTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b) / secondHalf.length;
    const difference = secondAvg - firstAvg;
    
    if (difference > firstAvg * 0.1) return 'increasing';
    if (difference < -firstAvg * 0.1) return 'decreasing';
    return 'stable';
  }

  private calculateChangeRate(data: Array<{ timestamp: number; value: number }>): number {
    if (data.length < 2) return 0;
    const first = data[0].value;
    const last = data[data.length - 1].value;
    return (last - first) / first;
  }

  private calculateCorrelation(data: Array<[number, number]>): number {
    const n = data.length;
    if (n < 2) return 0;

    const [xValues, yValues] = data.reduce(
      ([xs, ys], [x, y]) => [[...xs, x], [...ys, y]],
      [[] as number[], [] as number[]]
    );

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private determineCorrelationStrength(coefficient: number): 'strong' | 'moderate' | 'weak' {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.3) return 'moderate';
    return 'weak';
  }

  private calculateConfidence(sampleSize: number): number {
    // Simple confidence calculation based on sample size
    return Math.min(0.5 + (sampleSize / 100) * 0.5, 1);
  }

  private calculatePrediction(
    historicalData: Array<{ timestamp: number; value: number }>,
    factors: Array<{ name: string; value: number }>
  ): number {
    // Simple linear regression for prediction
    const values = historicalData.map(d => d.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const trend = this.calculateChangeRate(historicalData);
    
    // Apply factor weights
    const factorImpact = factors.reduce((sum, factor) => {
      return sum + (factor.value * this.calculateFactorImpact(factor.name, historicalData));
    }, 0);

    return avg * (1 + trend) + factorImpact;
  }

  private calculatePredictionConfidence(sampleSize: number): number {
    // More conservative confidence for predictions
    return Math.min(0.3 + (sampleSize / 100) * 0.4, 0.9);
  }

  private calculateFactorImpact(factor: string, historicalData: Array<{ timestamp: number; value: number }>): number {
    // Simplified factor impact calculation
    return 0.1; // Placeholder - implement actual factor impact calculation
  }

  private calculateSignificance(frequency: number, total: number): number {
    return Math.min(frequency / total * 2, 1);
  }

  private groupSimilarEvents(events: Array<Record<string, any>>): Map<string, Array<Record<string, any>>> {
    const groups = new Map<string, Array<Record<string, any>>>();
    
    for (const event of events) {
      const pattern = this.identifyPattern(event);
      if (!groups.has(pattern)) {
        groups.set(pattern, []);
      }
      groups.get(pattern)?.push(event);
    }

    return groups;
  }

  private identifyPattern(event: Record<string, any>): string {
    // Simplified pattern identification
    return Object.keys(event).sort().join('-');
  }

  private determineSeverity(value: number): 'info' | 'warning' | 'critical' {
    const abs = Math.abs(value);
    if (abs >= 0.5) return 'critical';
    if (abs >= 0.2) return 'warning';
    return 'info';
  }

  private generateRecommendations(type: string, data: any): string[] {
    const recommendations: string[] = [];

    switch (type) {
      case 'trend':
        if (data.trend === 'increasing' && data.changeRate > 0.2) {
          recommendations.push('Investigate cause of significant increase');
          recommendations.push('Consider implementing rate limiting');
        } else if (data.trend === 'decreasing' && data.changeRate < -0.2) {
          recommendations.push('Investigate potential performance degradation');
          recommendations.push('Review recent system changes');
        }
        break;

      case 'pattern':
        if (data.significance > 0.8) {
          recommendations.push('Implement automated handling for recurring pattern');
          recommendations.push('Set up specific monitoring for this pattern');
        }
        break;

      case 'correlation':
        if (data.strength === 'strong') {
          recommendations.push('Consider causation analysis');
          recommendations.push('Monitor both metrics together');
        }
        break;

      case 'prediction':
        if (data.confidence > 0.7) {
          recommendations.push('Prepare resources for predicted load');
          recommendations.push('Set up alerts for deviation from prediction');
        }
        break;
    }

    return recommendations;
  }
}

export const diagnosticAnalyticsService = DiagnosticAnalyticsService.getInstance();
export default DiagnosticAnalyticsService;
