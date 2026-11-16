const express = require('express');
const ItemDAO = require('../dao/ItemDAO');
const { flash } = require('../extensions/flash');

const itemRouter = express.Router();

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

itemRouter
  .route('/editar/:id')
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

itemRouter.post('/deletar/:id', async (req, res) => {
  try {
    await ItemDAO.deletar(req.params.id);
    flash(req, 'Item excluído com sucesso!');
  } catch (erro) {
    flash(req, 'Erro ao excluir o item.');
  }
  return res.redirect('/');
});

module.exports = itemRouter;