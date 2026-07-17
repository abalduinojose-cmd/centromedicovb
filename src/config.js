/**
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  CHAVE MESTRA DAS FUNCIONALIDADES DO SITE                            │
 * │                                                                      │
 * │  false = desligado (site institucional — entrega da Fase 1)          │
 * │  true  = ligado    (projeto completo — Fase 2 contratada)            │
 * │                                                                      │
 * │  Basta trocar false/true e publicar. Nenhum outro arquivo muda.      │
 * └──────────────────────────────────────────────────────────────────────┘
 */
export const RECURSOS = {
  /**
   * Agendamento online (modal de 6 passos com lista de consultas e exames).
   * Desligado: os botões "Agendar Consulta"/"Agendar Exame" abrem o WhatsApp
   * da clínica com uma mensagem pronta e contextualizada.
   */
  agendamentoOnline: true,

  /**
   * Painéis internos: #/admin (recepção) e #/gestor (gestão).
   * Desligado: as rotas não abrem e o código não é carregado pelo navegador.
   */
  paineis: true,
};
