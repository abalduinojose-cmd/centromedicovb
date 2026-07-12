import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaHome, FaLaptopMedical, FaUserMd } from 'react-icons/fa';
import SectionTitle from './ui/SectionTitle.jsx';

const DIFERENCIAIS = [
  {
    icone: FaHandHoldingHeart,
    titulo: 'Atendimento Humanizado',
    descricao: 'Cada paciente é único. Escutamos, acolhemos e cuidamos com empatia em todas as etapas.',
  },
  {
    icone: FaUserMd,
    titulo: 'Equipe Especializada',
    descricao: 'Profissionais experientes e em constante atualização para oferecer o melhor da medicina.',
  },
  {
    icone: FaLaptopMedical,
    titulo: 'Tecnologia de Ponta',
    descricao: 'Equipamentos modernos de ultrassonografia e laboratório para diagnósticos precisos.',
  },
  {
    icone: FaHome,
    titulo: 'Ambiente Acolhedor',
    descricao: 'Estrutura confortável e pensada para você se sentir em casa do início ao fim.',
  },
];

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="relative overflow-hidden bg-navy bg-cross-pattern py-14 md:py-20">
      <div className="absolute -top-24 right-0 h-[380px] w-[380px] rounded-full bg-brand-red/15 blur-[120px]" aria-hidden />
      <div className="absolute -bottom-24 left-0 h-[340px] w-[340px] rounded-full bg-rose/20 blur-[110px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Por que escolher o Viver Bem?"
          titulo="Diferenciais do Centro Médico Viver Bem"
          descricao="Excelência médica com o acolhimento que você merece."
          tom="branco"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DIFERENCIAIS.map((dif, i) => (
            <motion.article
              key={dif.titulo}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl bg-white/[0.06] p-8 backdrop-blur-sm ring-1 ring-white/10 transition-colors duration-300 hover:bg-rose hover:ring-rose"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-rose transition-colors duration-300 group-hover:bg-white group-hover:text-brand-red">
                <dif.icone size={30} aria-hidden />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold text-white transition-colors duration-300 group-hover:text-navy">
                {dif.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-navy/80">
                {dif.descricao}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
