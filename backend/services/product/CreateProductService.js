const Product = require('../../models/Products');

exports.CreateProductService = async ({ id, produto, tecnologia, valor_venda, observacao }) => {
  // Criando um novo produto utilizando o modelo importado
  const novoProduto = new Product({
    id: id,
    produto: produto,
    tecnologia: tecnologia,
    valor_venda: valor_venda,
    observacao: observacao
  })

  await novoProduto.save();

  return novoProduto;
}