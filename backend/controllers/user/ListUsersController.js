const { ListUsersService } = require('../../services/user/ListUsersService');

module.exports.ListUsersController = async (req, res) => {
  try {
    const listUsersService = await ListUsersService();

    // Retorne a lista de usuários como resposta
    res.status(200).json({ users: listUsersService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao obter os usuários.' });
  }
}