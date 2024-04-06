import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CadastrarProdutoScreen from './src/screens/CadastrarProdutoScreen';
import EditarProdutoScreen from './src/screens/EditarProdutoScreen';
import ListarProdutosScreen from './src/screens/ListarProdutosScreen';
import AlterarEstoqueScreen from './src/screens/AlterarEstoqueScreen';
import ExcluirProdutoScreen from './src/screens/ExcluirProdutoScreen';
import GerarRelatoriosScreen from './src/screens/GerarRelatoriosScreen';
import { criaTabelas } from './src/database/ControleEstoque';

// Configuração da navegação
const Stack = createStackNavigator();

export default function App() {
  // Criar as tabelas ao iniciar o aplicativo
  React.useEffect(() => {
    criaTabelas();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CadastrarProduto" component={CadastrarProdutoScreen} />
        <Stack.Screen name="EditarProduto" component={EditarProdutoScreen} />
        <Stack.Screen name="ListarProdutos" component={ListarProdutosScreen} />
        <Stack.Screen name="AlterarEstoque" component={AlterarEstoqueScreen} />
        <Stack.Screen name="ExcluirProduto" component={ExcluirProdutoScreen} />
        <Stack.Screen name="GerarRelatorios" component={GerarRelatoriosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

