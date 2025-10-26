import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

export default function Tarefas() {
  const [tarefas] = useLocalStorage('lk_tarefas', [
    { id: 1, texto: 'Lição de matemática 📘', done: false, due: null }
  ]);
  // Overlay de conclusão por usuário (não edita a tarefa base)
  const [userState, setUserState] = useLocalStorage('lk_tarefas_user_state', {});
  const toggle = (id) => setUserState({ ...userState, [id]: !userState[id] });
  const isDone = (t) => userState[t.id] || false;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-[#E3F8FA] pb-28">
      <h1 className="text-xl font-bold text-[#78C3C7] mb-4 text-center">Tarefas de Casa</h1>
      <div className="space-y-3">
        <AnimatePresence>
          {tarefas.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white p-4 rounded-3xl shadow-md border border-[#A7E0E3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(t.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDone(t) ? 'border-[#78C3C7] bg-[#78C3C7] text-white' : 'border-[#A7E0E3]'}`}>
                  {isDone(t) && <span>✓</span>}
                </button>
                <div>
                  <div className={`font-medium ${isDone(t) ? 'line-through text-gray-400' : 'text-[#78C3C7]'}`}>{t.texto}</div>
                  {t.due && <div className="text-xs text-gray-500">Entrega: {new Date(t.due).toLocaleDateString('pt-BR')}</div>}
                </div>
              </div>
              <div className="text-xs text-gray-400">Somente admin pode editar</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tarefas.length === 0 && <div className="text-center text-sm text-gray-500">Sem tarefas</div>}
      </div>
      <div className="mt-6 text-center text-xs text-[#78C3C7]">Tarefas são definidas pelo Admin. Você pode marcar como concluídas.</div>
    </motion.div>
  );
}
