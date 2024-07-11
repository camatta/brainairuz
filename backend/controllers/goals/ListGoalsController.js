const { ListGoalsService } = require("../../services/goals/ListGoalsService");

module.exports.ListGoalsController = async (req, res) => {
  try {
    const usuario = req.query.user;
    const ano = req.query.year;
    const mes = req.query.month;
    const vendedor = req.query.vendedor;
    
    const listGoalsService = await ListGoalsService({ usuario: usuario, ano: ano, mes: mes, vendedor: vendedor });

    res.status(200).json(listGoalsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}