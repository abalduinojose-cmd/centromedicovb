import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button.jsx';
import SectionTitle from './ui/SectionTitle.jsx';
import { medicos, medicosDestaque } from '../data/medicos.js';
import { especialidades } from '../data/especialidades.js';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

/* Rótulos de áreas que não estão na grade de especialidades de consulta. */
const AREAS_EXTRA = { ultrassonografia: 'Ultrassonografia' };

const nomeEspecialidade = (id) =>
  especialidades.find((e) => e.id === id)?.nome ?? AREAS_EXTRA[id] ?? id;

const primeiroNome = (nome) =>
  nome.replace(/^(Dra?\.|Psic\.|Nut\.|Ft\.|Prof\.ª|Pod\.)\s*/i, '').split(' ')[0];

/** Avatar: foto real quando disponível; senão, iniciais. */
function Avatar({ nome, foto }) {
  if (foto) {
    return (
      <img
        src={foto}
        alt={`Foto de ${nome}`}
        loading="lazy"
        className="mx-auto h-[110px] w-[110px] rounded-full object-cover object-top ring-4 ring-rose-light shadow-card"
      />
    );
  }
  const iniciais = nome
    .replace(/^(Dra?\.|Psic\.|Nut\.|Ft\.|Prof\.ª|Pod\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return (
    <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-light text-3xl font-display font-bold text-white ring-4 ring-rose-light shadow-card">
      {iniciais}
    </div>
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((medico, i) => (
            <motion.article
              key={medico.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-gray-divider bg-white p-8 text-center shadow-soft transition-shadow duration-300 hover:shadow-elevated"
            >
              <Avatar nome={medico.nome} foto={medico.foto} />
              <h3 className="mt-5 font-display text-lg font-bold text-navy">{medico.nome}</h3>
              <p className="mt-1 font-accent text-sm font-semibold text-brand-red">
                {nomeEspecialidade(medico.especialidade)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-dark/60">{medico.bio}</p>
              <button
                onClick={() => agendarCom(medico)}
                className="mt-5 w-full rounded-full border-2 border-navy py-2.5 font-display text-sm font-semibold text-navy transition-colors duration-200 hover:bg-navy hover:text-white cursor-pointer"
              >
                Agendar com {primeiroNome(medico.nome)}
              </button>
            </motion.article>
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
