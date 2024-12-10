const Opportunities = require("../../models/Opportunities");

module.exports.ListOpportunitiesService = async ({ status, mes, ano }) => {
    const query = {}

    // Manipulação eficiente de filtros opcionais mes e ano usando spread syntax
    if(status !== undefined) {
        query.status = status;
    }
    if(mes !== undefined) {
        query.mes = mes;
    }
    if(ano !== undefined) {
        query.ano = ano;
    }

    const opportunities = await Opportunities.find(query);
    
    return opportunities;
}