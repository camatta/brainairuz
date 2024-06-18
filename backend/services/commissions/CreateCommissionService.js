const Commission = require("../../models/Comissions");

module.exports.CreateCommissionService = async ({ dataVenda, vendedor, cliente, mixProdutos, tipoProduto, multiplicador, markup, vendaAvulsa, fatorMultiplicador, valorBase, valorVendido, qualidade, mix, comissaoFinal, valorComissao }) => {
  // Criando uma nova comissão utilizando o modelo importado
  const novaComissao = new Commission({
    dataVenda: dataVenda,
    vendedor: vendedor,
    cliente: cliente,
    mixProdutos: mixProdutos,
    tipoProduto: tipoProduto,
    multiplicador: multiplicador,
    markup: markup,
    vendaAvulsa: vendaAvulsa,
    fatorMultiplicador: fatorMultiplicador,
    valorBase: valorBase,
    valorVendido: valorVendido,
    qualidade: qualidade,
    mix: mix,
    comissaoFinal: comissaoFinal,
    valorComissao: valorComissao
  })

  await novaComissao.save();
  return novaComissao;
}