const MixProducts = require("../../models/MixProducts");

module.exports.ListMixProductsService = async () => {
    const mixProdutos = await MixProducts.find();
    return mixProdutos;
  }