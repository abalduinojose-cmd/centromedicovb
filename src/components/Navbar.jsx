import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaExternalLinkAlt, FaInstagram, FaTimes, FaWhatsapp } from 'react-icons/fa';
import Logo from './ui/Logo.jsx';
import CtaAgendar from './ui/CtaAgendar.jsx';
import { useAgendamento } from '../context/AgendamentoContext.jsx';
import { LINK_WHATSAPP_GERAL, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

/* Navegação principal: foco total em conversão (sem "Quem Somos" aqui). */
const LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#exames', label: 'Exames' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Contato' },
];

const INSTAGRAM_CLINICA = 'https://www.instagram.com/centromedicoviverbem';

export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const [comScroll, setComScroll] = useState(false);
  const { abrirAgendamento } = useAgendamento();

  useEffect(() => {
    const onScroll = () => setComScroll(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-white/85 backdrop-blur-xl transition-shadow duration-500 ${
        comScroll ? 'shadow-[0_1px_0_0_rgba(28,43,146,0.07),0_8px_30px_-12px_rgba(28,43,146,0.18)]' : ''
      }`}
    >
      {/* Faixa institucional: discreta, some ao rolar para dar foco ao menu */}
      <div
        className={`hidden overflow-hidden border-b border-white/10 bg-navy text-white transition-all duration-500 md:block ${
          comScroll ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-8 py-2">
          <span aria-hidden />
          <p className="text-center font-accent text-[11px] font-medium tracking-[0.14em] text-white/75">
            CUIDAR É NOSSA ESPECIALIDADE, SEU BEM-ESTAR É NOSSA MISSÃO
          </p>
          <div className="flex items-center justify-end gap-4">
            <a
              href={LINK_WHATSAPP_GERAL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp do Centro Médico Viver Bem"
              className="text-white/60 transition-colors hover:text-rose"
            >
              <FaWhatsapp size={14} />
            </a>
            <a
              href={INSTAGRAM_CLINICA}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do Centro Médico Viver Bem"
              className="text-white/60 transition-colors hover:text-rose"
            >
              <FaInstagram size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <nav
        aria-label="Navegação principal"
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 md:px-8 ${
          comScroll ? 'py-2.5' : 'py-4'
        }`}
      >
        <a href="#inicio" aria-label="Voltar ao início" className="shrink-0">
          <Logo />
        </a>

        <ul className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative block py-1 font-display text-[14.5px] font-medium text-text-dark/75 transition-colors duration-300 hover:text-navy"
              >
                {l.label}
                {/* Traço que cresce do centro — assinatura sutil da marca */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 mx-auto h-[2px] w-0 rounded-full bg-brand-red transition-all duration-300 group-hover:w-full"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <CtaAgendar tamanho="md" onClick={() => abrirAgendamento('consulta')} />
        </div>

        <button
          className="lg:hidden p-2 text-navy cursor-pointer"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        >
          {aberto ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-t border-gray-divider bg-white"
          >
            <ul className="flex max-h-[70vh] flex-col overflow-y-auto px-6 py-4 gap-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="block rounded-xl px-4 py-3 font-display font-medium text-text-dark transition-colors hover:bg-rose-soft hover:text-brand-red"
                  >
                    {l.label}
                  </a>
                </li>
              ))}

              {/* Institucional: abre em aba própria, fora do fluxo de conversão */}
              <li className="mt-2 border-t border-gray-divider pt-2">
                <a
                  href="#/quem-somos"
                  target="_blank"
                  rel="noopener"
                  onClick={() => setAberto(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 font-display font-medium text-text-dark transition-colors hover:bg-rose-soft hover:text-brand-red"
                >
                  Quem Somos
                  <FaExternalLinkAlt size={10} aria-hidden className="text-text-dark/35" />
                </a>
              </li>

              <li className="mt-3 flex flex-col gap-2 border-t border-gray-divider pt-3">
                <CtaAgendar
                  tamanho="md"
                  className="w-full"
                  onClick={() => {
                    setAberto(false);
                    abrirAgendamento('consulta');
                  }}
                />
                <a
                  href={LINK_WHATSAPP_GERAL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-navy/15 font-display text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                >
                  <FaWhatsapp size={16} aria-hidden /> {WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
