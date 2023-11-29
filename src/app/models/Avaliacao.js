const mongoose = require('mongoose');

// Definição do esquema da coleção "avaliacoes"
const AvaliacaoSchema = new mongoose.Schema({
  funcionario: {
    type: String,
    required: true,
  },
  mediaIndividual: {
    type: Number,
    required: true,
  },
  mediaTime: {
    type: Number,
    required: true,
  },
  mediaEmpresa: {
    type: Number,
    required: true,
  },
  mediaFinalGeral: {
    type: Number,
    required: true,
  },
  performance: {
    type: String,
    required: false,
  },
  dataFormatada: {
    type: String,
    required: true,
  },
  avaliador: {
    type: String,
    required: true,
  },
  notas: [
    { nome: String,
      requisito: String,
      avaliacao: String,
      nota: Number,
    }
  ]
});

// Criação do modelo "Avaliacao" com base no esquema definido
const Avaliacao = mongoose.model('Avaliacao', AvaliacaoSchema);

// Exportação do modelo "Avaliacao"
module.exports = Avaliacao;