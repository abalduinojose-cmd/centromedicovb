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

/**
 * Exames e especialidades complementares, agrupados por categoria.
 * Cada exame tem descrição própria e é agendável de forma independente.
 */
export const examesComplementares = [
  {
    id: 'cardiologia',
    categoria: 'Cardiologia',
    icone: 'coracao',
    exames: [
      { id: 'ecg', nome: 'Eletrocardiograma (ECG)', icone: 'pulso', descricao: 'Registra a atividade elétrica do coração e identifica arritmias em poucos minutos.' },
      { id: 'holter-24h', nome: 'Holter 24 horas', icone: 'cronometro', descricao: 'Acompanha os batimentos cardíacos por 24 horas durante suas atividades normais.' },
      { id: 'mapa-24h', nome: 'MAPA', icone: 'pressao', descricao: 'Monitorização Ambulatorial da Pressão Arterial: registra sua pressão ao longo de 24 horas.' },
      { id: 'eco-doppler', nome: 'Eco Doppler', icone: 'coracao-orgao', descricao: 'Avalia por imagem as estruturas do coração e o fluxo do sangue em tempo real.' },
    ],
  },
  {
    id: 'pneumologia',
    categoria: 'Pneumologia',
    icone: 'pulmao',
    exames: [
      { id: 'espirometria', nome: 'Espirometria', icone: 'pulmao', descricao: 'Mede a capacidade e o fluxo de ar dos pulmões — indicada em asma, bronquite e DPOC.' },
    ],
  },
  {
    id: 'neurologia',
    categoria: 'Neurologia',
    icone: 'cerebro',
    exames: [
      { id: 'eeg', nome: 'Eletroencefalograma (EEG)', icone: 'cerebro', descricao: 'Registra a atividade elétrica do cérebro, auxiliando no diagnóstico de epilepsia e distúrbios do sono.' },
    ],
  },
  {
    id: 'doppler',
    categoria: 'Ultrassonografia Doppler',
    icone: 'onda',
    exames: [
      { id: 'doppler-carotidas', nome: 'Doppler de Carótidas', icone: 'pescoco', descricao: 'Avalia o fluxo das artérias do pescoço que irrigam o cérebro, identificando placas e obstruções.' },
      { id: 'doppler-vertebrais', nome: 'Doppler de Artérias Vertebrais', icone: 'cerebro', descricao: 'Analisa a circulação das artérias vertebrais — importante na investigação de tonturas e vertigens.' },
      { id: 'doppler-venoso', nome: 'Doppler Venoso', icone: 'gota', descricao: 'Investiga varizes, trombose e o retorno do sangue pelas veias dos membros.' },
      { id: 'doppler-arterial', nome: 'Doppler Arterial', icone: 'perna', descricao: 'Avalia a circulação arterial de braços e pernas, identificando obstruções e má circulação.' },
      { id: 'eco-doppler-fetal', nome: 'Eco Doppler Fetal', icone: 'bebe', descricao: 'Acompanha a circulação do bebê e da placenta ao longo da gestação.' },
    ],
  },
];

/** Lista unificada para o fluxo de agendamento de exames (a categoria vira o grupo do menu). */
export const examesAgendaveis = [
  ...examesLaboratoriais.map((e) => ({ ...e, categoria: 'Exames Laboratoriais' })),
  ...ultrassonografias.map((u) => ({ ...u, categoria: 'Ultrassonografias', nome: `Ultrassom ${u.nome}` })),
  ...examesComplementares.flatMap((grupo) =>
    grupo.exames.map((e) => ({ id: e.id, nome: e.nome, descricao: e.descricao, categoria: grupo.categoria }))
  ),
];

/** Categorias na ordem em que aparecem no menu de agendamento. */
export const categoriasAgendaveis = [...new Set(examesAgendaveis.map((e) => e.categoria))];
