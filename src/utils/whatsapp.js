/** Integração WhatsApp — link com mensagem pré-preenchida (não requer API Business). */
export const WHATSAPP_NUMERO = '5524988477924';
export const WHATSAPP_DISPLAY = '(24) 98847-7924';

export function gerarLinkWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemConsulta({ paciente, especialidade, medico, dataFormatada, horario, telefone, primeiraVez, observacoes }) {
  return [
    'Olá! Gostaria de agendar uma consulta.',
    '',
    '*Informações do Agendamento:*',
    `👤 Paciente: ${paciente}`,
    `🏥 Especialidade: ${especialidade}`,
    `👨‍⚕️ Médico: ${medico}`,
    `📅 Data: ${dataFormatada}`,
    `🕐 Horário: ${horario}`,
    `📞 Telefone: ${telefone}`,
    '',
    `*Primeira consulta?* ${primeiraVez ? 'Sim' : 'Não'}`,
    ...(observacoes ? ['', `📝 Observações: ${observacoes}`] : []),
    '',
    'Aguardo a confirmação de disponibilidade e as instruções para pagamento de 50% da consulta como confirmação do agendamento.',
  ].join('\n');
}

export function mensagemExame({ paciente, exame, dataFormatada, horario, telefone, primeiraVez, observacoes }) {
  return [
    'Olá! Gostaria de agendar um exame.',
    '',
    '*Informações do Agendamento:*',
    `👤 Paciente: ${paciente}`,
    `🔬 Exame: ${exame}`,
    `📅 Data: ${dataFormatada}`,
    `🕐 Horário: ${horario}`,
    `📞 Telefone: ${telefone}`,
    '',
    `*Primeira vez na clínica?* ${primeiraVez ? 'Sim' : 'Não'}`,
    ...(observacoes ? ['', `📝 Observações: ${observacoes}`] : []),
    '',
    'Aguardo a confirmação de disponibilidade e as instruções para confirmação do agendamento.',
  ].join('\n');
}

/** Mensagem genérica para CTAs diretos (botão flutuante, header etc.). */
export const LINK_WHATSAPP_GERAL = gerarLinkWhatsApp(
  'Olá! Vim pelo site do Centro Médico Viver Bem e gostaria de mais informações. 😊'
);
