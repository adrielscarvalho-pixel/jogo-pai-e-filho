/* =========================================================
   PAI 🆚 FILHO — lógica do jogo (1 Aparelho ou 2 Aparelhos em Sala)
   Modo 1: Dá Pra Comprar?  (Valor Secreto / Chute o Preço)
   Modo 2: Tema Secreto ⚽   (fichas, dicas, juiz)
   ========================================================= */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const KEY = 'paiXfilho.v1';
  const AVATARES = ['👨', '🧒', '👦', '👧', '👩', '🧔', '👴', '👵', '👶', '🦁', '🐯', '🐵', '🦊', '🐶', '🐱', '🐼', '🤖', '👽', '🦸', '🥷', '🧙', '🐸', '🦖', '⚽'];
  const CORES = ['#4D96FF', '#FF5D73', '#2BD67B', '#FFB020'];
  const CUSTO = { nao: 1, dica: 2, revelar: 3, chute: 3, defesa: 5 };
  const LVL = { facil: '🟢 Fácil', medio: '🟡 Médio', dificil: '🔴 Difícil' };
  const FRASES = ['Campeão absoluto! 🥇', 'Craque demais! ⭐', 'Que show! 🔥', 'Ninguém segura! 🚀', 'Joga muito! 😎'];

  /* ---------------- armazenamento ---------------- */
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  if (!Array.isArray(store.players) || store.players.length < 2) {
    store.players = [{ nome: 'Papai', av: '👨' }, { nome: 'Filho', av: '🧒' }];
  }
  if (typeof store.som !== 'boolean') store.som = true;
  if (!Array.isArray(store.itens)) store.itens = [];
  if (!Array.isArray(store.temas)) store.temas = [];
  store.moneyCfg = Object.assign({ variante: 'secreto', qtd: 8, ordem: 'crescente' }, store.moneyCfg);
  store.footCfg = Object.assign({ nivel: 'todos', rodadas: 2, fichas: [12, 12, 12, 12] }, store.footCfg);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* ok */ } };
  SFX.on = store.som;

  let G = null;          // partida atual
  let screen = 'home';   // tela atual
  let params = {};       // parâmetros da tela
  const ui = {};         // estado visual temporário

  /* ---------------- utilidades ---------------- */
  const P = () => (NET.inRoom ? store.players.slice(0, 2) : store.players);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cor = i => CORES[i % CORES.length];
  const nome = i => esc((P()[i] || store.players[0]).nome);
  const avt = i => (P()[i] || store.players[0]).av;
  const who = i => `${avt(i)} ${nome(i)}`;
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const allItens = () => window.ITENS.concat(store.itens);
  const allTemas = () => window.TEMAS.concat(store.temas);
  const temaById = id => allTemas().find(t => t.id === id);

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
    setTimeout(() => t.classList.add('out'), 1900);
    setTimeout(() => t.remove(), 2400);
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
    document.getElementById('dlJogadores').innerHTML =
      [...set].sort((a, b) => a.localeCompare(b, 'pt')).map(n => `<option value="${esc(n)}">`).join('');
  }

  (function initBg() {
    const el = document.getElementById('bgFloat');
    const em = ['💰', '⚽', '🏆', '💸', '🎮', '⭐', '🚗', '👟', '💎', '🥅', '🍕', '🚀'];
    let h = '';
    for (let i = 0; i < 14; i++) {
      h += `<span style="left:${Math.random() * 92}%;animation-duration:${16 + Math.random() * 16}s;animation-delay:-${Math.random() * 30}s;font-size:${28 + Math.random() * 30}s">${em[i % em.length]}</span>`;
    }
    el.innerHTML = h;
  })();

  /* ---------------- navegação e sincronização 2 aparelhos ---------------- */
  const S = {};   // telas
  const AF = {};  // depois de renderizar
  const A = {};   // ações (data-a)

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

  function syncNet(targetScreen, targetParams, ev) {
    if (!NET.active) return;
    NET.send({
      type: 'state',
      players: store.players.slice(0, 2),
      moneyCfg: store.moneyCfg,
      footCfg: store.footCfg,
      temas: store.temas,
      itens: store.itens,
      G,
      screen: targetScreen || screen,
      params: targetParams || params,
      ev: ev || null
    });
  }

  NET.onStatusChange = (st) => {
    if (st === 'connected') {
      SFX.coin();
      if (NET.isGuest) {
        NET.send({ type: 'hello', p1: store.players[1] });
      } else if (NET.isHost) {
        syncNet(screen, params);
      }
    } else if (st === 'peer_left') {
      toast('⚠️ O outro aparelho desconectou.');
    }
    render();
  };

  NET.onMessage = msg => {
    if (!msg || !msg.type) return;

    if (msg.type === 'hello' && NET.isHost) {
      if (msg.p1 && msg.p1.nome) {
        store.players[1] = { nome: String(msg.p1.nome).slice(0, 14), av: msg.p1.av || '🧒' };
        save();
      }
      toast(`🎉 ${store.players[1].nome} conectou na sala!`);
      Confetti.burst({ n: 70, emojis: ['📲', '🎉', '⚽'] });
      syncNet(screen, params);
      render();
      return;
    }

    if (msg.type === 'state') {
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
      else if (msg.ev === 'toast' && msg.toastMsg) toast(msg.toastMsg);
      return;
    }

    if (msg.type === 'moneyVal' && G && G.mode === 'money') {
      const idx = msg.p;
      if (msg.ctx === 'pick') {
        G.valores[idx] = msg.val;
        if (G.valores[0] != null && G.valores[1] != null) {
          go('moneyValues');
        } else {
          render();
        }
      } else {
        if (!G.chutes[G.idx]) G.chutes[G.idx] = [null, null];
        G.chutes[G.idx][idx] = msg.val;
        if (G.chutes[G.idx][0] != null && G.chutes[G.idx][1] != null) {
          go('moneyRound');
        } else {
          render();
        }
      }
      return;
    }

    if (msg.type === 'revealAnim' && G && G.mode === 'money') {
      runRevealAnimation(msg.winners, msg.mosca);
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
            <button class="btn btn-red" data-a="chuteErr">❌ Errou (-${CUSTO.chute} ⚽)</button>
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
    if (screen.startsWith('foot')) return 'm-foot';
    if (screen === 'pass' && G) return G.mode === 'money' ? 'm-money' : 'm-foot';
    return '';
  }
  function render() {
    app.innerHTML = S[screen]();
    document.body.className = modeClass();
    if (AF[screen]) AF[screen]();
  }

  /* ---------------- componentes ---------------- */
  const somBtn = () => `<button class="icon-btn" data-a="som" title="Som">${store.som ? '🔊' : '🔇'}</button>`;
  const roomPill = () => NET.active
    ? `<button class="btn btn-sm" style="background:#c9ffdf;padding:4px 10px;font-size:13px" data-a="goRoom"><span class="live-dot"></span> Sala ${NET.code} (${ avt(NET.myIdx) })</button>`
    : '';
  const topbar = (center = '') => `<div class="topbar"><button class="icon-btn" data-a="sair" title="Menu">🏠</button><div class="grow" style="gap:6px;align-items:center;flex-wrap:wrap">${roomPill()}${center}</div>${somBtn()}</div>`;
  const topbarSimple = () => `<div class="topbar"><button class="icon-btn" data-a="home" title="Voltar">⬅️</button><div class="grow">${roomPill()}</div>${somBtn()}</div>`;
  const pchip = i => `<span class="pchip" style="--pc:${cor(i)}"><span class="av">${avt(i)}</span>${nome(i)}</span>`;
  const scorebar = () => !G ? '' : `<div class="scorebar">${P().map((p, i) => `<span class="sc" style="--pc:${cor(i)}"><span class="av">${p.av}</span>${G.pts[i]}</span>`).join('')}</div>`;

  function seg(cfgName, k, v, label) {
    const on = String(store[cfgName][k]) === String(v);
    return `<button class="${on ? 'on' : ''}" data-a="cfg" data-m="${cfgName}" data-k="${k}" data-v="${v}">${label}</button>`;
  }
  function segBig(cfgName, k, v, title, desc) {
    return seg(cfgName, k, v, `<b>${title}</b><span>${desc}</span>`);
  }

  function ranking() { return P().map((p, i) => ({ i, pts: G.pts[i] })).sort((a, b) => b.pts - a.pts); }
  function winnerBlock(rank) {
    const top = rank[0].pts;
    const ws = rank.filter(r => r.pts === top);
    if (ws.length > 1) {
      return `<div class="winner"><div class="trophy">🤝</div><h2>EMPATE!</h2><p class="sub-w">${ws.map(w => who(w.i)).join(' e ')} com ${top} pontos</p></div>`;
    }
    const i = ws[0].i;
    return `<div class="winner" style="--pc:${cor(i)}"><div class="trophy">🏆</div><div class="wav">${avt(i)}</div><h2>${nome(i)} venceu!</h2><p class="sub-w">${top} pontos • ${FRASES[Math.floor(Math.random() * FRASES.length)]}</p></div>`;
  }
  function rankRows(rank) {
    const med = ['🥇', '🥈', '🥉', '4º'];
    return rank.map((r, k) => `<div class="rank-row"><span class="pos">${med[k]}</span><span class="nm">${who(r.i)}</span><span class="pts">${r.pts}</span></div>`).join('');
  }

  /* =========================================================
     HOME
     ========================================================= */
  S.home = () => `
  <div class="screen">
    <div class="topbar"><span></span>${somBtn()}</div>
    <h1 class="logo">PAI <span class="vs">🆚</span><br>FILHO</h1>
    <p class="tagline">Quem vai ganhar hoje? 😎</p>
    <div class="players-bar">
      ${P().map((p, i) => pchip(i)).join('<span class="vs-mini">×</span>')}
      <button class="icon-btn" data-a="goPlayers" title="Editar jogadores">✏️</button>
    </div>
    <button class="room-banner ${NET.active ? 'on' : ''}" data-a="goRoom">
      ${NET.active
        ? `<span class="live-dot"></span> <span><b>2 Aparelhos Conectados!</b> (Sala #${NET.code} • Você é ${who(NET.myIdx)})</span>`
        : `<span>📲</span> <span><b>Jogar em 2 Aparelhos</b> (Criar ou Entrar numa Sala)</span>`}
    </button>
    <button class="mode-card money" data-a="goMoney">
      <span class="tag">VIRAL</span>
      <span class="mode-emoji">💰</span>
      <h2>Dá Pra Comprar?</h2>
      <p>Escolha um valor secreto e veja o que dá pra comprar. Quem chegar mais perto ganha!</p>
    </button>
    <button class="mode-card foot" data-a="goFoot">
      <span class="mode-emoji">⚽</span>
      <h2>Tema Secreto</h2>
      <p>Um pensa num tema de futebol, o outro chuta jogadores até descobrir!</p>
    </button>
    <div class="foot-links">
      <button class="btn btn-ghost btn-sm" data-a="goEditor">🛠️ Meus itens e temas</button>
    </div>
    <p class="footer-note">Preços aproximados • feito pra jogar em família ❤️</p>
  </div>`;

  /* =========================================================
     SALA 2 APARELHOS (CRIAR / ENTRAR)
     ========================================================= */
  S.room = () => {
    const shareUrl = `${location.origin}${location.pathname}?sala=${NET.code || ''}`;
    if (!NET.inRoom) {
      return `
      <div class="screen">
        ${topbarSimple()}
        <h2 class="title-w">📲 Jogar em 2 Aparelhos</h2>
        <p class="sub-w">Cada um joga na sua própria tela, sem ninguém ver o segredo do outro!</p>

        <div class="panel">
          <h3>📡 Opção 1: Criar uma Sala (Aparelho 1)</h3>
          <div class="pedit" style="--pc:${cor(0)}">
            <button class="avbtn" data-a="roomAv" data-i="0">${store.players[0].av}</button>
            <input class="inp" id="roomN0" maxlength="14" value="${esc(store.players[0].nome)}" placeholder="Seu nome (ex: Papai)">
          </div>
          ${ui.avOpen === 0 ? `<div class="av-grid">${AVATARES.map(a => `<button class="${a === store.players[0].av ? 'on' : ''}" data-a="roomAvPick" data-i="0" data-v="${a}">${a}</button>`).join('')}</div>` : ''}
          <button class="btn btn-big btn-yellow" data-a="criarSala">Criar Sala e Gerar Código 📲</button>
        </div>

        <div class="panel">
          <h3>🔑 Opção 2: Entrar numa Sala (Aparelho 2)</h3>
          <div class="pedit" style="--pc:${cor(1)}">
            <button class="avbtn" data-a="roomAv" data-i="1">${store.players[1].av}</button>
            <input class="inp" id="roomN1" maxlength="14" value="${esc(store.players[1].nome)}" placeholder="Seu nome (ex: Filho)">
          </div>
          ${ui.avOpen === 1 ? `<div class="av-grid">${AVATARES.map(a => `<button class="${a === store.players[1].av ? 'on' : ''}" data-a="roomAvPick" data-i="1" data-v="${a}">${a}</button>`).join('')}</div>` : ''}
          <span class="label">Código de 4 dígitos da sala</span>
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
        <span class="muted">Código para o outro aparelho entrar:</span>
        <div class="room-code-box"><div class="code">${NET.code}</div></div>
        <div class="row">
          <button class="btn btn-sm btn-ghost" data-a="copyLink">📋 Copiar Link da Sala</button>
        </div>
      </div>

      <div class="panel center">
        <h3>${NET.connected ? '🟢 Dois aparelhos conectados!' : '⏳ Aguardando conexão...'}</h3>
        <div class="players-bar" style="margin:14px 0">
          ${pchip(0)} <span class="vs-mini">🆚</span> ${NET.connected ? pchip(1) : '<span class="pchip" style="opacity:.5">⏳ Aguardando...</span>'}
        </div>
        <p class="muted">Você está jogando neste aparelho como <b>${who(NET.myIdx)}</b></p>
        ${NET.connected ? `
          <div class="row" style="margin-top:14px">
            <button class="btn btn-yellow" data-a="goMoney">💰 Dá Pra Comprar?</button>
            <button class="btn btn-green" data-a="goFoot">⚽ Tema Secreto</button>
          </div>
        ` : `<p class="muted"><small>Abra <b>${esc(shareUrl)}</b> no outro celular/PC ou digite o código <b>${NET.code}</b> em "Entrar numa Sala".</small></p>`}
      </div>

      <button class="btn btn-big btn-red" data-a="sairSala">🔌 Desconectar Sala (jogar em 1 aparelho)</button>
    </div>`;
  };

  function syncRoomInputs() {
    const n0 = document.getElementById('roomN0');
    const n1 = document.getElementById('roomN1');
    const jc = document.getElementById('joinCodeIn');
    if (n0 && n0.value.trim()) store.players[0].nome = n0.value.trim();
    if (n1 && n1.value.trim()) store.players[1].nome = n1.value.trim();
    if (jc) ui.joinCode = jc.value.replace(/\D/g, '').slice(0, 4);
    save();
  }
  A.goRoom = () => { ui.avOpen = null; go('room'); };
  A.roomAv = el => { syncRoomInputs(); const i = +el.dataset.i; ui.avOpen = ui.avOpen === i ? null : i; render(); };
  A.roomAvPick = el => { syncRoomInputs(); store.players[+el.dataset.i].av = el.dataset.v; ui.avOpen = null; save(); SFX.pop(); render(); };
  A.criarSala = () => {
    syncRoomInputs();
    NET.createRoom();
    SFX.coin();
    render();
  };
  A.entrarSala = () => {
    syncRoomInputs();
    const code = (ui.joinCode || '').replace(/\D/g, '');
    if (code.length !== 4) { toast('Digite os 4 números do código da sala! 🔢'); return; }
    NET.joinRoom(code);
    SFX.pop();
    render();
  };
  A.copyLink = () => {
    const url = `${location.origin}${location.pathname}?sala=${NET.code}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => toast('Link copiado! Mande no WhatsApp 📲'));
    } else {
      prompt('Copie o link da sala:', url);
    }
  };
  A.sairSala = () => {
    NET.stop();
    G = null;
    toast('Sala desconectada. Modo 1 aparelho ativo.');
    go('home');
  };

  /* =========================================================
     JOGADORES
     ========================================================= */
  S.players = () => `
  <div class="screen">
    ${topbarSimple()}
    <h2 class="title-w">Quem vai jogar? 🎮</h2>
    <div class="panel">
      ${store.players.map((p, i) => `
        <div class="pedit" style="--pc:${cor(i)}">
          <button class="avbtn" data-a="avOpen" data-i="${i}" title="Trocar avatar">${p.av}</button>
          <input class="inp" id="pn${i}" maxlength="14" value="${esc(p.nome)}" placeholder="Nome">
          ${!NET.inRoom && store.players.length > 2 ? `<button class="icon-btn" data-a="delPlayer" data-i="${i}" title="Remover">🗑️</button>` : ''}
        </div>
        ${ui.avOpen === i ? `<div class="av-grid">${AVATARES.map(a => `<button class="${a === p.av ? 'on' : ''}" data-a="avPick" data-i="${i}" data-v="${a}">${a}</button>`).join('')}</div>` : ''}
      `).join('')}
      ${!NET.inRoom && store.players.length < 4 ? `<button class="btn btn-sm btn-ghost" style="margin-top:16px" data-a="addPlayer">➕ Adicionar jogador</button>` : ''}
      <p class="muted"><small>Toque no avatar para trocar. ${NET.inRoom ? 'Em sala de 2 aparelhos jogam 2 pessoas.' : 'Dá pra jogar de 2 a 4 pessoas.'}</small></p>
    </div>
    <button class="btn btn-big btn-yellow" data-a="savePlayers">Salvar ✅</button>
  </div>`;

  function syncNames() {
    store.players.forEach((p, i) => { const el = document.getElementById('pn' + i); if (el) p.nome = el.value; });
  }
  A.avOpen = el => { syncNames(); const i = +el.dataset.i; ui.avOpen = ui.avOpen === i ? null : i; render(); };
  A.avPick = el => { syncNames(); store.players[+el.dataset.i].av = el.dataset.v; ui.avOpen = null; SFX.pop(); render(); };
  A.addPlayer = () => { syncNames(); const n = store.players.length; store.players.push({ nome: `Jogador ${n + 1}`, av: AVATARES[(n * 5) % AVATARES.length] }); render(); };
  A.delPlayer = el => { syncNames(); store.players.splice(+el.dataset.i, 1); ui.avOpen = null; render(); };
  A.savePlayers = () => {
    syncNames();
    store.players.forEach((p, i) => { p.nome = p.nome.trim() || `Jogador ${i + 1}`; });
    save(); SFX.coin();
    go('home', {}, true);
  };

  /* =========================================================
     MODO 1 — DÁ PRA COMPRAR?
     ========================================================= */
  const regrasSecreto = `
  <ul class="rules">
    <li><span class="ic">🤫</span><span>Cada um escolhe em segredo <b>quanto dinheiro tem</b> (pode ser R$ 10 ou R$ 1 bilhão!).</span></li>
    <li><span class="ic">🃏</span><span>Depois aparecem os itens: <i>"Dá pra comprar um PS5?"</i></span></li>
    <li><span class="ic">👑</span><span>Em cada item, quem escolheu o valor <b>mais perto do preço</b> ganha 1 ponto.</span></li>
    <li><span class="ic">🎯</span><span>Ficou a menos de 10% do preço? <b>NA MOSCA!</b> +1 ponto extra.</span></li>
    <li><span class="ic">🏆</span><span>No fim, quem tiver mais pontos vence!</span></li>
  </ul>`;
  const regrasChute = `
  <ul class="rules">
    <li><span class="ic">🃏</span><span>Aparece um item. Todo mundo vê.</span></li>
    <li><span class="ic">🤫</span><span>Cada um <b>chuta o preço em segredo</b>.</span></li>
    <li><span class="ic">👑</span><span>Quem chegar <b>mais perto</b> ganha 1 ponto.</span></li>
    <li><span class="ic">🎯</span><span>Menos de 10% de diferença: <b>NA MOSCA!</b> +1 extra.</span></li>
    <li><span class="ic">🏆</span><span>Mais pontos no final vence. (E todo mundo aprende quanto as coisas custam! 😉)</span></li>
  </ul>`;

  S.moneySetup = () => {
    const c = store.moneyCfg;
    return `
    <div class="screen">
      ${topbarSimple()}
      <h2 class="title-w">💰 Dá Pra Comprar?</h2>
      <div class="panel">
        <span class="label">Como vamos jogar?</span>
        <div class="seg big">
          ${segBig('moneyCfg', 'variante', 'secreto', '🤫 Valor Secreto', 'O viral! Cada um escolhe um valor antes de ver os itens.')}
          ${segBig('moneyCfg', 'variante', 'chute', '🎯 Chute o Preço', 'Aparece o item e cada um chuta quanto custa.')}
        </div>
        <span class="label">Quantas perguntas?</span>
        <div class="seg">${[5, 8, 10, 12].map(n => seg('moneyCfg', 'qtd', n, n)).join('')}</div>
        <span class="label">Ordem dos itens</span>
        <div class="seg">${seg('moneyCfg', 'ordem', 'crescente', '📈 Do barato ao caro')}${seg('moneyCfg', 'ordem', 'aleatoria', '🎲 Surpresa')}</div>
      </div>
      <div class="panel"><h3>📜 Regras</h3>${c.variante === 'secreto' ? regrasSecreto : regrasChute}</div>
      <button class="btn btn-big btn-yellow" data-a="startMoney">Bora jogar! 🚀</button>
    </div>`;
  };

  function pickItems(qtd, ordem) {
    const all = allItens().slice().sort((a, b) => a.p - b.p);
    qtd = Math.min(qtd, all.length);
    const out = [];
    for (let i = 0; i < qtd; i++) {
      const a = Math.floor(i * all.length / qtd);
      const b = Math.max(Math.floor((i + 1) * all.length / qtd), a + 1);
      const chunk = all.slice(a, b);
      out.push(chunk[Math.floor(Math.random() * chunk.length)]);
    }
    return ordem === 'crescente' ? out : shuffle(out);
  }

  A.startMoney = () => {
    const c = store.moneyCfg, n = P().length;
    G = {
      mode: 'money', var: c.variante, itens: pickItems(c.qtd, c.ordem), idx: 0,
      pts: Array(n).fill(0), valores: Array(n).fill(null), chutes: [], res: [],
      kp: '', kpHide: false, ended: false, anim: false
    };
    SFX.coin();
    if (NET.active) {
      if (G.var === 'secreto') {
        go('moneyPick', { p: NET.myIdx, ctx: 'pick' }, true, 'coin');
      } else {
        G.chutes[0] = Array(n).fill(null);
        go('moneyPick', { p: NET.myIdx, ctx: 'chute' }, true, 'coin');
      }
    } else {
      if (G.var === 'secreto') goPick(0); else go('moneyShow');
    }
  };
  function goPick(i) {
    G.kp = ''; G.kpHide = false;
    go('pass', { p: i, msg: 'Escolha seu <b>valor secreto</b>.<br>Os outros não podem ver! 🤫', next: 'moneyPick', np: { p: i, ctx: 'pick' } });
  }
  function goChute(i) {
    G.kp = ''; G.kpHide = false;
    go('pass', { p: i, msg: 'Hora de <b>chutar o preço</b> em segredo! 🤫', next: 'moneyPick', np: { p: i, ctx: 'chute' } });
  }

  /* ---- tela "passe o aparelho" (somente modo 1 aparelho) ---- */
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

  /* ---- teclado de valores ---- */
  const kpVal = () => Number(G.kp || '0');
  function kpDispInner() {
    const v = kpVal();
    if (G.kpHide) return `<div class="kp-main">R$ ••••••</div><div class="kp-sub">valor escondido 🙈</div>`;
    return `<div class="kp-main">${fmt(v)}</div><div class="kp-sub">${v ? curto(v) + ' de reais' : 'digite ou use os botões'}</div>`;
  }
  function kpHTML() {
    const quick = [[10, '+10'], [100, '+100'], [1000, '+1 mil'], [10000, '+10 mil'], [100000, '+100 mil'], [1e6, '+1 milhão'], [1e9, '+1 bilhão']];
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
    if (n > 9999999999999) { n = 9999999999999; kpShake(); }
    G.kp = n > 0 ? String(n) : '';
    updKp();
  }
  function kpDigit(k) {
    const s = ((G.kp || '') + k).replace(/^0+/, '');
    if (s.length > 13) { kpShake(); return; }
    G.kp = s; SFX.tick(); updKp();
  }
  A.kpDigit = el => kpDigit(el.dataset.k);
  A.kpBack = () => { G.kp = (G.kp || '').slice(0, -1); updKp(); };
  A.kpAdd = el => { SFX.coin(); kpSet(kpVal() + Number(el.dataset.v)); };
  A.kpX10 = () => { SFX.pop(); kpSet(kpVal() * 10); };
  A.kpClear = () => kpSet(0);
  A.kpHide = el => { G.kpHide = !G.kpHide; el.textContent = G.kpHide ? '👁️ Mostrar' : '🙈 Esconder'; updKp(); };

  S.moneyPick = () => {
    const i = NET.active ? NET.myIdx : params.p;
    const ctx = params.ctx;
    const it = ctx === 'chute' ? G.itens[G.idx] : null;
    const myCurrentVal = ctx === 'pick' ? G.valores[i] : (G.chutes[G.idx] && G.chutes[G.idx][i]);
    const otherIdx = i === 0 ? 1 : 0;

    if (NET.active && myCurrentVal != null) {
      return `
      <div class="screen">
        ${topbar(pchip(i))}
        <div class="wait-card">
          <div class="we">🤫</div>
          <h3>Valor guardado!</h3>
          <p>Você escolheu <b>${fmt(myCurrentVal)}</b> (${curto(myCurrentVal)}).</p>
          <p class="muted" style="margin-top:12px">⏳ Aguardando <b>${who(otherIdx)}</b> confirmar no outro aparelho...</p>
        </div>
      </div>`;
    }

    const head = ctx === 'pick'
      ? `<h2 class="title-w">Quanto dinheiro<br>você tem? 💸</h2><p class="sub-w">Escolha qualquer valor. Ninguém sabe que itens vão aparecer!</p>`
      : `<div class="item-card" style="margin-top:24px"><span class="counter">Item ${G.idx + 1}/${G.itens.length}</span>
           <div class="item-emoji" style="font-size:64px">${esc(it.e)}</div>
           <div class="q">Quanto custa</div><div class="item-name">${esc(it.n)}?</div></div>`;
    return `
    <div class="screen">
      ${topbar(pchip(i))}
      ${head}
      <div class="panel">
        ${kpHTML()}
        <div class="row" style="margin-top:12px">
          <button class="btn btn-sm btn-ghost" data-a="kpHide">${G.kpHide ? '👁️ Mostrar' : '🙈 Esconder'}</button>
          <button class="btn btn-sm btn-ghost" data-a="kpClear">🧹 Limpar</button>
        </div>
      </div>
      <button class="btn btn-big btn-green" id="kpOk" data-a="kpOk" ${kpVal() > 0 ? '' : 'disabled'}>Confirmar ✅</button>
    </div>`;
  };

  A.kpOk = () => {
    const v = kpVal();
    if (v <= 0 || screen !== 'moneyPick') return;
    const i = NET.active ? NET.myIdx : params.p;
    SFX.coin();
    G.kp = '';

    if (NET.active) {
      if (params.ctx === 'pick') {
        G.valores[i] = v;
        NET.send({ type: 'moneyVal', p: i, ctx: 'pick', val: v });
        if (G.valores[0] != null && G.valores[1] != null) go('moneyValues');
        else render();
      } else {
        if (!G.chutes[G.idx]) G.chutes[G.idx] = [null, null];
        G.chutes[G.idx][i] = v;
        NET.send({ type: 'moneyVal', p: i, ctx: 'chute', val: v });
        if (G.chutes[G.idx][0] != null && G.chutes[G.idx][1] != null) go('moneyRound');
        else render();
      }
      return;
    }

    if (params.ctx === 'pick') {
      G.valores[i] = v;
      if (i + 1 < P().length) goPick(i + 1); else go('moneyValues');
    } else {
      G.chutes[G.idx][i] = v;
      if (i + 1 < P().length) goChute(i + 1); else go('moneyRound');
    }
  };

  S.moneyValues = () => `
  <div class="screen">
    ${topbar()}
    <h2 class="title-w">Valores escolhidos! 🤑</h2>
    <p class="sub-w">Agora vamos ver o que dá pra comprar...</p>
    ${P().map((p, i) => `
      <div class="val-row" style="--pc:${cor(i)};animation-delay:${i * 0.25}s">
        <span class="av">${p.av}</span>
        <div class="who"><b>${esc(p.nome)}</b><div class="v">${fmt(G.valores[i])}</div></div>
        <span class="badge">${curto(G.valores[i])}</span>
      </div>`).join('')}
    <button class="btn btn-big btn-yellow" data-a="moneyGo">Bora pras perguntas! 🚀</button>
  </div>`;
  AF.moneyValues = () => { SFX.fanfare(); Confetti.burst({ rain: true, n: 60, emojis: ['💸', '💰', '🤑'] }); };
  A.moneyGo = () => go('moneyRound', {}, true);

  S.moneyShow = () => {
    const it = G.itens[G.idx];
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="item-card" style="margin-top:26px">
        <span class="counter">Item ${G.idx + 1}/${G.itens.length}</span>
        <div class="item-emoji">${esc(it.e)}</div>
        <div class="q">Quanto custa</div>
        <div class="item-name">${esc(it.n)}?</div>
        <div class="price hidden">💸 ???</div>
      </div>
      <p class="sub-w" style="margin-top:18px">Pensem bem... cada um vai chutar em segredo! 🤔</p>
      <button class="btn btn-big btn-yellow" data-a="chuteGo">Começar os chutes ➡️</button>
    </div>`;
  };
  A.chuteGo = () => {
    G.chutes[G.idx] = Array(P().length).fill(null);
    if (NET.active) go('moneyPick', { p: NET.myIdx, ctx: 'chute' }, true);
    else goChute(0);
  };

  const curVals = () => (G.var === 'secreto' ? G.valores : G.chutes[G.idx]);

  function rowVal(i, v, it, r) {
    let res = '', win = false;
    if (r) {
      win = r.winners.includes(i);
      const d = v - it.p;
      const delay = `style="animation-delay:${i * 0.2}s"`;
      if (G.var === 'secreto') {
        res = v >= it.p
          ? `<span class="stamp ok" ${delay}>DÁ! ✅</span><small>sobra ${fmt(d)}</small>`
          : `<span class="stamp no" ${delay}>NÃO DÁ ❌</span><small>falta ${fmt(-d)}</small>`;
      } else {
        res = d === 0
          ? `<span class="stamp ok" ${delay}>EXATO! 🤯</span>`
          : `<small>errou por</small><b>${fmt(Math.abs(d))}</b><small>${d > 0 ? 'chutou alto ⬆️' : 'chutou baixo ⬇️'}</small>`;
      }
      const bonus = [];
      if (win) bonus.push('<span class="badge">👑 +1</span>');
      if (r.mosca[i]) bonus.push('<span class="badge pink">🎯 NA MOSCA +1</span>');
      if (bonus.length) res += `<div>${bonus.join(' ')}</div>`;
    }
    return `
    <div class="val-row ${win ? 'win' : ''}" style="--pc:${cor(i)};animation-delay:${i * 0.1}s">
      ${win ? '<span class="crown">👑</span>' : ''}
      <span class="av">${avt(i)}</span>
      <div class="who"><b>${nome(i)}${G.var === 'chute' ? ' chutou' : ''}</b><div class="v">${fmt(v)}</div></div>
      <div class="res">${res}</div>
    </div>`;
  }

  S.moneyRound = () => {
    const it = G.itens[G.idx], vals = curVals(), r = G.res[G.idx];
    const sec = G.var === 'secreto';
    const last = G.idx === G.itens.length - 1;
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <div class="item-card" style="margin-top:26px">
        <span class="counter">${sec ? 'Pergunta' : 'Item'} ${G.idx + 1}/${G.itens.length}</span>
        <div class="item-emoji">${esc(it.e)}</div>
        <div class="q">${sec ? 'Dá pra comprar' : 'Quanto custa'}</div>
        <div class="item-name">${esc(it.n)}?</div>
        <div class="price ${r ? 'done' : 'hidden'}" id="price">${r ? fmt(it.p) : '💸 ???'}</div>
      </div>
      ${P().map((p, i) => rowVal(i, vals[i], it, r)).join('')}
      ${r
        ? `<button class="btn btn-big btn-yellow" data-a="moneyNext">${last ? 'Ver o resultado 🏆' : 'Próxima ➡️'}</button>`
        : `<button class="btn btn-big btn-green" id="revBtn" data-a="reveal">${sec ? 'Dá ou não dá? Revelar 💸' : 'Revelar o preço 💸'}</button>`}
    </div>`;
  };

  function rollNumber(el, target, dur, done) {
    const t0 = performance.now();
    const L = Math.log10(Math.max(target, 1));
    let lastTick = 0;
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(k >= 1 ? target : Math.pow(10, L * e));
      if (t - lastTick > 75) { SFX.tick(); lastTick = t; }
      if (k < 1) requestAnimationFrame(step); else done();
    }
    requestAnimationFrame(step);
  }

  function runRevealAnimation(winners, mosca) {
    if (!G || G.res[G.idx] || G.anim) return;
    G.anim = true;
    const revBtn = document.getElementById('revBtn');
    if (revBtn) { revBtn.disabled = true; revBtn.textContent = '🥁 Rufem os tambores...'; }
    const it = G.itens[G.idx];
    const priceEl = document.getElementById('price');
    if (!priceEl) { G.anim = false; return; }
    priceEl.classList.remove('hidden');
    const game = G;
    rollNumber(priceEl, it.p, 1700, () => {
      if (G !== game || screen !== 'moneyRound') return;
      G.res[G.idx] = { winners, mosca };
      winners.forEach(i => G.pts[i]++);
      mosca.forEach((m, i) => { if (m) G.pts[i]++; });
      G.anim = false;
      render();
      SFX.stamp();
      setTimeout(() => {
        if (mosca.some(Boolean)) { SFX.fanfare(); Confetti.burst({ n: 90, emojis: ['🎯', '💰', '⭐'] }); }
        else SFX.coin();
      }, 350);
    });
  }

  A.reveal = () => {
    if (!G || G.res[G.idx] || G.anim) return;
    const it = G.itens[G.idx], vals = curVals();
    const diffs = vals.map(v => Math.abs(v - it.p));
    const min = Math.min(...diffs);
    const winners = [];
    diffs.forEach((d, i) => { if (d === min) winners.push(i); });
    const mosca = diffs.map(d => d <= it.p * 0.1);
    if (NET.active) NET.send({ type: 'revealAnim', winners, mosca });
    runRevealAnimation(winners, mosca);
  };

  A.moneyNext = () => {
    G.idx++;
    if (G.idx >= G.itens.length) {
      go('moneyEnd', {}, true);
    } else if (G.var === 'secreto') {
      go('moneyRound', {}, true);
    } else if (NET.active) {
      G.chutes[G.idx] = Array(P().length).fill(null);
      go('moneyPick', { p: NET.myIdx, ctx: 'chute' }, true);
    } else {
      go('moneyShow');
    }
  };

  S.moneyEnd = () => {
    G.ended = true;
    const rank = ranking();
    const compras = G.var === 'secreto' ? `
      <div class="panel"><h3>🛒 Quanto cada um conseguiria comprar</h3>
        ${P().map((p, i) => {
          const ok = G.itens.filter(it => it.p <= G.valores[i]).length;
          return `<div class="rank-row"><span class="pos">${p.av}</span><span class="nm">${esc(p.nome)} <small class="muted">(${fmt(G.valores[i])})</small></span><span class="badge green">${ok}/${G.itens.length} itens</span></div>`;
        }).join('')}
      </div>` : '';
    return `
    <div class="screen">
      ${topbar()}
      ${winnerBlock(rank)}
      <div class="panel"><h3>🏅 Placar final</h3>${rankRows(rank)}</div>
      ${compras}
      <div class="panel"><h3>🧾 Os preços de verdade</h3>
        ${G.itens.map(it => `<div class="recap"><span class="e">${esc(it.e)}</span><span class="n">${esc(it.n)}</span><span class="p">${fmt(it.p)}</span></div>`).join('')}
        <p class="muted"><small>* valores aproximados</small></p>
      </div>
      <div class="row">
        <button class="btn btn-big btn-yellow" data-a="startMoney">🔁 De novo</button>
        <button class="btn btn-big btn-ghost" data-a="home">🏠 Menu</button>
      </div>
    </div>`;
  };
  AF.moneyEnd = celebrate;

  /* =========================================================
     MODO 2 — TEMA SECRETO ⚽
     ========================================================= */
  const regrasFoot = () => `
  <ul class="rules">
    <li><span class="ic">🤫</span><span>Um jogador é o <b>juiz</b>: escolhe um tema secreto (ex: <i>"Jogaram no Real E no Barça"</i>).</span></li>
    <li><span class="ic">🗣️</span><span>O outro fala nomes de jogadores e o jogo responde <b>SIM</b> ou <b>NÃO</b>.</span></li>
    <li><span class="ic">✅</span><span>Jogador que É do tema: <b>grátis</b>.</span></li>
    <li><span class="ic">❌</span><span>Jogador que NÃO é: <b>-${CUSTO.nao} ⚽</b></span></li>
    <li><span class="ic">💡</span><span>Comprar uma dica: <b>-${CUSTO.dica} ⚽</b> &nbsp;•&nbsp; 👀 Revelar um jogador do tema: <b>-${CUSTO.revelar} ⚽</b></span></li>
    <li><span class="ic">🎯</span><span>Chutar o tema: se errar, <b>-${CUSTO.chute} ⚽</b></span></li>
    <li><span class="ic">🏆</span><span>Acertou o tema? <b>As fichas que sobraram viram pontos!</b></span></li>
    <li><span class="ic">💀</span><span>Acabaram as fichas? O juiz ganha <b>${CUSTO.defesa} pontos</b>.</span></li>
    <li><span class="ic">⚖️</span><span>Se faltar algum jogador na lista, o juiz toca no palpite para corrigir.</span></li>
  </ul>`;

  S.footSetup = () => {
    const c = store.footCfg;
    return `
    <div class="screen">
      ${topbarSimple()}
      <h2 class="title-w">⚽ Tema Secreto</h2>
      <div class="panel">
        <span class="label">Nível dos temas</span>
        <div class="seg">
          ${seg('footCfg', 'nivel', 'facil', '🟢 Fácil')}${seg('footCfg', 'nivel', 'medio', '🟡 Médio')}
          ${seg('footCfg', 'nivel', 'dificil', '🔴 Difícil')}${seg('footCfg', 'nivel', 'todos', '🎲 Todos')}
        </div>
        <span class="label">Rodadas (quantas vezes cada um escolhe o tema)</span>
        <div class="seg">${[1, 2, 3].map(n => seg('footCfg', 'rodadas', n, n + 'x')).join('')}</div>
        <span class="label">Fichas ⚽ de cada um</span>
        ${P().map((p, i) => `
          <div class="stepper">
            ${pchip(i)}<span class="nm"></span>
            <button class="icon-btn" data-a="ficha" data-i="${i}" data-d="-1">➖</button>
            <span class="val">${c.fichas[i] || 12}</span>
            <button class="icon-btn" data-a="ficha" data-i="${i}" data-d="1">➕</button>
          </div>`).join('')}
        <p class="muted"><small>💡 Dica: dê mais fichas pro mais novo, pra ficar justo 😉</small></p>
      </div>
      <div class="panel"><h3>📜 Regras</h3>${regrasFoot()}</div>
      <button class="btn btn-big btn-yellow" data-a="startFoot">Apita o juiz! 🏁</button>
    </div>`;
  };
  A.ficha = el => {
    const i = +el.dataset.i, f = store.footCfg.fichas;
    f[i] = Math.max(3, Math.min(30, (f[i] || 12) + Number(el.dataset.d)));
    save(); render();
    if (NET.active) syncNet(screen, params);
  };

  const fichas = c => c.ini
    - c.palpites.filter(p => !p.ok).length * CUSTO.nao
    - c.dicas * CUSTO.dica
    - c.revelados.length * CUSTO.revelar
    - c.erradas * CUSTO.chute;
  const restantes = c => c.tema.jogadores.map(mainName)
    .filter(n => !c.revelados.includes(n) && !c.palpites.some(p => p.ok && p.match === n));
  const podeDica = c => c.dicas < c.tema.dicas.length && fichas(c) > CUSTO.dica;
  const podeRevelar = c => restantes(c).length > 0 && fichas(c) > CUSTO.revelar;

  A.startFoot = () => {
    const c = store.footCfg, n = P().length;
    G = { mode: 'foot', total: n * c.rodadas, r: 0, pts: Array(n).fill(0), usados: [], cur: null, ended: false };
    SFX.whistle();
    newRound();
  };

  function sortearTemas(excl = []) {
    const nv = store.footCfg.nivel;
    const pool = allTemas().filter(t => nv === 'todos' || t.nivel === nv);
    let livres = pool.filter(t => !G.usados.includes(t.id) && !excl.includes(t.id));
    if (livres.length < 3) livres = pool.filter(t => !excl.includes(t.id));
    if (livres.length < 3) livres = pool;
    return shuffle(livres).slice(0, 3).map(t => t.id);
  }

  function newRound() {
    const n = P().length;
    const chooser = G.r % n, guesser = (G.r + 1) % n;
    G.cur = {
      chooser, guesser, tema: null, palpites: [], dicas: 0, revelados: [], erradas: 0,
      ini: store.footCfg.fichas[guesser] || 12, status: 'jogando', cands: [], last: null, fim: false
    };
    G.cur.cands = sortearTemas();
    if (NET.active) {
      go('footChoose', {}, true, 'whistle');
    } else {
      go('pass', { p: chooser, msg: `Você é o <b>juiz</b>: escolha o TEMA SECRETO!<br>${who(guesser)}, não olhe! 🙈`, next: 'footChoose' });
    }
  }

  /* Tela de espera do Adivinhador enquanto o Juiz escolhe o tema no outro aparelho */
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
    return `
    <div class="screen">
      ${topbar(scorebar())}
      <h2 class="title-w">Escolha o tema<br>secreto 🤫</h2>
      <p class="sub-w">${who(c.guesser)} vai tentar adivinhar!</p>
      <div>${c.cands.map(id => temaCard(temaById(id))).join('')}</div>
      <div class="row" style="margin-top:18px">
        <button class="btn btn-ghost" data-a="reroll">🔄 Outros</button>
        <button class="btn btn-ghost" data-a="goCustomTema">✍️ Inventar</button>
      </div>
    </div>`;
  };
  A.reroll = () => { G.cur.cands = sortearTemas(G.cur.cands); SFX.pop(); render(); };
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
      <small class="muted">Use " / " para apelidos (ex: Ronaldo / Fenômeno). Se deixar vazio, o juiz responde SIM/NÃO na hora.</small>
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
    return { id: 'c' + Date.now(), custom: true, titulo, emoji: v('tfEmoji') || '✍️', nivel: v('tfNivel') || 'medio', dicas, jogadores };
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
      <div class="panel"><h3>✅ Respostas que valem</h3>
        ${t.jogadores.length
          ? `<div class="gchips">${t.jogadores.map(j => `<span class="gchip neutral">${esc(mainName(j))}</span>`).join('')}</div>`
          : '<p>Sem lista: você responde SIM ou NÃO na hora. ⚖️</p>'}
        <p class="muted"><small>⚖️ Você é o juiz! Se o jogo errar, toque no palpite para corrigir.</small></p>
      </div>
      ${t.dicas.length ? `<div class="panel"><h3>💡 Dicas que ${who(c.guesser)} pode comprar</h3>${t.dicas.map((d, k) => `<div class="hint"><b>Dica ${k + 1}:</b> ${esc(d)}</div>`).join('')}</div>` : ''}
      <button class="btn btn-big btn-yellow" data-a="secretOk">${NET.active ? 'Começar a rodada nos 2 aparelhos! ⚽' : 'Memorizei! Esconder ➡️'}</button>
      <button class="btn btn-sm btn-ghost" style="margin-top:14px;width:100%" data-a="backChoose">🔄 Trocar tema</button>
    </div>`;
  };
  A.secretOk = () => {
    const c = G.cur;
    G.usados.push(c.tema.id);
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

    const hintsHtml = t.dicas.slice(0, c.dicas).map((d, k) => `<div class="hint"><b>💡 Dica ${k + 1}:</b> ${esc(d)}</div>`).join('')
      + c.revelados.map(n => `<div class="hint"><b>👀 Revelado:</b> ${esc(n)} é do tema!</div>`).join('');

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
      <div class="round-info">Rodada ${G.r + 1}/${G.total} • ${who(c.guesser)} tentando descobrir o tema de ${who(c.chooser)}</div>
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
        <button class="btn btn-blue" data-a="dica" ${podeDica(c) ? '' : 'disabled'}><span class="ic">💡</span>Dica<span class="cost">-${CUSTO.dica} ⚽</span></button>
        <button class="btn btn-purple" data-a="revelar" ${podeRevelar(c) ? '' : 'disabled'}><span class="ic">👀</span>Revelar 1<span class="cost">-${CUSTO.revelar} ⚽</span></button>
        <button class="btn btn-green" data-a="chutarTema"><span class="ic">🎯</span>Chutar tema<span class="cost">errou -${CUSTO.chute}</span></button>
      </div>
      ${hintsHtml ? `<div class="panel">${hintsHtml}</div>` : ''}
      <div class="panel"><h3>🗣️ Palpites (${c.palpites.length})</h3>
        ${c.palpites.length
          ? `<div class="gchips">${c.palpites.map((p, k) => `<button class="gchip ${p.ok ? 'ok' : 'no'}" ${souAdiv ? 'style="cursor:default"' : `data-a="togglePalp" data-i="${k}"`}>${p.ok ? '✅' : '❌'} ${esc(p.ok && p.match ? p.match : p.txt)}</button>`).join('')}</div>
             ${souAdiv ? '' : '<p class="muted"><small>⚖️ Juiz: toque num palpite para trocar entre SIM e NÃO.</small></p>'}`
          : '<p class="muted">Ninguém chutou ainda. Comece com um craque! 😄</p>'}
      </div>
      ${souJuiz && t.jogadores.length ? `
        <div class="panel"><h3>📋 Cola do Juiz (${certos.size}/${t.jogadores.length} descobertos)</h3>
          <div class="gchips">${t.jogadores.map(j => {
            const m = mainName(j);
            const ok = certos.has(m);
            return `<span class="gchip ${ok ? 'ok' : 'neutral'}" style="cursor:default">${ok ? '✅ ' : ''}${esc(m)}</span>`;
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
      toast(`${m} já foi! 😅`); limpaInput(); return;
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
    SFX.pop(); render();
    if (NET.active) syncNet('footPlay', {}, 'pop');
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
    toast(`Errou o tema! -${CUSTO.chute} ⚽`);
    checaFichas('no');
  };
  A.desistir = () => {
    if (!jogando()) return;
    if (!confirm(`Desistir desta rodada? O juiz ganha ${CUSTO.defesa} pontos.`)) return;
    G.cur.status = 'perdeu';
    fimRodada();
  };

  function fimRodada() {
    const c = G.cur;
    if (c.fim) return;
    c.fim = true;
    if (c.status === 'ganhou') { c.ganho = Math.max(1, fichas(c)); G.pts[c.guesser] += c.ganho; }
    else { c.ganho = CUSTO.defesa; G.pts[c.chooser] += c.ganho; }
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
        <p class="muted"><small>✅ acertou &nbsp; 👀 revelado</small></p>
      </div>` : ''}
      ${erros.length ? `<div class="panel"><h3>❌ Não eram do tema</h3><div class="gchips">${erros.map(p => `<span class="gchip no" style="cursor:default">${esc(p.txt)}</span>`).join('')}</div></div>` : ''}
      <div class="panel center"><b>${c.palpites.length}</b> palpites • <b>${c.dicas}</b> dicas • <b>${c.revelados.length}</b> revelados • <b>${c.erradas}</b> chutes errados</div>
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
      <div class="panel"><h3>🏅 Placar final</h3>${rankRows(rank)}</div>
      <div class="row">
        <button class="btn btn-big btn-yellow" data-a="startFoot">🔁 Revanche</button>
        <button class="btn btn-big btn-ghost" data-a="home">🏠 Menu</button>
      </div>
    </div>`;
  };
  AF.footEnd = celebrate;

  /* =========================================================
     EDITOR — meus itens e temas
     ========================================================= */
  S.editor = () => `
  <div class="screen">
    ${topbarSimple()}
    <h2 class="title-w">🛠️ Meus itens e temas</h2>
    <div class="panel"><h3>💰 Novo item (Dá Pra Comprar?)</h3>
      <span class="label">Nome (com "um/uma/o/a")</span>
      <input class="inp" id="itNome" maxlength="60" placeholder="Ex: uma camisa do Flamengo">
      <div class="row" style="margin-top:4px">
        <div><span class="label">Emoji</span><input class="inp" id="itEmoji" maxlength="4" placeholder="🎁"></div>
        <div><span class="label">Preço (R$)</span><input class="inp" id="itPreco" inputmode="numeric" placeholder="350"></div>
      </div>
      <button class="btn btn-yellow" style="margin-top:14px;width:100%" data-a="addItem">➕ Adicionar item</button>
      <div style="margin-top:10px">
        ${store.itens.length
          ? store.itens.map((it, k) => `<div class="list-row"><span style="font-size:26px">${esc(it.e)}</span><span class="grow">${esc(it.n)}<br><small class="muted">${fmt(it.p)}</small></span><button class="icon-btn" data-a="delItem" data-i="${k}">🗑️</button></div>`).join('')
          : '<p class="muted"><small>Nenhum item seu ainda. Já existem ' + window.ITENS.length + ' itens prontos no jogo.</small></p>'}
      </div>
    </div>
    <div class="panel"><h3>⚽ Novo tema (Tema Secreto)</h3>
      ${temaFormHTML()}
      <button class="btn btn-yellow" style="margin-top:14px;width:100%" data-a="addTema">➕ Adicionar tema</button>
      <div style="margin-top:10px">
        ${store.temas.length
          ? store.temas.map((t, k) => `<div class="list-row"><span style="font-size:26px">${esc(t.emoji)}</span><span class="grow">${esc(t.titulo)}<br><small class="muted">${t.jogadores.length} jogadores • ${LVL[t.nivel] || ''}</small></span><button class="icon-btn" data-a="delTema" data-i="${k}">🗑️</button></div>`).join('')
          : '<p class="muted"><small>Nenhum tema seu ainda. Já existem ' + window.TEMAS.length + ' temas prontos no jogo.</small></p>'}
      </div>
    </div>
  </div>`;
  A.addItem = () => {
    const v = id => (document.getElementById(id).value || '').trim();
    const n = v('itNome');
    const p = Number(v('itPreco').replace(/,\d{1,2}$/, '').replace(/\D/g, ''));
    if (!n) { toast('Escreva o nome do item ✍️'); return; }
    if (!p) { toast('Coloque o preço 💰'); return; }
    store.itens.push({ n, e: v('itEmoji') || '🎁', p, custom: true });
    save(); SFX.coin(); toast('Item adicionado! 🎉'); render();
  };
  A.delItem = el => { if (!confirm('Apagar este item?')) return; store.itens.splice(+el.dataset.i, 1); save(); render(); };
  A.addTema = () => {
    const t = readTemaForm();
    if (!t) return;
    store.temas.push(t); save(); fillDatalist(); SFX.coin(); toast('Tema adicionado! ⚽'); render();
  };
  A.delTema = el => { if (!confirm('Apagar este tema?')) return; store.temas.splice(+el.dataset.i, 1); save(); fillDatalist(); render(); };

  /* =========================================================
     AÇÕES GERAIS
     ========================================================= */
  A.som = el => { store.som = !store.som; SFX.on = store.som; save(); el.textContent = store.som ? '🔊' : '🔇'; if (store.som) SFX.coin(); };
  A.home = () => { G = null; go('home', {}, true); };
  A.sair = () => {
    if (G && !G.ended && !confirm('Sair do jogo? O placar desta partida será perdido.')) return;
    G = null; go('home', {}, true);
  };
  A.fechar = () => closeModal();
  A.goPlayers = () => { ui.avOpen = null; go('players'); };
  A.goMoney = () => go('moneySetup', {}, true);
  A.goFoot = () => go('footSetup', {}, true);
  A.goEditor = () => go('editor');
  A.cfg = el => {
    const obj = store[el.dataset.m];
    const v = el.dataset.v;
    obj[el.dataset.k] = /^\d+$/.test(v) ? Number(v) : v;
    save(); render();
    if (NET.active) syncNet(screen, params);
  };

  /* ---------------- eventos ---------------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.a];
    if (!fn) return;
    e.preventDefault();
    if (!['kpDigit', 'kpAdd', 'som'].includes(el.dataset.a)) SFX.click();
    fn(el, e);
  });
  document.addEventListener('submit', e => {
    if (e.target.id === 'guessForm') {
      e.preventDefault();
      palpite(document.getElementById('guessIn').value);
    }
  });
  document.addEventListener('keydown', e => {
    if (screen !== 'moneyPick' || document.activeElement && document.activeElement.tagName === 'INPUT') return;
    if (/^\d$/.test(e.key)) kpDigit(e.key);
    else if (e.key === 'Backspace') A.kpBack();
    else if (e.key === 'Enter') A.kpOk();
  });

  // "segure para ver" o tema (no modo 1 aparelho)
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

  /* ---------------- start ---------------- */
  fillDatalist();

  // Se abriu com ?sala=XXXX na URL, já leva para a tela da sala com o código preenchido!
  const urlSala = new URLSearchParams(location.search).get('sala');
  if (urlSala && /^\d{4}$/.test(urlSala)) {
    ui.joinCode = urlSala;
    screen = 'room';
  }
  render();
})();
