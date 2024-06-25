const { AuthUserService } = require('../../services/user/AuthUserService');

module.exports.AuthUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authUserService = await AuthUserService({ email, password });

    res.status(200).json({ message: authUserService });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro durante o login.' });
  }
}