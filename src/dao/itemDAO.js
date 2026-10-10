// DAO: única camada que "conversa" com o banco para a entidade Item.
// O controller nunca chama o Sequelize direto; se amanhã o ORM ou o banco
// mudar, só este arquivo precisa ser alterado.
const Item = require('../models/Item');

class ItemDAO {
  static listar(filtro = {}) {
    const where = {};
    if (filtro.status) where.status = filtro.status;
    return Item.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  static buscarPorId(id) {
    return Item.findByPk(id);
  }

  static criar(dados) {
    return Item.create(dados);
  }

  static async atualizar(id, dados) {
    const item = await Item.findByPk(id);
    if (!item) return null;
    return item.update(dados);
  }

  static async remover(id) {
    const removidos = await Item.destroy({ where: { id } });
    return removidos > 0;
  }
}

module.exports = ItemDAO;
