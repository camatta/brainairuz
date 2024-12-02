const { UpdateOpportunityService } = require("../../services/opportunities/UpdateOpportunityService");

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

        const updateOpportunityService = await UpdateOpportunityService({
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

        res.status(201).json({ message: 'Oportunidade criada com sucesso!', updateOpportunityService });
        
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar a oportunidade', error });
    }
}