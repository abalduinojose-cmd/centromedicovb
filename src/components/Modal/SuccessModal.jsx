import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaClipboardList, FaClock, FaPhoneAlt } from 'react-icons/fa';
import Button from '../ui/Button.jsx';
import { useAgendamento } from '../../context/AgendamentoContext.jsx';
import { WHATSAPP_DISPLAY } from '../../utils/whatsapp.js';

export default function SuccessModal() {
  const { sucessoAberto, fecharSucesso } = useAgendamento();

  const voltarInicio = () => {
    fecharSucesso();
    document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {sucessoAberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={fecharSucesso}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-sucesso"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-elevated text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 16 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-whatsapp/15"
            >
              <FaCheckCircle className="text-whatsapp" size={44} aria-hidden />
            </motion.div>

            <h2 id="titulo-sucesso" className="mt-5 font-display text-xl font-bold text-navy">
              Sua Solicitação Foi Enviada com Sucesso!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-dark/70">
              Obrigado! Sua solicitação foi encaminhada para nosso WhatsApp.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl bg-rose-soft p-5 text-left">
              <p className="flex items-start gap-3 text-sm text-text-dark/80">
                <FaClipboardList className="mt-0.5 shrink-0 text-brand-red" aria-hidden />
                Nossa equipe irá confirmar a disponibilidade e enviar as instruções para pagamento
                de 50% da consulta como confirmação do agendamento.
              </p>
              <p className="flex items-center gap-3 text-sm text-text-dark/80">
                <FaClock className="shrink-0 text-brand-red" aria-hidden />
                Tempo de resposta: até 2 horas
              </p>
              <p className="flex items-center gap-3 text-sm text-text-dark/80">
                <FaPhoneAlt className="shrink-0 text-brand-red" aria-hidden />
                Telefone direto: {WHATSAPP_DISPLAY}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variante="primario" onClick={voltarInicio} className="flex-1">
                Voltar ao Início
              </Button>
              <Button variante="outline" onClick={fecharSucesso} className="flex-1">
                Continuar Navegando
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
