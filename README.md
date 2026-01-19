# 📊 Calculadora de Adicional de Qualificação (AQ)

<div align="center">

**Formulário Web para Cálculo do Adicional de Qualificação**  
*Baseado nas Leis 11.416/2006 e 15.292/2025*

[![Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-orange.svg?style=for-the-badge)](LICENSE.md)

[Documentação](#-documentação) • [Regras de Negócio](#-regras-de-negócio) • [Como Usar](#-como-usar) • [Desenvolvimento](#-desenvolvimento)

</div>

---

## 📋 Sobre o Projeto

Formulário web simples e objetivo para calcular o **Adicional de Qualificação (AQ)** para servidores do Judiciário. O formulário permite que o usuário informe suas titulações, certificações e capacitações e receba automaticamente o cálculo, respeitando rigorosamente as regras de acumulação, limites e tetos previstos na **Lei nº 11.416/2006**, com redação dada pela **Lei nº 15.292/2025**.

### 🎯 Objetivo

- ✅ Permitir ao usuário marcar quais títulos possui
- ✅ Aplicar automaticamente as regras de acumulação
- ✅ Calcular o total de VRs válidos
- ✅ Exibir o valor final em reais (com VR configurável)
- ✅ Indicar claramente o que foi considerado e o que foi descartado por limite legal

### 👥 Público-Alvo

- Servidores do Judiciário
- Técnicos e Analistas Judiciários
- Sindicatos, RH e áreas administrativas

---

## 🚀 Como Usar

### Versão Online

Simplesmente abra o arquivo `index.html` em qualquer navegador moderno. Não é necessário instalação ou servidor.

### Recursos Principais

1. **Configuração do VR**: Ajuste o Valor de Referência conforme necessário (padrão: R$ 714,48)
2. **Formulário Intuitivo**: Preencha suas qualificações seguindo a ordem hierárquica
3. **Cálculo Automático**: O resultado é atualizado em tempo real
4. **Resultado Detalhado**: Veja o que foi considerado, descartado ou pendente

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [PRD.md](PRD.md) | Product Requirements Document - Especificações completas |
| [AGENTS.md](AGENTS.md) | Instruções para agentes de IA trabalharem no projeto |
| [CHANGELOG.md](CHANGELOG.md) | Histórico de mudanças do projeto |

---

## 📖 Regras de Negócio

### Hierarquia das Titulações

1. **Doutorado** - 5 VR
2. **Mestrado** - 3,5 VR
3. **Pós-graduação lato sensu** - 1 VR cada (máx. 2)
4. **Curso de graduação** - 1 VR (regra especial para Técnicos)
5. **Certificações profissionais** - 0,5 VR cada (máx. 2)
6. **Capacitações (120h)** - 0,2 VR por conjunto (máx. 3)

### Regras Principais

#### Doutorado e Mestrado
- **Não se acumulam** entre si (prevalece a maior)
- **Absorvem** adicionais de menor nível, **exceto** Capacitações (120h)

#### Bloco com Teto de 2 VR
Os seguintes itens **competem entre si** e somados **não podem ultrapassar 2 VR**:
- Pós-graduação lato sensu (1 VR cada, máx. 2)
- Curso de graduação (1 VR, máx. 1)
- Certificações profissionais (0,5 VR cada, máx. 2)

**Priorização automática:**
1. Pós-graduação
2. Curso de graduação
3. Certificações

#### Capacitações (120h)
- **Valor**: 0,2 VR por conjunto que totalize pelo menos 120 horas
- **Limite**: até 3 conjuntos (0 a 3)
- **Acumulação**: Pode ser percebido cumulativamente com qualquer outro adicional
- **Vigência**: 4 anos, contados da última ação que completar o conjunto

#### Certificações Profissionais
- **Valor**: 0,5 VR por certificação
- **Limite**: até 2 certificações (0 a 2)
- **Vigência**: 4 anos, contados da conclusão
- **Teto**: Integra o bloco de 2 VR com Pós-graduação e Graduação

#### Curso de Graduação (Inciso VII)
- **Regra geral**: AQ devido para **segundo curso de graduação** (máx. 1)
- **Exceção**: Técnico Judiciário nomeado com exigência de nível médio pode receber AQ para o **primeiro** curso de graduação
- **Limite**: Mesmo com duas graduações, o adicional é limitado a 1 VR

---

## 🛠️ Desenvolvimento

### Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna (variáveis CSS, Grid, Flexbox)
- **JavaScript (Vanilla)** - Lógica de cálculo e interatividade
- **Sem dependências externas** - Totalmente client-side

### Estrutura do Projeto

```
calcaq-app/
├── index.html              # Página principal
├── app.js                  # Lógica de cálculo
├── style.css               # Estilos
├── PRD.md                  # Especificações
├── AGENTS.md               # Instruções para IA
├── ANALISE_INCONSISTENCIAS.md  # Análise técnica
├── L11416.pdf              # Lei 11.416/2006
├── L15292.pdf              # Lei 15.292/2025
└── tabela_aq_2026.jpg      # Tabela de referência
```

### Características Técnicas

136:- ✅ **Zero dependências** - Funciona offline
137:- ✅ **Mobile-first** - Design responsivo
138:- ✅ **Acessível** - ARIA labels, navegação por teclado e contraste adequado (WCAG)
139:- ✅ **Performático** - Cálculo client-side em tempo real

---

## 📝 Convenções

### Nomenclatura
- Arquivos: `kebab-case` (ex: `analise-inconsistencias.md`)
- Variáveis JavaScript: `camelCase`
- Classes CSS: `kebab-case` com BEM quando necessário

### Commits (Conventional Commits)

```bash
tipo(escopo): descrição

# Tipos:
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Testes
chore: Manutenção
```

**Exemplos:**
```
feat(calculo): adicionar validação de vigência de 4 anos
fix(ui): corrigir espaçamento entre cards
docs: atualizar PRD com regra de capacitações
```

---

## ✅ Requisitos Não Funcionais

- ✅ Interface simples e intuitiva
- ✅ Linguagem clara, sem juridiquês
- ✅ Zero necessidade de login
- ✅ Cálculo 100% client-side
- ✅ Compatibilidade com navegadores modernos

---

## 🔍 Validação e Qualidade

### Checklist Pre-Commit

- [ ] Cálculo funciona corretamente para todos os cenários
- [ ] Interface responsiva (mobile e desktop)
- [ ] Sem erros no console do navegador
- [ ] Textos claros e sem ambiguidades
- [ ] Links e referências legais funcionando

### Testes Manuais Recomendados

1. **Cenário 1**: Doutorado + Capacitações (deve absorver outros, exceto capacitações)
2. **Cenário 2**: Teto de 2 VR (testar com combinações que excedam)
3. **Cenário 3**: Vigência de 4 anos (datas válidas e inválidas)
4. **Cenário 4**: Técnico com nível médio (exceção do inciso VII)
5. **Cenário 5**: Múltiplas capacitações (até 3 conjuntos)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

---

## ⚠️ Aviso Legal

Este formulário é apenas uma **análise preliminar** e **não constitui ferramenta oficial**. Os resultados são estimativos e podem conter inconsistências. O reconhecimento de títulos, certificações, capacitações e o pagamento do AQ dependem do órgão/tribunal competente, do regulamento interno e das normas aplicáveis.

---

## 🔗 Referências Legais

- [Lei nº 11.416/2006](https://www.planalto.gov.br/ccivil_03/_Ato2004-2006/2006/Lei/L11416.htm)
- [Lei nº 15.292/2025](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15292.htm)

---

**Última atualização:** Janeiro 2026
