const { CreateClientService } = require("../../services/clients/CreateClientService");

module.exports.CreateClientController = async (req, res) => {
  try {
    const { 
      empresaCnpj,
      empresaNome,
      empresaIE,
      empresaCep,
      empresaEndereco,
      empresaBairro,
      empresaCidade,
      empresaEstado,
      criado_em
    } = req.body;

    const newClient = await CreateClientService({
      empresaCnpj,
      empresaNome,
      empresaIE,
      empresaCep,
      empresaEndereco,
      empresaBairro,
      empresaCidade,
      empresaEstado,
      criado_em
    });

    if(newClient.error) {
      res.status(500).send(newClient)
    }

    res.status(201).send( newClient )

  } catch(error) {
    res.status(500).json({ error: "Erro ao criar um novo cliente" });
  }
}