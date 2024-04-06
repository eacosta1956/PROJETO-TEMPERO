import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import { db } from '../database/SQLite';

export default function ExcluirProdutoScreen({ navigation }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [idProduto, setIdProduto] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (nomeProduto.trim() !== '') {
      buscarIdProduto();
    }
  }, [nomeProduto]);

  const buscarIdProduto = () => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `SELECT id_produto FROM produtos WHERE nome_produto LIKE ? LIMIT 1;`,
        [nomeProduto],
        (_, { rows }) => {
          if (rows.length > 0) {
            setIdProduto(rows.item(0).id_produto.toString());
          } else {
            setIdProduto('Produto não encontrado');
          }
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao buscar ID do produto: ' + error);
        }
      );
    });
  };

  const confirmarExclusao = () => {
    setModalVisible(true);
  };

  const excluirProduto = () => {
    db.transaction((transaction) => {
      transaction.executeSql(
        `DELETE FROM produtos WHERE id_produto = ?;`,
        [idProduto],
        () => {
          transaction.executeSql(
            `DELETE FROM estoque_atual WHERE id_produto = ?;`,
            [idProduto],
            () => {
              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              setModalVisible(false);
              navigation.goBack(); // Volta para a tela anterior
            },
            (_, error) => {
              Alert.alert('Erro', 'Erro ao excluir produto do estoque atual: ' + error);
            }
          );
        },
        (_, error) => {
          Alert.alert('Erro', 'Erro ao excluir produto: ' + error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={(text) => setNomeProduto(text)}
      />
      <Text>ID do Produto: {idProduto}</Text>
      <TouchableOpacity style={styles.button} onPress={confirmarExclusao}>
        <Text style={styles.buttonText}>Excluir Produto</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Tem certeza de que deseja excluir o produto do banco de dados?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonModal} onPress={excluirProduto}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonModal, styles.buttonModalCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  buttonModal: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    backgroundColor: '#3498db',
  },
  buttonModalCancel: {
    backgroundColor: '#aaa',
  },
});
