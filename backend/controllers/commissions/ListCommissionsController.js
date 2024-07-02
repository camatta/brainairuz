const { ListCommissionsService } = require("../../services/commissions/ListCommissionsService");

module.exports.ListCommissionsController = async (req, res) => {
  try {
    const usuario = req.query.user;
    const ano = req.query.year;
    const mes = req.query.month;
    const vendedor = req.query.vendedor;
    
    const listCommissionsService = await ListCommissionsService({ usuario: usuario, ano: ano, mes: mes, vendedor: vendedor });

    res.status(200).json(listCommissionsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}