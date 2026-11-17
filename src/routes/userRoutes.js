const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// --- Rotas de Autenticação ---
router.get('/login', UserController.formLogin);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);

// --- Rotas de Cadastro de Novo Usuário ---
router.get('/cadastrar', UserController.formCriar);
router.post('/cadastrar', UserController.criar);

// --- Rotas de CRUD de Usuários (Recomendado proteger posteriormente) ---
router.get('/', UserController.index);
router.get('/editar/:id', UserController.formEditar);
router.post('/editar/:id', UserController.atualizar);
router.post('/excluir/:id', UserController.excluir);

module.exports = router;