/**
 * Testes unitários das regras AQ (aq-calc.js).
 * Rodar: npm test
 */
const {
  CONFIG,
  clampInt,
  isWithinFourYears,
  calcularAQ,
} = require("../aq-calc.js");

const TESTS = { passed: 0, failed: 0, total: 0 };

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

function approx(a, b, eps = 1e-9) {
  return Math.abs(a - b) < eps;
}

function base(overrides = {}) {
  return {
    vr: CONFIG.VR_PADRAO,
    doutorado: false,
    mestrado: false,
    posCount: 0,
    certCount: 0,
    capCount: 0,
    gradOption: "none",
    certDates: [],
    capDates: [],
    now: new Date("2026-01-19"),
    ...overrides,
  };
}

function testHelpers() {
  const now = new Date("2026-01-19");
  assert(
    isWithinFourYears("2025-01-01", now) === true,
    "vigência: data recente válida",
  );
  assert(
    isWithinFourYears("2022-01-19", now) === true,
    "vigência: data limite exata válida",
  );
  assert(
    isWithinFourYears("2021-12-31", now) === false,
    "vigência: data antiga inválida",
  );

  assert(clampInt(5, 0, 2) === 2, "clamp: respeita máximo");
  assert(clampInt(-1, 0, 2) === 0, "clamp: respeita mínimo");
  assert(clampInt(1, 0, 2) === 1, "clamp: mantém válido");
  assert(clampInt("texto", 0, 2) === 0, "clamp: input inválido");
}

function testCriticalScenarios() {
  // 1. Doutorado + Mestrado → só Doutorado (5 VR)
  {
    const r = calcularAQ(base({ doutorado: true, mestrado: true }));
    assert(approx(r.totalVR, 5), "cenário1: total 5 VR (só Doutorado)");
    assert(
      r.descartado.some((d) => d.includes("Mestrado")),
      "cenário1: Mestrado descartado",
    );
  }

  // 2. 2 Pós + 1 Grad → teto 2 VR (não 3)
  {
    const r = calcularAQ(base({ posCount: 2, gradOption: "second" }));
    assert(approx(r.totalVR, 2), "cenário2: teto 2 VR com 2 Pós + Grad");
    assert(approx(r.blocoVR, 2), "cenário2: bloco 2 VR");
    assert(
      r.descartado.some((d) => d.includes("excedeu o teto")),
      "cenário2: Grad descartada pelo teto",
    );
  }

  // 3. 2 Pós + 1 Grad + 2 Cert → 2 VR (Pós; Grad/Cert fora do teto)
  {
    const r = calcularAQ(
      base({
        posCount: 2,
        gradOption: "second",
        certCount: 2,
        certDates: ["2025-01-01", "2025-01-01"],
      }),
    );
    assert(approx(r.totalVR, 2), "cenário3: total 2 VR (prioridade Pós)");
    assert(
      r.considerado.filter((c) => c.includes("Pós-graduação")).length === 2,
      "cenário3: duas Pós consideradas",
    );
  }

  // 4. Capacitações acumulam com Doutorado
  {
    const r = calcularAQ(
      base({
        doutorado: true,
        capCount: 2,
        capDates: ["2025-06-01", "2025-06-01"],
      }),
    );
    assert(approx(r.totalVR, 5.4), "cenário4: Doutorado + 2 caps = 5,4 VR");
    assert(approx(r.capVR, 0.4), "cenário4: caps 0,4 VR");
  }

  // 5. Datas > 4 anos descartadas
  {
    const r = calcularAQ(
      base({
        certCount: 1,
        certDates: ["2020-01-01"],
        now: new Date("2026-01-19"),
      }),
    );
    assert(approx(r.totalVR, 0), "cenário5: cert expirada = 0 VR");
    assert(
      r.descartado.some((d) => d.includes("vigência")),
      "cenário5: mensagem de vigência",
    );
  }

  // 6. Técnico nível médio: primeira graduação conta
  {
    const r = calcularAQ(base({ gradOption: "tecnico" }));
    assert(approx(r.totalVR, 1), "cenário6: técnico com graduação = 1 VR");
    assert(
      r.considerado.some((c) => c.includes("Técnico")),
      "cenário6: rótulo de técnico",
    );
  }
}

function testEdgeCases() {
  {
    const r = calcularAQ(base({ certCount: 1, certDates: [""] }));
    assert(approx(r.totalVR, 0.5), "edge: cert sem data ainda conta 0,5 VR");
    assert(r.pendente.length === 1, "edge: gera pendência de data");
  }

  {
    const r = calcularAQ(
      base({
        doutorado: true,
        posCount: 2,
        certCount: 1,
        gradOption: "second",
      }),
    );
    assert(approx(r.totalVR, 5), "edge: com Doutorado bloco é absorvido");
    assert(
      r.descartado.filter((d) => d.includes("absorvido")).length >= 2,
      "edge: pós/grad/cert absorvidos",
    );
  }

  {
    const r = calcularAQ(base({ vr: -10 }));
    assert(approx(r.vr, CONFIG.VR_PADRAO), "edge: VR inválido cai no padrão");
  }
}

function runTests() {
  console.log("🚀 Testes aq-calc (regras AQ)...");
  testHelpers();
  testCriticalScenarios();
  testEdgeCases();
  console.log("---");
  console.log(
    `Total: ${TESTS.total} | Passou: ${TESTS.passed} | Falhou: ${TESTS.failed}`,
  );
  if (TESTS.failed > 0) process.exitCode = 1;
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
