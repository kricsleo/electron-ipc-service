import type { IpcServices } from '../../../src/main/ipc.ts'
import { createIpcClient } from 'electron-ipc-service/renderer'

export const ipc = createIpcClient<IpcServices>()
