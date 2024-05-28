const { ListUsersService } = require('../../services/user/ListUsersService');

exports.ListUsersController = async (req, res) => {
  try {
    const listUsersService = await ListUsersService();

    // Retorne a lista de usuários como resposta
    res.status(200).json(listUsersService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao obter os usuários.' });
  }
}