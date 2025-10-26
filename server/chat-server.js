// Simple WebSocket relay for user <-> admin chat
// Usage: npm run dev:server
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8787;
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Ludikids Chat Server');
});
const wss = new WebSocketServer({ server });
const ADMIN_KEY = process.env.ADMIN_KEY || 'dev-admin';
const ORIGIN_ALLOW = (process.env.WS_ORIGINS || '').split(',').filter(Boolean);

const clients = new Map(); // ws -> { id, role }

function broadcastToAdmins(payload) {
  for (const [ws, meta] of clients.entries()) {
    if (meta.role === 'admin' && ws.readyState === 1) ws.send(JSON.stringify(payload));
  }
}
function sendToUser(userId, payload) {
  for (const [ws, meta] of clients.entries()) {
    if (meta.role === 'user' && meta.id === userId && ws.readyState === 1) {
      ws.send(JSON.stringify(payload));
    }
  }
}

function listUsers() {
  const users = [];
  for (const [, meta] of clients.entries()) {
    if (meta.role === 'user') users.push({ id: meta.id });
  }
  return users;
}

wss.on('connection', (ws, req) => {
  // Optional origin allowlist
  if (ORIGIN_ALLOW.length) {
    const origin = req.headers.origin || '';
    if (!ORIGIN_ALLOW.includes(origin)) {
      ws.close(1008, 'Origin not allowed');
      return;
    }
  }
  clients.set(ws, { id: null, role: 'user', lastMsgAt: 0 });

  // Heartbeat
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', data => {
    try {
      const raw = data.toString();
      if (raw.length > 4000) return; // guard large payloads
      const msg = JSON.parse(raw);
      const meta = clients.get(ws) || {};
      // rate limit: 5 msgs / 3s
      const now = Date.now();
      if (now - (meta.lastMsgAt || 0) < 600) return; // ~1.6 msgs/s
      meta.lastMsgAt = now; clients.set(ws, meta);
      if (msg.type === 'hello') {
        if (msg.role === 'admin' && msg.adminKey && msg.adminKey !== ADMIN_KEY) {
          ws.close(1008, 'Unauthorized');
          return;
        }
        clients.set(ws, { id: msg.userId, role: msg.role, lastMsgAt: now });
        if (msg.role === 'admin') ws.send(JSON.stringify({ type: 'presence', users: listUsers() }));
        if (msg.role === 'user') broadcastToAdmins({ type: 'presence', users: listUsers() });
        return;
      }
      if (msg.type === 'chat' && msg.role === 'user') {
        // forward to admins
        broadcastToAdmins({ type: 'chat', from: msg.userId, role: 'user', text: msg.text, at: Date.now() });
        return;
      }
      if (msg.type === 'chat' && msg.role === 'admin' && msg.to) {
        sendToUser(msg.to, { type: 'chat', from: 'admin', role: 'admin', text: msg.text, at: Date.now() });
        return;
      }
    } catch {}
  });

  ws.on('close', () => {
    clients.delete(ws);
    broadcastToAdmins({ type: 'presence', users: listUsers() });
  });
});

server.listen(PORT, () => {
  console.log(`[chat-server] Listening on :${PORT}`);
});

// Liveness check
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { try{ ws.terminate(); }catch{}; continue; }
    ws.isAlive = false; try { ws.ping(); } catch {}
  }
}, 30000);
