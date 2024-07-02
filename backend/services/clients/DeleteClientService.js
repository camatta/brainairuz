const Client = require("../../models/Clients");

module.exports.DeleteClientService = async ( cnpj ) => {
  try {
    const client = await Client.findOneAndDelete({ empresaCnpj: cnpj });

    if(client === null) {
      throw new Error("Cliente não existe!");
    }

    return client;
  } catch(error) {
    throw new Error({ message: "Erro ao deletar cliente", error });
  }
}