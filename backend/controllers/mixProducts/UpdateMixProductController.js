const { UpdateMixProductService } = require('../../services/mixProducts/UpdateMixProductService');

module.exports.UpdateMixProductController = async (req, res) => {
  try {
    const mixProduct = req.body;
    const mixProductId = req.params.id;

    const updateMixProductService = UpdateMixProductService(mixProduct, mixProductId);

    if(updateMixProductService){
      console.log(`Mix de produto alterado com sucesso`);
      res.status(200).json({ message: `Mix de produto alterado com sucesso` });
    } else {
      console.log('Mix de produto não encontrado');
      res.status(404).json({ message: `Mix de produto não encontrado` });
    }
  } catch (error) {
    console.error('Erro ao alterar o mix de produto: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao alterar o mix de produto' });
  }
}