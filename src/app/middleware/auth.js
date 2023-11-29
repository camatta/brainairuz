const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Verifique se o cabeçalho "Authorization" está presente na requisição
    const token = req.headers.authorization;
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    // Verifique e decodifique o token
    jwt.verify(token, 'ef1c8080fd1db32bf420fac3bc22bc567b6c25d41d17eef10e3e4f54becc31aa', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token de autenticação inválido.' });
      }

      // Verifique se o token está expirado
      const currentTimestamp = Math.floor(Date.now() / 1000); // Obtém o timestamp atual em segundos
      if (decoded.exp && decoded.exp < currentTimestamp) {
        console.log('Token expirado.');
        return res.status(401).json({ message: 'Token expirado.' });
      }

      // Adicione o usuário autenticado ao objeto req
      req.user = { userId: decoded.userId };

      next();
    });
  } catch (error) {
    console.error('Erro durante a verificação do token:', error);
    res.status(500).json({ message: 'Ocorreu um erro durante a verificação do token de autenticação.' });
  }
};

module.exports = authMiddleware;
