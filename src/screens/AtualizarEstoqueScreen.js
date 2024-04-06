import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/SQLite'; // Importe o banco de dados SQLite

export default function AtualizarEstoqueScreen() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [idProduto, setIdProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueAtual, setEstoqueAtual] = useState('');

  useEffect(() => {
    // Buscar e preencher o id do produto ao digitar o nome
    if (nomeProduto !== '') {
      db.transaction((transaction) => {
        transaction.executeSql(
          `SELECT id_produto FROM produtos WHERE nome_produto LIKE ?;`,
          [nomeProduto],
          (_, { rows }) => {
            if (rows.length > 0) {
              const { id_produto } = rows.item(0);
              setIdProduto(id_produto.toString());
            } else {
              setIdProduto('');
            }
          },
          (_, error) => {
            console.log('Erro ao buscar id do produto: ' + error);
          }
        );
      });
    }
  }, [nomeProduto]);

  const salvarMovimentacaoEstoque = (operacao) => {
    if (!idProduto || !quantidade) {
      Alert.alert('Atenção', 'Preencha o nome do produto e a quantidade!');
      return;
    }

    // Obter a data e hora atual no formato desejado (Brasil/São Paulo)
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Converter a quantidade para número inteiro
    const qtdInt = parseInt(quantidade);

    // Verificar se a operação é de adição ou retirada
    const qtdMovimentada = operacao === 'adicionar' ? qtdInt : -qtdInt;

    // Atualizar o estoque_atual na tabela estoque_atual
    db.transaction((transaction) => {
      transaction.executeSql(
        `UPDATE estoque_atual SET estoque_atual = estoque_atual + ? WHERE id_produto = ?;`,
        [qtdMovimentada, idProduto],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            // Inserir a movimentação na tabela entrada_saida
            transaction.executeSql(
              `INSERT INTO entrada_saida (id_produto, quantidade, data) VALUES (?, ?, ?);`,
              [idProduto, qtdMovimentada, dataAtual],
              () => {
                Alert.alert('Sucesso', 'Movimentação de estoque realizada com sucesso!');
                setNomeProduto('');
                setIdProduto('');
                setQuantidade('');
              },
              (_, error) => {
                Alert.alert('Erro', 'Erro ao salvar movimentação de estoque: ' + error);
              }
            );
          } else {
            Alert.alert('Erro', 'Produto não encontrado ou erro ao atualizar estoque.');
          }
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao atualizar estoque: ' + error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={nomeProduto}
        onChangeText={(text) => setNomeProduto(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="ID do produto"
        editable={false}
        value={idProduto}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={(text) => setQuantidade(text)}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#27ae60' }]}
        onPress={() => salvarMovimentacaoEstoque('adicionar')}
      >
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e74c3c' }]}
        onPress={() => salvarMovimentacaoEstoque('retirar')}
      >
        <Text style={styles.buttonText}>Retirar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '80%',
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
