import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../database/SQLite'; // Importe o banco de dados SQLite

export default function CadastrarProdutoScreen({ navigation }) {
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [estoqueSeguranca, setEstoqueSeguranca] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');

  const salvarProduto = () => {
    if (!descricaoProduto || !estoqueSeguranca || !estoqueMinimo) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    // Obter a data e hora atual no formato desejado (Brasil/São Paulo)
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Inserir os dados na tabela produtos
    db.transaction((transaction) => {
      transaction.executeSql(
        `INSERT INTO produtos (nome_produto, estoque_seguranca, estoque_minimo, data_cadastro) 
        VALUES (?, ?, ?, ?);`,
        [descricaoProduto, parseInt(estoqueSeguranca), parseInt(estoqueMinimo), dataAtual],
        () => {
          Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
          // Limpar os campos após o cadastro
          setDescricaoProduto('');
          setEstoqueSeguranca('');
          setEstoqueMinimo('');
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao cadastrar produto: ' + error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Descrição do produto"
        value={descricaoProduto}
        onChangeText={(text) => setDescricaoProduto(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Estoque de segurança"
        keyboardType="numeric"
        value={estoqueSeguranca}
        onChangeText={(text) => setEstoqueSeguranca(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Estoque mínimo"
        keyboardType="numeric"
        value={estoqueMinimo}
        onChangeText={(text) => setEstoqueMinimo(text)}
      />
      <TouchableOpacity style={styles.button} onPress={salvarProduto}>
        <Text style={styles.buttonText}>Salvar Produto</Text>
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
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
