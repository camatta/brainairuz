const Product = require('../../models/Products');

module.exports.CreateProductService = async ({ produto, tecnologia, valor_venda, observacao }) => {
  // Criando um novo produto utilizando o modelo importado
  const novoProduto = new Product({
    produto: produto,
    tecnologia: tecnologia,
    valor_venda: valor_venda,
    observacao: observacao
  })

  await novoProduto.save();

  return novoProduto;
}