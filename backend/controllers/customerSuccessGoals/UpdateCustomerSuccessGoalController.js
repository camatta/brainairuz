const { UpdateCustomerSuccessGoalService } = require('../../services/customerSuccessGoals/UpdateCustomerSuccessGoalService');

module.exports.UpdateCustomerSuccessGoalController = async (req, res) => {
    try {
        const { cs, mes, ano, metaIndividual } = req.body;
        const idMeta = req.params.id;

        const updateCustomerSuccessGoalService = await UpdateCustomerSuccessGoalService({
            cs,
            mes,
            ano,
            metaIndividual
        }, idMeta);

        if(updateCustomerSuccessGoalService) {
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