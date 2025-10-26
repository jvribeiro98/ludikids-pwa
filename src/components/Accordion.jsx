import React, { useState } from 'react';

export default function Accordion({ title, children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[#EFD179] bg-white">
      <button onClick={()=>setOpen(!open)} className="w-full text-left px-4 py-3 font-semibold text-[#78C3C7] flex justify-between items-center">
        {title}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4 text-sm text-[#78C3C7]">{children}</div>}
    </div>
  );
}

