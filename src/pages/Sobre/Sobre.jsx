import React from 'react';
import { motion } from 'framer-motion';

export default function Sobre(){
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 min-h-screen bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1] pb-28 text-center text-[#78C3C7]">
      <h1 className="text-xl font-bold mb-2">Sobre</h1>
      <p className="text-sm max-w-2xl mx-auto">Ludikids App — PWA moderno para comunicação escolar. Desenvolvido com React, Tailwind, Framer Motion. Pronto para integração com Django.</p>
    </motion.div>
  );
}

