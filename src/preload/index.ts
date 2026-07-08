import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronApi } from '@shared/ipc/api';
import { IPC_CHANNELS } from '@shared/ipc/channels';
import type { NoAprendizado } from '@shared/types/noAprendizado';

const api: ElectronApi = {
  aprendizados: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.aprendizadosGetAll),
    add: (data: { titulo: string; descricao: string }) =>
      ipcRenderer.invoke(IPC_CHANNELS.aprendizadosAdd, data),
    update: (id: string, data: Partial<{ titulo: string; descricao: string }>) =>
      ipcRenderer.invoke(IPC_CHANNELS.aprendizadosUpdate, id, data),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.aprendizadosDelete, id),
  },
  nos: {
    getByAprendizado: (aprendizadoId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.nosGetByAprendizado, aprendizadoId),
    add: (data: {
      aprendizadoId: string;
      parentId: string | null;
      titulo: string;
      anotacoes: string;
    }) => ipcRenderer.invoke(IPC_CHANNELS.nosAdd, data),
    update: (
      id: string,
      data: Partial<Pick<NoAprendizado, 'titulo' | 'status' | 'anotacoes' | 'posX' | 'posY'>>,
    ) => ipcRenderer.invoke(IPC_CHANNELS.nosUpdate, id, data),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.nosDelete, id),
  },
  data: {
    export: () => ipcRenderer.invoke(IPC_CHANNELS.dataExport),
    import: () => ipcRenderer.invoke(IPC_CHANNELS.dataImport),
  },
};

contextBridge.exposeInMainWorld('api', api);
