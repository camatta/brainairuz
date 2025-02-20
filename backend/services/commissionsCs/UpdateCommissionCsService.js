const CommissionsCs = require("../../models/ComissionsCs");

module.exports.UpdateCommissionCsService = async ({
  dataVenda,
  mes,
  cs,
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
    vendedor: cs,
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

  const updateComissao = await CommissionsCs.findByIdAndUpdate(commissionId, comissaoToUpdate);

  return updateComissao;
}