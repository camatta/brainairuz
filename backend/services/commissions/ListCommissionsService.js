const Commissions = require('../../models/Comissions');

module.exports.ListCommissionsService = async ({ usuario, ano, mes, vendedor }) => {
  
  // Objeto de consulta vazio
  const query = {};

  // Traz só as comissões do vendedor logado
  if(usuario){
    query.vendedor = usuario;
  }

  // Realiza o filtro por vendedores apenas para administradores
  if(vendedor){
    query.vendedor = vendedor;
  }

  // Manipulação eficiente de filtros opcionais mes e ano usando spread syntax
  if(mes !== undefined) {
    query.mes = mes;
  }
  if(ano !== undefined) {
    query.ano = ano;
  }

  const comissoes = await Commissions.find(query);
  return comissoes;
}