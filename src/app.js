// Equivalente a app.py do projeto Flask.
const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const itemRouter = require('./controllers/ItemController');
const { carregarMensagens } = require('./extensions/flash');
const { conectarBanco, criarTabelas } = require('./database');

// Python: app = Flask(__name__)
const app = express();

// Templates EJS na pasta views/ (Flask usa Jinja2 em templates/).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// express-ejs-layouts faz o papel do {% extends "base.html" %}:
// views/layout.ejs é a "base" e cada página entra em <%- body %>.
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));            // lê os dados do <form>
app.use(express.static(path.join(__dirname, '..', 'public'))); // Python: pasta static/

// Python: app.secret_key = "..."  (necessária para flash/sessão)
app.use(session({ secret: 'dw2-chave-de-aula', resave: false, saveUninitialized: false }));
app.use(carregarMensagens);

// Python: app.register_blueprint(evento_bp)
app.use(itemRouter);

module.exports = app;

// Python: if __name__ == "__main__":
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  (async () => {
    await conectarBanco();
    await criarTabelas();
    app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
  })();
}
