const Commissions = require("../../models/Comissions");

exports.CreateCommissionService = async ({ 
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
}) => {

  // Criando uma nova comissão utilizando o modelo importado
  const novaComissao = new Commissions({
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
  })

  await novaComissao.save();

  return novaComissao;
}