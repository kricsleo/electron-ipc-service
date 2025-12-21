import type { IpcServices } from '../../../src/main/ipc.ts'
import { createIpcClient } from 'electron-ipc-fn'

export const ipc = createIpcClient<IpcServices>()
