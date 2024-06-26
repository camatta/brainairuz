export interface Contract {
  contratoId: string,
  contratoAutor: string,
  contratoStatus: string,
  contratoServico: string,
  criadoEm: string,
  atualizadoEm?: string | null,
  nzGroup: {
    nzEmpresaResponsavel: string;
    nzTime: string;
    nzTipoSite: string;
    nzServico: string;
    nzServicoPlataforma: string;
  },
  extEmpresaGroup: {
    extEmpresaCnpj: number;
    extEmpresaNome: string;
    extEmpresaIE?: number | null | string;
    extEmpresaEndereco: string;
    extEmpresaBairro: string;
    extEmpresaCEP: number;
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
    projetoInformacoes: string;
  }
}