export type Comissao = {
  dataVenda: string;
  mes: string;
  ano: string;
  vendedor?: string;
  status: string;
  cliente: string;
  mixProdutos: string;
  tipoProduto: string;
  multiplicador: number;
  grupo_markup: number;
  markup: number;
  vendaAvulsa: number;
  valorBase: number;
  valorVendido: number;
  imageEmailMarkupApproval: FormData;
}