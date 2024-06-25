const Commissions = require('../../models/Comissions');

exports.ListCommissionsByMonthService = async (mes) => {
    const comissoes = await Commissions.find({ mes: mes });
    return comissoes;
}