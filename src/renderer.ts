import type { IpcMessage, IpcRendererClient, IpcServiceConstructor, IpcServices } from './types'
import { IPC_MAIN_SERVICE_CHANNEL, IPC_MAIN_SERVICE_FN, IPC_RENDERER_SERVICE_FN } from './constants'

export { IpcService } from './types'

export function createIpcRendererClient<T extends IpcServices<any>>(): IpcRendererClient<T> {
  // @ts-expect-error injected by preload script
  if (!window[IPC_MAIN_SERVICE_FN]) {
    throw new Error('IPC channel is not available. Make sure to call `initializeIpcPreload()` in the preload script.')
  }

  const serviceCache = new Map<string, unknown>()

  return new Proxy({} as any, {
    get(_, service: string) {
      let serviceProxy = serviceCache.get(service)

      if (!serviceProxy) {
        serviceProxy = new Proxy({}, {
          get: (_, method: string) => (...args: any[]) =>
            // @ts-expect-error injected by preload script
            window[IPC_MAIN_SERVICE_FN](
              IPC_MAIN_SERVICE_CHANNEL,
              { service, method, args } as IpcMessage,
            ),
        })
        serviceCache.set(service, serviceProxy)
      }

      return serviceProxy
    },
  })
}

export function initializeIpcRendererServices<T extends readonly IpcServiceConstructor[]>(
  Services: T,
): IpcServices<T> {
  const services = createIpcRendererServices(Services)

  // @ts-expect-error injected by preload script
  window[IPC_RENDERER_SERVICE_FN]((message: IpcMessage) => {
    // @ts-expect-error service/method should exist
    services[message.service][message.method](...message.args)
  })

  return services
}

function createIpcRendererServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
  const services = {} as any

  for (const Service of Services) {
    const service = new Service()
    if (!Service.namespace) {
      throw new Error(`IpcService namespace is required.`)
    }
    if (services[Service.namespace]) {
      throw new Error(`Found duplicate IpcService namespace: ${Service.namespace}`)
    }
    services[Service.namespace] = service
  }

  return services
}
