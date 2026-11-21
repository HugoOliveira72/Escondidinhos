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

  static normalizarImagens(imagensInput) {
    if (!imagensInput) return [];
    const lista = Array.isArray(imagensInput)
      ? imagensInput
      : String(imagensInput).split(/[\r\n,]+/);

    return lista
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  }

  static async listar() {
    return await prisma.postagem.findMany({
      orderBy: { id_postagem: 'desc' },
      include: {
        item: {
          include: {
            imagens: {
              orderBy: { ordem: 'asc' },
            },
          },
        },
      },
    });
  }

  static async buscarPorId(id) {
    return await prisma.postagem.findUnique({
      where: { id_postagem: Number(id) },
      include: {
        item: {
          include: {
            imagens: {
              orderBy: { ordem: 'asc' },
            },
          },
        },
      },
    });
  }

  static async criarComItem(dados) {
    const urls = PostagemDAO.normalizarImagens(dados.imagens);

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
            imagens: {
              create: urls.map((url, index) => ({
                url,
                ordem: index,
              })),
            },
          },
        },
      },
      include: {
        item: {
          include: { imagens: true },
        },
      },
    });
  }

  static async atualizarComItem(idPostagem, dados) {
    const id = Number(idPostagem);
    const urls = PostagemDAO.normalizarImagens(dados.imagens);

    return await prisma.$transaction(async (tx) => {
      const postagemAtual = await tx.postagem.findUnique({
        where: { id_postagem: id },
        select: { id_item: true },
      });

      if (postagemAtual) {
        await tx.itemImagem.deleteMany({
          where: { id_item: postagemAtual.id_item },
        });
      }

      return await tx.postagem.update({
        where: { id_postagem: id },
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
              imagens: {
                create: urls.map((url, index) => ({
                  url,
                  ordem: index,
                })),
              },
            },
          },
        },
        include: {
          item: {
            include: { imagens: true },
          },
        },
      });
    });
  }

  static async deletar(idPostagem) {
    const postagem = await prisma.postagem.findUnique({
      where: { id_postagem: Number(idPostagem) },
    });

    if (!postagem) return null;

    return await prisma.item.delete({
      where: { id_item: postagem.id_item },
    });
  }
}

module.exports = PostagemDAO;