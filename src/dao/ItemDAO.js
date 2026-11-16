const { prisma } = require('../database');

class ItemDAO {
  static async salvar(dados) {
    return await prisma.item.create({
      data: dados,
    });
  }

  static async listar() {
    return await prisma.item.findMany({
      orderBy: { id: 'desc' },
    });
  }

  static async buscarPorId(id) {
    return await prisma.item.findUnique({
      where: { id: Number(id) },
    });
  }

  static async atualizar(id, dados) {
    return await prisma.item.update({
      where: { id: Number(id) },
      data: dados,
    });
  }

  static async deletar(id) {
    return await prisma.item.delete({
      where: { id: Number(id) },
    });
  }
}

ItemDAO.STATUS = ['perdido', 'encontrado', 'devolvido'];

module.exports = ItemDAO;