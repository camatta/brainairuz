const Product = require('../../models/Products');

exports.UpdateProductService = async ({ produto, tipoProduto, tecnologia_servico, mrr, tipo_mrr, valor_venda, observacao }, productId) => {
  const productToUpdate = {
    produto,
    tipoProduto,
    tecnologia_servico,
    mrr,
    tipo_mrr,
    valor_venda,
    observacao
  }
  const updateProduct = await Product.findByIdAndUpdate(productId, productToUpdate);

  return updateProduct;
}