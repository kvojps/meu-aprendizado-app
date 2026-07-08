import type { AprendizadoComProgresso } from '@shared/types/aprendizado';
import type { BackupData } from '@shared/types/backup';
import type { NoAprendizado } from '@shared/types/noAprendizado';

export type { BackupData };

export interface AprendizadosApi {
  getAll: () => Promise<AprendizadoComProgresso[]>;
  add: (data: { titulo: string; descricao: string }) => Promise<AprendizadoComProgresso>;
  update: (
    id: string,
    data: Partial<{ titulo: string; descricao: string }>,
  ) => Promise<AprendizadoComProgresso>;
  delete: (id: string) => Promise<void>;
}

export interface NosApi {
  getByAprendizado: (aprendizadoId: string) => Promise<NoAprendizado[]>;
  add: (data: {
    aprendizadoId: string;
    parentId: string | null;
    titulo: string;
    anotacoes: string;
  }) => Promise<NoAprendizado>;
  update: (
    id: string,
    data: Partial<Pick<NoAprendizado, 'titulo' | 'status' | 'anotacoes' | 'posX' | 'posY'>>,
  ) => Promise<NoAprendizado>;
  delete: (id: string) => Promise<void>;
}

export type ExportResult =
  { success: true; filePath: string } | { success: false; error: 'canceled' };

export type ImportResult =
  | { success: true }
  | {
      success: false;
      error: 'canceled' | 'read-failed' | 'invalid-json' | 'invalid-format';
    };

export interface DataApi {
  export: () => Promise<ExportResult>;
  import: () => Promise<ImportResult>;
}

export interface ElectronApi {
  aprendizados: AprendizadosApi;
  nos: NosApi;
  data: DataApi;
}
