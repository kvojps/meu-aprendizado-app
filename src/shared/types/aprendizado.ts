export interface Aprendizado {
  id: string;
  titulo: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
}

export interface AprendizadoComProgresso extends Aprendizado {
  totalNos: number;
  nosConcluidos: number;
}
