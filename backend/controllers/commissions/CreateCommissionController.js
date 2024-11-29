const { CreateCommissionService } = require("../../services/commissions/CreateCommissionService");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "dqkc9nrh8",
  api_key: "799382813323656",
  api_secret: "XB28twBdRubxAdCddG4T-uXZPv0"
})

module.exports.CreateCommissionController = async (req, res) => {
  try {
    let {
      dataVenda,
      mes,
      ano,
      vendedor,
      status,
      cliente,
      mixProdutos,
      tipoProduto,
      multiplicador,
      markup,
      grupo_markup,
      vendaAvulsa,
      valorBase,
      valorVendido
    } = req.body;

    multiplicador = Number(multiplicador);
    grupo_markup = Number(grupo_markup);
    markup = Number(markup);
    vendaAvulsa = Number(vendaAvulsa);
    valorBase = Number(valorBase);
    valorVendido = Number(valorVendido);
    
    if(!req.files || Object.keys(req.files).length === 0) {
      console.log("Arquivo não enviado");

      let imagemEmailAprovacaoMarkup = "";

      const createCommissionService = await CreateCommissionService({
        dataVenda,
        mes,
        ano,
        vendedor,
        status,
        cliente,
        mixProdutos,
        tipoProduto,
        multiplicador,
        markup,
        grupo_markup,
        vendaAvulsa,
        valorBase,
        valorVendido,
        imagemEmailAprovacaoMarkup
      });

      console.log(createCommissionService);
      res.status(201).json({ message: 'Comissão criada com sucesso!', createCommissionService });
    } else {
      const file = req.files['imageEmailMarkupApproval'];

      resultFile = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, result) => {
          if(error) {
            reject(error);
            return;
          }

          resolve(result);
        }).end(file.data);
      });
      
      let imagemEmailAprovacaoMarkup = resultFile.url;

      const createCommissionService = await CreateCommissionService({
        dataVenda,
        mes,
        ano,
        vendedor,
        status,
        cliente,
        mixProdutos,
        tipoProduto,
        multiplicador,
        markup,
        grupo_markup,
        vendaAvulsa,
        valorBase,
        valorVendido,
        imagemEmailAprovacaoMarkup
      });

      console.log(createCommissionService);
      res.status(201).json({ message: 'Comissão criada com sucesso!', createCommissionService });
    }
  } catch(error) {
    res.status(500).json({ error: 'Erro ao adicionar a comissão', error });
  }
}