const Contracts = require("../../models/Contracts");

module.exports.GetContractService = async ( _id ) => {
  try {
    const contract = await Contracts.findById( _id );

    if(contract !== null) {
      return contract
    }
  
    return new Error({ message: "Erro ao consultar contrato", error });
  } catch(error) {
    throw new Error({ message: "Erro ao consultar contrato", error });
  }
}