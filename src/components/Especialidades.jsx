import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaAppleAlt, FaAssistiveListeningSystems, FaBaby, FaBone, FaBrain, FaBriefcaseMedical,
  FaComments, FaDumbbell, FaEye, FaHandSparkles, FaHeartbeat, FaLungs, FaPuzzlePiece,
  FaShoePrints, FaTooth, FaVenus, FaWeight,
} from 'react-icons/fa';
import { GiKidneys, GiStomach, GiBrain, GiWaterDrop } from 'react-icons/gi';
import Button from './ui/Button.jsx';
import SectionTitle from './ui/SectionTitle.jsx';
import { especialidades } from '../data/especialidades.js';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

const ICONES = {
  coracao: FaHeartbeat,
  pulmao: FaLungs,
  estomago: GiStomach,
  mente: FaBrain,
  osso: FaBone,
  pele: FaHandSparkles,
  bebe: FaBaby,
  conversa: FaComments,
  rins: GiKidneys,
  cerebro: GiBrain,
  balanca: FaWeight,
  feminino: FaVenus,
  ouvido: FaAssistiveListeningSystems,
  olho: FaEye,
  veias: GiWaterDrop,
  dente: FaTooth,
  maca: FaAppleAlt,
  exercicio: FaDumbbell,
  quebracabeca: FaPuzzlePiece,
  maleta: FaBriefcaseMedical,
  pes: FaShoePrints,
};

const VISIVEIS_INICIAL = 12;

export default function Especialidades() {
  const { abrirAgendamento } = useAgendamento();
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const lista = mostrarTodas ? especialidades : especialidades.slice(0, VISIVEIS_INICIAL);

  return (
    <section id="especialidades" className="relative bg-gradient-to-b from-white via-rose-soft to-rose py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Mais de 20 áreas de cuidado"
          titulo="Especialidades Médicas"
          descricao="Uma equipe completa para cuidar de você e da sua família em todas as fases da vida — em um único lugar."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((esp, i) => {
            const Icone = ICONES[esp.icone] ?? FaHeartbeat;
            return (
              <motion.button
                key={esp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
                whileHover={{ scale: 1.035, y: -4 }}
                onClick={() => abrirAgendamento('consulta', { especialidade: esp.id })}
                className="group rounded-3xl bg-white/80 p-6 text-left shadow-soft backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-card cursor-pointer"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/[0.07] text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                  <Icone size={22} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-bold text-navy leading-snug">{esp.nome}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-dark/60">{esp.descricao}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button variante="primario" onClick={() => abrirAgendamento('consulta')} className="px-9">
            Consultar Especialista
          </Button>
          <Button variante="outline" onClick={() => setMostrarTodas((v) => !v)} className="px-9">
            {mostrarTodas ? 'Mostrar Menos' : 'Ver Todas as Especialidades'}
          </Button>
        </div>
      </div>
    </section>
  );
}
