const Product = require('../../models/Products');

exports.UpdateProductService = async ({ produto, tipoProduto, tecnologia, meses, valor_venda, observacao }, productId) => {
  const productToUpdate = {
    produto,
    tipoProduto,
    tecnologia,
    meses,
    valor_venda,
    observacao
  }
  const updateProduct = await Product.findByIdAndUpdate(productId, productToUpdate);

  return updateProduct;
}