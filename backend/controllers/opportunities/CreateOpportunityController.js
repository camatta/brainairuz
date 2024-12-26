const { CreateOpportunityService } = require("../../services/opportunities/CreateOpportunityService");

module.exports.CreateOpportunityController = async (req, res) => {
    function formatarData(data) {
        if(data) {
            let dataRecebida = new Date(data);
            return dataRecebida.setTime(dataRecebida.getTime() - 3 * 60 * 60 * 1000);
        }
    }

    try {
        const {
            data,
            mes,
            ano,
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
            motivo_perda,
            valor_vendido,
            markup,
            mrr,
            data_aceite,
            ciclo_venda,
            mes_encerramento
        } = req.body;

        const createOpportunityService = await CreateOpportunityService({
            data: formatarData(data),
            mes: mes,
            ano: ano,
            suspect: suspect,
            origem: origem,
            fonte: fonte,
            responsavel: responsavel,
            primeiro_contato: formatarData(primeiro_contato),
            status: status,
            reuniao_agendada: formatarData(reuniao_agendada),
            sla_atendimento: sla_atendimento,
            percentual_fit: percentual_fit,
            perfil_cliente: perfil_cliente,
            etapa: etapa,
            produto: produto,
            detalhes_produto: detalhes_produto,
            valor_proposta: valor_proposta,
            motivo_perda: motivo_perda,
            valor_vendido: valor_vendido,
            markup: markup,
            mrr: mrr,
            data_aceite: formatarData(data_aceite),
            ciclo_venda: ciclo_venda,
            mes_encerramento: mes_encerramento
        });

        res.status(201).json({ message: 'Oportunidade criada com sucesso!', createOpportunityService });
        
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar a oportunidade', error });
    }
}