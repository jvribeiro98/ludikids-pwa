import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

// Base simples de usuário vinda do "login":
// localStorage.lk_user = { name, classroom, school, photo }
export default function useUser() {
  const [user, setUser] = useLocalStorage('lk_user', {
    name: 'Aluno(a) Ludikids',
    classroom: 'Turma Arco-Íris',
    school: 'Ludikids Centro Educacional',
    photo: '/assets/student.png',
  });
  const name = useMemo(() => user?.name || 'Aluno(a)', [user]);
  return { user, setUser, name };
}

