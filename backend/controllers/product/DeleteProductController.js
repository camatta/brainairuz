const { DeleteProductService } = require('../../services/product/DeleteProductService');

exports.DeleteProductController = async (req, res) => {
  try {
    const productId = req.params.id;

    const deleteProductService = await DeleteProductService(productId);

    if(deleteProductService) {
      console.log(`Produto excluído com sucesso`);
      return res.status(200).json({ message: `Produto ${productId} excluído com sucesso` });
    } else {
      console.log('Produto não encontrado');
      return res.status(404).json({ message: `Produto ${productId} não encontrado` });
    }
  } catch(error) {
    console.error('Erro ao excluir o produto: ', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao excluir o produto' });
  }
}