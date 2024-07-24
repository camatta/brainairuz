const MetaEmpresa = require("../../models/EnterpriseGoals");

module.exports.CreateEnterpriseGoalService = async ({ mes, ano, metaEmpresa }) => {
  
  // Criando uma nova meta utilizando o modelo importado
  const novaMeta = new MetaEmpresa({
    mes: mes,
    ano: ano,
    metaEmpresa: metaEmpresa
  })

  await novaMeta.save();
  return novaMeta;
}