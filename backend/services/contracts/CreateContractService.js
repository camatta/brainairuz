const Contract = require('../../models/Contracts');

module.exports.CreateContractService = async ( contract ) => {
  try {
    const newContract = new Contract(contract);
    await newContract.save();

    return newContract;

  } catch(error) {
    return { message: "Erro ao salvar contrato", error };
  }
}