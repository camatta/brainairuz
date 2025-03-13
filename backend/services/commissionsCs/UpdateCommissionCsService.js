const CommissionsCs = require("../../models/ComissionsCs");

module.exports.UpdateCommissionCsService = async ({
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
  valorVendido
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
    valorVendido: valorVendido
  }

  const updateComissao = await CommissionsCs.findByIdAndUpdate(commissionId, comissaoToUpdate);

  return updateComissao;
}