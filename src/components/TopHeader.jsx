import React from 'react';

export default function TopHeader({ student }) {
  return (
    <div className="w-full px-5 py-5 bg-gradient-to-r from-[#78C3C7] via-[#EFD179] to-[#E99A8C] rounded-3xl shadow-md text-white mb-5">
      <div className="flex items-center gap-3">
        <img
          src={student?.photo || `${import.meta.env.BASE_URL}assets/student.png`}
          alt="Aluno"
          className="w-12 h-12 rounded-2xl object-cover bg-white/20"
          onError={(e)=>{ e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect width=%2248%22 height=%2248%22 rx=%228%22 fill=%22%23E3F8FA%22/><text x=%2224%22 y=%2230%22 font-size=%2210%22 text-anchor=%22middle%22 fill=%22%2378C3C7%22>Aluno</text></svg>'; }}
        />
        <div className="flex-1">
          <div className="font-bold text-lg leading-tight">{student?.name || 'Aluno(a) Ludikids'}</div>
          <div className="text-xs opacity-90">{student?.classroom || 'Turma Arco-Íris'} • {student?.school || 'Ludikids Centro Educacional'}</div>
        </div>
        <img
          src={`${import.meta.env.BASE_URL}assets/ludikids-logo.png`}
          alt="Ludikids"
          className="w-10 h-10"
          onError={(e)=>{ e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 rx=%228%22 fill=%22%23EFD179%22/><text x=%2220%22 y=%2226%22 font-size=%2210%22 text-anchor=%22middle%22 fill=%22white%22>LK</text></svg>'; }}
        />
      </div>
    </div>
  );
}
