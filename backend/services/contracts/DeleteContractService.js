const Contract = require('../../models/Contracts');

module.exports.DeleteContractService = async ( _id ) => {
  try {
    const deletedContract = await Contract.findOneAndDelete( _id );

    if(!deletedContract) {
      throw new Error("Contrato inválido ou não existe.")
    }

    return deletedContract;

  } catch(error) {
    return { message: "Erro ao excluir contrato", error };
  }
}