export type StatusNoAprendizado = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface NoAprendizado {
  id: string;
  aprendizadoId: string;
  parentId: string | null;
  titulo: string;
  status: StatusNoAprendizado;
  anotacoes: string;
  posX: number | null;
  posY: number | null;
  createdAt: string;
  updatedAt: string;
}
