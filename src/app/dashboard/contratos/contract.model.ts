export type Contract = {
  _id?: string,
  contratoId: string,
  contratoAutor: string,
  contratoStatus: string,
  contratoEmpresa: string,
  contratoTime: string,
  contratoCriadoEm: string,
  contratoAtualizadoEm?: string | null,
  nzGroup: {
    nzTime: string;
    nzTipoProjeto: string;
    nzProjetoPlataforma?: string;
    nzProjetoHoras?: number | "";
    nzServico: string;
  },
  extEmpresaGroup: {
    extEmpresaCnpj: number;
    extEmpresaNome: string;
    extEmpresaIE?: number | "";
    extEmpresaCEP: number;
    extEmpresaEndereco: string;
    extEmpresaBairro: string;
    extEmpresaCidade: string;
    extEmpresaEstado: string;
    extEmpresaCpfRepLegal: number;
    extEmpresaNomeRepLegal: string;
  },
  projetoGroup: {
    projetoPrazo: number;
    projetoValor: number;
    projetoParcelas: number;
    projetoParcelasValor: number;
    projetoMulta: number;
    projetoData: string;
    projetoCarencia: number;
    projetoInformacoes: string;
  }
}