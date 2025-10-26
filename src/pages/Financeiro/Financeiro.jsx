import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { jsPDF } from 'jspdf';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import FinanceCard from '../../components/FinanceCard.jsx';

const HIST_KEY = 'lk_financeiro_hist';

export default function Financeiro() {
  const [tab, setTab] = useLocalStorage('lk_fin_tab', 'pagamentos');
  const [modo, setModo] = useState(null);
  const [qrPix, setQrPix] = useState('');
  const [hist, setHist] = useLocalStorage(HIST_KEY, [
    { id: 1, tipo: 'PIX', valor: 650, data: '10/10/2025', status: 'Confirmado', desc: 'Mensalidade Outubro' },
    { id: 2, tipo: 'Cartão', valor: 420, data: '05/10/2025', status: 'Pendente', desc: 'Material Didático' },
  ]);
  const [debitos] = useLocalStorage('lk_fin_debitos', [
    { id: 101, data: '05/11/2025', desc: 'Mensalidade Novembro', valor: 650, status: 'Pendente' },
    { id: 102, data: '05/09/2025', desc: 'Mensalidade Setembro', valor: 650, status: 'Vencido' },
  ]);

  const totalPago = useMemo(() => hist.filter(h => h.status === 'Confirmado').reduce((s,h)=>s+Number(h.valor||0),0), [hist]);
  const totalPendente = useMemo(() => hist.filter(h => h.status !== 'Confirmado').reduce((s,h)=>s+Number(h.valor||0),0), [hist]);

  const gerarPix = (valor=0) => {
    const codigo = `00020126330014BR.GOV.BCB.PIX0114pix@ludikids.com5204000053039865406${Number(valor).toFixed(2)}${Date.now()}5802BR5920LUDIKIDS CRECHE6009SAO PAULO62070503***6304ABCD`;
    setQrPix(codigo);
  };

  const confirmarPagamento = (tipo, valor) => {
    const item = { id: Date.now(), tipo, valor: Number(valor), data: new Date().toLocaleDateString('pt-BR'), status: 'Confirmado' };
    setHist([item, ...hist]);
    toast.success('Pagamento registrado');
  };

  const copiarPix = async () => {
    try { await navigator.clipboard.writeText(qrPix); toast('Código PIX copiado', { icon: '📋' }); } catch {}
  };

  const gerarBoletoPDF = (valor=0, desc='Pagamento') => {
    const doc = new jsPDF();
    doc.text('Boleto Simulado - Ludikids', 20, 20);
    doc.text(`Beneficiário: LUDIKIDS CRECHE`, 20, 35);
    doc.text(`Valor: R$ ${Number(valor).toFixed(2)}`, 20, 45);
    doc.text(`Vencimento: ${new Date(Date.now()+7*86400000).toLocaleDateString('pt-BR')}`, 20, 55);
    doc.text(`Referente a: ${desc}`, 20, 65);
    doc.text(`Linha digitável: 00190.00009 01234.567890 12345.678904 5 67890000000000`, 20, 75);
    doc.save('boleto-ludikids.pdf');
    setHist([{ id: Date.now(), tipo: 'Boleto', valor: Number(valor), data: new Date().toLocaleDateString('pt-BR'), status: 'Pendente', desc }, ...hist]);
    toast.success('Boleto gerado');
  };

  // Form states
  const [card, setCard] = useState({ numero: '', nome: '', validade: '', cvv: '', valor: '' });
  const [pixValor, setPixValor] = useState('');

  const onlyNums = (s='') => s.replace(/[^0-9]/g, '');
  const luhnCheck = (num) => {
    let sum = 0; let alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num.charAt(i), 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  };
  const validarCartao = () => {
    const numero = onlyNums(card.numero);
    const validBase = numero.length >= 13 && luhnCheck(numero);
    const validName = card.nome.trim().length >= 3;
    const validExp = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.validade);
    const validCvv = /^\d{3,4}$/.test(card.cvv);
    const v = Number(card.valor);
    const validValor = v > 0 && v < 100000;
    return validBase && validName && validExp && validCvv && validValor;
  };

  const pagarCartao = (e) => {
    e.preventDefault();
    if (!validarCartao()) return toast.error('Dados do cartão inválidos');
    confirmarPagamento('Cartão', card.valor);
    setCard({ numero: '', nome: '', validade: '', cvv: '', valor: '' });
  };

  return (
    <motion.div key="financeiro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 min-h-screen bg-gradient-to-br from-[#FFF6E5] via-[#E3F8FA] to-[#FFE8E1] pb-28">
      <h1 className="text-xl font-bold text-[#E99A8C] text-center mb-6">Financeiro</h1>
      <div className="flex items-center justify-center gap-2 mb-4">
        {['debitos','pagamentos','dividas'].map(k => (
          <button key={k} onClick={()=>setTab(k)} className={`px-3 py-1 rounded-full text-sm ${tab===k?'bg-[#EFD179] text-white':'bg-white text-[#78C3C7] border'}`}>{k==='debitos'?'Débitos':k==='pagamentos'?'Pagamentos':'Dívidas'}</button>
        ))}
      </div>

      {tab==='pagamentos' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button onClick={() => setModo('cartao')} className="bg-gradient-to-br from-[#EFD179] to-[#E99A8C] text-white font-bold rounded-2xl p-5 shadow-md hover:scale-105 transition">💳 Cartão</button>
            <button onClick={() => setModo('boleto')} className="bg-gradient-to-br from-[#A7E0E3] to-[#78C3C7] text-white font-bold rounded-2xl p-5 shadow-md hover:scale-105 transition">🧾 Boleto</button>
            <button onClick={() => { setModo('pix'); gerarPix(pixValor || 0); }} className="bg-gradient-to-br from-[#E99A8C] to-[#EFD179] text-white font-bold rounded-2xl p-5 shadow-md hover:scale-105 transition">⚡ PIX</button>
          </div>

          <AnimatePresence>
            {modo === 'cartao' && (
              <motion.form key="cartao" onSubmit={pagarCartao} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white p-6 rounded-3xl shadow-md border border-[#EFD179] grid sm:grid-cols-2 gap-3">
                <input inputMode="numeric" value={card.numero} onChange={e=>setCard({...card,numero:e.target.value.replace(/[^0-9\s]/g,'')})} placeholder="Número do cartão" className="border rounded-2xl p-2 text-sm" />
                <input value={card.nome} onChange={e=>setCard({...card,nome:e.target.value})} placeholder="Nome impresso" className="border rounded-2xl p-2 text-sm" />
                <input value={card.validade} onChange={e=>setCard({...card,validade:e.target.value})} placeholder="Validade (MM/AA)" className="border rounded-2xl p-2 text-sm" />
                <input inputMode="numeric" value={card.cvv} onChange={e=>setCard({...card,cvv:onlyNums(e.target.value).slice(0,4)})} placeholder="CVV" className="border rounded-2xl p-2 text-sm" />
                <input inputMode="decimal" value={card.valor} onChange={e=>setCard({...card,valor:e.target.value.replace(/[^0-9.,]/g,'').replace(',','.')})} placeholder="Valor" className="border rounded-2xl p-2 text-sm" />
                <div className="sm:col-span-2 flex justify-end">
                  <button className="bg-[#78C3C7] text-white rounded-2xl px-4 py-2">Pagar</button>
                </div>
              </motion.form>
            )}
            {modo === 'pix' && (
              <motion.div key="pix" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white p-6 rounded-3xl shadow-md border border-[#EFD179] text-center space-y-3">
                <div className="flex gap-2 justify-center">
                  <input inputMode="decimal" value={pixValor} onChange={e=>{setPixValor(e.target.value.replace(/[^0-9.,]/g,'').replace(',','.'));}} placeholder="Valor" className="border rounded-2xl p-2 text-sm" />
                  <button onClick={()=>gerarPix(pixValor||0)} className="bg-[#78C3C7] text-white rounded-2xl px-4">Gerar</button>
                </div>
                {qrPix && <div className="flex flex-col items-center gap-3">
                  <QRCode value={qrPix} size={160} />
                  <textarea readOnly value={qrPix} className="w-full text-xs text-gray-600 border border-[#EFD179] rounded-2xl p-2" />
                  <button onClick={copiarPix} className="bg-[#EFD179] text-white rounded-2xl px-4 py-1">Copiar código</button>
                  <button onClick={()=>confirmarPagamento('PIX', pixValor||0)} className="bg-[#E99A8C] text-white rounded-2xl px-4 py-1">Simular confirmação</button>
                </div>}
              </motion.div>
            )}
            {modo === 'boleto' && (
              <motion.div key="boleto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white p-6 rounded-3xl shadow-md border border-[#EFD179] space-y-3">
                {(() => {
                  const pend = debitos.find(d => d.status === 'Pendente') || debitos.find(d => d.status === 'Vencido');
                  if (!pend) return <div className="text-center text-sm text-gray-500">Sem débitos para gerar boleto</div>;
                  return (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-[#78C3C7]">
                        <div className="font-semibold">{pend.desc}</div>
                        <div className="text-xs opacity-80">Data: {pend.data} • Valor: R$ {Number(pend.valor).toFixed(2)}</div>
                      </div>
                      <button onClick={()=>gerarBoletoPDF(pend.valor, pend.desc)} className="bg-[#78C3C7] text-white rounded-2xl px-4 py-2">Gerar Boleto (PDF)</button>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-white rounded-3xl shadow-md border border-[#EFD179] p-6 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#78C3C7] text-lg">Histórico</h2>
              <div className="text-sm">
                <span className="mr-3 text-[#78C3C7]">Pago: <b>R$ {totalPago.toFixed(2)}</b></span>
                <span className="text-[#E99A8C]">Pendente: <b>R$ {totalPendente.toFixed(2)}</b></span>
              </div>
            </div>
            <div className="space-y-2">
              {hist.map((p) => (
                <FinanceCard key={p.id} date={p.data} desc={p.desc || p.tipo} valor={p.valor} status={p.status} />
              ))}
              {hist.length===0 && <div className="text-center text-gray-500 text-sm">Sem pagamentos</div>}
            </div>
          </motion.div>
        </>
      )}

      {tab==='debitos' && (
        <div className="bg-white rounded-3xl shadow-md border border-[#EFD179] p-6">
          <h2 className="font-bold text-[#78C3C7] text-lg mb-3">Débitos</h2>
          <div className="space-y-2">
            {debitos.filter(d=>d.status!=='Vencido').map(d => (
              <FinanceCard key={d.id} date={d.data} desc={d.desc} valor={d.valor} status={d.status} />
            ))}
            {debitos.filter(d=>d.status!=='Vencido').length===0 && <div className="text-center text-sm text-gray-500">Sem dados disponíveis</div>}
          </div>
        </div>
      )}

      {tab==='dividas' && (
        <div className="bg-white rounded-3xl shadow-md border border-[#EFD179] p-6">
          <h2 className="font-bold text-[#78C3C7] text-lg mb-3">Dívidas</h2>
          <div className="space-y-2">
            {debitos.filter(d=>d.status==='Vencido').map(d => (
              <FinanceCard key={d.id} date={d.data} desc={d.desc} valor={d.valor} status={d.status} />
            ))}
            {debitos.filter(d=>d.status==='Vencido').length===0 && <div className="text-center text-sm text-gray-500">Sem dados disponíveis</div>}
          </div>
        </div>
      )}
    </motion.div>
  );
}

