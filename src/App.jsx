import { AgendamentoProvider } from './context/AgendamentoContext.jsx';
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
