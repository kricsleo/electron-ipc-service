import type { IpcMainInvokeEvent } from 'electron'
import type { IpcServiceMessage } from './channel'
import type { IpcContext } from './context'
import { ipcMain } from 'electron'
import { IPC_SERVICE_CHANNEL } from './channel'
import { ipcContextStorage } from './context'

/* @__NO_SIDE_EFFECTS__ */
export abstract class IpcService {
  static readonly name: string
}

// Helper type for createServices return type
export type IpcServices<T extends readonly IpcServiceConstructor[]> = {
  [K in T[number] as K['name']]: InstanceType<K>
}

interface IpcServiceConstructor {
  new (): IpcService
  readonly name: string
}

export function createIpcServices<T extends IpcServiceConstructor[]>(Services: T): IpcServices<T> {
  const services = {} as any

  for (const Service of Services) {
    const service = new Service()
    const serviceName = Service.name
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
      return services[message.serviceName][message.methodName](...message.args)
    })
  })
}
