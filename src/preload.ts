import type { IpcServiceMessage } from './channel'
import { contextBridge, ipcRenderer } from 'electron'

export function initializeIpcChannel(): void {
  // eslint-disable-next-line node/prefer-global/process
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('__electron_ipc_fn', electronIpcFn)
  } else {
    // @ts-expect-error window should exist in preload scripts.
    window.__electron_ipc_fn = electronIpcFn
  }
}

function electronIpcFn(channel: string, message: IpcServiceMessage) {
  return ipcRenderer.invoke(channel, message)
}
