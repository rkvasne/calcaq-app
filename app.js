/* global AqCalc */
const { CONFIG, clampInt, formatVR, calcularAQ } = AqCalc;

const el = {
  vr: document.getElementById("vr"),
  doutorado: document.getElementById("doutorado"),
  mestrado: document.getElementById("mestrado"),
  pos: document.getElementById("pos"),
  cert: document.getElementById("cert"),
  cap: document.getElementById("cap"),
  certDates: document.getElementById("certDates"),
  capDates: document.getElementById("capDates"),
  certHint: document.getElementById("certHint"),
  certAlert: document.getElementById("certAlert"),
  capHint: document.getElementById("capHint"),
  capAlert: document.getElementById("capAlert"),
  totalVR: document.getElementById("totalVR"),
  totalRS: document.getElementById("totalRS"),
  badges: document.getElementById("badges"),
  considerado: document.getElementById("considerado"),
  descartadosBox: document.getElementById("descartadosBox"),
  descartado: document.getElementById("descartado"),
  pendentesBox: document.getElementById("pendentesBox"),
  pendente: document.getElementById("pendente"),
  adviceBox: document.getElementById("adviceBox"),
};

function getGradOption() {
  const radios = document.getElementsByName("grad_option");
  for (const radio of radios) {
    if (radio.checked) return radio.value;
  }
  return "none";
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderDateInputs(container, prefix, count, labelPrefix, now) {
  if (!container) return;
  const existing = {};
  container.querySelectorAll("input[type='date']").forEach((input) => {
    existing[input.id] = input.value;
  });

  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const row = document.createElement("div");
    row.className = "date-row";

    const label = document.createElement("label");
    label.htmlFor = `${prefix}_date_${i}`;
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
  if (!ul) return;
  ul.innerHTML = "";
  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum item.";
    ul.appendChild(li);
    return;
  }
  items.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

function setBadges(items) {
  if (!el.badges) return;
  el.badges.innerHTML = "";
  items.forEach((b) => {
    const span = document.createElement("span");
    span.className = `badge${b.variant ? ` badge--${b.variant}` : ""}`;
    span.textContent = b.text;
    el.badges.appendChild(span);
  });
}

function collectDates(prefix, count) {
  const dates = [];
  for (let i = 1; i <= count; i++) {
    const dateEl = document.getElementById(`${prefix}_date_${i}`);
    dates.push(dateEl ? dateEl.value : "");
  }
  return dates;
}

function setDisplay(node, show) {
  if (!node) return;
  node.style.display = show ? "block" : "none";
}

function calcular() {
  const now = new Date();
  const posCount = clampInt(el.pos.value, 0, CONFIG.MAX_POS);
  const certCount = clampInt(el.cert.value, 0, CONFIG.MAX_CERT);
  const capCount = clampInt(el.cap.value, 0, CONFIG.MAX_CAP);

  if (String(posCount) !== String(el.pos.value))
    el.pos.value = String(posCount);
  if (String(certCount) !== String(el.cert.value))
    el.cert.value = String(certCount);
  if (String(capCount) !== String(el.cap.value))
    el.cap.value = String(capCount);

  setDisplay(el.capHint, capCount > 0);
  setDisplay(el.capAlert, capCount > 0);
  setDisplay(el.certHint, certCount > 0);
  setDisplay(el.certAlert, certCount > 0);

  renderDateInputs(el.certDates, "cert", certCount, "Certificação", now);
  renderDateInputs(el.capDates, "cap", capCount, "Conjunto de 120h", now);

  const result = calcularAQ({
    vr: el.vr.value,
    doutorado: el.doutorado.checked,
    mestrado: el.mestrado.checked,
    posCount,
    certCount,
    capCount,
    gradOption: getGradOption(),
    certDates: collectDates("cert", certCount),
    capDates: collectDates("cap", capCount),
    now,
  });

  el.vr.value = String(result.vr.toFixed(2));
  el.totalVR.textContent = result.formatted.totalVR;
  el.totalRS.textContent = result.formatted.totalRS;

  setBadges(result.badges);
  setList(el.considerado, result.considerado);
  setDisplay(el.descartadosBox, result.descartado.length > 0);
  setList(el.descartado, result.descartado);
  setDisplay(el.pendentesBox, result.pendente.length > 0);
  setList(el.pendente, result.pendente);

  updateAdvice(result);
}

function updateAdvice(result) {
  const div = el.adviceBox;
  if (!div) return;

  div.textContent = "";

  const h3 = document.createElement("h3");
  h3.textContent = "Dica para melhorar seu AQ";
  div.appendChild(h3);

  let hasAdvice = false;
  const { high, blocoVR, capVR, posCount, capCount, gradOption } = result;
  const hasGrad = gradOption !== "none";

  const addAdvice = (emoji, title, text) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${emoji} ${title}: `;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(text));
    div.appendChild(p);
    hasAdvice = true;
  };

  const tetoCap = CONFIG.MAX_CAP * CONFIG.VALOR_CAP;
  if (capVR < tetoCap) {
    const missing = CONFIG.MAX_CAP - capCount;
    if (missing > 0) {
      addAdvice(
        "💡",
        "Dica rápida",
        `Você ainda pode acumular mais ${missing} conjunto(s) de 120h. Cada conjunto adiciona ${formatVR(CONFIG.VALOR_CAP)} VR ao seu total, independente de outros títulos. Lembre-se: cada conjunto deve totalizar pelo menos 120 horas (pode ser composto por múltiplas ações/cursos).`,
      );
    }
  }

  if (!high && blocoVR < CONFIG.TETO_BLOCO) {
    if (!hasGrad && posCount < CONFIG.MAX_POS) {
      addAdvice(
        "📚",
        "Maximize seu AQ",
        `Você ainda não atingiu o teto de ${formatVR(CONFIG.TETO_BLOCO)} VR do bloco (Pós/Grad/Cert). Considere fazer uma Pós-Graduação (${formatVR(CONFIG.VALOR_POS)} VR) ou obter Certificações (${formatVR(CONFIG.VALOR_CERT)} VR cada) para preencher esse espaço.`,
      );
    } else if (posCount < CONFIG.MAX_POS) {
      addAdvice(
        "🎓",
        "Pós-graduação",
        `Você pode acumular até ${CONFIG.MAX_POS} Pós-graduações. Se tiver apenas 1 ou nenhuma, é uma ótima forma de aumentar seu AQ (${formatVR(CONFIG.VALOR_POS)} VR cada), respeitando o teto de ${formatVR(CONFIG.TETO_BLOCO)} VR.`,
      );
    }
  }

  if (high && high.nome === "Mestrado") {
    addAdvice(
      "🚀",
      "Próximo nível",
      `Com um Doutorado, você subiria de ${formatVR(CONFIG.VALOR_MESTRADO)} VR para ${formatVR(CONFIG.VALOR_DOUTORADO)} VR. É o topo da carreira em termos de qualificação.`,
    );
  }

  if (!hasAdvice) {
    addAdvice(
      "🎉",
      "Parabéns!",
      "Você parece estar aproveitando bem as possibilidades do AQ. Mantenha suas certificações e capacitações em dia (validade de 4 anos) para não perder valores.",
    );
  }

  div.style.display = "block";
}

function init() {
  if (el.vr) el.vr.value = String(CONFIG.VR_PADRAO.toFixed(2));

  [el.vr, el.doutorado, el.mestrado, el.pos, el.cert, el.cap]
    .filter(Boolean)
    .forEach((node) => {
      node.addEventListener("change", calcular);
      node.addEventListener("input", calcular);
    });

  document.getElementsByName("grad_option").forEach((radio) => {
    radio.addEventListener("change", calcular);
  });

  calcular();
}

init();
