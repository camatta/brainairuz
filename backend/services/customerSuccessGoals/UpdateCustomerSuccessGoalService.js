const MetaCustomerSuccess = require("../../models/CustomerSuccessGoals");

module.exports.UpdateCustomerSuccessGoalService = async ({
    cs,
    mes,
    ano,
    metaIndividual
}, idMeta) => {

  // Dados para atualizar a meta
  const editarMeta = {
    nome: cs,
    mes: mes,
    ano: ano,
    metaIndividual: metaIndividual
  };

  const metaAtualizada = await MetaCustomerSuccess.findByIdAndUpdate(idMeta, editarMeta);
  return metaAtualizada;
}