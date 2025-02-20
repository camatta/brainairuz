const CommissionCs = require("../../models/ComissionsCs");

module.exports.CreateCommissionCsService = async ({
  dataVenda,
  mes,
  ano,
  cs,
  status,
  cliente,
  mixProdutos,
  tipoProduto,
  multiplicador,
  markup,
  grupo_markup,
  vendaAvulsa,
  valorBase,
  valorVendido,
  imagemEmailAprovacaoMarkup
}) => {
  // Criando uma nova comissão utilizando o modelo importado
  const novaComissao = new CommissionCs({
    dataVenda: dataVenda,
    mes: mes,
    ano: ano,
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
  })

  await novaComissao.save();
  return novaComissao;
}