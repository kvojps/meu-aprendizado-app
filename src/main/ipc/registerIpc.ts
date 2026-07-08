import type Database from 'better-sqlite3';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc/channels';
import {
  addAprendizado,
  deleteAprendizado,
  getAllAprendizados,
  updateAprendizado,
} from '../db/aprendizadosRepository';
import { addNo, deleteNo, getNosByAprendizadoId, updateNo } from '../db/nosAprendizadoRepository';
import { createAprendizadoSchema, updateAprendizadoSchema } from '../schemas/aprendizados.schema';
import { createNoSchema, updateNoSchema } from '../schemas/nosAprendizado.schema';
import { parseId } from '../utils/parseId';
import { parseOrThrow } from '../utils/validate';
import { registerBackupHandlers } from './backupHandlers';

export function registerIpcHandlers(db: Database.Database): void {
  registerBackupHandlers(db);

  ipcMain.handle(IPC_CHANNELS.aprendizadosGetAll, () => getAllAprendizados(db));
  ipcMain.handle(IPC_CHANNELS.aprendizadosAdd, (_event, data: unknown) =>
    addAprendizado(db, parseOrThrow(createAprendizadoSchema, data)),
  );
  ipcMain.handle(IPC_CHANNELS.aprendizadosUpdate, (_event, id: unknown, data: unknown) =>
    updateAprendizado(db, parseId(id), parseOrThrow(updateAprendizadoSchema, data)),
  );
  ipcMain.handle(IPC_CHANNELS.aprendizadosDelete, (_event, id: unknown) =>
    deleteAprendizado(db, parseId(id)),
  );

  ipcMain.handle(IPC_CHANNELS.nosGetByAprendizado, (_event, aprendizadoId: unknown) =>
    getNosByAprendizadoId(db, parseId(aprendizadoId)),
  );
  ipcMain.handle(IPC_CHANNELS.nosAdd, (_event, data: unknown) =>
    addNo(db, parseOrThrow(createNoSchema, data)),
  );
  ipcMain.handle(IPC_CHANNELS.nosUpdate, (_event, id: unknown, data: unknown) =>
    updateNo(db, parseId(id), parseOrThrow(updateNoSchema, data)),
  );
  ipcMain.handle(IPC_CHANNELS.nosDelete, (_event, id: unknown) => deleteNo(db, parseId(id)));
}
