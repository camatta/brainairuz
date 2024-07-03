const Contract = require('../../models/Contracts');

module.exports.CreateContractService = async ( contract ) => {
  try {
    const newContract = new Contract(contract);

    const response = await newContract.save();

    if(response.errors) {
      throw new Error('Algo deu errado ao salvar o novo contrato.', response.errors);
    }

    return newContract;

  } catch(err) {
    return { message: "Erro ao salvar contrato", error: err.message };
  }
}