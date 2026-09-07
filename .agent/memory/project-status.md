# 📊 Project Status & Context

> **Last Updated:** 2026-09-07
> **Current Phase:** Release
> **Produto:** v0.0.9
> **Hub:** v0.12.0 (`62b7efd26d07…`, canal `auto`)

## 🎯 Objetivos Atuais

- [x] Sincronizar governança local com o Agents Hub (Prompt 23 → v0.12.0)
- [x] Extrair regras AQ testáveis (`aq-calc.js`) e cobrir cenários críticos (`npm test`)
- [x] Checkpoint Prompt 19: docs + testes completos + commit + push + bump patch → **v0.0.9**
- [ ] Manter cálculos AQ 100% alinhados a `PRD.md` / legislação em mudanças futuras

## 🏗️ Arquitetura Atual

- **Frontend:** HTML + CSS + JavaScript vanilla (SPA offline)
- **Regras:** `aq-calc.js` (puro) + `app.js` (DOM)
- **Testes:** `tests/aq-calc.test.js` via `npm test`
- **Governança:** Agents Hub via junction `.agent/hub/` → `D:\Agents`

## 🔄 Tarefas em Aberto (High Level)

1. Qualquer mudança de cálculo: consultar `PRD.md` e rodar `npm test`
2. Opcional: Prompt 34 (smoke browser) se houver mudança visual

## ⚠️ Riscos e Bloqueios

- Cálculos AQ são críticos legalmente — regressão silenciosa tem alto impacto
- Junction `.agent/hub/` não deve ser commitada (já no `.gitignore`)

## 📝 Log de Sessão

### 2026-09-07 — Release v0.0.9 (governança Hub + aq-calc + testes)

- Versão **v0.0.9**: governança Hub v0.11.2→v0.12.0 (repin, AGENTS/GEMINI, hooks, package.json)
- Higiene docs/código (Prompts 20/25/43/91) e estrutura kebab-case
- `aq-calc.js` + `npm test` 25/25; removido `tests.js`
- Prompt 19: checkpoint com bump patch, testes completos, commit e push
- `sync:version` ausente no satélite — bump manual em `package.json` + CHANGELOG + memória (fallback esperado)

### 2026-01-19 — Release v0.0.8

- Correção de estilo no input de Valor do VR (setas removidas)
- Correção de animação indesejada nas setas de inputs numéricos
- Otimização de performance em transições CSS (`transition: all` removido)
