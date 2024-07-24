const mongoose = require('mongoose');

// Definição do schema da collection Metas
const EnterpriseGoalsSchema = new mongoose.Schema({
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
    }
})

// Criação do modelo "Goals" com base no esquema definido
const EnterpriseGoals = mongoose.model('EnterpriseGoals', EnterpriseGoalsSchema);

// Exportação do modelo "Goals"
module.exports = EnterpriseGoals;