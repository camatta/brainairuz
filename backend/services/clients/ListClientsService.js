const Client = require("../../models/Clients");

module.exports.ListClientsService = async () => {
  const allClients = await Client.find();

  return allClients;
}