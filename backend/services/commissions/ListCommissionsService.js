const Commissions = require('../../models/Comissions');

exports.ListCommissionsService = async () => {
  const comissoes = await Commissions.find();

  return comissoes;
}