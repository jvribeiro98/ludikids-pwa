import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useScrollRestoration } from './hooks/useScrollRestoration.js';
import NavBar from './components/NavBar.jsx';
import PWAUpdate from './components/PWAUpdate.jsx';

export default function AppLayout() {
  const location = useLocation();
  useScrollRestoration(location.pathname);
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PWAUpdate />
      <Outlet />
      <NavBar />
    </div>
  );
}

