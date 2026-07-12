import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Contexto global do fluxo de agendamento.
 * Controla abertura do modal (consulta/exame), pré-seleções e o modal de sucesso.
 */
const AgendamentoContext = createContext(null);

export function AgendamentoProvider({ children }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoInicial, setTipoInicial] = useState('consulta');
  const [preSelecao, setPreSelecao] = useState(null); // { especialidade } ou { exameId }
  const [sucessoAberto, setSucessoAberto] = useState(false);

  const abrirAgendamento = useCallback((tipo = 'consulta', selecao = null) => {
    setTipoInicial(tipo);
    setPreSelecao(selecao);
    setModalAberto(true);
  }, []);

  const fecharAgendamento = useCallback(() => setModalAberto(false), []);

  const confirmarEnvio = useCallback(() => {
    setModalAberto(false);
    setSucessoAberto(true);
  }, []);

  const fecharSucesso = useCallback(() => setSucessoAberto(false), []);

  const value = useMemo(
    () => ({
      modalAberto,
      tipoInicial,
      preSelecao,
      sucessoAberto,
      abrirAgendamento,
      fecharAgendamento,
      confirmarEnvio,
      fecharSucesso,
    }),
    [modalAberto, tipoInicial, preSelecao, sucessoAberto, abrirAgendamento, fecharAgendamento, confirmarEnvio, fecharSucesso]
  );

  return <AgendamentoContext.Provider value={value}>{children}</AgendamentoContext.Provider>;
}

export function useAgendamento() {
  const ctx = useContext(AgendamentoContext);
  if (!ctx) throw new Error('useAgendamento deve ser usado dentro de <AgendamentoProvider>');
  return ctx;
}
