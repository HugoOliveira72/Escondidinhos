// CONTROLLER - equivalente a controllers/evento_controller.py.
// Como no Flask, as rotas ficam NO controller: o express.Router() faz o papel
// do Blueprint, e router.route(...).get/.post faz o papel de @route(methods=[...]).
//
// Express 5: os handlers async podem ser passados direto para a rota. Se uma
// Promise for rejeitada (ex.: banco fora do ar), o próprio Express captura o
// erro e responde 500, igual ao Flask. Por isso não existe mais o "wrap".
const express = require('express');
const Item = require('../models/Item');
const ItemDAO = require('../dao/ItemDAO');
const { flash } = require('../extensions/flash');

const itemRouter = express.Router(); // Python: evento_bp = Blueprint("evento", __name__)

// Python: <int:id> só aceita números.
// Express 5 não aceita mais regex na rota (":id(\\d+)"), então a validação
// do parâmetro "id" é feita aqui, uma única vez, para todas as rotas que o usam.
itemRouter.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).send('Item não encontrado.'); // Python: abort(404)
  next();
});

// Python: request.form["nome"], ...   |   Node: req.body (graças ao express.urlencoded)
// "b = {}": no Express 5, req.body fica undefined quando nenhum dado é lido.
const dadosDoForm = (b = {}) => ({
  nome: b.nome,
  descricao: b.descricao,
  local: b.local,
  imagemUrl: b.imagemUrl,
  status: b.status,
});

// Devolve a lista de mensagens se o erro for de validação do model; senão null.
const errosDeValidacao = (erro) =>
  erro.name === 'SequelizeValidationError' ? erro.errors.map((e) => e.message) : null;

// ---------- LISTAR + CADASTRAR  ("/", GET e POST) ----------
itemRouter
  .route('/')
  .get(async (req, res) => {
    res.render('itens/index', {
      title: 'Cadê? - Itens',
      itens: await ItemDAO.listar(),
      STATUS: Item.STATUS,
      form: {},
      erros: [],
    });
  })
  .post(async (req, res) => {
    try {
      const item = Item.build(dadosDoForm(req.body)); // Python: Evento(nome=..., ...)
      await ItemDAO.salvar(item);
      flash(req, 'Item cadastrado com sucesso!');
      return res.redirect('/');                       // Python: redirect(url_for("evento.index"))
    } catch (erro) {
      const erros = errosDeValidacao(erro);
      if (!erros) throw erro; // erro inesperado: o Express 5 captura e responde 500
      res.status(400).render('itens/index', {
        title: 'Cadê? - Itens',
        itens: await ItemDAO.listar(),
        STATUS: Item.STATUS,
        form: req.body || {},
        erros,
      });
    }
  });

// ---------- EDITAR  ("/editar/:id", GET e POST) ----------
itemRouter
  .route('/editar/:id')
  .get(async (req, res) => {
    const item = await ItemDAO.buscarPorId(req.params.id);
    if (!item) return res.status(404).send('Item não encontrado.'); // Python: abort(404)
    res.render('itens/editar', { title: 'Editar item', item, STATUS: Item.STATUS, erros: [] });
  })
  .post(async (req, res) => {
    const item = await ItemDAO.buscarPorId(req.params.id);
    if (!item) return res.status(404).send('Item não encontrado.');
    try {
      await ItemDAO.atualizar(item, dadosDoForm(req.body));
      flash(req, 'Item atualizado com sucesso!');
      return res.redirect('/');
    } catch (erro) {
      const erros = errosDeValidacao(erro);
      if (!erros) throw erro;
      res.status(400).render('itens/editar', {
        title: 'Editar item', item, STATUS: Item.STATUS, erros,
      });
    }
  });

// ---------- DELETAR  ("/deletar/:id", somente POST) ----------
// Excluir altera dados, então nunca deve ser feito por link (GET).
itemRouter.post('/deletar/:id', async (req, res) => {
  const item = await ItemDAO.buscarPorId(req.params.id);
  if (!item) return res.status(404).send('Item não encontrado.');
  await ItemDAO.deletar(item);
  flash(req, 'Item excluído com sucesso!');
  res.redirect('/');
});

module.exports = itemRouter;
