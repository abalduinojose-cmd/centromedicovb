import { useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { medicos } from '../data/medicos.js';
import { GRADE_PAINEL } from './constantes.js';
import { criarAgendamento, atualizarAgendamento, criarPaciente, existeConflito } from './store.js';
import { mascaraTelefone } from '../utils/formatacao.js';
import { useEstado } from './usePainel.js';

/**
 * Modal de criação/edição de atendimento.
 * `inicial`: agendamento existente (edição) ou { data, hora } (novo via grade).
 */
export default function AgendamentoForm({ inicial, usuario, aoFechar }) {
  const estado = useEstado();
  const editando = Boolean(inicial?.id);

  const [pacienteId, setPacienteId] = useState(inicial?.pacienteId ?? '');
  const [novoPaciente, setNovoPaciente] = useState(false);
  const [np, setNp] = useState({ nome: '', telefone: '', whatsapp: '', email: '' });
  const [servico, setServico] = useState(inicial?.servico ?? '');
  const [medicoId, setMedicoId] = useState(inicial?.medicoId ? String(inicial.medicoId) : '');
  const [data, setData] = useState(inicial?.data ?? '');
  const [hora, setHora] = useState(inicial?.hora ?? '');
  const [valor, setValor] = useState(inicial?.valor ?? '');
  const [observacoes, setObservacoes] = useState(inicial?.observacoes ?? '');
  const [erro, setErro] = useState('');

  const pacientesOrdenados = useMemo(
    () => [...estado.pacientes].sort((a, b) => a.nome.localeCompare(b.nome)),
    [estado.pacientes]
  );

  const salvar = () => {
    if (!novoPaciente && !pacienteId) return setErro('Selecione o paciente ou cadastre um novo.');
    if (novoPaciente && np.nome.trim().length < 5) return setErro('Informe o nome completo do novo paciente.');
    if (novoPaciente && np.telefone.replace(/\D/g, '').length < 10) return setErro('Informe um telefone válido para o novo paciente.');
    if (!servico.trim()) return setErro('Informe o serviço/procedimento.');
    if (!medicoId) return setErro('Selecione o profissional responsável.');
    if (!data || !hora) return setErro('Informe data e horário.');
    if (existeConflito({ medicoId, data, hora, ignorarId: inicial?.id })) {
      return setErro('Conflito de horário: este profissional já tem atendimento nesta data e hora.');
    }

    let idPaciente = pacienteId;
    if (novoPaciente) {
      idPaciente = criarPaciente({ ...np, whatsapp: np.whatsapp || np.telefone }, usuario).id;
    }

    const dados = { pacienteId: idPaciente, servico: servico.trim(), medicoId, data, hora, valor, observacoes };
    if (editando) atualizarAgendamento(inicial.id, dados, usuario);
    else criarAgendamento(dados, usuario);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm" onClick={aoFechar}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-elevated"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-navy">
            {editando ? 'Editar atendimento' : 'Novo atendimento'}
          </h3>
          <button onClick={aoFechar} aria-label="Fechar" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-support cursor-pointer">
            <FaTimes size={15} />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Paciente */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="ag-paciente" className="text-sm font-medium text-text-dark">Paciente *</label>
              <button
                onClick={() => setNovoPaciente((v) => !v)}
                className="text-xs font-display font-semibold text-brand-red cursor-pointer"
              >
                {novoPaciente ? '← Selecionar existente' : '+ Cadastrar novo'}
              </button>
            </div>
            {novoPaciente ? (
              <div className="space-y-2.5 rounded-2xl bg-rose-soft p-3">
                <input className="input-field" placeholder="Nome completo *" value={np.nome} onChange={(e) => setNp({ ...np, nome: e.target.value })} />
                <div className="grid grid-cols-2 gap-2.5">
                  <input className="input-field" placeholder="Telefone *" value={np.telefone} onChange={(e) => setNp({ ...np, telefone: mascaraTelefone(e.target.value) })} />
                  <input className="input-field" placeholder="WhatsApp" value={np.whatsapp} onChange={(e) => setNp({ ...np, whatsapp: mascaraTelefone(e.target.value) })} />
                </div>
                <input className="input-field" type="email" placeholder="E-mail" value={np.email} onChange={(e) => setNp({ ...np, email: e.target.value })} />
              </div>
            ) : (
              <select id="ag-paciente" className="input-field" value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
                <option value="">Selecione o paciente...</option>
                {pacientesOrdenados.map((pac) => (
                  <option key={pac.id} value={pac.id}>{pac.nome} — {pac.telefone}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="ag-servico" className="mb-1.5 block text-sm font-medium text-text-dark">Serviço / procedimento *</label>
            <input id="ag-servico" className="input-field" placeholder="Ex.: Consulta — Cardiologia, Ultrassom Tireoide..." value={servico} onChange={(e) => setServico(e.target.value)} />
          </div>

          <div>
            <label htmlFor="ag-prof" className="mb-1.5 block text-sm font-medium text-text-dark">Profissional responsável *</label>
            <select id="ag-prof" className="input-field" value={medicoId} onChange={(e) => setMedicoId(e.target.value)}>
              <option value="">Selecione...</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ag-data" className="mb-1.5 block text-sm font-medium text-text-dark">Data *</label>
              <input id="ag-data" type="date" className="input-field" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div>
              <label htmlFor="ag-hora" className="mb-1.5 block text-sm font-medium text-text-dark">Horário *</label>
              <select id="ag-hora" className="input-field" value={hora} onChange={(e) => setHora(e.target.value)}>
                <option value="">--:--</option>
                {GRADE_PAINEL.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ag-valor" className="mb-1.5 block text-sm font-medium text-text-dark">Valor (R$)</label>
              <input id="ag-valor" type="number" min="0" step="10" className="input-field" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div>
              <label htmlFor="ag-obs" className="mb-1.5 block text-sm font-medium text-text-dark">Observações</label>
              <input id="ag-obs" className="input-field" placeholder="Opcional" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
            </div>
          </div>

          {erro && <p className="rounded-xl bg-rose-light px-4 py-2.5 text-sm font-medium text-brand-red" role="alert">{erro}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button onClick={aoFechar} className="rounded-full px-6 py-2.5 font-display text-sm font-semibold text-text-dark/60 hover:bg-gray-support cursor-pointer">
              Cancelar
            </button>
            <button onClick={salvar} className="rounded-full bg-navy px-7 py-2.5 font-display text-sm font-semibold text-white hover:bg-navy-light cursor-pointer">
              {editando ? 'Salvar alterações' : 'Agendar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
