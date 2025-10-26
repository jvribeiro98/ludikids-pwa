import { useEffect, useMemo } from 'react';

const KEY = 'lk_avisos';
const SEEN_KEY = 'lk_avisos_seen_at';

export function useAvisosBadge(markAsSeen) {
  const list = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }, []);
  const lastSeen = useMemo(() => Number(localStorage.getItem(SEEN_KEY) || 0), []);
  const count = list.filter(a => a.createdAt && a.createdAt > lastSeen).length;

  useEffect(() => {
    if (markAsSeen) localStorage.setItem(SEEN_KEY, String(Date.now()));
  }, [markAsSeen]);

  return count;
}

