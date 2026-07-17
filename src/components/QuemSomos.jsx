import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCapsules, FaHandHoldingHeart, FaHeartbeat, FaHospitalAlt } from 'react-icons/fa';
import FadeIn from './ui/FadeIn.jsx';
import CtaAgendar from './ui/CtaAgendar.jsx';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

const INSTAGRAM_DROGARIA = 'https://www.instagram.com/viverbemdrogariainova/';

/** Título de bloco, com ícone discreto e traço da marca. */
function Bloco({ icone: Icone, titulo, children }) {
  return (
    <FadeIn className="border-t border-gray-divider pt-10">
      <h2 className="flex items-center gap-3 font-display text-xl font-bold text-navy md:text-2xl">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-soft text-brand-red">
          <Icone size={16} aria-hidden />
        </span>
        {titulo}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-text-dark/75 md:text-base">{children}</div>
    </FadeIn>
  );
}

export default function QuemSomos() {
  const { abrirAgendamento } = useAgendamento();

  // Aberta em nova aba: sempre começa do topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Abertura */}
      <section className="relative overflow-hidden bg-navy bg-cross-pattern pt-[130px] pb-20 md:pt-[170px] md:pb-28">
        <div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-brand-red/20 blur-[140px]" aria-hidden />
        <div className="absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full bg-rose/25 blur-[130px]" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block rounded-full bg-white/10 px-4 py-2 font-accent text-[11px] font-semibold uppercase tracking-[0.16em] text-rose backdrop-blur-sm"
          >
            Nossa história
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl"
          >
            Quem <span className="text-rose">Somos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
          >
            No Centro Médico Viver Bem, acreditamos que a medicina transcende o diagnóstico. Nossa
            missão é cuidar de cada paciente com ética, acolhimento e excelência técnica, promovendo
            saúde e qualidade de vida em todas as fases da jornada.
          </motion.p>
        </div>

        <svg className="absolute bottom-[-1px] left-0 w-full text-white" viewBox="0 0 1440 74" fill="none" preserveAspectRatio="none" aria-hidden>
          <path d="M0 74L1440 74L1440 32C1200 70 960 12 720 22C480 32 240 70 0 30L0 74Z" fill="currentColor" />
        </svg>
      </section>

      {/* Conteúdo */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4 md:px-6">
          <Bloco icone={FaHeartbeat} titulo="Nossa Origem: Um Compromisso com a Saúde">
            <p>
              O Centro Médico Viver Bem nasceu em <strong className="text-navy">março de 2002</strong>,
              movido por um sonho de transformação. Em uma época em que a maioria dos pacientes da
              região precisava buscar atendimento na capital, nosso fundador enxergou a necessidade de
              criar um centro médico onde as pessoas pudessem contar com várias especialidades e
              exames de alta qualidade em um só lugar. Desde então, nossa trajetória vem sendo
              delineada pelo princípio da excelência.
            </p>
            <p>
              Acreditamos que a medicina de qualidade deve ser acessível e humanizada, tratando cada
              paciente como parte de uma história que nos orgulhamos de ajudar a escrever.
            </p>
          </Bloco>

          {/* Marco temporal */}
          <FadeIn className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-rose-soft to-rose-light px-8 py-8 text-center sm:flex-row sm:gap-8 sm:text-left">
            <p className="font-display text-5xl font-extrabold leading-none text-brand-red md:text-6xl">
              2002
            </p>
            <span className="h-px w-16 bg-navy/15 sm:h-14 sm:w-px" aria-hidden />
            <p className="font-accent text-sm font-medium leading-relaxed text-navy">
              Mais de duas décadas cuidando da saúde das famílias de Petrópolis, com várias
              especialidades e exames reunidos em um só lugar.
            </p>
          </FadeIn>

          <Bloco icone={FaHospitalAlt} titulo="Estrutura Completa e Cuidado Integrado">
            <p>
              Hoje, somos referência em cuidado integrado. Oferecemos uma infraestrutura completa para
              atender às necessidades da sua família, garantindo agilidade e precisão em exames e
              consultas.
            </p>
            <p>
              Para ir além do consultório, ampliamos nossa capacidade de suporte através da Drogaria
              Viver Bem. Ao integrar atendimento médico e serviço farmacêutico, asseguramos a
              conveniência e a continuidade do tratamento que você precisa, mantendo sempre o mesmo
              padrão de dedicação que você encontra em nossa unidade médica.
            </p>

            <a
              href={INSTAGRAM_DROGARIA}
              target="_blank"
              rel="noreferrer"
              className="group mt-2 flex items-center gap-4 rounded-2xl border border-gray-divider bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-brand-red">
                <FaCapsules size={17} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-sm font-bold text-navy">Drogaria Viver Bem</span>
                <span className="block text-xs text-text-dark/55">
                  Suporte farmacêutico com a mesma dedicação — conheça no Instagram
                </span>
              </span>
              <FaArrowRight size={12} aria-hidden className="shrink-0 text-brand-red transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </Bloco>

          <Bloco icone={FaHandHoldingHeart} titulo="Nosso Propósito">
            <p>
              Mais do que tecnologia e especialidades, o que nos define é a nossa vocação em cuidar.
              Estamos prontos para receber você e sua família, com o compromisso de oferecer um
              atendimento que une o rigor técnico à sensibilidade de quem entende o valor de uma vida
              saudável.
            </p>
          </Bloco>

          {/* Fecho */}
          <FadeIn className="rounded-3xl bg-navy bg-cross-pattern px-8 py-10 text-center">
            <p className="font-accent text-lg font-semibold leading-relaxed text-white md:text-xl">
              Centro Médico Viver Bem:
              <br className="sm:hidden" />{' '}
              <span className="text-rose">Especialidade, seu bem-estar é nossa missão.</span>
            </p>
            <div className="mt-7 flex justify-center">
              <CtaAgendar tamanho="lg" onClick={() => abrirAgendamento('consulta')}>
                Agendar Consulta
              </CtaAgendar>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
