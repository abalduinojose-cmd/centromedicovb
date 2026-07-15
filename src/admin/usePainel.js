import { useEffect, useState } from 'react';
import { assinar, carregar } from './store.js';

/** Re-renderiza o componente a cada mudança no store (tempo real). */
export function useEstado() {
  const [, setTick] = useState(0);
  useEffect(() => assinar(() => setTick((t) => t + 1)), []);
  return carregar();
}

export const brl = (v) =>
  (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const dataBr = (iso) => {
  if (!iso) return '';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

export const horaAgora = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
