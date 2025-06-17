const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.post('/', autenticar, authorizePermission('MANAGE_RESTAURANT', 'MANAGE_PRODUCTS'), upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhuma imagem foi enviada' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

module.exports = router;