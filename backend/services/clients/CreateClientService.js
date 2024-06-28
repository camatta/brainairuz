const Client = require ("../../models/Clients")

module.exports.CreateClientService = async ({
  empresaCnpj,
  empresaNome,
  empresaIE,
  empresaCep,
  empresaEndereco,
  empresaBairro,
  empresaCidade,
  empresaEstado,
  criado_em }) => {
    try {
      const newClient = new Client({
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
    
      await newClient.save();
    
      return newClient;
    } catch( error ) {
      return { message: "Erro ao salvar cliente", error };
    }
}