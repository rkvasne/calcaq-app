/**
 * Regras puras do Adicional de Qualificação (AQ).
 * Sem DOM — testável em Node e usável no navegador via script tag.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AqCalc = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const CONFIG = {
    VR_PADRAO: 714.48,
    TETO_BLOCO: 2.0,
    VIGENCIA_ANOS: 4,
    VALOR_DOUTORADO: 5.0,
    VALOR_MESTRADO: 3.5,
    VALOR_POS: 1.0,
    VALOR_GRAD: 1.0,
    VALOR_CERT: 0.5,
    VALOR_CAP: 0.2,
    MAX_POS: 2,
    MAX_CERT: 2,
    MAX_CAP: 3,
  };

  function clampInt(value, min, max) {
    const n = Number.parseInt(String(value), 10);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function parseVR(value) {
    const n = Number.parseFloat(String(value));
    if (!Number.isFinite(n) || n < 0) return CONFIG.VR_PADRAO;
    return n;
  }

  function formatVR(value) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatBRL(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function addYears(date, years) {
    const d = new Date(date.getTime());
    d.setFullYear(d.getFullYear() + years);
    return d;
  }

  function parseDateOnly(dateStr) {
    if (!dateStr) return null;
    const d = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }

  function isWithinFourYears(dateStr, now) {
    const d = parseDateOnly(dateStr);
    if (!d) return null;
    const expiry = addYears(d, CONFIG.VIGENCIA_ANOS);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return expiry.getTime() >= today.getTime();
  }

  /**
   * @param {object} input
   * @param {number|string} [input.vr]
   * @param {boolean} input.doutorado
   * @param {boolean} input.mestrado
   * @param {number|string} input.posCount
   * @param {number|string} input.certCount
   * @param {number|string} input.capCount
   * @param {"none"|"second"|"tecnico"} input.gradOption
   * @param {string[]} [input.certDates] datas ISO por índice 0..n-1
   * @param {string[]} [input.capDates]
   * @param {Date} [input.now]
   */
  function calcularAQ(input) {
    const now = input.now instanceof Date ? input.now : new Date();
    const vr = parseVR(input.vr);
    const posCount = clampInt(input.posCount, 0, CONFIG.MAX_POS);
    const certCount = clampInt(input.certCount, 0, CONFIG.MAX_CERT);
    const capCount = clampInt(input.capCount, 0, CONFIG.MAX_CAP);
    const gradOption = input.gradOption || "none";
    const certDates = Array.isArray(input.certDates) ? input.certDates : [];
    const capDates = Array.isArray(input.capDates) ? input.capDates : [];

    const considerado = [];
    const descartado = [];
    const pendente = [];
    const badges = [];

    let totalVR = 0;
    let blocoVR = 0;
    let capVR = 0;

    const hasDoutorado = Boolean(input.doutorado);
    const hasMestrado = Boolean(input.mestrado);

    let high = null;
    if (hasDoutorado || hasMestrado) {
      if (hasDoutorado && hasMestrado) {
        high = { nome: "Doutorado", valor: CONFIG.VALOR_DOUTORADO };
        descartado.push("Mestrado — não se acumula com Doutorado.");
      } else if (hasDoutorado) {
        high = { nome: "Doutorado", valor: CONFIG.VALOR_DOUTORADO };
      } else {
        high = { nome: "Mestrado", valor: CONFIG.VALOR_MESTRADO };
      }

      totalVR += high.valor;
      considerado.push(`${high.nome}: ${formatVR(high.valor)} VR`);
      badges.push({ text: `${high.nome} aplicado`, variant: "ok" });
      badges.push({
        text: "Absorção de menores (exceto capacitações)",
        variant: "warn",
      });
    }

    if (high) {
      if (posCount > 0) {
        descartado.push(
          `Pós-graduação lato sensu (${posCount}) — absorvido por ${high.nome}.`,
        );
      }
      if (gradOption !== "none") {
        descartado.push(`Curso de graduação — absorvido por ${high.nome}.`);
      }
      if (certCount > 0) {
        descartado.push(
          `Certificações profissionais (${certCount}) — absorvido por ${high.nome}.`,
        );
      }
    } else {
      badges.push({
        text: `Teto: ${formatVR(CONFIG.TETO_BLOCO)} VR (pós/grad/cert)`,
        variant: "ok",
      });

      const itens = [];
      for (let i = 1; i <= posCount; i++) {
        itens.push({
          nome: `Pós-graduação lato sensu ${i}`,
          valor: CONFIG.VALOR_POS,
          prioridade: 1,
        });
      }

      if (gradOption !== "none") {
        let nota = "";
        if (gradOption === "tecnico") {
          nota = "Graduação (Técnico que ingressou com nível médio)";
        } else if (gradOption === "second") {
          nota = "2ª Graduação (Analista ou Técnico com duas graduações)";
        }
        if (nota) {
          itens.push({ nome: nota, valor: CONFIG.VALOR_GRAD, prioridade: 2 });
        }
      }

      for (let i = 1; i <= certCount; i++) {
        const dateStr = certDates[i - 1] || "";
        if (!dateStr) {
          itens.push({
            nome: `Certificação ${i}`,
            valor: CONFIG.VALOR_CERT,
            prioridade: 3,
            warning: "data não informada (assumindo válido)",
          });
          pendente.push(
            `Certificação ${i} — sem data (considerado no cálculo, verifique a validade de 4 anos).`,
          );
          continue;
        }

        const vigente = isWithinFourYears(dateStr, now);
        if (!vigente) {
          descartado.push(`Certificação ${i} — fora da vigência de 4 anos.`);
          continue;
        }
        itens.push({
          nome: `Certificação ${i}`,
          valor: CONFIG.VALOR_CERT,
          prioridade: 3,
        });
      }

      itens.sort((a, b) => a.prioridade - b.prioridade);

      const teto = CONFIG.TETO_BLOCO;
      itens.forEach((item) => {
        if (blocoVR + item.valor <= teto) {
          blocoVR += item.valor;
          let text = `${item.nome}: ${formatVR(item.valor)} VR`;
          if (item.warning) text += ` (${item.warning})`;
          considerado.push(text);
        } else {
          descartado.push(
            `${item.nome}: ${formatVR(item.valor)} VR — excedeu o teto de ${formatVR(teto)} VR.`,
          );
        }
      });

      totalVR += blocoVR;
    }

    for (let i = 1; i <= capCount; i++) {
      const dateStr = capDates[i - 1] || "";
      if (!dateStr) {
        capVR += CONFIG.VALOR_CAP;
        considerado.push(
          `Conjunto de 120h ${i}: ${formatVR(CONFIG.VALOR_CAP)} VR (data não informada)`,
        );
        pendente.push(
          `Conjunto de 120h ${i} — sem data da última ação (considerado no cálculo, verifique a validade de 4 anos).`,
        );
        continue;
      }

      const vigente = isWithinFourYears(dateStr, now);
      if (!vigente) {
        descartado.push(
          `Conjunto de 120h ${i} — fora da vigência de 4 anos (data da última ação: ${dateStr}).`,
        );
        continue;
      }
      capVR += CONFIG.VALOR_CAP;
      considerado.push(
        `Conjunto de 120h ${i}: ${formatVR(CONFIG.VALOR_CAP)} VR (última ação: ${dateStr})`,
      );
    }

    totalVR += capVR;

    if (!high) {
      badges.push({
        text: `Bloco: ${formatVR(blocoVR)}/${formatVR(CONFIG.TETO_BLOCO)} VR`,
        variant: blocoVR > 0 ? "ok" : "",
      });
    }
    badges.push({
      text: `Capacitações: ${formatVR(capVR)} VR`,
      variant: capVR > 0 ? "ok" : "",
    });
    if (pendente.length > 0) {
      badges.push({ text: "Itens considerados sem data", variant: "warn" });
    }

    return {
      vr,
      totalVR,
      totalRS: totalVR * vr,
      blocoVR,
      capVR,
      high,
      posCount,
      certCount,
      capCount,
      gradOption,
      considerado,
      descartado,
      pendente,
      badges,
      formatted: {
        totalVR: formatVR(totalVR),
        totalRS: formatBRL(totalVR * vr),
      },
    };
  }

  return {
    CONFIG,
    clampInt,
    parseVR,
    formatVR,
    formatBRL,
    isWithinFourYears,
    calcularAQ,
  };
});
