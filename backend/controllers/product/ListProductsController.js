const { ListProductsService } = require("../../services/product/ListProductsService");

exports.ListProductsController = async (req, res) => {
  try {
    const listProductsService = await ListProductsService();
    res.status(200).json(listProductsService);
  } catch (error) {
    res.status(500).send('Erro do servidor');
  }
}