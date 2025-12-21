import { createIpcServices, IpcService } from 'electron-ipc-service'

class ServiceA implements IpcService {
  namespace = 'a' as const
  foo() {
    return `${this.namespace} - foo`
  }

  async bar() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return `${this.namespace} - bar`
  }
}

class ServiceB extends IpcService {
  namespace = 'b' as const
  foo() {
    return `${this.namespace} - foo`
  }

  async bar() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return `${this.namespace} - bar`
  }
}

export const ipcServices = createIpcServices([ServiceA, ServiceB])

export type IpcServices = typeof ipcServices
