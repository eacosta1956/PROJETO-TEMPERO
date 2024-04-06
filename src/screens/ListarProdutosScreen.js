import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../database/SQLite';

export default function ListarProdutosScreen() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT p.nome_produto, p.estoque_seguranca, p.estoque_minimo, p.data_cadastro, e.estoque_atual 
        FROM produtos AS p 
        LEFT JOIN estoque_atual AS e ON p.id_produto = e.id_produto;`,
        [],
        (_, { rows }) => {
          const produtosList = rows._array; // Convertendo os resultados em um array
          setProdutos(produtosList);
        },
        (_, error) => {
          console.log('Erro ao listar produtos: ' + error);
        }
      );
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Nome: {item.nome_produto}</Text>
      <Text>Estoque Atual: {item.estoque_atual}</Text>
      <Text>Estoque Segurança: {item.estoque_seguranca}</Text>
      <Text>Estoque Mínimo: {item.estoque_minimo}</Text>
      <Text>Data Cadastro: {item.data_cadastro}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => item.nome_produto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
