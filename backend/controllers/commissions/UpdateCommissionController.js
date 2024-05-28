const { UpdateCommissionService } = require("../../services/commissions/UpdateCommissionService");

exports.UpdateCommissionController = async (req, res) => {
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

    const idComissao = req.params._id;

    const updateCommissionService = UpdateCommissionService({ 
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
     }, idComissao);

    if(updateCommissionService){
      console.log(`Comissão alterada com sucesso`);
      res.status(200).json(`Comissão alterada com sucesso`);
    } else {
      console.log('Comissão não encontrada');
      res.status(404).json(`Comissão não encontrada`);
    }
  } catch (error) {
    console.error('Erro ao alterar a comissão: ', error);
    res.status(500).json('Erro interno do servidor ao alterar a comissão');
  }
}