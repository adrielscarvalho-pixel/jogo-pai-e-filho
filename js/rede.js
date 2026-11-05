/* =========================================================
   REDE & LOBBY ONLINE (FIREBASE FIRESTORE + PEERJS + BROADCAST)
   - Sincronização em Nuvem via Google Firebase (Firestore em Tempo Real)
   - Perfil único por dispositivo (#ID de 4 dígitos)
   - Descoberta automática de jogadores online
   - Convite em 1 clique com popup de Aceitar/Recusar
   - Sala com código de 4 dígitos onde SOMENTE O ADMIN (Host) configura
   ========================================================= */
window.NET = (() => {
  'use strict';

  const ROOM_PREFIX = 'paixfilho-sala-v2-';
  const USER_PREFIX = 'paixfilho-user-v2-';
  const BEACON_ID = 'paixfilho-lobby-beacon-v2';

  let myProfile = { id: '1000', nome: 'Jogador', av: '👨' };
  let extraStats = { hubTitle: 'ARENA 🆚 JOGOS', vitorias: 0, partidas: 0, pontos: 0 };
  let role = null;        // 'host' | 'guest' | null
  let code = null;        // código de 4 dígitos da sala
  let roomPeer = null;    // Peer da sala (quando host)
  let userPeer = null;    // Peer permanente do perfil do usuário
  let beaconPeer = null;  // Se este aparelho assumiu o posto de Beacon do lobby
  let beaconConn = null;  // Conexão deste aparelho com o Beacon do lobby
  let conn = null;        // DataConnection da sala atual
  let bcRoom = null;      // BroadcastChannel da sala
  let bcLobby = null;     // BroadcastChannel do lobby
  let connected = false;

  let onMsg = null;
  let onStatus = null;
  let onInvite = null;
  let onLobbyUpdate = null;
  let lastLobbySig = '';
  let lastStatus = '';

  const seen = new Set();
  const seenInvites = new Set();
  const onlinePeers = new Map(); // id -> { id, nome, av, ts, inRoom }
  const beaconClients = new Map(); // id -> DataConnection (usado quando somos o beacon)

  const ICE = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  function genCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  function notifyStatus(st, detail) {
    const key = `${st}:${detail || ''}`;
    if (key === lastStatus) return;
    lastStatus = key;
    if (typeof onStatus === 'function') onStatus(st, detail || '');
  }

  function deliverInvite(fromProfile, roomCode) {
    if (!fromProfile || !roomCode) return;
    const key = `${fromProfile.id || ''}:${roomCode}`;
    if (seenInvites.has(key)) return;
    if (code && String(code) === String(roomCode)) return;
    seenInvites.add(key);
    if (typeof onInvite === 'function') onInvite(fromProfile, roomCode);
  }

  function notifyLobby() {
    const now = Date.now();
    for (const [k, v] of onlinePeers.entries()) {
      if (now - v.ts > 90000 || k === myProfile.id) onlinePeers.delete(k);
    }
    const list = getOnlineList();
    const sig = list.map(u => `${u.id}:${u.nome}:${u.av}:${u.inRoom ? 1 : 0}`).sort().join('|');
    if (sig !== lastLobbySig) {
      lastLobbySig = sig;
      if (typeof onLobbyUpdate === 'function') onLobbyUpdate(list);
    }
  }

  function getOnlineList() {
    const now = Date.now();
    const list = [];
    for (const [k, v] of onlinePeers.entries()) {
      if (k !== myProfile.id && now - v.ts <= 90000) list.push(v);
    }
    return list;
  }

  function registerOnlinePeer(p, silent) {
    if (!p || !p.id || String(p.id) === String(myProfile.id)) return;
    onlinePeers.set(String(p.id), {
      id: String(p.id),
      nome: String(p.nome || 'Jogador').slice(0, 16),
      av: p.av || '🎮',
      inRoom: !!p.inRoom,
      ts: p.ts || Date.now()
    });
    if (!silent) notifyLobby();
  }

  /* ---------------- INTEGRAÇÃO COM FIREBASE (window.FB) ---------------- */
  function bindFirebase() {
    if (!window.FB) return;

    window.FB.onOnlineUsers = list => {
      if (Array.isArray(list)) {
        list.forEach(u => registerOnlinePeer(u, true));
      }
      notifyLobby();
    };

    window.FB.onInvite = (fromProfile, roomCode) => {
      deliverInvite(fromProfile, roomCode);
    };

    window.FB.onRoomSnapshot = data => {
      if (!data || !role || String(data.code || data.codigo) !== String(code)) return;
      if (role === 'host') {
        if (data.status === 'connected' && !connected) {
          connected = true;
          notifyStatus('connected');
        }
        if (data.guestMsg) {
          handleIncoming(data.guestMsg);
        }
      } else if (role === 'guest') {
        if (!connected) {
          connected = true;
          notifyStatus('connected');
        }
        if (data.hostMsg) {
          handleIncoming(data.hostMsg);
        }
      }
    };
  }

  /* ---------------- LOBBY E PERFIL ONLINE ---------------- */
  function initLobby(profile, extra) {
    if (profile) {
      myProfile = {
        id: String(profile.id || genCode()),
        nome: String(profile.nome || 'Jogador').slice(0, 16),
        av: profile.av || '👨'
      };
    }
    if (extra) {
      extraStats = Object.assign(extraStats, extra);
    }

    bindFirebase();
    if (window.FB && window.FB.ready) {
      window.FB.listenInvitesForId(myProfile.id);
    }

    // 1. BroadcastChannel local (mesmo navegador/aparelho)
    if (!bcLobby && typeof BroadcastChannel !== 'undefined') {
      bcLobby = new BroadcastChannel(BEACON_ID);
      bcLobby.onmessage = ev => {
        const d = ev.data;
        if (!d) return;
        if (d.type === 'presence' && d.profile) {
          registerOnlinePeer(d.profile);
        } else if (d.type === 'who_is_online') {
          announcePresence();
        } else if (d.type === 'direct_invite' && d.toId === myProfile.id) {
          deliverInvite(d.fromProfile, d.roomCode);
        }
      };
      bcLobby.postMessage({ type: 'who_is_online' });
    }

    // 2. PeerJS User ID + Beacon Global
    if (typeof window.Peer === 'function' && !userPeer) {
      try {
        userPeer = new window.Peer(USER_PREFIX + myProfile.id, { config: { iceServers: ICE } });
        userPeer.on('open', () => {
          connectToBeacon();
        });
        userPeer.on('connection', c => {
          c.on('data', data => {
            if (data && data.type === 'direct_invite') {
              deliverInvite(data.fromProfile, data.roomCode);
            } else if (data && data.type === 'presence' && data.profile) {
              registerOnlinePeer(data.profile);
            }
          });
        });
        userPeer.on('error', () => {});
      } catch (e) { /* ok */ }
    }

    announcePresence();
  }

  function connectToBeacon() {
    if (!userPeer || userPeer.destroyed) return;
    try {
      const c = userPeer.connect(BEACON_ID, { reliable: true });
      let opened = false;
      const timer = setTimeout(() => {
        if (!opened) tryBecomeBeacon();
      }, 2500);

      c.on('open', () => {
        opened = true;
        clearTimeout(timer);
        beaconConn = c;
        c.send({ type: 'presence', profile: Object.assign({}, myProfile, { inRoom: !!role }) });
      });
      c.on('data', data => {
        if (data && data.type === 'roster' && Array.isArray(data.peers)) {
          data.peers.forEach(p => registerOnlinePeer(p));
        } else if (data && data.type === 'direct_invite' && data.toId === myProfile.id) {
          deliverInvite(data.fromProfile, data.roomCode);
        }
      });
      c.on('close', () => {
        beaconConn = null;
        setTimeout(tryBecomeBeacon, 1500);
      });
      c.on('error', () => {
        clearTimeout(timer);
        if (!opened) tryBecomeBeacon();
      });
    } catch (e) {
      tryBecomeBeacon();
    }
  }

  function tryBecomeBeacon() {
    if (beaconPeer || typeof window.Peer !== 'function') return;
    try {
      const bp = new window.Peer(BEACON_ID, { config: { iceServers: ICE } });
      bp.on('open', () => {
        beaconPeer = bp;
      });
      bp.on('connection', c => {
        c.on('data', data => {
          if (!data) return;
          if (data.type === 'presence' && data.profile) {
            beaconClients.set(data.profile.id, c);
            registerOnlinePeer(data.profile);
            broadcastBeaconRoster();
          } else if (data.type === 'direct_invite' && data.toId) {
            if (data.toId === myProfile.id) {
              deliverInvite(data.fromProfile, data.roomCode);
            } else {
              const targetConn = beaconClients.get(data.toId);
              if (targetConn && targetConn.open) {
                try { targetConn.send(data); } catch (e) {}
              }
            }
          }
        });
      });
      bp.on('error', () => {
        try { bp.destroy(); } catch (e) {}
        beaconPeer = null;
      });
    } catch (e) {}
  }

  function broadcastBeaconRoster() {
    if (!beaconPeer) return;
    const all = [Object.assign({}, myProfile, { inRoom: !!role }), ...getOnlineList()];
    for (const [id, c] of beaconClients.entries()) {
      if (c && c.open) {
        try { c.send({ type: 'roster', peers: all }); } catch (e) {}
      } else {
        beaconClients.delete(id);
      }
    }
  }

  function announcePresence() {
    const payload = {
      type: 'presence',
      profile: { id: myProfile.id, nome: myProfile.nome, av: myProfile.av, inRoom: !!role }
    };
    if (bcLobby) {
      try { bcLobby.postMessage(payload); } catch (e) {}
    }
    if (beaconConn && beaconConn.open) {
      try { beaconConn.send(payload); } catch (e) {}
    }
    if (beaconPeer) {
      broadcastBeaconRoster();
    }
    if (window.FB && window.FB.ready) {
      window.FB.syncProfile(myProfile, Object.assign({}, extraStats, { inRoom: !!role }));
    }
  }

  setInterval(() => {
    announcePresence();
    notifyLobby();
  }, 25000);

  function inviteFriend(targetId) {
    targetId = String(targetId || '').replace(/\D/g, '').slice(0, 4);
    if (!targetId) return null;
    if (!role || role !== 'host') {
      createRoom();
    }
    const msg = {
      type: 'direct_invite',
      toId: targetId,
      fromProfile: myProfile,
      roomCode: code
    };
    if (window.FB && window.FB.ready) {
      window.FB.sendInvite(targetId, myProfile, code);
    }
    if (bcLobby) {
      try { bcLobby.postMessage(msg); } catch (e) {}
    }
    if (beaconConn && beaconConn.open) {
      try { beaconConn.send(msg); } catch (e) {}
    }
    if (beaconPeer) {
      const tc = beaconClients.get(targetId);
      if (tc && tc.open) { try { tc.send(msg); } catch (e) {} }
    }
    if (userPeer && !userPeer.destroyed) {
      try {
        const dc = userPeer.connect(USER_PREFIX + targetId, { reliable: true });
        dc.on('open', () => {
          dc.send(msg);
          setTimeout(() => { try { dc.close(); } catch (e) {} }, 1500);
        });
      } catch (e) {}
    }
    return code;
  }

  /* ---------------- SALA DE JOGO (HOST / GUEST) ---------------- */
  function handleIncoming(raw) {
    if (!raw || typeof raw !== 'object' || !raw._id) return;
    if (seen.has(raw._id)) return;
    seen.add(raw._id);
    if (seen.size > 400) {
      const first = seen.values().next().value;
      seen.delete(first);
    }
    if (raw.type === '__ping') {
      sendRaw({ type: '__pong' });
      return;
    }
    if (raw.type === '__pong') {
      if (!connected) {
        connected = true;
        notifyStatus('connected');
      }
      return;
    }
    if (!connected) {
      connected = true;
      notifyStatus('connected');
    }
    if (typeof onMsg === 'function') onMsg(raw);
  }

  function sendRaw(obj) {
    const msg = Object.assign({}, obj, {
      _id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      _from: role
    });
    seen.add(msg._id);
    if (bcRoom) {
      try { bcRoom.postMessage(msg); } catch (e) {}
    }
    if (conn && conn.open) {
      try { conn.send(msg); } catch (e) {}
    }
    if (window.FB && window.FB.ready && code && role) {
      window.FB.sendRoomMessage(code, role, msg);
    }
  }

  function setupRoomBC(roomCode) {
    if (bcRoom) { try { bcRoom.close(); } catch (e) {} bcRoom = null; }
    if (typeof BroadcastChannel !== 'undefined') {
      bcRoom = new BroadcastChannel(ROOM_PREFIX + roomCode);
      bcRoom.onmessage = ev => {
        if (ev.data && ev.data._from !== role) handleIncoming(ev.data);
      };
    }
  }

  function stop(silent) {
    connected = false;
    role = null;
    code = null;
    if (conn) { try { conn.close(); } catch (e) {} conn = null; }
    if (roomPeer) { try { roomPeer.destroy(); } catch (e) {} roomPeer = null; }
    if (bcRoom) { try { bcRoom.close(); } catch (e) {} bcRoom = null; }
    if (window.FB) window.FB.leaveCloudRoom();
    if (!silent) {
      announcePresence();
      notifyStatus('disconnected');
    }
  }

  function bindConn(c) {
    conn = c;
    c.on('open', () => {
      if (!connected) {
        connected = true;
        notifyStatus('connected');
      }
      sendRaw({ type: '__ping' });
    });
    c.on('data', data => handleIncoming(data));
    c.on('close', () => {
      conn = null;
      if (!bcRoom && (!window.FB || !window.FB.ready)) {
        connected = false;
        notifyStatus('peer_left');
      }
    });
    c.on('error', () => {});
  }

  function createRoom(customCode) {
    stop(true);
    role = 'host';
    code = customCode || genCode();
    setupRoomBC(code);
    announcePresence();
    notifyStatus('waiting', code);

    if (window.FB && window.FB.ready) {
      window.FB.createCloudRoom(code, myProfile);
    }

    if (typeof window.Peer === 'function') {
      try {
        roomPeer = new window.Peer(ROOM_PREFIX + code, { config: { iceServers: ICE } });
        roomPeer.on('open', () => notifyStatus('waiting', code));
        roomPeer.on('connection', c => bindConn(c));
        roomPeer.on('error', err => {
          if (err && err.type === 'unavailable-id' && !customCode) {
            createRoom();
          }
        });
      } catch (e) {}
    }
    return code;
  }

  function joinRoom(roomCode) {
    roomCode = String(roomCode || '').replace(/\D/g, '').slice(0, 4);
    if (roomCode.length !== 4) return false;
    stop(true);
    role = 'guest';
    code = roomCode;
    setupRoomBC(code);
    announcePresence();
    notifyStatus('connecting', code);

    if (window.FB && window.FB.ready) {
      window.FB.joinCloudRoom(code, myProfile);
    }

    sendRaw({ type: '__ping' });

    if (typeof window.Peer === 'function') {
      try {
        roomPeer = new window.Peer({ config: { iceServers: ICE } });
        roomPeer.on('open', () => {
          const c = roomPeer.connect(ROOM_PREFIX + code, { reliable: true });
          bindConn(c);
        });
        roomPeer.on('error', () => {
          if (!connected && (!window.FB || !window.FB.ready)) {
            notifyStatus('error', 'Sala ' + code + ' não encontrada');
          }
        });
      } catch (e) {}
    }
    return true;
  }

  return {
    get active() { return !!role && connected; },
    get inRoom() { return !!role; },
    get role() { return role; },
    get isHost() { return role === 'host'; },
    get isGuest() { return role === 'guest'; },
    // Somente o Admin (Host da sala, ou jogador local quando offline) pode configurar!
    get isAdmin() { return !role || role === 'host'; },
    get myIdx() { return role === 'guest' ? 1 : 0; },
    get code() { return code; },
    get connected() { return connected; },
    get profile() { return myProfile; },
    get onlineList() { return getOnlineList(); },
    set onMessage(fn) { onMsg = fn; },
    set onStatusChange(fn) { onStatus = fn; },
    set onInviteReceived(fn) { onInvite = fn; },
    set onLobbyChange(fn) { onLobbyUpdate = fn; },
    initLobby,
    updateProfile(p, extra) { initLobby(p, extra); },
    inviteFriend,
    createRoom,
    joinRoom,
    send: sendRaw,
    stop
  };
})();
