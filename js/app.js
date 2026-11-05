/* =========================================================
   ARENA PARTY HUB — 5 Jogos para Jogar em 1 ou 2 Aparelhos
   1. 💰 Acerte o Valor (Dá Pra Comprar? - Perguntas SIM/NÃO + Precisão Proporcional)
   2. ⚽ Tema Secreto (60+ Temas de Futebol, Categorias, Revelar Jogador configurável)
   3. 🕵️ Quem Sou Eu? (Adivinhe o Craque Secreto)
   4. 📈 Mais ou Menos? (Disputa de Recordes)
   5. ⚡ Duelo Relâmpago (Quiz de Futebol 1v1)
   ========================================================= */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const KEY = 'arenaHub.v2';
  const AVATARES = ['👨', '🧒', '👦', '👧', '👩', '🧔', '👴', '👵', '🦁', '🐯', '🐵', '🦊', '🐶', '🐱', '🐼', '🤖', '👽', '🦸', '🥷', '🧙', '🐸', '🦖', '⚽', '👑'];
  const CORES = ['#3B82F6', '#FF4D6D', '#1DD177', '#FF9F1C'];
  const LVL = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
  const FRASES = ['Campeão absoluto! 🥇', 'Craque demais! ⭐', 'Que show! 🔥', 'Ninguém segura! 🚀', 'Joga muito! 😎'];

  const LIMITES_VALOR = [
    { id: 10000, nome: 'Até R$ 10 mil' },
    { id: 100000, nome: 'Até R$ 100 mil' },
    { id: 1000000, nome: 'Até R$ 1 milhão' },
    { id: 100000000, nome: 'Até R$ 100 milhões' },
    { id: 100000000000, nome: 'Livre (até R$ 100 bi)' }
  ];

  /* ---------------- armazenamento ---------------- */
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }

  const randId = () => String(Math.floor(1000 + Math.random() * 9000));
  if (!store.hubTitle) store.hubTitle = 'ARENA 🆚 JOGOS';
  if (!store.profile || !store.profile.id) {
    store.profile = { id: randId(), nome: 'Jogador 1', av: '👨' };
  }

  // Detecta se já existe outra aba aberta no mesmo navegador neste exato momento
  let tabRole = null;
  try { tabRole = sessionStorage.getItem(KEY + '.tabRole'); } catch (e) {}
  const lastPrimaryTs = Number(localStorage.getItem(KEY + '.primaryTs') || 0);
  const anotherTabActive = (Date.now() - lastPrimaryTs < 12000);

  if (tabRole === 'primary' || (!tabRole && !anotherTabActive)) {
    tabRole = 'primary';
    try {
      sessionStorage.setItem(KEY + '.tabRole', 'primary');
      localStorage.setItem(KEY + '.primaryTs', String(Date.now()));
    } catch (e) {}
    setInterval(() => {
      try { localStorage.setItem(KEY + '.primaryTs', String(Date.now())); } catch (e) {}
    }, 5000);
    window.addEventListener('beforeunload', () => {
      try { localStorage.removeItem(KEY + '.primaryTs'); } catch (e) {}
    });
  } else {
    tabRole = 'secondary';
    try { sessionStorage.setItem(KEY + '.tabRole', 'secondary'); } catch (e) {}
    let secProf = null;
    try { secProf = JSON.parse(sessionStorage.getItem(KEY + '.secProf')); } catch (e) {}
    if (!secProf || !secProf.id || secProf.id === store.profile.id) {
      secProf = { id: randId(), nome: 'Jogador 2', av: '🧒' };
      try { sessionStorage.setItem(KEY + '.secProf', JSON.stringify(secProf)); } catch (e) {}
    }
    store.profile = secProf;
  }
  window.__IS_SECONDARY_TAB = (tabRole === 'secondary');
  if (!Array.isArray(store.players) || store.players.length < 2) {
    store.players = [
      { nome: store.profile.nome || 'Jogador 1', av: store.profile.av || '👨', id: store.profile.id },
      { nome: 'Jogador 2', av: '🧒', id: randId() }
    ];
  }
  if (typeof store.som !== 'boolean') store.som = true;
  if (!Array.isArray(store.itens)) store.itens = [];
  if (!Array.isArray(store.temas)) store.temas = [];
  if (!Array.isArray(store.friends)) store.friends = [];
  store.stats = Object.assign({ vitorias: 0, partidas: 0, pontos: 0 }, store.stats);

  let cloudItens = [];
  let cloudTemas = [];

  store.moneyCfg = Object.assign({
    limite: 1000000,     // limite máximo do valor secreto
    perguntas: 5,        // perguntas por jogador
    mostrarPreco: 'sim'  // 'sim' | 'nao' nas sugestões
  }, store.moneyCfg);

  store.footCfg = Object.assign({
    nivel: 'todos',
    cat: 'todas',
    rodadas: 2,
    fichas: [12, 12, 12, 12],
    revelarInicial: 'sim', // 'sim' (começa com 1 jogador revelado grátis) | 'nao'
    custoRevelar: 2,       // 0 (grátis), 1, 2, 3, -1 (desativado)
    maxRevelar: 3          // máximo de revelações compradas por rodada
  }, store.footCfg);

  const save = () => {
    try {
      if (window.__IS_SECONDARY_TAB) {
        sessionStorage.setItem(KEY + '.secProf', JSON.stringify(store.profile));
      } else {
        localStorage.setItem(KEY, JSON.stringify(store));
      }
    } catch (e) {}
  };
  SFX.on = store.som;

  let G = null;          // partida atual
  let screen = 'home';   // tela atual
  let params = {};       // parâmetros da tela
  const ui = {
    itemCat: 'todas',
    itemSearch: '',
    temaCat: 'todas',
    temaSearch: '',
    showAllTemas: false
  };

  /* ---------------- utilidades ---------------- */
  const P = () => (NET.inRoom ? store.players.slice(0, 2) : store.players);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cor = i => CORES[i % CORES.length];
  const nome = i => esc((P()[i] || store.players[0]).nome);
  const avt = i => (P()[i] || store.players[0]).av;
  const who = i => `${avt(i)} ${nome(i)}`;
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const allItens = () => {
    const localNames = new Set(store.itens.map(i => i.n.toLowerCase()));
    const extraCloud = cloudItens.filter(c => !localNames.has(c.n.toLowerCase()));
    return window.ITENS.concat(store.itens, extraCloud);
  };
  const allTemas = () => {
    const localTitles = new Set(store.temas.map(t => t.titulo.toLowerCase()));
    const extraCloud = cloudTemas.filter(c => !localTitles.has(c.titulo.toLowerCase()));
    return window.TEMAS.concat(store.temas, extraCloud);
  };
  const temaById = id => allTemas().find(t => t.id === id);

  function getStatsExtra() {
    return {
      hubTitle: store.hubTitle,
      vitorias: store.stats.vitorias || 0,
      partidas: store.stats.partidas || 0,
      pontos: store.stats.pontos || 0
    };
  }

  function recordMatchResult(modoLabel) {
    if (!G || G.cloudRecorded) return;
    G.cloudRecorded = true;
    const rank = ranking();
    const top = rank[0].pts;
    const ws = rank.filter(r => r.pts === top);
    const myIdx = NET.active ? NET.myIdx : 0;
    const myPts = G.pts[myIdx] || 0;
    const iWon = ws.length === 1 && ws[0].i === myIdx;

    store.stats.partidas = (store.stats.partidas || 0) + 1;
    if (iWon) store.stats.vitorias = (store.stats.vitorias || 0) + 1;
    store.stats.pontos = (store.stats.pontos || 0) + Math.max(1, myPts);
    save();
    NET.updateProfile(store.profile, getStatsExtra());

    // Apenas o Admin/Host (ou jogo local) grava o registro da partida no histórico geral para não duplicar
    if (NET.isAdmin && window.FB && window.FB.ready) {
      const vencedorTxt = ws.length > 1
        ? `Empate (${ws.map(w => P()[w.i].nome).join(' & ')})`
        : `${P()[ws[0].i].av} ${P()[ws[0].i].nome}`;
      window.FB.recordMatch({
        modo: modoLabel,
        vencedor: vencedorTxt,
        pts: G.pts.slice(0, 2),
        players: P().slice(0, 2).map(p => `${p.av} ${p.nome}`)
      });
    }
  }

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmt = v => BRL.format(Math.round(v));
  function curto(v) {
    v = Math.round(v);
    const dec = x => (x >= 100 ? Math.round(x) : Math.round(x * 10) / 10);
    const f = (x, s, p) => { const n = dec(x); return String(n).replace('.', ',') + ' ' + (n >= 2 ? p : s); };
    if (v >= 1e12) return f(v / 1e12, 'trilhão', 'trilhões');
    if (v >= 1e9) return f(v / 1e9, 'bilhão', 'bilhões');
    if (v >= 1e6) return f(v / 1e6, 'milhão', 'milhões');
    if (v >= 1e3) return String(dec(v / 1e3)).replace('.', ',') + ' mil';
    return String(v);
  }

  /* Cálculo de precisão proporcional (0 a 100%) — justo para qualquer ordem de grandeza! */
  function calcPrecisao(chute, real) {
    chute = Math.max(1, Number(chute) || 1);
    real = Math.max(1, Number(real) || 1);
    const ratio = Math.min(chute, real) / Math.max(chute, real);
    return Math.round(ratio * 1000) / 10; // ex: 90.0 (%)
  }

  function norm(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const aliases = p => p.split('|').map(s => s.trim()).filter(Boolean);
  const mainName = p => aliases(p)[0];

  function matchPlayer(input, tema) {
    const n = norm(input);
    if (!n) return null;
    const list = tema.jogadores.map(p => ({ main: mainName(p), al: aliases(p).map(norm) }));
    for (const x of list) if (x.al.includes(n)) return x.main;
    if (!n.includes(' ') && n.length >= 4) {
      for (const x of list) if (x.al.some(a => a.split(' ').pop() === n)) return x.main;
    }
    if (n.length >= 5) {
      const tol = n.length >= 9 ? 2 : 1;
      let best = null, bd = 99;
      for (const x of list) for (const a of x.al) {
        if (Math.abs(a.length - n.length) > tol) continue;
        const d = lev(n, a);
        if (d <= tol && d < bd) { bd = d; best = x.main; }
      }
      if (best) return best;
    }
    return null;
  }

  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2100);
    setTimeout(() => t.remove(), 2500);
  }
  function modal(html) {
    closeModal();
    const m = document.createElement('div');
    m.className = 'modal-bg'; m.id = 'modal';
    m.innerHTML = `<div class="modal">${html}</div>`;
    document.body.appendChild(m);
  }
  function closeModal() { const m = document.getElementById('modal'); if (m) m.remove(); }

  function celebrate() {
    SFX.fanfare();
    Confetti.burst({ n: 170 });
    setTimeout(() => Confetti.burst({ rain: true, n: 70, emojis: ['🏆', '⭐', '🎉'] }), 600);
  }

  function fillDatalist() {
    const set = new Set();
    allTemas().forEach(t => t.jogadores.forEach(j => set.add(mainName(j))));
    (window.EXTRAS_JOGADORES || []).forEach(n => set.add(n));
    const dl = document.getElementById('dlJogadores');
    if (dl) dl.innerHTML = [...set].sort((a, b) => a.localeCompare(b, 'pt')).map(n => `<option value="${esc(n)}">`).join('');
  }

  (function initBg() {
    const el = document.getElementById('bgFloat');
    const em = ['💰', '⚽', '🏆', '💸', '🎮', '⭐', '🚗', '👟', '💎', '🥅', '🍕', '🚀'];
    let h = '';
    for (let i = 0; i < 14; i++) {
      h += `<span style="left:${Math.random() * 92}%;animation-duration:${16 + Math.random() * 16}s;animation-delay:-${Math.random() * 30}s;font-size:${28 + Math.random() * 30}px">${em[i % em.length]}</span>`;
    }
    el.innerHTML = h;
  })();

  /* ---------------- NAVEGAÇÃO & REDE 2 APARELHOS ---------------- */
  const S = {};
  const AF = {};
  const A = {};

  function adaptScreen(s, p) {
    p = Object.assign({}, p);
    if (!NET.active) return { s, p };
    if (s === 'moneyPick') {
      p.p = NET.myIdx;
      return { s: 'moneyPick', p };
    }
    if ((s === 'footChoose' || s === 'footCustom' || s === 'footSecret') && G && G.cur) {
      if (NET.myIdx !== G.cur.chooser) return { s: 'footWaitChooser', p: {} };
      return { s, p };
    }
    if (s === 'footWaitChooser' && G && G.cur && NET.myIdx === G.cur.chooser) {
      return { s: G.cur.tema ? 'footSecret' : 'footChoose', p: {} };
    }
    return { s, p };
  }

  function go(s, p = {}, sync = false, ev = null) {
    const ad = adaptScreen(s, p);
    screen = ad.s;
    params = ad.p;
    closeModal();
    render();
    window.scrollTo(0, 0);
    if (sync && NET.active) syncNet(s, p, ev);
  }

  function syncNet(targetScreen, targetParams, ev, toastMsg) {
    if (!NET.active) return;
    NET.send({
      type: 'state',
      hubTitle: store.hubTitle,
      players: store.players.slice(0, 2),
      moneyCfg: store.moneyCfg,
      footCfg: store.footCfg,
      temas: store.temas,
      itens: store.itens,
      G,
      screen: targetScreen || screen,
      params: targetParams || params,
      ev: ev || null,
      toastMsg: toastMsg || null
    });
  }

  NET.onStatusChange = st => {
    if (st === 'connected') {
      SFX.coin();
      if (NET.isGuest) {
        // Guest envia seu próprio Perfil para ocupar o slot 1 da sala!
        store.players[1] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
        NET.send({ type: 'hello', p1: store.players[1] });
      } else if (NET.isHost) {
        store.players[0] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
        syncNet(screen, params);
      }
    } else if (st === 'peer_left') {
      toast('⚠️ O outro aparelho desconectou.');
    }
    render();
  };

  function renderOnlinePeersList() {
    const online = NET.onlineList;
    return `
      <h3>🟢 Jogadores Online Agora (${online.length})</h3>
      ${online.length
        ? online.map(u => `
            <div class="friend-row">
              <span class="fav">${esc(u.av)}</span>
              <div class="fnm">
                ${esc(u.nome)} <span class="badge green">Online</span>
                <small>ID #${esc(u.id)} ${u.inRoom ? '• Em sala' : '• Disponível no lobby'}</small>
              </div>
              <button class="btn btn-sm btn-yellow" data-a="convidarId" data-id="${esc(u.id)}">📨 Convidar</button>
            </div>`).join('')
        : `<p class="muted"><small>Assim que o outro aparelho abrir o site, o perfil dele aparece aqui automaticamente para você convidar com 1 toque!</small></p>`}`;
  }

  NET.onLobbyChange = () => {
    if (screen === 'home') {
      const sub = document.getElementById('homeOnlineSub');
      if (sub && !NET.active) {
        const c = NET.onlineList.length;
        sub.textContent = c > 0 ? `🟢 ${c} jogador(es) online agora para convidar!` : 'Crie uma sala com código ou convide um amigo online';
      }
    } else if (screen === 'room') {
      const box = document.getElementById('onlinePeersBox');
      if (box) box.innerHTML = renderOnlinePeersList();
    }
  };

  NET.onInviteReceived = (fromProfile, roomCode) => {
    if (!fromProfile || !roomCode) return;
    SFX.fanfare();
    ui.pendingInviteCode = roomCode;
    ui.pendingInviteFrom = fromProfile;
    modal(`
      <div class="center">
        <div style="font-size:64px">${esc(fromProfile.av || '🎮')}</div>
        <h3>📨 Convite para Jogar!</h3>
        <p style="font-size:18px"><b>${esc(fromProfile.nome)}</b> <small class="muted">(#${esc(fromProfile.id)})</small> está te chamando para a Sala <b>#${esc(roomCode)}</b>!</p>
        <div class="row" style="margin-top:16px">
          <button class="btn btn-big btn-green" data-a="acceptInvite">✅ Aceitar e Entrar</button>
          <button class="btn btn-big btn-red" data-a="fechar">❌ Agora não</button>
        </div>
      </div>`);
  };

  A.acceptInvite = () => {
    const code = ui.pendingInviteCode;
    const from = ui.pendingInviteFrom;
    closeModal();
    if (!code) return;
    if (from && from.id && !store.friends.some(f => f.id === from.id)) {
      store.friends.push({ id: from.id, nome: from.nome, av: from.av });
      save();
    }
    store.players[1] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
    NET.joinRoom(code);
    go('room');
  };

  NET.onMessage = msg => {
    if (!msg || !msg.type) return;

    if (msg.type === 'hello' && NET.isHost) {
      if (msg.p1 && msg.p1.nome) {
        store.players[1] = {
          nome: String(msg.p1.nome).slice(0, 16),
          av: msg.p1.av || '🧒',
          id: msg.p1.id || ''
        };
        if (msg.p1.id && !store.friends.some(f => f.id === msg.p1.id)) {
          store.friends.push({ id: msg.p1.id, nome: store.players[1].nome, av: store.players[1].av });
        }
        save();
      }
      toast(`🎉 ${store.players[1].nome} entrou na sala!`);
      Confetti.burst({ n: 70, emojis: ['📲', '🎉', '⚽'] });
      syncNet(screen, params);
      render();
      return;
    }

    if (msg.type === 'state') {
      if (msg.hubTitle) store.hubTitle = msg.hubTitle;
      if (Array.isArray(msg.players) && msg.players.length >= 2) {
        store.players[0] = msg.players[0];
        store.players[1] = msg.players[1];
      }
      if (msg.moneyCfg) store.moneyCfg = msg.moneyCfg;
      if (msg.footCfg) store.footCfg = msg.footCfg;
      if (Array.isArray(msg.temas)) { store.temas = msg.temas; fillDatalist(); }
      if (Array.isArray(msg.itens)) store.itens = msg.itens;
      const prevScreen = screen;
      const prevKp = G ? G.kp : '';
      const prevKpHide = G ? G.kpHide : false;
      G = msg.G;
      if (G && prevScreen === 'moneyPick') {
        G.kp = prevKp;
        G.kpHide = prevKpHide;
      }
      const ad = adaptScreen(msg.screen || screen, msg.params || {});
      screen = ad.s;
      params = ad.p;
      closeModal();
      render();
      if (msg.ev === 'yes') SFX.yes();
      else if (msg.ev === 'no') SFX.no();
      else if (msg.ev === 'pop') SFX.pop();
      else if (msg.ev === 'whistle') SFX.whistle();
      else if (msg.ev === 'coin') SFX.coin();
      if (msg.toastMsg) toast(msg.toastMsg);
      return;
    }

    if (msg.type === 'moneyVal' && G && G.mode === 'money') {
      const idx = msg.p;
      if (msg.ctx === 'secret') {
        G.secret[idx] = msg.val;
        if (G.secret[0] != null && G.secret[1] != null) {
          go('moneyAsk');
        } else {
          render();
        }
      } else if (msg.ctx === 'guess') {
        G.guess[idx] = msg.val;
        if (G.guess[0] != null && G.guess[1] != null) {
          finishMoneyGame();
        } else {
          render();
        }
      }
      return;
    }

    if (msg.type === 'chuteTemaReq' && G && G.cur) {
      if (NET.myIdx === G.cur.chooser) {
        G.cur.chuteTxt = msg.txt || '';
        modal(`
          <h3>🎯 ${who(G.cur.guesser)} chutou o tema!</h3>
          <div class="hint" style="font-size:19px;margin:10px 0"><b>Chute:</b> "${esc(msg.txt || '(falou em voz alta)')}"</div>
          <div class="secret-mini"><span class="se">${esc(G.cur.tema.emoji || '⚽')}</span><div><small>Tema secreto real:</small><b>${esc(G.cur.tema.titulo)}</b></div></div>
          <p style="margin-top:14px"><b>⚖️ Você é o juiz: acertou o tema?</b></p>
          <div class="row">
            <button class="btn btn-green" data-a="chuteOk">✅ Acertou!</button>
            <button class="btn btn-red" data-a="chuteErr">❌ Errou (-3 ⚽)</button>
          </div>`);
        SFX.pop();
      }
      return;
    }

    if (msg.type === 'juizDecideReq' && G && G.cur) {
      if (NET.myIdx === G.cur.chooser) {
        juizModal(msg.txt);
        SFX.pop();
      }
      return;
    }
  };

  function modeClass() {
    if (screen.startsWith('money')) return 'm-money';
    if (screen.startsWith('foot') || screen.startsWith('who')) return 'm-foot';
    if (screen.startsWith('hl') || screen.startsWith('quiz')) return 'm-quiz';
    if (screen === 'pass' && G) return G.mode === 'money' ? 'm-money' : 'm-foot';
    return '';
  }

  let lastRenderedHtml = '';
  let lastRenderedScreen = '';

  function render() {
    const newHtml = S[screen]();
    const isNewScreen = (screen !== lastRenderedScreen);
    if (!isNewScreen && newHtml === lastRenderedHtml) return;

    // Preserva valores de inputs/textareas caso re-renderize a mesma tela
    const savedInputs = {};
    if (!isNewScreen) {
      app.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
        if (el.type === 'checkbox') savedInputs[el.id] = { checked: el.checked };
        else savedInputs[el.id] = { value: el.value };
      });
    }

    const activeEl = document.activeElement;
    const focusId = activeEl && activeEl.id ? activeEl.id : null;
    const selStart = activeEl && typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null;

    if (isNewScreen) app.classList.remove('same-screen');
    else app.classList.add('same-screen');

    lastRenderedHtml = newHtml;
    lastRenderedScreen = screen;
    app.innerHTML = newHtml;
    const nextCls = modeClass();
    if (document.body.className !== nextCls) document.body.className = nextCls;

    if (!isNewScreen) {
      Object.keys(savedInputs).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if ('checked' in savedInputs[id]) el.checked = savedInputs[id].checked;
        else if (id !== 'itemSearchIn' && id !== 'temaSearchIn') el.value = savedInputs[id].value;
      });
    }

    if (isNewScreen && AF[screen]) AF[screen]();
    else if (!isNewScreen && screen === 'footPlay' && AF.footPlay) AF.footPlay();

    if (focusId) {
      const nf = document.getElementById(focusId);
      if (nf) {
        nf.focus({ preventScroll: true });
        if (selStart != null && typeof nf.setSelectionRange === 'function') {
          try { nf.setSelectionRange(selStart, selStart); } catch (e) {}
        }
      }
    }
  }

  /* ---------------- COMPONENTES COMUNS ---------------- */
  const somBtn = () => `<button class="icon-btn" data-a="som" title="Som">${store.som ? '🔊' : '🔇'}</button>`;
  const roomPill = () => NET.active
    ? `<button class="btn btn-sm" style="background:#c9ffdf;padding:4px 10px;font-size:13px" data-a="goRoom"><span class="live-dot"></span> Sala ${NET.code} (${NET.isHost ? '👑 Admin' : 'Convidado'})</button>`
    : '';
  const topbar = (center = '') => `<div class="topbar"><button class="icon-btn" data-a="sair" title="Menu">🏠</button><div class="grow">${roomPill()}${center}</div>${somBtn()}</div>`;
  const topbarSimple = () => `<div class="topbar"><button class="icon-btn" data-a="home" title="Voltar">⬅️</button><div class="grow">${roomPill()}</div>${somBtn()}</div>`;
  const pchip = i => `<span class="pchip" style="--pc:${cor(i)}"><span class="av">${avt(i)}</span>${nome(i)}</span>`;
  const scorebar = () => !G || !G.pts ? '' : `<div class="scorebar">${P().map((p, i) => `<span class="sc" style="--pc:${cor(i)}"><span class="av">${p.av}</span>${G.pts[i]}</span>`).join('')}</div>`;

  /* Botões segmentados — respeitam bloqueio de Admin quando conectado em 2 aparelhos! */
  function seg(cfgName, k, v, label) {
    const on = String(store[cfgName][k]) === String(v);
    const dis = !NET.isAdmin ? 'disabled' : '';
    return `<button class="${on ? 'on' : ''}" data-a="cfg" data-m="${cfgName}" data-k="${k}" data-v="${v}" ${dis}>${label}</button>`;
  }

  const adminBanner = () => !NET.isAdmin
    ? `<div class="admin-lock">👑 Somente o Admin da sala (<b>${who(0)}</b>) pode alterar as configurações e iniciar a partida.</div>`
    : (NET.active ? `<div class="admin-lock" style="background:#c9ffdf">👑 Você é o Admin da sala! Configure a partida abaixo e clique para começar.</div>` : '');

  function ranking() { return P().map((p, i) => ({ i, pts: G.pts[i] })).sort((a, b) => b.pts - a.pts); }
  function winnerBlock(rank) {
    const top = rank[0].pts;
    const ws = rank.filter(r => r.pts === top);
    if (ws.length > 1) {
      return `<div class="winner"><div class="trophy">🤝</div><h2>EMPATE!</h2><p class="sub-w">${ws.map(w => who(w.i)).join(' e ')} empataram!</p></div>`;
    }
    const i = ws[0].i;
    return `<div class="winner" style="--pc:${cor(i)}"><div class="trophy">🏆</div><div class="wav">${avt(i)}</div><h2>${nome(i)} venceu!</h2><p class="sub-w">${FRASES[Math.floor(Math.random() * FRASES.length)]}</p></div>`;
  }
  function rankRows(rank, suffix = '') {
    const med = ['🥇', '🥈', '🥉', '4º'];
    return rank.map((r, k) => `<div class="rank-row"><span class="pos">${med[k]}</span><span class="nm">${who(r.i)}</span><span class="pts">${r.pts}${suffix}</span></div>`).join('');
  }

  /* =========================================================
     HOME — CENTRAL DE JOGOS (HUB)
     ========================================================= */
  S.home = () => {
    const onlineCount = NET.onlineList.length;
    return `
    <div class="screen">
      <div class="hub-header">
        <div class="profile-pill" data-a="goProfile" title="Editar meu perfil">
          <span class="av">${esc(store.profile.av)}</span>
          <div>
            <div>${esc(store.profile.nome)}</div>
            <div class="tag-id">ID #${esc(store.profile.id)} ✏️</div>
          </div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="icon-btn" data-a="goRanking" title="Ranking & Histórico na Nuvem">🏆</button>
          <button class="icon-btn" data-a="goPlayers" title="Jogadores locais">👥</button>
          ${somBtn()}
        </div>
      </div>

      <h1 class="logo" data-a="goProfile" title="Toque para personalizar o nome do Hub">${esc(store.hubTitle)}</h1>
      <p class="tagline">Escolha o jogo • 1 ou 2 aparelhos 🎮</p>

      <div class="players-bar">
        ${P().map((p, i) => pchip(i)).join('<span class="vs-mini">🆚</span>')}
      </div>

      <button class="room-banner ${NET.active ? 'on' : ''}" data-a="goRoom">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:26px">${NET.active ? '🟢' : '📲'}</span>
          <div>
            ${NET.active
              ? `<div><b>Sala #${NET.code} Conectada!</b> (${NET.isHost ? '👑 Admin' : 'Convidado'})</div>
                 <small class="muted">${who(0)} 🆚 ${who(1)}</small>`
              : `<div><b>Jogar em 2 Aparelhos / Amigos Online</b></div>
                 <small class="muted" id="homeOnlineSub">${onlineCount > 0 ? `🟢 ${onlineCount} jogador(es) online agora para convidar!` : 'Crie uma sala com código ou convide um amigo online'}</small>`}
          </div>
        </div>
        <span class="badge">${NET.active ? 'Ver Sala' : 'Conectar ➡️'}</span>
      </button>

      <div class="hub-section-title">🔥 Jogos Principais</div>

      <button class="mode-card money" data-a="goMoney">
        <span class="tag">VIRAL</span>
        <span class="mode-emoji">💰</span>
        <h2>Acerte o Valor</h2>
        <p>Cada um escolhe um valor secreto! Faça perguntas de "Dá pra comprar...?" (SIM/NÃO) e descubra o valor do adversário!</p>
      </button>

      <button class="mode-card foot" data-a="goFoot">
        <span class="tag">60+ TEMAS</span>
        <span class="mode-emoji">⚽</span>
        <h2>Tema Secreto</h2>
        <p>Um escolhe o tema secreto de futebol e o outro chuta jogadores usando fichas, dicas e revelações!</p>
      </button>

      <div class="hub-section-title">⚡ Mais Jogos do Hub</div>

      <div class="hub-grid-2">
        <button class="mini-game-card" style="background:linear-gradient(135deg,#E9D5FF,#C084FC)" data-a="goWho">
          <span class="me">🕵️</span>
          <b>Quem Sou Eu?</b>
          <span>Descubra o craque secreto na sua testa com dicas!</span>
        </button>
        <button class="mini-game-card" style="background:linear-gradient(135deg,#BAE6FD,#38BDF8)" data-a="goHL">
          <span class="me">📈</span>
          <b>Mais ou Menos?</b>
          <span>Quem tem mais gols, títulos ou recordes?</span>
        </button>
      </div>

      <button class="mode-card quiz" style="margin-top:10px" data-a="goQuiz">
        <span class="mode-emoji">⚡</span>
        <h2>Duelo Relâmpago</h2>
        <p>Quiz 1v1 de Futebol e Curiosidades: quem acerta mais perguntas vence!</p>
      </button>

      <div class="foot-links">
        <button class="btn btn-ghost btn-sm" data-a="goRanking">🏆 Ranking & Histórico</button>
        <button class="btn btn-ghost btn-sm" data-a="goEditor">🛠️ Criar itens e temas</button>
        <button class="btn btn-ghost btn-sm" data-a="goProfile">👤 Meu Perfil & Nuvem</button>
      </div>
    </div>`;
  };

  /* =========================================================
     PERFIL, CONTA GOOGLE & PERSONALIZAÇÃO DO HUB
     ========================================================= */
  S.profile = () => {
    const isG = window.FB && window.FB.isGoogle;
    const fbUser = window.FB && window.FB.user;
    const fbReady = window.FB && window.FB.ready;
    return `
  <div class="screen">
    ${topbarSimple()}
    <h2 class="title-w">👤 Meu Perfil & Nuvem</h2>

    <div class="panel">
      <h3>☁️ Conta & Sincronização (Google Firebase)</h3>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div>
          <span class="badge ${fbReady ? 'green' : ''}">${fbReady ? (isG ? '🟢 Conta Google Conectada' : '☁️ Nuvem Ativa (Modo Rápido)') : '⏳ Conectando...'}</span>
          ${isG && fbUser && fbUser.email ? `<div style="margin-top:4px;font-size:14px"><b>${esc(fbUser.email)}</b></div>` : `<div class="muted" style="margin-top:4px"><small>Seus amigos, salas e ranking sincronizam em tempo real no Firebase.</small></div>`}
        </div>
        ${isG
          ? `<button class="btn btn-sm btn-red" data-a="logoutGoogle">🚪 Sair do Google</button>`
          : `<button class="btn btn-sm btn-blue" data-a="loginGoogle">🔑 Entrar com Google</button>`}
      </div>
      <div class="row" style="margin-top:12px;text-align:center">
        <div style="background:#f8fafc;padding:8px;border-radius:12px;border:2px solid var(--ink)">
          <small class="muted">🏆 Vitórias</small>
          <div class="lilita" style="font-size:22px;color:var(--green)">${store.stats.vitorias || 0}</div>
        </div>
        <div style="background:#f8fafc;padding:8px;border-radius:12px;border:2px solid var(--ink)">
          <small class="muted">🎮 Partidas</small>
          <div class="lilita" style="font-size:22px;color:var(--blue)">${store.stats.partidas || 0}</div>
        </div>
        <div style="background:#f8fafc;padding:8px;border-radius:12px;border:2px solid var(--ink)">
          <small class="muted">⭐ Pontos</small>
          <div class="lilita" style="font-size:22px;color:var(--purple)">${store.stats.pontos || 0}</div>
        </div>
      </div>
    </div>

    <div class="panel">
      <h3>🪪 Seu Perfil Online</h3>
      <p class="muted"><small>Seu ID único para amigos te convidarem: <b>#${esc(store.profile.id)}</b></small></p>
      <div class="pedit" style="--pc:${cor(0)}">
        <button class="avbtn" data-a="profAvOpen">${store.profile.av}</button>
        <input class="inp" id="profNome" maxlength="16" value="${esc(store.profile.nome)}" placeholder="Seu nome ou apelido">
      </div>
      <div class="av-grid" style="margin-top:10px">
        ${AVATARES.map(a => `<button class="${a === store.profile.av ? 'on' : ''}" data-a="profAvPick" data-v="${a}">${a}</button>`).join('')}
      </div>
    </div>

    <div class="panel">
      <h3>🏷️ Nome do Hub (Título da Tela Inicial)</h3>
      <input class="inp" id="hubTitleIn" maxlength="26" value="${esc(store.hubTitle)}" placeholder="Ex: ARENA DE JOGOS ou PAI 🆚 FILHO">
      <div class="kp-quick" style="justify-content:flex-start;margin-top:8px">
        <button class="chip-btn alt" data-a="setHubPreset" data-v="ARENA 🆚 JOGOS">ARENA 🆚 JOGOS</button>
        <button class="chip-btn alt" data-a="setHubPreset" data-v="PAI 🆚 FILHO">PAI 🆚 FILHO</button>
        <button class="chip-btn alt" data-a="setHubPreset" data-v="CENTRAL DE JOGOS">CENTRAL DE JOGOS</button>
      </div>
    </div>

    <button class="btn btn-big btn-yellow" data-a="saveProfile">Salvar Perfil ✅</button>
  </div>`;
  };

  A.goProfile = () => go('profile');
  A.loginGoogle = async () => {
    if (!window.FB) return;
    try {
      const u = await window.FB.loginGoogle();
      if (u && u.displayName && (store.profile.nome === 'Jogador' || store.profile.nome === 'Jogador 1')) {
        store.profile.nome = u.displayName.split(' ')[0].slice(0, 16);
      }
      const cloudDoc = await window.FB.loadCloudProfile();
      if (cloudDoc) {
        if (cloudDoc.nome) store.profile.nome = cloudDoc.nome;
        if (cloudDoc.av) store.profile.av = cloudDoc.av;
        if (cloudDoc.id) store.profile.id = cloudDoc.id;
        if (cloudDoc.hubTitle) store.hubTitle = cloudDoc.hubTitle;
        if (typeof cloudDoc.vitorias === 'number') store.stats.vitorias = Math.max(store.stats.vitorias || 0, cloudDoc.vitorias);
        if (typeof cloudDoc.partidas === 'number') store.stats.partidas = Math.max(store.stats.partidas || 0, cloudDoc.partidas);
        if (typeof cloudDoc.pontos === 'number') store.stats.pontos = Math.max(store.stats.pontos || 0, cloudDoc.pontos);
      }
      const mySlot = NET.inRoom ? NET.myIdx : 0;
      store.players[mySlot] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
      save();
      NET.updateProfile(store.profile, getStatsExtra());
      SFX.fanfare();
      toast('Conectado com Google! 🎉');
      render();
    } catch (e) {
      toast('Login cancelado ou domínio não autorizado no console.');
    }
  };
  A.logoutGoogle = async () => {
    if (!window.FB) return;
    await window.FB.logoutGoogle();
    toast('Sessão Google desconectada.');
    render();
  };

  /* =========================================================
     RANKING & HISTÓRICO DE PARTIDAS NA NUVEM (FIRESTORE)
     ========================================================= */
  const MODO_NOMES = {
    money: '💰 Acerte o Valor',
    foot: '⚽ Tema Secreto',
    who: '🕵️ Quem Sou Eu?',
    hl: '📈 Mais ou Menos?',
    quiz: '⚡ Duelo Relâmpago'
  };

  S.ranking = () => {
    const lb = (window.FB && window.FB.leaderboard) || [];
    const matches = (window.FB && window.FB.matches) || [];
    const med = ['🥇', '🥈', '🥉'];
    return `
    <div class="screen">
      ${topbarSimple()}
      <h2 class="title-w">🏆 Ranking & Histórico</h2>
      <p class="sub-w">Sincronizado em tempo real no Google Firebase ☁️</p>

      <div class="panel">
        <h3>🏅 Ranking Geral de Jogadores</h3>
        ${lb.length
          ? lb.slice(0, 15).map((u, idx) => `
              <div class="rank-row">
                <span class="pos">${med[idx] || (idx + 1) + 'º'}</span>
                <span class="nm">
                  ${esc(u.av)} ${esc(u.nome)}
                  <small class="muted">(#${esc(u.id)})</small>
                  ${u.online ? '<span class="badge green" style="font-size:10px;padding:2px 6px;margin-left:4px">Online</span>' : ''}
                </span>
                <span class="pts">${u.vitorias} 🏆 <small class="muted">(${u.partidas} jgs)</small></span>
              </div>`).join('')
          : '<p class="muted"><small>Jogue a primeira partida para estrear o Ranking na nuvem!</small></p>'}
      </div>

      <div class="panel">
        <h3>📜 Últimas Partidas no Hub</h3>
        ${matches.length
          ? matches.slice(0, 12).map(m => `
              <div class="list-row" style="flex-direction:column;align-items:stretch;gap:4px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span class="badge">${esc(MODO_NOMES[m.modo] || m.modo || '🎮 Partida')}</span>
                  <small class="muted">🏆 ${esc(m.vencedor)}</small>
                </div>
                <div style="font-weight:700;font-size:15px">
                  ${Array.isArray(m.players) && m.players.length >= 2
                    ? `${esc(m.players[0])} (${m.pts ? m.pts[0] : 0}) 🆚 (${m.pts ? m.pts[1] : 0}) ${esc(m.players[1])}`
                    : esc(m.vencedor)}
                </div>
              </div>`).join('')
          : '<p class="muted"><small>Nenhuma partida registrada ainda. Comece um jogo!</small></p>'}
      </div>

      <button class="btn btn-big btn-yellow" data-a="home">⬅️ Voltar ao Hub</button>
    </div>`;
  };
  A.goRanking = () => go('ranking');
  A.profAvPick = el => {
    const nEl = document.getElementById('profNome');
    if (nEl && nEl.value.trim()) store.profile.nome = nEl.value.trim();
    const hEl = document.getElementById('hubTitleIn');
    if (hEl && hEl.value.trim()) store.hubTitle = hEl.value.trim();
    store.profile.av = el.dataset.v;
    SFX.pop();
    render();
  };
  A.setHubPreset = el => {
    const hEl = document.getElementById('hubTitleIn');
    if (hEl) hEl.value = el.dataset.v;
    store.hubTitle = el.dataset.v;
    SFX.pop();
  };
  A.saveProfile = () => {
    const nEl = document.getElementById('profNome');
    const hEl = document.getElementById('hubTitleIn');
    if (nEl && nEl.value.trim()) store.profile.nome = nEl.value.trim();
    if (hEl && hEl.value.trim()) store.hubTitle = hEl.value.trim();
    // Atualiza slot local correspondente
    const mySlot = NET.inRoom ? NET.myIdx : 0;
    store.players[mySlot] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
    save();
    NET.updateProfile(store.profile, getStatsExtra());
    SFX.coin();
    toast('Perfil atualizado na nuvem! 🎉');
    go('home', {}, true);
  };

  /* =========================================================
     SALA 2 APARELHOS + AMIGOS ONLINE & CONVITES
     ========================================================= */
  S.room = () => {
    const online = NET.onlineList;
    const shareUrl = `${location.origin}${location.pathname}?sala=${NET.code || ''}`;

    const onlineHtml = `
      <div class="panel">
        <div id="onlinePeersBox">
          ${renderOnlinePeersList()}
        </div>

        <div style="margin-top:12px;padding-top:10px;border-top:2px dashed #eee">
          <small class="muted">Ou convide direto pelo <b>ID # de 4 dígitos</b> do perfil do amigo:</small>
          <div class="row" style="margin-top:6px">
            <input class="inp" id="friendIdIn" inputmode="numeric" maxlength="4" placeholder="ID # (ex: 4821)">
            <button class="btn btn-sm btn-blue" style="flex:0 0 auto" data-a="convidarInput">📨 Enviar Convite</button>
          </div>
        </div>
      </div>`;

    if (!NET.inRoom) {
      return `
      <div class="screen">
        ${topbarSimple()}
        <h2 class="title-w">📲 Sala & Amigos Online</h2>
        <p class="sub-w">Seu Perfil: <b>${esc(store.profile.av)} ${esc(store.profile.nome)} (#${esc(store.profile.id)})</b> <button class="btn btn-sm btn-ghost" style="padding:2px 8px;font-size:12px" data-a="goProfile">✏️ Editar</button></p>

        ${onlineHtml}

        <div class="panel">
          <h3>👑 Criar Sala como Admin (Aparelho 1)</h3>
          <p class="muted"><small>O Admin escolhe o jogo e configura as regras da partida.</small></p>
          <button class="btn btn-big btn-yellow" style="margin-top:8px" data-a="criarSala">Criar Sala e Gerar Código 📲</button>
        </div>

        <div class="panel">
          <h3>🔑 Entrar com Código da Sala (Aparelho 2)</h3>
          <input class="inp code-inp" id="joinCodeIn" inputmode="numeric" maxlength="4" value="${esc(ui.joinCode || '')}" placeholder="0000">
          <button class="btn btn-big btn-green" data-a="entrarSala">Entrar na Sala 🚀</button>
        </div>
      </div>`;
    }

    return `
    <div class="screen">
      ${topbarSimple()}
      <h2 class="title-w">📲 Sala #${NET.code}</h2>
      <div class="panel center">
        <span class="muted">Código da sala:</span>
        <div class="room-code-box"><div class="code">${NET.code}</div></div>
        <div class="row">
          <button class="btn btn-sm btn-ghost" data-a="copyLink">📋 Copiar Link de Convite</button>
        </div>
      </div>

      <div class="panel center">
        <h3>${NET.connected ? '🟢 Dois aparelhos conectados!' : '⏳ Aguardando o 2º aparelho entrar...'}</h3>
        <div class="players-bar" style="margin:14px 0">
          <span class="pchip" style="--pc:${cor(0)}"><span class="av">${avt(0)}</span>👑 ${nome(0)}</span>
          <span class="vs-mini">🆚</span>
          ${NET.connected ? pchip(1) : '<span class="pchip" style="opacity:.5">⏳ Aguardando...</span>'}
        </div>
        <p class="muted">Você é <b>${who(NET.myIdx)}</b> (${NET.isHost ? '👑 Admin da Sala' : 'Convidado'})</p>
        ${NET.connected ? (
          NET.isAdmin ? `
            <p style="font-weight:700;margin-top:12px">👑 Escolha qual jogo iniciar:</p>
            <div class="row" style="margin-top:8px">
              <button class="btn btn-yellow" data-a="goMoney">💰 Acerte o Valor</button>
              <button class="btn btn-green" data-a="goFoot">⚽ Tema Secreto</button>
            </div>
            <div class="row" style="margin-top:8px">
              <button class="btn btn-sm btn-ghost" data-a="goWho">🕵️ Quem Sou Eu?</button>
              <button class="btn btn-sm btn-ghost" data-a="goHL">📈 Mais/Menos</button>
              <button class="btn btn-sm btn-ghost" data-a="goQuiz">⚡ Quiz</button>
            </div>
          ` : `<div class="admin-lock">👑 Aguardando o Admin (<b>${who(0)}</b>) escolher o jogo...</div>`
        ) : `<p class="muted"><small>Você também pode convidar alguém online abaixo ou passar o código <b>${NET.code}</b>.</small></p>`}
      </div>

      ${!NET.connected ? onlineHtml : ''}

      <button class="btn btn-big btn-red" data-a="sairSala">🔌 Sair da Sala (voltar p/ 1 aparelho)</button>
    </div>`;
  };

  A.goRoom = () => go('room');
  A.criarSala = () => {
    store.players[0] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
    save();
    NET.createRoom();
    SFX.coin();
    render();
  };
  A.entrarSala = () => {
    const jc = document.getElementById('joinCodeIn');
    if (jc) ui.joinCode = jc.value.replace(/\D/g, '').slice(0, 4);
    const code = (ui.joinCode || '').replace(/\D/g, '');
    if (code.length !== 4) { toast('Digite os 4 números do código da sala! 🔢'); return; }
    store.players[1] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
    save();
    NET.joinRoom(code);
    SFX.pop();
    render();
  };
  A.convidarId = el => {
    const targetId = el.dataset.id;
    store.players[0] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
    const c = NET.inviteFriend(targetId);
    SFX.coin();
    toast(`📨 Convite enviado para #${targetId}! (Sala #${c})`);
    render();
  };
  A.convidarInput = () => {
    const inp = document.getElementById('friendIdIn');
    const id = inp ? inp.value.replace(/\D/g, '').slice(0, 4) : '';
    if (id.length !== 4) { toast('Digite os 4 números do ID # do amigo!'); return; }
    store.players[0] = { nome: store.profile.nome, av: store.profile.av, id: store.profile.id };
    const c = NET.inviteFriend(id);
    SFX.coin();
    toast(`📨 Convite enviado para #${id}! (Sala #${c})`);
    render();
  };
  A.copyLink = () => {
    const url = `${location.origin}${location.pathname}?sala=${NET.code}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => toast('Link copiado! Mande para o outro aparelho 📲'));
    } else {
      prompt('Copie o link da sala:', url);
    }
  };
  A.sairSala = () => {
    NET.stop();
    G = null;
    toast('Sala desconectada.');
    go('home');
  };

  /* =========================================================
     JOGADORES LOCAIS (MODO 1 APARELHO)
     ========================================================= */
  S.players = () => `
  <div class="screen">
    ${topbarSimple()}
    <h2 class="title-w">👥 Jogadores</h2>
    <div class="panel">
      ${store.players.slice(0, 2).map((p, i) => `
        <div class="pedit" style="--pc:${cor(i)}">
          <button class="avbtn" data-a="avOpen" data-i="${i}" title="Trocar avatar">${p.av}</button>
          <input class="inp" id="pn${i}" maxlength="16" value="${esc(p.nome)}" placeholder="Nome do Jogador ${i + 1}">
        </div>
        ${ui.avOpen === i ? `<div class="av-grid">${AVATARES.map(a => `<button class="${a === p.av ? 'on' : ''}" data-a="avPick" data-i="${i}" data-v="${a}">${a}</button>`).join('')}</div>` : ''}
      `).join('')}
      <p class="muted"><small>Personalize os nomes e avatares de quem vai jogar.</small></p>
    </div>
    <button class="btn btn-big btn-yellow" data-a="savePlayers">Salvar ✅</button>
  </div>`;

  function syncNames() {
    store.players.slice(0, 2).forEach((p, i) => { const el = document.getElementById('pn' + i); if (el) p.nome = el.value; });
  }
  A.avOpen = el => { syncNames(); const i = +el.dataset.i; ui.avOpen = ui.avOpen === i ? null : i; render(); };
  A.avPick = el => { syncNames(); store.players[+el.dataset.i].av = el.dataset.v; ui.avOpen = null; SFX.pop(); render(); };
  A.savePlayers = () => {
    syncNames();
    store.players.forEach((p, i) => { p.nome = p.nome.trim() || `Jogador ${i + 1}`; });
    store.profile.nome = store.players[0].nome;
    store.profile.av = store.players[0].av;
    save(); SFX.coin();
    go('home', {}, true);
  };

  /* =========================================================
     JOGO 1 — 💰 ACERTE O VALOR ("DÁ PRA COMPRAR?")
     O verdadeiro jogo viral:
     1. Cada um escolhe um VALOR SECRETO (dentro do limite).
     2. O adversário NÃO VÊ o seu valor!
     3. Turnos alternados de perguntas: "Com o seu valor, dá pra comprar X?" -> Adversário responde SIM ou NÃO.
     4. Ao final das perguntas, cada um CHUTA o valor secreto do adversário.
     5. Ganha quem tiver a maior PRECISÃO PROPORCIONAL (%)!
     ========================================================= */
  S.moneySetup = () => {
    const c = store.moneyCfg;
    return `
    <div class="screen">
      ${topbarSimple()}
      <h2 class="title-w">💰 Acerte o Valor</h2>
      ${adminBanner()}
      <div class="panel">
        <span class="label">Limite máximo do Valor Secreto</span>
        <div class="seg">
          ${LIMITES_VALOR.map(l => seg('moneyCfg', 'limite', l.id, l.nome)).join('')}
        </div>
        <span class="label">Perguntas para cada jogador</span>
        <div class="seg">
          ${[3, 5, 8, 10, 12].map(n => seg('moneyCfg', 'perguntas', n, `${n} cada`)).join('')}
        </div>
        <span class="label">Mostrar preço médio nas sugestões de pergunta?</span>
        <div class="seg">
          ${seg('moneyCfg', 'mostrarPreco', 'sim', '💡 Sim (ajuda na referência)')}
          ${seg('moneyCfg', 'mostrarPreco', 'nao', '🙈 Não (sem dica de preço)')}
        </div>
      </div>

      <div class="panel">
        <h3>📜 Como funciona</h3>
        <ul class="rules">
          <li><span class="ic">🤫</span><span>Cada jogador escolhe um <b>Valor Secreto</b> (até ${fmt(c.limite)}). <b>O outro não vê!</b></span></li>
          <li><span class="ic">❓</span><span>Vocês se revezam fazendo <b>${c.perguntas} perguntas</b> cada: <i>"Com o seu valor, dá pra comprar um PS5?"</i>, <i>"Dá pra comprar um BYD popular?"</i>.</span></li>
          <li><span class="ic">🗣️</span><span>O adversário olha o próprio valor secreto e responde <b>SIM, DÁ! ✅</b> ou <b>NÃO DÁ! ❌</b>.</span></li>
          <li><span class="ic">🎯</span><span>Depois das perguntas, cada um dá o <b>Chute Final</b> de quanto acha que é o valor secreto do adversário.</span></li>
          <li><span class="ic">⚖️</span><span><b>Pontuação Proporcional Justa:</b> ganha quem chegar proporcionalmente mais perto (em %) do valor do adversário!</span></li>
        </ul>
      </div>

      ${NET.isAdmin
        ? `<button class="btn btn-big btn-yellow" data-a="startMoney">Começar Partida! 🚀</button>`
        : `<button class="btn btn-big btn-ghost" disabled>⏳ Aguardando Admin iniciar...</button>`}
    </div>`;
  };

  A.startMoney = () => {
    if (!NET.isAdmin) return;
    const c = store.moneyCfg;
    G = {
      mode: 'money',
      limite: Number(c.limite) || 1000000,
      maxQ: Number(c.perguntas) || 5,
      mostrarPreco: c.mostrarPreco !== 'nao',
      secret: [null, null],       // valor secreto de cada jogador (NUNCA mostrado ao oponente até o fim!)
      guess: [null, null],        // chute final que cada jogador deu sobre o valor do OPONENTE
      turn: 0,                    // de quem é a vez de perguntar (0 ou 1)
      askedCount: [0, 0],         // quantas perguntas cada um já fez
      readyForGuess: [false, false],
      pendingQ: null,             // { from, to, text, refPrice, emoji } aguardando SIM/NÃO
      logs: [[], []],             // logs[targetIdx] = perguntas feitas SOBRE o valor de targetIdx: [{ q, refPrice, emoji, ans }]
      pts: [0, 0],
      prec: [0, 0],
      kp: '',
      kpHide: false,
      ended: false
    };
    SFX.coin();
    if (NET.active) {
      go('moneyPick', { p: NET.myIdx, ctx: 'secret' }, true, 'coin');
    } else {
      goSecretPick(0);
    }
  };

  function goSecretPick(i) {
    G.kp = ''; G.kpHide = false;
    go('pass', {
      p: i,
      msg: `Escolha o seu <b>VALOR SECRETO</b> (até ${fmt(G.limite)}).<br>${who(1 - i)} vai tentar adivinhar fazendo perguntas! 🤫`,
      next: 'moneyPick',
      np: { p: i, ctx: 'secret' }
    });
  }

  function goGuessPick(i) {
    G.kp = ''; G.kpHide = false;
    go('pass', {
      p: i,
      msg: `Hora do <b>CHUTE FINAL</b>!<br>Quanto você acha que é o valor secreto de ${who(1 - i)}? 🎯`,
      next: 'moneyPick',
      np: { p: i, ctx: 'guess' }
    });
  }

  /* ---- TELA "PASSE O APARELHO" (1 APARELHO) ---- */
  S.pass = () => {
    const i = params.p;
    return `
    <div class="screen pass" style="--pc:${cor(i)}">
      <div class="pass-av">${avt(i)}</div>
      <h2>Vez de ${nome(i)}!</h2>
      <p class="pass-msg">${params.msg || ''}</p>
      <p class="pass-msg" style="opacity:.8;margin-top:10px;font-size:15px">📲 Passe o aparelho • nada de espiar 👀</p>
      <button class="btn btn-big btn-yellow" data-a="passOk">Sou ${nome(i)}! Mostrar 👉</button>
      <button class="btn btn-sm btn-ghost" style="margin-top:18px" data-a="sair">🏠 Sair do jogo</button>
    </div>`;
  };
  A.passOk = () => { SFX.pop(); go(params.next, params.np || {}); };

  /* ---- TECLADO DE VALORES ---- */
  const kpVal = () => Number(G.kp || '0');
  function kpDispInner() {
    const v = kpVal();
    if (G.kpHide) return `<div class="kp-main">R$ ••••••</div><div class="kp-sub">valor escondido 🙈</div>`;
    return `<div class="kp-main">${fmt(v)}</div><div class="kp-sub">${v ? curto(v) + ' de reais' : `limite: até ${fmt(G.limite)}`}</div>`;
  }
  function kpHTML() {
    const allQuick = [[10, '+10'], [100, '+100'], [1000, '+1 mil'], [10000, '+10 mil'], [100000, '+100 mil'], [1e6, '+1 milhão'], [1e9, '+1 bilhão']];
    const quick = allQuick.filter(([v]) => v <= G.limite);
    return `
      <div class="kp-display" id="kpDisp">${kpDispInner()}</div>
      <div class="kp-quick">${quick.map(([v, l]) => `<button class="chip-btn" data-a="kpAdd" data-v="${v}">${l}</button>`).join('')}<button class="chip-btn alt" data-a="kpX10">×10</button></div>
      <div class="keypad">
        ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0'].map(k => `<button class="key" data-a="kpDigit" data-k="${k}">${k}</button>`).join('')}
        <button class="key back" data-a="kpBack">⌫</button>
      </div>`;
  }
  function updKp() {
    const d = document.getElementById('kpDisp'); if (d) d.innerHTML = kpDispInner();
    const b = document.getElementById('kpOk'); if (b) b.disabled = kpVal() <= 0;
  }
  function kpShake() { const d = document.getElementById('kpDisp'); if (d) { d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); } }
  function kpSet(n) {
    const max = G && G.limite ? G.limite : 999999999999;
    if (n > max) { n = max; kpShake(); toast(`Limite máximo da partida: ${fmt(max)}`); }
    G.kp = n > 0 ? String(Math.round(n)) : '';
    updKp();
  }
  function kpDigit(k) {
    const s = ((G.kp || '') + k).replace(/^0+/, '');
    const n = Number(s || '0');
    const max = G && G.limite ? G.limite : 999999999999;
    if (n > max) { kpSet(max); return; }
    G.kp = s; SFX.tick(); updKp();
  }
  A.kpDigit = el => kpDigit(el.dataset.k);
  A.kpBack = () => { G.kp = (G.kp || '').slice(0, -1); updKp(); };
  A.kpAdd = el => { SFX.coin(); kpSet(kpVal() + Number(el.dataset.v)); };
  A.kpX10 = () => { SFX.pop(); kpSet(kpVal() * 10); };
  A.kpClear = () => kpSet(0);
  A.kpHide = el => { G.kpHide = !G.kpHide; el.textContent = G.kpHide ? '👁️ Mostrar' : '🙈 Esconder'; updKp(); };

  /* Calcula a faixa mínima e máxima descoberta sobre o valor secreto de `targetIdx` */
  function getDiscoveredBounds(targetIdx) {
    const logs = (G && G.logs && G.logs[targetIdx]) || [];
    let minYes = 0;
    let maxNo = G ? G.limite : null;
    logs.forEach(item => {
      if (item.refPrice) {
        if (item.ans && item.refPrice > minYes) minYes = item.refPrice;
        if (!item.ans && (maxNo === null || item.refPrice < maxNo)) maxNo = item.refPrice;
      }
    });
    return { minYes, maxNo };
  }

  function renderInvestigationSummary(targetIdx) {
    const logs = (G && G.logs && G.logs[targetIdx]) || [];
    const b = getDiscoveredBounds(targetIdx);
    return `
      <div class="range-tracker">
        <div class="rt-head">
          <span>🔎 Pistas sobre o valor de <b>${who(targetIdx)}</b></span>
          <span>Limite: ${curto(G.limite)}</span>
        </div>
        <div class="rt-vals">
          <div class="range-box min">
            <small>DÁ PRA COMPRAR (≥)</small>
            <b>${b.minYes > 0 ? fmt(b.minYes) : 'R$ ?'}</b>
          </div>
          <span style="font-size:20px">↔️</span>
          <div class="range-box max">
            <small>NÃO DÁ (&lt;)</small>
            <b>${b.maxNo != null ? fmt(b.maxNo) : fmt(G.limite)}</b>
          </div>
        </div>
      </div>
      ${logs.length ? `
        <div class="panel" style="margin-top:10px">
          <h3>📋 Respostas de ${who(targetIdx)} (${logs.length})</h3>
          <div class="gchips">
            ${logs.map(l => `<span class="gchip ${l.ans ? 'ok' : 'no'}" style="cursor:default">${l.ans ? '✅ DÁ:' : '❌ NÃO DÁ:'} ${esc(l.emoji || '')} ${esc(l.q)}${G.mostrarPreco && l.refPrice ? ` (${curto(l.refPrice)})` : ''}</span>`).join('')}
          </div>
        </div>` : ''}`;
  }

  S.moneyPick = () => {
    const i = NET.active ? NET.myIdx : params.p;
    const otherIdx = 1 - i;
    const ctx = params.ctx; // 'secret' | 'guess'
    const myVal = ctx === 'secret' ? G.secret[i] : G.guess[i];

    if (NET.active && myVal != null) {
      return `
      <div class="screen">
        ${topbar(pchip(i))}
        <div class="wait-card">
          <div class="we">🤫</div>
          <h3>${ctx === 'secret' ? 'Valor Secreto Guardado!' : 'Chute Final Confirmado!'}</h3>
          <p>Você confirmou <b>${fmt(myVal)}</b> (${curto(myVal)}).</p>
          <p class="muted" style="margin-top:12px">⏳ Aguardando <b>${who(otherIdx)}</b> confirmar no outro aparelho...</p>
        </div>
      </div>`;
    }

    const head = ctx === 'secret'
      ? `<h2 class="title-w">🤫 Seu Valor Secreto</h2>
         <p class="sub-w">${who(i)}, escolha quanto dinheiro você tem (até <b>${fmt(G.limite)}</b>).<br><b>${who(otherIdx)} NÃO vai ver esse valor!</b></p>`
      : `<h2 class="title-w">🎯 Chute Final!</h2>
         <p class="sub-w">${who(i)}, quanto dinheiro você acha que <b>${who(otherIdx)}</b> escolheu em segredo?</p>
         ${renderInvestigationSummary(otherIdx)}`;

    return `
    <div class="screen">
      ${topbar(pchip(i))}
      ${head}
      <div class="panel">
        ${kpHTML()}
        <div class="row" style="margin-top:10px">
          <button class="btn btn-sm btn-ghost" data-a="kpHide">${G.kpHide ? '👁️ Mostrar' : '🙈 Esconder'}</button>
          <button class="btn btn-sm btn-ghost" data-a="kpClear">🧹 Limpar</button>
        </div>
      </div>
      <button class="btn btn-big btn-green" id="kpOk" data-a="kpOk" ${kpVal() > 0 ? '' : 'disabled'}>
        ${ctx === 'secret' ? 'Guardar Valor Secreto 🔒' : `Chutar Valor de ${nome(otherIdx)} 🎯`}
      </button>
    </div>`;
  };

  A.kpOk = () => {
    const v = kpVal();
    if (v <= 0 || screen !== 'moneyPick') return;
    const i = NET.active ? NET.myIdx : params.p;
    SFX.coin();
    G.kp = '';

    if (NET.active) {
      if (params.ctx === 'secret') {
        G.secret[i] = v;
        NET.send({ type: 'moneyVal', p: i, ctx: 'secret', val: v });
        if (G.secret[0] != null && G.secret[1] != null) go('moneyAsk');
        else render();
      } else {
        G.guess[i] = v;
        NET.send({ type: 'moneyVal', p: i, ctx: 'guess', val: v });
        if (G.guess[0] != null && G.guess[1] != null) finishMoneyGame();
        else render();
      }
      return;
    }

    if (params.ctx === 'secret') {
      G.secret[i] = v;
      if (i + 1 < 2) goSecretPick(i + 1); else go('moneyAsk');
    } else {
      G.guess[i] = v;
      if (i + 1 < 2) goGuessPick(i + 1); else finishMoneyGame();
    }
  };

  /* ---- TELA DE PERGUNTAS E RESPOSTAS (SIM / NÃO) ---- */
  S.moneyAsk = () => {
    const asker = G.turn;
    const answerer = 1 - asker;
    const pq = G.pendingQ;

    // Se existe uma pergunta pendente aguardando SIM ou NÃO do answerer:
    if (pq) {
      const souRespondente = !NET.active || NET.myIdx === pq.to;
      if (!souRespondente) {
        return `
        <div class="screen">
          ${topbar()}
          <div class="wait-card">
            <div class="we">${esc(pq.emoji || '❓')}</div>
            <h3>Pergunta enviada para ${who(pq.to)}!</h3>
            <p style="font-size:20px"><i>"Dá pra comprar <b>${esc(pq.text)}</b>?"</i></p>
            <p class="muted" style="margin-top:12px">⏳ Aguardando ${who(pq.to)} responder <b>SIM</b> ou <b>NÃO</b>...</p>
          </div>
          ${renderInvestigationSummary(pq.to)}
        </div>`;
      }

      const mySec = G.secret[pq.to];
      const autoHint = pq.refPrice && mySec != null
        ? (mySec >= pq.refPrice
            ? `<div class="hint" style="background:#c9ffdf">💡 <b>Dica automática:</b> Preço médio ~${fmt(pq.refPrice)}. Como seu valor secreto é <b>${ NET.active ? fmt(mySec) : 'maior/igual' }</b>, a resposta certa é <b>SIM, DÁ! ✅</b></div>`
            : `<div class="hint" style="background:#ffd6dd">💡 <b>Dica automática:</b> Preço médio ~${fmt(pq.refPrice)}. Como seu valor secreto é <b>${ NET.active ? fmt(mySec) : 'menor' }</b>, a resposta certa é <b>NÃO DÁ! ❌</b></div>`)
        : '';

      return `
      <div class="screen">
        ${topbar(pchip(pq.to))}
        <div class="round-info">Pergunta ${G.askedCount[pq.from] + 1}/${G.maxQ} de ${who(pq.from)} para ${who(pq.to)}</div>
        ${NET.active ? `<div class="secret-mini"><span class="se">🤫</span><div><small>Seu Valor Secreto (só você vê):</small><b>${fmt(mySec)} (${curto(mySec)})</b></div></div>` : ''}
        <div class="qa-card">
          <div class="qe">${esc(pq.emoji || '🛍️')}</div>
          <div class="q">${who(pq.from)} perguntou para ${who(pq.to)}:</div>
          <h3>"Com o seu valor, dá pra comprar ${esc(pq.text)}?"</h3>
          ${autoHint}
          <div class="row" style="margin-top:16px">
            <button class="btn btn-big btn-green" style="margin-top:0" data-a="ansMoney" data-v="sim">✅ SIM, DÁ!</button>
            <button class="btn btn-big btn-red" style="margin-top:0" data-a="ansMoney" data-v="nao">❌ NÃO DÁ!</button>
          </div>
        </div>
      </div>`;
    }

    // Não há pergunta pendente: é a vez de `asker` escolher ou digitar uma pergunta!
    const souPerguntador = !NET.active || NET.myIdx === asker;
    if (!souPerguntador) {
      const mySec = G.secret[NET.myIdx];
      return `
      <div class="screen">
        ${topbar(pchip(NET.myIdx))}
        <div class="secret-mini"><span class="se">🤫</span><div><small>Seu Valor Secreto (só você vê):</small><b>${fmt(mySec)} (${curto(mySec)})</b></div></div>
        <div class="wait-card">
          <div class="we">🤔</div>
          <h3>Vez de ${who(asker)} perguntar!</h3>
          <p>${who(asker)} está escolhendo uma pergunta (${G.askedCount[asker] + 1}/${G.maxQ}) para tentar descobrir o seu valor secreto...</p>
        </div>
        ${renderInvestigationSummary(asker)}
      </div>`;
    }

    // Filtrar itens pré-preenchidos para sugestão rápida
    const search = norm(ui.itemSearch || '');
    const sugs = allItens().filter(it => {
      if (ui.itemCat !== 'todas' && it.cat !== ui.itemCat) return false;
      if (search && !norm(it.n).includes(search)) return false;
      return true;
    });

    return `
    <div class="screen">
      ${topbar(pchip(asker))}
      <div class="round-info">Vez de ${who(asker)} perguntar (${G.askedCount[asker] + 1}/${G.maxQ}) • Descobrindo o valor de ${who(answerer)}</div>
      ${NET.active ? `<div class="secret-mini"><span class="se">🤫</span><div><small>Seu Valor Secreto (protegido):</small><b>${fmt(G.secret[asker])} (${curto(G.secret[asker])})</b></div></div>` : ''}

      ${renderInvestigationSummary(answerer)}

      <div class="panel">
        <h3>❓ Faça uma pergunta para ${who(answerer)}:</h3>
        <form id="customAskForm" class="guess-form" style="margin-top:6px" autocomplete="off">
          <input id="customAskIn" class="inp" placeholder="Dá pra comprar... (ex: um BYD popular)" maxlength="70">
          <button class="btn btn-yellow" type="submit">Perguntar 🗣️</button>
        </form>

        <span class="label" style="margin-top:14px">⚡ Ou toque numa pergunta pronta abaixo:</span>
        <div class="cat-tabs">
          ${window.CATEGORIAS_ITENS.map(c => `<button class="cat-tab ${ui.itemCat === c.id ? 'on' : ''}" data-a="setItemCat" data-c="${c.id}">${c.nome}</button>`).join('')}
        </div>
        <input class="inp" id="itemSearchIn" value="${esc(ui.itemSearch)}" placeholder="🔍 Buscar item (ex: PS5, carro, casa...)" style="padding:8px 12px;font-size:15px;margin-top:4px">

        <div class="sug-grid">
          ${sugs.map((it, idx) => `
            <button class="sug-btn" data-a="askPreset" data-n="${esc(it.n)}" data-p="${it.p}" data-e="${esc(it.e)}">
              <span class="se">${esc(it.e)}</span>
              <span class="st">
                ${esc(it.n)}
                ${G.mostrarPreco ? `<span class="sp">~${curto(it.p)}</span>` : ''}
              </span>
            </button>`).join('')}
        </div>
      </div>

      <div class="row" style="margin-top:12px">
        <button class="btn btn-purple" style="width:100%" data-a="irChuteFinal">🎯 Já sei o valor! Ir para o Chute Final ➡️</button>
      </div>
    </div>`;
  };

  A.setItemCat = el => { ui.itemCat = el.dataset.c; render(); };
  A.askPreset = el => {
    const text = el.dataset.n;
    const refPrice = Number(el.dataset.p) || null;
    const emoji = el.dataset.e || '🛍️';
    sendQuestion(text, refPrice, emoji);
  };

  function sendQuestion(text, refPrice, emoji) {
    text = String(text || '').replace(/^d[aá]\s+(pra|para)\s+comprar\s+/i, '').replace(/\?+$/, '').trim();
    if (!text) { toast('Escolha um item ou digite a pergunta!'); return; }
    // Se digitou manualmente mas bate com algum item do catálogo, vincula o preço de referência!
    if (!refPrice) {
      const found = allItens().find(it => norm(it.n) === norm(text) || norm(it.n).includes(norm(text)));
      if (found) { refPrice = found.p; emoji = found.e; }
    }
    G.pendingQ = {
      from: G.turn,
      to: 1 - G.turn,
      text,
      refPrice: refPrice || null,
      emoji: emoji || '🛍️'
    };
    SFX.pop();
    go('moneyAsk', {}, true, 'pop');
  }

  A.ansMoney = el => {
    if (!G || !G.pendingQ) return;
    const ans = el.dataset.v === 'sim';
    const pq = G.pendingQ;
    G.logs[pq.to].unshift({
      q: pq.text,
      refPrice: pq.refPrice,
      emoji: pq.emoji,
      ans
    });
    G.askedCount[pq.from]++;
    G.pendingQ = null;

    if (ans) SFX.yes(); else SFX.no();

    // Verifica se ambos atingiram o limite de perguntas ou pediram Chute Final
    const p0Done = G.askedCount[0] >= G.maxQ || G.readyForGuess[0];
    const p1Done = G.askedCount[1] >= G.maxQ || G.readyForGuess[1];

    if (p0Done && p1Done) {
      startFinalGuessPhase();
      return;
    }

    // Passa o turno para o outro jogador (se ele ainda tiver perguntas)
    const nextTurn = 1 - pq.from;
    if (G.askedCount[nextTurn] < G.maxQ && !G.readyForGuess[nextTurn]) {
      G.turn = nextTurn;
    } else {
      G.turn = pq.from;
    }
    go('moneyAsk', {}, true, ans ? 'yes' : 'no');
  };

  A.irChuteFinal = () => {
    if (!G) return;
    startFinalGuessPhase();
  };

  function startFinalGuessPhase() {
    G.pendingQ = null;
    G.kp = '';
    if (NET.active) {
      go('moneyPick', { p: NET.myIdx, ctx: 'guess' }, true, 'whistle');
    } else {
      goGuessPick(0);
    }
  }

  function finishMoneyGame() {
    // Player 0 chutou G.guess[0] tentando acertar G.secret[1]
    // Player 1 chutou G.guess[1] tentando acertar G.secret[0]
    const prec0 = calcPrecisao(G.guess[0], G.secret[1]);
    const prec1 = calcPrecisao(G.guess[1], G.secret[0]);
    G.prec = [prec0, prec1];
    G.pts = [Math.round(prec0 * 10), Math.round(prec1 * 10)];
    G.ended = true;
    go('moneyEnd', {}, true);
  }

  S.moneyEnd = () => {
    const rank = ranking();
    return `
    <div class="screen">
      ${topbar()}
      ${winnerBlock(rank)}

      <div class="panel">
        <h3>🎯 Comparação Proporcional Justa</h3>
        ${[0, 1].map(i => {
          const opp = 1 - i;
          const real = G.secret[opp];
          const chute = G.guess[i];
          const prec = G.prec[i];
          const isWin = G.pts[i] >= G.pts[opp];
          return `
            <div class="val-row ${isWin ? 'win' : ''}" style="--pc:${cor(i)};flex-direction:column;align-items:stretch">
              ${isWin ? '<span class="crown">👑</span>' : ''}
              <div style="display:flex;justify-content:space-between;align-items:center">
                <b>${who(i)} adivinhando o valor de ${who(opp)}:</b>
                <span class="badge ${prec >= 80 ? 'green' : ''}">${prec.toFixed(1)}% de precisão</span>
              </div>
              <div class="row" style="margin-top:8px;text-align:center">
                <div style="background:#f8fafc;padding:8px;border-radius:12px;border:2px solid var(--ink)">
                  <small class="muted">Valor Secreto de ${nome(opp)}</small>
                  <div class="lilita" style="font-size:20px;color:var(--green)">${fmt(real)}</div>
                  <small>${curto(real)}</small>
                </div>
                <div style="background:#f8fafc;padding:8px;border-radius:12px;border:2px solid var(--ink)">
                  <small class="muted">Chute Final de ${nome(i)}</small>
                  <div class="lilita" style="font-size:20px;color:var(--purple)">${fmt(chute)}</div>
                  <small>${curto(chute)}</small>
                </div>
              </div>
              <div class="prec-bar"><div class="prec-fill" style="width:${Math.max(4, prec)}%"></div></div>
            </div>`;
        }).join('')}
      </div>

      <div class="row">
        ${NET.isAdmin ? `<button class="btn btn-big btn-yellow" data-a="startMoney">🔁 Jogar de novo</button>` : ''}
        <button class="btn btn-big btn-ghost" data-a="home">🏠 Hub</button>
      </div>
    </div>`;
  };
  AF.moneyEnd = () => {
    celebrate();
    recordMatchResult('money');
  };

  /* =========================================================
     JOGO 2 — ⚽ TEMA SECRETO (FUTEBOL)
     - 60+ temas pré-preenchidos + filtro de categoria + busca
     - Configuração avançada do "Revelar Jogador" (1 grátis no início, custo e limite)
     - Somente Admin configura a sala
     ========================================================= */
  const CUSTO_PADRAO = { nao: 1, dica: 2, chute: 3, defesa: 5 };

  S.footSetup = () => {
    const c = store.footCfg;
    return `
    <div class="screen">
      ${topbarSimple()}
      <h2 class="title-w">⚽ Tema Secreto</h2>
      ${adminBanner()}
      <div class="panel">
        <span class="label">Categoria dos temas (${allTemas().length} temas disponíveis!)</span>
        <div class="seg">
          ${window.CATEGORIAS_TEMAS.map(ct => seg('footCfg', 'cat', ct.id, ct.nome)).join('')}
        </div>

        <span class="label">Nível de dificuldade</span>
        <div class="seg">
          ${seg('footCfg', 'nivel', 'facil', '🟢 Fácil')}
          ${seg('footCfg', 'nivel', 'medio', '🟡 Médio')}
          ${seg('footCfg', 'nivel', 'dificil', '🔴 Difícil')}
          ${seg('footCfg', 'nivel', 'todos', '🎲 Todos')}
        </div>

        <span class="label">Rodadas (vezes que cada um escolhe o tema)</span>
        <div class="seg">${[1, 2, 3].map(n => seg('footCfg', 'rodadas', n, n + 'x cada')).join('')}</div>

        <span class="label">👀 Configuração do "Revelar Jogador"</span>
        <small class="muted" style="display:block;margin-bottom:6px">1. Começar a rodada já com 1 jogador do tema revelado grátis na mesa?</small>
        <div class="seg">
          ${seg('footCfg', 'revelarInicial', 'sim', '✅ Sim (1 grátis no início)')}
          ${seg('footCfg', 'revelarInicial', 'nao', '❌ Não (começar do zero)')}
        </div>

        <small class="muted" style="display:block;margin:10px 0 6px">2. Custo para usar o botão "👀 Revelar Jogador" durante a partida:</small>
        <div class="seg">
          ${seg('footCfg', 'custoRevelar', 0, 'Grátis (0 ⚽)')}
          ${seg('footCfg', 'custoRevelar', 1, '-1 ⚽')}
          ${seg('footCfg', 'custoRevelar', 2, '-2 ⚽')}
          ${seg('footCfg', 'custoRevelar', 3, '-3 ⚽')}
          ${seg('footCfg', 'custoRevelar', -1, '🚫 Desativado')}
        </div>

        <small class="muted" style="display:block;margin:10px 0 6px">3. Limite de jogadores que podem ser revelados por rodada:</small>
        <div class="seg">
          ${seg('footCfg', 'maxRevelar', 1, 'Até 1')}
          ${seg('footCfg', 'maxRevelar', 2, 'Até 2')}
          ${seg('footCfg', 'maxRevelar', 3, 'Até 3')}
          ${seg('footCfg', 'maxRevelar', 5, 'Até 5')}
        </div>

        <span class="label">Fichas ⚽ iniciais de cada jogador</span>
        ${P().map((p, i) => `
          <div class="stepper">
            ${pchip(i)}<span class="nm"></span>
            <button class="icon-btn" data-a="ficha" data-i="${i}" data-d="-1" ${!NET.isAdmin ? 'disabled' : ''}>➖</button>
            <span class="val">${c.fichas[i] || 12}</span>
            <button class="icon-btn" data-a="ficha" data-i="${i}" data-d="1" ${!NET.isAdmin ? 'disabled' : ''}>➕</button>
          </div>`).join('')}
      </div>

      ${NET.isAdmin
        ? `<button class="btn btn-big btn-yellow" data-a="startFoot">Apita o Juiz! Começar 🏁</button>`
        : `<button class="btn btn-big btn-ghost" disabled>⏳ Aguardando Admin iniciar...</button>`}
    </div>`;
  };

  A.ficha = el => {
    if (!NET.isAdmin) return;
    const i = +el.dataset.i, f = store.footCfg.fichas;
    f[i] = Math.max(3, Math.min(30, (f[i] || 12) + Number(el.dataset.d)));
    save(); render();
    if (NET.active) syncNet(screen, params);
  };

  const custoRev = () => Number(store.footCfg.custoRevelar);
  const fichas = c => {
    const cr = Math.max(0, Number(c.custoRevelar != null ? c.custoRevelar : 2));
    const revPagos = Math.max(0, c.revelados.length - (c.freeRev || 0));
    return c.ini
      - c.palpites.filter(p => !p.ok).length * CUSTO_PADRAO.nao
      - c.dicas * CUSTO_PADRAO.dica
      - revPagos * cr
      - c.erradas * CUSTO_PADRAO.chute;
  };
  const restantes = c => c.tema.jogadores.map(mainName)
    .filter(n => !c.revelados.includes(n) && !c.palpites.some(p => p.ok && p.match === n));
  const podeDica = c => c.dicas < c.tema.dicas.length && fichas(c) > CUSTO_PADRAO.dica;
  const podeRevelar = c => {
    if (c.custoRevelar < 0) return false;
    const pagos = c.revelados.length - (c.freeRev || 0);
    if (pagos >= (c.maxRevelar || 3)) return false;
    return restantes(c).length > 0 && fichas(c) > c.custoRevelar;
  };

  A.startFoot = () => {
    if (!NET.isAdmin) return;
    const c = store.footCfg, n = P().length;
    G = { mode: 'foot', total: n * c.rodadas, r: 0, pts: Array(n).fill(0), usados: [], cur: null, ended: false };
    SFX.whistle();
    newRound();
  };

  function sortearTemas(excl = []) {
    const nv = store.footCfg.nivel;
    const cat = ui.temaCat !== 'todas' ? ui.temaCat : store.footCfg.cat;
    let pool = allTemas().filter(t => (nv === 'todos' || t.nivel === nv) && (cat === 'todas' || t.cat === cat));
    if (pool.length < 4) pool = allTemas().filter(t => nv === 'todos' || t.nivel === nv);
    if (pool.length < 4) pool = allTemas();
    let livres = pool.filter(t => !G.usados.includes(t.id) && !excl.includes(t.id));
    if (livres.length < 4) livres = pool.filter(t => !excl.includes(t.id));
    if (livres.length < 4) livres = pool;
    return shuffle(livres).slice(0, 4).map(t => t.id);
  }

  function newRound() {
    const n = P().length;
    const chooser = G.r % n, guesser = (G.r + 1) % n;
    const cfg = store.footCfg;
    ui.temaCat = cfg.cat || 'todas';
    ui.temaSearch = '';
    ui.showAllTemas = false;
    G.cur = {
      chooser, guesser, tema: null, palpites: [], dicas: 0, revelados: [],
      freeRev: 0,
      revelarInicial: cfg.revelarInicial === 'sim',
      custoRevelar: Number(cfg.custoRevelar != null ? cfg.custoRevelar : 2),
      maxRevelar: Number(cfg.maxRevelar || 3),
      erradas: 0,
      ini: cfg.fichas[guesser] || 12, status: 'jogando', cands: [], last: null, fim: false
    };
    G.cur.cands = sortearTemas();
    if (NET.active) {
      go('footChoose', {}, true, 'whistle');
    } else {
      go('pass', { p: chooser, msg: `Você é o <b>juiz</b>: escolha o TEMA SECRETO!<br>${who(guesser)}, não olhe! 🙈`, next: 'footChoose' });
    }
  }

  S.footWaitChooser = () => {
    const c = G.cur;
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="wait-card">
        <div class="we">🤫</div>
        <h3>${who(c.chooser)} está escolhendo o Tema Secreto...</h3>
        <p>Você vai começar com <b>${c.ini} fichas ⚽</b> nesta rodada!</p>
        <p class="muted" style="margin-top:10px">Prepare seus chutes de craques... já vai começar!</p>
      </div>
    </div>`;
  };

  function temaCard(t) {
    if (!t) return '';
    return `
    <button class="tema-card" data-a="pickTema" data-id="${esc(t.id)}">
      <span class="te">${esc(t.emoji || '⚽')}</span>
      <span class="tt"><b>${esc(t.titulo)}</b>
        <span class="lvl ${t.nivel}">${LVL[t.nivel] || t.nivel}</span>
        ${t.custom ? '<span class="lvl custom">✍️ meu tema</span>' : ''}
        <small class="muted">&nbsp;${t.jogadores.length ? t.jogadores.length + ' jogadores' : 'juiz responde'}</small>
      </span>
    </button>`;
  }

  S.footChoose = () => {
    const c = G.cur;
    const search = norm(ui.temaSearch || '');
    const listToShow = (ui.showAllTemas || search)
      ? allTemas().filter(t => {
          if (ui.temaCat !== 'todas' && t.cat !== ui.temaCat) return false;
          if (search && !norm(t.titulo).includes(search)) return false;
          return true;
        })
      : c.cands.map(id => temaById(id)).filter(Boolean);

    return `
    <div class="screen">
      ${topbar(scorebar())}
      <h2 class="title-w">Escolha o tema<br>secreto 🤫</h2>
      <p class="sub-w">${who(c.guesser)} vai tentar adivinhar! (${allTemas().length} temas no banco)</p>

      <div class="cat-tabs">
        ${window.CATEGORIAS_TEMAS.map(ct => `<button class="cat-tab ${ui.temaCat === ct.id ? 'on' : ''}" data-a="setTemaCat" data-c="${ct.id}">${ct.nome}</button>`).join('')}
      </div>

      <div class="row" style="margin-top:6px">
        <input class="inp" id="temaSearchIn" value="${esc(ui.temaSearch)}" placeholder="🔍 Buscar tema (ex: Flamengo, Copa, Real...)" style="padding:8px 12px;font-size:15px">
        <button class="btn btn-sm btn-ghost" style="flex:0 0 auto" data-a="toggleAllTemas">${ui.showAllTemas ? '🎲 Ver 4 sorteados' : `📚 Ver todos (${allTemas().length})`}</button>
      </div>

      <div style="${ui.showAllTemas || search ? 'max-height:380px;overflow-y:auto;padding-right:4px' : ''}">
        ${listToShow.map(t => temaCard(t)).join('')}
      </div>

      <div class="row" style="margin-top:14px">
        <button class="btn btn-yellow" data-a="reroll">🔄 Sortear outros 4</button>
        <button class="btn btn-ghost" data-a="goCustomTema">✍️ Inventar tema</button>
      </div>
    </div>`;
  };
  A.setTemaCat = el => {
    ui.temaCat = el.dataset.c;
    G.cur.cands = sortearTemas();
    render();
  };
  A.toggleAllTemas = () => { ui.showAllTemas = !ui.showAllTemas; render(); };
  A.reroll = () => { ui.showAllTemas = false; ui.temaSearch = ''; G.cur.cands = sortearTemas(G.cur.cands); SFX.pop(); render(); };
  A.pickTema = el => { G.cur.tema = temaById(el.dataset.id); go('footSecret'); };
  A.goCustomTema = () => go('footCustom');
  A.backChoose = () => go('footChoose');

  function temaFormHTML() {
    return `
      <span class="label">Tema</span>
      <input class="inp" id="tfTitulo" maxlength="90" placeholder="Ex: Jogaram no Grêmio e no Inter">
      <div class="row" style="margin-top:4px">
        <div><span class="label">Emoji</span><input class="inp" id="tfEmoji" maxlength="4" placeholder="⚽"></div>
        <div><span class="label">Nível</span>
          <select class="inp" id="tfNivel"><option value="facil">Fácil</option><option value="medio" selected>Médio</option><option value="dificil">Difícil</option></select>
        </div>
      </div>
      <span class="label">Jogadores que valem (um por linha)</span>
      <textarea class="inp" id="tfJog" placeholder="Ronaldinho&#10;Ronaldo / Fenômeno&#10;Dunga"></textarea>
      <small class="muted">Use " / " para apelidos. Se deixar vazio, o juiz responde SIM/NÃO na hora.</small>
      <span class="label">Dicas (opcional)</span>
      <input class="inp" id="tfD1" placeholder="Dica 1 (mais vaga)">
      <input class="inp" id="tfD2" style="margin-top:8px" placeholder="Dica 2">
      <input class="inp" id="tfD3" style="margin-top:8px" placeholder="Dica 3 (mais forte)">`;
  }
  function readTemaForm() {
    const v = id => ((document.getElementById(id) || {}).value || '').trim();
    const titulo = v('tfTitulo');
    if (!titulo) { toast('Escreva o tema! ✍️'); return null; }
    const jogadores = v('tfJog').split(/\n|,/)
      .map(l => l.split('/').map(s => s.trim()).filter(Boolean).join('|'))
      .filter(Boolean);
    const dicas = [v('tfD1'), v('tfD2'), v('tfD3')].filter(Boolean);
    return { id: 'c' + Date.now(), custom: true, cat: 'curiosidades', titulo, emoji: v('tfEmoji') || '✍️', nivel: v('tfNivel') || 'medio', dicas, jogadores };
  }

  S.footCustom = () => `
  <div class="screen">
    ${topbar()}
    <h2 class="title-w">✍️ Inventar um tema</h2>
    <div class="panel">
      ${temaFormHTML()}
      <label class="label" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="tfSave" checked style="width:22px;height:22px"> Salvar nos meus temas</label>
    </div>
    <div class="row">
      <button class="btn btn-big btn-ghost" data-a="backChoose">⬅️ Voltar</button>
      <button class="btn btn-big btn-yellow" data-a="useCustomTema">Usar ✅</button>
    </div>
  </div>`;
  A.useCustomTema = () => {
    const t = readTemaForm();
    if (!t) return;
    if (document.getElementById('tfSave').checked || NET.active) { store.temas.push(t); save(); fillDatalist(); }
    G.cur.tema = t;
    go('footSecret');
  };

  S.footSecret = () => {
    const c = G.cur, t = c.tema;
    return `
    <div class="screen">
      ${topbar()}
      <h2 class="title-w">Seu tema secreto 🤫</h2>
      <div class="secret-box"><div class="se">${esc(t.emoji || '⚽')}</div><h2>${esc(t.titulo)}</h2></div>
      <div class="panel">
        <h3>✅ Respostas que valem (${t.jogadores.length})</h3>
        ${c.revelarInicial && t.jogadores.length ? `<p class="muted"><small>👀 <b>Toque num jogador abaixo</b> se quiser escolhê-lo como a pista inicial grátis (ou deixe que o jogo sorteie 1):</small></p>` : ''}
        ${t.jogadores.length
          ? `<div class="gchips">${t.jogadores.map(j => {
              const m = mainName(j);
              const sel = c.revelados[0] === m;
              return `<button class="gchip ${sel ? 'ok' : 'neutral'}" data-a="pickInitialRev" data-n="${esc(m)}">${sel ? '👀 Inicial: ' : ''}${esc(m)}</button>`;
            }).join('')}</div>`
          : '<p>Sem lista: você responde SIM ou NÃO na hora. ⚖️</p>'}
      </div>
      ${t.dicas.length ? `<div class="panel"><h3>💡 Dicas disponíveis</h3>${t.dicas.map((d, k) => `<div class="hint"><b>Dica ${k + 1}:</b> ${esc(d)}</div>`).join('')}</div>` : ''}
      <button class="btn btn-big btn-yellow" data-a="secretOk">${NET.active ? 'Começar a rodada nos 2 aparelhos! ⚽' : 'Memorizei! Começar ➡️'}</button>
      <button class="btn btn-sm btn-ghost" style="margin-top:12px;width:100%" data-a="backChoose">🔄 Trocar tema</button>
    </div>`;
  };

  A.pickInitialRev = el => {
    const c = G.cur;
    if (!c) return;
    const n = el.dataset.n;
    if (c.revelados[0] === n) {
      c.revelados = [];
      c.freeRev = 0;
    } else {
      c.revelados = [n];
      c.freeRev = 1;
    }
    SFX.pop();
    render();
  };

  A.secretOk = () => {
    const c = G.cur;
    G.usados.push(c.tema.id);
    // Se a opção "revelarInicial" está ativa e ainda não escolheu um inicial, sorteia 1 grátis!
    if (c.revelarInicial && c.tema.jogadores.length > 0 && c.revelados.length === 0) {
      const m = mainName(c.tema.jogadores[Math.floor(Math.random() * c.tema.jogadores.length)]);
      c.revelados = [m];
      c.freeRev = 1;
    }
    ui.apito = true;
    if (NET.active) {
      go('footPlay', {}, true, 'whistle');
    } else {
      go('pass', { p: c.guesser, msg: `Descubra o tema secreto de ${who(c.chooser)}!<br>Fale nomes de jogadores ⚽`, next: 'footPlay' });
    }
  };

  S.footPlay = () => {
    const c = G.cur, t = c.tema, f = Math.max(0, fichas(c));
    const isTwoDev = NET.active;
    const souJuiz = isTwoDev && NET.myIdx === c.chooser;
    const souAdiv = isTwoDev && NET.myIdx === c.guesser;
    const certos = new Set(c.palpites.filter(p => p.ok && p.match).map(p => p.match));

    const revCostTxt = c.custoRevelar < 0 ? 'off' : (c.custoRevelar === 0 ? 'grátis' : `-${c.custoRevelar} ⚽`);

    const hintsHtml = c.revelados.map((n, idx) => `<div class="hint" style="background:#c9ffdf"><b>👀 Jogador do tema${idx === 0 && c.freeRev ? ' (Pista Inicial Grátis)' : ''}:</b> <b>${esc(n)}</b> faz parte do tema!</div>`).join('')
      + t.dicas.slice(0, c.dicas).map((d, k) => `<div class="hint"><b>💡 Dica ${k + 1}:</b> ${esc(d)}</div>`).join('');

    const juizHeader = souJuiz ? `
      <div class="secret-mini">
        <span class="se">${esc(t.emoji || '⚽')}</span>
        <div style="flex:1">
          <small style="opacity:.75">⚖️ Você é o Juiz • Tema Secreto:</small>
          <b>${esc(t.titulo)}</b>
        </div>
        <button class="btn btn-sm btn-green" data-a="chuteOk" title="Marcar que acertou o tema">🏆 Acertou!</button>
      </div>` : '';

    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="round-info">Rodada ${G.r + 1}/${G.total} • ${who(c.guesser)} adivinhando o tema de ${who(c.chooser)}</div>
      ${juizHeader}
      <div class="fichas">
        <div><div class="num ${f <= 3 ? 'low' : ''}">${f}</div><div class="lbl center">fichas</div></div>
        <div class="balls">${Array.from({ length: c.ini }, (_, k) => `<span class="${k < f ? '' : 'gone'}">⚽</span>`).join('')}</div>
      </div>
      <form class="guess-form" id="guessForm" autocomplete="off">
        <input id="guessIn" list="dlJogadores" placeholder="${souJuiz ? 'Digitar jogador falado...' : 'Fale um jogador...'}" enterkeyhint="send" autocapitalize="words" autocorrect="off" spellcheck="false">
        <button class="btn btn-yellow" type="submit">Vai! ⚽</button>
      </form>
      <div class="big-stamp">${c.last ? `<span class="who-g">${esc(c.last.txt)}</span><span class="stamp ${c.last.ok ? 'ok' : 'no'}">${c.last.ok ? 'SIM! ✅' : 'NÃO! ❌'}</span>` : ''}</div>
      <div class="actions3">
        <button class="btn btn-blue" data-a="dica" ${podeDica(c) ? '' : 'disabled'}><span class="ic">💡</span>Dica<span class="cost">-${CUSTO_PADRAO.dica} ⚽</span></button>
        <button class="btn btn-purple" data-a="revelar" ${podeRevelar(c) ? '' : 'disabled'}><span class="ic">👀</span>Revelar 1<span class="cost">${revCostTxt}</span></button>
        <button class="btn btn-green" data-a="chutarTema"><span class="ic">🎯</span>Chutar tema<span class="cost">errou -${CUSTO_PADRAO.chute}</span></button>
      </div>
      ${hintsHtml ? `<div class="panel">${hintsHtml}</div>` : ''}
      <div class="panel"><h3>🗣️ Palpites (${c.palpites.length})</h3>
        ${c.palpites.length
          ? `<div class="gchips">${c.palpites.map((p, k) => `<button class="gchip ${p.ok ? 'ok' : 'no'}" ${souAdiv ? 'style="cursor:default"' : `data-a="togglePalp" data-i="${k}"`}>${p.ok ? '✅' : '❌'} ${esc(p.ok && p.match ? p.match : p.txt)}</button>`).join('')}</div>
             ${souAdiv ? '' : '<p class="muted"><small>⚖️ Juiz: toque num palpite para trocar entre SIM e NÃO.</small></p>'}`
          : '<p class="muted">Ninguém chutou ainda. Comece com um craque! 😄</p>'}
      </div>
      ${souJuiz && t.jogadores.length ? `
        <div class="panel"><h3>📋 Cola do Juiz (${certos.size + c.revelados.length}/${t.jogadores.length} na roda)</h3>
          <p class="muted"><small>Toque num jogador abaixo se quiser revelá-lo de graça como colher de chá:</small></p>
          <div class="gchips">${t.jogadores.map(j => {
            const m = mainName(j);
            const ok = certos.has(m) || c.revelados.includes(m);
            return `<button class="gchip ${ok ? 'ok' : 'neutral'}" data-a="juizGiveRev" data-n="${esc(m)}">${ok ? '✅ ' : '👀 '}${esc(m)}</button>`;
          }).join('')}</div>
        </div>` : ''}
      <div class="row" style="margin-top:16px">
        ${isTwoDev ? '' : '<button class="btn btn-sm btn-ghost hold-btn" data-hold="peek">🤫 Juiz: segure p/ ver</button>'}
        <button class="btn btn-sm btn-ghost" data-a="desistir">🏳️ Desistir</button>
      </div>
    </div>`;
  };
  AF.footPlay = () => {
    if (ui.apito) { ui.apito = false; SFX.whistle(); }
    if (ui.focusGuess) {
      ui.focusGuess = false;
      const inp = document.getElementById('guessIn');
      if (inp) inp.focus({ preventScroll: true });
    }
  };

  const jogando = () => G && G.cur && G.cur.status === 'jogando' && screen === 'footPlay';

  A.juizGiveRev = el => {
    if (!jogando()) return;
    const c = G.cur;
    const n = el.dataset.n;
    if (c.revelados.includes(n)) return;
    c.revelados.push(n);
    c.freeRev = (c.freeRev || 0) + 1; // colher de chá do juiz não desconta ficha!
    SFX.pop();
    toast(`👀 Juiz revelou ${n} grátis!`);
    render();
    if (NET.active) syncNet('footPlay', {}, 'pop', `👀 Juiz revelou: ${n}!`);
  };

  function palpite(txt) {
    if (!jogando()) return;
    const c = G.cur;
    txt = String(txt || '').trim();
    if (!txt) return;
    const n = norm(txt);
    if (c.palpites.some(p => norm(p.txt) === n)) { toast('Esse já foi! 😅'); limpaInput(); return; }
    if (!c.tema.jogadores.length) {
      if (NET.active && NET.myIdx !== c.chooser) {
        NET.send({ type: 'juizDecideReq', txt });
        modal(`<h3>⏳ Aguardando o Juiz...</h3><p>Perguntando para <b>${who(c.chooser)}</b> se <b>${esc(txt)}</b> vale no tema!</p>`);
        return;
      }
      juizModal(txt);
      return;
    }
    const m = matchPlayer(txt, c.tema);
    if (m && (c.palpites.some(p => p.ok && p.match === m) || c.revelados.includes(m))) {
      toast(`${m} já está na roda! 😅`); limpaInput(); return;
    }
    registra(txt, m, !!m);
  }
  function limpaInput() { const i = document.getElementById('guessIn'); if (i) { i.value = ''; i.focus(); } }
  function registra(txt, match, ok) {
    const c = G.cur;
    c.palpites.unshift({ txt, match, ok });
    c.last = { txt: match || txt, ok };
    if (ok) SFX.yes(); else SFX.no();
    ui.focusGuess = true;
    checaFichas(ok ? 'yes' : 'no');
  }
  function checaFichas(ev) {
    const c = G.cur;
    render();
    if (NET.active) syncNet('footPlay', {}, ev);
    if (fichas(c) <= 0 && c.status === 'jogando') {
      c.status = 'perdeu';
      toast('Acabaram as fichas! 😱');
      setTimeout(() => { if (G && G.cur === c) fimRodada(); }, 1400);
    }
  }
  function juizModal(txt) {
    ui.pendente = txt;
    modal(`
      <h3>⚖️ Juiz decide!</h3>
      <p style="font-size:20px"><b>${esc(txt)}</b> é do tema?</p>
      <div class="row"><button class="btn btn-green" data-a="juizSim">✅ SIM</button><button class="btn btn-red" data-a="juizNao">❌ NÃO</button></div>
      ${NET.active ? '' : '<button class="btn btn-sm btn-ghost hold-btn" style="margin-top:12px;width:100%" data-hold="peek">🤫 Segure para ver o tema</button>'}`);
  }
  A.juizSim = () => { closeModal(); registra(ui.pendente, ui.pendente, true); };
  A.juizNao = () => { closeModal(); registra(ui.pendente, null, false); };

  A.togglePalp = el => {
    if (!jogando()) return;
    if (NET.active && NET.myIdx !== G.cur.chooser) return;
    const p = G.cur.palpites[+el.dataset.i];
    if (!p) return;
    p.ok = !p.ok;
    G.cur.last = { txt: p.match || p.txt, ok: p.ok };
    SFX.pop();
    toast(p.ok ? '⚖️ Juiz corrigiu: SIM!' : '⚖️ Juiz corrigiu: NÃO!');
    checaFichas('pop');
  };
  A.dica = () => {
    if (!jogando() || !podeDica(G.cur)) return;
    G.cur.dicas++; SFX.pop(); render();
    if (NET.active) syncNet('footPlay', {}, 'pop');
  };
  A.revelar = () => {
    if (!jogando() || !podeRevelar(G.cur)) return;
    const r = restantes(G.cur);
    G.cur.revelados.push(r[Math.floor(Math.random() * r.length)]);
    SFX.pop();
    checaFichas('pop');
  };
  A.chutarTema = () => {
    if (!jogando()) return;
    const c = G.cur;
    if (NET.active && NET.myIdx === c.guesser) {
      modal(`
        <h3>🎯 Chutar o tema</h3>
        <p>Digite seu chute do tema (ou fale em voz alta) para o Juiz (${who(c.chooser)}) avaliar:</p>
        <input class="inp" id="chuteIn" placeholder="Ex: jogaram no Real e no Barça">
        <div class="row" style="margin-top:14px">
          <button class="btn btn-green" data-a="enviarChuteNet">🚀 Enviar chute</button>
          <button class="btn btn-ghost" data-a="fechar">Cancelar</button>
        </div>`);
      return;
    }
    modal(`
      <h3>🎯 Chutar o tema</h3>
      <p>${who(c.guesser)}, fale o tema em voz alta (ou escreva aqui):</p>
      <input class="inp" id="chuteIn" placeholder="Ex: jogaram no Real e no Barça">
      <p style="margin-top:16px"><b>⚖️ ${who(c.chooser)}, acertou?</b></p>
      <div class="row">
        <button class="btn btn-green" data-a="chuteOk">✅ Acertou!</button>
        <button class="btn btn-red" data-a="chuteErr">❌ Errou</button>
      </div>
      ${NET.active ? '' : '<button class="btn btn-sm btn-ghost hold-btn" style="margin-top:12px;width:100%" data-hold="peek">🤫 Juiz: segure p/ ver o tema</button>'}
      <button class="btn btn-sm btn-ghost" style="margin-top:8px;width:100%" data-a="fechar">Cancelar</button>`);
  };
  A.enviarChuteNet = () => {
    if (!jogando()) return;
    const inp = document.getElementById('chuteIn');
    const txt = inp ? inp.value.trim() : '';
    NET.send({ type: 'chuteTemaReq', txt });
    modal(`<h3>⏳ Aguardando o Juiz...</h3><p><b>${who(G.cur.chooser)}</b> está conferindo no outro aparelho se você acertou o tema!</p>`);
  };
  A.chuteOk = () => {
    if (!jogando()) return;
    const inp = document.getElementById('chuteIn');
    if (inp && inp.value.trim()) G.cur.chuteTxt = inp.value.trim();
    closeModal();
    G.cur.status = 'ganhou';
    fimRodada();
  };
  A.chuteErr = () => {
    if (!jogando()) return;
    closeModal();
    G.cur.erradas++;
    SFX.no();
    toast(`Errou o tema! -${CUSTO_PADRAO.chute} ⚽`);
    checaFichas('no');
  };
  A.desistir = () => {
    if (!jogando()) return;
    if (!confirm(`Desistir desta rodada? O juiz ganha ${CUSTO_PADRAO.defesa} pontos.`)) return;
    G.cur.status = 'perdeu';
    fimRodada();
  };

  function fimRodada() {
    const c = G.cur;
    if (c.fim) return;
    c.fim = true;
    if (c.status === 'ganhou') { c.ganho = Math.max(1, fichas(c)); G.pts[c.guesser] += c.ganho; }
    else { c.ganho = CUSTO_PADRAO.defesa; G.pts[c.chooser] += c.ganho; }
    go('footRoundEnd', {}, true);
  }

  S.footRoundEnd = () => {
    const c = G.cur, t = c.tema, ganhou = c.status === 'ganhou';
    const ultimo = G.r + 1 >= G.total;
    const prox = (G.r + 1) % P().length;
    const heroi = ganhou ? c.guesser : c.chooser;
    const certos = new Set(c.palpites.filter(p => p.ok && p.match).map(p => p.match));
    const erros = c.palpites.filter(p => !p.ok);
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="winner" style="--pc:${cor(heroi)}">
        <div class="trophy">${ganhou ? '🎉' : '🧤'}</div>
        <div class="wav">${avt(heroi)}</div>
        <h2>${ganhou ? `${nome(c.guesser)} acertou!` : 'Defesa do juiz!'}</h2>
        <p class="sub-w">${ganhou ? `Sobraram ${c.ganho} ⚽ → <b>+${c.ganho} pontos</b>` : `${nome(c.chooser)} ganha <b>+${c.ganho} pontos</b>`}</p>
      </div>
      <div class="secret-box"><small style="opacity:.7">O tema era</small><div class="se">${esc(t.emoji || '⚽')}</div><h2>${esc(t.titulo)}</h2></div>
      ${t.jogadores.length ? `
      <div class="panel"><h3>📋 Todos que valiam</h3>
        <div class="gchips">${t.jogadores.map(j => {
          const m = mainName(j);
          const cls = certos.has(m) ? 'ok' : c.revelados.includes(m) ? 'rev' : 'neutral';
          const ic = certos.has(m) ? '✅ ' : c.revelados.includes(m) ? '👀 ' : '';
          return `<span class="gchip ${cls}">${ic}${esc(m)}</span>`;
        }).join('')}</div>
      </div>` : ''}
      ${erros.length ? `<div class="panel"><h3>❌ Não eram do tema</h3><div class="gchips">${erros.map(p => `<span class="gchip no" style="cursor:default">${esc(p.txt)}</span>`).join('')}</div></div>` : ''}
      <button class="btn btn-big btn-yellow" data-a="nextRound">${ultimo ? 'Ver o campeão 🏆' : `Próxima: ${who(prox)} escolhe ➡️`}</button>
    </div>`;
  };
  AF.footRoundEnd = () => {
    if (G.cur.status === 'ganhou') { SFX.fanfare(); Confetti.burst({ n: 120, emojis: ['⚽', '🎉'] }); }
    else SFX.sad();
  };
  A.nextRound = () => {
    G.r++;
    if (G.r >= G.total) go('footEnd', {}, true); else newRound();
  };

  S.footEnd = () => {
    G.ended = true;
    const rank = ranking();
    return `
    <div class="screen">
      ${topbar()}
      ${winnerBlock(rank)}
      <div class="panel"><h3>🏅 Placar final</h3>${rankRows(rank, ' pts')}</div>
      <div class="row">
        ${NET.isAdmin ? `<button class="btn btn-big btn-yellow" data-a="startFoot">🔁 Revanche</button>` : ''}
        <button class="btn btn-big btn-ghost" data-a="home">🏠 Hub</button>
      </div>
    </div>`;
  };
  AF.footEnd = () => {
    celebrate();
    recordMatchResult(G && G.mode ? G.mode : 'foot');
  };

  /* =========================================================
     JOGO 3 — 🕵️ QUEM SOU EU? (Craques & Lendas)
     ========================================================= */
  S.whoPlay = () => {
    const c = G.cur;
    const pName = mainName(c.card.nome);
    const souOponente = NET.active && NET.myIdx !== c.turn;
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="round-info">Carta ${G.r + 1}/${G.total} • Vez de ${who(c.turn)} descobrir quem é!</div>
      ${souOponente ? `
        <div class="secret-mini">
          <span class="se">${esc(c.card.emoji)}</span>
          <div><small>🤫 Craque na testa de ${who(c.turn)} (responda SIM/NÃO p/ ele):</small><b>${esc(pName)}</b></div>
        </div>` : ''}
      <div class="qa-card">
        <div class="qe">${c.revealed ? esc(c.card.emoji) : '🕵️'}</div>
        <h3>${c.revealed ? esc(pName) : 'Quem Sou Eu?'}</h3>
        <p class="muted">Vale <b>${Math.max(1, 4 - c.dicas)} pontos</b> se acertar agora!</p>
        ${c.card.dicas.slice(0, c.dicas).map((d, k) => `<div class="hint"><b>💡 Pista ${k + 1}:</b> ${esc(d)}</div>`).join('')}
      </div>
      ${c.revealed ? `
        <button class="btn btn-big btn-yellow" data-a="whoNext">Próximo Craque ➡️</button>
      ` : `
        <form class="guess-form" id="whoForm" autocomplete="off">
          <input id="whoIn" list="dlJogadores" placeholder="Chutar nome do craque...">
          <button class="btn btn-green" type="submit">Chutar 🎯</button>
        </form>
        <div class="row" style="margin-top:10px">
          <button class="btn btn-blue" data-a="whoDica" ${c.dicas >= 3 ? 'disabled' : ''}>💡 Abrir Pista (${c.dicas}/3)</button>
          <button class="btn btn-red" data-a="whoGiveUp">🏳️ Revelar</button>
        </div>
      `}
    </div>`;
  };

  A.goWho = () => {
    if (NET.active && !NET.isAdmin) { toast('Aguarde o Admin escolher o jogo!'); return; }
    const pool = shuffle(window.QUEM_SOU_EU).slice(0, 6);
    G = { mode: 'who', cards: pool, total: pool.length, r: 0, pts: [0, 0], cur: { turn: 0, card: pool[0], dicas: 1, revealed: false } };
    SFX.whistle();
    go('whoPlay', {}, true, 'whistle');
  };
  A.whoDica = () => {
    if (!G || G.cur.dicas >= 3) return;
    G.cur.dicas++; SFX.pop();
    go('whoPlay', {}, true, 'pop');
  };
  A.whoGiveUp = () => {
    if (!G) return;
    G.cur.revealed = true; SFX.no();
    go('whoPlay', {}, true, 'no');
  };
  A.whoNext = () => {
    G.r++;
    if (G.r >= G.total) { go('footEnd', {}, true); return; }
    G.cur = { turn: G.r % 2, card: G.cards[G.r], dicas: 1, revealed: false };
    go('whoPlay', {}, true, 'pop');
  };

  function checkWhoGuess(txt) {
    if (!G || G.mode !== 'who' || G.cur.revealed) return;
    const m = matchPlayer(txt, { jogadores: [G.cur.card.nome] });
    if (m) {
      const pts = Math.max(1, 4 - G.cur.dicas);
      G.pts[G.cur.turn] += pts;
      G.cur.revealed = true;
      SFX.fanfare();
      toast(`🎉 Acertou! +${pts} pontos!`);
      go('whoPlay', {}, true, 'yes');
    } else {
      SFX.no();
      toast('❌ Não é esse! Tente outra pista.');
    }
  }

  /* =========================================================
     JOGO 4 — 📈 MAIS OU MENOS? (Recordes do Futebol)
     ========================================================= */
  S.hlPlay = () => {
    const a = G.items[G.r];
    const b = G.items[G.r + 1];
    const turn = G.r % 2;
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="round-info">Rodada ${G.r + 1}/${G.total} • Vez de ${who(turn)}</div>
      <div class="qa-card">
        <div class="qe">${esc(a.e)}</div>
        <div class="q">${esc(a.t)}</div>
        <h3 style="font-size:38px;color:var(--blue)">${a.v.toLocaleString('pt-BR')} <small>${esc(a.u)}</small></h3>
      </div>
      <div class="center" style="font-family:'Lilita One';color:#fff;font-size:24px;margin:8px 0">🆚</div>
      <div class="qa-card">
        <div class="qe">${esc(b.e)}</div>
        <div class="q">${esc(b.t)}</div>
        ${G.revealed ? `
          <h3 style="font-size:38px;color:${G.lastOk ? 'var(--green)' : 'var(--red)'}">${b.v.toLocaleString('pt-BR')} <small>${esc(b.u)}</small></h3>
          <button class="btn btn-big btn-yellow" data-a="hlNext">Próximo ➡️</button>
        ` : `
          <p class="muted">Tem <b>MAIS</b> ou <b>MENOS</b> que ${a.v.toLocaleString('pt-BR')}?</p>
          <div class="row" style="margin-top:12px">
            <button class="btn btn-big btn-green" style="margin-top:0" data-a="hlAns" data-v="mais">⬆️ MAIS</button>
            <button class="btn btn-big btn-red" style="margin-top:0" data-a="hlAns" data-v="menos">⬇️ MENOS</button>
          </div>
        `}
      </div>
    </div>`;
  };

  A.goHL = () => {
    if (NET.active && !NET.isAdmin) { toast('Aguarde o Admin escolher o jogo!'); return; }
    const items = shuffle(window.MAIS_OU_MENOS).slice(0, 9);
    G = { mode: 'hl', items, total: items.length - 1, r: 0, pts: [0, 0], revealed: false, lastOk: false };
    SFX.coin();
    go('hlPlay', {}, true, 'coin');
  };
  A.hlAns = el => {
    if (!G || G.revealed) return;
    const a = G.items[G.r], b = G.items[G.r + 1];
    const choice = el.dataset.v;
    const ok = (choice === 'mais' && b.v >= a.v) || (choice === 'menos' && b.v <= a.v);
    G.revealed = true;
    G.lastOk = ok;
    if (ok) { G.pts[G.r % 2]++; SFX.yes(); } else SFX.no();
    go('hlPlay', {}, true, ok ? 'yes' : 'no');
  };
  A.hlNext = () => {
    G.r++;
    G.revealed = false;
    if (G.r >= G.total) go('footEnd', {}, true);
    else go('hlPlay', {}, true, 'pop');
  };

  /* =========================================================
     JOGO 5 — ⚡ DUELO RELÂMPAGO (Quiz 1v1)
     ========================================================= */
  S.quizPlay = () => {
    const q = G.qs[G.r];
    const turn = G.r % 2;
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="round-info">Pergunta ${G.r + 1}/${G.total} • Vez de ${who(turn)} responder!</div>
      <div class="qa-card">
        <h3>${esc(q.p)}</h3>
        <div>
          ${q.o.map((opt, idx) => {
            let cls = '';
            if (G.ans != null) {
              if (idx === q.c) cls = 'ok';
              else if (idx === G.ans) cls = 'no';
            }
            return `<button class="quiz-opt ${cls}" data-a="quizAns" data-i="${idx}" ${G.ans != null ? 'disabled' : ''}>${esc(opt)}</button>`;
          }).join('')}
        </div>
        ${G.ans != null ? `<button class="btn btn-big btn-yellow" data-a="quizNext">Próxima ➡️</button>` : ''}
      </div>
    </div>`;
  };

  A.goQuiz = () => {
    if (NET.active && !NET.isAdmin) { toast('Aguarde o Admin escolher o jogo!'); return; }
    const qs = shuffle(window.QUIZ_PERGUNTAS).slice(0, 8);
    G = { mode: 'quiz', qs, total: qs.length, r: 0, pts: [0, 0], ans: null };
    SFX.whistle();
    go('quizPlay', {}, true, 'whistle');
  };
  A.quizAns = el => {
    if (!G || G.ans != null) return;
    const idx = +el.dataset.i;
    const q = G.qs[G.r];
    G.ans = idx;
    const ok = idx === q.c;
    if (ok) { G.pts[G.r % 2]++; SFX.yes(); } else SFX.no();
    go('quizPlay', {}, true, ok ? 'yes' : 'no');
  };
  A.quizNext = () => {
    G.r++;
    G.ans = null;
    if (G.r >= G.total) go('footEnd', {}, true);
    else go('quizPlay', {}, true, 'pop');
  };

  /* =========================================================
     EDITOR — MEUS ITENS E TEMAS
     ========================================================= */
  S.editor = () => `
  <div class="screen">
    ${topbarSimple()}
    <h2 class="title-w">🛠️ Meus itens e temas</h2>
    <div class="panel"><h3>💰 Novo item (Acerte o Valor)</h3>
      <span class="label">Nome (com "um/uma/o/a")</span>
      <input class="inp" id="itNome" maxlength="60" placeholder="Ex: uma camisa do Flamengo">
      <div class="row" style="margin-top:4px">
        <div><span class="label">Emoji</span><input class="inp" id="itEmoji" maxlength="4" placeholder="🎁"></div>
        <div><span class="label">Preço médio (R$)</span><input class="inp" id="itPreco" inputmode="numeric" placeholder="350"></div>
      </div>
      <button class="btn btn-yellow" style="margin-top:14px;width:100%" data-a="addItem">➕ Adicionar item</button>
      <div style="margin-top:10px">
        ${store.itens.length
          ? store.itens.map((it, k) => `<div class="list-row"><span style="font-size:26px">${esc(it.e)}</span><span class="grow">${esc(it.n)}<br><small class="muted">${fmt(it.p)}</small></span><button class="icon-btn" data-a="delItem" data-i="${k}">🗑️</button></div>`).join('')
          : '<p class="muted"><small>Já existem ' + window.ITENS.length + ' itens prontos no jogo.</small></p>'}
      </div>
    </div>
    <div class="panel"><h3>⚽ Novo tema (Tema Secreto)</h3>
      ${temaFormHTML()}
      <button class="btn btn-yellow" style="margin-top:14px;width:100%" data-a="addTema">➕ Adicionar tema</button>
      <div style="margin-top:10px">
        ${store.temas.length
          ? store.temas.map((t, k) => `<div class="list-row"><span style="font-size:26px">${esc(t.emoji)}</span><span class="grow">${esc(t.titulo)}<br><small class="muted">${t.jogadores.length} jogadores • ${LVL[t.nivel] || ''}</small></span><button class="icon-btn" data-a="delTema" data-i="${k}">🗑️</button></div>`).join('')
          : '<p class="muted"><small>Já existem ' + window.TEMAS.length + ' temas prontos no jogo.</small></p>'}
      </div>
    </div>
  </div>`;

  A.addItem = () => {
    const v = id => (document.getElementById(id).value || '').trim();
    const n = v('itNome');
    const p = Number(v('itPreco').replace(/,\d{1,2}$/, '').replace(/\D/g, ''));
    if (!n) { toast('Escreva o nome do item ✍️'); return; }
    if (!p) { toast('Coloque o preço 💰'); return; }
    const cat = p <= 300 ? 'barato' : p <= 3000 ? 'lazer' : p <= 30000 ? 'tech' : p <= 500000 ? 'veiculos' : p <= 15000000 ? 'imoveis' : 'absurdo';
    const novoItem = { n, e: v('itEmoji') || '🎁', p, cat, custom: true };
    store.itens.push(novoItem);
    if (window.FB && window.FB.ready) window.FB.saveCustomItem(novoItem);
    save(); SFX.coin(); toast('Item salvo e enviado p/ Nuvem! ☁️🎉'); render();
  };
  A.delItem = el => { if (!confirm('Apagar este item?')) return; store.itens.splice(+el.dataset.i, 1); save(); render(); };
  A.addTema = () => {
    const t = readTemaForm();
    if (!t) return;
    store.temas.push(t);
    if (window.FB && window.FB.ready) window.FB.saveCustomTema(t);
    save(); fillDatalist(); SFX.coin(); toast('Tema salvo e enviado p/ Nuvem! ☁️⚽'); render();
  };
  A.delTema = el => { if (!confirm('Apagar este tema?')) return; store.temas.splice(+el.dataset.i, 1); save(); fillDatalist(); render(); };

  /* =========================================================
     AÇÕES GERAIS
     ========================================================= */
  A.som = el => { store.som = !store.som; SFX.on = store.som; save(); el.textContent = store.som ? '🔊' : '🔇'; if (store.som) SFX.coin(); };
  A.home = () => { G = null; go('home', {}, true); };
  A.sair = () => {
    if (G && !G.ended && !confirm('Voltar ao Hub? O placar desta partida será perdido.')) return;
    G = null; go('home', {}, true);
  };
  A.fechar = () => closeModal();
  A.goPlayers = () => { ui.avOpen = null; go('players'); };
  A.goMoney = () => {
    if (NET.active && !NET.isAdmin) { toast('👑 Aguarde o Admin escolher o jogo!'); return; }
    go('moneySetup', {}, true);
  };
  A.goFoot = () => {
    if (NET.active && !NET.isAdmin) { toast('👑 Aguarde o Admin escolher o jogo!'); return; }
    go('footSetup', {}, true);
  };
  A.goEditor = () => go('editor');
  A.cfg = el => {
    if (!NET.isAdmin) { toast('👑 Somente o Admin da sala altera as configurações!'); return; }
    const obj = store[el.dataset.m];
    const v = el.dataset.v;
    obj[el.dataset.k] = /^-?\d+$/.test(v) ? Number(v) : v;
    save(); render();
    if (NET.active) syncNet(screen, params);
  };

  /* ---------------- EVENTOS DOM ---------------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.a];
    if (!fn) return;
    e.preventDefault();
    if (!['kpDigit', 'kpAdd', 'som'].includes(el.dataset.a)) SFX.click();
    fn(el, e);
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'itemSearchIn') {
      ui.itemSearch = e.target.value;
      render();
    } else if (e.target.id === 'temaSearchIn') {
      ui.temaSearch = e.target.value;
      render();
    }
  });

  document.addEventListener('submit', e => {
    if (e.target.id === 'guessForm') {
      e.preventDefault();
      palpite(document.getElementById('guessIn').value);
    } else if (e.target.id === 'customAskForm') {
      e.preventDefault();
      const inp = document.getElementById('customAskIn');
      if (inp) sendQuestion(inp.value, null, '💬');
    } else if (e.target.id === 'whoForm') {
      e.preventDefault();
      const inp = document.getElementById('whoIn');
      if (inp) { checkWhoGuess(inp.value); inp.value = ''; }
    }
  });

  document.addEventListener('keydown', e => {
    if (screen !== 'moneyPick' || (document.activeElement && document.activeElement.tagName === 'INPUT')) return;
    if (/^\d$/.test(e.key)) kpDigit(e.key);
    else if (e.key === 'Backspace') A.kpBack();
    else if (e.key === 'Enter') A.kpOk();
  });

  function showPeek() {
    hidePeek();
    const t = G.cur.tema;
    const d = document.createElement('div');
    d.className = 'peek'; d.id = 'peek';
    d.innerHTML = `<div class="pe">${esc(t.emoji || '⚽')}</div><small style="opacity:.7">Tema secreto</small><h2>${esc(t.titulo)}</h2><p>Solte para esconder 🙈</p>`;
    document.body.appendChild(d);
  }
  function hidePeek() { const p = document.getElementById('peek'); if (p) p.remove(); }
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('[data-hold="peek"]') || !G || !G.cur || !G.cur.tema) return;
    e.preventDefault();
    showPeek();
  });
  document.addEventListener('pointerup', hidePeek);
  document.addEventListener('pointercancel', hidePeek);
  document.addEventListener('contextmenu', e => { if (e.target.closest('[data-hold]')) e.preventDefault(); });

  /* ---------------- START ---------------- */
  fillDatalist();
  if (window.FB) {
    window.FB.onAuthChange = () => {
      NET.initLobby(store.profile, getStatsExtra());
      if (screen === 'profile' || screen === 'ranking') render();
    };
    window.FB.onCustomContent = ({ itens, temas }) => {
      cloudItens = itens || [];
      cloudTemas = temas || [];
      fillDatalist();
      if (screen === 'footChoose' || screen === 'moneyAsk' || screen === 'editor') render();
    };
    window.FB.onLeaderboardChange = () => {
      if (screen === 'ranking') render();
    };
    window.FB.init();
  }
  NET.initLobby(store.profile, getStatsExtra());

  const urlSala = new URLSearchParams(location.search).get('sala');
  if (urlSala && /^\d{4}$/.test(urlSala)) {
    ui.joinCode = urlSala;
    screen = 'room';
  }
  render();
})();
