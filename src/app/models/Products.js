const mongoose = require('mongoose');

// Definição do schema da collection Products
const ProductsSchema = new mongoose.Schema({
    produto: {
      type: String,
      required: true,
    },
    tecnologia: {
        type: String,
        required: true,
    },
    valor_venda: {
        type: Number,
        required: true,
    },
    observacao: {
        type: String,
        required: false
    }
})

// Criação do modelo "Avaliacao" com base no esquema definido
const Products = mongoose.model('Products', ProductsSchema);

// Exportação do modelo "Produtos"
module.exports = Products;