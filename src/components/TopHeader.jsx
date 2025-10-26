import React from 'react';

export default function TopHeader({ student }) {
  return (
    <div className="w-full px-5 py-5 bg-gradient-to-r from-[#78C3C7] via-[#EFD179] to-[#E99A8C] rounded-3xl shadow-md text-white mb-5">
      <div className="flex items-center gap-3">
        <img src={student?.photo || `${import.meta.env.BASE_URL}assets/student.png`} alt="Aluno" className="w-12 h-12 rounded-2xl object-cover bg-white/20" />
        <div className="flex-1">
          <div className="font-bold text-lg leading-tight">{student?.name || 'Aluno(a) Ludikids'}</div>
          <div className="text-xs opacity-90">{student?.classroom || 'Turma Arco-Íris'} • {student?.school || 'Ludikids Centro Educacional'}</div>
        </div>
        <img src={`${import.meta.env.BASE_URL}assets/ludikids-logo.png`} alt="Ludikids" className="w-10 h-10" />
      </div>
    </div>
  );
}
