# PRD – Formulário Web de Cálculo do Adicional de Qualificação (AQ)

## 1. Visão Geral

Formulário web simples e objetivo para permitir que o usuário informe suas titulações, certificações e capacitações e receba automaticamente o cálculo do **Adicional de Qualificação (AQ)**, respeitando rigorosamente as regras de acumulação, limites e tetos previstos na **Lei nº 11.416/2006**, com redação dada pela **Lei nº 15.292/2025**.

O foco do formulário é **clareza**, **segurança no cálculo** e **zero ambiguidade jurídica**.

---

## 2. Objetivo do Formulário

* Permitir ao usuário marcar quais títulos possui
* Aplicar automaticamente as regras de acumulação
* Calcular o total de VRs válidos
* Exibir o valor final em reais (com VR configurável)
* Indicar claramente o que foi considerado e o que foi descartado por limite legal

---

## 3. Público-Alvo

* Servidores do Judiciário
* Técnicos e Analistas Judiciários
* Sindicatos, RH e áreas administrativas

---

## 4. Conceitos-Chave do Negócio

### 4.1 Valor de Referência (VR)

* VR padrão configurável
* Valor inicial sugerido: **R$ 714,48**

### 4.2 Hierarquia das Titulações (ordem de importância)

1. Doutorado
2. Mestrado
3. Pós-graduação lato sensu
4. Curso de graduação (regra do 2º curso, com exceção para Técnico)
5. Certificações profissionais
6. Capacitações (120h)

---

## 5. Regras de Negócio (núcleo do formulário)

### 5.1 Doutorado

* Valor: **5 VR**
* Limite: 1 título
* Não se acumula com Mestrado (prevalece a maior titulação)
* Absorve adicionais de menor nível, exceto Capacitações (120h)

### 5.2 Mestrado

* Valor: **3,5 VR**
* Limite: 1 título
* Não se acumula com Doutorado
* Absorve adicionais de menor nível, exceto Capacitações (120h)

### 5.3 Bloco com Teto de 2 VR (regra crítica)

Os itens abaixo **competem entre si** e **somados não podem ultrapassar 2 VR**:

* Pós-graduação lato sensu (1 VR cada, máx. 2)
* Curso de graduação (1 VR, máx. 1)
* Certificações profissionais (0,5 VR cada, máx. 2)

O formulário deve:

* Somar esses itens
* Aplicar corte automático ao atingir 2 VR
* Priorizar automaticamente os títulos de maior valor

### 5.4 Capacitações (120h)

* Valor: **0,2 VR** por conjunto que totalize pelo menos 120 horas
* Limite: até 3 conjuntos (0 a 3)
* Pode ser percebido cumulativamente com qualquer outro adicional
* Vigência: válida por 4 anos, contados da última ação que completar o conjunto

### 5.5 Certificações profissionais

* Valor: **0,5 VR** por certificação
* Limite: até 2 certificações (0 a 2)
* Integra o teto de 2 VR do bloco (com Pós-graduação e Curso de graduação)
* Vigência: válida por 4 anos, contados da conclusão, independentemente do prazo de validade

### 5.6 Curso de graduação (regra do inciso VII e exceção do Técnico)

* Regra geral: AQ de curso de graduação é devido para **segundo curso de graduação** (máx. 1)
* Exceção: ao ocupante de **Técnico Judiciário** nomeado com requisito de escolaridade de nível médio ou equivalente, é assegurado o AQ para o **primeiro** curso de graduação
* Se o ingresso exigiu nível superior, aplica-se a regra geral (segunda graduação)
* Mesmo com duas graduações, o adicional é limitado a **1 VR**

### 5.7 Disposições legais adicionais (operacionais)

* As áreas e temas de interesse institucional são definidos por regulamento de cada órgão
* O AQ é devido a partir da data de apresentação do título, diploma ou certificado
* Servidor cedido não faz jus ao AQ, salvo exceções legais específicas
* VPNI vinculada ao Técnico (regra anterior) é convertida em AQ quando aplicável
* O requisito de escolaridade do cargo de Técnico deve ser considerado para aplicação da exceção do inciso VII

---

## 6. Lógica de Priorização Automática

Quando o usuário selecionar títulos que ultrapassem o teto de 2 VR:

Ordem de prioridade:

1. Pós-graduação
2. Curso de graduação
3. Certificações
4. (não aplicável às Capacitações, pois não entram no teto de 2 VR)

Itens de menor prioridade devem ser **desconsiderados automaticamente**, com aviso visual ao usuário.

---

## 7. Funcionalidades Obrigatórias

### 7.1 Formulário de Entrada

* Checkbox para Doutorado (0 ou 1)
* Checkbox para Mestrado (0 ou 1)
* Campo numérico para:

  * Pós-graduações (0 a 2)
  * Certificações (0 a 2)
  * Capacitações (0 a 3)
* Seletor de opção única para Curso de graduação (regra do inciso VII), com opção de indicar a exceção do Técnico
* Para Certificações e Capacitações: campo de data de conclusão para validação da vigência de 4 anos

### 7.2 Cálculo Automático

* Atualização em tempo real
* Cálculo em VR
* Conversão automática para reais
* Aplicação automática de:
  * Não acumulação entre Doutorado e Mestrado
  * Absorção de adicionais menores por Doutorado/Mestrado (exceto Capacitações)
  * Teto de 2 VR para Pós-graduação + Curso de graduação + Certificações
  * Vigência de 4 anos para Certificações e Capacitações

### 7.3 Resultado Detalhado

* VR total válido
* Valor em reais
* Lista de títulos considerados
* Lista de títulos descartados (por limite legal)
* Lista de itens pendentes por falta de data (quando necessária para validar vigência)

---

## 8. Requisitos Não Funcionais

* Interface simples (mobile-first)
* Linguagem clara, sem juridiquês
* Zero necessidade de login
* Cálculo 100% client-side (JavaScript)

---

## 9. Requisitos de UX/UI

* Layout em blocos por categoria
* Destaque visual para o teto de 2 VR
* Avisos claros quando algo não for computado
* Cores neutras e institucionais

---

## 10. Possíveis Evoluções Futuras

* Exportar resultado em PDF
* Simulação de cenários
* Comparativo “antes x depois”
* Parametrização para outros órgãos

---

## 11. Critério de Sucesso

* Usuário entende claramente:

  * Quanto recebe
  * Por quê
  * O que ficou de fora

Se o usuário **não tiver dúvidas após usar**, o formulário cumpriu seu papel.
