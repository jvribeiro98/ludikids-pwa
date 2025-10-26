import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const seed = [
  { id: 1, type: 'image', src: '/assets/gallery1.jpg', alt: 'Atividade 1' },
  { id: 2, type: 'image', src: '/assets/gallery2.jpg', alt: 'Atividade 2' },
  { id: 3, type: 'image', src: '/assets/gallery3.jpg', alt: 'Atividade 3' },
];

export default function Galeria(){
  const [items] = useState(seed);
  const [idx, setIdx] = useState(-1);
  const current = useMemo(() => idx>=0?items[idx]:null, [idx, items]);
  const hasAny = items && items.length>0;
  const next = () => setIdx((i)=> i<items.length-1 ? i+1 : 0);
  const prev = () => setIdx((i)=> i>0 ? i-1 : items.length-1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1] pb-28">
      <h1 className="text-xl font-bold text-[#78C3C7] text-center mb-4">Galeria</h1>
      {!hasAny && <div className="text-center text-sm text-gray-500">Ainda não há dados disponíveis</div>}
      {hasAny && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {items.map((it,i)=>(
            <button key={it.id} onClick={()=>setIdx(i)} className="aspect-square rounded-2xl overflow-hidden bg-[#E3F8FA]">
              {it.src ? (<img src={it.src} alt={it.alt} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-3xl">📷</div>)}
            </button>
          ))}
        </div>
      )}

      {current && (
        <div className="fixed inset-0 bg-[#78C3C7]/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-[92%] sm:w-[600px] bg-white rounded-3xl overflow-hidden">
            <img src={current.src} alt={current.alt} className="w-full h-[60vh] object-contain bg-black/5" />
            <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-1" onClick={prev}>◀</button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-1" onClick={next}>▶</button>
            <button className="absolute right-3 top-3 bg-white/90 rounded-full px-3 py-1" onClick={()=>setIdx(-1)}>Fechar</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

