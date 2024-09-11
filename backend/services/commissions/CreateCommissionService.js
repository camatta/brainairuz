const Commission = require("../../models/Comissions");

module.exports.CreateCommissionService = async ({ dataVenda, mes, ano, vendedor, status, cliente, mixProdutos, tipoProduto, multiplicador, markup, grupo_markup, vendaAvulsa, valorBase, valorVendido }) => {
  // Criando uma nova comissão utilizando o modelo importado
  const novaComissao = new Commission({
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
  })

  await novaComissao.save();
  return novaComissao;
}