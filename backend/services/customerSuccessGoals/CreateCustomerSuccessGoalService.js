const MetaCustomerSuccess = require("../../models/CustomerSuccessGoals");

module.exports.CreateCustomerSuccessGoalService = async ({ cs, mes, ano, metaIndividual }) => {
  
  // Criando uma nova meta utilizando o modelo importado
  const novaMeta = new MetaCustomerSuccess({
    nome: cs,
    mes: mes,
    ano: ano,
    metaIndividual: metaIndividual
  })

  await novaMeta.save();
  return novaMeta;
}