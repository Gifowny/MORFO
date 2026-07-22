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
      { id: 'tia',   label: 'A. TIMPANICA ANTERIOR',           question: 'Qual o nome dessa artéria?' },
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
        <div class="eyebrow">Monitoria Acadêmica · UNIFOR</div>
        <h1>Morfologia<br/><span>Bucomaxilofacial</span> II</h1>
        <p class="subtitle">Vascularização da Cabeça e Pescoço</p>
      </div>
      <svg class="pulse-line" viewBox="0 0 280 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="0,20 40,20 55,5 65,35 75,5 85,35 95,20 140,20 160,20 280,20"
          stroke="#c8563a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
      </svg>
      <div class="home-buttons">
        <button class="btn btn-primary btn-lg" id="btn-play">▶ &nbsp;Jogar</button>
        <button class="btn btn-secondary" id="btn-extras">📹 &nbsp;Extras</button>
        <button class="btn btn-ghost" id="btn-credits">👥 &nbsp;Créditos</button>
      </div>
    </div>

    <!-- PHASE SELECTOR -->
    <div class="screen" id="screen-phases">
      <h2 style="font-family:var(--font-display);font-weight:800;margin-bottom:4px">Selecionar Fase</h2>
      <p class="text-muted text-center">Escolha por onde começar</p>
      <div class="phases-grid">
        <div class="phase-card" id="card-phase1" onclick="startPhase(1)">
          <div class="phase-num">FASE 01</div>
          <div class="phase-title">Trígono Carotídeo</div>
          <div class="phase-desc">Identifique a região e os músculos delimitadores</div>
          <span class="phase-badge open" id="badge-p1">Disponível</span>
        </div>
        <div class="phase-card" id="card-phase2" onclick="startPhase(2)">
          <div class="phase-num">FASE 02</div>
          <div class="phase-title">Quebra-cabeça da Carótida</div>
          <div class="phase-desc">Monte a árvore da carótida comum</div>
          <span class="phase-badge locked-badge" id="badge-p2">🔒 Bloqueada</span>
        </div>
        <div class="phase-card" id="card-phase3" onclick="startPhase(3)">
          <div class="phase-num">FASE 03</div>
          <div class="phase-title">Ramos Colaterais</div>
          <div class="phase-desc">Explore os ramos da carótida externa em detalhe</div>
          <span class="phase-badge locked-badge" id="badge-p3">🔒 Bloqueada</span>
        </div>
        <div class="phase-card" id="card-phase4" onclick="startPhase(4)">
          <div class="phase-num">FASE 04</div>
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
      <div class="popup">
        <h2>👥 Créditos</h2>
        <div class="credits-list">
          <div class="credit-item">
            <div class="name">Profa. Responsável</div>
            <div class="role">Professora da disciplina Morfologia Bucomaxilofacial II</div>
          </div>
          <div class="credit-item">
            <div class="name">Monitor(a) de Odontologia</div>
            <div class="role">Desenvolvimento do conteúdo didático e revisão científica</div>
          </div>
          <div class="credit-item">
            <div class="name">Diogo Gifoni (Gifowny)</div>
            <div class="role">Desenvolvimento do sistema — Monitoria em Computação · UNIFOR</div>
          </div>
        </div>
        <p class="text-muted" style="font-size:12px;line-height:1.6">
          Projeto de monitoria interdisciplinar desenvolvido na Universidade de Fortaleza (UNIFOR).
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
        <div id="puzzle-q-img-wrap" style="display:none;margin-bottom:14px;border-radius:10px;overflow:hidden;height:140px;background:var(--surface2)">
          <img id="puzzle-q-img" src="" alt="Diagrama anatômico"
            style="width:100%;height:100%;object-fit:cover;object-position:50% 50%;
                   filter:brightness(0.85) contrast(1.1);transform-origin:center;transition:object-position 0.3s"/>
        </div>
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
    el.innerHTML = createHUD('FASE 01 · Trígono Carotídeo', 'Passo 1 / 2', "showScreen('screen-home')") + `
      <div class="game-wrap" style="overflow-y:auto">
        <div class="anatomy-stage" id="p1-stage" style="max-width:600px;margin:0 auto 16px">
          ${buildNeckSVG()}
        </div>
        <div class="question-panel" id="p1-question" style="max-width:600px;margin:0 auto">
          ${renderP1Q1()}
        </div>
      </div>`;
    updateHUD();
    attachP1Q1Events();
  } else {
    // Step 1: muscles — full width layout, image small + checkboxes
    el.innerHTML = createHUD('FASE 01 · Trígono Carotídeo', 'Passo 2 / 2', "showScreen('screen-home')") + `
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
// Se o arquivo não existir, o diagrama SVG original é exibido automaticamente.
// ── IMAGENS DIDÁTICAS ─────────────────────────────────────────
// Fonte: Anatomy QA (anatomyqa.com) — uso educacional.
// Para imagens próprias, troque as URLs por caminhos locais (ex: 'img/neck_triangle.png').
const IMAGES = {
  // Fase 1 – Trígono Carotídeo: limites do triângulo
  neck_triangle: 'https://anatomyqa.com/wp-content/uploads/2018/05/Carotid-triangle.jpg',
  // Fase 1 – Músculos: conteúdo do triângulo carotídeo
  neck_muscles: 'https://anatomyqa.com/wp-content/uploads/2018/05/carotid-triangle-contents.png',
  // Fase 2 – Modelo em argila da árvore carotídea (sem texto)
  carotid_tree: 'carotid_model.png',
  // Fase 3 – imagens de contexto para cada ramo (mesma imagem da fase 2, recortada via CSS)
  branch_lin: 'https://www.anatomyqa.com/wp-content/uploads/2018/05/external-carotid-artery.png',
  branch_fac: 'https://www.anatomyqa.com/wp-content/uploads/2018/05/external-carotid-artery.png',
  branch_max: 'https://anatomyqa.com/wp-content/uploads/2018/05/Maxillary-artery.png',
  branch_tmp: 'https://www.anatomyqa.com/wp-content/uploads/2018/05/external-carotid-artery.png',
};

// Zoom/crop config por ramo: [object-position CSS] para destacar a área certa
const BRANCH_IMG_FOCUS = {
  lin: { src: 'branch_lin', pos: '62% 72%', scale: '180%' },
  fac: { src: 'branch_fac', pos: '55% 60%', scale: '170%' },
  max: { src: 'branch_max', pos: '50% 40%', scale: '160%' },
  tmp: { src: 'branch_tmp', pos: '50% 20%', scale: '180%' },
};

// Cache de quais imagens existem (testado uma vez por sessão)
const IMG_EXISTS = {};
function checkImg(src, cb) {
  if (src in IMG_EXISTS) { cb(IMG_EXISTS[src]); return; }
  const t = new Image();
  t.onload  = () => { IMG_EXISTS[src] = true;  cb(true);  };
  t.onerror = () => { IMG_EXISTS[src] = false; cb(false); };
  t.src = src;
}

function buildNeckSVG() {
  const zoomed = STATE.phase1Step > 0;
  // Always use neck_triangle image for both steps - same image, different overlay
  const imgSrc = IMAGES.neck_triangle;

  // Image native dimensions: 406x249 — use these as viewBox for pixel-perfect overlay
  const VW = 406, VH = 249;
  const AR = VW / VH; // 1.630

  // ── Label cover rectangles (color matches image cream background #cec6b5) ──
  // Only shown when image is present
  const labelCovers = `
    <rect x="260" y="51"  width="146" height="15" fill="#cec6b5"/>
    <rect x="265" y="79"  width="141" height="15" fill="#cec6b5"/>
    <rect x="254" y="146" width="152" height="15" fill="#cec6b5"/>
    <rect x="70"  y="139" width="100" height="15" fill="#cec6b5"/>
    <rect x="0"   y="126" width="170" height="16" fill="#cec6b5"/>
    <rect x="65"  y="158" width="118" height="15" fill="#cec6b5"/>
    <rect x="68"  y="178" width="88"  height="15" fill="#cec6b5"/>`;

  // ── Red triangle vertices (measured on 406x249 source) ──
  // The red outlined triangle in the image: 
  //   upper-left near posterior digastric: (245, 80)
  //   upper-right near SCM:               (302, 96)
  //   bottom near omohyoid/hyoid:          (258, 166)
  const TRI = '245,80 302,96 258,166';
  const TX = 268, TY = 116; // centroid

  const overlaySVG = (withBg) => `
  <svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"
    style="position:${withBg ? 'absolute' : 'static'};top:0;left:0;width:100%;height:100%">

    ${withBg ? '' : `
    <!-- ── SVG FALLBACK (no image) ── -->
    <rect width="${VW}" height="${VH}" fill="#0d1117"/>
    <ellipse cx="200" cy="100" rx="60" ry="75" fill="#1e130a" stroke="#2a1e14" stroke-width="1"/>
    <path d="M155,145 Q165,175 170,185 L235,185 Q238,175 248,145" fill="#17100a" stroke="#241a12" stroke-width="1"/>
    <path d="M145,175 Q165,195 200,200 Q235,195 255,175" stroke="#2e1f14" stroke-width="1.5" fill="none"/>
    <path d="M148,200 Q150,180 155,165 Q160,148 160,135" stroke="#c8563a" stroke-width="3" fill="none" opacity="0.75"/>
    <path d="M255,200 Q253,180 250,165 Q245,148 246,135" stroke="#c8563a" stroke-width="3" fill="none" opacity="0.75"/>
    <path d="M250,145 Q235,143 220,143 Q205,143 192,145" stroke="#e8956d" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M275,180 Q255,170 235,167 Q210,164 192,167" stroke="#d4a843" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M200,200 Q200,180 200,165 Q200,152 200,140" stroke="#e8273a" stroke-width="2.5" fill="none" opacity="0.85"/>
    `}

    ${withBg ? labelCovers : ''}

    ${zoomed ? `
    <!-- Step 1: show filled triangle + label -->
    <polygon points="${TRI}" fill="rgba(200,86,58,0.35)" stroke="#c8563a" stroke-width="2.5"/>
    <rect x="${TX-52}" y="${TY-18}" width="104" height="38" rx="5" fill="rgba(10,10,15,0.82)"/>
    <text x="${TX}" y="${TY}" font-family="Raleway,sans-serif" font-size="10" fill="#ffcabb"
      text-anchor="middle" font-weight="800">TRÍGONO</text>
    <text x="${TX}" y="${TY+13}" font-family="Raleway,sans-serif" font-size="10" fill="#ffcabb"
      text-anchor="middle" font-weight="800">CAROTÍDEO</text>
    ` : `
    <!-- Step 0: callout top-right in red, no triangle overlay -->
    <!-- Arrow from callout to the red triangle in image -->
    <line x1="314" y1="50" x2="${TX+10}" y2="${TY-8}" stroke="#c8563a" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.9"/>
    <!-- Callout box top-right -->
    <rect x="306" y="8" width="96" height="40" rx="7" fill="rgba(13,17,23,0.93)" stroke="#c8563a" stroke-width="1.8"/>
    <text x="354" y="25" font-family="Raleway,sans-serif" font-size="9.5" fill="#c8563a" text-anchor="middle" font-weight="800">Qual região</text>
    <text x="354" y="39" font-family="Raleway,sans-serif" font-size="9.5" fill="#c8563a" text-anchor="middle" font-weight="800">é esta? ↓</text>
    `}

    <!-- ── LEGENDA ── -->
    <g transform="translate(4,${VH - (zoomed ? 58 : 76)})">
      <rect width="148" height="${zoomed ? 54 : 72}" rx="5" fill="rgba(10,12,17,0.90)" stroke="#30363d" stroke-width="1"/>
      <text x="7" y="12" font-family="Raleway,sans-serif" font-size="6" fill="#8b949e" font-weight="700" letter-spacing="0.12em">LEGENDA</text>
      <line x1="7" y1="20" x2="20" y2="20" stroke="#c8563a" stroke-width="2"/>
      <text x="25" y="23" font-family="Raleway,sans-serif" font-size="6.5" fill="#e6edf3">M. Esternocleidomastoide</text>
      <line x1="7" y1="31" x2="20" y2="31" stroke="#e8956d" stroke-width="2"/>
      <text x="25" y="34" font-family="Raleway,sans-serif" font-size="6.5" fill="#e6edf3">V. Post. M. Digástrico</text>
      ${zoomed ? '' : `
      <line x1="7" y1="42" x2="20" y2="42" stroke="#d4a843" stroke-width="2"/>
      <text x="25" y="45" font-family="Raleway,sans-serif" font-size="6.5" fill="#e6edf3">M. Omohióideo</text>
      <line x1="7" y1="53" x2="20" y2="53" stroke="#e8273a" stroke-width="2"/>
      <text x="25" y="56" font-family="Raleway,sans-serif" font-size="6.5" fill="#e6edf3">A. Carótida Comum</text>
      `}
    </g>
  </svg>`;

  const ar = VW / VH;
  checkImg(imgSrc, (exists) => {
    const target = document.getElementById('neck-diagram-container');
    if (!target) return;
    if (exists) {
      target.innerHTML = `
        <img src="${imgSrc}" alt="Diagrama anatômico"
          style="width:100%;display:block;border-radius:10px;
                 filter:brightness(0.86) contrast(1.08)"/>
        ${overlaySVG(true)}`;
    } else {
      target.innerHTML = overlaySVG(false);
    }
  });

  return `<div id="neck-diagram-container" style="position:relative;width:100%;max-width:600px;margin:0 auto;line-height:0">${overlaySVG(false)}</div>`;
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
    <p class="text-muted mt-8" style="font-size:11px">⚠ Resposta em MAIÚSCULAS sem acentos. Ex: TRIGONO CAROTIDEO</p>`;
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

function initPhase2() {
  STATE.phase2Placed = new Set();
  showScreen('screen-phase2');
  renderPhase2();
}

function renderPhase2() {
  const el = document.getElementById('screen-phase2');
  const placed = STATE.phase2Placed;

  // Build numbered marker SVG overlay (string concat to avoid nested template literals)
  const m1 = placed.has('tmp') ?  '<circle cx="431" cy="181" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="431" y="181" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">1</text>' :  '<circle cx="431" cy="181" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="431" y="181" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">1</text>';
  const m2 = placed.has('max') ?  '<circle cx="670" cy="675" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="670" y="675" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">2</text>' :  '<circle cx="670" cy="675" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="670" y="675" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">2</text>';
  const m3 = placed.has('aup') ?  '<circle cx="699" cy="819" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="699" y="819" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">3</text>' :  '<circle cx="699" cy="819" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="699" y="819" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">3</text>';
  const m4 = placed.has('occ') ?  '<circle cx="243" cy="520" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="243" y="520" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">4</text>' :  '<circle cx="243" cy="520" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="243" y="520" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">4</text>';
  const m5 = placed.has('fac') ?  '<circle cx="236" cy="597" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="236" y="597" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">5</text>' :  '<circle cx="236" cy="597" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="236" y="597" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">5</text>';
  const m6 = placed.has('pha') ?  '<circle cx="566" cy="654" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="566" y="654" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">6</text>' :  '<circle cx="566" cy="654" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="566" y="654" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">6</text>';
  const m7 = placed.has('lin') ?  '<circle cx="381" cy="904" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="381" y="904" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">7</text>' :  '<circle cx="381" cy="904" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="381" y="904" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">7</text>';
  const m8 = placed.has('ce') ?  '<circle cx="472" cy="465" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="472" y="465" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">8</text>' :  '<circle cx="472" cy="465" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="472" y="465" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">8</text>';
  const m9 = placed.has('ci') ?  '<circle cx="464" cy="753" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="464" y="753" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">9</text>' :  '<circle cx="464" cy="753" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="464" y="753" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">9</text>';
  const m10 = placed.has('tis') ?  '<circle cx="375" cy="801" r="22" fill="#3fb950" stroke="#fff" stroke-width="3" opacity="0.95"/>'  + '<text x="375" y="801" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">10</text>' :  '<circle cx="375" cy="801" r="22" fill="rgba(180,55,35,0.92)" stroke="#fff" stroke-width="3"/>'  + '<text x="375" y="801" font-family="Raleway,sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">10</text>';
  const markerSVG = '<svg viewBox="0 0 960 1280" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none">' +
    '<g>' + m1 + '</g><g>' + m2 + '</g><g>' + m3 + '</g><g>' + m4 + '</g><g>' + m5 + '</g>' +
    '<g>' + m6 + '</g><g>' + m7 + '</g><g>' + m8 + '</g><g>' + m9 + '</g><g>' + m10 + '</g>' +
    '</svg>';;

  // Build card grid for each slot
  const slotOrder = [
    {id:'tmp', num:1,  label:'A. TEMPORAL SUPERFICIAL', type:'Ramo terminal'},
    {id:'max', num:2,  label:'A. MAXILAR',              type:'Ramo terminal'},
    {id:'aup', num:3,  label:'A. AURICULAR POSTERIOR',  type:'Ramo posterior'},
    {id:'occ', num:4,  label:'A. OCCIPITAL',            type:'Ramo posterior'},
    {id:'fac', num:5,  label:'A. FACIAL',               type:'Ramo anterior'},
    {id:'pha', num:6,  label:'A. FARINGEA ASCENDENTE',  type:'Ramo medial'},
    {id:'lin', num:7,  label:'A. LINGUAL',              type:'Ramo anterior'},
    {id:'ce',  num:8,  label:'A. CAROTIDA EXTERNA',     type:'Bifurcação'},
    {id:'ci',  num:9,  label:'A. CAROTIDA INTERNA',     type:'Bifurcação'},
    {id:'tis', num:10, label:'A. TIREOIDEA SUPERIOR',   type:'Ramo anterior'},
  ];

  const cards = slotOrder.map(s => {
    const done = placed.has(s.id);
    const clickAttr = !done ? 'onclick="openP2Q(\'' + s.id + '\')"' : '';
    const numClass = 'p2-card-num' + (done ? ' p2-card-num-done' : '');
    const cardClass = 'p2-card' + (done ? ' p2-card-done' : '');
    const checkHtml = done ? '<div class="p2-card-check">✓</div>' : '';
    return '<div class="' + cardClass + '" ' + clickAttr + ' title="' + (done ? s.label : 'Clique para identificar') + '">' +
      '<div class="' + numClass + '">' + s.num + '</div>' +
      '<div class="p2-card-info">' +
        '<div class="p2-card-type">' + s.type + '</div>' +
        '<div class="p2-card-label">' + (done ? s.label : '???') + '</div>' +
      '</div>' + checkHtml +
    '</div>';
  }).join('');

  el.innerHTML = createHUD('FASE 02 · Quebra-cabeça da Carótida', `${placed.size}/${ARTERY_SLOTS.length} peças`, "showScreen('screen-home')") + `
    <div class="game-wrap" style="overflow-y:auto;gap:12px">
      <!-- Image with numbered markers -->
      <div id="carotid-tree-container" style="position:relative;width:100%;max-width:500px;margin:0 auto;border-radius:12px;overflow:hidden;background:var(--surface);flex-shrink:0">
        <div id="p2-img-placeholder" style="height:160px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:13px">
          Carregando imagem...
        </div>
      </div>
      <!-- Card grid -->
      <div class="p2-card-grid">${cards}</div>
    </div>`;

  updateHUD();

  // Load image
  checkImg(IMAGES.carotid_tree, (exists) => {
    const target = document.getElementById('carotid-tree-container');
    if (!target) return;
    if (exists) {
      target.style.cssText = 'width:100%;max-width:440px;margin:0 auto;line-height:0';
      target.innerHTML = `
        <div style="position:relative;display:inline-block;width:100%;line-height:0;border-radius:12px;overflow:hidden">
          <img src="${IMAGES.carotid_tree}" alt="Modelo da carótida"
            style="width:100%;height:auto;display:block;border-radius:12px;max-height:62vh;object-fit:cover;object-position:center 45%"/>
          <svg viewBox="0 100 960 1070" xmlns="http://www.w3.org/2000/svg"
            style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none">
            ${markerSVG.replace('<svg viewBox="0 0 960 1280" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none">','').replace('</svg>','')}
          </svg>
        </div>`;
    } else {
      target.innerHTML = buildCarotidFallbackSVG(placed);
      target.style.background = 'transparent';
    }
  });
}

function buildCarotidFallbackSVG(placed) {
  // Simple schematic tree for when image is unavailable
  return `<svg viewBox="0 0 460 520" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
    <rect width="460" height="520" fill="#0d1117" rx="14"/>
    <line x1="230" y1="515" x2="230" y2="400" stroke="#c8563a" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
    <text x="265" y="510" font-family="Raleway,sans-serif" font-size="7" fill="#8b949e" font-weight="700">A. CAROTIDA COMUM</text>
    <circle cx="230" cy="398" r="5" fill="#c8563a" opacity="0.8"/>
    <line x1="230" y1="398" x2="150" y2="355" stroke="#58a6ff" stroke-width="2.5" opacity="0.7"/>
    <line x1="230" y1="398" x2="280" y2="360" stroke="#c8563a" stroke-width="2.5" opacity="0.7"/>
    <line x1="280" y1="360" x2="280" y2="80" stroke="#c8563a" stroke-width="2" opacity="0.45"/>
    <line x1="280" y1="310" x2="180" y2="310" stroke="#c8563a" stroke-width="1.5" opacity="0.4"/>
    <line x1="280" y1="260" x2="180" y2="260" stroke="#c8563a" stroke-width="1.5" opacity="0.4"/>
    <line x1="280" y1="200" x2="180" y2="200" stroke="#c8563a" stroke-width="1.5" opacity="0.4"/>
    <line x1="280" y1="340" x2="370" y2="340" stroke="#c8563a" stroke-width="1.5" opacity="0.4"/>
    <line x1="280" y1="290" x2="370" y2="290" stroke="#c8563a" stroke-width="1.5" opacity="0.4"/>
    <line x1="280" y1="230" x2="370" y2="230" stroke="#c8563a" stroke-width="1.5" opacity="0.4"/>
    <line x1="280" y1="80" x2="230" y2="50" stroke="#c8563a" stroke-width="2" opacity="0.5"/>
    <line x1="280" y1="80" x2="330" y2="50" stroke="#c8563a" stroke-width="2" opacity="0.5"/>
    <text x="230" y="30" font-family="Raleway,sans-serif" font-size="6" fill="#30363d" text-anchor="middle">TERMINAIS</text>
    <text x="25" y="260" font-family="Raleway,sans-serif" font-size="6" fill="#30363d" transform="rotate(-90,25,260)">ANTERIORES</text>
    <text x="435" y="290" font-family="Raleway,sans-serif" font-size="6" fill="#30363d" transform="rotate(90,435,290)">POST./MEDIAL</text>
  </svg>`;
}

// ── Phase 2 dropdown popup ──────────────────────────────────

let p2DropdownOpen = false;
let p2CurrentSlotId = null;
let p2SelectedValue = null;

window.openP2Q = function(slotId) {
  if (STATE.phase2Placed.has(slotId)) return;
  p2CurrentSlotId = slotId;
  p2SelectedValue = null;
  p2DropdownOpen = false;

  const slot = ARTERY_SLOTS.find(s => s.id === slotId);
  document.getElementById('p2q-title').textContent = slot.question;

  // Determine context label for body
  const bodyLabels = {
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
      STATE.phase2Placed.add(p2CurrentSlotId);
      renderPhase2();
      if (STATE.phase2Placed.size === ARTERY_SLOTS.length) setTimeout(() => completePhase(2), 600);
    };
  } else {
    fb.className = 'feedback show error';
    fb.textContent = `❌ Incorreto. A resposta é: ${slot.label}`;
    const dead = loseLife(() => { closeOverlay('overlay-p2-q'); initPhase2(); });
    if (!dead) {
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
const BRANCH_ZOOM_IMGS = {
  lin: { src:'branch_lingual_facial.png', vb:'0 0 1283 1404',     ratio:1.095 },
  fac: { src:'branch_lingual_facial.png', vb:'1283 0 1283 1404',  ratio:1.095 },
  max: { src:'branch_maxilar.png',        vb:'0 0 2272 1390',      ratio:0.612 },
  tmp: { src:'branch_temporal.jpg',       vb:'0 0 1280 1269',      ratio:0.991 },
};

function showBranchZoom(bid) {
  const b = BRANCHES[bid];
  const ps = STATE.phase3State;
  const placed = ps.branchSteps[bid] || 0;
  const el = document.getElementById('screen-phase3');
  const arteries = b.arteries;
  const cfg = BRANCH_ZOOM_IMGS[bid];

  el.innerHTML = createHUD('FASE 03 · ' + b.label,
    placed + '/' + arteries.length + ' artérias', "renderPhase3()") +
    '<div class="game-wrap" style="overflow-y:auto;align-items:center;gap:12px">' +
      // Reference image with zoom-in feel
      '<div id="branch-img-wrap" style="width:100%;max-width:640px;margin:0 auto;' +
        'border-radius:12px;overflow:hidden;border:1px solid var(--border);flex-shrink:0">' +
        '<img id="branch-ref-img" src="' + cfg.src + '" alt="Diagrama anatômico" ' +
          'style="width:100%;height:auto;display:block;' +
          (cfg.vb !== '0 0 1283 1404' || bid === 'lin' ? '' :
            'object-fit:cover;object-position:100% 50%;') +
          'filter:brightness(0.88) contrast(1.08)" ' +
          '/>' +
      '</div>' +
      // Puzzle slots below
      '<div style="width:100%;max-width:640px;margin:0 auto">' +
        buildBranchPuzzleSVG(bid, arteries, ps) +
      '</div>' +
    '</div>';

  updateHUD();

  // After DOM is ready, apply image crop for fac (right half of same image)
  if (bid === 'fac') {
    const img = document.getElementById('branch-ref-img');
    if (img) {
      img.style.objectFit = 'cover';
      img.style.objectPosition = '100% 50%';
      img.style.maxHeight = '220px';
    }
  } else if (bid === 'lin') {
    const img = document.getElementById('branch-ref-img');
    if (img) {
      img.style.objectFit = 'cover';
      img.style.objectPosition = '0% 50%';
      img.style.maxHeight = '220px';
    }
  } else {
    const img = document.getElementById('branch-ref-img');
    if (img) img.style.maxHeight = '220px';
  }
}

function buildBranchPuzzleSVG(bid, arteries, ps) {
  const placed = ps.branchSteps[bid] || 0;
  const SLOT_W = 230, SLOT_H = 32, GAP = 10;
  const totalH = arteries.length * (SLOT_H + GAP) + 60;
  const CX = 290;

  let slots = '';
  arteries.forEach((a, i) => {
    const done = i < placed;
    const active = i === placed;
    const y = 40 + i * (SLOT_H + GAP);
    const isLeft = i % 2 === 0;
    const sx = isLeft ? CX - SLOT_W - 16 : CX + 16;
    const lineX = isLeft ? sx + SLOT_W : sx;
    const lineY = y + SLOT_H / 2;
    const midX = CX;

    if (done) {
      slots += '<rect x="' + sx + '" y="' + y + '" width="' + SLOT_W + '" height="' + SLOT_H + '" rx="6"' +
        ' fill="rgba(63,185,80,0.2)" stroke="#3fb950" stroke-width="1.5"/>' +
        '<text x="' + (sx + SLOT_W/2) + '" y="' + (y + SLOT_H/2 + 1) + '"' +
        ' font-family="Raleway,sans-serif" font-size="' + (a.label.length > 20 ? 7 : 8.5) + '" font-weight="700"' +
        ' fill="#3fb950" text-anchor="middle" dominant-baseline="middle">' + a.label + '</text>';
    } else if (active) {
      slots += '<g onclick="openBranchSlot(\'' + bid + '\',' + i + ')" style="cursor:pointer">' +
        '<rect x="' + sx + '" y="' + y + '" width="' + SLOT_W + '" height="' + SLOT_H + '" rx="6"' +
        ' fill="rgba(200,86,58,0.14)" stroke="#c8563a" stroke-width="2" stroke-dasharray="7 3"/>' +
        '<text x="' + (sx + SLOT_W/2) + '" y="' + (y + SLOT_H/2 + 1) + '"' +
        ' font-family="Raleway,sans-serif" font-size="15" font-weight="900"' +
        ' fill="#c8563a" text-anchor="middle" dominant-baseline="middle">?</text>' +
        '</g>';
    } else {
      slots += '<rect x="' + sx + '" y="' + y + '" width="' + SLOT_W + '" height="' + SLOT_H + '" rx="6"' +
        ' fill="rgba(22,27,34,0.7)" stroke="#30363d" stroke-width="1" stroke-dasharray="4 3" opacity="0.45"/>' +
        '<text x="' + (sx + SLOT_W/2) + '" y="' + (y + SLOT_H/2 + 1) + '"' +
        ' font-family="Raleway,sans-serif" font-size="10" fill="#30363d"' +
        ' text-anchor="middle" dominant-baseline="middle">—</text>';
    }

    // Branch connector line
    slots += '<line x1="' + lineX + '" y1="' + lineY + '" x2="' + midX + '" y2="' + lineY + '"' +
      ' stroke="' + (done ? '#3fb950' : active ? '#c8563a' : '#30363d') + '"' +
      ' stroke-width="' + (done ? 1.5 : active ? 1.5 : 1) + '"' +
      ' opacity="' + (done ? 0.65 : active ? 0.5 : 0.2) + '"' +
      ' stroke-dasharray="' + (done ? '0' : '4 3') + '"/>';

    // Index number on trunk
    slots += '<circle cx="' + CX + '" cy="' + lineY + '" r="7"' +
      ' fill="' + (done ? '#3fb950' : active ? '#c8563a' : '#1e2630') + '"' +
      ' stroke="' + (done ? '#3fb950' : active ? '#c8563a' : '#30363d') + '" stroke-width="1"/>' +
      '<text x="' + CX + '" y="' + lineY + '" font-family="Raleway,sans-serif"' +
      ' font-size="7" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="middle">' +
      (i + 1) + '</text>';
  });

  const trunk = '<line x1="' + CX + '" y1="20" x2="' + CX + '" y2="' + (totalH - 20) + '"' +
    ' stroke="#c8563a" stroke-width="2.5" opacity="0.4" stroke-linecap="round"/>' +
    '<text x="' + CX + '" y="13" font-family="Raleway,sans-serif" font-size="7" fill="#8b949e"' +
    ' text-anchor="middle" font-weight="700" letter-spacing="0.1em">TRONCO</text>';

  return '<svg viewBox="0 0 580 ' + totalH + '" xmlns="http://www.w3.org/2000/svg"' +
    ' style="width:100%;background:var(--surface);border-radius:12px;border:1px solid var(--border)">' +
    '<rect width="580" height="' + totalH + '" fill="var(--surface)" rx="12"/>' +
    trunk + slots + '</svg>';
}

window.openBranchSlot = function(bid, idx) {
  const b = BRANCHES[bid];
  const artery = b.arteries[idx];
  showBranchPopup(bid, artery, idx, b.arteries.length);
};

function showBranchPopup(bid, artery, step, total) {
  document.getElementById('puzzle-q-title').textContent = artery.question;
  document.getElementById('puzzle-q-body').textContent = `${BRANCHES[bid].label} · Artéria ${step+1} de ${total}`;

  // Set context image for this branch
  const focus = BRANCH_IMG_FOCUS[bid];
  const imgWrap = document.getElementById('puzzle-q-img-wrap');
  const img = document.getElementById('puzzle-q-img');
  if (focus) {
    const imgSrc = IMAGES[focus.src];
    img.src = imgSrc;
    img.style.objectPosition = focus.pos;
    img.style.objectFit = 'cover';
    imgWrap.style.display = 'block';
    // hide if image fails to load
    img.onerror = () => { imgWrap.style.display = 'none'; };
  } else {
    imgWrap.style.display = 'none';
  }

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
    if (val === normalizeInput(artery.label)) {
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
  const questions = pick(PHASE4_DB, 8).map(q => {
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
  el.innerHTML = createHUD('FASE 04 · Áreas de Irrigação', `${current+1}/${questions.length}`, "showScreen('screen-home')") + `
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
  const titles = { 1:'Fase 1 Concluída!', 2:'Fase 2 Concluída!', 3:'Fase 3 Concluída!', 4:'Parabéns! Jogo Completo! 🎓' };
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
