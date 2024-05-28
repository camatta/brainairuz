const Products = require('../../models/Products');

exports.ListProductsService = async () => {
  const produtos = await Products.find();
  
  return produtos;
}