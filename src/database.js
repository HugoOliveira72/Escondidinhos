// Equivalente a database.py do projeto Flask.
const { db } = require('./extensions');
require('./models/Item'); // registra o model no ORM antes de criar as tabelas

// Flask: conectar_banco(app) -> aqui só confirma que a conexão funciona,
// pois o Sequelize já recebeu a configuração em extensions/index.js.
async function conectarBanco() {
  await db.authenticate();
}

// Flask: criar_tabelas(app) -> db.create_all()   |   Sequelize: db.sync()
// Cria as tabelas que ainda não existem (não altera as que já existem).
async function criarTabelas() {
  await db.sync();
}

module.exports = { conectarBanco, criarTabelas };
