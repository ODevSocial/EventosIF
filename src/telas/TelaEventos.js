import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet,
} from 'react-native';
import { AppContexto } from '../contextos/AppContexto';
import CartaoEvento from '../componentes/CartaoEvento';

const estadoInicial = {
  eventos: [],
  carregando: true,
  erro: null,
};

function eventosReducer(estado, acao) {
  switch (acao.tipo) {
    case 'FETCH_SUCESSO':
      return { ...estado, carregando: false, eventos: acao.payload, erro: null };
    case 'FETCH_ERRO':
      return { ...estado, carregando: false, erro: acao.payload };
    default:
      return estado;
  }
}

export default function TelaEventos({ navigation }) {
  const { temaEscuro, inscricoes, inscrever: inscreverNoContexto } = useContext(AppContexto);

  const [estadoEventos, dispatch] = useReducer(eventosReducer, estadoInicial);
  const { eventos, carregando, erro } = estadoEventos;

  const [enviado, setEnviado] = useState(false);
  const [busca, setBusca] = useState('');
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const eventosFiltrados = eventos.filter((ev) =>
    ev.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  const totalInscricoes = inscricoes.length;

  useEffect(() => {
    fetch('https://api.campus.iftm.edu.br/eventos')
      .then((resposta) => resposta.json())
      .then((dados) => {
        dispatch({ tipo: 'FETCH_SUCESSO', payload: dados });
      })
      .catch((e) => {
        dispatch({ tipo: 'FETCH_ERRO', payload: e.message });
      });
  }, []);

  // R6: Funções memorizadas para manter referência estável entre renderizações
  const handleInscrever = useCallback((evento) => {
    inscreverNoContexto(evento);
    setEventoSelecionado(evento);
    setEnviado(true);
  }, [inscreverNoContexto]);

  const handleAbrir = useCallback((eventoId) => {
    navigation.navigate('Detalhe', { eventoId, eventos });
  }, [navigation, eventos]);

  console.log('[render] TelaEventos');

  return (
    <View style={[styles.container, { backgroundColor: temaEscuro ? '#121212' : '#FFFFFF' }]}>
      <Text style={styles.contador}>Inscrições: {totalInscricoes}</Text>
      <TextInput
        style={styles.campo}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar evento"
      />
      {carregando && <ActivityIndicator size="large" />}
      {erro && <Text style={styles.erro}>Falha: {erro}</Text>}
      {enviado && eventoSelecionado && (
        <Text style={styles.aviso}>Inscrição confirmada em {eventoSelecionado.titulo}</Text>
      )}
      <FlatList
        data={eventosFiltrados}
        keyExtractor={(itemLista) => String(itemLista.id)}
        renderItem={({ item }) => (
          <CartaoEvento
            evento={item}
            aoInscrever={() => handleInscrever(item)}
            aoAbrir={() => handleAbrir(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  contador: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  campo: { borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8, padding: 10, marginBottom: 12 },
  erro: { color: '#B00020', marginBottom: 8 },
  aviso: { color: '#2E7D32', marginBottom: 8 },
});