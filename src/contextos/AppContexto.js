import { createContext, useState } from 'react';

export const AppContexto = createContext();

export function AppProvedor({ children }) {
  const [usuario, setUsuario] = useState({ nome: 'Visitante', matricula: null });
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [ultimaBusca, setUltimaBusca] = useState('');
  
  // R4: Elevação do estado de inscrições para o contexto global
  const [inscricoes, setInscricoes] = useState([]);

  function inscrever(evento) {
    setInscricoes((anteriores) => {
      const jaInscrito = anteriores.some((item) => item.id === evento.id);
      if (jaInscrito) return anteriores;
      return [...anteriores, evento];
    });
  }

  function cancelarInscricao(id) {
    setInscricoes((anteriores) => anteriores.filter((i) => i.id !== id));
  }

  return (
    <AppContexto.Provider
      value={{
        usuario, setUsuario,
        temaEscuro, setTemaEscuro,
        notificacoes, setNotificacoes,
        ultimaBusca, setUltimaBusca,
        inscricoes,
        inscrever,
        cancelarInscricao,
      }}
    >
      {children}
    </AppContexto.Provider>
  );
}