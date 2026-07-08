import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { AprendizadoComProgresso } from '@shared/types/aprendizado';
import { getErrorMessage } from '@/api/client';
import { useSnackbar } from '@/contexts/SnackbarContext';
import {
  type AprendizadoFormValues,
  aprendizadoFormSchema,
  emptyAprendizadoFormValues,
} from './aprendizadoSchema';

export function useAprendizadoForm(
  addAprendizado: (data: { titulo: string; descricao: string }) => Promise<AprendizadoComProgresso>,
  updateAprendizado: (
    id: string,
    data: Partial<{ titulo: string; descricao: string }>,
  ) => Promise<void>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showSnackbar } = useSnackbar();

  const form = useForm<AprendizadoFormValues>({
    resolver: zodResolver(aprendizadoFormSchema),
    defaultValues: emptyAprendizadoFormValues,
  });

  function openNew() {
    form.reset(emptyAprendizadoFormValues);
    setEditingId(null);
    setIsOpen(true);
  }

  function openEdit(aprendizado: AprendizadoComProgresso) {
    form.reset({
      titulo: aprendizado.titulo,
      descricao: aprendizado.descricao,
    });
    setEditingId(aprendizado.id);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setEditingId(null);
    form.reset(emptyAprendizadoFormValues);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      const data = {
        titulo: values.titulo.trim(),
        descricao: values.descricao.trim(),
      };

      if (editingId) {
        await updateAprendizado(editingId, data);
        showSnackbar('Aprendizado atualizado com sucesso.');
      } else {
        await addAprendizado(data);
        showSnackbar('Aprendizado criado com sucesso.');
      }

      close();
    } catch (err) {
      showSnackbar(getErrorMessage(err, 'Erro ao salvar o aprendizado.'), 'error');
    } finally {
      setIsSaving(false);
    }
  });

  return {
    isOpen,
    editingId,
    isSaving,
    form,
    openNew,
    openEdit,
    close,
    onSubmit,
  };
}

export type UseAprendizadoFormReturn = ReturnType<typeof useAprendizadoForm>;
