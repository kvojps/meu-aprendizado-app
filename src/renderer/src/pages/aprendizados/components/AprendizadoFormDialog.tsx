import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import type { UseAprendizadoFormReturn } from '@/hooks/aprendizados/useAprendizadoForm';

interface AprendizadoFormDialogProps {
  controller: UseAprendizadoFormReturn;
}

export function AprendizadoFormDialog({ controller }: AprendizadoFormDialogProps) {
  const { isOpen, editingId, isSaving, form, close, onSubmit } = controller;
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onClose={() => !isSaving && close()} fullWidth maxWidth="sm">
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle>{editingId ? 'Editar aprendizado' : 'Novo aprendizado'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              fullWidth
              autoFocus
              {...register('titulo')}
              error={!!errors.titulo}
              helperText={errors.titulo?.message}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              minRows={3}
              {...register('descricao')}
              error={!!errors.descricao}
              helperText={errors.descricao?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
