import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { NoAprendizado } from '@shared/types/noAprendizado';
import { getErrorMessage } from '@/api/client';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { type NoFormValues, emptyNoFormValues, noFormSchema } from './noSchema';

export function useNoForm(
  addNo: (data: {
    parentId: string | null;
    titulo: string;
    anotacoes: string;
  }) => Promise<NoAprendizado>,
  updateNo: (
    id: string,
    data: Partial<Pick<NoAprendizado, 'titulo' | 'status' | 'anotacoes'>>,
  ) => Promise<void>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showSnackbar } = useSnackbar();

  const form = useForm<NoFormValues>({
    resolver: zodResolver(noFormSchema),
    defaultValues: emptyNoFormValues,
  });

  function openNew(newParentId: string | null) {
    form.reset(emptyNoFormValues);
    setEditingId(null);
    setParentId(newParentId);
    setIsOpen(true);
  }

  function openEdit(no: NoAprendizado) {
    form.reset({
      titulo: no.titulo,
      status: no.status,
      anotacoes: no.anotacoes,
    });
    setEditingId(no.id);
    setParentId(no.parentId);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setEditingId(null);
    setParentId(null);
    form.reset(emptyNoFormValues);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      if (editingId) {
        await updateNo(editingId, {
          titulo: values.titulo.trim(),
          status: values.status,
          anotacoes: values.anotacoes.trim(),
        });
        showSnackbar('Tópico atualizado com sucesso.');
      } else {
        await addNo({
          parentId,
          titulo: values.titulo.trim(),
          anotacoes: values.anotacoes.trim(),
        });
        showSnackbar('Tópico criado com sucesso.');
      }

      close();
    } catch (err) {
      showSnackbar(getErrorMessage(err, 'Erro ao salvar o tópico.'), 'error');
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

export type UseNoFormReturn = ReturnType<typeof useNoForm>;
