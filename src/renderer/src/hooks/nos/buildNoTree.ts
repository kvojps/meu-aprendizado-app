import type { NoAprendizado } from '@shared/types/noAprendizado';

export interface NoAprendizadoTree extends NoAprendizado {
  children: NoAprendizadoTree[];
}

export function buildNoTree(nos: NoAprendizado[]): NoAprendizadoTree[] {
  const nodesById = new Map<string, NoAprendizadoTree>();
  for (const no of nos) {
    nodesById.set(no.id, { ...no, children: [] });
  }

  const roots: NoAprendizadoTree[] = [];
  for (const no of nos) {
    const node = nodesById.get(no.id) as NoAprendizadoTree;
    if (no.parentId && nodesById.has(no.parentId)) {
      nodesById.get(no.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
