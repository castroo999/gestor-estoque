export type TipoProduto =
  | "COMUM"
  | "EPI"
  | "FERRAMENTA"
  | "EQUIPAMENTO"
  | "UNIFORME";

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  qnt: number;
  estoqueMinimo: number;
  tipo: TipoProduto;
  ca?: string;
  validadeCA?: Date;
  lote?: string;
  tamanho?: string;
  fabricante?: string;
};