import type { IpcMainInvokeEvent } from 'electron'
import type { IpcContext, IpcMessage, IpcServiceConstructor, IpcServices } from './types'
import { ipcMain } from 'electron'
import { IPC_SERVICE_CHANNEL } from './constants'
import { ipcContextStorage } from './context'

export { useIpcContext } from './context'
export { IpcService } from './types'
export type { IpcContext, IpcMessage } from './types'

export function initializeIpcServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
  const services = createIpcServices(Services)

  ipcMain.handle(IPC_SERVICE_CHANNEL, async (event: IpcMainInvokeEvent, message: IpcMessage) => {
    const context: IpcContext = { sender: event.sender, event }

    return await ipcContextStorage.run(context, () => {
      // @ts-expect-error service/method should exist
      return services[message.service][message.method](...message.args)
    })
  })

  return services
}

function createIpcServices<T extends readonly IpcServiceConstructor[]>(Services: T): IpcServices<T> {
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
