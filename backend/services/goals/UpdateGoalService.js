const Meta = require("../../models/Goals");

module.exports.UpdateGoalService = async ({
    vendedor,
    mes,
    ano,
    metaEmpresa,
    metaRealizadaEmpresa,
    metaIndividual,
    metaRealizadaIndividual
}, idMeta) => {

  // Dados para atualizar a meta
  const editarMeta = {
    vendedor: vendedor,
    mes: mes,
    ano: ano,
    metaEmpresa: metaEmpresa,
    metaRealizadaEmpresa: metaRealizadaEmpresa,
    metaIndividual: metaIndividual,
    metaRealizadaIndividual: metaRealizadaIndividual
  };

  const metaAtualizada = await Meta.findByIdAndUpdate(idMeta, editarMeta);
  return metaAtualizada;
}