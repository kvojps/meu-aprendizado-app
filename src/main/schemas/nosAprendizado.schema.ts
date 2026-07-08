import { z } from 'zod';

const statusSchema = z.enum(['nao_iniciado', 'em_andamento', 'concluido']);

export const createNoSchema = z.object({
  aprendizadoId: z.string().min(1, 'Aprendizado inválido'),
  parentId: z.string().min(1).nullable(),
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  anotacoes: z.string(),
});

export const updateNoSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório').optional(),
  status: statusSchema.optional(),
  anotacoes: z.string().optional(),
  posX: z.number().optional(),
  posY: z.number().optional(),
});
