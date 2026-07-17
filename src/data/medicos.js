/**
 * Profissionais do Centro Médico Viver Bem.
 * `destaque: true` aparece primeiro na seção Equipe.
 */
export const medicos = [
  { id: 1, nome: 'Dr. Leonardo Lavinas', especialidade: 'cardiologia', bio: 'Cardiologista.', destaque: true, foto: 'img/equipe/leonardo-lavinas.jpg' },
  { id: 2, nome: 'Dra. Fernanda Trece', especialidade: 'endocrinologia', bio: 'Endocrinologista.', destaque: true, foto: 'img/equipe/fernanda-trece.jpg' },
  { id: 3, nome: 'Dra. Ana Beatriz', especialidade: 'odontologia', bio: 'Cirurgiã-dentista.', destaque: true, foto: 'img/equipe/ana-beatriz.jpg' },
  { id: 4, nome: 'Dra. Lara Xavier', especialidade: 'odontologia', bio: 'Cirurgiã-dentista.', destaque: true, foto: 'img/equipe/lara-xavier.jpg' },
  { id: 5, nome: 'Dr. Luiz Carlos Rollemberg', especialidade: 'urologia', bio: 'Urologista.', destaque: true, foto: 'img/equipe/luiz-rollemberg.jpg' },
  { id: 6, nome: 'Dra. Ana Cláudia Seidinger', especialidade: 'ginecologia', bio: 'Ginecologista.', destaque: true, foto: 'img/equipe/ana-claudia-seidinger.jpg' },
  { id: 7, nome: 'Dr. João Gustavo', especialidade: 'ultrassonografia', bio: 'Realiza os exames de ultrassonografia da clínica.', destaque: true, foto: 'img/equipe/joao-gustavo.jpg' },
  { id: 8, nome: 'Thaís Esteves', especialidade: 'podologia', bio: 'Podóloga.', destaque: true, foto: 'img/equipe/thais-esteves.jpg' },
  { id: 9, nome: 'Dra. Júlia Lima', especialidade: 'dermatologia', bio: 'Dermatologista.', destaque: true, foto: 'img/equipe/julia-lima.jpg' },
  { id: 10, nome: 'Dr. Maurício Masi', especialidade: 'dermatologia', bio: 'Dermatologista.', destaque: true, foto: 'img/equipe/mauricio-masi.jpg' },
  { id: 11, nome: 'Dra. Evelyn Brasil', especialidade: 'pediatria', bio: 'Pediatra.', destaque: true, foto: 'img/equipe/evelyn-brasil.jpg' },
  { id: 12, nome: 'Dra. Andréa Cristina Couto', especialidade: 'pediatria', bio: 'Pediatra.', destaque: true, foto: 'img/equipe/andrea-couto.jpg' },
  { id: 13, nome: 'Dr. Victor Titonelli', especialidade: 'ortopedia', bio: 'Ortopedista.', destaque: true, foto: 'img/equipe/victor-titonelli.jpg' },
  { id: 14, nome: 'Dra. Júlia Bacelar', especialidade: 'nutricao', bio: 'Nutricionista infantil.', destaque: true, foto: 'img/equipe/julia-bacelar.jpg' },
  { id: 15, nome: 'Dra. Priscila Portugal', especialidade: 'nutricao', bio: 'Nutricionista.', destaque: true, foto: 'img/equipe/priscila-portugal.jpg' },
  { id: 16, nome: 'Dra. Paula Abdu', especialidade: 'nutricao', bio: 'Nutricionista.', destaque: true, foto: 'img/equipe/paula-abdu.jpg' },
  { id: 17, nome: 'Dra. Valquiria', especialidade: 'nutricao', bio: 'Nutricionista.', destaque: true, foto: 'img/equipe/valquiria.jpg' },
  { id: 18, nome: 'Dra. Patrícia Musmanno', especialidade: 'clinica-geral', bio: 'Clínica Geral, especialista em Saúde do Adulto e do Idoso.', destaque: true, foto: 'img/equipe/patricia-musmanno.jpg' },
  { id: 19, nome: 'Dr. Pedro Judice', especialidade: 'angiologia', bio: 'Especialista em Angiologia.', destaque: true, foto: 'img/equipe/pedro-judice.jpg' },
  { id: 20, nome: 'Dr. Lécio Carneiro', especialidade: 'gastroenterologia', bio: 'Gastroenterologista.', destaque: true, foto: 'img/equipe/lecio-carneiro.jpg' },
  { id: 21, nome: 'Dra. Cristiana Tornaghi', especialidade: 'psicologia', bio: 'Psicóloga.' },
  { id: 22, nome: 'Dra. Rita de Cássia', especialidade: 'psicologia', bio: 'Psicoterapia individual, acupuntura para dor, ansiedade e insônia, e auriculoterapia como terapia complementar.', destaque: true, foto: 'img/equipe/rita-de-cassia.jpg' },
  { id: 23, nome: 'Dr. Marcos Cintra', especialidade: 'neurologia', bio: 'Neurologista.', destaque: true, foto: 'img/equipe/marcos-cintra.jpg' },
  { id: 24, nome: 'Dra. Giulie Antunes', especialidade: 'psiquiatria', bio: 'Atendimentos em Psiquiatria.', destaque: true, foto: 'img/equipe/giulie-antunes.jpg' },
  { id: 25, nome: 'Dra. Debora Lima', especialidade: 'fisioterapia', bio: 'Fisioterapeuta — RPG e Pilates.', destaque: true, foto: 'img/equipe/debora-lima.jpg' },
];

export const medicosPorEspecialidade = (especialidadeId) =>
  medicos.filter((m) => m.especialidade === especialidadeId);

/* Destaques ordenados: quem tem foto aparece primeiro. */
export const medicosDestaque = medicos
  .filter((m) => m.destaque)
  .sort((a, b) => (b.foto ? 1 : 0) - (a.foto ? 1 : 0));
