const { AuthUserService } = require('../../services/user/AuthUserService');

exports.AuthUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authUserService = await AuthUserService({ email, password });

    res.status(200).json(authUserService);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro durante o login.' });
  }
}