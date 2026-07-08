import { Add, ArrowBack, EditOutlined } from '@mui/icons-material';
import { Box, Button, Card, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { Background, Controls, type Node, ReactFlow, useNodesState } from '@xyflow/react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { StatusNoAprendizado } from '@shared/types/noAprendizado';
import { getErrorMessage } from '@/api/client';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useAprendizadoForm } from '@/hooks/aprendizados/useAprendizadoForm';
import { useAprendizados } from '@/hooks/aprendizados/useAprendizados';
import { type NoGraphNodeData, layoutNoGraph } from '@/hooks/nos/layoutNoGraph';
import { useNoForm } from '@/hooks/nos/useNoForm';
import { useNoTree } from '@/hooks/nos/useNoTree';
import { ROUTES } from '../../routes';
import { AprendizadoFormDialog } from '../aprendizados/components/AprendizadoFormDialog';
import { FloatingEdge } from './components/FloatingEdge';
import { NoFormDialog } from './components/NoFormDialog';
import { type NoGraphActions, NoGraphNode } from './components/NoGraphNode';
import '@xyflow/react/dist/style.css';

type FlowNode = Node<NoGraphNodeData & { actions: NoGraphActions }>;

const nodeTypes = { noAprendizado: NoGraphNode };
const edgeTypes = { floating: FloatingEdge };

interface DeletingNo {
  id: string;
  titulo: string;
  hasChildren: boolean;
}

export function AprendizadoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const {
    isLoading: isLoadingAprendizados,
    getAprendizadoById,
    updateAprendizado,
    addAprendizado,
  } = useAprendizados();

  const aprendizado = id ? getAprendizadoById(id) : undefined;
  const aprendizadoFormController = useAprendizadoForm(addAprendizado, updateAprendizado);

  const { nos, tree, isLoading: isLoadingNos, addNo, updateNo, deleteNo } = useNoTree(id ?? '');
  const noFormController = useNoForm(addNo, updateNo);

  const [deleting, setDeleting] = useState<DeletingNo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { nodes: baseNodes, edges } = useMemo(() => layoutNoGraph(tree), [tree]);

  const actions = useMemo<NoGraphActions>(
    () => ({
      onAddChild: (parentId) => noFormController.openNew(parentId),
      onEdit: (nodeId) => {
        const found = nos.find((n) => n.id === nodeId);
        if (found) noFormController.openEdit(found);
      },
      onDelete: (nodeId) => {
        const found = nos.find((n) => n.id === nodeId);
        if (!found) return;
        setDeleting({
          id: found.id,
          titulo: found.titulo,
          hasChildren: nos.some((n) => n.parentId === nodeId),
        });
      },
      onStatusChange: (nodeId, status: StatusNoAprendizado) => updateNo(nodeId, { status }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nos],
  );

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<FlowNode>([]);

  useEffect(() => {
    setFlowNodes(baseNodes.map((node) => ({ ...node, data: { ...node.data, actions } })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseNodes, actions]);

  function handleNodeDragStop(_event: unknown, node: FlowNode) {
    updateNo(node.id, { posX: node.position.x, posY: node.position.y }).catch((err) => {
      showSnackbar(getErrorMessage(err, 'Erro ao salvar a posição do tópico.'), 'error');
    });
  }

  if (!id) {
    return <Navigate to={ROUTES.APRENDIZADOS} replace />;
  }

  if (isLoadingAprendizados) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!aprendizado) {
    return <Navigate to={ROUTES.APRENDIZADOS} replace />;
  }

  async function handleDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteNo(deleting.id);
      showSnackbar('Tópico excluído com sucesso.');
      setDeleting(null);
    } catch (err) {
      showSnackbar(getErrorMessage(err, 'Erro ao excluir o tópico.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <IconButton aria-label="Voltar" onClick={() => navigate(ROUTES.APRENDIZADOS)}>
          <ArrowBack />
        </IconButton>
        <Stack sx={{ flex: 1 }}>
          <Typography variant="h5">{aprendizado.titulo}</Typography>
          <Typography variant="body2" color="text.secondary">
            {aprendizado.descricao || 'Sem descrição'}
          </Typography>
        </Stack>
        <IconButton
          aria-label="Editar aprendizado"
          onClick={() => aprendizadoFormController.openEdit(aprendizado)}
        >
          <EditOutlined />
        </IconButton>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Árvore de tópicos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => noFormController.openNew(null)}
        >
          Adicionar tópico
        </Button>
      </Stack>

      {isLoadingNos ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : tree.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nenhum tópico cadastrado ainda. Clique em "Adicionar tópico" para começar a montar sua
            árvore de aprendizado.
          </Typography>
        </Card>
      ) : (
        <Box
          sx={{
            height: '65vh',
            minHeight: 420,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <ReactFlow
            nodes={flowNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onNodeDragStop={handleNodeDragStop}
            nodesConnectable={false}
            edgesFocusable={false}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>
        </Box>
      )}

      <AprendizadoFormDialog controller={aprendizadoFormController} />
      <NoFormDialog controller={noFormController} />

      <ConfirmDialog
        open={!!deleting}
        title="Excluir tópico"
        message={
          deleting?.hasChildren
            ? `Tem certeza que deseja excluir "${deleting.titulo}"? Todos os subtópicos também serão excluídos. Essa ação não pode ser desfeita.`
            : `Tem certeza que deseja excluir "${deleting?.titulo ?? ''}"? Essa ação não pode ser desfeita.`
        }
        loading={isDeleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}
