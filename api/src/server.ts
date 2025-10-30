import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes, { authMiddleware, requireRole } from './auth.js';
import { db, uid } from './db.js';
import { ensureDefaultAdminUser } from './seed.js';
import { z } from 'zod';

await ensureDefaultAdminUser();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.ALLOW_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);

// Notices
const noticeSchema = z.object({ title: z.string().min(1), text: z.string().min(1), image: z.string().url().optional() });
app.get('/notices', (req, res) => {
  const approved = db.prepare('SELECT * FROM notices WHERE approved = 1 ORDER BY created_at DESC').all();
  res.json(approved);
});
app.post('/notices', authMiddleware, (req, res) => {
  const val = noticeSchema.safeParse(req.body);
  if (!val.success) return res.status(400).json({ error: 'Dados inválidos' });
  const u = (req as any).user;
  const id = uid();
  db.prepare('INSERT INTO notices (id,title,text,image,approved,author_id,author_role) VALUES (?,?,?,?,?,?,?)')
    .run(id, val.data.title, val.data.text, val.data.image || null, 0, u.sub, u.role);
  res.json({ id, approved: false });
});
app.get('/notices/mod', authMiddleware, requireRole('COORDENACAO'), (req, res) => {
  const all = db.prepare('SELECT * FROM notices ORDER BY created_at DESC').all();
  res.json(all);
});
app.patch('/notices/:id/approve', authMiddleware, requireRole('COORDENACAO'), (req, res) => {
  db.prepare('UPDATE notices SET approved = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});
app.delete('/notices/:id', authMiddleware, requireRole('COORDENACAO'), (req, res) => {
  db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Events (calendar)
const eventSchema = z.object({ date: z.string().min(8), title: z.string().min(1), type: z.string().min(1) });
app.get('/events', (_, res) => {
  res.json(db.prepare('SELECT * FROM events ORDER BY date').all());
});
app.post('/events', authMiddleware, requireRole('COORDENACAO'), (req, res) => {
  const v = eventSchema.safeParse(req.body); if(!v.success) return res.status(400).json({ error: 'Dados inválidos' });
  const id = uid();
  db.prepare('INSERT INTO events (id,date,title,type) VALUES (?,?,?,?)').run(id, v.data.date, v.data.title, v.data.type);
  res.json({ id });
});
app.delete('/events/:id', authMiddleware, requireRole('COORDENACAO'), (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id); res.json({ ok: true });
});

// Tasks
const taskSchema = z.object({ text: z.string().min(1), dueDate: z.string().optional() });
app.get('/tasks', (_, res) => res.json(db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()));
app.post('/tasks', authMiddleware, requireRole('COORDENACAO'), (req,res)=>{
  const v = taskSchema.safeParse(req.body); if(!v.success) return res.status(400).json({ error: 'Dados inválidos' });
  const id = uid();
  db.prepare('INSERT INTO tasks (id,text,due_date) VALUES (?,?,?)').run(id, v.data.text, v.data.dueDate || null);
  res.json({ id });
});
app.delete('/tasks/:id', authMiddleware, requireRole('COORDENACAO'), (req,res)=>{
  db.prepare('DELETE FROM tasks WHERE id=?').run(req.params.id); res.json({ ok:true });
});

// Menu
const menuSchema = z.object({ period: z.string(), day: z.string(), dish: z.string(), image: z.string().optional() });
app.get('/menu', (req, res) => {
  const period = String(req.query.period || '');
  const rows = period ? db.prepare('SELECT * FROM menu_entries WHERE period = ?').all(period) : db.prepare('SELECT * FROM menu_entries').all();
  res.json(rows);
});
app.post('/menu', authMiddleware, requireRole('COORDENACAO'), (req, res) => {
  const v = menuSchema.safeParse(req.body); if(!v.success) return res.status(400).json({ error:'Dados inválidos' });
  const id = uid();
  db.prepare('INSERT INTO menu_entries (id,period,day,dish,image) VALUES (?,?,?,?,?)').run(id, v.data.period, v.data.day, v.data.dish, v.data.image || null);
  res.json({ id });
});

// Finance
const paySchema = z.object({ kind: z.string(), amount: z.number().positive(), date: z.string(), status: z.string(), desc: z.string().optional() });
app.get('/payments', authMiddleware, requireRole('COORDENACAO'), (_, res) => res.json(db.prepare('SELECT * FROM payments ORDER BY date DESC').all()));
app.post('/payments', authMiddleware, requireRole('COORDENACAO'), (req,res)=>{
  const v = paySchema.safeParse(req.body); if(!v.success) return res.status(400).json({ error:'Dados inválidos' });
  const id = uid();
  db.prepare('INSERT INTO payments (id,kind,amount,date,status,desc) VALUES (?,?,?,?,?,?)').run(id, v.data.kind, v.data.amount, v.data.date, v.data.status, v.data.desc || null);
  res.json({ id });
});

// BabyCare
const bcSchema = z.object({ date: z.string(), studentId: z.string(), icons: z.array(z.string()), obs: z.string().optional() });
app.get('/babycare', authMiddleware, (req, res) => {
  const date = String(req.query.date || '');
  const studentId = String(req.query.studentId || '');
  const rows = db.prepare('SELECT * FROM babycare WHERE date = ? AND student_id = ?').all(date, studentId);
  res.json(rows);
});
app.post('/babycare', authMiddleware, requireRole('PROFESSOR','COORDENACAO'), (req, res) => {
  const v = bcSchema.safeParse(req.body); if(!v.success) return res.status(400).json({ error:'Dados inválidos' });
  const id = uid();
  db.prepare('INSERT INTO babycare (id,date,student_id,icons,obs,created_by) VALUES (?,?,?,?,?,?)').run(id, v.data.date, v.data.studentId, JSON.stringify(v.data.icons), v.data.obs || null, (req as any).user.sub);
  res.json({ id });
});

const PORT = Number(process.env.PORT || 8788);
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));

