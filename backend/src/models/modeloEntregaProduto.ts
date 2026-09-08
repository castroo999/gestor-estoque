export type EntregaProduto = {
  id: string;
  funcionarioId: string;
  produtoId: string;
  quantidade: number;
  entregueEm: Date;
  devolvidoEm: Date | null;
  responsavelId: string;
  observacao: string | null;
};