const { CreateCommissionService } = require("../../services/commissions/CreateCommissionService");

module.exports.CreateCommissionController = async (req, res) => {
  try {
    const { dataVenda, vendedor, cliente, mixProdutos, tipoProduto, multiplicador, markup, vendaAvulsa, fatorMultiplicador, valorBase, valorVendido, qualidade, mix, comissaoFinal, valorComissao } = req.body;

    const createCommissionService = await CreateCommissionService({ dataVenda, vendedor, cliente, mixProdutos, tipoProduto, multiplicador, markup, vendaAvulsa, fatorMultiplicador, valorBase, valorVendido, qualidade, mix, comissaoFinal, valorComissao });

    res.status(201).json({ message: 'Comissão criada com sucesso!', createCommissionService });

  } catch(error) {
    res.status(500).json({ error: 'Erro ao adicionar a comissão', error });
  }
}