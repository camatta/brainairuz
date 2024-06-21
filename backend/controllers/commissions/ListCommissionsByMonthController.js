const { ListCommissionsByMonthService } = require("../../services/commissions/ListCommissionsByMonthService");

module.exports.ListCommissionsByMonthController = async (req, res) => {
  try {
    const mes = req.params.month;
    const listCommissionsByMonthService = await ListCommissionsByMonthService(mes);

    res.status(200).json(listCommissionsByMonthService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}