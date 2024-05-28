

exports.DetailUserService = async (user) => {
  
  // Verifique se o usuário está autenticado
  if (!user) {
    throw new Error("Usuário não autenticado");
    // return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  // Obtenha as informações do usuário logado
  const userInfo = {
    name: req.user.name,
    email: req.user.email,
    time: req.user.team,
    funcao: req.user.accessLevel,
    setor: req.user.setor,
    setorTratado: req.user.setorTratado,
    funcao: req.user.funcao
  };

  return userInfo;
}