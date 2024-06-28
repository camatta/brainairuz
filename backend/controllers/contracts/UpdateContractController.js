const { UpdateContractService } = require('../../services/contracts/UpdateContractService');

module.exports.UpdateContractController = async (req, res) => {
  try {
    const { id } = req.params
    const { contract } = req.body;
  
    const updatedContract = await UpdateContractService( id, contract );

    if(updatedContract){
      res.status(200).json({ message: 'Contrato atualizado com sucesso', updatedContract });
    } else {
      res.status(404).json({ message: 'Contrato não encontrado' });
    }

  } catch(error) {
    res.status(500).send({ message: "Erro ao atualizar o contrato", error })
  }
}