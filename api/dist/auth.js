import { Router } from 'express';
import { z } from 'zod';
import { db, uid } from './db.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change';
const router = Router();
const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    studentId: z.string().min(1),
});
router.post('/register', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Dados inválidos' });
    const { name, email, password, studentId } = parsed.data;
    const row = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (row)
        return res.status(409).json({ error: 'E-mail já cadastrado' });
    const passHash = await argon2.hash(password);
    db.prepare('INSERT INTO users (id, name, email, pass_hash, role, student_id) VALUES (?,?,?,?,?,?)')
        .run(uid(), name, email.toLowerCase(), passHash, 'RESPONSAVEL', studentId);
    return res.json({ ok: true });
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: 'Dados inválidos' });
    const { email, password } = parsed.data;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user)
        return res.status(401).json({ error: 'Credenciais inválidas' });
    const ok = await argon2.verify(user.pass_hash, password);
    if (!ok)
        return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, studentId: user.student_id } });
});
export function authMiddleware(req, res, next) {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
export function requireRole(...roles) {
    return (req, res, next) => {
        const u = req.user;
        if (!u || !roles.includes(u.role))
            return res.status(403).json({ error: 'Forbidden' });
        next();
    };
}
router.get('/me', authMiddleware, (req, res) => {
    const u = req.user;
    const row = db.prepare('SELECT id,name,email,role,student_id FROM users WHERE id = ?').get(u.sub);
    res.json(row);
});
export default router;
