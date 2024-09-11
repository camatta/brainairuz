const { CreateProductService } = require("../../services/product/CreateProductService");

module.exports.CreateProductController = async (req, res) => {
  try {
    const { produto, tipoProduto, tecnologia_servico, mrr, tipo_mrr, valor_venda, grupo_markup, observacao } = req.body;

    const createProductService = await CreateProductService({ produto, tipoProduto, tecnologia_servico, mrr, tipo_mrr, valor_venda, grupo_markup, observacao });

    res.status(201).json({ message: 'Produto criado com sucesso!', createProductService });

  } catch(error) {
    res.status(500).json({ error: 'Erro ao criar o produto' });
  }
}