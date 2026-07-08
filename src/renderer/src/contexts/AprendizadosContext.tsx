import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AprendizadoComProgresso } from '@shared/types/aprendizado';
import { call } from '@/api/client';
import { useSnackbar } from './SnackbarContext';

export interface AprendizadosContextValue {
  aprendizados: AprendizadoComProgresso[];
  isLoading: boolean;
  addAprendizado: (data: { titulo: string; descricao: string }) => Promise<AprendizadoComProgresso>;
  updateAprendizado: (
    id: string,
    data: Partial<{ titulo: string; descricao: string }>,
  ) => Promise<void>;
  deleteAprendizado: (id: string) => Promise<void>;
  getAprendizadoById: (id: string) => AprendizadoComProgresso | undefined;
  refreshAprendizados: () => Promise<void>;
}

const AprendizadosContext = createContext<AprendizadosContextValue | null>(null);

export function AprendizadosProvider({ children }: { children: ReactNode }) {
  const { showSnackbar } = useSnackbar();
  const [aprendizados, setAprendizados] = useState<AprendizadoComProgresso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshAprendizados() {
    const all = await call(() => window.api.aprendizados.getAll());
    setAprendizados(all);
  }

  useEffect(() => {
    refreshAprendizados()
      .catch(() => showSnackbar('Erro ao carregar os aprendizados.', 'error'))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addAprendizado(data: { titulo: string; descricao: string }) {
    const aprendizado = await call(() => window.api.aprendizados.add(data));
    setAprendizados((prev) => [...prev, aprendizado]);
    return aprendizado;
  }

  async function updateAprendizado(
    id: string,
    data: Partial<{ titulo: string; descricao: string }>,
  ) {
    const updated = await call(() => window.api.aprendizados.update(id, data));
    setAprendizados((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function deleteAprendizado(id: string) {
    await call(() => window.api.aprendizados.delete(id));
    setAprendizados((prev) => prev.filter((a) => a.id !== id));
  }

  function getAprendizadoById(id: string) {
    return aprendizados.find((a) => a.id === id);
  }

  const value = useMemo<AprendizadosContextValue>(
    () => ({
      aprendizados,
      isLoading,
      addAprendizado,
      updateAprendizado,
      deleteAprendizado,
      getAprendizadoById,
      refreshAprendizados,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [aprendizados, isLoading],
  );

  return <AprendizadosContext.Provider value={value}>{children}</AprendizadosContext.Provider>;
}

export function useAprendizadosContext(): AprendizadosContextValue {
  const ctx = useContext(AprendizadosContext);
  if (!ctx) {
    throw new Error('useAprendizadosContext must be used within an AprendizadosProvider');
  }
  return ctx;
}
