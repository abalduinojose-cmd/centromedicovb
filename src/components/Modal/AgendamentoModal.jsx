import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaArrowLeft, FaArrowRight, FaCalendarAlt, FaCheck, FaClock, FaExclamationCircle,
  FaFlask, FaStethoscope, FaTimes, FaUser, FaUserMd, FaWhatsapp,
} from 'react-icons/fa';
import Calendario from './Calendario.jsx';
import { useAgendamento } from '../../context/AgendamentoContext.jsx';
import { especialidades } from '../../data/especialidades.js';
import { medicos, medicosPorEspecialidade } from '../../data/medicos.js';
import { examesAgendaveis } from '../../data/exames.js';
import { gerarHorarios } from '../../utils/horarios.js';
import { formatarDataLonga, mascaraTelefone } from '../../utils/formatacao.js';
import { validarNome, validarTelefone, validarEmail, validarPaciente } from '../../utils/validacao.js';
import { gerarLinkWhatsApp, mensagemConsulta, mensagemExame, WHATSAPP_DISPLAY } from '../../utils/whatsapp.js';

const PASSOS = ['Tipo', 'Data', 'Horário', 'Seus dados', 'Confirmação'];

const FORM_INICIAL = { nome: '', telefone: '', email: '', primeiraVez: false, observacoes: '' };

function CampoErro({ mensagem }) {
  if (!mensagem) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-red" role="alert">
      <FaExclamationCircle size={11} aria-hidden /> {mensagem}
    </p>
  );
}

export default function AgendamentoModal() {
  const { modalAberto, tipoInicial, preSelecao, fecharAgendamento, confirmarEnvio } = useAgendamento();

  const [passo, setPasso] = useState(0);
  const [tipo, setTipo] = useState('consulta');
  const [especialidadeId, setEspecialidadeId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [exameId, setExameId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [aceite, setAceite] = useState(false);
  const [tentouAvancar, setTentouAvancar] = useState(false);

  // Reinicia o fluxo sempre que o modal abre (com pré-seleções vindas dos CTAs)
  useEffect(() => {
    if (modalAberto) {
      setPasso(0);
      setTipo(tipoInicial);
      setEspecialidadeId(preSelecao?.especialidade ?? '');
      setMedicoId(preSelecao?.medicoId ? String(preSelecao.medicoId) : '');
      setExameId(preSelecao?.exameId ?? '');
      setData('');
      setHora('');
      setForm(FORM_INICIAL);
      setErros({});
      setAceite(false);
      setTentouAvancar(false);
    }
  }, [modalAberto, tipoInicial, preSelecao]);

  // Trava o scroll da página e fecha com Escape
  useEffect(() => {
    if (!modalAberto) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && fecharAgendamento();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modalAberto, fecharAgendamento]);

  const medicosDaEspecialidade = useMemo(
    () => (especialidadeId ? medicosPorEspecialidade(especialidadeId) : []),
    [especialidadeId]
  );
  const medicoSelecionado =
    medicoId === 'equipe'
      ? { nome: 'Equipe Viver Bem (profissional a confirmar)' }
      : medicos.find((m) => String(m.id) === medicoId);
  const exameSelecionado = examesAgendaveis.find((e) => e.id === exameId);
  const recursoId = tipo === 'consulta' ? `medico-${medicoId}` : `exame-${exameId}`;

  const horarios = useMemo(
    () => (data ? gerarHorarios(recursoId, data) : []),
    [recursoId, data]
  );

  // Validação por passo
  const passoValido = useMemo(() => {
    switch (passo) {
      case 0:
        return tipo === 'consulta' ? Boolean(especialidadeId && medicoId) : Boolean(exameId);
      case 1:
        return Boolean(data);
      case 2:
        return Boolean(hora);
      case 3:
        return Object.keys(validarPaciente(form)).length === 0;
      case 4:
        return aceite;
      default:
        return false;
    }
  }, [passo, tipo, especialidadeId, medicoId, exameId, data, hora, form, aceite]);

  const avancar = () => {
    setTentouAvancar(true);
    if (passo === 3) {
      const e = validarPaciente(form);
      setErros(e);
      if (Object.keys(e).length) return;
    }
    if (!passoValido) return;
    setTentouAvancar(false);
    setPasso((p) => Math.min(p + 1, PASSOS.length - 1));
  };

  const voltar = () => {
    setTentouAvancar(false);
    setPasso((p) => Math.max(p - 1, 0));
  };

  // Validação em tempo real (debounce leve por campo)
  const atualizarCampo = (campo, valor) => {
    const v = campo === 'telefone' ? mascaraTelefone(valor) : valor;
    setForm((f) => ({ ...f, [campo]: v }));
    if (erros[campo]) {
      const validadores = { nome: validarNome, telefone: validarTelefone, email: validarEmail };
      const msg = validadores[campo] ? validadores[campo](v) : '';
      setErros((e) => ({ ...e, [campo]: msg || undefined }));
    }
  };

  const dataFormatada = formatarDataLonga(data);

  const enviarWhatsApp = () => {
    if (!aceite) return;
    const base = {
      paciente: form.nome.trim(),
      dataFormatada,
      horario: hora,
      telefone: form.telefone,
      primeiraVez: form.primeiraVez,
      observacoes: form.observacoes.trim(),
    };
    const mensagem =
      tipo === 'consulta'
        ? mensagemConsulta({
            ...base,
            especialidade: especialidades.find((e) => e.id === especialidadeId)?.nome ?? '',
            medico: medicoSelecionado?.nome ?? '',
          })
        : mensagemExame({ ...base, exame: exameSelecionado?.nome ?? '' });

    window.open(gerarLinkWhatsApp(mensagem), '_blank', 'noopener');
    confirmarEnvio();
  };

  const aoTrocarTipo = (novoTipo) => {
    setTipo(novoTipo);
    setData('');
    setHora('');
  };

  return (
    <AnimatePresence>
      {modalAberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/60 backdrop-blur-sm sm:p-4"
          onClick={fecharAgendamento}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-agendamento"
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-gray-divider bg-navy px-6 py-4 text-white">
              <div>
                <h2 id="titulo-agendamento" className="font-display text-lg font-bold">
                  Agendamento Online
                </h2>
                <p className="text-xs text-white/70">
                  Passo {passo + 1} de {PASSOS.length} — {PASSOS[passo]}
                </p>
              </div>
              <button
                onClick={fecharAgendamento}
                aria-label="Fechar agendamento"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 cursor-pointer"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Barra de progresso */}
            <div className="flex gap-1.5 px-6 pt-4">
              {PASSOS.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-divider">
                  <motion.div
                    className="h-full rounded-full bg-brand-red"
                    initial={false}
                    animate={{ width: i <= passo ? '100%' : '0%' }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              ))}
            </div>

            {/* Conteúdo do passo */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={passo}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* PASSO 1 — Tipo + seleção */}
                  {passo === 0 && (
                    <div>
                      <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Tipo de agendamento">
                        {[
                          { id: 'consulta', label: 'Consulta Médica', Icone: FaStethoscope },
                          { id: 'exame', label: 'Exame / Ultrassom', Icone: FaFlask },
                        ].map(({ id, label, Icone }) => (
                          <button
                            key={id}
                            role="tab"
                            aria-selected={tipo === id}
                            onClick={() => aoTrocarTipo(id)}
                            className={`flex items-center justify-center gap-2.5 rounded-2xl border-2 px-4 py-4 font-display text-sm font-semibold transition-all duration-200 cursor-pointer ${
                              tipo === id
                                ? 'border-navy bg-navy text-white shadow-card'
                                : 'border-gray-divider bg-white text-text-dark/60 hover:border-navy/40'
                            }`}
                          >
                            <Icone aria-hidden /> {label}
                          </button>
                        ))}
                      </div>

                      {tipo === 'consulta' ? (
                        <div className="mt-6 space-y-5">
                          <div>
                            <label htmlFor="sel-especialidade" className="mb-2 block font-display text-sm font-semibold text-navy">
                              Selecione a Especialidade *
                            </label>
                            <select
                              id="sel-especialidade"
                              className="input-field"
                              value={especialidadeId}
                              onChange={(e) => {
                                setEspecialidadeId(e.target.value);
                                setMedicoId('');
                              }}
                            >
                              <option value="">Escolha uma especialidade...</option>
                              {especialidades.map((esp) => (
                                <option key={esp.id} value={esp.id}>
                                  {esp.nome}
                                </option>
                              ))}
                            </select>
                          </div>

                          {especialidadeId && (
                            <div>
                              <span className="mb-2 block font-display text-sm font-semibold text-navy">
                                Escolha o Profissional *
                              </span>
                              <div className="space-y-2.5">
                                {medicosDaEspecialidade.map((m) => (
                                  <button
                                    key={m.id}
                                    onClick={() => setMedicoId(String(m.id))}
                                    aria-pressed={medicoId === String(m.id)}
                                    className={`flex w-full items-center gap-4 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 cursor-pointer ${
                                      medicoId === String(m.id)
                                        ? 'border-brand-red bg-rose-soft shadow-soft'
                                        : 'border-gray-divider hover:border-navy/40'
                                    }`}
                                  >
                                    {m.foto ? (
                                      <img
                                        src={m.foto}
                                        alt=""
                                        className="h-12 w-12 shrink-0 rounded-full object-cover object-top"
                                      />
                                    ) : (
                                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">
                                        {m.nome.replace(/^(Dra?\.|Psic\.|Nut\.|Ft\.|Prof\.ª|Pod\.)\s*/i, '')[0]}
                                      </span>
                                    )}
                                    <span className="flex-1">
                                      <span className="block font-display text-sm font-bold text-navy">{m.nome}</span>
                                      <span className="mt-0.5 block text-xs text-text-dark/60">{m.bio}</span>
                                    </span>
                                    {medicoId === String(m.id) && <FaCheck className="text-brand-red" aria-hidden />}
                                  </button>
                                ))}
                                {medicosDaEspecialidade.length === 0 && (
                                  <button
                                    onClick={() => setMedicoId('equipe')}
                                    aria-pressed={medicoId === 'equipe'}
                                    className={`flex w-full items-center gap-4 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 cursor-pointer ${
                                      medicoId === 'equipe'
                                        ? 'border-brand-red bg-rose-soft shadow-soft'
                                        : 'border-gray-divider hover:border-navy/40'
                                    }`}
                                  >
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                                      <FaUserMd size={20} aria-hidden />
                                    </span>
                                    <span className="flex-1">
                                      <span className="block font-display text-sm font-bold text-navy">Equipe Viver Bem</span>
                                      <span className="mt-0.5 block text-xs text-text-dark/60">
                                        O profissional desta especialidade será confirmado pela clínica no WhatsApp.
                                      </span>
                                    </span>
                                    {medicoId === 'equipe' && <FaCheck className="text-brand-red" aria-hidden />}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-6">
                          <label htmlFor="sel-exame" className="mb-2 block font-display text-sm font-semibold text-navy">
                            Selecione o Exame *
                          </label>
                          <select id="sel-exame" className="input-field" value={exameId} onChange={(e) => setExameId(e.target.value)}>
                            <option value="">Escolha um exame...</option>
                            <optgroup label="Exames Laboratoriais">
                              {examesAgendaveis.filter((e) => e.categoria === 'Laboratorial').map((e) => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Ultrassonografias">
                              {examesAgendaveis.filter((e) => e.categoria === 'Ultrassonografia').map((e) => (
                                <option key={e.id} value={e.id}>{e.nome}</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      )}
                      {tentouAvancar && !passoValido && (
                        <CampoErro mensagem={tipo === 'consulta' ? 'Selecione a especialidade e o profissional.' : 'Selecione o exame desejado.'} />
                      )}
                    </div>
                  )}

                  {/* PASSO 2 — Data */}
                  {passo === 1 && (
                    <div>
                      <p className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-navy">
                        <FaCalendarAlt className="text-brand-red" aria-hidden /> Escolha a melhor data
                      </p>
                      <Calendario valor={data} onSelecionar={(iso) => { setData(iso); setHora(''); }} />
                      {data && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 rounded-xl bg-rose-soft px-4 py-3 text-sm font-medium text-navy"
                        >
                          📅 Data selecionada: <strong>{dataFormatada}</strong>
                        </motion.p>
                      )}
                      {tentouAvancar && !passoValido && <CampoErro mensagem="Escolha uma data disponível." />}
                    </div>
                  )}

                  {/* PASSO 3 — Horário */}
                  {passo === 2 && (
                    <div>
                      <p className="mb-1 flex items-center gap-2 font-display text-sm font-semibold text-navy">
                        <FaClock className="text-brand-red" aria-hidden /> Horários disponíveis — {dataFormatada}
                      </p>
                      <p className="mb-4 text-xs text-text-dark/50">Duração aproximada: 30 minutos</p>
                      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                        {horarios.map(({ hora: h, disponivel }) => (
                          <button
                            key={h}
                            disabled={!disponivel}
                            onClick={() => setHora(h)}
                            title={disponivel ? 'Duração: 30 minutos' : 'Horário indisponível'}
                            aria-pressed={hora === h}
                            className={`rounded-xl border-2 py-2.5 font-display text-sm font-semibold transition-all duration-150 ${
                              hora === h
                                ? 'border-brand-red bg-brand-red text-white shadow-[0_4px_14px_rgba(230,11,24,0.35)] scale-105'
                                : disponivel
                                  ? 'border-gray-divider text-navy hover:border-navy cursor-pointer'
                                  : 'border-gray-divider bg-gray-support text-gray-300 cursor-not-allowed line-through'
                            }`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                      {horarios.filter((h) => h.disponivel).length === 0 && (
                        <p className="mt-4 rounded-xl bg-rose-soft p-4 text-sm text-text-dark/70">
                          Nenhum horário livre nesta data. Volte e escolha outro dia. 😊
                        </p>
                      )}
                      {tentouAvancar && !passoValido && <CampoErro mensagem="Selecione um horário disponível." />}
                    </div>
                  )}

                  {/* PASSO 4 — Dados do paciente */}
                  {passo === 3 && (
                    <div className="space-y-4">
                      <p className="flex items-center gap-2 font-display text-sm font-semibold text-navy">
                        <FaUser className="text-brand-red" aria-hidden /> Informações do paciente
                      </p>
                      <div>
                        <label htmlFor="inp-nome" className="mb-1.5 block text-sm font-medium text-text-dark">Nome Completo *</label>
                        <input
                          id="inp-nome"
                          type="text"
                          className={`input-field ${erros.nome ? 'input-error' : ''}`}
                          placeholder="Seu nome completo"
                          value={form.nome}
                          onChange={(e) => atualizarCampo('nome', e.target.value)}
                          onBlur={() => setErros((er) => ({ ...er, nome: validarNome(form.nome) || undefined }))}
                          autoComplete="name"
                        />
                        <CampoErro mensagem={erros.nome} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="inp-tel" className="mb-1.5 block text-sm font-medium text-text-dark">Telefone / WhatsApp *</label>
                          <input
                            id="inp-tel"
                            type="tel"
                            inputMode="tel"
                            className={`input-field ${erros.telefone ? 'input-error' : ''}`}
                            placeholder="(24) 99999-9999"
                            value={form.telefone}
                            onChange={(e) => atualizarCampo('telefone', e.target.value)}
                            onBlur={() => setErros((er) => ({ ...er, telefone: validarTelefone(form.telefone) || undefined }))}
                            autoComplete="tel"
                          />
                          <CampoErro mensagem={erros.telefone} />
                        </div>
                        <div>
                          <label htmlFor="inp-email" className="mb-1.5 block text-sm font-medium text-text-dark">E-mail *</label>
                          <input
                            id="inp-email"
                            type="email"
                            className={`input-field ${erros.email ? 'input-error' : ''}`}
                            placeholder="nome@email.com"
                            value={form.email}
                            onChange={(e) => atualizarCampo('email', e.target.value)}
                            onBlur={() => setErros((er) => ({ ...er, email: validarEmail(form.email) || undefined }))}
                            autoComplete="email"
                          />
                          <CampoErro mensagem={erros.email} />
                        </div>
                      </div>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-rose-soft px-4 py-3 text-sm text-text-dark/80">
                        <input
                          type="checkbox"
                          checked={form.primeiraVez}
                          onChange={(e) => setForm((f) => ({ ...f, primeiraVez: e.target.checked }))}
                          className="h-4 w-4 accent-brand-red"
                        />
                        Primeira vez na clínica?
                      </label>
                      <div>
                        <label htmlFor="inp-obs" className="mb-1.5 block text-sm font-medium text-text-dark">
                          Observações / Alergias <span className="text-text-dark/40">(opcional)</span>
                        </label>
                        <textarea
                          id="inp-obs"
                          rows={3}
                          maxLength={200}
                          className={`input-field resize-none ${erros.observacoes ? 'input-error' : ''}`}
                          placeholder="Conte-nos algo importante para o atendimento..."
                          value={form.observacoes}
                          onChange={(e) => atualizarCampo('observacoes', e.target.value)}
                        />
                        <p className="mt-1 text-right text-xs text-text-dark/40">{form.observacoes.length}/200</p>
                      </div>
                    </div>
                  )}

                  {/* PASSO 5 — Revisão e confirmação */}
                  {passo === 4 && (
                    <div>
                      <p className="mb-4 font-display text-sm font-semibold text-navy">Revise seu agendamento</p>
                      <div className="space-y-3 rounded-2xl border border-gray-divider bg-rose-soft/60 p-5">
                        {[
                          tipo === 'consulta'
                            ? ['Especialidade', especialidades.find((e) => e.id === especialidadeId)?.nome]
                            : ['Exame', exameSelecionado?.nome],
                          ...(tipo === 'consulta' ? [['Profissional', medicoSelecionado?.nome]] : []),
                          ['Data', dataFormatada],
                          ['Horário', hora],
                          ['Paciente', form.nome],
                          ['Telefone', form.telefone],
                          ['E-mail', form.email],
                          ['Primeira vez', form.primeiraVez ? 'Sim' : 'Não'],
                          ...(form.observacoes ? [['Observações', form.observacoes]] : []),
                        ].map(([rotulo, valor]) => (
                          <div key={rotulo} className="flex items-start justify-between gap-4 text-sm">
                            <span className="shrink-0 font-medium text-text-dark/50">{rotulo}</span>
                            <span className="text-right font-semibold text-navy">{valor}</span>
                          </div>
                        ))}
                      </div>

                      <p className="mt-4 rounded-xl bg-navy/[0.05] px-4 py-3 text-xs leading-relaxed text-text-dark/70">
                        💡 Após o envio, nossa equipe confirmará a disponibilidade pelo WhatsApp e enviará
                        as instruções para pagamento de 50% como confirmação do agendamento.
                      </p>

                      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-text-dark/80">
                        <input
                          type="checkbox"
                          checked={aceite}
                          onChange={(e) => setAceite(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-brand-red"
                        />
                        Concordo com os termos de privacidade e autorizo o contato pelo WhatsApp informado.
                      </label>
                      {tentouAvancar && !aceite && <CampoErro mensagem="É necessário concordar com os termos para continuar." />}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Rodapé com navegação */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-divider bg-gray-support/60 px-6 py-4">
              {passo > 0 ? (
                <button
                  onClick={voltar}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold text-navy transition-colors hover:bg-navy/5 cursor-pointer"
                >
                  <FaArrowLeft size={12} aria-hidden /> Voltar
                </button>
              ) : (
                <span className="text-xs text-text-dark/40">📞 Dúvidas? {WHATSAPP_DISPLAY}</span>
              )}

              {passo < PASSOS.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={avancar}
                  className="flex items-center gap-2 rounded-full bg-navy px-7 py-3 font-display text-sm font-semibold text-white shadow-card transition-colors hover:bg-navy-light cursor-pointer"
                >
                  Continuar <FaArrowRight size={12} aria-hidden />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setTentouAvancar(true);
                    enviarWhatsApp();
                  }}
                  className="flex items-center gap-2 rounded-full bg-whatsapp px-7 py-3 font-display text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all hover:brightness-110 cursor-pointer"
                >
                  <FaWhatsapp size={17} aria-hidden /> Confirmar e Enviar para WhatsApp
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
