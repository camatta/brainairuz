const MetaVendedor = require("../../models/SellerGoals");

module.exports.DeleteSellerGoalService = async (id) => {
  const deleteSellerMeta = await MetaVendedor.findByIdAndDelete(id);
  return deleteSellerMeta;
}