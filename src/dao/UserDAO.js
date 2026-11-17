const { prisma } = require('../database');

class UserDAO {
  /**
   * Retorna todos os usuários cadastrados.
   */
  async listar() {
    return await prisma.user.findMany({
      orderBy: { idUser: 'desc' }
    });
  }

  /**
   * Busca um usuário pelo ID.
   * @param {number} id 
   */
  async buscarPorId(id) {
    return await prisma.user.findUnique({
      where: { idUser: Number(id) }
    });
  }

  /**
   * Busca um usuário pelo contato/e-mail (utilizado no login).
   * @param {string} contato 
   */
  async buscarPorContato(contato) {
    return await prisma.user.findFirst({
      where: { contato }
    });
  }

  /**
   * Cria um novo usuário no banco de dados.
   * @param {Object} dados 
   */
  async criar(dados) {
    return await prisma.user.create({
      data: {
        nome: dados.nome,
        senha: dados.senha, // Já vem com hash gerado pelo bcrypt
        contato: dados.contato,
        tipoUser: dados.tipoUser !== undefined ? Number(dados.tipoUser) : 0,
        UpdatedAt: new Date()
      }
    });
  }

  /**
   * Atualiza os dados de um usuário existente.
   * @param {number} id 
   * @param {Object} dados 
   */
  async atualizar(id, dados) {
    return await prisma.user.update({
      where: { idUser: Number(id) },
      data: {
        nome: dados.nome,
        contato: dados.contato,
        tipoUser: dados.tipoUser !== undefined ? Number(dados.tipoUser) : undefined,
        senha: dados.senha ? dados.senha : undefined,
        UpdatedAt: new Date()
      }
    });
  }

  /**
   * Remove um usuário pelo ID.
   * @param {number} id 
   */
  async excluir(id) {
    return await prisma.user.delete({
      where: { idUser: Number(id) }
    });
  }
}

module.exports = new UserDAO();