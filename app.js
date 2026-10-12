// Progetti Coding: home dei padiglioni, pagina classe, dialog del progetto.
// Rotte con hash: #<classe> e #<classe>/<progetto>.

const CLASSES = [
  { id: "2a_anna_frank", code: "2A", school: "Anna Frank", c: "motion" },
  { id: "2a_ronta", code: "2A", school: "Ronta", c: "pen" },
  { id: "2o_plauto", code: "2O", school: "Plauto", c: "looks" },
  { id: "5_saffi_natale", code: "5", school: "Saffi", edition: "Natale", c: "variables" },
  { id: "5_saffi_primavera", code: "5", school: "Saffi", edition: "Primavera", c: "operators" },
  { id: "5_saffi_estate", code: "5", school: "Saffi", edition: "Estate", c: "control" },
];
const YEAR = "2025/2026";
const PALETTE = ["motion", "control", "looks", "operators", "variables", "pen"];
const GENERIC_NAME = "Progetto Snap!";

const app = document.getElementById("app");
const player = document.getElementById("player");
const stage = document.getElementById("player-stage");
const copyBtn = document.getElementById("player-copy");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const cache = new Map();

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slugify = (s) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "progetto";
const initials = (s) => {
  const parts = s.split(/\s*(?:,|&|\be\b)\s*/i).filter(Boolean);
  const words = parts.length > 1 ? parts : s.split(/\s+/);
  return words.map((w) => w[0].toUpperCase()).slice(0, 3).join("");
};
const fullName = (c) => `${c.code} ${c.school}${c.edition ? " " + c.edition : ""}`;
const plural = (n) => `${n} ${n === 1 ? "progetto" : "progetti"}`;
// "2O" in Bungee sembra "20": la lettera della sezione va in uno slot a parte
const codeHtml = (c) => {
  const m = /^(\d+)([A-Z]+)$/.exec(c.code);
  return m ? `${m[1]}<span class="pav-sec">${m[2]}</span>` : esc(c.code);
};
const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;

// --- dati ---------------------------------------------------------------

function load(id) {
  if (!cache.has(id)) {
    const p = fetch(`data/${id}.json`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(flatten)
      .catch((err) => { cache.delete(id); throw err; });
    cache.set(id, p);
  }
  return cache.get(id);
}

// Snap! attiva titolo, autore e modifica con qualunque valore (anche false): vanno tolti dall'url
function embedUrl(url) {
  const u = new URL(url);
  for (const k of ["showTitle", "showAuthor", "editButton"]) u.searchParams.delete(k);
  return u.href;
}

// stessa lettura dei JSON di prima: { student, projects: [...] } oppure voce piatta { name, url }
function flatten(data) {
  const seen = new Map();
  const out = [];
  for (const entry of data || []) {
    const list = Array.isArray(entry.projects) ? entry.projects : entry.name && entry.url ? [entry] : [];
    for (const p of list) {
      const student = entry.student || "Studente";
      const base = slugify(student);
      const n = (seen.get(base) || 0) + 1;
      seen.set(base, n);
      out.push({ student, name: p.name, url: embedUrl(p.url), slug: n > 1 ? `${base}-${n}` : base });
    }
  }
  return out;
}

// --- rotte --------------------------------------------------------------

let current = null; // id della vista mostrata ("home" o id classe)
let openedFromList = false;
let dragging = false; // un solo trascinamento alla volta (niente secondo dito) // il dialog e' stato aperto da un clic nella pagina (quindi "indietro" lo chiude)

function parse() {
  const [cid, pslug] = decodeURIComponent(location.hash.slice(1)).split("/");
  return { cls: CLASSES.find((c) => c.id === cid), pslug };
}

async function route() {
  const { cls, pslug } = parse();
  const key = cls ? cls.id : "home";
  if (key !== current) {
    const first = current === null;
    const prev = current;
    current = key;
    if (!cls && location.hash) history.replaceState(null, "", location.pathname + location.search);
    await swap(() => (cls ? renderClass(cls) : renderHome(prev)), first);
    if (!first) window.scrollTo(0, 0);
    if (!first && cls) document.getElementById("cls-h")?.focus({ preventScroll: true });
    openedFromList = false;
  } else if (cls && pslug) {
    openedFromList = !player.open;
  }
  if (cls && pslug) openProject(cls, pslug);
  else if (player.open) player.close();
}

// transizione di vista (padiglione che diventa intestazione) dove il browser la supporta
function swap(update, first) {
  if (first || reduced.matches || !document.startViewTransition) return update();
  return document.startViewTransition(update).updateCallbackDone;
}

// --- home ---------------------------------------------------------------

function renderHome(prevId) {
  document.title = `Progetti Coding ${YEAR}`;
  app.innerHTML = `
    <section class="hero">
      <div>
        <h1>Progetti <span>Coding</span></h1>
        <p class="hero-sub">I giochi e le storie programmati con Snap! dalle classi del Prof. Alex Siroli, anno scolastico ${YEAR}.</p>
      </div>
      <ol class="howto stack" aria-label="Come funziona">
        <li class="block hat" data-c="control" style="--i:0">quando si apre la pagina</li>
        <li class="block" data-c="motion" style="--i:1">scegli <span class="slot">la tua classe</span></li>
        <li class="block" data-c="variables" style="--i:2">cerca <span class="slot">il tuo nome</span></li>
        <li class="block" data-c="operators" style="--i:3">clicca <span class="slot">${icon("flag")}<span class="sr-only">la bandiera verde</span></span> e gioca</li>
      </ol>
    </section>
    <section class="pavilions" aria-labelledby="pav-h">
      <h2 id="pav-h">Scegli il padiglione della tua classe</h2>
      <ul class="stalls" data-testid="classes">
        ${CLASSES.map((c, i) => `
          <li class="pop" style="--i:${i + 3}">
            <a class="stall pav" href="#${c.id}" data-c="${c.c}" data-testid="class-${c.id}" style="view-transition-name:pav-${c.id}">
              <span class="awning" aria-hidden="true"></span>
              <span class="pav-body">
                <span class="pav-code">${codeHtml(c)}</span>
                <span class="pav-school">${esc(c.school)}</span>
                <span class="pav-meta">
                  <span class="slot" data-count="${c.id}">progetti</span>
                  ${c.edition ? `<span class="slot">${esc(c.edition)}</span>` : ""}
                  <span>${YEAR.replace("/20", "/")}</span>
                </span>
              </span>
            </a>
          </li>`).join("")}
      </ul>
    </section>`;

  for (const c of CLASSES) {
    const slot = app.querySelector(`[data-count="${c.id}"]`);
    load(c.id).then((items) => { slot.textContent = plural(items.length); }, () => { slot.textContent = "progetti"; });
  }
  if (prevId) app.querySelector(`[data-testid="class-${prevId}"]`)?.focus({ preventScroll: true });
}

// --- pagina classe ------------------------------------------------------

function renderClass(cls) {
  document.title = `${fullName(cls)} · Progetti Coding`;
  app.innerHTML = `
    <div class="class-view">
      <nav class="topbar" aria-label="Navigazione">
        <a class="back" href="#" data-testid="back">${icon("back")}Tutti i padiglioni</a>
        <span class="brand" aria-hidden="true">Progetti Coding</span>
      </nav>
      <header class="class-head pav" data-c="${cls.c}" style="view-transition-name:pav-${cls.id}">
        <span class="awning" aria-hidden="true"></span>
        <div class="pav-body">
          <h1 id="cls-h" tabindex="-1"><span class="pav-code">${codeHtml(cls)}</span> <span class="pav-school">${esc(cls.school)}${cls.edition ? ` <span class="sr-only">edizione</span> ${esc(cls.edition)}` : ""}</span></h1>
          <p class="pav-meta"><span class="slot" id="cls-count">progetti</span><span>Anno scolastico ${YEAR}</span></p>
        </div>
      </header>
      <aside class="side" aria-label="Classi e ricerca">
      <ul class="switcher" aria-label="Classi">
        ${CLASSES.map((c) => `<li><a href="#${c.id}" data-c="${c.c}"${c.id === cls.id ? ' aria-current="page"' : ""}>${esc(fullName(c))}</a></li>`).join("")}
      </ul>
      <div class="tools">
        <div class="finder">
          <label for="q">Cerca un nome</label>
          <div class="slot-input">${icon("search")}<input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="per esempio Anita" data-testid="search"></div>
        </div>
        <div class="gesture">
          <div class="block hat" data-c="control" id="hat" aria-hidden="true">quando si clicca <span class="slot">${icon("flag")}</span></div>
          <p class="hint">Trascina il blocco giallo sopra un progetto per avviarlo.</p>
        </div>
        <p class="status" id="status" role="status"></p>
      </div>
      </aside>
      <ol class="script-grid" id="grid" aria-labelledby="cls-h" aria-busy="true" data-testid="projects">
        ${Array.from({ length: 6 }, () => `<li class="skel" aria-hidden="true"><span class="block proj"></span></li>`).join("")}
      </ol>
    </div>`;

  wireHat(document.getElementById("hat"));
  const sw = app.querySelector(".switcher");
  const here = sw.querySelector("[aria-current]");
  sw.scrollLeft = here.offsetLeft - sw.offsetLeft - 16; // su telefono la classe attuale resta in vista
  const p = load(cls.id).then((items) => fillGrid(cls, items), () => showError(cls));
  // la transizione aspetta i dati solo per un attimo, poi mostra lo scheletro
  return Promise.race([p, new Promise((r) => setTimeout(r, 700))]);
}

function fillGrid(cls, items) {
  const grid = document.getElementById("grid");
  if (!grid || current !== cls.id) return;
  grid.removeAttribute("aria-busy");
  document.getElementById("cls-count").textContent = plural(items.length);
  if (!items.length) {
    grid.innerHTML = `<li class="notice">Ancora nessun progetto in questo padiglione. Torna a trovarci presto!</li>`;
    return;
  }
  const start = PALETTE.indexOf(cls.c);
  grid.innerHTML = items.map((p, i) => {
    return `
      <li class="pop" style="--i:${Math.min(i, 10)}" data-k="${esc(fold(p.student + " " + p.name))}">
        <a class="block proj" href="#${cls.id}/${p.slug}" data-c="${PALETTE[(start + i) % PALETTE.length]}" data-testid="project">
          <span class="proj-ini" aria-hidden="true">${esc(initials(p.student))}</span>
          <span class="proj-text">
            <span class="proj-who">${esc(p.student)}</span>
            ${p.name && p.name !== GENERIC_NAME ? `<span class="proj-name">${esc(p.name)}</span>` : ""}
          </span>
          <span class="proj-go">${icon("flag")}Avvia</span>
        </a>
      </li>`;
  }).join("");

  const q = document.getElementById("q");
  const status = document.getElementById("status");
  q.addEventListener("input", () => {
    const needle = fold(q.value.trim());
    let shown = 0;
    for (const li of grid.children) {
      const hit = !needle || li.dataset.k.includes(needle);
      li.hidden = !hit;
      shown += hit;
    }
    status.textContent = !needle ? "" : shown ? `${plural(shown)} ${shown === 1 ? "trovato" : "trovati"}` : `Nessun nome con "${q.value.trim()}". Prova con meno lettere.`;
  });
}

function showError(cls) {
  const grid = document.getElementById("grid");
  if (!grid || current !== cls.id) return;
  grid.removeAttribute("aria-busy");
  grid.innerHTML = `
    <li class="notice" role="alert">
      Non riesco a caricare i progetti di questa classe. Controlla la connessione e riprova.
      Se hai aperto il file dal computer, avvialo con un server web.
      <br><button type="button" class="btn" id="retry">Riprova</button>
    </li>`;
  document.getElementById("retry").addEventListener("click", () => { current = null; route(); });
}

// --- dialog progetto -----------------------------------------------------

async function openProject(cls, pslug) {
  const items = await load(cls.id).catch(() => null);
  const i = items ? items.findIndex((p) => p.slug === pslug) : -1;
  if (i < 0) {
    history.replaceState(null, "", `#${cls.id}`);
    if (player.open) player.close();
    return;
  }
  const p = items[i];
  player.dataset.c = PALETTE[(PALETTE.indexOf(cls.c) + i) % PALETTE.length];
  document.getElementById("player-who").textContent = p.student;
  document.getElementById("player-meta").textContent = `${p.name || GENERIC_NAME} · ${fullName(cls)}`;
  document.getElementById("player-open").href = p.url;
  resetCopy();
  document.title = `${p.student} · ${fullName(cls)} · Progetti Coding`;

  if (stage.dataset.url !== p.url) {
    stage.dataset.url = p.url;
    stage.innerHTML = `<p class="stage-wait">${icon("flag")}Carico il progetto...</p>`;
    const frame = document.createElement("iframe");
    frame.src = p.url;
    frame.title = `Progetto Snap! di ${p.student}`;
    frame.allow = "clipboard-read; clipboard-write; fullscreen";
    frame.allowFullscreen = true;
    frame.addEventListener("load", () => stage.querySelector(".stage-wait")?.remove(), { once: true });
    stage.append(frame);
  }
  if (!player.open) player.showModal();
}

player.addEventListener("close", () => {
  stage.replaceChildren();
  delete stage.dataset.url;
  const { cls, pslug } = parse();
  if (!cls || !pslug) return;
  document.title = `${fullName(cls)} · Progetti Coding`;
  if (openedFromList) history.back();
  else history.replaceState(null, "", `#${cls.id}`);
  openedFromList = false;
});

player.querySelector("[data-close]").addEventListener("click", () => player.close());
player.addEventListener("click", (e) => { if (e.target === player) player.close(); });

function resetCopy() {
  copyBtn.classList.remove("done");
  copyBtn.querySelector("span").textContent = "Copia il link";
  copyBtn.querySelector("use").setAttribute("href", "#i-link");
}

copyBtn.addEventListener("click", async () => {
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
    copyBtn.classList.add("done");
    copyBtn.querySelector("span").textContent = "Link copiato";
    copyBtn.querySelector("use").setAttribute("href", "#i-check");
  } catch {
    window.prompt("Copia questo link:", url);
  }
});

// --- gesto: trascina il blocco cappello su un progetto --------------------

function wireHat(hat) {
  hat.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || dragging) return;
    e.preventDefault();
    dragging = true;
    const box = hat.getBoundingClientRect();
    const dx = e.clientX - box.left;
    const dy = e.clientY - box.top;
    const sx = e.clientX;
    const sy = e.clientY;
    let ghost = null;
    let target = null;
    let pointer = { x: e.clientX, y: e.clientY };
    let raf = 0;
    hat.setPointerCapture(e.pointerId);

    const place = () => {
      ghost.style.transform = `translate(${pointer.x - dx}px, ${pointer.y - dy}px) rotate(-3deg)`;
      const el = document.elementFromPoint(pointer.x, pointer.y)?.closest(".proj:not(.skel .proj)");
      if (el !== target) {
        target?.classList.remove("drop-target");
        target = el || null;
        target?.classList.add("drop-target");
      }
    };

    // scorrimento automatico vicino ai bordi (serve su telefono)
    const edge = () => {
      const band = 72;
      const v = pointer.y > innerHeight - band ? 14 : pointer.y < band ? -14 : 0;
      if (v) { window.scrollBy(0, v); place(); }
      raf = requestAnimationFrame(edge);
    };

    const move = (ev) => {
      pointer = { x: ev.clientX, y: ev.clientY };
      if (!ghost) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
        ghost = hat.cloneNode(true);
        ghost.removeAttribute("id");
        ghost.classList.add("ghost");
        ghost.style.width = `${box.width}px`;
        document.body.append(ghost);
        hat.classList.add("lifted");
        raf = requestAnimationFrame(edge);
      }
      place();
    };

    const end = (ev) => {
      hat.removeEventListener("pointermove", move);
      hat.removeEventListener("pointerup", end);
      hat.removeEventListener("pointercancel", end);
      cancelAnimationFrame(raf);
      dragging = false;
      if (!ghost) { hat.classList.remove("nudge"); void hat.offsetWidth; hat.classList.add("nudge"); return; }
      const drop = ev.type === "pointerup" ? target : null;
      target?.classList.remove("drop-target");
      const finish = () => { ghost.remove(); hat.classList.remove("lifted"); };
      if (!drop) {
        if (reduced.matches) return finish();
        ghost.classList.add("settle");
        ghost.style.transform = `translate(${box.left}px, ${box.top}px)`;
        return setTimeout(finish, 240);
      }
      launch(drop, ghost, finish);
    };

    hat.addEventListener("pointermove", move);
    hat.addEventListener("pointerup", end);
    hat.addEventListener("pointercancel", end);
  });
}

// il cappello si aggancia sopra il blocco, il blocco si accende, poi si apre il progetto
function launch(card, ghost, finish) {
  const go = () => { finish(); card.classList.remove("running"); location.hash = card.hash; };
  if (reduced.matches) return go();
  const r = card.getBoundingClientRect();
  ghost.classList.add("settle");
  ghost.style.transform = `translate(${r.left}px, ${r.top - ghost.offsetHeight + 7}px)`;
  setTimeout(() => card.classList.add("running"), 160);
  setTimeout(go, 460);
}

// --- avvio ---------------------------------------------------------------

addEventListener("hashchange", route);
route();
