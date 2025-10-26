import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAvisosBadge } from '../hooks/useAvisosBadge.js';

const tabs = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/baby-care', label: 'Baby Care', icon: '👶' },
  { to: '/financeiro', label: 'Financeiro', icon: '💰' },
  { to: '/avisos', label: 'Avisos', icon: '📢' },
  { to: '/cardapio', label: 'Cardápio', icon: '🍽️' },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const newCount = useAvisosBadge(pathname === '/avisos');
  return (
    <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur border-t border-[#EFD179] shadow-lg flex justify-around py-3 rounded-t-3xl z-50">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) => `relative flex flex-col items-center font-semibold text-xs transition ${isActive ? 'text-[#E99A8C]' : 'text-[#78C3C7] hover:text-[#EFD179]'} `}
          end={t.to === '/'}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span>{t.label}</span>
          {t.to === '/avisos' && newCount > 0 && (
            <span className="absolute -top-1 -right-2 text-[10px] bg-[#E99A8C] text-white px-1.5 py-0.5 rounded-full animate-bounce">
              {newCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
