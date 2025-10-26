import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../hooks/useChat.js';
import useOnlineStatus from '../hooks/useOnlineStatus.js';

export default function Chat() {
  const { messages, send, connected, userId } = useChat('user');
  const [text, setText] = useState('');
  const online = useOnlineStatus();
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const items = useMemo(() => messages.filter(m => ['user','admin'].includes(m.role)), [messages]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    send({ type: 'chat', role: 'user', text: text.trim(), userId });
    setText('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1] pb-28">
      <h1 className="text-xl font-bold text-[#78C3C7] text-center mb-3">Chat com a Administração</h1>
      <div className="text-center text-xs mb-3 text-[#78C3C7]">{online ? 'Online' : 'Offline'} • {connected ? 'Conectado' : 'Desconectado'}</div>
      <div className="bg-white rounded-3xl shadow-md border border-[#EFD179] p-4 h-[60vh] overflow-auto no-scrollbar">
        {items.map((m, i) => (
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'} mb-2`}>
            <div className={`${m.role==='user'?'bg-[#78C3C7] text-white':'bg-[#E3F8FA] text-[#78C3C7]'} px-3 py-2 rounded-2xl max-w-[70%]`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Escreva sua mensagem..." className="flex-1 border rounded-2xl p-2 text-sm" />
        <button className="bg-[#E99A8C] text-white rounded-2xl px-4">Enviar</button>
      </form>
    </motion.div>
  );
}

