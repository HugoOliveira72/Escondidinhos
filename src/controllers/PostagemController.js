const express = require('express');
const PostagemDAO = require('../dao/PostagemDAO');
const { flash } = require('../extensions/flash');
const upload = require('../middlewares/upload');

const postagemRouter = express.Router();
const TIPO_ADMIN = 1;

function exigirLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    flash(req, 'Acesso não autorizado. Faça login para continuar.', 'erro');
    return res.redirect('/usuarios/login');
  }
  return next();
}

function exigirAdmin(req, res, next) {
  if (!req.session || !req.session.usuario) {
    flash(req, 'Acesso não autorizado. Faça login para continuar.', 'erro');
    return res.redirect('/usuarios/login');
  }

  if (req.session.usuario.tipo !== TIPO_ADMIN) {
    flash(req, 'Acesso não autorizado. Apenas administradores podem criar, editar ou excluir postagens.', 'erro');
    return res.redirect('/');
  }

  return next();
}

// Middleware para capturar erros do Multer (ex.: tamanho ou tipo de arquivo inválido)
function lidarComUpload(maxArquivos = 5) {
  const middleware = upload.array('imagens', maxArquivos);
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err) {
        req.erroUpload = err.message || 'Erro ao processar o envio da imagem.';
      }
      return next();
    });
  };
}

postagemRouter.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).send('Postagem não encontrada.');
  next();
});

const dadosDoForm = (b = {}) => ({
  nome: b.nome,
  categoria: b.categoria,
  cor: b.cor,
  status: b.status || 'perdido',
  descricao: b.descricao,
  local: b.local,
  data_encontrado: b.data_encontrado || null,
});

// Exige autenticação em todas as rotas de postagens
postagemRouter.use(exigirLogin);

// Rota principal ('/'):
// - GET: todos os usuários logados visualizam a lista de postagens
// - POST: apenas administradores criam postagem + item
postagemRouter
  .route('/')
  .get(async (req, res) => {
    res.render('postagens/index', {
      title: 'Cadê? - Postagens',
      postagens: await PostagemDAO.listar(),
      STATUS: PostagemDAO.STATUS,
      CATEGORIAS: PostagemDAO.CATEGORIAS,
      form: {},
      erros: [],
    });
  })
  .post(exigirAdmin, lidarComUpload(5), async (req, res) => {
    try {
      if (req.erroUpload) {
        throw new Error(req.erroUpload);
      }

      const dados = dadosDoForm(req.body);
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Informe o nome do item.');
      }
      if (!dados.categoria) {
        throw new Error('Selecione a categoria do item.');
      }

      // Caminhos públicos salvos no banco (via ItemImagem.url)
      dados.imagens = (req.files || []).map((file) => `/uploads/${file.filename}`);

      await PostagemDAO.criarComItem(dados);
      flash(req, 'Postagem e item cadastrados com sucesso!');
      return res.redirect('/');
    } catch (erro) {
      res.status(400).render('postagens/index', {
        title: 'Cadê? - Postagens',
        postagens: await PostagemDAO.listar(),
        STATUS: PostagemDAO.STATUS,
        CATEGORIAS: PostagemDAO.CATEGORIAS,
        form: req.body || {},
        erros: [erro.message],
      });
    }
  });

// Edição de postagem e item (restrita a admin)
postagemRouter
  .route('/editar/:id')
  .all(exigirAdmin)
  .get(async (req, res) => {
    const postagem = await PostagemDAO.buscarPorId(req.params.id);
    if (!postagem) return res.status(404).send('Postagem não encontrada.');

    res.render('postagens/editar', {
      title: 'Cadê? - Editar Postagem',
      postagem,
      STATUS: PostagemDAO.STATUS,
      CATEGORIAS: PostagemDAO.CATEGORIAS,
      erros: [],
    });
  })
  .post(lidarComUpload(5), async (req, res) => {
    try {
      if (req.erroUpload) {
        throw new Error(req.erroUpload);
      }

      const dados = dadosDoForm(req.body);
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Informe o nome do item.');
      }
      if (!dados.categoria) {
        throw new Error('Selecione a categoria do item.');
      }

      const postagemAtual = await PostagemDAO.buscarPorId(req.params.id);
      if (!postagemAtual) {
        return res.status(404).send('Postagem não encontrada.');
      }

      // Se enviou novas imagens, usa elas; caso contrário, mantém as atuais
      if (req.files && req.files.length > 0) {
        dados.imagens = req.files.map((file) => `/uploads/${file.filename}`);
      } else {
        const imagensExistentes = postagemAtual.item?.imagens || [];
        dados.imagens = imagensExistentes.map((img) => img.url);
      }

      await PostagemDAO.atualizarComItem(req.params.id, dados);
      flash(req, 'Postagem atualizada com sucesso!');
      return res.redirect('/');
    } catch (erro) {
      const postagem = await PostagemDAO.buscarPorId(req.params.id);
      res.status(400).render('postagens/editar', {
        title: 'Cadê? - Editar Postagem',
        postagem: {
          ...postagem,
          ...req.body,
          item: { ...(postagem?.item || {}), ...req.body },
        },
        STATUS: PostagemDAO.STATUS,
        CATEGORIAS: PostagemDAO.CATEGORIAS,
        erros: [erro.message],
      });
    }
  });

// Exclusão de postagem e item (restrita a admin)
postagemRouter.post('/deletar/:id', exigirAdmin, async (req, res) => {
  try {
    await PostagemDAO.deletar(req.params.id);
    flash(req, 'Postagem excluída com sucesso!');
  } catch (erro) {
    flash(req, 'Erro ao excluir a postagem.', 'erro');
  }
  return res.redirect('/');
});

module.exports = postagemRouter;