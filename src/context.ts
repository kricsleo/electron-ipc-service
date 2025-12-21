import type { IpcMainInvokeEvent, WebContents } from 'electron'
import { AsyncLocalStorage } from 'node:async_hooks'

export interface IpcContext {
  sender: WebContents
  event: IpcMainInvokeEvent
}

export const ipcContextStorage: AsyncLocalStorage<IpcContext> = /* @__PURE__ */ new AsyncLocalStorage()

export function useIpcContext(): IpcContext {
  const context = ipcContextStorage.getStore()
  if (!context) {
    throw new Error('IPC context is not available. Make sure this is called within an IPC service.')
  }
  return context
}
