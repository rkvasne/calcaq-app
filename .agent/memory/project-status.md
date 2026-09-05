# 📊 Project Status & Context

> **Last Updated:** 2026-09-05
> **Current Phase:** Release / Governança
> **Hub:** v0.11.2 (`6abdf5ebb0c102c7d132222eeda57814ae9d8e36`, canal `auto`)

## 🎯 Objetivos Atuais

- [x] Sincronizar governança local com o Agents Hub (Prompt 23)
- [x] Fechar achado Hub `zappy-app#3` (madge/`npx.cmd` EINVAL) após correção upstream
- [x] Persistir sync no remoto via Prompt 19 (checkpoint + docs + commit + push, sem bump)
- [ ] Manter cálculos AQ 100% alinhados a `PRD.md` / legislação

## 🏗️ Arquitetura Atual

- **Frontend:** HTML + CSS + JavaScript vanilla (SPA offline, sem build de app)
- **Governança:** Agents Hub via junction `.agent/hub/` → `D:\Agents`
- **Tooling Node:** só para scripts Hub (verify, format, doctor, hooks) — não altera o runtime do formulário

## 🔄 Tarefas em Aberto (High Level)

1. Checkpoint Git da sync (commit + push sem bump)
2. Rodadas futuras de produto: qualquer mudança de cálculo exige consulta a `PRD.md` e cenários críticos do `AGENTS.md`

## ⚠️ Riscos e Bloqueios

- Cálculos AQ são críticos legalmente — regressão silenciosa tem alto impacto
- Junction `.agent/hub/` não deve ser commitada (já no `.gitignore`)

## 📝 Log de Sessão

### v0.0.8 — 2026-01-19

- Correção de estilo no input de Valor do VR (setas removidas)
- Correção de animação indesejada nas setas de inputs numéricos
- Otimização de performance em transições CSS (`transition: all` removido)
- Restauro da paleta azul e ajuste da seta do select (ainda em Unreleased até próximo bump)

### 2026-09-05 — Prompt 23 + follow-up + Prompt 19

- Sync de governança: package.json, hooks, AGENTS/GEMINI, canal auto, doctor 28/28
- Hub dirty resolvido pelo usuário → `hub-repin` para v0.11.2
- Achado `rkvasne/zappy-app#3` fechado após correção em `run-madge-circular.js`
- Checkpoint: documentação + commit + push, sem testes de produto, sem bump (versão permanece v0.0.8)
