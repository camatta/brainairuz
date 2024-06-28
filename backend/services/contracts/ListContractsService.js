const Contracts = require("../../models/Contracts");

module.exports.ListContractsService = async () => {
  const allContracts = await Contracts.find();

  return allContracts
}