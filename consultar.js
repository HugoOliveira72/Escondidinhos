// Equivalente a consultar.py: prova que os dados sobrevivem ao encerramento do app.
// Rode com:  npm run consultar
const { conectarBanco } = require('./src/database');
const ItemDAO = require('./src/dao/ItemDAO');

(async () => {
  await conectarBanco();
  const itens = await ItemDAO.listar();

  console.log('Itens gravados no banco:', itens.length);
  console.log();
  for (const i of itens) {
    console.log(i.id, i.status, i.nome, i.local);
  }
  console.log();
  console.log('Os dados sobreviveram ao encerramento da aplicação.');
})();
