import { app } from 'electron'
import { initializeIpcServices, IpcService, useIpcContext } from 'electron-ipc-service'

class AppService extends IpcService {
  static readonly namespace = 'app'

  getAppVersion() {
    return app.getVersion()
  }

  async search(input: string) {
    // Context is automatically injected via AsyncLocalStorage
    // Access it using useIpcContext() when needed
    const { sender } = useIpcContext()

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
  static readonly namespace = 'util'
  bar() {
    return `${UtilService.namespace} - bar`
  }
}

export function initialize() {
  return initializeIpcServices([AppService, UtilService])
}

export type IpcServices = ReturnType<typeof initialize>
