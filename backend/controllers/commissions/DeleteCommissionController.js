const { DeleteCommissionService } = require("../../services/commissions/DeleteCommissionService");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dqkc9nrh8",
  api_key: "799382813323656",
  api_secret: "XB28twBdRubxAdCddG4T-uXZPv0"
});


module.exports.DeleteCommissionController = async (req, res) => {
  try {
    const idComissao = req.params.id;
    const { publicIdImage } = req.body;
    const deleteCommissionService = await DeleteCommissionService(idComissao);

    if(deleteCommissionService) {
      cloudinary.uploader.destroy(publicIdImage);

      console.log(`Comissão removida com sucesso`);
      res.status(200).json({ message: `Comissão removida com sucesso` });
    } else {
      console.log('Comissão não encontrada');
      res.status(404).json({ message: `Comissão não encontrada`});
    }
  } catch(error) {
    console.error('Erro ao remover a comissão: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao remover a comissão' });
  }
}