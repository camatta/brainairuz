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
  grupo_markup,
  markup,
  vendaAvulsa,
  valorBase,
  valorVendido,
  imagemEmailAprovacaoMarkup
 }, commissionId) => {

  const comissaoToUpdate = {
    dataVenda: dataVenda,
    mes: mes,
    vendedor: vendedor,
    status: status,
    cliente: cliente,
    mixProdutos: mixProdutos,
    tipoProduto: tipoProduto,
    multiplicador: multiplicador,
    grupo_markup: grupo_markup,
    markup: markup,
    vendaAvulsa: vendaAvulsa,
    valorBase: valorBase,
    valorVendido: valorVendido,
    imageEmailMarkupApproval: imagemEmailAprovacaoMarkup
  }

  const updateComissao = await Commissions.findByIdAndUpdate(commissionId, comissaoToUpdate);

  return updateComissao;
}