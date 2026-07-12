import { motion } from 'framer-motion';
import { FaFlask, FaMicroscope, FaTint, FaVial, FaVials, FaNotesMedical } from 'react-icons/fa';
import Button from './ui/Button.jsx';
import SectionTitle from './ui/SectionTitle.jsx';
import { examesLaboratoriais } from '../data/exames.js';
import { useAgendamento } from '../context/AgendamentoContext.jsx';

const ICONES = {
  hemograma: FaTint,
  glicemia: FaVial,
  colesterol: FaFlask,
  'tsh-t4': FaMicroscope,
  'acido-urico': FaVials,
  transaminases: FaNotesMedical,
};

export default function Exames() {
  const { abrirAgendamento } = useAgendamento();

  return (
    <section id="exames" className="relative bg-white bg-cross-pattern-rose py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Realize seu exame de sangue conosco"
          titulo="Exames Laboratoriais de Precisão"
          descricao="Coleta rápida, ambiente acolhedor e resultados confiáveis para o acompanhamento completo da sua saúde. Exames realizados pelo laboratório Labmed São Camilo."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examesLaboratoriais.map((exame, i) => {
            const Icone = ICONES[exame.id] ?? FaVial;
            return (
              <motion.article
                key={exame.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-gray-divider bg-white p-7 shadow-soft transition-all duration-300 hover:border-navy/20 hover:bg-navy/[0.03] hover:shadow-card"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/8 bg-rose-soft text-navy transition-colors duration-300 group-hover:bg-brand-red group-hover:text-white">
                  <Icone size={24} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy">{exame.nome}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-dark/65">{exame.descricao}</p>
                <button
                  onClick={() => abrirAgendamento('exame', { exameId: exame.id })}
                  className="mt-4 font-display text-sm font-semibold text-brand-red opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer"
                >
                  Agendar este exame →
                </button>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button variante="primario" onClick={() => abrirAgendamento('exame')} className="px-9">
            Ver Todos os Exames
          </Button>
        </div>
      </div>
    </section>
  );
}
