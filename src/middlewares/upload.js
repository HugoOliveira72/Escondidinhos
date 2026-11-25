const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nomeUnico);
  },
});

const fileFilter = (req, file, cb) => {
  const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato inválido. Envie apenas imagens (JPG, PNG, WEBP ou GIF).'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB por imagem
});

module.exports = upload;