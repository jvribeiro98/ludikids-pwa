import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const USERS_KEY = 'lk_users';
const SESSION_KEY = 'lk_session';

async function sha256(text) {
  try {
    const enc = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', enc);
    const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    return hex;
  } catch {
    return text; // fallback (não seguro, apenas local/dev)
  }
}

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}
function writeUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const register = async ({ name, email, password, studentId }) => {
    const users = readUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('E-mail já cadastrado');
    const passHash = await sha256(password);
    const user = { name, email, passHash, studentId, role: 'responsavel' };
    users.push(user);
    writeUsers(users);
    toast.success('Cadastro realizado');
    return true;
  };

  const login = async ({ email, password }) => {
    const users = readUsers();
    const passHash = await sha256(password);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passHash === passHash);
    if (!user) throw new Error('Credenciais inválidas');
    const s = { email: user.email, name: user.name, studentId: user.studentId, role: user.role || 'responsavel' };
    setSession(s);
    // popular o perfil usado no topo
    localStorage.setItem('lk_user', JSON.stringify({ name: user.name, classroom: 'Turma Arco-Íris', school: 'Ludikids Centro Educacional', photo: '/assets/student.png' }));
    toast.success('Bem-vindo!');
    return true;
  };

  const logout = () => {
    setSession(null);
  };

  const setRole = (role) => {
    setSession(prev => prev ? { ...prev, role } : prev);
    // opcional: refletir no cadastro local do usuário logado (apenas dev)
    try {
      const users = readUsers();
      const idx = users.findIndex(u => u.email === session?.email);
      if (idx >= 0) { users[idx].role = role; writeUsers(users); }
    } catch {}
  };

  const value = useMemo(() => ({ session, isLogged: !!session, register, login, logout, setRole }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
