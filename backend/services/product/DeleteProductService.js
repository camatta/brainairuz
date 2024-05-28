const Product = require('../../models/Products');

exports.DeleteProductService = async (id) => {
  const deleteProduct = await Product.findByIdAndDelete(id);

  return deleteProduct;
}