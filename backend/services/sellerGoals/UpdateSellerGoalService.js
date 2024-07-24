const MetaVendedor = require("../../models/SellerGoals");

module.exports.UpdateSellerGoalService = async ({
    vendedor,
    mes,
    ano,
    metaIndividual
}, idMeta) => {

  // Dados para atualizar a meta
  const editarMeta = {
    vendedor: vendedor,
    mes: mes,
    ano: ano,
    metaIndividual: metaIndividual
  };

  const metaAtualizada = await MetaVendedor.findByIdAndUpdate(idMeta, editarMeta);
  return metaAtualizada;
}