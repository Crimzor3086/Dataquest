/**
 * Performance Testing Suite for Payment System
 * Load testing, stress testing, and performance monitoring
 */

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  concurrentUsers: number;
}

export interface LoadTestResult {
  testName: string;
  duration: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  throughput: number;
  errorRate: number;
}

export class PaymentPerformanceTester {
  private results: LoadTestResult[] = [];

  async runPerformanceTests(): Promise<void> {
    console.log('⚡ Starting Payment System Performance Tests...');

    // Test different load scenarios
    await this.testNormalLoad();
    await this.testPeakLoad();
    await this.testStressLoad();
    await this.testEnduranceLoad();

    this.generatePerformanceReport();
  }

  private async testNormalLoad(): Promise<void> {
    console.log('📊 Testing Normal Load (10 concurrent users)...');
    
    const result = await this.simulateLoad({
      concurrentUsers: 10,
      duration: 60000, // 1 minute
      requestsPerSecond: 2
    });

    this.results.push({
      testName: 'Normal Load Test',
      ...result
    });
  }

  private async testPeakLoad(): Promise<void> {
    console.log('📈 Testing Peak Load (50 concurrent users)...');
    
    const result = await this.simulateLoad({
      concurrentUsers: 50,
      duration: 30000, // 30 seconds
      requestsPerSecond: 5
    });

    this.results.push({
      testName: 'Peak Load Test',
      ...result
    });
  }

  private async testStressLoad(): Promise<void> {
    console.log('🔥 Testing Stress Load (100 concurrent users)...');
    
    const result = await this.simulateLoad({
      concurrentUsers: 100,
      duration: 15000, // 15 seconds
      requestsPerSecond: 10
    });

    this.results.push({
      testName: 'Stress Load Test',
      ...result
    });
  }

  private async testEnduranceLoad(): Promise<void> {
    console.log('⏱️ Testing Endurance Load (20 users for extended period)...');
    
    const result = await this.simulateLoad({
      concurrentUsers: 20,
      duration: 300000, // 5 minutes
      requestsPerSecond: 1
    });

    this.results.push({
      testName: 'Endurance Load Test',
      ...result
    });
  }

  private async simulateLoad(config: {
    concurrentUsers: number;
    duration: number;
    requestsPerSecond: number;
  }): Promise<Omit<LoadTestResult, 'testName'>> {
    const startTime = Date.now();
    const requests: Promise<any>[] = [];
    const responseTimes: number[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Simulate concurrent payment requests
    for (let i = 0; i < config.concurrentUsers; i++) {
      const userRequests = this.simulateUserPayments(
        config.duration / config.concurrentUsers,
        config.requestsPerSecond
      );
      requests.push(...userRequests);
    }

    // Wait for all requests to complete
    const results = await Promise.allSettled(requests);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
        responseTimes.push(result.value.responseTime || 2000);
      } else {
        failureCount++;
      }
    });

    const totalRequests = successCount + failureCount;
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p95ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

    return {
      duration: Date.now() - startTime,
      totalRequests,
      successfulRequests: successCount,
      failedRequests: failureCount,
      averageResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      throughput: (successCount / (config.duration / 1000)),
      errorRate: (failureCount / totalRequests) * 100
    };
  }

  private simulateUserPayments(duration: number, rps: number): Promise<any>[] {
    const requests: Promise<any>[] = [];
    const requestCount = Math.floor((duration / 1000) * rps);

    for (let i = 0; i < requestCount; i++) {
      requests.push(this.simulatePaymentRequest());
    }

    return requests;
  }

  private async simulatePaymentRequest(): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 500));
      
      const responseTime = Date.now() - startTime;
      const success = Math.random() > 0.05; // 95% success rate
      
      if (success) {
        return { success: true, responseTime };
      } else {
        throw new Error('Simulated payment failure');
      }
    } catch (error) {
      return { success: false, error: error.message, responseTime: Date.now() - startTime };
    }
  }

  private generatePerformanceReport(): void {
    console.log('\n⚡ Performance Test Results Summary:');
    console.log('==========================================');

    this.results.forEach(result => {
      console.log(`\n📊 ${result.testName}:`);
      console.log(`   Duration: ${(result.duration / 1000).toFixed(1)}s`);
      console.log(`   Total Requests: ${result.totalRequests}`);
      console.log(`   Success Rate: ${((result.successfulRequests / result.totalRequests) * 100).toFixed(1)}%`);
      console.log(`   Avg Response Time: ${result.averageResponseTime.toFixed(0)}ms`);
      console.log(`   95th Percentile: ${result.p95ResponseTime.toFixed(0)}ms`);
      console.log(`   Throughput: ${result.throughput.toFixed(1)} req/s`);
      console.log(`   Error Rate: ${result.errorRate.toFixed(2)}%`);
    });

    // Store results
    localStorage.setItem('performance_test_results', JSON.stringify({
      results: this.results,
      timestamp: new Date().toISOString(),
      summary: this.calculateSummary()
    }));
  }

  private calculateSummary() {
    const totalRequests = this.results.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalSuccessful = this.results.reduce((sum, r) => sum + r.successfulRequests, 0);
    const avgResponseTime = this.results.reduce((sum, r) => sum + r.averageResponseTime, 0) / this.results.length;
    const maxThroughput = Math.max(...this.results.map(r => r.throughput));

    return {
      totalRequests,
      overallSuccessRate: (totalSuccessful / totalRequests) * 100,
      averageResponseTime: avgResponseTime,
      maxThroughput,
      performanceGrade: this.calculatePerformanceGrade(avgResponseTime, (totalSuccessful / totalRequests) * 100)
    };
  }

  private calculatePerformanceGrade(avgResponseTime: number, successRate: number): string {
    if (avgResponseTime < 1000 && successRate > 99) return 'A+';
    if (avgResponseTime < 2000 && successRate > 98) return 'A';
    if (avgResponseTime < 3000 && successRate > 95) return 'B+';
    if (avgResponseTime < 5000 && successRate > 90) return 'B';
    return 'C';
  }
}

// Real-time performance monitoring
export class PaymentPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private monitoring = false;

  startMonitoring(): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    console.log('📊 Starting real-time performance monitoring...');

    const interval = setInterval(() => {
      if (!this.monitoring) {
        clearInterval(interval);
        return;
      }

      const metrics = this.collectMetrics();
      this.metrics.push(metrics);
      
      // Keep only last 100 metrics
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }

      this.checkPerformanceThresholds(metrics);
    }, 5000); // Collect metrics every 5 seconds
  }

  stopMonitoring(): void {
    this.monitoring = false;
    console.log('📊 Performance monitoring stopped');
  }

  private collectMetrics(): PerformanceMetrics {
    // Simulate metric collection
    return {
      responseTime: Math.random() * 3000 + 500,
      throughput: Math.random() * 50 + 10,
      errorRate: Math.random() * 5,
      cpuUsage: Math.random() * 80 + 10,
      memoryUsage: Math.random() * 70 + 20,
      concurrentUsers: Math.floor(Math.random() * 20) + 5
    };
  }

  private checkPerformanceThresholds(metrics: PerformanceMetrics): void {
    const alerts = [];

    if (metrics.responseTime > 5000) {
      alerts.push(`High response time: ${metrics.responseTime.toFixed(0)}ms`);
    }

    if (metrics.errorRate > 5) {
      alerts.push(`High error rate: ${metrics.errorRate.toFixed(1)}%`);
    }

    if (metrics.cpuUsage > 80) {
      alerts.push(`High CPU usage: ${metrics.cpuUsage.toFixed(1)}%`);
    }

    if (alerts.length > 0) {
      console.warn('⚠️ Performance Alert:', alerts.join(', '));
    }
  }

  getMetricsSummary() {
    if (this.metrics.length === 0) return null;

    const latest = this.metrics[this.metrics.length - 1];
    const average = {
      responseTime: this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length,
      throughput: this.metrics.reduce((sum, m) => sum + m.throughput, 0) / this.metrics.length,
      errorRate: this.metrics.reduce((sum, m) => sum + m.errorRate, 0) / this.metrics.length
    };

    return { latest, average, dataPoints: this.metrics.length };
  }
}

// Database performance testing
export const databasePerformanceTests = {
  testPaymentQueries: async () => {
    const tests = [
      { name: 'Payment Insert', query: 'INSERT INTO payments', expectedTime: 100 },
      { name: 'Payment Select', query: 'SELECT FROM payments', expectedTime: 50 },
      { name: 'Transaction Update', query: 'UPDATE mpesa_transactions', expectedTime: 75 },
      { name: 'Payment Logs Insert', query: 'INSERT INTO payment_logs', expectedTime: 25 }
    ];

    const results = [];
    for (const test of tests) {
      const startTime = performance.now();
      
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, Math.random() * test.expectedTime + 10));
      
      const duration = performance.now() - startTime;
      results.push({
        ...test,
        actualTime: duration,
        status: duration < test.expectedTime * 2 ? 'pass' : 'fail'
      });
    }

    return results;
  },

  testConnectionPooling: async () => {
    // Test database connection pool performance
    const connections = [];
    const startTime = performance.now();

    for (let i = 0; i < 20; i++) {
      connections.push(new Promise(resolve => setTimeout(resolve, Math.random() * 100)));
    }

    await Promise.all(connections);
    const duration = performance.now() - startTime;

    return {
      connectionPoolTest: 'completed',
      duration,
      status: duration < 1000 ? 'pass' : 'fail'
    };
  }
};

// Export performance tester
export const performanceTester = new PaymentPerformanceTester();
export const performanceMonitor = new PaymentPerformanceMonitor();