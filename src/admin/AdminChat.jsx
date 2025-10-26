import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../hooks/useChat.js';

export default function AdminChat() {
  const { messages, send, users, connected } = useChat('admin');
  const isAdmin = (localStorage.getItem('lk_role') === 'admin') || import.meta.env.VITE_ADMIN_MODE === 'true';
  const [to, setTo] = useState(null);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const items = useMemo(() => messages.filter(m => m.role==='user' || m.role==='admin' && (!to || m.from===to)), [messages, to]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() || !to) return;
    send({ type: 'chat', role: 'admin', text: text.trim(), to });
    setText('');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin • Chat</h1>
          <Link to="/admin" className="text-neutral-300 underline">Voltar</Link>
        </div>
        {!isAdmin && (
          <div className="rounded-2xl border border-red-600 bg-red-500/10 text-red-300 px-4 py-2 mb-3">Acesso restrito a administradores.</div>
        )}
        <div className={`bg-neutral-800 border border-neutral-700 rounded-3xl p-4 ${!isAdmin?'pointer-events-none opacity-60':''}`}>
          <div className="flex items-center gap-3 mb-3">
            <select value={to||''} onChange={e=>setTo(e.target.value||null)} className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm">
              <option value="">Selecione um usuário</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.id}</option>)}
            </select>
            <span className="text-xs text-neutral-400">{connected?'Conectado':'Desconectado'}</span>
          </div>
          <div className="h-[60vh] overflow-auto no-scrollbar bg-neutral-900 rounded-2xl p-3">
            {items.map((m, i) => (
              <div key={i} className={`flex ${m.role==='admin'?'justify-end':'justify-start'} mb-2`}>
                <div className={`${m.role==='admin'?'bg-emerald-600 text-white':'bg-neutral-800 text-neutral-100'} px-3 py-2 rounded-2xl max-w-[70%]`}>
                  {m.role==='user' && <div className="text-[10px] text-neutral-300">{m.from}</div>}
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="mt-3 flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Mensagem" className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
            <button className="bg-sky-600 px-3 py-2 rounded-xl text-sm">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
