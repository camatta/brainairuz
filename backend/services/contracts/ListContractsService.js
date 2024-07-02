const Contracts = require("../../models/Contracts");

module.exports.ListContractsService = async () => {
  const allContracts = await Contracts.find().sort({ contratoCriadoEm: -1 });

  return allContracts
}