const User = require('../../models/User');

exports.CreateUserService = async ({ name, email, password, team, accessLevel, setor, setorTratado }) => {
  
  // Verifique se o usuário já existe no banco de dados
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'Este email já está em uso.' });
  }

  // Crie um novo usuário com os dados fornecidos
  const newUser = new User({
    name,
    email,
    password,
    team,
    accessLevel,
    setor,
    setorTratado
  });

  // Salvar o novo usuário no banco de dados
  await newUser.save();

  return newUser;
}