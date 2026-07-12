import { useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { isFeriado } from '../../data/feriados.js';
import { toISODate } from '../../utils/formatacao.js';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/**
 * Calendário customizado do agendamento.
 * Bloqueia: datas passadas, fins de semana e feriados (clínica: seg-sex).
 */
export default function Calendario({ valor, onSelecionar }) {
  const hoje = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [mesVisivel, setMesVisivel] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));

  const dias = useMemo(() => {
    const ano = mesVisivel.getFullYear();
    const mes = mesVisivel.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const celulas = [];
    for (let i = 0; i < primeiroDia; i++) celulas.push(null);
    for (let d = 1; d <= totalDias; d++) celulas.push(new Date(ano, mes, d));
    return celulas;
  }, [mesVisivel]);

  const podeVoltar = mesVisivel > new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const statusDia = (data) => {
    if (!data) return 'vazio';
    const iso = toISODate(data);
    if (data < hoje) return 'passado';
    if (data.getDay() === 0 || data.getDay() === 6) return 'fim-de-semana';
    if (isFeriado(iso)) return 'feriado';
    return 'disponivel';
  };

  return (
    <div className="rounded-2xl border border-gray-divider bg-white p-4 shadow-soft">
      {/* Cabeçalho do mês */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => podeVoltar && setMesVisivel(new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() - 1, 1))}
          disabled={!podeVoltar}
          aria-label="Mês anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-rose-soft disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          <FaChevronLeft size={13} />
        </button>
        <p className="font-display text-sm font-bold text-navy">
          {MESES[mesVisivel.getMonth()]} {mesVisivel.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => setMesVisivel(new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 1))}
          aria-label="Próximo mês"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-rose-soft cursor-pointer"
        >
          <FaChevronRight size={13} />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="py-1 text-[11px] font-accent font-bold text-text-dark/40">
            {d}
          </span>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((data, i) => {
          const status = statusDia(data);
          if (status === 'vazio') return <span key={`v${i}`} />;
          const iso = toISODate(data);
          const selecionado = valor === iso;
          const desabilitado = status !== 'disponivel';
          return (
            <button
              key={iso}
              type="button"
              disabled={desabilitado}
              onClick={() => onSelecionar(iso)}
              aria-label={`${data.getDate()} de ${MESES[data.getMonth()]}${desabilitado ? ' (indisponível)' : ''}`}
              aria-pressed={selecionado}
              className={`flex h-10 w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 ${
                selecionado
                  ? 'bg-brand-red text-white shadow-[0_4px_14px_rgba(230,11,24,0.4)] scale-105'
                  : desabilitado
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-navy hover:bg-navy hover:text-white cursor-pointer'
              }`}
            >
              {data.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-3 flex items-center gap-4 text-[11px] text-text-dark/50">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy" /> Disponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" /> Indisponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-red" /> Selecionado
        </span>
      </p>
    </div>
  );
}
