const mongoose = require('mongoose');

// Definição do schema da collection Metas
const GoalsSchema = new mongoose.Schema({
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
    metaEmpresa: {
      type: Number,
      required: true,
    },
    metaRealizadaEmpresa: {
        type: Number,
        required: true,
    },
    metaIndividual: {
        type: Number,
        required: true,
    },
    metaRealizadaIndividual: {
        type: Number,
        required: true
    }
})

// Criação do modelo "Goals" com base no esquema definido
const Goals = mongoose.model('Goals', GoalsSchema);

// Exportação do modelo "Goals"
module.exports = Goals;