import { useEffect, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';

function getUserId() {
  try {
    let id = localStorage.getItem('lk_user_id');
    if (!id) {
      if (crypto && crypto.getRandomValues){
        const buf = new Uint8Array(8); crypto.getRandomValues(buf);
        id = Array.from(buf, b=>b.toString(16).padStart(2,'0')).join('');
      } else {
        id = Math.random().toString(36).slice(2, 10);
      }
      localStorage.setItem('lk_user_id', id);
    }
    return id;
  } catch { return 'anon'; }
}

export function useChat(role = 'user') {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const userId = useRef(getUserId());
  const lastSendRef = useRef(0);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.addEventListener('open', () => {
      setConnected(true);
      const hello = { type: 'hello', role, userId: userId.current };
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      if (role === 'admin' && adminKey) hello.adminKey = adminKey;
      ws.send(JSON.stringify(hello));
    });
    ws.addEventListener('message', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'chat') setMessages((m) => [...m, data]);
        if (data.type === 'presence') setUsers(data.users || []);
      } catch {}
    });
    ws.addEventListener('close', () => setConnected(false));
    return () => ws.close();
  }, [role]);

  const send = (payload) => {
    const now = Date.now();
    if (now - lastSendRef.current < 500) return; // throttle
    lastSendRef.current = now;
    if (!wsRef.current || wsRef.current.readyState !== 1) return;
    const text = (payload?.text || '').toString().slice(0, 800);
    wsRef.current.send(JSON.stringify({ ...payload, text }));
    if (role === 'user' && payload.type === 'chat') {
      setMessages((m) => [...m, { ...payload, at: Date.now(), from: userId.current }]);
    }
  };

  return { messages, send, users, connected, userId: userId.current };
}
