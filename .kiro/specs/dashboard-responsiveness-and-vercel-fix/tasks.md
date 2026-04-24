# Implementation Plan

## Bug 1: Erro 404 na Vercel

- [x] 1. Write bug condition exploration test - Vercel 404 Error
  - **Property 1: Bug Condition** - Vercel Serve Index File
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Confirm that deploying to Vercel with file named `dashboard_influenciadores_cardapio_web.html` results in 404 error
  - **Scoped PBT Approach**: Test the specific case where Vercel deployment looks for `index.html` but finds `dashboard_influenciadores_cardapio_web.html`
  - Test implementation: Deploy current project to Vercel, access root URL `/`, verify response is 404: NOT_FOUND
  - The test assertions should match: deployment returns status 200 and serves HTML content correctly (this is the expected behavior after fix)
  - Run test on UNFIXED code (with file named `dashboard_influenciadores_cardapio_web.html`)
  - **EXPECTED OUTCOME**: Test FAILS with 404 error (this is correct - it proves the bug exists)
  - Document counterexample: "Accessing Vercel deployment root URL returns 404: NOT_FOUND instead of serving dashboard HTML"
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 2.1_

- [x] 2. Write preservation property tests - Vercel Fix (BEFORE implementing fix)
  - **Property 2: Preservation** - HTML Content and Functionality Integrity
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code: all HTML content, JavaScript, CSS, and data are intact in `dashboard_influenciadores_cardapio_web.html`
  - Write tests capturing observed behavior:
    - Verify all 11 influencer data entries exist in DATA array
    - Verify all JavaScript functions are defined (buildTable, filterTable, sortTable, buildRanking, showTab)
    - Verify all CSS variables are present (--bg, --surface, --text, --green, --amber, --red, --accent, --accent2)
    - Verify Chart.js initialization code is present
    - Verify all HTML structure elements exist (header, nav-tabs, tab-panels, footer)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3. Fix Vercel 404 error by renaming file to index.html

  - [x] 3.1 Rename HTML file from dashboard_influenciadores_cardapio_web.html to index.html
    - Use file system rename/move operation
    - Preserve all file content without modifications
    - Verify file exists at new location: `index.html`
    - Verify old file no longer exists: `dashboard_influenciadores_cardapio_web.html`
    - _Bug_Condition: isBugCondition_404(deployment) where deployment.platform == 'Vercel' AND NOT fileExists('index.html') AND fileExists('dashboard_influenciadores_cardapio_web.html')_
    - _Expected_Behavior: Vercel SHALL serve index.html correctly when route `/` is accessed, returning status 200 and HTML content_
    - _Preservation: All HTML content, JavaScript inline, CSS styles, DATA array, and functionality SHALL remain completely unchanged_
    - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Vercel Serve Index File
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - Deploy to Vercel with renamed file `index.html`
    - Access root URL `/`
    - **EXPECTED OUTCOME**: Test PASSES with status 200 and HTML content served (confirms bug is fixed)
    - _Requirements: 2.1_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - HTML Content and Functionality Integrity
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run all preservation tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions - all content and functionality preserved)
    - Verify: DATA array, JavaScript functions, CSS variables, Chart.js code, HTML structure all unchanged

- [x] 4. Checkpoint - Verify Vercel deployment serves index.html correctly
  - Deploy to Vercel
  - Access root URL and verify dashboard loads
  - Verify no 404 errors
  - Ask user if questions arise

## Bug 2: Layout não responsivo

- [x] 5. Write bug condition exploration test - Responsive Layout Issues
  - **Property 1: Bug Condition** - Responsive Layout Desktop and Mobile
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Confirm that dashboard does not adapt correctly to different screen sizes
  - **Scoped PBT Approach**: Test specific viewport widths where bugs manifest
  - Test implementation details:
    - **Desktop (1920px)**: Open dashboard, measure container width, verify it stretches beyond 1600px (bug condition)
    - **Mobile (375px)**: Open dashboard in DevTools iPhone SE emulation, verify KPI cards do not reorganize to single column (bug condition)
    - **Mobile (375px)**: Navigate to table tab, verify horizontal overflow or layout breaks (bug condition)
    - **Mobile (375px)**: Navigate to charts tab, verify charts do not resize appropriately (bug condition)
  - The test assertions should match Expected Behavior Properties:
    - Desktop: containers SHALL have max-width ~1400-1600px with auto margins
    - Mobile: KPI cards SHALL reorganize to single column or adaptive grid
    - Mobile: tables SHALL have smooth horizontal scroll
    - Mobile: charts SHALL resize responsively
  - Run test on UNFIXED code (without media queries)
  - **EXPECTED OUTCOME**: Test FAILS showing elements stretched on desktop and broken on mobile (this is correct - it proves the bug exists)
  - Document counterexamples:
    - "Desktop 1920px: header stretches to full 1920px instead of max 1600px"
    - "Mobile 375px: KPI cards remain in multi-column grid causing overflow"
    - "Mobile 375px: table requires excessive horizontal scroll"
  - Mark task complete when test is written, run, and failures are documented
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5_

- [x] 6. Write preservation property tests - Responsive CSS (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Functionality and Medium Viewport Layout
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy viewport sizes (900-1100px range)
  - Write property-based tests capturing observed behavior patterns:
    - **Data Display**: Verify all 11 influencers display correctly with all metrics (seguidores, engajamento, likes, comentários, crescimento, nicho, veredicto, score)
    - **Tab Navigation**: Click each tab (Visão geral, Tabela, Gráficos, Ranking, Insights), verify content switches correctly
    - **Table Filtering**: Click filter buttons (Todos, Aprovar, Testar, Descartar), verify table filters correctly
    - **Table Sorting**: Click column headers, verify sorting works ascending/descending
    - **Chart.js Interactivity**: Hover over charts, verify tooltips appear with correct data
    - **Design System**: Verify CSS variables unchanged, colors correct, typography (Syne/DM Sans) preserved
    - **Medium Viewport (1000px)**: Verify layout looks identical before and after CSS changes
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 7. Implement responsive CSS fixes

  - [x] 7.1 Add max-width constraints for desktop (>1200px)
    - Add media query: `@media(min-width: 1200px)`
    - Apply to header, main, footer: `max-width: 1600px; margin-left: auto; margin-right: auto;`
    - Test in browser at 1920px width, verify containers are centered with max-width
    - _Bug_Condition: isBugCondition_Responsive(viewport) where viewport.width > 1200 AND elementsAreStretched()_
    - _Expected_Behavior: Containers SHALL have max-width ~1400-1600px with auto margins_
    - _Preservation: All JavaScript, data, Chart.js, design system SHALL remain unchanged_
    - _Requirements: 1.2, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 7.2 Add tablet breakpoint (600px-900px)
    - Add media query: `@media(max-width: 900px)`
    - Adjust .kpi-row: `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));`
    - Adjust .ranking-grid and .insight-grid: `grid-template-columns: 1fr;`
    - Test in browser at 768px width (iPad), verify layout adapts
    - _Requirements: 2.3, 3.5_

  - [x] 7.3 Enhance mobile breakpoint (max-width: 600px)
    - Modify existing `@media(max-width: 600px)` rule
    - Add .kpi-row: `grid-template-columns: 1fr; gap: 10px;` (force single column)
    - Add .header-top: `flex-direction: column; align-items: flex-start;`
    - Add h1: `font-size: 1.8rem;`
    - Add .nav-tabs: `overflow-x: auto; -webkit-overflow-scrolling: touch;`
    - Add .tab-btn: `padding: 0.75rem 1.2rem; font-size: 12px;`
    - Add table: `font-size: 11px; min-width: 800px;` (enable smooth horizontal scroll)
    - Add td, thead th: `padding: 10px 12px;`
    - Add .rank-card, .insight-card: `padding: 1rem;`
    - Test in DevTools iPhone SE (375px), verify all elements adapt
    - _Bug_Condition: isBugCondition_Responsive(viewport) where viewport.width < 768 AND componentsOverflow()_
    - _Expected_Behavior: All components SHALL adapt responsively with single column grids, reduced padding, smooth scroll_
    - _Requirements: 1.3, 1.4, 1.5, 2.3, 2.4, 2.5_

  - [x] 7.4 Add mobile small breakpoint (<400px)
    - Add media query: `@media(max-width: 400px)`
    - Add .kpi-card: `padding: 1rem 1.2rem;`
    - Add .kpi-val: `font-size: 1.6rem;`
    - Add .filter-bar: `gap: 6px;`
    - Add .filter-btn: `padding: 5px 12px; font-size: 11px;`
    - Test in DevTools at 375px and 360px, verify no overflow
    - _Requirements: 2.3, 2.5_

  - [x] 7.5 Fix charts-grid breakpoint alignment
    - Modify existing charts-grid media query from 700px to 768px
    - Change to: `@media(max-width: 768px) { .charts-grid { grid-template-columns: 1fr; } }`
    - Test at 768px, verify charts stack vertically
    - _Requirements: 2.3_

  - [x] 7.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Responsive Layout Desktop and Mobile
    - **IMPORTANT**: Re-run the SAME test from task 5 - do NOT write a new test
    - The test from task 5 encodes the expected behavior
    - Test at multiple viewports:
      - Desktop 1920px: verify max-width constraint applied
      - Mobile 375px: verify KPI cards in single column
      - Mobile 375px: verify table has smooth scroll
      - Mobile 375px: verify charts resize appropriately
    - **EXPECTED OUTCOME**: Test PASSES (confirms responsive layout is fixed)
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

  - [x] 7.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Functionality and Medium Viewport Layout
    - **IMPORTANT**: Re-run the SAME tests from task 6 - do NOT write new tests
    - Run all preservation tests from step 6
    - Test data display, tab navigation, filtering, sorting, Chart.js interactivity
    - Test medium viewport (1000px) - layout should be identical to unfixed version
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify: all 11 influencers display, tabs work, filters work, sorting works, charts interactive, design system preserved

- [x] 8. Checkpoint - Ensure all tests pass
  - Test dashboard at multiple viewport sizes: 375px, 600px, 768px, 900px, 1200px, 1920px
  - Verify responsive layout works correctly at all breakpoints
  - Verify all JavaScript functionality works (tabs, filters, sorting, charts)
  - Verify all data displays correctly
  - Verify design system preserved (colors, typography, spacing)
  - Open browser console, verify no JavaScript errors
  - Test on real devices if possible (phone, tablet, desktop)
  - Ensure all tests pass, ask the user if questions arise
