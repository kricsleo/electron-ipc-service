import { app } from 'electron'
import { createMainIpcClient, initializeIpcMainServices, IpcService, useIpcMainContext } from 'electron-ipc-service'
import type { RendererIpcServices } from '../renderer/src/ipc'

const rendererClient = createMainIpcClient<RendererIpcServices>()

class AppService extends IpcService {
  static override readonly namespace = 'app'

  getAppVersion() {
    return app.getVersion()
  }

  async search(input: string) {
    const { sender } = useIpcMainContext()

    const { promise, resolve } = Promise.withResolvers<Electron.Result | null>()
    let requestId = -1
    sender.once('found-in-page', (_, result) => {
      resolve(result.requestId === requestId ? result : null)
    })
    requestId = sender.findInPage(input)
    return promise
  }
}

class UtilService extends IpcService {
  static override readonly namespace = 'util'
  bar() {
    return `${UtilService.namespace} - bar`
  }
}

class NotifyService extends IpcService {
  static override readonly namespace = 'notify'

  broadcast(message: string) {
    rendererClient.ui.showToast(message)
    return 'pk'
  }
}

export function initialize() {
  const services = initializeIpcMainServices([AppService, UtilService, NotifyService])

  // Broadcast to all renderer windows after a short delay (demo)
  setTimeout(() => {
    rendererClient.ui.showToast('Hello from main process!')
  }, 3000)

  return services
}

export type IpcServices = ReturnType<typeof initialize>
