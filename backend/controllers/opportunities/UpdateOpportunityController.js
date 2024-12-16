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

        const id = req.params.id;

        let dataRecebida = new Date(data);
        const dataFormatada = dataRecebida.setTime(dataRecebida.getTime() - 3 * 60 * 60 * 1000);

        const updateOpportunityService = await UpdateOpportunityService({
            data: dataFormatada,
            suspect: suspect,
            origem: origem,
            fonte: fonte,
            responsavel: responsavel,
            primeiro_contato: primeiro_contato,
            status: status,
            reuniao_agendada: reuniao_agendada,
            sla_atendimento: sla_atendimento,
            percentual_fit: percentual_fit,
            perfil_cliente: perfil_cliente,
            etapa: etapa,
            produto: produto,
            detalhes_produto: detalhes_produto,
            valor_proposta: valor_proposta,
            markup: markup,
            mrr: mrr,
            data_aceite: data_aceite,
            ciclo_venda: ciclo_venda,
            mes_encerramento: mes_encerramento
        }, id);

        if(updateOpportunityService){
            console.log(`Oportunidade alterada com sucesso`);
            res.status(201).json({ message: 'Oportunidade criada com sucesso!', updateOpportunityService });
        } else {
            console.log('Oportunidade não encontrada');
            res.status(404).json({ message: 'Oportunidade não encontrada', updateOpportunityService });
        }
    } catch (error) {
        console.log("Erro ao editar a oportunidade");
        res.status(500).json({ message: 'Erro ao editar a oportunidade', error });
    }
}