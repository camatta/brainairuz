const Contracts = require("../../models/Contracts");

module.exports.GetContractService = async ( _id ) => {
  try {
    const contract = await Contracts.findById( _id );
  
    return contract
  } catch(error) {
    throw new Error({ message: "Erro ao consultar contrato", error });
  }
}