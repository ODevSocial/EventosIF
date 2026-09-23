Este repositório documenta a evolução arquitetural e as otimizações de desempenho aplicadas ao aplicativo EventosIF.
O objetivo principal desta intervenção foi erradicar más práticas comuns de gerenciamento de estado no React Native — tais como mutações diretas de estado, sincronização redundante via efeitos, acoplamento de rotas e re-renderizações em cascata —, reestruturando a aplicação em sete etapas progressivas de commit.

Commit,Diagnóstico do Problema,Solução Implementada,Impacto Técnico:

R1,Estado derivado desnecessário: Uso de useState e useEffect para calcular eventosFiltrados e totalInscricoes.,Computation em tempo de execução diretamente no corpo do componente. Eliminação de ciclos de renderização secundários provocados por atualizações em cadeia.

R2,Mutação direta de estado: Inserção de elementos via .push() no array inscricoes.,Atualização funcional imutável com operador spread (...) e checagem de duplicidade. Preservação da imutabilidade exigida pelo algoritmo de reconciliação do React.

R3,Acoplamento na navegação: Passagem do objeto completo do evento pelos parâmetros de rota. "Envio exclusivo do identificador (eventoId), consultando os dados na fonte de verdade." Prevenção de dados obsoletos (stale data) e otimização do payload de navegação.

R4,Estado isolado: O estado de inscrições existia apenas localmente em TelaEventos. Elevação de estado (state lifting) para o contexto global. Sincronização em tempo real entre a listagem de eventos e a aba de inscrições do usuário.

R5,"Estados assíncronos fragmentados: Vários useState para controlar a requisição (eventos, carregando, erro)." Consolidação da lógica assíncrona por meio de useReducer com ações explícitas.,Transições de estado atômicas e eliminação de combinações de estados impossíveis.

R6,Re-renderizações em cascata: Alterações no filtro de busca re-renderizavam toda a lista de cartões. Memorização com React.memo em CartaoEvento e estabilização de handlers via useCallback. Isolamento da renderização dos itens da lista durante interações no campo de texto.

R7,"Contexto inflado (""Deus Contexto""): Concentração de responsabilidades não correlacionadas no mesmo provedor." Divisão modular criando o InscricoesContexto isolado do AppContexto.,Separação clara de responsabilidades (SoC) e contenção de re-renderizações globais.
