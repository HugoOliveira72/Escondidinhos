// Guarda a mensagem na sessão, sobrevive ao redirect e é mostrada uma única vez.
// O parâmetro "tipo" é opcional: 'aviso' (verde, padrão) ou 'erro' (vermelho).
function flash(req, mensagem, tipo = 'aviso') {
  if (!req.session.mensagens) req.session.mensagens = [];
  req.session.mensagens.push({ texto: mensagem, tipo });
}

// Middleware: entrega as mensagens ao template e limpa a fila.
function carregarMensagens(req, res, next) {
  res.locals.mensagens = req.session.mensagens || [];
  req.session.mensagens = [];
  next();
}

module.exports = { flash, carregarMensagens };