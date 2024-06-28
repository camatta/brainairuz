const { ListClientsService } = require("../../services/clients/ListClientsService");

module.exports.ListClientsController = async (req, res) => {
  try {
    const allClients = await ListClientsService();

    res.status(200).send({ message: "Consulta realizada com sucesso", clients: allClients })
  } catch(error) {
    return res.status(500).send({ error: "Erro ao consultar clientes." })
  }
}