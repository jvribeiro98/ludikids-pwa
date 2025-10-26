import { useEffect, useState } from 'react';

export default function useTypewriter(text, speed=24) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0; setOut('');
    const id = setInterval(() => {
      i++; setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 1000/ speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

