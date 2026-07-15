import { useMemo, useState } from 'react';
import {
  FaArrowLeft, FaCamera, FaEnvelope, FaMoneyBillWave, FaNotesMedical,
  FaPhoneAlt, FaSearch, FaUserPlus, FaWhatsapp,
} from 'react-icons/fa';
import { Badge } from './StatusBadge.jsx';
import { atualizarPaciente, criarPaciente, nomeProfissional, registrarNota } from './store.js';
import { brl, dataBr, useEstado } from './usePainel.js';
import { mascaraTelefone } from '../utils/formatacao.js';

const ICONE_HISTORICO = {
  cadastro: '👤', agenda: '📅', atendimento: '🩺', financeiro: '💰',
  confirmacao: '✅', falta: '⚠️', nota: '📝',
};

function FormPaciente({ inicial, aoSalvar, aoCancelar }) {
  const [dados, setDados] = useState({
    nome: inicial?.nome ?? '',
    telefone: inicial?.telefone ?? '',
    whatsapp: inicial?.whatsapp ?? '',
    email: inicial?.email ?? '',
    observacoes: inicial?.observacoes ?? '',
  });
  const [erro, setErro] = useState('');
  const campo = (k, v) => setDados((d) => ({ ...d, [k]: k.includes('telefone') || k === 'whatsapp' ? mascaraTelefone(v) : v }));

  return (
    <div className="space-y-3 rounded-2xl border border-gray-divider bg-white p-4 shadow-soft">
      <input className="input-field" placeholder="Nome completo *" value={dados.nome} onChange={(e) => campo('nome', e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input-field" placeholder="Telefone *" value={dados.telefone} onChange={(e) => campo('telefone', e.target.value)} />
        <input className="input-field" placeholder="WhatsApp" value={dados.whatsapp} onChange={(e) => campo('whatsapp', e.target.value)} />
      </div>
      <input className="input-field" type="email" placeholder="E-mail" value={dados.email} onChange={(e) => campo('email', e.target.value)} />
      <textarea className="input-field resize-none" rows={2} placeholder="Observações da equipe" value={dados.observacoes} onChange={(e) => campo('observacoes', e.target.value)} />
      {erro && <p className="text-sm font-medium text-brand-red" role="alert">{erro}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={aoCancelar} className="rounded-full px-5 py-2 font-display text-xs font-semibold text-text-dark/60 hover:bg-gray-support cursor-pointer">Cancelar</button>
        <button
          onClick={() => {
            if (dados.nome.trim().length < 5) return setErro('Informe o nome completo.');
            if (dados.telefone.replace(/\D/g, '').length < 10) return setErro('Informe um telefone válido.');
            aoSalvar({ ...dados, whatsapp: dados.whatsapp || dados.telefone });
          }}
          className="rounded-full bg-navy px-6 py-2 font-display text-xs font-semibold text-white hover:bg-navy-light cursor-pointer"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

function Perfil({ paciente, usuario, aoVoltar, aoAbrirAgendamento }) {
  const estado = useEstado();
  const [nota, setNota] = useState('');
  const [editando, setEditando] = useState(false);

  const atendimentos = useMemo(
    () =>
      estado.agendamentos
        .filter((a) => a.pacienteId === paciente.id)
        .sort((a, b) => `${b.data}${b.hora}`.localeCompare(`${a.data}${a.hora}`)),
    [estado, paciente.id]
  );
  const pagos = atendimentos.filter((a) => a.statusPagamento === 'pago');
  const pendencias = atendimentos.filter((a) => a.status === 'pagamento-pendente');
  const faltas = atendimentos.filter((a) => ['faltou', 'cancelado'].includes(a.status));

  return (
    <div className="space-y-4">
      <button onClick={aoVoltar} className="flex items-center gap-2 font-display text-xs font-semibold text-navy hover:underline cursor-pointer">
        <FaArrowLeft size={10} aria-hidden /> Voltar para a lista
      </button>

      {/* Cabeçalho do perfil */}
      <div className="rounded-3xl border border-gray-divider bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
              {paciente.nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-navy">{paciente.nome}</h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-dark/60">
                <span className="flex items-center gap-1.5"><FaPhoneAlt size={10} aria-hidden /> {paciente.telefone}</span>
                {paciente.whatsapp && (
                  <a
                    href={`https://wa.me/55${paciente.whatsapp.replace(/\D/g, '')}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-whatsapp hover:underline"
                  >
                    <FaWhatsapp size={11} aria-hidden /> {paciente.whatsapp}
                  </a>
                )}
                {paciente.email && <span className="flex items-center gap-1.5"><FaEnvelope size={10} aria-hidden /> {paciente.email}</span>}
              </div>
              {paciente.observacoes && (
                <p className="mt-2 rounded-xl bg-rose-soft px-3 py-1.5 text-xs text-text-dark/70">📌 {paciente.observacoes}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditando((v) => !v)} className="rounded-full border border-navy px-4 py-1.5 font-display text-xs font-semibold text-navy hover:bg-navy hover:text-white cursor-pointer">
              {editando ? 'Fechar edição' : 'Editar cadastro'}
            </button>
            <button onClick={() => aoAbrirAgendamento({ pacienteId: paciente.id })} className="rounded-full bg-brand-red px-4 py-1.5 font-display text-xs font-semibold text-white hover:brightness-110 cursor-pointer">
              + Agendar
            </button>
          </div>
        </div>
        {editando && (
          <div className="mt-4">
            <FormPaciente
              inicial={paciente}
              aoCancelar={() => setEditando(false)}
              aoSalvar={(dados) => { atualizarPaciente(paciente.id, dados, usuario); setEditando(false); }}
            />
          </div>
        )}
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-divider bg-white p-4 shadow-soft">
          <p className="text-[11px] font-medium text-text-dark/50">Total pago</p>
          <p className="font-display text-lg font-bold text-[#16A34A]">{brl(pagos.reduce((s, a) => s + a.valor, 0))}</p>
          <p className="text-[10px] text-text-dark/40">{pagos.length} pagamento(s)</p>
        </div>
        <div className="rounded-2xl border border-gray-divider bg-white p-4 shadow-soft">
          <p className="text-[11px] font-medium text-text-dark/50">Pendências</p>
          <p className="font-display text-lg font-bold text-brand-red">{brl(pendencias.reduce((s, a) => s + a.valor, 0))}</p>
          <p className="text-[10px] text-text-dark/40">{pendencias.length} em aberto</p>
        </div>
        <div className="rounded-2xl border border-gray-divider bg-white p-4 shadow-soft">
          <p className="text-[11px] font-medium text-text-dark/50">Faltas / cancelamentos</p>
          <p className="font-display text-lg font-bold text-navy">{faltas.length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Consultas e procedimentos */}
        <div className="rounded-3xl border border-gray-divider bg-white shadow-soft">
          <h4 className="flex items-center gap-2 border-b border-gray-divider px-5 py-3 font-display text-sm font-bold text-navy">
            <FaNotesMedical className="text-brand-red" size={13} aria-hidden /> Consultas e procedimentos
          </h4>
          <ul className="max-h-80 divide-y divide-gray-divider overflow-y-auto">
            {atendimentos.length === 0 && <li className="px-5 py-6 text-center text-xs text-text-dark/45">Nenhum atendimento registrado.</li>}
            {atendimentos.map((a) => (
              <li key={a.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-xs font-bold text-text-dark">{a.servico}</p>
                  <Badge status={a.status} />
                </div>
                <p className="mt-0.5 text-[11px] text-text-dark/55">
                  {dataBr(a.data)} às {a.hora} · {nomeProfissional(a.medicoId)} · {brl(a.valor)}
                  {a.statusPagamento === 'pago' && <span className="ml-1 font-semibold text-[#16A34A]">· pago ✓</span>}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Histórico / evolução */}
        <div className="rounded-3xl border border-gray-divider bg-white shadow-soft">
          <h4 className="flex items-center gap-2 border-b border-gray-divider px-5 py-3 font-display text-sm font-bold text-navy">
            <FaMoneyBillWave className="text-brand-red" size={13} aria-hidden /> Linha do tempo completa
          </h4>
          <div className="px-5 py-3">
            <div className="flex gap-2">
              <input
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && nota.trim()) { registrarNota(paciente.id, nota, usuario); setNota(''); } }}
                placeholder="Adicionar observação da equipe... (Enter salva)"
                className="input-field !py-2 text-xs"
              />
            </div>
          </div>
          <ul className="max-h-72 space-y-2.5 overflow-y-auto px-5 pb-4">
            {[...paciente.historico].reverse().map((h, i) => (
              <li key={i} className="flex gap-2.5 text-xs">
                <span aria-hidden>{ICONE_HISTORICO[h.tipo] ?? '•'}</span>
                <div>
                  <p className="text-text-dark/80">{h.texto}</p>
                  <p className="text-[10px] text-text-dark/40">
                    {new Date(h.ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })} · {h.usuario}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 border-t border-gray-divider px-5 py-2.5 text-[11px] text-text-dark/40">
            <FaCamera size={11} aria-hidden /> Fotos antes/depois: disponível na integração com prontuário eletrônico.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Pacientes({ usuario, aoAbrirAgendamento, pacienteAberto, setPacienteAberto }) {
  const estado = useEstado();
  const [busca, setBusca] = useState('');
  const [criando, setCriando] = useState(false);

  const selecionado = estado.pacientes.find((p) => p.id === pacienteAberto);
  if (selecionado) {
    return <Perfil paciente={selecionado} usuario={usuario} aoVoltar={() => setPacienteAberto(null)} aoAbrirAgendamento={aoAbrirAgendamento} />;
  }

  const termo = busca.trim().toLowerCase();
  const lista = estado.pacientes
    .filter((p) => !termo || `${p.nome} ${p.telefone} ${p.email}`.toLowerCase().includes(termo))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-gray-divider bg-white p-3 shadow-soft">
        <div className="relative flex-1 min-w-[220px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dark/35" size={11} aria-hidden />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, telefone ou e-mail..."
            className="w-full rounded-full border border-gray-divider py-2 pl-8 pr-3 text-xs outline-none focus:border-navy"
          />
        </div>
        <button onClick={() => setCriando((v) => !v)} className="flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 font-display text-xs font-semibold text-white hover:brightness-110 cursor-pointer">
          <FaUserPlus size={11} aria-hidden /> Novo paciente
        </button>
      </div>

      {criando && (
        <FormPaciente
          aoCancelar={() => setCriando(false)}
          aoSalvar={(dados) => { const p = criarPaciente(dados, usuario); setCriando(false); setPacienteAberto(p.id); }}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-divider bg-white shadow-soft">
        <ul className="divide-y divide-gray-divider">
          {lista.length === 0 && <li className="px-5 py-8 text-center text-sm text-text-dark/45">Nenhum paciente encontrado.</li>}
          {lista.map((p) => {
            const atend = estado.agendamentos.filter((a) => a.pacienteId === p.id);
            const pend = atend.filter((a) => a.status === 'pagamento-pendente').length;
            return (
              <li key={p.id}>
                <button onClick={() => setPacienteAberto(p.id)} className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-rose-soft/50 cursor-pointer">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/90 font-display text-sm font-bold text-white">
                    {p.nome.split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-text-dark">{p.nome}</p>
                    <p className="truncate text-xs text-text-dark/50">{p.telefone}{p.email ? ` · ${p.email}` : ''}</p>
                  </div>
                  <span className="text-[11px] text-text-dark/45">{atend.length} atend.</span>
                  {pend > 0 && (
                    <span className="rounded-full bg-rose-light px-2.5 py-1 text-[10px] font-bold text-brand-red">
                      {pend} pendência(s)
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
