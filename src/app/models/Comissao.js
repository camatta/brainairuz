const mongoose = require('mongoose');

// Definição do schema da collection Products
const ComissoesSchema = new mongoose.Schema({
    vendedor: {
      type: String,
      required: true,
    },
    cliente: {
        type: String,
        required: true,
    },
    mixProduto: {
        type: Number,
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
    }
})

// Criação do modelo "Comissao" com base no esquema definido
const Comissao = mongoose.model('Comissao', ComissoesSchema);

// Exportação do modelo "Comissões"
module.exports = Comissao;