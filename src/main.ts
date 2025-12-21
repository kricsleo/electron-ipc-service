import type { IpcMainInvokeEvent } from 'electron'
import type { IpcContext, IpcMessage, IpcServiceConstructor, IpcServices } from './types'
import { ipcMain } from 'electron'
import { IPC_SERVICE_CHANNEL } from './constants'
import { ipcContextStorage } from './context'

export { IpcService } from './types'

export function createIpcServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
  const services = {} as any

  for (const Service of Services) {
    const service = new Service()
    if (services[service.namespace]) {
      throw new Error(`Found duplicate services: ${service.namespace}`)
    }
    services[service.namespace] = service
  }

  return services
}

export function initializeIpcServices(services: IpcServices<any>): void {
  ipcMain.handle(IPC_SERVICE_CHANNEL, async (event: IpcMainInvokeEvent, message: IpcMessage) => {
    const context: IpcContext = { sender: event.sender, event }

    return await ipcContextStorage.run(context, () => {
      // @ts-expect-error - dynamic access
      return services[message.service][message.method](...message.args)
    })
  })
}
