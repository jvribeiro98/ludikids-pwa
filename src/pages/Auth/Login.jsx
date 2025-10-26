import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();
  const { state } = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      nav(state?.from || '/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Erro ao entrar');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1]">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-[#EFD179]">
        <div className="text-center mb-4">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="logo" className="w-14 h-14 mx-auto mb-2" />
          <h1 className="text-[#78C3C7] font-bold text-xl">Entrar</h1>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" placeholder="E-mail" className="w-full border rounded-2xl p-2 text-sm" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input type="password" placeholder="Senha" className="w-full border rounded-2xl p-2 text-sm" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <button className="w-full bg-[#78C3C7] text-white rounded-2xl p-2">Entrar</button>
        </form>
        <div className="text-center text-sm text-[#78C3C7] mt-3">
          Não tem conta? <Link to="/cadastro" className="text-[#E99A8C] font-semibold">Cadastre-se</Link>
        </div>
      </div>
    </motion.div>
  );
}

