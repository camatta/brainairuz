const { DeleteCommissionService } = require("../../services/commissions/DeleteCommissionService");


exports.DeleteCommissionController = async (req, res) => {
  try {
    const idComissao = req.params._id;
    const deleteCommissionService = await DeleteCommissionService(idComissao);

    if(deleteCommissionService) {
      console.log(`Comissão removida com sucesso`);
      res.status(200).json(`Comissão removida com sucesso`);
    } else {
      console.log('Produto não encontrado');
      res.status(404).json(`Comissão não encontrada`);
    }
  } catch(error) {
    console.error('Erro ao remover a comissão: ', error);
    res.status(500).json('Erro interno do servidor ao remover a comissão');
  }
}