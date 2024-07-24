const MetaEmpresa = require("../../models/EnterpriseGoals");

module.exports.DeleteEnterpriseGoalService = async (id) => {
  const deleteEnterpriseMeta = await MetaEmpresa.findByIdAndDelete(id);
  return deleteEnterpriseMeta;
}