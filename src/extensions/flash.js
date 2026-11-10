// Equivalente ao flash() e get_flashed_messages() do Flask.
// Guarda a mensagem na sessão, sobrevive ao redirect e é mostrada uma única vez.

// No controller:  flash(req, "Item cadastrado!")   (== flash("...") no Flask)
function flash(req, mensagem) {
  if (!req.session.mensagens) req.session.mensagens = [];
  req.session.mensagens.push(mensagem);
}

// Middleware: entrega as mensagens ao template (variável "mensagens") e limpa a fila.
function carregarMensagens(req, res, next) {
  res.locals.mensagens = req.session.mensagens || [];
  req.session.mensagens = [];
  next();
}

module.exports = { flash, carregarMensagens };
