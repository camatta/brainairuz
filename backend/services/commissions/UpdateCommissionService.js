const Commissions = require("../../models/Comissions");

exports.UpdateCommissionService = async ({ 
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
 }, commissionId) => {

  const comissaoToUpdate = {
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
  }

  const updateComissao = await Commissions.findByIdAndUpdate(commissionId, comissaoToUpdate);

  return updateComissao;
}