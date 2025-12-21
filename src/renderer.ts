import type { IpcServices } from './main'
import { IPC_SERVICE_CHANNEL } from './channel'

export function createIpcClient<T extends IpcServices<any>>(): T {
  // @ts-expect-error injected by preload script
  if (!window.__electron_ipc_fn) {
    throw new Error('IPC channel is not available. Make sure to call `initializeIpcChannel()` first in the preload script.')
  }

  const serviceCache = new Map<string, unknown>()

  return new Proxy({} as T, {
    get(target, serviceName: string) {
      let service = serviceCache.get(serviceName)

      if (!service) {
        service = new Proxy({}, {
          get(_, methodName: string) {
            return (...args: any[]) => {
              // @ts-expect-error injected by preload script
              return window.__electron_ipc_fn(IPC_SERVICE_CHANNEL, { serviceName, methodName, args })
            }
          },
        })
        serviceCache.set(serviceName, service)
      }

      return service
    },
  })
}

// Extract method signatures from service class
export type ExtractServiceMethods<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never]: T[K] extends (...args: infer Args) => infer Output
    ? Args extends []
      ? () => AlwaysPromise<Output>
      : Args extends [infer Input]
        ? (input: Input) => AlwaysPromise<Output>
        : (...args: Args) => AlwaysPromise<Output>
    : never
}

type AlwaysPromise<T> = Promise<Awaited<T>>

// TypeScript utility type to automatically merge IPC services
// This version works with both the old object format and new createServices format
export type MergeIpcService<T> = {
  [K in keyof T]: T[K] extends new (...args: any[]) => infer Instance
    ? ExtractServiceMethods<Instance>
    : T[K] extends infer Instance
      ? ExtractServiceMethods<Instance>
      : never
}
