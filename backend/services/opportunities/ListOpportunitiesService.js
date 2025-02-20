const Opportunities = require("../../models/Opportunities");

module.exports.ListOpportunitiesService = async ({ status, bu, mes, ano }) => {
    const query = {}

    // Manipulação eficiente de filtros opcionais mes e ano usando spread syntax
    if(status !== undefined) {
        query.status = status;
    }
    if(bu !== undefined) {
        if(bu === "tecnologia"){
            query.produto =  ["Help A", "Projeto", "Sustentação"];
        } else {
            query.produto = "MKT";
        }
    }
    if(mes !== undefined) {
        query.mes = mes;
    }
    if(ano !== undefined) {
        query.ano = ano;
    }

    console.log(query);

    const opportunities = await Opportunities.find(query);
    
    return opportunities;
}