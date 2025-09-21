/**
 * QA Audit Execution Runner
 * Orchestrates the complete payment system audit process
 */

import { frontendTestAutomation } from './frontend-test-automation';
import { backendSecurityAuditor } from './backend-security-audit';
import { paymentIntegrationTester } from './payment-integration-tests';
import { performanceTester, databaseTester, realTimeMonitor } from './performance-load-testing';

export interface AuditConfiguration {
  includeFrontendTests: boolean;
  includeBackendSecurity: boolean;
  includeIntegrationTests: boolean;
  includePerformanceTests: boolean;
  includeDatabaseTests: boolean;
  includeRealTimeMonitoring: boolean;
  testEnvironment: 'sandbox' | 'production' | 'staging';
  maxExecutionTime: number; // minutes
}

export interface AuditSummary {
  overallStatus: 'pass' | 'fail' | 'warning';
  overallScore: number;
  executionTime: number;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  recommendations: string[];
  nextAuditDate: string;
}

export class PaymentSystemAuditRunner {
  private auditConfig: AuditConfiguration;
  private auditStartTime: number = 0;
  private auditResults: any = {};

  constructor(config: Partial<AuditConfiguration> = {}) {
    this.auditConfig = {
      includeFrontendTests: true,
      includeBackendSecurity: true,
      includeIntegrationTests: true,
      includePerformanceTests: true,
      includeDatabaseTests: true,
      includeRealTimeMonitoring: false, // Disabled by default for audit
      testEnvironment: 'sandbox',
      maxExecutionTime: 60, // 1 hour
      ...config
    };
  }

  async runCompleteAudit(): Promise<AuditSummary> {
    this.auditStartTime = Date.now();
    
    console.log('🔍 STARTING COMPREHENSIVE PAYMENT SYSTEM AUDIT');
    console.log('==============================================');
    console.log(`📅 Audit Date: ${new Date().toISOString()}`);
    console.log(`🌍 Environment: ${this.auditConfig.testEnvironment}`);
    console.log(`⏱️ Max Execution Time: ${this.auditConfig.maxExecutionTime} minutes`);
    console.log('');

    try {
      // Phase 1: Frontend Testing
      if (this.auditConfig.includeFrontendTests) {
        console.log('🎨 PHASE 1: Frontend UI/UX Testing');
        console.log('==================================');
        await frontendTestAutomation.runAllTests();
        this.auditResults.frontend = this.getStoredResults('frontend_audit_results');
      }

      // Phase 2: Backend Security Audit
      if (this.auditConfig.includeBackendSecurity) {
        console.log('\n🔒 PHASE 2: Backend Security Audit');
        console.log('=================================');
        await backendSecurityAuditor.runComprehensiveSecurityAudit();
        this.auditResults.security = this.getStoredResults('backend_security_audit');
      }

      // Phase 3: Payment Integration Testing
      if (this.auditConfig.includeIntegrationTests) {
        console.log('\n🔗 PHASE 3: Payment Integration Testing');
        console.log('=====================================');
        await paymentIntegrationTester.runIntegrationTests();
        this.auditResults.integration = this.getStoredResults('payment_integration_audit');
      }

      // Phase 4: Performance Testing
      if (this.auditConfig.includePerformanceTests) {
        console.log('\n⚡ PHASE 4: Performance & Load Testing');
        console.log('====================================');
        await performanceTester.runPerformanceTestSuite();
        this.auditResults.performance = this.getStoredResults('performance_test_results');
      }

      // Phase 5: Database Testing
      if (this.auditConfig.includeDatabaseTests) {
        console.log('\n🗄️ PHASE 5: Database Performance Testing');
        console.log('======================================');
        const dbResults = await databaseTester.testDatabasePerformance();
        this.auditResults.database = dbResults;
      }

      // Phase 6: Real-time Monitoring (if enabled)
      if (this.auditConfig.includeRealTimeMonitoring) {
        console.log('\n📊 PHASE 6: Real-time Performance Monitoring');
        console.log('===========================================');
        realTimeMonitor.startMonitoring();
        await new Promise(resolve => setTimeout(resolve, 300000)); // Monitor for 5 minutes
        realTimeMonitor.stopMonitoring();
        this.auditResults.realTimeMetrics = realTimeMonitor.getMetricsSummary();
      }

      // Generate comprehensive audit summary
      const auditSummary = this.generateAuditSummary();
      this.saveAuditResults(auditSummary);
      
      return auditSummary;

    } catch (error) {
      console.error('❌ Audit execution failed:', error);
      throw new Error(`Audit execution failed: ${error.message}`);
    }
  }

  private getStoredResults(key: string): any {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn(`⚠️ Failed to retrieve ${key} from localStorage:`, error);
      return null;
    }
  }

  private generateAuditSummary(): AuditSummary {
    const executionTime = Date.now() - this.auditStartTime;
    
    // Aggregate results from all test phases
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let criticalIssues = 0;
    let highIssues = 0;
    let mediumIssues = 0;
    let lowIssues = 0;

    // Frontend results
    if (this.auditResults.frontend) {
      const frontend = this.auditResults.frontend.summary;
      totalTests += frontend.total;
      totalPassed += frontend.passed;
      totalFailed += frontend.failed;
      criticalIssues += frontend.criticalIssues || 0;
      highIssues += frontend.highIssues || 0;
      mediumIssues += frontend.mediumIssues || 0;
      lowIssues += frontend.lowIssues || 0;
    }

    // Security results
    if (this.auditResults.security) {
      const security = this.auditResults.security.summary;
      totalTests += security.total;
      totalPassed += security.passed;
      totalFailed += security.failed;
      criticalIssues += security.vulnerabilities?.critical || 0;
      highIssues += security.vulnerabilities?.high || 0;
      mediumIssues += security.vulnerabilities?.medium || 0;
      lowIssues += security.vulnerabilities?.low || 0;
    }

    // Integration results
    if (this.auditResults.integration) {
      const integration = this.auditResults.integration.summary;
      totalTests += integration.total;
      totalPassed += integration.passed;
      totalFailed += integration.failed;
    }

    // Performance results
    if (this.auditResults.performance) {
      const performance = this.auditResults.performance.summary;
      totalTests += performance.totalTests || 0;
    }

    // Calculate overall score
    const testScore = totalTests > 0 ? (totalPassed / totalTests) * 100 : 100;
    const securityScore = this.auditResults.security?.summary?.securityScore || 100;
    const performanceScore = this.calculatePerformanceScore();
    
    const overallScore = (testScore * 0.4 + securityScore * 0.4 + performanceScore * 0.2);

    // Determine overall status
    let overallStatus: 'pass' | 'fail' | 'warning' = 'pass';
    if (criticalIssues > 0) {
      overallStatus = 'fail';
    } else if (highIssues > 2 || overallScore < 85) {
      overallStatus = 'warning';
    }

    // Generate recommendations
    const recommendations = this.generateOverallRecommendations();

    console.log('\n🏆 AUDIT COMPLETION SUMMARY');
    console.log('===========================');
    console.log(`⏱️ Total Execution Time: ${(executionTime / 1000 / 60).toFixed(1)} minutes`);
    console.log(`📊 Overall Score: ${overallScore.toFixed(1)}/100`);
    console.log(`🎯 Overall Status: ${overallStatus.toUpperCase()}`);
    console.log(`📈 Tests Run: ${totalTests}`);
    console.log(`✅ Tests Passed: ${totalPassed}`);
    console.log(`❌ Tests Failed: ${totalFailed}`);
    console.log(`🚨 Critical Issues: ${criticalIssues}`);
    console.log(`⚠️ High Priority Issues: ${highIssues}`);
    console.log(`📋 Medium Priority Issues: ${mediumIssues}`);
    console.log(`ℹ️ Low Priority Issues: ${lowIssues}`);

    return {
      overallStatus,
      overallScore,
      executionTime: executionTime / 1000 / 60, // minutes
      testsRun: totalTests,
      testsPassed: totalPassed,
      testsFailed: totalFailed,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      recommendations,
      nextAuditDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
    };
  }

  private calculatePerformanceScore(): number {
    if (!this.auditResults.performance) return 100;
    
    const perf = this.auditResults.performance.summary;
    const responseTimeScore = perf.averageResponseTime < 2000 ? 100 : 
                             perf.averageResponseTime < 3000 ? 85 :
                             perf.averageResponseTime < 5000 ? 70 : 50;
    
    const successRateScore = perf.overallSuccessRate > 99 ? 100 :
                            perf.overallSuccessRate > 95 ? 85 :
                            perf.overallSuccessRate > 90 ? 70 : 50;
    
    return (responseTimeScore + successRateScore) / 2;
  }

  private generateOverallRecommendations(): string[] {
    const recommendations = [];

    // Frontend recommendations
    if (this.auditResults.frontend?.failedTests?.length > 0) {
      recommendations.push('Improve frontend error messaging for better user experience');
    }

    // Security recommendations
    if (this.auditResults.security?.vulnerabilities?.length > 0) {
      recommendations.push('Address identified security vulnerabilities');
    }

    // Integration recommendations
    if (this.auditResults.integration?.failedTests?.length > 0) {
      const mpesaIssues = this.auditResults.integration.failedTests.filter((t: any) => t.paymentMethod === 'mpesa');
      if (mpesaIssues.length > 0) {
        recommendations.push('Enhance M-Pesa error handling and user guidance');
      }
    }

    // Performance recommendations
    if (this.auditResults.performance?.analysis?.recommendations?.length > 0) {
      recommendations.push(...this.auditResults.performance.analysis.recommendations);
    }

    // Database recommendations
    if (this.auditResults.database?.recommendations?.length > 0) {
      recommendations.push(...this.auditResults.database.recommendations);
    }

    // General recommendations
    recommendations.push('Schedule regular security audits every 90 days');
    recommendations.push('Implement continuous performance monitoring');
    recommendations.push('Maintain payment system documentation');

    return recommendations;
  }

  private saveAuditResults(summary: AuditSummary): void {
    const completeAuditReport = {
      auditSummary: summary,
      configuration: this.auditConfig,
      detailedResults: this.auditResults,
      timestamp: new Date().toISOString(),
      auditor: 'Senior QA Engineering Team',
      environment: this.auditConfig.testEnvironment,
      version: '1.0.0'
    };

    // Save to localStorage
    localStorage.setItem('complete_payment_audit', JSON.stringify(completeAuditReport));
    
    // Generate downloadable report
    this.generateDownloadableReport(completeAuditReport);
    
    console.log('\n💾 Complete audit results saved to localStorage as "complete_payment_audit"');
    console.log('📄 Downloadable audit report generated');
  }

  private generateDownloadableReport(auditData: any): void {
    const reportContent = this.formatAuditReport(auditData);
    
    // Create downloadable file
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Store download link for later use
    localStorage.setItem('audit_report_download_url', url);
    localStorage.setItem('audit_report_filename', `payment-audit-${new Date().toISOString().split('T')[0]}.md`);
    
    console.log('📥 Audit report ready for download');
  }

  private formatAuditReport(auditData: any): string {
    const summary = auditData.auditSummary;
    const timestamp = new Date(auditData.timestamp).toLocaleString();

    return `# Payment System Comprehensive Audit Report

**Audit Date:** ${timestamp}  
**Environment:** ${auditData.environment}  
**Auditor:** ${auditData.auditor}  
**Version:** ${auditData.version}

## Executive Summary

**Overall Status:** ${summary.overallStatus.toUpperCase()}  
**Overall Score:** ${summary.overallScore.toFixed(1)}/100  
**Execution Time:** ${summary.executionTime.toFixed(1)} minutes  

### Test Results Summary
- **Total Tests:** ${summary.testsRun}
- **Passed:** ${summary.testsPassed}
- **Failed:** ${summary.testsFailed}
- **Success Rate:** ${((summary.testsPassed / summary.testsRun) * 100).toFixed(1)}%

### Issues by Severity
- **🔴 Critical:** ${summary.criticalIssues}
- **🟡 High:** ${summary.highIssues}
- **🟠 Medium:** ${summary.mediumIssues}
- **🟢 Low:** ${summary.lowIssues}

## Detailed Results

### Frontend Testing
${this.formatFrontendResults(auditData.detailedResults.frontend)}

### Security Audit
${this.formatSecurityResults(auditData.detailedResults.security)}

### Integration Testing
${this.formatIntegrationResults(auditData.detailedResults.integration)}

### Performance Testing
${this.formatPerformanceResults(auditData.detailedResults.performance)}

## Recommendations

${summary.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

## Next Steps

1. Address critical and high-priority issues immediately
2. Implement recommended improvements within 2 weeks
3. Schedule next audit for: ${new Date(summary.nextAuditDate).toLocaleDateString()}
4. Monitor system performance continuously

---

*This report was generated by the DataQuest Solutions QA Audit System*
`;
  }

  private formatFrontendResults(frontend: any): string {
    if (!frontend) return 'Frontend testing not performed.';
    
    return `
**Tests Run:** ${frontend.summary.total}  
**Success Rate:** ${frontend.summary.successRate.toFixed(1)}%  
**Critical Issues:** ${frontend.summary.criticalIssues}  

**Category Breakdown:**
${frontend.categoryBreakdown.map((cat: any) => 
  `- ${cat.category.toUpperCase()}: ${cat.passed}/${cat.total} passed`
).join('\n')}
`;
  }

  private formatSecurityResults(security: any): string {
    if (!security) return 'Security audit not performed.';
    
    return `
**Security Score:** ${security.summary.securityScore.toFixed(1)}/100  
**Vulnerabilities Found:** ${security.summary.vulnerabilities.total}  
**Critical Vulnerabilities:** ${security.summary.vulnerabilities.critical}  

**Compliance Status:**
${security.compliance.standards.map((std: any) => 
  `- ${std.standard}: ${std.status.toUpperCase()}`
).join('\n')}
`;
  }

  private formatIntegrationResults(integration: any): string {
    if (!integration) return 'Integration testing not performed.';
    
    return `
**Integration Tests:** ${integration.summary.total}  
**Success Rate:** ${integration.summary.successRate.toFixed(1)}%  

**Payment Method Results:**
- M-Pesa: ${integration.paymentMethodBreakdown.mpesa.passed}/${integration.paymentMethodBreakdown.mpesa.total}
- PayPal: ${integration.paymentMethodBreakdown.paypal.passed}/${integration.paymentMethodBreakdown.paypal.total}
- Manual: ${integration.paymentMethodBreakdown.manual.passed}/${integration.paymentMethodBreakdown.manual.total}
`;
  }

  private formatPerformanceResults(performance: any): string {
    if (!performance) return 'Performance testing not performed.';
    
    return `
**Performance Grade:** ${performance.analysis.performanceGrade}  
**Average Response Time:** ${performance.summary.averageResponseTime.toFixed(0)}ms  
**Maximum Throughput:** ${performance.summary.maxThroughput.toFixed(1)} req/s  
**Overall Success Rate:** ${performance.summary.overallSuccessRate.toFixed(1)}%  
`;
  }

  // Public method to download audit report
  downloadAuditReport(): void {
    const downloadUrl = localStorage.getItem('audit_report_download_url');
    const filename = localStorage.getItem('audit_report_filename');
    
    if (downloadUrl && filename) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.click();
      
      console.log(`📥 Downloading audit report: ${filename}`);
    } else {
      console.error('❌ No audit report available for download');
    }
  }

  // Public method to get audit status
  getAuditStatus(): any {
    const auditData = localStorage.getItem('complete_payment_audit');
    if (auditData) {
      const parsed = JSON.parse(auditData);
      return {
        completed: true,
        summary: parsed.auditSummary,
        timestamp: parsed.timestamp
      };
    }
    
    return {
      completed: false,
      inProgress: this.auditStartTime > 0,
      startTime: this.auditStartTime
    };
  }
}

// Audit scheduling and automation
export class AuditScheduler {
  private scheduledAudits: any[] = [];

  scheduleRegularAudit(frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'): void {
    const intervals = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      quarterly: 90 * 24 * 60 * 60 * 1000
    };

    const interval = intervals[frequency];
    const nextAuditTime = Date.now() + interval;

    this.scheduledAudits.push({
      id: `audit_${Date.now()}`,
      frequency,
      nextExecution: nextAuditTime,
      config: {
        includeFrontendTests: frequency !== 'daily',
        includeBackendSecurity: true,
        includeIntegrationTests: true,
        includePerformanceTests: frequency === 'weekly' || frequency === 'monthly',
        includeDatabaseTests: frequency === 'monthly' || frequency === 'quarterly',
        includeRealTimeMonitoring: false
      }
    });

    console.log(`📅 Scheduled ${frequency} audit for ${new Date(nextAuditTime).toLocaleString()}`);
  }

  getScheduledAudits(): any[] {
    return this.scheduledAudits.filter(audit => audit.nextExecution > Date.now());
  }

  async runScheduledAudits(): Promise<void> {
    const dueAudits = this.scheduledAudits.filter(audit => audit.nextExecution <= Date.now());
    
    for (const audit of dueAudits) {
      console.log(`🔄 Running scheduled ${audit.frequency} audit...`);
      
      const runner = new PaymentSystemAuditRunner(audit.config);
      await runner.runCompleteAudit();
      
      // Reschedule next audit
      const intervals = {
        daily: 24 * 60 * 60 * 1000,
        weekly: 7 * 24 * 60 * 60 * 1000,
        monthly: 30 * 24 * 60 * 60 * 1000,
        quarterly: 90 * 24 * 60 * 60 * 1000
      };
      
      audit.nextExecution = Date.now() + intervals[audit.frequency as keyof typeof intervals];
    }
  }
}

// Export audit runner and utilities
export const auditRunner = new PaymentSystemAuditRunner();
export const auditScheduler = new AuditScheduler();

// Quick audit execution function
export const runQuickAudit = async (): Promise<AuditSummary> => {
  const quickConfig: AuditConfiguration = {
    includeFrontendTests: true,
    includeBackendSecurity: true,
    includeIntegrationTests: true,
    includePerformanceTests: false, // Skip for quick audit
    includeDatabaseTests: false,    // Skip for quick audit
    includeRealTimeMonitoring: false,
    testEnvironment: 'sandbox',
    maxExecutionTime: 15 // 15 minutes max
  };

  const runner = new PaymentSystemAuditRunner(quickConfig);
  return await runner.runCompleteAudit();
};

// Full comprehensive audit function
export const runFullAudit = async (): Promise<AuditSummary> => {
  const fullConfig: AuditConfiguration = {
    includeFrontendTests: true,
    includeBackendSecurity: true,
    includeIntegrationTests: true,
    includePerformanceTests: true,
    includeDatabaseTests: true,
    includeRealTimeMonitoring: true,
    testEnvironment: 'production',
    maxExecutionTime: 120 // 2 hours max
  };

  const runner = new PaymentSystemAuditRunner(fullConfig);
  return await runner.runCompleteAudit();
};