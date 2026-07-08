import { z } from 'zod';

export const aprendizadoFormSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  descricao: z.string(),
});

export type AprendizadoFormValues = z.infer<typeof aprendizadoFormSchema>;

export const emptyAprendizadoFormValues: AprendizadoFormValues = {
  titulo: '',
  descricao: '',
};
