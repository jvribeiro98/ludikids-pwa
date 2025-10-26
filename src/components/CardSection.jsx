import React from 'react';

export default function CardSection({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-[#78C3C7] font-bold mb-2 px-1">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {children}
      </div>
    </section>
  );
}

