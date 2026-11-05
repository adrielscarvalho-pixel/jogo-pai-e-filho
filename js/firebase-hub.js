/* =========================================================
   FIREBASE CLOUD HUB — Autenticação + Firestore Tempo Real
   Projeto: arena-jogos-hub-2026
   - Login Automático (Anonymous Auth) + Login com Google
   - Presença Online no Lobby (/usuarios)
   - Salas em Tempo Real 100% Estáveis (/salas)
   - Convites Instantâneos (/convites)
   - Ranking, Histórico de Partidas (/partidas) e Itens/Temas na Nuvem (/conteudosCustom)
   ========================================================= */
window.FB = (() => {
  'use strict';

  const firebaseConfig = {
    apiKey: 'AIzaSyDxvwmvfUFgQOWuav8Pk8pYhoNIrWCV8S0',
    authDomain: 'arena-jogos-hub-2026.firebaseapp.com',
    projectId: 'arena-jogos-hub-2026',
    storageBucket: 'arena-jogos-hub-2026.firebasestorage.app',
    messagingSenderId: '122674124612',
    appId: '1:122674124612:web:24ca08c1e70d9105d6a911'
  };

  let app = null;
  let auth = null;
  let db = null;
  let currentUser = null;
  let ready = false;

  let unsubUsers = null;
  let unsubInvites = null;
  let unsubRoom = null;
  let unsubCustom = null;
  let unsubPartidas = null;

  let onAuthChangeCb = null;
  let onOnlineUsersCb = null;
  let onInviteCb = null;
  let onRoomSnapshotCb = null;
  let onCustomContentCb = null;
  let onLeaderboardCb = null;

  const processedInvites = new Set();
  let leaderboardUsers = [];
  let recentMatches = [];

  function init() {
    if (typeof window.firebase === 'undefined') {
      console.warn('[FB] SDK do Firebase não carregado; operando em modo local/P2P.');
      return;
    }
    try {
      app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(firebaseConfig);
      auth = window.firebase.auth();
      db = window.firebase.firestore();

      // Usa persistência SESSION para que cada aba/aparelho tenha seu próprio UID independente
      auth.setPersistence(window.firebase.auth.Auth.Persistence.SESSION).catch(() => {}).finally(() => {
        auth.onAuthStateChanged(user => {
          if (user) {
            currentUser = user;
            ready = true;
            startGlobalListeners();
            if (typeof onAuthChangeCb === 'function') onAuthChangeCb(user);
          } else {
            auth.signInAnonymously().catch(err => {
              console.warn('[FB] Falha no login anônimo:', err);
            });
          }
        });
      });
    } catch (e) {
      console.warn('[FB] Erro ao inicializar Firebase:', e);
    }
  }

  /* ---------------- AUTENTICAÇÃO GOOGLE / CONVIDADO ---------------- */
  async function loginGoogle() {
    if (!auth) throw new Error('Firebase não inicializado');
    const provider = new window.firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    let res;
    if (currentUser && currentUser.isAnonymous) {
      try {
        res = await currentUser.linkWithPopup(provider);
      } catch (linkErr) {
        // Se a conta Google já estava vinculada antes, faz signIn normal
        res = await auth.signInWithPopup(provider);
      }
    } else {
      res = await auth.signInWithPopup(provider);
    }
    currentUser = res.user;
    if (typeof onAuthChangeCb === 'function') onAuthChangeCb(currentUser);
    return currentUser;
  }

  async function logoutGoogle() {
    if (!auth) return;
    await auth.signOut();
    // O onAuthStateChanged criará uma nova sessão anônima automaticamente
  }

  /* ---------------- LISTENERS GLOBAIS (LOBBY, CONVITES, RANKING, CUSTOM) ---------------- */
  function startGlobalListeners() {
    if (!db || !currentUser) return;

    // 1. Usuários Online & Ranking Geral (/usuarios)
    if (unsubUsers) unsubUsers();
    unsubUsers = db.collection('usuarios').onSnapshot(snap => {
      const now = Date.now();
      const online = [];
      const allRank = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (!d) return;
        allRank.push({
          uid: doc.id,
          id: d.id || '0000',
          nome: d.nome || 'Jogador',
          av: d.av || '🎮',
          vitorias: Number(d.vitorias || 0),
          partidas: Number(d.partidas || 0),
          pontos: Number(d.pontos || 0),
          isGoogle: !!d.isGoogle,
          online: !!(d.online && d.ultimoSinal && (now - d.ultimoSinal < 45000))
        });
        if (doc.id !== currentUser.uid && d.online && d.ultimoSinal && (now - d.ultimoSinal < 45000)) {
          online.push({
            uid: doc.id,
            id: String(d.id || '0000'),
            nome: String(d.nome || 'Jogador').slice(0, 16),
            av: d.av || '🎮',
            inRoom: !!d.inRoom,
            ts: d.ultimoSinal
          });
        }
      });
      allRank.sort((a, b) => (b.vitorias - a.vitorias) || (b.pontos - a.pontos) || (b.partidas - a.partidas));
      leaderboardUsers = allRank.slice(0, 30);
      if (typeof onOnlineUsersCb === 'function') onOnlineUsersCb(online);
      if (typeof onLeaderboardCb === 'function') onLeaderboardCb(leaderboardUsers, recentMatches);
    }, () => {});

    // 2. Conteúdos Customizados na Nuvem (/conteudosCustom)
    if (unsubCustom) unsubCustom();
    unsubCustom = db.collection('conteudosCustom').onSnapshot(snap => {
      const itens = [];
      const temas = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (!d) return;
        if (d.tipo === 'item' && d.nome && d.preco) {
          itens.push({
            cloudId: doc.id,
            n: d.nome,
            e: d.emoji || '🎁',
            p: Number(d.preco),
            cat: d.cat || 'lazer',
            custom: true,
            criadoPorUid: d.criadoPorUid
          });
        } else if (d.tipo === 'tema' && d.titulo) {
          temas.push({
            id: doc.id,
            cloudId: doc.id,
            custom: true,
            cat: d.cat || 'curiosidades',
            titulo: d.titulo,
            emoji: d.emoji || '✍️',
            nivel: d.nivel || 'medio',
            dicas: Array.isArray(d.dicas) ? d.dicas : [],
            jogadores: Array.isArray(d.jogadores) ? d.jogadores : [],
            criadoPorUid: d.criadoPorUid
          });
        }
      });
      if (typeof onCustomContentCb === 'function') onCustomContentCb({ itens, temas });
    }, () => {});

    // 3. Histórico de Partidas (/partidas)
    if (unsubPartidas) unsubPartidas();
    unsubPartidas = db.collection('partidas').limit(30).onSnapshot(snap => {
      const list = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d) list.push(Object.assign({ id: doc.id }, d));
      });
      list.sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));
      recentMatches = list.slice(0, 20);
      if (typeof onLeaderboardCb === 'function') onLeaderboardCb(leaderboardUsers, recentMatches);
    }, () => {});
  }

  function listenInvitesForId(myShortId) {
    if (!db || !currentUser || !myShortId) return;
    if (unsubInvites) unsubInvites();
    unsubInvites = db.collection('convites')
      .where('toId', '==', String(myShortId))
      .onSnapshot(snap => {
        const now = Date.now();
        snap.docChanges().forEach(change => {
          if (change.type === 'added' || change.type === 'modified') {
            const d = change.doc.data();
            const docId = change.doc.id;
            if (!d || d.status !== 'pending' || processedInvites.has(docId)) return;
            if (d.criadoEm && (now - d.criadoEm > 60000)) return;
            processedInvites.add(docId);
            // Marca como entregue para não exibir novamente
            db.collection('convites').doc(docId).update({ status: 'delivered' }).catch(() => {});
            if (typeof onInviteCb === 'function' && d.fromProfile && d.roomCode) {
              onInviteCb(d.fromProfile, d.roomCode);
            }
          }
        });
      }, () => {});
  }

  /* ---------------- PERFIL & PRESENÇA NA NUVEM ---------------- */
  async function syncProfile(profile, extra = {}) {
    if (!db || !currentUser || !profile) return;
    const docRef = db.collection('usuarios').doc(currentUser.uid);
    const payload = {
      uid: currentUser.uid,
      id: String(profile.id || '1000').slice(0, 16),
      nome: String(profile.nome || 'Jogador').slice(0, 50) || 'Jogador',
      av: String(profile.av || '👨').slice(0, 16) || '👨',
      hubTitle: String(extra.hubTitle || 'ARENA 🆚 JOGOS').slice(0, 60) || 'ARENA 🆚 JOGOS',
      online: true,
      inRoom: !!extra.inRoom,
      isGoogle: !currentUser.isAnonymous,
      ultimoSinal: Date.now(),
      atualizadoEm: Date.now()
    };
    if (typeof extra.vitorias === 'number') payload.vitorias = extra.vitorias;
    if (typeof extra.partidas === 'number') payload.partidas = extra.partidas;
    if (typeof extra.pontos === 'number') payload.pontos = extra.pontos;
    try {
      await docRef.set(payload, { merge: true });
    } catch (e) {}
  }

  async function loadCloudProfile() {
    if (!db || !currentUser) return null;
    try {
      const snap = await db.collection('usuarios').doc(currentUser.uid).get();
      return snap.exists ? snap.data() : null;
    } catch (e) {
      return null;
    }
  }

  /* ---------------- CONVITES EM TEMPO REAL ---------------- */
  async function sendInvite(targetId, fromProfile, roomCode) {
    if (!db || !currentUser || !targetId || !roomCode) return;
    try {
      await db.collection('convites').add({
        toId: String(targetId).slice(0, 16),
        fromUid: currentUser.uid,
        fromProfile: {
          id: String(fromProfile.id || '1000'),
          nome: String(fromProfile.nome || 'Jogador').slice(0, 30),
          av: String(fromProfile.av || '👨')
        },
        roomCode: String(roomCode).slice(0, 16),
        codigoSala: String(roomCode).slice(0, 16),
        status: 'pending',
        criadoEm: Date.now()
      });
    } catch (e) {}
  }

  /* ---------------- SALAS MULTIPLAYER EM TEMPO REAL (/salas) ---------------- */
  async function createCloudRoom(code, hostProfile) {
    if (!db || !currentUser || !code) return;
    leaveCloudRoom();
    const roomRef = db.collection('salas').doc(String(code));
    try {
      await roomRef.set({
        hostUid: currentUser.uid,
        codigo: String(code),
        code: String(code),
        status: 'waiting',
        players: [{
          id: String(hostProfile.id || '1000'),
          nome: String(hostProfile.nome || 'Jogador 1').slice(0, 30),
          av: String(hostProfile.av || '👨')
        }],
        hostMsg: null,
        guestMsg: null,
        criadoEm: Date.now(),
        atualizadoEm: Date.now()
      });
      subscribeRoom(code);
    } catch (e) {
      console.warn('[FB] Erro ao criar sala na nuvem:', e);
    }
  }

  async function joinCloudRoom(code, guestProfile) {
    if (!db || !currentUser || !code) return false;
    leaveCloudRoom();
    const roomRef = db.collection('salas').doc(String(code));
    try {
      const snap = await roomRef.get();
      if (!snap.exists) {
        // Mesmo se ainda não existir no Firestore, escuta caso seja criada em seguida
        subscribeRoom(code);
        return false;
      }
      await roomRef.update({
        guestUid: currentUser.uid,
        status: 'connected',
        atualizadoEm: Date.now()
      });
      subscribeRoom(code);
      return true;
    } catch (e) {
      subscribeRoom(code);
      return false;
    }
  }

  function subscribeRoom(code) {
    if (!db || !code) return;
    if (unsubRoom) unsubRoom();
    unsubRoom = db.collection('salas').doc(String(code)).onSnapshot(snap => {
      if (!snap.exists) return;
      const data = snap.data();
      if (typeof onRoomSnapshotCb === 'function') onRoomSnapshotCb(data);
    }, () => {});
  }

  async function sendRoomMessage(code, role, msg) {
    if (!db || !currentUser || !code || !role || !msg) return;
    const roomRef = db.collection('salas').doc(String(code));
    const updateData = { atualizadoEm: Date.now() };
    if (role === 'host') {
      updateData.hostMsg = msg;
    } else {
      updateData.guestMsg = msg;
      updateData.guestUid = currentUser.uid;
      updateData.status = 'connected';
    }
    try {
      await roomRef.update(updateData);
    } catch (e) {}
  }

  function leaveCloudRoom() {
    if (unsubRoom) {
      unsubRoom();
      unsubRoom = null;
    }
  }

  /* ---------------- ITENS E TEMAS NA NUVEM (/conteudosCustom) ---------------- */
  async function saveCustomItem(item) {
    if (!db || !currentUser || !item) return;
    try {
      await db.collection('conteudosCustom').add({
        criadoPorUid: currentUser.uid,
        tipo: 'item',
        nome: String(item.n).slice(0, 100),
        emoji: String(item.e || '🎁').slice(0, 16),
        preco: Number(item.p) || 100,
        cat: String(item.cat || 'lazer').slice(0, 40),
        criadoEm: Date.now()
      });
    } catch (e) {}
  }

  async function saveCustomTema(tema) {
    if (!db || !currentUser || !tema) return;
    try {
      await db.collection('conteudosCustom').add({
        criadoPorUid: currentUser.uid,
        tipo: 'tema',
        titulo: String(tema.titulo).slice(0, 100),
        emoji: String(tema.emoji || '✍️').slice(0, 16),
        cat: String(tema.cat || 'curiosidades').slice(0, 40),
        nivel: String(tema.nivel || 'medio').slice(0, 20),
        dicas: Array.isArray(tema.dicas) ? tema.dicas.slice(0, 5) : [],
        jogadores: Array.isArray(tema.jogadores) ? tema.jogadores.slice(0, 200) : [],
        criadoEm: Date.now()
      });
    } catch (e) {}
  }

  async function deleteCustomDoc(cloudId) {
    if (!db || !currentUser || !cloudId) return;
    try {
      await db.collection('conteudosCustom').doc(cloudId).delete();
    } catch (e) {}
  }

  /* ---------------- HISTÓRICO DE PARTIDAS & ESTATÍSTICAS (/partidas) ---------------- */
  async function recordMatch(matchInfo) {
    if (!db || !currentUser || !matchInfo) return;
    try {
      await db.collection('partidas').add({
        uidCriador: currentUser.uid,
        modo: String(matchInfo.modo || 'jogo').slice(0, 40),
        vencedor: String(matchInfo.vencedor || 'Empate').slice(0, 75),
        pts: Array.isArray(matchInfo.pts) ? matchInfo.pts.slice(0, 4) : [0, 0],
        players: Array.isArray(matchInfo.players) ? matchInfo.players.slice(0, 4) : [],
        criadoEm: Date.now()
      });
    } catch (e) {}
  }

  return {
    init,
    get ready() { return ready; },
    get user() { return currentUser; },
    get isGoogle() { return !!(currentUser && !currentUser.isAnonymous); },
    get leaderboard() { return leaderboardUsers; },
    get matches() { return recentMatches; },
    set onAuthChange(fn) { onAuthChangeCb = fn; },
    set onOnlineUsers(fn) { onOnlineUsersCb = fn; },
    set onInvite(fn) { onInviteCb = fn; },
    set onRoomSnapshot(fn) { onRoomSnapshotCb = fn; },
    set onCustomContent(fn) { onCustomContentCb = fn; },
    set onLeaderboardChange(fn) { onLeaderboardCb = fn; },
    loginGoogle,
    logoutGoogle,
    syncProfile,
    loadCloudProfile,
    listenInvitesForId,
    sendInvite,
    createCloudRoom,
    joinCloudRoom,
    sendRoomMessage,
    leaveCloudRoom,
    saveCustomItem,
    saveCustomTema,
    deleteCustomDoc,
    recordMatch
  };
})();
