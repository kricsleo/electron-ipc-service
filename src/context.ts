import type { IpcContext } from './types'
import { AsyncLocalStorage } from 'node:async_hooks'

export const IPC_SERVICE_CHANNEL = '__ELECTRON_IPC_FN_SERVICE_CHANNEL__'

export const ipcContextStorage: AsyncLocalStorage<IpcContext> = /* @__PURE__ */ new AsyncLocalStorage()

export function useIpcContext(): IpcContext {
  const context = ipcContextStorage.getStore()
  if (!context) {
    throw new Error('IPC context is not available. Make sure this is called within an IPC service.')
  }
  return context
}
