const { ListCommissionsService } = require("../../services/commissions/ListCommissionsService");

exports.ListCommissionsController = async (req, res) => {
  try {
    const listCommissionsService = await ListCommissionsService();

    res.status(200).json(listCommissionsService);
    
  } catch (error) {
    res.status(500).send('Erro do servidor');
  }
}