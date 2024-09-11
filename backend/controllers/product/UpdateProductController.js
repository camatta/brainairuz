const { UpdateProductService } = require('../../services/product/UpdateProductService');

exports.UpdateProductController = async (req, res) => {
  try {
    const { produto, tipoProduto, tecnologia_servico, mrr, tipo_mrr, valor_venda, grupo_markup, observacao } = req.body;
    const productId = req.params.id;

    const updateProductService = await UpdateProductService(
      {
        produto,
        tipoProduto,
        tecnologia_servico,
        mrr,
        tipo_mrr,
        valor_venda,
        grupo_markup,
        observacao
      },
      productId
    );
    
    if(updateProductService){
      console.log(`Produto alterado com sucesso`);
      res.status(200).json({ message: `Produto ${productId} alterado com sucesso` });
    } else {
      console.log('Produto não encontrado');
      res.status(404).json({ message: `Produto ${productId} não encontrado` });
    }
  } catch (error) {
    console.error('Erro ao alterar o produto: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao alterar o produto' });
  }
}