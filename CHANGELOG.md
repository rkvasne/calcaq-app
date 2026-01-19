# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Changed
- Nenhuma alteração pendente

---

## [0.0.8] - 2026-01-19

### Fixed
- Correção de estilo no input de Valor do VR (setas removidas para compatibilidade com tema)
- Correção de animação indesejada ("efeito diagonal") nas setas de inputs numéricos ao passar o mouse
- Otimização de performance em transições CSS (removido `transition: all`)

---

## [0.0.7] - 2026-01-19

### Changed
- Melhorias significativas de UX/UI para dispositivos móveis:
  - Substituição de inputs numéricos por dropdowns (selects)
  - Aumento do tamanho de fontes e áreas de toque
  - Tooltips agora acessíveis via toque (CSS puro)
- Refatoração de código (Modo Qualidade):
  - Extração de constantes de negócio para objeto `CONFIG` centralizado
  - Implementação de testes unitários básicos em `tests.js`
- Melhoria de Segurança (Modo Segurança):
  - Remoção de `innerHTML` vulnerável em favor de manipulação segura do DOM
- Refinamento visual para tema "Obsidian & Mist":
  - Redução do excesso de branco com fundo Slate-100
  - Aumento de contraste em inputs e selects (Slate-200)
  - Correção de arredondamento no card de valor do VR
- Aumento do tamanho do logo para 64px


---

## [0.0.6] - 2026-01-19

### Docs
- Reestruturação completa do README.md seguindo o padrão "Hero Section"
- Centralização de logos, badges e links rápidos
- Adição de seção de Instalação e Uso
- Organização de seções de desenvolvimento e convenções
- Correção de duplicidades no rodapé
- Ajuste de logo para 256x256 e remoção de código redundante no AGENTS.md


---

## [0.0.5] - 2026-01-19

### Changed
- Refinamento visual completo para estilo "Dashboard Profissional" (tema Slate & Blue)
- Barra superior escura com logo e título
- Melhoria na responsividade e layout:
  - Sidebar de resultados "Sticky" (fixa) em telas grandes
  - Inputs de data agora ocupam largura fixa, alinhados à direita
  - Correção de gaps e espaçamentos desnecessários em campos vazios
- Adição de favicon e logo oficial do projeto
- Ajuste semântico: "Considerados sem data" -> "Itens incluídos (pendente validação de data)"


---

## [0.0.4] - 2026-01-19

### Changed
- Renomeação do projeto de "Sistema Web" para "Formulário Web" na documentação
- Reorganização dos cards do formulário:
  - Pós-graduação e Certificações agora ocupam a linha inteira
  - Nova ordem: Pós-graduação -> Graduação -> Capacitações -> Certificações
- Padronização rigorosa de espaçamentos e ritmo vertical (redução de gaps)
- Melhoria visual nos cards de resultado (cores de fundo e emojis para maior clareza)
- Ajuste no texto de itens com pendência de data para "Considerados sem data"


---

## [0.0.3] - 2026-01-19

### Docs
- Remoção do documento de inconsistências resolvidas

---

## [0.0.2] - 2026-01-19

### Changed
- Padronização de tipografia e espaçamentos
- Refinos visuais em cards e formulários
- Tooltips para esclarecer regras na interface
- Calendário limita seleção de datas até a data de hoje

### Docs
- Remoção de redundâncias no README
- Correções de nomenclatura de arquivos no AGENTS
- Atualização da análise de inconsistências

---

## [0.0.1] - 2026-01-08

### Added
- Formulário completo de cálculo do Adicional de Qualificação (AQ)
- Formulário interativo com validação em tempo real
- Cálculo automático baseado nas Leis 11.416/2006 e 15.292/2025
- Interface responsiva (mobile-first)
- Suporte para todas as titulações:
  - Doutorado (5 VR)
  - Mestrado (3,5 VR)
  - Pós-graduações lato sensu (1 VR cada, máx. 2)
  - Curso de graduação (1 VR, com exceção para Técnicos)
  - Certificações profissionais (0,5 VR cada, máx. 2)
  - Capacitações 120h (0,2 VR por conjunto, máx. 3)
- Validação de vigência de 4 anos para Certificações e Capacitações
- Mecanismo de priorização automática no bloco de 2 VR
- Absorção de adicionais menores por Doutorado/Mestrado (exceto Capacitações)
- Exibição detalhada de itens considerados, descartados e pendentes
- Campo configurável para Valor de Referência (VR)
- Documentação completa (PRD, README, AGENTS.md)
- Análise de inconsistências entre leis e implementação

### Changed
- Ajustes de espaçamentos para melhor hierarquia visual
- Padronização de tamanhos de fonte
- Melhoria de contraste de cores
- Layout otimizado com cards em grid responsivo
- Refinamento da paleta de cores inspirada em bibliotecas modernas

### Fixed
- Correção do texto sobre Técnico Judiciário (nível médio vs nível superior)
- Atualização de textos sobre Capacitações (conjuntos de 120h)
- Melhoria de labels e tooltips para maior clareza
- Ajuste de espaçamentos entre títulos e conteúdo
- Correção de inconsistencias identificadas na análise

---

## Tipos de Mudanças

- `Added` para novas funcionalidades
- `Changed` para mudanças em funcionalidades existentes
- `Deprecated` para funcionalidades que serão removidas
- `Removed` para funcionalidades removidas
- `Fixed` para correções de bugs
- `Security` para correções de segurança

---

**Versão Atual:** 0.0.8  
**Última Atualização:** 2026-01-19
