const { CreateCommissionCsService } = require("../../services/commissionsCs/CreateCommissionCsService");

module.exports.CreateCommissionCsController = async (req, res) => {

  console.log('req.body', req.body);

  try {
    let {
      dataVenda,
      mes,
      ano,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      grupo_markup,
      vendaAvulsa,
      valorBase,
      valorVendido
    } = req.body;

    multiplicador = Number(multiplicador);
    grupo_markup = Number(grupo_markup);
    markup = Number(markup);
    vendaAvulsa = Number(vendaAvulsa);
    valorBase = Number(valorBase);
    valorVendido = Number(valorVendido);
    
    const createCommissionCsService = await CreateCommissionCsService({
      dataVenda,
      mes,
      ano,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      grupo_markup,
      vendaAvulsa,
      valorBase,
      valorVendido
    });

    res.status(201).json({ message: 'Comissão criada com sucesso!', createCommissionCsService });
  } catch(error) {
    res.status(500).json({ error: 'Erro ao adicionar a comissão', error });
  }
}