const { DetailUserService } = require('../../services/user/DetailUserService');

exports.DetailUserController = async (req, res) => {
  try {
    const user = req.user;
    
    const detailUserService = await DetailUserService(user);

    res.status(200).json(detailUserService);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao obter as informações do usuário.' });
  }
}