// Equivalente a extensions/__init__.py do projeto Flask.
// O objeto do ORM ("db") é criado em UM único lugar; models e DAO importam daqui.
//
// Diferença para o Flask-SQLAlchemy: lá o db nasce "solto" e é ligado ao app
// depois (db.init_app). No Sequelize a configuração do banco já vai na criação.
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Igual ao Flask: o arquivo do SQLite fica na pasta "instance/".
const pastaInstance = path.join(__dirname, '..', '..', 'instance');
fs.mkdirSync(pastaInstance, { recursive: true });

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(pastaInstance, 'itens.db'), // criado automaticamente se não existir
  logging: false,                                // use console.log para ver o SQL gerado
});

module.exports = { db };
