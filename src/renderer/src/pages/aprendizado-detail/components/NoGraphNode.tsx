import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { Card, IconButton, Stack, Typography } from '@mui/material';
import { Handle, type NodeProps, Position } from '@xyflow/react';
import type { StatusNoAprendizado } from '@shared/types/noAprendizado';
import type { NoGraphNodeData } from '@/hooks/nos/layoutNoGraph';
import { StatusSelect } from './StatusSelect';

export interface NoGraphActions {
  onAddChild: (parentId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: StatusNoAprendizado) => void;
}

type NoGraphNodeProps = NodeProps & {
  data: NoGraphNodeData & { actions: NoGraphActions };
};

export function NoGraphNode({ data }: NoGraphNodeProps) {
  const { no, actions } = data;

  return (
    <Card variant="outlined" sx={{ width: 260, p: 1.25, cursor: 'grab' }}>
      <Handle type="target" position={Position.Top} id="target" style={{ visibility: 'hidden' }} />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ visibility: 'hidden' }}
      />

      <Stack spacing={0.75}>
        <Stack className="nodrag" direction="row" sx={{ cursor: 'default' }}>
          <StatusSelect
            status={no.status}
            onChange={(status) => actions.onStatusChange(no.id, status)}
          />
        </Stack>
        <Typography variant="body2" fontWeight={600} noWrap title={no.titulo}>
          {no.titulo}
        </Typography>
        {no.anotacoes ? (
          <Typography
            variant="caption"
            color="text.secondary"
            title={no.anotacoes}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {no.anotacoes}
          </Typography>
        ) : null}

        <Stack
          className="nodrag"
          direction="row"
          justifyContent="flex-end"
          sx={{ mt: 0.5, cursor: 'default' }}
        >
          <IconButton
            size="small"
            aria-label="Adicionar subtópico"
            onClick={() => actions.onAddChild(no.id)}
          >
            <Add fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="Editar tópico" onClick={() => actions.onEdit(no.id)}>
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Excluir tópico"
            color="error"
            onClick={() => actions.onDelete(no.id)}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
}
