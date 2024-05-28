const User = require('../../models/User');

exports.ListUsersService = async () => {
  // Obtenha todos os usuários do banco de dados
  const users = await User.find();

  return users;
}