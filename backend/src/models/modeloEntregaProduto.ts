export type EntregaProduto = {
  id: string;
  funcionarioId: string;
  produtoId: string;
  quantidade: number;
  entregueEm: Date;
  devolvidoEm?: Date;
  responsavelId: string;
  observacao?: string;
};