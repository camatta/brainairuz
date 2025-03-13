const MetaCustomerSuccess = require("../../models/CustomerSuccessGoals");

module.exports.UpdateCustomerSuccessGoalService = async ({
    vendedor,
    mes,
    ano,
    metaIndividual
}, idMeta) => {

  // Dados para atualizar a meta
  const editarMeta = {
    nome: vendedor,
    mes: mes,
    ano: ano,
    metaIndividual: metaIndividual
  };

  const metaAtualizada = await MetaCustomerSuccess.findByIdAndUpdate(idMeta, editarMeta);
  return metaAtualizada;
}