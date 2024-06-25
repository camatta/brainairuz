const Commissions = require("../../models/Comissions");

module.exports.DeleteCommissionService = async (id) => {
  const deleteComissao = await Commissions.findByIdAndDelete(id);
  return deleteComissao;
}