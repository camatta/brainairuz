const Client = require("../../models/Clients");

module.exports.GetClientService = async ( cnpj ) => {
  try {
    const client = await Client.findOne({ empresaCnpj: cnpj });

    if(!client) {
      throw new Error( "Cliente inválido" )
    }

    return client;
  } catch(error) {
    throw new Error({ message: "Erro ao consultar cliente", error })
  }
}