const { DeleteGoalService } = require("../../services/goals/DeleteGoalService");

module.exports.DeleteGoalController = async (req, res) => {
  try {
    const idMeta = req.params.id;
    const deleteGoalService = await DeleteGoalService(idMeta);

    if(deleteGoalService) {
      console.log(`Meta removida com sucesso`);
      res.status(200).json({ message: `Meta removida com sucesso` });
    } else {
      console.log('Meta não encontrada');
      res.status(404).json({ message: `Meta não encontrada`});
    }
  } catch(error) {
    console.error('Erro ao remover a meta: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao remover a meta' });
  }
}