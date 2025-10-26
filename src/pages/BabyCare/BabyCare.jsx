import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import IABox from '../../components/IABox.jsx';
import Accordion from '../../components/Accordion.jsx';

const ICONS = [
  { key: 'banho', label: 'Banho', emoji: '🛁' },
  { key: 'sono', label: 'Sono', emoji: '😴' },
  { key: 'alimentacao', label: 'Alimentação', emoji: '🍽️' },
  { key: 'fralda', label: 'Fralda', emoji: '🧷' },
];

function storageKey(dateStr){ return `lk_babycare_${dateStr}`; }

export default function BabyCare(){
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [open, setOpen] = useState(null);

  const saved = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(storageKey(date))) || { notes:{} }; } catch { return { notes:{} }; }
  }, [date]);

  const [notes, setNotes] = useState({
    obs: saved.notes?.obs || '',
    diff: saved.notes?.diff || '',
    like: saved.notes?.like || '',
    dislike: saved.notes?.dislike || '',
  });

  const save = () => {
    const data = { date, notes, icons: saved.icons || [] };
    localStorage.setItem(storageKey(date), JSON.stringify(data));
  };

  const toggleIcon = (key) => {
    const cur = new Set(saved.icons || []);
    if (cur.has(key)) cur.delete(key); else cur.add(key);
    const data = { ...saved, date, icons: Array.from(cur), notes };
    localStorage.setItem(storageKey(date), JSON.stringify(data));
    setOpen({ key, label: ICONS.find(i=>i.key===key).label });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1] pb-28">
      <h1 className="text-xl font-bold text-[#78C3C7] text-center mb-3">Baby Care</h1>
      <div className="flex items-center justify-center mb-3">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded-2xl p-2 text-sm" />
      </div>

      <IABox baseText="Prezada família, sou Vicky. Hoje vou ajudar a registrar o dia do seu pequeno." />

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
        {ICONS.map(i => {
          const active = (saved.icons||[]).includes(i.key);
          return (
            <button key={i.key} onClick={()=>toggleIcon(i.key)} className={`rounded-2xl p-4 text-center border transition ${active?'bg-[#EFD179] text-white border-[#EFD179]':'bg-white text-[#78C3C7] border-[#A7E0E3]'}`}>
              <div className="text-2xl">{i.emoji}</div>
              <div className="text-xs font-semibold">{i.label}</div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 mt-4">
        <Accordion title="Observação do professor(a)" defaultOpen>
          <textarea className="w-full border rounded-2xl p-2 text-sm" rows={3} value={notes.obs} onChange={e=>setNotes({...notes,obs:e.target.value})} />
        </Accordion>
        <Accordion title="Ocorreu algo diferente na rotina?">
          <textarea className="w-full border rounded-2xl p-2 text-sm" rows={3} value={notes.diff} onChange={e=>setNotes({...notes,diff:e.target.value})} />
        </Accordion>
        <Accordion title="O que o aluno gosta">
          <textarea className="w-full border rounded-2xl p-2 text-sm" rows={3} value={notes.like} onChange={e=>setNotes({...notes,like:e.target.value})} />
        </Accordion>
        <Accordion title="O que o aluno NÃO gosta">
          <textarea className="w-full border rounded-2xl p-2 text-sm" rows={3} value={notes.dislike} onChange={e=>setNotes({...notes,dislike:e.target.value})} />
        </Accordion>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={save} className="bg-[#78C3C7] text-white rounded-2xl px-4 py-2">Salvar</button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/20 flex items-end sm:items-center justify-center z-50" onClick={()=>setOpen(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-[420px] p-6 border border-[#EFD179] text-center">
            <div className="text-5xl mb-2">{ICONS.find(i=>i.key===open.key)?.emoji}</div>
            <div className="font-bold text-[#78C3C7]">{open.label}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
