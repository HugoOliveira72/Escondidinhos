// MODEL (ORM): descreve a tabela "itens" como uma classe JavaScript.
// O Sequelize cria a tabela e gera o SQL; você não escreve CREATE TABLE.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUS = ['perdido', 'encontrado', 'devolvido'];

const Item = sequelize.define(
  'Item',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Informe o nome do item.' } },
    },
    descricao: { type: DataTypes.TEXT },          // RF-0002
    imagemUrl: { type: DataTypes.STRING },        // RF-0003
    local: { type: DataTypes.STRING },            // RF-0004
    status: {
      type: DataTypes.STRING,
      defaultValue: 'perdido',
      validate: { isIn: { args: [STATUS], msg: 'Status inválido.' } },
    },
  },
  { tableName: 'itens' }
);

Item.STATUS = STATUS;

module.exports = Item;
