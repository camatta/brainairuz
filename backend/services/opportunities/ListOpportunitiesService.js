const Opportunities = require("../../models/Opportunities");

const BU_TO_PRODUCTS = {
    Tecnologia: ["Help A", "Projeto", "Sustentação"],
    Marketing: ["MKT"]
}

module.exports.ListOpportunitiesService = async (filters = {}) => {
    const query = { ...filters };

    if(Object.prototype.hasOwnProperty.call(filters, "bu")) {
        const bu = String(filters.bu ?? "").trim();

        // remove "bu" da query para não tentar filtrar por um campo que não existe no SCHEMA
        delete query.bu;

        const produtos = BU_TO_PRODUCTS[bu];

        if (produtos?.length) {
            // se já existir filtro de produto, combina com AND (interseção)
            if (query.produto) {
                // Caso 1: produto veio como string exata
                if (typeof query.produto === "string") {
                // Se o produto informado não estiver na lista permitida, força vazio
                if (!produtos.includes(query.produto)) {
                    return []; // não há resultados possíveis
                }
                // se estiver, mantém o produto específico e segue
                } else {
                // Caso 2: produto veio como $in, etc. (vamos restringir)
                query.produto = { $in: produtos };
                }
            } else {
                // sem filtro de produto, aplica o $in da BU
                query.produto = { $in: produtos };
            }
        }
    }

    const opportunities = await Opportunities.find(query);
    
    return opportunities;
}