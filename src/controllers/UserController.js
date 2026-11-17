const UserDAO = require('../dao/UserDAO');
const bcrypt = require('bcrypt');

class UserController {
  /**
   * Exibe a listagem de usuários (Área administrativa).
   */
  async index(req, res) {
    try {
      const usuarios = await UserDAO.listar();
      res.render('usuarios/index', { usuarios, usuarioLogado: req.session.usuario });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).send("Erro interno ao carregar usuários.");
    }
  }

  /**
   * Renderiza o formulário de cadastro de novo usuário.
   */
  formCriar(req, res) {
    res.render('usuarios/criar');
  }

  /**
   * Processa o cadastro de um novo usuário com senha criptografada.
   */
  async criar(req, res) {
    try {
      const { nome, senha, contato, tipoUser } = req.body;

      if (!nome || !senha) {
        return res.status(400).send("Nome e senha são obrigatórios.");
      }

      // Segurança: Gera o hash da senha (10 rodadas de salt)
      const senhaHash = await bcrypt.hash(senha, 10);

      await UserDAO.criar({
        nome,
        senha: senhaHash,
        contato,
        tipoUser: tipoUser || 0
      });

      res.redirect('/usuarios/login');
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).send("Erro ao processar o cadastro.");
    }
  }

  /**
   * Renderiza o formulário de edição de um usuário.
   */
  async formEditar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UserDAO.buscarPorId(id);

      if (!usuario) {
        return res.status(404).send("Usuário não encontrado.");
      }

      res.render('usuarios/editar', { usuario });
    } catch (error) {
      console.error("Erro ao carregar formulário de edição:", error);
      res.status(500).send("Erro ao carregar dados.");
    }
  }

  /**
   * Processa a atualização dos dados do usuário.
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, contato, tipoUser, senha } = req.body;

      let dadosAtualizados = { nome, contato, tipoUser };

      // Se uma nova senha foi informada, atualiza o hash
      if (senha && senha.trim() !== "") {
        dadosAtualizados.senha = await bcrypt.hash(senha, 10);
      }

      await UserDAO.atualizar(id, dadosAtualizados);
      res.redirect('/usuarios');
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).send("Erro ao atualizar dados.");
    }
  }

  /**
   * Exclui um usuário do sistema.
   */
  async excluir(req, res) {
    try {
      const { id } = req.params;
      await UserDAO.excluir(id);
      res.redirect('/usuarios');
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).send("Erro ao remover usuário.");
    }
  }

  /**
   * Renderiza a tela de login.
   */
  formLogin(req, res) {
    res.render('usuarios/login', { erro: null });
  }

  /**
   * Processa a autenticação do usuário (Login).
   */
  async login(req, res) {
    try {
      const { contato, senha } = req.body;

      const usuario = await UserDAO.buscarPorContato(contato);
      if (!usuario) {
        return res.render('usuarios/login', { erro: 'Credenciais inválidas.' });
      }

      // Compara a senha digitada com o hash armazenado no banco
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.render('usuarios/login', { erro: 'Credenciais inválidas.' });
      }

      // Salva os dados essenciais na sessão
      req.session.usuario = {
        id: usuario.idUser,
        nome: usuario.nome,
        tipo: usuario.tipoUser
      };

      res.redirect('/');
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).send("Erro ao realizar login.");
    }
  }

  /**
   * Encerra a sessão do usuário (Logout).
   */
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/usuarios/login');
    });
  }
}

module.exports = new UserController();