const { CreateProductService } = require("../../services/product/CreateProductService");

module.exports.CreateProductController = async (req, res) => {
  try {
    const { id, produto, tecnologia, valor_venda, observacao } = req.body;

    const createProductService = await CreateProductService({ id, produto, tecnologia, valor_venda, observacao });

    res.status(201).json({ message: 'Produto criado com sucesso!', createProductService });

  } catch(error) {
    res.status(500).json({ error: 'Erro ao criar o produto' });
  }
}