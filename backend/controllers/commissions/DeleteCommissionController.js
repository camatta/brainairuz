const { DeleteCommissionService } = require("../../services/commissions/DeleteCommissionService");


module.exports.DeleteCommissionController = async (req, res) => {
  try {
    const idComissao = req.params.id;
    const deleteCommissionService = await DeleteCommissionService(idComissao);

    if(deleteCommissionService) {
      console.log(`Comissão removida com sucesso`);
      res.status(200).json({ message: `Comissão removida com sucesso` });
    } else {
      console.log('Comissão não encontrada');
      res.status(404).json({ message: `Comissão não encontrada`});
    }
  } catch(error) {
    console.error('Erro ao remover a comissão: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao remover a comissão' });
  }
}