import * as SQLite from "expo-sqlite"

function abreConexao() {
  const database = SQLite.openDatabase("ControleEstoque.db")
  return database
}

export const db = abreConexao()
