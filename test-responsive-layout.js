/**
 * Bug Condition Exploration Test - Responsive Layout Issues
 * 
 * **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the EXPECTED BEHAVIOR - it will validate the fix when it passes after implementation
 * 
 * GOAL: Confirm that dashboard does not adapt correctly to different screen sizes
 * 
 * Test Strategy:
 * - Desktop (1920px): Verify container stretches beyond 1600px (bug condition)
 * - Mobile (375px): Verify KPI cards do not reorganize to single column (bug condition)
 * - Mobile (375px): Verify table has horizontal overflow or layout breaks (bug condition)
 * - Mobile (375px): Verify charts do not resize appropriately (bug condition)
 * 
 * Expected Outcome on UNFIXED code: Test FAILS showing elements stretched on desktop and broken on mobile
 * Expected Outcome on FIXED code: Test PASSES showing responsive layout works correctly
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Test configuration
const HTML_FILE = path.join(__dirname, 'index.html');
const FILE_URL = `file://${HTML_FILE.replace(/\\/g, '/')}`;

// Viewport configurations
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080, name: 'Desktop 1920px' },
  mobile: { width: 375, height: 667, name: 'Mobile 375px (iPhone SE)' },
  tablet: { width: 768, height: 1024, name: 'Tablet 768px (iPad)' }
};

// Expected behavior thresholds
const EXPECTED_MAX_CONTAINER_WIDTH = 1600; // Desktop containers should not exceed this
const EXPECTED_MOBILE_KPI_COLUMNS = 2; // Mobile should have max 2 columns for KPI cards
const EXPECTED_MOBILE_TABLE_MIN_WIDTH = 800; // Table should have min-width for smooth scroll

async function testResponsiveLayout() {
  console.log('🧪 Bug Condition Exploration Test - Responsive Layout Issues\n');
  console.log('📋 Testing file:', HTML_FILE);
  console.log('🌐 URL:', FILE_URL);
  console.log('');

  // Check if file exists
  if (!fs.existsSync(HTML_FILE)) {
    console.error('❌ ERROR: index.html not found!');
    console.error('   Expected at:', HTML_FILE);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const results = {
    desktop: { passed: false, issues: [] },
    mobile: { passed: false, issues: [] },
    tablet: { passed: false, issues: [] }
  };

  try {
    // Test 1: Desktop (1920px) - Container max-width constraint
    console.log('🖥️  Test 1: Desktop Layout (1920px)');
    console.log('   Expected: Containers should have max-width ~1400-1600px with auto margins');
    const page1 = await browser.newPage();
    await page1.setViewport(VIEWPORTS.desktop);
    await page1.goto(FILE_URL, { waitUntil: 'networkidle0' });

    // Measure header, main, footer widths
    const containerWidths = await page1.evaluate(() => {
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');
      
      return {
        header: header ? header.offsetWidth : 0,
        main: main ? main.offsetWidth : 0,
        footer: footer ? footer.offsetWidth : 0
      };
    });

    console.log('   Measured widths:');
    console.log(`     - Header: ${containerWidths.header}px`);
    console.log(`     - Main: ${containerWidths.main}px`);
    console.log(`     - Footer: ${containerWidths.footer}px`);

    // Check if containers are constrained
    const desktopPassed = 
      containerWidths.header <= EXPECTED_MAX_CONTAINER_WIDTH &&
      containerWidths.main <= EXPECTED_MAX_CONTAINER_WIDTH &&
      containerWidths.footer <= EXPECTED_MAX_CONTAINER_WIDTH;

    if (!desktopPassed) {
      results.desktop.issues.push(
        `Containers exceed max-width of ${EXPECTED_MAX_CONTAINER_WIDTH}px (header: ${containerWidths.header}px, main: ${containerWidths.main}px, footer: ${containerWidths.footer}px)`
      );
      console.log('   ❌ FAIL: Containers stretch beyond expected max-width');
    } else {
      console.log('   ✅ PASS: Containers are properly constrained');
    }
    results.desktop.passed = desktopPassed;

    await page1.close();
    console.log('');

    // Test 2: Mobile (375px) - KPI cards layout
    console.log('📱 Test 2: Mobile KPI Cards (375px)');
    console.log('   Expected: KPI cards should reorganize to single column or max 2 columns');
    const page2 = await browser.newPage();
    await page2.setViewport(VIEWPORTS.mobile);
    await page2.goto(FILE_URL, { waitUntil: 'networkidle0' });

    const kpiLayout = await page2.evaluate(() => {
      const kpiRow = document.querySelector('.kpi-row');
      if (!kpiRow) return { exists: false };

      const cards = kpiRow.querySelectorAll('.kpi-card');
      const rowWidth = kpiRow.offsetWidth;
      const firstCardWidth = cards[0] ? cards[0].offsetWidth : 0;
      
      // Calculate how many cards fit in one row
      const cardsPerRow = Math.floor(rowWidth / firstCardWidth);
      
      // Get computed grid template columns
      const gridColumns = window.getComputedStyle(kpiRow).gridTemplateColumns;
      const columnCount = gridColumns.split(' ').length;

      return {
        exists: true,
        totalCards: cards.length,
        cardsPerRow,
        columnCount,
        rowWidth,
        firstCardWidth,
        gridColumns
      };
    });

    console.log('   KPI Row Layout:');
    console.log(`     - Total cards: ${kpiLayout.totalCards}`);
    console.log(`     - Cards per row: ${kpiLayout.cardsPerRow}`);
    console.log(`     - Grid columns: ${kpiLayout.columnCount}`);
    console.log(`     - Grid template: ${kpiLayout.gridColumns}`);

    const kpiPassed = kpiLayout.cardsPerRow <= EXPECTED_MOBILE_KPI_COLUMNS;

    if (!kpiPassed) {
      results.mobile.issues.push(
        `KPI cards show ${kpiLayout.cardsPerRow} per row, expected max ${EXPECTED_MOBILE_KPI_COLUMNS}`
      );
      console.log(`   ❌ FAIL: Too many cards per row (${kpiLayout.cardsPerRow} > ${EXPECTED_MOBILE_KPI_COLUMNS})`);
    } else {
      console.log('   ✅ PASS: KPI cards properly reorganized');
    }

    console.log('');

    // Test 3: Mobile (375px) - Table horizontal scroll
    console.log('📱 Test 3: Mobile Table Layout (375px)');
    console.log('   Expected: Table should have smooth horizontal scroll with min-width');
    
    // Navigate to table tab
    await page2.evaluate(() => {
      const tableTab = Array.from(document.querySelectorAll('.tab-btn')).find(
        btn => btn.textContent.includes('Tabela')
      );
      if (tableTab) tableTab.click();
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    const tableLayout = await page2.evaluate(() => {
      const tableWrap = document.querySelector('.table-wrap');
      const table = document.querySelector('table');
      
      if (!tableWrap || !table) return { exists: false };

      const wrapWidth = tableWrap.offsetWidth;
      const tableWidth = table.offsetWidth;
      const hasOverflow = tableWidth > wrapWidth;
      
      // Check if table has min-width set
      const tableStyle = window.getComputedStyle(table);
      const minWidth = tableStyle.minWidth;

      return {
        exists: true,
        wrapWidth,
        tableWidth,
        hasOverflow,
        minWidth,
        overflowX: window.getComputedStyle(tableWrap).overflowX
      };
    });

    console.log('   Table Layout:');
    console.log(`     - Wrapper width: ${tableLayout.wrapWidth}px`);
    console.log(`     - Table width: ${tableLayout.tableWidth}px`);
    console.log(`     - Has overflow: ${tableLayout.hasOverflow}`);
    console.log(`     - Min-width: ${tableLayout.minWidth}`);
    console.log(`     - Overflow-X: ${tableLayout.overflowX}`);

    const tablePassed = 
      tableLayout.overflowX === 'auto' &&
      tableLayout.hasOverflow &&
      parseInt(tableLayout.minWidth) >= EXPECTED_MOBILE_TABLE_MIN_WIDTH;

    if (!tablePassed) {
      results.mobile.issues.push(
        `Table does not have proper scroll strategy (overflow: ${tableLayout.overflowX}, min-width: ${tableLayout.minWidth})`
      );
      console.log('   ❌ FAIL: Table does not have proper horizontal scroll strategy');
    } else {
      console.log('   ✅ PASS: Table has smooth horizontal scroll');
    }

    console.log('');

    // Test 4: Mobile (375px) - Charts responsiveness
    console.log('📱 Test 4: Mobile Charts Layout (375px)');
    console.log('   Expected: Charts should resize appropriately and stack vertically');
    
    // Navigate to charts tab
    await page2.evaluate(() => {
      const chartsTab = Array.from(document.querySelectorAll('.tab-btn')).find(
        btn => btn.textContent.includes('Gráficos')
      );
      if (chartsTab) chartsTab.click();
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    const chartsLayout = await page2.evaluate(() => {
      const chartsGrid = document.querySelector('.charts-grid');
      if (!chartsGrid) return { exists: false };

      const gridColumns = window.getComputedStyle(chartsGrid).gridTemplateColumns;
      const columnCount = gridColumns.split(' ').length;
      
      const chartCards = chartsGrid.querySelectorAll('.chart-card');
      const firstCardWidth = chartCards[0] ? chartCards[0].offsetWidth : 0;
      const gridWidth = chartsGrid.offsetWidth;

      return {
        exists: true,
        columnCount,
        gridColumns,
        totalCharts: chartCards.length,
        firstCardWidth,
        gridWidth
      };
    });

    console.log('   Charts Grid Layout:');
    console.log(`     - Grid columns: ${chartsLayout.columnCount}`);
    console.log(`     - Grid template: ${chartsLayout.gridColumns}`);
    console.log(`     - Total charts: ${chartsLayout.totalCharts}`);
    console.log(`     - First card width: ${chartsLayout.firstCardWidth}px`);

    const chartsPassed = chartsLayout.columnCount === 1;

    if (!chartsPassed) {
      results.mobile.issues.push(
        `Charts grid shows ${chartsLayout.columnCount} columns, expected 1 column for mobile`
      );
      console.log(`   ❌ FAIL: Charts not stacking vertically (${chartsLayout.columnCount} columns)`);
    } else {
      console.log('   ✅ PASS: Charts properly stacked in single column');
    }

    await page2.close();
    console.log('');

    // Overall results
    console.log('📊 Test Results Summary:');
    console.log('');
    console.log(`Desktop (1920px): ${results.desktop.passed ? '✅ PASS' : '❌ FAIL'}`);
    if (results.desktop.issues.length > 0) {
      results.desktop.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    console.log('');
    
    const mobilePassed = kpiPassed && tablePassed && chartsPassed;
    results.mobile.passed = mobilePassed;
    console.log(`Mobile (375px): ${mobilePassed ? '✅ PASS' : '❌ FAIL'}`);
    if (results.mobile.issues.length > 0) {
      results.mobile.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    console.log('');

    const allPassed = results.desktop.passed && results.mobile.passed;

    if (!allPassed) {
      console.log('🔴 EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS ✓');
      console.log('   This confirms the bug exists!');
      console.log('');
      console.log('📝 Documented Counterexamples:');
      if (!results.desktop.passed) {
        console.log('   - Desktop 1920px: Containers stretch beyond max-width constraint');
      }
      if (!kpiPassed) {
        console.log('   - Mobile 375px: KPI cards do not reorganize to single/double column');
      }
      if (!tablePassed) {
        console.log('   - Mobile 375px: Table does not have proper horizontal scroll strategy');
      }
      if (!chartsPassed) {
        console.log('   - Mobile 375px: Charts do not stack vertically');
      }
      console.log('');
      console.log('✅ Bug condition exploration test completed successfully!');
      console.log('   The test correctly detected the responsive layout bugs.');
      process.exit(0); // Exit with success - test is SUPPOSED to fail on unfixed code
    } else {
      console.log('🟢 UNEXPECTED OUTCOME: Test PASSES');
      console.log('   This suggests the responsive layout is already fixed!');
      console.log('   Either:');
      console.log('   1. The code already has responsive CSS implemented');
      console.log('   2. The test needs adjustment to detect the bug');
      console.log('   3. The bug description might be incorrect');
      process.exit(1); // Exit with error - test should fail on unfixed code
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
testResponsiveLayout().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
