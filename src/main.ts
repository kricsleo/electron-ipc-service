import type { IpcMainInvokeEvent } from 'electron'
import type {
  IpcMainClient,
  IpcMainContext,
  IpcMessage,
  IpcServiceConstructor,
  IpcServices,
} from './types'
import { BrowserWindow, ipcMain } from 'electron'
import { IPC_MAIN_SERVICE_CHANNEL, IPC_RENDERER_SERVICE_CHANNEL } from './constants'
import { ipcMainContextStorage } from './context'

export { useIpcMainContext } from './context'
export * from './types'

export function initializeIpcMainServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
  const services = createIpcMainServices(Services)

  ipcMain.handle(IPC_MAIN_SERVICE_CHANNEL, async (event: IpcMainInvokeEvent, message: IpcMessage) => {
    const context: IpcMainContext = { sender: event.sender, event }

    return await ipcMainContextStorage.run(context, () => {
      // @ts-expect-error service/method should exist
      return services[message.service][message.method](...message.args)
    })
  })

  return services
}

function createIpcMainServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
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

export function createIpcMainClient<T extends IpcServices<any>>(): IpcMainClient<T> {
  const serviceCache = new Map<string, unknown>()

  return new Proxy({} as any, {
    get(_, service: string) {
      let serviceProxy = serviceCache.get(service)
      if (!serviceProxy) {
        serviceProxy = new Proxy({}, {
          get: (_, method: string) => (...args: any[]) => {
            const message: IpcMessage = { service, method, args }
            for (const win of BrowserWindow.getAllWindows()) {
              win.webContents.send(IPC_RENDERER_SERVICE_CHANNEL, message)
            }
          },
        })
        serviceCache.set(service, serviceProxy)
      }
      return serviceProxy
    },
  })
}
