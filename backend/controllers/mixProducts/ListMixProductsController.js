const { ListMixProductsService } = require("../../services/mixProducts/ListMixProductsService");

module.exports.ListMixProductsController = async (req, res) => {
  try {
    const listMixProductsService = await ListMixProductsService();

    res.status(200).json(listMixProductsService);
    
  } catch (error) {
    res.status(500).send({ error: 'Erro do servidor' });
  }
}