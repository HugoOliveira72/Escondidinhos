
// Equivalente a app.py do projeto Flask.

// 1. Importação das dependências
const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const itemRouter = require('./controllers/ItemController');
const { carregarMensagens } = require('./extensions/flash');
const { conectarBanco, criarTabelas } = require('./database');

// 2. Inicialização da aplicação Express
const app = express();

// 3. Configuração do mecanismo de templates EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração dos layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// 4. Configuração dos arquivos estáticos
// Disponibiliza CSS, imagens e JavaScript da pasta public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// 5. Middlewares para interpretação dos dados
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 6. Configuração de sessões
app.use(session({
  secret: 'dw2-chave-de-aula',
  resave: false,
  saveUninitialized: false
}));

// 7. Sistema de mensagens flash
app.use(carregarMensagens);

// 8. Registro das rotas
app.use(itemRouter);

// 9. Exportação da aplicação
module.exports = app;

// 10. Inicialização do servidor
// Equivalente ao if __name__ == "__main__" do Python.

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  (async () => {
    try {
      // Conecta ao banco de dados
      await conectarBanco();

      // Inicializa as tabelas (quando necessário)
      await criarTabelas();

      // Inicia o servidor Express
      app.listen(PORT, (erro) => {
        if (erro) {
          console.error('Erro ao iniciar o servidor:', erro);
          process.exitCode = 1;
          return;
        }

        console.log(`Servidor rodando em http://localhost:${PORT}`);
      });

    } catch (erro) {
      console.error('Erro ao inicializar a aplicação:', erro);
      process.exitCode = 1;
    }
  })();
}
