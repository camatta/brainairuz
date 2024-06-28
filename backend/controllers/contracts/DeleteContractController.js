const { DeleteContractService } = require('../../services/contracts/DeleteContractService');

module.exports.DeleteContractController = async (req, res) => {
  try {
    const { id } = req.params
  
    const deletedContract = await DeleteContractService( id );

    if(deletedContract){
      res.status(200).json({ message: 'Contrato excluído com sucesso', deletedContract });
    } else {
      res.status(404).json({ message: 'Contrato não encontrado' });
    }

  } catch(error) {
    res.status(500).send({ message: "Erro ao excluir o contrato", error })
  }
}