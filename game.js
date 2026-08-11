// ============================================================
//  MORFOLOGIA BUCOMAXILOFACIAL II  –  Jogo Educacional
// ============================================================

// ─── STATE ───────────────────────────────────────────────────
const STATE = {
  lives: 3,
  currentPhase: 1,
  completedPhases: JSON.parse(localStorage.getItem('mbf_completed') || '[]'),
  phase1Step: 0,
  phase2Placed: new Set(),
  phase2Posicionadas: new Set(),
  phase3State: {},
  phase4State: {},
};

function saveProgress() {
  localStorage.setItem('mbf_completed', JSON.stringify(STATE.completedPhases));
}

// ─── DATA ────────────────────────────────────────────────────

const MUSCLES = [
  { id: 'ecm',   label: 'M. ESTERNOCLEIDOMASTOIDE',         correct: true  },
  { id: 'vpost', label: 'VENTRE POSTERIOR DO M. DIGASTRICO', correct: true  },
  { id: 'omo',   label: 'M. OMOHIOIDEO',                    correct: true  },
  { id: 'plat',  label: 'M. PLATISMA',                      correct: false },
  { id: 'esti',  label: 'M. ESTILOHIOIDEO',                 correct: false },
  { id: 'vant',  label: 'VENTRE ANTERIOR DO M. DIGASTRICO', correct: false },
  { id: 'geni',  label: 'M. GENIOHIOIDEO',                  correct: false },
];

const ARTERY_SLOTS = [
  { id: 'acc', label: 'A. CAROTIDA COMUM',      question: 'Qual o nome dessa artéria?' },
  { id: 'ci',  label: 'A. CAROTIDA INTERNA',     question: 'Qual o nome dessa artéria?' },
  { id: 'ce',  label: 'A. CAROTIDA EXTERNA',     question: 'Qual o nome dessa artéria?' },
  { id: 'tis', label: 'A. TIREOIDEA SUPERIOR',   question: 'Qual o nome desse ramo colateral anterior?' },
  { id: 'lin', label: 'A. LINGUAL',              question: 'Qual o nome desse ramo colateral anterior?' },
  { id: 'fac', label: 'A. FACIAL',               question: 'Qual o nome desse ramo colateral anterior?' },
  { id: 'pha', label: 'A. FARINGEA ASCENDENTE',  question: 'Qual o nome desse ramo colateral medial?' },
  { id: 'occ', label: 'A. OCCIPITAL',            question: 'Qual o nome desse ramo colateral posterior?' },
  { id: 'aup', label: 'A. AURICULAR POSTERIOR',  question: 'Qual o nome desse ramo colateral posterior?' },
  { id: 'max', label: 'A. MAXILAR',              question: 'Qual o nome desse ramo terminal?' },
  { id: 'tmp', label: 'A. TEMPORAL SUPERFICIAL', question: 'Qual o nome desse ramo terminal?' },
];

const BRANCHES = {
  lin: {
    label: 'A. LINGUAL',
    arteries: [
      { id: 'rdl', label: 'RAMOS DORSAIS DA LINGUA', question: 'Qual o nome dessa artéria?' },
      { id: 'sub', label: 'A. SUBLINGUAL',           question: 'Qual o nome dessa artéria?' },
      { id: 'prl', label: 'A. PROFUNDA DA LINGUA',   question: 'Qual o nome dessa artéria?' },
    ],
  },
  fac: {
    label: 'A. FACIAL',
    arteries: [
      { id: 'palc', label: 'A. PALATINA ASCENDENTE', question: 'Qual o nome dessa artéria?' },
      { id: 'rgl',  label: 'RAMOS GLANDULARES',      question: 'Qual o nome dessa artéria?' },
      { id: 'smnt', label: 'A. SUBMENTUAL',          question: 'Qual o nome dessa artéria?' },
      { id: 'labi', label: 'A. LABIAL INFERIOR',     question: 'Qual o nome dessa artéria?' },
      { id: 'labs', label: 'A. LABIAL SUPERIOR',     question: 'Qual o nome dessa artéria?' },
      { id: 'ang',  label: 'A. ANGULAR',             question: 'Qual o nome dessa artéria?' },
    ],
  },
  max: {
    label: 'A. MAXILAR',
    arteries: [
      { id: 'mnm',   label: 'A. MENINGEA MEDIA',               question: 'Qual o nome dessa artéria?' },
      { id: 'alvi',  label: 'A. ALVEOLAR INFERIOR',            question: 'Qual o nome dessa artéria?' },
      { id: 'milh',  label: 'A. MILOHIODEA',                   question: 'Qual o nome dessa artéria?' },
      { id: 'ment',  label: 'A. MENTUAL',                      question: 'Qual o nome dessa artéria?' },
      { id: 'tpa',   label: 'A. TEMPORAL PROFUNDA ANTERIOR',   question: 'Qual o nome dessa artéria?' },
      { id: 'tpp',   label: 'A. TEMPORAL PROFUNDA POSTERIOR',  question: 'Qual o nome dessa artéria?' },
      { id: 'mass',  label: 'A. MASSETERICA',                  question: 'Qual o nome dessa artéria?' },
      { id: 'rpt',   label: 'RAMOS PTERIGOIDEOS',              question: 'Qual o nome dessa artéria?' },
      { id: 'buc',   label: 'A. BUCAL',                        question: 'Qual o nome dessa artéria?' },
      { id: 'aspo',  label: 'A. ALVEOLAR SUPERIOR POSTERIOR',  question: 'Qual o nome dessa artéria?' },
      { id: 'infor', label: 'A. INFRAORBITARIA',               question: 'Qual o nome dessa artéria?' },
      { id: 'aspa',  label: 'A. ALVEOLAR SUPERIOR ANTERIOR',   question: 'Qual o nome dessa artéria?' },
      { id: 'esfp',  label: 'A. ESFENOPALATINA',               question: 'Qual o nome dessa artéria?' },
      { id: 'pald',  label: 'A. PALATINA DESCENDENTE',         question: 'Qual o nome dessa artéria?' },
      { id: 'pama',  label: 'A. PALATINA MAIOR',               question: 'Qual o nome dessa artéria?' },
      { id: 'pame',  label: 'A. PALATINA MENOR',               question: 'Qual o nome dessa artéria?' },
    ],
  },
  tmp: {
    label: 'A. TEMPORAL SUPERFICIAL',
    arteries: [
      { id: 'ftr', label: 'A. FACIAL TRANSVERSA', question: 'Qual o nome dessa artéria?' },
      { id: 'rfr', label: 'RAMO FRONTAL',          question: 'Qual o nome dessa artéria?' },
      { id: 'rpa', label: 'RAMO PARIETAL',         question: 'Qual o nome dessa artéria?' },
    ],
  },
};

const PHASE4_DB = [
  { artery: 'A. CAROTIDA INTERNA',                 area: 'ENCEFALO' },
  { artery: 'ARTÉRIA TIREÓIDEA SUPERIOR',          area: 'TIREOIDE E LARINGE' },
  { artery: 'ARTÉRIA PROFUNDA DA LÍNGUA',          area: 'MM. EXTRINSECOS E INTRINSECOS' },
  { artery: 'RAMOS DORSAIS',                       area: 'DORSO DO TERÇO POSTERIOR DA LINGUA' },
  { artery: 'ARTÉRIA SUBLINGUAL',                  area: 'GLANDULA SUBLINGUAL' },
  { artery: 'ARTÉRIA OCCIPITAL',                   area: 'REGIAO OCCIPITAL, M. ESTERNOCLEIDOMASTOIDE, VENTRE POSTERIOR DO M. DIGASTRICO E M. ESTILOHIOIDEO' },
  { artery: 'ARTÉRIA AURICULAR POSTERIOR',         area: 'ORELHA EXTERNA E GLANDULA PAROTIDA' },
  { artery: 'ARTÉRIA FARÍNGEA ASCENDENTE',         area: 'FARINGE' },
  { artery: 'ARTÉRIA PALATINA ASCENDENTE',         area: 'PALATO MOLE' },
  { artery: 'RAMOS GLANDULARES',                   area: 'GLANDULA SUBMANDIBULAR' },
  { artery: 'ARTÉRIA SUBMENTONIANA',               area: 'M. MILOHIODEO E VENTRE ANTERIOR DO M. DIGASTRICO' },
  { artery: 'ARTÉRIA LABIAL INFERIOR',             area: 'LABIO INFERIOR' },
  { artery: 'ARTÉRIA LABIAL SUPERIOR',             area: 'LABIO SUPERIOR' },
  { artery: 'ARTÉRIA ANGULAR',                     area: 'REGIAO MEDIAL DO OLHO' },
  { artery: 'ARTÉRIA FACIAL TRANSVERSA',           area: 'GLANDULA PAROTIDA E DUCTO PAROTIDEO' },
  { artery: 'RAMO FRONTAL',                        area: 'REGIAO TEMPORAL E FRONTAL' },
  { artery: 'RAMO PARIETAL',                       area: 'REGIAO TEMPORAL E PARIETAL' },
  { artery: 'ARTÉRIA MENÍNGEA MÉDIA',              area: 'CALVARIA E DURA-MATER ENCEFALICA' },
  { artery: 'ARTÉRIA ALVEOLAR INFERIOR',           area: 'DENTES INFERIORES' },
  { artery: 'ARTÉRIA MILOHIOIDEA',                 area: 'M. MILOHIODEO' },
  { artery: 'ARTÉRIA MENTUAL',                     area: 'TECIDOS MOLES DO MENTO' },
  { artery: 'ARTÉRIA TEMPORAL PROFUNDA POSTERIOR', area: 'M. TEMPORAL' },
  { artery: 'ARTÉRIA TEMPORAL PROFUNDA ANTERIOR',  area: 'M. TEMPORAL' },
  { artery: 'ARTÉRIA MASSETÉRICA',                 area: 'PORÇAO PROFUNDA E SUPERFICIAL DO M. MASSETER' },
  { artery: 'RAMOS PTERIGÓIDEOS',                  area: 'M. PTERIGOIDEO LATERAL E M. PTERIGOIDEO MEDIAL' },
  { artery: 'ARTÉRIA BUCAL',                       area: 'M. BUCINADOR E MUCOSA JUGAL' },
  { artery: 'ARTÉRIA INFRAORBITÁRIA',              area: 'TECIDOS MOLE DO TERÇO MEDIO DA FACE' },
  { artery: 'ARTÉRIA ALVEOLAR SUPERIOR ANTERIOR',  area: 'DENTES SUPERIORES ANTERIORES' },
  { artery: 'ARTÉRIA ALVEOLAR SUPERIOR POSTERIOR', area: 'DENTES SUPERIORES POSTERIORES' },
  { artery: 'ARTÉRIA PALATINA DESCENDENTE',        area: 'CAVIDADE NASAL' },
  { artery: 'ARTÉRIA PALATINA MAIOR',              area: 'PALATO DURO' },
  { artery: 'ARTÉRIA PALATINA MENOR',              area: 'PALATO MOLE' },
  { artery: 'ARTÉRIA ESFENOPALATINA',              area: 'CAVIDADE NASAL' },
];

// ─── HELPERS ─────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr, n) { return shuffle(arr).slice(0, n); }

function normalizeInput(str) {
  return str.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

// Compare user answer to correct label, accepting with or without "A. " prefix
function isAnswerCorrect(userVal, correctLabel) {
  const norm = (s) => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const u = norm(userVal);
  const c = norm(correctLabel);
  if (u === c) return true;
  // Accept without the "A. " or "RAMOS " prefix
  const stripped = c.replace(/^(A\.|RAMOS)\s+/, '');
  if (u === stripped) return true;
  // Accept with just the prefix letter stripped (e.g. "SUBLINGUAL" matches "A. SUBLINGUAL")
  if (stripped === u) return true;
  return false;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'screen-enter'));
  const el = document.getElementById(id);
  el.classList.add('active');
  requestAnimationFrame(() => el.classList.add('screen-enter'));
}

function openOverlay(id) { document.getElementById(id).classList.add('active'); }
function closeOverlay(id) { document.getElementById(id).classList.remove('active'); }

function showGameOver(onRestart) {
  const go = document.getElementById('gameover-overlay');
  go.classList.add('active');
  document.getElementById('btn-gameover-restart').onclick = () => {
    go.classList.remove('active');
    resetLives();   // restore lives BEFORE the phase re-renders (which calls updateHUD)
    onRestart();
  };
}

function resetLives() {
  // Only reset the counter — the DOM hearts don't exist yet when this is called
  // before the phase renders. updateHUD() is called at the end of every render fn.
  STATE.lives = 3;
}

function loseLife(onDead) {
  STATE.lives--;
  updateHUD();
  if (STATE.lives <= 0) {
    // Prevent any further logic in the caller by flagging dead immediately,
    // then show the game-over dialog after a short visual pause.
    STATE.lives = 0; // clamp, never go negative
    setTimeout(() => showGameOver(onDead), 500);
    return true;
  }
  return false;
}

function updateHUD() {
  // The HUD is re-created via innerHTML on every render, so we always
  // query fresh elements here — never cache .heart references.
  document.querySelectorAll('.heart').forEach((h, i) => {
    h.classList.toggle('lost', i >= STATE.lives);
  });
}

function createHUD(phaseLabel, progressText, backFn) {
  const backBtn = backFn
    ? `<button class="btn btn-ghost btn-sm" style="padding:6px 12px;font-size:11px" onclick="${backFn}">⌂ Início</button>`
    : '';
  return `
    <div class="hud">
      <div style="display:flex;align-items:center;gap:10px">
        ${backBtn}
        <span class="hud-phase">${phaseLabel}</span>
      </div>
      <div class="hud-lives">
        <span class="heart">❤️</span><span class="heart">❤️</span><span class="heart">❤️</span>
      </div>
      <span class="hud-progress">${progressText}</span>
    </div>`;
}

// ─── APP SKELETON ─────────────────────────────────────────────

function buildApp() {
  document.getElementById('app').innerHTML = `

    <!-- HOME -->
    <div class="screen active" id="screen-home">
      <div class="home-logo">
        <div class="eyebrow">Morfologia Bucomaxilofacial II</div>
        <h1>Missão<br/><span>Carótida</span></h1>
        <p class="subtitle">Morfologia Bucomaxilofacial II</p>
      </div>
      <div class="pulse-divider"></div>
      <div class="home-buttons">
        <button class="btn btn-primary btn-lg" id="btn-play">▶ &nbsp;Jogar</button>
        <button class="btn btn-secondary" id="btn-extras">📹 &nbsp;Extras</button>
        <button class="btn btn-ghost" id="btn-credits">👥 &nbsp;Créditos</button>
      </div>
    </div>

    <!-- PHASE SELECTOR -->
    <div class="screen" id="screen-phases">
      <h2 style="font-family:var(--font-display);font-weight:800;margin-bottom:4px">Selecionar Missão</h2>
      <p class="text-muted text-center">Escolha sua missão</p>
      <div class="phases-grid">
        <div class="phase-card" id="card-phase1" onclick="startPhase(1)">
          <div class="phase-num">MISSÃO 01</div>
          <div class="phase-title">Reconhecimento Anatômico</div>
          <div class="phase-desc">Identifique a região e os músculos delimitadores</div>
          <span class="phase-badge open" id="badge-p1">Disponível</span>
        </div>
        <div class="phase-card" id="card-phase2" onclick="startPhase(2)">
          <div class="phase-num">MISSÃO 02</div>
          <div class="phase-title">Árvore Carotídea</div>
          <div class="phase-desc">Monte a árvore da carótida comum</div>
          <span class="phase-badge locked-badge" id="badge-p2">🔒 Bloqueada</span>
        </div>
        <div class="phase-card" id="card-phase3" onclick="startPhase(3)">
          <div class="phase-num">MISSÃO 03</div>
          <div class="phase-title">Ramos da Carótida</div>
          <div class="phase-desc">Explore os ramos da carótida externa em detalhe</div>
          <span class="phase-badge locked-badge" id="badge-p3">🔒 Bloqueada</span>
        </div>
        <div class="phase-card" id="card-phase4" onclick="startPhase(4)">
          <div class="phase-num">MISSÃO 04</div>
          <div class="phase-title">Áreas de Irrigação</div>
          <div class="phase-desc">Complete as frases sobre cada artéria</div>
          <span class="phase-badge locked-badge" id="badge-p4">🔒 Bloqueada</span>
        </div>
      </div>
      <button class="btn btn-ghost mt-16" onclick="showScreen('screen-home')">← Voltar</button>
    </div>

    <!-- PHASE SCREENS -->
    <div class="screen" id="screen-phase1" style="justify-content:flex-start;padding-top:20px"></div>
    <div class="screen" id="screen-phase2" style="justify-content:flex-start;padding-top:20px"></div>
    <div class="screen" id="screen-phase3" style="justify-content:flex-start;padding-top:20px"></div>
    <div class="screen" id="screen-phase4" style="justify-content:flex-start;padding-top:20px"></div>

    <!-- VICTORY -->
    <div class="screen" id="screen-victory">
      <div class="victory-content">
        <div class="victory-icon">🎉</div>
        <h2 id="victory-title">Fase Concluída!</h2>
        <p id="victory-msg">Você completou esta fase com sucesso.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" id="btn-victory-next">Próxima Fase →</button>
          <button class="btn btn-ghost" onclick="showScreen('screen-home')">⌂ Início</button>
        </div>
      </div>
    </div>

    <!-- EXTRAS -->
    <div class="screen" id="screen-extras">
      <div style="max-width:520px;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">📹</div>
        <h2 style="font-family:var(--font-display);font-weight:800;margin-bottom:8px">Conteúdos Extras</h2>
        <p class="text-muted" style="margin-bottom:32px;line-height:1.7">
          Aqui serão disponibilizadas gravações explicativas sobre as áreas de palpação e outros conteúdos complementares.
        </p>
        <div style="background:var(--surface);border:1px dashed var(--border);border-radius:var(--radius-lg);padding:32px;color:var(--text-muted);font-size:13px">
          📂 Nenhum conteúdo disponível ainda.<br/>Em breve novos vídeos serão adicionados.
        </div>
        <button class="btn btn-ghost mt-16" onclick="showScreen('screen-home')">← Voltar</button>
      </div>
    </div>

    <!-- OVERLAYS -->
    <div class="overlay" id="overlay-credits">
      <div class="popup" style="max-width:520px;max-height:86vh;overflow-y:auto">
        <h2>🦷 Créditos</h2>

        <div class="credits-list">
          <div class="credit-item">
            <div class="role">Programador geral</div>
            <div class="name">Diogo Guimarães Gifoni</div>
            <div class="mat">2410398</div>
          </div>

          <div class="credit-item">
            <div class="role">Arquiteto de projeto</div>
            <div class="name">Vitor Dantas de Almeida Mattos</div>
            <div class="mat">2422969</div>
          </div>

          <div class="credit-item">
            <div class="role">Monitoras</div>
            <div class="name">Maria Tereza Rodrigues Alves</div>
            <div class="mat">2421073</div>
            <div class="name" style="margin-top:6px">Letícia Maria Nunes Pinto</div>
            <div class="mat">2421032</div>
          </div>
        </div>

        <div class="credits-sec">Imagens</div>
        <div class="credits-list">
          <div class="credit-item">
            <div class="role">Missão 01 — Trígono carotídeo</div>
            <a class="credit-link" href="https://anatomyqa.com/carotid-triangle-boundaries-contents/"
               target="_blank" rel="noopener">anatomyqa.com — Carotid triangle</a>
          </div>
          <div class="credit-item">
            <div class="role">Missões 02 e 03 — Ilustrações das artérias</div>
            <div class="name">Letícia Maria Nunes Pinto</div>
            <div class="mat">2421032</div>
          </div>
        </div>

        <p class="text-muted" style="font-size:12px;line-height:1.6;margin-top:14px">
          Projeto de monitoria interdisciplinar — Morfologia Bucomaxilofacial II<br/>
          Universidade de Fortaleza (UNIFOR).
        </p>

        <div class="popup-actions">
          <button class="btn btn-ghost btn-sm" onclick="closeOverlay('overlay-credits')">Fechar</button>
        </div>
      </div>
    </div>

    <!-- Phase 2 dropdown popup -->
    <div class="overlay" id="overlay-p2-q">
      <div class="popup" style="max-width:520px">
        <h2 id="p2q-title">Qual o nome dessa artéria?</h2>
        <div class="popup-body" id="p2q-body"></div>
        <div id="p2q-dropdown-wrap" style="margin-bottom:12px">
          <div class="custom-select-wrap">
            <button class="custom-select-btn" id="p2q-select-btn" onclick="toggleP2Dropdown()">
              <span id="p2q-select-label">Selecione uma artéria...</span>
              <span class="select-arrow">▾</span>
            </button>
            <div class="custom-select-list" id="p2q-select-list"></div>
          </div>
        </div>
        <div class="feedback" id="p2q-feedback"></div>
        <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap" id="p2q-actions">
          <button class="btn btn-ghost btn-sm" onclick="closeOverlay('overlay-p2-q')">Cancelar</button>
          <button class="btn btn-primary btn-sm" id="p2q-submit">Confirmar</button>
        </div>
        <div style="display:none;justify-content:flex-end" id="p2q-next-wrap">
          <button class="btn btn-primary btn-sm" id="p2q-next">Próxima →</button>
        </div>
      </div>
    </div>

    <!-- Phase 3 text popup (ramos) -->
    <div class="overlay" id="overlay-puzzle-q">
      <div class="popup" style="max-width:520px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
          <h2 id="puzzle-q-title" style="margin:0">Qual o nome dessa artéria?</h2>
          <button onclick="closeOverlay('overlay-puzzle-q')"
            style="background:none;border:none;color:var(--text-muted);font-size:22px;cursor:pointer;line-height:1;padding:0 0 0 12px;flex-shrink:0"
            title="Fechar">✕</button>
        </div>
        <div class="popup-body" id="puzzle-q-body"></div>

        <div class="answer-input-wrap" id="puzzle-q-input-wrap">
          <input class="answer-input" id="puzzle-q-input" type="text" placeholder="Digite o nome..." autocomplete="off" />
          <button class="btn btn-primary btn-sm" id="puzzle-q-submit">OK</button>
        </div>
        <div class="feedback" id="puzzle-q-feedback"></div>
        <div class="popup-actions" id="puzzle-q-actions" style="display:none">
          <button class="btn btn-ghost btn-sm" onclick="closeOverlay('overlay-puzzle-q')">← Voltar</button>
          <button class="btn btn-primary btn-sm" id="puzzle-q-next">Próxima →</button>
        </div>
      </div>
    </div>

    <!-- Game Over -->
    <div class="gameover-overlay" id="gameover-overlay">
      <div class="gameover-box">
        <h2>💀 Game Over</h2>
        <p>Você perdeu todas as vidas.<br/>A fase será reiniciada.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:4px">
          <button class="btn btn-primary" id="btn-gameover-restart">↺ Tentar Novamente</button>
          <button class="btn btn-ghost" onclick="document.getElementById('gameover-overlay').classList.remove('active');resetLives();showScreen('screen-home')">⌂ Início</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-play').onclick = () => { updatePhaseBadges(); showScreen('screen-phases'); };
  document.getElementById('btn-extras').onclick = () => showScreen('screen-extras');
  document.getElementById('btn-credits').onclick = () => openOverlay('overlay-credits');
}

function updatePhaseBadges() {
  const cp = STATE.completedPhases;
  ['p1','p2','p3','p4'].forEach((id, i) => {
    const badge = document.getElementById(`badge-${id}`);
    const card = document.getElementById(`card-phase${i+1}`);
    if (cp.includes(i+1)) {
      badge.className = 'phase-badge done'; badge.textContent = '✅ Concluída';
      card.classList.remove('locked');
    } else if (i === 0 || cp.includes(i)) {
      badge.className = 'phase-badge open'; badge.textContent = 'Disponível';
      card.classList.remove('locked');
    } else {
      badge.className = 'phase-badge locked-badge'; badge.textContent = '🔒 Bloqueada';
      card.classList.add('locked');
    }
  });
}

function startPhase(n) {
  if (n > 1 && !STATE.completedPhases.includes(n-1)) return;
  STATE.currentPhase = n;
  resetLives();
  if (n === 1) initPhase1();
  else if (n === 2) initPhase2();
  else if (n === 3) initPhase3();
  else if (n === 4) initPhase4();
}

// ─── PHASE 1 ─────────────────────────────────────────────────

function initPhase1() {
  STATE.phase1Step = 0;
  showScreen('screen-phase1');
  renderPhase1();
}

function renderPhase1() {
  const el = document.getElementById('screen-phase1');
  if (STATE.phase1Step === 0) {
    // Step 0: image + text input side by side
    el.innerHTML = createHUD('MISSÃO 01 · Reconhecimento Anatômico', 'Passo 1 / 2', "showScreen('screen-home')") + `
      <div class="game-wrap" style="overflow-y:auto">
        <div class="anatomy-stage" id="p1-stage" style="max-width:600px;margin:0 auto 16px">
          ${buildNeckDiagram()}
        </div>
        <div class="question-panel" id="p1-question" style="max-width:600px;margin:0 auto">
          ${renderP1Q1()}
        </div>
      </div>`;
    updateHUD();
    attachP1Q1Events();
  } else {
    // Step 1: muscles — full width layout, image small + checkboxes
    el.innerHTML = createHUD('MISSÃO 01 · Reconhecimento Anatômico', 'Passo 2 / 2', "showScreen('screen-home')") + `
      <div class="game-wrap" style="overflow-y:auto;max-width:700px;margin:0 auto;width:100%">
        <!-- Small reference image -->
        <div style="max-width:360px;margin:0 auto 16px;position:relative;line-height:0;border-radius:10px;overflow:hidden">
          <img id="p1-muscles-img" src="${IMAGES.neck_triangle}" alt="Trígono carotídeo"
            style="width:100%;display:block;filter:brightness(0.86) contrast(1.08)"
            onerror="this.style.display='none'"/>
        </div>
        <div class="question-panel" id="p1-question" style="padding:20px">
          ${renderP1Q2()}
        </div>
      </div>`;
    updateHUD();
    attachP1Q2Events();
  }
}

// Detailed anatomical neck diagram
// ─── IMAGE CONFIG ──────────────────────────────────────────────
// Coloque suas imagens na pasta img/ do repositório.
// Se o arquivo não existir, uma mensagem de erro é exibida.
// ── IMAGENS DIDÁTICAS ─────────────────────────────────────────
// Fonte: Anatomy QA (anatomyqa.com) — uso educacional.
// Para imagens próprias, troque as URLs por caminhos locais (ex: 'img/neck_triangle.png').
// ╔══════════════════════════════════════════════════════════════════╗
// ║  CONFIGURAÇÃO DE IMAGENS                                         ║
// ║  Todos os arquivos ficam na pasta  img/  do repositório.          ║
// ║  Para trocar uma imagem, basta editar o nome do arquivo abaixo.   ║
// ╚══════════════════════════════════════════════════════════════════╝
const IMAGES = {
  // ── MISSÃO 01 — Trígono Carotídeo ──────────────────────────────
  // Imagem do pescoço com o triângulo carotídeo em destaque.
  // Fonte online (funciona sem baixar nada):
  neck_triangle: 'https://anatomyqa.com/wp-content/uploads/2018/05/Carotid-triangle.jpg',
  neck_muscles:  'https://anatomyqa.com/wp-content/uploads/2018/05/Carotid-triangle.jpg',
  // Se quiser usar um arquivo local, salve-o como img/trigono.png e troque para:
  //   neck_triangle: 'img/trigono.png',

  // ── MISSÃO 02 — Árvore Carotídea (quebra-cabeça) ──────────────
  // Imagem de referência do quebra-cabeça montado:
  carotid_tree: 'img/Carotida_comum_completa.png',

  // ── MISSÃO 03 — Ramos (imagem de contexto de cada ramo) ────────
  branch_lin: 'img/A__Lingual_inicial.png',
  branch_fac: 'img/Facial_completa.png',
  branch_max: 'img/Alveolar_inferior.png',
  branch_tmp: 'img/Facial_transversa.png',
};

// Zoom/crop config por ramo: [object-position CSS] para destacar a área certa
const BRANCH_IMG_FOCUS = {
  lin: { src: 'branch_lin', pos: '62% 72%', scale: '180%' },
  fac: { src: 'branch_fac', pos: '55% 60%', scale: '170%' },
  max: { src: 'branch_max', pos: '50% 40%', scale: '160%' },
  tmp: { src: 'branch_tmp', pos: '50% 20%', scale: '180%' },
};


function buildNeckDiagram() {
  const zoomed = STATE.phase1Step > 0;
  const imgSrc = IMAGES.neck_triangle;

  // Retângulos que cobrem os rótulos em inglês da imagem original.
  // Posições em % do container (calibradas para Carotid-triangle.jpg).
  const COVERS = [
    { l: 74.0, t: 20.0, w: 26.0, h:  8.5 },  // Stylohyoid
    { l: 74.0, t: 31.0, w: 26.0, h:  8.5 },  // Digastric
    { l: 69.0, t: 45.0, w: 31.0, h:  8.5 },  // SCM
    { l:  0.0, t: 40.0, w: 29.0, h:  8.5 },  // Hyoid bone
    { l:  0.0, t: 49.0, w: 29.0, h:  8.5 },  // Carotid triangle
    { l:  0.0, t: 60.0, w: 29.0, h:  8.5 },  // Omohyoid
  ];
  const coversHtml = COVERS.map(function(c) {
    return '<div style="position:absolute;left:' + c.l + '%;top:' + c.t + '%;' +
      'width:' + c.w + '%;height:' + c.h + '%;background:#efeae2;pointer-events:none"></div>';
  }).join('');

  // Destaque do trígono só aparece depois de responder (passo 2)
  const triHtml = zoomed
    ? '<div style="position:absolute;left:40%;top:34%;width:19%;height:32%;' +
        'background:rgba(200,86,58,0.28);border:2px solid #c8563a;border-radius:4px;' +
        'pointer-events:none"></div>' +
      '<div style="position:absolute;left:49.5%;top:44%;transform:translateX(-50%);' +
        'background:rgba(10,10,15,0.88);border-radius:6px;padding:5px 10px;pointer-events:none;' +
        'font-family:Raleway,sans-serif;font-size:10px;font-weight:800;color:#ffcabb;' +
        'text-align:center;line-height:1.25;white-space:nowrap">TRÍGONO<br/>CAROTÍDEO</div>'
    : '';

  // Caixa de pergunta (só no passo 1)
  const calloutHtml = zoomed ? '' :
    '<div style="position:absolute;right:3%;top:4%;background:rgba(13,17,23,0.94);' +
      'border:2px solid #c8563a;border-radius:8px;padding:7px 11px;pointer-events:none;' +
      'font-family:Raleway,sans-serif;font-size:10px;font-weight:800;color:#c8563a;' +
      'text-align:center;line-height:1.3">Qual região<br/>é esta? ↓</div>';

  return '<div id="neck-diagram-container" ' +
      'style="position:relative;width:100%;max-width:600px;margin:0 auto;line-height:0;' +
        'border-radius:10px;overflow:hidden;background:var(--surface2);min-height:180px">' +
      '<img src="' + imgSrc + '" alt="Diagrama anatômico" ' +
        'style="width:100%;display:block" ' +
        'onerror="this.style.display=\'none\';' +
          'this.parentElement.querySelector(\'.no-img-msg\').style.display=\'flex\'"/>' +
      '<div class="no-img-msg" style="display:none;position:absolute;inset:0;' +
        'align-items:center;justify-content:center;flex-direction:column;gap:6px;' +
        'font-family:Raleway,sans-serif;font-size:11px;color:var(--text-muted);' +
        'line-height:1.5;text-align:center;padding:20px">' +
        '<span style="font-size:26px">🖼️</span>' +
        '<span>Imagem não encontrada</span>' +
      '</div>' +
      coversHtml + triHtml + calloutHtml +
    '</div>';
}

function renderP1Q1() {
  return `
    <div class="question-label">Pergunta 1 de 2</div>
    <div class="question-text">A região destacada em azul está em evidência no diagrama.<br/>Qual é o nome dessa área anatômica do pescoço?</div>
    <div class="feedback" id="p1-feedback"></div>
    <div class="answer-input-wrap">
      <input class="answer-input" id="p1-input" type="text"
        placeholder="NOME DA REGIÃO..." autocomplete="off" maxlength="40"
        style="text-transform:uppercase"/>
      <button class="btn btn-primary btn-sm" id="p1-submit">OK</button>
    </div>
    <p class="text-muted mt-8" style="font-size:11px">⚠ Resposta em MAIÚSCULAS e sem acentos.</p>`;
}

function attachP1Q1Events() {
  const input = document.getElementById('p1-input');
  const btn = document.getElementById('p1-submit');
  const fb = document.getElementById('p1-feedback');
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  });
  function submit() {
    const val = normalizeInput(input.value);
    if (!val) return;
    if (val === 'TRIGONO CAROTIDEO') {
      input.className = 'answer-input correct';
      fb.className = 'feedback show success';
      fb.textContent = '✅ Correto! É o Trígono Carotídeo.';
      btn.disabled = true;
      setTimeout(() => { STATE.phase1Step = 1; renderPhase1(); }, 1400);
    } else {
      input.className = 'answer-input wrong';
      const dead = loseLife(() => { STATE.phase1Step = 0; initPhase1(); });
      if (!dead) {
        fb.className = 'feedback show error';
        fb.textContent = '❌ Incorreto. A resposta certa é: TRIGONO CAROTIDEO';
        setTimeout(() => { input.className = 'answer-input'; input.value = ''; fb.className = 'feedback'; }, 2500);
      }
    }
  }
  btn.onclick = submit;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function renderP1Q2() {
  const opts = MUSCLES.map(m => `
    <div class="option-item" data-id="${m.id}" onclick="toggleOption(this)">
      <div class="option-check"></div>
      <span class="option-text">${m.label}</span>
    </div>`).join('');
  return `
    <div class="question-label">Pergunta 2 de 2 · Músculos Delimitadores</div>
    <div class="question-text" style="font-size:15px;margin-bottom:16px">
      Quais <strong>3 músculos</strong> formam os limites do trígono carotídeo?
      <span style="display:block;font-size:12px;color:var(--text-muted);margin-top:4px">Selecione todas as corretas e confirme.</span>
    </div>
    <div class="feedback" id="p1-feedback"></div>
    <div class="options-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">${opts}</div>
    <button class="btn btn-primary w-full" id="p1-muscles-submit">✓ &nbsp;Confirmar Seleção</button>`;
}

window.toggleOption = function(el) {
  if (el.classList.contains('correct-reveal') || el.classList.contains('wrong-reveal')) return;
  el.classList.toggle('selected');
  el.querySelector('.option-check').textContent = el.classList.contains('selected') ? '✓' : '';
};

function attachP1Q2Events() {
  document.getElementById('p1-muscles-submit').onclick = () => {
    const selected = [...document.querySelectorAll('.option-item.selected')].map(el => el.dataset.id);
    if (!selected.length) {
      const fb = document.getElementById('p1-feedback');
      fb.className = 'feedback show info'; fb.textContent = 'Selecione ao menos um músculo.'; return;
    }
    const correctIds = MUSCLES.filter(m => m.correct).map(m => m.id);
    const isCorrect = selected.length === correctIds.length && correctIds.every(id => selected.includes(id));
    MUSCLES.forEach(m => {
      const el = document.querySelector(`.option-item[data-id="${m.id}"]`);
      if (!el) return;
      const check = el.querySelector('.option-check');
      if (m.correct) { el.classList.add('correct-reveal'); check.textContent = '✓'; }
      else if (selected.includes(m.id)) { el.classList.add('wrong-reveal'); check.textContent = '✗'; }
    });
    const fb = document.getElementById('p1-feedback');
    document.getElementById('p1-muscles-submit').disabled = true;
    if (isCorrect) {
      fb.className = 'feedback show success';
      fb.textContent = '✅ Correto! Os três músculos delimitam o trígono carotídeo.';
      setTimeout(() => completePhase(1), 2000);
    } else {
      const dead = loseLife(() => { STATE.phase1Step = 1; initPhase1(); });
      if (!dead) {
        fb.className = 'feedback show error';
        fb.textContent = '❌ Incorreto. Os corretos são: M. ESTERNOCLEIDOMASTOIDE, VENTRE POSTERIOR DO M. DIGASTRICO e M. OMOHIOIDEO.';
        setTimeout(() => { STATE.phase1Step = 1; renderPhase1(); }, 3500);
      }
    }
  };
}

// ─── PHASE 2 ─────────────────────────────────────────────────

// Phase 2 piece images mapped to each slot
// Peças da Missão 02 — cada cor corresponde a uma artéria.
// x/y/w/h = posição da peça sobre a imagem de referência (em %).
const P2_PIECES = {
  acc: { img:'Carotida_comum_inicial.png',  label:'A. CAROTIDA COMUM',       cor:'vermelho',    x:12.4, y:68.4, w:37.1, h:30.2 },
  ci:  { img:'Carotida_interna.png',        label:'A. CAROTIDA INTERNA',     cor:'azul',        x:5.1, y:53.8, w:31.9, h:16.2 },
  ce:  { img:'Carotida_externa.png',        label:'A. CAROTIDA EXTERNA',     cor:'laranja',     x:23.8, y:5.3, w:50.6, h:86.3 },
  tis: { img:'Tireoidea_superior.png',      label:'A. TIREOIDEA SUPERIOR',   cor:'roxo',        x:51.2, y:54.9, w:37.4, h:14.1 },
  lin: { img:'Lingual.png',                 label:'A. LINGUAL',              cor:'rosa',        x:60.7, y:44.4, w:28.9, h:3.9 },
  fac: { img:'Facial.png',                  label:'A. FACIAL',               cor:'ciano',       x:61.8, y:34.9, w:31.5, h:6.6 },
  pha: { img:'Faringea_ascendente.png',     label:'A. FARINGEA ASCENDENTE',  cor:'oliva',       x:65.5, y:25.5, w:14.1, h:19.2 },
  occ: { img:'Occipital.png',               label:'A. OCCIPITAL',            cor:'verde-escuro',x:16.4, y:6.1, w:44.6, h:19.8 },
  aup: { img:'Auricular_posterior.png',     label:'A. AURICULAR POSTERIOR',  cor:'verde',       x:31.3, y:4.6, w:34.2, h:12.6 },
  max: { img:'Maxilar.png',                 label:'A. MAXILAR',              cor:'vinho',       x:72.9, y:4.0, w:24.1, h:5.4 },
  tmp: { img:'Temporal_superficial.png',    label:'A. TEMPORAL SUPERFICIAL', cor:'dourado',     x:69.5, y:0.9, w:6.3, h:4.3 },
};

// Agrupa as peças por cor. Quando todas as peças de um grupo estiverem
// posicionadas, o sistema pergunta o nome da artéria.
const P2_GRUPOS = (function() {
  const g = {};
  Object.keys(P2_PIECES).forEach(function(id) {
    const c = P2_PIECES[id].cor;
    (g[c] = g[c] || []).push(id);
  });
  return g;
})();

function initPhase2() {
  STATE.phase2Placed = new Set();        // artérias já nomeadas
  STATE.phase2Posicionadas = new Set();  // peças já soltas no tabuleiro
  showScreen('screen-phase2');
  renderPhase2();
}

function renderPhase2() {
  const el = document.getElementById('screen-phase2');
  const placed = STATE.phase2Placed;
  const total = ARTERY_SLOTS.length;
  el.innerHTML = createHUD('MISSÃO 02 · Árvore Carotídea',
    placed.size + '/' + total + ' artérias', "showScreen('screen-home')") +
    '<div class="game-wrap" style="overflow-y:auto;padding-bottom:8px">' +
      '<div id="p2-puzzle-root"></div>' +
    '</div>';
  updateHUD();
  buildP2Puzzle();
}

// ── Drag & Drop Puzzle engine ─────────────────────────────────────────────


let p2DragId = null;  // id of piece being dragged

function buildP2Puzzle() {
  const posic = STATE.phase2Posicionadas;   // peças soltas no tabuleiro
  const root  = document.getElementById('p2-puzzle-root');
  if (!root) return;

  const ids = Object.keys(P2_PIECES);
  const naBandeja = ids.filter(function(id){ return !posic.has(id); });

  // ── bandeja lateral esquerda, rolável ──────────────────────────
  const bandeja =
    '<aside id="p2-bandeja">' +
      '<div class="p2-bandeja-cab">Peças<span>' + naBandeja.length + '</span></div>' +
      '<div class="p2-bandeja-lista">' +
        (naBandeja.length === 0
          ? '<p class="p2-bandeja-vazia">Todas as peças<br/>foram usadas</p>'
          : naBandeja.map(function(id) {
              const p = P2_PIECES[id];
              return '<div class="p2-piece" data-piece="' + id + '" draggable="true" ' +
                       'title="Arraste para o tabuleiro">' +
                       '<img src="img/' + p.img + '" draggable="false" alt=""/>' +
                     '</div>';
            }).join('')
        ) +
      '</div>' +
    '</aside>';

  // ── tabuleiro ──────────────────────────────────────────────────
  // Cada peça encaixada é uma máscara do MESMO tamanho da referência,
  // então o encaixe é pixel-perfeito e as peças nunca se sobrepõem.
  const pecas = ids.filter(function(id){ return posic.has(id); }).map(function(id) {
    const resolvido = STATE.phase2Placed.has(id);
    return '<img src="img/p2_' + id + '.png" alt="" draggable="false" ' +
      'class="p2-fitted' + (resolvido ? ' p2-ok' : '') + '"/>';
  }).join('');

  const tabuleiro =
    '<div id="p2-tabuleiro">' +
      '<div id="p2-drop-area">' +
        '<img class="p2-guia" src="img/Carotida_comum_completa.png" alt="" draggable="false"/>' +
        pecas +
      '</div>' +
      '<p class="p2-dica">Arraste as peças da esquerda para o tabuleiro.<br/>' +
        'Cada peça encaixa sozinha no lugar certo.</p>' +
    '</div>';

  root.innerHTML = '<div id="p2-layout">' + bandeja + tabuleiro + '</div>';
  attachP2Events();
}

function attachP2Events() {
  const limparSel = function() {
    document.querySelectorAll('.p2-piece').forEach(function(p){ p.classList.remove('p2-selected'); });
  };

  document.querySelectorAll('.p2-piece').forEach(function(peca) {
    peca.addEventListener('dragstart', function() {
      p2DragId = peca.dataset.piece;
      peca.classList.add('p2-dragging');
    });
    peca.addEventListener('dragend', function() {
      peca.classList.remove('p2-dragging');
    });
    peca.addEventListener('click', function() {
      const jaSel = peca.classList.contains('p2-selected');
      limparSel();
      if (jaSel) { p2DragId = null; return; }
      p2DragId = peca.dataset.piece;
      peca.classList.add('p2-selected');
    });
  });

  const area = document.getElementById('p2-drop-area');
  if (!area) return;
  area.addEventListener('dragover',  function(e){ e.preventDefault(); area.classList.add('p2-area-hover'); });
  area.addEventListener('dragleave', function(){ area.classList.remove('p2-area-hover'); });
  area.addEventListener('drop', function(e) {
    e.preventDefault();
    area.classList.remove('p2-area-hover');
    if (p2DragId) soltarPeca(p2DragId);
  });
  area.addEventListener('click', function() {
    if (p2DragId) soltarPeca(p2DragId);
  });
}

// Solta a peça: ela encaixa sozinha na posição correta.
// Quando TODAS as peças da mesma cor estiverem no tabuleiro,
// o sistema pergunta o nome da artéria.
function soltarPeca(pieceId) {
  const p = P2_PIECES[pieceId];
  if (!p || STATE.phase2Posicionadas.has(pieceId)) return;

  p2DragId = null;
  STATE.phase2Posicionadas.add(pieceId);
  buildP2Puzzle();

  const grupo = P2_GRUPOS[p.cor] || [pieceId];
  const completo = grupo.every(function(id){ return STATE.phase2Posicionadas.has(id); });
  const jaRespondido = grupo.every(function(id){ return STATE.phase2Placed.has(id); });

  if (completo && !jaRespondido) {
    setTimeout(function(){ openP2Q(pieceId); }, 420);
  }
}

// ── Phase 2 dropdown popup ──────────────────────────────────

let p2DropdownOpen = false;
let p2CurrentSlotId = null;
let p2SelectedValue = null;

// Ao completar o quebra-cabeça: leve zoom-out revelando a artéria completa.
function animarConclusaoP2() {
  const area = document.getElementById('p2-drop-area');
  if (!area) { setTimeout(function(){ completePhase(2); }, 400); return; }

  // troca as peças pela imagem completa em cores plenas
  area.classList.add('p2-concluido');
  area.innerHTML =
    '<img class="p2-final" src="img/Carotida_comum_completa.png" alt="Árvore carotídea completa"/>' +
    '<div class="p2-final-tag">Árvore carotídea completa</div>';

  const dica = document.querySelector('.p2-dica');
  if (dica) dica.textContent = 'Todas as artérias identificadas!';
  const bandeja = document.getElementById('p2-bandeja');
  if (bandeja) bandeja.classList.add('p2-bandeja-off');

  setTimeout(function(){ completePhase(2); }, 2600);
}

window.openP2Q = function(slotId) {
  if (STATE.phase2Placed.has(slotId)) return;
  p2CurrentSlotId = slotId;
  p2SelectedValue = null;
  p2DropdownOpen = false;

  const slot = ARTERY_SLOTS.find(s => s.id === slotId);
  document.getElementById('p2q-title').textContent = slot.question;

  // Determine context label for body
  const bodyLabels = {
    acc: 'Tronco de origem, antes da bifurcação:',
    ci: 'Bifurcação esquerda — ramificação interna:',
    ce: 'Bifurcação direita — ramificação externa:',
    tis: 'Ramo colateral anterior da carótida externa:',
    lin: 'Ramo colateral anterior da carótida externa:',
    fac: 'Ramo colateral anterior da carótida externa:',
    pha: 'Ramo colateral medial da carótida externa:',
    occ: 'Ramo colateral posterior da carótida externa:',
    aup: 'Ramo colateral posterior da carótida externa:',
    max: 'Ramo terminal da carótida externa:',
    tmp: 'Ramo terminal da carótida externa:',
  };
  document.getElementById('p2q-body').textContent = bodyLabels[slotId] || '';

  // Build dropdown options = all unplaced artery labels (shuffled for challenge)
  const remaining = ARTERY_SLOTS.filter(s => !STATE.phase2Placed.has(s.id));
  const options = shuffle(remaining);

  const list = document.getElementById('p2q-select-list');
  list.innerHTML = options.map(o =>
    `<div class="custom-select-option" data-val="${o.label}" onclick="selectP2Option('${o.label.replace(/'/g,"\\'")}', this)">${o.label}</div>`
  ).join('');

  // Reset UI
  document.getElementById('p2q-select-label').textContent = 'Selecione uma artéria...';
  document.getElementById('p2q-select-label').style.color = 'var(--text-muted)';
  document.getElementById('p2q-select-list').classList.remove('open');
  document.getElementById('p2q-feedback').className = 'feedback';
  document.getElementById('p2q-actions').style.display = 'flex';
  document.getElementById('p2q-next-wrap').style.display = 'none';
  document.getElementById('p2q-submit').disabled = false;
  document.getElementById('p2q-submit').onclick = submitP2Answer;

  openOverlay('overlay-p2-q');
};

window.toggleP2Dropdown = function() {
  const list = document.getElementById('p2q-select-list');
  p2DropdownOpen = !p2DropdownOpen;
  list.classList.toggle('open', p2DropdownOpen);
};

window.selectP2Option = function(val, el) {
  p2SelectedValue = val;
  document.getElementById('p2q-select-label').textContent = val;
  document.getElementById('p2q-select-label').style.color = 'var(--text)';
  document.getElementById('p2q-select-list').classList.remove('open');
  p2DropdownOpen = false;
  // Mark selected
  document.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
};

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select-wrap')) {
    const list = document.getElementById('p2q-select-list');
    if (list) { list.classList.remove('open'); p2DropdownOpen = false; }
  }
});

function submitP2Answer() {
  if (!p2SelectedValue) {
    const fb = document.getElementById('p2q-feedback');
    fb.className = 'feedback show info'; fb.textContent = 'Selecione uma opção antes de confirmar.'; return;
  }
  const slot = ARTERY_SLOTS.find(s => s.id === p2CurrentSlotId);
  const isCorrect = normalizeInput(p2SelectedValue) === normalizeInput(slot.label);
  const fb = document.getElementById('p2q-feedback');
  document.getElementById('p2q-submit').disabled = true;

  if (isCorrect) {
    fb.className = 'feedback show success'; fb.textContent = `✅ Correto! ${slot.label}`;
    document.getElementById('p2q-actions').style.display = 'none';
    document.getElementById('p2q-next-wrap').style.display = 'flex';
    document.getElementById('p2q-next').onclick = () => {
      closeOverlay('overlay-p2-q');
      const grupo = P2_GRUPOS[P2_PIECES[p2CurrentSlotId].cor] || [p2CurrentSlotId];
      grupo.forEach(function(id){ STATE.phase2Placed.add(id); });
      renderPhase2();
      if (STATE.phase2Placed.size === ARTERY_SLOTS.length) animarConclusaoP2();
    };
  } else {
    fb.className = 'feedback show error';
    fb.textContent = `❌ Incorreto. A resposta é: ${slot.label}`;
    const dead = loseLife(() => { closeOverlay('overlay-p2-q'); initPhase2(); });
    if (!dead) {
      // devolve as peças daquela cor para a bandeja
      const grupo = P2_GRUPOS[P2_PIECES[p2CurrentSlotId].cor] || [p2CurrentSlotId];
      setTimeout(function() {
        grupo.forEach(function(id){ STATE.phase2Posicionadas.delete(id); });
        closeOverlay('overlay-p2-q');
        renderPhase2();
      }, 2600);
    }
    if (false) {
      setTimeout(() => {
        p2SelectedValue = null;
        document.getElementById('p2q-select-label').textContent = 'Selecione uma artéria...';
        document.getElementById('p2q-select-label').style.color = 'var(--text-muted)';
        document.getElementById('p2q-feedback').className = 'feedback';
        document.getElementById('p2q-submit').disabled = false;
        document.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('active'));
      }, 2500);
    }
  }
}

// ─── PHASE 3 ─────────────────────────────────────────────────

function initPhase3() {
  STATE.phase3State = { placedBranches: new Set(), branchSteps: {} };
  showScreen('screen-phase3');
  renderPhase3();
}

function renderPhase3() {
  const el = document.getElementById('screen-phase3');
  const ps = STATE.phase3State;
  const branchIds = ['lin','fac','tmp','max'];
  const done = branchIds.filter(b => ps.placedBranches.has(b)).length;

  el.innerHTML = createHUD('FASE 03 · Ramos Colaterais', `${done}/${branchIds.length} ramos`, "showScreen('screen-home')") + `
    <div class="game-wrap" style="overflow-y:auto">
      <p class="text-muted text-center mb-16" style="font-size:12px">
        Selecione um ramo da carótida externa para explorar suas subdivisões.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:600px">
        ${branchIds.map(bid => {
          const b = BRANCHES[bid];
          const completed = ps.placedBranches.has(bid);
          const total = b.arteries.length;
          const placed = ps.branchSteps[bid] || 0;
          return `
          <div style="background:var(--surface);border:1.5px solid ${completed?'var(--green)':'var(--border)'};
               border-radius:var(--radius-lg);padding:20px;cursor:${completed?'default':'pointer'};transition:all 0.2s"
            ${!completed ? `onclick="openBranch('${bid}')"` : ''}>
            <div style="font-family:var(--font-display);font-size:11px;font-weight:700;
                 color:${completed?'var(--green)':'var(--accent2)'};letter-spacing:0.1em;margin-bottom:4px">
              ${completed ? '✅ COMPLETO' : '→ EXPLORAR'}
            </div>
            <div style="font-family:var(--font-display);font-size:13px;font-weight:700;margin-bottom:4px">${b.label}</div>
            <div style="font-size:11px;color:var(--text-muted)">${placed}/${total} artérias identificadas</div>
            ${!completed ? `<div style="height:3px;background:var(--bg);border-radius:2px;margin-top:10px;overflow:hidden">
              <div style="height:100%;width:${Math.round(placed/total*100)}%;background:var(--accent);border-radius:2px"></div>
            </div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  updateHUD();
  if (branchIds.every(b => ps.placedBranches.has(b))) setTimeout(() => completePhase(3), 600);
}

window.openBranch = function(bid) {
  const ps = STATE.phase3State;
  if (ps.placedBranches.has(bid)) return;
  showBranchZoom(bid);
};

// Branch image config: src image + viewBox crop (x y w h) for each branch
// Imagem de referência mostrada no topo de cada ramo (Missão 03).
// Usa as peças do quebra-cabeça que você já tem em img/.
const BRANCH_ZOOM_IMGS = {
  lin: { src: IMAGES.branch_lin },
  fac: { src: IMAGES.branch_fac },
  max: { src: IMAGES.branch_max },
  tmp: { src: IMAGES.branch_tmp },
};

function showBranchZoom(bid) {
  const b = BRANCHES[bid];
  const ps = STATE.phase3State;
  const placed = ps.branchSteps[bid] || 0;
  const el = document.getElementById('screen-phase3');
  const arteries = b.arteries;
  const cfg = BRANCH_ZOOM_IMGS[bid];

  el.innerHTML = createHUD('MISSÃO 03 · ' + b.label,
    placed + '/' + arteries.length + ' artérias', "renderPhase3()") +
    '<div class="game-wrap" style="overflow-y:auto;align-items:center;gap:12px">' +
      // Reference image with zoom-in feel
      '<div id="branch-img-wrap" style="width:100%;max-width:420px;margin:0 auto;' +
        'border-radius:12px;overflow:hidden;border:1px solid var(--border);' +
        'background:var(--surface2);flex-shrink:0">' +
        '<img id="branch-ref-img" src="' + cfg.src + '" alt="Peça anatômica" ' +
          'style="width:100%;max-height:180px;object-fit:contain;display:block" ' +
          'onerror="this.parentElement.style.display=\'none\'"/>' +
      '</div>' +
      // Puzzle slots below
      '<div style="width:100%;max-width:640px;margin:0 auto">' +
        buildBranchPuzzle(bid, arteries, ps) +
      '</div>' +
    '</div>';

  updateHUD();

}

function buildBranchPuzzle(bid, arteries, ps) {
  const placed = ps.branchSteps[bid] || 0;

  const rows = arteries.map(function(a, i) {
    const done   = i < placed;
    const active = i === placed;

    const numBg = done ? 'var(--green)' : (active ? 'var(--accent)' : '#1e2630');
    const numBorder = done ? 'var(--green)' : (active ? 'var(--accent)' : '#30363d');
    const numColor = (done || active) ? '#fff' : '#4a5568';

    let boxStyle, boxContent;
    if (done) {
      boxStyle = 'background:rgba(63,185,80,0.15);border:1.5px solid var(--green)';
      boxContent = '<span style="font-family:Raleway,sans-serif;font-size:11px;font-weight:700;' +
        'color:var(--green);letter-spacing:0.02em">' + a.label + '</span>' +
        '<span style="margin-left:auto;color:var(--green);font-size:14px;font-weight:700">✓</span>';
    } else if (active) {
      boxStyle = 'background:rgba(200,86,58,0.12);border:2px dashed var(--accent);cursor:pointer';
      boxContent = '<span style="font-family:Raleway,sans-serif;font-size:15px;font-weight:900;' +
        'color:var(--accent)">?</span>' +
        '<span style="margin-left:8px;font-family:Raleway,sans-serif;font-size:10px;' +
        'color:var(--text-muted)">clique para identificar</span>';
    } else {
      boxStyle = 'background:rgba(22,27,34,0.6);border:1px dashed #30363d;opacity:0.45';
      boxContent = '<span style="font-family:Raleway,sans-serif;font-size:11px;color:#30363d">—</span>';
    }

    const clickAttr = active ? ' onclick="openBranchSlot(\'' + bid + '\',' + i + ')"' : '';

    return '<div' + clickAttr + ' style="display:flex;align-items:center;gap:10px;margin-bottom:7px">' +
      '<div style="width:24px;height:24px;border-radius:50%;flex-shrink:0;' +
        'background:' + numBg + ';border:1.5px solid ' + numBorder + ';' +
        'display:flex;align-items:center;justify-content:center;' +
        'font-family:Raleway,sans-serif;font-size:10px;font-weight:800;color:' + numColor + '">' +
        (i + 1) + '</div>' +
      '<div style="flex:1;display:flex;align-items:center;padding:9px 13px;border-radius:8px;' +
        'transition:all 0.15s;' + boxStyle + '">' + boxContent + '</div>' +
    '</div>';
  }).join('');

  return '<div style="background:var(--surface);border:1px solid var(--border);' +
      'border-radius:12px;padding:16px">' +
      '<div style="font-family:Raleway,sans-serif;font-size:9px;font-weight:700;' +
        'letter-spacing:0.14em;color:var(--text-muted);text-transform:uppercase;' +
        'margin-bottom:12px">Ramos da artéria</div>' +
      rows +
    '</div>';
}

window.openBranchSlot = function(bid, idx) {
  const b = BRANCHES[bid];
  const artery = b.arteries[idx];
  showBranchPopup(bid, artery, idx, b.arteries.length);
};

function showBranchPopup(bid, artery, step, total) {
  document.getElementById('puzzle-q-title').textContent = artery.question;
  document.getElementById('puzzle-q-body').textContent = `${BRANCHES[bid].label} · Artéria ${step+1} de ${total}`;

  const input = document.getElementById('puzzle-q-input');
  const submitBtn = document.getElementById('puzzle-q-submit');
  const fb = document.getElementById('puzzle-q-feedback');
  const actions = document.getElementById('puzzle-q-actions');
  const wrap = document.getElementById('puzzle-q-input-wrap');

  input.value = ''; input.className = 'answer-input';
  fb.className = 'feedback'; actions.style.display = 'none';
  wrap.style.display = 'flex'; submitBtn.disabled = false;

  input.oninput = () => { input.value = input.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); };

  function attempt() {
    const val = normalizeInput(input.value);
    if (!val) return;
    if (isAnswerCorrect(val, artery.label)) {
      input.className = 'answer-input correct';
      fb.className = 'feedback show success'; fb.textContent = `✅ Correto! ${artery.label}`;
      submitBtn.disabled = true; actions.style.display = 'flex';
      document.getElementById('puzzle-q-next').onclick = () => {
        closeOverlay('overlay-puzzle-q');
        const ps = STATE.phase3State;
        ps.branchSteps[bid] = (ps.branchSteps[bid] || 0) + 1;
        if (ps.branchSteps[bid] >= BRANCHES[bid].arteries.length) {
          ps.placedBranches.add(bid);
          renderPhase3();
        } else {
          showBranchZoom(bid);
        }
      };
    } else {
      input.className = 'answer-input wrong';
      const dead = loseLife(() => { STATE.phase3State.branchSteps[bid] = 0; closeOverlay('overlay-puzzle-q'); showBranchZoom(bid); });
      if (!dead) {
        fb.className = 'feedback show error'; fb.textContent = `❌ Incorreto. A resposta é: ${artery.label}`;
        setTimeout(() => { input.className = 'answer-input'; input.value = ''; fb.className = 'feedback'; }, 2500);
      }
    }
  }
  submitBtn.onclick = attempt;
  input.onkeydown = e => { if (e.key === 'Enter') attempt(); };
  openOverlay('overlay-puzzle-q');
  setTimeout(() => input.focus(), 100);
}

// ─── PHASE 4 ─────────────────────────────────────────────────

function initPhase4() {
  // Weighted pick: some arteries appear more frequently
  const PHASE4_PRIORITY = [
    'A. CAROTIDA INTERNA','ARTÉRIA LINGUAL','ARTÉRIA FACIAL','ARTÉRIA MAXILAR',
    'ARTÉRIA ALVEOLAR INFERIOR','ARTÉRIA TEMPORAL SUPERFICIAL',
    'ARTÉRIA LABIAL INFERIOR','ARTÉRIA LABIAL SUPERIOR','ARTÉRIA ANGULAR',
  ];
  const prioritized = PHASE4_DB.filter(q => PHASE4_PRIORITY.some(p => q.artery.toUpperCase().includes(p.replace('ARTÉRIA ','').replace('A. ',''))));
  const pool = [...prioritized, ...prioritized, ...PHASE4_DB]; // 2x weight on priority
  const questions = pick(pool, 8)
    .filter((q, i, arr) => arr.findIndex(x => x.artery === q.artery) === i) // deduplicate
    .slice(0, 8)
    .map(q => {
      const wrong = shuffle(PHASE4_DB.filter(x => x.area !== q.area)).slice(0, 3).map(x => x.area);
      return { ...q, options: shuffle([q.area, ...wrong]), answered: false };
    });
  STATE.phase4State = { questions, current: 0, score: 0 };
  showScreen('screen-phase4');
  renderPhase4();
}

function renderPhase4() {
  const ps = STATE.phase4State;
  const { questions, current } = ps;
  const q = questions[current];
  const progress = Math.round(current / questions.length * 100);
  const el = document.getElementById('screen-phase4');
  el.innerHTML = createHUD('MISSÃO 04 · Áreas de Irrigação', `${current+1}/${questions.length}`, "showScreen('screen-home')") + `
    <div class="game-wrap" style="overflow-y:auto">
      <div class="fill-game">
        <div class="fill-progress-bar"><div class="fill-progress-inner" style="width:${progress}%"></div></div>
        <div class="fill-card">
          <div class="question-label">Complete a Frase</div>
          <div class="fill-artery-name">${q.artery}</div>
          <div class="fill-prompt">irriga / supre:</div>
          <div class="feedback" id="p4-feedback"></div>
          <div class="fill-options" id="p4-options">
            ${q.options.map((opt, i) => `<button class="fill-option" onclick="answerP4(${i})">${opt}</button>`).join('')}
          </div>
        </div>
        <div class="fill-score">Acertos: ${ps.score} de ${current}</div>
      </div>
    </div>`;
  updateHUD();
}

window.answerP4 = function(optIdx) {
  const ps = STATE.phase4State;
  const q = ps.questions[ps.current];
  if (q.answered) return;
  q.answered = true;
  const chosen = q.options[optIdx];
  const isCorrect = chosen === q.area;
  document.querySelectorAll('.fill-option').forEach((btn, i) => {
    btn.disabled = true;
    if (q.options[i] === q.area) btn.classList.add('reveal-correct');
  });
  document.querySelectorAll('.fill-option')[optIdx].classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
  const fb = document.getElementById('p4-feedback');
  fb.className = 'feedback show ' + (isCorrect ? 'success' : 'error');
  if (isCorrect) { ps.score++; fb.textContent = '✅ Correto!'; }
  else {
    const dead = loseLife(() => initPhase4());
    if (dead) return;
    fb.textContent = `❌ A resposta correta é: ${q.area}`;
  }
  setTimeout(() => {
    ps.current++;
    if (ps.current >= ps.questions.length) completePhase(4, ps.score, ps.questions.length);
    else renderPhase4();
  }, 1800);
};

// ─── COMPLETION ───────────────────────────────────────────────

function completePhase(n, score, total) {
  if (!STATE.completedPhases.includes(n)) { STATE.completedPhases.push(n); saveProgress(); }
  const titles = { 1:'Missão 1 Concluída!', 2:'Missão 2 Concluída!', 3:'Missão 3 Concluída!', 4:'Missão Completa! 🎓' };
  const msgs = {
    1: 'Você identificou o trígono carotídeo e seus três músculos delimitadores.',
    2: 'Você montou a árvore vascular da carótida com sucesso!',
    3: 'Você explorou todos os ramos colaterais da carótida externa.',
    4: `Você acertou ${score} de ${total} questões sobre áreas de irrigação arterial.`,
  };
  document.getElementById('victory-title').textContent = titles[n] || 'Fase Concluída!';
  document.getElementById('victory-msg').textContent = msgs[n] || '';
  const nextBtn = document.getElementById('btn-victory-next');
  if (n < 4) { nextBtn.style.display = ''; nextBtn.textContent = `Ir para Fase ${n+1} →`; nextBtn.onclick = () => startPhase(n+1); }
  else nextBtn.style.display = 'none';
  showScreen('screen-victory');
}

// ─── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => { buildApp(); });
