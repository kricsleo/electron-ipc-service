import type { IpcMainContext } from './types'
import { AsyncLocalStorage } from 'node:async_hooks'

export const ipcMainContextStorage: AsyncLocalStorage<IpcMainContext> = /* @__PURE__ */ new AsyncLocalStorage()

export function useIpcMainContext(): IpcMainContext {
  const context = ipcMainContextStorage.getStore()
  if (!context) {
    throw new Error('IPC context is not available. Make sure this is called within an IPC service.')
  }
  return context
}
