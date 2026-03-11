import type { IpcMessage } from './types'
import { contextBridge, ipcRenderer } from 'electron'
import { IPC_MAIN_SERVICE_FN, IPC_RENDERER_SERVICE_CHANNEL, IPC_RENDERER_SERVICE_FN } from './constants'

export function initializeIpcPreload(): void {
  // eslint-disable-next-line node/prefer-global/process
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(IPC_MAIN_SERVICE_FN, ipcMainPreload)
    contextBridge.exposeInMainWorld(IPC_RENDERER_SERVICE_FN, ipcRendererPreload)
  } else {
    // @ts-expect-error window should exist in preload scripts.
    window[IPC_MAIN_SERVICE_FN] = ipcMainPreload
    // @ts-expect-error window should exist in preload scripts.
    window[IPC_RENDERER_SERVICE_FN] = ipcRendererPreload
  }
}

function ipcMainPreload(channel: string, message: IpcMessage) {
  return ipcRenderer.invoke(channel, message)
}

function ipcRendererPreload(callback: (message: IpcMessage) => void) {
  ipcRenderer.on(IPC_RENDERER_SERVICE_CHANNEL, (_event, message: IpcMessage) => {
    callback(message)
  })
}
