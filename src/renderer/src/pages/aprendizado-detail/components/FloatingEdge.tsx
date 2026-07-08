import { BaseEdge, type EdgeProps, getStraightPath, useInternalNode } from '@xyflow/react';
import { getEdgeParams } from './floatingEdgeUtils';

export function FloatingEdge({ id, source, target, style, markerEnd }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
  const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });

  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}
