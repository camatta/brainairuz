const MetaVendedor = require("../../models/SellerGoals");

module.exports.CreateSellerGoalService = async ({ vendedor, mes, ano, metaIndividual }) => {
  
  // Criando uma nova meta utilizando o modelo importado
  const novaMeta = new MetaVendedor({
    vendedor: vendedor,
    mes: mes,
    ano: ano,
    metaIndividual: metaIndividual
  })

  await novaMeta.save();
  return novaMeta;
}