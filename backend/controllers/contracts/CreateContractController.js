const { CreateContractService } = require('../../services/contracts/CreateContractService');

module.exports.CreateContractController = async (req, res) => {
  try {
    const { contract } = req.body;
  
    const newContract = await CreateContractService( contract );
    
    if(newContract.error) {
      res.status(400).send({ message: "Algo deu errado ao criar o contrato", newContract });
    }

    res.status(201).send( newContract )

  } catch(error) {
    res.status(500).send({ message: "Erro ao criar um novo contrato", error })
  }
}