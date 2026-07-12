/**
 * Geração de horários disponíveis (simulação determinística).
 * A agenda completa NUNCA é exposta — apenas os horários livres
 * do profissional/exame na data selecionada.
 * Pronto para substituição por GET /api/horarios?recurso=&data=
 */

const GRADE_HORARIOS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30',
];

/** Hash determinístico simples — mesma data + recurso = mesma agenda. */
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pseudoRandom(seed) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Retorna a grade de horários da data com a flag `disponivel`.
 * Horário da clínica: segunda a sexta, 07h30 às 18h.
 */
export function gerarHorarios(recursoId, isoDate) {
  if (!recursoId || !isoDate) return [];
  const rand = pseudoRandom(hashSeed(`${recursoId}|${isoDate}`));
  return GRADE_HORARIOS.map((hora) => ({ hora, disponivel: rand() > 0.38 }));
}
