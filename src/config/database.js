// Conexão única com o SQLite, reaproveitada por todos os models.
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'), // arquivo criado automaticamente
  logging: false, // troque por console.log para ver o SQL gerado
});

module.exports = sequelize;
