import type { Aprendizado } from './aprendizado';
import type { NoAprendizado } from './noAprendizado';

export interface BackupData {
  version: number;
  exportedAt: string;
  aprendizados: Aprendizado[];
  nos: NoAprendizado[];
}
