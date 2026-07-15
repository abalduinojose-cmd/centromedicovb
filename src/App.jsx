import { useEffect, useState } from 'react';
import { AgendamentoProvider } from './context/AgendamentoContext.jsx';
import PainelAdmin from './admin/PainelAdmin.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Ultrassonografia from './components/Ultrassonografia.jsx';
import Exames from './components/Exames.jsx';
import Especialidades from './components/Especialidades.jsx';
import Equipe from './components/Equipe.jsx';
import Videos from './components/Videos.jsx';
import Diferenciais from './components/Diferenciais.jsx';
import Localizacao from './components/Localizacao.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import AgendamentoModal from './components/Modal/AgendamentoModal.jsx';
import SuccessModal from './components/Modal/SuccessModal.jsx';

export default function App() {
  // Rota por hash: #/admin abre o Painel da Recepção (funciona em qualquer hospedagem)
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (hash.startsWith('#/admin')) return <PainelAdmin />;

  return (
    <AgendamentoProvider>
      <Navbar />
      <main>
        <Hero />
        <Especialidades />
        <Ultrassonografia />
        <Exames />
        <Equipe />
        <Videos />
        <Diferenciais />
        <Localizacao />
      </main>
      <Footer />
      <WhatsAppFloat />
      <AgendamentoModal />
      <SuccessModal />
    </AgendamentoProvider>
  );
}
