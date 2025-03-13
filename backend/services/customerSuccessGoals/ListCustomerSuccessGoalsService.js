const MetaCustomerSuccess = require("../../models/CustomerSuccessGoals");

module.exports.ListCustomerSuccessGoalsService = async ({ usuario, ano, mes, vendedor }) => {
  // Objeto de consulta vazio
  const query = {};

  // Traz só as metas do vendedor logado
  if(usuario){
    query.nome = usuario;
  }

  // Realiza o filtro por vendedores apenas para administradores
  if(vendedor !== undefined){
    query.nome = vendedor;
  }

  // Manipulação eficiente de filtros opcionais mes e ano usando spread syntax
  if(mes !== undefined) {
    query.mes = mes;
  }
  if(ano !== undefined) {
    query.ano = ano;
  }

  const metas = await MetaCustomerSuccess.find(query);

  return metas;
}