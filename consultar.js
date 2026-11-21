const { conectarBanco } = require('./src/database');
const PostagemDAO = require('./src/dao/PostagemDAO');

(async () => {
  await conectarBanco();
  const postagens = await PostagemDAO.listar();

  console.log('Postagens gravadas no banco:', postagens.length);
  console.log();
  for (const p of postagens) {
    console.log(p.id_postagem, p.status, p.item?.nome, p.item?.categoria, p.local);
  }
})();