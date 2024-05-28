const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { async } = require('rxjs');

const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: String,
    enum: ['Administrador', 'Líder de Equipe', 'Funcionário'],
    required: false,
  },
  team: {
    type: String,
    enum: ['Tecnologia', 'Marketing', 'Administrativo','Customer Success','Comercial'],
    required: true,
  },
  setor: {
    type: String,
    required: true,
  },
  setorTratado: {
    type: String,
    required: true,
  }
});

// Criptografar senha do usuário

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;