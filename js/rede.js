/* =========================================================
   REDE (SALA 2 APARELHOS)
   Usa PeerJS (WebRTC P2P entre celulares/PCs diferentes)
   + BroadcastChannel (instantâneo entre abas no mesmo aparelho).
   ========================================================= */
window.NET = (() => {
  'use strict';

  const PREFIX = 'paixfilho-sala-v1-';
  let role = null;        // 'host' | 'guest' | null
  let code = null;        // código de 4 dígitos
  let peer = null;        // instância PeerJS
  let conn = null;        // DataConnection PeerJS
  let bc = null;          // BroadcastChannel local
  let connected = false;
  let onMsg = null;
  let onStatus = null;
  const seen = new Set(); // evita processar mensagem duplicada (BC + WebRTC)

  const ICE = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  function genCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  function notifyStatus(st, detail) {
    if (typeof onStatus === 'function') onStatus(st, detail || '');
  }

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
    if (bc) {
      try { bc.postMessage(msg); } catch (e) { /* ignore */ }
    }
    if (conn && conn.open) {
      try { conn.send(msg); } catch (e) { /* ignore */ }
    }
  }

  function setupBC(roomCode) {
    if (bc) { try { bc.close(); } catch (e) { /* ok */ } bc = null; }
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(PREFIX + roomCode);
      bc.onmessage = ev => {
        if (ev.data && ev.data._from !== role) handleIncoming(ev.data);
      };
    }
  }

  function stop() {
    connected = false;
    role = null;
    code = null;
    if (conn) { try { conn.close(); } catch (e) { /* ok */ } conn = null; }
    if (peer) { try { peer.destroy(); } catch (e) { /* ok */ } peer = null; }
    if (bc) { try { bc.close(); } catch (e) { /* ok */ } bc = null; }
    notifyStatus('disconnected');
  }

  function bindConn(c) {
    conn = c;
    c.on('open', () => {
      connected = true;
      notifyStatus('connected');
      sendRaw({ type: '__ping' });
    });
    c.on('data', data => handleIncoming(data));
    c.on('close', () => {
      conn = null;
      // mantém sala viva caso esteja via BroadcastChannel ou reconectando
      if (!bc) {
        connected = false;
        notifyStatus('peer_left');
      }
    });
    c.on('error', () => {});
  }

  function createRoom(customCode) {
    stop();
    role = 'host';
    code = customCode || genCode();
    setupBC(code);
    notifyStatus('waiting', code);

    if (typeof window.Peer === 'function') {
      try {
        peer = new window.Peer(PREFIX + code, { config: { iceServers: ICE } });
        peer.on('open', () => notifyStatus('waiting', code));
        peer.on('connection', c => bindConn(c));
        peer.on('error', err => {
          if (err && err.type === 'unavailable-id' && !customCode) {
            // código já em uso, sorteia outro
            createRoom();
          }
        });
      } catch (e) { /* fallback BroadcastChannel continua ativo */ }
    }
    return code;
  }

  function joinRoom(roomCode) {
    roomCode = String(roomCode || '').replace(/\D/g, '').slice(0, 4);
    if (roomCode.length !== 4) return false;
    stop();
    role = 'guest';
    code = roomCode;
    setupBC(code);
    notifyStatus('connecting', code);

    // Tenta ping imediato via BroadcastChannel (caso seja mesma máquina/rede local de abas)
    sendRaw({ type: '__ping' });

    if (typeof window.Peer === 'function') {
      try {
        peer = new window.Peer({ config: { iceServers: ICE } });
        peer.on('open', () => {
          const c = peer.connect(PREFIX + code, { reliable: true });
          bindConn(c);
        });
        peer.on('error', () => {
          if (!connected) notifyStatus('error', 'Não foi possível achar a sala ' + code);
        });
      } catch (e) { /* ok */ }
    }
    return true;
  }

  return {
    get active() { return !!role && connected; },
    get inRoom() { return !!role; },
    get role() { return role; },
    get isHost() { return role === 'host'; },
    get isGuest() { return role === 'guest'; },
    get myIdx() { return role === 'guest' ? 1 : 0; },
    get code() { return code; },
    get connected() { return connected; },
    set onMessage(fn) { onMsg = fn; },
    set onStatusChange(fn) { onStatus = fn; },
    createRoom,
    joinRoom,
    send: sendRaw,
    stop
  };
})();
