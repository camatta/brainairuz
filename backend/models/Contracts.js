const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  contratoId: { type: String, require: true, unique: true },
  contratoAutor: { type: String, require: true },
  contratoStatus: { type: String, require: true },
  contratoEmpresa: { type: String, require: true },
  contratoTime: { type: String, require: true },
  contratoCriadoEm: { type: String, require: true },
  contratoAtualizadoEm: { type: String },
  nzGroup: {
    nzTime: { type: String, require: true },
    nzTipoProjeto: { type: String, require: true },
    nzProjetoPlataforma: { type: String },
    nzProjetoHoras: { type: String },
    nzServico: { type: String, require: true }
  },
  extEmpresaGroup: {
    extEmpresaCnpj: { type: String, require: true },
    extEmpresaNome: { type: String, require: true },
    extEmpresaIE: { type: String },
    extEmpresaCEP: { type: String, require: true },
    extEmpresaEndereco: { type: String, require: true },
    extEmpresaBairro: { type: String, require: true },
    extEmpresaCidade: { type: String, require: true },
    extEmpresaEstado: { type: String, require: true },
    extEmpresaCpfRepLegal: { type: String, require: true },
    extEmpresaNomeRepLegal: { type: String, require: true },
  },
  projetoGroup: {
    projetoPrazo: { type: String, require: true },
    projetoValor: { type: String, require: true },
    projetoParcelas: { type: String, require: true },
    projetoParcelasValor: { type: String, require: true },
    projetoMulta: { type: String, require: true },
    projetoData: { type: String, require: true },
    projetoCarencia: { type: String, require: true },
    projetoInformacoes: { type: String, require: true }
  }
});

const Contracts = mongoose.model('Contracts', ContractSchema);

module.exports = Contracts;