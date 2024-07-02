const MixProducts = require("../../models/MixProducts");

module.exports.UpdateMixProductService = async (mixProduto, mixProdutoId) => {

  const updateMixProduct = await MixProducts.findByIdAndUpdate(mixProdutoId, mixProduto);
  return updateMixProduct;
}