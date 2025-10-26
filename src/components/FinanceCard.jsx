import React from 'react';

const colorByStatus = (s) => {
  if (s === 'Pago' || s === 'Confirmado') return 'bg-green-500/10 text-green-700 border-green-300';
  if (s === 'Pendente') return 'bg-yellow-500/10 text-yellow-700 border-yellow-300';
  if (s === 'Vencido') return 'bg-red-500/10 text-red-700 border-red-300';
  return 'bg-[#E3F8FA] text-[#78C3C7] border-[#A7E0E3]';
};

export default function FinanceCard({ date, desc, valor, status }) {
  return (
    <div className={`rounded-2xl p-3 border ${colorByStatus(status)} flex items-center justify-between`}> 
      <div>
        <div className="text-xs opacity-80">{date}</div>
        <div className="font-semibold">{desc}</div>
      </div>
        <div className="text-right">
          <div className="font-bold">R$ {Number(valor).toFixed(2)}</div>
          <div className="text-xs opacity-80">{status}</div>
        </div>
    </div>
  );
}

