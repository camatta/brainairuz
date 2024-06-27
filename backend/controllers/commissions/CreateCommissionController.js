const { CreateCommissionService } = require("../../services/commissions/CreateCommissionService");

module.exports.CreateCommissionController = async (req, res) => {
  try {
    const { dataVenda, mes, ano, vendedor, status, cliente, mixProdutos, tipoProduto, multiplicador, markup, vendaAvulsa, valorBase, valorVendido } = req.body;

    const createCommissionService = await CreateCommissionService({ dataVenda, mes, ano, vendedor, status, cliente, mixProdutos, tipoProduto, multiplicador, markup, vendaAvulsa, valorBase, valorVendido });

    res.status(201).json({ message: 'Comissão criada com sucesso!', createCommissionService });

  } catch(error) {
    res.status(500).json({ error: 'Erro ao adicionar a comissão', error });
  }
}