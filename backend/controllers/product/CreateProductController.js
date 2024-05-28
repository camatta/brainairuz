const { CreateProductService } = require("../../services/product/CreateProductService");


exports.CreateProductController = async (req, res) => {
  try {
    const { id, produto, tecnologia, valor_venda, observacao } = req.body;

    const createProductService = await CreateProductService({ id, produto, tecnologia, valor_venda, observacao });

    res.status(201).json('Produto criado com sucesso!', createProductService);

  } catch {
    res.status(500).json('Erro ao criar o produto');
  }
}