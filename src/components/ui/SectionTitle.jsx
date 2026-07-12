import { motion } from 'framer-motion';

/** Título de seção com animação de entrada e sublinhado da marca. */
export default function SectionTitle({ etiqueta, titulo, descricao, tom = 'navy', centralizado = true }) {
  const corTitulo = tom === 'vermelho' ? 'text-brand-red' : tom === 'branco' ? 'text-white' : 'text-navy';
  const corDesc = tom === 'branco' ? 'text-white/80' : 'text-text-dark/70';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`max-w-3xl ${centralizado ? 'mx-auto text-center' : ''} mb-9 md:mb-12`}
    >
      {etiqueta && (
        <span className={`inline-block mb-3 rounded-full px-4 py-1.5 text-xs font-accent font-semibold tracking-widest uppercase ${tom === 'branco' ? 'bg-white/10 text-rose' : 'bg-rose-light text-brand-red'}`}>
          {etiqueta}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight ${corTitulo}`}>{titulo}</h2>
      {descricao && <p className={`mt-4 text-base md:text-lg leading-relaxed ${corDesc}`}>{descricao}</p>}
    </motion.div>
  );
}
