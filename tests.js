/**
 * Testes Unitários Simples para a Lógica de Cálculo
 * 
 * Como rodar: 
 * Este arquivo pode ser executado diretamente no console do navegador (copie e cole) 
 * ou integrado ao build futuramente. Por enquanto, serve como documentação executável.
 */

// Mock das funções do app.js para teste isolado (se necessário)
// Aqui vamos testar a lógica pura. Em um ambiente real, importaríamos as funções.

const TESTS = {
  passed: 0,
  failed: 0,
  total: 0
};

function assert(condition, message) {
  TESTS.total++;
  if (condition) {
    TESTS.passed++;
    console.log(`✅ PASS: ${message}`);
  } else {
    TESTS.failed++;
    console.error(`❌ FAIL: ${message}`);
  }
}

function runTests() {
  console.log("🚀 Iniciando testes de regras de negócio...");

  // 1. Teste de Vigência (4 anos)
  testVigencia();

  // 2. Teste de Limites (Clamp)
  testClamp();

  // 3. Resumo
  console.log("---");
  console.log(`Total: ${TESTS.total} | Passou: ${TESTS.passed} | Falhou: ${TESTS.failed}`);
}

function testVigencia() {
  // Simulando a função isWithinFourYears do app.js
  const now = new Date("2026-01-19");
  
  // Caso 1: Data recente (Válido)
  // 2025-01-01 + 4 anos = 2029-01-01 (Maior que 2026) -> True
  assert(mockIsWithinFourYears("2025-01-01", now) === true, "Data recente deve ser válida");

  // Caso 2: Data limite exata (Válido)
  // 2022-01-19 + 4 anos = 2026-01-19 (Igual a hoje) -> True
  assert(mockIsWithinFourYears("2022-01-19", now) === true, "Data limite exata deve ser válida");

  // Caso 3: Data expirada (Inválido)
  // 2021-12-31 + 4 anos = 2025-12-31 (Menor que 2026) -> False
  assert(mockIsWithinFourYears("2021-12-31", now) === false, "Data antiga deve ser inválida");
}

function testClamp() {
  // Simulando clampInt
  const clamp = (v, min, max) => Math.min(max, Math.max(min, Number(v) || min));

  assert(clamp(5, 0, 2) === 2, "Deve respeitar o máximo");
  assert(clamp(-1, 0, 2) === 0, "Deve respeitar o mínimo");
  assert(clamp(1, 0, 2) === 1, "Deve manter valor válido");
  assert(clamp("texto", 0, 2) === 0, "Deve tratar input inválido");
}

// Lógica duplicada para teste (idealmente seria importada)
function mockIsWithinFourYears(dateStr, now) {
  const d = new Date(`${dateStr}T00:00:00`);
  const expiry = new Date(d.getTime());
  expiry.setFullYear(expiry.getFullYear() + 4);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return expiry.getTime() >= today.getTime();
}

// Executar se estiver no navegador
if (typeof window !== "undefined") {
  window.runTests = runTests;
  console.log("Para rodar os testes, digite 'runTests()' no console.");
}

// Export para Node (se configurado)
if (typeof module !== "undefined") module.exports = { runTests };
