import { z } from 'zod';

export const statusNoOptions = [
  { value: 'nao_iniciado', label: 'Não iniciado', color: 'default' as const },
  { value: 'em_andamento', label: 'Em andamento', color: 'warning' as const },
  { value: 'concluido', label: 'Concluído', color: 'success' as const },
] as const;

export const noFormSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  status: z.enum(['nao_iniciado', 'em_andamento', 'concluido']),
  anotacoes: z.string(),
});

export type NoFormValues = z.infer<typeof noFormSchema>;

export const emptyNoFormValues: NoFormValues = {
  titulo: '',
  status: 'nao_iniciado',
  anotacoes: '',
};
