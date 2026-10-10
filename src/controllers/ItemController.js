// CONTROLLER: recebe a requisição HTTP, chama o DAO e escolhe a view.
// Não tem SQL nem HTML aqui.
const ItemDAO = require('../dao/ItemDAO');
const Item = require('../models/Item');

const camposPermitidos = ({ nome, descricao, imagemUrl, local, status }) => ({
  nome, descricao, imagemUrl, local, status,
});

const mensagensDeErro = (erro) =>
  erro.errors ? erro.errors.map((e) => e.message) : ['Erro inesperado.'];

module.exports = {
  async index(req, res) {
    const itens = await ItemDAO.listar({ status: req.query.status });
    res.render('itens/index', { itens, status: req.query.status || '', STATUS: Item.STATUS });
  },

  formNovo(req, res) {
    res.render('itens/form', { item: {}, erros: [], STATUS: Item.STATUS, acao: '/itens' });
  },

  async criar(req, res) {
    try {
      await ItemDAO.criar(camposPermitidos(req.body));
      res.redirect('/itens');
    } catch (erro) {
      res.status(400).render('itens/form', {
        item: req.body, erros: mensagensDeErro(erro), STATUS: Item.STATUS, acao: '/itens',
      });
    }
  },

  async formEditar(req, res) {
    const item = await ItemDAO.buscarPorId(req.params.id);
    if (!item) return res.status(404).send('Item não encontrado.');
    res.render('itens/form', {
      item, erros: [], STATUS: Item.STATUS, acao: `/itens/${item.id}`,
    });
  },

  async atualizar(req, res) {
    try {
      const item = await ItemDAO.atualizar(req.params.id, camposPermitidos(req.body));
      if (!item) return res.status(404).send('Item não encontrado.');
      res.redirect('/itens');
    } catch (erro) {
      res.status(400).render('itens/form', {
        item: { ...req.body, id: req.params.id },
        erros: mensagensDeErro(erro),
        STATUS: Item.STATUS,
        acao: `/itens/${req.params.id}`,
      });
    }
  },

  async remover(req, res) {
    await ItemDAO.remover(req.params.id);
    res.redirect('/itens');
  },
};
