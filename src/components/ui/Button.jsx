import { motion } from 'framer-motion';

const variantes = {
  primario:
    'bg-navy text-white hover:bg-navy-light shadow-[0_8px_24px_rgba(28,43,146,0.35)]',
  vermelho:
    'bg-brand-red text-white hover:bg-brand-red-dark shadow-[0_8px_24px_rgba(230,11,24,0.35)]',
  'vermelho-outline':
    'border-2 border-brand-red text-brand-red bg-white/95 hover:bg-brand-red hover:text-white',
  outline:
    'border-2 border-navy text-navy bg-transparent hover:bg-navy hover:text-white',
  branco:
    'bg-white text-navy hover:bg-rose-light shadow-[0_8px_24px_rgba(0,0,0,0.15)]',
  whatsapp:
    'bg-whatsapp text-white hover:brightness-110 shadow-[0_8px_24px_rgba(37,211,102,0.4)]',
};

/** Botão padrão com micro-animação de hover/tap (mín. 44px de altura — touch friendly). */
export default function Button({ variante = 'primario', className = '', children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 font-display text-sm font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantes[variante]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
