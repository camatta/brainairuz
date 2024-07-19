const Product = require('../../models/Products');

module.exports.CreateProductService = async ({ produto, tipoProduto, tecnologia, meses, valor_venda, observacao }) => {
  // Criando um novo produto utilizando o modelo importado
  const novoProduto = new Product({
    produto: produto,
    tipoProduto: tipoProduto,
    tecnologia: tecnologia,
    meses: meses,
    valor_venda: valor_venda,
    observacao: observacao
  })

  await novoProduto.save();

  return novoProduto;
}