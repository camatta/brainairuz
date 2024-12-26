const Opportunities = require("../../models/Opportunities");

module.exports.CreateOpportunityService = async ({
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
}) => {
    const novaOportunidade = new Opportunities({
        data: data,
        mes: mes,
        ano: ano,
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
    });

    await novaOportunidade.save();
    return novaOportunidade;
}