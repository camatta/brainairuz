const { CreateSellerGoalService } = require("../../services/sellerGoals/CreateSellerGoalService");

module.exports.CreateSellerGoalController = async (req, res) => {
    try {
        const { vendedor, mes, ano, metaIndividual } = req.body;

        const createSellerGoalService =  await CreateSellerGoalService({ vendedor, mes, ano, metaIndividual });

        res.status(201).json({ message: 'Meta criada com sucesso!', createSellerGoalService });
        console.log('Meta criada com sucesso!', createSellerGoalService);
    } catch(error) {
        res.status(500).json({ error: 'Erro ao adicionar a meta', error });
        console.log('Erro ao adicionar a meta')
    }
}