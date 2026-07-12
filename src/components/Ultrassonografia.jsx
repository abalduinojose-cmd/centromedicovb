import { motion } from 'framer-motion';
import { FaCheckCircle, FaHeartbeat, FaUserMd } from 'react-icons/fa';
import { RiPulseFill } from 'react-icons/ri';
import Button from './ui/Button.jsx';
import FadeIn from './ui/FadeIn.jsx';
import { ultrassonografias } from '../data/exames.js';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

export default function Ultrassonografia() {
  const { abrirAgendamento } = useAgendamento();

  return (
    <section id="ultrassonografia" className="relative bg-gradient-to-b from-rose via-rose-light to-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-accent font-bold tracking-widest uppercase text-brand-red shadow-soft">
            <RiPulseFill size={16} aria-hidden /> Destaque Premium
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight text-brand-red">
            Realize sua <span className="underline decoration-navy/30 decoration-4 underline-offset-4">Ultrassonografia</span> Conosco!
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-text-dark/75 leading-relaxed">
            Equipamentos de última geração e profissionais altamente capacitados
            para um diagnóstico preciso, rápido e acolhedor.
          </p>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ultrassonografias.map((tipo, i) => (
            <motion.button
              key={tipo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => abrirAgendamento('exame', { exameId: tipo.id })}
              className="group flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3.5 text-left shadow-soft backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-card cursor-pointer"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-light text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                <FaHeartbeat size={16} aria-hidden />
              </span>
              <span className="font-display text-[15px] font-semibold text-navy">{tipo.nome}</span>
            </motion.button>
          ))}
        </div>

        <FadeIn delay={0.15} className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-soft">
            <FaUserMd className="shrink-0 text-navy" size={24} aria-hidden />
            <p className="text-sm text-text-dark/75 text-left">
              Exames realizados pelo <strong className="text-navy">Dr. João Gustavo</strong>, com{' '}
              <span className="inline-flex items-center gap-1 text-whatsapp font-semibold">
                <FaCheckCircle size={13} aria-hidden /> laudos rápidos e precisos
              </span>
            </p>
          </div>
          <Button variante="vermelho" onClick={() => abrirAgendamento('exame', { exameId: 'transvaginal' })} className="text-base px-9">
            Agendar Ultrassom
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
