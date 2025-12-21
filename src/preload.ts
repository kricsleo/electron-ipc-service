import type { IpcServiceMessage } from './types'
// import { contextBridge, ipcRenderer } from 'electron'
const { contextBridge, ipcRenderer } = require('electron')

export function initializeIpcBridge(): void {
  // @ts-expect-error ignore usage of process in preload
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
