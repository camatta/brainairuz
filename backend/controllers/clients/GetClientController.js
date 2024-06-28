const { GetClientService } = require("../../services/clients/GetClientService");

module.exports.GetClientController = async ( req, res ) => {
  try {
    const { cnpj } = req.params;

    const client = await GetClientService(cnpj);

    return res.status(200).send({ message: "Cliente encontrado!", client: client });

  } catch(error) {
    res.status(500).send({ message: "Erro ao consultar cliente!" });
  }
}