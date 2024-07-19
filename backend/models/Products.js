const mongoose = require('mongoose');

// Definição do schema da collection Products
const ProductsSchema = new mongoose.Schema({
    produto: {
      type: String,
      required: true,
    },
    tipoProduto: {
        type: String,
        enum: ['Projeto', 'Recorrência'],
        required: true
    },
    tecnologia: {
        type: String,
        validate: {
            validator: function(value) {
                // Neste caso, o this se refere ao documento atual
                this.tipoProduto === 'Projeto' ? value != null && value !== '' : true; // true: Não necessário se não for 'Projeto'
            },
            message: 'Tecnologia é obrigatória quando o produto é um Projeto.'
        }
    },
    meses: {
        type: Number,
        validate: {
            validator: function(value) {
                // Neste caso, o this se refere ao documento atual
                this.tipoProduto === 'Recorrência' ? value != null && value > 0 : true; // true: Não necessário se não for 'Recorrência'
            },
            message: 'Meses é obrigatório e deve ser maior que 0 quando o produto é Recorrência.'
        }
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

// Criação do modelo "Product" com base no esquema definido
const Products = mongoose.model('Products', ProductsSchema);

// Exportação do modelo "Produtos"
module.exports = Products;