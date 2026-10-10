// Rotas: ligam URL + verbo HTTP a um método do controller.
const express = require('express');
const controller = require('../controllers/ItemController');

const router = express.Router();

// Express 4 não captura erros de funções async sozinho; este wrapper resolve.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', wrap(controller.index));
router.get('/novo', controller.formNovo);
router.post('/', wrap(controller.criar));
router.get('/:id/editar', wrap(controller.formEditar));
router.post('/:id', wrap(controller.atualizar));          // formulários HTML só enviam GET/POST
router.post('/:id/excluir', wrap(controller.remover));

module.exports = router;
