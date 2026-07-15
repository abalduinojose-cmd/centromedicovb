import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { FLUXO_STATUS, PROXIMO_STATUS, statusInfo } from './constantes.js';

export function Badge({ status, className = '' }) {
  const s = statusInfo(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-display font-semibold whitespace-nowrap ${className}`}
      style={{ color: s.cor, background: s.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.cor }} />
      {s.label}
    </span>
  );
}

/**
 * Menu de mudança de status: botão de avanço rápido para o próximo passo do
 * fluxo + lista completa (incluindo cancelamento e falta).
 */
export function StatusMenu({ agendamento, onMudar }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fechar = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, []);

  const proximo = PROXIMO_STATUS[agendamento.status];

  return (
    <div ref={ref} className="relative flex items-center gap-1.5">
      {proximo && (
        <button
          onClick={() => onMudar(proximo)}
          title={`Avançar para: ${statusInfo(proximo).label}`}
          className="flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-[11px] font-display font-semibold text-white transition-colors hover:bg-navy-light cursor-pointer"
        >
          <FaCheck size={9} aria-hidden /> {statusInfo(proximo).label}
        </button>
      )}
      <button
        onClick={() => setAberto((v) => !v)}
        aria-label="Alterar status"
        className="flex h-6 w-6 items-center justify-center rounded-full text-text-dark/50 transition-colors hover:bg-gray-support cursor-pointer"
      >
        <FaChevronDown size={10} />
      </button>
      {aberto && (
        <div className="absolute right-0 top-8 z-30 w-52 rounded-2xl border border-gray-divider bg-white p-1.5 shadow-elevated">
          {FLUXO_STATUS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setAberto(false);
                onMudar(s.id);
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left text-xs transition-colors hover:bg-gray-support cursor-pointer ${s.id === agendamento.status ? 'font-bold' : ''}`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: s.cor }} />
              {s.label}
              {s.id === agendamento.status && <FaCheck size={9} className="ml-auto text-navy" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
