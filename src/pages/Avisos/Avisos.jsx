import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

const KEY = 'lk_avisos';

export default function Avisos() {
  const [avisos] = useLocalStorage(KEY, [
    { id: 1, title: 'Material de Arte', image: '', autor: 'Coordenação', texto: 'Trazer o material de arte amanhã 🎨', createdAt: Date.now() - 86400000 },
    { id: 2, title: 'Passeio ao Parque', image: '', autor: 'Coordenação', texto: 'Sexta-feira teremos passeio. Enviar autorização assinada.', createdAt: Date.now() - 3600_000 }
  ]);
  const [filter, setFilter] = useState('');
  const [likes, setLikes] = useLocalStorage('lk_avisos_likes', {});
  const [acks, setAcks] = useLocalStorage('lk_avisos_acks', {});
  const [confirmId, setConfirmId] = useState(null);

  const list = useMemo(() => (avisos||[])
    .filter(a => a?.approved || a?.autor === 'Coordenação')
    .filter(a => {
      const t = `${a.title||''} ${a.texto||''}`.toLowerCase();
      return t.includes(filter.toLowerCase());
    })
  , [avisos, filter]);

  const toggleLike = (id) => setLikes({ ...likes, [id]: !likes[id] });
  const confirmAck = () => { if (confirmId){ setAcks({ ...acks, [confirmId]: true }); toast.success('Marcado como ciente'); setConfirmId(null);} };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-[#FFE8E1] pb-28">
      <h1 className="text-xl font-bold text-[#E99A8C] text-center mb-4">Avisos</h1>
      <div className="mb-3">
        <input value={filter} onChange={(e)=>setFilter(e.target.value)} placeholder="Pesquisar avisos..." className="w-full border rounded-2xl p-2 text-sm" />
      </div>
      <div className="space-y-4">
        {list.map((a) => (
          <div key={a.id} className={`p-4 rounded-3xl shadow-md bg-white text-[#78C3C7] border border-[#EFD179]`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#E99A8C]">{a.title || 'Aviso'}</p>
                <div className="text-xs text-[#78C3C7] opacity-80">{new Date(a.createdAt).toLocaleString('pt-BR')}</div>
              </div>
              <div className="text-xs text-[#78C3C7]">{a.autor}</div>
            </div>
            {a.image && <img src={a.image} alt="" className="w-full h-36 object-cover rounded-2xl mt-2" />}
            <p className="mt-2">{a.texto}</p>
            <div className="mt-3 flex items-center justify-end gap-3">
              <button onClick={()=>toggleLike(a.id)} className={`px-3 py-1 rounded-full text-sm border ${likes[a.id]?'bg-[#EFD179] text-white border-[#EFD179]':'text-[#EFD179] border-[#EFD179]'}`}>❤️ {likes[a.id] ? 'Curtido' : 'Curtir'}</button>
              <button onClick={()=>setConfirmId(a.id)} className={`px-3 py-1 rounded-full text-sm border ${acks[a.id]?'bg-[#78C3C7] text-white border-[#78C3C7]':'text-[#78C3C7] border-[#78C3C7]'}`}>{acks[a.id]?'Ciente ✅':'Ciente'}</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="text-center text-sm text-gray-500">Sem avisos</div>}
      </div>
      <div className="mt-6 text-center text-xs text-[#78C3C7]">Avisos são gerenciados pelo Admin.</div>

      {confirmId && (
        <div className="fixed inset-0 bg-black/20 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-[420px] p-4 border border-[#EFD179]">
            <div className="font-bold text-[#78C3C7] mb-2">Confirmar ciência</div>
            <p className="text-sm text-[#78C3C7] mb-3">Deseja marcar este aviso como "Ciente"?</p>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded-xl border text-[#78C3C7]" onClick={()=>setConfirmId(null)}>Cancelar</button>
              <button className="px-3 py-1 rounded-xl bg-[#78C3C7] text-white" onClick={confirmAck}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
