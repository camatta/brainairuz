const Contract = require('../../models/Contracts');

module.exports.UpdateContractStatusService = async ( _id, newStatus ) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(_id, { contratoStatus: newStatus }, { new: true, runValidators: true });

    return updatedContract;

  } catch(error) {
    return { message: "Erro ao atualizar status do contrato", error };
  }
}