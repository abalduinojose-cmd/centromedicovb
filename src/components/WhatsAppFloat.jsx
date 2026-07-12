import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { LINK_WHATSAPP_GERAL } from '../utils/whatsapp.js';

/** Botão flutuante do WhatsApp (canto inferior direito, com pulso). */
export default function WhatsAppFloat() {
  return (
    <motion.a
      href={LINK_WHATSAPP_GERAL}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.94 }}
      className="animate-pulse-whatsapp fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-whatsapp text-white shadow-elevated"
    >
      <FaWhatsapp size={30} aria-hidden />
    </motion.a>
  );
}
