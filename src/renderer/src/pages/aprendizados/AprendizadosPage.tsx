import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AprendizadoComProgresso } from '@shared/types/aprendizado';
import { getErrorMessage } from '@/api/client';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useAprendizadoForm } from '@/hooks/aprendizados/useAprendizadoForm';
import { useAprendizados } from '@/hooks/aprendizados/useAprendizados';
import { aprendizadoDetailPath } from '../../routes';
import { AprendizadoFormDialog } from './components/AprendizadoFormDialog';

function ProgressoAprendizado({ aprendizado }: { aprendizado: AprendizadoComProgresso }) {
  if (aprendizado.totalNos === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        Nenhum tópico ainda
      </Typography>
    );
  }

  const percentual = Math.round((aprendizado.nosConcluidos / aprendizado.totalNos) * 100);

  return (
    <Stack spacing={0.5}>
      <LinearProgress
        variant="determinate"
        value={percentual}
        sx={{ height: 6, borderRadius: 3 }}
      />
      <Typography variant="caption" color="text.secondary">
        {aprendizado.nosConcluidos}/{aprendizado.totalNos} tópicos concluídos
      </Typography>
    </Stack>
  );
}

export function AprendizadosPage() {
  const navigate = useNavigate();
  const { aprendizados, isLoading, addAprendizado, updateAprendizado, deleteAprendizado } =
    useAprendizados();
  const { showSnackbar } = useSnackbar();
  const formController = useAprendizadoForm(addAprendizado, updateAprendizado);

  const [deleting, setDeleting] = useState<AprendizadoComProgresso | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteAprendizado(deleting.id);
      showSnackbar('Aprendizado excluído com sucesso.');
      setDeleting(null);
    } catch (err) {
      showSnackbar(getErrorMessage(err, 'Erro ao excluir o aprendizado.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
          <Typography variant="h5">Aprendizados</Typography>
          <Typography variant="body2" color="text.secondary">
            Organize seus estudos em árvores de tópicos
          </Typography>
        </Stack>
        <Button variant="contained" startIcon={<Add />} onClick={formController.openNew}>
          Novo aprendizado
        </Button>
      </Stack>

      {isLoading ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : aprendizados.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nenhum aprendizado cadastrado ainda. Clique em "Novo aprendizado" para começar.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 2,
          }}
        >
          {aprendizados.map((aprendizado) => (
            <Card key={aprendizado.id} variant="outlined">
              <CardActionArea onClick={() => navigate(aprendizadoDetailPath(aprendizado.id))}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" noWrap>
                      {aprendizado.titulo}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.5em',
                      }}
                    >
                      {aprendizado.descricao || 'Sem descrição'}
                    </Typography>
                    <ProgressoAprendizado aprendizado={aprendizado} />
                  </Stack>
                </CardContent>
              </CardActionArea>
              <Stack direction="row" justifyContent="flex-end" sx={{ px: 1, pb: 1 }}>
                <IconButton
                  size="small"
                  aria-label="Editar aprendizado"
                  onClick={() => formController.openEdit(aprendizado)}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Excluir aprendizado"
                  color="error"
                  onClick={() => setDeleting(aprendizado)}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Box>
      )}

      <AprendizadoFormDialog controller={formController} />

      <ConfirmDialog
        open={!!deleting}
        title="Excluir aprendizado"
        message={`Tem certeza que deseja excluir "${deleting?.titulo ?? ''}"? Todos os tópicos dessa árvore também serão excluídos. Essa ação não pode ser desfeita.`}
        loading={isDeleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}
