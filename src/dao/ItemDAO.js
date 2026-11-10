// DAO (Data Access Object) - equivalente a dao/evento_dao.py.
// Concentra o acesso aos dados. O Controller não conhece o ORM nem SQL.
//
// Diferença importante: no Python as chamadas são síncronas; aqui o banco
// responde de forma assíncrona, então os métodos usam async/await.
const Item = require('../models/Item');

class ItemDAO {
  // Python: db.session.add(evento); db.session.commit()
  static async salvar(item) {
    await item.save();
  }

  // Python: Evento.query.all()  -> devolve uma lista de objetos
  static listar() {
    return Item.findAll({ order: [['id', 'DESC']] });
  }

  // Python: db.session.get(Evento, id)  -> objeto ou None   (aqui: ou null)
  static buscarPorId(id) {
    return Item.findByPk(id);
  }

  // Python: altera os atributos e faz commit; o ORM gera o UPDATE sozinho.
  static async atualizar(item, dados) {
    item.set(dados);
    await item.save();
  }

  // Python: db.session.delete(evento); db.session.commit()
  static async deletar(item) {
    await item.destroy();
  }
}

module.exports = ItemDAO;
