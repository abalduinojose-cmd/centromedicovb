import { FaEnvelope, FaExternalLinkAlt, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import Logo from './ui/Logo.jsx';
import { RECURSOS } from '../config.js';
import { LINK_WHATSAPP_GERAL, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const LINKS_RAPIDOS = [
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#exames', label: 'Exames' },
  { href: '#ultrassonografia', label: 'Ultrassonografia' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#contato', label: 'Contato' },
  // Institucional: abre em aba própria para não tirar o visitante do fluxo
  { href: '#/quem-somos', label: 'Quem Somos', novaAba: true },
];

export default function Footer() {
  return (
    <footer className="bg-navy bg-cross-pattern text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marca */}
        <div>
          <Logo variante="claro" />
          <p className="mt-5 font-accent font-medium text-[15px] text-rose leading-relaxed">
            Cuidar é nossa especialidade, seu bem-estar é nossa missão.
          </p>
        </div>

        {/* Links rápidos */}
        <nav aria-label="Links rápidos">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-rose">Links Rápidos</h3>
          <ul className="mt-5 space-y-3">
            {LINKS_RAPIDOS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  {...(l.novaAba ? { target: '_blank', rel: 'noopener' } : {})}
                  className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
                >
                  {l.label}
                  {l.novaAba && <FaExternalLinkAlt size={9} aria-hidden className="text-white/35" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contato */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-rose">Contato</h3>
          <ul className="mt-5 space-y-3.5 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-rose" aria-hidden />
              Estrada União e Indústria, 32.771 - Posse, Petrópolis - RJ
            </li>
            <li>
              <a href={LINK_WHATSAPP_GERAL} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-white">
                <FaWhatsapp className="shrink-0 text-rose" aria-hidden /> {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href="mailto:centromedicoviverbem@hotmail.com" className="flex items-center gap-3 transition-colors hover:text-white break-all">
                <FaEnvelope className="shrink-0 text-rose" aria-hidden /> centromedicoviverbem@hotmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-rose">Redes Sociais</h3>
          <p className="mt-5 text-sm text-white/70">Acompanhe novidades, dicas de saúde e bastidores da clínica.</p>
          <div className="mt-5 flex gap-3">
            <a
              href={LINK_WHATSAPP_GERAL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-brand-red hover:scale-110"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href="https://www.instagram.com/centromedicoviverbem"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-brand-red hover:scale-110"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100063486104649"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-brand-red hover:scale-110"
            >
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex flex-col items-center gap-1 px-4 md:px-6 py-6 text-center text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© 2026 Centro Médico Viver Bem. Todos os direitos reservados.</p>
          {RECURSOS.paineis && (
            <a href="#/admin" className="text-white/30 transition-colors hover:text-white/70">
              Área da recepção
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
