import type { IpcServiceClient, IpcServices } from './types'
import { IPC_SERVICE_CHANNEL } from './context'

export function createIpcClient<T extends IpcServices<any>>(): IpcServiceClient<T> {
  // @ts-expect-error injected by preload script
  if (!window.__electron_ipc_fn) {
    throw new Error('IPC channel is not available. Make sure to call `initializeIpcChannel()` first in the preload script.')
  }

  const serviceCache = new Map<string, unknown>()

  return new Proxy({} as any, {
    get(target, serviceName: string) {
      let service = serviceCache.get(serviceName)

      if (!service) {
        service = new Proxy({}, {
          get: (target, methodName: string) => (...args: any[]) =>
            // @ts-expect-error injected by preload script
            window.__electron_ipc_fn(
              IPC_SERVICE_CHANNEL,
              { serviceName, methodName, args },
            ),
        })
        serviceCache.set(serviceName, service)
      }

      return service
    },
  })
}
