import { FileDownloadOutlined, FileUploadOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useDataTransfer } from '@/hooks/settings/useDataTransfer';

const APP_VERSION = '1.0.0';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

export function SettingsPage() {
  const {
    exporting,
    importing,
    confirmOpen,
    handleExport,
    requestImport,
    cancelImport,
    confirmImport,
  } = useDataTransfer();

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography variant="h5">Configurações</Typography>
        <Typography variant="body2" color="text.secondary">
          Informações do aplicativo
        </Typography>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Sobre
          </Typography>
          <Stack spacing={1}>
            <InfoRow label="Aplicativo" value="Meu Aprendizado" />
            <InfoRow label="Versão" value={APP_VERSION} />
            <InfoRow
              label="Finalidade"
              value="Organize seus aprendizados em árvores de tópicos, acompanhando o status e anotações de cada um"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Exportar e Importar Dados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Exporte todos os seus aprendizados e árvores de tópicos para um arquivo de backup em
            JSON, ou importe um arquivo existente para restaurar os dados.
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<FileDownloadOutlined fontSize="small" />}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? 'Exportando...' : 'Exportar Dados'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileUploadOutlined fontSize="small" />}
              onClick={requestImport}
              disabled={importing}
            >
              {importing ? 'Importando...' : 'Importar Dados'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Importar dados"
        message="Importar um arquivo de backup substituirá todos os dados atuais. Essa ação não pode ser desfeita. Deseja continuar?"
        confirmLabel="Importar"
        onClose={cancelImport}
        onConfirm={confirmImport}
      />
    </Stack>
  );
}
