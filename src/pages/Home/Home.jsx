import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TopHeader from '../../components/TopHeader.jsx';
import CardSection from '../../components/CardSection.jsx';
import IABox from '../../components/IABox.jsx';
import useUser from '../../hooks/useUser.js';

function Card({ to, icon, label, from, toColor }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} style={{ background: `linear-gradient(135deg, ${from}, ${toColor})` }} className="rounded-3xl text-white font-semibold text-sm shadow-md">
      <Link to={to} className="block p-5 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { user, name } = useUser();
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 min-h-screen bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1] pb-28">
      <TopHeader student={user} />

      <IABox baseText={`Olá, ${name}! Sou Lúdica, sua assistente. Separei abaixo os atalhos do dia para facilitar sua rotina.`} />

      <CardSection title="Financeiro">
        <Card to="/financeiro" icon="💳" label="Financeiro" from="#EFD179" toColor="#E99A8C" />
        <Card to="/financeiro" icon="🧾" label="Boletos" from="#A7E0E3" toColor="#78C3C7" />
        <Card to="/financeiro" icon="💡" label="Ofertas" from="#E99A8C" toColor="#EFD179" />
      </CardSection>

      <CardSection title="Conteúdo Acadêmico">
        <Card to="/tarefas" icon="📝" label="Tarefa de Casa" from="#E99A8C" toColor="#EFD179" />
        <Card to="/horario" icon="🕒" label="Horário" from="#A7E0E3" toColor="#EFD179" />
      </CardSection>

      <CardSection title="Cantina">
        <Card to="/cardapio" icon="🍽️" label="Cardápio" from="#A7E0E3" toColor="#EFD179" />
      </CardSection>

      <CardSection title="Gestão de Alunos">
        <Card to="/baby-care" icon="👶" label="Baby Care" from="#EFD179" toColor="#E99A8C" />
      </CardSection>

      <CardSection title="Comunicação">
        <Card to="/avisos" icon="📢" label="Avisos" from="#EFD179" toColor="#E99A8C" />
        <Card to="/galeria" icon="📸" label="Galeria" from="#E3F8FA" toColor="#A7E0E3" />
        <Card to="/calendario" icon="📅" label="Calendário" from="#A7E0E3" toColor="#78C3C7" />
      </CardSection>

      <CardSection title="Configurações">
        <Card to="/foto" icon="🖼️" label="Foto" from="#E3F8FA" toColor="#FFF6E5" />
        <Card to="/sobre" icon="ℹ️" label="Sobre" from="#78C3C7" toColor="#A7E0E3" />
      </CardSection>
    </motion.div>
  );
}
