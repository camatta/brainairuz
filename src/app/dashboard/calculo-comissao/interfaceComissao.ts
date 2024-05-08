export interface Comissao {
  vendedor: string;
  cliente: string;
  mixProdutos: string;
  tipoProduto: string;
  multiplicador: number;
  markup: number;
  vendaAvulsa: number;
  fatorMultiplicador: number;
  valorBase: number; // não
  valorVendido: number; // não
  qualidade: number; // não
  mix: number; // não
  comissaoFinal: number; // não
  valorComissao: number; // não
}