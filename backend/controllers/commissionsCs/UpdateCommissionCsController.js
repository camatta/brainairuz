const { UpdateCommissionCsService } = require("../../services/commissionsCs/UpdateCommissionCsService");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dqkc9nrh8",
  api_key: "799382813323656",
  api_secret: "XB28twBdRubxAdCddG4T-uXZPv0"
})

module.exports.UpdateCommissionCsController = async (req, res) => {
  try {
    const {
      dataVenda,
      mes,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      grupo_markup,
      markup,
      vendaAvulsa,
      valorBase,
      valorVendido
     } = req.body;

    const idComissao = req.params.id;
    
    const updateCommissionCsService = await UpdateCommissionCsService({ 
      dataVenda,
      mes,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      grupo_markup,
      markup,
      vendaAvulsa,
      valorBase,
      valorVendido
     }, idComissao);

     if(updateCommissionCsService){
      console.log(`Comissão alterada com sucesso`);
      res.status(200).json({ message: `Comissão alterada com sucesso` });
    } else {
      console.log('Comissão não encontrada');
      res.status(404).json({ message: `Comissão não encontrada` });
    }
  } catch (error) {
    console.error('Erro ao alterar a comissão: ', error);
    res.status(500).json({ error: 'Erro interno do servidor ao alterar a comissão' });
  }
}