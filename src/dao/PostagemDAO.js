const { prisma } = require('../database');

class PostagemDAO {
  static STATUS = ['perdido', 'encontrado', 'devolvido'];

  static CATEGORIAS = [
    'Eletrônico',
    'Material Escolar',
    'Documento / Carteira',
    'Chave',
    'Vestuário / Acessório',
    'Garrafa / Marmita',
    'Outros',
  ];

  /**
   * Lista todas as postagens (mais recentes primeiro) já trazendo os dados do Item vinculado.
   */
  static async listar() {
    return await prisma.postagem.findMany({
      orderBy: { id_postagem: 'desc' },
      include: {
        item: true,
      },
    });
  }

  /**
   * Busca uma postagem específica pelo ID com os dados do item.
   */
  static async buscarPorId(id) {
    return await prisma.postagem.findUnique({
      where: { id_postagem: Number(id) },
      include: {
        item: true,
      },
    });
  }

  /**
   * Cria simultaneamente o Item e a Postagem vinculada a ele.
   */
  static async criarComItem(dados) {
    return await prisma.postagem.create({
      data: {
        status: dados.status || 'perdido',
        descricao: dados.descricao || null,
        local: dados.local || null,
        data_encontrado: dados.data_encontrado ? new Date(`${dados.data_encontrado}T12:00:00`) : null,
        item: {
          create: {
            nome: dados.nome,
            categoria: dados.categoria,
            cor: dados.cor || null,
          },
        },
      },
      include: {
        item: true,
      },
    });
  }

  /**
   * Atualiza os dados da Postagem e do Item vinculado.
   */
  static async atualizarComItem(idPostagem, dados) {
    return await prisma.postagem.update({
      where: { id_postagem: Number(idPostagem) },
      data: {
        status: dados.status || 'perdido',
        descricao: dados.descricao || null,
        local: dados.local || null,
        data_encontrado: dados.data_encontrado ? new Date(`${dados.data_encontrado}T12:00:00`) : null,
        item: {
          update: {
            nome: dados.nome,
            categoria: dados.categoria,
            cor: dados.cor || null,
          },
        },
      },
      include: {
        item: true,
      },
    });
  }

  /**
   * Exclui a postagem e o item vinculado.
   */
  static async deletar(idPostagem) {
    const postagem = await prisma.postagem.findUnique({
      where: { id_postagem: Number(idPostagem) },
    });

    if (!postagem) return null;

    // Ao deletar o Item, o onDelete: Cascade remove automaticamente a Postagem vinculada
    return await prisma.item.delete({
      where: { id_item: postagem.id_item },
    });
  }
}

module.exports = PostagemDAO;