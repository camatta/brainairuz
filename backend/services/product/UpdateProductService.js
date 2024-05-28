const Product = require('../../models/Products');

exports.UpdateProductService = async ({ id, produto, tecnologia, valor_venda, observacao }, productId) => {
  const productToUpdate = {
    id,
    produto,
    tecnologia,
    valor_venda,
    observacao
  }
  const updateProduct = await Product.findByIdAndUpdate(productId, productToUpdate);

  return updateProduct;
}