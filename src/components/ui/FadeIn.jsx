import { motion } from 'framer-motion';

/** Wrapper de animação fade-in + slide-up ao entrar na viewport. */
export default function FadeIn({ children, delay = 0, y = 32, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
