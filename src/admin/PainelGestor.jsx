import { useMemo, useState } from 'react';
import {
  FaArrowUp, FaBell, FaCalendarCheck, FaChartLine, FaChartPie, FaCoins,
  FaExclamationTriangle, FaLock, FaMoneyBillWave, FaSignOutAlt, FaUserMd,
  FaUserPlus, FaUsers, FaWallet,
} from 'react-icons/fa';
import Logo from '../components/ui/Logo.jsx';
import { Area, BarrasHorizontais, BarrasVerticais, Donut } from './Graficos.jsx';
import { GRADE_PAINEL, SENHA_GESTOR } from './constantes.js';
import { nomeProfissional } from './store.js';
import { brl, dataBr, horaAgora, useEstado } from './usePainel.js';
import { toISODate } from '../utils/formatacao.js';

const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const CANCELADOS = ['cancelado', 'faltou'];

/* ---------- Login do gestor ---------- */

function LoginGestor({ aoEntrar }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const entrar = () => {
    if (nome.trim().length < 2) return setErro('Informe seu nome.');
    if (senha !== SENHA_GESTOR) return setErro('Senha incorreta.');
    sessionStorage.setItem('viverbem-gestor', nome.trim());
    aoEntrar(nome.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-dark bg-cross-pattern p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-elevated">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-5 text-center font-display text-lg font-bold text-navy">Painel Gerencial</h1>
        <p className="mt-1 text-center text-xs text-text-dark/50">Acesso exclusivo da gestão</p>
        <div className="mt-6 space-y-3">
          <input className="input-field" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="username" />
          <input
            className="input-field" type="password" placeholder="Senha do gestor"
            value={senha} onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()} autoComplete="current-password"
          />
          {erro && <p className="text-sm font-medium text-brand-red" role="alert">{erro}</p>}
          <button onClick={entrar} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-3 font-display text-sm font-semibold text-white hover:brightness-110 cursor-pointer">
            <FaLock size={12} aria-hidden /> Entrar como gestor
          </button>
        </div>
        <a href="#" className="mt-4 block text-center text-xs text-text-dark/40 hover:text-navy">← Voltar ao site</a>
      </div>
    </div>
  );
}

/* ---------- blocos ---------- */

function Kpi({ icone: Icone, rotulo, valor, detalhe, cor = 'text-navy', subiu }) {
  return (
    <div className="rounded-2xl border border-gray-divider bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 text-[11px] font-medium text-text-dark/50">
        <Icone className={cor} size={12} aria-hidden /> {rotulo}
      </div>
      <p className={`mt-1.5 font-display text-[22px] font-bold leading-none ${cor}`}>{valor}</p>
      {detalhe && (
        <p className="mt-1.5 flex items-center gap-1 text-[10.5px] text-text-dark/45">
          {subiu && <FaArrowUp className="text-[#16A34A]" size={8} aria-hidden />} {detalhe}
        </p>
      )}
    </div>
  );
}

function Cartao({ titulo, icone: Icone, children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-gray-divider bg-white p-5 shadow-soft ${className}`}>
      <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-navy">
        <Icone className="text-brand-red" size={13} aria-hidden /> {titulo}
      </h3>
      {children}
    </div>
  );
}

/* ---------- painel ---------- */

export default function PainelGestor() {
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem('viverbem-gestor') ?? '');
  const estado = useEstado();
  const hoje = toISODate(new Date());
  const agora = horaAgora();

  const dados = useMemo(() => {
    const ags = estado.agendamentos;
    const mes = hoje.slice(0, 7);
    const doMes = ags.filter((a) => a.data.startsWith(mes) && !CANCELADOS.includes(a.status));
    const doDia = ags.filter((a) => a.data === hoje && !CANCELADOS.includes(a.status));

    const dataPagamento = (a) => (a.pagoEm ? toISODate(new Date(a.pagoEm)) : a.data);
    const pagos = ags.filter((a) => a.statusPagamento === 'pago');
    const pagosMes = pagos.filter((a) => dataPagamento(a).startsWith(mes));
    const receitaMes = pagosMes.reduce((s, a) => s + a.valor, 0);
    const pendentes = ags.filter((a) => a.status === 'pagamento-pendente');
    const aReceber = pendentes.reduce((s, a) => s + a.valor, 0);
    const previstoMes = doMes.reduce((s, a) => s + a.valor, 0);
    const ticket = pagosMes.length ? receitaMes / pagosMes.length : 0;

    // Comparecimento
    const encerrados = ags.filter((a) => a.data <= hoje && !['agendado', 'confirmado', 'chegou', 'em-atendimento'].includes(a.status));
    const faltas = encerrados.filter((a) => CANCELADOS.includes(a.status)).length;
    const taxaComparecimento = encerrados.length ? Math.round(((encerrados.length - faltas) / encerrados.length) * 100) : 100;

    // Pacientes
    const totalPacientes = estado.pacientes.length;
    const novosMes = estado.pacientes.filter((p) => {
      const ts = p.historico?.[0]?.ts;
      return ts && toISODate(new Date(ts)).startsWith(mes);
    }).length;

    // Receita últimos 7 dias
    const receita7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const iso = toISODate(d);
      return {
        rotulo: DIAS_CURTOS[d.getDay()],
        valor: pagos.filter((a) => dataPagamento(a) === iso).reduce((s, a) => s + a.valor, 0),
      };
    });

    // Atendimentos próximos 7 dias (ocupação futura)
    const proximos7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = toISODate(d);
      return {
        rotulo: i === 0 ? 'Hoje' : DIAS_CURTOS[d.getDay()],
        iso,
        valor: ags.filter((a) => a.data === iso && !CANCELADOS.includes(a.status)).length,
      };
    });

    // Rankings do mês
    const porProf = {};
    const porServico = {};
    doMes.forEach((a) => {
      porProf[a.medicoId] = (porProf[a.medicoId] ?? 0) + 1;
      porServico[a.servico] = (porServico[a.servico] ?? 0) + a.valor;
    });
    const topProf = Object.entries(porProf).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([id, v]) => ({ rotulo: nomeProfissional(id), valor: v }));
    const topServico = Object.entries(porServico).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([s, v]) => ({ rotulo: s, valor: v }));

    // Donut de status (mês)
    const conta = (ids) => doMes.filter((a) => ids.includes(a.status)).length;
    const donut = [
      { rotulo: 'Finalizados', valor: conta(['finalizado', 'pagamento-recebido']), cor: '#16A34A' },
      { rotulo: 'Em andamento', valor: conta(['chegou', 'em-atendimento', 'concluido']), cor: '#D97706' },
      { rotulo: 'Agendados', valor: conta(['agendado', 'confirmado']), cor: '#2563EB' },
      { rotulo: 'Pgto. pendente', valor: conta(['pagamento-pendente']), cor: '#E11D48' },
    ];

    // Alertas inteligentes
    const alertas = [];
    if (pendentes.length) alertas.push({ nivel: 'alto', texto: `${pendentes.length} pagamento(s) pendente(s) somando ${brl(aReceber)}.` });
    const atrasados = doDia.filter((a) => ['agendado', 'confirmado'].includes(a.status) && a.hora < agora);
    if (atrasados.length) alertas.push({ nivel: 'alto', texto: `${atrasados.length} paciente(s) atrasado(s) agora na agenda de hoje.` });
    const chaves = new Set(); let conflitos = 0;
    ags.filter((a) => a.data >= hoje && !CANCELADOS.includes(a.status)).forEach((a) => {
      const k = `${a.medicoId}|${a.data}|${a.hora}`;
      if (chaves.has(k)) conflitos++; else chaves.add(k);
    });
    if (conflitos) alertas.push({ nivel: 'alto', texto: `${conflitos} conflito(s) de horário detectado(s) na agenda futura.` });
    if (encerrados.length >= 5 && 100 - taxaComparecimento > 15)
      alertas.push({ nivel: 'medio', texto: `Taxa de faltas em ${100 - taxaComparecimento}% — considere reforçar as confirmações por WhatsApp.` });
    const diasVazios = proximos7.slice(1).filter((d) => {
      const dow = new Date(d.iso + 'T12:00:00').getDay();
      return dow >= 1 && dow <= 5 && d.valor <= 2;
    });
    if (diasVazios.length)
      alertas.push({ nivel: 'info', texto: `Agenda com baixa ocupação em: ${diasVazios.map((d) => dataBr(d.iso).slice(0, 5)).join(', ')} — oportunidade para campanhas.` });
    if (!alertas.length) alertas.push({ nivel: 'ok', texto: 'Nenhum alerta no momento. Operação em dia! ✅' });

    // Ocupação de hoje
    const ocupacao = Math.round((doDia.length / GRADE_PAINEL.length) * 100);

    // Listas rápidas
    const proximosHoje = doDia
      .filter((a) => ['agendado', 'confirmado', 'chegou'].includes(a.status) && a.hora >= agora)
      .sort((a, b) => a.hora.localeCompare(b.hora)).slice(0, 6);
    const ultimosPagamentos = [...pagos]
      .sort((a, b) => (b.pagoEm ?? 0) - (a.pagoEm ?? 0) || b.data.localeCompare(a.data)).slice(0, 6);

    return {
      receitaMes, aReceber, previstoMes, ticket, taxaComparecimento, totalPacientes, novosMes,
      doMes, doDia, receita7, proximos7, topProf, topServico, donut, alertas, ocupacao,
      proximosHoje, ultimosPagamentos, pagosMes,
    };
  }, [estado, hoje, agora]);

  if (!usuario) return <LoginGestor aoEntrar={setUsuario} />;

  const nomePaciente = (id) => estado.pacientes.find((p) => p.id === id)?.nome ?? '—';
  const COR_ALERTA = { alto: 'border-brand-red/30 bg-rose-soft text-brand-red', medio: 'border-amber-300 bg-amber-50 text-amber-700', info: 'border-blue-200 bg-blue-50 text-blue-700', ok: 'border-green-200 bg-green-50 text-green-700' };

  return (
    <div className="min-h-screen bg-gray-support">
      {/* Topo */}
      <header className="sticky top-0 z-40 border-b border-gray-divider bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 md:px-6">
          <Logo />
          <div className="ml-1">
            <h1 className="font-display text-base font-bold leading-tight text-navy">Painel Gerencial</h1>
            <p className="text-[11px] text-text-dark/50">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-display font-bold text-green-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /> TEMPO REAL
            </span>
            <span className="hidden rounded-full bg-rose-light px-3 py-1.5 text-[10px] font-display font-bold text-brand-red sm:inline">
              MODO DEMONSTRAÇÃO
            </span>
            <button
              onClick={() => { sessionStorage.removeItem('viverbem-gestor'); setUsuario(''); }}
              className="flex items-center gap-1.5 rounded-full border border-gray-divider px-3 py-1.5 text-[11px] font-display font-semibold text-text-dark/60 hover:border-navy hover:text-navy cursor-pointer"
            >
              <FaSignOutAlt size={10} aria-hidden /> Sair ({usuario})
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 md:px-6">
        {/* Alertas inteligentes */}
        <Cartao titulo="Alertas inteligentes" icone={FaBell}>
          <div className="grid gap-2 md:grid-cols-2">
            {dados.alertas.map((a, i) => (
              <p key={i} className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${COR_ALERTA[a.nivel]}`}>
                <FaExclamationTriangle size={11} className="mt-0.5 shrink-0" aria-hidden /> {a.texto}
              </p>
            ))}
          </div>
        </Cartao>

        {/* KPIs financeiros e operacionais */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kpi icone={FaMoneyBillWave} rotulo="Receita do mês" valor={brl(dados.receitaMes)} detalhe={`${dados.pagosMes.length} pagamento(s) confirmados`} cor="text-[#16A34A]" subiu />
          <Kpi icone={FaWallet} rotulo="A receber" valor={brl(dados.aReceber)} detalhe="Pagamentos pendentes" cor="text-brand-red" />
          <Kpi icone={FaCoins} rotulo="Previsto no mês" valor={brl(dados.previstoMes)} detalhe="Todos os atendimentos do mês" />
          <Kpi icone={FaChartLine} rotulo="Ticket médio" valor={brl(dados.ticket)} detalhe="Por atendimento pago" />
          <Kpi icone={FaCalendarCheck} rotulo="Atendimentos no mês" valor={dados.doMes.length} detalhe={`${dados.doDia.length} hoje`} />
          <Kpi icone={FaChartPie} rotulo="Ocupação de hoje" valor={`${dados.ocupacao}%`} detalhe={`${dados.doDia.length} de ${GRADE_PAINEL.length} horários`} />
          <Kpi icone={FaUsers} rotulo="Pacientes cadastrados" valor={dados.totalPacientes} detalhe={`${dados.novosMes} novo(s) no mês`} />
          <Kpi icone={FaUserPlus} rotulo="Comparecimento" valor={`${dados.taxaComparecimento}%`} detalhe="Histórico geral" cor={dados.taxaComparecimento >= 85 ? 'text-[#16A34A]' : 'text-brand-red'} />
        </div>

        {/* Gráficos */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Cartao titulo="Receita — últimos 7 dias" icone={FaMoneyBillWave}>
            <BarrasVerticais dados={dados.receita7} cor="#16A34A" formato={brl} />
          </Cartao>
          <Cartao titulo="Agenda — próximos 7 dias" icone={FaCalendarCheck}>
            <Area dados={dados.proximos7} cor="#1C2B92" formato={(v) => `${v} atend.`} />
          </Cartao>
          <Cartao titulo="Situação dos atendimentos do mês" icone={FaChartPie}>
            <Donut dados={dados.donut} centro="no mês" />
          </Cartao>
          <Cartao titulo="Receita por serviço (mês)" icone={FaCoins}>
            <BarrasHorizontais dados={dados.topServico} cor="#E60B18" formato={brl} />
          </Cartao>
          <Cartao titulo="Atendimentos por profissional (mês)" icone={FaUserMd}>
            <BarrasHorizontais dados={dados.topProf} cor="#1C2B92" formato={(v) => `${v}`} />
          </Cartao>

          {/* Listas rápidas */}
          <div className="grid gap-5">
            <Cartao titulo="Próximos atendimentos de hoje" icone={FaCalendarCheck}>
              <ul className="divide-y divide-gray-divider">
                {dados.proximosHoje.length === 0 && <li className="py-3 text-center text-xs text-text-dark/40">Nada pendente para hoje.</li>}
                {dados.proximosHoje.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-2 text-xs">
                    <span className="font-display font-bold text-navy">{a.hora}</span>
                    <span className="min-w-0 flex-1 truncate text-text-dark/75">{nomePaciente(a.pacienteId)} · {a.servico}</span>
                    <span className="shrink-0 text-text-dark/45">{nomeProfissional(a.medicoId)}</span>
                  </li>
                ))}
              </ul>
            </Cartao>
            <Cartao titulo="Últimos pagamentos recebidos" icone={FaMoneyBillWave}>
              <ul className="divide-y divide-gray-divider">
                {dados.ultimosPagamentos.length === 0 && <li className="py-3 text-center text-xs text-text-dark/40">Nenhum pagamento registrado.</li>}
                {dados.ultimosPagamentos.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-2 text-xs">
                    <span className="min-w-0 flex-1 truncate text-text-dark/75">{nomePaciente(a.pacienteId)} · {a.servico}</span>
                    <span className="shrink-0 text-text-dark/45">{dataBr(a.data)}</span>
                    <span className="shrink-0 font-display font-bold text-[#16A34A]">{brl(a.valor)}</span>
                  </li>
                ))}
              </ul>
            </Cartao>
          </div>
        </div>

        <p className="pb-4 text-center text-[10.5px] text-text-dark/40">
          Os dados refletem o mesmo sistema usado pela recepção e são atualizados em tempo real, sem recarregar a página.
        </p>
      </main>
    </div>
  );
}
