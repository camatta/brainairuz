const { UpdateCommissionService } = require("../../services/commissions/UpdateCommissionService");

module.exports.UpdateCommissionController = async (req, res) => {
  try {
    const {
      dataVenda,
      mes,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      vendaAvulsa,
      valorBase,
      valorVendido
     } = req.body;

    const idComissao = req.params.id;

    const updateCommissionService = await UpdateCommissionService({ 
      dataVenda,
      mes,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      vendaAvulsa,
      valorBase,
      valorVendido
     }, idComissao);

    if(updateCommissionService){
      console.log(`Comissão alterada com sucesso`);
      res.status(200).json({ message: `Comissão alterada com sucesso` });
    } else {
      console.log('Comissão não encontrada');
      res.status(404).json({ message: `Comissão não encontrada` });
    }
  } catch (error) {
    console.error('Erro ao alterar a comissão: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao alterar a comissão' });
  }
}