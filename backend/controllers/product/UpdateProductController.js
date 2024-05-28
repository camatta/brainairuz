const { UpdateProductService } = require('../../services/product/UpdateProductService');

exports.UpdateProductController = async (req, res) => {
  try {
    const { id, produto, tecnologia, valor_venda, observacao } = req.body;
    const productId = req.params.id;

    const updateProductService = await UpdateProductService(
      {
        id,
        produto,
        tecnologia,
        valor_venda,
        observacao
      },
      productId
    );
    
    if(updateProductService){
      console.log(`Produto alterado com sucesso`);
      res.status(200).json(`Produto ${productId} alterado com sucesso`);
    } else {
      console.log('Produto não encontrado');
      res.status(404).json(`Produto ${productId} não encontrado`);
    }
  } catch (error) {
    console.error('Erro ao alterar o produto: ', error);
    res.status(500).json('Erro interno do servidor ao alterar o produto');
  }
}