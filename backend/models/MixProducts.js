const mongoose = require('mongoose');

// Definição do schema da collection Mix Products
const MixProductSchema = new mongoose.Schema({
    mixProduto: {
      type: String,
      required: true
    }
})

// Criação do modelo "Mix Produto" com base no esquema definido
const MixProducts = mongoose.model('MixProducts', MixProductSchema);

// Exportação do modelo "Mix Produtos"
module.exports = MixProducts;