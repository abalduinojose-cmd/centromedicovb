import { motion } from 'framer-motion';
import { FaCalendarCheck, FaWhatsapp } from 'react-icons/fa';
import { RECURSOS } from '../../config.js';

/** O ícone acompanha o destino real do clique: formulário ou WhatsApp. */
export const IconeAgendamento = RECURSOS.agendamentoOnline ? FaCalendarCheck : FaWhatsapp;

const TAMANHOS = {
  sm: { classe: 'gap-2 px-5 py-2.5 text-[13px]', icone: 14 },
  md: { classe: 'gap-2.5 px-7 py-3.5 text-sm', icone: 15 },
  lg: { classe: 'gap-2.5 px-9 py-4 text-base', icone: 17 },
};

/**
 * CTA principal de agendamento: gradiente da marca, sombra colorida, brilho que
 * atravessa o botão no hover e elevação suave. Usado no menu e no hero.
 */
export default function CtaAgendar({ tamanho = 'md', className = '', children = 'Agendar Consulta', ...props }) {
  const { classe, icone } = TAMANHOS[tamanho] ?? TAMANHOS.md;

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className={`group relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-red-dark via-brand-red to-[#FF4A54] font-display font-bold tracking-tight text-white shadow-[0_10px_28px_-8px_rgba(230,11,24,0.6)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-10px_rgba(230,11,24,0.85)] cursor-pointer ${classe} ${className}`}
      {...props}
    >
      {/* Brilho que percorre o botão ao passar o mouse */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-[60%] w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-[900ms] ease-out group-hover:translate-x-[420%]"
      />
      <IconeAgendamento size={icone} aria-hidden className="relative shrink-0" />
      <span className="relative">{children}</span>
    </motion.button>
  );
}
