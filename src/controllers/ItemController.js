const express = require('express');
const ItemDAO = require('../dao/ItemDAO');
const { flash } = require('../extensions/flash');

const itemRouter = express.Router();

// Tipo de usuário administrador (ajuste para 'admin' se o seu login salvar string)
const TIPO_ADMIN = 1;

/**
 * Garante que o usuário esteja autenticado antes de acessar rotas de itens.
 */
function exigirLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    flash(req, 'Acesso não autorizado. Faça login para continuar.');
    return res.redirect('/usuarios/login');
  }
  return next();
}

/**
 * Garante que o usuário autenticado seja administrador.
 * Deve ser usado após exigirLogin.
 */
function exigirAdmin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    flash(req, 'Acesso não autorizado. Faça login para continuar.');
    return res.redirect('/usuarios/login');
  }

  if (req.session.usuario.tipo !== TIPO_ADMIN) {
    flash(req, 'Acesso não autorizado. Você não tem permissão para acessar esta página.');
    return res.redirect('/');
  }

  return next();
}

// Valida se o parâmetro :id é numérico antes de prosseguir para a rota
itemRouter.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).send('Item não encontrado.');
  next();
});

const dadosDoForm = (b = {}) => ({
  nome: b.nome,
  descricao: b.descricao,
  local: b.local,
  imagemUrl: b.imagemUrl,
  status: b.status || 'perdido',
});

// Aplica exigência de login para todas as rotas deste router
itemRouter.use(exigirLogin);

// Rota principal: listar itens (GET) e cadastrar item (POST)
itemRouter
  .route('/')
  .get(async (req, res) => {
    res.render('itens/index', {
      title: 'Cadê? - Itens',
      itens: await ItemDAO.listar(),
      STATUS: ItemDAO.STATUS,
      form: {},
      erros: [],
    });
  })
  .post(async (req, res) => {
    try {
      const dados = dadosDoForm(req.body);
      if (!dados.nome) {
        throw new Error('Informe o nome do item.');
      }
      await ItemDAO.salvar(dados);
      flash(req, 'Item cadastrado com sucesso!');
      return res.redirect('/');
    } catch (erro) {
      res.status(400).render('itens/index', {
        title: 'Cadê? - Itens',
        itens: await ItemDAO.listar(),
        STATUS: ItemDAO.STATUS,
        form: req.body || {},
        erros: [erro.message],
      });
    }
  });

// Rota de edição: restrita a administradores
itemRouter
  .route('/editar/:id')
  .all(exigirAdmin)
  .get(async (req, res) => {
    const item = await ItemDAO.buscarPorId(req.params.id);
    if (!item) return res.status(404).send('Item não encontrado.');
    res.render('itens/editar', {
      title: 'Cadê? - Editar Item',
      item,
      STATUS: ItemDAO.STATUS,
      erros: [],
    });
  })
  .post(async (req, res) => {
    try {
      const dados = dadosDoForm(req.body);
      if (!dados.nome) {
        throw new Error('Informe o nome do item.');
      }
      await ItemDAO.atualizar(req.params.id, dados);
      flash(req, 'Item atualizado com sucesso!');
      return res.redirect('/');
    } catch (erro) {
      const item = await ItemDAO.buscarPorId(req.params.id);
      res.status(400).render('itens/editar', {
        title: 'Cadê? - Editar Item',
        item: { ...item, ...req.body },
        STATUS: ItemDAO.STATUS,
        erros: [erro.message],
      });
    }
  });

// Rota de exclusão: restrita a administradores
itemRouter.post('/deletar/:id', exigirAdmin, async (req, res) => {
  try {
    await ItemDAO.deletar(req.params.id);
    flash(req, 'Item excluído com sucesso!');
  } catch (erro) {
    flash(req, 'Erro ao excluir o item.');
  }
  return res.redirect('/');
});

module.exports = itemRouter;