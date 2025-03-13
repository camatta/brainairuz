const CommissionCs = require("../../models/ComissionsCs");

module.exports.CreateCommissionCsService = async ({
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
}) => {
  // Criando uma nova comissão utilizando o modelo importado
  const novaComissaoCs = new CommissionCs({
    dataVenda: dataVenda,
    mes: mes,
    ano: ano,
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
  });

  await novaComissaoCs.save();
  return novaComissaoCs;
}