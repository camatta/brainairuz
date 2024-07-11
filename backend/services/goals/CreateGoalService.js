const Meta = require("../../models/Goals");

module.exports.CreateGoalService = async ({ vendedor, mes, ano, metaEmpresa, metaRealizadaEmpresa, metaIndividual, metaRealizadaIndividual }) => {
  
  // Criando uma nova meta utilizando o modelo importado
  const novaMeta = new Meta({
    vendedor: vendedor,
    mes: mes,
    ano: ano,
    metaEmpresa: metaEmpresa,
    metaRealizadaEmpresa: metaRealizadaEmpresa,
    metaIndividual: metaIndividual,
    metaRealizadaIndividual: metaRealizadaIndividual
  })

  await novaMeta.save();
  return novaMeta;
}