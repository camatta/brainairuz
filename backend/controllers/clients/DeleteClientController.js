const { DeleteClientService } = require("../../services/clients/DeleteClientService");

module.exports.DeleteClientController = async ( req, res ) => {
  try {
    const { cnpj } = req.params;

    const client = await DeleteClientService(cnpj);

    return res.status(200).send({ message: "Cliente deletado!", client: client });

  } catch(error) {
    res.status(500).send({ message: "Erro ao deletar cliente!", error });
  }
}