const { DeleteMixProductService } = require("../../services/mixProducts/DeleteMixProductService");


module.exports.DeleteMixProductController = async (req, res) => {
  try {
    const idMixProduto = req.params.id;
    const deleteMixProductService = await DeleteMixProductService(idMixProduto);

    if(deleteMixProductService) {
      console.log(`Mix de produtos removido com sucesso`);
      res.status(200).json({ message: `Mix de produtos removido com sucesso` });
    } else {
      console.log('Mix de produtos não encontrado');
      res.status(404).json({ message: `Mix de produtos não encontrado`});
    }
  } catch(error) {
    console.error('Erro ao remover o mix de produtos: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao remover o mix de produtos' });
  }
}