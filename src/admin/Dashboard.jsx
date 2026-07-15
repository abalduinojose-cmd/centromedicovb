import { useMemo } from 'react';
import {
  FaCalendarCheck, FaCheckDouble, FaClock, FaHourglassHalf, FaMoneyBillWave,
  FaExclamationTriangle, FaUserClock, FaUserMd, FaWallet, FaChartLine,
} from 'react-icons/fa';
import { Badge, StatusMenu } from './StatusBadge.jsx';
import { GRADE_PAINEL } from './constantes.js';
import { mudarStatus, nomeProfissional } from './store.js';
import { brl, horaAgora, useEstado } from './usePainel.js';
import { toISODate } from '../utils/formatacao.js';

const ATIVOS = ['agendado', 'confirmado', 'chegou', 'em-atendimento', 'concluido', 'pagamento-pendente', 'pagamento-recebido', 'finalizado'];

function Indicador({ icone: Icone, rotulo, valor, detalhe, cor = 'text-navy', destaque }) {
  return (
    <div className={`rounded-2xl border border-gray-divider bg-white p-4 shadow-soft ${destaque ? 'ring-2 ring-brand-red/30' : ''}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-text-dark/50">
        <Icone className={cor} size={13} aria-hidden /> {rotulo}
      </div>
      <p className={`mt-1.5 font-display text-2xl font-bold ${cor}`}>{valor}</p>
      {detalhe && <p className="mt-0.5 text-[11px] text-text-dark/45">{detalhe}</p>}
    </div>
  );
}

export default function Dashboard({ usuario, aoAbrirAgendamento }) {
  const estado = useEstado();
  const hoje = toISODate(new Date());
  const agora = horaAgora();

  const m = useMemo(() => {
    const doDia = estado.agendamentos.filter((a) => a.data === hoje && ATIVOS.includes(a.status));
    const porStatus = (ids) => doDia.filter((a) => ids.includes(a.status));
    const atrasados = doDia.filter((a) => ['agendado', 'confirmado'].includes(a.status) && a.hora < agora);
    const proximos = doDia
      .filter((a) => ['agendado', 'confirmado', 'chegou'].includes(a.status) && a.hora >= agora)
      .sort((a, b) => a.hora.localeCompare(b.hora));
    const ocupados = new Set(doDia.map((a) => a.hora));
    const livres = GRADE_PAINEL.filter((h) => !ocupados.has(h) && h >= agora);

    const passados = estado.agendamentos.filter((a) => a.data <= hoje && !['agendado', 'confirmado', 'chegou', 'em-atendimento'].includes(a.status));
    const compareceu = passados.filter((a) => a.status !== 'faltou' && a.status !== 'cancelado').length;
    const taxa = passados.length ? Math.round((compareceu / passados.length) * 100) : 100;

    const pendentes = estado.agendamentos.filter((a) => a.status === 'pagamento-pendente');
    const recebidosHoje = estado.agendamentos.filter((a) => a.statusPagamento === 'pago' && a.pagoEm && toISODate(new Date(a.pagoEm)) === hoje);

    return { doDia, porStatus, atrasados, proximos, livres, taxa, pendentes, recebidosHoje };
  }, [estado, hoje, agora]);

  const proximoPaciente = m.proximos[0];
  const nomePaciente = (id) => estado.pacientes.find((p) => p.id === id)?.nome ?? '—';

  const mudar = (agendamentoId, novoStatus) => {
    const { linkWhatsApp } = mudarStatus(agendamentoId, novoStatus, usuario);
    if (linkWhatsApp) window.open(linkWhatsApp, '_blank', 'noopener');
  };

  return (
    <div className="space-y-6">
      {/* Indicadores em tempo real */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Indicador icone={FaCalendarCheck} rotulo="Atendimentos hoje" valor={m.doDia.length} />
        <Indicador
          icone={FaUserClock}
          rotulo="Próximo paciente"
          valor={proximoPaciente ? proximoPaciente.hora : '—'}
          detalhe={proximoPaciente ? nomePaciente(proximoPaciente.pacienteId) : 'Nenhum pendente'}
          cor="text-brand-red"
        />
        <Indicador icone={FaHourglassHalf} rotulo="Aguardando" valor={m.porStatus(['chegou']).length} detalhe="Pacientes na recepção" cor="text-[#7C3AED]" />
        <Indicador icone={FaUserMd} rotulo="Em atendimento" valor={m.porStatus(['em-atendimento']).length} cor="text-[#D97706]" />
        <Indicador icone={FaCheckDouble} rotulo="Finalizados hoje" valor={m.porStatus(['finalizado', 'pagamento-recebido']).length} cor="text-[#16A34A]" />
        <Indicador
          icone={FaWallet}
          rotulo="Pagamentos pendentes"
          valor={m.pendentes.length}
          detalhe={brl(m.pendentes.reduce((s, a) => s + a.valor, 0))}
          cor="text-[#E11D48]"
          destaque={m.pendentes.length > 0}
        />
        <Indicador
          icone={FaMoneyBillWave}
          rotulo="Recebido hoje"
          valor={brl(m.recebidosHoje.reduce((s, a) => s + a.valor, 0))}
          detalhe={`${m.recebidosHoje.length} pagamento(s)`}
          cor="text-[#16A34A]"
        />
        <Indicador icone={FaChartLine} rotulo="Taxa de comparecimento" valor={`${m.taxa}%`} detalhe="Histórico geral" />
        <Indicador icone={FaClock} rotulo="Horários livres hoje" valor={m.livres.length} detalhe={m.livres.slice(0, 4).join(' · ') || 'Dia encerrado'} />
        <Indicador
          icone={FaExclamationTriangle}
          rotulo="Atrasos"
          valor={m.atrasados.length}
          detalhe={m.atrasados.length ? 'Pacientes não chegaram' : 'Tudo em dia'}
          cor={m.atrasados.length ? 'text-brand-red' : 'text-navy'}
          destaque={m.atrasados.length > 0}
        />
      </div>

      {/* Fila do dia */}
      <div className="rounded-3xl border border-gray-divider bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-gray-divider px-5 py-3.5">
          <h3 className="font-display text-sm font-bold text-navy">Fila de hoje</h3>
          <button onClick={() => aoAbrirAgendamento({ data: hoje })} className="rounded-full bg-brand-red px-4 py-1.5 font-display text-xs font-semibold text-white hover:brightness-110 cursor-pointer">
            + Novo atendimento
          </button>
        </div>
        {m.doDia.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-text-dark/50">Nenhum atendimento agendado para hoje.</p>
        ) : (
          <ul className="divide-y divide-gray-divider">
            {[...m.doDia].sort((a, b) => a.hora.localeCompare(b.hora)).map((a) => {
              const atrasado = ['agendado', 'confirmado'].includes(a.status) && a.hora < agora;
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
                  <span className={`font-display text-sm font-bold ${atrasado ? 'text-brand-red' : 'text-navy'}`}>{a.hora}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-text-dark">
                      {nomePaciente(a.pacienteId)}
                      {atrasado && <span className="ml-2 rounded-full bg-rose-light px-2 py-0.5 text-[10px] font-bold text-brand-red">ATRASADO</span>}
                    </p>
                    <p className="truncate text-xs text-text-dark/55">{a.servico} · {nomeProfissional(a.medicoId)} · {brl(a.valor)}</p>
                  </div>
                  <Badge status={a.status} />
                  <StatusMenu agendamento={a} onMudar={(s) => mudar(a.id, s)} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
