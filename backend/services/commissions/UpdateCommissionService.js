const Commissions = require("../../models/Comissions");

module.exports.UpdateCommissionService = async ({
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
 }, commissionId) => {

  const comissaoToUpdate = {
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
  }

  const updateComissao = await Commissions.findByIdAndUpdate(commissionId, comissaoToUpdate);

  return updateComissao;
}