# Dashboard Responsiveness and Vercel Fix - Bugfix Design

## Overview

Este documento especifica a solução técnica para dois bugs críticos no dashboard de influenciadores da Cardápio Web:

1. **Erro 404 na Vercel**: O deploy falha porque a Vercel procura por `index.html` como página inicial, mas o arquivo se chama `dashboard_influenciadores_cardapio_web.html`
2. **Layout não responsivo**: O dashboard não se adapta corretamente a diferentes tamanhos de tela, causando elementos esticados no desktop e quebrados no mobile

A estratégia de correção é:
- **Bug 1**: Renomear o arquivo HTML para `index.html` (operação de arquivo simples)
- **Bug 2**: Adicionar media queries CSS e ajustar containers para responsividade (modificação de estilos)

Ambas as correções são não-invasivas e preservam toda a funcionalidade JavaScript, dados e interatividade existentes.

## Glossary

- **Bug_Condition_404 (C1)**: A condição que causa o erro 404 - quando a Vercel tenta servir a página inicial mas não encontra `index.html`
- **Bug_Condition_Responsive (C2)**: A condição que causa problemas de layout - quando o dashboard é acessado em telas fora do range ideal (~900-1100px)
- **Property_404 (P1)**: O comportamento desejado - a Vercel deve servir o arquivo HTML corretamente como página inicial
- **Property_Responsive (P2)**: O comportamento desejado - todos os componentes devem se adaptar responsivamente a qualquer largura de tela
- **Preservation**: Funcionalidades JavaScript, dados dos 11 influenciadores, gráficos Chart.js, sistema de abas, filtros e ordenação que devem permanecer inalterados
- **Vercel**: Plataforma de hosting que serve arquivos estáticos e procura por `index.html` como página padrão
- **Media Query**: Regra CSS que aplica estilos condicionalmente baseado em características do dispositivo (largura da tela)
- **Viewport**: Área visível da página web no dispositivo do usuário
- **Breakpoint**: Largura específica da tela onde o layout muda (ex: 768px para mobile, 1200px para desktop)

## Bug Details

### Bug Condition 1: Erro 404 na Vercel

O bug manifesta quando o projeto é deployado na Vercel. A plataforma procura por `index.html` na raiz do projeto como página inicial padrão, mas o arquivo atual se chama `dashboard_influenciadores_cardapio_web.html`, causando erro 404: NOT_FOUND.

**Formal Specification:**
```
FUNCTION isBugCondition_404(deployment)
  INPUT: deployment of type VercelDeployment
  OUTPUT: boolean
  
  RETURN deployment.platform == 'Vercel'
         AND NOT fileExists('index.html')
         AND fileExists('dashboard_influenciadores_cardapio_web.html')
         AND deployment.requestPath == '/'
END FUNCTION
```

### Bug Condition 2: Layout não responsivo

O bug manifesta quando o dashboard é acessado em telas com largura diferente do range ideal (~900-1100px). Em telas grandes (>1200px), os elementos ficam excessivamente esticados. Em telas pequenas (<768px), tabelas, gráficos e cards não se adaptam, causando overflow horizontal e quebra de layout.

**Formal Specification:**
```
FUNCTION isBugCondition_Responsive(viewport)
  INPUT: viewport of type ViewportDimensions
  OUTPUT: boolean
  
  RETURN (viewport.width > 1200 AND elementsAreStretched())
         OR (viewport.width < 768 AND componentsOverflow())
         OR (viewport.width < 768 AND cardsNotAdapting())
END FUNCTION
```

### Examples

**Bug 1 - Erro 404:**
- **Cenário**: Deploy na Vercel com arquivo `dashboard_influenciadores_cardapio_web.html`
- **Comportamento atual**: Erro 404: NOT_FOUND ao acessar a URL raiz
- **Comportamento esperado**: Dashboard carrega normalmente na URL raiz

**Bug 2 - Desktop (1920px):**
- **Cenário**: Usuário acessa em monitor widescreen
- **Comportamento atual**: Elementos esticam até 1920px de largura, espaçamento inadequado
- **Comportamento esperado**: Container limitado a ~1400px com margens automáticas, espaçamento proporcional

**Bug 2 - Mobile (375px):**
- **Cenário**: Usuário acessa em iPhone
- **Comportamento atual**: Tabela comparativa requer scroll horizontal excessivo, KPI cards não reorganizam, gráficos ficam comprimidos
- **Comportamento esperado**: Tabela com scroll suave ou colunas adaptadas, KPI cards em coluna única, gráficos redimensionados

**Bug 2 - Tablet (768px):**
- **Cenário**: Usuário acessa em iPad
- **Comportamento atual**: Layout parcialmente quebrado, alguns elementos não se adaptam
- **Comportamento esperado**: Layout intermediário com grid de 2 colunas para cards, tabela adaptada

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Todos os dados dos 11 influenciadores devem continuar sendo exibidos corretamente
- Gráficos Chart.js devem continuar funcionando com tooltips, animações e responsividade nativa
- Sistema de abas (Visão geral, Tabela, Gráficos, Ranking, Insights) deve continuar alternando conteúdo corretamente
- Filtros na tabela comparativa (Todos, Aprovar, Testar, Descartar) devem continuar funcionando
- Ordenação de colunas na tabela deve continuar funcionando
- Design system (cores CSS variables, tipografia Syne/DM Sans, espaçamentos) deve ser preservado
- Todo o JavaScript inline deve continuar funcionando sem modificações

**Scope:**
Todas as funcionalidades que NÃO envolvem renderização visual em diferentes tamanhos de tela devem ser completamente inalteradas. Isso inclui:
- Lógica JavaScript de manipulação de dados (buildTable, filterTable, sortTable, buildRanking)
- Inicialização e configuração dos gráficos Chart.js
- Estrutura HTML e hierarquia de elementos
- Sistema de variáveis CSS (--bg, --surface, --text, etc.)
- Event handlers (onclick, showTab)

## Hypothesized Root Cause

### Bug 1: Erro 404 na Vercel

**Root Cause Confirmado:**
A Vercel, por convenção de plataformas de hosting estático, procura por `index.html` na raiz do projeto como página inicial padrão. O arquivo atual tem nome descritivo `dashboard_influenciadores_cardapio_web.html`, que é bom para desenvolvimento mas não segue a convenção de naming para deploy.

**Evidência:**
- Documentação Vercel especifica que `index.html` é o arquivo padrão servido na rota `/`
- Não há configuração `vercel.json` customizando o arquivo de entrada
- O erro 404 indica que a Vercel não encontra o arquivo esperado

### Bug 2: Layout não responsivo

**Root Cause Identificado:**

1. **Ausência de max-width em containers principais**: O CSS atual não limita a largura máxima dos containers `header`, `main` e `footer`, permitindo que esticem indefinidamente em telas grandes.

2. **Grid auto-fit sem constraints adequados**: A classe `.kpi-row` usa `grid-template-columns: repeat(auto-fit, minmax(150px,1fr))` que funciona razoavelmente, mas não há media queries para forçar coluna única em mobile.

3. **Tabela sem estratégia mobile**: A `.table-wrap` tem `overflow-x: auto` mas não há otimizações para mobile (colunas prioritárias, layout adaptado, ou responsividade específica).

4. **Padding fixo não adaptativo**: Os paddings de `header`, `main` e `footer` são fixos (2.5rem) e só têm um breakpoint em 600px reduzindo para 1.2rem. Não há breakpoints intermediários.

5. **Charts grid sem breakpoint mobile adequado**: A `.charts-grid` tem breakpoint em 700px, mas deveria ser 768px para alinhar com convenções mobile-first.

6. **Ranking e insight grids com minmax muito largo**: `.ranking-grid` usa `minmax(280px, 1fr)` e `.insight-grid` usa `minmax(260px, 1fr)`, que podem causar overflow em telas muito pequenas (<320px).

## Correctness Properties

Property 1: Bug Condition - Vercel Serve Index File

_For any_ deployment na Vercel onde o arquivo `index.html` existe na raiz do projeto, a plataforma SHALL servir esse arquivo corretamente quando a rota `/` for acessada, retornando status 200 e o conteúdo HTML completo.

**Validates: Requirements 2.1**

Property 2: Bug Condition - Responsive Layout Desktop

_For any_ viewport com largura maior que 1200px, o dashboard SHALL limitar a largura máxima dos containers principais a aproximadamente 1400-1600px com margens automáticas, evitando elementos excessivamente esticados e mantendo espaçamento proporcional.

**Validates: Requirements 2.2**

Property 3: Bug Condition - Responsive Layout Mobile

_For any_ viewport com largura menor que 768px, todos os componentes (tabelas, gráficos, KPI cards, ranking cards, insight cards) SHALL se adaptar responsivamente através de: grid de coluna única para cards, scroll horizontal suave para tabelas, gráficos redimensionados, e padding reduzido.

**Validates: Requirements 2.3, 2.4, 2.5**

Property 4: Preservation - Data Integrity

_For any_ modificação de arquivo ou CSS, o sistema SHALL continuar exibindo todos os dados dos 11 influenciadores corretamente, preservando a estrutura do array DATA e a renderização de todas as métricas (seguidores, engajamento, likes, comentários, crescimento, nicho, veredicto, score).

**Validates: Requirements 3.1**

Property 5: Preservation - JavaScript Functionality

_For any_ modificação de arquivo ou CSS, todo o JavaScript inline SHALL continuar funcionando sem alterações, incluindo: sistema de abas, filtros de tabela, ordenação de colunas, inicialização de gráficos Chart.js, e todos os event handlers.

**Validates: Requirements 3.2, 3.3, 3.4, 3.7**

Property 6: Preservation - Design System

_For any_ modificação de CSS para responsividade, o design system SHALL ser preservado, incluindo: todas as CSS variables (cores, espaçamentos), tipografia (Syne, DM Sans), border-radius, transições, e hierarquia visual.

**Validates: Requirements 3.6**

## Fix Implementation

### Changes Required

#### Fix 1: Renomear arquivo para index.html

**File**: `dashboard_influenciadores_cardapio_web.html` → `index.html`

**Operation**: File rename (não requer modificação de conteúdo)

**Specific Changes**:
1. **Renomear arquivo**: Usar operação de rename/move do sistema de arquivos
   - Source: `dashboard_influenciadores_cardapio_web.html`
   - Destination: `index.html`
   - Preservar todo o conteúdo sem modificações

**Rationale**: A Vercel procura por `index.html` como página padrão. Renomear o arquivo resolve o erro 404 sem necessidade de configuração adicional.

**Risk Assessment**: Risco mínimo - operação de rename não altera conteúdo do arquivo.

#### Fix 2: Implementar responsividade via CSS

**File**: `index.html` (após rename)

**Section**: `<style>` tag (linhas aproximadas 7-400)

**Specific Changes**:

1. **Adicionar max-width aos containers principais**:
   ```css
   /* Adicionar após a regra body {} */
   .container-max {
     max-width: 1600px;
     margin-left: auto;
     margin-right: auto;
   }
   ```
   - Aplicar classe `.container-max` aos elementos `<header>`, `<main>`, e `<footer>` no HTML
   - Ou adicionar `max-width: 1600px; margin: 0 auto;` diretamente nas regras `header`, `main`, `footer`

2. **Adicionar media query para desktop large (>1200px)**:
   ```css
   @media(min-width: 1200px) {
     header, main, footer {
       max-width: 1600px;
       margin-left: auto;
       margin-right: auto;
     }
   }
   ```

3. **Adicionar media query para tablet (600px-900px)**:
   ```css
   @media(max-width: 900px) {
     .kpi-row {
       grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
     }
     .ranking-grid {
       grid-template-columns: 1fr;
     }
     .insight-grid {
       grid-template-columns: 1fr;
     }
   }
   ```

4. **Melhorar media query mobile existente (max-width: 600px)**:
   ```css
   @media(max-width: 600px) {
     header { padding: 1.5rem 1.2rem 0; }
     main { padding: 1.5rem 1.2rem; }
     footer { padding: 1rem 1.2rem; }
     
     /* Adicionar: */
     .kpi-row {
       grid-template-columns: 1fr;
       gap: 10px;
     }
     .header-top {
       flex-direction: column;
       align-items: flex-start;
     }
     h1 {
       font-size: 1.8rem;
     }
     .nav-tabs {
       overflow-x: auto;
       -webkit-overflow-scrolling: touch;
     }
     .tab-btn {
       padding: 0.75rem 1.2rem;
       font-size: 12px;
     }
     .table-wrap {
       border-radius: 10px;
     }
     table {
       font-size: 11px;
     }
     td, thead th {
       padding: 10px 12px;
     }
     .rank-card {
       padding: 1rem;
     }
     .insight-card {
       padding: 1rem;
     }
   }
   ```

5. **Adicionar media query para mobile small (<400px)**:
   ```css
   @media(max-width: 400px) {
     .kpi-card {
       padding: 1rem 1.2rem;
     }
     .kpi-val {
       font-size: 1.6rem;
     }
     .filter-bar {
       gap: 6px;
     }
     .filter-btn {
       padding: 5px 12px;
       font-size: 11px;
     }
   }
   ```

6. **Ajustar breakpoint do charts-grid**:
   ```css
   /* Modificar regra existente de 700px para 768px */
   @media(max-width: 768px) { 
     .charts-grid { 
       grid-template-columns: 1fr; 
     } 
   }
   ```

7. **Adicionar responsividade para tabela em mobile**:
   ```css
   @media(max-width: 600px) {
     .table-wrap {
       overflow-x: auto;
       -webkit-overflow-scrolling: touch;
     }
     table {
       min-width: 800px; /* Força scroll horizontal suave */
     }
   }
   ```

**Implementation Strategy**:
- Abordagem mobile-first: começar com estilos base, adicionar media queries para telas maiores
- Usar breakpoints padrão da indústria: 400px (mobile small), 600px (mobile), 768px (tablet), 900px (tablet large), 1200px (desktop)
- Preservar todas as CSS variables e design system existente
- Não modificar JavaScript - apenas CSS
- Testar em: iPhone SE (375px), iPhone 12 (390px), iPad (768px), Desktop (1920px)

**Rationale**: Media queries permitem aplicar estilos condicionalmente baseado na largura da tela, resolvendo problemas de layout sem afetar funcionalidade JavaScript.

**Risk Assessment**: Risco baixo - modificações apenas em CSS, JavaScript permanece intocado. Chart.js já tem responsividade nativa (`responsive: true`).

## Testing Strategy

### Validation Approach

A estratégia de teste segue abordagem em duas fases:

**Fase 1 - Exploratory Bug Condition Checking**: Confirmar que os bugs existem no código não-corrigido, documentando comportamentos específicos e screenshots.

**Fase 2 - Fix Checking & Preservation Checking**: Após implementar as correções, verificar que os bugs foram resolvidos E que todas as funcionalidades existentes continuam funcionando.

### Exploratory Bug Condition Checking

**Goal**: Confirmar os bugs ANTES de implementar as correções. Documentar evidências concretas dos problemas.

**Test Plan**: 

1. **Bug 1 - Erro 404 Vercel**:
   - Fazer deploy do código atual na Vercel
   - Acessar a URL raiz do projeto
   - **Resultado esperado**: Erro 404: NOT_FOUND
   - **Evidência**: Screenshot do erro, logs da Vercel

2. **Bug 2 - Desktop Stretch (1920px)**:
   - Abrir `dashboard_influenciadores_cardapio_web.html` em navegador
   - Redimensionar janela para 1920px de largura
   - Observar elementos do header, KPI cards, tabela
   - **Resultado esperado**: Elementos esticam até 1920px, espaçamento inadequado
   - **Evidência**: Screenshot mostrando largura excessiva

3. **Bug 2 - Mobile Overflow (375px)**:
   - Abrir em DevTools com emulação de iPhone SE (375px)
   - Navegar por todas as abas (Visão geral, Tabela, Gráficos, Ranking, Insights)
   - Observar KPI cards, tabela, gráficos
   - **Resultado esperado**: 
     - KPI cards não reorganizam adequadamente
     - Tabela requer scroll horizontal excessivo
     - Alguns elementos podem ter overflow
   - **Evidência**: Screenshots de cada aba mostrando problemas

4. **Bug 2 - Tablet Layout (768px)**:
   - Abrir em DevTools com emulação de iPad (768px)
   - Observar layout geral
   - **Resultado esperado**: Layout parcialmente quebrado ou não otimizado
   - **Evidência**: Screenshot mostrando layout não-ideal

**Expected Counterexamples**:
- Deploy na Vercel retorna 404 ao invés de servir o dashboard
- Desktop: elementos esticam além de 1600px sem max-width
- Mobile: grid de KPI cards não colapsa para coluna única
- Mobile: tabela não tem estratégia de scroll otimizada
- Tablet: ranking e insight cards não se adaptam adequadamente

### Fix Checking

**Goal**: Verificar que para todos os inputs onde as condições de bug existem, o código corrigido produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL deployment WHERE isBugCondition_404(deployment) DO
  result := deployToVercel_fixed()
  ASSERT result.status == 200
  ASSERT result.servedFile == 'index.html'
END FOR

FOR ALL viewport WHERE isBugCondition_Responsive(viewport) DO
  result := renderDashboard_fixed(viewport)
  ASSERT result.layoutIsAdapted == true
  ASSERT result.noHorizontalOverflow == true
  ASSERT result.elementsAreReadable == true
END FOR
```

**Test Cases**:

1. **Fix 1 - Vercel Deploy**:
   - Renomear arquivo para `index.html`
   - Fazer deploy na Vercel
   - Acessar URL raiz
   - **Assertion**: Status 200, dashboard carrega corretamente
   - **Validation**: Inspecionar Network tab, confirmar que `index.html` foi servido

2. **Fix 2 - Desktop Max-Width (1920px)**:
   - Abrir `index.html` em navegador
   - Redimensionar para 1920px
   - **Assertion**: Container principal limitado a ~1600px com margens automáticas
   - **Validation**: Inspecionar elemento com DevTools, medir largura computada

3. **Fix 2 - Mobile KPI Cards (375px)**:
   - Abrir em DevTools com iPhone SE (375px)
   - Navegar para aba "Visão geral"
   - **Assertion**: KPI cards em coluna única ou grid adaptativo (max 2 colunas)
   - **Validation**: Inspecionar grid, confirmar que cards não overflow

4. **Fix 2 - Mobile Table (375px)**:
   - Abrir em DevTools com iPhone SE (375px)
   - Navegar para aba "Tabela comparativa"
   - **Assertion**: Tabela com scroll horizontal suave, sem quebra de layout
   - **Validation**: Testar scroll, confirmar que todas as colunas são acessíveis

5. **Fix 2 - Mobile Charts (375px)**:
   - Abrir em DevTools com iPhone SE (375px)
   - Navegar para aba "Gráficos"
   - **Assertion**: Gráficos redimensionados, legíveis, sem overflow
   - **Validation**: Verificar que Chart.js renderiza corretamente em tamanho pequeno

6. **Fix 2 - Tablet Layout (768px)**:
   - Abrir em DevTools com iPad (768px)
   - Navegar por todas as abas
   - **Assertion**: Layout intermediário adequado, grid de 2 colunas onde apropriado
   - **Validation**: Confirmar que ranking e insight cards usam grid adaptativo

7. **Fix 2 - Breakpoints Intermediários (600px, 900px, 1200px)**:
   - Testar em cada breakpoint
   - **Assertion**: Transições suaves entre layouts, sem quebras abruptas
   - **Validation**: Redimensionar janela lentamente, observar mudanças de layout

### Preservation Checking

**Goal**: Verificar que para todos os inputs onde a condição de bug NÃO existe, o código corrigido produz o mesmo resultado que o código original.

**Pseudocode:**
```
FOR ALL interaction WHERE NOT isBugCondition(interaction) DO
  ASSERT dashboard_original(interaction) == dashboard_fixed(interaction)
END FOR
```

**Testing Approach**: Testar todas as funcionalidades JavaScript e interatividade em diferentes tamanhos de tela para garantir que nada foi quebrado pelas mudanças de CSS.

**Test Plan**: Observar comportamento no código ORIGINAL primeiro, depois verificar que o comportamento é IDÊNTICO no código corrigido.

**Test Cases**:

1. **Preservation - Data Display**:
   - **Original**: Abrir dashboard original, verificar que todos os 11 influenciadores são exibidos com dados corretos
   - **Fixed**: Abrir dashboard corrigido, verificar que os mesmos 11 influenciadores são exibidos com dados idênticos
   - **Assertion**: Array DATA não foi modificado, todos os valores (seguidores, engajamento, likes, comentários, crescimento, nicho, veredicto, score) são idênticos

2. **Preservation - Tab Navigation**:
   - **Original**: Clicar em cada aba (Visão geral, Tabela, Gráficos, Ranking, Insights), observar transições
   - **Fixed**: Clicar em cada aba, observar transições
   - **Assertion**: Sistema de abas funciona identicamente, função `showTab()` não foi modificada

3. **Preservation - Table Filtering**:
   - **Original**: Clicar em filtros (Todos, Aprovar, Testar, Descartar), observar filtragem
   - **Fixed**: Clicar em filtros, observar filtragem
   - **Assertion**: Função `filterTable()` funciona identicamente, mesmos perfis são filtrados

4. **Preservation - Table Sorting**:
   - **Original**: Clicar em headers de colunas (Perfil, Seguidores, Eng. %, etc.), observar ordenação
   - **Fixed**: Clicar em headers, observar ordenação
   - **Assertion**: Função `sortTable()` funciona identicamente, ordenação ascendente/descendente funciona

5. **Preservation - Chart.js Interactivity**:
   - **Original**: Hover sobre gráficos, observar tooltips e animações
   - **Fixed**: Hover sobre gráficos, observar tooltips e animações
   - **Assertion**: Gráficos Chart.js funcionam identicamente, tooltips mostram dados corretos

6. **Preservation - Design System**:
   - **Original**: Inspecionar CSS variables, cores, tipografia, border-radius
   - **Fixed**: Inspecionar CSS variables, cores, tipografia, border-radius
   - **Assertion**: Todas as CSS variables preservadas, design visual idêntico (exceto layout responsivo)

7. **Preservation - Ranking Display**:
   - **Original**: Navegar para aba Ranking, observar ordem e badges
   - **Fixed**: Navegar para aba Ranking, observar ordem e badges
   - **Assertion**: Função `buildRanking()` funciona identicamente, mesma ordem de perfis

8. **Preservation - Viewport Médio (900-1100px)**:
   - **Original**: Abrir em viewport de 1000px (range que já funcionava bem)
   - **Fixed**: Abrir em viewport de 1000px
   - **Assertion**: Layout idêntico, nenhuma mudança visual nesse range
   - **Rationale**: Requisito 3.5 especifica que telas médias devem continuar funcionando como já funcionam

### Unit Tests

Devido à natureza do projeto (HTML/CSS/JS inline sem framework), os testes serão manuais:

- **Teste de rename**: Verificar que arquivo `index.html` existe e conteúdo é idêntico ao original
- **Teste de deploy Vercel**: Deploy e acesso via URL raiz
- **Testes de viewport**: Emulação em DevTools para cada breakpoint (375px, 600px, 768px, 900px, 1200px, 1920px)
- **Testes de interação**: Clicar em todos os botões, abas, filtros, headers de tabela
- **Testes de gráficos**: Verificar renderização e interatividade em cada tamanho de tela

### Property-Based Tests

Não aplicável para este bugfix - o projeto não usa framework de testes e a natureza das correções (rename de arquivo + CSS) não se beneficia de property-based testing. Os testes manuais de viewport em múltiplos breakpoints cobrem adequadamente o espaço de inputs.

### Integration Tests

- **Teste end-to-end de deploy**:
  1. Renomear arquivo para `index.html`
  2. Adicionar media queries CSS
  3. Fazer deploy na Vercel
  4. Acessar URL em múltiplos dispositivos reais (se possível) ou emulados
  5. Navegar por todas as abas
  6. Testar todas as interações (filtros, ordenação, hover em gráficos)
  7. Verificar que não há erros no console do navegador
  8. Verificar que não há warnings de acessibilidade

- **Teste de regressão visual**:
  1. Tirar screenshots do dashboard original em viewport de 1000px
  2. Tirar screenshots do dashboard corrigido em viewport de 1000px
  3. Comparar visualmente - devem ser idênticos
  4. Tirar screenshots do dashboard corrigido em 375px, 768px, 1920px
  5. Verificar que layouts são adequados e legíveis

- **Teste de performance**:
  1. Medir tempo de carregamento antes e depois
  2. Verificar que adição de media queries não impacta performance
  3. Confirmar que gráficos Chart.js renderizam na mesma velocidade
