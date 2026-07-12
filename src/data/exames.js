/** Exames laboratoriais em destaque (arte oficial do Instagram da clínica). */
export const examesLaboratoriais = [
  { id: 'hemograma', nome: 'Hemograma', descricao: 'Avaliação completa das células do sangue: imunidade, anemia e infecções.' },
  { id: 'glicemia', nome: 'Glicemia', descricao: 'Medição da taxa de açúcar no sangue, essencial no controle do diabetes.' },
  { id: 'colesterol', nome: 'Colesterol Total', descricao: 'Monitoramento dos níveis de gordura no sangue e saúde cardiovascular.' },
  { id: 'tsh-t4', nome: 'TSH e T4 Livre', descricao: 'Avaliação da função da tireoide e do equilíbrio hormonal.' },
  { id: 'acido-urico', nome: 'Ácido Úrico', descricao: 'Diagnóstico de gota e acompanhamento da função renal.' },
  { id: 'transaminases', nome: 'Transaminases (TGO e TGP)', descricao: 'Avaliação da saúde do fígado e das vias biliares.' },
];

/** Tipos de ultrassonografia realizados na clínica. */
export const ultrassonografias = [
  { id: 'transvaginal', nome: 'Transvaginal' },
  { id: 'prostata', nome: 'Próstata' },
  { id: 'urinario', nome: 'Aparelho Urinário' },
  { id: 'abdomen', nome: 'Abdômen Total' },
  { id: 'mamaria', nome: 'Mamária' },
  { id: 'tireoide', nome: 'Tireoide' },
  { id: 'ecocardiograma', nome: 'Ecocardiograma' },
  { id: 'ecodopler', nome: 'Ecodopler / MAPA / Holter' },
];

/** Lista unificada para o fluxo de agendamento de exames. */
export const examesAgendaveis = [
  ...examesLaboratoriais.map((e) => ({ ...e, categoria: 'Laboratorial' })),
  ...ultrassonografias.map((u) => ({ ...u, categoria: 'Ultrassonografia', nome: `Ultrassom ${u.nome}` })),
];
