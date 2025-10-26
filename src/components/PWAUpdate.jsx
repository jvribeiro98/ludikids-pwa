import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white shadow-xl rounded-2xl border border-[#EFD179] px-4 py-2 text-sm flex items-center gap-3">
        <span className="text-[#78C3C7]">
          {offlineReady ? 'App pronto para uso offline' : 'Nova versão disponível'}
        </span>
        {needRefresh && (
          <button
            className="bg-[#E99A8C] text-white px-3 py-1 rounded-xl"
            onClick={() => updateServiceWorker(true)}
          >
            Atualizar
          </button>
        )}
        <button
          className="text-[#78C3C7]"
          onClick={() => { setNeedRefresh(false); setOfflineReady(false); }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

