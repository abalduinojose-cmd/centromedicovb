/**
 * Feriados nacionais (simulados) — datas bloqueadas no calendário.
 * Formato ISO yyyy-mm-dd. Atualizar anualmente ou via API futura.
 */
export const feriados = [
  '2026-01-01',
  '2026-02-16',
  '2026-02-17',
  '2026-04-03',
  '2026-04-21',
  '2026-05-01',
  '2026-06-04',
  '2026-09-07',
  '2026-10-12',
  '2026-11-02',
  '2026-11-15',
  '2026-11-20',
  '2026-12-25',
  '2027-01-01',
];

export const isFeriado = (isoDate) => feriados.includes(isoDate);
