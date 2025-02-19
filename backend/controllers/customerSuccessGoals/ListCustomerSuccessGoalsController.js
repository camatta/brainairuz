const { ListCustomerSuccessGoalsService } = require("../../services/customerSuccessGoals/ListCustomerSuccessGoalsService");

module.exports.ListCustomerSuccessGoalsController = async (req, res) => {
  try {
    const usuario = req.query.user;
    const ano = req.query.year;
    const mes = req.query.month;
    const cs = req.query.cs;
    
    const listCustomerSuccessGoalsService = await ListCustomerSuccessGoalsService({ usuario: usuario, ano: ano, mes: mes, cs: cs });

    res.status(200).json(listCustomerSuccessGoalsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}