import argon2 from 'argon2';
import { db, uid } from './db.js';
const DEFAULT_ADMIN = {
    name: 'Administrador',
    email: 'administrativo@ludikids.com',
    password: 'Jv22019198@',
    role: 'COORDENACAO',
};
export async function ensureDefaultAdminUser() {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(DEFAULT_ADMIN.email.toLowerCase());
    if (existing) {
        return;
    }
    const passHash = await argon2.hash(DEFAULT_ADMIN.password);
    db.prepare('INSERT INTO users (id, name, email, pass_hash, role, student_id) VALUES (?,?,?,?,?,?)')
        .run(uid(), DEFAULT_ADMIN.name, DEFAULT_ADMIN.email.toLowerCase(), passHash, DEFAULT_ADMIN.role, null);
}
