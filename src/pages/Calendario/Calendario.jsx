import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

const TYPE_COLORS = { festa: '#EFD179', reuniao: '#78C3C7', tarefa: '#E99A8C' };

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  const matrix = [];
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      week.push(date);
    }
    matrix.push(week);
  }
  return matrix;
}

export default function Calendario() {
  const [events] = useLocalStorage('lk_events', []);
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const matrix = useMemo(() => getMonthMatrix(ym.y, ym.m), [ym]);
  const [modal, setModal] = useState({ open: false, date: null });

  const listFor = (d) => events.filter(e => e.date === d.toISOString().slice(0,10));

  const monthLabel = new Date(ym.y, ym.m).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-[#FFF6E5] pb-28">
      <h1 className="text-xl font-bold text-[#78C3C7] mb-4 text-center">Calendário Escolar</h1>
      <div className="bg-white p-4 rounded-3xl shadow-md">
        <div className="flex items-center justify-between mb-3">
          <button className="text-[#78C3C7]" onClick={() => setYm(({ y, m }) => m===0?{y:y-1,m:11}:{y,m:m-1})}>◀</button>
          <span className="font-semibold text-[#E99A8C]">{monthLabel}</span>
          <button className="text-[#78C3C7]" onClick={() => setYm(({ y, m }) => m===11?{y:y+1,m:0}:{y,m:m+1})}>▶</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#78C3C7] mb-2">
          {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => <div key={d} className="font-semibold">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {matrix.flat().map((d, i) => {
            const inMonth = d.getMonth() === ym.m;
            const items = listFor(d);
            return (
              <div key={i} className={`p-2 rounded-xl text-center cursor-pointer border ${inMonth?'bg-[#E3F8FA]':'bg-gray-50 text-gray-400'} border-[#A7E0E3]`} onClick={() => setModal({ open: true, date: d })}>
                <div className="text-sm text-[#78C3C7]">{d.getDate()}</div>
                <div className="flex gap-1 justify-center mt-1">
                  {items.slice(0,3).map(ev => (
                    <span key={ev.id} title={ev.title} className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[ev.type] }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/20 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-[520px] p-4 border border-[#EFD179]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[#78C3C7]">{modal.date.toLocaleDateString('pt-BR')}</h3>
              <button className="text-[#E99A8C]" onClick={() => setModal({ open: false, date: null })}>Fechar</button>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-[#78C3C7]">Somente leitura • Gerenciado pelo Admin</div>
              <div className="mt-2 space-y-2 max-h-60 overflow-auto no-scrollbar">
                {listFor(modal.date).map(ev => (
                  <div key={ev.id} className="flex items-center justify-between bg-[#E3F8FA] p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{background:TYPE_COLORS[ev.type]}}></span>
                      <span className="text-sm text-[#78C3C7]">{ev.title}</span>
                    </div>
                  </div>
                ))}
                {listFor(modal.date).length === 0 && (
                  <div className="text-center text-sm text-gray-500">Sem eventos</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

