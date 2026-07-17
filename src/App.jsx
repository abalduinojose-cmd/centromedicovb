import { lazy, Suspense, useEffect, useState } from 'react';
import { RECURSOS } from './config.js';
import { AgendamentoProvider } from './context/AgendamentoContext.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Ultrassonografia from './components/Ultrassonografia.jsx';
import Exames from './components/Exames.jsx';
import ExamesComplementares from './components/ExamesComplementares.jsx';
import Especialidades from './components/Especialidades.jsx';
import Equipe from './components/Equipe.jsx';
import Videos from './components/Videos.jsx';
import Diferenciais from './components/Diferenciais.jsx';
import Localizacao from './components/Localizacao.jsx';
import QuemSomos from './components/QuemSomos.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import AgendamentoModal from './components/Modal/AgendamentoModal.jsx';
import SuccessModal from './components/Modal/SuccessModal.jsx';

// Painéis carregados sob demanda: com RECURSOS.paineis desligado, o navegador
// nem chega a baixar esse código.
const PainelAdmin = lazy(() => import('./admin/PainelAdmin.jsx'));
const PainelGestor = lazy(() => import('./admin/PainelGestor.jsx'));

const Carregando = () => (
  <div className="flex min-h-screen items-center justify-center bg-navy">
    <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
  </div>
);

export default function App() {
  // Rota por hash: #/admin (recepção) e #/gestor (gestão) — funciona em qualquer hospedagem
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (RECURSOS.paineis && hash.startsWith('#/admin')) {
    return <Suspense fallback={<Carregando />}><PainelAdmin /></Suspense>;
  }
  if (RECURSOS.paineis && hash.startsWith('#/gestor')) {
    return <Suspense fallback={<Carregando />}><PainelGestor /></Suspense>;
  }

  // Página institucional: abre em aba própria a partir do rodapé e do menu mobile
  const ehQuemSomos = hash.startsWith('#/quem-somos');

  return (
    <AgendamentoProvider>
      <Navbar />
      <main>
        {ehQuemSomos ? (
          <QuemSomos />
        ) : (
          <>
            <Hero />
            <Especialidades />
            <Ultrassonografia />
            <Exames />
            <ExamesComplementares />
            <Equipe />
            <Videos />
            <Diferenciais />
            <Localizacao />
          </>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
      {RECURSOS.agendamentoOnline && (
        <>
          <AgendamentoModal />
          <SuccessModal />
        </>
      )}
    </AgendamentoProvider>
  );
}
