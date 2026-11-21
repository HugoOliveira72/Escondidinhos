const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const itemRouter = require('./controllers/ItemController');
const userRoutes = require('./routes/userRoutes'); // Rotas de login e CRUD de usuários
const { carregarMensagens } = require('./extensions/flash');
const { conectarBanco, criarTabelas } = require('./database');

const app = express();

// Configuração do EJS e Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configuração de Sessão
app.use(session({
  secret: 'dw2-chave-de-aula',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(carregarMensagens);

// Disponibiliza o usuário logado para todas as views EJS
app.use((req, res, next) => {
  res.locals.usuarioLogado = req.session ? req.session.usuario || null : null;
  next();
});

// Registro das Rotas do Sistema
app.use('/usuarios', userRoutes); // Prefixo /usuarios para autenticação e gestão
app.use(itemRouter);

module.exports = app;

// Inicialização do Servidor
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  (async () => {
    try {
      await conectarBanco();
      await criarTabelas();
      app.listen(PORT, (erro) => {
        if (erro) throw erro;
        console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("Erro fatal ao iniciar a aplicação:", err);
    }
  })();
}