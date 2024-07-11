const MixProducts = require("../../models/MixProducts");

module.exports.CreateMixProductService = async ({ mixProduto }) => {
  // Criando um novo mix produto utilizando o modelo importado
  const novoMixProduto = new MixProducts({
    mixProduto: mixProduto
  })

  await novoMixProduto.save();
  return novoMixProduto;
}