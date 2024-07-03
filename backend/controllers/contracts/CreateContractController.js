const { CreateContractService } = require('../../services/contracts/CreateContractService');

module.exports.CreateContractController = async (req, res) => {
  try {
    const { contract } = req.body;
  
    const newContract = await CreateContractService( contract );
    
    if(newContract.error) {
      res.status(400).send({ message: "Algo deu errado ao criar o contrato", error: newContract.error });
    }

    res.status(201).send( newContract )

  } catch(err) {
    res.status(500).send({ message: "Erro ao criar um novo contrato", error: err.message })
  }
}