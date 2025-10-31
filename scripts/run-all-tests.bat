@echo off
REM PicForge Testing Framework - Run All Automated Tests (Windows)
REM Usage: scripts\run-all-tests.bat

echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║        PicForge Automated Testing Suite                  ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo This will run all automated tests in sequence:
echo   1. Environment Validation
echo   2. Security Audit
echo   3. Rate Limiting Tests
echo   4. Email Delivery Tests
echo   5. Performance Tests
echo   6. Cost Monitoring
echo.
echo Total time: ~15-20 minutes
echo.
pause

REM Create results directory
if not exist test-results mkdir test-results

REM Generate timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%
set REPORT=test-results\test-report-%TIMESTAMP%.txt

echo Starting test suite at %date% %time% > %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%

REM Initialize counters
set TOTAL=0
set PASSED=0

REM Test 1: Environment Validation
echo.
echo Test 1/6: Environment Validation
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo. >> %REPORT%
echo Test 1/6: Environment Validation >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
call npm run check-env >> %REPORT% 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [32m✓ PASS[0m: Environment Validation
  set /a PASSED+=1
) else (
  echo [31m✗ FAIL[0m: Environment Validation
)
set /a TOTAL+=1

REM Test 2: Security Audit
echo.
echo Test 2/6: Security Audit
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo. >> %REPORT%
echo Test 2/6: Security Audit >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
call npm run security-audit >> %REPORT% 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [32m✓ PASS[0m: Security Audit
  set /a PASSED+=1
) else (
  echo [31m✗ FAIL[0m: Security Audit
)
set /a TOTAL+=1

REM Test 3: Rate Limiting
echo.
echo Test 3/6: Rate Limiting Tests
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo. >> %REPORT%
echo Test 3/6: Rate Limiting Tests >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
call npm run test:rate-limiting >> %REPORT% 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [32m✓ PASS[0m: Rate Limiting Tests
  set /a PASSED+=1
) else (
  echo [31m✗ FAIL[0m: Rate Limiting Tests
)
set /a TOTAL+=1

REM Test 4: Email Tests
echo.
echo Test 4/6: Email Delivery Tests
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo. >> %REPORT%
echo Test 4/6: Email Delivery Tests >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
call npm run test:emails >> %REPORT% 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [32m✓ PASS[0m: Email Delivery Tests
  set /a PASSED+=1
) else (
  echo [31m✗ FAIL[0m: Email Delivery Tests
)
set /a TOTAL+=1

REM Test 5: Performance Tests
echo.
echo Test 5/6: Performance Tests
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo. >> %REPORT%
echo Test 5/6: Performance Tests >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
call npm run test:performance >> %REPORT% 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [32m✓ PASS[0m: Performance Tests
  set /a PASSED+=1
) else (
  echo [31m✗ FAIL[0m: Performance Tests
)
set /a TOTAL+=1

REM Test 6: Cost Monitoring
echo.
echo Test 6/6: Cost Monitoring
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo. >> %REPORT%
echo Test 6/6: Cost Monitoring >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
call npm run monitor:costs >> %REPORT% 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [32m✓ PASS[0m: Cost Monitoring
  set /a PASSED+=1
) else (
  echo [31m✗ FAIL[0m: Cost Monitoring
)
set /a TOTAL+=1

REM Generate Final Report
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo FINAL TEST SUMMARY
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo. >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
echo FINAL TEST SUMMARY >> %REPORT%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
echo. >> %REPORT%

set /a FAILED=%TOTAL%-%PASSED%

echo Total Tests: %TOTAL%
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.
echo Total Tests: %TOTAL% >> %REPORT%
echo Passed: %PASSED% >> %REPORT%
echo Failed: %FAILED% >> %REPORT%
echo. >> %REPORT%

REM Final verdict
if %PASSED% EQU %TOTAL% (
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  echo [32m✓✓✓ ALL AUTOMATED TESTS PASSED ✓✓✓[0m
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  echo.
  echo Next Steps:
  echo 1. Complete manual tests:
  echo    - scripts\test-payment-flow.md
  echo    - scripts\test-analytics.md
  echo    - scripts\test-full-user-journey.md
  echo    - docs\BROWSER_TESTING.md
  echo.
  echo 2. Review docs\LAUNCH_CHECKLIST.md
  echo 3. Complete docs\LAUNCH_SIGN_OFF_TEMPLATE.md
  echo 4. Make Go/No-Go decision
  echo.
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
  echo ✓✓✓ ALL AUTOMATED TESTS PASSED ✓✓✓ >> %REPORT%
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
) else (
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  echo [31m✗✗✗ SOME TESTS FAILED - DO NOT LAUNCH ✗✗✗[0m
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  echo.
  echo Action Required:
  echo 1. Review failed tests above
  echo 2. Fix critical issues
  echo 3. Re-run this script
  echo 4. Do NOT launch until all tests pass
  echo.
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
  echo ✗✗✗ SOME TESTS FAILED - DO NOT LAUNCH ✗✗✗ >> %REPORT%
  echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ >> %REPORT%
)

echo.
echo Full report saved to: %REPORT%
echo Completed at %date% %time%
echo. >> %REPORT%
echo Completed at %date% %time% >> %REPORT%

pause
