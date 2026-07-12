import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaInstagram, FaTimes, FaWhatsapp } from 'react-icons/fa';
import Logo from './ui/Logo.jsx';
import { useAgendamento } from '../context/AgendamentoContext.jsx';
import { LINK_WHATSAPP_GERAL, WHATSAPP_DISPLAY } from '../utils/whatsapp.js';

const LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#exames', label: 'Exames' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Contato' },
];

export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const [comSombra, setComSombra] = useState(false);
  const { abrirAgendamento } = useAgendamento();

  useEffect(() => {
    const onScroll = () => setComSombra(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${comSombra ? 'shadow-[0_4px_24px_rgba(28,43,146,0.10)]' : ''}`}>
      {/* Faixa superior de contato */}
      <div className="hidden md:block bg-navy text-white text-xs">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-1.5">
          <span aria-hidden />
          <p className="font-accent tracking-wide text-center">
            Cuidar é nossa especialidade, seu bem-estar é nossa missão 💙
          </p>
          <div className="flex items-center justify-end gap-5">
            <a
              href={LINK_WHATSAPP_GERAL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp do Centro Médico Viver Bem"
              className="hover:text-rose transition-colors"
            >
              <FaWhatsapp size={15} />
            </a>
            <a
              href="https://www.instagram.com/centromedicoviverbem"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do Centro Médico Viver Bem"
              className="hover:text-rose transition-colors"
            >
              <FaInstagram size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <nav aria-label="Navegação principal" className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-3">
        <a href="#inicio" aria-label="Voltar ao início">
          <Logo />
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-display text-[15px] font-medium text-text-dark hover:text-brand-red transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => abrirAgendamento('consulta')}
            className="rounded-full bg-navy px-6 py-2.5 font-display text-sm font-semibold text-white shadow-[0_6px_20px_rgba(28,43,146,0.3)] hover:bg-navy-light transition-colors cursor-pointer"
          >
            Agendar Consulta
          </motion.button>
        </div>

        <button
          className="lg:hidden text-navy p-2 cursor-pointer"
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
            <ul className="flex flex-col px-6 py-4 gap-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className="block rounded-xl px-4 py-3 font-display font-medium text-text-dark hover:bg-rose-soft hover:text-brand-red transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setAberto(false);
                    abrirAgendamento('consulta');
                  }}
                  className="w-full rounded-full bg-navy px-6 py-3 font-display text-sm font-semibold text-white cursor-pointer"
                >
                  Agendar Consulta
                </button>
                <a
                  href={LINK_WHATSAPP_GERAL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-display text-sm font-semibold text-white"
                >
                  <FaWhatsapp size={18} /> {WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
