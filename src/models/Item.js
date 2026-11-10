// MODEL - equivalente a models/evento.py (class Evento(db.Model)).
// Cada atributo vira uma coluna; o id (chave primária) é criado automaticamente.
const { DataTypes } = require('sequelize');
const { db } = require('../extensions');

const STATUS = ['perdido', 'encontrado', 'devolvido'];

const Item = db.define(
  'Item',
  {
    // db.Column(db.String(120), nullable=False)
    nome: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: { msg: 'Informe o nome do item.' } },
    },
    descricao: { type: DataTypes.TEXT },       // RF-0002
    local: { type: DataTypes.STRING(120) },    // RF-0004
    imagemUrl: { type: DataTypes.STRING },     // RF-0003
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'perdido',
      validate: { isIn: { args: [STATUS], msg: 'Status inválido.' } },
    },
  },
  { tableName: 'itens' }
);

Item.STATUS = STATUS;

module.exports = Item;
