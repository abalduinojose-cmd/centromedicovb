import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import FadeIn from './ui/FadeIn.jsx';
import SectionTitle from './ui/SectionTitle.jsx';
import { LINK_WHATSAPP_GERAL, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const INFOS = [
  {
    icone: FaMapMarkerAlt,
    titulo: 'Endereço',
    texto: 'Estrada União e Indústria, 32.771 - Posse, Petrópolis - RJ',
  },
  { icone: FaPhoneAlt, titulo: 'Telefone', texto: WHATSAPP_DISPLAY, href: 'tel:+5524988477924' },
  { icone: FaWhatsapp, titulo: 'WhatsApp', texto: WHATSAPP_DISPLAY, href: LINK_WHATSAPP_GERAL },
  {
    icone: FaEnvelope,
    titulo: 'E-mail',
    texto: 'centromedicoviverbem@hotmail.com',
    href: 'mailto:centromedicoviverbem@hotmail.com',
  },
  { icone: FaClock, titulo: 'Horário', texto: 'Segunda a Sexta — 07h30 às 18h' },
];

export default function Localizacao() {
  return (
    <section id="contato" className="bg-gradient-to-b from-rose-light to-rose-soft py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionTitle
          etiqueta="Estamos esperando por você"
          titulo="Localização & Horários"
          descricao="Fácil acesso pela Estrada União e Indústria, no bairro Posse, em Petrópolis."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Mapa */}
          <FadeIn className="overflow-hidden rounded-3xl shadow-card min-h-[380px] bg-white">
            <iframe
              title="Mapa — Centro Médico Viver Bem, Estrada União e Indústria 32.771, Posse, Petrópolis - RJ"
              src="https://www.google.com/maps?q=Estrada+Uni%C3%A3o+e+Ind%C3%BAstria+32771+Posse+Petr%C3%B3polis+RJ&output=embed"
              className="h-full min-h-[380px] w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </FadeIn>

          {/* Informações */}
          <FadeIn delay={0.15}>
            <div className="grid h-full gap-4 rounded-3xl bg-white p-8 shadow-card sm:grid-cols-2">
              {INFOS.map((info) => {
                const Conteudo = (
                  <div className="flex h-full items-start gap-4 rounded-2xl p-4 transition-colors duration-200 hover:bg-rose-soft">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/[0.07] text-navy">
                      <info.icone size={19} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-navy">{info.titulo}</p>
                      <p className="mt-1 text-sm leading-relaxed text-text-dark/70 break-words">{info.texto}</p>
                    </div>
                  </div>
                );
                return info.href ? (
                  <a key={info.titulo} href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {Conteudo}
                  </a>
                ) : (
                  <div key={info.titulo}>{Conteudo}</div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
