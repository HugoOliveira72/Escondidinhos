const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

function exigirLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect('/usuarios/login');
  }
  return next();
}

// --- Rotas de Autenticação ---
router.get('/login', UserController.formLogin);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);

// --- Rotas de Cadastro de Novo Usuário ---
router.get('/cadastrar', UserController.formCriar);
router.post('/cadastrar', UserController.criar);

// --- Rotas de Perfil do Usuário Logado ---
router.get('/perfil', exigirLogin, UserController.perfil);
router.get('/perfil/editar', exigirLogin, UserController.formEditarPerfil);
router.post('/perfil/editar', exigirLogin, UserController.atualizarPerfil);
router.post('/perfil/excluir', exigirLogin, UserController.excluirPerfil);

// --- Rotas de CRUD de Usuários (Administração) ---
router.get('/', UserController.index);
router.get('/editar/:id', UserController.formEditar);
router.post('/editar/:id', UserController.atualizar);
router.post('/excluir/:id', UserController.excluir);

module.exports = router;