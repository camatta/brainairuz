const { CreateGoalService } = require("../../services/goals/CreateGoalService");

module.exports.CreateGoalController = async (req, res) => {
    try {
        const { vendedor, mes, ano, metaEmpresa, metaRealizadaEmpresa, metaIndividual, metaRealizadaIndividual } = req.body;

        const createGoalService =  await CreateGoalService({ vendedor, mes, ano, metaEmpresa, metaRealizadaEmpresa, metaIndividual, metaRealizadaIndividual });

        res.status(201).json({ message: 'Meta criada com sucesso!', createGoalService });
        console.log('Meta criada com sucesso!', createGoalService);
    } catch(error) {
        res.status(500).json({ error: 'Erro ao adicionar a meta', error });
        console.log('Erro ao adicionar a meta')
    }
}