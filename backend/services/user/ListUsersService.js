const User = require('../../models/User');

module.exports.ListUsersService = async () => {
  // Obtenha todos os usuários do banco de dados
  const users = await User.find().select('-password').sort({ name: 1 });

  return users;
}