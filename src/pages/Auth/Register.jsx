import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', studentId: '' });
  const nav = useNavigate();

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) throw new Error('E-mail inválido');
    if (form.password.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');
    if (form.password !== form.confirm) throw new Error('As senhas não conferem');
    if (!form.studentId.trim()) throw new Error('Número de matrícula é obrigatório');
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      validate();
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, studentId: form.studentId.trim() });
      nav('/login');
    } catch (err) {
      toast.error(err.message || 'Erro ao cadastrar');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1]">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-[#EFD179]">
        <div className="text-center mb-4">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="logo" className="w-14 h-14 mx-auto mb-2" />
          <h1 className="text-[#78C3C7] font-bold text-xl">Cadastro</h1>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input placeholder="Nome do responsável" className="w-full border rounded-2xl p-2 text-sm" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input type="email" placeholder="E-mail" className="w-full border rounded-2xl p-2 text-sm" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          <input type="password" placeholder="Senha" className="w-full border rounded-2xl p-2 text-sm" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          <input type="password" placeholder="Confirme a senha" className="w-full border rounded-2xl p-2 text-sm" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required />
          <input placeholder="Número de matrícula do aluno" className="w-full border rounded-2xl p-2 text-sm" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} required />
          <button className="w-full bg-[#E99A8C] text-white rounded-2xl p-2">Cadastrar</button>
        </form>
        <div className="text-center text-sm text-[#78C3C7] mt-3">
          Já tem conta? <Link to="/login" className="text-[#E99A8C] font-semibold">Entrar</Link>
        </div>
      </div>
    </motion.div>
  );
}

