const MixProducts = require("../../models/MixProducts");

module.exports.DeleteMixProductService = async (id) => {
  const deleteMix = await MixProducts.findByIdAndDelete(id);
  return deleteMix;
}