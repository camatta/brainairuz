const { ListOpportunitiesService } = require("../../services/opportunities/ListOpportunitiesService");

module.exports.ListOpportunitiesController = async (req, res) => {
    try {
        const listOpportunitiesService = await ListOpportunitiesService(req.query);

        res.status(201).json(listOpportunitiesService);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar as oportunidades', error });
    }
}