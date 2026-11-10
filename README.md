# Cadê? - MVC + ORM + DAO + SQLite (Node.js + Express 5)

Estruturado da mesma forma que o `projeto-integrador-web2` (Flask).
Requer Node.js 18 ou superior.

## Como rodar
```bash
npm install
npm start            # http://localhost:3000
npm run consultar    # lista o que está gravado no banco (equivale ao consultar.py)
```

## Equivalência com o projeto Flask
| Flask (Python)                    | Node (este projeto)                  |
|-----------------------------------|--------------------------------------|
| app.py                            | src/app.js                           |
| extensions/__init__.py (db)       | src/extensions/index.js (db)         |
| database.py                       | src/database.js                      |
| models/evento.py                  | src/models/Item.js                   |
| dao/evento_dao.py                 | src/dao/ItemDAO.js                   |
| controllers/evento_controller.py  | src/controllers/ItemController.js    |
| templates/base.html               | src/views/layout.ejs                 |
| templates/index.html, editar.html | src/views/itens/index.ejs, editar.ejs|
| static/css/style.css              | public/css/style.css                 |
| requirements.txt + venv           | package.json + node_modules          |
| instance/eventos.db               | instance/itens.db                    |
| consultar.py                      | consultar.js                         |

## Express 5: o que mudou em relação ao Express 4
- Handlers `async` são passados direto para a rota; o Express captura os erros.
  (No Express 4 era preciso o `wrap`.)
- `:id(\\d+)` não é mais aceito; o `<int:id>` do Flask é reproduzido com
  `itemRouter.param('id', ...)` no controller.
- `req.body` pode ser `undefined`; o controller trata isso com `b = {}`.
- O callback de `app.listen` recebe o erro, se houver (ex.: porta ocupada).
