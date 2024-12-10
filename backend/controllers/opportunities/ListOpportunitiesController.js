const { ListOpportunitiesService } = require("../../services/opportunities/ListOpportunitiesService");

module.exports.ListOpportunitiesController = async (req, res) => {
    try {
        const status = req.query.status;
        const mes = req.query.month;
        const ano = req.query.year;

        const listOpportunitiesService = await ListOpportunitiesService({ status: status, mes: mes, ano: ano });

        res.status(201).json(listOpportunitiesService);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar as oportunidades', error });
    }
}