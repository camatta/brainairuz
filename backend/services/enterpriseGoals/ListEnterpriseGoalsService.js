const MetaEmpresa = require('../../models/EnterpriseGoals');

module.exports.ListEnterpriseGoalsService = async ({ ano, mes }) => {
  // Objeto de consulta vazio
  const query = {};

  // Manipulação eficiente de filtros opcionais mes e ano usando spread syntax
  if(mes !== undefined) {
    query.mes = mes;
  }
  if(ano !== undefined) {
    query.ano = ano;
  }

  const metas = await MetaEmpresa.find(query);
  return metas;
}