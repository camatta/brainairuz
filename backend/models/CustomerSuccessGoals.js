const mongoose = require('mongoose');

// Definição do schema da collection Metas
const CustomerSuccessGoalsSchema = new mongoose.Schema({
    nome: {
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
const CustomerSuccessGoals = mongoose.model('CustomerSuccessGoals', CustomerSuccessGoalsSchema);

// Exportação do modelo "Goals"
module.exports = CustomerSuccessGoals;