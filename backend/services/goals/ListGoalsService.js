const Metas = require('../../models/Goals');

module.exports.ListGoalsService = async ({ usuario, ano, mes, vendedor }) => {
  // Objeto de consulta vazio
  const query = {};

  // Traz só as metas do vendedor logado
  if(usuario !== undefined){
    query.vendedor = usuario;
  }

  // Realiza o filtro por vendedores apenas para administradores
  if(vendedor !== undefined){
    query.vendedor = vendedor;
  }

  // Manipulação eficiente de filtros opcionais mes e ano usando spread syntax
  if(mes !== undefined) {
    query.mes = mes;
  }
  if(ano !== undefined) {
    query.ano = ano;
  }

  const metas = await Metas.find(query);
  return metas;
}