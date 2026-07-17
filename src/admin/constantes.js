/** Constantes do Painel de Recepção. */

export const FLUXO_STATUS = [
  { id: 'agendado', label: 'Agendado', cor: '#64748B', bg: '#F1F5F9' },
  { id: 'confirmado', label: 'Confirmado', cor: '#2563EB', bg: '#DBEAFE' },
  { id: 'chegou', label: 'Paciente chegou', cor: '#7C3AED', bg: '#EDE9FE' },
  { id: 'em-atendimento', label: 'Em atendimento', cor: '#D97706', bg: '#FEF3C7' },
  { id: 'concluido', label: 'Atendimento concluído', cor: '#0891B2', bg: '#CFFAFE' },
  { id: 'pagamento-pendente', label: 'Pagamento pendente', cor: '#E11D48', bg: '#FFE4E6' },
  { id: 'pagamento-recebido', label: 'Pagamento recebido', cor: '#16A34A', bg: '#DCFCE7' },
  { id: 'finalizado', label: 'Finalizado', cor: '#15803D', bg: '#BBF7D0' },
  { id: 'cancelado', label: 'Cancelado', cor: '#9CA3AF', bg: '#F3F4F6' },
  { id: 'faltou', label: 'Não compareceu', cor: '#F43F5E', bg: '#FFE4E6' },
];

export const statusInfo = (id) => FLUXO_STATUS.find((s) => s.id === id) ?? FLUXO_STATUS[0];

/** Próximo passo natural do fluxo (para o botão de avanço rápido). */
export const PROXIMO_STATUS = {
  agendado: 'confirmado',
  confirmado: 'chegou',
  chegou: 'em-atendimento',
  'em-atendimento': 'concluido',
  concluido: 'pagamento-pendente',
  'pagamento-pendente': 'pagamento-recebido',
  'pagamento-recebido': 'finalizado',
};

export const GRADE_PAINEL = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export const MODELO_MENSAGEM_PAGAMENTO =
  'Olá, {{Nome}}! 😊\n' +
  'Confirmamos o recebimento do pagamento referente ao seu atendimento realizado em {{Data}}.\n' +
  'Agradecemos pela confiança em nossa clínica. Estamos à disposição sempre que precisar!\n' +
  'Equipe {{Clinica}}.';

export const SENHA_PAINEL = 'viverbem2026';
export const SENHA_GESTOR = 'gestor2026';
