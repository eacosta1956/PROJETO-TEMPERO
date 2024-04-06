import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrarProduto')}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditarProduto')}>
        <Text style={styles.buttonText}>Editar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AlterarEstoque')}>
        <Text style={styles.buttonText}>Alterar Estoque</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListarProdutos')}>
        <Text style={styles.buttonText}>Listar Produtos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GerarRelatorios')}>
        <Text style={styles.buttonText}>Gerar Relatórios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrarProduto')}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
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
  button: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
