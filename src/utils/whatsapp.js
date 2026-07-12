/** Integração WhatsApp — link com mensagem pré-preenchida (não requer API Business). */
export const WHATSAPP_NUMERO = '5524988477924';
export const WHATSAPP_DISPLAY = '(24) 98847-7924';

export function gerarLinkWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Mensagem para múltiplos agendamentos (carrinho).
 * `itens`: [{ categoria: 'Consulta Médica'|'Exame', especialidade?, medico?, exame?, dataFormatada, horario }]
 */
export function mensagemAgendamentos({ paciente, telefone, primeiraVez, observacoes, itens }) {
  const plural = itens.length > 1;
  const blocos = itens.map((item, i) =>
    [
      `*${plural ? `Agendamento ${i + 1} — ` : ''}${item.categoria}:*`,
      ...(item.especialidade ? [`🏥 Especialidade: ${item.especialidade}`] : []),
      ...(item.medico ? [`👨‍⚕️ Profissional: ${item.medico}`] : []),
      ...(item.exame ? [`🔬 Exame: ${item.exame}`] : []),
      `📅 Data: ${item.dataFormatada}`,
      `🕐 Horário: ${item.horario}`,
    ].join('\n')
  );

  const temConsulta = itens.some((i) => i.categoria === 'Consulta Médica');

  return [
    plural
      ? `Olá! Gostaria de agendar os seguintes ${itens.length} atendimentos:`
      : 'Olá! Gostaria de fazer um agendamento.',
    '',
    ...blocos.flatMap((b) => [b, '']),
    `👤 Paciente: ${paciente}`,
    `📞 Telefone: ${telefone}`,
    `*Primeira vez na clínica?* ${primeiraVez ? 'Sim' : 'Não'}`,
    ...(observacoes ? [`📝 Observações: ${observacoes}`] : []),
    '',
    temConsulta
      ? 'Aguardo a confirmação de disponibilidade e as instruções para pagamento de 50% da consulta como confirmação do agendamento.'
      : 'Aguardo a confirmação de disponibilidade e as instruções para confirmação do agendamento.',
  ].join('\n');
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
