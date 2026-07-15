/**
 * Camada de dados do Painel de Recepção.
 * Persistência em localStorage com assinatura de mudanças (tempo real na aba
 * e entre abas via evento 'storage'). Estrutura espelhada para futura
 * migração a Supabase/Firebase: cada função equivale a um endpoint.
 */
import { medicos } from '../data/medicos.js';
import { especialidades } from '../data/especialidades.js';
import { MODELO_MENSAGEM_PAGAMENTO } from './constantes.js';
import { toISODate } from '../utils/formatacao.js';

const CHAVE = 'viverbem-painel-v1';
const ouvintes = new Set();

/* ---------- utilidades ---------- */

let seq = Date.now();
export const novoId = () => `id-${(seq++).toString(36)}`;

const hoje = () => toISODate(new Date());

function deslocarDia(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return toISODate(d);
}

export function nomeProfissional(medicoId) {
  return medicos.find((m) => String(m.id) === String(medicoId))?.nome ?? 'Equipe Viver Bem';
}

export function nomeServico(agendamento) {
  if (agendamento.servico) return agendamento.servico;
  const esp = especialidades.find((e) => e.id === agendamento.especialidadeId);
  return esp ? `Consulta — ${esp.nome}` : 'Atendimento';
}

/* ---------- seed de demonstração ---------- */

function seed() {
  const p = (nome, telefone, email, obs = '') => ({
    id: novoId(),
    nome,
    telefone,
    whatsapp: telefone,
    email,
    observacoes: obs,
    historico: [
      { ts: Date.now() - 86400000 * 30, tipo: 'cadastro', texto: 'Paciente cadastrado no sistema.', usuario: 'Sistema' },
    ],
  });

  const pacientes = [
    p('Maria Aparecida Souza', '(24) 99911-2233', 'maria.souza@email.com', 'Hipertensa. Prefere horários pela manhã.'),
    p('João Pedro Fernandes', '(24) 98822-3344', 'joaopedro@email.com'),
    p('Ana Lúcia Ribeiro', '(24) 97733-4455', 'analucia@email.com', 'Alergia a dipirona.'),
    p('Carlos Eduardo Nunes', '(24) 96644-5566', 'carlosedu@email.com'),
    p('Fernanda Gomes Leal', '(24) 95555-6677', 'fer.leal@email.com'),
    p('Roberto Martins Filho', '(24) 94466-7788', 'roberto.mf@email.com', 'Retorno de ultrassom.'),
    p('Juliana Castro Alves', '(24) 93377-8899', 'ju.castro@email.com'),
    p('Antônio Barbosa Neto', '(24) 92288-9900', 'antonio.bn@email.com'),
  ];

  const ag = (pacienteIdx, dia, hora, medicoId, servico, status, valor, extra = {}) => ({
    id: novoId(),
    pacienteId: pacientes[pacienteIdx].id,
    data: dia,
    hora,
    medicoId,
    servico,
    status,
    valor,
    statusPagamento: ['pagamento-recebido', 'finalizado'].includes(status) ? 'pago' : 'pendente',
    observacoes: '',
    criadoEm: Date.now() - 86400000 * 3,
    log: [{ ts: Date.now() - 86400000 * 3, de: null, para: 'agendado', usuario: 'Recepção' }],
    ...extra,
  });

  const agendamentos = [
    // Hoje — fluxo variado para o dashboard
    ag(0, hoje(), '08:00', 1, 'Consulta — Cardiologia', 'finalizado', 350),
    ag(1, hoje(), '08:30', 9, 'Consulta — Dermatologia', 'pagamento-pendente', 300),
    ag(2, hoje(), '09:30', 7, 'Ultrassom Tireoide', 'em-atendimento', 220),
    ag(3, hoje(), '10:00', 6, 'Consulta — Ginecologia', 'chegou', 320),
    ag(4, hoje(), '11:00', 15, 'Consulta — Nutrição', 'confirmado', 180),
    ag(5, hoje(), '14:00', 7, 'Ultrassom Abdômen Total', 'agendado', 240),
    ag(6, hoje(), '15:30', 22, 'Psicoterapia individual', 'agendado', 150),
    // Amanhã e semana
    ag(7, deslocarDia(1), '08:30', 5, 'Consulta — Urologia', 'confirmado', 320),
    ag(0, deslocarDia(1), '10:30', 11, 'Consulta — Pediatria (neto)', 'agendado', 280),
    ag(2, deslocarDia(2), '09:00', 2, 'Consulta — Endocrinologia', 'agendado', 320),
    ag(5, deslocarDia(3), '13:30', 19, 'Consulta — Angiologia', 'confirmado', 300),
    ag(1, deslocarDia(4), '16:00', 13, 'Consulta — Ortopedia', 'agendado', 320),
    // Passado — histórico e faltas
    ag(0, deslocarDia(-7), '09:00', 1, 'Consulta — Cardiologia', 'finalizado', 350),
    ag(3, deslocarDia(-5), '10:00', 6, 'Consulta — Ginecologia', 'faltou', 320),
    ag(6, deslocarDia(-3), '11:30', 22, 'Psicoterapia individual', 'finalizado', 150),
  ];

  return {
    pacientes,
    agendamentos,
    config: {
      nomeClinica: 'Centro Médico Viver Bem',
      modeloMensagem: MODELO_MENSAGEM_PAGAMENTO,
    },
  };
}

/* ---------- persistência e assinatura ---------- */

let estado = null;

export function carregar() {
  if (estado) return estado;
  try {
    const bruto = localStorage.getItem(CHAVE);
    estado = bruto ? JSON.parse(bruto) : seed();
  } catch {
    estado = seed();
  }
  if (!localStorage.getItem(CHAVE)) persistir();
  return estado;
}

function persistir() {
  localStorage.setItem(CHAVE, JSON.stringify(estado));
  ouvintes.forEach((fn) => fn(estado));
}

export function assinar(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

// Sincronização entre abas abertas (tempo real sem recarregar)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CHAVE && e.newValue) {
      estado = JSON.parse(e.newValue);
      ouvintes.forEach((fn) => fn(estado));
    }
  });
}

export function zerarDemonstracao() {
  estado = seed();
  persistir();
}

/* ---------- pacientes ---------- */

export function criarPaciente(dados, usuario) {
  const paciente = {
    id: novoId(),
    nome: dados.nome ?? '',
    telefone: dados.telefone ?? '',
    whatsapp: dados.whatsapp || dados.telefone || '',
    email: dados.email ?? '',
    observacoes: dados.observacoes ?? '',
    historico: [{ ts: Date.now(), tipo: 'cadastro', texto: 'Paciente cadastrado.', usuario }],
  };
  carregar().pacientes.push(paciente);
  persistir();
  return paciente;
}

export function atualizarPaciente(id, dados, usuario) {
  const paciente = carregar().pacientes.find((x) => x.id === id);
  if (!paciente) return;
  Object.assign(paciente, dados);
  paciente.historico.push({ ts: Date.now(), tipo: 'cadastro', texto: 'Dados cadastrais atualizados.', usuario });
  persistir();
}

export function registrarNota(pacienteId, texto, usuario) {
  const paciente = carregar().pacientes.find((x) => x.id === pacienteId);
  if (!paciente || !texto.trim()) return;
  paciente.historico.push({ ts: Date.now(), tipo: 'nota', texto: texto.trim(), usuario });
  persistir();
}

/* ---------- agendamentos ---------- */

export function existeConflito({ medicoId, data, hora, ignorarId }) {
  return carregar().agendamentos.some(
    (a) =>
      a.id !== ignorarId &&
      String(a.medicoId) === String(medicoId) &&
      a.data === data &&
      a.hora === hora &&
      !['cancelado', 'faltou'].includes(a.status)
  );
}

export function criarAgendamento(dados, usuario) {
  const agendamento = {
    id: novoId(),
    pacienteId: dados.pacienteId,
    data: dados.data,
    hora: dados.hora,
    medicoId: dados.medicoId,
    servico: dados.servico,
    valor: Number(dados.valor) || 0,
    observacoes: dados.observacoes ?? '',
    status: 'agendado',
    statusPagamento: 'pendente',
    criadoEm: Date.now(),
    log: [{ ts: Date.now(), de: null, para: 'agendado', usuario }],
  };
  carregar().agendamentos.push(agendamento);
  registrarNoPaciente(agendamento, `Atendimento agendado: ${agendamento.servico} em ${agendamento.data} às ${agendamento.hora}.`, usuario, 'agenda');
  persistir();
  return agendamento;
}

export function atualizarAgendamento(id, dados, usuario) {
  const a = carregar().agendamentos.find((x) => x.id === id);
  if (!a) return;
  const reagendou = (dados.data && dados.data !== a.data) || (dados.hora && dados.hora !== a.hora);
  Object.assign(a, dados, { valor: dados.valor !== undefined ? Number(dados.valor) || 0 : a.valor });
  if (reagendou) {
    registrarNoPaciente(a, `Atendimento reagendado para ${a.data} às ${a.hora}.`, usuario, 'agenda');
  }
  persistir();
}

function registrarNoPaciente(agendamento, texto, usuario, tipo = 'atendimento') {
  const paciente = carregar().pacientes.find((x) => x.id === agendamento.pacienteId);
  paciente?.historico.push({ ts: Date.now(), tipo, texto, usuario });
}

/**
 * Muda o status seguindo o fluxo inteligente. Toda mudança é registrada no
 * log do agendamento e no histórico do paciente.
 * Retorna { linkWhatsApp } quando a automação de pagamento dispara.
 */
export function mudarStatus(id, novoStatus, usuario) {
  const st = carregar();
  const a = st.agendamentos.find((x) => x.id === id);
  if (!a || a.status === novoStatus) return {};

  const anterior = a.status;
  a.status = novoStatus;
  a.log.push({ ts: Date.now(), de: anterior, para: novoStatus, usuario });

  const paciente = st.pacientes.find((x) => x.id === a.pacienteId);
  const rotulo = { faltou: 'Falta registrada', cancelado: 'Atendimento cancelado' }[novoStatus];
  registrarNoPaciente(
    a,
    `${rotulo ?? `Status alterado para "${novoStatus}"`} — ${a.servico} de ${a.data} ${a.hora}.`,
    usuario,
    ['faltou', 'cancelado'].includes(novoStatus) ? 'falta' : 'atendimento'
  );

  let linkWhatsApp = null;

  // AUTOMAÇÃO: pagamento recebido
  if (novoStatus === 'pagamento-recebido') {
    a.statusPagamento = 'pago';
    a.pagoEm = Date.now();
    a.pagoPor = usuario;
    registrarNoPaciente(
      a,
      `Pagamento de R$ ${a.valor.toFixed(2).replace('.', ',')} recebido (${a.servico}). Confirmado por ${usuario}.`,
      usuario,
      'financeiro'
    );

    const [ano, mes, dia] = a.data.split('-');
    const mensagem = st.config.modeloMensagem
      .replaceAll('{{Nome}}', paciente?.nome.split(' ')[0] ?? 'paciente')
      .replaceAll('{{Data}}', `${dia}/${mes}/${ano}`)
      .replaceAll('{{Clinica}}', st.config.nomeClinica);
    const numero = (paciente?.whatsapp ?? '').replace(/\D/g, '');
    if (numero) {
      linkWhatsApp = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
      registrarNoPaciente(a, 'Mensagem de confirmação de pagamento enviada pelo WhatsApp.', usuario, 'confirmacao');
    }
  }

  if (novoStatus === 'confirmado') {
    registrarNoPaciente(a, `Confirmação do atendimento de ${a.data} ${a.hora} registrada.`, usuario, 'confirmacao');
  }

  persistir();
  return { linkWhatsApp };
}

export function salvarConfig(config) {
  Object.assign(carregar().config, config);
  persistir();
}
