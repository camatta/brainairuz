const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Rota de registro de usuário
router.post('/cadastro', async (req, res) => {
  const {email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(400).json({message: 'E-mail já cadastrado'});
    }

    const user = new User ({ email, name, password });
    await user.save();

    res.status(201).json({message: 'Usuário cadastrado com sucesso'});
  } catch (error) {
    res.status(500).json({message: 'Erro ao cadastrar usuário'});
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifique se o usuário existe no banco de dados
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Autenticação bem-sucedida
    res.status(200).json({ message: 'Autenticação bem-sucedida.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro durante a autenticação.' });
  }
});

module.exports = router;