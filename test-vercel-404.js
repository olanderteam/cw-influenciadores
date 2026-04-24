/**
 * Bug Condition Exploration Test - Vercel 404 Error
 * 
 * **Validates: Requirements 1.1, 2.1**
 * 
 * Property 1: Bug Condition - Vercel Serve Index File
 * 
 * For any deployment to Vercel where the file `index.html` exists in the root,
 * the platform SHALL serve that file correctly when the route `/` is accessed,
 * returning status 200 and the complete HTML content.
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * 
 * Expected Behavior (encoded in this test):
 * - File named `index.html` should exist in project root
 * - Vercel will serve this file at the root URL `/`
 * - Response should be 200 OK with HTML content
 * 
 * Current Bug Condition:
 * - File is named `dashboard_influenciadores_cardapio_web.html`
 * - Vercel looks for `index.html` but doesn't find it
 * - Results in 404: NOT_FOUND error
 * 
 * EXPECTED OUTCOME: This test FAILS (proving bug exists)
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const EXPECTED_FILE = 'index.html';
const CURRENT_FILE = 'dashboard_influenciadores_cardapio_web.html';
const PROJECT_ROOT = __dirname;

console.log('='.repeat(70));
console.log('Bug Condition Exploration Test - Vercel 404 Error');
console.log('='.repeat(70));
console.log('');
console.log('Testing Property: Vercel Serve Index File');
console.log('Requirements: 1.1, 2.1');
console.log('');

/**
 * Test: Vercel deployment should serve index.html at root URL
 * 
 * This test simulates Vercel's behavior of looking for index.html
 * as the default file to serve at the root path `/`.
 */
function testVercelIndexFileExists() {
  console.log('Test Case: Vercel looks for index.html in project root');
  console.log('-'.repeat(70));
  
  const indexPath = path.join(PROJECT_ROOT, EXPECTED_FILE);
  const currentPath = path.join(PROJECT_ROOT, CURRENT_FILE);
  
  console.log(`Expected file: ${EXPECTED_FILE}`);
  console.log(`Checking path: ${indexPath}`);
  console.log('');
  
  // Check if index.html exists (expected behavior)
  const indexExists = fs.existsSync(indexPath);
  
  console.log(`Result: index.html exists = ${indexExists}`);
  console.log('');
  
  if (!indexExists) {
    // Check if the old file exists
    const currentExists = fs.existsSync(currentPath);
    
    console.log('❌ TEST FAILED (Expected - Bug Confirmed)');
    console.log('');
    console.log('Bug Condition Detected:');
    console.log(`  - File ${EXPECTED_FILE} does NOT exist`);
    console.log(`  - File ${CURRENT_FILE} exists: ${currentExists}`);
    console.log('');
    console.log('Counterexample:');
    console.log('  When Vercel deployment attempts to serve root URL `/`:');
    console.log('    Expected: Serve index.html with status 200');
    console.log('    Actual: Returns 404: NOT_FOUND (file not found)');
    console.log('');
    console.log('Root Cause:');
    console.log('  Vercel platform convention requires index.html as the default');
    console.log('  entry point for static sites. Current file has descriptive name');
    console.log('  "dashboard_influenciadores_cardapio_web.html" which does not');
    console.log('  match Vercel\'s expected naming convention.');
    console.log('');
    console.log('This failure CONFIRMS the bug exists. ✓');
    console.log('');
    
    // Exit with failure code to indicate test failed (bug exists)
    process.exit(1);
  } else {
    console.log('✅ TEST PASSED');
    console.log('');
    console.log('Expected Behavior Confirmed:');
    console.log(`  - File ${EXPECTED_FILE} exists in project root`);
    console.log('  - Vercel will serve this file at root URL `/`');
    console.log('  - Deployment should return status 200 with HTML content');
    console.log('');
    console.log('Bug is FIXED. ✓');
    console.log('');
    
    // Exit with success code
    process.exit(0);
  }
}

// Run the test
try {
  testVercelIndexFileExists();
} catch (error) {
  console.error('❌ TEST ERROR');
  console.error('');
  console.error('Unexpected error during test execution:');
  console.error(error.message);
  console.error('');
  process.exit(2);
}
