import { motion } from 'framer-motion';
import { FaCalendarCheck, FaFlask, FaStar } from 'react-icons/fa';
import Button from './ui/Button.jsx';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const item = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  const { abrirAgendamento } = useAgendamento();

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-navy bg-cross-pattern pt-[120px] md:pt-[150px] pb-16 md:pb-24 min-h-[70vh] flex items-center"
    >
      {/* Camadas decorativas: gradiente + brilhos da marca */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy-dark" aria-hidden />
      <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-brand-red/20 blur-[140px]" aria-hidden />
      <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-rose/25 blur-[130px]" aria-hidden />
      <div className="absolute inset-0 bg-cross-pattern" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Texto principal */}
        <motion.div variants={container} initial="hidden" animate="show" className="text-white">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-accent font-semibold tracking-widest uppercase text-rose backdrop-blur-sm"
          >
            <FaStar className="text-yellow-300" aria-hidden /> Atendimento particular na Posse, Petrópolis - RJ
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-[34px] md:text-5xl lg:text-[54px] font-extrabold leading-[1.12] tracking-tight"
          >
            Cuidar é nossa especialidade, <br className="hidden md:block" />
            <span className="text-rose">seu bem-estar é nossa missão</span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-xl text-lg md:text-xl font-medium text-white/90">
            Medicina especializada com excelência, acolhimento e atendimento humanizado!
          </motion.p>
          <motion.p variants={item} className="mt-3 max-w-xl text-base md:text-lg text-white/70">
            Consultas médicas, exames, ultrassonografia, fisioterapia e dentista: tudo o
            que você precisa para cuidar da sua saúde em um só lugar.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <Button variante="vermelho" onClick={() => abrirAgendamento('consulta')} className="text-base px-8">
              <FaCalendarCheck aria-hidden /> Agendar Consulta Agora
            </Button>
            <Button variante="branco" onClick={() => abrirAgendamento('exame')} className="text-base px-8">
              <FaFlask aria-hidden /> Agendar Exame
            </Button>
          </motion.div>

          <motion.p variants={item} className="mt-8 max-w-xl font-accent text-lg md:text-xl font-semibold text-rose">
            Transformando cuidado em qualidade de vida.
          </motion.p>

          {/* Prova social rápida */}
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ['+20', 'Especialidades Médicas'],
              ['+30', 'Exames disponíveis'],
              ['Segunda à Sexta', '07h30 às 18h'],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-2xl md:text-3xl font-bold text-white">{n}</p>
                <p className="text-sm text-white/60">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Vídeo real da clínica em moldura de celular */}
        <motion.div
          initial={{ opacity: 0, y: 48, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
          className="relative hidden justify-center lg:flex"
        >
          <div className="relative w-[330px] rounded-[36px] border-[10px] border-white/15 bg-black shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <video
              src="videos/clinica-1.mp4"
              className="h-[590px] w-full rounded-[26px] object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Vídeo institucional do Centro Médico Viver Bem"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-16 top-14 rounded-2xl bg-white px-4 py-3 shadow-elevated"
            >
              <p className="font-display text-sm font-bold text-navy">Ultrassonografia</p>
              <p className="text-xs text-text-dark/60">Equipamentos modernos</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="absolute -right-14 bottom-20 rounded-2xl bg-brand-red px-4 py-3 text-white shadow-elevated"
            >
              <p className="font-display text-sm font-bold">Agende hoje</p>
              <p className="text-xs text-white/80">(24) 98847-7924</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Onda de transição (assinatura visual da marca) */}
      <svg
        className="absolute bottom-[-1px] left-0 w-full text-white"
        viewBox="0 0 1440 74"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 74L1440 74L1440 32C1200 70 960 12 720 22C480 32 240 70 0 30L0 74Z" fill="currentColor" />
      </svg>
    </section>
  );
}
