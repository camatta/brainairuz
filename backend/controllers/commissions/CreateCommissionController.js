const { CreateCommissionService } = require("../../services/commissions/CreateCommissionService");

exports.CreateCommissionController = async (req, res) => {
  try {
    const { 
      vendedor,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      vendaAvulsa,
      valorBase,
      valorVendido,
      qualidade,
      mix,
      comissaoFinal,
      valorComissao
    } = req.body;

    const createCommissionService = await CreateCommissionService({ 
      vendedor,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      vendaAvulsa,
      valorBase,
      valorVendido,
      qualidade,
      mix,
      comissaoFinal,
      valorComissao
    });

    console.log('Comissão adicionada com sucesso!')
    res.status(201).json(createCommissionService);

  } catch {
    res.status(500).json('Erro ao adicionar a comissão');
  }
}