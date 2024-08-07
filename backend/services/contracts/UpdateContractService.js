const Contract = require('../../models/Contracts');

module.exports.UpdateContractService = async ( _id, contract ) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(_id, contract, { new: true, runValidators: true });

    return updatedContract;

  } catch(error) {
    return { message: "Erro ao atualizar contrato", error };
  }
}