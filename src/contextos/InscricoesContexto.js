import { createContext, useState } from 'react';

export const InscricoesContexto = createContext();

export function InscricoesProvedor({ children }) {
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
    <InscricoesContexto.Provider value={{ inscricoes, inscrever, cancelarInscricao }}>
      {children}
    </InscricoesContexto.Provider>
  );
}