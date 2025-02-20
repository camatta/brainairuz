const CommissionsCs = require("../../models/ComissionsCs");

module.exports.DeleteCommissionCsService = async (id) => {
  const deleteComissao = await CommissionsCs.findByIdAndDelete(id);
  return deleteComissao;
}