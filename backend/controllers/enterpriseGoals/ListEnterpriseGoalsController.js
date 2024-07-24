const { ListEnterpriseGoalsService } = require("../../services/enterpriseGoals/ListEnterpriseGoalsService");

module.exports.ListEnterpriseGoalsController = async (req, res) => {
  try {
    const ano = req.query.year;
    const mes = req.query.month;
    
    const listEnterpriseGoalsService = await ListEnterpriseGoalsService({ ano: ano, mes: mes });

    res.status(200).json(listEnterpriseGoalsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}