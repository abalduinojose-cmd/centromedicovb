import { useState } from 'react';
import {
  FaCalendarAlt, FaChartPie, FaCog, FaLock, FaSignOutAlt, FaUsers,
} from 'react-icons/fa';
import Logo from '../components/ui/Logo.jsx';
import Dashboard from './Dashboard.jsx';
import Agenda from './Agenda.jsx';
import Pacientes from './Pacientes.jsx';
import AgendamentoForm from './AgendamentoForm.jsx';
import { SENHA_PAINEL } from './constantes.js';
import { salvarConfig, zerarDemonstracao } from './store.js';
import { useEstado } from './usePainel.js';
import { toISODate } from '../utils/formatacao.js';

/* ---------- Login ---------- */

function Login({ aoEntrar }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const entrar = () => {
    if (nome.trim().length < 2) return setErro('Informe seu nome (aparece nos registros).');
    if (senha !== SENHA_PAINEL) return setErro('Senha incorreta.');
    sessionStorage.setItem('viverbem-usuario', nome.trim());
    aoEntrar(nome.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy bg-cross-pattern p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-elevated">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-5 text-center font-display text-lg font-bold text-navy">Painel da Recepção</h1>
        <p className="mt-1 text-center text-xs text-text-dark/50">Acesso restrito à equipe</p>
        <div className="mt-6 space-y-3">
          <input
            className="input-field"
            placeholder="Seu nome (ex.: Fernanda)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="username"
          />
          <input
            className="input-field"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
            autoComplete="current-password"
          />
          {erro && <p className="text-sm font-medium text-brand-red" role="alert">{erro}</p>}
          <button onClick={entrar} className="flex w-full items-center justify-center gap-2 rounded-full bg-navy py-3 font-display text-sm font-semibold text-white hover:bg-navy-light cursor-pointer">
            <FaLock size={12} aria-hidden /> Entrar
          </button>
        </div>
        <a href="#" className="mt-4 block text-center text-xs text-text-dark/40 hover:text-navy">← Voltar ao site</a>
      </div>
    </div>
  );
}

/* ---------- Configurações ---------- */

function Configuracoes() {
  const estado = useEstado();
  const [modelo, setModelo] = useState(estado.config.modeloMensagem);
  const [salvo, setSalvo] = useState(false);

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-3xl border border-gray-divider bg-white p-5 shadow-soft">
        <h3 className="font-display text-sm font-bold text-navy">Mensagem automática de pagamento</h3>
        <p className="mt-1 text-xs text-text-dark/55">
          Enviada pelo WhatsApp quando o status muda para <strong>"Pagamento recebido"</strong>.
          Variáveis: <code className="rounded bg-gray-support px-1">{'{{Nome}}'}</code>{' '}
          <code className="rounded bg-gray-support px-1">{'{{Data}}'}</code>{' '}
          <code className="rounded bg-gray-support px-1">{'{{Clinica}}'}</code>
        </p>
        <textarea
          rows={6}
          className="input-field mt-3 resize-none text-xs"
          value={modelo}
          onChange={(e) => { setModelo(e.target.value); setSalvo(false); }}
        />
        <button
          onClick={() => { salvarConfig({ modeloMensagem: modelo }); setSalvo(true); }}
          className="mt-3 rounded-full bg-navy px-6 py-2 font-display text-xs font-semibold text-white hover:bg-navy-light cursor-pointer"
        >
          {salvo ? 'Salvo ✓' : 'Salvar modelo'}
        </button>
      </div>

      <div className="rounded-3xl border border-gray-divider bg-white p-5 shadow-soft">
        <h3 className="font-display text-sm font-bold text-navy">Dados de demonstração</h3>
        <p className="mt-1 text-xs text-text-dark/55">
          Este painel está em modo demonstração: os dados ficam salvos apenas neste computador
          (a estrutura já está pronta para integração com banco de dados na nuvem, prontuário
          eletrônico, WhatsApp oficial, recibos e NF-e).
        </p>
        <button
          onClick={() => { if (confirm('Restaurar os dados de demonstração? As alterações feitas serão perdidas.')) zerarDemonstracao(); }}
          className="mt-3 rounded-full border border-brand-red px-6 py-2 font-display text-xs font-semibold text-brand-red hover:bg-brand-red hover:text-white cursor-pointer"
        >
          Restaurar demonstração
        </button>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */

const ABAS = [
  { id: 'dashboard', label: 'Dashboard', Icone: FaChartPie },
  { id: 'agenda', label: 'Agenda', Icone: FaCalendarAlt },
  { id: 'pacientes', label: 'Pacientes', Icone: FaUsers },
  { id: 'config', label: 'Configurações', Icone: FaCog },
];

export default function PainelAdmin() {
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem('viverbem-usuario') ?? '');
  const [aba, setAba] = useState('dashboard');
  const [formAberto, setFormAberto] = useState(null); // objeto inicial do AgendamentoForm
  const [dataFoco, setDataFoco] = useState(() => toISODate(new Date()));
  const [pacienteAberto, setPacienteAberto] = useState(null);

  if (!usuario) return <Login aoEntrar={setUsuario} />;

  const sair = () => {
    sessionStorage.removeItem('viverbem-usuario');
    setUsuario('');
  };

  return (
    <div className="flex min-h-screen bg-gray-support">
      {/* Menu lateral */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center gap-1 bg-navy py-4 md:w-52 md:items-stretch md:px-3">
        <div className="mb-4 hidden justify-center rounded-2xl bg-white p-2 md:flex">
          <Logo />
        </div>
        {ABAS.map(({ id, label, Icone }) => (
          <button
            key={id}
            onClick={() => { setAba(id); setPacienteAberto(null); }}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm font-semibold transition-colors cursor-pointer ${
              aba === id ? 'bg-white/15 text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icone size={15} aria-hidden className="mx-auto md:mx-0" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
        <div className="mt-auto space-y-1">
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-xs text-white/45 hover:text-white">
            <span className="mx-auto md:mx-0">↗</span><span className="hidden md:inline">Ver o site</span>
          </a>
          <button onClick={sair} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-display text-xs text-white/45 hover:text-white cursor-pointer">
            <FaSignOutAlt size={13} aria-hidden className="mx-auto md:mx-0" />
            <span className="hidden md:inline">Sair ({usuario})</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="ml-16 flex-1 p-4 md:ml-52 md:p-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-xl font-bold text-navy">
              {ABAS.find((a) => a.id === aba)?.label}
            </h1>
            <p className="text-xs text-text-dark/50">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · operando como <strong>{usuario}</strong>
            </p>
          </div>
          <span className="rounded-full bg-rose-light px-3 py-1.5 text-[11px] font-display font-bold text-brand-red">
            MODO DEMONSTRAÇÃO
          </span>
        </header>

        {aba === 'dashboard' && <Dashboard usuario={usuario} aoAbrirAgendamento={setFormAberto} />}
        {aba === 'agenda' && (
          <Agenda
            usuario={usuario}
            aoAbrirAgendamento={setFormAberto}
            aoEditarAgendamento={setFormAberto}
            dataFoco={dataFoco}
            setDataFoco={setDataFoco}
          />
        )}
        {aba === 'pacientes' && (
          <Pacientes
            usuario={usuario}
            aoAbrirAgendamento={setFormAberto}
            pacienteAberto={pacienteAberto}
            setPacienteAberto={setPacienteAberto}
          />
        )}
        {aba === 'config' && <Configuracoes />}
      </main>

      {formAberto && (
        <AgendamentoForm inicial={formAberto} usuario={usuario} aoFechar={() => setFormAberto(null)} />
      )}
    </div>
  );
}
