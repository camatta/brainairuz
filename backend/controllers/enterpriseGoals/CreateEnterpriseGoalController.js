const { CreateEnterpriseGoalService } = require("../../services/enterpriseGoals/CreateEnterpriseGoalService");

module.exports.CreateEnterpriseGoalController = async (req, res) => {
    try {
        const { mes, ano, metaEmpresa } = req.body;

        const createEnterpriseGoalService =  await CreateEnterpriseGoalService({ mes, ano, metaEmpresa });

        res.status(201).json({ message: 'Meta criada com sucesso!', createEnterpriseGoalService });
        console.log('Meta criada com sucesso!', createEnterpriseGoalService);
    } catch(error) {
        res.status(500).json({ error: 'Erro ao adicionar a meta', error });
        console.log('Erro ao adicionar a meta')
    }
}