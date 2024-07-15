const mongoose = require('mongoose');

// Definição do schema da collection Oportunidades
const OpportunitiesSchema = new mongoose.Schema({
    data: {
      type: Date,
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
    suspect: {
        type: String,
        require: true
    },
    origem: {
        type: String,
        require: true
    },
    fonte: {
        type: String,
        require: true
    },
    responsavel: {
        type: String,
        require: true
    },
    primeiro_contato:{
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    reuniao_agendada: {
        type: Date,
        require: true
    },
    sla_atendimento: {
        type: Number,
        require: true
    },
    percentual_fit: {
        type: String,
        require: true
    },
    perfil_cliente: {
        type: String,
        require: true
    },
    etapa: {
        type: String,
        require: true
    },
    produto: {
        type: String,
        require: true
    },
    detalhes_produto: {
        type: String,
        require: true
    },
    valor_proposta: {
        type: Number,
        require: true
    },
    motivo_perda: {
        type: String,
        require: true
    },
    valor_vendido: {
        type: Number,
        require: true
    },
    markup: {
        type: Number,
        require: true
    },
    mrr: {
        type: Number,
        require: true
    },
    data_aceite: {
        type: Date,
        require: true
    },
    ciclo_venda: {
        type: Number,
        require: true
    },
    mes_encerramento: {
        type: String,
        require: true
    }
})

// Criação do modelo "Oportunidades" com base no esquema definido
const Opportunities = mongoose.model('Opportunities', OpportunitiesSchema);

// Exportação do modelo "Oportunidades"
module.exports = Opportunities;