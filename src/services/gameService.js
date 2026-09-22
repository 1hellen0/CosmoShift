import { API_URL } from '../game/constants';
import db from '../db.json';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`El servidor respondió ${res.status} en ${path}`);
  }
  return res.json();
}

async function conFallback(lectura, fallback) {
  try {
    return await lectura();
  } catch {
    return fallback;
  }
}

export const getNivel = (id) =>
  conFallback(() => request(`/niveles/${id}`), db.niveles.find((n) => n.id === id));
export const getNiveles = () => conFallback(() => request('/niveles'), db.niveles);
export const getPuntajes = () => conFallback(() => request('/puntajes'), db.puntajes);
export const postPuntaje = (data) =>
  request('/puntajes', { method: 'POST', body: JSON.stringify(data) });

export async function servidorDisponible() {
  try {
    const res = await fetch(`${API_URL}/puntajes`);
    return res.ok;
  } catch {
    return false;
  }
}