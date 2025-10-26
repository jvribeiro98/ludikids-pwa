import { useEffect, useRef } from 'react';

const positions = new Map();

export function useScrollRestoration(key = 'root') {
  const prev = useRef(positions.get(key) || 0);

  useEffect(() => {
    // restore
    requestAnimationFrame(() => window.scrollTo({ top: prev.current, behavior: 'instant' }));
    const onScroll = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key]);
}

