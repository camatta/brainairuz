const mongoose = require('mongoose');

// Definição do schema da collection Products
const CommissionsSchema = new mongoose.Schema({
    dataVenda: {
      type: String,
      required: true
    },
    ano: {
      type: String,
      required: true
    },
    mes: {
      type: String,
      required: true
    },
    vendedor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    cliente: {
      type: String,
      required: true,
    },
    mixProdutos: {
      type: String,
      required: true,
    },
    tipoProduto: {
      type: String,
      required: false
    },
    multiplicador: {
      type: Number,
      required: true
    },
    markup: {
      type: Number,
      required: true
    },
    vendaAvulsa: {
      type: Number,
      required: true
    },
    valorBase: {
      type: Number,
      required: true
    },
    valorVendido: {
      type: Number,
      required: true
    },
    dataCriacaoComissao: {
      type: Date,
      default: Date.now
    }
})

// Criação do modelo "Comissao" com base no esquema definido
const Commissions = mongoose.model('Commissions', CommissionsSchema);

// Exportação do modelo "Comissões"
module.exports = Commissions;