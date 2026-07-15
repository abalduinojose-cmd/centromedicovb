import { useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaSearch } from 'react-icons/fa';
import { medicos } from '../data/medicos.js';
import { Badge, StatusMenu } from './StatusBadge.jsx';
import { FLUXO_STATUS, GRADE_PAINEL } from './constantes.js';
import { atualizarAgendamento, existeConflito, mudarStatus, nomeProfissional } from './store.js';
import { brl, dataBr, useEstado } from './usePainel.js';
import { toISODate } from '../utils/formatacao.js';

const OCULTOS_PADRAO = ['cancelado', 'faltou'];
const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const deISO = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};

function inicioDaSemana(iso) {
  const d = deISO(iso);
  const dif = (d.getDay() + 6) % 7; // segunda-feira
  d.setDate(d.getDate() - dif);
  return d;
}

/** Cartão de atendimento arrastável. */
function Cartao({ a, paciente, compacto, onEditar, onMudar }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', a.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="group cursor-grab rounded-xl border border-gray-divider bg-white p-2.5 shadow-soft transition-shadow hover:shadow-card active:cursor-grabbing"
      title="Arraste para reagendar · clique para editar"
    >
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => onEditar(a)} className="min-w-0 flex-1 text-left cursor-pointer">
          <p className="truncate font-display text-xs font-bold text-navy">{paciente?.nome ?? '—'}</p>
          <p className="truncate text-[11px] text-text-dark/55">{a.servico}</p>
          {!compacto && <p className="truncate text-[10px] text-text-dark/45">{nomeProfissional(a.medicoId)} · {brl(a.valor)}</p>}
        </button>
        {!compacto && <StatusMenu agendamento={a} onMudar={(s) => onMudar(a.id, s)} />}
      </div>
      <div className="mt-1.5"><Badge status={a.status} /></div>
    </div>
  );
}

export default function Agenda({ usuario, aoAbrirAgendamento, aoEditarAgendamento, dataFoco, setDataFoco }) {
  const estado = useEstado();
  const [visao, setVisao] = useState('dia'); // dia | semana | mes
  const [busca, setBusca] = useState('');
  const [filtroProf, setFiltroProf] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return estado.agendamentos.filter((a) => {
      if (filtroStatus ? a.status !== filtroStatus : OCULTOS_PADRAO.includes(a.status)) return false;
      if (filtroProf && String(a.medicoId) !== filtroProf) return false;
      if (termo) {
        const pac = estado.pacientes.find((p) => p.id === a.pacienteId);
        const alvo = `${pac?.nome ?? ''} ${pac?.telefone ?? ''} ${nomeProfissional(a.medicoId)} ${a.servico}`.toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });
  }, [estado, busca, filtroProf, filtroStatus]);

  const pacDe = (a) => estado.pacientes.find((p) => p.id === a.pacienteId);

  const navegar = (passo) => {
    const d = deISO(dataFoco);
    d.setDate(d.getDate() + passo * (visao === 'dia' ? 1 : visao === 'semana' ? 7 : 30));
    setDataFoco(toISODate(d));
  };

  const soltar = (e, data, hora) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const a = estado.agendamentos.find((x) => x.id === id);
    if (!a || (a.data === data && a.hora === hora)) return;
    if (existeConflito({ medicoId: a.medicoId, data, hora, ignorarId: id })) {
      alert(`⚠️ Conflito de horário!\n${nomeProfissional(a.medicoId)} já possui atendimento em ${dataBr(data)} às ${hora}.`);
      return;
    }
    atualizarAgendamento(id, { data, hora }, usuario);
  };

  const mudar = (id, s) => {
    const { linkWhatsApp } = mudarStatus(id, s, usuario);
    if (linkWhatsApp) window.open(linkWhatsApp, '_blank', 'noopener');
  };

  const permitirSoltar = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const dataFocoDate = deISO(dataFoco);

  /* ---- semana ---- */
  const diasDaSemana = useMemo(() => {
    const ini = inicioDaSemana(dataFoco);
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(ini);
      d.setDate(ini.getDate() + i);
      return toISODate(d);
    });
  }, [dataFoco]);

  /* ---- mês ---- */
  const diasDoMes = useMemo(() => {
    const ano = dataFocoDate.getFullYear();
    const mes = dataFocoDate.getMonth();
    const primeiro = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();
    return [
      ...Array.from({ length: primeiro }, () => null),
      ...Array.from({ length: total }, (_, i) => toISODate(new Date(ano, mes, i + 1))),
    ];
  }, [dataFoco]); // eslint-disable-line react-hooks/exhaustive-deps

  const hoje = toISODate(new Date());

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-gray-divider bg-white p-3 shadow-soft">
        <div className="flex overflow-hidden rounded-full border border-gray-divider">
          {['dia', 'semana', 'mes'].map((v) => (
            <button
              key={v}
              onClick={() => setVisao(v)}
              className={`px-4 py-1.5 font-display text-xs font-semibold capitalize transition-colors cursor-pointer ${visao === v ? 'bg-navy text-white' : 'text-text-dark/60 hover:bg-gray-support'}`}
            >
              {v === 'mes' ? 'Mês' : v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => navegar(-1)} aria-label="Anterior" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-support cursor-pointer"><FaChevronLeft size={11} /></button>
          <button onClick={() => setDataFoco(hoje)} className="rounded-full px-3 py-1.5 font-display text-xs font-semibold text-navy hover:bg-gray-support cursor-pointer">Hoje</button>
          <button onClick={() => navegar(1)} aria-label="Próximo" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-support cursor-pointer"><FaChevronRight size={11} /></button>
        </div>

        <span className="font-display text-sm font-bold text-navy">
          {visao === 'mes' ? `${MESES[dataFocoDate.getMonth()]} ${dataFocoDate.getFullYear()}` : visao === 'semana' ? `Semana de ${dataBr(diasDaSemana[0])}` : `${DIAS_CURTOS[dataFocoDate.getDay()]}, ${dataBr(dataFoco)}`}
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dark/35" size={11} aria-hidden />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Paciente, telefone, profissional..."
              className="w-52 rounded-full border border-gray-divider py-1.5 pl-8 pr-3 text-xs outline-none focus:border-navy"
            />
          </div>
          <select value={filtroProf} onChange={(e) => setFiltroProf(e.target.value)} className="rounded-full border border-gray-divider px-3 py-1.5 text-xs outline-none focus:border-navy cursor-pointer">
            <option value="">Todos os profissionais</option>
            {medicos.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="rounded-full border border-gray-divider px-3 py-1.5 text-xs outline-none focus:border-navy cursor-pointer">
            <option value="">Status ativos</option>
            {FLUXO_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button
            onClick={() => aoAbrirAgendamento({ data: dataFoco })}
            className="flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-1.5 font-display text-xs font-semibold text-white hover:brightness-110 cursor-pointer"
          >
            <FaPlus size={10} aria-hidden /> Novo
          </button>
        </div>
      </div>

      {/* VISÃO DIA */}
      {visao === 'dia' && (
        <div className="overflow-hidden rounded-2xl border border-gray-divider bg-white shadow-soft">
          {GRADE_PAINEL.map((h) => {
            const doSlot = filtrados.filter((a) => a.data === dataFoco && a.hora === h);
            return (
              <div
                key={h}
                onDragOver={permitirSoltar}
                onDrop={(e) => soltar(e, dataFoco, h)}
                className="flex min-h-[52px] items-stretch border-b border-gray-divider last:border-0"
              >
                <span className="flex w-16 shrink-0 items-center justify-center border-r border-gray-divider bg-gray-support/50 font-display text-xs font-bold text-text-dark/60">
                  {h}
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-2 p-2">
                  {doSlot.length === 0 ? (
                    <button
                      onClick={() => aoAbrirAgendamento({ data: dataFoco, hora: h })}
                      className="rounded-full border border-dashed border-gray-divider px-3 py-1 text-[11px] text-text-dark/35 transition-colors hover:border-navy hover:text-navy cursor-pointer"
                    >
                      Livre — encaixar aqui
                    </button>
                  ) : (
                    doSlot.map((a) => (
                      <div key={a.id} className="w-full max-w-sm">
                        <Cartao a={a} paciente={pacDe(a)} onEditar={aoEditarAgendamento} onMudar={mudar} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISÃO SEMANA */}
      {visao === 'semana' && (
        <div className="overflow-x-auto rounded-2xl border border-gray-divider bg-white shadow-soft">
          <div className="grid min-w-[900px] grid-cols-[60px_repeat(6,1fr)]">
            <span />
            {diasDaSemana.map((d) => (
              <button
                key={d}
                onClick={() => { setDataFoco(d); setVisao('dia'); }}
                className={`border-b border-l border-gray-divider px-2 py-2 text-center font-display text-xs font-bold cursor-pointer hover:bg-rose-soft ${d === hoje ? 'bg-rose-soft text-brand-red' : 'text-navy'}`}
              >
                {DIAS_CURTOS[deISO(d).getDay()]} {dataBr(d).slice(0, 5)}
              </button>
            ))}
            {GRADE_PAINEL.map((h) => (
              <div key={h} className="contents">
                <span className="flex items-center justify-center border-b border-gray-divider bg-gray-support/50 font-display text-[11px] font-bold text-text-dark/55">
                  {h}
                </span>
                {diasDaSemana.map((d) => {
                  const doSlot = filtrados.filter((a) => a.data === d && a.hora === h);
                  return (
                    <div
                      key={d + h}
                      onDragOver={permitirSoltar}
                      onDrop={(e) => soltar(e, d, h)}
                      onDoubleClick={() => aoAbrirAgendamento({ data: d, hora: h })}
                      className="min-h-[44px] space-y-1 border-b border-l border-gray-divider p-1"
                      title="Duplo clique: novo atendimento"
                    >
                      {doSlot.map((a) => (
                        <Cartao key={a.id} a={a} paciente={pacDe(a)} compacto onEditar={aoEditarAgendamento} onMudar={mudar} />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISÃO MÊS */}
      {visao === 'mes' && (
        <div className="rounded-2xl border border-gray-divider bg-white p-3 shadow-soft">
          <div className="grid grid-cols-7 gap-1.5">
            {DIAS_CURTOS.map((d) => (
              <span key={d} className="py-1 text-center font-display text-[11px] font-bold text-text-dark/45">{d}</span>
            ))}
            {diasDoMes.map((d, i) =>
              d === null ? (
                <span key={`v${i}`} />
              ) : (
                (() => {
                  const qtd = filtrados.filter((a) => a.data === d).length;
                  return (
                    <button
                      key={d}
                      onClick={() => { setDataFoco(d); setVisao('dia'); }}
                      className={`flex min-h-[68px] flex-col items-start rounded-xl border p-2 text-left transition-colors cursor-pointer hover:border-navy ${d === hoje ? 'border-brand-red bg-rose-soft' : 'border-gray-divider'}`}
                    >
                      <span className={`font-display text-xs font-bold ${d === hoje ? 'text-brand-red' : 'text-navy'}`}>{Number(d.split('-')[2])}</span>
                      {qtd > 0 && (
                        <span className="mt-auto rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">
                          {qtd} atend.
                        </span>
                      )}
                    </button>
                  );
                })()
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
