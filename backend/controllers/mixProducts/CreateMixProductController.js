const { CreateMixProductService } = require('../../services/mixProducts/CreateMixProductService');

module.exports.CreateMixProductController = async (req, res) => {
  try {
    const { mixProduto } = req.body;

    console.log(req.body);

    const createMixProductService = await CreateMixProductService({ mixProduto });

    res.status(201).json({ message: 'Mix de produto criado com sucesso!', createMixProductService });

  } catch(error) {
    res.status(500).json({ error: 'Erro ao criar mix de produto', error });
  }
}