import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import type { NoAprendizado } from '@shared/types/noAprendizado';
import type { NoAprendizadoTree } from './buildNoTree';

export const NODE_WIDTH = 260;
export const NODE_HEIGHT = 104;

export interface NoGraphNodeData extends Record<string, unknown> {
  no: NoAprendizado;
  hasChildren: boolean;
}

export function layoutNoGraph(roots: NoAprendizadoTree[]): {
  nodes: Node<NoGraphNodeData>[];
  edges: Edge[];
} {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'TB', nodesep: 32, ranksep: 64 });

  const nodes: Node<NoGraphNodeData>[] = [];
  const edges: Edge[] = [];

  function visit(no: NoAprendizadoTree, parentId: string | null) {
    graph.setNode(no.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    nodes.push({
      id: no.id,
      type: 'noAprendizado',
      position: { x: 0, y: 0 },
      data: { no, hasChildren: no.children.length > 0 },
    });

    if (parentId) {
      graph.setEdge(parentId, no.id);
      edges.push({
        id: `${parentId}->${no.id}`,
        source: parentId,
        target: no.id,
        sourceHandle: 'source',
        targetHandle: 'target',
        type: 'floating',
      });
    }

    for (const child of no.children) {
      visit(child, no.id);
    }
  }

  for (const root of roots) {
    visit(root, null);
  }

  dagre.layout(graph);

  for (const node of nodes) {
    const { posX, posY } = node.data.no;
    if (posX != null && posY != null) {
      node.position = { x: posX, y: posY };
      continue;
    }
    const pos = graph.node(node.id);
    node.position = { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 };
  }

  return { nodes, edges };
}
