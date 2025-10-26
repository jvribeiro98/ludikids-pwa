import React, { useMemo } from 'react';
import useTypewriter from '../hooks/useTypewriter.js';

export default function IABox({ name='Lúdica', baseText }) {
  const text = useMemo(() => baseText || `Prezada família, sou ${name}, sua assistente. Estou aqui para ajudar no acompanhamento diário do aluno com orientações, lembretes e recados pedagógicos.`, [baseText, name]);
  const shown = useTypewriter(text, 18);
  return (
    <div className="p-4 rounded-3xl bg-gradient-to-br from-[#E3F8FA] to-[#FFF6E5] border border-[#A7E0E3] shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-[#78C3C7] text-white flex items-center justify-center text-xl">🤖</div>
        <div className="font-bold text-[#78C3C7]">Assistente {name}</div>
      </div>
      <p className="text-sm text-[#78C3C7]">{shown}</p>
    </div>
  );
}
