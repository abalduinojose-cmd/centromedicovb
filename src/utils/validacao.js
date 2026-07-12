/** Validação dos campos do agendamento (feedback em tempo real). */

export function validarNome(nome) {
  if (!nome || nome.trim().length < 5) return 'Informe seu nome completo (mín. 5 caracteres).';
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/.test(nome.trim())) return 'O nome deve conter apenas letras.';
  return '';
}

export function validarTelefone(telefone) {
  const digitos = (telefone || '').replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 11) return 'Informe um telefone válido com DDD.';
  return '';
}

export function validarEmail(email) {
  if (!email) return 'Informe seu e-mail.';
  const rfcBasico = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (!rfcBasico.test(email)) return 'Informe um e-mail válido (ex.: nome@email.com).';
  return '';
}

export function validarObservacoes(obs) {
  if (obs && obs.length > 200) return 'Máximo de 200 caracteres.';
  return '';
}

/** Valida o formulário completo do paciente. Retorna objeto de erros (vazio = ok). */
export function validarPaciente({ nome, telefone, email, observacoes }) {
  const erros = {};
  const eNome = validarNome(nome);
  const eTel = validarTelefone(telefone);
  const eEmail = validarEmail(email);
  const eObs = validarObservacoes(observacoes);
  if (eNome) erros.nome = eNome;
  if (eTel) erros.telefone = eTel;
  if (eEmail) erros.email = eEmail;
  if (eObs) erros.observacoes = eObs;
  return erros;
}
