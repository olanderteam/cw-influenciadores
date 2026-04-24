# Bugfix Requirements Document

## Introduction

Este documento descreve os requisitos para corrigir dois problemas críticos no dashboard de influenciadores da Cardápio Web:

1. **Erro 404 na Vercel**: O deploy falha porque a Vercel procura por `index.html` mas o arquivo se chama `dashboard_influenciadores_cardapio_web.html`
2. **Layout não responsivo**: O dashboard não se adapta corretamente a diferentes tamanhos de tela, ficando "esticado" no desktop e quebrado no mobile

Estes bugs impedem que o dashboard seja acessado em produção e comprometem a experiência do usuário em dispositivos móveis.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN o projeto é deployado na Vercel THEN o sistema retorna erro 404: NOT_FOUND

1.2 WHEN o dashboard é acessado em telas desktop (>1200px) THEN os elementos ficam excessivamente esticados e com espaçamento inadequado

1.3 WHEN o dashboard é acessado em dispositivos mobile (<768px) THEN as tabelas, gráficos e cards não se adaptam corretamente à largura da tela

1.4 WHEN o usuário tenta visualizar a tabela comparativa em mobile THEN o conteúdo fica cortado ou requer scroll horizontal excessivo

1.5 WHEN os KPI cards são renderizados em telas pequenas THEN eles não reorganizam o layout de forma adequada

### Expected Behavior (Correct)

2.1 WHEN o projeto é deployado na Vercel THEN o sistema SHALL servir o arquivo HTML corretamente como página inicial sem erro 404

2.2 WHEN o dashboard é acessado em telas desktop (>1200px) THEN os elementos SHALL ter largura máxima controlada e espaçamento proporcional

2.3 WHEN o dashboard é acessado em dispositivos mobile (<768px) THEN todos os componentes (tabelas, gráficos, cards) SHALL se adaptar responsivamente à largura da tela

2.4 WHEN o usuário visualiza a tabela comparativa em mobile THEN o conteúdo SHALL ser acessível através de scroll horizontal suave ou layout adaptado

2.5 WHEN os KPI cards são renderizados em telas pequenas THEN eles SHALL reorganizar em coluna única ou grid adaptativo mantendo legibilidade

### Unchanged Behavior (Regression Prevention)

3.1 WHEN o dashboard é acessado em qualquer dispositivo THEN o sistema SHALL CONTINUE TO exibir todos os dados dos 11 influenciadores corretamente

3.2 WHEN o usuário interage com os gráficos Chart.js THEN eles SHALL CONTINUE TO funcionar com tooltips, animações e responsividade nativa do Chart.js

3.3 WHEN o usuário navega entre as abas (Visão geral, Tabela, Gráficos, Ranking, Insights) THEN a funcionalidade SHALL CONTINUE TO alternar corretamente o conteúdo

3.4 WHEN o usuário aplica filtros na tabela comparativa THEN o sistema SHALL CONTINUE TO filtrar e ordenar os dados corretamente

3.5 WHEN o usuário visualiza o dashboard em telas médias (768px-1200px) THEN o layout SHALL CONTINUE TO funcionar adequadamente como já funciona

3.6 WHEN o CSS é modificado para responsividade THEN o design system (cores, tipografia, espaçamentos) SHALL CONTINUE TO ser preservado

3.7 WHEN o arquivo HTML é renomeado THEN todo o JavaScript inline e estilos CSS SHALL CONTINUE TO funcionar sem alterações
