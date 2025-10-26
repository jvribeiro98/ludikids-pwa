import React, { Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import './index.css';
import AppLayout from './App.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const Home = React.lazy(() => import('./pages/Home/Home.jsx'));
const Calendario = React.lazy(() => import('./pages/Calendario/Calendario.jsx'));
const Avisos = React.lazy(() => import('./pages/Avisos/Avisos.jsx'));
const Tarefas = React.lazy(() => import('./pages/Tarefas/Tarefas.jsx'));
const Cardapio = React.lazy(() => import('./pages/Cardapio/Cardapio.jsx'));
const Financeiro = React.lazy(() => import('./pages/Financeiro/Financeiro.jsx'));
const BabyCare = React.lazy(() => import('./pages/BabyCare/BabyCare.jsx'));
const Galeria = React.lazy(() => import('./pages/Galeria/Galeria.jsx'));
const Horario = React.lazy(() => import('./pages/Horario/Horario.jsx'));
const Foto = React.lazy(() => import('./pages/Foto/Foto.jsx'));
const Sobre = React.lazy(() => import('./pages/Sobre/Sobre.jsx'));
const Chat = React.lazy(() => import('./pages/Chat.jsx'));
import AdminChat from './admin/AdminChat.jsx';

function RouteTransitions() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="min-h-screen"
      >
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-ludikids-teal">Carregando...</div>}>
          <Routes location={location}>
            <Route element={<AppLayout />}> 
              <Route index element={<Home />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/avisos" element={<Avisos />} />
              <Route path="/tarefas" element={<Tarefas />} />
              <Route path="/cardapio" element={<Cardapio />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/baby-care" element={<BabyCare />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/horario" element={<Horario />} />
              <Route path="/foto" element={<Foto />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/chat" element={<AdminChat />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function RootApp() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: 16, background: '#fff', color: '#333', boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }
      }} />
      {!ready ? (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1]">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Ludikids"
            className="w-28 h-28 mb-4 animate-pulse-float"
            onError={(e)=>{ e.currentTarget.src = `${import.meta.env.BASE_URL}assets/ludikids-logo.png`; }}
          />
          <p className="text-ludikids-teal font-semibold">Carregando...</p>
        </div>
      ) : (
        <RouteTransitions />
      )}
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </React.StrictMode>
);
