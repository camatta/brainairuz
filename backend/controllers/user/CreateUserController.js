const { CreateUserService } = require('../../services/user/CreateUserService');

exports.CreateUserController = async (req, res) => {
  try {
    const { name, email, password, team, accessLevel, setor, setorTratado } = req.body;

    const createUserService = await CreateUserService({ name, email, password, team, accessLevel, setor, setorTratado });
    
    res.status(200).json(createUserService);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao cadastrar o usuário.' });
  }
}