#!/bin/bash

# PicForge Testing Framework - Run All Automated Tests
# This script runs all automated tests in sequence and generates a final report
# Usage: bash scripts/run-all-tests.sh

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║        PicForge Automated Testing Suite                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "This will run all automated tests in sequence:"
echo "  1. Environment Validation"
echo "  2. Security Audit"
echo "  3. Rate Limiting Tests"
echo "  4. Email Delivery Tests"
echo "  5. Performance Tests"
echo "  6. Cost Monitoring"
echo ""
echo "Total time: ~15-20 minutes"
echo ""
read -p "Press Enter to start testing..."

# Create results directory
mkdir -p test-results
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT="test-results/test-report-${TIMESTAMP}.txt"

echo "Starting test suite at $(date)" | tee $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT

# Test 1: Environment Validation
echo "" | tee -a $REPORT
echo "Test 1/6: Environment Validation" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
npm run check-env 2>&1 | tee -a $REPORT
ENV_STATUS=${PIPESTATUS[0]}

# Test 2: Security Audit
echo "" | tee -a $REPORT
echo "Test 2/6: Security Audit" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
npm run security-audit 2>&1 | tee -a $REPORT
SECURITY_STATUS=${PIPESTATUS[0]}

# Test 3: Rate Limiting
echo "" | tee -a $REPORT
echo "Test 3/6: Rate Limiting Tests" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
npm run test:rate-limiting 2>&1 | tee -a $REPORT
RATE_STATUS=${PIPESTATUS[0]}

# Test 4: Email Tests
echo "" | tee -a $REPORT
echo "Test 4/6: Email Delivery Tests" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
npm run test:emails 2>&1 | tee -a $REPORT
EMAIL_STATUS=${PIPESTATUS[0]}

# Test 5: Performance Tests
echo "" | tee -a $REPORT
echo "Test 5/6: Performance Tests" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
npm run test:performance 2>&1 | tee -a $REPORT
PERF_STATUS=${PIPESTATUS[0]}

# Test 6: Cost Monitoring
echo "" | tee -a $REPORT
echo "Test 6/6: Cost Monitoring" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
npm run monitor:costs 2>&1 | tee -a $REPORT
COST_STATUS=${PIPESTATUS[0]}

# Generate Final Report
echo "" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
echo "FINAL TEST SUMMARY" | tee -a $REPORT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
echo "" | tee -a $REPORT

TOTAL=0
PASSED=0

# Check each test status
if [ $ENV_STATUS -eq 0 ]; then
  echo "✓ Environment Validation: PASS" | tee -a $REPORT
  ((PASSED++))
else
  echo "✗ Environment Validation: FAIL" | tee -a $REPORT
fi
((TOTAL++))

if [ $SECURITY_STATUS -eq 0 ]; then
  echo "✓ Security Audit: PASS" | tee -a $REPORT
  ((PASSED++))
else
  echo "✗ Security Audit: FAIL" | tee -a $REPORT
fi
((TOTAL++))

if [ $RATE_STATUS -eq 0 ]; then
  echo "✓ Rate Limiting Tests: PASS" | tee -a $REPORT
  ((PASSED++))
else
  echo "✗ Rate Limiting Tests: FAIL" | tee -a $REPORT
fi
((TOTAL++))

if [ $EMAIL_STATUS -eq 0 ]; then
  echo "✓ Email Delivery Tests: PASS" | tee -a $REPORT
  ((PASSED++))
else
  echo "✗ Email Delivery Tests: FAIL" | tee -a $REPORT
fi
((TOTAL++))

if [ $PERF_STATUS -eq 0 ]; then
  echo "✓ Performance Tests: PASS" | tee -a $REPORT
  ((PASSED++))
else
  echo "✗ Performance Tests: FAIL" | tee -a $REPORT
fi
((TOTAL++))

if [ $COST_STATUS -eq 0 ]; then
  echo "✓ Cost Monitoring: PASS" | tee -a $REPORT
  ((PASSED++))
else
  echo "✗ Cost Monitoring: FAIL" | tee -a $REPORT
fi
((TOTAL++))

echo "" | tee -a $REPORT
echo "Total Tests: $TOTAL" | tee -a $REPORT
echo "Passed: $PASSED" | tee -a $REPORT
echo "Failed: $((TOTAL - PASSED))" | tee -a $REPORT
echo "" | tee -a $REPORT

# Final verdict
if [ $PASSED -eq $TOTAL ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
  echo "✓✓✓ ALL AUTOMATED TESTS PASSED ✓✓✓" | tee -a $REPORT
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
  echo "" | tee -a $REPORT
  echo "Next Steps:" | tee -a $REPORT
  echo "1. Complete manual tests:" | tee -a $REPORT
  echo "   - scripts/test-payment-flow.md" | tee -a $REPORT
  echo "   - scripts/test-analytics.md" | tee -a $REPORT
  echo "   - scripts/test-full-user-journey.md" | tee -a $REPORT
  echo "   - docs/BROWSER_TESTING.md" | tee -a $REPORT
  echo "" | tee -a $REPORT
  echo "2. Review docs/LAUNCH_CHECKLIST.md" | tee -a $REPORT
  echo "3. Complete docs/LAUNCH_SIGN_OFF_TEMPLATE.md" | tee -a $REPORT
  echo "4. Make Go/No-Go decision" | tee -a $REPORT
  exit 0
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
  echo "✗✗✗ SOME TESTS FAILED - DO NOT LAUNCH ✗✗✗" | tee -a $REPORT
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a $REPORT
  echo "" | tee -a $REPORT
  echo "Action Required:" | tee -a $REPORT
  echo "1. Review failed tests above" | tee -a $REPORT
  echo "2. Fix critical issues" | tee -a $REPORT
  echo "3. Re-run this script" | tee -a $REPORT
  echo "4. Do NOT launch until all tests pass" | tee -a $REPORT
  exit 1
fi

echo "" | tee -a $REPORT
echo "Full report saved to: $REPORT" | tee -a $REPORT
echo "Completed at $(date)" | tee -a $REPORT
