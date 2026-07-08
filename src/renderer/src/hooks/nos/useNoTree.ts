import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NoAprendizado } from '@shared/types/noAprendizado';
import { call } from '@/api/client';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { buildNoTree } from './buildNoTree';

export function useNoTree(aprendizadoId: string) {
  const { showSnackbar } = useSnackbar();
  const [nos, setNos] = useState<NoAprendizado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await call(() => window.api.nos.getByAprendizado(aprendizadoId));
    setNos(all);
  }, [aprendizadoId]);

  useEffect(() => {
    setIsLoading(true);
    refresh()
      .catch(() => showSnackbar('Erro ao carregar os tópicos.', 'error'))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aprendizadoId]);

  async function addNo(data: { parentId: string | null; titulo: string; anotacoes: string }) {
    const no = await call(() => window.api.nos.add({ aprendizadoId, ...data }));
    setNos((prev) => [...prev, no]);
    return no;
  }

  async function updateNo(
    id: string,
    data: Partial<Pick<NoAprendizado, 'titulo' | 'status' | 'anotacoes' | 'posX' | 'posY'>>,
  ) {
    const updated = await call(() => window.api.nos.update(id, data));
    setNos((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }

  function collectDescendantIds(id: string): string[] {
    const ids: string[] = [];
    const stack = [id];
    while (stack.length > 0) {
      const current = stack.pop() as string;
      for (const no of nos) {
        if (no.parentId === current) {
          ids.push(no.id);
          stack.push(no.id);
        }
      }
    }
    return ids;
  }

  async function deleteNo(id: string) {
    const descendantIds = collectDescendantIds(id);
    await call(() => window.api.nos.delete(id));
    const idsToRemove = new Set([id, ...descendantIds]);
    setNos((prev) => prev.filter((n) => !idsToRemove.has(n.id)));
  }

  const tree = useMemo(() => buildNoTree(nos), [nos]);

  return { nos, tree, isLoading, addNo, updateNo, deleteNo, refresh };
}
