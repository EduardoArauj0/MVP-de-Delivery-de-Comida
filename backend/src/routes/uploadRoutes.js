const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

// Rota de upload (empresa)
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Realiza upload de imagem (empresa)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload realizado com sucesso
 */
router.post('/', autenticar, authorizeRole('empresa'), upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhuma imagem foi enviada' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

module.exports = router;
