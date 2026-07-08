import { z } from 'zod';

export const createAprendizadoSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  descricao: z.string(),
});

export const updateAprendizadoSchema = createAprendizadoSchema.partial();
