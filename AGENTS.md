# AGENTS.md

> Este arquivo fornece instruções para agentes de IA que trabalham neste projeto.
> Compatível com: VS Code + Copilot, Cursor, Windsurf, Trae, Gemini CLI, e outros.

---

## 🖥️ Ambiente

- **Sistema Operacional:** Windows 11
- **Idioma de Resposta:** Português (pt-BR)
- **Modelo de IA:** Sempre informe qual modelo está sendo usado

---

## ⚠️ REGRA MÁXIMA DE ALTERAÇÃO

**❌ NUNCA altere código que não foi explicitamente solicitado.**

### Obrigatório:
- ✅ Edite APENAS o que for claramente pedido
- ✅ Pergunte antes se houver qualquer dúvida sobre escopo
- ✅ Mantenha todo o resto do código intacto
- ❌ NÃO reescreva funções ou arquivos inteiros sem solicitação
- ❌ NÃO refatore, otimize ou "melhore" código por conta própria
- ❌ NÃO sugira alterações automáticas não solicitadas

---

## 🔒 Execução de Comandos

- ❌ **NUNCA** execute comandos em terminal sem autorização explícita
- Isso inclui: instalações, scripts, build, testes
- ✅ Sempre pergunte antes de executar qualquer comando

---

## 📁 Estrutura do Projeto

Este é um projeto **puro HTML/CSS/JavaScript** sem build step ou dependências externas.

```
calcaq-app/
├── index.html                    # Página principal (HTML semântico)
├── app.js                        # Lógica de cálculo (JavaScript vanilla)
├── style.css                     # Estilos (CSS3 com variáveis)
├── PRD.md                        # Product Requirements Document
├── AGENTS.md                     # Este arquivo
├── ANALISE_INCONSISTENCIAS.md    # Análise técnica de inconsistências
├── README.md                     # Documentação principal
├── CHANGELOG.md                  # Histórico de mudanças
├── L11416.pdf                    # Lei 11.416/2006 (referência)
├── L15292.pdf                    # Lei 15.292/2025 (referência)
└── tabela_aq_2026.jpg            # Tabela de referência visual
```

---

## 🧠 Contexto do Negócio

Este projeto calcula o **Adicional de Qualificação (AQ)** baseado em leis específicas do Judiciário. É **crítico** que os cálculos estejam 100% corretos conforme a legislação.

### Regras Críticas a Respeitar

1. **Doutorado/Mestrado não acumulam** - Prevalece a maior
2. **Doutorado/Mestrado absorvem menores** - Exceto Capacitações (120h)
3. **Teto de 2 VR** - Aplica-se a Pós-graduação + Graduação + Certificações
4. **Priorização automática** - Pós → Grad → Cert (dentro do teto)
5. **Vigência de 4 anos** - Certificações e Capacitações
6. **Capacitações são conjuntos de 120h** - Podem ser compostas por múltiplas ações

**⚠️ IMPORTANTE**: Sempre consulte `PRD.md` e `ANALISE_INCONSISTENCIAS.md` antes de modificar cálculos ou regras de negócio.

---

## 🛠️ Tecnologias e Padrões

### HTML
- ✅ Semântico (tags apropriadas: `<section>`, `<header>`, etc.)
- ✅ Acessível (ARIA labels onde necessário)
- ✅ Estruturado e limpo

### CSS
- ✅ Variáveis CSS para cores e espaçamentos
- ✅ Mobile-first (design responsivo)
- ✅ Grid e Flexbox para layout
- ✅ Sem frameworks externos

### JavaScript
- ✅ Vanilla JavaScript (sem bibliotecas)
- ✅ Cálculos em tempo real
- ✅ Validações de data e vigência
- ✅ Formatação brasileira (pt-BR)

### Padrões de Código

#### JavaScript
- Funções descritivas: `calcular()`, `formatVR()`, `isWithinFourYears()`
- Constantes no topo: `const el = { ... }`
- Validação de inputs: `clampInt()`, `parseVR()`
- Formatação consistente: `formatVR()`, `formatBRL()`

#### CSS
- Variáveis CSS em `:root`
- Classes descritivas: `.form-field`, `.result__kpi`, `.badge--ok`
- Mobile-first media queries
- Cores semânticas: `--success`, `--danger`, `--warning`

---

## 🧪 Testes e Validação

### Cenários de Teste Críticos

Antes de qualquer alteração em cálculos, verifique:

1. **Doutorado + Mestrado**: Deve considerar apenas Doutorado (5 VR)
2. **Teto de 2 VR**: 2 Pós-graduações + 1 Graduação deve resultar em 2 VR (não 3)
3. **Priorização**: 2 Pós + 1 Grad + 2 Cert = 2 VR (Pós + Grad, Cert descartadas)
4. **Capacitações**: Devem acumular com tudo (inclusive Doutorado)
5. **Vigência**: Datas > 4 anos devem ser descartadas
6. **Técnico nível médio**: Primeira graduação conta (exceção)

### Validação Manual

- Abrir `index.html` em navegador
- Testar todos os campos do formulário
- Verificar cálculo em tempo real
- Conferir se mensagens de descarte/pendência aparecem corretamente

---

## 📝 Convenções de Arquivos

### Nomenclatura
- ✅ Arquivos: `kebab-case` (ex: `analise-inconsistencias.md`)
- ✅ Classes CSS: `kebab-case` ou BEM (ex: `.form-field`, `.result__kpi`)
- ✅ Variáveis JS: `camelCase` (ex: `totalVR`, `hasDoutorado`)

### Documentação
- **Raiz**: `README.md`, `PRD.md`, `AGENTS.md`, `CHANGELOG.md` (UPPERCASE)

---

## 🔍 Debugging

1. **Console do navegador**: Verifique erros JavaScript
2. **DevTools**: Inspecione elementos e estilos
3. **Teste manual**: Preencha formulário e verifique cálculos
4. **Validação de datas**: Use datas conhecidas para testar vigência

### Funções Principais para Debug

- `calcular()` - Função principal de cálculo
- `isWithinFourYears()` - Valida vigência de 4 anos
- `getGradOption()` - Obtém opção selecionada de graduação

---

## 📚 Documentação de Referência

### Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `PRD.md` | Especificações completas de regras de negócio |
| `README.md` | Documentação geral do projeto |

### Regras Legais

- **Lei 11.416/2006**: Base legal original
- **Lei 15.292/2025**: Alterações e atualizações
- **tabela_aq_2026.jpg**: Referência visual das regras

---

## 🎨 Design e UX

### Princípios
- **Clareza**: Textos simples, sem juridiquês
- **Feedback Visual**: Badges, cores semânticas, mensagens claras
- **Responsividade**: Funciona bem em mobile e desktop
- **Acessibilidade**: Contraste adequado, navegação por teclado

### Paleta de Cores
- Definida em variáveis CSS (`:root`)
- Inspirada em shadcn/ui e TweakCN
- Cores semânticas: success (verde), warning (amarelo), danger (vermelho)

---

## 📐 Padrões de Código Específicos

### Funções de Cálculo

```javascript
// Sempre validar inputs antes de calcular
const posCount = clampInt(el.pos.value, 0, 2);

// Sempre verificar vigência para certificações/capacitações
const vigente = isWithinFourYears(dateStr, now);

// Formatar valores brasileiros
const formatted = formatVR(value); // "1,50" ou "5,00"
const money = formatBRL(value); // "R$ 1.500,00"
```

### Manipulação de DOM

```javascript
// Usar elementos já referenciados (performance)
el.totalVR.textContent = formatVR(totalVR);

// Renderizar listas dinamicamente
setList(el.considerado, considerado);
setBadges(badges);
```

---

## ⚡ Quick Reference

| Ação | Observação |
|------|------------|
| Modificar cálculo | Consultar `PRD.md` primeiro |
| Alterar UI | Manter responsividade e acessibilidade |
| Adicionar feature | Verificar impacto nas regras de negócio |
| Corrigir bug | Testar todos os cenários relacionados |

---

## 🔗 Referências Externas

Para padrões gerais de desenvolvimento, consulte:

- **React/Frontend:** `@rules/tecnologias/react.md` (referência, não aplicável aqui)
- **CSS:** Manter padrão mobile-first e variáveis CSS
- **JavaScript:** Vanilla JS puro, sem transpilação

---

*Última atualização: Janeiro 2026*
