const Product = require('../../models/Products');

module.exports.CreateProductService = async ({
  produto,
  tipoProduto,
  tecnologia_servico,
  mrr,
  tipo_mrr,
  valor_venda,
  grupo_markup,
  observacao
}) => {
  // Criando um novo produto utilizando o modelo importado
  const novoProduto = new Product({
    produto: produto,
    tipoProduto: tipoProduto,
    tecnologia_servico: tecnologia_servico,
    mrr: mrr,
    tipo_mrr: tipo_mrr,
    valor_venda: valor_venda,
    grupo_markup: grupo_markup,
    observacao: observacao
  })

  await novoProduto.save();

  return novoProduto;
}