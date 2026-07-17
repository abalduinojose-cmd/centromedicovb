import { motion } from 'framer-motion';
import {
  FaArrowRight, FaBaby, FaBrain, FaHeadSideCough, FaHeartbeat, FaLungs,
  FaStopwatch, FaTachometerAlt, FaWalking, FaWaveSquare,
} from 'react-icons/fa';
import { GiHeartOrgan, GiWaterDrop } from 'react-icons/gi';
import { RiPulseFill } from 'react-icons/ri';
import FadeIn from './ui/FadeIn.jsx';
import SectionTitle from './ui/SectionTitle.jsx';
import { examesComplementares } from '../data/exames.js';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

const ICONES = {
  coracao: FaHeartbeat,
  'coracao-orgao': GiHeartOrgan,
  pulso: RiPulseFill,
  cronometro: FaStopwatch,
  pressao: FaTachometerAlt,
  pulmao: FaLungs,
  cerebro: FaBrain,
  onda: FaWaveSquare,
  pescoco: FaHeadSideCough,
  gota: GiWaterDrop,
  perna: FaWalking,
  bebe: FaBaby,
};

const icone = (chave) => ICONES[chave] ?? FaHeartbeat;

/** Colunas escolhidas para não deixar um card órfão na última linha. */
function colunasDe(total) {
  if (total === 3) return 'sm:grid-cols-2 lg:grid-cols-3';
  if (total % 4 === 1) return 'sm:grid-cols-2 lg:grid-cols-3'; // ex.: 5 exames → 3 + 2
  return 'sm:grid-cols-2 lg:grid-cols-4';
}

/**
 * Faixas do layout: categorias com 3+ exames ocupam a linha inteira; categorias
 * menores são emparelhadas lado a lado, evitando cards perdidos no vazio.
 */
const faixas = [];
examesComplementares.forEach((grupo) => {
  const pequena = grupo.exames.length <= 2;
  const anterior = faixas[faixas.length - 1];
  if (pequena && anterior?.pequenas && anterior.grupos.length < 2) anterior.grupos.push(grupo);
  else faixas.push({ pequenas: pequena, grupos: [grupo] });
});

function CartaoExame({ exame, indice, horizontal, aoAgendar }) {
  const Icone = icone(exame.icone);
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (indice % 4) * 0.07 }}
      whileHover={{ y: -5 }}
      onClick={aoAgendar}
      className={`group rounded-2xl border border-gray-divider bg-white p-5 text-left shadow-soft transition-shadow duration-300 hover:shadow-card cursor-pointer ${
        horizontal ? 'flex items-start gap-4' : 'flex h-full flex-col'
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-soft text-navy transition-colors duration-300 group-hover:bg-brand-red group-hover:text-white">
        <Icone size={16} aria-hidden />
      </span>
      <span className={horizontal ? 'min-w-0 flex-1' : 'flex flex-1 flex-col'}>
        <span className={`block font-display text-[15px] font-bold leading-snug text-navy ${horizontal ? '' : 'mt-3.5'}`}>
          {exame.nome}
        </span>
        <span className="mt-1.5 block flex-1 text-[12.5px] leading-relaxed text-text-dark/60">
          {exame.descricao}
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[11.5px] font-semibold text-brand-red">
          Agendar exame
          <FaArrowRight size={9} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </motion.button>
  );
}

function Categoria({ grupo, horizontal }) {
  const { abrirAgendamento } = useAgendamento();
  const IconeGrupo = icone(grupo.icone);

  return (
    <div>
      <FadeIn y={16} className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
          <IconeGrupo size={15} aria-hidden />
        </span>
        <h3 className="font-display text-base font-bold text-navy">{grupo.categoria}</h3>
        <span className="shrink-0 text-[11px] font-medium text-text-dark/40">
          {grupo.exames.length} {grupo.exames.length === 1 ? 'exame' : 'exames'}
        </span>
        <span className="h-px flex-1 bg-navy/10" aria-hidden />
      </FadeIn>

      <div className={horizontal ? 'grid gap-4' : `grid gap-4 ${colunasDe(grupo.exames.length)}`}>
        {grupo.exames.map((exame, i) => (
          <CartaoExame
            key={exame.id}
            exame={exame}
            indice={i}
            horizontal={horizontal}
            aoAgendar={() => abrirAgendamento('exame', { exameId: exame.id })}
          />
        ))}
      </div>
    </div>
  );
}

export default function ExamesComplementares() {
  return (
    <section id="exames-complementares" className="bg-rose-soft/70 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Tecnologia a serviço do diagnóstico"
          titulo="Exames e Especialidades Complementares"
          descricao="Exames de precisão realizados na própria clínica, com equipamentos modernos e laudos ágeis."
        />

        <div className="space-y-9 md:space-y-11">
          {faixas.map((faixa, i) => (
            <div key={i} className={faixa.pequenas ? 'grid gap-9 md:grid-cols-2 md:gap-6' : ''}>
              {faixa.grupos.map((grupo) => (
                <Categoria key={grupo.id} grupo={grupo} horizontal={faixa.pequenas} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
