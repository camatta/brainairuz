export interface Comissao {
  dataVenda: Date;
  vendedor: string;
  cliente: string;
  mixProdutos: string;
  tipoProduto: string;
  multiplicador: number;
  markup: number;
  vendaAvulsa: number;
  fatorMultiplicador: number;
  valorBase: number;
  valorVendido: number;
  qualidade: number;
  mix: number;
  comissaoFinal: number;
  valorComissao: number;
}