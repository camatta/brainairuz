const { ListSellerGoalsService } = require("../../services/sellerGoals/ListSellerGoalsService");

module.exports.ListSellerGoalsController = async (req, res) => {
  try {
    const usuario = req.query.user;
    const ano = req.query.year;
    const mes = req.query.month;
    const vendedor = req.query.vendedor;
    
    const listSellerGoalsService = await ListSellerGoalsService({ usuario: usuario, ano: ano, mes: mes, vendedor: vendedor });

    res.status(200).json(listSellerGoalsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}