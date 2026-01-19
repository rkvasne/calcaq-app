const el = {
  vr: document.getElementById("vr"),
  doutorado: document.getElementById("doutorado"),
  mestrado: document.getElementById("mestrado"),
  pos: document.getElementById("pos"),
  // graduacao e tecnicoNivelMedio foram substituídos por radio buttons (grad_option)
  cert: document.getElementById("cert"),
  cap: document.getElementById("cap"),
  certDates: document.getElementById("certDates"),
  capDates: document.getElementById("capDates"),
  totalVR: document.getElementById("totalVR"),
  totalRS: document.getElementById("totalRS"),
  badges: document.getElementById("badges"),
  considerado: document.getElementById("considerado"),
  descartadosBox: document.getElementById("descartadosBox"),
  descartado: document.getElementById("descartado"),
  pendentesBox: document.getElementById("pendentesBox"),
  pendente: document.getElementById("pendente")
};

function getGradOption() {
  const radios = document.getElementsByName("grad_option");
  for (const radio of radios) {
    if (radio.checked) return radio.value;
  }
  return "none";
}

function clampInt(value, min, max) {
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function parseVR(value) {
  const n = Number.parseFloat(String(value));
  if (!Number.isFinite(n) || n < 0) return 714.48;
  return n;
}

function formatVR(value) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
  const expiry = addYears(d, 4);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return expiry.getTime() >= today.getTime();
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderDateInputs(container, prefix, count, labelPrefix, now) {
  const existing = {};
  container.querySelectorAll("input[type='date']").forEach(input => {
    existing[input.id] = input.value;
  });

  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = "date-row";

    const label = document.createElement("label");
    label.htmlFor = `${prefix}_date_${i}`;
    // Para capacitações, usar texto específico sobre última ação
    if (prefix === "cap") {
      label.textContent = `${labelPrefix} ${i} — data da última ação que completou o conjunto`;
    } else {
      label.textContent = `${labelPrefix} ${i} — data de conclusão`;
    }

    const input = document.createElement("input");
    input.type = "date";
    input.id = `${prefix}_date_${i}`;
    input.max = formatDateInputValue(now);
    if (existing[input.id]) input.value = existing[input.id];
    input.addEventListener("change", calcular);
    input.addEventListener("input", calcular);

    row.appendChild(label);
    row.appendChild(input);
    container.appendChild(row);
  }
}

function setList(ul, items) {
  ul.innerHTML = "";
  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum item.";
    ul.appendChild(li);
    return;
  }
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

function setBadges(items) {
  el.badges.innerHTML = "";
  items.forEach(b => {
    const span = document.createElement("span");
    span.className = `badge${b.variant ? ` badge--${b.variant}` : ""}`;
    span.textContent = b.text;
    el.badges.appendChild(span);
  });
}

function calcular() {
  const vr = parseVR(el.vr.value);
  el.vr.value = String(vr.toFixed(2));

  const now = new Date();

  const posCount = clampInt(el.pos.value, 0, 2);
  const certCount = clampInt(el.cert.value, 0, 2);
  const capCount = clampInt(el.cap.value, 0, 3);

  if (String(posCount) !== String(el.pos.value)) el.pos.value = String(posCount);
  if (String(certCount) !== String(el.cert.value)) el.cert.value = String(certCount);
  if (String(capCount) !== String(el.cap.value)) el.cap.value = String(capCount);

  renderDateInputs(el.certDates, "cert", certCount, "Certificação", now);
  renderDateInputs(el.capDates, "cap", capCount, "Conjunto de 120h", now);
  const maxRows = Math.max(certCount, capCount);
  const rootStyles = getComputedStyle(document.documentElement);
  const rowHeightValue = rootStyles.getPropertyValue("--date-row-height").trim();
  const parsedRowHeight = Number.parseFloat(rowHeightValue.replace("rem", ""));
  const rowHeightRem = Number.isFinite(parsedRowHeight) ? parsedRowHeight : 4.25;
  const minHeight = maxRows > 0 ? `${maxRows * rowHeightRem}rem` : "0";
  el.certDates.style.minHeight = minHeight;
  el.capDates.style.minHeight = minHeight;

  const considerado = [];
  const descartado = [];
  const pendente = [];
  const badges = [];

  let totalVR = 0;
  let blocoVR = 0;
  let capVR = 0;

  const hasDoutorado = el.doutorado.checked;
  const hasMestrado = el.mestrado.checked;

  let high = null;
  if (hasDoutorado || hasMestrado) {
    if (hasDoutorado && hasMestrado) {
      high = { nome: "Doutorado", valor: 5 };
      descartado.push("Mestrado — não se acumula com Doutorado.");
    } else if (hasDoutorado) {
      high = { nome: "Doutorado", valor: 5 };
    } else {
      high = { nome: "Mestrado", valor: 3.5 };
    }

    totalVR += high.valor;
    considerado.push(`${high.nome}: ${formatVR(high.valor)} VR`);
    badges.push({ text: `${high.nome} aplicado`, variant: "ok" });
    badges.push({ text: "Absorção de menores (exceto capacitações)", variant: "warn" });
  }

  if (high) {
    const anyPos = posCount > 0;
    const gradOpt = getGradOption();
    const anyGrad = gradOpt !== "none";
    const anyCert = certCount > 0;
    if (anyPos) descartado.push(`Pós-graduação lato sensu (${posCount}) — absorvido por ${high.nome}.`);
    if (anyGrad) descartado.push(`Curso de graduação — absorvido por ${high.nome}.`);
    if (anyCert) descartado.push(`Certificações profissionais (${certCount}) — absorvido por ${high.nome}.`);
  } else {
    badges.push({ text: "Teto: 2 VR (pós/grad/cert)", variant: "ok" });

    const itens = [];
    for (let i = 1; i <= posCount; i++) {
      itens.push({ nome: `Pós-graduação lato sensu ${i}`, valor: 1, prioridade: 1 });
    }

    const gradOpt = getGradOption();
    if (gradOpt !== "none") {
      let nota = "";
      if (gradOpt === "tecnico") {
        nota = "Graduação (Técnico que ingressou com nível médio)";
      } else if (gradOpt === "second") {
        nota = "2ª Graduação (Analista ou Técnico com duas graduações)";
      }
      if (nota) itens.push({ nome: nota, valor: 1, prioridade: 2 });
    }

    for (let i = 1; i <= certCount; i++) {
      const dateEl = document.getElementById(`cert_date_${i}`);
      const dateStr = dateEl ? dateEl.value : "";
      
      // Se não tem data, assume válido com aviso
      if (!dateStr) {
        itens.push({ nome: `Certificação ${i}`, valor: 0.5, prioridade: 3, warning: "data não informada (assumindo válido)" });
        pendente.push(`Certificação ${i} — sem data (considerado no cálculo, verifique a validade de 4 anos).`);
        continue;
      }

      const vigente = isWithinFourYears(dateStr, now);
      if (!vigente) {
        descartado.push(`Certificação ${i} — fora da vigência de 4 anos.`);
        continue;
      }
      itens.push({ nome: `Certificação ${i}`, valor: 0.5, prioridade: 3 });
    }

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

    totalVR += blocoVR;
  }

  for (let i = 1; i <= capCount; i++) {
    const dateEl = document.getElementById(`cap_date_${i}`);
    const dateStr = dateEl ? dateEl.value : "";
    
    // Se não tem data, assume válido com aviso
    if (!dateStr) {
       capVR += 0.2;
       considerado.push(`Conjunto de 120h ${i}: ${formatVR(0.2)} VR (data não informada)`);
       pendente.push(`Conjunto de 120h ${i} — sem data da última ação (considerado no cálculo, verifique a validade de 4 anos).`);
       continue;
    }

    const vigente = isWithinFourYears(dateStr, now);
    if (!vigente) {
      descartado.push(`Conjunto de 120h ${i} — fora da vigência de 4 anos (data da última ação: ${dateStr}).`);
      continue;
    }
    capVR += 0.2;
    considerado.push(`Conjunto de 120h ${i}: ${formatVR(0.2)} VR (última ação: ${dateStr})`);
  }

  totalVR += capVR;

  if (!high) badges.push({ text: `Bloco: ${formatVR(blocoVR)}/2,00 VR`, variant: blocoVR > 0 ? "ok" : "" });
  badges.push({ text: `Capacitações: ${formatVR(capVR)} VR`, variant: capVR > 0 ? "ok" : "" });
  if (pendente.length > 0) badges.push({ text: "Verifique as datas", variant: "warn" });

  const totalRS = totalVR * vr;

  el.totalVR.textContent = formatVR(totalVR);
  el.totalRS.textContent = formatBRL(totalRS);

  setBadges(badges);
  setList(el.considerado, considerado);

  el.descartadosBox.style.display = descartado.length > 0 ? "block" : "none";
  setList(el.descartado, descartado);

  el.pendentesBox.style.display = pendente.length > 0 ? "block" : "none";
  setList(el.pendente, pendente);
  
  updateAdvice(totalVR, blocoVR, capVR, high, posCount, certCount, capCount, getGradOption() !== "none");
}

function updateAdvice(totalVR, blocoVR, capVR, high, posCount, certCount, capCount, hasGrad) {
  const div = document.getElementById("adviceBox");
  if(!div) return;
  
  let msg = "";
  
  // Cenário 1: Não atingiu teto de capacitação (0.6 VR)
  if (capVR < 0.6) {
     const missing = (3 - capCount);
     if (missing > 0) {
       msg += `<p>💡 <strong>Dica rápida:</strong> Você ainda pode acumular mais <strong>${missing} conjunto(s) de 120h</strong>. Cada conjunto adiciona 0,2 VR ao seu total, independente de outros títulos. Lembre-se: cada conjunto deve totalizar pelo menos 120 horas (pode ser composto por múltiplas ações/cursos).</p>`;
     }
  }
  
  // Cenário 2: Bloco de 2 VR incompleto (sem Doutorado/Mestrado)
  if (!high && blocoVR < 2) {
      if (!hasGrad && posCount < 2) {
         msg += `<p>📚 <strong>Maximize seu AQ:</strong> Você ainda não atingiu o teto de 2 VR do bloco (Pós/Grad/Cert). Considere fazer uma <strong>Pós-Graduação</strong> (1 VR) ou obter <strong>Certificações</strong> (0,5 VR cada) para preencher esse espaço.</p>`;
      } else if (posCount < 2) {
         msg += `<p>🎓 <strong>Pós-graduação:</strong> Você pode acumular até 2 Pós-graduações. Se tiver apenas 1 ou nenhuma, é uma ótima forma de aumentar seu AQ (1 VR cada), respeitando o teto de 2 VR.</p>`;
      }
  }

  // Cenário 3: Tem Mestrado mas poderia ter Doutorado
  if (high && high.nome === "Mestrado") {
     msg += `<p>🚀 <strong>Próximo nível:</strong> Com um <strong>Doutorado</strong>, você subiria de 3,5 VR para 5 VR. É o topo da carreira em termos de qualificação.</p>`;
  }
  
  if (msg === "") {
     msg = `<p>🎉 <strong>Parabéns!</strong> Você parece estar aproveitando bem as possibilidades do AQ. Mantenha suas certificações e capacitações em dia (validade de 4 anos) para não perder valores.</p>`;
  }
  
  div.innerHTML = `<h3>Dica para melhorar seu AQ</h3>${msg}`;
  div.style.display = "block";
}

[
  el.vr,
  el.doutorado,
  el.mestrado,
  el.pos,
  el.cert,
  el.cap
].filter(Boolean).forEach(node => {
  node.addEventListener("change", calcular);
  node.addEventListener("input", calcular);
});

document.getElementsByName("grad_option").forEach(radio => {
  radio.addEventListener("change", calcular);
});

calcular();
