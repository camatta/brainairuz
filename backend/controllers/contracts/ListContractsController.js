const { ListContractsService } = require('../../services/contracts/ListContractsService');

module.exports.ListContractsController = async (req, res) => {
  try {
    const contracts = await ListContractsService();

    res.status(200).send({ contracts })
  } catch(error) {
    res.status(500).send({ message: "Erro ao consultar contratos!", error })
  }
}