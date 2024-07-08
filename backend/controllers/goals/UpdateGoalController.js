const { UpdateGoalService } = require('../../services/goals/UpdateGoalService');

module.exports.UpdateGoalController = async (req, res) => {
    try {
        const { vendedor, mes, ano, metaEmpresa, metaRealizadaEmpresa, metaIndividual, metaRealizadaIndividual } = req.body;
        const idMeta = req.params.id;

        const updateGoalService = await UpdateGoalService({
            vendedor,
            mes,
            ano,
            metaEmpresa,
            metaRealizadaEmpresa,
            metaIndividual,
            metaRealizadaIndividual
        }, idMeta);

        if(updateGoalService) {
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