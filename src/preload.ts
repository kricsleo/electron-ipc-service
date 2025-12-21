import type { IpcMessage } from './types'
import { contextBridge, ipcRenderer } from 'electron'
import { IPC_SERVICE_FN } from './constants'

export function initializeIpcBridge(): void {
  // eslint-disable-next-line node/prefer-global/process
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(IPC_SERVICE_FN, electronIpcFn)
  } else {
    // @ts-expect-error window should exist in preload scripts.
    window[IPC_SERVICE_FN] = electronIpcFn
  }
}

function electronIpcFn(channel: string, message: IpcMessage) {
  return ipcRenderer.invoke(channel, message)
}
