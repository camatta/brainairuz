const Opportunities = require("../../models/Opportunities");

module.exports.UpdateOpportunityService = async ({
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
    motivo_perda,
    valor_vendido,
    markup,
    mrr,
    data_aceite,
    ciclo_venda,
    mes_encerramento
}, id) => {
    const oportunidade = {
        data: data,
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
        motivo_perda: motivo_perda,
        valor_vendido: valor_vendido,
        markup: markup,
        mrr: mrr,
        data_aceite: data_aceite,
        ciclo_venda: ciclo_venda,
        mes_encerramento: mes_encerramento
    };

    const atualizarOportunidade = await Opportunities.findByIdAndUpdate(id, oportunidade);
    return atualizarOportunidade;
}