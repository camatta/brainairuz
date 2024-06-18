const mongoose = require('mongoose');

// Definição do schema da collection Products
const CommissionsSchema = new mongoose.Schema({
    dataVenda: {
      type: Date,
      required: true
    },
    vendedor: {
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
        required: true
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
    fatorMultiplicador: {
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
    qualidade: {
      type: Number,
      required: true
    },
    mix: {
      type: Number,
      required: true
    },
    comissaoFinal: {
      type: Number,
      required: true
    },
    valorComissao: {
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