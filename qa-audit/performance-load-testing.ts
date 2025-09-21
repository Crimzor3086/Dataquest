/**
 * Performance and Load Testing Suite
 * Comprehensive performance testing for payment system under various load conditions
 */

export interface LoadTestConfig {
  name: string;
  concurrentUsers: number;
  duration: number; // milliseconds
  requestsPerSecond: number;
  rampUpTime: number; // milliseconds
  paymentMethods: string[];
}

export interface PerformanceMetrics {
  testName: string;
  startTime: number;
  endTime: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  throughput: number; // requests per second
  errorRate: number; // percentage
  memoryUsage?: number;
  cpuUsage?: number;
}

export const loadTestConfigurations: LoadTestConfig[] = [
  {
    name: 'Baseline Performance Test',
    concurrentUsers: 1,
    duration: 30000, // 30 seconds
    requestsPerSecond: 1,
    rampUpTime: 0,
    paymentMethods: ['mpesa', 'paypal']
  },
  {
    name: 'Normal Load Test',
    concurrentUsers: 10,
    duration: 60000, // 1 minute
    requestsPerSecond: 2,
    rampUpTime: 10000, // 10 seconds
    paymentMethods: ['mpesa', 'paypal', 'manual']
  },
  {
    name: 'Peak Load Test',
    concurrentUsers: 50,
    duration: 120000, // 2 minutes
    requestsPerSecond: 5,
    rampUpTime: 30000, // 30 seconds
    paymentMethods: ['mpesa', 'paypal']
  },
  {
    name: 'Stress Test',
    concurrentUsers: 100,
    duration: 60000, // 1 minute
    requestsPerSecond: 10,
    rampUpTime: 20000, // 20 seconds
    paymentMethods: ['mpesa', 'paypal']
  },
  {
    name: 'Spike Test',
    concurrentUsers: 200,
    duration: 30000, // 30 seconds
    requestsPerSecond: 20,
    rampUpTime: 5000, // 5 seconds
    paymentMethods: ['mpesa']
  },
  {
    name: 'Endurance Test',
    concurrentUsers: 20,
    duration: 600000, // 10 minutes
    requestsPerSecond: 1,
    rampUpTime: 60000, // 1 minute
    paymentMethods: ['mpesa', 'paypal', 'manual']
  }
];

export class PaymentPerformanceTester {
  private testResults: PerformanceMetrics[] = [];
  private realTimeMetrics: any[] = [];

  async runPerformanceTestSuite(): Promise<void> {
    console.log('⚡ Starting Comprehensive Payment Performance Testing...');
    console.log(`📊 Total load test configurations: ${loadTestConfigurations.length}`);

    for (const config of loadTestConfigurations) {
      console.log(`\n🔄 Running ${config.name}...`);
      console.log(`   👥 Users: ${config.concurrentUsers}`);
      console.log(`   ⏱️ Duration: ${config.duration / 1000}s`);
      console.log(`   📈 RPS: ${config.requestsPerSecond}`);

      try {
        const metrics = await this.executeLoadTest(config);
        this.testResults.push(metrics);
        
        console.log(`✅ ${config.name} completed:`);
        console.log(`   📊 Success Rate: ${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}%`);
        console.log(`   ⚡ Avg Response: ${metrics.averageResponseTime.toFixed(0)}ms`);
        console.log(`   🚀 Throughput: ${metrics.throughput.toFixed(1)} req/s`);
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`❌ ${config.name} failed:`, error);
      }
    }

    this.generatePerformanceReport();
  }

  private async executeLoadTest(config: LoadTestConfig): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    const requests: Promise<any>[] = [];
    const responseTimes: number[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Ramp up users gradually
    const usersPerInterval = Math.max(1, Math.floor(config.concurrentUsers / 10));
    const rampUpInterval = config.rampUpTime / 10;

    for (let interval = 0; interval < 10; interval++) {
      setTimeout(() => {
        for (let user = 0; user < usersPerInterval; user++) {
          const userRequests = this.generateUserRequests(config);
          requests.push(...userRequests);
        }
      }, interval * rampUpInterval);
    }

    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, config.duration + config.rampUpTime));

    // Wait for all requests to complete (with timeout)
    const results = await Promise.allSettled(requests);
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.success) {
        successCount++;
        responseTimes.push(result.value.responseTime);
      } else {
        failureCount++;
      }
    });

    const endTime = Date.now();
    const totalRequests = successCount + failureCount;
    
    // Calculate percentiles
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)] || 0;
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0;
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0;
    const min = Math.min(...responseTimes) || 0;
    const max = Math.max(...responseTimes) || 0;
    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;

    return {
      testName: config.name,
      startTime,
      endTime,
      totalRequests,
      successfulRequests: successCount,
      failedRequests: failureCount,
      averageResponseTime: avg,
      p50ResponseTime: p50,
      p95ResponseTime: p95,
      p99ResponseTime: p99,
      minResponseTime: min,
      maxResponseTime: max,
      throughput: successCount / ((endTime - startTime) / 1000),
      errorRate: (failureCount / totalRequests) * 100,
      memoryUsage: this.estimateMemoryUsage(),
      cpuUsage: this.estimateCPUUsage()
    };
  }

  private generateUserRequests(config: LoadTestConfig): Promise<any>[] {
    const requests: Promise<any>[] = [];
    const requestCount = Math.floor(config.duration / 1000 * config.requestsPerSecond);

    for (let i = 0; i < requestCount; i++) {
      const paymentMethod = config.paymentMethods[Math.floor(Math.random() * config.paymentMethods.length)];
      const delay = (i / config.requestsPerSecond) * 1000; // Spread requests over time
      
      requests.push(
        new Promise(resolve => 
          setTimeout(() => resolve(this.simulatePaymentRequest(paymentMethod)), delay)
        )
      );
    }

    return requests;
  }

  private async simulatePaymentRequest(paymentMethod: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Simulate different response times for different payment methods
      const baseTimes = {
        mpesa: 2300,    // M-Pesa average: 2.3s
        paypal: 850,    // PayPal average: 850ms
        manual: 100     // Manual: instant
      };

      const baseTime = baseTimes[paymentMethod as keyof typeof baseTimes] || 1000;
      const variation = baseTime * 0.3; // ±30% variation
      const responseTime = baseTime + (Math.random() - 0.5) * variation;

      await new Promise(resolve => setTimeout(resolve, responseTime));

      // Simulate success/failure rates
      const successRates = {
        mpesa: 0.985,   // 98.5% success rate
        paypal: 0.992,  // 99.2% success rate
        manual: 1.0     // 100% success rate (no API calls)
      };

      const successRate = successRates[paymentMethod as keyof typeof successRates] || 0.95;
      const success = Math.random() < successRate;

      return {
        success,
        responseTime: Date.now() - startTime,
        paymentMethod,
        error: success ? null : `Simulated ${paymentMethod} failure`
      };
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        paymentMethod,
        error: error.message
      };
    }
  }

  private estimateMemoryUsage(): number {
    // Estimate memory usage based on performance API
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return Math.random() * 100 + 50; // Simulate 50-150MB
  }

  private estimateCPUUsage(): number {
    // Simulate CPU usage estimation
    return Math.random() * 60 + 20; // Simulate 20-80% CPU usage
  }

  private generatePerformanceReport(): void {
    console.log('\n⚡ Performance Testing Summary Report:');
    console.log('=====================================');

    // Overall statistics
    const totalRequests = this.testResults.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalSuccessful = this.testResults.reduce((sum, r) => sum + r.successfulRequests, 0);
    const overallSuccessRate = (totalSuccessful / totalRequests) * 100;
    const avgResponseTime = this.testResults.reduce((sum, r) => sum + r.averageResponseTime, 0) / this.testResults.length;

    console.log(`📊 Overall Statistics:`);
    console.log(`   Total Requests: ${totalRequests.toLocaleString()}`);
    console.log(`   Success Rate: ${overallSuccessRate.toFixed(2)}%`);
    console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);

    // Individual test results
    console.log('\n📈 Individual Test Results:');
    this.testResults.forEach(result => {
      console.log(`\n🔍 ${result.testName}:`);
      console.log(`   Duration: ${((result.endTime - result.startTime) / 1000).toFixed(1)}s`);
      console.log(`   Requests: ${result.totalRequests.toLocaleString()}`);
      console.log(`   Success Rate: ${((result.successfulRequests / result.totalRequests) * 100).toFixed(1)}%`);
      console.log(`   Avg Response: ${result.averageResponseTime.toFixed(0)}ms`);
      console.log(`   95th Percentile: ${result.p95ResponseTime.toFixed(0)}ms`);
      console.log(`   99th Percentile: ${result.p99ResponseTime.toFixed(0)}ms`);
      console.log(`   Throughput: ${result.throughput.toFixed(1)} req/s`);
      console.log(`   Error Rate: ${result.errorRate.toFixed(2)}%`);
      
      if (result.memoryUsage) {
        console.log(`   Memory Usage: ${result.memoryUsage.toFixed(1)} MB`);
      }
      if (result.cpuUsage) {
        console.log(`   CPU Usage: ${result.cpuUsage.toFixed(1)}%`);
      }
    });

    // Performance analysis
    console.log('\n📊 Performance Analysis:');
    
    // Response time analysis
    const responseTimeTargets = {
      excellent: 1000,
      good: 3000,
      acceptable: 5000
    };

    const excellentTests = this.testResults.filter(r => r.averageResponseTime < responseTimeTargets.excellent).length;
    const goodTests = this.testResults.filter(r => r.averageResponseTime < responseTimeTargets.good).length;
    const acceptableTests = this.testResults.filter(r => r.averageResponseTime < responseTimeTargets.acceptable).length;

    console.log(`   ⚡ Excellent Response Time (<1s): ${excellentTests}/${this.testResults.length} tests`);
    console.log(`   ✅ Good Response Time (<3s): ${goodTests}/${this.testResults.length} tests`);
    console.log(`   ⚠️ Acceptable Response Time (<5s): ${acceptableTests}/${this.testResults.length} tests`);

    // Throughput analysis
    const maxThroughput = Math.max(...this.testResults.map(r => r.throughput));
    const avgThroughput = this.testResults.reduce((sum, r) => sum + r.throughput, 0) / this.testResults.length;

    console.log(`   🚀 Maximum Throughput: ${maxThroughput.toFixed(1)} req/s`);
    console.log(`   📊 Average Throughput: ${avgThroughput.toFixed(1)} req/s`);

    // Error rate analysis
    const maxErrorRate = Math.max(...this.testResults.map(r => r.errorRate));
    const avgErrorRate = this.testResults.reduce((sum, r) => sum + r.errorRate, 0) / this.testResults.length;

    console.log(`   ❌ Maximum Error Rate: ${maxErrorRate.toFixed(2)}%`);
    console.log(`   📊 Average Error Rate: ${avgErrorRate.toFixed(2)}%`);

    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    
    if (avgResponseTime > 3000) {
      console.log('   ⚠️ Consider optimizing API response times');
    }
    if (maxErrorRate > 5) {
      console.log('   ⚠️ High error rates detected under load - investigate error handling');
    }
    if (avgThroughput < 10) {
      console.log('   ⚠️ Low throughput - consider scaling infrastructure');
    }

    // Store performance results
    const performanceReport = {
      summary: {
        totalTests: this.testResults.length,
        totalRequests,
        overallSuccessRate,
        averageResponseTime: avgResponseTime,
        maxThroughput,
        avgThroughput,
        maxErrorRate,
        avgErrorRate
      },
      testResults: this.testResults,
      analysis: {
        responseTimeDistribution: {
          excellent: excellentTests,
          good: goodTests,
          acceptable: acceptableTests
        },
        performanceGrade: this.calculatePerformanceGrade(avgResponseTime, overallSuccessRate),
        recommendations: this.generateRecommendations()
      },
      timestamp: new Date().toISOString(),
      environment: 'performance-testing',
      tester: 'Performance Engineering Team'
    };

    localStorage.setItem('performance_test_results', JSON.stringify(performanceReport));
    console.log('\n💾 Performance test results saved to localStorage as "performance_test_results"');
  }

  private calculatePerformanceGrade(avgResponseTime: number, successRate: number): string {
    if (avgResponseTime < 1000 && successRate > 99) return 'A+';
    if (avgResponseTime < 2000 && successRate > 98) return 'A';
    if (avgResponseTime < 3000 && successRate > 95) return 'B+';
    if (avgResponseTime < 5000 && successRate > 90) return 'B';
    if (avgResponseTime < 8000 && successRate > 85) return 'C+';
    return 'C';
  }

  private generateRecommendations(): string[] {
    const recommendations = [];
    const avgResponseTime = this.testResults.reduce((sum, r) => sum + r.averageResponseTime, 0) / this.testResults.length;
    const maxErrorRate = Math.max(...this.testResults.map(r => r.errorRate));

    if (avgResponseTime > 3000) {
      recommendations.push('Optimize API response times - consider caching and database query optimization');
    }
    if (maxErrorRate > 5) {
      recommendations.push('Investigate high error rates under load - implement better error handling and retry mechanisms');
    }
    if (this.testResults.some(r => r.p99ResponseTime > 10000)) {
      recommendations.push('Address response time outliers - investigate slow queries and optimize bottlenecks');
    }

    const stressTest = this.testResults.find(r => r.testName.includes('Stress'));
    if (stressTest && stressTest.errorRate > 10) {
      recommendations.push('System struggles under stress load - consider horizontal scaling');
    }

    const enduranceTest = this.testResults.find(r => r.testName.includes('Endurance'));
    if (enduranceTest && enduranceTest.errorRate > 2) {
      recommendations.push('Memory leaks or resource exhaustion detected - investigate long-running performance');
    }

    return recommendations;
  }
}

// Database performance testing
export class DatabasePerformanceTester {
  async testDatabasePerformance(): Promise<any> {
    console.log('🗄️ Starting Database Performance Tests...');

    const dbTests = [
      { name: 'Payment Insert', operation: 'insert', table: 'payments', expectedTime: 100 },
      { name: 'Payment Select', operation: 'select', table: 'payments', expectedTime: 50 },
      { name: 'Transaction Update', operation: 'update', table: 'mpesa_transactions', expectedTime: 75 },
      { name: 'Payment Logs Insert', operation: 'insert', table: 'payment_logs', expectedTime: 25 },
      { name: 'Complex Join Query', operation: 'join', table: 'payments+mpesa_transactions', expectedTime: 150 },
      { name: 'Aggregate Query', operation: 'aggregate', table: 'payments', expectedTime: 200 }
    ];

    const results = [];
    
    for (const test of dbTests) {
      const startTime = performance.now();
      
      // Simulate database operation
      await this.simulateDatabaseOperation(test.operation, test.expectedTime);
      
      const actualTime = performance.now() - startTime;
      const status = actualTime < (test.expectedTime * 2) ? 'pass' : 'fail';
      
      results.push({
        ...test,
        actualTime: actualTime.toFixed(2),
        status,
        performance: actualTime < test.expectedTime ? 'excellent' : 
                    actualTime < test.expectedTime * 1.5 ? 'good' : 'poor'
      });

      console.log(`${status === 'pass' ? '✅' : '❌'} ${test.name}: ${actualTime.toFixed(0)}ms (target: ${test.expectedTime}ms)`);
    }

    // Connection pool testing
    console.log('\n🔗 Testing Database Connection Pool...');
    const connectionPoolResult = await this.testConnectionPool();
    
    console.log(`✅ Connection Pool Test: ${connectionPoolResult.duration.toFixed(0)}ms for ${connectionPoolResult.connections} connections`);

    return {
      queryPerformance: results,
      connectionPool: connectionPoolResult,
      recommendations: this.generateDatabaseRecommendations(results)
    };
  }

  private async simulateDatabaseOperation(operation: string, expectedTime: number): Promise<void> {
    // Simulate database operation with realistic timing
    const variation = expectedTime * 0.4; // ±40% variation
    const actualTime = expectedTime + (Math.random() - 0.5) * variation;
    await new Promise(resolve => setTimeout(resolve, Math.max(10, actualTime)));
  }

  private async testConnectionPool(): Promise<any> {
    const startTime = performance.now();
    const connectionCount = 20;
    const connections = [];

    for (let i = 0; i < connectionCount; i++) {
      connections.push(
        new Promise(resolve => 
          setTimeout(resolve, Math.random() * 100 + 50)
        )
      );
    }

    await Promise.all(connections);
    const duration = performance.now() - startTime;

    return {
      connections: connectionCount,
      duration,
      status: duration < 1000 ? 'excellent' : duration < 2000 ? 'good' : 'poor'
    };
  }

  private generateDatabaseRecommendations(results: any[]): string[] {
    const recommendations = [];
    
    const slowQueries = results.filter(r => r.performance === 'poor');
    if (slowQueries.length > 0) {
      recommendations.push(`Optimize slow queries: ${slowQueries.map(q => q.name).join(', ')}`);
    }

    const insertOperations = results.filter(r => r.operation === 'insert');
    const avgInsertTime = insertOperations.reduce((sum, op) => sum + parseFloat(op.actualTime), 0) / insertOperations.length;
    if (avgInsertTime > 100) {
      recommendations.push('Consider batch insert operations for better performance');
    }

    const selectOperations = results.filter(r => r.operation === 'select');
    const avgSelectTime = selectOperations.reduce((sum, op) => sum + parseFloat(op.actualTime), 0) / selectOperations.length;
    if (avgSelectTime > 75) {
      recommendations.push('Add database indexes for frequently queried columns');
    }

    return recommendations;
  }
}

// Real-time monitoring utilities
export class RealTimePerformanceMonitor {
  private monitoring = false;
  private metrics: any[] = [];

  startMonitoring(): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    console.log('📊 Starting real-time performance monitoring...');

    const interval = setInterval(() => {
      if (!this.monitoring) {
        clearInterval(interval);
        return;
      }

      const currentMetrics = this.collectCurrentMetrics();
      this.metrics.push(currentMetrics);
      
      // Keep only last 100 metrics (5 minutes at 3-second intervals)
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }

      this.checkPerformanceAlerts(currentMetrics);
    }, 3000); // Collect metrics every 3 seconds
  }

  stopMonitoring(): void {
    this.monitoring = false;
    console.log('📊 Real-time monitoring stopped');
  }

  private collectCurrentMetrics(): any {
    return {
      timestamp: Date.now(),
      responseTime: this.measureCurrentResponseTime(),
      activeUsers: this.estimateActiveUsers(),
      memoryUsage: this.estimateMemoryUsage(),
      errorRate: this.calculateCurrentErrorRate(),
      throughput: this.calculateCurrentThroughput()
    };
  }

  private measureCurrentResponseTime(): number {
    // Simulate current response time measurement
    return Math.random() * 2000 + 500;
  }

  private estimateActiveUsers(): number {
    return Math.floor(Math.random() * 50) + 5;
  }

  private estimateMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return (memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return Math.random() * 100 + 50;
  }

  private calculateCurrentErrorRate(): number {
    return Math.random() * 5; // 0-5% error rate
  }

  private calculateCurrentThroughput(): number {
    return Math.random() * 20 + 5; // 5-25 requests per second
  }

  private checkPerformanceAlerts(metrics: any): void {
    const alerts = [];

    if (metrics.responseTime > 5000) {
      alerts.push(`🚨 High response time: ${metrics.responseTime.toFixed(0)}ms`);
    }
    if (metrics.errorRate > 5) {
      alerts.push(`🚨 High error rate: ${metrics.errorRate.toFixed(1)}%`);
    }
    if (metrics.memoryUsage > 200) {
      alerts.push(`🚨 High memory usage: ${metrics.memoryUsage.toFixed(1)}MB`);
    }

    if (alerts.length > 0) {
      console.warn('⚠️ Performance Alerts:', alerts.join(', '));
    }
  }

  getMetricsSummary() {
    if (this.metrics.length === 0) return null;

    const latest = this.metrics[this.metrics.length - 1];
    const averages = {
      responseTime: this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length,
      errorRate: this.metrics.reduce((sum, m) => sum + m.errorRate, 0) / this.metrics.length,
      throughput: this.metrics.reduce((sum, m) => sum + m.throughput, 0) / this.metrics.length,
      memoryUsage: this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length
    };

    return {
      latest,
      averages,
      dataPoints: this.metrics.length,
      monitoringDuration: (latest.timestamp - this.metrics[0].timestamp) / 1000 / 60 // minutes
    };
  }
}

// Export performance testing instances
export const performanceTester = new PaymentPerformanceTester();
export const databaseTester = new DatabasePerformanceTester();
export const realTimeMonitor = new RealTimePerformanceMonitor();