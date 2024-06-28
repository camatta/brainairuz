const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  empresaCnpj: {
    type: String,
    require: true,
    unique: true
  },
  empresaNome: {
    type: String,
    require: true
  },
  empresaIE: {
    type: String,
  },
  empresaCep: { 
    type: String,
    require: true
  },
  empresaEndereco: {
    type: String,
    require: true
  },
  empresaBairro: {
    type: String,
    require: true
  },
  empresaCidade: {
    type: String,
    require: true
  },
  empresaEstado: {
    type: String,
    require: true
  },
  criado_em: {
    type: String,
    require: true
  }
});

const Clients = mongoose.model('Clients', ClientSchema);

module.exports = Clients;