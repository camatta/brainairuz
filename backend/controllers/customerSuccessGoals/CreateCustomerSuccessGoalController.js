const { CreateCustomerSuccessGoalService } = require("../../services/customerSuccessGoals/CreateCustomerSuccessGoalService");

module.exports.CreateCustomerSuccessGoalController = async (req, res) => {
    try {
        const { cs, mes, ano, metaIndividual } = req.body;

        const createCustomerSuccessGoalService =  await CreateCustomerSuccessGoalService({ cs, mes, ano, metaIndividual });

        res.status(201).json({ message: 'Meta criada com sucesso!', createCustomerSuccessGoalService });
        console.log('Meta criada com sucesso!', createCustomerSuccessGoalService);
    } catch(error) {
        res.status(500).json({ error: 'Erro ao adicionar a meta', error });
        console.log('Erro ao adicionar a meta')
    }
}