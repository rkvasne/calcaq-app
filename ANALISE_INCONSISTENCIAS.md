# Análise de Inconsistências - Calculadora de AQ

## Data da Análise
2025-01-08

## Última atualização
2026-01-19

## Objetivo
Identificar inconsistências entre:
1. Documentação (PRD.md)
2. Implementação (app.js, index.html)
3. Referência legal (tabela_aq_2026.jpg e leis)

---

## 🔴 INCONSISTÊNCIAS CRÍTICAS ENCONTRADAS

### 1. **CONFUSÃO ENTRE "CERTIFICAÇÕES" E "CAPACITAÇÕES"**

**Problema Identificado:**
- Na tabela de referência, há **dois incisos diferentes**:
  - **INCISO 5**: "CERTIFICAÇÕES E CAPACITAÇÕES" (0,5 VR cada, máx. 2)
  - **INCISO 6**: "CAPACITAÇÕES" (0,2 VR cada, máx. 3, 120h)

**Status no PRD:**
- ✅ PRD distingue corretamente:
  - Certificações profissionais (0,5 VR, máx. 2) - Seção 5.5
  - Capacitações 120h (0,2 VR, máx. 3) - Seção 5.4

**Status no Código:**
- ✅ Código implementa corretamente a distinção

**⚠️ OBSERVAÇÃO:**
A tabela pode estar gerando confusão ao usar o termo "CAPACITAÇÕES" em dois contextos diferentes (INCISO 5 e INCISO 6). O PRD e código estão corretos ao separar "Certificações" (0,5 VR) de "Capacitações 120h" (0,2 VR).

---

### 2. **REGRA DE ABSORÇÃO - IMPLEMENTAÇÃO CORRETA MAS DIFERENTE DA TABELA**

**Tabela de Referência:**
- Não menciona explicitamente que Doutorado/Mestrado "absorvem" Pós/Graduação/Certificações
- Indica apenas que Doutorado e Mestrado acumulam com Capacitações

**PRD:**
- ✅ Seção 5.1 e 5.2: Doutorado/Mestrado absorvem adicionais menores, exceto Capacitações

**Código:**
```186:184:app.js
  } else {
    badges.push({ text: "Teto: 2 VR (pós/grad/cert)", variant: "ok" });

    const itens = [];
```

```177:184:app.js
  if (high) {
    const anyPos = posCount > 0;
    const gradOpt = getGradOption();
    const anyGrad = gradOpt !== "none";
    const anyCert = certCount > 0;
    if (anyPos) descartado.push(`Pós-graduação lato sensu (${posCount}) — absorvido por ${high.nome}.`);
    if (anyGrad) descartado.push(`Curso de graduação — absorvido por ${high.nome}.`);
    if (anyCert) descartado.push(`Certificações profissionais (${certCount}) — absorvido por ${high.nome}.`);
```

**✅ CONCLUSÃO:** Implementação está correta conforme PRD. A tabela pode não estar completa na explicação.

---

### 3. **INCLUSÃO EM APOSENTADORIA/PENSÃO**

**Tabela de Referência:**
- Doutorado: ✅ Incluído em aposentadoria/pensão
- Mestrado: ✅ Incluído em aposentadoria/pensão
- Pós-graduação: ✅ Incluído em aposentadoria/pensão
- Graduação: ✅ Incluído em aposentadoria/pensão
- Certificações (INCISO 5): ❌ NÃO incluído
- Capacitações (INCISO 6): ❌ NÃO incluído

**HTML (index.html linha 147):**
```147:147:index.html
            <span>Doutorado, Mestrado, Pós-graduação e Curso de graduação entram no cálculo (se obtidos antes da inativação). Certificações e Capacitações não entram.</span>
```

**✅ CONCLUSÃO:** HTML está correto e alinhado com a tabela.

**⚠️ OBSERVAÇÃO:** Esta informação é apenas informativa no sistema, não impacta o cálculo atual.

---

### 4. **REGRA DO TÉCNICO JUDICIÁRIO - AMBIGUIDADE NO TEXTO**

**PRD (Seção 5.6):**
- Exceção: ao ocupante de **Técnico Judiciário** nomeado com requisito de escolaridade de **nível médio ou equivalente**, é assegurado o AQ para o **primeiro** curso de graduação
- Se o ingresso exigiu nível superior, aplica-se a regra geral (segunda graduação)

**Código (app.js linha 196-197):**
```196:201:app.js
      if (gradOpt === "tecnico") {
        nota = "Graduação (Técnico com nível superior)";
      } else if (gradOpt === "second") {
        nota = "2ª Graduação (Analista ou Técnico com duas graduações)";
      }
```

**HTML (index.html linha 62-65):**
```62:66:index.html
            <label class="checkbox-row">
              <input type="radio" name="grad_option" id="grad_tecnico" value="tecnico" />
              <span>Sou Técnico e tenho Graduação <span class="tip" title="Exceção: se ingressou com exigência de nível médio, a primeira graduação gera AQ.">ⓘ</span></span>
            </label>
            <div class="micro">Se ingressou como Técnico com exigência de nível médio, a primeira graduação conta (1 VR).</div>
            <div class="micro">Mesmo com duas graduações, o adicional é limitado a 1 VR.</div>
```

**🔴 PROBLEMA IDENTIFICADO:**
O texto do código (linha 197) diz "Técnico com nível superior", mas a exceção se aplica apenas quando o Técnico ingressou com **nível médio**. Há uma contradição:
- O código rotula como "Técnico com nível superior"
- Mas a regra só vale para "Técnico com nível médio"

**✅ CORREÇÃO NECESSÁRIA:**
Alterar o texto para deixar claro que se aplica ao Técnico que ingressou com nível médio.

---

### 5. **PRIORIZAÇÃO NO BLOCO DE 2 VR**

**PRD (Seção 6):**
Ordem de prioridade:
1. Pós-graduação
2. Curso de graduação
3. Certificações

**Código (app.js linha 189-221):**
```189:202:app.js
    for (let i = 1; i <= posCount; i++) {
      itens.push({ nome: `Pós-graduação lato sensu ${i}`, valor: 1, prioridade: 1 });
    }

    const gradOpt = getGradOption();
    if (gradOpt !== "none") {
      let nota = "";
      if (gradOpt === "tecnico") {
        nota = "Graduação (Técnico com nível superior)";
      } else if (gradOpt === "second") {
        nota = "2ª Graduação (Analista ou Técnico com duas graduações)";
      }
      if (nota) itens.push({ nome: nota, valor: 1, prioridade: 2 });
    }

    for (let i = 1; i <= certCount; i++) {
```

```223:235:app.js
    itens.sort((a, b) => a.prioridade - b.prioridade);

    const teto = 2;
    itens.forEach(item => {
      if (blocoVR + item.valor <= teto) {
        blocoVR += item.valor;
        let text = `${item.nome}: ${formatVR(item.valor)} VR`;
        if (item.warning) text += ` (${item.warning})`;
        considerado.push(text);
      } else {
        descartado.push(`${item.nome}: ${formatVR(item.valor)} VR — excedeu o teto de ${formatVR(teto)} VR.`);
      }
    });
```

**✅ CONCLUSÃO:** Implementação está correta:
- Prioridade 1: Pós-graduação
- Prioridade 2: Graduação
- Prioridade 3: Certificações

---

### 6. **VALOR DO VR PADRÃO**

**PRD (Seção 4.1):**
- Valor inicial sugerido: **R$ 714,48**

**HTML (linha 19):**
```19:19:index.html
      <input type="number" id="vr" value="714.48" step="0.01" min="0" />
```

**Tabela:**
- VR = 6.5% de CJ-1 (R$ 10.990,74) = R$ 714,48

**✅ CONCLUSÃO:** Valores estão corretos e alinhados.

---

### 7. **VIGÊNCIA DE 4 ANOS - CÁLCULO**

**PRD:**
- Certificações: válida por 4 anos, contados da conclusão
- Capacitações: válida por 4 anos, contados da última ação que completar o conjunto

**Código (app.js linha 62-68):**
```62:68:app.js
function isWithinFourYears(dateStr, now) {
  const d = parseDateOnly(dateStr);
  if (!d) return null;
  const expiry = addYears(d, 4);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return expiry.getTime() >= today.getTime();
}
```

**✅ CORREÇÃO APLICADA:**
Para Capacitações, a regra diz "contados da última ação que completar o conjunto". O sistema foi atualizado para:
- Deixar claro que cada "capacitação" é um CONJUNTO de 120h
- Explicar que o conjunto pode ser composto por múltiplas ações/cursos
- Solicitar a data da "última ação que completou o conjunto" (não apenas "data de conclusão")
- Atualizar todos os textos e mensagens para refletir essa regra

**✅ Para Certificações:** Implementação está correta (data de conclusão + 4 anos).

**✅ Para Capacitações:** Implementação corrigida - textos atualizados para deixar claro que é um conjunto de 120h e a data deve ser da última ação que completou o conjunto.

---

### 8. **VERIFICAÇÃO DE MÚLTIPLAS PÓS-GRADUAÇÕES**

**PRD:**
- Pós-graduação lato sensu: 1 VR cada, máx. 2

**Código:**
```129:129:app.js
  const posCount = clampInt(el.pos.value, 0, 2);
```

```189:191:app.js
    for (let i = 1; i <= posCount; i++) {
      itens.push({ nome: `Pós-graduação lato sensu ${i}`, valor: 1, prioridade: 1 });
    }
```

**✅ CONCLUSÃO:** Implementação está correta - limita a 2 e cada uma vale 1 VR.

---

### 9. **CAPACITAÇÕES - VALOR E LIMITE**

**PRD:**
- Valor: 0,2 VR por conjunto que totalize pelo menos 120 horas
- Limite: até 3 conjuntos (0 a 3)
- Vigência: 4 anos contados da última ação que completar o conjunto

**Código (após correção):**
```131:131:app.js
  const capCount = clampInt(el.cap.value, 0, 3);
```

**HTML (após correção):**
- Label atualizado: "Capacitações (conjuntos de 120h)"
- Explicação: "Cada conjunto deve totalizar pelo menos 120 horas (pode ser composto por múltiplas ações/cursos)"
- Campo de data: "data da última ação que completou o conjunto"

**✅ CONCLUSÃO:** Implementação corrigida - textos atualizados para deixar claro que:
1. Cada capacitação é um CONJUNTO de 120h
2. O conjunto pode ser composto por múltiplas ações/cursos
3. A data deve ser da última ação que completou o conjunto
4. Ao completar 120h, adquire 0,2 VR que expira em 4 anos

---

## 📋 RESUMO DAS INCONSISTÊNCIAS

| # | Item | Severidade | Status | Ação Necessária |
|---|------|------------|--------|-----------------|
| 1 | Texto "Técnico com nível superior" vs regra de nível médio | 🔴 Alta | ✅ Corrigido | Texto atualizado no código |
| 2 | Vigência de Capacitações (múltiplas ações) | 🟢 Resolvido | ✅ Corrigido | Textos atualizados para deixar claro que é conjunto de 120h |
| 3 | Confusão na tabela sobre "Capacitações" (dois incisos) | 🟢 Baixa | Informativo | Apenas observação - PRD/código corretos |
| 4 | Explicação de Certificações x Capacitações na interface | 🟢 Baixa | ✅ Corrigido | Tooltip adicionada na interface |

---

## ✅ PONTOS VERIFICADOS E CORRETOS

1. ✅ Valores de VR (Doutorado 5, Mestrado 3.5, etc.)
2. ✅ Limites de acumulação (Doutorado/Mestrado não acumulam)
3. ✅ Teto de 2 VR para bloco Pós/Graduação/Certificações
4. ✅ Priorização correta no bloco
5. ✅ Capacitações acumulam com tudo
6. ✅ Vigência de 4 anos (para certificações)
7. ✅ Absorção de menores por Doutorado/Mestrado
8. ✅ Valor padrão do VR (714,48)
9. ✅ Limites numéricos (Pós máx 2, Cert máx 2, Cap máx 3)

---

## 🔧 RECOMENDAÇÕES DE CORREÇÃO

### Prioridade Alta:
1. ~~**Corrigir texto sobre Técnico Judiciário**~~ ✅ **RESOLVIDO** - Texto atualizado para "Técnico que ingressou com nível médio".

### Prioridade Média:
2. ~~**Documentar limitação sobre Capacitações**~~ ✅ **RESOLVIDO** - Textos atualizados para deixar claro que cada capacitação é um conjunto de 120h composto por múltiplas ações, e a data deve ser da última ação que completou o conjunto.

### Prioridade Baixa:
3. ~~**Melhorar explicação na interface**~~ ✅ **RESOLVIDO** - Tooltip adicionada na interface para distinção entre Certificações (0,5 VR) e Capacitações 120h (0,2 VR).

---

## 📝 NOTAS ADICIONAIS

- O sistema não valida se o usuário realmente é Técnico Judiciário. A validação fica a cargo do usuário.
- O sistema assume que quando não há data informada, o item é válido (com aviso). Isso pode ser questionável juridicamente, mas é uma simplificação prática.
- O calendário limita a seleção de datas até a data de hoje (não aceita datas futuras).

---

## ✅ CORREÇÕES APLICADAS

### Data: 2025-01-08

1. **Correção do texto sobre Técnico Judiciário**
   - Antes: "Graduação (Técnico com nível superior)"
   - Depois: "Graduação (Técnico que ingressou com nível médio)"
   - Arquivo: `app.js` linha 197

2. **Correção dos textos sobre Capacitações (conjuntos de 120h)**
   - Label atualizado: "Capacitações (conjuntos de 120h)"
   - Adicionada explicação: "Cada conjunto deve totalizar pelo menos 120 horas (pode ser composto por múltiplas ações/cursos)"
   - Campo de data: "data da última ação que completou o conjunto"
   - Mensagens atualizadas para refletir que é um conjunto de 120h
   - Arquivos: `index.html` e `app.js`

### Data: 2026-01-19

1. **Tooltip de distinção entre Certificações e Capacitações**
   - Mensagem adicionada para evitar confusão entre os incisos
   - Arquivo: `index.html`

2. **Limite de data até hoje nos calendários**
   - Campos de data não permitem seleção de datas futuras
   - Arquivo: `app.js`

---

**Fim da Análise**
