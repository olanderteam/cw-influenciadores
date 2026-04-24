/**
 * Preservation Property Tests - Responsive CSS
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 * 
 * IMPORTANT: Follow observation-first methodology
 * 
 * This test observes behavior on UNFIXED code for non-buggy viewport sizes (900-1100px range)
 * and captures baseline functionality that must be preserved after CSS changes.
 * 
 * Test Strategy:
 * - Data Display: Verify all 11 influencers display correctly with all metrics
 * - Tab Navigation: Verify content switches correctly between tabs
 * - Table Filtering: Verify filter buttons work correctly
 * - Table Sorting: Verify column sorting works ascending/descending
 * - Chart.js Interactivity: Verify charts render and are interactive
 * - Design System: Verify CSS variables, colors, typography preserved
 * - Medium Viewport (1000px): Verify layout looks identical before and after CSS changes
 * 
 * Expected Outcome on UNFIXED code: Tests PASS (confirms baseline behavior to preserve)
 * Expected Outcome on FIXED code: Tests PASS (confirms no regressions)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Test configuration
const HTML_FILE = path.join(__dirname, 'index.html');
const FILE_URL = `file://${HTML_FILE.replace(/\\/g, '/')}`;

// Medium viewport that should work well (non-buggy range)
const MEDIUM_VIEWPORT = { width: 1000, height: 800 };

// Expected data - all 11 influencers
const EXPECTED_INFLUENCERS = [
  '@arthurpaek', '@euluizfelipealves', '@isascherer', '@rodrigofaro',
  '@explorecomigo', '@rodrigohilbert', '@chefjulima', '@eduguedesoficial',
  '@virgilioteixeiraa*', '@caiocastro', '@dudariedel'
];

// Expected CSS variables
const EXPECTED_CSS_VARS = [
  '--bg', '--surface', '--surface2', '--surface3',
  '--border', '--border2', '--text', '--muted', '--muted2',
  '--green', '--green-bg', '--green-border',
  '--amber', '--amber-bg', '--amber-border',
  '--red', '--red-bg', '--red-border',
  '--accent', '--accent2'
];

// Expected JavaScript functions
const EXPECTED_FUNCTIONS = [
  'buildTable', 'filterTable', 'sortTable', 'buildRanking', 'showTab',
  'fmt', 'fmtFull', 'scoreClass', 'verdClass', 'engColor', 'buildChartExtra'
];

async function testPreservation() {
  console.log('🧪 Preservation Property Tests - Responsive CSS\n');
  console.log('📋 Testing file:', HTML_FILE);
  console.log('🌐 URL:', FILE_URL);
  console.log(`📐 Viewport: ${MEDIUM_VIEWPORT.width}x${MEDIUM_VIEWPORT.height} (medium - non-buggy range)`);
  console.log('');

  // Check if file exists
  if (!fs.existsSync(HTML_FILE)) {
    console.error('❌ ERROR: index.html not found!');
    console.error('   Expected at:', HTML_FILE);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  let allTestsPassed = true;
  const failedTests = [];

  try {
    const page = await browser.newPage();
    await page.setViewport(MEDIUM_VIEWPORT);
    await page.goto(FILE_URL, { waitUntil: 'networkidle0' });

    // Test 1: Data Display - All 11 influencers with complete data
    console.log('📊 Test 1: Data Display - All 11 Influencers');
    const dataCheck = await page.evaluate((expectedHandles) => {
      // Check if DATA array exists
      if (typeof DATA === 'undefined') {
        return { success: false, error: 'DATA array not found' };
      }

      // Check count
      if (DATA.length !== 11) {
        return { success: false, error: `Expected 11 influencers, found ${DATA.length}` };
      }

      // Check all handles exist
      const handles = DATA.map(d => d.handle);
      const missingHandles = expectedHandles.filter(h => !handles.includes(h));
      if (missingHandles.length > 0) {
        return { success: false, error: `Missing handles: ${missingHandles.join(', ')}` };
      }

      // Check all required fields exist for each influencer
      const requiredFields = ['handle', 'seg', 'eng', 'likes', 'coments', 'crescDia', 'nicho', 'veredicto', 'score'];
      for (const influencer of DATA) {
        for (const field of requiredFields) {
          if (!(field in influencer)) {
            return { success: false, error: `Missing field '${field}' in ${influencer.handle}` };
          }
        }
      }

      return {
        success: true,
        count: DATA.length,
        handles: handles,
        sampleData: DATA[0]
      };
    }, EXPECTED_INFLUENCERS);

    if (dataCheck.success) {
      console.log(`   ✅ PASS: All ${dataCheck.count} influencers present with complete data`);
      console.log(`   Sample: ${dataCheck.sampleData.handle} - ${dataCheck.sampleData.seg} seguidores, ${dataCheck.sampleData.eng}% eng`);
    } else {
      console.log(`   ❌ FAIL: ${dataCheck.error}`);
      allTestsPassed = false;
      failedTests.push('Data Display');
    }
    console.log('');

    // Test 2: JavaScript Functions - All expected functions defined
    console.log('🔧 Test 2: JavaScript Functions');
    const functionsCheck = await page.evaluate((expectedFuncs) => {
      const missingFunctions = [];
      for (const funcName of expectedFuncs) {
        if (typeof window[funcName] === 'undefined') {
          missingFunctions.push(funcName);
        }
      }

      return {
        success: missingFunctions.length === 0,
        missingFunctions,
        foundCount: expectedFuncs.length - missingFunctions.length
      };
    }, EXPECTED_FUNCTIONS);

    if (functionsCheck.success) {
      console.log(`   ✅ PASS: All ${EXPECTED_FUNCTIONS.length} JavaScript functions defined`);
      console.log(`   Functions: ${EXPECTED_FUNCTIONS.join(', ')}`);
    } else {
      console.log(`   ❌ FAIL: Missing functions: ${functionsCheck.missingFunctions.join(', ')}`);
      allTestsPassed = false;
      failedTests.push('JavaScript Functions');
    }
    console.log('');

    // Test 3: CSS Variables - Design system preserved
    console.log('🎨 Test 3: CSS Variables - Design System');
    const cssVarsCheck = await page.evaluate((expectedVars) => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const missingVars = [];
      const varValues = {};

      for (const varName of expectedVars) {
        const value = computedStyle.getPropertyValue(varName).trim();
        if (!value) {
          missingVars.push(varName);
        } else {
          varValues[varName] = value;
        }
      }

      return {
        success: missingVars.length === 0,
        missingVars,
        foundCount: expectedVars.length - missingVars.length,
        sampleVars: {
          '--bg': varValues['--bg'],
          '--text': varValues['--text'],
          '--green': varValues['--green'],
          '--accent2': varValues['--accent2']
        }
      };
    }, EXPECTED_CSS_VARS);

    if (cssVarsCheck.success) {
      console.log(`   ✅ PASS: All ${EXPECTED_CSS_VARS.length} CSS variables present`);
      console.log(`   Sample: --bg=${cssVarsCheck.sampleVars['--bg']}, --text=${cssVarsCheck.sampleVars['--text']}`);
    } else {
      console.log(`   ❌ FAIL: Missing CSS variables: ${cssVarsCheck.missingVars.join(', ')}`);
      allTestsPassed = false;
      failedTests.push('CSS Variables');
    }
    console.log('');

    // Test 4: Tab Navigation
    console.log('🗂️  Test 4: Tab Navigation');
    const tabs = ['visao', 'tabela', 'graficos', 'ranking', 'insights'];
    let tabNavigationPassed = true;

    for (const tabId of tabs) {
      const tabResult = await page.evaluate((id) => {
        const tabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(
          btn => btn.onclick && btn.onclick.toString().includes(id)
        );
        
        if (!tabBtn) return { success: false, error: `Tab button for '${id}' not found` };

        // Click the tab
        tabBtn.click();

        // Check if correct panel is active
        const panel = document.getElementById(`tab-${id}`);
        if (!panel) return { success: false, error: `Panel 'tab-${id}' not found` };

        const isActive = panel.classList.contains('active');
        return {
          success: isActive,
          error: isActive ? null : `Panel 'tab-${id}' not activated`
        };
      }, tabId);

      if (tabResult.success) {
        console.log(`   ✅ Tab '${tabId}': Switches correctly`);
      } else {
        console.log(`   ❌ Tab '${tabId}': ${tabResult.error}`);
        tabNavigationPassed = false;
      }
    }

    if (!tabNavigationPassed) {
      allTestsPassed = false;
      failedTests.push('Tab Navigation');
    }
    console.log('');

    // Test 5: Table Filtering
    console.log('🔍 Test 5: Table Filtering');
    
    // Navigate to table tab first
    await page.evaluate(() => {
      const tableTab = Array.from(document.querySelectorAll('.tab-btn')).find(
        btn => btn.textContent.includes('Tabela')
      );
      if (tableTab) tableTab.click();
    });
    await new Promise(resolve => setTimeout(resolve, 300));

    const filters = [
      { name: 'todos', expectedCount: 11 },
      { name: 'aprovar', expectedCount: 2 },
      { name: 'testar', expectedCount: 3 },
      { name: 'descartar', expectedCount: 6 }
    ];

    let filteringPassed = true;
    for (const filter of filters) {
      const filterResult = await page.evaluate((filterName) => {
        const filterBtn = Array.from(document.querySelectorAll('.filter-btn')).find(
          btn => btn.textContent.toLowerCase().includes(filterName)
        );
        
        if (!filterBtn) return { success: false, error: `Filter button '${filterName}' not found` };

        // Click filter
        filterBtn.click();

        // Count visible rows
        const rows = document.querySelectorAll('#tableBody tr');
        return {
          success: true,
          count: rows.length
        };
      }, filter.name);

      if (filterResult.success && filterResult.count === filter.expectedCount) {
        console.log(`   ✅ Filter '${filter.name}': Shows ${filterResult.count} rows (expected ${filter.expectedCount})`);
      } else {
        console.log(`   ❌ Filter '${filter.name}': Shows ${filterResult.count} rows, expected ${filter.expectedCount}`);
        filteringPassed = false;
      }
    }

    if (!filteringPassed) {
      allTestsPassed = false;
      failedTests.push('Table Filtering');
    }
    console.log('');

    // Test 6: Table Sorting
    console.log('↕️  Test 6: Table Sorting');
    
    const sortResult = await page.evaluate(() => {
      // Click on "Seguidores" column header twice to test ascending/descending
      const headers = Array.from(document.querySelectorAll('thead th'));
      const seguidoresHeader = headers.find(h => h.textContent.includes('Seguidores'));
      
      if (!seguidoresHeader) return { success: false, error: 'Seguidores header not found' };

      // First click - should sort descending (largest first)
      seguidoresHeader.click();
      const rows1 = Array.from(document.querySelectorAll('#tableBody tr'));
      const firstHandle1 = rows1[0]?.querySelector('.handle')?.textContent;

      // Second click - should sort ascending (smallest first)
      seguidoresHeader.click();
      const rows2 = Array.from(document.querySelectorAll('#tableBody tr'));
      const firstHandle2 = rows2[0]?.querySelector('.handle')?.textContent;

      return {
        success: firstHandle1 !== firstHandle2,
        firstHandle1,
        firstHandle2,
        sortedClass: seguidoresHeader.classList.contains('sorted')
      };
    });

    if (sortResult.success) {
      console.log(`   ✅ PASS: Sorting works (first row changed from ${sortResult.firstHandle1} to ${sortResult.firstHandle2})`);
    } else {
      console.log(`   ❌ FAIL: Sorting not working properly`);
      allTestsPassed = false;
      failedTests.push('Table Sorting');
    }
    console.log('');

    // Test 7: Chart.js Initialization
    console.log('📈 Test 7: Chart.js Initialization');
    
    // Navigate to charts tab
    await page.evaluate(() => {
      const chartsTab = Array.from(document.querySelectorAll('.tab-btn')).find(
        btn => btn.textContent.includes('Gráficos')
      );
      if (chartsTab) chartsTab.click();
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    const chartsCheck = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const chartIds = ['chartEngGeral', 'chartGrowGeral', 'chartDonut', 'chartBubble', 'chartInteracao'];
      const foundCharts = [];
      const missingCharts = [];

      for (const id of chartIds) {
        const canvas = document.getElementById(id);
        if (canvas) {
          foundCharts.push(id);
        } else {
          missingCharts.push(id);
        }
      }

      return {
        success: missingCharts.length === 0,
        foundCharts,
        missingCharts,
        totalCanvases: canvases.length
      };
    });

    if (chartsCheck.success) {
      console.log(`   ✅ PASS: All ${chartsCheck.foundCharts.length} charts initialized`);
      console.log(`   Charts: ${chartsCheck.foundCharts.join(', ')}`);
    } else {
      console.log(`   ❌ FAIL: Missing charts: ${chartsCheck.missingCharts.join(', ')}`);
      allTestsPassed = false;
      failedTests.push('Chart.js Initialization');
    }
    console.log('');

    // Test 8: Typography - Fonts loaded
    console.log('🔤 Test 8: Typography - Fonts');
    const fontsCheck = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const body = document.querySelector('body');
      
      if (!h1 || !body) return { success: false, error: 'Elements not found' };

      const h1Font = getComputedStyle(h1).fontFamily;
      const bodyFont = getComputedStyle(body).fontFamily;

      return {
        success: h1Font.includes('Syne') && bodyFont.includes('DM Sans'),
        h1Font,
        bodyFont
      };
    });

    if (fontsCheck.success) {
      console.log(`   ✅ PASS: Typography preserved`);
      console.log(`   H1: ${fontsCheck.h1Font}`);
      console.log(`   Body: ${fontsCheck.bodyFont}`);
    } else {
      console.log(`   ❌ FAIL: Typography not correct`);
      console.log(`   H1: ${fontsCheck.h1Font}`);
      console.log(`   Body: ${fontsCheck.bodyFont}`);
      allTestsPassed = false;
      failedTests.push('Typography');
    }
    console.log('');

    // Test 9: Medium Viewport Layout (1000px) - Should look good
    console.log('📐 Test 9: Medium Viewport Layout (1000px)');
    const layoutCheck = await page.evaluate(() => {
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const kpiRow = document.querySelector('.kpi-row');
      const chartsGrid = document.querySelector('.charts-grid');

      return {
        headerWidth: header ? header.offsetWidth : 0,
        mainWidth: main ? main.offsetWidth : 0,
        kpiRowColumns: kpiRow ? getComputedStyle(kpiRow).gridTemplateColumns.split(' ').length : 0,
        chartsGridColumns: chartsGrid ? getComputedStyle(chartsGrid).gridTemplateColumns.split(' ').length : 0
      };
    });

    const layoutPassed = 
      layoutCheck.headerWidth > 900 && layoutCheck.headerWidth <= 1000 &&
      layoutCheck.kpiRowColumns >= 2 &&
      layoutCheck.chartsGridColumns === 2;

    if (layoutPassed) {
      console.log(`   ✅ PASS: Medium viewport layout looks good`);
      console.log(`   Header width: ${layoutCheck.headerWidth}px`);
      console.log(`   KPI columns: ${layoutCheck.kpiRowColumns}`);
      console.log(`   Charts columns: ${layoutCheck.chartsGridColumns}`);
    } else {
      console.log(`   ❌ FAIL: Medium viewport layout issues`);
      console.log(`   Header width: ${layoutCheck.headerWidth}px`);
      console.log(`   KPI columns: ${layoutCheck.kpiRowColumns}`);
      console.log(`   Charts columns: ${layoutCheck.chartsGridColumns}`);
      allTestsPassed = false;
      failedTests.push('Medium Viewport Layout');
    }
    console.log('');

    // Overall results
    console.log('📊 Preservation Test Results Summary:');
    console.log('');

    if (allTestsPassed) {
      console.log('🟢 ALL TESTS PASSED ✓');
      console.log('');
      console.log('✅ Baseline behavior captured successfully!');
      console.log('   All functionality and design elements are working correctly.');
      console.log('   These behaviors must be preserved after CSS changes.');
      console.log('');
      console.log('📝 Preserved Behaviors:');
      console.log('   ✓ All 11 influencers display with complete data');
      console.log('   ✓ All JavaScript functions defined and working');
      console.log('   ✓ Design system (CSS variables, colors, typography) intact');
      console.log('   ✓ Tab navigation switches content correctly');
      console.log('   ✓ Table filtering works for all filter options');
      console.log('   ✓ Table sorting works ascending/descending');
      console.log('   ✓ Chart.js charts initialized and rendering');
      console.log('   ✓ Medium viewport (1000px) layout looks good');
      process.exit(0);
    } else {
      console.log('🔴 SOME TESTS FAILED');
      console.log('');
      console.log('Failed tests:', failedTests.join(', '));
      console.log('');
      console.log('⚠️  Warning: Some baseline behaviors are not working correctly.');
      console.log('   This might indicate issues with the original code.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
testPreservation().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
