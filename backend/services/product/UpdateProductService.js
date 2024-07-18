const Product = require('../../models/Products');

exports.UpdateProductService = async ({ produto, tecnologia, valor_venda, observacao }, productId) => {
  const productToUpdate = {
    produto,
    tecnologia,
    valor_venda,
    observacao
  }
  const updateProduct = await Product.findByIdAndUpdate(productId, productToUpdate);

  return updateProduct;
}