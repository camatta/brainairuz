const mongoose = require('mongoose');

// Definição do schema da collection Metas
const SellerGoalsSchema = new mongoose.Schema({
    vendedor: {
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
    metaIndividual: {
        type: Number,
        required: true,
    }
})

// Criação do modelo "Goals" com base no esquema definido
const SellerGoals = mongoose.model('SellerGoals', SellerGoalsSchema);

// Exportação do modelo "Goals"
module.exports = SellerGoals;