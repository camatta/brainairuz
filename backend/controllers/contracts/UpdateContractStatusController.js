const { UpdateContractStatusService } = require('../../services/contracts/UpdateContractStatusService');

module.exports.UpdateContractStatusController = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body;
  
    const updatedContract = await UpdateContractStatusService( id, status );

    if(updatedContract){
      res.status(200).json({ message: 'O Status do Contrato foi atualizado com sucesso', updatedContract });
    } else {
      res.status(404).json({ message: 'Contrato não encontrado' });
    }

  } catch(error) {
    res.status(500).send({ message: "Erro ao atualizar status do contrato", error })
  }
}