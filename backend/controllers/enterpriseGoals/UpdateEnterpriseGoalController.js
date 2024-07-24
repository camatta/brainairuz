const { UpdateEnterpriseGoalService } = require('../../services/enterpriseGoals/UpdateEnterpriseGoalService');

module.exports.UpdateEnterpriseGoalController = async (req, res) => {
    try {
        const { mes, ano, metaEmpresa } = req.body;
        const idMeta = req.params.id;

        const updateEnterpriseGoalService = await UpdateEnterpriseGoalService({
            mes,
            ano,
            metaEmpresa
        }, idMeta);

        if(updateEnterpriseGoalService) {
            console.log(`Meta alterada com sucesso!`);
            res.status(200).json({ message: `Meta ${idMeta} alterada com sucesso` });
        } else {
            console.log('Produto não encontrado');
            res.status(404).json({ message: `Meta ${idMeta} não encontrada` });
        }
    } catch(err) {
        console.error('Erro ao alterar a meta: ', err);
        res.status(500).json({ error: 'Erro interno do servidor ao alterar a meta' });
    }
}