import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import useOnlineStatus from '../hooks/useOnlineStatus.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Section = ({ title, children }) => (
  <div className="bg-neutral-900/60 border border-neutral-700 rounded-3xl p-5 shadow-xl">
    <h3 className="text-neutral-100 font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default function AdminDashboard() {
  const { session, setRole } = useAuth() || {};
  const [alunos, setAlunos] = useLocalStorage('lk_admin_alunos', []);
  const [avisos, setAvisos] = useLocalStorage('lk_avisos', []);
  const [cardapio, setCardapio] = useLocalStorage('lk_cardapio', { periodo:'Manhã', dados:{} });
  const [hist, setHist] = useLocalStorage('lk_financeiro_hist', []);
  const [events, setEvents] = useLocalStorage('lk_events', []);
  const [tarefas, setTarefas] = useLocalStorage('lk_tarefas', []);
  const [group, setGroup] = useLocalStorage('lk_admin_group', 'professores');
  const online = useOnlineStatus();

  useEffect(() => { if (!online) toast('Você está offline. Ações serão salvas localmente.', { icon: '📴' }); }, [online]);

  const isAdmin = (localStorage.getItem('lk_role') === 'admin') || import.meta.env.VITE_ADMIN_MODE === 'true' || (session?.role === 'coordenacao' || session?.role === 'professor');
  const isProf = group === 'professores';
  const isCoord = group === 'coordenacao';

  const [novoAluno, setNovoAluno] = useState({ nome: '', turma: '' });
  const addAluno = () => { if(!novoAluno.nome) return; setAlunos([...alunos, { id: Date.now(), ...novoAluno }]); setNovoAluno({ nome:'', turma:'' }); };

  const [dia, setDia] = useState('Seg');
  const [periodo, setPeriodo] = useState('Manhã');
  const [texto, setTexto] = useState('');
  const saveCardapio = () => {
    setCardapio({ periodo, dados: { ...(cardapio.dados||{}), [periodo]: { ...(cardapio.dados?.[periodo]||{}), [dia]: texto } } });
    setTexto('');
  };

  const [pag, setPag] = useState({ tipo:'PIX', valor:'' });
  const addPagamento = () => { if(!Number(pag.valor)) return; setHist([{ id:Date.now(), tipo:pag.tipo, valor:Number(pag.valor), data:new Date().toLocaleDateString('pt-BR'), status:'Pendente' }, ...hist]); setPag({ tipo:'PIX', valor:'' }); };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Painel Admin • Ludikids</h1>
          <div className="flex items-center gap-4">
            <Link to="/admin/chat" className="text-neutral-300 underline">Chat</Link>
            <Link to="/" className="text-neutral-300 underline">Voltar ao App</Link>
          </div>
        </div>
        {!online && (<div className="rounded-2xl border border-yellow-600 bg-yellow-500/10 text-yellow-300 px-4 py-2">Modo offline: alterações ficam no dispositivo até reconexão.</div>)}
        {!isAdmin && (<div className="rounded-2xl border border-red-600 bg-red-500/10 text-red-300 px-4 py-2">Acesso restrito a administradores.</div>)}

        <div className="flex items-center gap-3">
          <div className="text-neutral-400 text-sm">Perfil atual: {session?.role || (isAdmin? 'admin':'n/d')}</div>
          <button onClick={()=>setRole?.('professor')} className="px-3 py-1 rounded-xl bg-neutral-800 border border-neutral-700 text-sm">Definir Professor</button>
          <button onClick={()=>setRole?.('coordenacao')} className="px-3 py-1 rounded-xl bg-neutral-800 border border-neutral-700 text-sm">Definir Coordenação</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setGroup('professores')} className={`px-3 py-1 rounded-full text-sm ${isProf?'bg-emerald-600 text-white':'bg-neutral-800 border border-neutral-700'}`}>Professores</button>
          <button onClick={()=>setGroup('coordenacao')} className={`px-3 py-1 rounded-full text-sm ${isCoord?'bg-sky-600 text-white':'bg-neutral-800 border border-neutral-700'}`}>Coordenação</button>
        </div>

        <div className={`grid md:grid-cols-2 gap-6 ${!isAdmin ? 'pointer-events-none opacity-60' : ''}`}>
          {isProf && (
            <>
              <Section title="Baby Care (Professores)"><BabyCareManager /></Section>
              <Section title="Avisos (Professores)"><TeacherNotices avisos={avisos} setAvisos={setAvisos} /></Section>
            </>
          )}

          {isCoord && (
            <>
              <Section title="Moderar Avisos (Coordenação)"><ModerateNotices avisos={avisos} setAvisos={setAvisos} /></Section>
              <Section title="Alunos">
                <div className="flex gap-2 mb-3">
                  <input value={novoAluno.nome} onChange={e=>setNovoAluno({...novoAluno,nome:e.target.value})} placeholder="Nome" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm w-full" />
                  <input value={novoAluno.turma} onChange={e=>setNovoAluno({...novoAluno,turma:e.target.value})} placeholder="Turma" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm w-40" />
                  <button onClick={addAluno} className="bg-emerald-600 px-3 py-2 rounded-xl text-sm">Adicionar</button>
                </div>
                <ul className="space-y-2">
                  {alunos.map(a => (
                    <li key={a.id} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 flex justify-between">
                      <span>{a.nome} — {a.turma}</span>
                      <button onClick={()=>setAlunos(alunos.filter(x=>x.id!==a.id))} className="text-red-400">Remover</button>
                    </li>
                  ))}
                  {alunos.length===0 && <li className="text-neutral-500 text-sm">Sem alunos</li>}
                </ul>
              </Section>

              <Section title="Cardápio">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <select value={periodo} onChange={e=>setPeriodo(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm">
                    <option>Manhã</option><option>Tarde</option><option>Integral</option>
                  </select>
                  <select value={dia} onChange={e=>setDia(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm">
                    <option>Seg</option><option>Ter</option><option>Qua</option><option>Qui</option><option>Sex</option>
                  </select>
                  <input value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Prato" className="col-span-3 md:col-span-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
                </div>
                <button onClick={saveCardapio} className="bg-amber-600 px-3 py-2 rounded-xl text-sm">Salvar</button>
              </Section>

              <Section title="Financeiro">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <select value={pag.tipo} onChange={e=>setPag({...pag,tipo:e.target.value})} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm">
                    <option>PIX</option><option>Cartão</option><option>Boleto</option>
                  </select>
                  <input value={pag.valor} onChange={e=>setPag({...pag,valor:e.target.value})} placeholder="Valor" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
                  <button onClick={addPagamento} className="bg-purple-600 px-3 py-2 rounded-xl text-sm">Adicionar</button>
                </div>
                <div className="text-neutral-400 text-sm">Registros: {hist.length}</div>
              </Section>

              <Section title="Calendário (Eventos)"><EventManager events={events} setEvents={setEvents} /></Section>
              <Section title="Tarefas"><TasksManager tarefas={tarefas} setTarefas={setTarefas} /></Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EventManager({ events, setEvents }) {
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('festa');
  const add = () => {
    if (!date || !title.trim()) return;
    setEvents([...events, { id: Date.now(), date, title: title.trim(), type }]);
    setTitle('');
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm flex-1" />
        <select value={type} onChange={e=>setType(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm">
          <option value="festa">Festa</option>
          <option value="reuniao">Reunião</option>
          <option value="tarefa">Tarefa</option>
        </select>
        <button onClick={add} className="bg-teal-600 px-3 py-2 rounded-xl text-sm">Adicionar</button>
      </div>
      <ul className="space-y-2">
        {events.map(ev => (
          <li key={ev.id} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 flex justify-between">
            <span>{ev.date} — {ev.title} ({ev.type})</span>
            <button onClick={()=>setEvents(events.filter(e=>e.id!==ev.id))} className="text-red-400">Excluir</button>
          </li>
        ))}
        {events.length===0 && <li className="text-neutral-500 text-sm">Sem eventos</li>}
      </ul>
    </div>
  );
}

function TasksManager({ tarefas, setTarefas }) {
  const [texto, setTexto] = useState('');
  const [due, setDue] = useState('');
  const add = () => {
    if (!texto.trim()) return;
    setTarefas([{ id: Date.now(), texto: texto.trim(), done: false, due }, ...tarefas]);
    setTexto(''); setDue('');
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Nova tarefa" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm flex-1" />
        <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
        <button onClick={add} className="bg-teal-600 px-3 py-2 rounded-xl text-sm">Adicionar</button>
      </div>
      <ul className="space-y-2">
        {tarefas.map(t => (
          <li key={t.id} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 flex justify-between">
            <span>{t.texto}{t.due?` — entrega: ${new Date(t.due).toLocaleDateString('pt-BR')}`:''}</span>
            <button onClick={()=>setTarefas(tarefas.filter(x=>x.id!==t.id))} className="text-red-400">Excluir</button>
          </li>
        ))}
        {tarefas.length===0 && <li className="text-neutral-500 text-sm">Sem tarefas</li>}
      </ul>
    </div>
  );
}

function TeacherNotices({ avisos, setAvisos }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const add = () => {
    if (!title.trim() || !text.trim()) return;
    const item = { id: Date.now(), title: title.trim(), texto: text.trim(), image: image.trim(), autor: 'Professor', createdAt: Date.now(), approved: false };
    setAvisos([...(avisos||[]), item]);
    setTitle(''); setText(''); setImage('');
    toast.success('Aviso enviado para moderação');
  };
  return (
    <div className="space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm w-full" />
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Mensagem" rows={3} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm w-full" />
      <input value={image} onChange={e=>setImage(e.target.value)} placeholder="URL da imagem (opcional)" className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm w-full" />
      <button onClick={add} className="bg-emerald-600 px-3 py-2 rounded-xl text-sm">Publicar</button>
    </div>
  );
}

function ModerateNotices({ avisos, setAvisos }) {
  const toggle = (id) => setAvisos((avisos||[]).map(a => a.id===id ? { ...a, approved: !a.approved } : a));
  const remove = (id) => setAvisos((avisos||[]).filter(a => a.id!==id));
  const list = avisos || [];
  return (
    <ul className="space-y-2">
      {list.map(a => (
        <li key={a.id} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 flex justify-between items-center">
          <div className="text-sm">{a.title || 'Aviso'} — <span className="text-neutral-400">{a.autor||'n/d'}</span></div>
          <div className="flex items-center gap-2">
            <button onClick={()=>toggle(a.id)} className={`px-2 py-1 rounded-xl text-xs ${a.approved?'bg-emerald-600':'bg-neutral-700'}`}>{a.approved?'Aprovado':'Pendente'}</button>
            <button onClick={()=>remove(a.id)} className="px-2 py-1 rounded-xl text-xs bg-red-600">Excluir</button>
          </div>
        </li>
      ))}
      {list.length===0 && <li className="text-neutral-500 text-sm">Sem avisos</li>}
    </ul>
  );
}

function BabyCareManager() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [icons, setIcons] = useState(()=>{
    try { const s = JSON.parse(localStorage.getItem(`lk_babycare_${date}`))||{}; return new Set(s.icons||[]);} catch { return new Set(); }
  });
  const [obs, setObs] = useState(()=>{
    try { const s = JSON.parse(localStorage.getItem(`lk_babycare_${date}`))||{}; return s.notes?.obs||'';} catch { return ''; }
  });
  useEffect(()=>{
    try { const s = JSON.parse(localStorage.getItem(`lk_babycare_${date}`))||{}; setIcons(new Set(s.icons||[])); setObs(s.notes?.obs||''); } catch {}
  },[date]);
  const toggle = (k) => { const c = new Set(icons); c.has(k)?c.delete(k):c.add(k); setIcons(c); };
  const save = () => {
    const data = { date, icons: Array.from(icons), notes: { obs } };
    localStorage.setItem(`lk_babycare_${date}`, JSON.stringify(data));
    toast.success('Baby Care salvo');
  };
  const ITEMS = [
    { k:'banho', label:'Banho', emoji:'🛁' },
    { k:'sono', label:'Sono', emoji:'😴' },
    { k:'alimentacao', label:'Alimentação', emoji:'🍽️' },
    { k:'fralda', label:'Fralda', emoji:'🧷' },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
        <button onClick={save} className="bg-emerald-600 px-3 py-2 rounded-xl text-sm">Salvar</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {ITEMS.map(i => {
          const active = icons.has(i.k);
          return (
            <button key={i.k} onClick={()=>toggle(i.k)} className={`rounded-2xl px-3 py-2 text-sm border ${active?'bg-emerald-600 text-white border-emerald-600':'bg-neutral-800 border-neutral-700'}`}>{i.emoji} {i.label}</button>
          );
        })}
      </div>
      <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Observação do professor(a)" rows={3} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm" />
    </div>
  );
}

