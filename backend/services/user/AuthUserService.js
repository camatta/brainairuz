const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

exports.AuthUserService = async ( { email, password }) => {

  // Verifique se o usuário existe no banco de dados
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("Usuário ou senha incorreta");
  }

  // Verifique se a senha está correta
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    throw new Error("Usuário ou senha incorreta");
  }

  // Gerar token
  const token = jwt.sign({ userId: existingUser._id }, 'ef1c8080fd1db32bf420fac3bc22bc567b6c25d41d17eef10e3e4f54becc31aa');

  // Autenticação bem-sucedida
  const { name, team, accessLevel, setor, setorTratado, funcao } = existingUser;

  return {
    user: {
      name,
      email,
      team,
      accessLevel,
      setor,
      setorTratado,
      funcao
    },
    token
  }
}