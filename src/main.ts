import type { IpcMainInvokeEvent } from 'electron'
import type { IpcContext, IpcServiceConstructor, IpcServiceMessage, IpcServices } from './types'
import { ipcMain } from 'electron'
import { IPC_SERVICE_CHANNEL, ipcContextStorage } from './context'

export function createIpcServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
  const services = {} as any

  for (const Service of Services) {
    const service = new Service()
    const serviceName = service.name
    if (services[serviceName]) {
      throw new Error(`Found duplicate services: ${serviceName}`)
    }
    services[serviceName] = service
  }

  return services
}

export function initializeIpcServices(services: IpcServices<any>): void {
  ipcMain.handle(IPC_SERVICE_CHANNEL, async (event: IpcMainInvokeEvent, message: IpcServiceMessage) => {
    const context: IpcContext = { sender: event.sender, event }

    return await ipcContextStorage.run(context, () => {
      // @ts-expect-error - dynamic access
      return services[message.serviceName][message.methodName](...message.args)
    })
  })
}
