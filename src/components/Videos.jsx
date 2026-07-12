import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';
import SectionTitle from './ui/SectionTitle.jsx';

const VIDEOS = [
  { src: 'videos/clinica-1.mp4', poster: 'img/posters/clinica-1.jpg', legenda: 'Estrutura e atendimento' },
  { src: 'videos/clinica-2.mp4', poster: 'img/posters/clinica-2.jpg', legenda: 'Nosso dia a dia' },
  { src: 'videos/clinica-3.mp4', poster: 'img/posters/clinica-3.jpg', legenda: 'Cuidado em cada detalhe' },
];

/** Vídeos reais do Instagram da clínica — conexão direta com as redes sociais. */
export default function Videos() {
  return (
    <section id="videos" className="bg-gray-support py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Por dentro da clínica"
          titulo="Conheça o Viver Bem de Perto"
          descricao="Acompanhe nosso dia a dia e veja como cuidamos de cada paciente com atenção e carinho."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, i) => (
            <motion.figure
              key={video.src}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px] bg-black shadow-card transition-shadow duration-300 hover:shadow-elevated"
            >
              <video
                src={video.src}
                poster={video.poster}
                className="aspect-[9/16] w-full object-cover"
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label={video.legenda}
              />
              <figcaption className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-4">
                <p className="font-display text-sm font-semibold text-white">{video.legenda}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/centromedicoviverbem"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] px-8 py-3.5 font-display text-sm font-semibold text-white shadow-card transition-transform duration-200 hover:scale-105"
          >
            <FaInstagram size={18} aria-hidden /> Siga @centromedicoviverbem
          </a>
        </div>
      </div>
    </section>
  );
}
