const MetaEmpresa = require("../../models/EnterpriseGoals");

module.exports.UpdateEnterpriseGoalService = async ({
    mes,
    ano,
    metaEmpresa
}, idMeta) => {

  // Dados para atualizar a meta
  const editarMeta = {
    mes: mes,
    ano: ano,
    metaEmpresa: metaEmpresa
  };

  const metaAtualizada = await MetaEmpresa.findByIdAndUpdate(idMeta, editarMeta);
  return metaAtualizada;
}