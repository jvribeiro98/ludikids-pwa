import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

const defaultMenu = {
  periodo: 'Manhã',
  dados: {
    Manhã: {
      Seg: '🍎 Iogurte com frutas e granola',
      Ter: '🥪 Sanduíche natural e suco',
      Qua: '🥗 Salada de frutas e biscoitos',
      Qui: '🍞 Pão com queijo e leite',
      Sex: '🍌 Banana com aveia e suco',
    },
    Tarde: {
      Seg: '🍝 Macarronada com carne moída',
      Ter: '🍗 Frango grelhado, arroz e salada',
      Qua: '🐟 Peixe assado, arroz e legumes',
      Qui: '🥔 Purê com frango desfiado',
      Sex: '🥦 Lasanha de legumes e frutas',
    },
    Integral: {
      Seg: '🍳 Omelete, arroz e feijão',
      Ter: '🍲 Sopa de legumes com frango',
      Qua: '🍖 Carne cozida e salada',
      Qui: '🍛 Risoto de frango com legumes',
      Sex: '🥙 Wrap integral e frutas',
    },
  }
};

const DIAS = ['Seg','Ter','Qua','Qui','Sex'];
const PERIODOS = ['Manhã','Tarde','Integral'];

export default function Cardapio() {
  const [menu, setMenu] = useLocalStorage('lk_cardapio', defaultMenu);
  const [tabDia, setTabDia] = useState('Seg');
  const [periodo, setPeriodo] = useState(menu.periodo || 'Manhã');

  const prato = useMemo(() => menu.dados?.[periodo]?.[tabDia] || 'Sem informação', [menu, periodo, tabDia]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-[#FFF6E5] pb-28">
      <h1 className="text-xl font-bold text-[#EFD179] mb-4 text-center">Cardápio</h1>
      <p className="text-center text-sm text-[#78C3C7] mb-3">Na hora do almoço e do lanche priorizamos refeições saudáveis e balanceadas.</p>
      <div className="bg-white rounded-3xl shadow-md border border-[#EFD179]">
        <div className="flex items-center justify-center gap-2 p-3 border-b">
          {PERIODOS.map(p => (
            <button key={p} onClick={()=>setPeriodo(p)} className={`px-3 py-1 rounded-full text-sm ${periodo===p?'bg-[#EFD179] text-white':'bg-[#E3F8FA] text-[#78C3C7]'}`}>{p}</button>
          ))}
        </div>
        <div className="flex items-center justify-around p-3 border-b">
          {DIAS.map(d => (
            <button key={d} onClick={()=>setTabDia(d)} className={`px-3 py-1 rounded-full text-sm ${tabDia===d?'bg-[#E99A8C] text-white':'bg-white text-[#78C3C7] border'}`}>{d}</button>
          ))}
        </div>
        <div className="p-5 text-center">
          <div className="text-[#E99A8C] font-bold mb-2">{periodo} - {tabDia}</div>
          <p className="text-[#78C3C7]">{prato}</p>
        </div>
        {menu?.image && (
          <div className="p-4">
            <img src={menu.image} alt="Cardápio da semana" className="w-full rounded-2xl object-cover" />
          </div>
        )}
        <div className="p-4 text-center text-xs text-gray-500 border-t">{menu?.dados? 'Somente leitura • Gerenciado pelo Admin. Dados locais com preparo para API.' : 'Ainda não há dados disponíveis'}</div>
      </div>
    </motion.div>
  );
}
