const { GetContractService } = require('../../services/contracts/GetContractService');

module.exports.GetContractController = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await GetContractService(id);

    res.status(200).send({ contract })
  } catch(error) {
    res.status(500).send({ message: "Contrato inválido ou não existe." })
  }
}