const { ListCommissionsCsService } = require("../../services/commissionsCs/ListCommissionsCsService");

module.exports.ListCommissionsCsController = async (req, res) => {
  try {
    const usuario = req.query.user;
    const ano = req.query.year;
    const mes = req.query.month;
    const vendedor = req.query.vendedor;
    
    const listCommissionsCsService = await ListCommissionsCsService({ usuario: usuario, ano: ano, mes: mes, vendedor: vendedor });

    res.status(200).json(listCommissionsCsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}