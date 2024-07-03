const Contract = require('../../models/Contracts');

module.exports.DeleteContractService = async ( id ) => {
  try {
    const deletedContract = await Contract.findOneAndDelete({ _id: id });

    return deletedContract;

  } catch(error) {
    return { message: "Erro ao excluir contrato", error };
  }
}