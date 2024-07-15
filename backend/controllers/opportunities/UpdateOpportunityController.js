const { CreateOpportunityService } = require("../../services/opportunities/CreateOpportunityService");

module.exports.UpdateOpportunityController = async (req, res) => {
    try {
        const {
            data,
            suspect,
            origem,
            fonte,
            responsavel,
            primeiro_contato,
            status,
            reuniao_agendada,
            sla_atendimento,
            percentual_fit,
            perfil_cliente,
            etapa,
            produto,
            detalhes_produto,
            valor_proposta,
            markup,
            mrr,
            data_aceite,
            ciclo_venda,
            mes_encerramento
        } = req.body;

        const createOpportunityService = await CreateOpportunityService({
            data,
            suspect,
            origem,
            fonte,
            responsavel,
            primeiro_contato,
            status,
            reuniao_agendada,
            sla_atendimento,
            percentual_fit,
            perfil_cliente,
            etapa,
            produto,
            detalhes_produto,
            valor_proposta,
            markup,
            mrr,
            data_aceite,
            ciclo_venda,
            mes_encerramento
        });

        res.status(201).json({ message: 'Oportunidade criada com sucesso!', createOpportunityService });
        
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar a oportunidade', error });
    }
}