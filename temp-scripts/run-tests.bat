@echo off
setlocal enabledelayedexpansion

echo Starting comprehensive test suite...
echo Creating test results directory...

if not exist "test-results" mkdir test-results

:: Run Jest unit tests
echo.
echo Running unit tests...
call npm test -- --json --outputFile=test-results/jest-results.json
if !errorlevel! neq 0 (
    echo Unit tests failed. Check test-results/jest-results.json for details.
    set "test_failed=1"
) else (
    echo Unit tests passed successfully.
)

:: Run Playwright e2e tests
echo.
echo Running end-to-end tests...
call npm run test:e2e
if !errorlevel! neq 0 (
    echo E2E tests failed. Check test-results/playwright-report for details.
    set "test_failed=1"
) else (
    echo E2E tests passed successfully.
)

:: Generate test report summary
echo.
echo Generating test report summary...
echo Test Summary > test-results/summary.txt
echo ============= >> test-results/summary.txt
echo. >> test-results/summary.txt
echo Test Run Date: %date% %time% >> test-results/summary.txt
echo. >> test-results/summary.txt

:: Add Jest results to summary
echo Unit Test Results: >> test-results/summary.txt
node -e "const results = require('./test-results/jest-results.json'); console.log(`Total: ${results.numTotalTests}\nPassed: ${results.numPassedTests}\nFailed: ${results.numFailedTests}`)" >> test-results/summary.txt
echo. >> test-results/summary.txt

:: Add Playwright results to summary
echo E2E Test Results: >> test-results/summary.txt
if exist "test-results/playwright-report/results.json" (
    node -e "const results = require('./test-results/playwright-report/results.json'); const stats = results.suites.reduce((acc, suite) => { acc.total += suite.specs.length; acc.passed += suite.specs.filter(s => s.ok).length; acc.failed += suite.specs.filter(s => !s.ok).length; return acc; }, {total: 0, passed: 0, failed: 0}); console.log(`Total: ${stats.total}\nPassed: ${stats.passed}\nFailed: ${stats.failed}`)" >> test-results/summary.txt
)

:: Display summary
echo.
echo Test Summary:
type test-results\summary.txt

:: Check if any tests failed
if defined test_failed (
    echo.
    echo Some tests failed. Please check the test results for details.
    exit /b 1
) else (
    echo.
    echo All tests passed successfully!
)

endlocal
