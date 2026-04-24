/**
 * Preservation Property Tests - Vercel Fix (BEFORE implementing fix)
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**
 * 
 * Property 2: Preservation - HTML Content and Functionality Integrity
 * 
 * IMPORTANT: Follow observation-first methodology
 * 
 * These tests observe and capture the current behavior of the UNFIXED code
 * (dashboard_influenciadores_cardapio_web.html) to ensure that when we rename
 * the file to index.html, ALL content and functionality remains intact.
 * 
 * Test Coverage:
 * - Verify all 11 influencer data entries exist in DATA array
 * - Verify all JavaScript functions are defined
 * - Verify all CSS variables are present
 * - Verify Chart.js initialization code is present
 * - Verify all HTML structure elements exist
 * 
 * EXPECTED OUTCOME: Tests PASS (confirms baseline behavior to preserve)
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const HTML_FILE = 'index.html';
const PROJECT_ROOT = __dirname;

console.log('='.repeat(70));
console.log('Preservation Property Tests - Vercel Fix');
console.log('='.repeat(70));
console.log('');
console.log('Testing Property: HTML Content and Functionality Integrity');
console.log('Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7');
console.log('');
console.log('Observation-First Methodology:');
console.log('  1. Observe behavior on UNFIXED code');
console.log('  2. Write tests capturing observed behavior');
console.log('  3. Run tests on UNFIXED code');
console.log('  4. EXPECTED: Tests PASS (confirms baseline to preserve)');
console.log('');

// Read the HTML file
const htmlPath = path.join(PROJECT_ROOT, HTML_FILE);
let htmlContent = '';

try {
  htmlContent = fs.readFileSync(htmlPath, 'utf8');
  console.log(`✓ Successfully loaded: ${HTML_FILE}`);
  console.log(`  File size: ${htmlContent.length} characters`);
  console.log('');
} catch (error) {
  console.error(`❌ ERROR: Could not read file ${HTML_FILE}`);
  console.error(error.message);
  process.exit(2);
}

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  console.log(`Test ${totalTests}: ${testName}`);
  console.log('-'.repeat(70));
  
  try {
    const result = testFn();
    if (result.passed) {
      passedTests++;
      console.log('✅ PASSED');
      if (result.details) {
        console.log(`   ${result.details}`);
      }
    } else {
      failedTests++;
      console.log('❌ FAILED');
      console.log(`   ${result.reason}`);
    }
  } catch (error) {
    failedTests++;
    console.log('❌ FAILED (Exception)');
    console.log(`   ${error.message}`);
  }
  
  console.log('');
}

// Test 1: Verify all 11 influencer data entries exist in DATA array
runTest('All 11 influencer data entries exist in DATA array', () => {
  const dataArrayMatch = htmlContent.match(/const DATA = \[([\s\S]*?)\];/);
  
  if (!dataArrayMatch) {
    return { passed: false, reason: 'DATA array not found in HTML' };
  }
  
  const dataContent = dataArrayMatch[1];
  
  // Expected influencer handles
  const expectedHandles = [
    '@arthurpaek',
    '@euluizfelipealves',
    '@isascherer',
    '@rodrigofaro',
    '@explorecomigo',
    '@rodrigohilbert',
    '@chefjulima',
    '@eduguedesoficial',
    '@virgilioteixeiraa*',
    '@caiocastro',
    '@dudariedel'
  ];
  
  const missingHandles = [];
  for (const handle of expectedHandles) {
    if (!dataContent.includes(`handle:'${handle}'`)) {
      missingHandles.push(handle);
    }
  }
  
  if (missingHandles.length > 0) {
    return { 
      passed: false, 
      reason: `Missing influencer handles: ${missingHandles.join(', ')}` 
    };
  }
  
  // Verify data structure has required fields
  const requiredFields = ['handle', 'seg', 'eng', 'likes', 'coments', 'crescDia', 'nicho', 'veredicto', 'score'];
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!dataContent.includes(`${field}:`)) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    return { 
      passed: false, 
      reason: `Missing data fields: ${missingFields.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All 11 influencers present with complete data structure (${requiredFields.length} fields)` 
  };
});

// Test 2: Verify all JavaScript functions are defined
runTest('All JavaScript functions are defined', () => {
  const expectedFunctions = [
    'buildTable',
    'filterTable',
    'sortTable',
    'buildRanking',
    'showTab'
  ];
  
  const missingFunctions = [];
  for (const funcName of expectedFunctions) {
    const functionPattern = new RegExp(`function\\s+${funcName}\\s*\\(`);
    if (!functionPattern.test(htmlContent)) {
      missingFunctions.push(funcName);
    }
  }
  
  if (missingFunctions.length > 0) {
    return { 
      passed: false, 
      reason: `Missing functions: ${missingFunctions.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedFunctions.length} core functions defined: ${expectedFunctions.join(', ')}` 
  };
});

// Test 3: Verify all CSS variables are present
runTest('All CSS variables are present', () => {
  const expectedCSSVars = [
    '--bg',
    '--surface',
    '--text',
    '--green',
    '--amber',
    '--red',
    '--accent',
    '--accent2'
  ];
  
  const missingVars = [];
  for (const cssVar of expectedCSSVars) {
    if (!htmlContent.includes(`${cssVar}:`)) {
      missingVars.push(cssVar);
    }
  }
  
  if (missingVars.length > 0) {
    return { 
      passed: false, 
      reason: `Missing CSS variables: ${missingVars.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedCSSVars.length} CSS variables present in :root` 
  };
});

// Test 4: Verify Chart.js initialization code is present
runTest('Chart.js initialization code is present', () => {
  const expectedCharts = [
    'chartEngGeral',
    'chartGrowGeral',
    'chartDonut',
    'chartBubble',
    'chartInteracao'
  ];
  
  const missingCharts = [];
  for (const chartId of expectedCharts) {
    const chartPattern = new RegExp(`getElementById\\(['"]${chartId}['"]\\)`);
    if (!chartPattern.test(htmlContent)) {
      missingCharts.push(chartId);
    }
  }
  
  if (missingCharts.length > 0) {
    return { 
      passed: false, 
      reason: `Missing Chart.js initialization for: ${missingCharts.join(', ')}` 
    };
  }
  
  // Verify Chart.js library is loaded
  if (!htmlContent.includes('Chart.js')) {
    return { 
      passed: false, 
      reason: 'Chart.js library not loaded' 
    };
  }
  
  // Verify new Chart() calls exist
  const chartCallCount = (htmlContent.match(/new Chart\(/g) || []).length;
  if (chartCallCount < expectedCharts.length) {
    return { 
      passed: false, 
      reason: `Expected ${expectedCharts.length} Chart instances, found ${chartCallCount}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedCharts.length} charts initialized with Chart.js` 
  };
});

// Test 5: Verify all HTML structure elements exist
runTest('All HTML structure elements exist', () => {
  const expectedElements = [
    { tag: 'header', description: 'Header element' },
    { tag: 'nav class="nav-tabs"', description: 'Navigation tabs' },
    { tag: 'main', description: 'Main content area' },
    { tag: 'footer', description: 'Footer element' },
    { tag: 'div class="tab-panel', description: 'Tab panels' },
    { tag: 'div class="kpi-row"', description: 'KPI cards row' },
    { tag: 'table id="mainTable"', description: 'Main data table' },
    { tag: 'div class="charts-grid"', description: 'Charts grid' },
    { tag: 'div class="ranking-grid" id="rankingGrid"', description: 'Ranking grid' },
    { tag: 'div class="insight-grid"', description: 'Insights grid' }
  ];
  
  const missingElements = [];
  for (const element of expectedElements) {
    if (!htmlContent.includes(`<${element.tag}`)) {
      missingElements.push(element.description);
    }
  }
  
  if (missingElements.length > 0) {
    return { 
      passed: false, 
      reason: `Missing HTML elements: ${missingElements.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedElements.length} structural elements present` 
  };
});

// Test 6: Verify tab panel IDs exist
runTest('All tab panel IDs exist', () => {
  const expectedTabPanels = [
    'tab-visao',
    'tab-tabela',
    'tab-graficos',
    'tab-ranking',
    'tab-insights'
  ];
  
  const missingPanels = [];
  for (const panelId of expectedTabPanels) {
    if (!htmlContent.includes(`id="${panelId}"`)) {
      missingPanels.push(panelId);
    }
  }
  
  if (missingPanels.length > 0) {
    return { 
      passed: false, 
      reason: `Missing tab panels: ${missingPanels.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedTabPanels.length} tab panels present` 
  };
});

// Test 7: Verify onclick handlers for tab navigation
runTest('Tab navigation onclick handlers exist', () => {
  const expectedOnclicks = [
    'showTab(\'visao\')',
    'showTab(\'tabela\')',
    'showTab(\'graficos\')',
    'showTab(\'ranking\')',
    'showTab(\'insights\')'
  ];
  
  const missingHandlers = [];
  for (const onclick of expectedOnclicks) {
    if (!htmlContent.includes(`onclick="${onclick}"`)) {
      missingHandlers.push(onclick);
    }
  }
  
  if (missingHandlers.length > 0) {
    return { 
      passed: false, 
      reason: `Missing onclick handlers: ${missingHandlers.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedOnclicks.length} tab onclick handlers present` 
  };
});

// Test 8: Verify filter buttons and handlers
runTest('Filter buttons and handlers exist', () => {
  const expectedFilters = [
    'filterTable(\'todos\'',
    'filterTable(\'aprovar\'',
    'filterTable(\'testar\'',
    'filterTable(\'descartar\''
  ];
  
  const missingFilters = [];
  for (const filter of expectedFilters) {
    if (!htmlContent.includes(filter)) {
      missingFilters.push(filter);
    }
  }
  
  if (missingFilters.length > 0) {
    return { 
      passed: false, 
      reason: `Missing filter handlers: ${missingFilters.join(', ')}` 
    };
  }
  
  return { 
    passed: true, 
    details: `All ${expectedFilters.length} filter handlers present` 
  };
});

// Test 9: Verify sortTable handlers on table headers
runTest('Table sorting handlers exist', () => {
  const sortTablePattern = /onclick="sortTable\(\d+\)"/g;
  const sortHandlers = htmlContent.match(sortTablePattern);
  
  if (!sortHandlers || sortHandlers.length === 0) {
    return { 
      passed: false, 
      reason: 'No sortTable onclick handlers found' 
    };
  }
  
  // Expected at least 6 sortable columns
  if (sortHandlers.length < 6) {
    return { 
      passed: false, 
      reason: `Expected at least 6 sortable columns, found ${sortHandlers.length}` 
    };
  }
  
  return { 
    passed: true, 
    details: `${sortHandlers.length} sortable table columns with onclick handlers` 
  };
});

// Test 10: Verify Google Fonts are loaded
runTest('Google Fonts (Syne and DM Sans) are loaded', () => {
  if (!htmlContent.includes('fonts.googleapis.com')) {
    return { 
      passed: false, 
      reason: 'Google Fonts link not found' 
    };
  }
  
  if (!htmlContent.includes('Syne')) {
    return { 
      passed: false, 
      reason: 'Syne font not loaded' 
    };
  }
  
  if (!htmlContent.includes('DM+Sans')) {
    return { 
      passed: false, 
      reason: 'DM Sans font not loaded' 
    };
  }
  
  return { 
    passed: true, 
    details: 'Both Syne and DM Sans fonts loaded from Google Fonts' 
  };
});

// Test 11: Verify Chart.js library is loaded from CDN
runTest('Chart.js library is loaded from CDN', () => {
  if (!htmlContent.includes('cdnjs.cloudflare.com/ajax/libs/Chart.js')) {
    return { 
      passed: false, 
      reason: 'Chart.js CDN link not found' 
    };
  }
  
  return { 
    passed: true, 
    details: 'Chart.js 4.4.1 loaded from CDN' 
  };
});

// Test 12: Verify buildTable and buildRanking are called on page load
runTest('buildTable and buildRanking are called on page load', () => {
  if (!htmlContent.includes('buildTable(DATA)')) {
    return { 
      passed: false, 
      reason: 'buildTable(DATA) call not found' 
    };
  }
  
  if (!htmlContent.includes('buildRanking()')) {
    return { 
      passed: false, 
      reason: 'buildRanking() call not found' 
    };
  }
  
  return { 
    passed: true, 
    details: 'Both buildTable(DATA) and buildRanking() are called on page load' 
  };
});

// Print summary
console.log('='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log('');
console.log(`Total Tests:  ${totalTests}`);
console.log(`Passed:       ${passedTests} ✅`);
console.log(`Failed:       ${failedTests} ❌`);
console.log('');

if (failedTests === 0) {
  console.log('✅ ALL PRESERVATION TESTS PASSED');
  console.log('');
  console.log('Baseline Behavior Confirmed:');
  console.log('  ✓ All 11 influencer data entries present');
  console.log('  ✓ All JavaScript functions defined');
  console.log('  ✓ All CSS variables present');
  console.log('  ✓ Chart.js initialization code present');
  console.log('  ✓ All HTML structure elements exist');
  console.log('  ✓ Tab navigation handlers present');
  console.log('  ✓ Filter and sort handlers present');
  console.log('  ✓ Fonts and libraries loaded');
  console.log('');
  console.log('This confirms the baseline behavior to preserve when renaming');
  console.log('the file from dashboard_influenciadores_cardapio_web.html to index.html');
  console.log('');
  console.log('Next Step: Implement fix (rename file) and re-run these tests');
  console.log('to verify all functionality is preserved.');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ SOME PRESERVATION TESTS FAILED');
  console.log('');
  console.log('This indicates that the current HTML file may be missing');
  console.log('expected content or functionality. Review the failed tests above.');
  console.log('');
  process.exit(1);
}
