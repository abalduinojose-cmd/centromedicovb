import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStethoscope } from 'react-icons/fa';
import Button from './ui/Button.jsx';
import SectionTitle from './ui/SectionTitle.jsx';
import { IconeAgendamento } from './ui/CtaAgendar.jsx';
import { medicos, medicosDestaque } from '../data/medicos.js';
import { especialidades } from '../data/especialidades.js';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

/* Rótulos de áreas que não estão na grade de especialidades de consulta. */
const AREAS_EXTRA = { ultrassonografia: 'Ultrassonografia' };

const nomeEspecialidade = (id) =>
  especialidades.find((e) => e.id === id)?.nome ?? AREAS_EXTRA[id] ?? id;

const semTitulo = (nome) => nome.replace(/^(Dra?\.|Psic\.|Nut\.|Ft\.|Prof\.ª|Pod\.)\s*/i, '');
const primeiroNome = (nome) => semTitulo(nome).split(' ')[0];
const iniciais = (nome) =>
  semTitulo(nome).split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

function CardProfissional({ medico, indice, aoAgendar }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (indice % 4) * 0.07 }}
      className="group flex w-full flex-col overflow-hidden rounded-3xl border border-gray-divider bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/15 hover:shadow-elevated sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)]"
    >
      {/* Retrato */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-navy to-navy-light">
        {medico.foto ? (
          <img
            src={medico.foto}
            alt={`Foto de ${medico.nome}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-white/80">
            {iniciais(medico.nome)}
          </span>
        )}
        {/* Véu inferior para a etiqueta respirar sobre qualquer foto */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/65 via-navy/20 to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 truncate rounded-full bg-white/95 px-3 py-1 text-center font-accent text-[10.5px] font-bold uppercase tracking-wider text-brand-red shadow-soft backdrop-blur-sm">
          {nomeEspecialidade(medico.especialidade)}
        </span>
      </div>

      {/* Identificação */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[15px] font-bold leading-snug text-navy">{medico.nome}</h3>
        <p className="mt-2 flex items-start gap-2 text-[12.5px] leading-relaxed text-text-dark/60">
          <FaStethoscope className="mt-0.5 shrink-0 text-navy/30" size={11} aria-hidden />
          <span className="line-clamp-2">{medico.bio}</span>
        </p>
        <button
          onClick={aoAgendar}
          className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-navy/15 font-display text-[12.5px] font-semibold text-navy transition-colors duration-300 hover:border-transparent hover:bg-navy hover:text-white cursor-pointer"
        >
          <IconeAgendamento size={12} aria-hidden />
          Agendar com {primeiroNome(medico.nome)}
        </button>
      </div>
    </motion.article>
  );
}

export default function Equipe() {
  const { abrirAgendamento } = useAgendamento();
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const lista = mostrarTodos ? medicos : medicosDestaque;

  const agendarCom = (medico) => {
    if (medico.especialidade === 'ultrassonografia') {
      abrirAgendamento('exame');
    } else {
      abrirAgendamento('consulta', { especialidade: medico.especialidade, medicoId: medico.id });
    }
  };

  return (
    <section id="equipe" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Conheça nossa equipe"
          titulo="Profissionais Altamente Qualificados"
          descricao="Nossa equipe é composta por profissionais especializados, prontos para oferecer o melhor cuidado para você e sua família."
        />

        {/* Flex centralizado: a última linha fica equilibrada em qualquer quantidade */}
        <div className="flex flex-wrap justify-center gap-6">
          {lista.map((medico, i) => (
            <CardProfissional
              key={medico.id}
              medico={medico}
              indice={i}
              aoAgendar={() => agendarCom(medico)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variante="outline" onClick={() => setMostrarTodos((v) => !v)} className="px-9">
            {mostrarTodos ? 'Mostrar Menos' : `Ver Toda a Equipe (${medicos.length} profissionais)`}
          </Button>
        </div>
      </div>
    </section>
  );
}
