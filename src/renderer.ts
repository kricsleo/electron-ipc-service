import type { IpcClient, IpcMessage, IpcServices } from './types'
import { IPC_SERVICE_CHANNEL, IPC_SERVICE_FN } from './constants'

export function createIpcClient<T extends IpcServices<any>>(): IpcClient<T> {
  // @ts-expect-error injected by preload script
  if (!window[IPC_SERVICE_FN]) {
    throw new Error('IPC channel is not available. Make sure to call `initializeIpcBridge()` first in the preload script.')
  }

  const serviceCache = new Map<string, unknown>()

  return new Proxy({} as any, {
    get(target, service: string) {
      let serviceProxy = serviceCache.get(service)

      if (!serviceProxy) {
        serviceProxy = new Proxy({}, {
          get: (target, method: string) => (...args: any[]) =>
            // @ts-expect-error injected by preload script
            window[IPC_SERVICE_FN](
              IPC_SERVICE_CHANNEL,
              { service, method, args } as IpcMessage,
            ),
        })
        serviceCache.set(service, serviceProxy)
      }

      return serviceProxy
    },
  })
}
