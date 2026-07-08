import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { statusNoOptions } from '@/hooks/nos/noSchema';
import type { UseNoFormReturn } from '@/hooks/nos/useNoForm';

interface NoFormDialogProps {
  controller: UseNoFormReturn;
}

export function NoFormDialog({ controller }: NoFormDialogProps) {
  const { isOpen, editingId, isSaving, form, close, onSubmit } = controller;
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onClose={() => !isSaving && close()} fullWidth maxWidth="sm">
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle>{editingId ? 'Editar tópico' : 'Novo tópico'}</DialogTitle>
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
            {editingId ? (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField label="Status" select fullWidth {...field}>
                    {statusNoOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            ) : null}
            <TextField
              label="Anotações"
              fullWidth
              multiline
              minRows={3}
              placeholder="Anotações breves sobre este tópico (opcional)"
              {...register('anotacoes')}
              error={!!errors.anotacoes}
              helperText={errors.anotacoes?.message}
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
